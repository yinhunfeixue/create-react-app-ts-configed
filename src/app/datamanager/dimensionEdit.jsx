import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import { Alert, Button, Cascader, Col, Divider, Form, Input, InputNumber, message, Radio, Row, Select, Steps, Switch, Table, Tooltip, TreeSelect } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { catalogDwTree } from 'app_api/dataSecurity'
import { getUserList } from 'app_api/manageApi'
import {
    dimtableColumn,
    dimtableColumnForAdd,
    dimtableDatabaseList,
    dimtableDataTypes,
    dimtableEditDetail,
    dimtableEnglishNamePrefix,
    dimtableSaveAndGenerateAssets,
    dimtableSuggestClassify,
    dimtableTable,
    dimtableTimeFormat,
    parseCname,
    suggestion,
    verticalDimColumn,
} from 'app_api/metadataApi'
import Lodash from 'lodash'
import React, { Component } from 'react'

// import './index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const TreeNode = TreeSelect.TreeNode

const loop = (data) =>
    data.map((item) => {
        if (item.children && item.children.length) {
            return (
                <TreeNode disabled={true} key={item.id} value={item.id} title={item.name}>
                    {loop(item.children)}
                </TreeNode>
            )
        }
        return (
            <TreeNode
                key={item.id}
                value={item.id}
                title={
                    <Tooltip title={item.name}>
                        <div
                            style={{
                                overflowX: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {item.name}
                        </div>
                    </Tooltip>
                }
            />
        )
    })

let col = 0
let spanName = 0
let tableName = 'columnData'

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                englishPrefixName: '',
                partitionFlag: false,
                partitionColumnEnames: [],
                type: '1',
                subType: '2',
                classifyNodeIds: [],
            },
            dataSourceConfig: true,
            databaseIdList: [],
            loading: false,
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
            showShadow: false,

            partitionData: [],
            tableLoading: false,
            timeformatList: [
                {
                    name: '非时间字段',
                    id: '1',
                    children: [],
                },
                {
                    name: '时间字段',
                    id: '2',
                    children: [],
                },
            ],
            canSave: false,
            disabledDesc: '需对上面内容进行选择，并完善字段中文信息，“*”为必填项',
            databaseList: [],
            tableList: [],
            userList: [],
            bizClassifyDefList: [],
            themeDefList: [],
            verticalColumnInfo: {
                levelCount: 2,
                rootValue: false,
                descColumns: [],
                descColumnIds: [],
                parentPrimaryColumnId: undefined,
                primaryColumnId: undefined,
            },
            descColumnList: [],
            primaryColumnList: [],
            parentPrimaryColumnList: [],
        }
        this.partitionColumns = [
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 200,
                fixed: 'left',
                className: 'fixedRow',
                render: (text, record, index) => <Tooltip title={text}>{text ? text : <EmptyLabel />}</Tooltip>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <Input
                                ref={(input) => {
                                    this['inputFocus1' + index] = input
                                }}
                                style={{ paddingRight: 45 }}
                                value={text}
                                maxLength={32}
                                disabled={record.relateStandardId}
                                onChange={this.changeColumnCn.bind(this, index, 'partitionData')}
                                onFocus={this.spanNameFocus.bind(this, index, 1, 'partitionData')}
                                placeholder='请输入中文名'
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '5px',
                                    color: '#B3B3B3',
                                    fontSize: '12px',
                                }}
                            >
                                {text ? text.length : 0}/32
                            </span>
                            {record.relateStandardId ? (
                                <div style={{ color: '#b3b3b3', paddingLeft: 12, marginTop: 5 }}>
                                    原始名：
                                    <Tooltip title={record.originalChineseName}>
                                        <div
                                            style={{
                                                width: 'calc(100% - 48px)',
                                                verticalAlign: 'bottom',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {record.originalChineseName || <EmptyLabel />}
                                        </div>
                                    </Tooltip>
                                </div>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '字段类型',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            {this.state.showDataType ? (
                                <Select
                                    // ref={input => {if (input) {input.focus()} }}
                                    ref={(input) => {
                                        this['inputFocus2' + index] = input
                                    }}
                                    style={{ width: '100px' }}
                                    onChange={this.changeDataType.bind(this, index, 'partitionData')}
                                    onFocus={this.spanNameFocus.bind(this, index, 2, 'partitionData')}
                                    value={text}
                                    placeholder='字段类型'
                                >
                                    {this.state.dataTypeInfo.length &&
                                        this.state.dataTypeInfo.map((item) => {
                                            return (
                                                <Option title={item} value={item} key={item}>
                                                    {item}
                                                </Option>
                                            )
                                        })}
                                </Select>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'relateStandardCode',
                key: 'relateStandardCode',
                title: '关联数据标准',
                width: 120,
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
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                title: '主键',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '主键' : <EmptyLabel />}</span>
                            <Switch style={{ height: '22px', float: 'right' }} onChange={this.primaryKeyChange.bind(this, index, 'partitionData')} checked={text} />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'timeFormat',
                key: 'timeFormat',
                title: '时间配置',
                width: 150,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            <TreeSelect
                                // ref={input => {if (input) {input.focus()} }}
                                ref={(input) => {
                                    this['inputFocus3' + index] = input
                                }}
                                value={text}
                                style={{ width: '200px' }}
                                treeDefaultExpandAll={true}
                                placeholder='非时间字段'
                                onFocus={this.spanNameFocus.bind(this, index, 3, 'partitionData')}
                                allowClear
                                onChange={this.changeTimeformat.bind(this, index, 'partitionData')}
                            >
                                {loop(this.state.timeformatList)}
                            </TreeSelect>
                        </div>
                    )
                },
            },
        ]
        this.columns = [
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 200,
                fixed: 'left',
                className: 'fixedRow',
                render: (text, record, index) => <Tooltip title={text}>{text ? text : <EmptyLabel />}</Tooltip>,
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <Input
                                // ref={input => {if (input) {input.focus()} }}
                                ref={(input) => {
                                    this['inputFocus_1' + index] = input
                                }}
                                onFocus={this.spanNameFocus.bind(this, index, 1, 'columnData')}
                                style={{ paddingRight: 45 }}
                                value={text}
                                maxLength={32}
                                disabled={record.relateStandardId}
                                onChange={this.changeColumnCn.bind(this, index, 'columnData')}
                                placeholder='请输入中文名'
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '5px',
                                    color: '#B3B3B3',
                                    fontSize: '12px',
                                }}
                            >
                                {text ? text.length : 0}/32
                            </span>
                            {record.relateStandardId ? (
                                <div style={{ color: '#b3b3b3', paddingLeft: 12, marginTop: 5 }}>
                                    原始名：
                                    <Tooltip title={record.originalChineseName}>
                                        <div
                                            style={{
                                                width: 'calc(100% - 48px)',
                                                verticalAlign: 'bottom',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {record.originalChineseName || <EmptyLabel />}
                                        </div>
                                    </Tooltip>
                                </div>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '字段类型',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            {this.state.showDataType ? (
                                <Select
                                    // ref={input => {if (input) {input.focus()} }}
                                    ref={(input) => {
                                        this['inputFocus_2' + index] = input
                                    }}
                                    onFocus={this.spanNameFocus.bind(this, index, 2, 'columnData')}
                                    style={{ width: '100px' }}
                                    onChange={this.changeDataType.bind(this, index, 'columnData')}
                                    value={text}
                                    placeholder='字段类型'
                                >
                                    {this.state.dataTypeInfo.length &&
                                        this.state.dataTypeInfo.map((item) => {
                                            return (
                                                <Option title={item} value={item} key={item}>
                                                    {item}
                                                </Option>
                                            )
                                        })}
                                </Select>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'relateStandardCode',
                key: 'relateStandardCode',
                title: '关联数据标准',
                width: 120,
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
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                title: '主键',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '主键' : <EmptyLabel />}</span>
                            <Switch style={{ height: '22px', float: 'right' }} onChange={this.primaryKeyChange.bind(this, index, 'columnData')} checked={text} />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'timeFormat',
                key: 'timeFormat',
                title: '时间配置',
                width: 150,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            <TreeSelect
                                // ref={input => {if (input) {input.focus()} }}
                                ref={(input) => {
                                    this['inputFocus_3' + index] = input
                                }}
                                onFocus={this.spanNameFocus.bind(this, index, 3, 'columnData')}
                                value={text}
                                style={{ width: '200px' }}
                                treeDefaultExpandAll={true}
                                dropdownMatchSelectWidth
                                dropdownStyle={{
                                    overflowX: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                placeholder='非时间字段'
                                allowClear
                                onChange={this.changeTimeformat.bind(this, index, 'columnData')}
                            >
                                {loop(this.state.timeformatList)}
                            </TreeSelect>
                        </div>
                    )
                },
            },
        ]
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount = async () => {
        this.getEnglishPrefix()
        this.getTimeFormat()
        this.getDataTypes()
        this.getDatabase()
        this.getUserData()
        this.getBizClassifyDefList()

        const { pageType } = this.pageParam
        if (pageType == 'edit') {
            this.getDmDetail()
        }
        document.addEventListener(
            'mousedown',
            function (e) {
                if (e.target.className == 'tableAutoDropdownItem' || e.target.className == 'highlight') {
                    e.preventDefault()
                }
            },
            false
        )
        let that = this
        document.addEventListener(
            'keydown',
            async function (e) {
                // 38=上键，37=左键 40=下键，39=右键
                console.log(spanName, col, 'spanName')
                if (e && e.keyCode == 38) {
                    if (tableName == 'columnData') {
                        if (that['inputFocus_' + spanName + (col - 1)]) {
                            that['inputFocus_' + spanName + (col - 1)].focus()
                        }
                    } else {
                        if (that['inputFocus' + spanName + (col - 1)]) {
                            that['inputFocus' + spanName + (col - 1)].focus()
                        }
                    }
                } else if (e && e.keyCode == 39) {
                    if (tableName == 'columnData') {
                        if (that['inputFocus_' + (spanName + 1) + col]) {
                            that['inputFocus_' + (spanName + 1) + col].focus()
                        }
                    } else {
                        if (that['inputFocus' + (spanName + 1) + col]) {
                            that['inputFocus' + (spanName + 1) + col].focus()
                        }
                    }
                } else if (e && e.keyCode == 40) {
                    if (tableName == 'columnData') {
                        if (that['inputFocus_' + spanName + (col + 1)]) {
                            that['inputFocus_' + spanName + (col + 1)].focus()
                        }
                    } else {
                        if (that['inputFocus' + spanName + (col + 1)]) {
                            that['inputFocus' + spanName + (col + 1)].focus()
                        }
                    }
                } else if (e && e.keyCode == 37) {
                    if (tableName == 'columnData') {
                        if (that['inputFocus_' + (spanName - 1) + col]) {
                            that['inputFocus_' + (spanName - 1) + col].focus()
                        }
                    } else {
                        if (that['inputFocus' + (spanName - 1) + col]) {
                            that['inputFocus' + (spanName - 1) + col].focus()
                        }
                    }
                }
            },
            false
        )
    }
    changeSelect = async (name, e) => {
        let { verticalColumnInfo } = this.state
        verticalColumnInfo[name] = e
        await this.setState({
            verticalColumnInfo,
        })
        if (name == 'primaryColumnId') {
            this.getDescColumnList('parentPrimaryColumnList')
            this.getDescColumnList('descColumnList')
        }
        if (name == 'descColumnIds') {
            this.getDescColumnList('parentPrimaryColumnList')
            this.getDescColumnList('primaryColumnList')
        }
        if (name == 'parentPrimaryColumnId') {
            this.getDescColumnList('primaryColumnList')
            this.getDescColumnList('descColumnList')
        }
    }
    changeInput = (e) => {
        let { verticalColumnInfo } = this.state
        verticalColumnInfo.rootValueContent = e.target.value
        this.setState({
            verticalColumnInfo,
        })
    }
    getDescColumnList = async (columnList) => {
        let { rootInfo, verticalColumnInfo } = this.state
        let query = {
            tableId: rootInfo.physicalTableId,
            ignoreColumnIds: [],
        }
        if (columnList == 'descColumnList') {
            if (verticalColumnInfo.parentPrimaryColumnId !== undefined) {
                query.ignoreColumnIds.push(verticalColumnInfo.parentPrimaryColumnId)
            }
            if (verticalColumnInfo.primaryColumnId !== undefined) {
                query.ignoreColumnIds.push(verticalColumnInfo.primaryColumnId)
            }
        }
        if (columnList == 'parentPrimaryColumnList') {
            query.ignoreColumnIds = [...verticalColumnInfo.descColumnIds]
            if (verticalColumnInfo.primaryColumnId !== undefined) {
                query.ignoreColumnIds.push(verticalColumnInfo.primaryColumnId)
            }
        }
        if (columnList == 'primaryColumnList') {
            query.ignoreColumnIds = [...verticalColumnInfo.descColumnIds]
            if (verticalColumnInfo.parentPrimaryColumnId !== undefined) {
                query.ignoreColumnIds.push(verticalColumnInfo.parentPrimaryColumnId)
            }
        }
        let res = await dimtableColumn(query)
        if (res.code == 200) {
            this.setState({
                [columnList]: res.data,
            })
        }
    }
    getBizClassifyDefList = async () => {
        let res = await catalogDwTree({ businessTag: '1, 2' })
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data),
            })
        }
    }
    getSuggestBizClass = async () => {
        let { rootInfo } = this.state
        let res = await dimtableSuggestClassify({ tableId: rootInfo.physicalTableId })
        if (res.code == 200) {
            rootInfo.classifyNodeIds = res.data
            this.setState({
                rootInfo,
            })
        }
    }
    getEnglishPrefix = async () => {
        let { rootInfo } = this.state
        let res = await dimtableEnglishNamePrefix()
        if (res.code == 200) {
            rootInfo.englishPrefixName = res.data
            this.setState({
                rootInfo,
            })
        }
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    getTimeFormat = async () => {
        let { timeformatList } = this.state
        let res = await dimtableTimeFormat()
        if (res.code == 200) {
            res.data.map((item) => {
                timeformatList[1].children.push({
                    name: item,
                    id: item,
                    children: [],
                })
            })
            this.setState({
                timeformatList,
            })
        }
    }
    getDatabase = async () => {
        let res = await dimtableDatabaseList()
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    getTableOption = async () => {
        let res = await dimtableTable({ databaseId: this.state.rootInfo.physicalDatabaseId })
        if (res.code == 200) {
            this.setState({
                tableList: res.data,
            })
        }
    }
    changeColumnCn = async (index, name, e) => {
        this.state[name][index].chineseName = e.target.value
        await this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
        this.getCanSave()
    }
    spanNameFocus = (index, span, name) => {
        col = index
        spanName = span
        tableName = name
    }
    getCanSave = () => {
        let { columnData, partitionData, rootInfo, canSave } = this.state
        if (columnData.length) {
            canSave = true
        }
        columnData.map((item) => {
            if (!item.chineseName) {
                canSave = false
            }
        })
        partitionData.map((item) => {
            if (!item.chineseName) {
                canSave = false
            }
        })
        this.setState({
            canSave,
            disabledDesc: canSave ? '' : '需完善字段中文名',
        })
    }
    changeTimeformat = (index, name, e) => {
        this.state[name][index].timeFormat = e
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    changeDataType = (index, name, e, node) => {
        this.state[name][index].dataType = e
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    primaryKeyChange = (index, name, e) => {
        this.state[name][index].primaryKey = e
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    getDmDetail = async () => {
        let { rootInfo, columnData, partitionData, tableNameCn, tableNameEn, tableNameCnWithSpace, verticalColumnInfo } = this.state
        this.setState({ tableLoading: true })
        let res = await dimtableEditDetail({ id: this.props.location.state.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            rootInfo = res.data
            rootInfo.type = res.data.type.toString()
            rootInfo.subType = res.data.subType ? res.data.subType.toString() : '2'
            res.data.columnInfos.enameMatchedColumns.map((item) => {
                item.columnType = 'enameMatchedColumns'
            })
            rootInfo.classifyNodeIds = res.data.classifyNodeIds ? res.data.classifyNodeIds : []

            partitionData = res.data.columnInfos.partitionColumns
            columnData = []
            columnData = res.data.columnInfos.enameMatchedColumns
            columnData.map((item) => {
                item.chineseName = item.chineseName ? item.chineseName : ''
                item.timeFormat = item.dateFormat ? item.dateFormat : '1' // 默认非时间字段
            })
            partitionData.map((item) => {
                item.timeFormat = item.dateFormat ? item.dateFormat : '1' // 默认非时间字段
            })
            if (rootInfo.type == 3 && rootInfo.subType == 2) {
                verticalColumnInfo = res.data.verticalColumnInfo
                verticalColumnInfo.descColumnIds = []
                verticalColumnInfo.parentPrimaryColumnId = verticalColumnInfo.parentPrimaryColumn.id
                verticalColumnInfo.primaryColumnId = verticalColumnInfo.primaryColumn.id
                verticalColumnInfo.descColumns.map((item) => {
                    verticalColumnInfo.descColumnIds.push(item.id)
                })
            }
            await this.setState({
                rootInfo,
                columnData,
                partitionData,
                tableNameCn: res.data.name.replace(/\s*/g, ''),
                tableNameEn: res.data.englishSuffixName,
                tableNameCnWithSpace: res.data.name,
                rootList: res.data.rootList,
                verticalColumnInfo,
            })
            this.getCanSave()
            this.getEname()
            this.getVerticalColumnList()
        }
    }
    getDataTypes = async () => {
        const { rootInfo } = this.state
        this.setState({ showDataType: false })
        let res = await dimtableDataTypes()
        this.setState({ showDataType: true })
        if (res.code == 200) {
            this.setState({
                dataTypeInfo: res.data,
            })
        }
    }
    postData = async () => {
        const { rootInfo, columnData, partitionData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList, verticalColumnInfo } = this.state
        let columnData1 = [...columnData]
        let partitionData1 = [...partitionData]
        columnData1.map((item) => {
            item.dateFormat = item.timeFormat == '1' ? '' : item.timeFormat
        })
        partitionData1.map((item) => {
            item.dateFormat = item.timeFormat == '1' ? '' : item.timeFormat
        })
        let enameMatchedColumns = []
        let enameUnmatchedColumns = []
        let mappedStandardColumns = []
        columnData.map((item) => {
            if (item.columnType == 'enameMatchedColumns') {
                enameMatchedColumns.push(item)
            }
            if (item.columnType == 'enameUnmatchedColumns') {
                enameUnmatchedColumns.push(item)
            }
            if (item.columnType == 'mappedStandardColumns') {
                mappedStandardColumns.push(item)
            }
        })
        if (rootInfo.type == 3 && rootInfo.subType == 2) {
            enameMatchedColumns = columnData
        }
        let query = {
            ...rootInfo,
            rootList,
            name: tableNameCnWithSpace,
            englishSuffixName: tableNameEn,
            columnInfos: {
                enameMatchedColumns,
                enameUnmatchedColumns,
                mappedStandardColumns,
                partitionColumns: partitionData,
            },
            verticalColumnInfo,
        }
        this.setState({ loading: true })
        let res = await dimtableSaveAndGenerateAssets(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('维度管理')
        }
    }
    onChangeTableEn = (e) => {
        this.setState({
            tableNameEn: e.target.value,
        })
    }
    onSelectTableNameCn = async (data) => {
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
        if (tableAutoInput.selectionStart) {
            cursurPosition = tableAutoInput.selectionStart
        }
        if (this.state.tableNameCn[cursurPosition] == ' ') {
            this.getEname()
            this.getSuggestion(cursurPosition)
        } else {
            this.getSuggestion(cursurPosition)
        }
    }
    getSuggestion = async (cursurPosition) => {
        const { tableNameCn, rootInfo, rootList } = this.state
        let query = {
            cname: tableNameCn,
            datasourceId: rootInfo.datasourceId,
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
        const { tableNameCn, tableNameEn, rootInfo, tableNameCnWithSpace, cnameDesc, rootList } = this.state
        let query = {
            cname: tableNameCnWithSpace,
            ename: tableNameEn,
            datasourceId: rootInfo.datasourceId,
            rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
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
    changeType = (e) => {
        let { rootInfo } = this.state
        rootInfo.type = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeSubType = (e) => {
        let { rootInfo } = this.state
        rootInfo.subType = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeDesc = (e) => {
        let { rootInfo } = this.state
        rootInfo.description = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeUser = (e) => {
        const { rootInfo } = this.state
        rootInfo.businessManager = e
        this.setState({
            rootInfo,
        })
    }
    changeDatabase = async (e) => {
        const { rootInfo, verticalColumnInfo } = this.state
        rootInfo.physicalDatabaseId = e
        rootInfo.physicalTableId = undefined
        verticalColumnInfo.descColumnIds = []
        verticalColumnInfo.parentPrimaryColumnId = undefined
        verticalColumnInfo.primaryColumnId = undefined
        await this.setState({
            rootInfo,
            tableList: [],
            descColumnList: [],
            parentPrimaryColumnList: [],
            primaryColumnList: [],
            verticalColumnInfo,
        })
        this.getTableOption()
    }
    changeDataTable = async (e, node) => {
        const { rootInfo, verticalColumnInfo } = this.state
        rootInfo.physicalTableId = e
        rootInfo.datasourceId = node.props.datasourceId

        verticalColumnInfo.descColumnIds = []
        verticalColumnInfo.parentPrimaryColumnId = undefined
        verticalColumnInfo.primaryColumnId = undefined
        await this.setState({
            rootInfo,
            columnData: [],
            verticalColumnInfo,
        })
        this.getSuggestBizClass()
        await this.getVerticalColumnList()
        // await this.getColumnList()
        this.getCanSave()
    }
    getVerticalColumnList = () => {
        this.getDescColumnList('descColumnList')
        this.getDescColumnList('parentPrimaryColumnList')
        this.getDescColumnList('primaryColumnList')
    }
    getColumnList = async () => {
        let { columnData, partitionData } = this.state
        this.setState({ tableLoading: true })
        let res = await dimtableColumnForAdd({ tableId: this.state.rootInfo.physicalTableId })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            res.data.enameMatchedColumns.map((item) => {
                item.columnType = 'enameMatchedColumns'
            })
            // res.data.enameUnmatchedColumns.map((item) => {
            //     item.columnType = 'enameUnmatchedColumns'
            // })
            // res.data.mappedStandardColumns.map((item) => {
            //     item.columnType = 'mappedStandardColumns'
            // })
            partitionData = res.data.partitionColumns
            columnData = []
            columnData = res.data.enameMatchedColumns
            columnData.map((item) => {
                item.chineseName = item.chineseName ? item.chineseName : ''
                item.timeFormat = item.dateFormat ? item.dateFormat : '1' // 默认非时间字段
            })
            partitionData.map((item) => {
                item.timeFormat = item.dateFormat ? item.dateFormat : '1' // 默认非时间字段
            })
            await this.setState({
                columnList: res.data,
                partitionData,
                columnData,
            })
            this.getCanSave()
        }
    }
    changeBusi = async (value, selectedOptions) => {
        let { rootInfo } = this.state
        rootInfo.classifyNodeIds = value
        await this.setState({
            rootInfo,
        })
    }
    nextStep = async () => {
        let { rootInfo, verticalColumnInfo, tableNameCn, tableNameCnWithSpace, tableNameEn, descColumnList, parentPrimaryColumnList, primaryColumnList } = this.state
        if (!rootInfo.physicalTableId || !rootInfo.classifyNodeIds.length) {
            message.info('请填写完整信息')
            return
        }
        if (!tableNameCn || !tableNameEn) {
            message.info('请填写名称')
            return
        }
        if (tableNameCnWithSpace.length > 64) {
            message.info('中文名不能超过64个字符')
            return
        }
        if (rootInfo.englishPrefixName.length + tableNameEn.length > 64) {
            message.info('英文名不能超过64个字符')
            return
        }
        if (rootInfo.type == 3 && rootInfo.subType == 2) {
            if (!verticalColumnInfo.descColumnIds.length || !verticalColumnInfo.parentPrimaryColumnId || !verticalColumnInfo.primaryColumnId) {
                message.info('请选择字段')
                return
            }
            verticalColumnInfo.descColumns = []
            verticalColumnInfo.parentPrimaryColumn = {}
            verticalColumnInfo.primaryColumn = {}
            descColumnList.map((item) => {
                verticalColumnInfo.descColumnIds.map((column) => {
                    if (item.id == column) {
                        verticalColumnInfo.descColumns.push(item)
                    }
                })
            })
            parentPrimaryColumnList.map((item) => {
                if (item.id == verticalColumnInfo.parentPrimaryColumnId) {
                    verticalColumnInfo.parentPrimaryColumn = item
                }
            })
            primaryColumnList.map((item) => {
                if (item.id == verticalColumnInfo.primaryColumnId) {
                    verticalColumnInfo.primaryColumn = item
                }
            })
            await this.setState({
                verticalColumnInfo,
            })
            this.getVerticalDimColumn()
            this.columns.splice(3, 1)
            this.columns.splice(4, 1)
        } else {
            if (this.props.location.state.pageType !== 'edit') {
                this.getColumnList()
            }
            if (this.columns.length == 4) {
                this.columns.splice(3, 0, {
                    dataIndex: 'relateStandardCode',
                    key: 'relateStandardCode',
                    title: '关联数据标准',
                    width: 120,
                    render: (text, record, index) => {
                        return text ? (
                            <span onClick={this.openStandardPage.bind(this, record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                                {text}
                            </span>
                        ) : (
                            <EmptyLabel />
                        )
                    },
                })
                this.columns.splice(5, 0, {
                    dataIndex: 'timeFormat',
                    key: 'timeFormat',
                    title: '时间配置',
                    width: 150,
                    render: (text, record, index) => {
                        return (
                            <div className='dataTypeSelect'>
                                <TreeSelect
                                    ref={(input) => {
                                        this['inputFocus_3' + index] = input
                                    }}
                                    onFocus={this.spanNameFocus.bind(this, index, 3, 'columnData')}
                                    value={text}
                                    style={{ width: '200px' }}
                                    treeDefaultExpandAll={true}
                                    dropdownMatchSelectWidth
                                    dropdownStyle={{
                                        overflowX: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                    placeholder='非时间字段'
                                    allowClear
                                    onChange={this.changeTimeformat.bind(this, index, 'columnData')}
                                >
                                    {loop(this.state.timeformatList)}
                                </TreeSelect>
                            </div>
                        )
                    },
                })
            }
        }
        this.setState({ currentStep: 1 })
    }
    getVerticalDimColumn = async () => {
        let { verticalColumnInfo, rootInfo, columnData } = this.state
        let query = {
            ...verticalColumnInfo,
            tableId: rootInfo.physicalTableId,
        }
        if (this.props.location.state.pageType == 'edit') {
            query.oldColumns = columnData
        }
        let res = await verticalDimColumn(query)
        if (res.code == 200) {
            await this.setState({
                columnData: res.data,
            })
            this.getCanSave()
        }
    }

    renderContent() {
        const {
            rootInfo,
            loading,
            baseList,
            columnData,
            dataSourceConfig,
            tableNameCn,
            tableNameCnData,
            tableNameEn,
            cnameDesc,
            showDropown,
            showShadow,

            partitionData,
            tableLoading,
            userList,
            databaseList,
            tableList,
            themeDefList,
            bizClassifyDefList,
            disabledDesc,
            canSave,
            currentStep = 0,
            verticalColumnInfo,
            descColumnList,
            parentPrimaryColumnList,
            primaryColumnList,
        } = this.state
        switch (currentStep) {
            case 0:
                return (
                    <Module title='定义维度'>
                        <div className='EditMiniForm Grid1'>
                            <FormItem label='选择来源表' required>
                                <Select
                                    style={{ width: 250 }}
                                    disabled={this.props.location.state.pageType == 'edit'}
                                    onChange={this.changeDatabase}
                                    value={rootInfo.physicalDatabaseId}
                                    placeholder='选择数据库'
                                >
                                    {databaseList.map((item) => {
                                        return (
                                            <Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                                {item.physicalDatabase}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {this.props.location.state.pageType == 'edit' ? (
                                    <Input value={rootInfo.physicalTableName} disabled={true} style={{ width: 250, marginLeft: 8 }} />
                                ) : (
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{ width: 250, marginLeft: 8 }}
                                        onChange={this.changeDataTable}
                                        value={rootInfo.physicalTableId}
                                        placeholder='选择系统表'
                                    >
                                        {tableList.map((item) => {
                                            return (
                                                <Option datasourceId={item.datasourceId} title={item.physicalTable} value={item.id} key={item.id}>
                                                    {item.physicalTable}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='业务分类' required>
                                <Cascader
                                    allowClear={false}
                                    style={{ width: 508 }}
                                    disabled={!rootInfo.physicalTableId}
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    options={bizClassifyDefList}
                                    value={rootInfo.classifyNodeIds}
                                    displayRender={(e) => e.join('-')}
                                    onChange={this.changeBusi}
                                    popupClassName='searchCascader'
                                    placeholder='选择业务分类'
                                />
                            </FormItem>
                            <FormItem label='维度名称' required>
                                <Input
                                    style={{ width: 508 }}
                                    disabled={!rootInfo.physicalTableId}
                                    className='tableAutoInput'
                                    placeholder='请输入表中文名'
                                    value={tableNameCn}
                                    onChange={this.onChangeTableNameCn}
                                    onBlur={this.onInputBlur}
                                    onFocus={this.onInputFocus}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{tableNameCn.length}/64</span>}
                                />
                                {showDropown ? (
                                    <div style={{ width: 508 }} className='tableAutoDropdown commonScroll'>
                                        {tableNameCnData.map((item) => {
                                            return (
                                                <div className='tableAutoDropdownItem' dangerouslySetInnerHTML={{ __html: item.showDesc }} onClick={this.onSelectTableNameCn.bind(this, item)}>
                                                    {/*<span dangerouslySetInnerHTML = {{ __html: item.showDesc }}></span>*/}
                                                    {/*{item.selected?<Icon style={{ float: 'right' }} type="check" />:null}*/}
                                                </div>
                                            )
                                        })}
                                        {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>暂无推荐，请输入进行搜索</div> : null}
                                    </div>
                                ) : null}
                            </FormItem>
                            <FormItem label='维度英文名称' required>
                                <Input
                                    style={{ width: 508 }}
                                    disabled={!rootInfo.physicalTableId}
                                    maxLength={64 - rootInfo.englishPrefixName.length}
                                    onChange={this.onChangeTableEn}
                                    onBlur={this.onTableEnBlur}
                                    value={tableNameEn}
                                    addonBefore={rootInfo.englishPrefixName}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length + rootInfo.englishPrefixName.length}/64</span>}
                                    placeholder='输入表中文名可自动匹配表英文名'
                                />
                            </FormItem>
                            <FormItem label='维度类型' required>
                                <Radio.Group disabled={!rootInfo.physicalTableId || this.props.location.state.pageType == 'edit'} value={rootInfo.type} onChange={this.changeType}>
                                    <Radio value='1'>普通维度</Radio>
                                    {/*<Radio disabled value='2'>*/}
                                    {/*枚举维度*/}
                                    {/*</Radio>*/}
                                    <Radio value='3'>层级维度</Radio>
                                </Radio.Group>
                                {rootInfo.type == 3 ? (
                                    <div className='rangeArea' style={{ width: 508, background: '#F7F8FA', padding: 16, marginTop: 13 }}>
                                        <FormItem label=''>
                                            <Radio.Group value={rootInfo.subType} onChange={this.changeSubType} disabled={this.props.location.state.pageType == 'edit'}>
                                                <Radio value='2'>纵向维度</Radio>
                                                <Radio value='1'>横向维度</Radio>
                                            </Radio.Group>
                                        </FormItem>
                                        {rootInfo.subType == 2 ? (
                                            <div>
                                                <Divider />
                                                <Row gutter={8}>
                                                    <Col span={8}>
                                                        <FormItem required label='ID'>
                                                            <Select
                                                                style={{ width: '100%' }}
                                                                onChange={this.changeSelect.bind(this, 'primaryColumnId')}
                                                                value={verticalColumnInfo.primaryColumnId}
                                                                disabled={this.props.location.state.pageType == 'edit'}
                                                                placeholder='请选择'
                                                            >
                                                                {primaryColumnList.map((item) => {
                                                                    return (
                                                                        <Option title={item.physicalField} value={item.id} key={item.id}>
                                                                            {item.physicalField}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={8}>
                                                        <FormItem required label='P_ID'>
                                                            <Select
                                                                style={{ width: '100%' }}
                                                                onChange={this.changeSelect.bind(this, 'parentPrimaryColumnId')}
                                                                value={verticalColumnInfo.parentPrimaryColumnId}
                                                                placeholder='请选择'
                                                                disabled={this.props.location.state.pageType == 'edit'}
                                                            >
                                                                {parentPrimaryColumnList.map((item) => {
                                                                    return (
                                                                        <Option title={item.physicalField} value={item.id} key={item.id}>
                                                                            {item.physicalField}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={8}>
                                                        <FormItem required label='字段名称'>
                                                            <Select
                                                                mode='multiple'
                                                                style={{ width: '100%' }}
                                                                onChange={this.changeSelect.bind(this, 'descColumnIds')}
                                                                value={verticalColumnInfo.descColumnIds}
                                                                placeholder='请选择'
                                                                disabled={this.props.location.state.pageType == 'edit'}
                                                            >
                                                                {descColumnList.map((item) => {
                                                                    return (
                                                                        <Option title={item.physicalField} value={item.id} key={item.id}>
                                                                            {item.physicalField}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row gutter={8} style={{ marginTop: 16 }}>
                                                    <Col span={8}>
                                                        <FormItem required label='层级数量'>
                                                            <InputNumber
                                                                style={{ width: '100%' }}
                                                                value={verticalColumnInfo.levelCount}
                                                                placeholder='请输入数字'
                                                                onChange={this.changeSelect.bind(this, 'levelCount')}
                                                                min={2}
                                                                disabled={this.props.location.state.pageType == 'edit'}
                                                            />
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={16}>
                                                        <FormItem required label='根节点值'>
                                                            <Input.Group compact>
                                                                <Select
                                                                    style={{ width: '50%' }}
                                                                    onChange={this.changeSelect.bind(this, 'rootValue')}
                                                                    value={verticalColumnInfo.rootValue}
                                                                    placeholder='请选择'
                                                                    disabled={this.props.location.state.pageType == 'edit'}
                                                                >
                                                                    <Option value={false} key='0'>
                                                                        空
                                                                    </Option>
                                                                    <Option value={true} key='1'>
                                                                        有值
                                                                    </Option>
                                                                </Select>
                                                                {verticalColumnInfo.rootValue ? (
                                                                    <Input
                                                                        disabled={this.props.location.state.pageType == 'edit'}
                                                                        onChange={this.changeInput}
                                                                        value={verticalColumnInfo.rootValueContent}
                                                                        style={{ width: '50%' }}
                                                                        placeholder='请输入值'
                                                                    />
                                                                ) : null}
                                                            </Input.Group>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </FormItem>
                            <FormItem label='描述信息'>
                                <TextArea
                                    disabled={!rootInfo.physicalTableId}
                                    maxLength={128}
                                    style={{ position: 'relative', paddingTop: 8, height: 80, width: 508 }}
                                    value={rootInfo.description}
                                    onChange={this.changeDesc}
                                    placeholder='请输入描述信息'
                                />
                                <span
                                    style={{
                                        color: '#B3B3B3',
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                    }}
                                >
                                    {rootInfo.description ? rootInfo.description.length : 0}/128
                                </span>
                            </FormItem>
                            <FormItem label='负责人'>
                                <Select disabled={!rootInfo.physicalTableId} allowClear style={{ width: 508 }} onChange={this.changeUser} value={rootInfo.businessManager} placeholder='负责人'>
                                    {userList.map((item) => {
                                        return (
                                            <Option value={item.username} key={item.username}>
                                                {item.realname}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                        </div>
                    </Module>
                )
            case 1:
                return (
                    rootInfo.physicalTableId && (
                        <React.Fragment>
                            <Module title={'字段信息（' + (columnData.length + partitionData.length) + '）'}>
                                <Table
                                    rowKey={(record, index) => index}
                                    loading={tableLoading}
                                    columns={this.columns}
                                    rowClassName={() => 'editable-row'}
                                    dataSource={columnData}
                                    pagination={false}
                                    // scroll={{ x: 1500 }}
                                />
                            </Module>
                            <Divider type='horizontal' style={{ margin: '20px 0' }} />
                            <Module title='分区字段'>
                                {partitionData.length ? (
                                    <Table
                                        rowKey={(record, index) => index}
                                        loading={tableLoading}
                                        columns={this.partitionColumns}
                                        rowClassName={() => 'editable-row'}
                                        dataSource={partitionData}
                                        pagination={false}
                                        // scroll={{ x: 1500 }}
                                    />
                                ) : (
                                    <EmptyIcon description='无分区' />
                                )}
                            </Module>
                        </React.Fragment>
                    )
                )
            case 2:
                return (
                    <div className='VControlGroup' style={{ width: 600, margin: '40px auto' }}>
                        <Alert message='创建成功' type='success' showIcon />
                        <Form className='FormPart MiniForm '>
                            <FormItem label='维度名称'>{tableNameCn}</FormItem>
                            <FormItem label='维度英文名'>{tableNameEn}</FormItem>
                            <FormItem label='业务板块'></FormItem>
                            <FormItem label='主题域'></FormItem>
                            <FormItem label='维度类型'></FormItem>
                            <FormItem label='来源表'></FormItem>
                            <FormItem label='数据库'></FormItem>
                        </Form>
                    </div>
                )
            default:
                break
        }
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('维度管理')
        })
    }

    render() {
        const {
            rootInfo,
            loading,
            baseList,
            columnData,
            dataSourceConfig,
            tableNameCn,
            tableNameCnData,
            tableNameEn,
            cnameDesc,
            showDropown,
            showShadow,

            partitionData,
            tableLoading,
            userList,
            databaseList,
            tableList,
            themeDefList,
            bizClassifyDefList,
            disabledDesc,
            canSave,
            currentStep = 0,
        } = this.state

        const { pageType } = this.pageParam
        const isEdit = pageType === 'edit'

        return (
            <TableLayout
                showFooterControl
                title={isEdit ? '编辑维度' : '定义维度'}
                renderFooter={() => {
                    switch (currentStep) {
                        case 0:
                            return (
                                <React.Fragment>
                                    <Button type='primary' onClick={this.nextStep}>
                                        下一步
                                    </Button>
                                    <Button onClick={() => this.back()}>取消</Button>
                                </React.Fragment>
                            )
                        case 1:
                            return (
                                <React.Fragment>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {
                                            this.setState({ currentStep: 0 })
                                        }}
                                    >
                                        上一步
                                    </Button>
                                    <Tooltip title={disabledDesc}>
                                        <Button type='primary' disabled={!canSave || !rootInfo.physicalTableId} loading={loading} onClick={this.postData}>
                                            保存
                                        </Button>
                                    </Tooltip>
                                    <Button onClick={() => this.back()} disabled={loading}>
                                        取消
                                    </Button>
                                </React.Fragment>
                            )
                    }
                }}
                renderDetail={() => {
                    return (
                        <React.Fragment>
                            <Steps size='small' current={currentStep} style={{ marginBottom: 30 }}>
                                <Steps.Step title='定义维度' />
                                <Steps.Step title='字段详情' />
                                <Steps.Step title='完成' />
                            </Steps>
                            {this.renderContent()}
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
