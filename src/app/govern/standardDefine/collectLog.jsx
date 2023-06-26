import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Input, Modal, Select } from 'antd'
import Cache from 'app_utils/cache'
import { Button, Tooltip } from 'lz_antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import _ from 'underscore'
// import '../style.less'
import HandCollectionRecordList from './handCollectionRecordList'
import store from './hand_store'

const Option = Select.Option

const taskStatusMap = {
    0: '等待采集',
    1: '正在采集',
    2: '采集完成',
    3: '采集失败',
}

@observer
export default class HandCollectionRecord extends Component {
    constructor(props) {
        super(props)
        console.log(props)

        this.hasSim = this.props.location.state.hasSim
        this.columns = [
            {
                dataIndex: 'jobName',
                key: 'jobName',
                title: '任务名称',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'extractorType',
                key: 'extractorType',
                title: '采集方式',
                width: 120,
                render: (text, record, index) => {
                    if (record.extractorType == '1') {
                        return '自动采集'
                    } else {
                        return '模板采集'
                    }
                },
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: '任务状态',
                className: 'lastStatusSpan',
                width: 140,
                render: (text, record, index) => {
                    if (record.status == '1') {
                        return <StatusLabel type='loading' message='正在采集' />
                    } else if (record.status == '2') {
                        return <StatusLabel type='success' message='采集完成' />
                    } else if (record.status == '3') {
                        return <StatusLabel type='error' message='采集失败' />
                    } else if (record.status == '0') {
                        return <StatusLabel type='info' message='等待采集' />
                    } else {
                        return <span>暂无状态</span>
                    }
                },
            },
            {
                dataIndex: 'startTime',
                key: 'startTime',
                title: '起始时间',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                dataIndex: 'finishTime',
                key: 'finishTime',
                title: '结束时间',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]

        this.filter = (
            <div className='top_filter'>
                <Button
                    authId={
                        this.props.location.state && this.props.location.state.authIds && this.props.location.state.authIds.handCollectionRecordDeleteId
                            ? this.props.location.state.authIds.handCollectionRecordDeleteId
                            : null
                    }
                    className='changeBtn'
                    onClick={this.onCancel}
                >
                    删除
                </Button>
                {/* <Button onClick={this.cancelTask}>取消任务</Button> */}
            </div>
        )
        this.selectedRows = [] // 表格里选择的项
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                store.onSelectChange(selectedRowKeys, selectedRows)
            },
            type: 'checkbox',
        }
        this.selectRowFlag = undefined
    }

    componentDidMount() {
        const { area } = this.props.location.state
        store.area = area
        // this.controller.reset()
        console.log(area, 'area++++++++++++++++++')
        let currentPage = Cache.get('currentPage')
        // if (currentPage) {
        //     store.changeJobId(undefined)
        //     store.resetCondition()
        // } else {
        //
        // }
        // if (this.props.location.state.from !== 'autoCollection') {
        //     store.changeJobId(this.props.location.state.id)
        //     store.getTableData()
        // } else {
        //     store.getTableData()
        // }
    }

    // flag请求仿真日志接口
    recordDetail = (e, index, record, flag) => {
        console.log('---recordDetail-----')
        e.stopPropagation()
        store.resetRecordData()
        store.setLogId(flag ? record.simLogId : record.logId)
        store.showModal()
        store.showLoading()
        store.recordStatus = record.status
        store.getExtractLog(1, 10, flag)
        this.selectRowFlag = flag
    }

    onCancel = (rows) => {
        return store.delExtractorJobData(rows)
    }

    deleteCofirm = () => {
        Modal.confirm({
            title: '确定删除您当前选择的项吗？',
            // content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                store.delExtractorJobData()
            },
        })
    }

    searchTableData = (params) => {
        return store.searchTableData(params)
    }
    render() {
        const { tableLoading, tableData, searchCondition = {}, pagination, getTableData } = store
        return (
            <React.Fragment>
                <HandCollectionRecordList selectRowFlag={this.selectRowFlag} />
                <RichTableLayout
                    title='标准采集日志'
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search
                                    allowClear
                                    onSearch={(value) => {
                                        this.searchTableData(value)
                                        this.controller.reset()
                                    }}
                                    placeholder='请输入任务名称'
                                    value={searchCondition.keyword}
                                    onChange={store.keywordChange}
                                />
                                <Select
                                    value={searchCondition.status || undefined}
                                    allowClear
                                    onChange={(value) => {
                                        store.statusChange(value)
                                        this.controller.reset()
                                    }}
                                    placeholder='任务状态'
                                >
                                    {_.map(taskStatusMap, (node, index) => {
                                        return (
                                            <Option key={index} value={index}>
                                                {node}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button
                                    onClick={() => {
                                        store.resetCondition()
                                        this.controller.reset()
                                    }}
                                >
                                    重置
                                </Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        selectedEnable: true,
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.searchTableData({
                            page,
                            page_size: pageSize,
                        })
                    }}
                    deleteFunction={(_, rows) => {
                        return this.onCancel(rows)
                    }}
                    editColumnProps={{
                        width: 150,
                        createEditColumnElements: (index, record, defaultElements) => {
                            let log1Label = ''
                            let log2Label = ''
                            if (record.logId && record.logId !== '') {
                                log1Label = this.hasSim ? '生产日志' : '日志详情'
                            }
                            if (record.simLogId && record.simLogId !== '') {
                                log1Label = this.hasSim ? '生产日志' : '日志详情'
                                log2Label = '仿真日志'
                            }

                            return RichTableLayout.renderEditElements([
                                {
                                    label: log1Label,
                                    onClick: (e) => this.recordDetail(e, index, record),
                                },
                                {
                                    log2Label,
                                    onClick: (e) => this.recordDetail(e, index, record, true),
                                    disabled: !log2Label,
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
            </React.Fragment>
        )
    }
}
