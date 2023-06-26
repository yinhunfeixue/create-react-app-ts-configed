// 检核规则
import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Divider, Empty, Input, message, Progress, Select, Spin, Tooltip, Tabs } from 'antd'
import { changeTableFocusState, queryLatestRecords, queryTableSource, taskGroupTableList, queryRuleOverview } from 'app_api/examinationApi'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import '../../index.less'
import store from '../../store'
import ErrorLogDrawer from './errorLogDrawer'
import ErrorResultPage from './errorResultPage'
import HistoryRecordPage from './historyRecordPage'
import TableResultDrawer from './tableResultDrawer'

const { Option } = Select
const TabPane = Tabs.TabPane

const lastStatusMap = {
    // 0: '新创建',
    // 1: '等待执行',
    // 2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    // 5: '系统中止',
}
@observer
export default class CheckResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isTreeSearch: false,
            treeQueryInfo: {
                tableName: '',
            },
            treeData: [],
            queryInfo: {
                keyword: '',
            },
            treeLoading: false,
            // selectedTable: {},
            tableData: [],
            showFilter: false,
            datasourceIds: [],
            datasourceInfo: [],
            typeList: [],
            total: 0,
            logModalVisible: false,
            logList: [],
            successTableCount: 0,
            failedTableCount: 0,

            resultTabValue: '1',
            tabValue: '0',
            tableRuleData: [],
            tableRuleInfo: {
                tableRuleNum: 0,
                tableRuleWrongNum: 0
            },
            columnRuleInfo: {
                columnRuleNum: 0,
                columnRuleWrongNum: 0
            },
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 100,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 100,
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
                title: '问题级别',
                dataIndex: 'severityLevel',
                key: 'severityLevel',
                width: 100,
                render: (text, record) => (text ? <span>{text == 1 ? '普通' : '严重'}</span> : <EmptyLabel />),
            },
            {
                title: '数据总量',
                dataIndex: 'totalCount',
                key: 'totalCount',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '问题总量',
                dataIndex: 'wrongCount',
                key: 'wrongCount',
                width: 120,
                sorter: true,
                render: (text, record) => (text !== undefined ? <span>{ProjectUtil.formNumber(text)}</span> : <EmptyLabel />),
            },
            {
                title: '出错率',
                dataIndex: 'errorRate',
                key: 'errorRate',
                width: 100,
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '容错率',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 100,
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '检核结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    if (text) {
                        return <StatusLabel type='success' message='通过' />
                    } else {
                        return <StatusLabel type='error' message='未通过' />
                    }
                },
            },
        ]
        this.tableColumns = [
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 150,
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
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 100,
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
                title: '问题级别',
                dataIndex: 'severityLevel',
                key: 'severityLevel',
                width: 100,
                render: (text, record) => (text ? <span>{text == 1 ? '普通' : '严重'}</span> : <EmptyLabel />),
            },
            {
                title: '检核结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    if (text) {
                        return <StatusLabel type='success' message='通过' />
                    } else {
                        return <StatusLabel type='error' message='未通过' />
                    }
                },
            },
        ]
    }
    componentWillMount = () => {
        this.refresh()
    }
    refresh = async () => {
        await this.getLeftTreeData()
        this.getSearchCondition()
        console.log('refresh+++++')
        let { treeData } = this.state
        let { selectedTable } = store
        if (selectedTable.tableId) {
            this.onSelect(selectedTable)
        } else {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }
    getSearchCondition = async () => {
        const { selectedTaskInfo } = store
        console.log(selectedTaskInfo.name, 'getSearchCondition')
        let res = await queryTableSource({ taskGroupId: selectedTaskInfo.taskGroupId })
        if (res.code == 200) {
            this.setState({
                datasourceInfo: res.data,
            })
        }
    }
    // getLeftTreeData = async () => {
    //     let { treeQueryInfo, datasourceIds } = this.state
    //     const { selectedTaskInfo } = store
    //     let query = {
    //         taskGroupId: selectedTaskInfo.taskGroupId,
    //         ...treeQueryInfo,
    //         datasourceId: datasourceIds[0],
    //         databaseId: datasourceIds[1],
    //     }
    //     this.setState({ treeLoading: true })
    //     let res = await taskGroupTableList(query)
    //     this.setState({ treeLoading: false })
    //     if (res.code == 200) {
    //         this.setState({
    //             treeData: res.data.qaTaskList,
    //             activeTableCount: res.data.activeTableCount,
    //             hangTableCount: res.data.hangTableCount,
    //         })
    //     }
    // }
    getLeftTreeData = async () => {
        let { treeQueryInfo, treeData, datasourceIds, successTableCount, failedTableCount } = this.state
        const { selectedTaskInfo, selectedTable } = store
        let query = {
            taskGroupId: selectedTaskInfo.taskGroupId,
            ...treeQueryInfo,
            datasourceId: datasourceIds[0],
            databaseId: datasourceIds[1],
        }
        this.setState({ treeLoading: true })
        let res = await taskGroupTableList(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            treeData = []
            successTableCount = 0
            failedTableCount = 0
            res.data.qaTaskList.map((item) => {
                if (item.lastCheckStatus == 3 || item.lastCheckStatus == 4) {
                    treeData.push(item)
                }
            })
            let hasData = false
            treeData.map((item) => {
                if (item.lastCheckStatus == 3) {
                    successTableCount++
                }
                if (item.lastCheckStatus == 4) {
                    failedTableCount++
                }
                if (item.tableId == selectedTable.tableId) {
                    hasData = true
                }
            })
            if (!hasData) {
                await store.onSelectedTable({})
            }
            this.setState({
                treeData,
                successTableCount,
                failedTableCount,
            })
        }
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.tableName = e.target.value
        await this.setState({
            treeQueryInfo,
            isTreeSearch: true,
        })
        // this.treeSearch()
    }
    changeTreeKeywordAndSelect = async (value) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.tableName = value
        console.log(value, 'changeTreeKeywordAndSelect++')
        await this.setState({
            treeQueryInfo,
            isTreeSearch: true,
            treeData: [],
        })
        await this.getLeftTreeData()
        this.onSelect(this.state.treeData.length ? this.state.treeData[0] : {})
    }
    changeTreeSelect = async (name, e) => {
        let { treeQueryInfo } = this.state
        if (name == 'datasourceIds') {
            await this.setState({
                datasourceIds: e || [],
            })
        } else {
            treeQueryInfo[name] = e
            await this.setState({
                treeQueryInfo,
                isTreeSearch: true,
            })
        }
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
        let { treeData } = this.state
        let { selectedTable } = store
        if (!selectedTable.tableId) {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }

    treeReset = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo = {
            tableName: '',
        }
        await this.setState({
            treeQueryInfo,
            datasourceIds: [],
        })
        this.treeSearch()
    }
    onSelect = async (data) => {
        await store.onSelectedTable(data)
        this.reset()
        this.errorResultPage && this.errorResultPage.onSelectTable(data)
        this.historyRecordPage && this.historyRecordPage.onSelectTable(data)
        this.getQueryRuleOverview()
        this.onChangeTab('0')
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
        if (this.controller) {
            this.controller.reset()
        }
    }
    getQueryRuleOverview = async () => {
        const { selectedTable } = store
        let { tableRuleInfo, columnRuleInfo } = this.state
        if (!selectedTable.tableId) {
            return
        }
        let query = {
            tableId: selectedTable.tableId,
            tsTaskId: selectedTable.lastCheckTaskId
        }
        let res = await queryRuleOverview(query)
        if (res.code == 200) {
            tableRuleInfo = {
                tableRuleNum: res.data.tableRuleNum,
                tableRuleWrongNum: res.data.tableRuleWrongNum
            }
            columnRuleInfo = {
                columnRuleNum: res.data.columnRuleNum,
                columnRuleWrongNum: res.data.columnRuleWrongNum
            }
            this.setState({
                tableRuleInfo,
                columnRuleInfo
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        const { selectedTaskInfo, selectedTable } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            tableId: selectedTable.tableId,
            jobId: selectedTaskInfo.jobId,
            tsTaskId: selectedTable.lastCheckTaskId,
            ruleLevel: 0,
            orderByTotalCount: params.sorter.field == 'totalCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByWrongCount: params.sorter.field == 'wrongCount' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByErrorRate: params.sorter.field == 'errorRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPassRate: params.sorter.field == 'passRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await queryLatestRecords(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total ? res.total : res.data.length,
            })
            return {
                total: res.total ? res.total : res.data.length,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getTableRuleList = async (params = {}) => {
        const { selectedTaskInfo, selectedTable } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            jobId: selectedTaskInfo.jobId,
            tsTaskId: selectedTable.lastCheckTaskId,
            ruleLevel: 1
        }
        let res = await queryLatestRecords(query)
        if (res.code == 200) {
            this.setState({
                tableRuleData: res.data,
            })
            return {
                total: res.total ? res.total : res.data.length,
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
        if (!e.target.value) {
            this.search()
        }
    }
    changeTab = () => {
        store.changeTab('2')
    }
    changeResultTab = async (value) => {
        await this.setState({
            resultTabValue: value,
        })
        this.reset()
        this.errorResultPage && this.errorResultPage.onSelectTable(store.selectedTable)
        this.historyRecordPage && this.historyRecordPage.onSelectTable(store.selectedTable)
    }
    changeSubscribe = async (index, value, e) => {
        e.stopPropagation()
        let { treeData } = this.state
        let query = {
            taskId: treeData[index].id,
            isFocus: value,
        }
        let res = await changeTableFocusState(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.getLeftTreeData()
        }
    }
    openErrorLogModal = (data) => {
        this.errorLogDrawer && this.errorLogDrawer.openModal(data)
    }
    openTableResultModal = (data) => {
        this.tableResultDrawer && this.tableResultDrawer.openModal(data)
    }
    onChangeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
      this.reset()
        // this.controller.refresh()
    }
    render() {
        const { selectedTaskInfo, selectedTable, taskDetail } = store
        const { tabValue, tableRuleData, columnRuleInfo, tableRuleInfo, treeData, treeLoading, isTreeSearch, treeQueryInfo, showFilter, datasourceIds, datasourceInfo, queryInfo, typeList, tableData, resultTabValue, successTableCount, failedTableCount } =
            this.state
        return (
            <div className='checkRule'>
                <div className='sliderLayout'>
                    <div className='slider'>
                        <div className='leftHeader'>
                            <div className='headerTitle'>检核表（{treeData.length || 0}）</div>
                        </div>
                        <div className='HideScroll tableArea' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                            {taskDetail.tableCount || isTreeSearch ? (
                                <div>
                                    {treeData.length || isTreeSearch ? (
                                        <div>
                                            <div className='searchGroup'>
                                                <span className='icon-sousuo iconfont'></span>
                                                <Input.Search onSearch={this.treeSearch} value={treeQueryInfo.tableName} onChange={this.changeTreeKeyword} placeholder='输入表名，回车搜索' />
                                                <span className={showFilter ? 'showFilter filterIcon' : 'filterIcon'}>
                                                    <span onClick={() => this.setState({ showFilter: !showFilter })} className='iconfont icon-Filter'></span>
                                                    {datasourceIds.length || treeQueryInfo.status !== undefined || treeQueryInfo.lastCheckStatus ? <span className='statusDot'></span> : null}
                                                </span>
                                                {showFilter ? (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Cascader
                                                            allowClear
                                                            changeOnSelect
                                                            fieldNames={{ label: 'name', value: 'id' }}
                                                            options={datasourceInfo}
                                                            value={datasourceIds}
                                                            onChange={this.changeTreeSelect.bind(this, 'datasourceIds')}
                                                            popupClassName='searchCascader'
                                                            placeholder='路径选择'
                                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                            style={{ width: '100%' }}
                                                        />
                                                        <Select
                                                            allowClear
                                                            onChange={this.changeTreeSelect.bind(this, 'lastCheckStatus')}
                                                            value={treeQueryInfo.lastCheckStatus}
                                                            placeholder='执行结果'
                                                            style={{ width: '100%', marginTop: 8 }}
                                                        >
                                                            {_.map(lastStatusMap, (node, index) => {
                                                                return (
                                                                    <Select.Option key={index} value={index}>
                                                                        {node}
                                                                    </Select.Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        <Select
                                                            allowClear
                                                            placeholder='表状态'
                                                            value={treeQueryInfo.status}
                                                            onChange={this.changeTreeSelect.bind(this, 'status')}
                                                            style={{ width: '100%', marginTop: 8 }}
                                                        >
                                                            <Select.Option key={1} value={1}>
                                                                激活
                                                            </Select.Option>
                                                            <Select.Option key={0} value={0}>
                                                                挂起
                                                            </Select.Option>
                                                        </Select>
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
                                                                    className={
                                                                        selectedTable.tableId == item.tableId
                                                                            ? item.lastCheckStatus == 4
                                                                                ? 'tableItemFailed tableItem tableItemFailedSelected'
                                                                                : 'tableItem tableItemSelected'
                                                                            : item.lastCheckStatus == 4
                                                                            ? 'tableItemFailed tableItem'
                                                                            : 'tableItem'
                                                                    }
                                                                >
                                                                    <div>
                                                                        <span className='treeName'>
                                                                            <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-biaodanzujian-biaoge'></span>
                                                                            {item.tableNameEn}
                                                                        </span>
                                                                        <span className='treeCount'>{item.ruleCount || 0}</span>
                                                                    </div>
                                                                    <div style={{ color: '#5E6266' }}>
                                                                        <span className='treeName'>
                                                                            <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-ku'></span>
                                                                            {item.databaseNameEn}
                                                                        </span>
                                                                    </div>
                                                                    <div className='rate'>
                                                                        {item.lastCheckStatus == 4 ? (
                                                                            <div className='treeName' style={{ color: '#CC0000', fontSize: '12px' }}>
                                                                                执行失败
                                                                            </div>
                                                                        ) : (
                                                                            <div className='treeName' style={{ height: '32px' }}>
                                                                                <div style={{ marginBottom: 4, fontSize: '12px' }}>
                                                                                    <span style={{ color: '#5E6266', marginRight: 12 }}>规则通过率</span>
                                                                                    {item.lastPassRate || 0}%
                                                                                </div>
                                                                                <Progress showInfo={false} percent={item.lastPassRate || 0} size='small' />
                                                                            </div>
                                                                        )}
                                                                        <div className='star'>
                                                                            {item.isFocus ? (
                                                                                <img onClick={this.changeSubscribe.bind(this, index, 0)} src={require('app_images/star_fill.svg')} />
                                                                            ) : (
                                                                                <img onClick={this.changeSubscribe.bind(this, index, 1)} src={require('app_images/star_line.svg')} />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <span className={item.status ? 'triangle' : 'triangle greyTriangle'}></span>
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
                                                <div style={{ color: '#5E6266' }}>任务暂未执行</div>
                                            </Empty>
                                        </Spin>
                                    )}
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
                                        <div style={{ color: '#5E6266' }}>
                                            你可以前往 <a onClick={this.changeTab}>检核规则</a> 添加
                                        </div>
                                    </Empty>
                                </Spin>
                            )}
                        </div>
                        <div className='leftFooter'>
                            <span style={{ marginRight: 24 }}>
                                <span className='statusDot' style={{ background: '#4471F3' }}></span>成功 {successTableCount}
                            </span>
                            <span>
                                <span style={{ background: '#CC0000' }} className='statusDot'></span>失败 {failedTableCount}
                            </span>
                        </div>
                    </div>
                    {selectedTable.tableId ? (
                        <main>
                            <div className='ContentContainer'>
                                <div className='contentHeader'>
                                    <span className='tableName'>
                                        {selectedTable.tableNameEn} {selectedTable.tableName}
                                    </span>
                                    <span className={selectedTable.status ? 'activeStatus' : 'sleepStatus'}>
                                        <span className='statusDot'></span>
                                        {selectedTable.status ? '已激活' : '已挂起'}
                                    </span>
                                    <div className='headerTab'>
                                        <div className={resultTabValue == 1 ? 'tabSelected tabItem' : 'tabItem'} onClick={this.changeResultTab.bind(this, '1')}>
                                            最新结果
                                        </div>
                                        <Divider style={{ margin: '0 8px' }} type='vertical' />
                                        <div className={resultTabValue == 2 ? 'tabSelected tabItem' : 'tabItem'} onClick={this.changeResultTab.bind(this, '2')}>
                                            历史记录
                                        </div>
                                    </div>
                                </div>
                                <div className='tableContent commonScroll'>
                                    {resultTabValue == 1 ? (
                                        <div>
                                            {selectedTable.lastCheckStatus !== 4 ? (
                                                <div>
                                                    <div className='tableInfo'>
                                                        <ModuleTitle title='执行参数' />
                                                        <div className='MiniForm Grid4'>
                                                            {RenderUtil.renderFormItems([
                                                                {
                                                                    label: '检核时间',
                                                                    content: selectedTable.lastCheckTime ? moment(selectedTable.lastCheckTime).format('YYYY-MM-DD HH:mm:ss') : '',
                                                                },
                                                                {
                                                                    label: '检核时间范围',
                                                                    content: selectedTable.checkRangeTimeView,
                                                                    hide: !selectedTable.checkRangeTimeView || selectedTable.checkRangeTimeView === '全量',
                                                                },
                                                                {
                                                                    label: '执行结果',
                                                                    content: (
                                                                        <div>
                                                                            {selectedTable.lastCheckStatus == 0 ? <StatusLabel type='info' message='新创建' /> : null}
                                                                            {selectedTable.lastCheckStatus == 1 ? <StatusLabel type='warning' message='等待执行' /> : null}
                                                                            {selectedTable.lastCheckStatus == 2 ? <StatusLabel type='loading' message='正在执行' /> : null}
                                                                            {selectedTable.lastCheckStatus == 3 ? <StatusLabel type='success' message='执行成功' /> : null}
                                                                            {selectedTable.lastCheckStatus == 4 ? <StatusLabel type='error' message='执行失败' /> : null}
                                                                            {selectedTable.lastCheckStatus == 5 ? <StatusLabel type='info' message='系统中止' /> : null}
                                                                        </div>
                                                                    ),
                                                                },
                                                            ])}
                                                        </div>
                                                    </div>
                                                    <div className='tableInfo'>
                                                        <ModuleTitle style={{ display: 'inline-block', marginBottom: 24 }} title='规则结果' />
                                                        <Tabs animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                                            <TabPane key='0' tab={
                                                                <span>字段规则&nbsp;
                                                                    {
                                                                        columnRuleInfo.columnRuleWrongNum ?
                                                                            <span>
                                                                                <span style={{ color: '#CC0000', marginLeft: '8px' }}>{columnRuleInfo.columnRuleWrongNum}</span>
                                                                                <span style={{ margin: '0 2px' }}>/</span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                     {columnRuleInfo.columnRuleNum}</span>}>
                                                                {
                                                                    tabValue == 0 ?
                                                                        <RichTableLayout
                                                                            disabledDefaultFooter
                                                                            smallLayout
                                                                            editColumnProps={{
                                                                                width: 120,
                                                                                createEditColumnElements: (_, record) => {
                                                                                    if (record.sqlSource === 2) {
                                                                                        return []
                                                                                    }
                                                                                    return [
                                                                                        <a onClick={this.openErrorLogModal.bind(this, record)} key='edit'>
                                                                                            错误记录
                                                                                        </a>,
                                                                                    ]
                                                                                },
                                                                            }}
                                                                            tableProps={{
                                                                                columns: this.columns,
                                                                                key: 'taskResultId',
                                                                                dataSource: tableData,
                                                                                extraTableProps: {
                                                                                    key: selectedTable.tableId,
                                                                                    scroll: {
                                                                                        x: 1300,
                                                                                    },
                                                                                },
                                                                            }}
                                                                            renderSearch={(controller) => {
                                                                                this.controller = controller
                                                                                return (
                                                                                    <React.Fragment>
                                                                                        <Input.Search
                                                                                            allowClear
                                                                                            value={queryInfo.keyword}
                                                                                            onChange={this.changeKeyword}
                                                                                            onSearch={this.search}
                                                                                            placeholder='请输入检核字段、规则名称'
                                                                                        />
                                                                                        <Select
                                                                                            allowClear
                                                                                            onChange={this.changeStatus.bind(this, 'severityLevel')}
                                                                                            value={queryInfo.severityLevel}
                                                                                            placeholder='问题级别'
                                                                                        >
                                                                                            <Option value={1} key={1}>
                                                                                                普通
                                                                                            </Option>
                                                                                            <Option value={2} key={2}>
                                                                                                严重
                                                                                            </Option>
                                                                                        </Select>
                                                                                        <Select allowClear onChange={this.changeStatus.bind(this, 'checkResult')} value={queryInfo.checkResult} placeholder='检核结果'>
                                                                                            <Option value={true} key={1}>
                                                                                                通过
                                                                                            </Option>
                                                                                            <Option value={false} key={0}>
                                                                                                未通过
                                                                                            </Option>
                                                                                        </Select>
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
                                                                        : null
                                                                }
                                                            </TabPane>
                                                            <TabPane key='1' tab={
                                                                <span>表规则&nbsp;
                                                                    {
                                                                        tableRuleInfo.tableRuleWrongNum ?
                                                                            <span>
                                                                                <span style={{ color: '#CC0000', marginLeft: '8px' }}>{tableRuleInfo.tableRuleWrongNum}</span>
                                                                                <span style={{ margin: '0 2px' }}>/</span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                     {tableRuleInfo.tableRuleNum}</span>}>
                                                                {
                                                                    tabValue == 1 ?
                                                                        <RichTableLayout
                                                                            disabledDefaultFooter
                                                                            smallLayout
                                                                            editColumnProps={{
                                                                                width: 120,
                                                                                createEditColumnElements: (_, record) => {
                                                                                    return [
                                                                                        <a onClick={this.openTableResultModal.bind(this, record)} key='edit'>
                                                                                            检核结果
                                                                                        </a>,
                                                                                    ]
                                                                                },
                                                                            }}
                                                                            tableProps={{
                                                                                columns: this.tableColumns,
                                                                                key: 'taskResultId',
                                                                                dataSource: tableRuleData,
                                                                                extraTableProps: {
                                                                                    key: selectedTable.tableId,
                                                                                    scroll: {
                                                                                        x: 1300,
                                                                                    },
                                                                                },
                                                                            }}
                                                                            renderSearch={(controller) => {
                                                                                this.controller = controller
                                                                                return (
                                                                                  <React.Fragment>
                                                                                    <Input.Search
                                                                                      allowClear
                                                                                      value={queryInfo.keyword}
                                                                                      onChange={this.changeKeyword}
                                                                                      onSearch={this.search}
                                                                                      placeholder='请输入检核表、规则名称'
                                                                                    />
                                                                                    <Select
                                                                                      allowClear
                                                                                      onChange={this.changeStatus.bind(this, 'severityLevel')}
                                                                                      value={queryInfo.severityLevel}
                                                                                      placeholder='问题级别'
                                                                                    >
                                                                                      <Option value={1} key={1}>
                                                                                        普通
                                                                                      </Option>
                                                                                      <Option value={2} key={2}>
                                                                                        严重
                                                                                      </Option>
                                                                                    </Select>
                                                                                    <Select allowClear onChange={this.changeStatus.bind(this, 'checkResult')} value={queryInfo.checkResult} placeholder='检核结果'>
                                                                                      <Option value={true} key={1}>
                                                                                        通过
                                                                                      </Option>
                                                                                      <Option value={false} key={0}>
                                                                                        未通过
                                                                                      </Option>
                                                                                    </Select>
                                                                                    <Button onClick={this.reset}>重置</Button>
                                                                                  </React.Fragment>
                                                                                )
                                                                            }}
                                                                            requestListFunction={(page, pageSize, filter, sorter) => {
                                                                                return this.getTableRuleList({
                                                                                    pagination: {
                                                                                        page,
                                                                                        page_size: pageSize,
                                                                                    },
                                                                                    sorter: sorter || {},
                                                                                })
                                                                            }}
                                                                        />
                                                                        : null
                                                                }
                                                            </TabPane>
                                                        </Tabs>
                                                    </div>
                                                </div>
                                            ) : (
                                                <ErrorResultPage getLeftTreeData={this.getLeftTreeData} ref={(dom) => (this.errorResultPage = dom)} />
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <HistoryRecordPage ref={(dom) => (this.historyRecordPage = dom)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    ) : (
                        <div style={{ width: '100%', marginTop: 170 }}>
                            <EmptyIcon description='暂无数据，请先完善检核信息' />
                        </div>
                    )}
                    <ErrorLogDrawer ref={(dom) => (this.errorLogDrawer = dom)} />
                    <TableResultDrawer ref={(dom) => (this.tableResultDrawer = dom)} />
                </div>
            </div>
        )
    }
}
