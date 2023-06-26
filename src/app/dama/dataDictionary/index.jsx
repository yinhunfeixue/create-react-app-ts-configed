// 检核规则
import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Cascader, Empty, Input, message, Popconfirm, Popover, Progress, Select, Spin, Switch, Tooltip } from 'antd'
import { databaseList } from 'app_api/examinationApi'
import { dsspecification } from 'app_api/metadataApi'
import { dicDsInfo, dicDsList, dicDsOverview, dicDsTable, specSwitch, specSwitchOpera } from 'app_api/standardApi'
import { getTree } from 'app_api/systemManage'
import React, { Component } from 'react'
import './index.less'
const { Option } = Select

const storageKey = 'data-directory'
let init = true
const setStorage = (value) => {
    sessionStorage.setItem(storageKey, JSON.stringify(value))
}
const getStorage = () => {
    let s = {}
    try {
        s = JSON.parse(sessionStorage.getItem(storageKey) || '{}')
    } catch (err) {
        s = {}
    }
    return s
}

function filterOption(data, open) {
    const _data = [...data]
    if (open) return _data
    return _data.filter((v) => v.dataIndex !== 'nameStandardDegree')
}

export default class DataDictionary extends Component {
    constructor(props) {
        super(props)
        const storage = getStorage() || {}
        this.state = {
            isTreeSearch: false,
            treeQueryInfo: {
                datasourceName: '',
                indexma: [0],
            },
            treeData: [],
            queryInfo: {
                tableNameKeyWord: '',
            },
            treeLoading: false,
            selectedTable: storage.selectedTable || {},
            dsInfo: {},
            dsOverview: {},
            tableData: [],
            showFilter: false,
            datasourceIds: [],
            datasourceInfo: [],
            databaseList: [],
            indexmaList: ['中文完整度', '主键存在率', '命名规范率'],
            typeList: [],
            total: 0,
            dataSourceConfig: false,
            logModalVisible: false,
            logList: [],
            successTableCount: 0,
            failedTableCount: 0,

            resultTabValue: '1',
            scrolled: false,
            showScrollBtn: false,
            switchLoading: false,
        }
        this.columns = [
            {
                title: '表名',
                dataIndex: 'tableEnName',
                key: 'tableEnName',
                width: 200,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                            <br />
                            <span>{record.tableChnName}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseEnName',
                key: 'databaseEnName',
                width: 160,
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
                title: '字段数量',
                dataIndex: 'colNum',
                key: 'colNum',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '中文完整度',
                sorter: true,
                dataIndex: 'cNameCompletedDegree',
                key: 'cNameCompletedDegree',
                width: 130,
                render: (text, record) => (text !== undefined ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '命名规范度',
                sorter: true,
                dataIndex: 'nameStandardDegree',
                key: 'nameStandardDegree',
                width: 130,
                render: (text, record) => (text !== undefined ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '主键状态',
                sorter: true,
                dataIndex: 'primaryKeyState',
                key: 'primaryKeyState',
                width: 110,
                render: (text, record) => (text !== undefined ? <span>{text ? '存在' : '缺失'}</span> : <EmptyLabel />),
            },
            {
                title: '分区表',
                dataIndex: 'partitionState',
                key: 'partitionState',
                width: 80,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{text ? '是' : '否'}</span> : <EmptyLabel />),
            },
            {
                title: '待确认中文数',
                dataIndex: 'waitConfirmChineseNameNum',
                key: 'waitConfirmChineseNameNum',
                width: 120,
                sorter: true,
                render: (text) => {
                    return !text && text !== 0 ? <EmptyLabel /> : <span>{text}</span>
                },
            },
            /* {
             title: '信息完整',
             dataIndex: 'infoCompleted',
             key: 'infoCompleted',
             width: 120,
             sorter: true,
             render: (text, record) => {
             if (text) {
             return <StatusLabel type='success' message='完整' />
             } else {
             return <StatusLabel type='originWarning' message='待完善' />
             }
             },
             }, */
        ]
    }
    componentDidMount = async () => {
        // 开始缓存
        init = true
        if (this.pageParams.tableId) {
            await this.onSelect(this.pageParams)
        }
        this.refresh()
        this.getSearchCondition()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    refresh = async () => {
        console.log('getLeftTreeData', Date.now())
        await this.getLeftTreeData()
        console.log('getLeftTreeData', Date.now())
        let { treeData, selectedTable } = this.state
        if (selectedTable.datasourceId) {
            this.onSelect(selectedTable)
        } else {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }
    getSearchCondition = async () => {
        let res = await getTree({ code: 'XT001' })
        if (res.code == 200) {
            this.setState({
                datasourceInfo: res.data.children,
            })
        }
    }
    getRightSearchCondition = async () => {
        const { selectedTable } = this.state
        let res = await databaseList({ datasourceId: selectedTable.datasourceId, page: 1, page_size: 999999 })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    getLeftTreeData = async () => {
        let { treeQueryInfo, treeData, datasourceIds, successTableCount, failedTableCount, selectedTable } = this.state
        console.log('getLeftTreeData', datasourceIds)
        let query = {
            ...treeQueryInfo,
            treeNodeId: datasourceIds ? datasourceIds[(datasourceIds || {}).length - 1] : '',
        }
        this.setState({ treeLoading: true })
        let res = await dicDsList(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            let hasData = false
            res.data.map((item) => {
                if (item.datasourceId == selectedTable.datasourceId) {
                    hasData = true
                }
                item.cNameCompleteRate = item.cNameCompleteRate ? parseFloat(item.cNameCompleteRate.split('%')[0]).toFixed(2) : 0
                item.namingConventionRate = item.namingConventionRate ? parseFloat(item.namingConventionRate.split('%')[0]).toFixed(2) : 0
                item.pkExistRate = item.pkExistRate ? parseFloat(item.pkExistRate.split('%')[0]).toFixed(2) : 0
            })
            console.log(res.data)
            if (!hasData) {
                await this.onSelectedTable({})
            }
            this.setState({
                treeData: res.data,
            })
        }
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.datasourceName = e.target.value
        await this.setState({
            treeQueryInfo,
            isTreeSearch: true,
        })
    }
    changeTreeSelect = async (name, e) => {
        let { treeQueryInfo } = this.state
        if (name == 'datasourceIds') {
            await this.setState({
                datasourceIds: e,
                isTreeSearch: true,
            })
        } else {
            treeQueryInfo[name] = e
            await this.setState({
                treeQueryInfo,
                isTreeSearch: true,
            })
        }
        if (name !== 'indexma') {
            this.treeSearch()
        }
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
        if (!selectedTable.datasourceId) {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }
    onSelect = (data) => {
        // 记录selectTable值
        const storage = getStorage() || {}
        storage.selectedTable = data
        setStorage(storage)
        this.onSelectedTable(data)
    }
    onSelectedTable = async (data) => {
        await this.setState({
            selectedTable: { ...data },
        })
        if (data.datasourceId !== undefined) {
            this.getDsspecification()
            this.getDsInfo()
            this.getDsOverview()
            this.reset()
            this.getRightSearchCondition()
        }
    }
    getDsspecification = async () => {
        let { selectedTable } = this.state
        let resp = await specSwitch({ id: selectedTable.datasourceId })
        if (resp.code == 200) {
            selectedTable.isOpenSpecs = resp.data
            this.setState({
                selectedTable,
            })
        }
        let res = await dsspecification({ id: selectedTable.datasourceId })
        if (res.code == 200) {
            if (res.data) {
                selectedTable.rootOrderTypeName = res.data.rootOrderTypeName
                selectedTable.spellTypeName = res.data.spellTypeName
                selectedTable.joinTypeName = res.data.joinTypeName
                selectedTable.rootCategoryName = res.data.rootCategoryName
                selectedTable.rootCategory = res.data.rootCategory
                this.setState({
                    dataSourceConfig: true,
                    selectedTable,
                })
            } else {
                this.setState({
                    dataSourceConfig: false,
                    selectedTable,
                })
            }
        }
    }
    getDsInfo = async () => {
        let { selectedTable } = this.state
        let res = await dicDsInfo({ id: selectedTable.datasourceId })
        if (res.code == 200) {
            this.setState({
                dsInfo: res.data,
            })
        }
    }
    getDsOverview = async () => {
        let { selectedTable } = this.state
        let res = await dicDsOverview({ id: selectedTable.datasourceId })
        if (res.code == 200) {
            await this.setState({
                dsOverview: res.data,
            })
            console.log(this.tableInfo.clientWidth, 'this.tableInfo.clientWidth')
            if (this.tableInfo.clientWidth < 1300) {
                this.setState({
                    showScrollBtn: true,
                })
            }
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        const storage = getStorage()
        queryInfo = {
            tableNameKeyWord: '',
        }

        // 这个时机只会执行一次
        if (init && storage) {
            queryInfo = {
                ...queryInfo,
                ...(storage.queryInfo || {}),
            }
            console.log('存储赋值了', queryInfo)
            init = false
        }
        // 这个函数还负责清空
        if (!init) {
            storage.queryInfo = queryInfo
            setStorage(storage)
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
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
            datasourceId: selectedTable.datasourceId,
            orderByInfoCompleted: params.sorter.field == 'infoCompleted' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,

            orderByChnComplete: params.sorter.field == 'cNameCompletedDegree' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByColumnNum: params.sorter.field == 'colNum' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByNameStandard: params.sorter.field == 'nameStandardDegree' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPrimaryKeyStatus: params.sorter.field == 'primaryKeyState' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByWaitConfirmChineseNameNum: params.sorter.field == 'waitConfirmChineseNameNum' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPartition: params.sorter.field == 'partitionState' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await dicDsTable(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total,
            })
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        console.log('queryInfo', queryInfo)
        // 数据库筛选更改时，保存状态
        const storage = getStorage() || {}
        storage.queryInfo = queryInfo
        setStorage(storage)
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.tableNameKeyWord = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    openEditPage = (data) => {
        let { selectedTable, dsInfo } = this.state
        data.datasourceId = selectedTable.datasourceId
        data.datasourceName = selectedTable.datasourceName
        data.isOpenSpecs = selectedTable.isOpenSpecs
        data.systemClassify = dsInfo.systemClassify
        data.datasourceType = dsInfo.datasourceType
        data.rootCategory = selectedTable.rootCategory
        data.rootCategoryName = selectedTable.rootCategoryName
        this.props.addTab('数据字典-表详情', { ...data })
    }
    changeDatasourceStatus = async (e) => {
        let { selectedTable } = this.state
        this.setState({ switchLoading: true })
        let res = await specSwitchOpera({ id: selectedTable.datasourceId, flag: e ? 1 : 0 })
        this.setState({ switchLoading: false })
        if (res.code == 200) {
            selectedTable.isOpenSpecs = e
            message.success(e ? '开启成功' : '关闭成功')
            this.setState({
                selectedTable,
            })
        }
    }
    changePage = () => {
        this.props.addTab('词根组合规范')
    }
    scrollRight(canScroll, value) {
        if (canScroll) {
            this.setState({
                scrolled: value,
            })
            if (value) {
                this.scrollRef.scrollLeft = 1000
            } else {
                this.scrollRef.scrollLeft = 0
            }
        }
    }
    onScrollEvent = async () => {
        if (this.scrollRef.scrollLeft == 0) {
            this.setState({
                scrolled: false,
            })
        } else {
            this.setState({
                scrolled: true,
            })
        }
    }
    render() {
        const {
            treeData,
            treeLoading,
            isTreeSearch,
            treeQueryInfo,
            showFilter,
            datasourceIds,
            datasourceInfo,
            indexmaList,
            queryInfo,
            tableData,
            selectedTable,
            databaseList,
            scrolled,
            showScrollBtn,
            dsOverview,
            dsInfo,
            dataSourceConfig,
            switchLoading,
        } = this.state
        let showCnameCompleteRate = treeQueryInfo.indexma.includes(0)
        let showPkExistRate = treeQueryInfo.indexma.includes(1)
        let showNamingConventionRate = treeQueryInfo.indexma.includes(2)
        console.log('selectedTable.isOpenSpecs', selectedTable.isOpenSpecs)
        return (
            <div className='dataDictionary'>
                <div className='sliderLayout'>
                    <div className='slider'>
                        <div className='leftHeader'>
                            <div className='headerTitle'>数据源列表</div>
                        </div>
                        <div className='HideScroll tableArea'>
                            {treeData.length || isTreeSearch ? (
                                <div>
                                    <div className='searchGroup'>
                                        <span className='icon-sousuo iconfont'></span>
                                        <Input.Search onSearch={this.treeSearch} value={treeQueryInfo.datasourceName} onChange={this.changeTreeKeyword} placeholder='输入数据源名，回车搜索' />
                                        <span className={showFilter ? 'showFilter filterIcon' : 'filterIcon'}>
                                            <span onClick={() => this.setState({ showFilter: !showFilter })} className='iconfont icon-Filter'></span>
                                            {(datasourceIds || {}).length || treeQueryInfo.indexma.length ? <span className='statusDot'></span> : null}
                                        </span>
                                        {showFilter ? (
                                            <div style={{ marginTop: 8 }}>
                                                <Cascader
                                                    allowClear
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={datasourceInfo}
                                                    value={datasourceIds}
                                                    onChange={this.changeTreeSelect.bind(this, 'datasourceIds')}
                                                    popupClassName='searchCascader'
                                                    placeholder='分类路径'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    changeOnSelect
                                                    style={{ width: '100%' }}
                                                />
                                                <Select
                                                    allowClear
                                                    mode='multiple'
                                                    onChange={this.changeTreeSelect.bind(this, 'indexma')}
                                                    value={treeQueryInfo.indexma}
                                                    placeholder='展示指标（多选）'
                                                    style={{ width: '100%', marginTop: 8 }}
                                                >
                                                    {indexmaList.map((item, index) => {
                                                        return (
                                                            <Select.Option key={index} value={index}>
                                                                {item}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Popover
                                                    trigger='click'
                                                    content={
                                                        <div className='indexmaPopover'>
                                                            <div>指标注释</div>
                                                            <div className='labelItem'>
                                                                <span className='cIcon'>中</span>中文完整度
                                                            </div>
                                                            <div className='labelItem'>
                                                                <span className='pkIcon'>PK</span>主键存在率
                                                            </div>
                                                            <div className='labelItem'>
                                                                <span className='gIcon'>规</span>命名规范率
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <InfoCircleOutlined style={{ position: 'absolute', top: '89px', right: '27px', color: '#5E6266' }} />
                                                </Popover>
                                            </div>
                                        ) : null}
                                    </div>
                                    <Spin spinning={treeLoading}>
                                        {treeData.length ? (
                                            <div>
                                                {treeData.map((item, index) => {
                                                    return (
                                                        <div
                                                            onClick={this.onSelect.bind(this, item)}
                                                            className={selectedTable.datasourceId == item.datasourceId ? 'tableItem tableItemSelected' : 'tableItem'}
                                                        >
                                                            <span className='treeName'>
                                                                <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-xitong'></span>
                                                                {item.datasourceName}
                                                            </span>
                                                            {showCnameCompleteRate ? (
                                                                <div className='progressArea' style={{ marginTop: 16 }}>
                                                                    <span className='cIcon'>中</span>
                                                                    <Progress showInfo={false} percent={item.cNameCompleteRate || 0} size='small' />
                                                                    <span>{item.cNameCompleteRate || 0}%</span>
                                                                </div>
                                                            ) : null}
                                                            {showPkExistRate ? (
                                                                <div className='progressArea'>
                                                                    <span className='cIcon pkIcon'>PK</span>
                                                                    <Progress strokeColor='#42D0D5' showInfo={false} percent={item.pkExistRate || 0} size='small' />
                                                                    <span>{item.pkExistRate || 0}%</span>
                                                                </div>
                                                            ) : null}
                                                            {showNamingConventionRate ? (
                                                                <div className='progressArea'>
                                                                    <span className='cIcon gIcon'>规</span>
                                                                    <Progress strokeColor='#ED8D31' showInfo={false} percent={item.namingConventionRate || 0} size='small' />
                                                                    <span>{item.namingConventionRate || 0}%</span>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: 80, textAlign: 'center', color: '#C4C8CC' }}>- 暂无数据 -</div>
                                        )}
                                    </Spin>
                                </div>
                            ) : (
                                <Spin spinning={treeLoading}>
                                    <Empty
                                        style={{ margin: '80px 0 0 0' }}
                                        image={<img src={require('app_images/dataCompare/empty_icon.png')} />}
                                        description={<span style={{ fontFamily: 'PingFangSC-Medium, PingFang SC', fontWeight: '500' }}>暂无数据</span>}
                                        imageStyle={{
                                            height: 120,
                                        }}
                                    >
                                        <div style={{ color: '#5E6266' }}>你可以前往数据源列表添加</div>
                                    </Empty>
                                </Spin>
                            )}
                        </div>
                    </div>
                    {selectedTable.datasourceId ? (
                        <main>
                            <div className='ContentContainer'>
                                <div className='contentHeader'>
                                    <span className='tableName'>{selectedTable.datasourceName}</span>
                                    <div className='headerTab'>
                                        <span>
                                            {selectedTable.isOpenSpecs ? (
                                                <span>
                                                    命名规范：{selectedTable.rootCategoryName} {selectedTable.spellTypeName} {selectedTable.joinTypeName} {selectedTable.rootOrderTypeName}
                                                </span>
                                            ) : (
                                                '命名规范'
                                            )}
                                        </span>
                                        {selectedTable.isOpenSpecs ? (
                                            <Popconfirm
                                                placement='topLeft'
                                                title='关闭命名规范，将不进行字段英文名规范性检查'
                                                onConfirm={this.changeDatasourceStatus.bind(this, false)}
                                                okText='关闭'
                                                cancelText='取消'
                                            >
                                                <a key='delete'>
                                                    <Switch loading={switchLoading} checked={selectedTable.isOpenSpecs} />
                                                </a>
                                            </Popconfirm>
                                        ) : (
                                            <span>
                                                {dataSourceConfig ? (
                                                    <Switch onChange={this.changeDatasourceStatus} checked={selectedTable.isOpenSpecs} />
                                                ) : (
                                                    <Popover
                                                        /* visible={true} */
                                                        trigger='click'
                                                        arrowPointAtCenter={true}
                                                        placement='bottomLeft'
                                                        content={
                                                            <div>
                                                                <span className='iconfont icon-jinggaofill' style={{ color: '#F54B45', marginRight: 5 }}></span>
                                                                {/* <span style={{ marginRight: 60 }}>未配置规范</span> */}
                                                                <span style={{ marginRight: 60 }}>开启失败，请先配置规范</span>
                                                                <a onClick={this.changePage}>
                                                                    去配置<span className='iconfont icon-you'></span>
                                                                </a>
                                                            </div>
                                                        }
                                                    >
                                                        <span>
                                                            <Switch /* onClick={() => message.error('开启失败，请先配置规范')} */ checked={false} />
                                                        </span>
                                                    </Popover>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='tableContent commonScroll'>
                                    <div style={{ position: 'relative' }} id='commonScroll'>
                                        <div className='tableInfo' ref={(dom) => (this.tableInfo = dom)} style={{ marginTop: 0 }}>
                                            <ModuleTitle title='数据概览' suffix={<span className='updateTime'>数据更新时间：{selectedTable.dataUpdateTime || ''}</span>} />
                                            {showScrollBtn ? (
                                                <div className='scrollBtn'>
                                                    <span
                                                        onClick={this.scrollRight.bind(this, scrolled, false)}
                                                        style={{ color: !scrolled ? '#C4C8CC' : '#5E6266', marginRight: 20 }}
                                                        className='iconfont icon-zuo'
                                                    ></span>
                                                    <span
                                                        onClick={this.scrollRight.bind(this, !scrolled, true)}
                                                        style={{ color: scrolled ? '#C4C8CC' : '#5E6266' }}
                                                        className='iconfont icon-you'
                                                    ></span>
                                                </div>
                                            ) : null}
                                            <div className='statics HideScroll' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                                                <div>
                                                    <span className='iconfont icon-shujuku'></span>
                                                    <span className='label'>数据库</span>
                                                    <span className='value'>{ProjectUtil.formNumber(dsOverview.dbCount || 0)}</span>
                                                </div>
                                                <div>
                                                    <span className='iconfont icon-biao2'></span>
                                                    <span className='label'>表数量</span>
                                                    <span className='value'>{ProjectUtil.formNumber(dsOverview.tableCount || 0)}</span>
                                                </div>
                                                <div>
                                                    <span className='iconfont icon-ziduan2'></span>
                                                    <span className='label'>字段数</span>
                                                    <span className='value'>{ProjectUtil.formNumber(dsOverview.fieldCount || 0)}</span>
                                                </div>
                                                {/* <div style={{ textAlign: 'center' }}>
                                                 <Divider style={{ margin: 0, verticalAlign: 'bottom' }} type='vertical'/>
                                                 </div> */}
                                                <div>
                                                    <span className='iconfont icon-zhongwenming'></span>
                                                    <span className='label'>中文完整度</span>
                                                    <span className='value'>{dsOverview.cNameCompleteRate || <EmptyLabel />}</span>
                                                </div>
                                                <div>
                                                    <span className='iconfont icon-zhujian1'></span>
                                                    <span className='label'>主键存在率</span>
                                                    <span className='value'>{dsOverview.pkExistRate || <EmptyLabel />}</span>
                                                </div>
                                                <div>
                                                    <span className='iconfont icon-fenqu'></span>
                                                    <span className='label'>分区表占比</span>
                                                    <span className='value'>{dsOverview.tablePartitionRate || <EmptyLabel />}</span>
                                                </div>
                                                {selectedTable.isOpenSpecs && (
                                                    <div>
                                                        <span className='iconfont icon-guifan'></span>
                                                        <span className='label'>命名规范率</span>
                                                        <span className='value'>{dsOverview.namingConventionRate || <EmptyLabel />}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='tableInfo'>
                                            <ModuleTitle title='基本信息' />
                                            <div className='MiniForm Grid4'>
                                                {RenderUtil.renderFormItems([
                                                    {
                                                        label: '所属系统',
                                                        content: dsInfo.belongSystem,
                                                    },

                                                    {
                                                        label: '数据库类型',
                                                        content: dsInfo.datasourceType,
                                                    },
                                                    {
                                                        label: '技术负责人',
                                                        content: dsInfo.technologyManager,
                                                    },
                                                ])}
                                            </div>
                                        </div>
                                        <div className='tableInfo'>
                                            <ModuleTitle style={{ display: 'inline-block', marginBottom: 16 }} title='表列表' />
                                            <RichTableLayout
                                                disabledDefaultFooter
                                                smallLayout
                                                editColumnProps={{
                                                    width: 70,
                                                    createEditColumnElements: (_, record, defaultElements) => {
                                                        return RichTableLayout.renderEditElements([
                                                            {
                                                                label: '编辑',
                                                                funcCode: '/dataDictionary/list/edit',
                                                                onClick: this.openEditPage.bind(this, record),
                                                                key: 'edit',
                                                            },
                                                        ]).concat(defaultElements)
                                                    },
                                                }}
                                                tableProps={{
                                                    columns: filterOption(this.columns, selectedTable.isOpenSpecs),
                                                    key: 'tableId',
                                                    dataSource: tableData,
                                                    // extraTableProps: {
                                                    //     scroll: {
                                                    //         x: 1000,
                                                    //     },
                                                    // },
                                                }}
                                                renderSearch={(controller) => {
                                                    this.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Input.Search
                                                                allowClear
                                                                value={queryInfo.tableNameKeyWord}
                                                                onChange={this.changeKeyword}
                                                                onSearch={this.search}
                                                                placeholder='请输入表中／英文名'
                                                            />
                                                            <Select
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'databaseId')}
                                                                value={queryInfo.databaseId}
                                                                placeholder='数据库'
                                                                getPopupContainer={() => document.getElementById('commonScroll')}
                                                            >
                                                                {databaseList.map((item) => {
                                                                    return (
                                                                        <Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                                                            {item.physicalDatabase}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(this, 'primaryKeyState')}
                                                                value={queryInfo.primaryKeyState}
                                                                placeholder='主键状态'
                                                                getPopupContainer={() => document.getElementById('commonScroll')}
                                                            >
                                                                <Option value={true} key={1}>
                                                                    存在
                                                                </Option>
                                                                <Option value={false} key={0}>
                                                                    缺失
                                                                </Option>
                                                            </Select>
                                                            {/* <Select
                                                             allowClear
                                                             onChange={this.changeStatus.bind(this, 'ss')}
                                                             value={[{
                                                             label: '是', value: 1,
                                                             label: '否', value: 2
                                                             }]}
                                                             value={queryInfo.ss}
                                                             placeholder="分区表"
                                                             getPopupContainer={() => document.body}
                                                             >
                                                             <Option value={true} key={1}>存在</Option>
                                                             <Option value={false} key={0}>缺失</Option>
                                                             </Select> */}
                                                            <Button onClick={this.reset}>重置</Button>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    ) : (
                        <div style={{ width: '100%', marginTop: 170 }}>
                            <EmptyIcon description='暂无数据，请先完善数据源信息' />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
