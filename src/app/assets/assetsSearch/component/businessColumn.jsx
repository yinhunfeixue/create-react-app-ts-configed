import EmptyLabel from '@/component/EmptyLabel'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Divider, Input, message, Select, Table, Tooltip } from 'antd'
import { businessColumnType, businessNormalColumn, businessPatitionColumn, factassetsRelateBiz, metricsProcess } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import React, { Component } from 'react'

export default class BusinessColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            queryInfo: {
                keyword: '',
                relationTypeNum: undefined,
            },
            partitionData: [],
            tableLoading: false,
            loading: false,
            processList: [],
            versionList: [],
            sourceList: [],
        }
        this.patitionColumns = [
            {
                title: '字段中文名',
                dataIndex: 'name',
                key: 'name',
                minWidth: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                            </div>
                            {record.standard ? (
                                <Tooltip title='已映射标准字段'>
                                    <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                </Tooltip>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                            </div>
                            {record.standard ? (
                                <Tooltip title='已映射标准字段'>
                                    <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                </Tooltip>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
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
                title: '维度来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + ' ' + record.srcBusinessEnglishName}>
                            {text + ' ' + record.srcBusinessEnglishName}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '时间字段',
                dataIndex: 'dateFormat',
                key: 'dateFormat',
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
                title: '模型关系',
                dataIndex: 'relationType',
                key: 'relationType',
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
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'name',
                key: 'name',
                width: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                            </div>
                            {record.standard ? (
                                <Tooltip title='已映射标准字段'>
                                    <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                </Tooltip>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                            </div>
                            {record.standard ? (
                                <Tooltip title='已映射标准字段'>
                                    <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                </Tooltip>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
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
                title: '维度来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + ' ' + record.srcBusinessEnglishName}>
                            {text + ' ' + record.srcBusinessEnglishName}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '时间字段',
                dataIndex: 'dateFormat',
                key: 'dateFormat',
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
                title: '模型关系',
                dataIndex: 'relationType',
                key: 'relationType',
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
        if (this.propsParam.type == 11) {
            this.columns.splice(4, 1)
            this.patitionColumns.splice(4, 1)
        }
        if (this.propsParam.showVersion == false && this.propsParam.type == 10) {
            this.columns[4].title = '字段来源'
            this.patitionColumns[4].title = '字段来源'
        }
        this.getTableList()
        this.getDateColumn()
        this.getVersionFilter()
        this.getSourceList()
    }

    get propsParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    getSourceList = async () => {
        let res = await factassetsRelateBiz({ id: this.propsParam.id })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    openIndexma = (data) => {
        this.deriveDrawer.openDetailModal(data)
    }
    getDateColumn = async () => {
        this.setState({ tableLoading: true })
        let res = await businessPatitionColumn({ businessId: this.propsParam.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            this.setState({
                partitionData: res.data,
            })
        }
    }
    getVersionFilter = async () => {
        let res = await businessColumnType({ id: this.propsParam.id })
        if (res.code == 200) {
            this.setState({
                versionList: res.data,
            })
        }
    }
    getProcessList = async () => {
        let res = await metricsProcess({ summaryId: this.propsParam.id })
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
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
            businessId: this.propsParam.id,
        }
        this.setState({ loading: true })
        let res = await businessNormalColumn(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
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
            relationTypeNum: undefined,
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
        const { loading, tableData, partitionData, tableLoading, processList, queryInfo, versionList, sourceList } = this.state
        return (
            <div>
                <div className='HControlGroup' style={{ marginBottom: 16 }}>
                    <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索字段名称' />
                    {this.propsParam.showVersion == false && this.propsParam.type == 10 ? (
                        <Select allowClear onChange={this.changeProcess.bind(this, 'srcBusinessId')} value={queryInfo.srcBusinessId} placeholder='字段来源'>
                            {sourceList.map((item) => {
                                return (
                                    <Option title={item.name} value={item.id} key={item.id}>
                                        {item.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    ) : null}
                    <Select allowClear onChange={this.changeProcess.bind(this, 'relationTypeNum')} value={queryInfo.relationTypeNum} placeholder='模型关系'>
                        {versionList.map((item) => {
                            return (
                                <Option title={item.name} value={item.id} key={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>

                    <Button onClick={this.reset}>重置</Button>
                </div>
                <LzTable
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
                    scroll={{
                        x: false,
                    }}
                />
                <Divider />
                <Module title='分区字段'>
                    <Table rowKey='id' loading={tableLoading} columns={this.patitionColumns} dataSource={partitionData} pagination={false} />
                </Module>
            </div>
        )
    }
}
