import ForeignKeyColumnDrawer from '@/app/datamodeling/dgdl/comonpent/foreignKeyColumnDrawer'
import AutoTip from '@/component/AutoTip'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Checkbox, Form, Input, message, Select, Table, Tooltip } from 'antd'
import { dicField, dicFieldRefresh, dicTableInfo, dicTableOverview, dicWordSpecs, saveDicField, saveDicTable } from 'app_api/standardApi'
import Lodash from 'lodash'
import React, { Component } from 'react'
import AddDdRootDrawer from './addRootDrawer'
import './index.less'

const { Option } = Select

export default class DataDicDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailInfo: { ...this.pageParams },
            saveLoading: false,
            loading: false,
            searchTableData: [
                { fieldId: 1, pkInfo: {}, ensureFlag: false },
                { fieldId: 2, pkInfo: {}, ensureFlag: true },
            ],
            tableData: [
                { fieldId: 1, pkInfo: {} },
                { fieldId: 2, pkInfo: {}, ensureFlag: true },
            ],
            tableDataSnapshot: [],
            queryInfo: {
                keyword: '',
            },
            dataTypeList: [],
            selectedIndex: 0,
            tableOverview: {},
            tableInfo: {},
            tableLoading: false,
            zhongwen: '',
            guifan: '',
        }
        this.columns = [
            {
                title: '原字段名',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: 200,
                render: (text) => (text ? <AutoTip toolTipClassName='hightlight_tooltip' content={text} /> : <EmptyLabel />),
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: 160,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + record.fieldPrecision}>
                            <span>
                                {text}
                                {record.fieldPrecision}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'pkType',
                key: 'pkType',
                title: '主键',
                width: 100,
                render: (text, record, index) => {
                    // 不动原逻辑，拿拷贝的源数据去比较
                    const _record = this.tableDataCopy[index] || {}
                    return (
                        <div>
                            <Checkbox disabled={text == 2} checked={text == 2 || text == 3} onChange={this.changeTableCn.bind(this, index, 'pkType')} />
                            {/* {!record.ensureFlag && record.pkType == 3 ? <Tooltip title="系统推荐"><IconFont style={{marginLeft: 8}} type="icon-jian1"></IconFont></Tooltip> : null} */}
                            {!_record.ensureFlag && _record.pkType == 3 ? (
                                <Tooltip title='系统推荐'>
                                    <IconFont style={{ marginLeft: 8 }} type='icon-jian1'></IconFont>
                                </Tooltip>
                            ) : null}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'fkType',
                key: 'fkType',
                title: '外键',
                width: 100,
                render: (text, record, index) => {
                    // 不动原逻辑，拿拷贝的源数据去比较
                    const _record = this.tableDataCopy[index] || {}
                    return (
                        <div>
                            {/* {!record.ensureFlag && record.fkType == 3 ? <Tooltip title="系统推荐"><IconFont style={{marginRight: 8}} type="icon-jian2"></IconFont></Tooltip> : null} */}
                            {!_record.ensureFlag && _record.fkType == 3 ? (
                                <Tooltip title='系统推荐'>
                                    <IconFont style={{ marginRight: 8 }} type='icon-jian2'></IconFont>
                                </Tooltip>
                            ) : null}
                            <Checkbox disabled={text == 2} checked={text == 2 || text == 3} onChange={this.changeTableCn.bind(this, index, 'fkType')} />
                            <Tooltip title={'外键：' + record.pkInfo.databaseName + '/' + record.pkInfo.tableEName + '/' + record.pkInfo.fieldEName}>
                                {text == 2 || text == 3 ? <IconFont style={{ marginLeft: 8 }} onClick={this.openForeignKeyModal.bind(this, index)} className='foreignKey' type='icon-waijian' /> : null}
                            </Tooltip>
                        </div>
                    )
                },
            },
            {
                dataIndex: 'partitionFlag',
                key: 'partitionFlag',
                title: '分区',
                width: 100,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Checkbox disabled checked={text} onChange={this.changeTableCn.bind(this, index, 'partitionFlag')} />
                            {record.partitionFlag && (
                                <Tooltip title={`分区格式：${record.partitionFormat || ''}`}>
                                    <IconFont type='icon-fenqu1' style={{ marginLeft: 8, cursor: 'pointer' }} />
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
            {
                dataIndex: 'fieldNameDesc',
                key: 'fieldNameDesc',
                title: '字段中文名',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div className={!record.ensureFlag && record.fieldNameDescSource == 1 ? 'iconInput' : ''}>
                            {!record.ensureFlag && record.fieldNameDescSource == 1 ? (
                                <Tooltip title='系统推荐'>
                                    <IconFont type='icon-jian1'></IconFont>
                                </Tooltip>
                            ) : null}
                            <Input placeholder='请输入' value={text} onBlur={this.onCnBlur.bind(this, index)} onChange={this.changeTableCn.bind(this, index, 'fieldNameDesc')} />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'fieldNameSpecs',
                key: 'fieldNameSpecs',
                title: '字段英文名',
                width: 200,
                render: (text, record, index) => {
                    let placeholder = ''
                    if (record.fieldNameSpecsType == 1) {
                        placeholder = text ? '' : '待补充中文信息'
                    } else if (record.fieldNameSpecsType == 2) {
                        placeholder = ''
                    } else if (record.fieldNameSpecsType == 3) {
                        placeholder = ''
                    } else if (record.fieldNameSpecsType == 4) {
                        placeholder = '原字段已规范'
                    }
                    return (
                        <div
                            className={
                                record.fieldNameSpecsType == 2 || record.fieldNameSpecsType == 4 ? 'enameInput successInput' : record.fieldNameSpecsType == 3 ? 'enameInput errorInput' : 'enameInput'
                            }
                        >
                            {text && record.fieldNameSpecsType !== 4 ? <div className='ename' dangerouslySetInnerHTML={{ __html: text }}></div> : null}
                            <Input disabled placeholder={placeholder} />
                        </div>
                    )
                },
            },
        ]
        //
        this.tableDataCopy = []
    }
    componentDidMount = async () => {
        if (!this.pageParams.isOpenSpecs) {
            this.columns.splice(6, 1)
        }
        this.getTableData()
        this.getDetailInfo()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getDetailInfo = async () => {
        let res = await dicTableOverview({ id: this.pageParams.tableId })
        if (res.code == 200) {
            this.setState({
                tableOverview: res.data,
            })
        }
        let res1 = await dicTableInfo({ id: this.pageParams.tableId })
        if (res1.code == 200) {
            this.setState({
                tableInfo: res1.data,
            })
        }
    }
    renderTitle(name) {
        let { tableInfo } = this.state
        return (
            <div>
                <span>{name}</span>
                <span style={{ position: 'absolute', right: '16px', fontSize: '14px', fontFamily: 'PingFangSC-Regular, PingFang SC', fontWeight: '400' }}>
                    <span style={{ margin: '0 8px 0 0', color: '#9EA3A8' }}>系统路径</span>
                    <span>
                        {tableInfo.datasourceName}/{tableInfo.databaseName}
                    </span>
                    <span style={{ margin: '0 8px 0 24px', color: '#9EA3A8' }}>数据库类型</span>
                    <span>{tableInfo.datasourceType || <EmptyLabel />}</span>
                </span>
            </div>
        )
    }
    saveData = async (value) => {
        let { detailInfo, tableInfo, tableData, tableDataSnapshot } = this.state
        // let hasError = false
        // tableData.map((item) => {
        //     if (item.fieldNameSpecsType == 3) {
        //         hasError = true
        //     }
        // })
        // if (hasError && this.pageParams.isOpenSpecs) {
        //     message.info('存在不规范英文名')
        //     return
        // }
        let query = {
            tableCName: tableInfo.tableCName,
            tableId: detailInfo.tableId,
        }
        if (value) {
            this.setState({ loading: true })
        } else {
            this.setState({ saveLoading: true })
        }
        let res = await saveDicTable(query)
        if (res.code == 200) {
            let query1 = {
                dicFieldSaveInfoList: tableData,
                dicTableFieldSnapshot: tableDataSnapshot,
                isSpecsSave: this.pageParams.isOpenSpecs,
                tableId: detailInfo.tableId,
            }
            saveDicField(query1).then((resp) => {
                if (resp.code == 200) {
                    message.success('保存成功')
                    // 保存成功后，刷新列表
                    this.getTableData()
                    if (value) {
                        this.cancel()
                    }
                }
            })
        }
        if (value) {
            this.setState({ loading: false })
        } else {
            this.setState({ saveLoading: false })
        }
    }
    cancel = () => {
        this.props.addTab('数据字典')
    }
    changeInput = (name, e) => {
        let { tableInfo } = this.state
        tableInfo[name] = e.target.value
        this.setState({
            tableInfo,
        })
    }
    openRootModal = () => {
        let { tableData } = this.state
        let data = []
        tableData.map((item) => {
            if (item.fieldNameSpecsType == 3) {
                data.push({
                    rootName: '',
                    descWord: this.getDescList(item.fieldNameSpecs),
                    fieldName: item.fieldName,
                    rootType: this.pageParams.rootCategory !== 'prefixsuffix' ? 'unknown' : undefined,
                    rootTypeName: this.pageParams.rootCategory !== 'prefixsuffix' ? '未知' : '',
                    status: 1,
                })
            }
        })
        //console.log(data,'getDescList+++')
        this.addDdRootDrawer && this.addDdRootDrawer.openModal(data, this.pageParams.rootCategory, this.pageParams.rootCategoryName)
    }
    getDescList = (value) => {
        let data = []
        if (value) {
            let array = value.split('_')
            array.map((item) => {
                //console.log(item.indexOf('>'),'item.indexOf')
                if (item.indexOf('>') >= 0 && item.indexOf('<') >= 0) {
                    let name = item.substring(24, item.length - 7)
                    //console.log(name,'item.indexOf')
                    if (data.length) {
                        if (!data.includes(name)) {
                            data.push(name)
                        }
                    } else {
                        data.push(name)
                    }
                }
            })
        }
        return data
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
    changeStatus = async (name, e) => {
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
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getTableData = async () => {
        let query = {
            datasourceId: this.pageParams.datasourceId,
            tableId: this.pageParams.tableId,
            isOpenSpecs: this.pageParams.isOpenSpecs,
        }
        this.setState({ tableLoading: true })
        let res = await dicField(query)
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            let tableDataSnapshot = JSON.parse(JSON.stringify(res.data))
            this.tableDataCopy = JSON.parse(JSON.stringify(res.data))
            let dataTypeList = []
            res.data.map((item) => {
                item.pkInfo = item.pkInfo ? item.pkInfo : {}
                item.pkAndFkFlag = (item.pkType == 3 || item.pkType == 2) && (item.fkType == 3 || item.fkType == 2) ? true : false
                if (dataTypeList.length) {
                    if (!dataTypeList.includes(item.fieldType)) {
                        dataTypeList.push(item.fieldType)
                    }
                } else {
                    dataTypeList.push(item.fieldType)
                }
            })
            // 计算中文完整度，命名规范率
            const zhongwenArr = res.data.filter((v) => v.fieldNameDesc)
            const guifanArr = res.data.filter((v) => v.fieldNameSpecsType == 2 || v.fieldNameSpecsType == 4)

            function percen(number, total) {
                if (total == 0) return '0.00%'
                return ((number / total) * 100).toFixed(2) + '%'
            }
            this.setState({
                tableData: res.data,
                searchTableData: res.data,
                tableDataSnapshot,
                dataTypeList,
                zhongwen: percen(zhongwenArr.length, res.data.length),
                guifan: percen(guifanArr.length, res.data.length),
            })
        }
    }
    search = () => {
        let { queryInfo, tableData } = this.state
        let array = []
        tableData.map((item) => {
            if (item.fieldName.includes(queryInfo.keyword)) {
                array.push(item)
            }
        })
        //console.log(array, 'array+++++')
        let array1 = []
        if (queryInfo.dataType) {
            array.map((item) => {
                if (queryInfo.dataType == item.fieldType) {
                    array1.push(item)
                }
            })
        } else {
            array1 = [...array]
        }
        //console.log(array1, 'array1+++++')
        this.setState({
            searchTableData: array1,
            queryInfo,
        })
    }
    onCnBlur = async (index, e) => {
        let { tableData, searchTableData, tableDataSnapshot } = this.state
        if (!searchTableData[index].fieldNameDesc && searchTableData[index].fieldNameSpecsType !== 4 && this.pageParams.isOpenSpecs) {
            searchTableData[index].fieldNameSpecs = ''
            searchTableData[index].fieldNameSpecsType = 1
        }
        tableDataSnapshot.map((item) => {
            if (item.fieldId == searchTableData[index].fieldId && item.fieldNameDesc !== searchTableData[index].fieldNameDesc) {
                searchTableData[index].fieldNameDescSource = 2
            }
        })
        tableData.map((item) => {
            if (item.fieldId == searchTableData[index].fieldId) {
                item = { ...searchTableData[index] }
            }
        })
        this.setState({
            searchTableData: searchTableData.concat(),
            tableData,
        })
        if (!searchTableData[index].fieldNameDesc || searchTableData[index].fieldNameSpecsType == 4 || !this.pageParams.isOpenSpecs) {
            return
        }
        let query = {
            word: searchTableData[index].fieldNameDesc,
            dsId: this.pageParams.datasourceId,
        }
        let res = await dicWordSpecs(query)
        if (res.code == 200) {
            searchTableData[index].fieldNameSpecs = res.data.fieldNameSpecsDesc
            searchTableData[index].fieldNameSpecsType = res.data.fieldNameSpecsDescType
            tableData.map((item) => {
                if (item.fieldId == searchTableData[index].fieldId) {
                    item = { ...searchTableData[index] }
                }
            })
            //console.log(searchTableData[index], 'searchTableData')
            this.setState({
                searchTableData: searchTableData.concat(),
                tableData,
            })
        }
    }
    changeTableCn = (index, name, e, node) => {
        let { tableData, searchTableData } = this.state
        //console.log('changeTableCn', tableData, searchTableData);
        if (name == 'fieldNameDesc') {
            searchTableData[index][name] = e.target.value
        } else if (name == 'pkType') {
            searchTableData[index][name] = e.target.checked ? 3 : 1
            // searchTableData[index].fkType = e.target.checked ? 1 : searchTableData[index].fkType
            searchTableData[index].pkAndFkFlag = searchTableData[index].pkType == 3 && (searchTableData[index].fkType == 3 || searchTableData[index].fkType == 2) ? true : false
        } else if (name == 'fkType') {
            if (e.target.checked && !searchTableData[index].pkInfo.fieldId) {
                this.openForeignKeyModal(index)
            } else {
                searchTableData[index][name] = e.target.checked ? 3 : 1
                // searchTableData[index].pkType = e.target.checked ? 1 : searchTableData[index].pkType
                searchTableData[index].pkAndFkFlag = (searchTableData[index].pkType == 3 || searchTableData[index].pkType == 2) && searchTableData[index].fkType == 3 ? true : false
            }
        } else {
            searchTableData[index][name] = e.target.checked
        }
        tableData.map((item) => {
            if (item.fieldId == searchTableData[index].fieldId) {
                item = { ...searchTableData[index] }
            }
        })
        this.setState({
            searchTableData: searchTableData.concat(),
            tableData,
        })
    }
    openForeignKeyModal = (index) => {
        let { searchTableData, detailInfo } = this.state
        if (searchTableData[index].fkType == 2) {
            return
        }
        let data = []
        if (searchTableData[index].pkInfo.fieldId) {
            data = [searchTableData[index].pkInfo.databaseId, searchTableData[index].pkInfo.tableId, searchTableData[index].pkInfo.fieldId]
        }
        this.foreignKeyColumnDrawer && this.foreignKeyColumnDrawer.openModal(data, detailInfo.datasourceId)
        this.setState({
            selectedIndex: index,
        })
    }
    getForeignKeyData = (data) => {
        let { tableData, searchTableData, selectedIndex } = this.state
        searchTableData[selectedIndex].pkInfo.databaseId = data[0].id
        searchTableData[selectedIndex].pkInfo.databaseName = data[0].name
        searchTableData[selectedIndex].pkInfo.tableId = data[1].id
        searchTableData[selectedIndex].pkInfo.tableEName = data[1].name
        searchTableData[selectedIndex].pkInfo.fieldId = data[2].id
        searchTableData[selectedIndex].pkInfo.fieldEName = data[2].name
        searchTableData[selectedIndex].fkType = 3
        // searchTableData[selectedIndex].pkType = 1
        searchTableData[selectedIndex].pkAndFkFlag = (searchTableData[selectedIndex].pkType == 3 || searchTableData[selectedIndex].pkType == 2) ? true : false
        tableData.map((item) => {
            if (item.fieldId == searchTableData[selectedIndex].fieldId) {
                item = { ...searchTableData[selectedIndex] }
            }
        })
        this.setState({
            searchTableData,
            tableData,
        })
    }
    getNewTable = async () => {
        let { tableData } = this.state
        let query = {
            datasourceId: this.pageParams.datasourceId,
            dicTableFieldSnapshot: tableData,
        }
        this.setState({ tableLoading: true })
        let res = await dicFieldRefresh(query)
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.pkInfo = item.pkInfo ? item.pkInfo : {}
            })
            this.setState({
                tableData: res.data,
                searchTableData: res.data,
            })
        }
    }
    render() {
        let { detailInfo, loading, saveLoading, searchTableData, dataTypeList, queryInfo, tableOverview, tableInfo, tableLoading, zhongwen, guifan } = this.state
        //console.log('searchTableData', searchTableData);
        return (
            <div className='dataDictionary dataDicDetail'>
                <TableLayout
                    disabledDefaultFooter
                    showFooterControl={true}
                    title={this.renderTitle(tableInfo.tableEName)}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={loading} type='primary' onClick={this.saveData.bind(this, 1)}>
                                    保存并退出
                                </Button>
                                <Button loading={saveLoading} type='primary' onClick={this.saveData.bind(this, 0)}>
                                    仅保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <div>
                                <div className='tableInfo' style={{ marginTop: 0 }}>
                                    <ModuleTitle title='数据概览' />
                                    <div className='statics HideScroll'>
                                        <div>
                                            <span className='iconfont icon-ziduan2'></span>
                                            <span className='label'>字段数</span>
                                            <span className='value'>{ProjectUtil.formNumber(tableOverview.fieldCount || 0)}</span>
                                        </div>
                                        <div>
                                            <span className='iconfont icon-zhujian1'></span>
                                            <span className='label'>主键数</span>
                                            <span className='value'>{ProjectUtil.formNumber(tableOverview.pkCount || 0)}</span>
                                        </div>
                                        <div>
                                            <span className='iconfont icon-guifan'></span>
                                            <span className='label'>外键数</span>
                                            <span className='value'>{ProjectUtil.formNumber(tableOverview.fkCount || 0)}</span>
                                        </div>
                                        <div>
                                            <span className='iconfont icon-fenqu'></span>
                                            <span className='label'>分区数</span>
                                            <span className='value'>{ProjectUtil.formNumber(tableOverview.partitionCount || 0)}</span>
                                        </div>
                                        <div>
                                            <span className='iconfont icon-zhongwenming'></span>
                                            <span className='label'>中文完整度</span>
                                            <span className='value'>{zhongwen || <EmptyLabel />}</span>
                                        </div>
                                        <div>
                                            <span className='iconfont icon-guifan'></span>
                                            <span className='label'>命名规范率</span>
                                            <span className='value'>{guifan || <EmptyLabel />}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='tableInfo'>
                                    <ModuleTitle title='表中文名' />
                                    <Form className='EditMiniForm Grid1'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '表英文名',
                                                content: <Input disabled placeholder='请输入' value={tableInfo.tableEName} />,
                                            },
                                            {
                                                label: '表中文名',
                                                content: (
                                                    <div>
                                                        <Input
                                                            maxLength={128}
                                                            style={{ marginRight: 16 }}
                                                            placeholder='请输入'
                                                            value={tableInfo.tableCName}
                                                            onChange={this.changeInput.bind(this, 'tableCName')}
                                                        />
                                                        {!tableInfo.tableCName ? <StatusLabel type='originWarning' message='建议补充表中文名' /> : null}
                                                    </div>
                                                ),
                                            },
                                        ])}
                                    </Form>
                                </div>
                                <div className='tableInfo'>
                                    <ModuleTitle title='字段详情' />
                                    {this.pageParams.isOpenSpecs ? (
                                        <Alert
                                            showIcon
                                            className='configAlert'
                                            message={
                                                <div>
                                                    编辑中文名生成规范化英文名。若生成的英文名不规范，需手动添加词根。
                                                    <a onClick={this.openRootModal}>
                                                        添加词根<span className='iconfont icon-you'></span>
                                                    </a>
                                                </div>
                                            }
                                            type='warning'
                                        />
                                    ) : null}
                                    <div style={{ marginBottom: 16 }}>
                                        <Input.Search
                                            allowClear
                                            style={{ width: 280, marginRight: 8 }}
                                            value={queryInfo.keyword}
                                            onChange={this.changeKeyword}
                                            onSearch={this.search}
                                            placeholder='请输入字段名'
                                        />
                                        <Select allowClear onChange={this.changeStatus.bind(this, 'dataType')} value={queryInfo.dataType} placeholder='字段类型' style={{ width: 160, marginRight: 8 }}>
                                            {dataTypeList.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item}>
                                                        {item}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <Button onClick={this.reset}>重置</Button>
                                    </div>
                                    <Table loading={tableLoading} columns={this.columns} dataSource={Lodash.cloneDeep(searchTableData)} rowKey='fieldId' pagination={false} scroll={{ y: 500 }} />
                                </div>
                                <ForeignKeyColumnDrawer type={0} getForeignKeyData={this.getForeignKeyData} ref={(dom) => (this.foreignKeyColumnDrawer = dom)} />
                                <AddDdRootDrawer getNewTable={this.getNewTable} ref={(dom) => (this.addDdRootDrawer = dom)} />
                            </div>
                        )
                    }}
                />
            </div>
        )
    }
}
