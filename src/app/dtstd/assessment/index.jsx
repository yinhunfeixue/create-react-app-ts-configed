// 检核规则
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import DrawerLayout from '@/component/layout/DrawerLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import EmptyIcon from '@/component/EmptyIcon'
import ValutareConfig from './valutareConfig'
import { Button, Divider, Input, Tooltip, Progress, Select, Spin, Empty, Cascader, Popover, Tabs, Row, Col, Modal, message, Switch, Rate, Popconfirm } from 'antd'
import { PlusOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons'
import React, { Component } from 'react'
import Cache from 'app_utils/cache'
import './index.less'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import { latestDiffDetail, versionDiffDetail } from 'app_api/autoManage'
import { getTree } from 'app_api/systemManage'
import { dsspecification } from 'app_api/metadataApi'
import { databaseList } from 'app_api/examinationApi'
import { dicDsInfo, estimateOverview, dicDsTable, specSwitch, queryEstimateTableList, queryTableSource, executeEstimate } from 'app_api/standardApi'
import _ from 'underscore'
import moment from 'moment'
const { Option } = Select
import SystemList from './systemList'
import BasicDetail from './basicDetail/index'
import ValutareHistory from './valutareHistory/index'
import AutoTip from '@/component/AutoTip'

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
            systemId: null,
            queryInfo: {
                keyword: '',
            },
            selectedTable: storage.selectedTable || {},
            dsInfo: {},
            dsOverview: {},
            tableData: [],
            datasourceInfo: [],
            databaseList: [],
            typeList: [],
            total: 0,
            logModalVisible: false,
            logList: [],
            successTableCount: 0,
            failedTableCount: 0,

            resultTabValue: '1',
            scrolled: false,
            showScrollBtn: false,
            executeLoading: false,
        }
        this.columns = [
            {
                title: '表名',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 200,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <AutoTip content={text}>
                            <span>{text}</span>
                            <br />
                            <span>{record.tableChnName}</span>
                        </AutoTip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '路径',
                dataIndex: 'tablePath',
                key: 'tablePath',
                width: 160,
                render: (text, record) => (text ? <AutoTip content={text}>{text}</AutoTip> : <EmptyLabel />),
            },
            {
                title: '字段数',
                dataIndex: 'columnNum',
                key: 'columnNum',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '对标字段数',
                sorter: true,
                dataIndex: 'markingColumnNum',
                key: 'markingColumnNum',
                width: 130,
                render: (text, record) => (text !== undefined ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '落标率',
                sorter: true,
                dataIndex: 'assessColumRatio',
                key: 'assessColumRatio',
                width: 130,
                render: (text, record) => {
                    text = this.getToFixedNum((record.assessColumnNum / record.markingColumnNum) * 100)
                    return text
                },
            },
        ]
    }

    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    componentDidMount = async () => {
        this.getSearchCondition()
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
        let res = await queryTableSource({ systemId: selectedTable.systemId, page: 1, page_size: 999999 })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }

    onSelectedTable = async (data) => {
        await this.setState({
            selectedTable: { ...data },
        })
        if (data.systemId !== undefined) {
            this.getDsspecification()
            this.getDsInfo()
            this.getDsOverview()
            this.reset()
            this.getRightSearchCondition()
        }
    }
    getDsspecification = async () => {
        let { selectedTable } = this.state
        let resp = await specSwitch({ id: selectedTable.systemId })
        if (resp.code == 200) {
            selectedTable.isOpenSpecs = resp.data
            this.setState({
                selectedTable,
            })
        }
        let res = await dsspecification({ id: selectedTable.systemId })
        if (res.code == 200) {
            if (res.data) {
                selectedTable.rootOrderTypeName = res.data.rootOrderTypeName
                selectedTable.spellTypeName = res.data.spellTypeName
                selectedTable.joinTypeName = res.data.joinTypeName
                selectedTable.rootCategoryName = res.data.rootCategoryName
                selectedTable.rootCategory = res.data.rootCategory
                this.setState({
                    selectedTable,
                })
            } else {
                this.setState({
                    selectedTable,
                })
            }
        }
    }
    getDsInfo = async () => {
        let { selectedTable } = this.state
        let res = await dicDsInfo({ id: selectedTable.systemId })
        if (res.code == 200) {
            this.setState({
                dsInfo: res.data,
            })
        }
    }
    getDsOverview = async () => {
        let { selectedTable } = this.state
        let res = await estimateOverview({ systemId: selectedTable.systemId })
        if (res.code == 200) {
            await this.setState({
                dsOverview: res.data,
            })
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        const storage = getStorage()
        queryInfo = {
            keyword: '',
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
            systemId: selectedTable.systemId,
            orderByAssessNum: params.sorter.field == 'markingColumnNum' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByColumnNum: params.sorter.field == 'columnNum' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByMarkedRatio: params.sorter.field == 'assessColumRatio' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await queryEstimateTableList(query)
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
    changeStatus = async (name, e = []) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        queryInfo.datasourceId = e[0] || null
        queryInfo.databaseId = e[1] || null
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
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
    }
    openEditPage = (data) => {
        this.basicDetailRef.openModal(data)
    }

    openHistoryPage = () => {
        this.valutareHistoryRef.openModal(this.state.selectedTable.systemId)
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

    executeEstimate = async () => {
        const { selectedTable } = this.state
        this.setState({ executeLoading: true })
        const res = await executeEstimate({ systemId: selectedTable.systemId })
        this.setState({ executeLoading: false })
        if (res.code === 200) {
            message.success('执行成功')
            this.systemRefresh()
        }
    }

    loadData = (loadData) => {
        console.log('loadData', loadData)
    }

    systemRefresh = () => {
        this.systemRef.refresh()
    }

    openValutareConfig = () => {
        this.valutareConfigRef.openModal()
    }

    render() {
        const { datasourceInfo, queryInfo, tableData, selectedTable, databaseList, scrolled, showScrollBtn, dsOverview, dsInfo, executeLoading } = this.state
        console.log('selectedTable', selectedTable)
        return (
            <div className='assessment'>
                <div className='sliderLayout'>
                    <SystemList ref={(dom) => (this.systemRef = dom)} getSelectSystemData={this.onSelectedTable} openValutareConfig={this.openValutareConfig} {...this.props} />
                    <BasicDetail ref={(dom) => (this.basicDetailRef = dom)} />
                    <ValutareHistory ref={(dom) => (this.valutareHistoryRef = dom)} />
                    {selectedTable.systemId && dsOverview && dsOverview.toString() !== '{}' ? (
                        <main>
                            <div className='ContentContainer'>
                                <div className='contentHeader'>
                                    <span className='tableName'>{selectedTable.systemName}</span>
                                    <div className='headerTab'>
                                        <ValutareConfig ref={(dom) => (this.valutareConfigRef = dom)} systemRefresh={this.systemRefresh} selectedTable={selectedTable} />
                                        <Button type='primary' onClick={this.openValutareConfig} ghost>
                                            <span style={{ color: '#4D73FF' }}>评估标准配置</span>
                                        </Button>
                                        <Button type='primary' onClick={this.executeEstimate} disabled={executeLoading} style={{ marginLeft: 8 }} ghost>
                                            <span style={{ color: '#4D73FF' }}>立即执行</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className='tableContent commonScroll'>
                                    <div style={{ position: 'relative' }} id='commonScroll'>
                                        <div className='tableInfo' ref={(dom) => (this.tableInfo = dom)} style={{ marginTop: 0 }}>
                                            <ModuleTitle title='数据概览' suffix={<span className='updateTime'>评估时间：{dsOverview.createTime || ''}</span>} />
                                            <div className='statics HideScroll' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                                                <div className='statics_item'>
                                                    <span className='label'>字段数</span>
                                                    <span className='value'>{ProjectUtil.formNumber(dsOverview.columnNum || 0)}</span>
                                                    <Divider style={{ marginLeft: 46, height: 14 }} type='vertical' />
                                                </div>

                                                <div className='statics_item'>
                                                    <span className='label'>对标字段</span>
                                                    <span className='value'>
                                                        <span style={{ float: 'left' }}>{ProjectUtil.formNumber(dsOverview.markingColumnNum || 0)}</span>
                                                        <Tooltip title={`对标率: ${this.getToFixedNum(dsOverview.markingColumnNum ? (dsOverview.markingColumnNum / dsOverview.columnNum) * 100 : 0)}`}>
                                                            <Progress
                                                                style={{ display: 'inline-block', position: 'relative', top: 2, left: 6 }}
                                                                type='circle'
                                                                width={16}
                                                                percent={dsOverview.markingColumnNum ? (dsOverview.markingColumnNum / dsOverview.columnNum) * 100 : 0}
                                                                showInfo={false}
                                                                strokeWidth={15}
                                                            />
                                                        </Tooltip>
                                                    </span>
                                                </div>

                                                <div className='statics_item'>
                                                    <span className='label'>落标字段</span>
                                                    <span className='value'>
                                                        <span style={{ float: 'left' }}> {ProjectUtil.formNumber(dsOverview.assessColumnNum || 0)}</span>
                                                        <Tooltip
                                                            title={`落标率: ${this.getToFixedNum(dsOverview.assessColumnNum ? (dsOverview.assessColumnNum / dsOverview.markingColumnNum) * 100 : 0)}`}
                                                        >
                                                            <Progress
                                                                style={{ display: 'inline-block', position: 'relative', top: 2, left: 6 }}
                                                                type='circle'
                                                                width={16}
                                                                percent={dsOverview.assessColumnNum ? (dsOverview.assessColumnNum / dsOverview.markingColumnNum) * 100 : 0}
                                                                showInfo={false}
                                                                strokeWidth={15}
                                                            />
                                                        </Tooltip>
                                                    </span>
                                                </div>
                                            </div>
                                            <div onClick={this.openHistoryPage} className='evaluationHistory'>
                                                <span style={{ fontWeight: 'normal' }} className='iconfont icon-time'></span>落标评估历史
                                            </div>
                                        </div>
                                        <div className='tableInfo'>
                                            <ModuleTitle style={{ display: 'inline-block', marginBottom: 16 }} title='表列表' />
                                            <RichTableLayout
                                                disabledDefaultFooter
                                                smallLayout
                                                editColumnProps={{
                                                    width: 70,
                                                    createEditColumnElements: (_, record) => {
                                                        return [
                                                            <a onClick={this.openEditPage.bind(this, record)} key='edit'>
                                                                详情
                                                            </a>,
                                                        ]
                                                    },
                                                }}
                                                tableProps={{
                                                    columns: filterOption(this.columns, selectedTable.isOpenSpecs),
                                                    key: 'id',
                                                    dataSource: tableData,
                                                    extraTableProps: {
                                                        scroll: {
                                                            x: 'auto',
                                                        },
                                                    },
                                                }}
                                                renderSearch={(controller) => {
                                                    this.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名' />
                                                            <Cascader
                                                                fieldNames={{ label: 'name', value: 'id' }}
                                                                options={databaseList}
                                                                value={queryInfo.dataIds}
                                                                displayRender={(e) => e.join('-')}
                                                                onChange={this.changeStatus.bind(this, 'dataIds')}
                                                                loadData={this.loadData}
                                                                changeOnSelect
                                                                popupClassName='searchCascader'
                                                                placeholder='路径'
                                                                // getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            />
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
                            <EmptyIcon type='icon-kongzhuangtai3' description='暂无内容，请先在左侧添加系统' />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
