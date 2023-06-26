// 检核规则
import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'
import RenderUtil from '@/utils/RenderUtil'
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Cascader, Dropdown, Empty, Input, Menu, message, Modal, Popover, Select, Spin, Switch, Tabs, Tooltip } from 'antd'
import {
    batchRunTest,
    changeTableStatus,
    changeTechRuleStatus,
    checkRuleTree,
    deleteRuleList,
    queryRuleOverview,
    queryTableSource,
    removeTableFromTaskGroup,
    taskGroupTableList,
    techRuleList,
} from 'app_api/examinationApi'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { format } from 'sql-formatter'
import '../../index.less'
import store from '../../store'
import AddCheckTableDrawer from './addCheckTableDrawer'
import AddRuleDrawer from './addRuleDrawer'
import styles from './checkRule.module.less'
import TermParamsDrawer from './termParamsDrawer'

const TabPane = Tabs.TabPane

@observer
export default class CheckRuleTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSearch: false,
            isTreeSearch: false,
            treeQueryInfo: {
                tableName: '',
            },
            treeData: [],
            activeTableCount: 0,
            hangTableCount: 0,
            queryInfo: {
                keyword: '',
                ruleTypeIds: [],
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
            tabValue: '0',
            tableRuleData: [],
            tableTotal: 0,
            tableTypeList: [],
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
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
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '规则类型',
                dataIndex: 'ruleTypePath',
                key: 'ruleTypePath',
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
                title: '实现方式',
                dataIndex: 'sqlSource',
                key: 'sqlSource',
                width: 100,
                render: (text, record) => (text !== undefined ? <span>{text === 1 ? '模板' : text === 2 ? '存储过程' : '自定义'}</span> : <EmptyLabel />),
            },
            {
                title: '规则状态',
                dataIndex: 'status',
                key: 'status',
                width: 110,
                sorter: true,
                render: (text, record, index) => (
                    <div>
                        <Switch
                            onChange={this.changeRuleStatus.bind(this, record, index)}
                            disabled={!PermissionManage.hasFuncPermission('/dqm/checkTask/detail/CheckRuleTab/switchStatus')}
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={text == 1}
                        />
                    </div>
                ),
            },
            {
                title: '试跑结果',
                dataIndex: 'testResult',
                key: 'testResult',
                width: 120,
                render: (text, record) => {
                    if (record.sqlSource === 2) {
                        return '-'
                    }
                    return text !== undefined ? (
                        <div>
                            {text == 0 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#C4C8CC' }}></span>未试跑
                                </span>
                            ) : null}
                            {text == 1 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#28AE52' }}></span>试跑成功
                                </span>
                            ) : null}
                            {text == 2 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#CC0000' }}></span>试跑失败
                                    {/* <Popover trigger='click' content={<div style={{ width: 300, wordBreak: 'break-word' }}>{record.testInfo}</div>}> */}
                                    <FileTextOutlined
                                        style={{ cursor: 'pointer', marginLeft: 8, color: '#5B7FA3', fontSize: '16px' }}
                                        onClick={() => {
                                            this.setState({
                                                displayErrorInfo: record.testInfoDetail,
                                            })
                                        }}
                                    />
                                    {/* </Popover> */}
                                </span>
                            ) : null}
                            {text == 3 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#FF9900' }}></span>试跑中...
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
        ]
        this.tableColumns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '规则类型',
                dataIndex: 'ruleTypePath',
                key: 'ruleTypePath',
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
                title: '实现方式',
                dataIndex: 'sqlSource',
                key: 'sqlSource',
                width: 80,
                render: (text, record) => (text !== undefined ? <span>{text === 1 ? '模板' : text === 2 ? '存储过程' : '自定义'}</span> : <EmptyLabel />),
            },
            {
                title: '规则状态',
                dataIndex: 'status',
                key: 'status',
                width: 110,
                sorter: true,
                render: (text, record, index) => (
                    <div>
                        <Switch
                            onChange={this.changeRuleStatus.bind(this, record, index)}
                            disabled={!PermissionManage.hasFuncPermission('/dqm/checkTask/detail/CheckRuleTab/switchStatus')}
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={text == 1}
                        />
                    </div>
                ),
            },
            {
                title: '试跑结果',
                dataIndex: 'testResult',
                key: 'testResult',
                width: 100,
                render: (text, record) => {
                    if (record.sqlSource === 2) {
                        return '-'
                    }
                    return text !== undefined ? (
                        <div>
                            {text == 0 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#C4C8CC' }}></span>未试跑
                                </span>
                            ) : null}
                            {text == 1 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#28AE52' }}></span>试跑成功
                                </span>
                            ) : null}
                            {text == 2 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#CC0000' }}></span>试跑失败
                                    <Popover trigger='click' content={<div style={{ width: 300, wordBreak: 'break-word' }}>{record.testInfo}</div>}>
                                        <FileTextOutlined style={{ cursor: 'pointer', marginLeft: 8, color: '#5B7FA3', fontSize: '16px' }} />
                                    </Popover>
                                </span>
                            ) : null}
                            {text == 3 ? (
                                <span>
                                    <span className='statusDot' style={{ background: '#FF9900' }}></span>试跑中...
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
        ]
    }
    componentDidMount = async () => {
        this.getRuleTree()
        this.refresh()
    }
    refresh = async () => {
        store.getDetail()
        this.setState({ isTreeSearch: false })
        this.getSearchCondition()
        this.onSelectTable()
    }
    onSelectTable = async () => {
        await this.getLeftTreeData()
        let { treeData } = this.state
        let { selectedTable } = store
        if (selectedTable.tableId) {
            this.onSelect(selectedTable)
        } else {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
        this.props.getNewDisplayData()
    }
    selectTableReset = () => {
        let { treeData } = this.state
        this.onSelect(treeData.length ? treeData[0] : {})
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            let data = this.deleteSubList(res.data.children)
            this.setState({
                typeList: this.getTypeList(data, 1),
                tableTypeList: this.getTypeList(data, 2),
            })
        }
    }
    getTypeList = (data, type) => {
        let newTree = data.filter((x) => x.type == type)
        newTree.forEach((x) => x.children && (x.chlidren = this.getTypeList(x.children, type)))
        return newTree
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
    changeRuleStatus = async (data, index) => {
        let { tableData } = this.state
        let query = {
            techRuleId: data.id,
            status: data.status == 1 ? 0 : 1,
        }
        let res = await changeTechRuleStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].status = query.status
            this.setState({
                tableData,
            })
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
    getLeftTreeData = async () => {
        let { treeQueryInfo, datasourceIds } = this.state
        const { selectedTaskInfo } = store
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
            this.setState({
                treeData: res.data.qaTaskList,
                activeTableCount: res.data.activeTableCount,
                hangTableCount: res.data.hangTableCount,
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
        // if (!e.target.value) {
        //     this.treeSearch()
        // }
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
        console.log(data, 'onSelect')
        // await this.setState({
        //     selectedTable: data
        // })
        await store.onSelectedTable(data)
        await this.getQueryRuleOverview()
        this.reset()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            ruleTypeIds: [],
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
        if (!selectedTable.tableId) {
            return
        }
        let query = {
            tableId: selectedTable.tableId,
            tsTaskId: selectedTable.lastCheckTaskId,
        }
        let res = await queryRuleOverview(query)
        if (res.code == 200) {
            this.setState({
                total: res.data.columnRuleNum,
                tableTotal: res.data.tableRuleNum,
                tabValue: res.data.columnRuleNum ? '0' : '1',
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        let { selectedTable } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            tableId: selectedTable.tableId,
            validBizRuleFlag: true,
            orderByStatus: params.sorter.field == 'status' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            ruleLevel: parseInt(tabValue),
        }
        let res = await techRuleList(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                // total: res.total,
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
        await this.setState({
            queryInfo,
            isSearch: true,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
            isSearch: true,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    openAddTableModal = () => {
        this.addCheckTableDrawer && this.addCheckTableDrawer.openModal()
    }
    onClickMenu = (data, e) => {
        this.deleteTreeData(data)
    }
    deleteTreeData = (data) => {
        const { selectedTaskInfo } = store
        let that = this
        Modal.confirm({
            title: '删除检核表',
            content: data.ruleCount ? '删除检核表，同时删除该项下所有检核规则，确定删除吗？' : '确定删除该检核表吗？',
            okText: '删除',
            okButtonProps: {
                danger: true,
            },
            cancelText: '取消',
            async onOk() {
                let res = await removeTableFromTaskGroup({ tableId: data.tableId, taskGroupId: selectedTaskInfo.taskGroupId })
                if (res.code == 200) {
                    message.success('操作成功')
                    await store.onSelectedTable({})
                    // await that.setState({selectedTable: {}})
                    that.refresh()
                }
            },
        })
    }
    deleteRule = (data) => {
        let that = this
        Modal.confirm({
            title: '删除规则',
            content: '您确定删除检核规则吗？',
            okText: '删除',
            okButtonProps: {
                danger: true,
            },
            cancelText: '取消',
            async onOk() {
                let res = await deleteRuleList([data.id])
                if (res.code == 200) {
                    message.success('操作成功')
                    that.onSelectTable()
                }
            },
        })
    }
    changeStatusSwitch = async () => {
        let { treeData, activeTableCount, hangTableCount } = this.state
        let {
            selectedTable,
            taskDetail: { checkRangeTimeView, timePeriod },
        } = store
        let query = {
            taskId: selectedTable.id,
            status: selectedTable.status == 1 ? 0 : 1,
        }
        const taskFlag = Boolean(selectedTable.rangeColumnId && checkRangeTimeView && !timePeriod.isInitData)
        const conditionFlag = Boolean(checkRangeTimeView === '全量' && !timePeriod.isInitData)
        console.log('query.status == 1 && (!taskFlag || !conditionFlag)', query.status == 1 && !(taskFlag || conditionFlag))
        if (query.status == 1 && !(taskFlag || conditionFlag)) {
            if (!checkRangeTimeView || timePeriod.isInitData) {
                return message.info(`请先设置任务参数后再开启核检表状态`)
            }
            return message.info(`请先设置条件参数后再开启核检表状态`)
        }
        let res = await changeTableStatus(query)
        if (res.code == 200) {
            message.success(query.status == 1 ? '检核表已激活' : '检核表已挂起')
            selectedTable.status = query.status
            treeData.map((item) => {
                if (item.id == selectedTable.id) {
                    item.status = query.status
                }
            })
            activeTableCount = 0
            hangTableCount = 0
            treeData.map((item) => {
                if (item.status) {
                    activeTableCount++
                } else {
                    hangTableCount++
                }
            })
            this.setState({
                // selectedTable,
                treeData,
                activeTableCount,
                hangTableCount,
            })
            store.onSelectedTable(selectedTable)
        }
    }
    testRun = async (data) => {
        const { selectedTaskInfo, selectedTable } = store
        let query = {
            techRuleList: [],
            taskGroupId: selectedTaskInfo.taskGroupId,
            tableId: selectedTable.tableId,
        }
        data.map((item) => {
            query.techRuleList.push(item.id)
        })
        if (!query.techRuleList.length) {
            message.info('暂无数据')
            return
        }
        let res = await batchRunTest(query)
        if (res.code == 200) {
            message.success('试跑完成')
            this.search()
        }
    }
    openEditModal = (data, type, ruleLevel) => {
        let { selectedTable } = store
        this.addRuleDrawer && this.addRuleDrawer.openModal(selectedTable, type, data, ruleLevel)
    }
    openLogDrawer = (data) => {
        this.setState({
            logModalVisible: true,
        })
    }
    cancel = () => {
        this.setState({
            logModalVisible: false,
        })
    }
    openTermsModal = () => {
        let { selectedTable } = store
        this.termParamsDrawer && this.termParamsDrawer.openModal(selectedTable) // 传入条件参数
    }
    addParamsInfo = (data) => {
        let { selectedTable } = store
        let { treeData } = this.state
        selectedTable.rangeColumnId = data.rangeColumnId
        selectedTable.rangeColumnName = data.rangeColumnName
        selectedTable.timeFormula = data.timeFormula
        store.onSelectedTable(selectedTable)
        treeData.map((item) => {
            if (item.tableId == selectedTable.tableId) {
                item.rangeColumnId = data.rangeColumnId
                item.rangeColumnName = data.rangeColumnName
                item.timeFormula = data.timeFormula
            }
        })
        this.setState({
            treeData,
        })
    }
    onChangeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        this.reset()
    }
    render() {
        const { selectedTaskInfo, selectedTable, taskDetail } = store
        const {
            displayErrorInfo,
            treeData,
            treeLoading,
            isTreeSearch,
            treeQueryInfo,
            showFilter,
            datasourceIds,
            datasourceInfo,
            isSearch,
            queryInfo,
            typeList,
            tableData,
            total,
            logModalVisible,
            logList,
            activeTableCount,
            hangTableCount,
            tabValue,
            tableTotal,
            tableTypeList,
        } = this.state

        const menu = (data) => (
            <Menu style={{ width: 132 }} onClick={this.onClickMenu.bind(this, data)}>
                <Menu.Item key='1'>
                    <span style={{ color: '#CC0000' }}>删除</span>
                </Menu.Item>
            </Menu>
        )
        const btnMenu = (
            <Menu>
                <Menu.Item key='1' onClick={this.openEditModal.bind(this, {}, 'add', 0)}>
                    <PermissionWrap funcCode='/dqm/bizrules/manage/export'>
                        <span onClick={this.openEditModal.bind(this, {}, 'add', 0)}>字段规则</span>
                    </PermissionWrap>
                </Menu.Item>
                <Menu.Item key='2' onClick={this.openEditModal.bind(this, {}, 'add', 1)}>
                    <PermissionWrap funcCode='/dqm/bizrules/manage/upload'>
                        <span onClick={this.openEditModal.bind(this, {}, 'add', 1)}>表规则</span>
                    </PermissionWrap>
                </Menu.Item>
            </Menu>
        )

        const visibleErrorModel = Boolean(displayErrorInfo)
        return (
            <div className='checkRule'>
                <div className='sliderLayout'>
                    <div className='slider'>
                        <div className='leftHeader'>
                            <div className='headerTitle'>
                                检核表（{taskDetail.tableCount || 0}）
                                <Tooltip title='新增表'>
                                    <PlusOutlined onClick={this.openAddTableModal} />
                                </Tooltip>
                            </div>
                        </div>
                        <div className='HideScroll tableArea' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                            {taskDetail.tableCount || isTreeSearch ? (
                                <div>
                                    <div className='searchGroup'>
                                        <span className='icon-sousuo iconfont'></span>
                                        <Input.Search onSearch={this.treeSearch} value={treeQueryInfo.tableName} onChange={this.changeTreeKeyword} placeholder='输入表名，回车搜索' />
                                        <span className={showFilter ? 'showFilter filterIcon' : 'filterIcon'}>
                                            <span onClick={() => this.setState({ showFilter: !showFilter })} className='iconfont icon-Filter'></span>
                                            {datasourceIds.length || treeQueryInfo.status !== undefined ? <span className='statusDot'></span> : null}
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
                                                {treeData.map((item) => {
                                                    return (
                                                        <div onClick={this.onSelect.bind(this, item)} className={selectedTable.tableId == item.tableId ? 'tableItem tableItemSelected' : 'tableItem'}>
                                                            <div>
                                                                <span className='treeName'>
                                                                    <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-biao1'></span>
                                                                    {item.name}
                                                                </span>
                                                                <span className='treeCount'>
                                                                    {item.ruleCount || 0}
                                                                    {item.isHaveFailedTest ? <span className='statusDot'></span> : null}
                                                                </span>
                                                            </div>
                                                            <div style={{ color: '#5E6266' }}>
                                                                <span className='treeName'>
                                                                    <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-ku'></span>
                                                                    {item.databaseNameEn}
                                                                </span>
                                                                <span onClick={(e) => e.stopPropagation()}>
                                                                    <Dropdown overlay={menu(item)} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                                                        <span className='iconfont icon-more'></span>
                                                                    </Dropdown>
                                                                </span>
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
                                        <div style={{ color: '#5E6266' }}>
                                            你可以 <a onClick={this.openAddTableModal}>添加表</a>
                                        </div>
                                    </Empty>
                                </Spin>
                            )}
                        </div>
                        <div className='leftFooter'>
                            <span style={{ marginRight: 24 }}>
                                <span className='statusDot'></span>激活 {activeTableCount}
                            </span>
                            <span>
                                <span style={{ background: '#E6E8ED' }} className='statusDot'></span>挂起 {hangTableCount}
                            </span>
                        </div>
                    </div>
                    {selectedTable.tableId ? (
                        <main>
                            <div className='ContentContainer'>
                                <div className='contentHeader'>
                                    <span className='tableName'>
                                        {selectedTable.name} {selectedTable.cname}
                                    </span>
                                    <Switch onChange={this.changeStatusSwitch} checkedChildren='激活' unCheckedChildren='挂起' checked={selectedTable.status == 1} />
                                </div>
                                <div className='tableContent commonScroll'>
                                    <div className='tableInfo'>
                                        <ModuleTitle
                                            title={
                                                <div>
                                                    基本信息
                                                    {/*<a className='titleBtn'>修改</a>*/}
                                                </div>
                                            }
                                        />
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '技术路径',
                                                    content: (
                                                        <div style={{ wordBreak: 'break-all' }}>
                                                            {selectedTable.datasourceName + (selectedTable.databaseNameEn ? '/' + selectedTable.databaseNameEn : '')}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    label: '数据库类型',
                                                    content: selectedTable.datasourceType,
                                                },
                                                {
                                                    label: '主键',
                                                    content: selectedTable.primaryKeys,
                                                },
                                                {
                                                    label: '分区',
                                                    content: selectedTable.partitionKeys,
                                                },
                                            ])}
                                        </div>
                                    </div>
                                    <div className='tableInfo'>
                                        {/*有条件参数时显示修改*/}
                                        <ModuleTitle
                                            title={
                                                <div>
                                                    条件参数
                                                    <a onClick={this.openTermsModal} className='titleBtn'>
                                                        设置
                                                    </a>
                                                </div>
                                            }
                                        />
                                        {selectedTable.rangeColumnId ? (
                                            <div className='MiniForm Grid4'>
                                                {RenderUtil.renderFormItems([
                                                    {
                                                        label: '时间字段',
                                                        content: selectedTable.rangeColumnName,
                                                    },
                                                    {
                                                        label: '时间表达式',
                                                        content: selectedTable.timeFormula,
                                                    },
                                                ])}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#C4C8CC' }}>必填项，点击上方设置</div>
                                        )}
                                    </div>
                                    <div className='tableInfo'>
                                        <ModuleTitle style={{ display: 'inline-block', marginBottom: 24 }} title='规则信息' />
                                        <div className='btnRight'>
                                            <PermissionWrap funcCode='/dqm/checkTask/detail/CheckRuleTab/testRun'>
                                                <Button disabled={!tableTotal && !total} onClick={this.testRun.bind(this, tableData)} type='primary' ghost style={{ marginRight: 8 }}>
                                                    一键试跑
                                                </Button>
                                            </PermissionWrap>
                                            <PermissionWrap funcCode='/dqm/checkTask/detail/CheckRuleTab/add'>
                                                <Dropdown overlay={btnMenu}>
                                                    <Button type='primary'>
                                                        添加规则
                                                        <span style={{ marginLeft: '8px', lineHeight: '16px' }} className='iconfont icon-xiangxia'></span>
                                                    </Button>
                                                </Dropdown>
                                            </PermissionWrap>
                                        </div>
                                        {tableTotal && total ? (
                                            <Tabs animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                                <TabPane
                                                    key='0'
                                                    tab={
                                                        <span>
                                                            字段规则<span style={{ marginLeft: '8px' }}>{total}</span>
                                                        </span>
                                                    }
                                                ></TabPane>
                                                <TabPane
                                                    key='1'
                                                    tab={
                                                        <span>
                                                            表规则<span style={{ marginLeft: '8px' }}>{tableTotal}</span>
                                                        </span>
                                                    }
                                                ></TabPane>
                                            </Tabs>
                                        ) : null}
                                        <RichTableLayout
                                            disabledDefaultFooter
                                            smallLayout
                                            editColumnProps={{
                                                width: 140,
                                                createEditColumnElements: (_, record) => {
                                                    const editColumns = []
                                                    if (PermissionManage.hasFuncPermission('/dqm/checkTask/detail/CheckRuleTab/testRun') && (record.sqlSource !== 2 || tabValue == 0)) {
                                                        editColumns.push(
                                                            <a onClick={this.testRun.bind(this, [record])} key='edit'>
                                                                试跑
                                                            </a>
                                                        )
                                                    }
                                                    if (PermissionManage.hasFuncPermission('/dqm/checkTask/detail/CheckRuleTab/edit')) {
                                                        editColumns.push(
                                                            <a onClick={this.openEditModal.bind(this, record, 'edit', tabValue == 0 ? 0 : 1)} key='edit'>
                                                                修改
                                                            </a>
                                                        )
                                                    }
                                                    if (PermissionManage.hasFuncPermission('/dqm/checkTask/detail/CheckRuleTab/delete')) {
                                                        editColumns.push(
                                                            <a onClick={this.deleteRule.bind(this, record)} key='edit'>
                                                                删除
                                                            </a>
                                                        )
                                                    }
                                                    return editColumns
                                                },
                                            }}
                                            tableProps={{
                                                columns: tabValue == 0 ? this.columns : this.tableColumns,
                                                key: 'id',
                                                dataSource: tableData,
                                                extraTableProps: {
                                                    scroll: {
                                                        x: 1200,
                                                    },
                                                },
                                            }}
                                            renderSearch={(controller) => {
                                                this.controller = controller
                                                return (
                                                    <React.Fragment>
                                                        {tabValue == 0 ? (
                                                            <Input.Search
                                                                allowClear
                                                                value={queryInfo.keyword}
                                                                onChange={this.changeKeyword}
                                                                onSearch={this.search}
                                                                placeholder='请输入检核字段、规则名称'
                                                            />
                                                        ) : null}
                                                        <Cascader
                                                            allowClear
                                                            expandTrigger='hover'
                                                            fieldNames={{ label: 'name', value: 'id' }}
                                                            value={queryInfo.ruleTypeIds}
                                                            options={tabValue == 0 ? typeList : tableTypeList}
                                                            style={{ width: 160 }}
                                                            onChange={this.changeStatus.bind(this, 'ruleTypeIds')}
                                                            // displayRender={(label) => label[label.length - 1]}
                                                            displayRender={(e) => e.join('-')}
                                                            popupClassName='searchCascader'
                                                            placeholder='规则分类'
                                                        />
                                                        <Select allowClear onChange={this.changeStatus.bind(this, 'sqlSource')} value={queryInfo.sqlSource} placeholder='规则模板'>
                                                            <Select.Option key={0} value={0}>
                                                                自定义
                                                            </Select.Option>
                                                            <Select.Option key={1} value={1}>
                                                                模板
                                                            </Select.Option>
                                                            <Select.Option key={2} value={2}>
                                                                存储过程
                                                            </Select.Option>
                                                        </Select>
                                                        {tabValue == 0 ? (
                                                            <Select allowClear onChange={this.changeStatus.bind(this, 'testResult')} value={queryInfo.testResult} placeholder='试跑结果'>
                                                                <Select.Option key={0} value={0}>
                                                                    未试跑
                                                                </Select.Option>
                                                                <Select.Option key={1} value={1}>
                                                                    试跑成功
                                                                </Select.Option>
                                                                <Select.Option key={2} value={2}>
                                                                    试跑失败
                                                                </Select.Option>
                                                                <Select.Option key={3} value={3}>
                                                                    试跑中
                                                                </Select.Option>
                                                            </Select>
                                                        ) : null}
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
                                        {/*{*/}
                                        {/*total || isSearch ?*/}
                                        {/**/}
                                        {/*:*/}
                                        {/*<EmptyIcon description='暂无数据，请点击右上角 添加规则' />*/}
                                        {/*}*/}
                                    </div>
                                </div>
                            </div>
                        </main>
                    ) : (
                        <div style={{ width: '100%', marginTop: 170 }}>
                            <EmptyIcon description='暂无内容，请先在左侧添加检核表' />
                        </div>
                    )}
                    <AddCheckTableDrawer refresh={this.refresh} ref={(dom) => (this.addCheckTableDrawer = dom)} />
                    <TermParamsDrawer addParamsInfo={this.addParamsInfo} ref={(dom) => (this.termParamsDrawer = dom)} />
                    <AddRuleDrawer onSelectTable={this.onSelectTable} ref={(dom) => (this.addRuleDrawer = dom)} />
                    <DrawerLayout
                        drawerProps={{
                            className: 'logDrawer',
                            title: '日志详情',
                            width: 640,
                            visible: logModalVisible,
                            onClose: this.cancel,
                            maskClosable: true,
                        }}
                    >
                        {logModalVisible && (
                            <React.Fragment>
                                <div>
                                    <div className='logArea'>
                                        {logList.map((item) => {
                                            return (
                                                <div className='logItem'>
                                                    <div className='logContent'>{item}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </DrawerLayout>
                </div>
                <Modal width={800} visible={visibleErrorModel} title='试跑日志' footer={null} onCancel={() => this.setState({ displayErrorInfo: undefined })}>
                    <div className={styles.ErrorWrap}>
                        {visibleErrorModel &&
                            [
                                {
                                    title: '错误信息',
                                    content: displayErrorInfo.testInfo,
                                },
                                {
                                    title: '检核SQL',
                                    content: displayErrorInfo.wrongSqlText,
                                    isSQL: true,
                                },
                                {
                                    title: '统计SQL',
                                    content: displayErrorInfo.wrongSqlCount,
                                    isSQL: true,
                                },
                            ]
                                .filter((item) => Boolean(item.content))
                                .map((item, i, array) => {
                                    return (
                                        <div key={item.title} className={styles.ErrorItem}>
                                            <h4>{item.title}</h4>
                                            <div>
                                                {item.isSQL ? (
                                                    <SyntaxHighlighter language='sql' style={docco} showLineNumbers>
                                                        {format(item.content, {})}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    item.content
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                    </div>
                </Modal>
            </div>
        )
    }
}
