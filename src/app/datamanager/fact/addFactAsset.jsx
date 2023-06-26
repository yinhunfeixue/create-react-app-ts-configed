import EmptyLabel from '@/component/EmptyLabel'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Divider, Dropdown, Input, Menu, message, Modal, Radio, Select, Steps, Switch, Table, Tabs, Tooltip } from 'antd'
import { columnBeUsed, generateFormulaColumn } from 'app_api/addNewColApi'
import { getUserList } from 'app_api/manageApi'
import { detailForEdit, dimassetsInternalDelete, factassetsSave, internalTableRelation, parseCname, suggestion } from 'app_api/metadataApi'
import AddNewCol from 'app_page/dama/component/addNewCol'
import EntityRelation from 'app_page/dama/component/entityRelation'
import Lodash from 'lodash'
import React, { Component } from 'react'
import AddRelation from '../addRelation'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const { Step } = Steps
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

let col = 0
let spanName = 0

export default class AddFactAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            sourceList: [],
            baseList: [],
            ddlModal: false,
            sqlContent: '',
            columnData: [],
            columnDataBackup: [],
            tableNameCn: '',
            tableNameCnWithSpace: '',
            tableNameEn: '',
            cnameDesc: '暂无词根信息',
            tableNameCnData: [],
            rootList: [],
            showDropown: false,
            dataTypeInfo: [],
            ddlLoading: false,
            dragTableLoading: false,
            codeItemIndex: 0,
            showDataType: true,
            configLimitInfo: {
                enableNotNull: false,
                enablePartition: false,
                enablePrimary: false,
            },
            showShadow: true,

            dimensionType: 1,
            expandedRowKeys: ['0', '1', '2'],

            currentStep: 0,
            keyword: '',
            databaseList: [],
            tableList: [],
            timeformatList: [],
            dataTypeList: [],
            columnList: [],
            partitionData: [],

            assetInfo: {
                description: '',
                englishPrefixName: '',
            },
            tableLoading: false,
            userList: [],
            disabledDesc: '需对上面内容进行选择，并至少选择一个事实粒度，“  ”为必填项',
            tabValue: '0',
            addDimensionModal: false,
            btnLoading: false,

            canEdit: false,
            leftColumnId: '',
            relationId: '',
            formulaVisible: false,
            formulaInfo: {},
            isFormulaEdit: false,
            formulaContent: {},
            formulaType: 0,
            formulaCname: '',
            filterIndex: 0,
        }
        this.colors = {
            1: '#F26D6D',
            2: '#636399',
            0: '#8CBF73',
        }
        this.entityChart = {}
        this.partitionColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record, index) => <span style={this.getTextStyle(record)}>{index + 1}</span>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalEnglishName}>
                                            <div
                                                style={{
                                                    width: 'calc(100% - 68px)',
                                                    verticalAlign: 'bottom',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block',
                                                }}
                                            >
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                        <span onClick={this.openStandardPage.bind(this, record)} style={this.getTextStyle(record)}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '事实粒度',
                dataIndex: 'factGranularity',
                key: 'factGranularity',
                width: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.columnType == 1 ? (
                                <EmptyLabel />
                            ) : (
                                <Checkbox checked={text} onChange={this.checkOther.bind(this, index, 'partitionData')}>
                                    <span style={this.getTextStyle(record)}>事实粒度</span>
                                </Checkbox>
                            )}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'visible',
                key: 'visible',
                title: '可见状态',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '可见' : '隐藏'}</span>
                            <Switch onChange={this.primaryKeyChange.bind(this, index, 'partitionData')} checked={text} />
                        </div>
                    )
                },
            },
        ]
        this.assetColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span style={this.getTextStyle(record)}>{index + 1}</span>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalEnglishName}>
                                            <div
                                                style={{
                                                    width: 'calc(100% - 68px)',
                                                    verticalAlign: 'bottom',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block',
                                                }}
                                            >
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                        <span onClick={this.openStandardPage.bind(this, record)} style={this.getTextStyle(record)}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '事实粒度',
                dataIndex: 'factGranularity',
                key: 'factGranularity',
                width: 140,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox checked={text} onChange={this.checkOther.bind(this, index, 'columnData')}>
                                <span style={this.getTextStyle(record)}>事实粒度</span>
                            </Checkbox>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'visible',
                key: 'visible',
                title: '可见状态',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '可见' : '隐藏'}</span>
                            <Switch style={{ height: '22px', float: 'right' }} onChange={this.primaryKeyChange.bind(this, index, 'columnData')} checked={text} />
                        </div>
                    )
                },
            },
        ]

        this.assetColumnsMuti = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span style={this.getTextStyle(record)}>{index + 1}</span>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                        <span onClick={this.openStandardPage.bind(this, record)} style={this.getTextStyle(record)}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'visible',
                key: 'visible',
                title: '可见状态',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '可见' : '隐藏'}</span>
                            <Switch style={{ height: '22px', float: 'right' }} onChange={this.primaryKeyChange.bind(this, index, 'columnData')} checked={text} />
                        </div>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 120,
                fixed: 'right',
                render: (text, record, index) => {
                    if (record.canOptRelation) {
                        return (
                            <div>
                                <a onClick={this.openEditModal.bind(this, record)}>关联</a>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <a onClick={this.deleteColumn.bind(this, record)}>删除</a>
                            </div>
                        )
                    }
                    if (record.formula) {
                        return (
                            <div>
                                <a onClick={this.openAddFilter.bind(this, 'edit', record, index)}>编辑</a>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <a onClick={this.deleteFilter.bind(this, index)}>删除</a>
                            </div>
                        )
                    }
                    return <EmptyLabel />
                },
            },
        ]
        this.partitionColumnsMuti = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span style={this.getTextStyle(record)}>{index + 1}</span>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={this.getTextStyle(record)}>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalEnglishName ? (
                                    <div>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段来源',
                dataIndex: 'srcBusinessName',
                key: 'srcBusinessName',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                        <span onClick={this.openStandardPage.bind(this, record)} style={this.getTextStyle(record)}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={this.getTextStyle(record)}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'visible',
                key: 'visible',
                title: '可见状态',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '可见' : '隐藏'}</span>
                            <Switch style={{ height: '22px', float: 'right' }} onChange={this.primaryKeyChange.bind(this, index, 'partitionData')} checked={text} />
                        </div>
                    )
                },
            },
        ]
    }

    getTextStyle(record) {
        if (record.visible) {
            return {}
        }
        return {
            color: '#C4C8CC',
        }
    }

    componentDidMount = async () => {
        if (this.props.location.state.pageType == 'edit' || this.props.location.state.pageType == 'add') {
            this.getAssetInfo(this.props.assetInfo)
        }
        if (this.props.location.state.pageType == 'look') {
            this.getEditDetail()
        }
        this.getUserData()
        document.addEventListener(
            'mousedown',
            function (e) {
                if (e.target.className == 'tableAutoDropdownItem' || e.target.className == 'highlight') {
                    e.preventDefault()
                }
            },
            false
        )
    }
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    getEditDetail = async () => {
        let res = await detailForEdit({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.getAssetInfo(res.data)
        }
    }
    deleteColumn = (data) => {
        let { columnData, assetInfo } = this.state
        let query = {
            assetsId: assetInfo.id,
            leftColumnId: data.srcBizColumnId,
        }
        let that = this
        confirm({
            title: '你确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dimassetsInternalDelete(query).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.getColumnList()
                    }
                })
            },
        })
    }
    getColumnList = async () => {
        this.setState({ tableLoading: true })
        let res = await detailForEdit({ id: this.state.assetInfo.id })
        if (res.code == 200) {
            await this.setState({
                columnData: res.data.columnInfos.normalColumns,
                columnDataBackup: res.data.columnInfos.normalColumns,
                partitionData: res.data.columnInfos.partitionColumns,
            })
            this.hideDimension()
        }
        this.setState({ tableLoading: false })
    }
    getAssetInfo = async (data) => {
        data.description = data.description ? data.description : ''
        // data.type = 1
        await this.setState({
            assetInfo: data,
            partitionData: data.columnInfos.partitionColumns,
            columnData: data.columnInfos.normalColumns,
            columnDataBackup: data.columnInfos.normalColumns,
            rootList: data.rootList ? data.rootList : [],
            tableNameCn: data.name !== undefined ? data.name : '',
            tableNameEn: data.englishSuffixName,
            tableNameCnWithSpace: data.name !== undefined ? data.name : '',
        })
        if (data.type == 2) {
            this.hideDimension()
        }
        this.getEname()
    }
    primaryKeyChange = (index, name, e) => {
        this.state[name][index].visible = e
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    checkOther = (index, name, e) => {
        this.state[name][index].factGranularity = e.target.checked
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    postData = async () => {
        const { assetInfo, columnData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList, partitionData } = this.state
        let query = {
            ...assetInfo,
            columnInfos: {
                normalColumns: columnData,
                partitionColumns: partitionData,
            },
            name: tableNameCnWithSpace,
            englishSuffixName: tableNameEn,
            rootList: rootList,
        }
        if (tableNameCnWithSpace.length > 64) {
            message.info('中文名不能超过64个字符')
            return
        }
        if (assetInfo.englishPrefixName.length + tableNameEn.length > 64) {
            message.info('英文名不能超过64个字符')
            return
        }
        this.setState({ loading: true })
        let res = await factassetsSave(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.back()
        }
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('事实资产')
        })
    }

    onChangeTableEn = (e) => {
        this.setState({
            tableNameEn: e.target.value,
        })
    }
    onSelectTableNameCn = async (data) => {
        console.log(data, 'onSelectTableNameCn')
        let { rootList, tableNameCn, tableNameCnWithSpace } = this.state
        let hasRepeat = false
        rootList.map((item) => {
            if (item.id == data.id) {
                hasRepeat = true
            }
        })
        if (!hasRepeat) {
            rootList.push(data)
        }
        tableNameCn = tableNameCn.slice(0, data.startPosition) + data.descWord + tableNameCn.slice(data.endPosition) + ' '
        await this.setState({
            tableNameCn,
            tableNameCnWithSpace: tableNameCn,
            rootList,
            tableNameCnData: [],
        })
        console.log(rootList, tableNameCn, 'rootList')
        this.getEname()
    }
    onInputBlur = (e) => {
        let { tableNameCn } = this.state
        tableNameCn = tableNameCn.replace(/\s*/g, '')
        this.setState({
            tableNameCn,
            showDropown: false,
        })
        this.getEname()
    }
    onInputFocus = () => {
        let { tableNameCnWithSpace } = this.state
        this.setState({
            tableNameCn: tableNameCnWithSpace,
            showDropown: true,
        })
    }
    onChangeTableNameCn = async (e) => {
        console.log(e, 'onChangeTableNameCn')
        let { rootList } = this.state
        let str = e.target.value
        // 只能连续输入一个空格
        if (str.length > 1) {
            if (str[str.length - 1] == ' ' && str[str.length - 2] == ' ') {
                str = str.slice(0, str.length - 1)
            }
        }
        await this.setState({
            tableNameCn: str,
            tableNameCnWithSpace: str,
        })
        let tableAutoInput = document.querySelector('.tableAutoInput .ant-input')
        let cursurPosition = -1
        console.log(tableAutoInput, 'tableAutoInput.selectionStart')
        if (tableAutoInput.selectionStart) {
            cursurPosition = tableAutoInput.selectionStart
        }
        if (this.state.tableNameCn[cursurPosition] == ' ') {
            console.log('输入空格')
            this.getEname()
            this.getSuggestion(cursurPosition)
        } else {
            this.getSuggestion(cursurPosition)
        }
    }
    getSuggestion = async (cursurPosition) => {
        const { tableNameCn, assetInfo, rootList } = this.state
        let query = {
            cname: tableNameCn,
            datasourceId: assetInfo.datasourceId,
            position: cursurPosition,
        }
        let res = await suggestion(query)
        if (res.code == 200) {
            this.setState({
                tableNameCnData: res.data,
            })
        }
    }
    getEname = async () => {
        const { tableNameCn, tableNameEn, assetInfo, tableNameCnWithSpace, cnameDesc, rootList } = this.state
        let query = {
            cname: tableNameCnWithSpace,
            ename: tableNameEn,
            datasourceId: assetInfo.datasourceId,
            rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
            res.data.cnameDesc = res.data.cnameDesc ? res.data.cnameDesc : ''
            this.setState({
                tableNameEn: res.data.ename,
                cnameDesc: res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') || '暂无词根信息',
                rootList: res.data.rootList,
            })
        }
    }
    onTableEnBlur = () => {
        let { tableNameEn } = this.state
        if (tableNameEn) {
            tableNameEn = tableNameEn.replace(/\s*/g, '')
        }
        this.setState({
            tableNameEn,
        })
    }
    getShowShadow = () => {
        const { columnData } = this.state
        let tableHeight = (columnData.length + 1) * 40
        let pageHeight = document.querySelector('.exam_container_right').clientHeight - 500
        if (tableHeight > pageHeight) {
            this.setState({
                showShadow: true,
            })
        } else {
            this.setState({
                showShadow: false,
            })
        }
    }
    changeType = async (e) => {
        const { assetInfo } = this.state
        assetInfo.type = e.target.value
        await this.setState({
            assetInfo,
        })
        if (assetInfo.type == 2) {
            this.hideDimension()
        }
    }
    changeDesc = (e) => {
        const { assetInfo } = this.state
        assetInfo.description = e.target.value
        this.setState({
            assetInfo,
        })
    }
    expandedRowRender = (record, index) => {
        return <div></div>
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    prePage = () => {
        this.props.prePage()
    }
    changeUser = (e) => {
        const { assetInfo } = this.state
        assetInfo.businessManager = e
        this.setState({
            assetInfo,
        })
    }
    search = () => {}
    changeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        if (e == 1) {
            this.getNodeData()
        } else {
            this.getColumnList()
        }
    }
    columnTableRender = () => {
        const { tableLoading, columnData, partitionData, assetInfo } = this.state
        return (
            <div>
                <Table
                    rowKey='id'
                    loading={tableLoading}
                    columns={assetInfo.type == 2 ? this.assetColumnsMuti : this.assetColumns}
                    rowClassName={(record) => (record.visible ? 'editable-row' : 'hideColumn')}
                    dataSource={columnData}
                    pagination={false}
                    scroll={{
                        x: 1500,
                    }}
                />
                {partitionData.length ? (
                    <div>
                        <div className='title' style={{ margin: '24px 0' }}>
                            分区字段
                        </div>
                        <Table
                            rowKey='id'
                            loading={tableLoading}
                            columns={assetInfo.type == 2 ? this.partitionColumnsMuti : this.partitionColumns}
                            rowClassName={(record) => (record.visible ? 'editable-row' : 'hideColumn')}
                            dataSource={partitionData}
                            pagination={false}
                        />
                    </div>
                ) : (
                    <div className='title' style={{ margin: '24px 0' }}>
                        无分区
                    </div>
                )}
            </div>
        )
    }
    reset = () => {}
    openEditModal = async (data) => {
        await this.setState({
            canEdit: true,
            leftColumnId: data.srcBizColumnId,
            relationId: data.relationId,
        })
        this.addRelation.openModal()
    }
    openAddPage = async () => {
        await this.setState({
            canEdit: false,
        })
        this.addRelation.openModal()
    }
    cancel = () => {
        this.addRelation.cancel()
        if (this.addNewCol) {
            this.addNewCol.clearParams()
        }
        this.setState({
            formulaVisible: false,
        })
    }
    editRelation = async (data) => {
        console.log(data, 'srcBizColumnId')
        await this.setState({
            canEdit: true,
            relationId: data.id,
        })
        this.addRelation.openModal()
    }
    postRelation = () => {
        if (this.state.tabValue == 1) {
            this.getNodeData()
        } else {
            this.getColumnList()
        }
    }
    getNodeData = async () => {
        let res = await internalTableRelation({ businessId: this.state.assetInfo.id })
        if (res.code == 200) {
            this.entityChart.bindNodeData(res.data)
        }
    }
    hideDimension = () => {
        let { columnData } = this.state
        let arrayData = []
        columnData.map((item) => {
            if (item.modelRelationCode !== 5) {
                arrayData.push(item)
            }
        })
        this.setState({
            columnData: arrayData,
        })
    }
    showDimension = () => {
        let { columnData, columnDataBackup } = this.state
        this.setState({
            columnData: columnDataBackup,
        })
    }
    changeCheckbox = (e) => {
        if (e.target.checked) {
            this.hideDimension()
        } else {
            this.showDimension()
        }
    }
    saveFormula = async (data) => {
        console.log(data, 'saveFormula')
        let { formulaInfo, columnData, isFormulaEdit, filterIndex } = this.state
        let query = {
            columnInfo: {
                businessId: this.props.location.state.id,
                ...formulaInfo,
            },
            formulaSaveParam: data,
        }
        let res = await generateFormulaColumn(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            if (isFormulaEdit) {
                columnData[filterIndex] = res.data
            } else {
                columnData.push(res.data)
            }
            this.setState({
                columnData,
                columnDataBackup: [...columnData],
            })
        }
    }
    openAddFilter = async (type, item, index) => {
        if (type == 'edit') {
            this.setState({
                filterIndex: index,
                formulaInfo: item,
            })
            if (item.id !== undefined) {
                let query = {
                    assetsId: this.props.location.state.id,
                    columnId: item.id,
                }
                let res = await columnBeUsed(query)
                if (res.code == 200) {
                    if (res.data) {
                        message.error('Formula被使用，不可删除')
                    } else {
                        this.setState({
                            formulaType: item.formulaInfo.columnType,
                            formulaContent: JSON.parse(item.formulaInfo.formulaData),
                            formulaCname: item.formulaInfo.cname,
                            isFormulaEdit: true,
                            formulaVisible: true,
                        })
                    }
                }
            } else {
                console.log(item, 'openAddFilter')
                this.setState({
                    formulaType: item.formulaInfo.columnType,
                    formulaContent: JSON.parse(item.formulaInfo.formulaData),
                    formulaCname: item.formulaInfo.cname,
                    isFormulaEdit: true,
                    formulaVisible: true,
                })
            }
        } else {
            this.setState({
                formulaVisible: true,
                isFormulaEdit: false,
                formulaInfo: {},
            })
        }
    }
    deleteFilter = async (index) => {
        let { columnData } = this.state
        if (columnData[index].id !== undefined) {
            let query = {
                assetsId: this.props.location.state.id,
                columnId: columnData[index].id,
            }
            let res = await columnBeUsed(query)
            if (res.code == 200) {
                if (res.data) {
                    message.error('Formula被使用，不可删除')
                } else {
                    let that = this
                    confirm({
                        title: '你确定要删除吗？',
                        content: '',
                        okText: '确定',
                        cancelText: '取消',
                        onOk() {
                            columnData.splice(index, 1)
                            that.setState({
                                columnData,
                                columnDataBackup: [...columnData],
                            })
                            message.success('操作成功')
                        },
                    })
                }
            }
        } else {
            let that = this
            confirm({
                title: '你确定要删除吗？',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    columnData.splice(index, 1)
                    that.setState({
                        columnData,
                    })
                    message.success('操作成功')
                },
            })
        }
    }

    render() {
        const {
            loading,
            sourceList,
            baseList,
            columnData,
            ddlModal,
            sqlContent,
            tableNameCn,
            tableNameCnData,
            tableNameEn,
            cnameDesc,
            tableNameCnWithSpace,
            showDropown,
            ddlLoading,
            dragTableLoading,
            configLimitInfo,
            showShadow,

            dimensionType,
            expandedRowKeys,
            currentStep,
            keyword,
            databaseList,
            tableList,
            timeformatList,
            partitionData,

            assetInfo,
            tableLoading,
            userList,
            disabledDesc,
            tabValue,
            addDimensionModal,
            btnLoading,
            canEdit,
            leftColumnId,
            relationId,
            formulaVisible,
            isFormulaEdit,
            formulaContent,
            formulaType,
            formulaCname,
        } = this.state
        const menu = (
            <Menu>
                <Menu.Item onClick={this.openAddPage}>添加关联维度</Menu.Item>
                <Menu.Item onClick={this.openAddFilter.bind(this, 'add')}>添加计算字段</Menu.Item>
            </Menu>
        )
        return (
            <React.Fragment>
                <Module title='定义事实资产'>
                    <div className='EditMiniForm Grid1'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '选择来源表',
                                content: (
                                    <span>
                                        {assetInfo.tableEnglishName || <EmptyLabel />}
                                        {assetInfo.tableChineseName ? '（' + assetInfo.tableChineseName + ')' : ''}
                                    </span>
                                ),
                            },
                            {
                                label: '业务分类',
                                content: (
                                    <React.Fragment>
                                        <span style={{ marginRight: 32 }}>{assetInfo.bizModuleName || <EmptyLabel />}</span>
                                        <span style={{ marginRight: 32 }}>主题域：{assetInfo.themeName || <EmptyLabel />}</span>
                                        <span>业务过程：{assetInfo.bizProcessName || <EmptyLabel />}</span>
                                    </React.Fragment>
                                ),
                            },
                            {
                                label: '事实资产名称',
                                required: true,
                                content: (
                                    <div style={{ position: 'relative' }}>
                                        <Input
                                            style={{ width: 468 }}
                                            className='tableAutoInput'
                                            placeholder='请输入中文名称'
                                            value={tableNameCn}
                                            onChange={this.onChangeTableNameCn}
                                            onBlur={this.onInputBlur}
                                            onFocus={this.onInputFocus}
                                            maxLength={64}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{tableNameCn.length}/64</span>}
                                        />
                                        {showDropown ? (
                                            <div style={{ width: 468 }} className='tableAutoDropdown commonScroll'>
                                                {tableNameCnData.map((item) => {
                                                    return (
                                                        <div
                                                            className='tableAutoDropdownItem'
                                                            dangerouslySetInnerHTML={{ __html: item.showDesc }}
                                                            onClick={this.onSelectTableNameCn.bind(this, item)}
                                                        ></div>
                                                    )
                                                })}
                                                {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>暂无推荐，请输入进行搜索</div> : null}
                                            </div>
                                        ) : null}
                                    </div>
                                ),
                            },
                            {
                                label: '维度资产英文名称',
                                content: (
                                    <Input
                                        style={{ width: 468 }}
                                        maxLength={64 - assetInfo.englishPrefixName.length}
                                        onChange={this.onChangeTableEn}
                                        onBlur={this.onTableEnBlur}
                                        value={tableNameEn}
                                        addonBefore={assetInfo.englishPrefixName}
                                        suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length + assetInfo.englishPrefixName.length}/64</span>}
                                        placeholder='输入中文名可自动匹配英文名'
                                    />
                                ),
                            },

                            {
                                label: '事实资产类型',
                                required: true,
                                content: (
                                    <Radio.Group value={assetInfo.type} onChange={this.changeType}>
                                        <Radio value={1}>单表模型</Radio>
                                        <Radio value={2}>多表模型</Radio>
                                    </Radio.Group>
                                ),
                            },
                            {
                                label: '描述信息',
                                content: (
                                    <div style={{ position: 'relative', width: 468 }}>
                                        <TextArea maxLength={128} style={{ height: 52, width: 468 }} value={assetInfo.description} onChange={this.changeDesc} placeholder='请输入描述信息' />
                                        <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{assetInfo.description ? assetInfo.description.length : 0}/128</span>
                                    </div>
                                ),
                            },
                            {
                                label: '负责人',
                                content: (
                                    <Select allowClear style={{ width: 468 }} onChange={this.changeUser} value={assetInfo.businessManager} placeholder='负责人'>
                                        {userList.map((item) => {
                                            return (
                                                <Option value={item.username} key={item.username}>
                                                    {item.realname}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                ),
                            },
                        ])}
                    </div>
                </Module>
                <Module title='字段详情'>
                    {assetInfo.type == 1 ? (
                        this.columnTableRender()
                    ) : (
                        <Tabs activeKey={tabValue} onChange={this.changeTab}>
                            <TabPane tab='字段详情' key='0'>
                                <div className='searchArea' style={{ marginBottom: 15 }}>
                                    <Dropdown overlay={menu}>
                                        <Button type='primary'>新建字段</Button>
                                    </Dropdown>
                                    <div style={{ float: 'right', margin: 0 }}>
                                        <Checkbox onChange={this.changeCheckbox} defaultChecked>
                                            隐藏维度属性
                                        </Checkbox>
                                    </div>
                                </div>
                                {this.columnTableRender()}
                            </TabPane>
                            <TabPane tab='关联关系' key='1'>
                                {tabValue == 1 ? (
                                    <div style={{ height: 'calc(100vh - 150px)', marginTop: 30 }}>
                                        <EntityRelation
                                            canEdit={true}
                                            editRelation={this.editRelation}
                                            ref={(dom) => {
                                                this.entityChart = dom
                                            }}
                                            colors={this.colors}
                                        />
                                    </div>
                                ) : null}
                            </TabPane>
                        </Tabs>
                    )}
                </Module>

                <div className='FloatFooter HControlGroup' style={{ marginBottom: 0 }}>
                    <Button onClick={this.prePage} ghost type='primary'>
                        上一步
                    </Button>
                    <Tooltip title={!tableNameCnWithSpace || !tableNameEn ? disabledDesc : ''}>
                        <Button disabled={!tableNameCnWithSpace || !tableNameEn} type='primary' loading={loading} onClick={this.postData}>
                            完成定义
                        </Button>
                    </Tooltip>
                    <Button
                        onClick={() => {
                            this.back()
                        }}
                    >
                        取消
                    </Button>
                </div>
                <AddRelation
                    ref={(dom) => {
                        this.addRelation = dom
                    }}
                    addRelation={this.postRelation}
                    openModal={this.openAddPage}
                    cancel={this.cancel}
                    canEdit={canEdit}
                    {...this.props}
                    leftColumnId={leftColumnId}
                    relationId={relationId}
                />
                {formulaVisible && (
                    <Modal title={isFormulaEdit ? '编辑计算字段' : '添加计算字段'} visible={formulaVisible} footer={null} onCancel={this.cancel} width={1005}>
                        <AddNewCol
                            wrappedComponentRef={(refs) => {
                                this.addNewCol = refs
                            }}
                            businessIds={[this.props.location.state.id]}
                            usableBusinessIds={[this.props.location.state.id]}
                            handleCancel={this.cancel}
                            scope={2}
                            isEdit={isFormulaEdit}
                            formulaContent={formulaContent}
                            formulaType={formulaType}
                            addFactAsset={true}
                            cname={formulaCname}
                            tempBusinessId={assetInfo.queryId}
                            saveFormula={this.saveFormula}
                            formTitle='字段名称'
                        />
                    </Modal>
                )}
            </React.Fragment>
        )
    }
}
