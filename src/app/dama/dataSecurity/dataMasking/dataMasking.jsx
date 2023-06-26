import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Form, Input, InputNumber, message, Modal, Radio, Select, Switch } from 'antd'
import { delDesensitizerule, desensitizerule, saveDesensitizerule, toggleRuleStatus } from 'app_api/dataSecurity'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import DataMaskDetailDrawer from './dataMaskDetailDrawer'
import Request from '@/api/request'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'

import { Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
const { Dragger } = Upload

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}

export default class DataMasking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnLoading: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            idList: this.props.location.state.id ? [this.props.location.state.id] : [],
            modalVisible: false,
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
            switchLoading: false,

            importVisible: false,
            fileList: [],
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '脱敏算法',
                dataIndex: 'way',
                key: 'way',
                width: 90,
                render: (text, record) => (text ? <span>{text == 1 ? 'MD5' : text == 2 ? '内容掩盖' : '--'}</span> : <EmptyLabel />),
            },
            {
                title: '脱敏策略',
                dataIndex: 'strategy',
                key: 'strategy',
                width: 140,
                render: (text, record) =>
                    text ? <span>{text == 1 ? '中间文字脱敏' : text == 2 ? '首尾文字脱敏' : text == 3 ? '所有文字全部脱敏' : text == 4 ? '自定义' : '--'}</span> : <EmptyLabel />,
            },
            {
                title: '应用字段',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: 90,
                render: (text, record) => <span>{text}</span>,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => {
                    let { switchLoading } = this.state
                    return (
                        <div>
                            {text == 1 ? (
                                <Switch
                                    loading={switchLoading}
                                    checkedChildren='开启'
                                    unCheckedChildren='禁用'
                                    disabled={!PermissionManage.hasFuncPermission('/dt_securtiy/data_masking/switch')}
                                    style={{ height: '22px' }}
                                    onChange={this.statusChange.bind(this, index)}
                                    checked={true}
                                />
                            ) : (
                                <Tooltip title='禁用后，在设置敏感标签时不可见'>
                                    <Switch
                                        loading={switchLoading}
                                        checkedChildren='开启'
                                        unCheckedChildren='禁用'
                                        style={{ height: '22px' }}
                                        onChange={this.statusChange.bind(this, index)}
                                        checked={false}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
        ]
    }
    getDetail = (data) => {
        this.props.addTab('EAST报表详情', data)
    }
    statusChange = async (index, e) => {
        let { tableData } = this.state
        let query = {
            id: tableData[index].id,
            status: e ? 1 : 2,
        }
        this.setState({ switchLoading: true })
        let res = await toggleRuleStatus(query)
        this.setState({ switchLoading: false })
        if (res.code == 200) {
            tableData[index].status = query.status
            this.setState({ tableData })
        }
    }
    deleteRule = (data) => {
        if (data.columnCount) {
            message.info('有敏感标签使用中，不能删除')
            return
        }
        let that = this
        confirm({
            title: '你确定要删除该规则吗？',
            content: '规则删除后不可恢复',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                delDesensitizerule({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.search()
                    } else {
                        message.error('删除失败')
                    }
                })
            },
        })
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openEditModal = (data, type) => {
        let { ruleInfo } = this.state
        ruleInfo = { ...data }
        ruleInfo.way = ruleInfo.way ? ruleInfo.way : 1
        ruleInfo.strategy = ruleInfo.strategy ? ruleInfo.strategy : undefined
        if (type == 'look') {
            this.dataMaskDetailDrawer && this.dataMaskDetailDrawer.openModal(ruleInfo)
        } else {
            this.setState({
                modalVisible: true,
                ruleInfo,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
            idList: this.state.idList,
        }
        let res = await desensitizerule(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openAddModal = () => {
        let { ruleInfo } = this.state
        ruleInfo = { way: 1, headPosition: 0, tailPosition: 0 }
        this.setState({
            modalVisible: true,
            ruleInfo,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    handleInputChange = (name, e) => {
        let { ruleInfo } = this.state
        ruleInfo[name] = e.target.value
        if (name == 'way') {
            ruleInfo.maskContent = ruleInfo.way == 1 ? '' : ruleInfo.maskContent
        }
        this.setState({
            ruleInfo,
        })
    }
    changeSelect = (name, e) => {
        let { ruleInfo } = this.state
        ruleInfo[name] = e
        this.setState({
            ruleInfo,
        })
    }
    postData = async () => {
        const { ruleInfo } = this.state
        if (!ruleInfo.name || !ruleInfo.strategy) {
            message.info('请填写完整信息')
            return
        }
        if (ruleInfo.way == 2 && !ruleInfo.maskContent) {
            message.info('请填写掩盖内容')
            return
        }
        this.setState({ btnLoading: true })
        let res = await saveDesensitizerule(ruleInfo)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.search()
        }
    }

    importFile = () => {
        console.log('importFile')
        this.setState({
            importVisible: true,
        })
    }

    exportFile = async () => {
        const res = await Request.httpPostDownload('/quantchiAPI/api/girm/port/export/desensitizeRule', {}).then((res) => {
            console.log('下载中')
        })
        message.info('系统准备下载')
    }

    cancelFile = () => {
        this.setState({
            importVisible: false,
        })
    }
    uploadChange = (info) => {
        const { fileList } = this.state
        const { status, originFileObj } = info.file
        console.log('info', info)

        if (status === 'done') {
            fileList.length = 0
            fileList.push(originFileObj)
        }
        if (status === 'removed') {
            fileList.length = 0
        }
        this.setState({ fileList })
    }
    uploadRequest = (params) => {
        const { file, onSuccess, onError } = params || {}
        onSuccess({ file })
    }

    confirmDownload = () => {
        const that = this
        const { fileList } = this.state
        console.log('fileList', fileList)
        if (fileList.length <= 0) {
            return message.warning('请先上传文件')
        }
        const Fd = new FormData()
        Fd.append('file', fileList[0])
        Request.post('/quantchiAPI/api/girm/port/import/desensitizeRule', Fd).then((res) => {
            message.success('上传成功')
            that.setState({
                importVisible: false,
            })
        })
    }

    render() {
        const { tableData, queryInfo, btnLoading, modalVisible, ruleInfo, importVisible } = this.state
        return (
            <React.Fragment>
                <div className='dataMasking'>
                    <RichTableLayout
                        title='脱敏规则'
                        renderHeaderExtra={() => {
                            return (
                                <React.Fragment>
                                    <PermissionWrap funcCode='/dt_securtiy/data_masking/import'>
                                        <Button onClick={this.importFile} type='primary'>
                                            导入
                                        </Button>
                                    </PermissionWrap>
                                    <PermissionWrap funcCode='/dt_securtiy/data_masking/export'>
                                        <Button onClick={this.exportFile} type='primary'>
                                            导出
                                        </Button>
                                    </PermissionWrap>
                                    <PermissionWrap funcCode='/dt_securtiy/data_masking/add'>
                                        <Button type='primary' onClick={this.openAddModal}>
                                            新增脱敏规则
                                        </Button>
                                    </PermissionWrap>
                                </React.Fragment>
                            )
                        }}
                        editColumnProps={{
                            width: 160,
                            createEditColumnElements: (_, record) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '详情',
                                        onClick: this.openEditModal.bind(this, record, 'look'),
                                    },
                                    {
                                        label: '编辑',
                                        onClick: this.openEditModal.bind(this, record, 'edit'),
                                        funcCode: '/dt_securtiy/data_masking/edit',
                                    },
                                    {
                                        label: '删除',
                                        onClick: this.deleteRule.bind(this, record),
                                        funcCode: '/dt_securtiy/data_masking/delete',
                                    },
                                ])
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入规则名称' />
                                    <Select onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='状态' style={{ width: '160px' }}>
                                        <Option value={1} key={1}>
                                            开启
                                        </Option>
                                        <Option value={2} key={2}>
                                            禁用
                                        </Option>
                                    </Select>
                                    <Select onChange={this.changeStatus.bind(this, 'strategy')} value={queryInfo.strategy} placeholder='脱敏策略' style={{ width: '160px' }}>
                                        <Option value={1} key={1}>
                                            中间文字脱敏
                                        </Option>
                                        <Option value={2} key={2}>
                                            首尾文字脱敏
                                        </Option>
                                        <Option value={3} key={3}>
                                            所有文字全部脱敏
                                        </Option>
                                        <Option value={4} key={4}>
                                            自定义
                                        </Option>
                                    </Select>
                                    <Select onChange={this.changeStatus.bind(this, 'way')} value={queryInfo.way} placeholder='脱敏算法' style={{ width: '160px' }}>
                                        <Option value={1} key={1}>
                                            MD5
                                        </Option>
                                        <Option value={2} key={2}>
                                            内容掩盖
                                        </Option>
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        title: '设置脱敏规则',
                        className: 'addDataMaskDrawer',
                        width: 480,
                        visible: modalVisible,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                    确定
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible && (
                        <React.Fragment>
                            <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24, paddingBottom: 30 }} className='EditMiniForm ruleForm'>
                                <Form.Item required label='规则名称' {...tailFormItemLayout}>
                                    <Input
                                        placeholder='请输入'
                                        maxLength={16}
                                        value={ruleInfo.name}
                                        onChange={this.handleInputChange.bind(this, 'name')}
                                        suffix={<span style={{ color: '#C4C8CC' }}>{ruleInfo.name ? ruleInfo.name.length : 0}/16</span>}
                                    />
                                </Form.Item>
                                <Form.Item label='规则描述' {...tailFormItemLayout}>
                                    <div style={{ position: 'relative' }}>
                                        <TextArea maxLength={64} value={ruleInfo.description} placeholder='请输入' rows={2} onChange={this.handleInputChange.bind(this, 'description')} />
                                        <span style={{ position: 'absolute', lineHeight: 1, bottom: 12, right: 12, color: '#C4C8CC' }}>
                                            {ruleInfo.description ? ruleInfo.description.length : 0}/64
                                        </span>
                                    </div>
                                </Form.Item>
                                <Form.Item required label='脱敏算法' {...tailFormItemLayout}>
                                    <RadioGroup value={ruleInfo.way} onChange={this.handleInputChange.bind(this, 'way')}>
                                        <Radio value={1}>MD5</Radio>
                                        <Radio value={2}>内容掩盖</Radio>
                                    </RadioGroup>
                                    {ruleInfo.way == 2 ? (
                                        <Input
                                            style={{ marginTop: 16 }}
                                            disabled={ruleInfo.way == 1}
                                            maxLength={20}
                                            value={ruleInfo.maskContent}
                                            onChange={this.handleInputChange.bind(this, 'maskContent')}
                                            placeholder='请输入掩盖内容，如 *、# 等'
                                        />
                                    ) : null}
                                </Form.Item>
                                <Form.Item required label='脱敏策略' {...tailFormItemLayout}>
                                    <Select onChange={this.changeSelect.bind(this, 'strategy')} value={ruleInfo.strategy} placeholder='请选择'>
                                        <Option value={1} key={1}>
                                            中间文字脱敏
                                        </Option>
                                        <Option value={2} key={2}>
                                            首尾文字脱敏
                                        </Option>
                                        <Option value={3} key={3}>
                                            所有文字全部脱敏
                                        </Option>
                                        <Option value={4} key={4}>
                                            自定义
                                        </Option>
                                    </Select>
                                </Form.Item>
                                {ruleInfo.strategy == 4 ? (
                                    <Form.Item label='正则表达式' {...tailFormItemLayout}>
                                        <Input value={ruleInfo.expression} onChange={this.handleInputChange.bind(this, 'expression')} placeholder='请输入正则表达式' />
                                    </Form.Item>
                                ) : null}
                                {ruleInfo.strategy == 1 || ruleInfo.strategy == 2 ? (
                                    <Form.Item label='头部 M' {...tailFormItemLayout}>
                                        <InputNumber
                                            precision={0}
                                            style={{ width: 360 }}
                                            onChange={this.changeSelect.bind(this, 'headPosition')}
                                            value={ruleInfo.headPosition}
                                            min={0}
                                            defaultValue={0}
                                        />
                                        <span style={{ marginLeft: 10 }}>{ruleInfo.strategy == 1 ? '不脱敏' : '脱敏'}</span>
                                    </Form.Item>
                                ) : null}
                                {ruleInfo.strategy == 1 || ruleInfo.strategy == 2 ? (
                                    <Form.Item label='尾部 N' {...tailFormItemLayout}>
                                        <InputNumber
                                            precision={0}
                                            style={{ width: 360 }}
                                            onChange={this.changeSelect.bind(this, 'tailPosition')}
                                            value={ruleInfo.tailPosition}
                                            min={0}
                                            defaultValue={0}
                                        />
                                        <span style={{ marginLeft: 10 }}>{ruleInfo.strategy == 1 ? '不脱敏' : '脱敏'}</span>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <DataMaskDetailDrawer ref={(dom) => (this.dataMaskDetailDrawer = dom)} />
                <DrawerLayout
                    drawerProps={{
                        title: '导入',
                        width: 480,
                        visible: importVisible,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button onClick={this.confirmDownload} type='primary'>
                                    确定
                                </Button>
                                <Button onClick={this.cancelFile}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <div style={{ height: 200 }}>
                        <Upload.Dragger onChange={this.uploadChange} customRequest={this.uploadRequest} maxCount={1} accept='.xlsx'>
                            <p className='ant-upload-drag-icon'>
                                <UploadOutlined />
                            </p>
                            <p className='ant-upload-text'>点击或拖拽文件到此处上传</p>
                        </Upload.Dragger>
                    </div>
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
