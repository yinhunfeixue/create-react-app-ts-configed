import EmptyLabel from '@/component/EmptyLabel'
import { Button, Input, message, Select, Table, Tooltip } from 'antd'
import { metricsProcess, metricsSummaryDateColumn, summaryMetricColumns, versionFilter } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import React, { Component } from 'react'
import DeriveDetailDrawer from '../../newIndexma/deriveDetailDrawer'

export default class AssetColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            queryInfo: {
                keyword: '',
                versionNum: undefined,
                bizProcessId: undefined,
            },
            partitionData: [],
            tableLoading: false,
            loading: false,
            processList: [],
            versionList: [],
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 48,
            },
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div
                                onClick={this.openIndexma.bind(this, record)}
                                style={{ color: '#1890ff', cursor: 'pointer', width: '90%', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {text}
                            </div>
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
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 80,
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
                dataIndex: 'atomicMetricsChineseName',
                key: 'atomicMetricsChineseName',
                width: 120,
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
                dataIndex: 'statisticalPeriodChineseName',
                key: 'statisticalPeriodChineseName',
                width: 120,
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
                title: '业务限定',
                dataIndex: 'bizLimitChineseName',
                key: 'bizLimitChineseName',
                width: 120,
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
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                width: 100,
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
                title: '来源事实',
                dataIndex: 'factAssetsName',
                key: 'factAssetsName',
                width: 100,
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
                title: '版本信息',
                dataIndex: 'versionDesc',
                key: 'versionDesc',
                width: 150,
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
        this.partitionColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 48,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '字段名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '字段英文名',
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
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
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
    componentDidMount = () => {
        this.getTableList()
        this.getDateColumn()
        this.getProcessList()
        this.getVersionFilter()
    }
    openIndexma = (data) => {
        this.deriveDrawer.openDetailModal(data)
    }
    getDateColumn = async () => {
        this.setState({ tableLoading: true })
        let res = await metricsSummaryDateColumn({ id: this.props.location.state.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            this.setState({
                partitionData: res.data,
            })
        }
    }
    getVersionFilter = async () => {
        let res = await versionFilter({ summaryId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                versionList: res.data,
            })
        }
    }
    getProcessList = async () => {
        let res = await metricsProcess({ summaryId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                processList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...this.state.queryInfo,
            summaryId: this.props.location.state.id,
        }
        this.setState({ loading: true })
        let res = await summaryMetricColumns(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            versionNum: undefined,
            bizProcessId: undefined,
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeProcess = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.getTableList()
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
        const { loading, tableData, partitionData, tableLoading, processList, queryInfo, versionList } = this.state
        return (
            <div>
                <div className='searchArea'>
                    <Tooltip placement='topLeft' title={this.props.statisticalColumn}>
                        <div className='statisArea'>
                            <span style={{ color: '#666' }}>统计粒度：</span>
                            {this.props.statisticalColumn || <EmptyLabel />}
                        </div>
                    </Tooltip>
                    <div style={{ float: 'right' }}>
                        <Select allowClear onChange={this.changeProcess.bind(this, 'versionNum')} value={queryInfo.versionNum} style={{ width: '120px', marginRight: '8px' }} placeholder='版本信息'>
                            {versionList.map((item) => {
                                return (
                                    <Option title={item.versionDesc} value={item.versionNum} key={item.versionNum}>
                                        {item.versionDesc}
                                    </Option>
                                )
                            })}
                        </Select>
                        <Select
                            allowClear
                            onChange={this.changeProcess.bind(this, 'bizProcessId')}
                            value={queryInfo.bizProcessId}
                            style={{ width: '120px', marginRight: '8px' }}
                            placeholder='业务过程'
                        >
                            {processList.map((item) => {
                                return (
                                    <Option title={item.name} value={item.id} key={item.id}>
                                        {item.name}
                                    </Option>
                                )
                            })}
                        </Select>
                        <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} style={{ width: 180 }} placeholder='搜索指标名称' />
                        <Button onClick={this.reset} style={{ marginLeft: 8 }} className='searchBtn'>
                            重置
                        </Button>
                    </div>
                </div>
                <div>
                    <LzTable
                        key='2'
                        from='globalSearch'
                        columns={this.columns}
                        dataSource={tableData}
                        ref={(dom) => {
                            this.lzTableDom = dom
                        }}
                        getTableList={this.getTableList}
                        loading={loading}
                        rowKey='id'
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                        // scroll={{ x: 1500 }}
                    />
                    {partitionData.length ? (
                        <div>
                            <div className='title' style={{ margin: '24px 0 12px 0' }}>
                                分区字段
                            </div>
                            <div style={{ marginBottom: 12 }}>ETL脚本的执行时间，在生成物理表时会被用于生成分区字段</div>
                            <Table bordered rowKey='id' loading={tableLoading} columns={this.partitionColumns} dataSource={partitionData} pagination={false} />
                        </div>
                    ) : (
                        <div className='title' style={{ margin: '24px 0' }}>
                            无分区
                        </div>
                    )}
                </div>
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </div>
        )
    }
}
