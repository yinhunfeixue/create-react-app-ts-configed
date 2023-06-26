// 任务概览
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Tooltip, Button, Cascader, Input, message, Divider, Select, Tabs, Switch, Dropdown, Menu, Space, Spin, Empty } from 'antd'
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import Cache from 'app_utils/cache'
import '../../index.less'
import store from '../../store'
import { observer } from 'mobx-react'
import _ from 'underscore'
import { postChangeTaskJobStatus, postRunTaskJob, datasourceListForQuery } from 'app_api/metadataApi'
import { resultList, changeTaskGroupStatus, runJobNow, searchTables, queryTableSource, taskGroupTableList } from 'app_api/examinationApi'
import moment from 'moment'
import ExcuteTaskDrawer from './excuteTaskDrawer'
import PermissionWrap from '@/component/PermissionWrap'

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
export default class TaskDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                tableName: '',
            },
            treeData: [],
            datasourceIds: [],
            tableData: [],
            total: 0,
            isSearch: false,
            loading: false,
            btnLoading: false,
            checkTableList: [],
        }
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 220,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '路径',
                dataIndex: 'tablePath',
                key: 'tablePath',
                width: 210, // 数据源中文名 / 库英文名
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
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text, record) => {
                    if (text == 0) {
                        return <StatusLabel type='info' message='新创建' />
                    } else if (text == 1) {
                        return <StatusLabel type='warning' message='等待执行' />
                    } else if (text == 2) {
                        return <StatusLabel type='loading' message='正在执行' />
                    } else if (text == 3) {
                        return <StatusLabel type='success' message='执行成功' />
                    } else if (text == 4) {
                        return <StatusLabel type='error' message='执行失败' />
                    } else if (text == 5) {
                        return <StatusLabel type='info' message='系统中止' />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'columnInfo',
                key: 'columnInfo',
                title: '字段',
                className: 'borderBottom',
                children:  [
                    {
                        title: '检核规则数',
                        dataIndex: 'ruleCount',
                        key: 'ruleCount',
                        width: 120,
                        render: (text, record) =>
                            text !== undefined ? (
                                <Tooltip placement='topLeft' title={text}>
                                    {text}
                                </Tooltip>
                            ) : (
                                <EmptyLabel />
                            ),
                    },
                    {
                        title: '规则通过率',
                        dataIndex: 'passRate',
                        key: 'passRate',
                        width: 150,
                        render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
                    },
                ]
            },
            {
                dataIndex: 'tableInfo',
                key: 'tableInfo',
                title: '表',
                className: 'borderBottom',
                children: [
                    {
                        title: '检核规则数',
                        dataIndex: 'tableRuleCount',
                        key: 'tableRuleCount',
                        width: 120,
                        render: (text, record) =>
                            text !== undefined ? (
                                <Tooltip placement='topLeft' title={text}>
                                    {text}
                                </Tooltip>
                            ) : (
                                <EmptyLabel />
                            ),
                    },
                    {
                        title: '规则通过率',
                        dataIndex: 'tableRulePassRate',
                        key: 'tableRulePassRate',
                        width: 150,
                        render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
                    },
                ]
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
        this.getTableList()
        this.getCheckTableList()
    }
    changeStatusSwitch = async () => {
        const { taskDetail } = store
        let query = {
            taskGroupId: taskDetail.taskGroupId,
            status: taskDetail.status == 1 ? 0 : 1,
        }
        let res = await changeTaskGroupStatus(query)
        if (res.code == 200) {
            message.success(query.status == 1 ? '任务状态已激活' : '任务状态已挂起')
            store.getDetail()
        }
    }
    onClickMenu = (e) => {
        const { selectedTaskInfo } = store
        let query = {
            taskGroupId: selectedTaskInfo.taskGroupId,
            jobId: selectedTaskInfo.jobId,
            execType: e.key,
            tableIdList: [],
            checkRange: undefined,
        }
        if (e.key == 4) {
            this.excuteTaskDrawer && this.excuteTaskDrawer.openModal(query)
        } else {
            this.excuteTask(query)
        }
    }
    excuteTask = async (query) => {
        this.setState({ btnLoading: true })
        let res = await runJobNow(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            if (res.msg == '执行成功') {
                message.success(res.msg)
            } else {
                message.warning(res.msg ? res.msg : '检核中，请稍等...')
            }
            setTimeout(() => {
                this.refresh()
            }, 1000)
        }
    }
    refresh = async () => {
        this.getSearchCondition()
        await this.getTableList()
        this.getCheckTableList()
        this.reset()
        this.props.getNewDisplayData()
        store.getDetail()
    }
    getSearchCondition = async () => {
        const { selectedTaskInfo } = store
        console.log(selectedTaskInfo.name, 'getSearchCondition')
        let res = await queryTableSource({ taskGroupId: selectedTaskInfo.taskGroupId })
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, datasourceIds } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: datasourceIds[0],
            databaseId: datasourceIds[1],
            taskGroupId: selectedTaskInfo.taskGroupId,
        }
        this.setState({ loading: true })
        let res = await searchTables(query)
        this.setState({ loading: false })
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            tableName: '',
        }
        await this.setState({
            queryInfo,
            datasourceIds: [],
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        if (name == 'datasourceIds') {
            await this.setState({
                datasourceIds: e ? e : [],
                isSearch: true,
            })
        } else {
            queryInfo[name] = e
            await this.setState({
                queryInfo,
                isSearch: true,
            })
        }
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.tableName = e.target.value
        await this.setState({
            queryInfo,
            isSearch: true,
        })
        if (!e) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getCheckTableList = async () => {
        const { selectedTaskInfo } = store
        let query = {
            taskGroupId: selectedTaskInfo.taskGroupId,
        }
        let res = await taskGroupTableList(query)
        if (res.code == 200) {
            this.setState({
                checkTableList: res.data.qaTaskList,
            })
        }
    }
    openDetailPage = async (data) => {
        let { checkTableList } = this.state
        store.changeTab('5')
        checkTableList.map((item) => {
            if (data.tableId == item.tableId) {
                store.onSelectedTable(item)
            }
        })
    }
    render() {
        const { selectedTaskInfo, taskDetail } = store
        const { queryInfo, treeData, tableData, datasourceIds, total, isSearch, loading, btnLoading } = this.state

        const menu = (data, index) => (
            <Menu style={{ width: 132 }} onClick={this.onClickMenu}>
                <Menu.Item key='1'>全部</Menu.Item>
                <Menu.Item key='2'>失败部分</Menu.Item>
                <Menu.Item key='3'>未通过部分</Menu.Item>
                <Menu.Item key='4'>自定义</Menu.Item>
            </Menu>
        )
        return (
            <div className='dashboard' id='titleBtn'>
                <div className='taskNameArea'>
                    <div className='leftArea'>
                        <img src={require('app_images/task.png')} />
                    </div>
                    <div className='rightArea'>
                        <div className='taskTitle'>
                            <span className='titleValue'>{taskDetail.name}</span>
                            <div className='titleBtn'>
                                <PermissionWrap funcCode='/dqm/checkTask/detail/taskDashboard/excuteTask'>
                                    <React.Fragment>
                                        <Dropdown trigger='click' overlay={menu} getPopupContainer={() => document.querySelector('.dashboard')}>
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Button style={{ padding: 0 }} loading={btnLoading} type='link'>
                                                    执行任务
                                                    <span style={{ marginLeft: 8 }} className='iconfont icon-xiangxia'></span>
                                                </Button>
                                            </a>
                                        </Dropdown>
                                        <Divider type='vertical' style={{ margin: '0px 12px' }} />
                                    </React.Fragment>
                                </PermissionWrap>
                                <PermissionWrap funcCode='/dqm/checkTask/detail/taskDashboard/activation'>
                                    <Switch onChange={this.changeStatusSwitch} checkedChildren='激活' unCheckedChildren='挂起' checked={taskDetail.status == 1} />
                                </PermissionWrap>
                            </div>
                        </div>
                        <div className='description'>{taskDetail.description}</div>
                        <div className='MiniForm infoArea'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '表数量',
                                    content: taskDetail.tableCount || 0,
                                },
                                {
                                    label: '适用业务',
                                    content: <div className={taskDetail.taskType == 1 ? 'normalType taskType' : 'taskType'}>{taskDetail.taskType == 1 ? '常规任务' : '质量提升'}</div>,
                                },
                                {
                                    label: '负责人',
                                    content: taskDetail.managerName,
                                },
                                {
                                    label: '创建人',
                                    content: taskDetail.createUser,
                                },
                                {
                                    label: '创建时间',
                                    content: taskDetail.createTime ? moment(taskDetail.createTime).format('YYYY-MM-DD HH:mm:ss') : '',
                                },
                            ])}
                        </div>
                    </div>
                </div>
                <div className='latestCheckResult historyTable'>
                    <ModuleTitle title='最新检核结果' />
                    {total || isSearch ? (
                        <div>
                            <div className='timeInfo'>
                                <span>最新检核时间：{taskDetail.lastCheckTime ? moment(taskDetail.lastCheckTime).format('YYYY-MM-DD HH:mm:ss') : <EmptyLabel />}</span>
                                {taskDetail.checkRangeTimeView !== '全量' && taskDetail.checkRangeTimeView && <span>检核时间范围：{taskDetail.checkRangeTimeView || <EmptyLabel />}</span>}
                            </div>
                            <RichTableLayout
                                disabledDefaultFooter
                                smallLayout
                                editColumnProps={{
                                    width: 120,
                                    createEditColumnElements: (_, record) => {
                                        return [
                                            <a onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                                详情
                                            </a>,
                                        ]
                                    },
                                }}
                                tableProps={{
                                    columns: this.columns,
                                    key: 'tableNameEn',
                                    dataSource: tableData,
                                    extraTableProps: {
                                        bordered: true,
                                    },
                                }}
                                renderSearch={(controller) => {
                                    this.controller = controller
                                    return (
                                        <React.Fragment>
                                            <Input.Search allowClear value={queryInfo.tableName} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名称' />
                                            <Cascader
                                                allowClear
                                                changeOnSelect
                                                fieldNames={{ label: 'name', value: 'id' }}
                                                options={treeData}
                                                value={datasourceIds}
                                                onChange={this.changeStatus.bind(this, 'datasourceIds')}
                                                popupClassName='searchCascader'
                                                placeholder='路径选择'
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            />
                                            <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='执行结果'>
                                                {_.map(lastStatusMap, (node, index) => {
                                                    return (
                                                        <Select.Option key={index} value={index}>
                                                            {node}
                                                        </Select.Option>
                                                    )
                                                })}
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
                        </div>
                    ) : (
                        <Spin spinning={loading}>
                            <Empty
                                style={{ margin: '50px 0 80px 0' }}
                                image={<img src={require('app_images/dataCompare/empty_icon.png')} />}
                                description={<span style={{ fontFamily: 'PingFangSC-Medium, PingFang SC', fontWeight: '500' }}>暂无数据</span>}
                                imageStyle={{
                                    height: 120,
                                }}
                            >
                                <div style={{ color: '#5E6266' }}>
                                    你可以配置 <a onClick={() => store.changeTab('3')}>任务参数</a> 或配置检核任务
                                </div>
                            </Empty>
                        </Spin>
                    )}
                </div>
                <ExcuteTaskDrawer refresh={this.refresh} ref={(dom) => (this.excuteTaskDrawer = dom)} />
            </div>
        )
    }
}
