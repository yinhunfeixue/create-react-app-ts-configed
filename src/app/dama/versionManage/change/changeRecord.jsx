
// 变更历史记录
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Divider, DatePicker, Checkbox } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import './index.less'
import moment from 'moment'
import { getLatestDiff, domainTypes } from 'app_api/autoManage'

const { Option } = Select
const { RangePicker } = DatePicker;


export default class ChangeManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            typeList: [],
            timeRange: []
        }
        this.columns = [
            {
                title: '数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
                render: (text, record, index) =>
                    text ? (<Tooltip placement='topLeft' title={text}><span className='LineClamp'>
                            {
                                record.selfSubs ? <IconFont style={{marginRight: 8}} type='icon-suo'/> : null
                            }
                        {text}</span></Tooltip>)
                        : (<EmptyLabel />)
            },
            {
                title: '最新变更时间',
                dataIndex: 'date',
                key: 'date',
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
                title: '元数据类型',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.type ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.type}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>表</div>
                                        <div>字段</div>
                                        <div>代码项</div>
                                        <div>代码值</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '新增',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.type ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.type == '表' ? record.tableCreated : (this.state.queryInfo.type == '字段' ? record.columnCreated : (this.state.queryInfo.type == '代码项' ? record.codeCreated : record.valueCreated))}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.tableCreated}</div>
                                        <div>{record.columnCreated}</div>
                                        <div>{record.codeCreated}</div>
                                        <div>{record.valueCreated}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '删除',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.type ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.type == '表' ? record.tableDeleted : (this.state.queryInfo.type == '字段' ? record.columnDeleted : (this.state.queryInfo.type == '代码项' ? record.codeDeleted : record.valueDeleted))}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.tableDeleted}</div>
                                        <div>{record.columnDeleted}</div>
                                        <div>{record.codeDeleted}</div>
                                        <div>{record.valueDeleted}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '修改',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.type ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.type == '表' ? record.tableUpdated : (this.state.queryInfo.type == '字段' ? record.columnUpdated : (this.state.queryInfo.type == '代码项' ? record.codeUpdated : record.valueUpdated))}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.tableUpdated}</div>
                                        <div>{record.columnUpdated}</div>
                                        <div>{record.codeUpdated}</div>
                                        <div>{record.valueUpdated}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 160,
                render: (text, record, index) => {
                    return <span>
                            <a onClick={this.openDetailPage.bind(this, record)}>详情</a>
                        </span>
                }
            },
        ]
    }
    componentWillMount = () => {
        let { queryInfo } = this.state
        if (this.pageParams.keyword) {
            queryInfo.keyword = this.pageParams.keyword
            this.setState({
                queryInfo
            })
        }
        this.getTypeList()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTypeList = async () => {
        let res = await domainTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            keyword: this.pageParams.keyword,
            datasourceId: this.pageParams.datasourceId,
            groupByDs: false,
        }
        let res = await getLatestDiff(query)
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
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
        })
        if (!e.target.value) {
            this.search()
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
            timeRange: []
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
    onChangePicker = async (dates, dateStrings) => {
        console.log(dateStrings)
        let { queryInfo } = this.state
        queryInfo.dateMin = dateStrings[0]
        queryInfo.dateMax = dateStrings[1]
        await this.setState({
            timeRange: dates,
            queryInfo
        })
        this.search()
    }
    openDetailPage = (data) => {
        data.from = 'change'
        this.props.addTab('变更结果', {...data})
    }
    render() {
        const {
            queryInfo,
            tableData,
            typeList,
            timeRange
        } = this.state
        return (
            <React.Fragment>
                <div className='changeManage'>
                    <RichTableLayout
                        title='变更记录'
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                            extraTableProps: {
                                bordered: true
                            }
                        }}
                        editColumnProps={{
                            hidden: true
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入数据源'
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'type'
                                        )}
                                        value={queryInfo.type}
                                        placeholder='元数据类型'
                                    >
                                        {typeList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.name}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <RangePicker style={{ width: 280 }} value={timeRange} allowClear={true} separator='-' onChange={this.onChangePicker} />
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                }
                            })
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
