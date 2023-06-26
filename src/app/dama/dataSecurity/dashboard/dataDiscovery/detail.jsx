// 数据分布详情
// 检核规则
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import LevelTag from '@/component/LevelTag'
import ModuleTitle from '@/component/module/ModuleTitle'
import PermissionManage from '@/utils/PermissionManage'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Divider, Form, Input, message, Popconfirm, Popover, Select, Spin, Tooltip } from 'antd'
import { auditListDs, columnConfirmAudit, listAuditColumn, listByDs, listTableByds } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import DatasourceDrawer from '../component/datasourceDrawer'
import PreviewModal from '../component/previewModal'
import TraitRecomandDrawer from '../component/traitRecomandDrawer'
import '../index.less'
import './index.less'

const { Option } = Select
export default class DataDictionary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isTreeSearch: false,
            treeQueryInfo: {
                keyword: '',
            },
            treeData: [],
            treeLoading: false,
            selectedTable: { tableId: this.pageParams.tableId },
            selectedDatasource: { ...this.pageParams },
            showFilter: false,
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            baseList: [],
            total: 0,
            selectedIndex: 0,
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 160,
                render: (text, record) =>
                    text ? (
                        <span className='table-columnName-wrap'>
                            <Tooltip placement='top' title={text}>
                                <span className='table-columnName'>{text}</span>
                            </Tooltip>
                            <Tooltip placement='top' title='样例数据'>
                                <span onClick={this.openPreviewModal.bind(this, record)} style={{ marginLeft: 8, cursor: 'pointer', color: '#5B7FA3' }} className='iconfont icon-yangli'></span>
                            </Tooltip>
                        </span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段中文名',
                dataIndex: 'columnNameDesc',
                key: 'columnNameDesc',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段类型',
                dataIndex: 'columnType',
                key: 'columnType',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <span>{text + (record.dataLength !== undefined && record.dataPre !== null ? '(' + record.dataLength + (record.dataPre ? ',' + record.dataPre : '') + ')' : '')}</span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '特征推荐',
                dataIndex: 'fieldCount',
                key: 'fieldCount',
                width: 280,
                ellipsis: false,
                render: (text, record, index) => {
                    if (record.eigenSelectedInfo.id) {
                        return (
                            <div className='traitArea'>
                                {/*自定义传true*/}
                                <div className='traitContent'>
                                    {/*自定义类名加secondType*/}
                                    {record.eigenSelectedInfo.score ? (
                                        <span className='typeName' onClick={this.openTraitModal.bind(this, record, 1, record.eigenSelectedInfo.score ? false : true, index)}>
                                            {(((record.eigenSelectedInfo.score || 0) * 1).toFixed(2) * 100).toFixed(0)}%
                                        </span>
                                    ) : (
                                        <span className='typeName secondType' onClick={this.openTraitModal.bind(this, record, 1, record.eigenSelectedInfo.score ? false : true, index)}>
                                            自定义
                                        </span>
                                    )}
                                    <LevelTag value={record.eigenSelectedInfo.level} onClick={this.openTraitModal.bind(this, record, 1, record.eigenSelectedInfo.score ? false : true, index)} />
                                    <Popover
                                        content={
                                            <Form className='EditMiniForm Grid1' layout='inline' style={{ rowGap: '12px' }}>
                                                {RenderUtil.renderFormItems([
                                                    {
                                                        label: '特征名',
                                                        content: record.eigenSelectedInfo.eigenName,
                                                    },
                                                    {
                                                        label: '分类路径',
                                                        content: record.eigenSelectedInfo.classPath,
                                                    },
                                                    {
                                                        label: '安全等级',
                                                        content: <LevelTag value={record.eigenSelectedInfo.level} />,
                                                    },
                                                    {
                                                        label: '敏感标签',
                                                        content: record.eigenSelectedInfo.tagName,
                                                    },
                                                ])}
                                            </Form>
                                        }
                                        overlayStyle={{ maxWidth: 400 }}
                                    >
                                        <span onClick={this.openTraitModal.bind(this, record, 1, record.eigenSelectedInfo.score ? false : true, index)}>
                                            {record.eigenSelectedInfo.classPath}/{record.eigenSelectedInfo.eigenName}
                                        </span>
                                    </Popover>
                                </div>
                                <span style={{ fontSize: 14 }} className='iconfont icon-botton_down'></span>
                            </div>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '关联字段',
                dataIndex: 'columnFromLineageCounts',
                key: 'columnFromLineageCounts',
                width: 100,
                render: (text, record) => (text !== undefined ? <span>{text}</span> : <EmptyLabel />),
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '操作',
                fixed: 'right',
                width: 80,
                render: (text, record, index) => {
                    if (PermissionManage.hasFuncPermission('/dama/dataSecurity/dataDiscovery/detail/confirm')) {
                        if (record.columnFromLineageCounts) {
                            return <a onClick={this.openTraitModal.bind(this, record, 2, false, index)}>确认</a>
                        } else {
                            return (
                                <Popconfirm
                                    title={<div style={{ width: 200 }}>是否确认关联特征“{record.eigenSelectedInfo.eigenName}”</div>}
                                    placement='leftTop'
                                    onConfirm={() => {
                                        this.deleteView(record)
                                    }}
                                    okText='确认'
                                    cancelText='取消'
                                >
                                    <a>确认</a>
                                </Popconfirm>
                            )
                        }
                    }
                },
            },
        ]
    }
    componentDidMount = () => {
        this.refresh()
    }
    refresh = async () => {
        await this.getLeftTreeData()
        this.getSearchCondition()
        let { treeData, selectedTable } = this.state
        if (selectedTable.tableId) {
            if (treeData) {
                this.onSelect(treeData.find((item) => item.tableId === selectedTable.tableId) || {})
            }
        } else {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }
    refreshPage = async () => {
        let res = await auditListDs({})
        if (res.code == 200) {
            if (res.data.total) {
                this.refresh()
            } else {
                this.props.addTab('数据发现')
            }
        }
    }
    getSearchCondition = async () => {
        const { selectedDatasource } = this.state
        let query = {
            datasourceId: selectedDatasource.datasourceId,
        }
        let res = await listByDs(query)
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getLeftTreeData = async () => {
        console.log('left tree data')
        let { treeQueryInfo, treeData, selectedTable, selectedDatasource } = this.state
        let query = {
            ...treeQueryInfo,
            datasourceId: selectedDatasource.datasourceId,
            needAll: true,
        }
        this.setState({ treeLoading: true })
        let res = await listTableByds(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            let hasData = false
            res.data.map((item) => {
                if (item.tableId == selectedTable.tableId) {
                    hasData = true
                }
            })
            if (!hasData && (res.data || []).length > 0) {
                await this.onSelectedTable({})
            }
            this.setState({
                treeData: res.data,
            })
        }
    }
    openTraitModal = (data, type, value, index) => {
        let { selectedTable, selectedDatasource } = this.state
        data.tableName = selectedTable.tableName
        data.path = selectedDatasource.datasourceNameCn + '/' + selectedTable.databaseName
        this.traitRecomandDrawer && this.traitRecomandDrawer.openModal(data, type, value)
        this.setState({
            selectedIndex: index,
        })
    }
    getNewTableData = (data) => {
        console.log('getNewTableData', data)
        let { selectedIndex, tableData } = this.state
        for (let k in data) {
            tableData[selectedIndex][k] = data[k]
        }
        this.setState({
            tableData: tableData.concat(),
        })
    }
    openPreviewModal = (data) => {
        this.previewModal && this.previewModal.openModal(data)
    }
    deleteView = async (data) => {
        let query = {
            columnId: data.columnId,
            eigenId: data.eigenSelectedInfo.id,
            lineageColumnIdsWithLvl: [],
        }
        let res = await columnConfirmAudit(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.refreshPage()
        }
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.keyword = e.target.value
        await this.setState({
            treeQueryInfo,
            isTreeSearch: true,
        })
    }
    changeTreeSelect = async (name, e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo[name] = e
        await this.setState({
            treeQueryInfo,
            isTreeSearch: true,
        })
        this.treeSearch()
    }
    treeSearch = async () => {
        let { treeQueryInfo } = this.state
        document.querySelector('.tableArea').scrollTop = 0
        await this.setState({
            treeQueryInfo,
            treeData: [],
        })
        await this.getLeftTreeData()
        let { treeData, selectedTable } = this.state
        if (!selectedTable.tableId) {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }
    onSelect = (data) => {
        this.onSelectedTable(data)
    }
    onSelectedTable = async (data) => {
        await this.setState({
            selectedTable: { ...data },
        })
        const { treeData } = this.state
        if (data.tableId || treeData.length <= 0) {
            this.reset()
        }
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
    search = () => {
        console.log('controller reset')
        if (this.controller) {
            this.controller.reset()
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTable } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            tableId: selectedTable.tableId,
        }
        if (!selectedTable.tableId) return
        let res = await listAuditColumn(query)
        if (res.code == 200) {
            res.data.list.map((item) => {
                item.eigenVoList = item.eigenVoList ? item.eigenVoList : []
                item.eigenSelectedInfo = {}
                if (item.eigenVoList.length) {
                    for (let k in item.eigenVoList[0]) {
                        item.eigenSelectedInfo[k] = item.eigenVoList[0][k]
                    }
                }
                item.eigenSelectedInfo.classIdList = []
            })
            this.setState({
                tableData: res.data.list,
                total: res.data.total,
            })
            return {
                total: res.data.total,
                dataSource: res.data.list,
            }
        } else {
            this.setState({
                total: (res.data || {}).total || 0,
            })
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
    openTableDrawer = () => {
        this.datasourceDrawer && this.datasourceDrawer.openModal(this.state.selectedDatasource)
    }
    getSelectedData = async (data) => {
        await this.setState({
            selectedDatasource: { ...data },
        })
        this.refresh()
    }
    render() {
        const { queryInfo, tableData, selectedTable, selectedDatasource, baseList, treeData, treeLoading, treeQueryInfo, showFilter, total } = this.state
        return (
            <div className='dataDistributionDetail distributionTableDrawer'>
                <div className='sliderLayout' ref={(target) => (this.layout = target)}>
                    <div className='slider'>
                        <div className='leftHeader'>
                            <div className='headerTitle'>
                                <span onClick={this.openTableDrawer}>{selectedDatasource.datasourceNameCn}</span>
                                <span onClick={this.openTableDrawer} className='iconfont icon-botton_down'></span>
                            </div>
                        </div>
                        <div className='HideScroll tableArea'>
                            <div>
                                <div className='searchGroup'>
                                    <Input.Search
                                        prefix={<IconFont type='icon-search' />}
                                        onSearch={this.treeSearch}
                                        value={treeQueryInfo.keyword}
                                        onChange={this.changeTreeKeyword}
                                        placeholder='输入表名，回车搜索'
                                    />
                                    <span className={showFilter ? 'showFilter filterIcon' : 'filterIcon'}>
                                        <span onClick={() => this.setState({ showFilter: !showFilter })} className='iconfont icon-Filter'></span>
                                        {treeQueryInfo.databaseId ? <span className='statusDot'></span> : null}
                                    </span>
                                    {showFilter ? (
                                        <div style={{ marginTop: 8 }}>
                                            <Select
                                                allowClear
                                                showSearch
                                                optionFilterProp='title'
                                                onChange={this.changeTreeSelect.bind(this, 'databaseId')}
                                                value={treeQueryInfo.databaseId}
                                                placeholder='选择库'
                                                style={{ width: '100%' }}
                                            >
                                                {baseList.map((item) => {
                                                    return (
                                                        <Option title={item.name} value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    ) : null}
                                </div>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ? (
                                        <div>
                                            {treeData.map((item) => {
                                                return (
                                                    <div onClick={this.onSelect.bind(this, item)} className={selectedTable.tableId == item.tableId ? 'tableItem tableItemSelected' : 'tableItem'}>
                                                        <div>
                                                            <span className='treeName'>
                                                                <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-biao1'></span>
                                                                {item.tableName}
                                                            </span>
                                                            <span className='treeCount'>{item.columnToAuditCount || 0}</span>
                                                        </div>
                                                        <div style={{ color: '#5E6266' }}>
                                                            <span className='treeName'>
                                                                <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-ku'></span>
                                                                {item.databaseName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: 80, textAlign: 'center', color: '#C4C8CC' }}>- 暂无数据 -</div>
                                    )}
                                </Spin>
                            </div>
                        </div>
                        <DatasourceDrawer getContainer={() => this.layout} getSelectedData={this.getSelectedData} ref={(dom) => (this.datasourceDrawer = dom)} />
                    </div>
                    <main>
                        <div className='ContentContainer'>
                            <div className='tableContent commonScroll'>
                                <div className='titleArea'>
                                    <div className='titleValue'>
                                        {selectedTable.tableName || <EmptyLabel />} {selectedTable.tableNameDesc ? `[${selectedTable.tableNameDesc}]` : ''}
                                    </div>
                                    <div className='titleInfo'>
                                        <span>
                                            所属库<span>{selectedTable.databaseName || <EmptyLabel />}</span>
                                        </span>
                                        <span>
                                            字段数量<span>{selectedTable.physicalColumnCount || 0}</span>
                                        </span>
                                        <span>
                                            识别待确认数<span>{total || 0}</span>
                                        </span>
                                    </div>
                                </div>
                                <Divider />
                                <ModuleTitle style={{ marginBottom: 20 }} title='字段详情' />
                                <RichTableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    editColumnProps={{
                                        hidden: true,
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'columnId',
                                        dataSource: tableData,
                                        extraTableProps: {
                                            scroll: {
                                                x: 1300,
                                            },
                                        },
                                    }}
                                    renderSearch={(controller) => {
                                        this.controller = controller
                                        return (
                                            <React.Fragment>
                                                <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索字段' />
                                            </React.Fragment>
                                        )
                                    }}
                                    requestListFunction={(page, pageSize, filter, sorter) => {
                                        return this.getTableList({
                                            pagination: {
                                                page,
                                                page_size: pageSize,
                                            },
                                            sorter: sorter || {},
                                        })
                                    }}
                                />
                                <PreviewModal ref={(dom) => (this.previewModal = dom)} />
                                <TraitRecomandDrawer getNewTableData={this.getNewTableData} refresh={this.refreshPage} ref={(dom) => (this.traitRecomandDrawer = dom)} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}
