// 执行记录
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import DrawerLayout from '@/component/layout/DrawerLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import { FileTextOutlined } from '@ant-design/icons'
import EmptyIcon from '@/component/EmptyIcon'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Button, Checkbox, Form, Input, Tooltip, Alert, Select, Spin, DatePicker, Cascader, Modal, message, Pagination, Table, Popover } from 'antd'
import '../../index.less'
import React, { Component } from 'react'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import { getQaTaskExeRuleList, getQaTaskList, getTaskExecutorList, queryExecRecords, queryExecInfoDetail, queryTableSource } from 'app_api/examinationApi'
import { datasourceListForQuery } from 'app_api/metadataApi'
import store from '../../store'
import { observer } from 'mobx-react'
import moment from 'moment'
import _ from 'underscore'
import LogDrawer from '../logDrawer'

const lastStatusMap = {
    // 0: '新创建',
    // 1: '等待执行',
    // 2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    // 5: '系统中止',
}

const { RangePicker } = DatePicker

@observer
export default class TaskRecordData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            isSearch: false,
            total: 0,
            queryInfo: {
                tableName: '',
                isLatest: 0,
            },
            timeRange: [],
            treeData: [],
            datasourceIds: [],

            recordModalVisible: false,
            sqlModalVisible: false,
            sqlInfo: {
                keyword: '',
                page: 1,
                pageSize: 20,
            },
            sqlDetail: {},
            tableDetail: {},
            recordList: [],
            recordLoading: false,
            recordTotal: 0,
            loading: false,
        }
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>
                                <span className='tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '路径',
                dataIndex: 'tablePath',
                key: 'tablePath',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '检核时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
                width: 180,
                sorter: true,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>
                            <span className='LineClamp'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: 120,
                render: (text, record) => {
                    if (text == 0) {
                        return <StatusLabel type='info' message='新创建' />
                    } else if (text == 1) {
                        return <StatusLabel type='warning' message='等待执行' />
                    } else if (text == 2) {
                        return <StatusLabel type='loading' message='正在执行' />
                    } else if (text == 3) {
                        return <StatusLabel type='success' message='执行成功' />
                    } else if (text == 4) {
                        return <StatusLabel type='error' message='执行失败' />
                    } else if (text == 5) {
                        return <StatusLabel type='info' message='系统中止' />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '执行规则',
                dataIndex: 'techRuleCount',
                key: 'techRuleCount',
                width: 100,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.openResultModal.bind(this, record, undefined)}>{text}</a>
                    </Tooltip>
                ),
            },
            {
                title: '规则异常',
                dataIndex: 'techRuleFailedCount',
                key: 'techRuleFailedCount',
                width: 100,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.openResultModal.bind(this, record, '4')}>{text}</a>
                    </Tooltip>
                ),
            },
        ]
        this.recordColumns = [
            {
                title: '核验字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 150,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则类型',
                dataIndex: 'ruleTypePath',
                key: 'ruleTypePath',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text, record) => {
                    if (text == 0) {
                        return <StatusLabel type='info' message='新创建' />
                    } else if (text == 1) {
                        return <StatusLabel type='warning' message='等待执行' />
                    } else if (text == 2) {
                        return <StatusLabel type='loading' message='正在执行' />
                    } else if (text == 3) {
                        return <StatusLabel type='success' message='执行成功' />
                    } else if (text == 4) {
                        return (
                            <span>
                                <StatusLabel type='error' message='执行失败' />
                                <Popover trigger='click' content={<div style={{ width: 300, wordBreak: 'break-word' }}>{record.failedReason}</div>}>
                                    <FileTextOutlined style={{ cursor: 'pointer', marginLeft: 8, color: '#5B7FA3', fontSize: '16px' }} />
                                </Popover>
                            </span>
                        )
                    } else if (text == 5) {
                        return <StatusLabel type='info' message='系统中止' />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 90,
                fixed: 'right',
                render: (text, record, index) => {
                    return (
                        <a disabled={record.status !== 4} onClick={this.openSqlModal.bind(this, record)} key='edit'>
                            问题SQL
                        </a>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
        this.getTableList({ sorter: { field: '' }, pagination: { page: 1, page_size: 20 } })
    }
    refresh = async () => {
        this.getSearchCondition()
        await this.getTableList({ sorter: { field: '' }, pagination: { page: 1, page_size: 20 } })
        this.reset()
    }
    openResultModal = async (data, status) => {
        let { sqlInfo } = this.state
        sqlInfo = {
            page: 1,
            pageSize: 20,
            keyword: '',
            taskId: data.tsTaskId,
            status: status,
        }
        await this.setState({
            sqlInfo,
            tableDetail: { ...data },
        })
        this.getRecordList()
        this.setState({
            recordModalVisible: true,
        })
    }
    getStatusLabel = (value) => {
        for (let k in lastStatusMap) {
            if (k == value) {
                return lastStatusMap[k]
            }
        }
        return '-'
    }
    getSearchCondition = async () => {
        const { selectedTaskInfo } = store
        console.log(selectedTaskInfo.name, 'getSearchCondition')
        let res = await queryTableSource({ taskGroupId: selectedTaskInfo.taskGroupId })
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
            })
        }
    }
    getRecordList = async (params = {}) => {
        let { sqlInfo } = this.state
        let query = {
            ...sqlInfo,
            statusList: sqlInfo.status !== undefined ? [sqlInfo.status] : [],
        }
        this.setState({ recordLoading: true })
        let res = await getQaTaskExeRuleList(query)
        this.setState({ recordLoading: false })
        if (res.code == 200) {
            this.setState({
                recordList: res.data,
                recordTotal: res.total,
            })
        }
    }
    openLogModal = async (data) => {
        this.logDrawer && this.logDrawer.openModal(data)
    }
    onChangePicker = async (dates, dateStrings) => {
        console.log(dates, dateStrings)
        let { queryInfo } = this.state
        queryInfo.startTime = dateStrings[0]
        queryInfo.endTime = dateStrings[1]
        await this.setState({
            timeRange: dates,
            queryInfo,
            isSearch: true,
        })
        this.search()
    }
    changeSqlStatus = async (e) => {
        let { sqlInfo } = this.state
        sqlInfo.status = e
        await this.setState({
            sqlInfo,
        })
        this.searchRecord()
    }
    changeSqlKeyword = async (e) => {
        let { sqlInfo } = this.state
        sqlInfo.keyword = e.target.value
        await this.setState({
            sqlInfo,
        })
        if (!e.target.value) {
            this.searchRecord()
        }
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        if (name == 'datasourceIds') {
            await this.setState({
                datasourceIds: e ? e : [],
            })
        } else if (name == 'isLatest') {
            queryInfo[name] = e.target.checked ? 1 : 0
        } else {
            queryInfo[name] = e
        }
        await this.setState({
            queryInfo,
            isSearch: true,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.tableName = e.target.value
        await this.setState({
            queryInfo,
            isSearch: true,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            tableName: '',
            isLatest: 0,
        }
        await this.setState({
            queryInfo,
            timeRange: [],
            datasourceIds: [],
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getTableList = async (params = {}) => {
        console.log(params)
        const { selectedTaskInfo } = store
        let { queryInfo, datasourceIds } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            taskGroupId: selectedTaskInfo.taskGroupId,
            jobId: selectedTaskInfo.jobId,
            orderByCheckTime: params.sorter.field == 'checkTime' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 0 : undefined) : undefined,
            ...queryInfo,
            datasourceId: datasourceIds[0],
            databaseId: datasourceIds[1],
        }
        console.log(query, 'getTableList')
        this.setState({ loading: true })
        let res = await queryExecRecords(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total,
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
    searchRecord = async () => {
        let { sqlInfo } = this.state
        sqlInfo.page = 1
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
    }
    recordReset = async () => {
        let { sqlInfo } = this.state
        sqlInfo = {
            page: 1,
            pageSize: 20,
            keyword: '',
            status: undefined,
            taskId: sqlInfo.taskId,
        }
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
    }
    changeRecordPage = async (page, pageSize) => {
        let { sqlInfo } = this.state
        sqlInfo.page = page
        sqlInfo.pageSize = pageSize
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
    }
    cancel = () => {
        this.setState({
            recordModalVisible: false,
        })
    }
    sqlCancel = () => {
        this.setState({
            sqlModalVisible: false,
        })
    }
    openSqlModal = (data) => {
        this.setState({
            sqlModalVisible: true,
            sqlDetail: data,
        })
    }
    render() {
        const {
            isSearch,
            tableData,
            total,
            queryInfo,
            timeRange,
            datasourceIds,
            treeData,
            recordModalVisible,
            sqlModalVisible,
            sqlInfo,
            sqlDetail,
            recordList,
            recordLoading,
            recordTotal,
            tableDetail,
            loading,
        } = this.state
        return (
            <div className='taskRecord taskParams commonScroll'>
                <div className='tableInfo'>
                    <ModuleTitle title='执行记录' />
                    {total || isSearch ? (
                        <RichTableLayout
                            disabledDefaultFooter
                            smallLayout
                            editColumnProps={{
                                width: 80,
                                createEditColumnElements: (_, record) => {
                                    return [
                                        <a onClick={this.openLogModal.bind(this, record)} key='edit'>
                                            日志
                                        </a>,
                                    ]
                                },
                            }}
                            tableProps={{
                                columns: this.columns,
                                key: 'id',
                                dataSource: tableData,
                                extraTableProps: {
                                    scroll: {
                                        x: 1300,
                                    },
                                },
                            }}
                            renderSearch={(controller) => {
                                this.controller = controller
                                return (
                                    <React.Fragment>
                                        <Input.Search allowClear value={queryInfo.tableName} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名' />
                                        <RangePicker style={{ width: 250 }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />
                                        <Cascader
                                            allowClear
                                            changeOnSelect
                                            fieldNames={{ label: 'name', value: 'id' }}
                                            options={treeData}
                                            value={datasourceIds}
                                            onChange={this.changeStatus.bind(this, 'datasourceIds')}
                                            popupClassName='searchCascader'
                                            placeholder='路径选择'
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        />
                                        <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='执行结果'>
                                            {_.map(lastStatusMap, (node, index) => {
                                                return (
                                                    <Select.Option key={index} value={index}>
                                                        {node}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                        <Button onClick={this.reset}>重置</Button>
                                        <Checkbox onChange={this.changeStatus.bind(this, 'isLatest')} checked={queryInfo.isLatest == 1}>
                                            最近执行
                                        </Checkbox>
                                    </React.Fragment>
                                )
                            }}
                            requestListFunction={(page, pageSize, filter, sorter) => {
                                return this.getTableList({
                                    pagination: {
                                        page,
                                        page_size: pageSize,
                                    },
                                    sorter: sorter || {},
                                })
                            }}
                        />
                    ) : (
                        <Spin spinning={loading}>
                            <EmptyIcon description='暂无数据' />
                        </Spin>
                    )}
                </div>
                <LogDrawer ref={(dom) => (this.logDrawer = dom)} />
                <DrawerLayout
                    drawerProps={{
                        className: 'recordDrawer',
                        title: '执行记录明细',
                        width: 960,
                        visible: recordModalVisible,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Pagination
                                    // showSizeChanger={true}
                                    showQuickJumper={true}
                                    onChange={this.changeRecordPage}
                                    showTotal={(total) => `总数 ${total} 条`}
                                    current={sqlInfo.page}
                                    pageSize={sqlInfo.pageSize}
                                    total={recordTotal}
                                />
                            </React.Fragment>
                        )
                    }}
                >
                    {recordModalVisible && (
                        <React.Fragment>
                            <div className='OverView'>
                                <div className='OverViewTitle'>
                                    <Tooltip placement='topLeft' title={tableDetail.tableName + ' ' + tableDetail.tableNameCn}>
                                        {tableDetail.tableName} {tableDetail.tableNameCn}
                                    </Tooltip>
                                </div>
                                <Form className='MiniForm'>
                                    <div className='HControlGroup'>
                                        {[
                                            {
                                                label: '路径',
                                                content: tableDetail.tablePath || '-',
                                            },
                                            {
                                                label: '检核时间',
                                                content: tableDetail.checkTime ? moment(tableDetail.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
                                            },
                                            {
                                                label: '检核范围',
                                                content: tableDetail.checkRangeTimeView || '-',
                                            },
                                        ].map((item) => {
                                            return (
                                                <div key={item.label} className='detailInfo'>
                                                    <label>{item.label}：</label>
                                                    <span>{item.content}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Form>
                            </div>
                            <TableLayout
                                disabledDefaultFooter
                                renderDetail={() => {
                                    return (
                                        <React.Fragment>
                                            <div>
                                                <Input.Search
                                                    allowClear
                                                    style={{ width: 280, marginRight: 8 }}
                                                    value={sqlInfo.keyword}
                                                    onChange={this.changeSqlKeyword}
                                                    onSearch={this.searchRecord}
                                                    placeholder='请输入字段名'
                                                />
                                                <Select allowClear onChange={this.changeSqlStatus} value={sqlInfo.status} placeholder='执行结果' style={{ width: 160, marginRight: 8 }}>
                                                    {_.map(lastStatusMap, (node, index) => {
                                                        return (
                                                            <Select.Option key={index} value={index}>
                                                                {node}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Button onClick={this.recordReset}>重置</Button>
                                            </div>
                                            <Table rowKey='id' loading={recordLoading} columns={this.recordColumns} dataSource={recordList} pagination={false} scroll={{ x: 1200 }} />
                                        </React.Fragment>
                                    )
                                }}
                            />
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <Modal width={640} className='sqlModal' title='问题SQL' visible={sqlModalVisible} onCancel={this.sqlCancel} footer={null}>
                    <h3 style={{ fontSize: '14px' }}>检核SQL</h3>
                    <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ marginBottom: 24, height: 200, overflowY: 'auto' }}>
                        {RenderUtil.renderFormItems([
                            {
                                content: sqlDetail.sqlText,
                            },
                        ])}
                    </Form>
                    <h3 style={{ fontSize: '14px' }}>总数SQL</h3>
                    <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ height: 200, overflowY: 'auto' }}>
                        {RenderUtil.renderFormItems([
                            {
                                content: sqlDetail.sqlTotal,
                            },
                        ])}
                    </Form>
                </Modal>
            </div>
        )
    }
}
