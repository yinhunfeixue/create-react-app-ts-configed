import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import Module from '@/component/Module'
import { Divider, Input, Tabs, Tooltip } from 'antd'
import { atomicMetricsSearch, derivativeMetricsSearch } from 'app_api/termApi'
import DeriveDetailDrawer from 'app_page/dama/newIndexma/deriveDetailDrawer'
import React, { Component } from 'react'
const TabPane = Tabs.TabPane
export default class RelateIndexma extends Component {
    constructor(props) {
        super(props)
        this.state = {
            changeTableData: [],
            type: 1,
            queryInfo: {
                keyword: '',
            },
        }
        this.atomColumns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 160,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '来源字段',
                dataIndex: 'factColumnName',
                key: 'factColumnName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '计算逻辑',
                dataIndex: 'factColumnName',
                key: 'factColumnName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + this.getFunction(record.function)}>
                            {text}
                            {this.getFunction(record.function)}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.columns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 160,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '原子指标',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.atomicMetricsDTO ? record.atomicMetricsDTO.chineseName : ''}>
                        {record.atomicMetricsDTO ? record.atomicMetricsDTO.chineseName : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '统计粒度',
                dataIndex: 'statisticalColumnText',
                key: 'statisticalColumnText',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '统计周期',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.statisticalPeriodDTO ? record.statisticalPeriodDTO.chineseName : <EmptyLabel />}>
                        {record.statisticalPeriodDTO ? record.statisticalPeriodDTO.chineseName : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '业务限定',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.businessLimitDTO ? record.businessLimitDTO.chineseName : <EmptyLabel />}>
                        {record.businessLimitDTO ? record.businessLimitDTO.chineseName : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '口径说明',
                dataIndex: 'description',
                key: 'description',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList()
    }
    openAtomDetail = (data) => {
        this.deriveDrawer.openAtomDetail(data.id)
    }
    openIndexma = (data) => {
        this.deriveDrawer.openDetailModal(data)
    }
    getFunction = (value) => {
        if (value == 'sum') {
            return '求和'
        } else if (value == 'average') {
            return '平均值'
        } else if (value == 'accumulate') {
            return '累计值'
        } else if (value == 'count') {
            return '不去重计数'
        } else if (value == 'dist_count') {
            return '去重计数'
        } else if (value == 'max') {
            return '最大值'
        } else if (value == 'min') {
            return '最小值'
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: params.keyword,
            sortType: params.type == 1 ? 1 : undefined,
            factAssetIds: [this.props.location.state.id],
            needDetail: params.type == 2 ? true : undefined,
        }
        let res = {}
        if (params.type == 1) {
            res = await atomicMetricsSearch(query)
        } else {
            res = await derivativeMetricsSearch(query)
        }
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
            }
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
    }
    changeType = async (value) => {
        let { queryInfo } = this.state
        queryInfo.keyword = ''
        await this.setState({
            type: value,
            queryInfo,
        })
        this.getTableList()
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
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        this.getTableList()
    }

    render() {
        const { atomKey = '', searchKey = '' } = this.state
        return (
            <React.Fragment>
                <Module title='原子指标'>
                    <RichTableLayout
                        renderSearch={(controller) => {
                            this.atomController = controller
                            return (
                                <Input.Search
                                    allowClear
                                    onSearch={(value) => {
                                        this.setState(
                                            {
                                                atomKey: value,
                                            },
                                            () => this.atomController.reset()
                                        )
                                    }}
                                    placeholder='请输入指标名称'
                                />
                            )
                        }}
                        smallLayout
                        disabledDefaultFooter
                        tableProps={{
                            columns: this.atomColumns,
                        }}
                        requestListFunction={async (page, pageSize) => {
                            return await this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                                type: 1,
                                keyword: atomKey,
                            })
                        }}
                        editColumnProps={{
                            width: 60,
                            createEditColumnElements: (_, record) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '详情',
                                        onClick: this.openAtomDetail.bind(this, record),
                                    },
                                ])
                            },
                        }}
                    />
                </Module>
                <Divider />
                <Module title='衍生指标'>
                    <RichTableLayout
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <Input.Search
                                    allowClear
                                    onSearch={(value) => {
                                        this.setState(
                                            {
                                                searchKey: value,
                                            },
                                            () => this.controller.reset()
                                        )
                                    }}
                                    placeholder='请输入指标名称'
                                />
                            )
                        }}
                        smallLayout
                        disabledDefaultFooter
                        tableProps={{
                            columns: this.columns,
                        }}
                        requestListFunction={async (page, pageSize) => {
                            return await this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                                type: 2,
                                keyword: searchKey,
                            })
                        }}
                        editColumnProps={{
                            width: 60,
                            createEditColumnElements: (_, record) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '详情',
                                        onClick: this.openIndexma.bind(this, record),
                                    },
                                ])
                            },
                        }}
                    />
                </Module>
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}
