import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, message, Modal, Popover, Radio, Select, Switch, Table, Tooltip, Input, Popconfirm } from 'antd'
import { dsSettingDetail, filterOpts, filterRule, filterTypes, saveDsSetting, filterTable, getDatabaselist, getTables, whitelistTableSave, databaseList } from 'app_api/autoManage'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'
import RichTableLayout from '@/component/layout/RichTableLayout'

export default class FilterSetDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                filterRules: [],
                filterType: 0,
            },
            loading: false,
            addRuleModalVisible: false,
            addRuleIds: [],
            ruleList: [],
            btnLoading: false,
            tableLoading: false,
            datasourceName: '',
            typeList: [],
            optList: [],
            queryInfo: {
                keyword: '',
            },
            tableQueryInfo: {
                keyword: '',
            },
            whiteList: [],
            dataSourceList: [],
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
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
                title: '状态',
                dataIndex: 'enable',
                key: 'enable',
                width: 100,
                render: (text, record) => (text !== undefined ? <div>{text ? <StatusLabel type='success' message='启用' /> : <StatusLabel type='error' message='禁用' />}</div> : <EmptyLabel />),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 110,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popover
                                placement='topLeft'
                                content={
                                    <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div>规则名称：</div>
                                            <div style={{ width: 200, wordBreak: 'break-all' }}>{record.name || <EmptyLabel />}</div>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div>规则内容：</div>
                                            <div style={{ width: 200, wordBreak: 'break-all' }}>
                                                {record.filterInfoList &&
                                                    record.filterInfoList.map((item, index) => {
                                                        return (
                                                            <span>
                                                                {this.getTypeName(item.filterType)} {this.getOptName(item.filterOpt)} {item.content}
                                                                {index + 1 == record.filterInfoList.length ? null : <span style={{ color: '#5B7FA3' }}> {item.logicalOpt ? '或' : '且'} </span>}
                                                            </span>
                                                        )
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <a>详情</a>
                            </Popover>

                            <PermissionWrap funcCode=' /setting/gov_filter/manage/delete'>
                                <span>
                                    <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    <a onClick={this.deleteColumn.bind(this, index)}>移除</a>
                                </span>
                            </PermissionWrap>
                        </div>
                    )
                },
            },
        ]

        this.whitecolumns = [
            {
                title: '表名称',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div style={{ width: 360 }} className='LineClamp'>
                                {text}
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '所属库',
                dataIndex: 'physicalDatabase',
                key: 'physicalDatabase',
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
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                // width: '140px',
                render: (text, record, index) => {
                    return (
                        <Popconfirm title='是否确定移除治理表' onConfirm={this.deleteTableColumn.bind(this, index)} okText='移除' cancelText='取消'>
                            <a>移除治理</a>
                        </Popconfirm>
                    )
                },
            },
        ]

        this.tablecolumns = [
            {
                title: '表名',
                dataIndex: 'physicalTable',
                key: 'physicalTable',
                width: 300,
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
                title: '所属库',
                dataIndex: 'physicalDb',
                key: 'physicalDb',
                render: (text, record) => {
                    console.log('texttexttext', text)
                    console.log('record', record)
                    return text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
        ]
    }
    openModal = async (data) => {
        let { detailInfo } = this.state
        detailInfo.dsId = data.dsId
        await this.setState({
            modalVisible: true,
            detailInfo,
            datasourceName: data.datasourceName,
            whiteList: [],
        })
        await this.getFilter()
        this.getTableList()
        // this.filterTable()
    }

    databaseList = async () => {
        let { detailInfo } = this.state
        let query = {
            page: 1,
            pageSize: 99999,
            datasourceId: detailInfo.dsId,
        }

        let res = await databaseList(query)
        if (res.code == 200) {
            this.setState({ dataSourceList: res.data })
        }
    }

    filterTable = async () => {
        let { detailInfo, queryInfo } = this.state
        let query = {
            page: 1,
            pageSize: 99999,
            datasourceId: detailInfo.dsId,
            status: 2,
            ...queryInfo,
        }

        let res = await filterTable(query)
        if (res.code == 200) {
            this.setState({ whiteList: res.data })
        }
    }
    getTableList = async () => {
        let { detailInfo, optList, typeList } = this.state
        let res = await dsSettingDetail({ id: detailInfo.dsId })
        if (res.code == 200) {
            res.data.filterRules = res.data.filterRules ? res.data.filterRules : []
            res.data.filterRules.map((item) => {
                item.filterInfoList = item.filterContent ? JSON.parse(item.filterContent) : []
            })
            console.log(res.data)
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getTypeName = (value) => {
        let { typeList } = this.state
        for (let i = 0; i < typeList.length; i++) {
            if (value == typeList[i].id) {
                return typeList[i].name
            }
        }
        return ''
    }
    getOptName = (value) => {
        let { optList } = this.state
        for (let i = 0; i < optList.length; i++) {
            if (value == optList[i].id) {
                return optList[i].name
            }
        }
        return ''
    }
    getFilter = async () => {
        let res = await filterTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
        let res1 = await filterOpts()
        if (res1.code == 200) {
            this.setState({
                optList: res1.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    handleInputChange = (name, e) => {
        let { detailInfo } = this.state
        detailInfo[name] = e.target.value
        this.setState({
            detailInfo,
        })
    }
    deleteColumn = async (index) => {
        let { detailInfo } = this.state
        detailInfo.filterRules.splice(index, 1)
        this.setState({ tableLoading: true })
        await this.setState({
            detailInfo,
        })
        this.setState({ tableLoading: false })
    }

    deleteTableColumn = async (index) => {
        let { whiteList } = this.state
        whiteList.splice(index, 1)
        this.setState({ tableLoading: true })
        await this.setState({
            whiteList,
        })
        this.setState({ tableLoading: false })
    }
    addData = () => {
        this.setState({
            addRuleModalVisible: true,
            addRuleIds: [],
        })
        this.getRuleList()
    }

    tableSelect = async () => {
        await this.setState({
            tableSelectVisible: true,
        })
        const { whiteList } = this.state
        // this.selectController.updateSelectedKeys([])
        this.selectController.updateSelectedKeys(whiteList.map((white) => white.tableId))
        this.databaseList()
        this.getTableDataList({})
    }

    getRuleList = async () => {
        let { detailInfo } = this.state
        let res = await filterRule({ page: 1, pageSize: 10000, needAll: true, enable: true })
        if (res.code == 200) {
            res.data = res.data.filter((item) => !detailInfo.filterRules.some((ele) => ele.id === item.id))
            res.data.map((item) => {
                item.filterInfoList = item.filterContent ? JSON.parse(item.filterContent) : []
            })
            this.setState({
                ruleList: res.data,
            })
        }
    }
    postData = async () => {
        let { detailInfo } = this.state
        if (detailInfo.filterType === 0) {
            let { whiteList } = this.state
            whiteList.forEach((obj) => {
                obj.datasourceId = obj.dsId
            })

            detailInfo.tableParams = whiteList
        }
        this.setState({ loading: true })
        let res = await saveDsSetting(detailInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
        }
    }

    changeStatus = (e) => {
        let { detailInfo } = this.state
        detailInfo.govStatus = e ? 0 : 1
        this.setState({
            detailInfo,
        })
    }

    changeDatabase = async (name, e) => {
        let { tableQueryInfo } = this.state
        tableQueryInfo[name] = e
        await this.setState({
            tableQueryInfo,
        })
        this.search()
    }

    changeSelect = (e) => {
        this.setState({
            addRuleIds: e,
        })
    }
    cancelModal = () => {
        this.setState({
            addRuleModalVisible: false,
            tableSelectVisible: false,
        })
    }
    postAddRule = async () => {
        let { addRuleIds, ruleList, detailInfo } = this.state
        ruleList.map((item) => {
            if (addRuleIds.includes(item.id)) {
                detailInfo.filterRules.push(item)
            }
        })
        this.setState({ tableLoading: true })
        await this.setState({
            detailInfo,
        })
        this.setState({ tableLoading: false })
        this.cancelModal()
    }

    postAddTable = async (selectedRowKeys) => {
        let { whiteList, tableDataSource } = this.state
        selectedRowKeys.map((selected) => {
            if (selected && !whiteList.map((white) => white.tableId).includes(selected.id)) {
                selected.physicalTableName = selected.physicalTable
                selected.physicalDatabase = selected.physicalDb
                selected.tableId = selected.id
                selected.dsId = selected.datasourceId
                selected.status = 2
                whiteList.push(selected)
            }
        })

        this.setState({ tableLoading: true })
        await this.setState({
            whiteList,
        })
        this.setState({ tableLoading: false })
        this.cancelModal()
    }
    getTableDataList = async (params) => {
        let { detailInfo, tableQueryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 99999,
            datasourceId: detailInfo.dsId,
            ...tableQueryInfo,
        }
        let res = await getTables(query)
        if (res.code == 200) {
            this.setState({ tableDataSource: res.data })
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

    changeKeyword = async (e) => {
        let { tableQueryInfo } = this.state
        tableQueryInfo.keyword = e.target.value
        await this.setState({
            tableQueryInfo,
        })
        if (!e.target.value) {
            this.getTableDataList({})
        }
    }

    reset = async () => {
        let { tableQueryInfo } = this.state
        tableQueryInfo = {
            keyword: '',
        }
        await this.setState({
            tableQueryInfo,
        })
        this.search()
    }
    search = async () => {
        if (this.controller) {
            this.controller.reset()
        }
    }

    render() {
        const {
            modalVisible,
            detailInfo,
            loading,
            addRuleModalVisible,
            btnLoading,
            tableLoading,
            addRuleIds,
            ruleList,
            datasourceName,
            whiteList,
            tableSelectVisible,
            tableDataSource,
            tableQueryInfo,
            dataSourceList,
        } = this.state

        console.log('dataSourceListdataSourceListvvvv s s', dataSourceList)

        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterSetDrawer',
                    title: '过滤设置',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' loading={loading} onClick={this.postData}>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div style={{ marginBottom: 24 }}>源数据名称：{datasourceName}</div>
                        <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '治理状态',
                                    content: (
                                        <div>
                                            <Switch onChange={this.changeStatus} checked={detailInfo.govStatus ? false : true} />
                                            {detailInfo.govStatus ? <div style={{ color: '#606366', marginTop: 8 }}>注意：关闭治理后，该数据源将不进行治理板块</div> : null}
                                        </div>
                                    ),
                                },
                                {
                                    label: '设置方式',
                                    hide: detailInfo.govStatus,
                                    content: (
                                        <Radio.Group value={detailInfo.filterType} onChange={this.handleInputChange.bind(this, 'filterType')}>
                                            <Radio value={0}>治理</Radio>
                                            <Radio value={1}>排除</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '过滤规则',
                                    hide: detailInfo.filterType == 0 || detailInfo.govStatus,
                                    content: (
                                        <div>
                                            {tableLoading ? null : <Table loading={tableLoading} rowKey='id' columns={this.columns} dataSource={detailInfo.filterRules} pagination={false} />}
                                            <Button icon={<PlusOutlined />} block onClick={this.addData} type='link'>
                                                添加
                                            </Button>
                                        </div>
                                    ),
                                },
                                {
                                    label: '表选择',
                                    hide: detailInfo.filterType == 1 || detailInfo.govStatus,
                                    content: (
                                        <div className='table_select'>
                                            {tableLoading ? null : <Table loading={tableLoading} rowKey='id' columns={this.whitecolumns} dataSource={whiteList} pagination={false} />}
                                            <Button icon={<PlusOutlined />} block onClick={this.tableSelect} type='link'>
                                                添加
                                            </Button>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
                <Modal
                    title='添加过滤规则'
                    className='addFilterRuleModal'
                    visible={addRuleModalVisible}
                    onCancel={this.cancelModal}
                    footer={[
                        <Button key='back' onClick={this.cancelModal}>
                            取消
                        </Button>,
                        <Button disabled={!addRuleIds.length} onClick={this.postAddRule} key='submit' type='primary' loading={btnLoading}>
                            确定
                        </Button>,
                    ]}
                >
                    {addRuleModalVisible && (
                        <React.Fragment>
                            <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '规则选择',
                                        content: (
                                            <Select
                                                mode='multiple'
                                                optionFilterProp='title'
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                allowClear
                                                placeholder='请选择'
                                                value={addRuleIds}
                                                onChange={this.changeSelect}
                                            >
                                                {ruleList &&
                                                    ruleList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Select.Option>
                                                        )
                                                    })}
                                            </Select>
                                        ),
                                    },
                                ])}
                            </Form>
                        </React.Fragment>
                    )}
                </Modal>
                <Modal
                    title='添加治理表'
                    // className='addTablesModal'
                    visible={tableSelectVisible}
                    width={640}
                    onCancel={this.cancelModal}
                    footer={[]}
                >
                    <RichTableLayout
                        disabledDefaultFooter
                        showFooterControl={true}
                        smallLayout
                        editColumnProps={{
                            hidden: true,
                        }}
                        tableProps={{
                            columns: this.tablecolumns,
                            key: 'id',
                            showQuickJumper: false,
                            selectedEnable: true,
                            extraTableProps: {
                                size: 'small',
                                scroll: {
                                    y: 400,
                                },
                            },
                            getCheckboxProps: (record) => ({
                                disabled: whiteList.map((white) => white.tableId).indexOf(record.tableId) > -1, // 未映射才能选
                            }),
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 325 }} value={tableQueryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名称' />
                                    <Select
                                        allowClear
                                        mode='multiple'
                                        style={{ width: 180 }}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        onChange={this.changeDatabase.bind(this, 'databaseIds')}
                                        value={tableQueryInfo.databaseIds}
                                        placeholder='所属库'
                                    >
                                        {dataSourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.physicalDatabase} key={item.id} value={item.id}>
                                                    {item.physicalDatabase}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>

                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableDataList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                        renderFooter={(controller, defaultRender) => {
                            const { selectedRows, selectedKeys } = controller
                            this.selectController = controller

                            return (
                                <div>
                                    <Button key='back' style={{ marginRight: 6 }} onClick={this.cancelModal}>
                                        取消
                                    </Button>
                                    <Button disabled={selectedRows.length === 0} onClick={this.postAddTable.bind(null, selectedRows)} key='submit' type='primary' loading={btnLoading}>
                                        确定
                                    </Button>
                                </div>
                            )
                        }}
                    />
                </Modal>
            </DrawerLayout>
        )
    }
}
