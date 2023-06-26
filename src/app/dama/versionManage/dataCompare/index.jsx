import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, message, Modal, Select } from 'antd'
import { schemaDiffTask, taskFilters } from 'app_api/autoManage'
import { postDeleteTaskJob, postRunTaskJob } from 'app_api/metadataApi'
import CONSTANTS from 'app_constants'
import Cache from 'app_utils/cache'
import { debounce } from 'lodash'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'
import './index.less'

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
    // '1': '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    // '5': '人工停止'
}
export default class DataCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                name: '',
            },
            tableData: [],
            targetDsFilters: [],
            sourceDsFilters: [],
        }
        this.columns = [
            {
                title: '任务名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
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
                title: '参照系统',
                dataIndex: 'sourceDsName',
                key: 'sourceDsName',
                width: 200,
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
                title: '对比系统',
                dataIndex: 'targetDsName',
                key: 'targetDsName',
                width: 200,
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
                title: '调度周期',
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
                title: '执行状态',
                dataIndex: 'lastStatus',
                key: 'lastStatus',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <div>
                            {/*{text == 1 ? <StatusLabel type='warning' message='等待执行' /> : null}*/}
                            {text == 2 ? <StatusLabel type='loading' message='正在执行' /> : null}
                            {text == 3 ? <StatusLabel type='success' message='执行成功' /> : null}
                            {text == 4 ? <StatusLabel type='error' message='执行失败' /> : null}
                            {/*{text == 5 ? <StatusLabel type='info' message='人工停止' /> : null}*/}
                        </div>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.getFilters()
    }
    getFilters = async () => {
        let res = await taskFilters()
        if (res.code == 200) {
            this.setState({
                sourceDsFilters: res.data.sourceDsFilters,
                targetDsFilters: res.data.targetDsFilters,
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await schemaDiffTask(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.circleInfo = this.timeCircle(item)
            })
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
    timeCircle = (record) => {
        let time = record.time !== undefined && record.time ? record.time : ''
        let startTime = record.startTime !== undefined ? moment(record.startTime).format('YYYY-MM-DD') : ''
        let endTime = record.endTime !== undefined ? moment(record.endTime).format('YYYY-MM-DD') : ''
        let circleInfo = ''
        if (record.frequency == 4) {
            circleInfo = `调度时间：每天${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 5) {
            let weekString = ''
            _.map(
                record.days.split('|').sort((a, b) => a - b),
                (item, key) => {
                    weekString += `${weekMap[item]}${key + 1 == record.days.split('|').length ? '' : '、'}`
                }
            )
            circleInfo = `调度时间：每周${weekString}${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 6) {
            let monthString = ''
            _.map(
                record.days.split('|').sort((a, b) => a - b),
                (item, key) => {
                    monthString += `${item}${key + 1 == record.days.split('|').length ? '' : '、'}`
                }
            )
            circleInfo = `调度时间：每月${monthString}号${time}；<br/>起止时间：${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        }
        return circleInfo
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
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.name = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
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
    openDetailPage = (data) => {
        this.props.addTab('对比结果详情', { ...data })
    }
    openAddPage = (data, type) => {
        data.pageType = type
        if (type == 'add') {
            this.props.addTab('新增对比任务', { ...data })
        } else {
            this.props.addTab('编辑对比任务', { ...data })
        }
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
    excute = async (data, index) => {
        let { tableData } = this.state
        tableData[index].tableLoading = true
        this.setState({ tableData })
        let res = await postRunTaskJob({ id: data.id, operatorName: Cache.get('userName') })
        tableData[index].tableLoading = false
        this.setState({ tableData })
        if (res.code == 200) {
            message.success(res.msg || '操作成功')
            this.search()
        }
    }
    render() {
        const { queryInfo, tableData, targetDsFilters, sourceDsFilters } = this.state
        return (
            <React.Fragment>
                <div className='manageFilter'>
                    <RichTableLayout
                        enableDrag
                        title='元数据对比'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/md/compare/manage/add'>
                                    <Button type='primary' onClick={this.openAddPage.bind(this, {}, 'add')}>
                                        添加对比
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        editColumnProps={{
                            width: 200,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '执行',
                                        onClick: debounce(this.excute.bind(this, record, index), CONSTANTS.TIME_OUT),
                                        disabled: record.tableLoading || record.lastStatus == 2,
                                        funcCode: '/md/compare/manage/action',
                                    },
                                    {
                                        label: '编辑',
                                        onClick: this.openAddPage.bind(this, record, 'edit'),
                                        funcCode: '/md/compare/manage/edit',
                                    },
                                    {
                                        label: '详情',
                                        onClick: this.openDetailPage.bind(this, record),
                                    },
                                    {
                                        label: '删除',
                                        onClick: this.deleteData.bind(this, record),
                                        funcCode: '/md/compare/manage/delete',
                                    },
                                ]).concat(defaultElements)
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 380 }} value={queryInfo.name} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入任务名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'sourceDsId')} value={queryInfo.sourceDsId} placeholder='参照系统'>
                                        {sourceDsFilters.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'targetDsId')} value={queryInfo.targetDsId} placeholder='对比系统'>
                                        {targetDsFilters.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'lastStatus')} value={queryInfo.lastStatus} placeholder='执行状态'>
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
