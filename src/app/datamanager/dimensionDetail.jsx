import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Input, Radio, Select, Steps, Table, Tabs, Tooltip } from 'antd'
import { dimtableDetail, dimtableNormalColumns, dimtablePartitionColumns } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import React, { Component } from 'react'
// import './index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const { Step } = Steps
const TabPane = Tabs.TabPane

export default class FactAssetDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assetInfo: {},
            columnData: [],
            partitionData: [],
            loading: false,
            keyword: '',
            tableLoading: false,
            tabValue: '0',
        }
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                minWidth: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                {record.originalChineseName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                },
            },
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                minWidth: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalEnglishName}>
                                            <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                {record.originalEnglishName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                },
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 140,
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
                title: '数据标准',
                dataIndex: 'relateStandardCode',
                key: 'relateStandardCode',
                render: (text, record, index) => {
                    return text ? (
                        <span onClick={this.openStandardPage.bind(this, record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                            {text}
                        </span>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
            {
                title: '主键',
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                width: 80,
                render: (text) => (text ? '主键' : <EmptyLabel />),
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
        ]
        this.partitionColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                minWidth: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                {record.originalChineseName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                },
            },
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                minWidth: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalEnglishName}>
                                            <div style={{ width: 140, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                {record.originalEnglishName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ) : null}
                            </div>
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
                title: '数据标准',
                dataIndex: 'relateStandardCode',
                key: 'relateStandardCode',
                render: (text, record, index) => {
                    return text ? (
                        <span onClick={this.openStandardPage.bind(this, record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                            {text}
                        </span>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
            {
                title: '主键',
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                width: 80,
                render: (text) => (text ? '主键' : <EmptyLabel />),
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
        ]
    }
    componentDidMount = async () => {
        this.getDetail()
        this.getTableList()
        this.getPartitionTable()
    }
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    getDetail = async () => {
        let res = await dimtableDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                assetInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.name)
            if (res.data.type == 3 && res.data.subType == 2) {
                this.columns.splice(3, 1)
                this.columns.splice(4, 1)
            }
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            keyword: this.state.keyword,
            assetsId: this.props.location.state.id,
        }
        this.setState({ loading: true })
        let res = await dimtableNormalColumns(query)
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
                columnData: res.data,
                total: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    getPartitionTable = async () => {
        this.setState({ tableLoading: true })
        let res = await dimtablePartitionColumns({ assetsId: this.props.location.state.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            this.setState({
                partitionData: res.data,
            })
        }
    }
    openEditPage = () => {
        let data = { ...this.props.location.state }
        data.pageType = 'edit'

        this.props.addTab('定义维度', data)
    }
    changeKeyword = async (e) => {
        let { keyword } = this.state
        await this.setState({
            keyword: e.target.value,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        this.getTableList()
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }

    render() {
        const { assetInfo, loading, partitionData, tableLoading, columnData, keyword, tabValue } = this.state
        return (
            <div className='VControlGroup'>
                <TableLayout
                    disabledDefaultFooter
                    title={`${assetInfo.name || ''} ${assetInfo.englishName || ''}`}
                    renderHeaderExtra={() => {
                        return (
                            <Button type='primary' onClick={this.openEditPage}>
                                编辑
                            </Button>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <Module title='维度信息'>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '业务分类',
                                            content: (
                                                <span>
                                                    {assetInfo.bizModuleName || <EmptyLabel />}／{assetInfo.themeName || <EmptyLabel />}
                                                </span>
                                            ),
                                        },
                                        {
                                            label: '维度类型',
                                            content: assetInfo.type == 1 ? '普通维度' : assetInfo.type == 2 ? '枚举维度' : assetInfo.type == 3 ? '层级维度' : '',
                                        },
                                        {
                                            label: '业务描述',
                                            content: assetInfo.description,
                                        },
                                        {
                                            label: '来源表',
                                            content: assetInfo.physicalTableName,
                                        },
                                        {
                                            label: '数据库',
                                            content: assetInfo.physicalDatabaseName,
                                        },
                                        {
                                            label: '负责人',
                                            content: assetInfo.businessManagerName,
                                        },
                                        {
                                            label: '创建人',
                                            content: assetInfo.createUserName,
                                        },
                                        {
                                            label: '创建时间',
                                            content: assetInfo.createTime,
                                        },
                                        {
                                            label: '修改人',
                                            content: assetInfo.updateUserName,
                                        },
                                        {
                                            label: '更新时间',
                                            content: assetInfo.updateTime,
                                        },
                                    ])}
                                </div>
                            </Module>
                        )
                    }}
                    renderTable={() => {
                        return <React.Fragment></React.Fragment>
                    }}
                />
                <Module title='字段信息'>
                    <Input.Search allowClear value={keyword} onSearch={this.search} onChange={this.changeKeyword} style={{ width: 280 }} placeholder='搜索字段中英文名' />
                    <LzTable
                        columns={this.columns}
                        dataSource={columnData}
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
                    />
                </Module>
                <Module title='分区字段'>
                    {partitionData.length ? (
                        <Table rowKey='id' loading={tableLoading} columns={this.partitionColumns} dataSource={partitionData} pagination={false} />
                    ) : (
                        <EmptyIcon description='无分区' />
                    )}
                </Module>
            </div>
        )
    }
}
