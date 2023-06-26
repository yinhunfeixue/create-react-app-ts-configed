import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Divider, Form, Input, message, Modal, Radio, Select, Table, Tooltip } from 'antd'
import { auditRecord, rootAudit } from 'app_api/dataModeling'
import { configCategory, configType, rootList } from 'app_api/metadataApi'
import React, { Component } from 'react'

const { TextArea } = Input
export default class RootCheckDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            tableData: [],
            checkModalVisible: false,
            checkInfo: {},
            reasonInfo: {
                refuseType: 0,
                descWord: [],
            },
            rootList: [],
            btnLoading: false,
            categoryList: [],
            typeList: [],
            columnTypeList: [],
        }
        this.columns = [
            {
                title: '词根',
                dataIndex: 'rootName',
                key: 'rootName',
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
                title: '描述',
                dataIndex: 'descWord',
                key: 'descWord',
                render: (text, record) => (text && text.length ? <Tooltip title={this.renderDescWord(text, '#fff')}>{this.renderDescWord(text, '#2D3033')}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '词根类型',
                dataIndex: 'rootType',
                key: 'rootType',
                className: 'tagColumn',
                width: 180,
                render: (text, record, index) => {
                    return (
                        <Select style={{ width: '100%' }} onChange={this.changeType.bind(this, index)} value={record.rootType} placeholder='请选择'>
                            {record.typeList &&
                                record.typeList.map((item) => {
                                    return (
                                        <Option name={item.name} value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                        </Select>
                    )
                },
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                width: 244,
                render: (text, record, index) => {
                    return <Input onChange={this.changeInput.bind(this, index)} value={record.remarks} placeholder='请输入' />
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 120,
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={this.check.bind(this, record, 1)} key='edit'>
                                通过
                            </a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <a onClick={this.check.bind(this, record, 2)} key='edit' style={{ color: '#F54F4A' }}>
                                不通过
                            </a>
                        </span>
                    )
                },
            },
        ]
    }
    openModal = async (data) => {
        await this.setState({
            modalVisible: true,
            detailInfo: data,
        })
        this.getTableList()
        this.getConfigCategory()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    cancelCheck = () => {
        this.setState({
            checkModalVisible: false,
        })
    }
    changeType = (index, e) => {
        let { tableData } = this.state
        tableData[index].rootType = e
        this.setState({
            tableData,
        })
    }
    changeInput = (index, e) => {
        let { tableData } = this.state
        tableData[index].remarks = e.target.value
        this.setState({
            tableData,
        })
    }
    getConfigCategory = async () => {
        let res = await configCategory()
        if (res.code == 200) {
            this.setState({
                categoryList: res.data,
            })
        }
    }
    getConfigType = async () => {
        if (!this.state.reasonInfo.rootCategory) {
            return
        }
        let res = await configType({ category: this.state.reasonInfo.rootCategory })
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let { detailInfo, tableData } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: detailInfo.id,
            audit: false,
        }
        this.setState({ loading: true })
        let res = await auditRecord(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            if (res.data.length) {
                res.data.map((item) => {
                    res.data.descWord = res.data.descWord !== undefined ? res.data.descWord : []
                    this.getColumnTypeList(item.rootCategory).then((data) => {
                        if (data.length) {
                            item.typeList = data
                            this.setState({
                                tableData: res.data,
                            })
                        }
                    })
                })
            } else {
                this.setState({
                    tableData: res.data,
                })
            }
            this.props.setAuditNumber(res.total)
        }
    }
    getColumnTypeList = async (value) => {
        let res = await configType({ category: value })
        if (res.code == 200) {
            return res.data
        }
        return []
    }
    renderDescWord = (data, color) => {
        let html = ''
        data.map((item, index) => {
            html += item + (index < data.length - 1 ? '、' : '')
        })
        return <span style={{ color: color }} dangerouslySetInnerHTML={{ __html: html }}></span>
    }
    check = async (data, value) => {
        if (value == 1) {
            let query = {
                ...data,
                auditStatus: value,
            }
            let that = this
            Modal.confirm({
                title: '提示',
                content: <div>确认词根“{data.rootName}”通过审核</div>,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    rootAudit(query).then((res) => {
                        if (res.code == 200) {
                            message.success('操作成功')
                            that.getTableList()
                        }
                    })
                },
            })
        } else {
            let reasonInfo = {
                ...data,
                refuseType: 0,
            }
            await this.setState({
                checkModalVisible: true,
                checkInfo: data,
                reasonInfo,
            })
            this.getConfigType()
        }
    }
    changeSelect = async (name, e, node) => {
        let { reasonInfo, checkInfo } = this.state
        if (name == 'refuseType' || name == 'rootName' || name == 'remarks') {
            reasonInfo[name] = e.target.value
            if (name == 'refuseType') {
                reasonInfo.correctRootId = undefined
                reasonInfo.rootCategoryName = checkInfo.rootCategoryName
                reasonInfo.descWord = checkInfo.descWord
                reasonInfo.rootTypeName = checkInfo.rootTypeName
            }
        } else if (name == 'correctRootId') {
            reasonInfo[name] = e
            if (e) {
                console.log(node.props)
                reasonInfo.rootCategoryName = node.props.dataRef.rootCategoryName
                reasonInfo.descWord = node.props.dataRef.descWord
                reasonInfo.rootTypeName = node.props.dataRef.rootTypeName
            } else {
                reasonInfo.rootCategoryName = ''
                reasonInfo.descWord = []
                reasonInfo.rootTypeName = ''
            }
        } else if (name == 'rootCategory') {
            reasonInfo[name] = e
            if (e !== 'prefixsuffix') {
                reasonInfo.rootType = 'unknown'
                reasonInfo.rootTypeName = '未知'
            } else {
                reasonInfo.rootType = undefined
                reasonInfo.rootTypeName = ''
            }
            await this.setState({
                reasonInfo,
            })
            this.getConfigType()
        } else {
            reasonInfo[name] = e
        }
        this.setState({
            reasonInfo,
        })
    }
    handleSearch = (value) => {
        this.getRootList(value)
    }
    getRootList = async (value) => {
        let query = {
            page: 1,
            pageSize: 100,
            keyword: value,
        }
        let res = await rootList(query)
        if (res.code == 200) {
            this.setState({
                rootList: res.data,
            })
        }
    }
    postData = async () => {
        let { reasonInfo, checkInfo } = this.state
        let query = {
            refuseType: reasonInfo.refuseType,
            rootType: checkInfo.rootType,
            correctRootId: reasonInfo.correctRootId,
            id: checkInfo.id,
            remarks: checkInfo.remarks,
            correctRootInfo: { ...reasonInfo },
            auditStatus: 2,
        }
        this.setState({ btnLoading: true })
        let res = await rootAudit(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancelCheck()
            this.getTableList()
        }
    }
    render() {
        const { modalVisible, detailInfo, tableData, loading, checkModalVisible, checkInfo, reasonInfo, rootList, btnLoading, categoryList, typeList } = this.state
        const suffixStyle = {
            position: 'absolute',
            bottom: 8,
            right: 8,
            color: '#C4C8CC',
        }
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'rootCheckDrawer',
                    title: '备选词根审核',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Alert message={<div>{tableData.length} 个词根待审批，审批完成的词根在审批记录里查看</div>} type='warning' showIcon />
                        <Table loading={loading} columns={this.columns} dataSource={tableData} rowKey='id' pagination={false} />
                        <Modal
                            title={'词根审批（' + reasonInfo.rootName + '）'}
                            width={480}
                            visible={checkModalVisible}
                            className='commonModal rootCheckModal'
                            onCancel={this.cancelCheck}
                            footer={[
                                <Button
                                    disabled={
                                        (reasonInfo.refuseType == 0 && !reasonInfo.correctRootId) ||
                                        (reasonInfo.refuseType && (!reasonInfo.rootName || !reasonInfo.descWord.length || !reasonInfo.rootType))
                                    }
                                    onClick={this.postData}
                                    type='primary'
                                    loading={btnLoading}
                                >
                                    确定
                                </Button>,
                                <Button onClick={this.cancelCheck}>取消</Button>,
                            ]}
                        >
                            <div>
                                <Form className='EditMiniForm Grid1'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '拒绝原因',
                                            required: true,
                                            content: (
                                                <div>
                                                    <Radio.Group value={reasonInfo.refuseType} onChange={this.changeSelect.bind(this, 'refuseType')}>
                                                        <Radio value={0}>词根已存在</Radio>
                                                        <Radio value={1}>词根错误</Radio>
                                                    </Radio.Group>
                                                    {reasonInfo.refuseType == 1 ? <Alert style={{ marginTop: 16 }} message='请将下方内容修改为你认为正确的词根信息' type='info' showIcon /> : null}
                                                </div>
                                            ),
                                        },
                                        {
                                            label: '请选择正确词根',
                                            required: true,
                                            hide: reasonInfo.refuseType == 1 ? true : false,
                                            content: (
                                                <div>
                                                    <Select
                                                        showSearch
                                                        filterOption={false}
                                                        onSearch={this.handleSearch}
                                                        onChange={this.changeSelect.bind(this, 'correctRootId')}
                                                        value={reasonInfo.correctRootId}
                                                        placeholder='请输入选择'
                                                        dropdownClassName='highlightArea'
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    >
                                                        {rootList.map((item) => {
                                                            return (
                                                                <Option title={item.rootName} dataRef={item} key={item.id} value={item.id}>
                                                                    <div dangerouslySetInnerHTML={{ __html: item.rootName }}></div>
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    {reasonInfo.correctRootId ? (
                                                        <Form className='MiniForm formDetailInline' style={{ marginTop: 8 }}>
                                                            {RenderUtil.renderFormItems([
                                                                {
                                                                    label: '描述词：',
                                                                    content: this.renderDescWord(reasonInfo.descWord, '#2D3033'),
                                                                },
                                                                {
                                                                    label: '词根类别：',
                                                                    content: reasonInfo.rootCategoryName,
                                                                },
                                                                {
                                                                    label: '词根类型：',
                                                                    content: reasonInfo.rootTypeName,
                                                                },
                                                            ])}
                                                        </Form>
                                                    ) : null}
                                                </div>
                                            ),
                                        },
                                        {
                                            label: '词根',
                                            required: true,
                                            hide: reasonInfo.refuseType == 1 ? false : true,
                                            content: (
                                                <Input
                                                    value={reasonInfo.rootName}
                                                    onChange={this.changeSelect.bind(this, 'rootName')}
                                                    placeholder='请输入'
                                                    maxLength={32}
                                                    suffix={<span style={{ color: '#C4C8CC' }}>{reasonInfo.rootName ? reasonInfo.rootName.length : 0}/32</span>}
                                                />
                                            ),
                                        },
                                        {
                                            label: '词描述词',
                                            required: true,
                                            hide: reasonInfo.refuseType == 1 ? false : true,
                                            content: (
                                                <Select
                                                    className='tagsSelect'
                                                    dropdownClassName='columnSearchDropdown'
                                                    mode='tags'
                                                    tokenSeparators={[',', '，']}
                                                    placeholder='请输入描述词，逗号分割'
                                                    value={reasonInfo.descWord}
                                                    onChange={this.changeSelect.bind(this, 'descWord')}
                                                ></Select>
                                            ),
                                        },
                                        {
                                            label: '词根类型',
                                            required: true,
                                            hide: reasonInfo.refuseType == 1 ? false : true,
                                            content: (
                                                <Input.Group compact>
                                                    <Select
                                                        allowClear={false}
                                                        style={{ width: '40%' }}
                                                        value={reasonInfo.rootCategory}
                                                        onChange={this.changeSelect.bind(this, 'rootCategory')}
                                                        placeholder='请选择'
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    >
                                                        {categoryList.map((item) => {
                                                            return (
                                                                <Select.Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    <Select
                                                        allowClear={false}
                                                        style={{ width: '60%' }}
                                                        value={reasonInfo.rootType}
                                                        onChange={this.changeSelect.bind(this, 'rootType')}
                                                        placeholder='请选择'
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    >
                                                        {typeList.map((item) => {
                                                            return (
                                                                <Select.Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Input.Group>
                                            ),
                                        },
                                        {
                                            label: '备注',
                                            hide: reasonInfo.refuseType == 1 ? false : true,
                                            content: (
                                                <div style={{ position: 'relative' }}>
                                                    <TextArea
                                                        style={{ height: 52 }}
                                                        placeholder='请输入'
                                                        rows={4}
                                                        maxLength={128}
                                                        value={reasonInfo.remarks}
                                                        onChange={this.changeSelect.bind(this, 'remarks')}
                                                    />
                                                    <span style={{ ...suffixStyle }}>{reasonInfo.remarks ? reasonInfo.remarks.length : 0}/128</span>
                                                </div>
                                            ),
                                        },
                                    ])}
                                </Form>
                            </div>
                        </Modal>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
