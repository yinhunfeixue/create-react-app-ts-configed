import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select } from 'antd'
import {
    getResultSearchCondition, resultList
} from 'app_api/examinationApi'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select

export default class Task extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            bizList: [],
            userList: [],
            tableData: [],
        }
        this.columns = [
            {
                title: '任务名称（表名）',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                width: 240,
                render: (text, record) =>
                    <Tooltip placement='topLeft' title={record.datasourceNameEn + '/' + record.databaseNameEn + '/' + text}>
                        <div className='tableLabel'>
                            <a onClick={this.openDetailPage.bind(this, record)}>{text}</a>
                            <div>{record.datasourceNameEn}/{record.databaseNameEn}</div>
                        </div>
                    </Tooltip>
            },
            {
                title: '适用业务',
                dataIndex: 'bizType',
                key: 'bizType',
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
                title: '规则数量',
                dataIndex: 'ruleCount',
                key: 'ruleCount',
                width: 120,
                sorter: true,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则通过率',
                dataIndex: 'lastPassRate',
                key: 'lastPassRate',
                width: 130,
                sorter: true,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip title={text + '%'}>{text}%</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '核验范围',
                dataIndex: 'checkRangeView',
                key: 'checkRangeView',
                width: 220,
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
                title: '最后核验时间',
                dataIndex: 'lastCheckTime',
                key: 'lastCheckTime',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '负责人',
                dataIndex: 'managerName',
                key: 'managerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
    }
    getSearchCondition = async () => {
        let res = await getResultSearchCondition()
        if (res.code == 200) {
            this.setState({
                bizList: res.data.bizTypeList,
                userList: res.data.managerNameList
            })
        }
    }
    openDetailPage = (data) => {
        data.useBusinessId = true
        data.qaTableId = data.tableId
        data.businessName = data.tableNameEn
        this.props.addTab('检核任务详情', {...data})
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ruleCountOrder: params.sorter.field == 'ruleCount' ? params.sorter.order == 'ascend'?1:(params.sorter.order == 'descend'?2:undefined): undefined,
            passRateOrder: params.sorter.field == 'passRate' ? params.sorter.order == 'ascend'?1:(params.sorter.order == 'descend'?2:undefined): undefined,
            ...queryInfo,
        }
        let res = await resultList(query)
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
            queryInfo
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openProblemPage = (data) => {
        this.props.addTab('问题清单', {...data})
    }
    openHistoryPage = (data) => {
        this.props.addTab('结果历史', {...data})
    }
    render() {
        const {
            queryInfo,
            bizList,
            tableData,
            userList
        } = this.state
        return (
            <React.Fragment>
                <div className='renderTask'>
                    <RichTableLayout
                        title='检核结果'
                        editColumnProps={{
                            width: 180,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a
                                        onClick={this.openProblemPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        问题清单
                                    </a>,
                                    <a
                                        onClick={this.openHistoryPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        结果历史
                                    </a>
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'tableNameEn',
                            dataSource: tableData
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        style={{ width: 280 }}
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入任务／表名称'
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'bizType'
                                        )}
                                        value={queryInfo.bizType}
                                        placeholder='业务标识'
                                        style={{ width: 160 }}
                                    >
                                        {bizList.map((item) => {
                                            return (
                                                <Option value={item} key={item}>
                                                    {item}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'managerName'
                                        )}
                                        value={queryInfo.managerName}
                                        placeholder='负责人'
                                        style={{ width: 160 }}
                                    >
                                        {userList.map((item) => {
                                            return (
                                                <Select.Option key={item} value={item}>
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
                                sorter: sorter || {}
                            })
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
