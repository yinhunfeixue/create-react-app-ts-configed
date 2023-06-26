import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Divider, Dropdown, Form, Input, Menu, message, Modal, Radio, Select, Switch, Table, Tabs, Tooltip, TreeSelect } from 'antd'
import { dimassetsColumnBeUsed, DimassetsGenerateFormulaColumn } from 'app_api/addNewColApi'
import { catalogDwTree } from 'app_api/dataSecurity'
import { getUserList } from 'app_api/manageApi'
import { dimassetsDetailForEdit, dimassetsInternalDelete, dimassetsSave, internalTableRelation, parseCname, suggestion } from 'app_api/metadataApi'
import AddNewCol from 'app_page/dama/component/addNewCol'
import EntityRelation from 'app_page/dama/component/entityRelation'
import React, { Component } from 'react'
import AddRelation from './addRelation'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const TreeNode = TreeSelect.TreeNode
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

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

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                partitionFlag: false,
                partitionColumnEnames: [],
                classifyNodeIds: [],
            },
            dataSourceConfig: true,
            databaseIdList: [],
            loading: false,
            sourceList: [],
            baseList: [],
            ddlModal: false,
            sqlContent: '',
            columnData: [],
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
            userList: [],
            bizClassifyDefList: [],
            themeDefList: [],
            tabValue: '0',
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
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                width: 220,
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 220,
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
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '模型关系',
                dataIndex: 'modelRelation',
                key: 'modelRelation',
                width: 100,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
        this.assetColumns = [
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '字段中文名',
                fixed: 'left',
                width: 220,
                render: (text, record, index) => {
                    return (
                        <div>
                            <div style={{ display: 'inline-block', width: 'calc(100% - 20px)' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</div>
                                </Tooltip>
                                {record.originalChineseName ? (
                                    <div style={{ color: '#b3b3b3' }}>
                                        原始名：
                                        <Tooltip placement='topLeft' title={record.originalChineseName}>
                                            <div style={{ width: 150, verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
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
                dataIndex: 'englishName',
                key: 'englishName',
                title: '字段英文名',
                width: 220,
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
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '模型关系',
                dataIndex: 'modelRelation',
                key: 'modelRelation',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
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
                width: 100,
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
    }
    componentDidMount = async () => {
        this.getUserData()

        this.bizClassifyDefData()

        this.getDmDetail()
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
    deleteColumn = (data) => {
        let { columnData } = this.state
        let query = {
            assetsId: this.props.location.state.id,
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
    deleteFilter = async (index) => {
        let { columnData } = this.state
        if (columnData[index].id !== undefined) {
            let query = {
                assetsId: this.props.location.state.id,
                columnId: columnData[index].id,
            }
            let res = await dimassetsColumnBeUsed(query)
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
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    bizClassifyDefData = async () => {
        let res = await catalogDwTree({ businessTag: '1, 2' })
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
    openStandardPage = (data) => {
        this.props.addTab('标准详情', { entityId: data.relateStandardCode, id: data.relateStandardId }, true)
    }
    primaryKeyChange = (index, name, e) => {
        this.state[name][index].visible = e
        this.setState({
            [name]: this.state[name],
        })
    }
    getColumnList = async () => {
        this.setState({ tableLoading: true })
        let res = await dimassetsDetailForEdit({ id: this.props.location.state.id })
        if (res.code == 200) {
            await this.setState({
                columnData: res.data.columnInfos.normalColumns,
                partitionData: res.data.columnInfos.partitionColumns,
            })
        }
        this.setState({ tableLoading: false })
    }
    getDmDetail = async () => {
        let { rootInfo, columnData, partitionData } = this.state
        this.setState({ tableLoading: true })
        let res = await dimassetsDetailForEdit({ id: this.props.location.state.id })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            rootInfo = res.data
            rootInfo.classifyNodeIds = res.data.classifyNodeIds ? res.data.classifyNodeIds : []
            await this.setState({
                rootInfo,
                columnData: res.data.columnInfos.normalColumns,
                partitionData: res.data.columnInfos.partitionColumns,
                tableNameCn: res.data.name.replace(/\s*/g, ''),
                tableNameEn: res.data.englishSuffixName,
                tableNameCnWithSpace: res.data.name,
                rootList: res.data.rootList,
            })
            await this.getEname()
            this.setState({
                tableNameEn: res.data.englishSuffixName,
            })
        }
    }
    postData = async () => {
        const { rootInfo, columnData, partitionData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList } = this.state
        let query = {
            ...rootInfo,
            rootList,
            name: tableNameCnWithSpace,
            englishSuffixName: tableNameEn,
            columnInfos: {
                normalColumns: columnData,
                partitionColumns: partitionData,
            },
        }
        this.setState({ loading: true })
        let res = await dimassetsSave(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('维度管理', { tabValue: this.props.location.state.tabValue })
        }
    }
    onChangeTableEn = (e) => {
        this.setState({
            tableNameEn: e.target.value,
        })
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
    changeDesc = (e) => {
        const { rootInfo } = this.state
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
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
        if (e == 1) {
            this.getNodeData()
        } else {
            this.getColumnList()
        }
    }
    getNodeData = async () => {
        let res = await internalTableRelation({ businessId: this.props.location.state.id })
        if (res.code == 200) {
            this.entityChart.bindNodeData(res.data)
        }
    }
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
    changeBusi = async (value, selectedOptions) => {
        let { rootInfo } = this.state
        rootInfo.classifyNodeIds = value
        this.setState({
            rootInfo,
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
            res.data.cnameDesc = res.data.cnameDesc ? res.data.cnameDesc : ''
            this.setState({
                tableNameEn: res.data.ename,
                cnameDesc: res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') || '暂无词根信息',
                rootList: res.data.rootList,
            })
        }
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
    saveFormula = async (data) => {
        console.log(data, 'saveFormula')
        let { formulaInfo, columnData, isFormulaEdit, filterIndex } = this.state
        let hasName = false
        if (formulaInfo.chineseName == undefined) {
            columnData.map((item) => {
                if (item.chineseName == data.name || item.englishName == data.name) {
                    hasName = true
                }
            })
        } else {
            let columnDataBackup = [...columnData]
            columnDataBackup.splice(filterIndex, 1)
            columnDataBackup.map((item) => {
                if (item.chineseName == data.name || item.englishName == data.name) {
                    hasName = true
                }
            })
        }
        if (hasName) {
            message.info('字段名称不能重复')
            return
        }
        let query = {
            columnInfo: {
                businessId: this.props.location.state.id,
                ...formulaInfo,
            },
            formulaSaveParam: data,
        }
        let res = await DimassetsGenerateFormulaColumn(query)
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
                let res = await dimassetsColumnBeUsed(query)
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
    render() {
        const {
            rootInfo,
            loading,
            sourceList,
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
            tabValue,
            btnLoading,
            bizClassifyDefList,
            themeDefList,
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
                <TableLayout
                    title='编辑维度资产'
                    renderDetail={() => {
                        return (
                            <Form className='EditMiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '业务分类',
                                        content: (
                                            <div>
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
                                            </div>
                                        ),
                                    },
                                    {
                                        label: '维度资产名称',
                                        content: (
                                            <div style={{ position: 'relative' }}>
                                                <Input
                                                    style={{ width: 508 }}
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
                                        extra: cnameDesc,
                                    },
                                    {
                                        label: '维度资产英文名称',
                                        content: (
                                            <Input
                                                className='tableNameEnInput'
                                                style={{ width: 508 }}
                                                maxLength={64}
                                                onChange={this.onChangeTableEn}
                                                onBlur={this.onTableEnBlur}
                                                value={tableNameEn}
                                                addonBefore={rootInfo.englishPrefixName}
                                                suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length}/64</span>}
                                                placeholder='输入表中文名可自动匹配表英文名'
                                            />
                                        ),
                                    },
                                    {
                                        label: '描述信息',
                                        content: (
                                            <div style={{ position: 'relative', width: 508 }}>
                                                <TextArea
                                                    maxLength={128}
                                                    style={{ position: 'relative', paddingTop: 8 }}
                                                    value={rootInfo.description}
                                                    onChange={this.changeDesc}
                                                    rows={5}
                                                    placeholder='请输入描述信息'
                                                />
                                                <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: '8px' }}>{rootInfo.description ? rootInfo.description.length : 0}/128</span>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: '负责人',
                                        content: (
                                            <Select allowClear style={{ width: 508 }} onChange={this.changeUser} value={rootInfo.businessManager} placeholder='负责人'>
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
                            </Form>
                        )
                    }}
                    renderTable={() => {
                        return (
                            <Module
                                title='字段信息'
                                style={{ marginBottom: '0px !important' }}
                                renderHeaderExtra={() => {
                                    return (
                                        <Dropdown overlay={menu}>
                                            <Button type='primary'>新建字段</Button>
                                        </Dropdown>
                                    )
                                }}
                            >
                                <Tabs activeKey={tabValue} onChange={this.changeTab}>
                                    <TabPane tab='字段详情' key='0'>
                                        <div>
                                            <Table
                                                bordered
                                                rowKey='id'
                                                loading={tableLoading}
                                                columns={this.assetColumns}
                                                rowClassName={(record) => (record.visible ? 'editable-row' : 'hideColumn')}
                                                dataSource={columnData}
                                                pagination={false}
                                                scroll={{ x: 1500 }}
                                            />
                                        </div>
                                        <Module title='分区字段' style={{ marginTop: 20 }}>
                                            {partitionData.length ? (
                                                <Table
                                                    bordered
                                                    rowKey='id'
                                                    loading={tableLoading}
                                                    columns={this.partitionColumns}
                                                    rowClassName={(record) => (record.visible ? 'editable-row' : 'hideColumn')}
                                                    dataSource={partitionData}
                                                    pagination={false}
                                                    scroll={{ x: 1500 }}
                                                />
                                            ) : (
                                                <EmptyIcon description='无分区' />
                                            )}
                                        </Module>
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
                            </Module>
                        )
                    }}
                    showFooterControl
                    renderFooter={() => {
                        return (
                            <Button type='primary' disabled={!rootInfo.classifyNodeIds.length || !tableNameCn || !tableNameEn} loading={loading} onClick={this.postData}>
                                保存
                            </Button>
                        )
                    }}
                />
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
                            addDimensionAsset={true}
                            cname={formulaCname}
                            tempBusinessId={rootInfo.queryId}
                            saveFormula={this.saveFormula}
                            formTitle='字段名称'
                        />
                    </Modal>
                )}
            </React.Fragment>
        )
    }
}
