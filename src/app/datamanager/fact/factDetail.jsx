import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Input, Radio, Select, Steps, Table, Tabs, Tooltip } from 'antd'
import { factassetsDetail, factassetsModelFilter, factassetsSourceFilter, internalTableRelation, normalColumns, partitionColumns } from 'app_api/metadataApi'
// import './index.less'
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
            assetInfo: {
                relateAssets: [],
            },
            columnData: [],
            partitionData: [],
            loading: false,
            tableLoading: false,
            tabValue: '0',
            modalList: [],
            queryInfo: {
                keyword: '',
                hideDimAttribute: true,
            },
            sourceList: [],
        }
        this.colors = {
            1: '#F26D6D',
            2: '#636399',
            0: '#8CBF73',
        }
        this.entityChart = {}
        this.assetColumns = [
            {
                title: '资产名称',
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
                title: '事实粒度',
                dataIndex: 'factGranularity',
                key: 'factGranularity',
                width: 100,
                render: (text) => (text ? '事实粒度' : <EmptyLabel />),
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
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
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
                title: '事实粒度',
                dataIndex: 'factGranularity',
                key: 'factGranularity',
                width: 100,
                render: (text) => (text ? '事实粒度' : <EmptyLabel />),
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
        this.getModalList()
        this.getSourceList()
        this.getDetail()
        this.getPartitionTable()
    }
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    changeColumns = () => {
        if (this.state.assetInfo.type == 2) {
            this.columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    width: 60,
                },
                {
                    dataIndex: 'chineseName',
                    key: 'chineseName',
                    title: '字段中文名',
                    minWidth: 200,
                    render: (text, record, index) => {
                        return (
                            <div>
                                <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
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
                                {record.relateStandardId ? (
                                    <Tooltip title='已映射标准字段'>
                                        <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                    </Tooltip>
                                ) : null}
                            </div>
                        )
                    },
                },
                {
                    dataIndex: 'englishName',
                    key: 'englishName',
                    title: '字段英文名',
                    minWidth: 200,
                    render: (text, record, index) => {
                        return (
                            <div>
                                <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
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
                                {record.relateStandardId ? (
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
                    render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
                },
                {
                    title: '字段来源',
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
                    render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    width: 48,
                    render: (text, record, index) => <span>{index + 1}</span>,
                },
                {
                    dataIndex: 'chineseName',
                    key: 'chineseName',
                    title: '字段中文名',
                    minWidth: 200,
                    render: (text, record, index) => {
                        return (
                            <div>
                                <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
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
                                {record.relateStandardId ? (
                                    <Tooltip title='已映射标准字段'>
                                        <img style={{ width: '16px', marginTop: '8px', float: 'right' }} src={require('app_images/standard_icon.png')} />
                                    </Tooltip>
                                ) : null}
                            </div>
                        )
                    },
                },
                {
                    dataIndex: 'englishName',
                    key: 'englishName',
                    title: '字段英文名',
                    minWidth: 200,
                    render: (text, record, index) => {
                        return (
                            <div>
                                <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                    <Tooltip placement='topLeft' title={text}>
                                        <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                    </Tooltip>
                                    {record.originalEnglishName ? (
                                        <div style={{ color: '#b3b3b3' }}>
                                            原始名：
                                            <Tooltip placement='topLeft' title={record.originalEnglishName}>
                                                <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                    {record.originalEnglishName || <EmptyLabel />}
                                                </div>
                                            </Tooltip>
                                        </div>
                                    ) : null}
                                </div>
                                {record.relateStandardId ? (
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
                    render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
                },
                {
                    title: '字段来源',
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
                    render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
        } else {
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
                    title: '事实粒度',
                    dataIndex: 'factGranularity',
                    key: 'factGranularity',
                    width: 100,
                    render: (text) => (text ? '事实粒度' : <EmptyLabel />),
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
            this.columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    width: 60,
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
                    title: '事实粒度',
                    dataIndex: 'factGranularity',
                    key: 'factGranularity',
                    width: 100,
                    render: (text) => (text ? '事实粒度' : <EmptyLabel />),
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
    }
    getModalList = async () => {
        let res = await factassetsModelFilter({ id: this.props.location.state.id, filterVisible: true })
        if (res.code == 200) {
            this.setState({
                modalList: res.data,
            })
        }
    }
    getSourceList = async () => {
        let res = await factassetsSourceFilter({ id: this.props.location.state.id, filterVisible: true })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDetail = async () => {
        let res = await factassetsDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            if (res.data.chineseName) {
                res.data.name = res.data.chineseName.replace(/\s*/g, '')
            }
            await this.setState({
                assetInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.name)
            this.getTableList()
            this.changeColumns()
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
            factAssetsId: this.props.location.state.id,
        }
        this.setState({ loading: true })
        let res = await normalColumns(query)
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
        let res = await partitionColumns({ assetsId: this.props.location.state.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            this.setState({
                partitionData: res.data,
            })
        }
    }
    openEditPage = () => {
        let data = { ...this.props.location.state }
        data.factTableId = data.factTableId ? data.factTableId : data.id
        this.props.addTab('定义事实资产', data)
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
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
        this.getTableList()
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            modelRelationCode: undefined,
            srcBusinessId: undefined,
            hideDimAttribute: true,
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeCheckbox = async (e) => {
        let { queryInfo } = this.state
        queryInfo.hideDimAttribute = e.target.checked
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    render() {
        const { assetInfo, loading, partitionData, tableLoading, columnData, tabValue, modalList, queryInfo, sourceList } = this.state

        return (
            <div className='VControlGroup'>
                <TableLayout
                    disabledDefaultFooter
                    title={`${assetInfo.name || ''} ${assetInfo.englishName || ''}`}
                    renderHeaderExtra={() => {
                        return (
                            <Button ghost type='primary' onClick={this.openEditPage}>
                                编辑
                            </Button>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <div className='MiniForm Grid4'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '业务分类',
                                        content: (
                                            <span>
                                                {assetInfo.bizModuleName || <EmptyLabel />}／{assetInfo.themeName || <EmptyLabel />}／{assetInfo.bizProcessName || <EmptyLabel />}
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
                                        content: assetInfo.createTime,
                                    },
                                    {
                                        label: '创建时间',
                                        content: assetInfo.createTime,
                                    },
                                    {
                                        label: '修改人',
                                        content: assetInfo.updateUser,
                                    },
                                    {
                                        label: '更新时间',
                                        content: assetInfo.updateTime,
                                    },
                                ])}
                            </div>
                        )
                    }}
                />
                <Module title='资产来源'>
                    <Table rowKey='id' columns={this.assetColumns} dataSource={assetInfo.relateAssets} pagination={false} />
                </Module>
                <Module title='字段信息'>
                    {assetInfo.type == 2 ? (
                        <Tabs activeKey={tabValue} onChange={this.changeTab}>
                            <TabPane tab='字段详情' key='0'>
                                <div style={{ marginBottom: 15 }} className='HControlGroup'>
                                    <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索字段中英文名' />
                                    <Select allowClear onChange={this.changeType.bind(this, 'srcBusinessId')} value={queryInfo.srcBusinessId} placeholder='字段来源'>
                                        {sourceList.map((item) => {
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
                                    <div className='HSpace' />
                                    <Checkbox onChange={this.changeCheckbox} checked={queryInfo.hideDimAttribute}>
                                        隐藏维度属性
                                    </Checkbox>
                                </div>
                                <LzTable
                                    key='0'
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
                            </TabPane>
                            <TabPane tab='关联关系' key='1'>
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
                    ) : (
                        <div>
                            <Input.Search
                                allowClear
                                value={queryInfo.keyword}
                                onSearch={this.search}
                                onChange={this.changeKeyword}
                                style={{ width: 280, marginBottom: 16 }}
                                placeholder='搜索字段中英文名'
                            />
                            <div>
                                <LzTable
                                    key='1'
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
                            </div>
                        </div>
                    )}
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
