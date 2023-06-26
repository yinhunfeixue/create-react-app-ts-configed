import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Input, message, Modal, Select, Spin, Tooltip } from 'antd'
import { Form } from '@ant-design/compatible'
import {
    databaseFilter,
    delDesensitiseTagColumn,
    desensitiseTagColumnPreview,
    desensitiseTagColumns,
    desensitiseTagDetail,
    desensitizerule,
    saveDesensitiseTagColumns,
    systemFilter,
} from 'app_api/dataSecurity'
import React, { Component } from 'react'
import DataMaskDetailDrawer from '../dataMasking/dataMaskDetailDrawer'
import '../index.less'
import AddMapColumnDrawer from './addMapColumnDrawer'
import PermissionManage from '@/utils/PermissionManage'

const confirm = Modal.confirm

export default class MapColumnDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {},
            taskDetail: {
                ruleList: [],
            },
            tableData: [],
            ruleOptionList: [],
            showInput: false,
            originData: {},
            previewModalVisible: false,
            previewInfo: {},
            previewLoading: false,
            previewList: [],
            systemFilterList: [],
            databaseList: [],
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'physicalField',
                key: 'physicalField',
                width: 240,
                render: (text, record) => (
                    <Tooltip
                        placement='topLeft'
                        title={
                            <span>
                                {text}
                                <br />
                                {record.physicalTable}
                            </span>
                        }
                    >
                        <div className='tableLabel'>
                            <div>{text}</div>
                            <div style={{ color: '#9EA3A8' }}>{record.physicalTable}</div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: '字段中文名',
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '系统路径',
                dataIndex: 'systemPath',
                key: 'systemPath',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '脱敏规则',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 300,
                render: (text, record, index) => {
                    if (record.isEdit == true) {
                        return (
                            <div className='ruleNameEdit'>
                                <Select onChange={this.changeRule.bind(this, index)} value={record.ruleId} placeholder='请选择' style={{ width: 190 }}>
                                    {this.state.ruleOptionList.map((item) => {
                                        return (
                                            <Select.Option title={item.name} key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                                <div className='editBtn'>
                                    <a onClick={this.postEdit.bind(this, index)}>确定</a>
                                    <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    <a onClick={this.cancelEdit.bind(this, index)}>取消</a>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className='ruleNameEdit'>
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='ellipsisLabel'>{text}</span>
                                </Tooltip>
                                <div onClick={this.openEdit.bind(this, index)} className='iconfont icon-bianjifill'></div>
                            </div>
                        )
                    }
                },
            },
        ]
    }
    componentWillMount = async () => {
        this.getDesensitiseTagDetail(this.dataId)
        this.getSystemFilter()
        this.getDatabaseFilter()
    }
    get dataId() {
        const params = ProjectUtil.getPageParam(this.props)
        return params.id
    }
    getDesensitiseTagDetail = async (id) => {
        let res = await desensitiseTagDetail({ id })
        if (res.code == 200) {
            this.setState({
                taskDetail: res.data,
                ruleOptionList: res.data.ruleList,
            })
        }
    }
    getSystemFilter = async () => {
        let res = await systemFilter({ id: this.dataId })
        if (res.code == 200) {
            this.setState({
                systemFilterList: res.data,
            })
        }
    }
    getDatabaseFilter = async () => {
        let res = await databaseFilter({ id: this.dataId })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {}
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reload = () => {
        this.search()
        this.getSystemFilter()
        this.getDatabaseFilter()
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tagId: this.dataId,
            ...queryInfo,
        }
        let res = await desensitiseTagColumns(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                showInput: false,
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
    postEdit = async (index) => {
        let { tableData } = this.state
        let query = {
            ruleId: tableData[index].ruleId,
            tagId: this.dataId,
            columnId: tableData[index].id,
        }
        let res = await saveDesensitiseTagColumns(query)
        if (res.code == 200) {
            message.success('编辑成功')
            tableData[index].isEdit = false
            this.setState({
                tableData,
                showInput: false,
            })
        }
    }
    cancelEdit = (index) => {
        let { tableData, originData } = this.state
        tableData[index].isEdit = false
        tableData[index].ruleId = originData.ruleId
        tableData[index].ruleName = originData.ruleName
        this.setState({
            tableData,
            showInput: false,
        })
    }
    openEdit = (index) => {
        let { tableData, showInput, originData } = this.state
        if (showInput) {
            message.info('请完成当前输入框')
            return
        }
        tableData[index].isEdit = true
        originData.ruleName = tableData[index].ruleName
        originData.ruleId = tableData[index].ruleId
        this.setState({
            tableData,
            showInput: true,
            originData,
        })
    }
    changeRule = (index, e, node) => {
        let { tableData } = this.state
        tableData[index].ruleId = e
        tableData[index].ruleName = node.props.children
        this.setState({
            tableData,
        })
    }
    deleteMap = (data) => {
        if (data.isEdit) {
            message.info('请先完成编辑')
            return
        }
        let that = this
        confirm({
            title: '你确定要解除映射吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                let query = {
                    columnId: [data.id],
                    ruleId: data.ruleId,
                    tagId: that.dataId,
                }
                delDesensitiseTagColumn(query).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                    }
                })
            },
        })
    }
    openPreviewModal = async (data) => {
        if (data.isEdit) {
            message.info('请先完成编辑')
            return
        }
        await this.setState({
            previewModalVisible: true,
            previewInfo: data,
        })
        this.getPreviewData(data)
    }
    getPreviewData = async (data) => {
        let query = {
            columnId: data.id,
            ruleId: data.ruleId,
        }
        this.setState({ previewLoading: true })
        let res = await desensitiseTagColumnPreview(query)
        this.setState({ previewLoading: false })
        if (res.code == 200) {
            this.setState({
                previewList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            previewModalVisible: false,
        })
    }
    addData = () => {
        this.addMapColumnDrawer && this.addMapColumnDrawer.openModal(this.state.ruleOptionList, this.dataId)
    }
    openRuleDetailDrawer = async (data) => {
        let res = await desensitizerule({ idList: [data.id] })
        if (res.code == 200) {
            if (res.data.length) {
                this.dataMaskDetailDrawer && this.dataMaskDetailDrawer.openModal(res.data[0])
            }
        }
    }
    render() {
        const { queryInfo, tableData, taskDetail, previewInfo, previewModalVisible, systemFilterList, databaseList, previewList, previewLoading } = this.state
        return (
            <React.Fragment>
                <div className='mapColumnDetail'>
                    <TableLayout
                        title={'映射管理（' + taskDetail.name + '）'}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='敏感标签信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '标签名称',
                                                    content: taskDetail.name,
                                                },
                                                {
                                                    label: '标签类别',
                                                    content: taskDetail.categoryName,
                                                },
                                                {
                                                    label: '敏感等级',
                                                    content: taskDetail.sensitivityLevelName,
                                                },
                                                {
                                                    label: '安全等级',
                                                    content: taskDetail.securityLevelName,
                                                },
                                            ])}
                                        </div>
                                        <div className='MiniForm Grid1'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '脱敏规则',
                                                    content: (
                                                        <div>
                                                            {taskDetail.ruleList.map((item, index) => {
                                                                return (
                                                                    <a style={{ marginRight: 12 }} onClick={this.openRuleDetailDrawer.bind(this, item)}>
                                                                        {index + 1}.{item.name}
                                                                        {item.isDefault ? <span>（默认）</span> : null}
                                                                    </a>
                                                                )
                                                            })}
                                                        </div>
                                                    ),
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return (
                                <ModuleTitle
                                    style={{ marginBottom: 15 }}
                                    title='映射字段'
                                    /* renderHeaderExtra={() => {
                                        return (
                                            <Button type='primary' onClick={this.addData}>添加映射</Button>
                                        )
                                    }} */
                                />
                            )
                        }}
                        editColumnProps={{
                            width: 180,
                            createEditColumnElements: (_, record) => {
                                const _elements = []
                                if (PermissionManage.hasFuncPermission('/sensitiveTag/mapColumnDetail/preview')) {
                                    _elements.push(
                                        <a onClick={this.openPreviewModal.bind(this, record)} key='detail'>
                                            脱敏预览
                                        </a>
                                    )
                                }
                                if (PermissionManage.hasFuncPermission('/sensitiveTag/mapColumnDetail/delete')) {
                                    _elements.push(
                                        <a onClick={this.deleteMap.bind(this, record)} key='delete'>
                                            解除映射
                                        </a>
                                    )
                                }
                                return _elements
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
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入字段名' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'systemId')} value={queryInfo.systemId} placeholder='系统' style={{ width: 160 }}>
                                        {systemFilterList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'databaseId')} value={queryInfo.databaseId} placeholder='数据库' style={{ width: 160 }}>
                                        {databaseList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
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
                <DataMaskDetailDrawer ref={(dom) => (this.dataMaskDetailDrawer = dom)} />
                <AddMapColumnDrawer reload={this.reload} ref={(dom) => (this.addMapColumnDrawer = dom)} />
                <Modal title='脱敏预览' className='dataMaskPreviewModal' visible={previewModalVisible} onCancel={this.cancel} footer={null}>
                    {previewModalVisible && (
                        <React.Fragment>
                            <h4 style={{ color: '#2D3033', fontWeight: '400', marginBottom: 12 }}>脱敏规则：{previewInfo.ruleName}</h4>
                            <Spin spinning={previewLoading}>
                                <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                    {previewList.map((item, index) => {
                                        return (
                                            <div className='previewItem'>
                                                {index + 1}
                                                <span>{item}</span>
                                            </div>
                                        )
                                    })}
                                    {!previewList.length ? <div style={{ color: '#9EA3A8', textAlign: 'center', height: 100, lineHeight: '100px' }}>暂无数据</div> : null}
                                </Form>
                            </Spin>
                        </React.Fragment>
                    )}
                </Modal>
            </React.Fragment>
        )
    }
}
