// 错误结果
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Divider, Input, Tooltip, Form, Select, Spin, DatePicker, Cascader, Modal, message, Switch, Rate, Tabs } from 'antd'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import React, { Component } from 'react'
import Cache from 'app_utils/cache'
import '../../index.less'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import { resultList, getCheckResultList, postDeleteTaskJob, postChangeTaskJobStatu, queryHistoryRecords, queryHistoryRecordDetails, checkRuleTree, queryRuleOverview } from 'app_api/examinationApi'
import _ from 'underscore'
import store from '../../store'
import moment from 'moment'
import LogDrawer from '../logDrawer'
import AddRuleDrawer from '../checkRule/addRuleDrawer'
import ErrorLogDrawer from './errorLogDrawer'
import TableResultDrawer from './tableResultDrawer'

const { RangePicker } = DatePicker
const { Option } = Select
const TabPane = Tabs.TabPane

export default class HistoryRecordPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            timeRange: [],
            startTime: '',
            endTime: '',
            tableData: [],
            tableRuleData: [],
            total: 0,
            sqlDetail: {},
            sqlModalVisible: false,
            selectedTable: {},
            showErrorRule: false,
            errorTableData: [],
            selectedRecord: {},
            tabValue: '0',
            tableRuleInfo: {
                tableRuleNum: 0,
                tableRuleWrongNum: 0
            },
            columnRuleInfo: {
                columnRuleNum: 0,
                columnRuleWrongNum: 0
            },
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 100,
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
                title: '问题级别',
                dataIndex: 'severityLevel',
                key: 'severityLevel',
                width: 100,
                render: (text, record) => (text ? <span>{text == 1 ? '普通' : '严重'}</span> : <EmptyLabel />),
            },
            {
                title: '数据总量',
                dataIndex: 'totalCount',
                key: 'totalCount',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '问题总量',
                dataIndex: 'wrongCount',
                key: 'wrongCount',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '出错率',
                dataIndex: 'errorRate',
                key: 'errorRate',
                width: 100,
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '容错率',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 100,
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '检核结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    if (text) {
                        return <StatusLabel type='success' message='通过' />
                    } else {
                        return <StatusLabel type='error' message='未通过' />
                    }
                },
            },
        ]
        this.tableColumns = [
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
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
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
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
                title: '问题级别',
                dataIndex: 'severityLevel',
                key: 'severityLevel',
                width: 100,
                render: (text, record) => (text ? <span>{text == 1 ? '普通' : '严重'}</span> : <EmptyLabel />),
            },
            {
                title: '检核结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    if (text) {
                        return <StatusLabel type='success' message='通过' />
                    } else {
                        return <StatusLabel type='error' message='未通过' />
                    }
                },
            },
        ]
        this.recordColumns = [
            {
                title: '最新检核时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
                width: 130,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>
                            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '检核范围',
                dataIndex: 'checkRangeTimeView',
                key: 'checkRangeTimeView',
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
                dataIndex: 'columnInfo',
                key: 'columnInfo',
                title: '字段',
                className: 'borderBottom',
                children:  [
                    {
                        title: '检核规则',
                        dataIndex: 'techRuleCount',
                        key: 'techRuleCount',
                        width: 120,
                        sorter: true,
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
                        title: '规则通过率',
                        dataIndex: 'rulePassRate',
                        key: 'rulePassRate',
                        sorter: true,
                        width: 130,
                        render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
                    },
                    {
                        title: '平均出错率',
                        dataIndex: 'averageFailedRate',
                        key: 'averageFailedRate',
                        sorter: true,
                        width: 130,
                        render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
                    },
                ]
            },
            {
                dataIndex: 'tableInfo',
                key: 'tableInfo',
                title: '表',
                className: 'borderBottom',
                children: [
                    {
                        title: '检核规则',
                        dataIndex: 'tableRuleCount',
                        key: 'tableRuleCount',
                        width: 120,
                        sorter: true,
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
                        title: '规则通过率',
                        dataIndex: 'tableRulePassRate',
                        key: 'tableRulePassRate',
                        sorter: true,
                        width: 130,
                        render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
                    }
                ]
            },
        ]
    }
    componentDidMount = () => {}
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    onSelectTable = async (data) => {
        await this.setState({
            selectedTable: { ...data },
            showErrorRule: false,
        })
        this.reset()
        this.getQueryRuleOverview()
        this.onChangeTab('0')
    }
    getTableRuleList = async (params = {}) => {
        let { selectedTable, selectedRecord } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            tsTaskId: selectedRecord.tsTaskId,
            jobId: selectedTaskInfo.jobId,
            ruleLevel: 1
        }
        let res = await queryHistoryRecordDetails(query)
        if (res.code == 200) {
            this.setState({
                tableRuleData: res.data,
                // total: res.total,
            })
            return {
                total: res.total ? res.total : res.data.length,
                dataSource: res.data,
            }
        }
        return {
            total: 1,
            dataSource: [],
        }
    }
    getTableList = async (params = {}) => {
        let { selectedTable, queryInfo, selectedRecord, tabValue } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            tsTaskId: selectedRecord.tsTaskId,
            jobId: selectedTaskInfo.jobId,
            ...queryInfo,
            ruleLevel: 0,
            orderByTotalCount: params.sorter.field == 'totalCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByWrongCount: params.sorter.field == 'wrongCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByErrorRate: params.sorter.field == 'errorRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPassRate: params.sorter.field == 'passRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await queryHistoryRecordDetails(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total ? res.total : res.data.length,
            })
            return {
                total: res.total ? res.total : res.data.length,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
            timeRange: [],
            startTime: '',
            endTime: '',
        })
        this.search()
    }
    openErrorRulePage = (value) => {
        this.setState({
            showErrorRule: value,
        })
    }
    testRun = () => {}
    deleteRule = (data) => {
        let that = this
        Modal.confirm({
            title: '删除规则',
            content: '您确定删除检核规则吗？',
            okText: '删除',
            okButtonProps: {
                danger: true,
            },
            cancelText: '取消',
            async onOk() {
                let res = await postDeleteTaskJob({ id: data.id })
                if (res.code == 200) {
                    message.success('操作成功')
                    that.search()
                }
            },
        })
    }
    openEditModal = (data, type) => {
        this.addRuleDrawer && this.addRuleDrawer.openModal(type, data)
    }
    getQueryRuleOverview = async () => {
        const { selectedTable } = store
        let { tableRuleInfo, columnRuleInfo } = this.state
        if (!selectedTable.tableId) {
            return
        }
        let query = {
            tableId: selectedTable.tableId,
            tsTaskId: selectedTable.lastCheckTaskId
        }
        let res = await queryRuleOverview(query)
        if (res.code == 200) {
            tableRuleInfo = {
                tableRuleNum: res.data.tableRuleNum,
                tableRuleWrongNum: res.data.tableRuleWrongNum
            }
            columnRuleInfo = {
                columnRuleNum: res.data.columnRuleNum,
                columnRuleWrongNum: res.data.columnRuleWrongNum
            }
            this.setState({
                tableRuleInfo,
                columnRuleInfo
            })
        }
    }
    getRecordTableList = async (params = {}) => {
        let { startTime, endTime, selectedTable } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            jobId: selectedTaskInfo.jobId,
            startTime,
            endTime,
            orderByRuleCount: params.sorter.field == 'techRuleCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByAverageFailedRate: params.sorter.field == 'averageFailedRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPassRate: params.sorter.field == 'rulePassRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByTableRuleCount: params.sorter.field == 'tableRuleCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByTablePassRate: params.sorter.field == 'tableRulePassRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await queryHistoryRecords(query)
        if (res.code == 200) {
            return {
                total: res.total ? res.total : res.data.length,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    onChangePicker = async (dates, dateStrings) => {
        await this.setState({
            timeRange: dates,
            startTime: dateStrings[0],
            endTime: dateStrings[1],
        })
        this.search()
    }
    openErrorLogModal = (data) => {
        this.errorLogDrawer && this.errorLogDrawer.openModal(data)
    }
    openTableResult = async (data) => {
        await this.setState({
            selectedRecord: { ...data },
        })
        this.openErrorRulePage(true)
    }
    onChangeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        this.reset()
    }
    openTableResultModal = (data) => {
        this.tableResultDrawer && this.tableResultDrawer.openModal(data)
    }
    render() {
        let { columnRuleInfo, tableRuleInfo, sqlModalVisible, sqlDetail, tableData, tableRuleData,  total,tabValue, selectedTable, showErrorRule, queryInfo, timeRange, selectedRecord } = this.state
        return (
            <div>
                {!showErrorRule ? (
                    <div>
                        <div className='tableInfo historyTable'>
                            <ModuleTitle title='检核历史记录' />
                            <RichTableLayout
                                disabledDefaultFooter
                                smallLayout
                                editColumnProps={{
                                    width: 120,
                                    createEditColumnElements: (_, record) => {
                                        return [
                                            <a onClick={this.openTableResult.bind(this, record)} key='edit'>
                                                查看结果
                                            </a>,
                                        ]
                                    },
                                }}
                                tableProps={{
                                    columns: this.recordColumns,
                                    key: 'tsTaskId',
                                    extraTableProps: {
                                        bordered: true,
                                        key: selectedTable.tableId,
                                        scroll: {
                                            x: 1300,
                                        },
                                    },
                                }}
                                renderSearch={(controller) => {
                                    this.controller = controller
                                    return (
                                        <React.Fragment>
                                            <RangePicker style={{ width: 280 }} value={timeRange} allowClear={true} separator='-' onChange={this.onChangePicker} />
                                        </React.Fragment>
                                    )
                                }}
                                requestListFunction={(page, pageSize, filter, sorter) => {
                                    return this.getRecordTableList({
                                        pagination: {
                                            page,
                                            page_size: pageSize,
                                        },
                                        sorter: sorter || {},
                                    })
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginTop: 18 }}>
                            <a onClick={this.openErrorRulePage.bind(this, false)}>
                                <span className='iconfont icon-zuo'></span>返回
                            </a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <span>历史记录</span>
                        </div>
                        <div className='tableInfo'>
                            <ModuleTitle title='执行参数' />
                            <div className='MiniForm Grid4'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '检核时间',
                                        content: selectedRecord.checkTime ? moment(selectedRecord.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
                                    },
                                    {
                                        label: '检核时间范围',
                                        content: selectedRecord.checkRangeTimeView,
                                    },
                                    {
                                        label: '执行结果',
                                        content: (
                                            <div>
                                                {selectedRecord.lastCheckStatus == 0 ? <StatusLabel type='info' message='新创建' /> : null}
                                                {selectedRecord.lastCheckStatus == 1 ? <StatusLabel type='warning' message='等待执行' /> : null}
                                                {selectedRecord.lastCheckStatus == 2 ? <StatusLabel type='loading' message='正在执行' /> : null}
                                                {selectedRecord.lastCheckStatus == 3 ? <StatusLabel type='success' message='执行成功' /> : null}
                                                {selectedRecord.lastCheckStatus == 4 ? <StatusLabel type='error' message='执行失败' /> : null}
                                                {selectedRecord.lastCheckStatus == 5 ? <StatusLabel type='info' message='系统中止' /> : null}
                                            </div>
                                        ),
                                    },
                                ])}
                            </div>
                        </div>
                        <div className='tableInfo errorPage'>
                            <ModuleTitle title='规则信息' />
                            <Tabs animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                <TabPane key='0' tab={
                                    <span>字段规则&nbsp;
                                        {
                                            columnRuleInfo.columnRuleWrongNum ?
                                                <span>
                                                    <span style={{ color: '#CC0000', marginLeft: '8px' }}>{columnRuleInfo.columnRuleWrongNum}</span>
                                                    <span style={{ margin: '0 2px' }}>/</span>
                                                </span>
                                                : null
                                        }
                                         {columnRuleInfo.columnRuleNum}
                                    </span>}>
                                  {
                                    tabValue == 0 ?
                                      <RichTableLayout
                                        disabledDefaultFooter
                                        smallLayout
                                        editColumnProps={{
                                          width: 120,
                                          createEditColumnElements: (_, record) => {
                                            return [
                                              <a onClick={this.openErrorLogModal.bind(this, record)} key='edit'>
                                                错误记录
                                              </a>,
                                            ]
                                          },
                                        }}
                                        tableProps={{
                                          columns: this.columns,
                                          key: 'taskResultId',
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
                                              <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入检核字段、规则名称' />
                                              <Select allowClear onChange={this.changeStatus.bind(this, 'severityLevel')} value={queryInfo.severityLevel} placeholder='问题级别'>
                                                <Option value={1} key={1}>
                                                  普通
                                                </Option>
                                                <Option value={2} key={2}>
                                                  严重
                                                </Option>
                                              </Select>
                                              <Select allowClear onChange={this.changeStatus.bind(this, 'checkResult')} value={queryInfo.checkResult} placeholder='检核结果'>
                                                <Option value={true} key={1}>
                                                  通过
                                                </Option>
                                                <Option value={false} key={0}>
                                                  未通过
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
                                            sorter: sorter || {},
                                          })
                                        }}
                                      />
                                      : null
                                  }
                                </TabPane>
                                <TabPane key='1' tab={
                                    <span>表规则&nbsp;
                                        {
                                            tableRuleInfo.tableRuleWrongNum ?
                                                <span>
                                                    <span style={{ color: '#CC0000', marginLeft: '8px' }}>{tableRuleInfo.tableRuleWrongNum}</span>
                                                    <span style={{ margin: '0 2px' }}>/</span>
                                                </span>
                                                : null
                                        }
                                         {tableRuleInfo.tableRuleNum}
                                    </span>
                                }>
                                  {
                                    tabValue == 1 ?
                                      <RichTableLayout
                                        disabledDefaultFooter
                                        smallLayout
                                        editColumnProps={{
                                          width: 120,
                                          createEditColumnElements: (_, record) => {
                                            return [
                                              <a onClick={this.openTableResultModal.bind(this, record)} key='edit'>
                                                检核结果
                                              </a>,
                                            ]
                                          },
                                        }}
                                        tableProps={{
                                          columns: this.tableColumns,
                                          key: 'taskResultId',
                                          dataSource: tableRuleData,
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
                                              <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入检核表、规则名称' />
                                              <Select allowClear onChange={this.changeStatus.bind(this, 'severityLevel')} value={queryInfo.severityLevel} placeholder='问题级别'>
                                                <Option value={1} key={1}>
                                                  普通
                                                </Option>
                                                <Option value={2} key={2}>
                                                  严重
                                                </Option>
                                              </Select>
                                              <Select allowClear onChange={this.changeStatus.bind(this, 'checkResult')} value={queryInfo.checkResult} placeholder='检核结果'>
                                                <Option value={true} key={1}>
                                                  通过
                                                </Option>
                                                <Option value={false} key={0}>
                                                  未通过
                                                </Option>
                                              </Select>
                                              <Button onClick={this.reset}>重置</Button>
                                            </React.Fragment>
                                          )
                                        }}
                                        requestListFunction={(page, pageSize, filter, sorter) => {
                                          return this.getTableRuleList({
                                            pagination: {
                                              page,
                                              page_size: pageSize,
                                            },
                                            sorter: sorter || {},
                                          })
                                        }}
                                      />
                                      : null
                                  }

                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                )}
                <AddRuleDrawer search={this.search} ref={(dom) => (this.addRuleDrawer = dom)} />
                <ErrorLogDrawer ref={(dom) => (this.errorLogDrawer = dom)} />
                <TableResultDrawer ref={(dom) => (this.tableResultDrawer = dom)} />
                <Modal width={640} className='sqlModal' title='问题SQL' visible={sqlModalVisible} onCancel={this.cancel} footer={null}>
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
