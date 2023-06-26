import ExpandTable from '@/app/dama/component/expandTable'
import TableGraphPage from '@/app/graph/TableGraphPage'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import Module from '@/component/Module'
import TextMore from '@/component/textmore/TextMore'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Collapse, Divider, Input, Modal, Popover, Radio, Select, Spin, Table, Tabs, Tag, Tooltip, TreeSelect, Typography } from 'antd'
import { tableVersionList } from 'app_api/autoManage'
import {
    foreignRelation,
    getBloodHot,
    getBloodScript,
    getColumnLineage,
    getColumnLineageColumns,
    getLineageColumnFilters,
    getRelation,
    getSysBasic,
    getSysColumn,
    getSysPartitionColumn,
    getTableFilters,
    getTableLineage,
} from 'app_api/dataAssetApi'
import { LzTable } from 'app_component'
import _ from 'lodash'
import React, { Component } from 'react'
import './sysDetail.less'

const { Paragraph } = Typography
const { TabPane } = Tabs
const confirm = Modal.confirm
const { TextArea } = Input
const TreeNode = TreeSelect.TreeNode
const { CheckableTag } = Tag

const { Panel } = Collapse

const { Option } = Select

// let columnGraph = null;

export default class SysDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basicInfo: {
                qaTaskInfo: {},
            },
            loading: false,
            pageLoading: false,
            partitionLoading: false,
            tabValue: '1',
            usedValue: '1',
            bloodValue: '1',

            fieldList: [],
            fieldPage: {
                pageSize: 20,
                total: 0,
            },
            fieldInput: '',
            partitionFieldList: [],
            bloodScriptList: [],
            bloodScriptPage: {
                pageSize: 20,
                total: 0,
            },
            bloodHotList: [],
            bloodHotPage: {
                pageSize: 20,
                total: 0,
            },
            relationsList: [],
            relationsPage: {
                pageSize: 20,
                total: 0,
            },

            tableFilters: [],
            tableFiltersChoose: [],
            lineageColumnFilter: [],
            lineageColumnFilterChoose: [],
            tableLineage: [],
            columnLineageColumns: [],
            columnLineage: [],
            tableHeader: false,
            columnLineageId: false,
            tableId: this.dataId,

            graphLoading: false,
            graphWidth: 0,
            columnId: '',
            queryInfo: {
                keyword: '',
            },
        }
        this.erColumns = [
            {
                dataIndex: 'fieldName',
                key: 'fieldName',
                title: '字段名称',
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
                dataIndex: 'fieldKeyType',
                key: 'fieldKeyType',
                title: '主外键',
                width: '100px',
                render: (text, record) =>
                    text !== undefined ? (
                        <span>
                            {text == 1 ? (
                                <Tooltip title='主键'>
                                    <IconFont type='icon-zhujian' />
                                </Tooltip>
                            ) : text == 2 ? (
                                <Tooltip title='逻辑主键'>
                                    <span style={{ color: '#98A8B9' }} className='iconfont icon-zhujian'></span>
                                </Tooltip>
                            ) : (
                                <Tooltip title='外键'>
                                    <IconFont type='icon-waijian' />
                                </Tooltip>
                            )}
                        </span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'relationFieldName',
                key: 'relationFieldName',
                title: '关联字段',
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
                dataIndex: 'relationTableName',
                key: 'relationTableName',
                title: '关联表',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <a onClick={this.openTableDetail.bind(this, record)} className='LineClamp'>
                                {text}
                            </a>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.fieldColumns = [
            {
                dataIndex: 'physicalField',
                key: 'physicalField',
                title: '字段英文名',
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
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                title: '字段中文名',
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
                dataIndex: 'columnStandardCname',
                key: 'columnStandardCname',
                title: '数据标准',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <a onClick={this.onView.bind(this, record)} className='LineClamp'>
                                {text}
                            </a>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                title: '安全等级',
                width: '100px',
                render: (text) => {
                    if (text) {
                        return <div>{this.state.basicInfo.levelConfirm ? text : <EmptyLabel />}</div>
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '类型',
                width: '100px',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'dataLength',
                key: 'dataLength',
                title: '长度',
                width: '100px',
                render: (text) => text,
            },
            {
                dataIndex: 'dataPrecision',
                key: 'dataPrecision',
                title: '精度',
                width: '100px',
                render: (text) => text,
            },
            {
                dataIndex: 'isPrimarykey',
                key: 'isPrimarykey',
                title: '主外键',
                width: '100px',
                render: (text, record) => {
                    if (record.isPrimarykey) {
                        return <IconFont type='icon-zhujian' />
                    }
                    if (record.isForeignKey) {
                        return <IconFont type='icon-waijian' />
                    }
                    return <EmptyLabel />
                },
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '其他信息',
                width: 160,
                render: (text, record) => {
                    return (
                        <div className='otherInfo'>
                            {record.desensitiseTag ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 1)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>敏感</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>敏感</div>
                            )}
                            {record.qaRuleList ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 2)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>质量</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>质量</div>
                            )}
                            {record.codeItem ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 3)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>代码项</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>代码项</div>
                            )}
                        </div>
                    )
                },
            },
        ]
        this.partionColumns = [
            {
                dataIndex: 'physicalField',
                key: 'physicalField',
                title: '字段英文名',
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
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                title: '字段中文名',
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
                dataIndex: 'columnStandardCname',
                key: 'columnStandardCname',
                title: '数据标准',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <a onClick={this.onView.bind(this, record)} className='LineClamp'>
                                {text}
                            </a>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                title: '安全等级',
                width: '100px',
                render: (text) => {
                    if (text) {
                        return <div>{this.state.basicInfo.levelConfirm ? text : <EmptyLabel />}</div>
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '类型',
                width: '100px',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'dataLength',
                key: 'dataLength',
                title: '长度',
                width: '100px',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'partitionFormat',
                key: 'partitionFormat',
                title: '分区格式',
                width: '100px',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '其他信息',
                width: 160,
                render: (text, record) => {
                    return (
                        <div className='otherInfo'>
                            {record.desensitiseTag ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 1)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>敏感</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>敏感</div>
                            )}
                            {record.qaRuleList ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 2)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>质量</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>质量</div>
                            )}
                            {record.codeItem ? (
                                <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 3)}>
                                    <div className='otherInfoItem otherInfoItemSelected'>代码项</div>
                                </Popover>
                            ) : (
                                <div className='otherInfoItem'>代码项</div>
                            )}
                        </div>
                    )
                },
            },
        ]

        this.bloodScriptColumns = [
            {
                dataIndex: 'tableName',
                key: 'tableName',
                title: '表名称',
                width: '200px',
            },
            {
                dataIndex: 'fileName',
                key: 'fileName',
                title: '关联脚本',
                render: (text, record) =>
                    text ? (
                        <Button onClick={() => this.toSql(record)} type='link'>
                            {text}
                        </Button>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'relationWithTable',
                key: 'relationWithTable',
                title: '与脚本关系',
                width: '160px',
                render: (text) => text || <EmptyLabel />,
            },
        ]

        this.bloodHotColumns = [
            {
                dataIndex: 'ename',
                key: 'ename',
                title: '字段名称',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'cname',
                key: 'cname',
                title: '中文名',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'totalUse',
                key: 'totalUse',
                title: '使用总次数',
                align: 'right',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popover
                                placement='topLeft'
                                content={
                                    <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                        <div style={{ marginBottom: 8, color: '#333' }}>使用详情</div>
                                        <div>
                                            <span>SELECT次数：</span>
                                            <span className='atomTooltip'>{record.numberOfSelect}</span>
                                        </div>
                                        <div>
                                            <span>JOIN次数：</span>
                                            <span className='atomTooltip'>{record.numberOfJoin}</span>
                                        </div>
                                        <div>
                                            <span>WHERE次数：</span>
                                            <span className='atomTooltip'>{record.numberOfWhere}</span>
                                        </div>
                                        <div>
                                            <span>GROUPBY次数：</span>
                                            <span className='atomTooltip'>{record.numberOfGroupBy}</span>
                                        </div>
                                    </div>
                                }
                            >
                                <span>{text}</span>
                            </Popover>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'bizAttribute',
                key: 'bizAttribute',
                title: '业务属性',
                render: (text, record, index) => {
                    return (
                        <Tooltip placement='topLeft' title={text}>
                            <span
                                onClick={this.openRelatedTable.bind(this, record)}
                                style={{ color: record.bizAttributeNum == 1 ? '#1890ff' : '', cursor: record.bizAttributeNum == 1 ? 'pointer' : '' }}
                            >
                                {text || <EmptyLabel />}
                            </span>
                        </Tooltip>
                    )
                },
            },
            {
                dataIndex: 'remarks',
                key: 'remarks',
                title: '备注信息',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]

        this.relationsColumns = [
            {
                dataIndex: 'relateTableName',
                key: 'relateTableName',
                title: '关联表名称',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'relateColumnExpression',
                key: 'relateColumnExpression',
                title: '关联字段',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                dataIndex: 'fileName',
                key: 'fileName',
                title: '关系来源脚本',
                render: (text, record) => (text ? <a onClick={() => this.toSql(record)}>{text}</a> : <EmptyLabel />),
            },
        ]
        this.historyColumns = [
            {
                title: '版本名称',
                dataIndex: 'tag',
                key: 'tag',
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
                title: '版本描述',
                dataIndex: 'desc',
                key: 'desc',
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
                title: '定版时间',
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
                title: '定版人',
                dataIndex: 'submitter',
                key: 'submitter',
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

        this.myBox = React.createRef()
    }
    componentWillMount = async () => {
        if (this.pageParams.tabValue) {
            this.tabKeyChange(this.pageParams.tabValue)
        }
    }
    getHistoryTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            id: this.dataId,
        }
        let res = await tableVersionList(query)
        if (res.code == 200) {
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
        if (this.controller) {
            this.controller.reset()
        }
    }
    openRelatedTable = async (data) => {
        if (data.bizAttributeNum !== 1) {
            return
        }
        await this.setState({
            usedValue: '2',
            columnId: data.columnId,
        })
        this.getRelateList()
    }
    openTableDetail = (data) => {
        this.props.addTab('sysDetail', { id: data.relationTableId }, true)
    }
    componentDidMount = async () => {
        this.getBasicInfo()
        this.getLineageColumnFiltersData()
        this.getTableFiltersData()

        this.getColumnLineageColumnsData()

        // this.setState({
        //     graphWidth: this.myBox.current.offsetWidth - 40,
        // })
    }
    renderPopover = (data, type) => {
        return (
            <div style={{ color: '#5E6266', maxWidth: 250, lineHeight: '22px', maxHeight: 320 }}>
                <h4>{type == 1 ? '敏感标签' : type == 2 ? '质量规则（' + data.qaRuleList.length + '）' : '引用代码项'}</h4>
                {type == 1 ? (
                    <div>
                        <div style={{ margin: '12px 0 4px 0', color: '#2D3033' }}>{data.desensitiseTag.name}</div>
                        <div>
                            <span>敏感等级：</span>
                            <span>{data.desensitiseTag.sensitivityLevelName}</span>
                        </div>
                        <div>
                            <span>脱敏规则：</span>
                            <span>{data.desensitiseTag.defaultRuleName}</span>
                        </div>
                    </div>
                ) : null}
                {type == 2 ? (
                    <div>
                        {data.qaRuleList.map((item) => {
                            return (
                                <div>
                                    <div style={{ margin: '12px 0 4px 0', color: '#2D3033' }}>{item.name}</div>
                                    <div>
                                        <span>规则编码：</span>
                                        <span>{item.ruleCode}</span>
                                    </div>
                                    <div>
                                        <span>规则类型：</span>
                                        <span>{item.ruleTypePath}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
                {type == 3 ? (
                    <div style={{ color: '#2D3033' }}>
                        {data.codeItem.code} {data.codeItem.name}
                    </div>
                ) : null}
            </div>
        )
    }
    onView = (data) => {
        let query = {
            entityId: data.columnStandardCode,
            id: data.entityId,
        }
        this.props.addTab('标准详情', query, true)
    }
    // 获取基础信息
    getBasicInfo = async () => {
        this.setState({
            pageLoading: true,
        })
        let res = await getSysBasic({ id: this.dataId })
        if ((res.code = 200)) {
            res.data.qaTaskInfo = res.data.qaTaskInfo ? res.data.qaTaskInfo : {}
            const basicInfo = _.pickBy(res.data)
            await this.setState({
                basicInfo,
            })
            ProjectUtil.setDocumentTitle(_.get(basicInfo, 'physicalTable', ''))
        }
        this.setState({
            pageLoading: false,
        })
    }

    getLineageTableData = async (data = {}) => {
        const { lineageColumnFilterChoose, lineageColumnFilter } = this.state
        this.setState({
            graphLoading: true,
        })
        let res = await getTableLineage({
            reserveColumns: lineageColumnFilterChoose,
            reserveTables: this.state.tableFiltersChoose,
            tableId: this.dataId,
        })
        if ((res.code = 200)) {
            this.setState({
                tableLineage: _.get(data, 'open') ? _.map(res.data, (item) => _.assign({}, { open: true }, item)) : res.data,
            })
        }
        this.setState({
            graphLoading: false,
        })
    }

    get dataId() {
        const params = ProjectUtil.getPageParam(this.props)
        return params.id || params.data.id
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    columnsChange = (value) => {
        this.setState({
            columnLineageId: value,
        })
        this.getColumnLineageData(value)
    }

    getColumnLineageData = async (id) => {
        const myId = id || _.get(this.state, 'columnLineageColumns[0].id')

        if (_.isEmpty(myId)) {
            return
        }
        this.setState({
            graphLoading: true,
        })
        let res = await getColumnLineage({
            id: myId,
        })
        if ((res.code = 200)) {
            this.setState({
                columnLineage: res.data,
            })
        }
        this.setState({
            graphLoading: false,
        })
    }

    getLineageColumnFiltersData = async () => {
        this.setState({
            loading: true,
        })
        let res = await getLineageColumnFilters({ tableId: this.dataId })
        if ((res.code = 200)) {
            this.setState({
                lineageColumnFilter: res.data,
            })
        }
        this.setState({
            loading: false,
        })
    }

    getTableFiltersData = async () => {
        this.setState({
            loading: true,
        })
        let res = await getTableFilters({ id: this.dataId })
        if ((res.code = 200)) {
            this.setState({
                tableFilters: res.data,
            })
        }
        this.setState({
            loading: false,
        })
    }

    searchTableData = () => {
        this.getTableList({})
    }

    fieldInputChange = async (e) => {
        await this.setState({
            fieldInput: e.target.value,
        })
        if (!e.target.value) {
            this.searchTableData()
        }
    }

    getTableList = async (params = {}) => {
        this.setState({
            loading: true,
        })
        let query = {
            keyword: this.state.fieldInput || '',
            tableId: this.dataId,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
        }

        let res = await getSysColumn(query)
        if ((res.code = 200)) {
            this.setState({
                fieldList: this.addNum(res.data, _.get(params, 'current', 1), _.get(params, 'pageSize', 20)),
                fieldPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
        this.setState({
            loading: false,
        })
    }

    getPartitionTableList = async () => {
        let query = {
            tableId: this.dataId,
        }

        let res = await getSysPartitionColumn(query)
        if ((res.code = 200)) {
            res.data.map((item) => {
                item.samples = item.samples ? item.samples : []
                item.samplesDec = item.samples.join('，')
            })
            this.setState({
                partitionFieldList: res.data,
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            dataSource: [],
            total: 0,
        }
    }

    addNum = (data, current, pageSize) => {
        const list = []
        data.forEach((item, index) => {
            const basic = pageSize * (current - 1)
            const obj = {
                ...item,
                num: basic + index + 1,
            }
            list.push(obj)
        })

        return list
    }

    bloodScriptList = async (params = {}) => {
        let query = {
            id: this.dataId,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
        }
        let res = await getBloodScript(query)
        if ((res.code = 200)) {
            this.setState({
                bloodScriptList: this.addNum(res.data, _.get(params, 'current', 1), _.get(params, 'pageSize', 20)),
                bloodScriptPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
    }

    getBloodHotList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: this.dataId,
        }
        this.setState({ loading: true })
        let res = await getBloodHot(query)
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
                bloodHotList: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }

    getRelateList = async (params = {}) => {
        let query = {
            id: this.dataId,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
            columnId: this.state.columnId,
        }
        let res = await getRelation(query)
        if ((res.code = 200)) {
            this.setState({
                relationsList: this.addNum(res.data, _.get(params, 'current', 1), _.get(params, 'pageSize', 20)),
                relationsPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
    }

    tabKeyChange = (e) => {
        this.setState({
            tabValue: e,
        })
        if (+e === 2) {
            this.getTableList({})
            this.getPartitionTableList()
        } else if (+e === 3) {
            this.getLineageTableData()
            // this.getColumnLineageData();
        } else if (+e === 4) {
            this.bloodScriptList()
            this.getBloodHotList({})
            this.getRelateList()
        }
    }

    usedChange = async (e) => {
        await this.setState({
            usedValue: e.target.value,
            columnId: '',
        })
        if (e.target.value == 2) {
            this.getRelateList()
        }
    }

    bloodChange = (e) => {
        this.setState({
            bloodValue: e.target.value,
        })
        if (e.target.value == '1') {
            this.getLineageTableData()
        } else {
            this.getColumnLineageData()
        }
    }

    toSql = (item) => {
        this.props.addTab(
            'sqlDetail',
            {
                id: _.get(item, 'fileId'),
            },
            true
        )
    }

    bloodAnalysis = () => {
        this.setState({
            tableHeader: false,
        })
        this.getLineageTableData({
            open: true,
        })
    }

    reserveColumnsChange = (value) => {
        this.setState({
            lineageColumnFilterChoose: _.filter(this.state.lineageColumnFilter, (item) => _.includes(value, item.id)),
        })
    }

    tableDel = (data) => {
        this.setState({
            tableFiltersChoose: _.filter(this.state.tableFiltersChoose, (item) => item.id !== data.id),
        })
    }

    reserveTables = (value) => {
        const { tableFiltersChoose, tableFilters } = this.state
        const ids = tableFiltersChoose.map((item) => item.id)
        ids.push(value)
        const chooseIs = _.uniq(ids)
        this.setState({
            tableFiltersChoose: _.filter(tableFilters, (item) => _.includes(chooseIs, item.id)),
        })
    }

    handleButtonClick = () => {
        this.setState({
            tableHeader: !this.state.tableHeader,
        })
    }

    // 字段血缘相关

    getColumnLineageColumnsData = async () => {
        this.setState({
            loading: true,
        })
        let res = await getColumnLineageColumns({ tableId: this.dataId })
        if ((res.code = 200)) {
            this.setState({
                columnLineageColumns: res.data,
                columnLineageId: _.get(res, 'data[0].id'),
            })
        }
        this.setState({
            loading: false,
        })
    }

    toSearch = () => {
        this.props.addTab('元数据搜索', {
            data: {
                techniqueManagerId: _.get(this.state.basicInfo, 'techniqueManagerId'),
            },
        })
    }

    refresh = () => {
        if (this.state.bloodValue === '1') {
            this.ChildTable.refresh()
        } else {
            this.ChildColumn.refresh()
        }
    }

    small = () => {
        if (this.state.bloodValue === '1') {
            this.ChildTable.small()
        } else {
            this.ChildColumn.small()
        }
    }

    large = () => {
        if (this.state.bloodValue === '1') {
            this.ChildTable.large()
        } else {
            this.ChildColumn.large()
        }
    }
    openTaskDetail = () => {
        let { basicInfo } = this.state
        let query = {
            id: basicInfo.qaTaskInfo.taskJobId,
            name: basicInfo.qaTaskInfo.name,
            useBusinessId: true,
            qaTableId: basicInfo.qaTaskInfo.tableId,
            businessName: basicInfo.qaTaskInfo.tableNameEn,
        }
        this.props.addTab('检核任务详情', query, true)
    }
    getErTableList = async (params = {}) => {
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            id: this.dataId,
        }
        let res = await foreignRelation(query)
        if (res.code == 200) {
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

    render() {
        const {
            basicInfo,
            tabValue,
            usedValue,
            loading,
            partitionLoading,
            fieldList,
            partitionFieldList,
            bloodScriptList,
            bloodHotList,
            relationsList,
            bloodValue,
            lineageColumnFilter,
            tableFilters,
            tableFiltersChoose,
            columnLineageColumns,
            tableLineage,
            columnLineage,
            fieldPage,
            fieldInput,
            bloodHotPage,
            bloodScriptPage,
            relationsPage,
            tableHeader,
            columnLineageId,
            tableId,
            graphLoading,
            graphWidth,
            queryInfo,
            pageLoading,
        } = this.state

        const now = [
            {
                ename: _.get(basicInfo, 'physicalTable', ''),
                dir: 'now',
            },
        ]
        const comboChoose = [...now, ...tableFiltersChoose]
        return (
            <Spin spinning={pageLoading}>
                <div className='sysDetail'>
                    {/* 页头 */}
                    <header>
                        <img src={require('app_images/dataAsset/sys_detail.png')} />
                        <div>
                            <h2 style={{ fontWeight: '400' }}>
                                {_.get(basicInfo, 'physicalTable', '')} {_.get(basicInfo, 'tableName', '')}
                            </h2>
                            <div>
                                {RenderUtil.renderSplitList(
                                    [
                                        {
                                            label: '系统路径：',
                                            content: (basicInfo.sysClassPath ? basicInfo.sysClassPath : '') + ' - ' + (basicInfo.path ? basicInfo.path : ''),
                                        },
                                        {
                                            label: '数据库类型：',
                                            content: _.get(basicInfo, 'datasourceType'),
                                        },
                                        {
                                            label: '数仓层级：',
                                            hide: !basicInfo.dwLevelPath,
                                            content: _.get(basicInfo, 'dwLevelPath'),
                                        },
                                        {
                                            label: '分类信息：',
                                            content: _.get(basicInfo, 'classPath'),
                                        },
                                        // {
                                        //     label: '安全等级：',
                                        //     content: basicInfo.levelConfirm ? _.get(basicInfo, 'securityLevel') : '',
                                        // },
                                    ],
                                    'atomLabel'
                                )}
                            </div>
                        </div>
                    </header>
                    <main>
                        <Tabs className='assetTab' animated={false} onChange={this.tabKeyChange} activeKey={tabValue}>
                            <TabPane tab='表信息' key='1'>
                                <Module title='基本信息' style={{ marginTop: 8 }}>
                                    <div className='MiniForm Grid4'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '来源',
                                                content: _.get(basicInfo, 'path', ''),
                                            },
                                            {
                                                label: '数据库类型',
                                                content: _.get(basicInfo, 'datasourceType', ''),
                                            },
                                            {
                                                label: '字段个数',
                                                content: _.get(basicInfo, 'columnNumber', ''),
                                            },
                                            {
                                                label: '存储空间',
                                                content: _.get(basicInfo, 'tableUsedSpace') ? `${_.get(basicInfo, 'tableUsedSpace')}M` : <EmptyLabel />,
                                            },
                                            {
                                                label: '数仓层级',
                                                hide: !basicInfo.dwLevelPath,
                                                content: _.get(basicInfo, 'dwLevelPath', ''),
                                            },
                                            {
                                                label: '分类信息',
                                                content: _.get(basicInfo, 'classPath', ''),
                                            },
                                        ])}
                                    </div>
                                </Module>
                                {basicInfo.tagList && basicInfo.tagList.length ? (
                                    <div>
                                        <Divider />
                                        <Module title='标签信息' style={{ marginTop: 8 }}>
                                            <div>
                                                {basicInfo.tagList.map((tag) => {
                                                    return <Tag className='ant-tag-grey'>{tag.tagValueName}</Tag>
                                                })}
                                            </div>
                                        </Module>
                                    </div>
                                ) : null}
                                {basicInfo.qaTaskInfo.name ? (
                                    <div>
                                        <Divider />
                                        <Module title='检核任务' style={{ marginTop: 8 }}>
                                            <div className='MiniForm Grid4'>
                                                {RenderUtil.renderFormItems([
                                                    {
                                                        label: '任务名称',
                                                        content: <a onClick={this.openTaskDetail}>{_.get(basicInfo.qaTaskInfo, 'name', '')}</a>,
                                                    },
                                                    {
                                                        label: '任务状态',
                                                        content: (
                                                            <span>
                                                                <span style={{ background: basicInfo.qaTaskInfo.status ? '#28AE52' : '#FF6216' }} className='redDot'></span>
                                                                {basicInfo.qaTaskInfo.status ? '激活' : '挂起'}
                                                            </span>
                                                        ),
                                                    },
                                                    {
                                                        label: '适用任务',
                                                        content: _.get(basicInfo.qaTaskInfo, 'bizType', ''),
                                                    },
                                                    {
                                                        label: '最近执行时间',
                                                        content: _.get(basicInfo.qaTaskInfo, 'lastCheckTime', ''),
                                                    },
                                                    {
                                                        label: '规则数量',
                                                        content: _.get(basicInfo.qaTaskInfo, 'ruleCount', ''),
                                                    },
                                                    {
                                                        label: '规则通过率',
                                                        content: _.get(basicInfo.qaTaskInfo, 'lastPassRate', '') + '%',
                                                    },
                                                ])}
                                            </div>
                                        </Module>
                                    </div>
                                ) : null}
                                <Divider />
                                <Module title='管理信息' style={{ marginTop: 8 }}>
                                    <div className='MiniForm Grid4'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '技术归属部门',
                                                content: _.get(basicInfo, 'technicalDepartName', ''),
                                            },
                                            {
                                                label: '技术负责人',
                                                content: _.get(basicInfo, 'technicalManagerName', ''),
                                            },
                                            {
                                                label: '业务归属部门',
                                                content: _.get(basicInfo, 'businessDepartName', ''),
                                            },
                                            {
                                                label: '业务负责人',
                                                content: _.get(basicInfo, 'businessManagerName', ''),
                                            },
                                        ])}
                                    </div>
                                </Module>
                                <Divider />
                                <Module title='安全信息' style={{ marginTop: 8 }}>
                                    <div className='MiniForm Grid4'>
                                        {RenderUtil.renderFormItems([
                                            // {
                                            //     label: '安全等级',
                                            //     content: basicInfo.levelConfirm ? _.get(basicInfo, 'securityLevel', '') : '',
                                            // },
                                            {
                                                label: '字段最高安全等级',
                                                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMaxSecLevel', '') : '',
                                            },
                                            {
                                                label: '字段最低安全等级',
                                                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMinSecLevel', '') : '',
                                            },
                                            {
                                                label: '敏感字段个数',
                                                content: _.get(basicInfo, 'desensitiseColumnCount', ''),
                                            },
                                        ])}
                                    </div>
                                </Module>
                                <Divider />
                                <Module title='技术信息'>
                                    <div className='MiniForm Grid1'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '创建时间',
                                                content: _.get(basicInfo, 'createTime', ''),
                                            },
                                            {
                                                label: 'DDL信息',
                                                content: _.get(basicInfo, 'ddl') ? <TextMore>{_.get(basicInfo, 'ddl')}</TextMore> : undefined,
                                            },
                                            {
                                                label: '关联血缘脚本',
                                                content: !_.isEmpty(_.get(basicInfo, 'lineageFileInfos'))
                                                    ? _.get(basicInfo, 'lineageFileInfos').map((item) => (
                                                          <div className='sql_box'>
                                                              <a href='javascript:;' style={{ fontSize: '14px' }} onClick={() => this.toSql(item)}>
                                                                  {_.get(item, 'fileName')}
                                                              </a>
                                                              ({_.get(item, 'relationWithTable')})
                                                          </div>
                                                      ))
                                                    : undefined,
                                            },
                                        ])}
                                    </div>
                                </Module>
                            </TabPane>
                            <Tabs.TabPane key='2' tab='字段信息'>
                                <div className='HControlGroup' style={{ marginBottom: 16 }}>
                                    <Input.Search
                                        allowClear
                                        value={fieldInput}
                                        onSearch={this.searchTableData}
                                        onChange={this.fieldInputChange}
                                        placeholder='请输入字段中/英文名'
                                        onPressEnter={this.searchTableData}
                                    />
                                </div>
                                <Table
                                    rowKey='id'
                                    loading={loading}
                                    columns={this.fieldColumns}
                                    dataSource={fieldList}
                                    onChange={this.getTableList}
                                    pagination={{
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        pageSize: _.get(fieldPage, 'pageSize'),
                                        total: _.get(fieldPage, 'total'),
                                        showTotal: (total) => (
                                            <span>
                                                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                            </span>
                                        ),
                                    }}
                                />
                                <Divider />
                                {partitionFieldList.length ? (
                                    <Module title='分区字段信息'>
                                        <div style={{ color: '#5E6266', marginBottom: '16px' }}>分区类型：{partitionFieldList[0] ? partitionFieldList[0].partitionType : ''}</div>
                                        <ExpandTable
                                            ref={(dom) => (this.expandTable = dom)}
                                            expandable={true}
                                            tableProps={{
                                                rowKey: 'id',
                                                columns: this.partionColumns,
                                                dataSource: partitionFieldList,
                                                pagination: false,
                                            }}
                                            renderSearch={() => {
                                                return null
                                            }}
                                            expandedRowRenderDetail={(record, index) => {
                                                return <div className='expandArea'>分区值：{record.samplesDec}</div>
                                            }}
                                            requestListFunction={(page, pageSize) => {
                                                return this.getPartitionTableList({
                                                    pagination: {
                                                        page,
                                                        page_size: pageSize,
                                                    },
                                                })
                                            }}
                                        />
                                    </Module>
                                ) : null}
                            </Tabs.TabPane>
                            <TabPane tab='血缘信息' key='3'>
                                <TableGraphPage tableId={tableId} style={{ height: 600 }} />
                            </TabPane>
                            <TabPane tab='ER关系' key='6'>
                                {tabValue == '6' ? (
                                    <RichTableLayout
                                        disabledDefaultFooter
                                        smallLayout
                                        editColumnProps={{ hidden: true }}
                                        tableProps={{
                                            columns: this.erColumns,
                                            key: 'relationTableId',
                                        }}
                                        requestListFunction={(page, pageSize, filter, sorter) => {
                                            return this.getErTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                },
                                            })
                                        }}
                                    />
                                ) : null}
                            </TabPane>
                            <TabPane tab='使用记录' key='4'>
                                <Radio.Group value={usedValue} style={{ marginBottom: 16 }} onChange={this.usedChange}>
                                    <Radio.Button value='1'>血缘脚本</Radio.Button>
                                    <Radio.Button value='2'>关联关系</Radio.Button>
                                    <Radio.Button value='3'>字段热度</Radio.Button>
                                </Radio.Group>
                                <div style={{ display: usedValue === '1' ? 'block' : 'none' }}>
                                    <Table
                                        rowKey={(record, index) => `${index}_${record.fileId}`}
                                        loading={partitionLoading}
                                        columns={this.bloodScriptColumns}
                                        dataSource={bloodScriptList}
                                        onChange={this.bloodScriptList}
                                        pagination={
                                            _.get(bloodScriptPage, 'total', 0) <= 20
                                                ? false
                                                : {
                                                      showQuickJumper: true,
                                                      showSizeChanger: true,
                                                      pageSize: _.get(bloodScriptPage, 'pageSize'),
                                                      total: _.get(bloodScriptPage, 'total'),
                                                      showTotal: (total) => (
                                                          <span>
                                                              总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                          </span>
                                                      ),
                                                  }
                                        }
                                    />
                                </div>
                                <div style={{ display: usedValue === '2' ? 'block' : 'none' }}>
                                    <Table
                                        rowKey={(record, index) => `${index}_${record.relateTableId}`}
                                        loading={partitionLoading}
                                        columns={this.relationsColumns}
                                        dataSource={relationsList}
                                        onChange={this.getRelateList}
                                        pagination={
                                            _.get(relationsPage, 'total', 0) <= 20
                                                ? false
                                                : {
                                                      showQuickJumper: true,
                                                      showSizeChanger: true,
                                                      pageSize: _.get(relationsPage, 'pageSize'),
                                                      total: _.get(relationsPage, 'total'),
                                                      showTotal: (total) => (
                                                          <span>
                                                              总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                          </span>
                                                      ),
                                                  }
                                        }
                                    />
                                </div>
                                <div style={{ display: usedValue === '3' ? 'block' : 'none' }}>
                                    <LzTable
                                        key='1'
                                        columns={this.bloodHotColumns}
                                        dataSource={bloodHotList}
                                        ref={(dom) => {
                                            this.lzTableDom = dom
                                        }}
                                        getTableList={this.getBloodHotList}
                                        loading={loading}
                                        rowKey={(record, index) => `${index}_${record.id}`}
                                        pagination={{
                                            showQuickJumper: true,
                                            showSizeChanger: true,
                                        }}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='历史版本' key='5'>
                                {tabValue == '5' ? (
                                    <RichTableLayout
                                        className='historyTablelayout'
                                        disabledDefaultFooter
                                        editColumnProps={{
                                            hidden: true,
                                        }}
                                        tableProps={{
                                            columns: this.historyColumns,
                                            key: 'version',
                                        }}
                                        renderSearch={(controller) => {
                                            this.controller = controller
                                            return (
                                                <React.Fragment>
                                                    <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入版本名称' />
                                                </React.Fragment>
                                            )
                                        }}
                                        requestListFunction={(page, pageSize, filter, sorter) => {
                                            return this.getHistoryTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                },
                                            })
                                        }}
                                    />
                                ) : null}
                            </TabPane>
                        </Tabs>
                    </main>
                </div>
            </Spin>
        )
    }
}
