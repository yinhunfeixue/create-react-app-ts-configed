import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Input, message, Modal, Select } from 'antd'
import { delExtractorJob, extractorJob } from 'app_api/metadataApi'
import Cache from 'app_utils/cache'
import { Button, Tooltip } from 'lz_antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
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

        const { area, jobName } = props.param

        this.state = {
            area,
            keyword: jobName ? jobName : '',
            jobId: '',
            status: undefined,
            extractType: 2,
        }
        if (props.param.from !== 'autoCollection') {
            this.state.jobId = props.param.id
        }

        this.hasSim = this.props.param.hasSim
        this.columns = [
            {
                dataIndex: 'jobName',
                key: 'jobName',
                title: '任务名称',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'extractorType',
                key: 'extractorType',
                title: '采集方式',
                width: '120',
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
                    switch (record.status) {
                        case 0:
                            return <StatusLabel message='等待采集' type='info' />
                        case 1:
                            return <StatusLabel message='正在采集' type='loading' />
                        case 2:
                            return <StatusLabel message='采集完成' type='success' />
                        case 3:
                            return <StatusLabel message='采集失败' type='error' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'startTime',
                key: 'startTime',
                title: '起始时间',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]

        this.filter = (
            <div className='top_filter'>
                <Button
                    authId={this.props.param && this.props.param.authIds && this.props.param.authIds.handCollectionRecordDeleteId ? this.props.param.authIds.handCollectionRecordDeleteId : null}
                    className='changeBtn'
                    onClick={this.onCancel}
                >
                    删除
                </Button>
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
        const { area } = this.props.param
        store.area = area
        this.state.area = area
        let currentPage = Cache.get('currentPage')
        // if (this.props.param.from !== 'autoCollection') {
        //     store.changeJobId(this.props.param.id)
        //     this.state.jobId = this.props.param.id
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

    onCancel = () => {
        if (store.selectedRows.slice().length == 0) {
            message.warning('请选择要删除的项！')
        } else {
            this.deleteCofirm()
        }
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

    searchTableData = () => {
        this.controller.reset()
    }

    requestListFunction = async (page, pageSize) => {
        const { keyword, jobId, area, status, extractType } = this.state
        this.pagination = {
            page,
            page_size: pageSize,
            keyword,
            area,
            jobId,
            status,
            extractType,
        }
        let res = await extractorJob(this.pagination)
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    requestDelete = async (list) => {
        const res = await delExtractorJob(list)
        if (res.code == 200) {
            message.success(res.msg)
            return Promise.resolve()
        } else {
            return Promise.reject()
        }
    }

    render() {
        // 这里注释的 不要去掉 去掉的话子组件里的store不会生效
        const { status, keyword } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    disabledDefaultFooter
                    smallLayout
                    requestListFunction={this.requestListFunction}
                    tableProps={{
                        // selectedEnable: true,
                        columns: this.columns,
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search
                                    allowClear
                                    onSearch={this.searchTableData}
                                    size='default'
                                    placeholder='请输入任务名称'
                                    className='datasourceInput'
                                    value={keyword}
                                    onChange={(event) => this.setState({ keyword: event.target.value })}
                                />
                                <Select
                                    value={status || undefined}
                                    allowClear
                                    className='datasourceSelect'
                                    onChange={(value) => {
                                        this.setState({ status: value }, () => this.searchTableData())
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
                                        this.setState({ keyword: '', status: undefined, jobId: '' }, () => this.searchTableData())
                                    }}
                                >
                                    重置
                                </Button>
                            </React.Fragment>
                        )
                    }}
                    // deleteFunction={(keys) => {
                    //     return this.requestDelete(keys)
                    // }}
                    editColumnProps={{
                        width: 180,
                        createEditColumnElements: (index, record, defaultElement) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: this.hasSim ? '生产日志' : '日志',
                                    onClick: (e) => this.recordDetail(e, index, record),
                                    disabled: !record.simLogId && !record.logId,
                                },
                                {
                                    label: '仿真日志',
                                    onClick: (e) => this.recordDetail(e, index, record, true),
                                    disabled: !record.simLogId,
                                },
                            ]).concat(defaultElement)
                        },
                    }}
                />
                <HandCollectionRecordList selectRowFlag={this.selectRowFlag} />
            </React.Fragment>
        )
    }
}
