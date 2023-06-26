import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Input, message, Select, Tooltip } from 'antd'
import { metricsProcess, metricsProcessFilters, summaryMetrics, summaryMetricsDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'

const { Option } = Select
export default class FactAssetDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assetInfo: {
                relateAssets: [],
            },
            columnData: [],
            partitionData: [],
            loading: false,
            keyword: '',
            tableLoading: false,
            processList: [],
            queryInfo: {
                bizProcessId: undefined,
                keyword: '',
            },
        }
        this.columns = [
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '指标名称',
                width: 240,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div style={{ width: 220, overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '指标英文名',
                width: 200,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '原子指标',
                dataIndex: 'atomicMetricsChineseName',
                key: 'atomicMetricsChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '统计周期',
                dataIndex: 'statisticalPeriodChineseName',
                key: 'statisticalPeriodChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '业务限定',
                dataIndex: 'bizLimitChineseName',
                key: 'bizLimitChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '来源事实',
                dataIndex: 'factAssetsName',
                key: 'factAssetsName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentDidMount = async () => {
        this.getDetail()
        this.getTableList()
        this.getProcessList()
    }
    getProcessList = async () => {
        let res = await metricsProcessFilters({ summaryId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                processList: res.data,
            })
        }
    }
    getDetail = async () => {
        let res = await summaryMetricsDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            res.data.name = res.data.name.replace(/\s*/g, '')
            this.setState({
                assetInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.name)
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            summaryId: this.props.location.state.id,
            ...queryInfo,
        }
        this.setState({ loading: true })
        let res = await summaryMetrics(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                columnData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    openEditPage = () => {
        let data = { ...this.props.location.state }
        this.props.addTab('编辑汇总资产', data)
    }
    search = () => {
        // this.getTableList()
        if (this.controller) {
            this.controller.reset()
        }
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            bizProcessId: undefined,
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeProcess = async (e) => {
        let { queryInfo } = this.state
        queryInfo.bizProcessId = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    render() {
        const { assetInfo, loading, partitionData, tableLoading, columnData, keyword, processList, queryInfo } = this.state
        return (
            <div className='VControlGroup'>
                <TableLayout
                    title={`${assetInfo.name || ''} ${assetInfo.englishName ? `(${assetInfo.englishName})` : ''}`}
                    disabledDefaultFooter
                    renderHeaderExtra={() => {
                        return (
                            <Button type='primary' onClick={this.openEditPage}>
                                编辑
                            </Button>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <div className='MiniForm Grid4'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '统计粒度',
                                        content: assetInfo.statisticalColumn,
                                    },
                                    {
                                        label: '业务分类',
                                        content: assetInfo.classifyPath,
                                    },
                                    {
                                        label: '负责人',
                                        content: assetInfo.businessManagerName,
                                    },
                                    {
                                        label: '业务描述',
                                        content: assetInfo.description,
                                    },
                                    {
                                        label: '创建时间',
                                        content: assetInfo.createTime,
                                    },
                                    {
                                        label: '创建人',
                                        content: assetInfo.createUser,
                                    },
                                    {
                                        label: '更新时间',
                                        content: assetInfo.updateTime,
                                    },
                                    {
                                        label: '修改人',
                                        content: assetInfo.updateUser,
                                    },
                                ])}
                            </div>
                        )
                    }}
                />
                <Module title='指标详情'>
                    <RichTableLayout
                        smallLayout
                        disabledDefaultFooter
                        tableProps={{
                            columns: this.columns,
                        }}
                        editColumnProps={{
                            hidden: true,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索指标名称' />
                                    <Select allowClear onChange={this.changeProcess} value={queryInfo.bizProcessId} placeholder='业务过程'>
                                        {processList.map((item) => {
                                            return (
                                                <Option title={item.name} value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </Module>
            </div>
        )
    }
}
