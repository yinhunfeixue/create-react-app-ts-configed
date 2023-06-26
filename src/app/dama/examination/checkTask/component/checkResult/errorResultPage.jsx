// 错误结果
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import Code from '@/components/code/Code'
import RenderUtil from '@/utils/RenderUtil'
import { FileTextOutlined } from '@ant-design/icons'
import { Button, Cascader, Divider, Form, Input, message, Modal, Popover, Select, Switch, Tabs, Tooltip } from 'antd'
import {
    batchRunTest, changeTechRuleStatus, checkRuleTree, deleteRuleList, queryRuleOverview, queryWrongRecord, techRuleList
} from 'app_api/examinationApi'
import moment from 'moment'
import React, { Component } from 'react'
import '../../index.less'
import store from '../../store'
import AddRuleDrawer from '../checkRule/addRuleDrawer'
import LogDrawer from '../logDrawer'

const TabPane = Tabs.TabPane


export default class ErrorResultPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
                ruleTypeIds: [],
            },
            typeList: [],
            tableData: [],
            total: 0,
            sqlDetail: {},
            sqlModalVisible: false,
            selectedTable: {},
            showErrorRule: false,
            errorTableData: [],
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
            errorTabValue: '0',
            tableTypeList: []
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 150,
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
                title: '执行结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            <span className='statusDot' style={{ background: '#CC0000' }}></span>执行失败
                            <Popover trigger='click' content={<div style={{ width: 300, wordBreak: 'break-word' }}>{record.failedReason}</div>}>
                                <FileTextOutlined style={{ cursor: 'pointer', marginLeft: 8, color: '#5B7FA3', fontSize: '16px' }} />
                            </Popover>
                        </span>
                    )
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
                title: '执行结果',
                dataIndex: 'checkResult',
                key: 'checkResult',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            <span className='statusDot' style={{ background: '#CC0000' }}></span>执行失败
                            <Popover trigger='click' content={<div style={{ width: 300, wordBreak: 'break-word' }}>{record.failedReason}</div>}>
                                <FileTextOutlined style={{ cursor: 'pointer', marginLeft: 8, color: '#5B7FA3', fontSize: '16px' }} />
                            </Popover>
                        </span>
                    )
                },
            },
        ]
        this.errorColumns = [
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
                title: '规则分类',
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
                title: '规则模板',
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
                        <Switch onChange={this.changeRuleStatus.bind(this, record, index)} checkedChildren='开启' unCheckedChildren='关闭' checked={text == 1} />
                    </div>
                ),
            },
            {
                title: '试跑结果',
                dataIndex: 'testResult',
                key: 'testResult',
                width: 120,
                render: (text, record) =>
                    text !== undefined ? (
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
                    ),
            },
        ]
        this.errorTableColumns = [
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
                title: '规则分类',
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
                title: '规则模板',
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
                        <Switch onChange={this.changeRuleStatus.bind(this, record, index)} checkedChildren='开启' unCheckedChildren='关闭' checked={text == 1} />
                    </div>
                ),
            },
            {
                title: '试跑结果',
                dataIndex: 'testResult',
                key: 'testResult',
                width: 120,
                render: (text, record) =>
                    text !== undefined ? (
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
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.getRuleTree()
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
        let newTree = data.filter(x => x.type == type)
        newTree.forEach(x => x.children&&(x.chlidren = this.getTypeList(x.children, type)))
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
        let { errorTableData } = this.state
        let query = {
            techRuleId: data.id,
            status: data.status == 1 ? 0 : 1,
        }
        let res = await changeTechRuleStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            errorTableData[index].status = query.status
            this.setState({
                errorTableData,
            })
        }
    }
    openLogDrawer = (data) => {
        this.logDrawer && this.logDrawer.openModal(data)
    }
    onSelectTable = async (data) => {
        await this.setState({
            selectedTable: { ...data },
            showErrorRule: false,
        })
        this.reset()
        this.getQueryRuleOverview()
        this.onChangeTab('0')
    }
    cancel = () => {
        this.setState({
            sqlModalVisible: false,
        })
    }
    openSqlModal = (data) => {
        this.setState({
            sqlModalVisible: true,
            sqlDetail: data,
        })
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
        let { selectedTable } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            jobId: selectedTaskInfo.jobId,
            tsTaskId: selectedTable.lastCheckTaskId,
            ruleLevel: 0,
        }
        let res = await queryWrongRecord(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total
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
    getTableRuleList = async (params = {}) => {
        let { selectedTable } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: selectedTable.tableId,
            jobId: selectedTaskInfo.jobId,
            tsTaskId: selectedTable.lastCheckTaskId,
            ruleLevel: 1
        }
        let res = await queryWrongRecord(query)
        if (res.code == 200) {
            this.setState({
                tableRuleData: res.data,
                // total: res.total
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
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
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
    openErrorRulePage = (value) => {
        this.setState({
            showErrorRule: value,
        })
    }
    testRun = async (data) => {
        let { selectedTable } = this.state
        const { selectedTaskInfo } = store
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
        let { selectedTable } = this.state
        this.addRuleDrawer && this.addRuleDrawer.openModal(selectedTable, type, data, ruleLevel)
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
                    that.reset()
                    that.props.getLeftTreeData()
                }
            },
        })
    }
    getErrorTableList = async (params = {}) => {
        let { queryInfo, selectedTable, errorTabValue } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            tableId: selectedTable.tableId,
            validBizRuleFlag: true,
            ruleLevel: parseInt(errorTabValue),
            lastCheckResult: 3, // 1通过，2未通过，3失败
            orderByStatus: params.sorter.field == 'status' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await techRuleList(query)
        if (res.code == 200) {
            this.setState({
                errorTableData: res.data,
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
    onChangeTab = async (e) => {
        this.setState({
            tabValue: e,
        })
    }
    onChangeErrorTab = async (e) => {
        await this.setState({
            errorTabValue: e,
        })
        this.reset()
    }
    render() {
        let { tabValue, errorTabValue, tableRuleData, columnRuleInfo, tableRuleInfo, sqlModalVisible, sqlDetail, tableData, total, selectedTable, showErrorRule, queryInfo, typeList, tableTypeList, errorTableData } = this.state
        return (
            <div>
                {showErrorRule ? (
                    <div>
                        <div style={{ marginTop: 18 }}>
                            <a onClick={this.openErrorRulePage.bind(this, false)}>
                                <span className='iconfont icon-zuo'></span>返回
                            </a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <span>规则结果</span>
                        </div>
                        <div className='tableInfo'>
                            <ModuleTitle style={{ display: 'inline-block', marginBottom: 24 }} title='错误规则' />
                            <div className='btnRight'>
                                <Button onClick={this.testRun.bind(this, errorTableData)} type='primary' ghost style={{ marginRight: 8 }}>
                                    一键试跑
                                </Button>
                            </div>
                            <Tabs animated={false} onChange={this.onChangeErrorTab} activeKey={errorTabValue}>
                                <TabPane key='0' tab={<span>字段规则<span style={{ marginLeft: '8px' }}>{columnRuleInfo.columnRuleWrongNum}</span></span>}>
                                </TabPane>
                                <TabPane key='1' tab={<span>表规则<span style={{ marginLeft: '8px' }}>{tableRuleInfo.tableRuleWrongNum}</span></span>}>
                                </TabPane>
                            </Tabs>
                            <RichTableLayout
                                disabledDefaultFooter
                                smallLayout
                                editColumnProps={{
                                    width: 168,
                                    createEditColumnElements: (_, record) => {
                                        const editColumns = [
                                            <a onClick={this.openEditModal.bind(this, record, 'edit', errorTabValue == 0 ? 0 : 1)} key='edit'>
                                                修改
                                            </a>,
                                            <a onClick={this.deleteRule.bind(this, record)} key='edit'>
                                                移除
                                            </a>,
                                        ]
                                        if (record.sqlSource !== 2 || errorTabValue == 0) {
                                            editColumns.unshift(
                                                <a onClick={this.testRun.bind(this, [record])} key='edit'>
                                                    试跑
                                                </a>
                                            )
                                        }
                                        return editColumns
                                    },
                                }}
                                tableProps={{
                                    columns: errorTabValue == 0 ? this.errorColumns : this.errorTableColumns,
                                    dataSource: errorTableData,
                                    key: 'id',
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
                                            {
                                                errorTabValue == 0 ?
                                                    <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入检核字段、规则名称' />
                                                    : null
                                            }
                                            <Cascader
                                                allowClear
                                                expandTrigger='hover'
                                                fieldNames={{ label: 'name', value: 'id' }}
                                                value={queryInfo.ruleTypeIds}
                                                options={errorTabValue == 0 ? typeList : tableTypeList}
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
                                            {
                                                errorTabValue == 0 ?
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
                                                    : null
                                            }
                                            <Button onClick={this.reset}>重置</Button>
                                        </React.Fragment>
                                    )
                                }}
                                requestListFunction={(page, pageSize, filter, sorter) => {
                                    return this.getErrorTableList({
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
                ) : (
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
                        <div className='tableInfo errorPage'>
                            <ModuleTitle title='规则结果' />
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#F54B45' }}>执行失败，有 {tableData.length} 项规则配置错误，如下</span>
                                <a style={{ float: 'right' }} onClick={this.openErrorRulePage.bind(this, true)}>
                                    规则修改<span style={{ fontSize: '14px' }} className='iconfont icon-you'></span>
                                </a>
                            </div>
                            <Tabs animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                <TabPane key='0' className="noSearchArea" tab={
                                    <span>字段规则&nbsp;
                                        {
                                            columnRuleInfo.columnRuleWrongNum ?
                                                <span>
                                                    <span style={{ color: '#CC0000', marginLeft: '8px' }}>{columnRuleInfo.columnRuleWrongNum}</span>
                                                    <span style={{ margin: '0 2px' }}>/</span>
                                                </span>
                                                : null
                                        }
                                        {columnRuleInfo.columnRuleNum}
                                    </span>}>
                                    {selectedTable.tableId && tabValue == 0 ? (
                                        <RichTableLayout
                                            disabledDefaultFooter
                                            smallLayout
                                            editColumnProps={{
                                                width: 120,
                                                createEditColumnElements: (_, record) => {
                                                    const { ruleDialectType } = record
                                                    const showSql = ruleDialectType !== 1
                                                    if (showSql) {
                                                        return [
                                                            <a onClick={this.openSqlModal.bind(this, record)} key='edit'>
                                                                问题SQL
                                                            </a>,
                                                        ]
                                                    }
                                                    return []
                                                },
                                            }}
                                            tableProps={{
                                                columns: this.columns,
                                                key: 'id',
                                                dataSource: tableData,
                                                extraTableProps: {
                                                    scroll: {
                                                        x: 1300,
                                                    },
                                                },
                                            }}
                                            renderSearch={(controller) => {
                                                this.controller = controller
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
                                    ) : null}
                                </TabPane>
                                <TabPane key='1' className="noSearchArea" tab={
                                    <span>表规则&nbsp;
                                        {
                                            tableRuleInfo.tableRuleWrongNum ?
                                                <span>
                                                    <span style={{ color: '#CC0000', marginLeft: '8px' }}>{tableRuleInfo.tableRuleWrongNum}</span>
                                                    <span style={{ margin: '0 2px' }}>/</span>
                                                </span>
                                                : null
                                        }
                                        {tableRuleInfo.tableRuleNum}
                                    </span>}>
                                    {selectedTable.tableId && tabValue == 1 ? (
                                        <RichTableLayout
                                            disabledDefaultFooter
                                            smallLayout
                                            editColumnProps={{
                                                width: 120,
                                                createEditColumnElements: (_, record) => {
                                                    return [
                                                        <a onClick={this.openSqlModal.bind(this, record)} key='edit'>
                                                            问题SQL
                                                        </a>,
                                                    ]
                                                },
                                            }}
                                            tableProps={{
                                                columns: this.tableColumns,
                                                key: 'id',
                                                dataSource: tableRuleData,
                                                extraTableProps: {
                                                    scroll: {
                                                        x: 1300,
                                                    },
                                                },
                                            }}
                                            renderSearch={(controller) => {
                                                this.tableController = controller
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
                                    ) : null}
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                )}
                <LogDrawer ref={(dom) => (this.logDrawer = dom)} />
                <AddRuleDrawer onSelectTable={this.search} ref={(dom) => (this.addRuleDrawer = dom)} />
                <Modal width={640} className='sqlModal' title='问题SQL' visible={sqlModalVisible} onCancel={this.cancel} footer={null}>
                    <h3 style={{ fontSize: '14px' }}>检核SQL</h3>
                    <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ marginBottom: 24, overflowY: 'auto' }}>
                        {RenderUtil.renderFormItems([
                            {
                                // content: sqlDetail.sqlText,
                                content: <Code code={sqlDetail.sqlText} />,
                            },
                        ])}
                    </Form>
                    <h3 style={{ fontSize: '14px' }}>总数SQL</h3>
                    <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ height: 200, overflowY: 'auto' }}>
                        {RenderUtil.renderFormItems([
                            {
                                // content: sqlDetail.sqlTotal,
                                content: <Code code={sqlDetail.sqlTotal} />,
                            },
                        ])}
                    </Form>
                </Modal>
            </div>
        )
    }
}
