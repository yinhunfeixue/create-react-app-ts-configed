import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { Button, Divider, Form, Input, message, Select, Table, Tooltip } from 'antd'
import { getCheckHistoryStatisticsData, getCheckResultById, getCheckResultItemList, getCheckResultList, getSearchCondition4CheckResultList, getTechRuleById } from 'app_api/examinationApi'
import moment from 'moment'
import React, { Component } from 'react'
import RuleDetailDrawer from '../component/ruleDetailDrawer'
import '../index.less'

export default class TaskDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnInfo: {},
            queryInfo: {
                keyword: '',
            },
            errorQuery: {
                pageNo: 1,
                pageSize: 100,
            },
            errorTotal: 0,
            tableData: [],
            modalVisible: false,
            typeList: [],
            statusList: [],
            errorData: [],
            tableLoading: false,
            ruleDetail: {},
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 150,
                fixed: 'left',
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
                    text ? (
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
                width: 140,
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
                title: '数据总量',
                dataIndex: 'checkCount',
                key: 'checkCount',
                width: 120,
                sorter: true,
                align: 'right',
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
                title: '问题数量',
                dataIndex: 'problemCount',
                key: 'problemCount',
                width: 120,
                sorter: true,
                align: 'right',
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
                title: '出错率',
                dataIndex: 'errorRate',
                key: 'errorRate',
                width: 100,
                align: 'right',
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '阈值',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 100,
                align: 'right',
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '检核结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    const iconStyle = { color: text == 1 ? '#339933' : '#CC0000', width: 14, marginRight: 8 }
                    return (
                        <div>
                            {text == 1 ? <CheckCircleFilled style={iconStyle} /> : <InfoCircleFilled style={iconStyle} />}
                            <span>{text == 1 ? '通过' : '未通过'}</span>
                        </div>
                    )
                },
            },
            {
                title: '问题级别',
                dataIndex: 'severityLevelDesc',
                key: 'severityLevelDesc',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.errorColumn = []
    }
    componentWillMount = async () => {
        this.getSearchCondition()
        this.getDetail()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getDetail = async () => {
        let query = {}
        if (this.pageParams.from == 'history') {
            query.taskId = this.pageParams.taskId
        } else {
            query.taskId = this.pageParams.id
        }
        let res = await getCheckHistoryStatisticsData(query)
        if (res.code == 200) {
            this.setState({
                ruleDetail: res.data.qaTaskDTO,
            })
            ProjectUtil.setDocumentTitle(res.data.qaTaskDTO.name)
        }
    }
    getSearchCondition = async () => {
        let query = {}
        if (this.pageParams.from == 'history') {
            query.jobTaskId = this.pageParams.id
        } else {
            query.taskId = this.pageParams.id
        }
        let res = await getSearchCondition4CheckResultList(query)
        if (res.code == 200) {
            this.setState({
                typeList: res.data.ruleTypes,
                statusList: res.data.checkResults,
            })
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
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
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
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            checkCountOrder: params.sorter.field == 'checkCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            errorRateOrder: params.sorter.field == 'errorRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            passRateOrder: params.sorter.field == 'passRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            problemCountOrder: params.sorter.field == 'problemCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        if (this.pageParams.from == 'history') {
            query.jobTaskId = this.pageParams.id
        } else {
            query.taskId = this.pageParams.id
        }
        let res = await getCheckResultList(query)
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
    getErrorList = async () => {
        let { errorQuery, errorData, columnInfo } = this.state
        let resp = await getCheckResultById({ taskResultId: columnInfo.id })
        if (resp.code == 200) {
            this.setState({ tableLoading: true })
            let res = await getCheckResultItemList(errorQuery)
            this.setState({ tableLoading: false })
            if (res.code == 200) {
                let columns = [
                    {
                        dataIndex: 'key',
                        key: 'key',
                        title: '序号',
                        width: 60,
                        render: (text, record, index) => <span>{index + 1}</span>,
                    },
                ]
                resp.data.checkRowHead.map((item, index) => {
                    columns.push({
                        dataIndex: item,
                        key: item,
                        title: resp.data.checkLabelHead[index],
                        ellipsis: true,
                        render: (text, record) => (
                            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: record.checkRowInfo ? record.checkRowInfo[item] : '' }} />}>
                                <span style={{ color: columnInfo.columnName == item ? '#CC0000' : '' }} dangerouslySetInnerHTML={{ __html: record.checkRowInfo ? record.checkRowInfo[item] : '' }} />
                            </Tooltip>
                        ),
                    })
                })

                this.errorColumn = columns
                res.data.map((item, index) => {
                    item.id = index
                })
                this.setState({
                    errorData: res.data,
                    errorTotal: res.total,
                })
            }
        }
    }
    getRuleDetail = async (data) => {
        let { errorQuery } = this.state
        errorQuery.taskResultId = data.id
        errorQuery.pageNo = 1
        await this.setState({
            columnInfo: data,
            modalVisible: true,
            errorQuery,
        })
        this.getErrorList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    openTechRuleDetail = async (data) => {
        let res = await getTechRuleById({ id: data.ruleId })
        if (res.code == 200) {
            this.ruleDetailDrawer && this.ruleDetailDrawer.openModal(res.data)
        }
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { queryInfo, typeList, modalVisible, columnInfo, errorData, tableLoading, errorTotal, statusList, ruleDetail } = this.state
        return (
            <React.Fragment>
                <div className='techRule'>
                    <TableLayout
                        title={ruleDetail.name + (ruleDetail.tableNameEn ? '（' + ruleDetail.tableNameEn + '）' : '')}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '适用业务',
                                                    content: ruleDetail.bizType,
                                                },
                                                {
                                                    label: '检核范围',
                                                    content: ruleDetail.checkRangeView,
                                                },
                                                {
                                                    label: '最后检核时间',
                                                    content: moment(ruleDetail.lastCheckTime).format('YYYY-MM-DD HH:mm:ss'),
                                                },
                                                {
                                                    label: '负责人',
                                                    content: ruleDetail.managerName,
                                                },
                                                {
                                                    label: '来源',
                                                    content: ruleDetail.datasourceNameEn + '／' + ruleDetail.databaseNameEn,
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
                            return <ModuleTitle style={{ marginBottom: 15 }} title='规则列表' />
                        }}
                        editColumnProps={{
                            width: 180,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.getRuleDetail.bind(this, record)} key='detail'>
                                        错误记录
                                    </a>,
                                    <a onClick={this.openTechRuleDetail.bind(this, record)} key='detail'>
                                        技术详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search style={{ width: 280 }} allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入字段／规则名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'ruleTypeId')} value={queryInfo.ruleTypeId} placeholder='规则类型' style={{ width: 160 }}>
                                        {typeList.map((item) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'checkResult')} value={queryInfo.checkResult} placeholder='检核结果' style={{ width: 160 }}>
                                        {statusList.map((item) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
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
                        className: 'errorRecordDrawer',
                        title: '错误记录',
                        width: 480,
                        visible: modalVisible,
                        onClose: this.cancel,
                    }}
                >
                    {modalVisible && (
                        <React.Fragment>
                            <h4>字段信息</h4>
                            <Form className='MiniForm' layout='inline'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '检核字段',
                                        content: columnInfo.columnName,
                                    },
                                    {
                                        label: '规则名称',
                                        content: columnInfo.ruleName,
                                    },
                                    {
                                        label: '检核表',
                                        content: columnInfo.tableName,
                                    },
                                ])}
                            </Form>
                            <Divider />
                            <h4>
                                问题数据（{errorData.length}）{errorTotal > 100 ? <span style={{ float: 'right', color: '#5E6266', fontWeight: '400' }}>当前仅展示100条错误记录</span> : null}
                            </h4>
                            <Table loading={tableLoading} columns={this.errorColumn} dataSource={errorData} rowKey='id' pagination={false} />
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <RuleDetailDrawer
                    ref={(dom) => {
                        this.ruleDetailDrawer = dom
                    }}
                />
            </React.Fragment>
        )
    }
}
