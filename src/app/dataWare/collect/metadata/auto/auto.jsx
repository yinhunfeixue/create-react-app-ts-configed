import BatchPermissionWrap from '@/component/BatchPermissionWrap'
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, message, Modal, Select, Switch, Tooltip } from 'antd'
import { getTaskJobList, postChangeBatchTaskJobStatus, postChangeTaskJobStatus, postDeleteBatchTaskJob, postDeleteTaskJob, postRunBatchTaskJob, postRunTaskJob } from 'app_api/metadataApi'
import Cache from 'app_utils/cache'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import store from './store'

import qs from 'qs'

const Option = Select.Option
const confirm = Modal.confirm
const weekMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}
const statusMap = {
    1: '激活',
    0: '挂起',
}
const lastStatusMap = {
    0: '新创建',
    1: '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    5: '执行终止',
}

const taskSubTypeMap = [
    { key: 100, value: '报表采集' },
    { key: 101, value: '库表、主键采集' },
    { key: 102, value: '外键、关联、索引采集' },
    { key: 103, value: '存储过程采集' },
    { key: 104, value: 'DDL采集' },
    { key: 105, value: '存储空间采集' },
    { key: 106, value: '数据抽样采集' },
    { key: 111, value: '代码、码值采集' },
]

@observer
export default class AutoCollection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectData: [],
            tableData: [],
            executionDisable: false, // 是否禁用立即执行按钮
            selectedRows: [],
            selectedRowKeys: [],
            tablePagination: {
                total: '',
                page: 1,
                page_size: 20,
                paginationDisplay: 'none',
            },
            searchCondition: {},
        }
        this.inTerval = {}
        this.columns = [
            {
                dataIndex: 'businessName',
                key: 'businessName',
                title: '数据源',
                width: 180,
                fixed: 'left',
                render: (text) => (
                    <Tooltip title={text}>
                        <span style={{ maxWidth: 120 }} className='LineClamp'>
                            {text}
                        </span>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '任务类型',
                width: 120,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                dataIndex: 'lastStatus',
                key: 'lastStatus',
                title: '执行结果',
                className: 'lastStatusSpan',
                width: 150,
                render: (text, record, index) => {
                    if (record.lastStatus == '0') {
                        return <StatusLabel message='新创建' type='info' />
                    } else if (record.lastStatus == '1') {
                        return <StatusLabel message='等待执行' type='info' />
                    } else if (record.lastStatus == '2') {
                        return <StatusLabel message='正在执行' type='loading' />
                    } else if (record.lastStatus == '3') {
                        return <StatusLabel message='执行成功' type='success' />
                    } else if (record.lastStatus == '4') {
                        return <StatusLabel type='error' message='执行失败' />
                    } else if (record.lastStatus == '5') {
                        return <StatusLabel message='执行终止' type='warning' />
                    }
                },
            },
            {
                dataIndex: 'table_num',
                key: 'table_num',
                width: 150,
                title: '任务状态',
                render: (text, record, index) => {
                    const checked = record.status == '1'
                    const systemCode = record.businessId.toString()
                    return (
                        <span onClick={(e) => e.stopPropagation()} className='tableActiveStatus'>
                            <span onClick={() => this.onSwitchChange(record, 'single')}>
                                <PermissionWrap funcCode='/sys/collect/task/manage/activate' systemCode={systemCode}>
                                    <Switch className='tableSwitch' checked={checked} checkedChildren='激活' unCheckedChildren='挂起' />
                                </PermissionWrap>
                            </span>
                        </span>
                    )
                },
            },
            {
                dataIndex: 'lastTime',
                key: 'lastTime',
                title: '最后采集时间',
                width: 130,
                render: (text) => (text !== undefined ? <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tooltip> : <EmptyLabel />),
            },
            {
                dataIndex: 'cronExpr',
                key: 'cronExpr',
                title: '调度信息',
                width: 130,
                render: (text, record, index) => {
                    record.days = record.days !== undefined ? record.days : ''
                    let time = record.time !== undefined && record.time ? record.time : ''
                    let startTime = record.startTime !== undefined ? moment(record.startTime).format('YYYY-MM-DD') : ''
                    let endTime = record.endTime !== undefined ? moment(record.endTime).format('YYYY-MM-DD') : ''
                    if (record.frequency == 4) {
                        return (
                            <Tooltip title={`每天 ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`}>{`每天 ${time}；${startTime}${
                                startTime && endTime ? '~' : ''
                            }${endTime}`}</Tooltip>
                        )
                    } else if (record.frequency == 5) {
                        let weekString = ''
                        _.map(record.days.split('|'), (item, key) => {
                            weekString += `${weekMap[item]}${key + 1 == record.days.split('|').length ? '' : '、'}`
                        })
                        return (
                            <Tooltip title={`每周${weekString} ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`}>{`每周${weekString} ${time}；${startTime}${
                                startTime && endTime ? '~' : ''
                            }${endTime}`}</Tooltip>
                        )
                    } else if (record.frequency == 6) {
                        let monthString = ''
                        _.map(record.days.split('|'), (item, key) => {
                            monthString += `${item}${key + 1 == record.days.split('|').length ? '' : '、'}`
                        })
                        return (
                            <Tooltip title={`每月${monthString}号 ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`}>{`每月${monthString}号 ${time}；${startTime}${
                                startTime && endTime ? '~' : ''
                            }${endTime}`}</Tooltip>
                        )
                    }
                },
            },
        ]
        this.showQuickJumper = true //是否显示跳转到多少页
        this.pageSizeOptions = ['10', '20', '30', '40', '50'] //每页多少条数据的下拉框

        const search = qs.parse(props.location.search, { ignoreQueryPrefix: true })
        search.datasourceId = Number(search.datasourceId)
        console.log('search', search)
        if (!this.props.location.state) {
            this.props.location.state = search
        }
    }

    componentWillMount() {
        this.initData()
    }
    rowSelection = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows, 'selectedRows')
        this.onSelectChange(selectedRowKeys, selectedRows)
        this.setState({
            selectData: selectedRows,
            executionDisable: false,
        })
        selectedRows.map((item, index) => {
            if (item.status == 0 || item.lastStatus == 2 || item.lastStatus == 1) {
                this.setState({
                    executionDisable: true,
                })
            }
        })
    }

    initData = () => {
        this.clearTable()
        if (this.props.location.state.from == 'dataSourceManage') {
            this.changeStatus('businessId', this.props.location.state.datasourceId)
        }
        store.getDataSourceData()
    }
    clearTable() {
        this.setState({
            tableData: [],
        })
    }
    onSelectChange(selectedRowsKeys, selectedRows) {
        this.setState({
            selectedRows: selectedRows,
            selectedRowKeys: selectedRowsKeys,
        })
    }
    clearSelectChange() {
        this.setState({
            selectedRows: [],
            selectedRowKeys: [],
        })
    }
    reset = async () => {
        let { searchCondition } = this.state
        searchCondition = {}
        await this.setState({
            searchCondition,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    changeStatus = async (name, e) => {
        let { searchCondition } = this.state
        searchCondition[name] = e
        await this.setState({
            searchCondition,
        })
        this.search()
    }
    getTableData = async (query) => {
        const res = await getTaskJobList(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            let hasRunning = false
            res.data.map((item, index) => {
                if (item.lastStatus == 2) {
                    hasRunning = true
                }
            })
            if (!hasRunning) {
                clearInterval(this.inTerval)
                this.controller.refresh()
            }
        }
    }
    getTableList = async (params = {}) => {
        let { selectedRows, searchCondition } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...searchCondition,
            businessType: 1001,
            type: 1,
        }
        let res = await getTaskJobList(query)
        if (res.code == 200) {
            // 更新选中数据
            let hasRunning = false
            res.data.map((item, index) => {
                selectedRows.slice().map((data, i) => {
                    if (item.id == data.id) {
                        selectedRows[i] = item
                    }
                })
                if (item.lastStatus == 2) {
                    hasRunning = true
                }
            })
            if (hasRunning) {
                let that = this
                clearInterval(this.inTerval)
                this.inTerval = setInterval(function () {
                    that.getTableData(query)
                }, 3000)
            } else {
                clearInterval(this.inTerval)
            }
            this.setState({
                tableData: res.data,
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

    onSwitchChange = (data, type) => {
        this.toggleStatus(data, type)
    }

    collectRecord = (index, record) => {
        // Cache.remove('currentPage')
        this.props.addTab('采集日志', {
            ...record,
            hasSim: true,
            from: 'autoCollection',
            area: 'metadata',
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.inTerval)
    }

    onAdd = () => {
        this.props.addTab('编辑采集任务', {
            pageType: 'add',
            from: 'autoCollection',
        })
    }

    onCancel = (data, type) => {
        return this.deleteJobData(data, type)
    }

    onEdit = (data) => {
        Cache.remove('currentPage')
        this.props.addTab('编辑采集任务', {
            datasourceId: data.businessId,
            datasourceName: data.businessName,
            pageType: 'edit',
            from: 'autoCollection',
            taskSubType: data.taskSubType,
        })
    }

    ImmediateExecution = async (id, type) => {
        await this.execJobData(id, type)
        this.controller.refresh()
        this.selectController.updateSelectedKeys([])
    }

    getDisabledBtn = () => {
        const { selectedRows } = this.state
        this.setState({
            executionDisable: false,
        })
        selectedRows.slice().map((item, index) => {
            if (item.status == 0 || item.lastStatus == 2 || item.lastStatus == 1) {
                this.setState({
                    executionDisable: true,
                })
            }
        })
    }

    toggleStatus = async (data, type, status) => {
        await this.exchangeStateData(data, type, status)
        this.controller.refresh()
        this.selectController.updateSelectedKeys([])
        this.getDisabledBtn()
    }
    deleteJobData(data, type) {
        let selectedRowsArr = []
        if (data instanceof Array) {
            _.map(data.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            return postDeleteTaskJob({ id: data.id }).then((res) => {
                if (res.code == 200) {
                    this.clearSelectChange()
                    message.success(res.msg)
                    this.search()
                }
            })
        } else {
            return postDeleteBatchTaskJob({ ids: selectedRowsArr }).then((res) => {
                if (res.code == 200) {
                    this.clearSelectChange()
                    message.success(res.msg)
                    this.search()
                }
            })
        }
    }
    execJobData(id, type) {
        let selectedRowsArr = []
        if (id instanceof Array) {
            _.map(id.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            postRunTaskJob({ id: id }).then((res) => {
                if (res.code == 200) {
                    message.success(res.msg)
                    this.search()
                }
            })
            return
        } else {
            postRunBatchTaskJob({ ids: selectedRowsArr }).then((res) => {
                if (res.code == 200) {
                    message.success(res.msg)
                    // this.clearSelectChange()
                    this.search()
                }
            })
        }
    }
    exchangeStateData(data, type, status) {
        let selectedRowsArr = []
        if (data instanceof Array) {
            _.map(data.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            postChangeTaskJobStatus({
                id: data.id,
                status: data.status ? 0 : 1,
            }).then((res) => {
                if (res.code == 200) {
                    // message.success(res.msg)
                    // this.clearSelectChange()
                    // this.getJobData()
                }
            })
            return
        } else {
            postChangeBatchTaskJobStatus({
                ids: selectedRowsArr,
                status,
            }).then((res) => {
                if (res.code == 200) {
                    // message.success(res.msg)
                    // this.clearSelectChange()
                    // this.getJobData()
                }
            })
        }
    }

    render() {
        const { tableLoading, sourceData, tablePagination, sourceDataLoading } = store
        let { tableData, executionDisable, selectedRows, searchCondition } = this.state
        console.log('searchCondition', searchCondition)
        return (
            <RichTableLayout
                title='采集任务'
                enableDrag
                renderHeaderExtra={() => {
                    return (
                        <PermissionWrap funcCode='/sys/collect/task/manage/set' onClick={this.onAdd}>
                            <Button type='primary'>设置采集任务</Button>
                        </PermissionWrap>
                    )
                }}
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Select
                                allowClear
                                showSearch={true}
                                loading={sourceDataLoading}
                                value={searchCondition.businessId}
                                onChange={this.changeStatus.bind(this, 'businessId')}
                                optionFilterProp='children'
                                filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                placeholder='数据源名称'
                            >
                                {sourceData.map((d) => (
                                    <Option key={d.id} value={d.id}>
                                        <Tooltip title={d.dsName}>{d.dsName}</Tooltip>
                                    </Option>
                                ))}
                            </Select>
                            <Select value={searchCondition.taskSubType} allowClear onChange={this.changeStatus.bind(this, 'taskSubType')} placeholder='任务类型'>
                                {taskSubTypeMap.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.key}>
                                            <Tooltip title={item.value}>{item.value}</Tooltip>
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Select value={searchCondition.status} allowClear onChange={this.changeStatus.bind(this, 'status')} placeholder='任务状态'>
                                {_.map(statusMap, (node, index) => {
                                    return (
                                        <Option key={index} value={index}>
                                            {node}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Select value={searchCondition.lastStatus} allowClear onChange={this.changeStatus.bind(this, 'lastStatus')} placeholder='执行结果'>
                                {_.map(lastStatusMap, (node, index) => {
                                    return (
                                        <Option key={index} value={index}>
                                            {node}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Button onClick={this.reset}>重置</Button>
                        </React.Fragment>
                    )
                }}
                tableProps={{
                    selectedEnable: true,
                    columns: this.columns,
                    dataSource: tableData,
                    extraTableProps: {
                        scroll: {
                            x: 1100,
                        },
                    },
                }}
                deleteFunction={(_, rows) => this.onCancel(rows)}
                requestListFunction={(page, pageSize) => {
                    return this.getTableList({
                        pagination: {
                            page,
                            page_size: pageSize,
                        },
                    })
                }}
                renderFooter={(controller, defaultRender) => {
                    const { selectedRows } = controller

                    executionDisable = false
                    selectedRows.map((item, index) => {
                        if (item.status == 0 || item.lastStatus == 2 || item.lastStatus == 1) {
                            executionDisable = true
                        }
                    })

                    return (
                        <React.Fragment>
                            {[
                                {
                                    content: (
                                        <Button type='primary' ghost>
                                            激活任务
                                        </Button>
                                    ),
                                    onSuccess: (rows, keys) => this.toggleStatus(rows, 'batch', 1),
                                    funcCode: '/sys/collect/task/manage/activate',
                                },
                                {
                                    content: (
                                        <Button type='primary' ghost>
                                            挂起任务
                                        </Button>
                                    ),
                                    onSuccess: (rows, keys) => this.toggleStatus(rows, 'batch', 0),
                                    funcCode: '/sys/collect/task/manage/activate',
                                },
                                {
                                    content: <Button disabled={executionDisable}>立即执行</Button>,
                                    onSuccess: (rows, keys) => this.ImmediateExecution(rows),
                                    funcCode: '/sys/collect/task/manage/execute',
                                },
                            ].map((item, index) => {
                                return (
                                    <BatchPermissionWrap
                                        onSuccess={(rows) => {
                                            item.onSuccess(rows)
                                            controller.updateSelectedKeys([])
                                        }}
                                        funcCode={item.funcCode}
                                        key={index}
                                        systemRows={selectedRows}
                                        rowId='businessId'
                                        rowLabel='businessName'
                                    >
                                        {item.content}
                                    </BatchPermissionWrap>
                                )
                            })}

                            {defaultRender()}
                        </React.Fragment>
                    )
                }}
                permissionIdName='businessId'
                permissionLabelName='businessName'
                createDeletePermissionData={(record) => {
                    return {
                        funcCode: '/sys/collect/task/manage/delete',
                        systemCode: record.businessId.toString(),
                    }
                }}
                editColumnProps={{
                    width: 240,
                    createEditColumnElements: (index, record, defaultElements) => {
                        const systemCode = record.businessId.toString()
                        return RichTableLayout.renderEditElements([
                            {
                                label: '记录',
                                onClick: () => {
                                    this.collectRecord(index, record)
                                },
                                funcCode: '/sys/collect/task/manage/record',
                                systemCode,
                            },
                            {
                                label: '执行',
                                disabled: !(record.status == 1 && record.lastStatus != 2 && record.lastStatus != 1),
                                onClick: () => {
                                    this.ImmediateExecution(record.id, 'single')
                                },
                                funcCode: '/sys/collect/task/manage/execute',
                                systemCode,
                            },
                            {
                                label: '编辑',
                                onClick: () => {
                                    this.onEdit(record)
                                },
                                funcCode: '/sys/collect/task/manage/edit',
                                systemCode,
                            },
                        ]).concat(defaultElements)
                    },
                }}
            />
        )
    }
}
