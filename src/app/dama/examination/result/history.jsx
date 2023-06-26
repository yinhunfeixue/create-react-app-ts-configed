import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Tooltip } from 'antd'
import { getCheckHistoryItemList, getCheckHistoryStatisticsData } from 'app_api/examinationApi'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'

export default class ResultHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            errorRateAvg: 0,
            passRateAvg: 0,
            tableData: [],
        }
        this.columns = [
            {
                title: '执行时间',
                dataIndex: 'startTime',
                key: 'startTime',
                sorter: true,
                minWidth: 220,
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
                title: '检核规则',
                dataIndex: 'ruleCount',
                key: 'ruleCount',
                width: 150,
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
                title: '规则通过率',
                dataIndex: 'passRate',
                key: 'passRate',
                align: 'right',
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '规则出错率',
                dataIndex: 'errorRate',
                key: 'errorRate',
                align: 'right',
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = async () => {
        this.getCheckHistoryStatistics()
        ProjectUtil.setDocumentTitle(this.pageParam.name)
    }
    getCheckHistoryStatistics = async () => {
        let res = await getCheckHistoryStatisticsData({ taskId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                errorRateAvg: res.data.errorRateAvg,
                passRateAvg: res.data.passRateAvg,
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
            taskId: this.props.location.state.id,
            execTimeOrder: params.sorter.field == 'startTime' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            errorRateOrder: params.sorter.field == 'errorRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            passRateOrder: params.sorter.field == 'passRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            ruleCountOrder: params.sorter.field == 'ruleCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await getCheckHistoryItemList(query)
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
    getRuleDetail = async (data) => {
        data.id = data.jobTaskId
        this.props.addTab('问题清单', { ...data, from: 'history' })
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { queryInfo, errorRateAvg, passRateAvg } = this.state
        let { bizType, checkRangeView, name, tableNameEn } = this.pageParam
        return (
            <React.Fragment>
                <div className='techRule noSearchArea'>
                    <TableLayout
                        title={name + (tableNameEn ? '（' + tableNameEn + '）' : '')}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '适用业务',
                                                    content: bizType,
                                                },
                                                {
                                                    label: '检核范围',
                                                    content: checkRangeView,
                                                },
                                                {
                                                    label: '平均通过率',
                                                    content: passRateAvg + '%',
                                                },
                                                {
                                                    label: '平均出错率',
                                                    content: errorRateAvg + '%',
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
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a disabled={record.passRate == 100} onClick={this.getRuleDetail.bind(this, record)} key='detail'>
                                        问题清单
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
            </React.Fragment>
        )
    }
}
