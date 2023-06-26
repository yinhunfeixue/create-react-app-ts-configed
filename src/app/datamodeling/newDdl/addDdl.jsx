import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import TipLabel from '@/component/tipLabel/TipLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { InfoCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Alert, AutoComplete, Button, Cascader, Checkbox, ConfigProvider, Divider, Empty, Form, Input, InputNumber, message, Modal, Popover, Radio, Select, Spin, Switch, Tooltip } from 'antd'
import { candidateRootReplace, detailForEdit, generatePrefixOrSuffix, parseDDL, partitionExpMeSql, simpleLevel, suffixRoots, tableGroup } from 'app_api/dataModeling'
import { catalogDwTree, dwAnalysisThemeTree } from 'app_api/dataSecurity'
import { configLimit, dsspecification, dsspecificationDatasource, parseCname, saveTable, suggestion, tableDataTypes, tableDdl } from 'app_api/metadataApi'
import classNames from 'classnames'
import Lodash from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import CodeItemModal from '../ddl/codeItemModal'
import DragSortingTable from '../ddl/dragSortTable'
import DdlDrawer from '../dgdl/comonpent/DdlCodeDrawer'
import ForeignKeyColumnDrawer from '../dgdl/comonpent/foreignKeyColumnDrawer'
import RootWindow from '../dgdl/comonpent/rootWindow'
import StandardMapDrawer from '../dgdl/comonpent/standardMapDrawer'
import '../index.less'
import AddRootDrawer from './component/addRootDrawer'
import AlysisDdlDrawer from './component/alysisDdlDrawer'
import TableTypeModal from './component/tableTypeModal'

const { Option, OptGroup } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

let col = 0
let spanName = 0

