import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Icon as LegacyIcon } from '@ant-design/compatible'
import { Alert, Button, Input, message, Modal, Pagination, Select, Table, Tooltip } from 'antd'
import { getQaTaskExeRuleList, getQaTaskList, getTaskExecutorList } from 'app_api/examinationApi'
import { getTaskLogList } from 'app_api/metadataApi'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'

const lastStatusMap = {
    0: '新创建',
    1: '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    5: '系统中止',
}
export default class TaskRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskInfo: {},
            queryInfo: {},
            userList: [],
            timeRange: [],
            tableData: [],
            logModalVisible: false,
            recordModalVisible: false,
            sqlModalVisible: false,
            logList: [],
            logDetail: {},
            logInfo: {
                pageNo: 1,
                pageSize: 20,
            },
            totalLog: 0,
            sqlInfo: {
                keyword: '',
                page: 1,
                pageSize: 20,
            },
            sqlDetail: {},
            recordList: [],
            recordLoading: false,
            recordTotal: 0,
        }
        this.columns = [
            {
                title: '执行时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: '18%',
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
                title: '耗时',
                dataIndex: 'useTime',
                key: 'useTime',
                width: '12%',
                render: (text, record) => (text ? <Tooltip title={parseFloat((parseInt(text) / 1000).toFixed(3)) + 's'}>{parseFloat((parseInt(text) / 1000).toFixed(3))}s</Tooltip> : <EmptyLabel />),
            },
            {
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: '14%',
                render: (text, record) => {
                    switch (text) {
                        case 1:
                            return <StatusLabel type='warning' message='等待执行' />
                        case 2:
                            return <StatusLabel type='loading' message='正在执行' />
                        case 3:
                            return <StatusLabel type='success' message='执行成功' />
                        case 4:
                            return <StatusLabel type='error' message='执行失败' />
                        case 5:
                            return <StatusLabel type='info' message='系统中止' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                title: '调度信息',
                dataIndex: 'executor',
                key: 'executor',
                width: '14%',
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
                title: '检核范围',
                dataIndex: 'businessInfo',
                key: 'businessInfo',
                width: '20%',
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
                title: '执行规则',
                dataIndex: 'businessCount',
                key: 'businessCount',
                width: '12%',
                sorter: true,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.openResultModal.bind(this, record, undefined)}>{text}</a>
                    </Tooltip>
                ),
            },
            {
                title: '规则异常',
                dataIndex: 'failBusinessCount',
                key: 'failBusinessCount',
                width: '12%',
                sorter: true,
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
                            <span className='LineClamp'>{text}</span>
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
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 100,
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
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text, record) => {
                    switch (text) {
                        case 1:
                            return <StatusLabel type='warning' message='等待执行' />
                        case 2:
                            return <StatusLabel type='loading' message='正在执行' />
                        case 3:
                            return <StatusLabel type='success' message='执行成功' />
                        case 4:
                            return <StatusLabel type='error' message='执行失败' />
                        case 5:
                            return <StatusLabel type='info' message='系统中止' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                title: '失败原因',
                dataIndex: 'failedReason',
                key: 'failedReason',
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
    componentWillMount = async () => {
        this.getUserList()
        ProjectUtil.setDocumentTitle(this.pageParam.name)
    }
    getUserList = async () => {
        let res = await getTaskExecutorList({ taskJobId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    getStatusLabel = (value) => {
        for (let k in lastStatusMap) {
            if (k == value) {
                return lastStatusMap[k]
            }
        }
        return '-'
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
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
    }
    onChangePicker = async (dates, dateStrings) => {
        console.log(dates, dateStrings)
        let { queryInfo } = this.state
        queryInfo.startTime = dateStrings[0]
        queryInfo.finishTime = dateStrings[1]
        await this.setState({
            timeRange: dates,
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
    getTableList = async (params = {}) => {
        console.log(params)
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            taskJobId: this.props.location.state.id,
            businessCountOrder: params.sorter.field == 'businessCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            failBusinessCountOrder: params.sorter.field == 'failBusinessCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            ...queryInfo,
        }
        let res = await getQaTaskList(query)
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
        let { logInfo } = this.state
        logInfo.pageNo = 1
        logInfo.taskId = data.id
        await this.setState({
            logModalVisible: true,
            logInfo,
            logDetail: data,
        })
        this.getLogList()
    }
    getLogList = async () => {
        let { logInfo } = this.state
        let res = await getTaskLogList(logInfo)
        if (res.code == 200) {
            this.setState({
                totalLog: res.total,
                logList: res.data,
            })
        }
    }
    openResultModal = async (data, status) => {
        let { sqlInfo } = this.state
        sqlInfo = {
            page: 1,
            pageSize: 20,
            keyword: '',
            taskId: data.id,
            status: status,
        }
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
        this.setState({
            recordModalVisible: true,
        })
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
            logModalVisible: false,
            recordModalVisible: false,
        })
    }
    sqlCancel = () => {
        this.setState({
            sqlModalVisible: false,
        })
    }
    changeLogPage = async (page, pageSize) => {
        let { logInfo } = this.state
        logInfo.pageNo = page
        logInfo.pageSize = pageSize
        await this.setState({
            logInfo,
        })
        this.getLogList()
    }
    openSqlModal = (data) => {
        this.setState({
            sqlModalVisible: true,
            sqlDetail: data,
        })
    }
    openProblemPage = (data) => {
        data.taskId = data.businessId
        this.props.addTab('执行记录-问题清单', { ...data, from: 'history' })
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const {
            taskInfo,
            queryInfo,
            userList,
            timeRange,
            tableData,
            logModalVisible,
            recordModalVisible,
            sqlModalVisible,
            logList,
            totalLog,
            logInfo,
            sqlInfo,
            logDetail,
            sqlDetail,
            recordList,
            recordLoading,
            recordTotal,
        } = this.state
        let { circleInfo, businessName, businessCount, qaCheckRangeView, name, datasourceName, databaseName } = this.pageParam
        return (
            <React.Fragment>
                <div className='techRule'>
                    <TableLayout
                        title={businessName + (name ? '（' + name + '）' : '')}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '检核周期',
                                                    content: <span dangerouslySetInnerHTML={{ __html: circleInfo }}></span>,
                                                },
                                                {
                                                    label: '检核范围',
                                                    content: qaCheckRangeView,
                                                },
                                                {
                                                    label: '规则数量',
                                                    content: businessCount,
                                                },
                                                {
                                                    label: '数据源／库',
                                                    content: datasourceName + '/' + databaseName,
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
                            return <ModuleTitle style={{ marginBottom: 15 }} title='执行列表' />
                        }}
                        editColumnProps={{
                            width: '16%',
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.openLogModal.bind(this, record)} key='detail'>
                                        日志
                                    </a>,
                                    <a disabled={record.status !== 3} onClick={this.openProblemPage.bind(this, record)} key='edit'>
                                        问题清单
                                    </a>,
                                ]
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
                                    {/*<RangePicker style={{ width: 350 }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />*/}
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='执行结果' style={{ width: 160 }}>
                                        {_.map(lastStatusMap, (node, index) => {
                                            return (
                                                <Option key={index} value={index}>
                                                    {node}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear showSearch optionFilterProp='title' placeholder='调度信息' value={queryInfo.executor} onChange={this.changeStatus.bind(this, 'executor')}>
                                        {userList.map((item) => {
                                            return (
                                                <Select.Option title={item} key={item} value={item}>
                                                    {item}
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
                                sorter: sorter || {},
                            })
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        className: 'logDrawer',
                        title: '日志详情',
                        width: 640,
                        visible: logModalVisible,
                        onClose: this.cancel,
                        maskClosable: true,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Pagination
                                    // showSizeChanger={true}
                                    showQuickJumper={true}
                                    onChange={this.changeLogPage}
                                    showTotal={(total) => `总数 ${total} 条`}
                                    current={logInfo.pageNo}
                                    pageSize={logInfo.pageSize}
                                    total={totalLog}
                                />
                            </React.Fragment>
                        )
                    }}
                >
                    {logModalVisible && (
                        <React.Fragment>
                            <div>
                                <Alert
                                    message={this.getStatusLabel(logDetail.status)}
                                    description={
                                        logDetail.status == 3 || logDetail.status == 4
                                            ? '执行时间：' +
                                              moment(logDetail.startTime).format('YYYY-MM-DD HH:mm:ss') +
                                              ' 至 ' +
                                              moment(logDetail.finishTime).format('YYYY-MM-DD HH:mm:ss') +
                                              '，耗时 ' +
                                              parseFloat((parseInt(logDetail.useTime) / 1000).toFixed(3)) +
                                              's'
                                            : ''
                                    }
                                    type={logDetail.status == 3 ? 'success' : logDetail.status == 4 ? 'error' : 'warning'}
                                    showIcon
                                    icon={
                                        <LegacyIcon
                                            type={logDetail.status == 3 ? 'check-circle' : 'info-circle'}
                                            theme='filled'
                                            style={{ color: logDetail.status == 3 ? '#339933' : logDetail.status == 4 ? '#CC0000' : '#faad14', width: 14, marginRight: 8 }}
                                        />
                                    }
                                />
                                <div className='logArea'>
                                    {logList.map((item) => {
                                        return (
                                            <div className='logItem'>
                                                <div className='logTime'>{moment(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div className='logContent'>{item.description}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        className: 'recordDrawer',
                        title: '执行规则记录',
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
                                                    placeholder='请输入字段／规则名称'
                                                />
                                                <Select allowClear onChange={this.changeSqlStatus} value={sqlInfo.status} placeholder='执行结果' style={{ width: 160, marginRight: 8 }}>
                                                    {_.map(lastStatusMap, (node, index) => {
                                                        return (
                                                            <Option key={index} value={index}>
                                                                {node}
                                                            </Option>
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
                <Modal width={640} className='sqlModal' title='SQL查看' visible={sqlModalVisible} onCancel={this.sqlCancel} footer={null}>
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
            </React.Fragment>
        )
    }
}
