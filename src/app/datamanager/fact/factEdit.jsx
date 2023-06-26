import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Input, message, Modal, Radio, Select, Steps, Switch, Table, Tooltip, TreeSelect } from 'antd'
import { catalogDwTree } from 'app_api/dataSecurity'
import { columnForAdd, facttableDatabase, facttableDataTypes, facttableDetail, facttableTable, facttableTempSave, saveAndGenerateAssets, suggestClassify, timeFormat } from 'app_api/metadataApi'
import Lodash from 'lodash'
import React, { Component } from 'react'
import AddFactAsset from './addFactAsset'
import './factEdit.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const { Step } = Steps
const confirm = Modal.confirm
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
                classifyNodeIds: [],
            },
            loading: false,
            columnData: [],
            dataTypeInfo: [],
            tableLoading: false,
            showDataType: true,
            currentStep: 0,
            keyword: '',
            databaseList: [],
            tableList: [],
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
            dataTypeList: [],
            columnList: [],
            partitionData: [],
            bizClassifyDefList: [],
            canSave: false,
            assetInfo: {},
            nextLoading: false,
            disabledDesc: '需对上面内容进行选择，并完善字段中文信息，“*”为必填项',
        }
        this.partitionColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 160,
                render: (text, record, index) => {
                    return <div>{text ? text : <EmptyLabel />}</div>
                },
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                minWidth: 200,
                render: (text, record, index) => {
                    // if (record.editable && record.editable == 1) {
                    return (
                        <div style={{ position: 'relative' }}>
                            <Input
                                // ref={input => {if (input) {input.focus()} }}
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
                            <span style={{ position: 'absolute', right: '5px', top: '5px', color: '#B3B3B3', fontSize: '12px' }}>{text ? text.length : 0}/32</span>
                            {record.relateStandardId ? (
                                <div style={{ color: '#b3b3b3', paddingLeft: 12, marginTop: 5 }}>
                                    原始名：
                                    <Tooltip title={record.originalChineseName}>
                                        <div
                                            style={{ width: 'calc(100% - 48px)', verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
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
                width: 150,
                render: (text, record, index) => {
                    // if (record.editable && record.editable == 3) {
                    return (
                        <div className='dataTypeSelect'>
                            {this.state.showDataType ? (
                                <Select
                                    // ref={input => {if (input) {input.focus()} }}
                                    ref={(input) => {
                                        this['inputFocus2' + index] = input
                                    }}
                                    style={{ width: '100%' }}
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
                width: 130,
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
                    // if (record.editable && record.editable == 4) {
                    return (
                        <div className='dataTypeSelect'>
                            <TreeSelect
                                // ref={input => {if (input) {input.focus()} }}
                                ref={(input) => {
                                    this['inputFocus3' + index] = input
                                }}
                                value={text}
                                style={{ width: '100px' }}
                                treeDefaultExpandAll={true}
                                placeholder='非时间字段'
                                onFocus={this.spanNameFocus.bind(this, index, 3, 'partitionData')}
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
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 140,
                render: (text, record, index) => {
                    return <div>{text ? text : <EmptyLabel />}</div>
                },
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                render: (text, record, index) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <Input
                                onFocus={this.spanNameFocus.bind(this, index, 1, 'columnData')}
                                style={{ paddingRight: 45 }}
                                value={text}
                                maxLength={32}
                                disabled={record.relateStandardId}
                                onChange={this.changeColumnCn.bind(this, index, 'columnData')}
                                placeholder='请输入中文名'
                            />
                            <span style={{ position: 'absolute', right: '5px', top: '5px', color: '#B3B3B3', fontSize: '12px' }}>{text ? text.length : 0}/32</span>
                            {record.relateStandardId ? (
                                <div style={{ color: '#b3b3b3', paddingLeft: 12, marginTop: 5 }}>
                                    原始名：
                                    <Tooltip title={record.originalChineseName}>
                                        <div
                                            style={{ width: 'calc(100% - 48px)', verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
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
                width: 160,
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
                                    style={{ width: '100%' }}
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
                dataIndex: 'timeFormat',
                key: 'timeFormat',
                title: '时间配置',
                width: 160,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            <TreeSelect
                                ref={(input) => {
                                    this['inputFocus_3' + index] = input
                                }}
                                onFocus={this.spanNameFocus.bind(this, index, 3, 'columnData')}
                                value={text}
                                style={{ width: '100%' }}
                                treeDefaultExpandAll={true}
                                dropdownMatchSelectWidth
                                dropdownStyle={{
                                    overflowX: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                placeholder='非时间字段'
                                onChange={this.changeTimeformat.bind(this, index, 'columnData')}
                            >
                                {loop(this.state.timeformatList)}
                            </TreeSelect>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                title: '主键',
                width: 130,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Switch onChange={this.primaryKeyChange.bind(this, index, 'columnData')} checked={text} />
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
                        <a onClick={this.openStandardPage.bind(this, record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                            {text}
                        </a>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
        ]
    }
    componentDidMount = async () => {
        this.getDataTypes()
        this.getDatabase()
        this.getTimeFormat()
        this.bizClassifyDefData()
        if (this.props.location.state.pageType == 'edit' || this.props.location.state.pageType == 'look') {
            this.getFactTableDetail(this.props.location.state.factTableId)
        }
        if (this.props.location.state.pageType == 'look') {
            this.setState({
                currentStep: 0,
            })
        }
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
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    onColumnInputFocus = (index, e) => {
        col = index
        spanName = 1
        console.log(spanName, col, 'onColumnInputFocus')
    }
    spanNameFocus = (index, span, name) => {
        col = index
        spanName = span
        tableName = name
        console.log(spanName, col, 'onColumnInputFocus')
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
    getFactTableDetail = async (factTableId) => {
        let { rootInfo, columnList, columnData, partitionData } = this.state
        this.setState({ tableLoading: true })
        let res = await facttableDetail({ factTableId })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            rootInfo.id = res.data.id
            rootInfo.databaseId = res.data.databaseId
            rootInfo.tableId = res.data.tableId
            rootInfo.tableEname = res.data.tableEname
            rootInfo.classifyNodeIds = res.data.classifyNodeIds ? res.data.classifyNodeIds : []
            res.data.columnInfos.enameMatchedColumns.map((item) => {
                item.columnType = 'enameMatchedColumns'
            })
            // res.data.columnInfos.enameUnmatchedColumns.map((item) => {
            //     item.columnType = 'enameUnmatchedColumns'
            // })
            // res.data.columnInfos.mappedStandardColumns.map((item) => {
            //     item.columnType = 'mappedStandardColumns'
            // })
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
            await this.setState({
                rootInfo,
                columnData,
                partitionData,
                columnList: res.data.columnInfos,
            })
            this.getCanSave()
        }
    }
    bizClassifyDefData = async () => {
        let res = await catalogDwTree()
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data),
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
    getDatabase = async () => {
        let res = await facttableDatabase()
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    getTableOption = async () => {
        let res = await facttableTable({ databaseId: this.state.rootInfo.databaseId })
        if (res.code == 200) {
            this.setState({
                tableList: res.data,
            })
        }
    }
    getTimeFormat = async () => {
        let { timeformatList } = this.state
        let res = await timeFormat()
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
    getColumnList = async () => {
        let { columnData, partitionData } = this.state
        this.setState({ tableLoading: true })
        let res = await columnForAdd({ tableId: this.state.rootInfo.tableId })
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
            this.setState({
                columnList: res.data,
                partitionData,
                columnData,
            })
        }
    }
    showSelect = (record, index, num, name) => {
        let { columnData, partitionData } = this.state
        if (name == 'columnData') {
            partitionData.map((item) => {
                delete item.editable
            })
            this.setState({ partitionData })
        } else {
            columnData.map((item) => {
                delete item.editable
            })
            this.setState({ columnData })
        }
        let params = { ...record }
        if (params.editable) {
            delete params.editable
        }
        let array = this.state[name]
        let tableData = [...array]
        console.log(tableData, name, this.state[name], 'showSelect')
        tableData = tableData.map((value) => {
            if (value.editable) {
                delete value.editable
            }
            return value
        })
        switch (num) {
            case '0':
                params.editable = 1
                break
            case '1':
                params.editable = 2
                break
            case '2':
                params.editable = 3
                break
            case '3':
                params.editable = 4
                break
            case '4':
                params.editable = 5
                break
            default:
                break
        }
        tableData[index].editable = params.editable
        console.log(tableData, 'tableData++++')
        this.setState({ [name]: [...tableData] })
    }
    primaryKeyChange = (index, name, e) => {
        this.state[name][index].primaryKey = e
        this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
    }
    changeColumnCn = async (index, name, e) => {
        this.state[name][index].chineseName = e.target.value
        await this.setState({
            [name]: Lodash.cloneDeep(this.state[name]),
        })
        this.getCanSave()
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
    changeDatabase = async (e) => {
        const { rootInfo } = this.state
        rootInfo.databaseId = e
        rootInfo.tableId = undefined
        await this.setState({
            rootInfo,
            tableList: [],
        })
        this.getTableOption()
    }
    changeDataTable = async (e) => {
        const { rootInfo } = this.state
        rootInfo.tableId = e
        await this.setState({
            rootInfo,
            columnData: [],
        })
        this.getSuggestBizClass()
        await this.getColumnList()
        this.getCanSave()
    }
    getDataTypes = async () => {
        const { rootInfo } = this.state
        this.setState({ showDataType: false })
        let res = await facttableDataTypes()
        this.setState({ showDataType: true })
        if (res.code == 200) {
            this.setState({
                dataTypeInfo: res.data,
            })
        }
    }
    tempSave = () => {
        let { columnData, partitionData } = this.state
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
        let that = this
        confirm({
            title: '事实资产定义未完成',
            content: '保存后，后续您可以继续编辑',
            okText: '继续保存',
            cancelText: '取消',
            async onOk() {
                let query = {
                    ...that.state.rootInfo,
                    columnInfos: {
                        enameMatchedColumns,
                        enameUnmatchedColumns,
                        mappedStandardColumns,
                        partitionColumns: partitionData,
                    },
                }
                that.setState({ loading: true })
                let res = await facttableTempSave(query)
                that.setState({ loading: false })
                if (res.code == 200) {
                    message.success('保存成功')
                    that.back()
                }
            },
        })
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('事实资产')
        })
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    next = async () => {
        let { columnData, partitionData } = this.state
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
        let query = {
            ...this.state.rootInfo,
            columnInfos: {
                enameMatchedColumns,
                enameUnmatchedColumns,
                mappedStandardColumns,
                partitionColumns: partitionData,
            },
        }
        this.setState({ nextLoading: true })
        let res = await saveAndGenerateAssets(query)
        this.setState({ nextLoading: false })
        if (res.code == 200) {
            this.setState({
                currentStep: this.state.currentStep + 1,
                assetInfo: res.data,
            })
        }
    }
    prePage = async () => {
        await this.setState({
            currentStep: this.state.currentStep - 1,
        })
        if (this.props.location.state.pageType == 'edit' || this.props.location.state.pageType == 'look') {
            this.getFactTableDetail(this.props.location.state.factTableId)
        }
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { rootInfo } = this.state
        rootInfo.classifyNodeIds = value
        await this.setState({
            rootInfo,
        })
    }
    getSuggestBizClass = async () => {
        let { rootInfo } = this.state
        let res = await suggestClassify({ tableId: rootInfo.tableId })
        if (res.code == 200) {
            rootInfo.classifyNodeIds = res.data
            this.setState({
                rootInfo,
            })
        }
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { rootInfo, loading, columnData, currentStep, keyword, databaseList, tableList, partitionData, bizClassifyDefList, tableLoading, canSave, assetInfo, nextLoading, disabledDesc } =
            this.state

        const { pageType } = this.pageParam
        const isAdd = pageType === 'add'

        return (
            <div className='VControlGroup factEdit'>
                <TableLayout
                    showFooterControl={currentStep === 0}
                    disabledDefaultFooter
                    title={isAdd ? '定义事实资产' : '编辑事实资产'}
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Steps size='small' current={currentStep}>
                                    <Step title='选择事实' />
                                    <Step title='定义事实资产' />
                                    <Step title='完成' />
                                </Steps>
                            </React.Fragment>
                        )
                    }}
                    renderFooter={() => {
                        switch (currentStep) {
                            case 0:
                                return (
                                    <React.Fragment>
                                        <Tooltip title={disabledDesc}>
                                            <Button type='primary' ghost disabled={!canSave || !rootInfo.tableId || !rootInfo.classifyNodeIds.length} loading={nextLoading} onClick={this.next}>
                                                下一步
                                            </Button>
                                        </Tooltip>
                                        {!this.props.location.state.complete || isAdd ? (
                                            <Button disabled={!rootInfo.tableId || !rootInfo.classifyNodeIds.length} loading={loading} onClick={this.tempSave} type='primary'>
                                                保存
                                            </Button>
                                        ) : null}
                                        <Button
                                            onClick={() => {
                                                this.back()
                                            }}
                                        >
                                            取消
                                        </Button>
                                    </React.Fragment>
                                )
                            default:
                                break
                        }
                    }}
                />
                {currentStep == 0 ? (
                    <React.Fragment>
                        <Module title='选择事实'>
                            <div className='EditMiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '选择来源表',
                                        required: true,
                                        content: (
                                            <React.Fragment>
                                                <Select
                                                    style={{ width: 230 }}
                                                    disabled={this.props.location.state.pageType == 'edit' || this.props.location.state.pageType == 'look'}
                                                    onChange={this.changeDatabase}
                                                    value={rootInfo.databaseId}
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
                                                {this.props.location.state.pageType == 'edit' || this.props.location.state.pageType == 'look' ? (
                                                    <Input style={{ width: 230, marginLeft: 8 }} value={rootInfo.tableEname} disabled={true} />
                                                ) : (
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                        style={{ width: 230, marginLeft: 8 }}
                                                        onChange={this.changeDataTable}
                                                        value={rootInfo.tableId}
                                                        placeholder='选择系统表'
                                                    >
                                                        {tableList.map((item) => {
                                                            return (
                                                                <Option title={item.physicalTable} value={item.id} key={item.id}>
                                                                    {item.physicalTable}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                )}
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '业务分类',
                                        required: true,
                                        content: (
                                            <React.Fragment>
                                                <Cascader
                                                    allowClear={false}
                                                    style={{ width: 468 }}
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={bizClassifyDefList}
                                                    value={rootInfo.classifyNodeIds}
                                                    displayRender={(e) => e.join('-')}
                                                    onChange={this.changeBusi}
                                                    popupClassName='searchCascader'
                                                    placeholder='选择业务分类'
                                                />
                                            </React.Fragment>
                                        ),
                                    },
                                ])}
                            </div>
                        </Module>
                        <Module title='字段详情'>
                            <Table
                                rowKey='physicalColumnId'
                                loading={tableLoading}
                                columns={this.columns}
                                rowClassName={() => 'editable-row'}
                                dataSource={columnData}
                                pagination={false}
                                scroll={{
                                    y: 300,
                                }}
                            />
                        </Module>
                        <Module title='分区字段'>
                            {partitionData.length ? (
                                <Table
                                    rowKey='physicalColumnId'
                                    loading={tableLoading}
                                    columns={this.partitionColumns}
                                    rowClassName={() => 'editable-row'}
                                    dataSource={partitionData}
                                    pagination={false}
                                />
                            ) : (
                                <div className='title' style={{ margin: '24px 0' }}>
                                    <EmptyIcon description='无分区' />
                                </div>
                            )}
                        </Module>
                    </React.Fragment>
                ) : (
                    <AddFactAsset prePage={this.prePage} {...this.props} assetInfo={assetInfo} />
                )}
            </div>
        )
    }
}
