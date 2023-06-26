import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { Alert, Button, Input, message, Select, Tooltip } from 'antd'
import { analysisLog, getExternalList, getTaskDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import '../index.less'

const lastStatusMap = {
    0: '分析中',
    1: '分析完成',
    2: '分析失败',
}
export default class TaskRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {},
            taskDetail: {},
            logModalVisible: false,
            logList: [],
            logDetail: {},
            logInfo: {},
        }
        this.columns = [
            {
                title: '报表名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                ellipsis: true,
                width: 180,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分析时长／秒',
                dataIndex: 'analysisTime',
                key: 'analysisTime',
                ellipsis: true,
                width: 150,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + 's'}>{text}s</Tooltip> : <EmptyLabel />),
            },
            {
                title: '分析结果',
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                width: 150,
                render: (text, record) =>
                    text !== undefined ? (
                        <div>
                            {/*{text == 0 ? <StatusLabel type='loading' message='分析中' /> : null}*/}
                            {text == 1 ? <StatusLabel type='success' message='分析完成' /> : null}
                            {text == 2 ? <StatusLabel type='error' message='分析失败' /> : null}
                        </div>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = async () => {
        this.getTaskDetailData()
    }
    getTaskDetailData = async () => {
        let res = await getTaskDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                taskDetail: res.data,
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
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
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
        queryInfo = {}
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
        console.log(params)
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            taskId: this.props.location.state.id,
            ...queryInfo,
        }
        let res = await getExternalList(query)
        if (res.code == 200) {
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
    openLogModal = async (data) => {
        let { logInfo } = this.state
        logInfo.reportsId = data.id
        logInfo.reportsTaskId = this.props.location.state.id
        data.analysisTime = data.analysisTime !== undefined ? data.analysisTime : 0
        await this.setState({
            logModalVisible: true,
            logInfo,
            logDetail: data,
        })
        this.getLogList()
    }
    getLogList = async () => {
        let { logInfo } = this.state
        let res = await analysisLog(logInfo)
        if (res.code == 200) {
            this.setState({
                logList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            logModalVisible: false,
        })
    }
    openDetailModal = (data) => {
        data.pageType = 'look'
        this.props.addTab('任务详情-报表编辑', { ...data })
    }
    render() {
        const { queryInfo, logModalVisible, logList, logInfo, logDetail, taskDetail } = this.state
        let { updateType, name, datasourceEname, createTime, createUser } = taskDetail
        const iconStyle = { color: logDetail.status == 1 ? '#339933' : '#CC0000', width: 14, marginRight: 8 }
        return (
            <React.Fragment>
                <div className='reportCollectDetail'>
                    <TableLayout
                        title={name}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '更新策略',
                                                    content: updateType ? '全量' : '增量',
                                                },
                                                {
                                                    label: '数据源',
                                                    content: datasourceEname,
                                                },
                                                {
                                                    label: '创建时间',
                                                    content: createTime,
                                                },
                                                {
                                                    label: '创建人',
                                                    content: createUser,
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return <ModuleTitle style={{ marginBottom: 15 }} title='文件列表' />
                        }}
                        editColumnProps={{
                            width: 150,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.openLogModal.bind(this, record)} key='detail'>
                                        日志
                                    </a>,
                                    <a onClick={this.openDetailModal.bind(this, record)} key='detail'>
                                        详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入报表名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='分析结果' style={{ width: 160 }}>
                                        {/*<Option key={0} value={0}>分析中</Option>*/}
                                        <Option key={1} value={1}>
                                            分析完成
                                        </Option>
                                        <Option key={2} value={2}>
                                            分析失败
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
                                <Alert
                                    message={logDetail.status == 1 ? '分析完成' : '分析失败'}
                                    description={'采集时间：' + logDetail.createTime + ' 至 ' + logDetail.finishTime + '，耗时 ' + logDetail.analysisTime + 's'}
                                    type={logDetail.status == 1 ? 'success' : 'error'}
                                    showIcon
                                    icon={logDetail.status == 1 ? <CheckCircleFilled style={iconStyle} /> : <InfoCircleFilled style={iconStyle} />}
                                />
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
            </React.Fragment>
        )
    }
}
