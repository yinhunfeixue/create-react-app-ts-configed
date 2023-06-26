import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import TipLabel from '@/component/tipLabel/TipLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, ConfigProvider, Empty, Form, Input, InputNumber, message, Radio, Select, Switch, Tooltip } from 'antd'
import { configLimit, datamodelingTableDetail, dsspecification, dsspecificationDatasource, parseCname, saveTable, suggestion, tableDataTypes, tableDdl } from 'app_api/metadataApi'
import classNames from 'classnames'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'
import CodeItemModal from './codeItemModal'
import DragSortingTable from './dragSortTable'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

let col = 0
let spanName = 0

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                partitionFlag: false,
                partitionColumnEnames: [],
            },
            dataSourceConfig: true,
            databaseIdList: [],
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
            showShadow: false,
        }

        this.columns = [
            {
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                title: '字段中文名',
                minWidth: 160,
                render: (text, record, index) => {
                    const { columnData } = this.state
                    const isLastItem = index === columnData.length - 1
                    const dropStyle = isLastItem
                        ? {
                              bottom: 0,
                              transform: `translateY(-100%)`,
                          }
                        : {}
                    if (this.props.location.state.title !== '表详情') {
                        return (
                            <div style={{ position: 'relative' }}>
                                <Input
                                    disabled={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig}
                                    className={'columnAutoInput' + index}
                                    placeholder='字段中文名'
                                    value={text}
                                    onChange={this.onChangeColumnNameCn.bind(this, index)}
                                    onBlur={this.onColumnInputBlur.bind(this, index)}
                                    onFocus={this.onColumnInputFocus.bind(this, index)}
                                    maxLength={128}
                                />
                                {record.cnameDesc && record.showDropown ? (
                                    <Tooltip title={record.cnameDesc}>
                                        <div style={{ color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.cnameDesc}</div>
                                    </Tooltip>
                                ) : null}
                                {record.showDropown ? (
                                    <div className='tableAutoDropdown commonScroll' style={{ width: 250, ...dropStyle }}>
                                        {record.tableNameCnData &&
                                            record.tableNameCnData.map((item) => {
                                                return (
                                                    <div
                                                        className='tableAutoDropdownItem'
                                                        dangerouslySetInnerHTML={{ __html: item.showDesc }}
                                                        onClick={this.onSelectColumnNameCn.bind(this, item, index)}
                                                    />
                                                )
                                            })}
                                        {!record.tableNameCnData.length ? (
                                            <div
                                                style={{
                                                    color: '#666',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                暂无推荐，请输入进行搜索
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        )
                    } else {
                        return (
                            <Tooltip title={text}>
                                <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, index, '0')}>
                                    {text ? text : <EmptyLabel />}
                                </div>
                            </Tooltip>
                        )
                    }
                },
            },
            {
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                title: '字段英文名',
                minWidth: 150,
                render: (text, record, index) => {
                    if (this.props.location.state.title !== '表详情') {
                        return (
                            <Input
                                disabled={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig}
                                maxLength={50}
                                onChange={this.onChangeColumnEn.bind(this, index)}
                                onBlur={this.onColumnEnBlur.bind(this, index)}
                                onFocus={this.spanNameFocus.bind(this, index, 2)}
                                value={text}
                                placeholder='字段英文名'
                            />
                        )
                    } else {
                        return (
                            <Tooltip title={text}>
                                <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, index, '1')}>
                                    {text ? text : <EmptyLabel />}
                                </div>
                            </Tooltip>
                        )
                    }
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '字段类型',
                width: 120,
                render: (text, record, index) => {
                    if (this.props.location.state.title !== '表详情') {
                        return (
                            <div className='dataTypeSelect'>
                                {this.state.showDataType ? (
                                    <Select
                                        disabled={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig}
                                        style={{ width: '100px' }}
                                        onChange={this.changeDataType.bind(this, index)}
                                        onBlur={this.onColumnTypeBlur.bind(this, index)}
                                        onFocus={this.spanNameFocus.bind(this, index, 3)}
                                        value={text}
                                        placeholder='字段类型'
                                    >
                                        {this.state.dataTypeInfo.length &&
                                            this.state.dataTypeInfo.map((item) => {
                                                return (
                                                    <Option title={item.name} dataPrecision={item.dataPrecision} dataLength={item.dataLength} value={item.name} key={item.name}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                    </Select>
                                ) : null}
                            </div>
                        )
                    } else {
                        return (
                            <Tooltip title={text}>
                                <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, index, '2')}>
                                    {text ? text : <EmptyLabel />}
                                </div>
                            </Tooltip>
                        )
                    }
                },
            },
            {
                dataIndex: 'dataLength',
                key: 'dataLength',
                title: '长度',
                width: 80,
                render: (text, record, index) => {
                    if (this.props.location.state.title !== '表详情') {
                        return (
                            <InputNumber
                                min={0}
                                onFocus={this.spanNameFocus.bind(this, index, 4)}
                                onBlur={this.onColumnTypeBlur.bind(this, index)}
                                style={{ width: '100%' }}
                                disabled={!record.canChangeDataLength}
                                value={text}
                                onChange={this.onDataLengthChange.bind(this, index)}
                            />
                        )
                    } else {
                        return (
                            <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, index, '3')}>
                                {text ? text : <EmptyLabel />}
                            </div>
                        )
                    }
                },
            },
            {
                dataIndex: 'dataPrecision',
                key: 'dataPrecision',
                title: '精度',
                width: 80,
                render: (text, record, index) => {
                    if (this.props.location.state.title !== '表详情') {
                        return (
                            <InputNumber
                                min={0}
                                onFocus={this.spanNameFocus.bind(this, index, 5)}
                                onBlur={this.onColumnTypeBlur.bind(this, index)}
                                style={{ width: '100%' }}
                                disabled={!record.canChangeDataPrecision}
                                value={text}
                                onChange={this.onDataPrecisionChange.bind(this, index)}
                            />
                        )
                    } else {
                        return (
                            <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, index, '4')}>
                                {text ? text : <EmptyLabel />}
                            </div>
                        )
                    }
                },
            },
            {
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                title: '主键信息',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '主键' : this.props.location.state.title !== '表详情' ? '非主键' : <EmptyLabel />}</span>
                            {this.props.location.state.title !== '表详情' ? (
                                <Switch disabled={!this.state.configLimitInfo.enablePrimary} style={{ float: 'right' }} onChange={this.primaryKeyChange.bind(this, index)} checked={text} />
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'nullable',
                key: 'nullable',
                title: '非空信息',
                width: 130,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span>{text ? '可以为空' : '不可为空'}</span>
                            {this.props.location.state.title !== '表详情' ? (
                                <Switch disabled={!this.state.configLimitInfo.enableNotNull} style={{ float: 'right' }} onChange={this.nullableChange.bind(this, index)} checked={text} />
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'codeItemName',
                key: 'codeItemName',
                title: '引用代码',
                width: 120,
                render: (text, record, index) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {text ? (
                                <Tooltip title={text}>
                                    <div
                                        onClick={this.openCodeItemDetail.bind(this, record)}
                                        style={{ display: 'inline-block', width: '70px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#1890ff', cursor: 'pointer' }}
                                    >
                                        {text}
                                    </div>
                                </Tooltip>
                            ) : (
                                <EmptyLabel />
                            )}
                            {this.props.location.state.title !== '表详情' ? (
                                <React.Fragment>
                                    {text ? (
                                        <img onClick={this.deleteCodeItem.bind(this, index)} style={{ width: '20px', cursor: 'pointer' }} src={require('app_images/delete.png')} />
                                    ) : (
                                        <img
                                            onClick={this.openCodeItemModal.bind(this, index)}
                                            style={{ width: '14px', marginRight: '4px', cursor: 'pointer' }}
                                            src={require('app_images/dataAsset/dataAsset-add.png')}
                                        />
                                    )}
                                </React.Fragment>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                className: 'columnTable',
                fixed: 'right',
                render: (text, record, index) => {
                    return (
                        <a onClick={this.deleteColumn.bind(this, index)}>删除</a>
                        // <Tooltip title='删除'>
                        //     <img
                        //         style={{ width: '24px', cursor: 'pointer', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
                        //         onClick={this.deleteColumn.bind(this, index)}
                        //         src={require('app_images/delete.png')}
                        //     />
                        // </Tooltip>
                        // <span onClick={(e) => e.stopPropagation()}>
                        //     {
                        //         record.canEdit?<Button onClick={this.showEditMode.bind(this,index)} type="link">保存</Button>
                        //             :<Button onClick={this.showEditMode.bind(this,index)} type="link">修改</Button>
                        //     }
                        //     {
                        //         record.canEdit?<Button onClick={this.cancelSaveColumn.bind(this,index)} type="link">取消</Button>
                        //             :<Button onClick={this.deleteColumn.bind(this,index)} type="link">删除</Button>
                        //     }
                        //     </span>
                    )
                },
            },
        ]
    }
    componentDidMount = async () => {
        this.getSourceData()
        const { title } = this.pageParam
        if (title == '编辑表' || title == '表详情') {
            this.getDmDetail()
        }
        if (title == '表详情') {
            this.columns.splice(this.columns.length - 1, 1)
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
                    if (that['inputFocus' + spanName + (col - 1)]) {
                        that['inputFocus' + spanName + (col - 1)].focus()
                    }
                } else if (e && e.keyCode == 39) {
                    if (that['inputFocus' + (spanName + 1) + col]) {
                        that['inputFocus' + (spanName + 1) + col].focus()
                    }
                } else if (e && e.keyCode == 40) {
                    if (that['inputFocus' + spanName + (col + 1)]) {
                        that['inputFocus' + spanName + (col + 1)].focus()
                    }
                } else if (e && e.keyCode == 37) {
                    if (that['inputFocus' + (spanName - 1) + col]) {
                        that['inputFocus' + (spanName - 1) + col].focus()
                    }
                }
            },
            false
        )
    }
    showSelect = (record, index, num) => {
        let { columnData } = this.state
        let params = { ...record }
        if (params.editable) {
            delete params.editable
        }
        let tableData = [...columnData]
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
        // const index = tableData.findIndex((item) => record.key === item.key)
        // tableData.splice(index, 1, { ...params })
        tableData[index].editable = params.editable
        console.log(tableData, 'tableData++++')
        this.setState({ columnData: [...tableData] })
    }
    showEditMode = (index) => {
        let { columnData, rootInfo, columnDataBackup } = this.state
        if (columnData[index].canEdit) {
            if (!columnData[index].columnNameCn) {
                message.error('字段中文名不能为空')
                return
            }
            if (!columnData[index].columnNameEn) {
                message.error('字段英文名不能为空')
                return
            }
            // 判断英文名是否重复
            let hasRepeat = false
            let array = [...columnData]
            array.splice(index, 1)
            array.map((item) => {
                if (item.columnNameEn == columnData[index].columnNameEn) {
                    hasRepeat = true
                }
            })
            if (hasRepeat) {
                message.error('字段英文名不能重复')
                return
            }
            // 保存时调整分区字段,新增时不用调整
            if (!columnData[index].isNew) {
                if (!rootInfo.partitionColumnEnames.includes(columnData[index].columnNameEn) && rootInfo.partitionColumnEnames.includes(columnDataBackup[index].columnNameEn)) {
                    let i = rootInfo.partitionColumnEnames.indexOf(columnDataBackup[index].columnNameEn)
                    rootInfo.partitionColumnEnames.splice(i, 1)
                }
            }
        } else {
            // rootInfo.partitionColumnEnames = []
        }
        columnData[index].canEdit = !columnData[index].canEdit
        columnData[index].isNew = false
        columnDataBackup[index] = { ...columnData[index] }
        this.setState({
            columnData,
            rootInfo,
            columnDataBackup,
        })
    }
    cancelSaveColumn = (index) => {
        let { columnData, columnDataBackup } = this.state
        console.log(columnDataBackup[index], 'columnDataBackup[index]')
        if (columnData[index].isNew) {
            columnData.splice(index, 1)
        } else {
            columnData[index] = columnDataBackup[index]
            columnData[index].canEdit = false
        }
        this.setState({
            columnData,
        })
    }
    deleteColumn = async (index) => {
        let { columnData, rootInfo } = this.state
        this.setState({ dragTableLoading: true })
        console.log(index, columnData[index], 'deleteColumn')
        rootInfo.partitionColumnEnames.map((item, i) => {
            if (item == columnData[index].columnNameEn) {
                rootInfo.partitionColumnEnames.splice(i, 1)
            }
        })
        columnData.splice(index, 1)
        await this.setState({
            columnData,
            rootInfo,
        })
        this.setState({ dragTableLoading: false })
        // this.getShowShadow()
    }
    deleteCodeItem = (index) => {
        let { columnData } = this.state
        columnData[index].codeItemName = ''
        columnData[index].refCodeItemId = ''
        this.setState({
            columnData,
        })
    }
    openCodeItemModal = (index) => {
        this.codeItemModal.showModal(this.state.rootInfo.datasourceId)
        this.setState({
            codeItemIndex: index,
        })
    }
    getCodeItem = (data) => {
        let { columnData, codeItemIndex } = this.state
        columnData[codeItemIndex].codeItemName = data.codeItemName
        columnData[codeItemIndex].refCodeItemId = data.refCodeItemId
        this.setState({
            columnData,
        })
    }
    openCodeItemDetail = (data) => {
        this.props.addTab('代码项详情', { id: data.refCodeItemId })
    }
    onChangeColumnEn = (index, e) => {
        let { columnData, rootInfo, columnDataBackup } = this.state
        columnData[index].columnNameEn = e.target.value

        // 保存时调整分区字段,新增时不用调整
        if (!rootInfo.partitionColumnEnames.includes(columnData[index].columnNameEn) && rootInfo.partitionColumnEnames.includes(columnDataBackup[index].columnNameEn)) {
            let i = rootInfo.partitionColumnEnames.indexOf(columnDataBackup[index].columnNameEn)
            rootInfo.partitionColumnEnames.splice(i, 1)
        }

        this.setState({
            columnData,
        })
    }
    nullableChange = (index, e) => {
        let { columnData } = this.state
        columnData[index].nullable = e
        this.setState({
            columnData,
        })
    }
    primaryKeyChange = (index, e) => {
        let { columnData } = this.state
        columnData[index].primaryKey = e
        this.setState({
            columnData,
        })
    }
    changeDataType = (index, e, node) => {
        let { columnData } = this.state
        columnData[index].dataType = e
        columnData[index].canChangeDataLength = node.props.dataLength
        columnData[index].canChangeDataPrecision = node.props.dataPrecision
        columnData[index].dataLength = 0
        columnData[index].dataPrecision = 0
        this.setState({
            columnData,
        })
    }
    onDataLengthChange = (index, e) => {
        let { columnData } = this.state
        columnData[index].dataLength = e
        this.setState({
            columnData,
        })
    }
    onDataPrecisionChange = (index, e) => {
        let { columnData } = this.state
        columnData[index].dataPrecision = e
        this.setState({
            columnData,
        })
    }
    getSourceData = async () => {
        let res = await dsspecificationDatasource({ filterConfig: false })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDmDetail = async () => {
        let { rootInfo, columnData, tableNameCn, tableNameEn, dataTypeInfo } = this.state
        this.setState({ dragTableLoading: true })
        let res = await datamodelingTableDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            rootInfo = { ...res.data }
            delete rootInfo.columnList
            await this.setState({
                rootInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.tableNameEn)
            await this.getDataTypes()
            res.data.columnList.map((item, index) => {
                item.columnNameCnWithSpace = item.columnNameCn
                item.columnNameCn = item.columnNameCn.replace(/\s*/g, '')
                item.tableNameCnData = []
                this.state.dataTypeInfo.map((item1) => {
                    if (item1.name == item.dataType) {
                        item.canChangeDataLength = item1.dataLength
                        item.canChangeDataPrecision = item1.dataPrecision
                    }
                })
            })
            console.log(res.data.columnList, 'res.data.columnList')
            res.data.partitionColumnEnames = res.data.partitionColumnEnames ? res.data.partitionColumnEnames : []
            await this.setState({
                columnData: res.data.columnList,
                tableNameCn: res.data.tableNameCn.replace(/\s*/g, ''),
                tableNameEn: res.data.tableNameEn,
                tableNameCnWithSpace: res.data.tableNameCn,
                rootList: res.data.rootList,
            })
            this.getDsspecification()
            this.getConfigLimit()
            this.getEname()

            // this.getShowShadow()
        }
        this.setState({ dragTableLoading: false })
    }
    changeDatasource = async (e, node) => {
        console.log(node, 'changeDatasource')
        const { rootInfo, columnData } = this.state
        rootInfo.datasourceId = e
        rootInfo.datasourceType = node.props.dsType
        rootInfo.partitionColumnEnames = [] // 清空分区字段
        columnData.map((item) => {
            item.columnNameCn = ''
            item.columnNameCnWithSpace = ''
            item.rootList = []
            item.columnNameEn = ''
            item.cnameDesc = '暂无词根信息'
            item.dataType = ''
            item.dataLength = 0
            item.dataPrecision = 0
        })
        await this.setState({
            rootInfo,
            tableNameCn: '',
            tableNameCnWithSpace: '',
            rootList: [],
            tableNameEn: '',
            columnData,
            dataTypeInfo: [],
            cnameDesc: '暂无词根信息',
        })
        this.getDsspecification()
        this.getDataTypes()
        this.getConfigLimit()
    }
    getConfigLimit = async () => {
        const { rootInfo } = this.state
        let res = await configLimit({ datasourceId: rootInfo.datasourceId })
        if (res.code == 200) {
            this.setState({
                configLimitInfo: res.data,
            })
        }
    }
    getDataTypes = async () => {
        const { rootInfo } = this.state
        this.setState({ showDataType: false })
        let res = await tableDataTypes({ datasourceId: rootInfo.datasourceId })
        this.setState({ showDataType: true })
        if (res.code == 200) {
            this.setState({
                dataTypeInfo: res.data,
            })
        }
    }
    getDsspecification = async () => {
        const { rootInfo } = this.state
        let res = await dsspecification({ id: rootInfo.datasourceId })
        if (res.code == 200) {
            if (res.data) {
                rootInfo.rootOrderTypeName = res.data.rootOrderTypeName
                rootInfo.spellTypeName = res.data.spellTypeName
                rootInfo.joinTypeName = res.data.joinTypeName
                rootInfo.rootCategoryName = res.data.rootCategoryName
                rootInfo.datasourceNameEn = res.data.datasourceNameEn
                rootInfo.datasourceType = res.data.datasourceType
                this.setState({
                    rootInfo,
                    dataSourceConfig: true,
                })
            } else {
                this.setState({
                    dataSourceConfig: false,
                })
            }
        }
    }
    checkBeforePost = (type) => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, rootList } = this.state
        if (!rootInfo.datasourceId || !tableNameCn || !tableNameEn) {
            message.info('请填写完整信息')
            return
        }
        if (!columnData.length) {
            message.info('请设置字段')
            return
        }

        let emptyCn = false
        let emptyEn = false
        let array = []
        columnData.map((item) => {
            if (!item.columnNameCn) {
                emptyCn = true
            }
            if (!item.columnNameEn) {
                emptyEn = true
            }
            array.push(item.columnNameEn)
        })
        if (emptyCn) {
            message.error('字段中文名不能为空')
            return
        }
        if (emptyEn) {
            message.error('字段英文名不能为空')
            return
        }
        // 判断英文名是否重复
        let hasRepeat = false
        var hash = {}
        for (var i in array) {
            if (hash[array[i]]) hasRepeat = true
            hash[array[i]] = true
        }
        if (hasRepeat) {
            message.error('字段英文名不能重复')
            return
        }

        if (type == 1) {
            this.postData()
        } else {
            this.openDdlModal()
        }
    }
    postData = async () => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList } = this.state
        let query = {
            columnList: [],
            ...rootInfo,
            rootList,
            tableNameCn: tableNameCnWithSpace,
            tableNameEn,
        }
        query.columnList = columnData
        query.columnList.map((item) => {
            item.columnNameCn = item.columnNameCnWithSpace
            item.dataLength = item.canChangeDataLength ? item.dataLength : undefined
            item.dataPrecision = item.canChangeDataPrecision ? item.dataPrecision : undefined
        })
        this.setState({ loading: true })
        let res = await saveTable(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('DDL生成')
        }
    }
    openDdlModal = async () => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, rootList } = this.state
        columnData.map((item) => {
            item.dataLength = item.canChangeDataLength ? item.dataLength : undefined
            item.dataPrecision = item.canChangeDataPrecision ? item.dataPrecision : undefined
        })
        console.log(this.state.columnData, 'ddl+++')
        let query = {
            columnList: [],
            ...rootInfo,
            rootList,
            tableNameCn,
            tableNameEn,
        }
        query.columnList = columnData
        console.log(query.columnList, 'query.columnList')
        this.setState({ ddlLoading: true })
        let res = await tableDdl(query)
        this.setState({ ddlLoading: false })
        if (res.code == 200) {
            this.setState({
                sqlContent: res.data,
                ddlModal: true,
            })
        }
    }
    cancelModal = () => {
        this.setState({
            ddlModal: false,
        })
    }
    copy = () => {
        var input = document.getElementById('textarea')
        input.value = this.state.sqlContent
        input.select()
        document.execCommand('copy')
        message.success('复制成功')
    }
    onSwitch = (e) => {
        const { rootInfo } = this.state
        rootInfo.partitionFlag = e
        if (!e) {
            rootInfo.partitionColumnEnames = []
        }
        this.setState({
            rootInfo,
        })
    }
    getSortData = (data) => {
        console.log(data, 'getSortData')
        this.setState({
            columnData: [...data],
        })
    }
    changePartition = (e) => {
        const { rootInfo } = this.state
        rootInfo.partitionColumnEnames = e
        this.setState({
            rootInfo,
        })
    }
    openDataSourceConfig = () => {
        const { rootInfo } = this.state
        this.props.addTab('词根组合规范', { from: 'ddl', datasourceId: rootInfo.datasourceId, datasourceType: rootInfo.datasourceType, datasourceNameEn: rootInfo.datasourceNameEn })
    }
    addData = async () => {
        let { columnData } = this.state
        this.setState({ dragTableLoading: true })
        columnData.push({
            columnNameCn: '',
            columnNameEn: '',
            dataType: undefined,
            primaryKey: false,
            nullable: true,
            dataPrecision: 0,
            dataLength: 0,
            canEdit: true,
            showDropDown: false,
            tableNameCnData: [],
            rootList: [],
            isNew: true,
            id: moment().format('X'),
        })
        await this.setState({
            columnData,
        })
        this.setState({ dragTableLoading: false })
        // this.getShowShadow()
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
        let tableAutoInput = document.querySelector('.tableAutoInput')
        let cursurPosition = -1
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
        const { tableNameCn, rootInfo, rootList } = this.state
        let query = {
            cname: tableNameCn,
            datasourceId: rootInfo.datasourceId,
            position: cursurPosition,
        }
        let res = await suggestion(query)
        if (res.code == 200) {
            // res.data.map((item) => {
            //     item.selected = false
            //     rootList.map((item1) => {
            //         if (item1.id == item.id) {
            //             item.selected = true
            //         }
            //     })
            // })
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
    onChangeColumnNameCn = async (index, e) => {
        let { columnData } = this.state
        let str = e.target.value
        // 只能连续输入一个空格
        if (str.length > 1) {
            if (str[str.length - 1] == ' ' && str[str.length - 2] == ' ') {
                str = str.slice(0, str.length - 1)
            }
        }
        columnData[index].columnNameCn = str
        columnData[index].columnNameCnWithSpace = str
        await this.setState({
            columnData,
        })
        let className = '.columnAutoInput' + index
        let tableAutoInput = document.querySelector(className)
        let cursurPosition = -1
        if (tableAutoInput.selectionStart) {
            cursurPosition = tableAutoInput.selectionStart
        }
        if (columnData[index].columnNameCn[cursurPosition] == ' ') {
            console.log('输入空格')
            this.getColumnEname(index)
            this.getColumnSuggestion(cursurPosition, index)
        } else {
            this.getColumnSuggestion(cursurPosition, index)
        }
    }
    onColumnEnBlur = (index) => {
        let { columnData } = this.state
        if (columnData[index].columnNameEn) {
            columnData[index].columnNameEn = columnData[index].columnNameEn.replace(/\s*/g, '')
        }
        delete columnData[index].editable
        this.setState({
            columnData,
        })
    }
    onColumnTypeBlur = (index) => {
        let { columnData } = this.state
        delete columnData[index].editable
        this.setState({
            columnData,
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
    onColumnInputBlur = (index, e) => {
        let { columnData } = this.state
        if (columnData[index].columnNameCn) {
            columnData[index].columnNameCn = columnData[index].columnNameCn.replace(/\s*/g, '')
        }
        columnData[index].showDropown = false
        delete columnData[index].editable
        this.setState({
            columnData,
        })
        this.getColumnEname(index)
    }
    onColumnInputFocus = (index, e) => {
        let { columnData } = this.state
        columnData[index].columnNameCn = columnData[index].columnNameCnWithSpace
        columnData[index].showDropown = true
        this.setState({
            columnData,
        })
        col = index
        spanName = 1
    }
    spanNameFocus = (index, name) => {
        let { columnData, columnDataBackup } = this.state
        col = index
        spanName = name
        if (name == 2) {
            columnDataBackup[index] = { ...columnData[index] }
        }
    }
    onSelectColumnNameCn = async (data, index) => {
        let { columnData } = this.state
        console.log(columnData[index], 'columnData[index]')
        columnData[index].columnNameCn = columnData[index].columnNameCn.slice(0, data.startPosition) + data.descWord + columnData[index].columnNameCn.slice(data.endPosition) + ' '
        columnData[index].columnNameCnWithSpace = columnData[index].columnNameCn
        columnData[index].tableNameCnData = []

        let hasRepeat = false
        columnData[index].rootList.map((item) => {
            if (item.id == data.id) {
                hasRepeat = true
            }
        })
        if (!hasRepeat) {
            columnData[index].rootList.push(data)
        }
        await this.setState({
            columnData,
        })
        this.getColumnEname(index)
    }
    getColumnEname = async (index) => {
        const { columnData, rootInfo } = this.state
        let query = {
            cname: columnData[index].columnNameCnWithSpace,
            ename: columnData[index].columnNameEn,
            datasourceId: rootInfo.datasourceId,
            rootList: columnData[index].rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
            columnData[index].columnNameEn = res.data.ename
            columnData[index].cnameDesc = res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') || '暂无词根信息'
            columnData[index].rootList = res.data.rootList
            this.setState({
                columnData,
            })
        }
    }
    getColumnSuggestion = async (cursurPosition, index) => {
        const { columnData, rootInfo } = this.state
        let query = {
            cname: columnData[index].columnNameCn,
            datasourceId: rootInfo.datasourceId,
            position: cursurPosition,
        }
        let res = await suggestion(query)
        if (res.code == 200) {
            columnData[index].tableNameCnData = res.data
            this.setState({
                columnData,
            })
        }
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

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    get isRead() {
        return this.pageParam.title === '表详情'
    }

    render() {
        const {
            rootInfo,
            databaseIdList,
            loading,
            sourceList,
            baseList,
            columnData,
            ddlModal,
            sqlContent,
            dataSourceConfig,
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
        } = this.state

        const isRead = this.isRead
        const isEdit = this.props.location.state.title == '编辑表'
        return (
            <div className='VControlGroup' style={{ marginBottom: isRead ? 0 : 60 }}>
                <TableLayout
                    disabledDefaultFooter
                    showFooterControl={!isRead}
                    title={isRead ? rootInfo.tableNameEn : isEdit ? '编辑表' : '新建表'}
                    renderHeaderExtra={() => {
                        if (isRead) {
                            return (
                                <React.Fragment>
                                    <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={ddlLoading} type='primary' onClick={this.checkBeforePost.bind(this, 2)}>
                                        生成DDL
                                    </Button>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {
                                            this.props.addTab('新建表', { title: '编辑表', ...rootInfo })
                                        }}
                                    >
                                        修改
                                    </Button>
                                </React.Fragment>
                            )
                        }
                    }}
                    renderDetail={() => {
                        return (
                            <Module title='表设置'>
                                <Form className={classNames(isRead ? 'MiniForm Grid4' : 'EditMiniForm Grid1')}>
                                    {RenderUtil.renderFormItems(
                                        isRead
                                            ? [
                                                  {
                                                      label: (
                                                          <TipLabel
                                                              label='数据源'
                                                              tip={
                                                                  <Form className='MiniForm'>
                                                                      <div className='HControlGroup'>
                                                                          {[
                                                                              {
                                                                                  label: '数据源类型',
                                                                                  content: rootInfo.datasourceType,
                                                                              },
                                                                              {
                                                                                  label: '数据源类型',
                                                                                  content: rootInfo.rootCategoryName,
                                                                              },
                                                                              {
                                                                                  label: '拼写方式',
                                                                                  content: rootInfo.spellTypeName,
                                                                              },
                                                                              {
                                                                                  label: '连接方式',
                                                                                  content: rootInfo.joinTypeName,
                                                                              },
                                                                              {
                                                                                  label: '词根排序',
                                                                                  content: rootInfo.rootOrderTypeName,
                                                                              },
                                                                          ].map((item) => {
                                                                              return (
                                                                                  <div key={item.label} className='TableAddTip'>
                                                                                      <label>{item.label}：</label>
                                                                                      <span>{item.content}</span>
                                                                                  </div>
                                                                              )
                                                                          })}
                                                                      </div>
                                                                  </Form>
                                                              }
                                                          />
                                                      ),
                                                      content: rootInfo.datasourceNameEn,
                                                  },
                                                  {
                                                      label: '表中文名',
                                                      content: rootInfo.tableNameCn,
                                                  },
                                                  {
                                                      label: '表英文名',
                                                      content: rootInfo.tableNameEn,
                                                  },
                                              ]
                                            : [
                                                  {
                                                      label: '数据源',
                                                      required: true,
                                                      content: (
                                                          <Select
                                                              style={{ width: 480 }}
                                                              disabled={isEdit || isRead}
                                                              onChange={this.changeDatasource}
                                                              value={rootInfo.datasourceId}
                                                              placeholder='数据源'
                                                          >
                                                              {sourceList.map((item) => {
                                                                  return (
                                                                      <Option dsType={item.dsType} value={item.id} key={item.id}>
                                                                          {item.identifier}
                                                                      </Option>
                                                                  )
                                                              })}
                                                          </Select>
                                                      ),
                                                      extra: (
                                                          <div className='VControlGroup'>
                                                              {!dataSourceConfig ? (
                                                                  <Alert
                                                                      style={{ width: 480 }}
                                                                      showIcon
                                                                      className='configAlert'
                                                                      message={
                                                                          <div>
                                                                              您选择的数据源未配置规范，请先进行配置
                                                                              <a onClick={this.openDataSourceConfig}>去配置{'>>'}</a>
                                                                          </div>
                                                                      }
                                                                      type='error'
                                                                  />
                                                              ) : null}
                                                              <Form className='MiniForm' layout='inline'>
                                                                  <div className='HControlGroup'>
                                                                      {RenderUtil.renderFormItems([
                                                                          {
                                                                              label: '数据源类型',
                                                                              content: rootInfo.datasourceType,
                                                                          },
                                                                          {
                                                                              label: '数据源类型',
                                                                              content: rootInfo.rootCategoryName,
                                                                          },
                                                                          {
                                                                              label: '拼写方式',
                                                                              content: rootInfo.spellTypeName,
                                                                          },
                                                                          {
                                                                              label: '连接方式',
                                                                              content: rootInfo.joinTypeName,
                                                                          },
                                                                          {
                                                                              label: '词根排序',
                                                                              content: rootInfo.rootOrderTypeName,
                                                                          },
                                                                      ])}
                                                                  </div>
                                                              </Form>
                                                          </div>
                                                      ),
                                                  },
                                                  {
                                                      label: '表中文名',
                                                      required: true,
                                                      content: (
                                                          <div style={{ width: 480, position: 'relative' }}>
                                                              <Input
                                                                  disabled={!rootInfo.datasourceId || !dataSourceConfig || isRead}
                                                                  className='tableAutoInput'
                                                                  placeholder='请输入表中文名'
                                                                  value={tableNameCn}
                                                                  onChange={this.onChangeTableNameCn}
                                                                  onBlur={this.onInputBlur}
                                                                  onFocus={this.onInputFocus}
                                                                  maxLength={128}
                                                              />

                                                              {showDropown ? (
                                                                  <div className='tableAutoDropdown commonScroll'>
                                                                      {tableNameCnData.map((item) => {
                                                                          return (
                                                                              <div
                                                                                  className='tableAutoDropdownItem'
                                                                                  dangerouslySetInnerHTML={{ __html: item.showDesc }}
                                                                                  onClick={this.onSelectTableNameCn.bind(this, item)}
                                                                              ></div>
                                                                          )
                                                                      })}
                                                                      {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>未搜到相关内容, 点击空格进行新的搜索</div> : null}
                                                                  </div>
                                                              ) : null}
                                                          </div>
                                                      ),
                                                      extra: cnameDesc,
                                                  },
                                                  {
                                                      label: '表英文名',
                                                      required: true,
                                                      content: (
                                                          <Input
                                                              style={{ width: 480 }}
                                                              disabled={!rootInfo.datasourceId || !dataSourceConfig || isRead}
                                                              maxLength={50}
                                                              onChange={this.onChangeTableEn}
                                                              onBlur={this.onTableEnBlur}
                                                              value={tableNameEn}
                                                              placeholder='输入表中文名可自动匹配表英文名'
                                                          />
                                                      ),
                                                  },
                                              ]
                                    )}
                                </Form>
                            </Module>
                        )
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                {this.props.location.state.title !== '表详情' ? (
                                    <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={loading} type='primary' onClick={this.checkBeforePost.bind(this, 1)}>
                                        保存
                                    </Button>
                                ) : null}
                                <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={ddlLoading} type='primary' ghost onClick={this.checkBeforePost.bind(this, 2)}>
                                    生成DDL
                                </Button>
                            </React.Fragment>
                        )
                    }}
                />
                <Module title='字段设置'>
                    {!dragTableLoading ? (
                        <ConfigProvider
                            renderEmpty={(name) => {
                                switch (name) {
                                    case 'Table':
                                        return null
                                    default:
                                        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                            }}
                        >
                            <DragSortingTable
                                className='dataTableColumn'
                                rowkey='id'
                                columns={this.columns}
                                dataSource={columnData}
                                getSortData={this.getSortData}
                                canMove={this.props.location.state.title !== '表详情'}
                                from='dataTable'
                            />
                        </ConfigProvider>
                    ) : null}
                    {this.props.location.state.title !== '表详情' ? (
                        <Button icon={<PlusOutlined />} block disabled={!rootInfo.datasourceId || !dataSourceConfig} onClick={this.addData} ghost type='link'>
                            添加
                        </Button>
                    ) : null}
                </Module>
                <Module
                    title={
                        <React.Fragment>
                            <span>分区设置</span>
                            <Switch disabled={this.props.location.state.title == '表详情' || !configLimitInfo.enablePartition} onChange={this.onSwitch} checked={rootInfo.partitionFlag} />
                        </React.Fragment>
                    }
                >
                    {rootInfo.partitionFlag ? (
                        <div className='MiniForm Grid1'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '分区字段',
                                    content: (
                                        <Select
                                            style={{ width: 480 }}
                                            disabled={this.props.location.state.title == '表详情' || !configLimitInfo.enablePartition}
                                            mode='multiple'
                                            onChange={this.changePartition}
                                            value={rootInfo.partitionColumnEnames}
                                            placeholder='分区字段'
                                        >
                                            {columnData.map((item) => {
                                                return (
                                                    <Option style={{ display: item.columnNameEn ? 'block' : 'none' }} value={item.columnNameEn} key={item.columnNameEn}>
                                                        {item.columnNameEn}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                            ])}
                        </div>
                    ) : null}
                </Module>
                <CodeItemModal
                    ref={(dom) => {
                        this.codeItemModal = dom
                    }}
                    getCodeItem={this.getCodeItem}
                />
                <DrawerLayout
                    drawerProps={{
                        title: 'DDL',
                        visible: ddlModal,
                        onClose: this.cancelModal,
                    }}
                    renderFooter={() => {
                        return (
                            <Button onClick={this.copy} type='primary'>
                                复制
                            </Button>
                        )
                    }}
                >
                    {ddlModal ? (
                        <div className='tableCell commonScroll' style={{ position: 'relative', height: '300px', border: '1px solid #D3D3D3', padding: '8px' }}>
                            <textarea style={{ width: '100%', height: '270px', resize: 'none', outline: 'none', border: 'none' }} readonly='readonly'>
                                {sqlContent}
                            </textarea>
                        </div>
                    ) : null}
                    <textarea id='textarea' style={{ opacity: '0', height: '0px' }}>
                        {sqlContent}
                    </textarea>
                </DrawerLayout>
            </div>
        )
    }
}