export default class AddDdl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                partitionFlag: false,
                partitionColumnEnames: [],
                sourceType: 0,
                dwPrefixClassIds: [],
                tablePartitionMySql: {
                    columns: [],
                    partitionFlag: false,
                    partitionFunc: 3,
                    partitionDefs: [
                        {
                            partitionDefinerAtoms: [{ values: [] }],
                        },
                    ],
                    subPartitionFuncOutSide: {
                        columns: [],
                        partitionFlag: false,
                        partitionFunc: 0,
                        partitionDefs: [
                            {
                                partitionDefinerAtoms: [{ values: [] }],
                            },
                        ],
                    },
                },
                tablePartitionAndBucketHive: {
                    partitionFlag: false,
                    bucket: {
                        columns: [],
                        columnWithOrderList: [{}],
                    },
                    partition: {
                        columnWithInfoList: [],
                    },
                },
            },
            dataSourceConfig: true,
            databaseIdList: [],
            loading: false,
            saveLoading: false,
            spinning: false,
            sourceList: [],
            baseList: [],
            sqlContent: '',
            columnData: [],
            columnDataBackup: [],
            tableNameCn: '',
            tableNameCnWithSpace: '',
            tableNameEn: '',
            tableNameEnHtml: '',
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
            tableTypeList: [],
            selectedIndex: 0,
            prefixList: [1, 2, 3],
            popconfirmVisible: false,
            candidateRoot: [],
            suffixRootsList: [],
            dwLevelList: [],
            themeTreeData: [],
            dwTreeData: [],
            expList: [],
        }

        this.columns = [
            {
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    const { columnData } = this.state
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
                                <div className='ddlTableAutoDropdown commonScroll' style={{ width: 250 }}>
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
                },
            },
            {
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                title: '字段英文名',
                width: 160,
                render: (text, record, index) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <div
                                className={
                                    !this.state.rootInfo.datasourceId || !this.state.dataSourceConfig
                                        ? 'disabledDiv editableDiv ' + 'columnEnDiv' + index
                                        : 'ant-input editableDiv ' + 'columnEnDiv' + index
                                }
                                contentEditable={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig ? 'false' : 'true'}
                                onKeyUp={this.onChangeColumnEn.bind(this, index)}
                                onBlur={this.onChangeColumnEnHtml.bind(this, index)}
                                onFocus={this.spanNameFocus.bind(this, index, 2)}
                            >
                                {record.columnNameEnHtml}
                            </div>
                            {!text ? <div className='editableDivPlaceholder'>字段英文名</div> : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'standardName',
                key: 'standardName',
                title: '引用标准',
                width: 90,
                render: (text, record, index) => {
                    return (
                        <div onClick={this.openStandardModal.bind(this, index)}>
                            <Select
                                disabled={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig}
                                style={{ width: '100%' }}
                                value={text}
                                dropdownClassName='hideDropdown'
                                placeholder='请选择'
                                showArrow={false}
                            ></Select>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: (
                    <span>
                        字段类型
                        <Tooltip
                            overlayStyle={{ maxWidth: 266 }}
                            title={
                                <div>
                                    被括起来的内容依次为长度，精度。例如：
                                    <ul style={{ paddingLeft: 12 }}>
                                        <li style={{ listStyle: 'initial' }}>DOUBLE(11,2)</li>
                                        <li style={{ listStyle: 'initial' }}>字段类型为DOUBLE，长度11，精度2</li>
                                    </ul>
                                </div>
                            }
                        >
                            <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: '5px' }} />
                        </Tooltip>
                    </span>
                ),
                width: 130,
                render: (text, record, index) => {
                    return (
                        <div className='dataTypeSelect'>
                            <AutoComplete
                                allowClear
                                value={record.dataTypeWithNumber}
                                disabled={!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig}
                                style={{ width: '100%' }}
                                onSearch={this.dataTypeFilter.bind(this, index)}
                                onSelect={this.selectDataType.bind(this, index)}
                                onChange={this.changeDataType.bind(this, index)}
                                filterOption={(inputValue, option) => (option.props.value ? option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false)}
                                placeholder='请输入'
                            >
                                {record.dataTypeInfo &&
                                    record.dataTypeInfo.map((node) => {
                                        return (
                                            <OptGroup label={node.category}>
                                                {node.dataTypeVOS &&
                                                    node.dataTypeVOS.map((item) => {
                                                        return (
                                                            <Option
                                                                value={item.nameDesc}
                                                                style={{ display: item.hidden == true ? 'none' : 'inline-block' }}
                                                                key={item.name}
                                                                precision={item.precision}
                                                                length={item.length}
                                                                dataPrecision={item.dataPrecision}
                                                                dataLength={item.dataLength}
                                                            >
                                                                {item.nameDesc}
                                                            </Option>
                                                        )
                                                    })}
                                            </OptGroup>
                                        )
                                    })}
                            </AutoComplete>
                        </div>
                    )
                },
            },
            // {
            //     dataIndex: 'dataLength',
            //     key: 'dataLength',
            //     title: '长度',
            //     width: 100,
            //     render: (text, record, index) => {
            //         return (
            //             <InputNumber
            //                 min={0}
            //                 onFocus={this.spanNameFocus.bind(this, index, 4)}
            //                 onBlur={this.onColumnTypeBlur.bind(this, index)}
            //                 style={{ width: '100%' }}
            //                 disabled={!record.canChangeDataLength}
            //                 value={text}
            //                 onChange={this.onDataLengthChange.bind(this, index)}
            //             />
            //         )
            //     },
            // },
            // {
            //     dataIndex: 'dataPrecision',
            //     key: 'dataPrecision',
            //     title: '精度',
            //     width: 100,
            //     render: (text, record, index) => {
            //         return (
            //             <InputNumber
            //                 min={0}
            //                 onFocus={this.spanNameFocus.bind(this, index, 5)}
            //                 onBlur={this.onColumnTypeBlur.bind(this, index)}
            //                 style={{ width: '100%' }}
            //                 disabled={!record.canChangeDataPrecision}
            //                 value={text}
            //                 onChange={this.onDataPrecisionChange.bind(this, index)}
            //             />
            //         )
            //     },
            // },
            {
                dataIndex: 'nullable',
                key: 'nullable',
                title: '非空',
                width: 60,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox disabled={!this.state.configLimitInfo.enableNotNull} checked={text ? false : true} onChange={this.nullableChange.bind(this, 'nullable', index)} />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                title: '主键',
                width: 60,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox disabled={!this.state.configLimitInfo.enablePrimary} checked={text} onChange={this.nullableChange.bind(this, 'primaryKey', index)} />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'foreignKey',
                key: 'foreignKey',
                title: '外键',
                width: 90,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox disabled={!this.state.configLimitInfo.enableForeign} checked={text} onChange={this.nullableChange.bind(this, 'foreignKey', index)} />
                            <Tooltip title={'外键：' + record.foreignColumnName}>
                                {text ? <IconFont onClick={this.openForeignKeyModal.bind(this, index)} className='foreignKey' type='icon-waijian' /> : null}
                            </Tooltip>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'codeItemName',
                key: 'codeItemName',
                title: '引用代码',
                width: 100,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox checked={text} onChange={this.nullableChange.bind(this, 'codeItemName', index)} />
                            <Tooltip title={'引用代码：' + text}>{text ? <IconFont onClick={this.openCodeItemModal.bind(this, index)} className='foreignKey' type='icon-code' /> : null}</Tooltip>
                        </div>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 60,
                className: 'columnTable',
                render: (text, record, index) => {
                    return <a onClick={this.deleteColumn.bind(this, index)}>删除</a>
                },
            },
        ]
    }
    componentDidMount = async () => {
        this.getSourceData()
        this.getTableTypeList()
        this.getSuffixRoots()
        this.getSimpleLevel()
        this.getTreeData()
        this.getMysqlExp()
        const { pageType } = this.pageParam
        if (pageType == 'edit') {
            await this.getDmDetail()
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
    }
    dataTypeFilter = (index, e) => {
        console.log(e, 'dataTypeFilter')
        let { columnData } = this.state
        columnData[index].dataTypeInfo.map((item) => {
            item.dataTypeVOS &&
                item.dataTypeVOS.map((node) => {
                    node.hidden = false
                    if (!node.nameDesc.toLowerCase().includes(e.toLowerCase())) {
                        node.hidden = true
                    }
                })
        })
        this.setState({
            columnData,
        })
    }
    getMysqlExp = async () => {
        let res = await partitionExpMeSql()
        if (res.code == 200) {
            this.setState({
                expList: res.data,
            })
        }
    }
    selectDataType = (index, e, node) => {
        console.log(e, node, 'selectDataType')
        let { columnData } = this.state
        columnData[index].dataTypeWithNumber = e.includes('(') ? e : e + (node.props.dataLength ? '(' + (node.props.dataPrecision ? ',' : '') + ')' : '')
        columnData[index].dataType = node.key
        columnData[index].canChangeDataLength = node.props.dataLength
        columnData[index].canChangeDataPrecision = node.props.dataPrecision
        columnData[index].dataLength = node.props.length ? node.props.length : undefined
        columnData[index].dataPrecision = node.props.precision ? node.props.precision : undefined
        console.log(columnData[index], 'columnData[index]')
        this.setState({
            columnData,
        })
    }
    openStandardModal = (index) => {
        if (!this.state.rootInfo.datasourceId || !this.state.dataSourceConfig) {
            return
        }
        this.standardMapDrawer && this.standardMapDrawer.openModal()
        this.setState({
            selectedIndex: index,
        })
    }
    getColumnMapData = async (data) => {
        let { columnData, selectedIndex } = this.state
        columnData[selectedIndex].standardId = data.id
        columnData[selectedIndex].standardName = data.name
        columnData[selectedIndex].dataType = undefined
        columnData[selectedIndex].dataTypeWithNumber = ''
        await this.setState({
            columnData,
        })
        this.getDataTypes()
    }
    getSuffixRoots = async () => {
        let res = await suffixRoots()
        if (res.code == 200) {
            this.setState({
                suffixRootsList: res.data,
            })
        }
    }
    getSimpleLevel = async () => {
        let res = await simpleLevel()
        if (res.code == 200) {
            this.setState({
                dwLevelList: res.data,
            })
        }
    }
    getTableTypeList = async () => {
        let res = await tableGroup()
        if (res.code == 200) {
            this.setState({
                tableTypeList: res.data,
            })
        }
    }
    getPrefixOrSuffix = async (value) => {
        let { rootInfo } = this.state
        let query = {
            datasourceId: rootInfo.datasourceId,
            dwLevel: rootInfo.dwLevel,
            prefix: value,
            ddlInfo: '',
            treeNodeCodes: [],
        }
        if (value) {
            query.treeNodeCodes = rootInfo.dwPrefixClassIds
        } else {
            query.treeNodeCodes = [rootInfo.rootName]
        }
        let res = await generatePrefixOrSuffix(query)
        if (res.code == 200) {
            if (value) {
                rootInfo.prefixEnglishName = res.data
            } else {
                rootInfo.suffixEnglishName = res.data
            }
            this.setState({
                rootInfo,
            })
        }
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
        if (rootInfo.datasourceType == 'HIVE') {
            rootInfo.tablePartitionAndBucketHive.partition.columnWithInfoList.map((item, i) => {
                if (item.columnName == columnData[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.partition.columnWithInfoList.splice(i, 1)
                    rootInfo.tablePartitionAndBucketHive.partition.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionAndBucketHive.bucket.columns.map((item, i) => {
                if (item == columnData[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.bucket.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList.map((item, i) => {
                if (item.columnName == columnData[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList[i].columnName = undefined
                }
            })
        }
        if (rootInfo.datasourceType == 'MYSQL') {
            rootInfo.tablePartitionMySql.columns.map((item, i) => {
                if (item == columnData[index].columnNameEn) {
                    rootInfo.tablePartitionMySql.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns.map((item, i) => {
                if (item == columnData[index].columnNameEn) {
                    rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns.splice(i, 1)
                }
            })
        }
        columnData.splice(index, 1)
        await this.setState({
            columnData,
            rootInfo,
        })
        await this.setState({ dragTableLoading: false })
        this.setColumnEnHtml()
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
    onChangeColumnEnHtml = async (index) => {
        let { columnData } = this.state
        columnData[index].columnNameEnHtml = document.querySelector('.columnEnDiv' + index).innerHTML
        await this.setState({
            columnData,
        })
        this.setColumnEnHtml()
    }
    setColumnEnHtml = () => {
        let { columnData } = this.state
        columnData.map((item, index) => {
            if (columnData[index].columnNameEnHtml) {
                console.log(document.querySelector('.columnEnDiv' + index))
                if (document.querySelector('.columnEnDiv' + index)) {
                    document.querySelector('.columnEnDiv' + index).innerHTML = columnData[index].columnNameEnHtml
                }
            }
        })
    }
    onChangeColumnEn = (index, e) => {
        let { columnData, rootInfo, columnDataBackup } = this.state
        let columnEnDivText = document.querySelector('.columnEnDiv' + index).innerText.replace(/\s*/g, '')
        if (columnEnDivText.length > 127) {
            document.querySelector('.columnEnDiv' + index).innerHTML = `<span>${columnData[index].columnNameEn}&nbsp;</span>`
        } else {
            columnData[index].columnNameEn = columnEnDivText
        }

        // 保存时调整分区字段,新增时不用调整
        if (!rootInfo.partitionColumnEnames.includes(columnData[index].columnNameEn) && rootInfo.partitionColumnEnames.includes(columnDataBackup[index].columnNameEn)) {
            let i = rootInfo.partitionColumnEnames.indexOf(columnDataBackup[index].columnNameEn)
            rootInfo.partitionColumnEnames.splice(i, 1)
        }
        if (rootInfo.datasourceType == 'HIVE') {
            rootInfo.tablePartitionAndBucketHive.partition.columnWithInfoList.map((item, i) => {
                if (item.columnName == columnDataBackup[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.partition.columnWithInfoList.splice(i, 1)
                    rootInfo.tablePartitionAndBucketHive.partition.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionAndBucketHive.bucket.columns.map((item, i) => {
                if (item == columnDataBackup[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.bucket.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList.map((item, i) => {
                if (item.columnName == columnDataBackup[index].columnNameEn) {
                    rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList[i].columnName = undefined
                }
            })
        }
        if (rootInfo.datasourceType == 'MYSQL') {
            rootInfo.tablePartitionMySql.columns.map((item, i) => {
                if (item == columnDataBackup[index].columnNameEn) {
                    rootInfo.tablePartitionMySql.columns.splice(i, 1)
                }
            })
            rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns.map((item, i) => {
                if (item == columnDataBackup[index].columnNameEn) {
                    rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns.splice(i, 1)
                }
            })
        }
        this.setState({
            columnData,
            rootInfo,
        })
    }
    nullableChange = (name, index, e) => {
        let { columnData } = this.state
        if (name == 'foreignKey') {
            if (e.target.checked && !columnData[index].foreignColumnId) {
                this.openForeignKeyModal(index)
            } else {
                columnData[index][name] = e.target.checked
            }
        } else if (name == 'codeItemName') {
            if (e.target.checked) {
                this.openCodeItemModal(index)
            } else {
                columnData[index][name] = e.target.checked
            }
        } else if (name == 'nullable') {
            console.log(e.target.checked, 'e.target.checked')
            columnData[index][name] = !e.target.checked
        } else {
            columnData[index][name] = e.target.checked
        }
        this.setState({
            columnData,
        })
    }
    openForeignKeyModal = (index) => {
        let { columnData, rootInfo } = this.state
        let data = []
        if (columnData[index].foreignColumnId) {
            data = [columnData[index].foreignDatabaseId, columnData[index].foreignTableId, columnData[index].foreignColumnId]
        }
        this.foreignKeyColumnDrawer && this.foreignKeyColumnDrawer.openModal(data, rootInfo.datasourceId)
        this.setState({
            selectedIndex: index,
        })
    }
    getForeignKeyData = (data) => {
        let { columnData, selectedIndex } = this.state
        columnData[selectedIndex].foreignDatabaseId = data[0].id
        // columnData[selectedIndex].databaseName = data[0].name
        columnData[selectedIndex].foreignTableId = data[1].id
        // columnData[selectedIndex].tableName = data[1].name
        columnData[selectedIndex].foreignColumnId = data[2].id
        columnData[selectedIndex].foreignColumnName = data[0].name + '/' + data[1].name + '/' + data[2].name
        columnData[selectedIndex].foreignColumnType = data[2].type // 字段类型
        columnData[selectedIndex].foreignKey = true
        this.setState({
            columnData,
        })
    }
    changeDataType = (index, e, node) => {
        console.log(e, node, 'changeDataType+++')
        let { columnData } = this.state
        e = e ? e.replace('（', '(').replace('）', ')').replace('，', ',') : ''
        columnData[index].dataType = e.split('(')[0]
        let numberStr = e.substring(e.indexOf('(') + 1, e.indexOf(')'))
        // columnData[index].canChangeDataLength = node.props.dataLength
        // columnData[index].canChangeDataPrecision = node.props.dataPrecision
        columnData[index].dataLength = numberStr.split(',')[0]
        columnData[index].dataPrecision = numberStr.split(',')[1]
        columnData[index].dataTypeWithNumber = e
        console.log(columnData[index], 'columnData[index]')
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
        this.setState({ spinning: true })
        let res = await detailForEdit({ id: this.pageParam.id })
        if (res.code == 200) {
            this.getRootInfo(res.data)
        }
        this.setState({ spinning: false })
    }
    getRootInfo = async (data) => {
        let { rootInfo } = this.state
        data.partitionColumnEnames = data.partitionColumnEnames ? data.partitionColumnEnames : []
        if (data.tablePartitionMySql !== null) {
            // data.tablePartitionMySql.partitionDefs.map((item) => {
            //     item.partitionDefinerAtoms&&item.partitionDefinerAtoms.map((node, index) => {
            //         item.partitionDefinerAtoms[0].values += node.values.concat()
            //     })
            // })
            if (data.tablePartitionMySql.subPartitionFuncOutSide !== null) {
                data.tablePartitionMySql.subPartitionFuncOutSide.partitionFlag = true
            } else {
                data.tablePartitionMySql.subPartitionFuncOutSide = {
                    columns: [],
                    partitionFlag: false,
                    partitionFunc: 0,
                    partitionDefs: [
                        {
                            partitionDefinerAtoms: [{ values: [] }],
                        },
                    ],
                }
            }
        } else {
            data.tablePartitionMySql = {
                columns: [],
                partitionFlag: false,
                partitionFunc: 3,
                partitionDefs: [
                    {
                        partitionDefinerAtoms: [{ values: [] }],
                    },
                ],
                subPartitionFuncOutSide: {
                    columns: [],
                    partitionFlag: false,
                    partitionFunc: 0,
                    partitionDefs: [
                        {
                            partitionDefinerAtoms: [{ values: [] }],
                        },
                    ],
                },
            }
        }
        if (data.tablePartitionAndBucketHive !== null) {
            if (data.tablePartitionAndBucketHive.bucket !== null) {
                data.tablePartitionAndBucketHive.bucket.partitionFlag = true
            } else {
                data.tablePartitionAndBucketHive.bucket = {
                    columns: [],
                    columnWithOrderList: [{}],
                    partitionFlag: false,
                }
            }
            if (data.tablePartitionAndBucketHive.partition == null) {
                data.tablePartitionAndBucketHive.partition = {
                    columns: [],
                    columnWithInfoList: [],
                }
            }
        } else {
            data.tablePartitionAndBucketHive = {
                partitionFlag: false,
                bucket: {
                    columns: [],
                    columnWithOrderList: [{}],
                    partitionFlag: false,
                },
                partition: {
                    columns: [],
                    columnWithInfoList: [],
                },
            }
        }
        data.tablePartitionAndBucketHive.partition.columns = []
        data.tablePartitionAndBucketHive.partition.columnWithInfoList &&
            data.tablePartitionAndBucketHive.partition.columnWithInfoList.map((item) => {
                data.tablePartitionAndBucketHive.partition.columns.push(item.columnName)
            })
        data.dwPrefixClassIds = data.dwPrefixClassIds ? data.dwPrefixClassIds : []
        rootInfo = { ...data }
        delete rootInfo.columnList
        await this.setState({
            rootInfo,
        })
        this.setState({ dragTableLoading: true, spinning: true })
        ProjectUtil.setDocumentTitle(data.tableNameEn)
        data.columnList.map((item, index) => {
            item.rootList = item.rootList ? item.rootList : []
            item.columnNameCnWithSpace = item.columnNameCn
            item.columnNameCn = item.columnNameCn ? item.columnNameCn.replace(/\s*/g, '') : ''
            item.columnNameEnHtml = `<span>${item.columnNameEn}&nbsp;</span>`
            item.columnNameEnWithHtml = item.columnNameEn
            item.columnNameEn = item.columnNameEnWithoutHl ? item.columnNameEnWithoutHl : item.columnNameEn
            item.tableNameCnData = []
            if (item.dataType) {
                item.dataTypeWithNumber = item.dataType + (item.dataLength !== undefined ? '(' + item.dataLength + (item.dataPrecision ? ',' + item.dataPrecision : '') + ')' : '')
            }
        })
        data.candidateRoot = data.candidateRoot ? data.candidateRoot : []
        data.rootList = data.rootList ? data.rootList : []
        data.candidateRoot.map((item) => {
            item.descWord = item.descWord ? item.descWord : []
        })
        await this.setState({
            columnData: data.columnList,
            tableNameCn: data.tableNameCn ? data.tableNameCn.replace(/\s*/g, '') : '',
            tableNameEn: data.tableNameEn,
            tableNameEnHtml: data.tableNameEn ? `<span>${data.tableNameEn}&nbsp;</span>` : '',
            tableNameCnWithSpace: data.tableNameCn,
            rootList: data.rootList,
            candidateRoot: data.candidateRoot,
        })
        await this.setState({ dragTableLoading: false, spinning: false })
        this.getDataTypes()
        this.getDsspecification()
        this.getConfigLimit()
        this.getEname(false)
        this.setColumnEnHtml()
        this.setTableEnHtml()
    }
    setTableEnHtml = () => {
        let { tableNameEnHtml } = this.state
        console.log(document.getElementById('tableNameEnHtml'), document.getElementById('tableNameEnHtml').innerHTML, 'setTableEnHtml')
        document.getElementById('tableNameEnHtml').innerHTML = tableNameEnHtml
    }
    changeDatasource = async (e, node) => {
        console.log(node, 'changeDatasource')
        const { rootInfo, columnData } = this.state
        if (rootInfo.datasourceType == 'HIVE') {
            rootInfo.tablePartitionAndBucketHive.partition.columnWithInfoList = []
            rootInfo.tablePartitionAndBucketHive.partition.columns = []
            rootInfo.tablePartitionAndBucketHive.bucket.columns = []
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList = [{}]
        }
        if (rootInfo.datasourceType == 'MYSQL') {
            rootInfo.tablePartitionMySql.columns = []
            rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns = []
        }

        rootInfo.datasourceId = e
        rootInfo.datasourceType = node.props.dsType
        rootInfo.prefixEnglishName = ''
        rootInfo.suffixEnglishName = ''
        rootInfo.partitionColumnEnames = [] // 清空分区字段
        columnData.map((item) => {
            item.columnNameCn = ''
            item.columnNameCnWithSpace = ''
            item.rootList = []
            item.columnNameEn = ''
            item.columnNameEnHtml = ''
            item.cnameDesc = '暂无词根信息'
            item.dataType = ''
            item.dataLength = undefined
            item.dataPrecision = undefined
        })
        await this.setState({
            rootInfo,
            tableNameCn: '',
            tableNameCnWithSpace: '',
            rootList: [],
            tableNameEn: '',
            tableNameEnHtml: '',
            columnData,
            dataTypeInfo: [],
            cnameDesc: '暂无词根信息',
        })
        if (rootInfo.sourceType == 1) {
            this.startAlysis({ ddlInfo: rootInfo.ddl, sqlVocabTxt: rootInfo.sqlVocabTxt })
        } else {
            this.getDsspecification()
            this.getDataTypes()
            this.getConfigLimit()
        }
    }
    changeSelect = async (name, e, node) => {
        const { rootInfo } = this.state
        if (name == 'sourceType') {
            if (e.target.value) {
                this.alysisDdlDrawer && this.alysisDdlDrawer.openModal({ ddlInfo: rootInfo.ddl, sqlVocabTxt: rootInfo.sqlVocabTxt })
            } else {
                rootInfo[name] = e.target.value
            }
        } else if (name == 'dwSuffixRootId') {
            rootInfo[name] = e
            rootInfo.rootName = node.props.title
        } else if (name == 'dwLevel') {
            rootInfo[name] = e
            rootInfo.dwPrefixClassIds = []
            rootInfo.prefixEnglishName = ''
        } else {
            rootInfo[name] = e
        }
        await this.setState({
            rootInfo,
        })
        if (name == 'dwSuffixRootId' || name == 'dwPrefixClassIds') {
            this.getPrefixOrSuffix(name == 'dwPrefixClassIds' ? true : false)
        }
    }
    changePreFix = (index, e) => {
        const { rootInfo } = this.state
    }
    openAlysisModal = () => {
        const { rootInfo } = this.state
        this.alysisDdlDrawer && this.alysisDdlDrawer.openModal({ ddlInfo: rootInfo.ddl, sqlVocabTxt: rootInfo.sqlVocabTxt })
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
        const { rootInfo, columnData } = this.state
        this.setState({ showDataType: false })
        for (let i = 0; i < columnData.length; i++) {
            let res = await tableDataTypes({ datasourceId: rootInfo.datasourceId, stdId: columnData[i].standardId })
            if (res.code == 200) {
                columnData[i].dataTypeInfo = res.data
                res.data.map((item) => {
                    item.dataTypeVOS &&
                        item.dataTypeVOS.map((node) => {
                            node.nameDesc = node.name + (node.length !== undefined ? '(' + node.length + (node.dataPrecision ? ',' + node.precision : '') + ')' : '')
                            if (node.name == columnData[i].dataType) {
                                columnData[i].canChangeDataLength = node.dataLength
                                columnData[i].canChangeDataPrecision = node.dataPrecision
                            }
                        })
                })
                this.setState({
                    // dataTypeInfo: res.data,
                    columnData,
                })
            }
        }
        this.setState({ showDataType: true })
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
                rootInfo.dataWarehouse = res.data.dataWarehouse
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
        let { rootInfo, columnData, tableNameCn, tableNameEn, rootList, candidateRoot, tableNameCnWithSpace } = this.state
        if (!rootInfo.datasourceId || !tableNameCn || !tableNameEn || !rootInfo.groupCode) {
            message.info('请填写完整信息')
            return
        }
        if (rootInfo.dataWarehouse && (!rootInfo.dwPrefixClassIds.length || !rootInfo.dwSuffixRootId)) {
            message.info('请填写完整信息')
            return
        }
        if (!columnData.length) {
            message.info('请设置字段')
            return
        }
        tableNameEn = document.getElementById('tableNameEnHtml').innerText.replace(/\s*/g, '')
        let emptyCn = false
        let emptyEn = false
        let array = []
        columnData.map((item) => {
            item.columnNameEn = item.columnNameEn.replace(/\s*/g, '')
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

        let query = {
            columnList: [],
            ...rootInfo,
            rootList,
            tableNameCn: tableNameCnWithSpace,
            tableNameEn,
            status: 1,
            candidateRoot,
        }
        query.tablePartitionAndBucketHive = { ...rootInfo.tablePartitionAndBucketHive }
        query.tablePartitionMySql = { ...rootInfo.tablePartitionMySql }
        query.columnList = columnData
        query.columnList.map((item) => {
            item.columnNameCn = item.columnNameCnWithSpace
            // item.dataLength = item.canChangeDataLength ? item.dataLength : undefined
            // item.dataPrecision = item.canChangeDataPrecision ? item.dataPrecision : undefined
        })

        if (rootInfo.datasourceType == 'HIVE') {
            query.tablePartitionMySql = null
            if (rootInfo.tablePartitionAndBucketHive.partitionFlag && !rootInfo.tablePartitionAndBucketHive.partition.columns.length) {
                message.info('请填写分区设置')
                return
            }
            if (rootInfo.tablePartitionAndBucketHive.partitionFlag && rootInfo.tablePartitionAndBucketHive.bucket.partitionFlag) {
                if (!rootInfo.tablePartitionAndBucketHive.bucket.columns.length) {
                    message.info('请填写分桶设置')
                    return
                }
            } else {
                query.tablePartitionAndBucketHive.bucket = null
            }
        } else if (rootInfo.datasourceType == 'MYSQL') {
            query.tablePartitionAndBucketHive = null
            if (rootInfo.tablePartitionMySql.partitionFlag && !rootInfo.tablePartitionMySql.columns.length) {
                message.info('请填写分区设置')
                return
            }
            if (
                rootInfo.tablePartitionMySql.partitionFlag &&
                rootInfo.tablePartitionMySql.subPartitionFuncOutSide.partitionFlag &&
                (rootInfo.tablePartitionMySql.partitionFunc == 2 || rootInfo.tablePartitionMySql.partitionFunc == 3)
            ) {
                if (!rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns.length) {
                    message.info('请填写子分区设置')
                    return
                }
            } else {
                query.tablePartitionMySql.subPartitionFuncOutSide = null
            }
        }

        if (type == 1) {
            query.status = 0
            this.postData(query)
        } else if (type == 2) {
            this.openDdlModal(query)
        } else {
            this.openConfirmModal(query)
        }
    }
    openConfirmModal = (query) => {
        let that = this
        Modal.confirm({
            title: '提示？',
            content: (
                <div>
                    1、提交治理申请后，信息不可修改
                    <br />
                    2、表将移至DGDL列表内
                </div>
            ),
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.postData(query)
            },
        })
    }
    postData = async (query) => {
        if (query.status) {
            this.setState({ loading: true })
        } else {
            this.setState({ saveLoading: true })
        }
        let res = await saveTable(query)
        if (query.status) {
            this.setState({ loading: false })
        } else {
            this.setState({ saveLoading: false })
        }
        if (res.code == 200) {
            if (res.data.saved) {
                message.success('操作成功')
                this.props.addTab('治理表生成')
            } else {
                await this.getRootInfo(res.data)
                let root = 0
                this.state.candidateRoot.map((item) => {
                    if (!item.descWord.length) {
                        root++
                    }
                })
                if (root) {
                    this.setState({
                        popconfirmVisible: true,
                    })
                }
            }
        }
    }
    openDdlModal = async (query) => {
        console.log(query.columnList, 'query.columnList')
        this.setState({ ddlLoading: true })
        let res = await tableDdl(query)
        this.setState({ ddlLoading: false })
        if (res.code == 200) {
            this.setState({
                sqlContent: res.data,
            })
            this.ddlDrawer && this.ddlDrawer.openModal(res.data, 'DDL', query)
        }
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
        let query = {
            from: 'ddl',
            datasourceId: rootInfo.datasourceId,
            datasourceType: rootInfo.datasourceType,
            datasourceNameEn: rootInfo.datasourceNameEn,
        }
        this.props.addTab('词根组合规范', { query: JSON.stringify(query) }, true)
    }
    addData = async () => {
        let { columnData } = this.state
        this.setState({ dragTableLoading: true })
        columnData.push({
            columnNameCn: '',
            columnNameEn: '',
            columnNameEnHtml: '',
            dataType: undefined,
            primaryKey: false,
            nullable: true,
            dataPrecision: undefined,
            dataLength: undefined,
            canEdit: true,
            showDropDown: false,
            tableNameCnData: [],
            rootList: [],
            id: moment().format('X'),
            dataTypeInfo: [],
        })
        await this.setState({
            columnData,
        })
        await this.setState({ dragTableLoading: false })
        this.setColumnEnHtml()
        this.getDataTypes()
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
    getEname = async (type) => {
        const { tableNameCn, tableNameEn, rootInfo, tableNameCnWithSpace, cnameDesc, rootList } = this.state
        let query = {
            cname: tableNameCnWithSpace,
            ename: document.getElementById('tableNameEnHtml').innerText.replace(/\s*/g, ''),
            datasourceId: rootInfo.datasourceId,
            rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
            this.setState({
                cnameDesc: res.data.cnameDesc ? res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') : '暂无词根信息',
                rootList: res.data.rootList,
            })
            if (rootInfo.sourceType == 0 && type !== false) {
                await this.setState({
                    tableNameEn: res.data.ename,
                    tableNameEnHtml: res.data.ename ? `<span>${res.data.ename}&nbsp;</span>` : '',
                })
                this.setTableEnHtml()
            }
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
            if (rootInfo.sourceType == 0) {
                columnData[index].columnNameEn = res.data.ename
                columnData[index].columnNameEnHtml = res.data.ename ? `<span>${res.data.ename}&nbsp;</span>` : ''
            }
            columnData[index].cnameDesc = res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') || '暂无词根信息'
            columnData[index].rootList = res.data.rootList
            await this.setState({
                columnData,
            })
            this.setColumnEnHtml()
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
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    get isRead() {
        return this.pageParam.pageType == 'look'
    }
    cancel = () => {
        this.props.addTab('治理表生成')
    }
    openRootDetailModal = () => {
        let { rootInfo, candidateRoot } = this.state
        this.addRootDrawer && this.addRootDrawer.openModal(candidateRoot)
    }
    onKeyUp = (e) => {
        let editableDiv = document.getElementById('tableNameEnHtml').innerText
        if (editableDiv.replace(/\s*/g, '').length > 127) {
            editableDiv = this.state.tableNameEn
            document.getElementById('tableNameEnHtml').innerHTML = `<span>${editableDiv}&nbsp;</span>`
        } else {
            this.setState({
                tableNameEn: editableDiv.replace(/\s*/g, ''),
            })
        }
    }
    reloadTableType = () => {
        let { rootInfo } = this.state
        rootInfo.groupCode = undefined
        this.setState({
            rootInfo,
        })
        this.getTableTypeList()
    }
    openTypeModal = () => {
        this.tableTypeModal && this.tableTypeModal.openModal()
    }
    renderDropdown = (menu) => {
        return (
            <div style={{ position: 'relative', paddingBottom: 40 }}>
                {menu}
                <a onClick={this.openTypeModal}>
                    <SettingOutlined />
                    类别管理
                </a>
            </div>
        )
    }
    startAlysis = async (data) => {
        let { rootInfo } = this.state
        let query = {
            ...data,
            datasourceId: rootInfo.datasourceId,
            dwLevel: rootInfo.dwLevel,
        }
        this.setState({ spinning: true })
        let res = await parseDDL(query)
        this.setState({ spinning: false })
        if (res.code == 200) {
            if (res.data.parseStatus) {
                res.data.saveParam.datasourceId = query.datasourceId
                res.data.saveParam.sourceType = 1
                res.data.saveParam.ddl = data.ddlInfo
                res.data.saveParam.sqlVocabTxt = data.sqlVocabTxt
                this.getRootInfo(res.data.saveParam)
            } else {
                message.error(res.data.errorMsg)
            }
        }
    }
    renderRootInfo = () => {
        let { candidateRoot } = this.state
        let root = 0
        candidateRoot.map((item) => {
            if (!item.descWord.length) {
                root++
            }
        })
        return (
            <div>
                <div className='renderRootTitle'>
                    <InfoCircleOutlined />
                    请先完善备选词根
                </div>
                <div className='renderRootDesc'>
                    共{candidateRoot.length}个词根，{root}个备选词根信息待完善。
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button type='primary' onClick={this.closeRootInfo}>
                        知道了
                    </Button>
                </div>
            </div>
        )
    }
    closeRootInfo = () => {
        this.setState({
            popconfirmVisible: false,
        })
    }
    replaceRoot = async (data, index) => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, rootList, candidateRoot, tableNameCnWithSpace } = this.state
        let saveParam = {
            columnList: [],
            ...rootInfo,
            rootList,
            tableNameCn: tableNameCnWithSpace,
            tableNameEn,
            status: 1,
            candidateRoot,
        }
        saveParam.columnList = columnData
        saveParam.columnList.map((item) => {
            item.columnNameCn = item.columnNameCnWithSpace
            item.columnNameEn = item.columnNameEnWithHtml
            // item.dataLength = item.canChangeDataLength ? item.dataLength : undefined
            // item.dataPrecision = item.canChangeDataPrecision ? item.dataPrecision : undefined
        })
        let query = {
            saveParam,
            ...data,
        }
        let res = await candidateRootReplace(query)
        if (res.code == 200) {
            message.success('替换成功')
            this.addRootDrawer && this.addRootDrawer.deleteRoot(index)
            this.getRootInfo(res.data)
        }
    }
    setCandidateRoot = (data) => {
        this.setState({
            candidateRoot: [...data],
        })
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
    getTreeData = async () => {
        let res = await catalogDwTree()
        if (res.code == 200) {
            this.setState({
                dwTreeData: this.deleteSubList(res.data),
            })
        }
        let res1 = await dwAnalysisThemeTree()
        if (res1.code == 200) {
            this.setState({
                themeTreeData: this.deleteSubList(res1.data),
            })
        }
    }
    changePartitionInput = (objName, name, e) => {
        let { rootInfo } = this.state
        rootInfo[objName][name] = e.target.value
        this.setState({
            rootInfo,
        })
    }
    onHiveSwitch = (name, e) => {
        let { rootInfo } = this.state
        rootInfo[name].partitionFlag = e
        this.setState({
            rootInfo,
        })
    }
    onChildSwitch = (objName, name, e) => {
        let { rootInfo } = this.state
        rootInfo[objName][name].partitionFlag = e
        this.setState({
            rootInfo,
        })
    }
    changeHivePartition = (objName, name, e, node) => {
        console.log(node, 'changeHivePartition')
        let { rootInfo } = this.state
        rootInfo[objName][name].columns = e
        if (name == 'partition') {
            rootInfo[objName][name].columnWithInfoList = []
            node.map((item) => {
                rootInfo[objName][name].columnWithInfoList.push({
                    columnName: item.props.value,
                    type: item.props.dataType,
                })
            })
        }
        console.log(rootInfo[objName][name].columnWithInfoList, 'rootInfo[objName][name].columnWithInfoList')
        this.setState({
            rootInfo,
        })
    }
    changeSorterPartition = (index, name, e, node) => {
        let { rootInfo } = this.state
        if (name == 'columnName') {
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList[index].columnName = e
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList[index].type = node.props.dataType
        } else {
            rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList[index][name] = e
        }
        this.setState({
            rootInfo,
        })
    }
    deleteSorterData = (index) => {
        let { rootInfo } = this.state
        rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList.splice(index, 1)
        this.setState({
            rootInfo,
        })
    }
    addSorterData = () => {
        let { rootInfo } = this.state
        rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList.push({})
        this.setState({
            rootInfo,
        })
    }
    changeMySqlType = (objName, name, e) => {
        let { rootInfo } = this.state
        if (name == 'partitionFunc') {
            rootInfo[objName][name] = e.target.value
            rootInfo[objName].valueType = e.target.value == 3 ? 1 : 0
            // 重置
            rootInfo.tablePartitionMySql.columns = []
            rootInfo.tablePartitionMySql.exp = undefined
            rootInfo.tablePartitionMySql.partitionCounts = undefined
            rootInfo.tablePartitionMySql.partitionDefs = [{ partitionDefinerAtoms: [{ values: [] }] }]
            rootInfo.tablePartitionMySql.subPartitionFuncOutSide = {
                columns: [],
                partitionFlag: false,
                partitionFunc: 0,
                partitionDefs: [
                    {
                        partitionDefinerAtoms: [{ values: [] }],
                    },
                ],
            }
        }
        this.setState({
            rootInfo,
        })
    }
    changeMySqlPartition = (objName, name, e) => {
        let { rootInfo } = this.state
        rootInfo[objName][name] = e
        this.setState({
            rootInfo,
        })
    }
    changeMySqlSubPartition = (objName, objName1, name, e) => {
        let { rootInfo } = this.state
        rootInfo[objName][objName1][name] = e
        this.setState({
            rootInfo,
        })
    }
    changeSubPartitionInput = (objName, name, e) => {
        let { rootInfo } = this.state
        rootInfo[objName].subPartitionFuncOutSide[name] = e.target.value
        // 重置
        rootInfo[objName].subPartitionFuncOutSide.columns = []
        rootInfo[objName].subPartitionFuncOutSide.exp = undefined
        rootInfo[objName].subPartitionFuncOutSide.partitionCounts = undefined
        rootInfo[objName].subPartitionFuncOutSide.partitionDefs = [{ partitionDefinerAtoms: [{ values: [] }] }]
        this.setState({
            rootInfo,
        })
    }
    deleteDefineData = (index) => {
        let { rootInfo } = this.state
        rootInfo.tablePartitionMySql.partitionDefs.splice(index, 1)
        this.setState({
            rootInfo,
        })
    }
    addDefineData = () => {
        let { rootInfo } = this.state
        rootInfo.tablePartitionMySql.partitionDefs.push({
            partitionDefinerAtoms: [{ values: [] }],
            pUid: '',
        })
        this.setState({
            rootInfo,
        })
    }
    changeDefinePartion = (index, name, e) => {
        let { rootInfo } = this.state
        if (name == 'pUid') {
            rootInfo.tablePartitionMySql.partitionDefs[index][name] = e.target.value
        } else if (name == 'values') {
            if (rootInfo.tablePartitionMySql.partitionFunc == 3) {
                rootInfo.tablePartitionMySql.partitionDefs[index].partitionDefinerAtoms[0][name][0] = e
            } else {
                rootInfo.tablePartitionMySql.partitionDefs[index].partitionDefinerAtoms[0][name] = e
            }
        }
        this.setState({
            rootInfo,
        })
    }
    render() {
        const {
            rootInfo,
            databaseIdList,
            loading,
            saveLoading,
            sourceList,
            baseList,
            columnData,
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
            tableTypeList,
            spinning,
            prefixList,
            popconfirmVisible,
            tableNameEnHtml,
            candidateRoot,
            suffixRootsList,
            dwLevelList,
            themeTreeData,
            dwTreeData,
            expList,
        } = this.state
        let prefixWidth = 0
        if (prefixList.length == 1) {
            prefixWidth = 520
        } else if (prefixList.length == 2) {
            prefixWidth = 256
        } else {
            prefixWidth = 168
        }
        let root = 0
        candidateRoot.map((item) => {
            if (!item.descWord.length) {
                root++
            }
        })

        const isRead = this.isRead
        const isEdit = this.pageParam.pageType == 'edit'
        return (
            <div className='VControlGroup addDdl' style={{ marginBottom: isRead ? 0 : 60 }}>
                <TableLayout
                    disabledDefaultFooter
                    showFooterControl={!isRead}
                    title={isEdit ? '编辑表' : '新增表'}
                    renderDetail={() => {
                        return (
                            <Module title='表设置'>
                                <Form colon={false} className={classNames(isRead ? 'MiniForm Grid4' : 'EditForm')}>
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
                                                          <div>
                                                              <Select
                                                                  allowClear={false}
                                                                  showSearch
                                                                  optionFilterProp='title'
                                                                  style={{ width: 520 }}
                                                                  disabled={isEdit || isRead}
                                                                  onChange={this.changeDatasource}
                                                                  value={rootInfo.datasourceId}
                                                                  placeholder='请选择'
                                                              >
                                                                  {sourceList.map((item) => {
                                                                      return (
                                                                          <Option title={item.dsName} dsType={item.dsType} value={item.id} key={item.id}>
                                                                              {item.dsName}
                                                                          </Option>
                                                                      )
                                                                  })}
                                                              </Select>
                                                              <div className='VControlGroup'>
                                                                  {!dataSourceConfig ? (
                                                                      <Alert
                                                                          showIcon
                                                                          className='configAlert'
                                                                          message={
                                                                              <div>
                                                                                  选择的数据源未配置规范，请先进行配置。
                                                                                  <a onClick={this.openDataSourceConfig}>
                                                                                      配置<span className='iconfont icon-you'></span>
                                                                                  </a>
                                                                              </div>
                                                                          }
                                                                          type='error'
                                                                      />
                                                                  ) : null}
                                                                  {rootInfo.datasourceId && dataSourceConfig ? (
                                                                      <Form layout='inline'>
                                                                          <div className='HControlGroup'>
                                                                              {RenderUtil.renderFormItems([
                                                                                  {
                                                                                      label: '数据源类型',
                                                                                      content: rootInfo.datasourceType,
                                                                                  },
                                                                                  {
                                                                                      label: '词根类别',
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
                                                                  ) : null}
                                                              </div>
                                                          </div>
                                                      ),
                                                  },
                                                  {
                                                      label: '数仓层级',
                                                      required: true,
                                                      hide: !rootInfo.dataWarehouse,
                                                      content: (
                                                          <Select style={{ width: 520 }} placeholder='请选择' onChange={this.changeSelect.bind(this, 'dwLevel')} value={rootInfo.dwLevel}>
                                                              {dwLevelList.map((item) => {
                                                                  return (
                                                                      <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                          {item.name}
                                                                      </Select.Option>
                                                                  )
                                                              })}
                                                          </Select>
                                                      ),
                                                  },
                                                  {
                                                      label: '创建方式',
                                                      required: true,
                                                      content: (
                                                          <div>
                                                              <Radio.Group
                                                                  disabled={!rootInfo.datasourceId || !dataSourceConfig || isRead}
                                                                  value={rootInfo.sourceType}
                                                                  onChange={this.changeSelect.bind(this, 'sourceType')}
                                                              >
                                                                  <Radio value={0}>自定义</Radio>
                                                                  <Radio value={1}>
                                                                      通过解析DDL
                                                                      {rootInfo.sourceType == 1 ? <span onClick={this.openAlysisModal} className='iconfont icon-bianji'></span> : null}
                                                                  </Radio>
                                                              </Radio.Group>
                                                          </div>
                                                      ),
                                                  },
                                                  {
                                                      label: '表分组',
                                                      required: true,
                                                      content: (
                                                          <div>
                                                              <Select
                                                                  style={{ width: 520 }}
                                                                  placeholder='请选择'
                                                                  onChange={this.changeSelect.bind(this, 'groupCode')}
                                                                  value={rootInfo.groupCode}
                                                                  dropdownRender={this.renderDropdown}
                                                                  dropdownClassName='tableTypeDropdown'
                                                              >
                                                                  {tableTypeList.map((item) => {
                                                                      return (
                                                                          <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                              {item.name}
                                                                          </Select.Option>
                                                                      )
                                                                  })}
                                                              </Select>
                                                          </div>
                                                      ),
                                                  },
                                                  {
                                                      label: '表前缀',
                                                      required: true,
                                                      hide: !rootInfo.dataWarehouse,
                                                      content: (
                                                          <div style={{ width: 520 }}>
                                                              {rootInfo.dwLevel == 'app' ? (
                                                                  <Cascader
                                                                      allowClear={false}
                                                                      fieldNames={{ label: 'name', value: 'code' }}
                                                                      options={themeTreeData}
                                                                      value={rootInfo.dwPrefixClassIds}
                                                                      displayRender={(e) => e.join('-')}
                                                                      onChange={this.changeSelect.bind(this, 'dwPrefixClassIds')}
                                                                      popupClassName='searchCascader'
                                                                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                                      placeholder='分析主题'
                                                                  />
                                                              ) : (
                                                                  <Cascader
                                                                      allowClear={false}
                                                                      fieldNames={{ label: 'name', value: 'code' }}
                                                                      options={dwTreeData}
                                                                      value={rootInfo.dwPrefixClassIds}
                                                                      displayRender={(e) => e.join('-')}
                                                                      onChange={this.changeSelect.bind(this, 'dwPrefixClassIds')}
                                                                      popupClassName='searchCascader'
                                                                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                                      placeholder='业务板块-主题域-业务过程'
                                                                  />
                                                              )}
                                                          </div>
                                                      ),
                                                  },
                                                  {
                                                      label: '表后缀',
                                                      hide: !rootInfo.dataWarehouse,
                                                      required: true,
                                                      content: (
                                                          <Select
                                                              disabled={!rootInfo.datasourceId || !dataSourceConfig || isRead}
                                                              style={{ width: 520 }}
                                                              placeholder='请选择'
                                                              onChange={this.changeSelect.bind(this, 'dwSuffixRootId')}
                                                              value={rootInfo.dwSuffixRootId}
                                                          >
                                                              {suffixRootsList.map((item) => {
                                                                  return (
                                                                      <Select.Option title={item.rootName} key={item.id} value={item.id}>
                                                                          {item.rootName}
                                                                      </Select.Option>
                                                                  )
                                                              })}
                                                          </Select>
                                                      ),
                                                  },
                                                  {
                                                      label: '表中文名',
                                                      required: true,
                                                      content: (
                                                          <div style={{ width: 520, position: 'relative' }}>
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
                                              ]
                                    )}
                                </Form>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#5e6266', marginRight: 39 }}>
                                        <span style={{ color: '#f5222d', marginRight: 4 }}>*</span>表英文名
                                    </span>
                                    <span className='ant-input-group-wrapper' style={{ width: 520 }}>
                                        <span className='ant-input-wrapper ant-input-group'>
                                            {rootInfo.prefixEnglishName ? <span className='ant-input-group-addon'>{rootInfo.prefixEnglishName}</span> : null}
                                            <div style={{ position: 'relative' }}>
                                                <div
                                                    id='tableNameEnHtml'
                                                    style={{ maxWidth: 520 }}
                                                    className={!rootInfo.datasourceId || !dataSourceConfig ? 'disabledDiv editableDiv' : 'ant-input editableDiv'}
                                                    contentEditable={!rootInfo.datasourceId || !dataSourceConfig ? 'false' : 'true'}
                                                    onKeyUp={this.onKeyUp}
                                                >
                                                    {tableNameEnHtml}
                                                </div>
                                                {!tableNameEn ? <div className='editableDivPlaceholder'>{rootInfo.sourceType == 1 ? '请输入表英文名' : '完善表中文名，自动匹配表英文名'}</div> : null}
                                            </div>
                                            {rootInfo.suffixEnglishName ? <span className='ant-input-group-addon'>{rootInfo.suffixEnglishName}</span> : null}
                                        </span>
                                    </span>
                                </div>
                            </Module>
                        )
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={loading} type='primary' onClick={this.checkBeforePost.bind(this, 3)}>
                                    治理申请
                                </Button>
                                <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={saveLoading} type='primary' onClick={this.checkBeforePost.bind(this, 1)}>
                                    保存
                                </Button>
                                <Button disabled={!rootInfo.datasourceId || !dataSourceConfig} loading={ddlLoading} type='primary' ghost onClick={this.checkBeforePost.bind(this, 2)}>
                                    生成DDL
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                />
                <Module title='字段设置' className='columnArea'>
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
                                dataSource={Lodash.cloneDeep(columnData)}
                                getSortData={this.getSortData}
                                canMove={true}
                                from='dataTable'
                                // scroll={{ x: 'auto' }}
                            />
                        </ConfigProvider>
                    ) : null}
                    <Button icon={<PlusOutlined />} block disabled={!rootInfo.datasourceId || !dataSourceConfig} onClick={this.addData} type='link'>
                        添加
                    </Button>
                    <Divider style={{ margin: 0 }} />
                </Module>
                {/*rootInfo.datasourceType*/}
                {rootInfo.datasourceType == 'HIVE' ? (
                    <div>
                        <Module
                            style={{ marginBottom: 0 }}
                            title={
                                <React.Fragment>
                                    <span style={{ marginRight: 36 }}>分区设置</span>
                                    <Switch
                                        disabled={!configLimitInfo.enablePartition}
                                        onChange={this.onHiveSwitch.bind(this, 'tablePartitionAndBucketHive')}
                                        checked={rootInfo.tablePartitionAndBucketHive.partitionFlag}
                                    />
                                </React.Fragment>
                            }
                        >
                            {rootInfo.tablePartitionAndBucketHive.partitionFlag ? (
                                <Form colon={false} className='EditForm'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: (
                                                <span>
                                                    分区字段
                                                    <Tooltip title='从已添加的字段中进行选择'>
                                                        <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                                    </Tooltip>
                                                </span>
                                            ),
                                            required: true,
                                            content: (
                                                <div>
                                                    <Select
                                                        style={{ width: 520 }}
                                                        disabled={!configLimitInfo.enablePartition}
                                                        mode='multiple'
                                                        onChange={this.changeHivePartition.bind(this, 'tablePartitionAndBucketHive', 'partition')}
                                                        value={rootInfo.tablePartitionAndBucketHive.partition.columns}
                                                        placeholder='请选择（多选）'
                                                    >
                                                        {columnData.map((item) => {
                                                            return (
                                                                <Option
                                                                    style={{ display: item.columnNameEn && item.dataType ? 'auto' : 'none' }}
                                                                    dataType={item.dataType}
                                                                    value={item.columnNameEn}
                                                                    key={item.columnNameEn}
                                                                >
                                                                    {item.columnNameEn}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </div>
                                            ),
                                        },
                                    ])}
                                </Form>
                            ) : null}
                        </Module>
                        {rootInfo.tablePartitionAndBucketHive.partitionFlag ? (
                            <div>
                                <Divider style={{ margin: '0 20px' }} />
                                <Module
                                    title={
                                        <React.Fragment>
                                            <span style={{ marginRight: 36 }}>分桶设置</span>
                                            <Switch
                                                disabled={!configLimitInfo.enablePartition}
                                                onChange={this.onChildSwitch.bind(this, 'tablePartitionAndBucketHive', 'bucket')}
                                                checked={rootInfo.tablePartitionAndBucketHive.bucket.partitionFlag}
                                            />
                                        </React.Fragment>
                                    }
                                >
                                    {rootInfo.tablePartitionAndBucketHive.bucket.partitionFlag ? (
                                        <Form colon={false} className='EditForm'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: (
                                                        <span>
                                                            分桶字段
                                                            <Tooltip title='从已添加的字段中进行选择'>
                                                                <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                                            </Tooltip>
                                                        </span>
                                                    ),
                                                    required: true,
                                                    content: (
                                                        <div>
                                                            <Select
                                                                style={{ width: 520 }}
                                                                disabled={!configLimitInfo.enablePartition}
                                                                mode='multiple'
                                                                onChange={this.changeHivePartition.bind(this, 'tablePartitionAndBucketHive', 'bucket')}
                                                                value={rootInfo.tablePartitionAndBucketHive.bucket.columns}
                                                                placeholder='请选择（多选）'
                                                            >
                                                                {columnData.map((item) => {
                                                                    return (
                                                                        <Option style={{ display: item.columnNameEn ? 'block' : 'none' }} value={item.columnNameEn} key={item.columnNameEn}>
                                                                            {item.columnNameEn}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    label: '排序字段',
                                                    required: true,
                                                    content: (
                                                        <div>
                                                            {rootInfo.tablePartitionAndBucketHive.bucket.columnWithOrderList.map((item, index) => {
                                                                return (
                                                                    <div>
                                                                        <Select
                                                                            style={{ width: 256, marginRight: 8 }}
                                                                            onChange={this.changeSorterPartition.bind(this, index, 'columnName')}
                                                                            value={item.columnName}
                                                                            placeholder='请选择排序字段'
                                                                        >
                                                                            {columnData.map((item) => {
                                                                                return (
                                                                                    <Option
                                                                                        style={{ display: item.columnNameEn && item.dataType ? 'block' : 'none' }}
                                                                                        dataType={item.dataType}
                                                                                        value={item.columnNameEn}
                                                                                        key={item.columnNameEn}
                                                                                    >
                                                                                        {item.columnNameEn}
                                                                                    </Option>
                                                                                )
                                                                            })}
                                                                        </Select>
                                                                        <Select
                                                                            style={{ width: 256 }}
                                                                            onChange={this.changeSorterPartition.bind(this, index, 'order')}
                                                                            value={item.order}
                                                                            placeholder='排序'
                                                                        >
                                                                            <Option value={0} key={0}>
                                                                                升序
                                                                            </Option>
                                                                            <Option value={1} key={1}>
                                                                                降序
                                                                            </Option>
                                                                        </Select>
                                                                        {index !== 0 ? (
                                                                            <span
                                                                                onClick={this.deleteSorterData.bind(this, index)}
                                                                                style={{ color: '#CC0000', cursor: 'pointer', marginLeft: 20 }}
                                                                                className='iconfont icon-lajitong'
                                                                            ></span>
                                                                        ) : null}
                                                                    </div>
                                                                )
                                                            })}
                                                            <Button icon={<PlusOutlined />} style={{ marginTop: 8, paddingLeft: 0 }} onClick={this.addSorterData} type='link'>
                                                                添加排序
                                                            </Button>
                                                        </div>
                                                    ),
                                                },
                                            ])}
                                        </Form>
                                    ) : null}
                                </Module>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {rootInfo.datasourceType == 'MYSQL' ? (
                    <div>
                        <Module
                            style={{ marginBottom: 0 }}
                            title={
                                <React.Fragment>
                                    <span style={{ marginRight: 36 }}>分区设置</span>
                                    <Switch
                                        disabled={!configLimitInfo.enablePartition}
                                        onChange={this.onHiveSwitch.bind(this, 'tablePartitionMySql')}
                                        checked={rootInfo.tablePartitionMySql.partitionFlag}
                                    />
                                </React.Fragment>
                            }
                        >
                            {rootInfo.tablePartitionMySql.partitionFlag ? (
                                <Form colon={false} className='EditForm'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '分区方式',
                                            required: true,
                                            content: (
                                                <Radio.Group value={rootInfo.tablePartitionMySql.partitionFunc} onChange={this.changeMySqlType.bind(this, 'tablePartitionMySql', 'partitionFunc')}>
                                                    <Radio value={3}>Range</Radio>
                                                    <Radio value={2}>List</Radio>
                                                    <Radio value={0}>Hash</Radio>
                                                    <Radio value={1}>Key</Radio>
                                                </Radio.Group>
                                            ),
                                        },
                                        {
                                            label: (
                                                <span>
                                                    分区字段
                                                    <Tooltip title='从已添加的字段中进行选择'>
                                                        <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                                    </Tooltip>
                                                </span>
                                            ),
                                            required: true,
                                            content: (
                                                <div>
                                                    <Select
                                                        style={{ width: 520 }}
                                                        mode='multiple'
                                                        onChange={this.changeMySqlPartition.bind(this, 'tablePartitionMySql', 'columns')}
                                                        value={rootInfo.tablePartitionMySql.columns}
                                                        placeholder='请选择（多选）'
                                                    >
                                                        {columnData.map((item) => {
                                                            return (
                                                                <Option style={{ display: item.columnNameEn ? 'auto' : 'none' }} value={item.columnNameEn} key={item.columnNameEn}>
                                                                    {item.columnNameEn}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: '分区表达式',
                                            content: (
                                                <Select
                                                    allowClear
                                                    style={{ width: 520 }}
                                                    onChange={this.changeMySqlPartition.bind(this, 'tablePartitionMySql', 'exp')}
                                                    value={rootInfo.tablePartitionMySql.exp}
                                                    placeholder='请选择'
                                                >
                                                    {expList.map((item) => {
                                                        return (
                                                            <Option value={item} key={item}>
                                                                {item}()
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            ),
                                        },
                                        {
                                            label: '分区数量',
                                            required: true,
                                            hide: rootInfo.tablePartitionMySql.partitionFunc == 2 || rootInfo.tablePartitionMySql.partitionFunc == 3,
                                            content: (
                                                <InputNumber
                                                    style={{ width: 256 }}
                                                    value={rootInfo.tablePartitionMySql.partitionCounts}
                                                    onChange={this.changeMySqlPartition.bind(this, 'tablePartitionMySql', 'partitionCounts')}
                                                    placeholder='请输入'
                                                />
                                            ),
                                        },
                                        {
                                            label: '分区边界',
                                            required: true,
                                            hide: rootInfo.tablePartitionMySql.partitionFunc == 0 || rootInfo.tablePartitionMySql.partitionFunc == 1,
                                            content: (
                                                <div>
                                                    {rootInfo.tablePartitionMySql.partitionDefs.map((item, index) => {
                                                        return (
                                                            <div>
                                                                <Input
                                                                    style={{ width: 256, marginRight: 8 }}
                                                                    value={item.pUid}
                                                                    onChange={this.changeDefinePartion.bind(this, index, 'pUid')}
                                                                    placeholder='分区名称'
                                                                />
                                                                {rootInfo.tablePartitionMySql.partitionFunc == 3 ? (
                                                                    <InputNumber
                                                                        style={{ width: 256 }}
                                                                        value={item.partitionDefinerAtoms[0].values[0]}
                                                                        onChange={this.changeDefinePartion.bind(this, index, 'values')}
                                                                        placeholder='边界值'
                                                                    />
                                                                ) : (
                                                                    <Select
                                                                        style={{ width: 256 }}
                                                                        className='tagsSelect'
                                                                        dropdownClassName='hideDropdown'
                                                                        mode='tags'
                                                                        tokenSeparators={[',', '，']}
                                                                        placeholder='边界值'
                                                                        value={item.partitionDefinerAtoms[0].values}
                                                                        onChange={this.changeDefinePartion.bind(this, index, 'values')}
                                                                    ></Select>
                                                                )}
                                                                {index !== 0 ? (
                                                                    <span
                                                                        onClick={this.deleteDefineData.bind(this, index)}
                                                                        style={{ color: '#CC0000', cursor: 'pointer', marginLeft: 20 }}
                                                                        className='iconfont icon-lajitong'
                                                                    ></span>
                                                                ) : null}
                                                            </div>
                                                        )
                                                    })}
                                                    <Button icon={<PlusOutlined />} style={{ marginTop: 8, paddingLeft: 0 }} onClick={this.addDefineData} type='link'>
                                                        添加排序
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                    ])}
                                </Form>
                            ) : null}
                        </Module>
                        {rootInfo.tablePartitionMySql.partitionFlag && (rootInfo.tablePartitionMySql.partitionFunc == 2 || rootInfo.tablePartitionMySql.partitionFunc == 3) ? (
                            <div>
                                <Divider style={{ margin: '0 20px' }} />
                                <Module
                                    title={
                                        <React.Fragment>
                                            <span style={{ marginRight: 36 }}>子分区设置</span>
                                            <Switch
                                                disabled={!configLimitInfo.enablePartition}
                                                onChange={this.changeMySqlSubPartition.bind(this, 'tablePartitionMySql', 'subPartitionFuncOutSide', 'partitionFlag')}
                                                checked={rootInfo.tablePartitionMySql.subPartitionFuncOutSide.partitionFlag}
                                            />
                                        </React.Fragment>
                                    }
                                >
                                    {rootInfo.tablePartitionMySql.subPartitionFuncOutSide.partitionFlag ? (
                                        <Form colon={false} className='EditForm'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '分区方式',
                                                    required: true,
                                                    content: (
                                                        <Radio.Group
                                                            value={rootInfo.tablePartitionMySql.subPartitionFuncOutSide.partitionFunc}
                                                            onChange={this.changeSubPartitionInput.bind(this, 'tablePartitionMySql', 'partitionFunc')}
                                                        >
                                                            <Radio value={0}>Hash</Radio>
                                                            <Radio value={1}>Key</Radio>
                                                        </Radio.Group>
                                                    ),
                                                },
                                                {
                                                    label: (
                                                        <span>
                                                            分区字段
                                                            <Tooltip title='从已添加的字段中进行选择'>
                                                                <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                                            </Tooltip>
                                                        </span>
                                                    ),
                                                    required: true,
                                                    content: (
                                                        <div>
                                                            <Select
                                                                style={{ width: 520 }}
                                                                mode='multiple'
                                                                onChange={this.changeMySqlSubPartition.bind(this, 'tablePartitionMySql', 'subPartitionFuncOutSide', 'columns')}
                                                                value={rootInfo.tablePartitionMySql.subPartitionFuncOutSide.columns}
                                                                placeholder='请选择（多选）'
                                                            >
                                                                {columnData.map((item) => {
                                                                    return (
                                                                        <Option style={{ display: item.columnNameEn ? 'auto' : 'none' }} value={item.columnNameEn} key={item.columnNameEn}>
                                                                            {item.columnNameEn}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    label: '分区表达式',
                                                    content: (
                                                        <Select
                                                            allowClear
                                                            style={{ width: 520 }}
                                                            onChange={this.changeMySqlSubPartition.bind(this, 'tablePartitionMySql', 'subPartitionFuncOutSide', 'exp')}
                                                            value={rootInfo.tablePartitionMySql.subPartitionFuncOutSide.exp}
                                                            placeholder='请选择'
                                                        >
                                                            {expList.map((item) => {
                                                                return (
                                                                    <Option value={item} key={item}>
                                                                        {item}()
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ),
                                                },
                                                {
                                                    label: '分区数量',
                                                    required: true,
                                                    content: (
                                                        <InputNumber
                                                            style={{ width: 256 }}
                                                            value={rootInfo.tablePartitionMySql.subPartitionFuncOutSide.partitionCounts}
                                                            onChange={this.changeMySqlSubPartition.bind(this, 'tablePartitionMySql', 'subPartitionFuncOutSide', 'partitionCounts')}
                                                            placeholder='请输入'
                                                        />
                                                    ),
                                                },
                                            ])}
                                        </Form>
                                    ) : null}
                                </Module>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {rootInfo.datasourceType == 'ORACLE' ? (
                    <div>
                        <Module
                            style={{ marginBottom: 0 }}
                            title={
                                <React.Fragment>
                                    <span style={{ marginRight: 36 }}>分区设置</span>
                                </React.Fragment>
                            }
                        >
                            <div style={{ color: '#5E6266' }}>Oracle类型：分区功能暂未开放，研发中…</div>
                        </Module>
                    </div>
                ) : null}
                {rootInfo.datasourceType !== 'HIVE' && rootInfo.datasourceType !== 'MYSQL' && rootInfo.datasourceType !== 'ORACLE' ? (
                    <Module
                        style={{ marginBottom: 0 }}
                        title={
                            <React.Fragment>
                                <span style={{ marginRight: 36 }}>分区设置</span>
                                <Switch disabled={!configLimitInfo.enablePartition} onChange={this.onSwitch} checked={rootInfo.partitionFlag} />
                            </React.Fragment>
                        }
                    >
                        {rootInfo.partitionFlag ? (
                            <Form colon={false} className='EditForm'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: (
                                            <span>
                                                分区字段
                                                <Tooltip title='从已添加的字段中进行选择'>
                                                    <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                                </Tooltip>
                                            </span>
                                        ),
                                        content: (
                                            <div>
                                                <Select
                                                    style={{ width: 520 }}
                                                    disabled={!configLimitInfo.enablePartition}
                                                    mode='multiple'
                                                    onChange={this.changePartition}
                                                    value={rootInfo.partitionColumnEnames}
                                                    placeholder='请选择（多选）'
                                                >
                                                    {columnData.map((item) => {
                                                        return (
                                                            <Option style={{ display: item.columnNameEn ? 'auto' : 'none' }} value={item.columnNameEn} key={item.columnNameEn}>
                                                                {item.columnNameEn}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </div>
                                        ),
                                    },
                                ])}
                            </Form>
                        ) : null}
                    </Module>
                ) : null}
                {spinning ? <Spin className='largeSpin' size='large' spinning={spinning} tip={rootInfo.sourceType == 1 ? '解析中，请稍等' : ''}></Spin> : null}
                <CodeItemModal
                    ref={(dom) => {
                        this.codeItemModal = dom
                    }}
                    getCodeItem={this.getCodeItem}
                />
                <DdlDrawer ref={(dom) => (this.ddlDrawer = dom)} />
                <TableTypeModal reloadTableType={this.reloadTableType} ref={(dom) => (this.tableTypeModal = dom)} />
                <AlysisDdlDrawer startAlysis={this.startAlysis} ref={(dom) => (this.alysisDdlDrawer = dom)} />
                <ForeignKeyColumnDrawer getForeignKeyData={this.getForeignKeyData} ref={(dom) => (this.foreignKeyColumnDrawer = dom)} />
                <StandardMapDrawer getColumnMapData={this.getColumnMapData} ref={(dom) => (this.standardMapDrawer = dom)} />
                <Popover overlayClassName='renderRoot' placement='left' content={this.renderRootInfo()} visible={popconfirmVisible}>
                    <RootWindow
                        openModal={this.openRootDetailModal}
                        renderNumber={() => {
                            return (
                                <span>
                                    {root}
                                    <span>/{candidateRoot.length}</span>
                                </span>
                            )
                        }}
                    />
                </Popover>
                <Modal wrapClassName={popconfirmVisible ? '' : 'WraphideModal'} visible={popconfirmVisible} className='hideModal'></Modal>
                <AddRootDrawer replaceRoot={this.replaceRoot} setCandidateRoot={this.setCandidateRoot} ref={(dom) => (this.addRootDrawer = dom)} />
                <div className='columnEnHtml' style={{ height: 0, visibility: 'hidden' }}></div>
            </div>
        )
    }
}
