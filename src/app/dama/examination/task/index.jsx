import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, message, Modal, Select, Switch } from 'antd'
import { bizTypeList } from 'app_api/examinationApi'
import { getTaskJobList, postChangeTaskJobStatus, postDeleteTaskJob, postRunTaskJob } from 'app_api/metadataApi'
import CONSTANTS from 'app_constants'
import Cache from 'app_utils/cache'
import { debounce } from 'lodash'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import '../index.less'

const { Option } = Select
const weekMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}
const lastStatusMap = {
    1: '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    5: '系统中止',
}

export default class Task extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                name: '',
            },
            bizList: [],
            tableData: [],
        }
        this.columns = [
            {
                title: '任务名称（表名）',
                dataIndex: 'name',
                key: 'name',
                width: 220,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.datasourceName + '/' + record.databaseName + '/' + text}>
                        <div className='tableLabel'>
                            <a onClick={this.openDetailPage.bind(this, record)}>{text}</a>
                            <div>
                                {record.datasourceName}/{record.databaseName}
                            </div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: '适用业务',
                dataIndex: 'bizType',
                key: 'bizType',
                width: 130,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则数量',
                dataIndex: 'businessCount',
                key: 'businessCount',
                width: 110,
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
                title: '检核周期',
                dataIndex: 'circleInfo',
                key: 'circleInfo',
                width: 210,
                render: (text, record, index) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: text }}></a>}>
                            <span style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: text }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '执行结果',
                dataIndex: 'lastStatus',
                key: 'lastStatus',
                width: 150,
                render: (text, record) =>
                    record.lastTime ? (
                        <Tooltip title={moment(record.lastTime).format('YYYY-MM-DD HH:mm:ss')}>
                            <div className='LineClamp'>
                                <div>
                                    {text == 1 ? <StatusLabel type='warning' message='等待执行' /> : null}
                                    {text == 2 ? <StatusLabel type='loading' message='正在执行' /> : null}
                                    {text == 3 ? <StatusLabel type='success' message='执行成功' /> : null}
                                    {text == 4 ? <StatusLabel type='error' message='执行失败' /> : null}
                                    {text == 5 ? <StatusLabel type='info' message='系统中止' /> : null}
                                </div>
                                <div style={{ marginLeft: 22 }}>{moment(record.lastTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '任务状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => (
                    <div>
                        <Switch onChange={this.changeStatusSwitch.bind(this, record, index)} checkedChildren='激活' unCheckedChildren='挂起' checked={text == 1} />
                    </div>
                ),
            },
            {
                title: '负责人',
                dataIndex: 'managerName',
                key: 'managerName',
                width: 110,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.baseconfigList()
    }
    changeStatusSwitch = async (data, index) => {
        let { tableData } = this.state
        let query = {
            id: data.id,
            status: data.status == 1 ? 0 : 1,
            operatorName: Cache.get('userName'),
        }
        let res = await postChangeTaskJobStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].status = query.status
            tableData[index].statusDesc = query.status == 1 ? '激活' : '挂起'
            this.setState({
                tableData,
            })
        }
    }
    getStatusLabel = (value) => {
        for (let k in lastStatusMap) {
            if (k == value) {
                return lastStatusMap[k]
            }
        }
        return '-'
    }
    baseconfigList = async () => {
        let res = await bizTypeList()
        if (res.code == 200) {
            this.setState({
                bizList: res.data,
            })
        }
    }
    timeCircle = (record) => {
        let time = record.time !== undefined && record.time ? record.time : ''
        let startTime = record.startTime !== undefined ? moment(record.startTime).format('YYYY-MM-DD') : ''
        let endTime = record.endTime !== undefined ? moment(record.endTime).format('YYYY-MM-DD') : ''
        let circleInfo = ''
        if (record.frequency == 4) {
            circleInfo = `调度时间：每天${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 5) {
            let weekString = ''
            _.map(record.days.split('|'), (item, key) => {
                weekString += `${weekMap[item]}${key + 1 == record.days.split('|').length ? '' : '、'}`
            })
            circleInfo = `调度时间：每天${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 6) {
            let monthString = ''
            _.map(record.days.split('|'), (item, key) => {
                monthString += `${item}${key + 1 == record.days.split('|').length ? '' : '、'}`
            })
            circleInfo = `调度时间：每月${monthString}号${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        }
        return circleInfo
    }
    openDetailPage = (data) => {
        this.props.addTab('检核任务详情', { ...data })
    }
    openEditModal = async (data) => {
        data.pageType = 'edit'
        this.props.addTab('编辑检核任务', { ...data })
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            taskType: 2,
            taskSubType: 201,
        }
        let res = await getTaskJobList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.circleInfo = this.timeCircle(item)
            })
            console.log(res.data, 'circleInfo')
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            name: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.name = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openRecordPage = (data) => {
        this.props.addTab('执行记录', { ...data })
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '确定删除此条任务吗？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                let res = await postDeleteTaskJob({ id: data.id, operatorName: Cache.get('userName') })
                if (res.code == 200) {
                    message.success('操作成功')
                    that.search()
                }
            },
        })
    }
    excuteTask = async (data, index) => {
        let { tableData } = this.state
        tableData[index].tableLoading = true
        this.setState({ tableData })
        let res = await postRunTaskJob({ id: data.id, operatorName: Cache.get('userName') })
        tableData[index].tableLoading = false
        this.setState({ tableData })
        if (res.code == 200) {
            message.success('操作成功')
            this.search()
        }
    }
    openAddPage = () => {
        this.props.addTab('新增检核任务')
    }
    render() {
        const { queryInfo, bizList, tableData } = this.state
        return (
            <React.Fragment>
                <div className='renderTask'>
                    <RichTableLayout
                        title='检核任务'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.openAddPage}>
                                    新增任务
                                </Button>
                            )
                        }}
                        editColumnProps={{
                            width: 240,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a
                                        disabled={record.tableLoading || record.status == 0 || record.lastStatus == 2 || record.lastStatus == 1}
                                        onClick={debounce(this.excuteTask.bind(this, record, _), CONSTANTS.TIME_OUT)}
                                        key='edit'
                                    >
                                        执行
                                    </a>,
                                    <a onClick={this.openRecordPage.bind(this, record)} key='edit'>
                                        执行记录
                                    </a>,
                                    <a onClick={this.openEditModal.bind(this, record)} key='edit'>
                                        编辑
                                    </a>,
                                    <a onClick={this.deleteData.bind(this, record)} key='delete'>
                                        删除
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'tableNameEn',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.name} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入任务名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'bizType')} value={queryInfo.bizType} placeholder='适用业务' style={{ width: 160 }}>
                                        {bizList.map((item) => {
                                            return (
                                                <Option value={item.code} key={item.code}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'lastStatus')} value={queryInfo.lastStatus} placeholder='执行结果' style={{ width: 160 }}>
                                        {_.map(lastStatusMap, (node, index) => {
                                            return (
                                                <Option key={index} value={index}>
                                                    {node}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='任务状态' style={{ width: 160 }}>
                                        <Option value={1} key={1}>
                                            激活
                                        </Option>
                                        <Option value={0} key={0}>
                                            挂起
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
                            })
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
