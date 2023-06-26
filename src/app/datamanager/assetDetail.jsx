import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Radio, Select, Steps, Table, Tabs, Tooltip } from 'antd'
import { dimassetsDetail, dimassetsModelFilter, dimassetsNormalColumns, dimassetsPartitionColumns, dimassetsSourceFilter, internalTableRelation } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import EntityRelation from 'app_page/dama/component/entityRelation'
import React, { Component } from 'react'

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
            modalList: [],
            queryInfo: {
                modelRelationCode: undefined,
                srcBusinessId: undefined,
                keyword: '',
            },
            dimensionList: [],
        }
        this.colors = {
            1: '#F26D6D',
            2: '#636399',
            0: '#8CBF73',
        }
        this.entityChart = {}
        this.assetColumns = [
            {
                title: '维度名称',
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
                title: '来源表',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
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
                title: '数据库',
                dataIndex: 'physicalDatabaseName',
                key: 'physicalDatabaseName',
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
                title: '类型',
                dataIndex: 'type',
                key: 'type',
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
        ]
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
                title: '字段来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
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
                    return text ? <a onClick={this.openStandardPage.bind(this, record)}>{text}</a> : <EmptyLabel />
                },
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
                dataIndex: 'modelRelation',
                key: 'modelRelation',
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
        ]
        this.partitionColumns = [
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
                title: '字段来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
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
                dataIndex: 'modelRelation',
                key: 'modelRelation',
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
        ]
    }
    componentDidMount = async () => {
        this.getDetail()
        this.getModelList()
        this.getSourceList()
        this.getTableList()
        this.getPartitionTable()
    }
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    getDetail = async () => {
        let res = await dimassetsDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                assetInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.name)
        }
    }
    getModelList = async () => {
        let res = await dimassetsModelFilter({ filterVisible: true, id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                modalList: res.data,
            })
        }
    }
    getSourceList = async () => {
        let res = await dimassetsSourceFilter({ filterVisible: true, id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                dimensionList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
            assetsId: this.props.location.state.id,
        }
        this.setState({ loading: true })
        let res = await dimassetsNormalColumns(query)
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
        let res = await dimassetsPartitionColumns({ assetsId: this.props.location.state.id })
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
        this.props.addTab('编辑维度资产', data)
    }
    search = () => {
        this.getTableList()
    }
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            modelRelationCode: undefined,
            srcBusinessId: undefined,
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
    changeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        if (e == 1) {
            this.getNodeData()
        }
    }
    getNodeData = async () => {
        let res = await internalTableRelation({ businessId: this.props.location.state.id })
        if (res.code == 200) {
            this.entityChart.bindNodeData(res.data)
        }
    }

    render() {
        const { assetInfo, loading, partitionData, tableLoading, columnData, keyword, tabValue, modalList, queryInfo, dimensionList } = this.state

        return (
            <div className='VControlGroup'>
                <TableLayout
                    disabledDefaultFooter
                    title={`${assetInfo.name || ''} ${assetInfo.englishName || ''}`}
                    renderDetail={() => {
                        return (
                            <Module title='维度资产信息'>
                                <Form className='MiniForm Grid4'>
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
                                            label: '业务描述',
                                            content: assetInfo.description,
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
                                </Form>
                            </Module>
                        )
                    }}
                    renderHeaderExtra={() => {
                        return (
                            <Button type='primary' onClick={this.openEditPage}>
                                编辑
                            </Button>
                        )
                    }}
                />
                <Module title='资产来源'>
                    <Table rowKey='id' columns={this.assetColumns} dataSource={assetInfo.relateAssets} pagination={false} />
                </Module>
                <Module title='字段信息'>
                    <Tabs activeKey={tabValue} onChange={this.changeTab}>
                        <TabPane tab='字段详情' key='0'>
                            <div className='HControlGroup' style={{ marginBottom: 15 }}>
                                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索字段中英文名' />
                                <Select allowClear onChange={this.changeType.bind(this, 'srcBusinessId')} value={queryInfo.srcBusinessId} placeholder='所属维度'>
                                    {dimensionList.map((item) => {
                                        return (
                                            <Option title={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select allowClear onChange={this.changeType.bind(this, 'modelRelationCode')} value={queryInfo.modelRelationCode} placeholder='模型关系'>
                                    {modalList.map((item) => {
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
                            {partitionData.length ? (
                                <div>
                                    <div className='title' style={{ margin: '24px 0', fontSize: '14px' }}>
                                        以下是分区字段
                                    </div>
                                    <Table rowKey='id' loading={tableLoading} columns={this.partitionColumns} dataSource={partitionData} pagination={false} />
                                </div>
                            ) : (
                                <div className='title' style={{ margin: '24px 0', fontSize: '14px' }}>
                                    无分区
                                </div>
                            )}
                        </TabPane>
                        <TabPane tab='关联维度' key='1'>
                            {tabValue == 1 ? (
                                <div style={{ height: 'calc(100vh - 150px)', marginTop: 30 }}>
                                    <EntityRelation
                                        ref={(dom) => {
                                            this.entityChart = dom
                                        }}
                                        colors={this.colors}
                                    />
                                </div>
                            ) : null}
                        </TabPane>
                    </Tabs>
                </Module>
            </div>
        )
    }
}
