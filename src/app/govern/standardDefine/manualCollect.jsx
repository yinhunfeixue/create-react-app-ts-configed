import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { DownloadOutlined } from '@ant-design/icons'
import { message, Modal, Tooltip } from 'antd'
import { Button } from 'lz_antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import HandCollectionRecordList from './handCollectionRecordList'
// import './style.less'
import logStore from './hand_store'
// import '../style.less'
import RecordSubmit from './recordSubmit.jsx'
import SearchTool from './searchTool.jsx'
import store from './store'
import PermissionWrap from '@/component/PermissionWrap'

const confirm = Modal.confirm

const strategyMap = {
    1: '全量',
    2: '激进全量',
    3: '增量',
}

const fileTplMap = {
    basicsStandardNew: '01_基础数据标准模板',
    targetStandard: '02_指标数据标准模板',
    codeStandardNew: '03_标准代码项采集模板',
    standardFieldMapping: '04_标准-字段映射关系采集模板',
    standardMapping: '05_标准-指标映射关系采集模板',
    codeStandardMapping: '06_源系统代码值和标准代码值映射模板',
}

const fileTplArr = ['codeStandardMapping', 'codeStandardNew', 'basicsStandardNew', 'targetStandard', 'standardMapping', 'standardFieldMapping']

@observer
export default class CollectionRecord extends Component {
    constructor(props) {
        super(props)

        this.columns = [
            {
                dataIndex: 'jobName',
                key: 'jobName',
                title: '任务名称',
                width: '18%',
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
                dataIndex: 'fileTpl',
                key: 'fileTpl',
                title: '文件模板',
                width: '24%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={fileTplMap[text]}>
                            <span className='LineClamp'>{fileTplMap[text]}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'strategy',
                key: 'strategy',
                title: '入库策略',
                width: '16%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={strategyMap[text]}>
                            <span className='LineClamp'>{strategyMap[text]}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '任务状态',
                width: '16%',
                render: (_, record) => {
                    const { extractor } = record
                    if (extractor.status == '1') {
                        return <StatusLabel type='loading' message='正在采集' />
                    } else if (extractor.status == '2') {
                        return <StatusLabel type='success' message='采集完成' />
                    } else if (extractor.status == '3') {
                        return <StatusLabel type='error' message='采集失败' />
                    } else if (extractor.status == '0') {
                        return <StatusLabel type='info' message='等待采集' />
                    } else {
                        return <span>暂无状态</span>
                    }
                },
            },

            {
                title: '起始时间',
                width: '20%',
                render: (_, record) => {
                    const { extractor } = record
                    return extractor.startTime
                },
            },
            {
                title: '耗时（s）',
                width: '14%',
                render: (_, record) => {
                    const { extractor, useTime } = record
                    if (useTime === 0) return '-'
                    if (useTime < 1000) {
                        return '< 1s'
                    } else {
                        return (useTime / 1000).toFixed(1) + 's'
                    }
                },
            },
        ]
        this.state = {
            tableModalVisible: false,
            addContentVisible: true,
            searchParams: {
                fileTpl: fileTplArr,
            },
        }
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                store.getTableRow(selectedRows)
            },
            type: 'checkbox',
        }
    }

    componentDidMount() {
        store.addContentVisible = false
    }

    getTableList(params) {
        const { searchParams } = this.state
        console.log(params, searchParams)
        return store.getTableData({ ...searchParams, ...params })
    }

    handleSubmit

    onDownLoad = () => {
        const url = '../../../../../resources/template/standardAcquisitionTemplate.zip'
        window.open(url, '_self')
    }

    // 日志详情查看方法
    recordDetail = (index, record) => {
        // Cache.remove('currentPage')
        this.props.addTab('标准采集日志', { ...record, from: 'handCollection', area: 'standard' })
    }

    // 关闭modal框
    onCancel = () => {
        this.setState({
            tableModalVisible: !this.state.tableModalVisible,
        })
    }

    // 添加
    onAdd = () => {
        store.addTask()
    }

    // 删除任务
    onDelete = () => {
        if (store.selectedRows.length === 0) {
            message.warning('请选择删除对象')
            return
        }
        confirm({
            title: '是否确定删除当前选择的项',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                store.onDel()
            },
        })
    }

    // flag请求仿真日志接口
    recordLogDetail = (e, index, record, flag) => {
        console.log('---recordLogDetail-----')
        e.stopPropagation()
        logStore.resetRecordData()
        logStore.setLogId(flag ? record.simLogId : record.logId)
        logStore.showModal()
        logStore.showLoading()
        logStore.recordStatus = record.status
        logStore.getExtractLog(1, 10, flag)
        this.selectRowFlag = flag
    }

    render() {
        const { addContentVisible } = store
        return (
            <React.Fragment>
                <RichTableLayout
                    title='标准采集'
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <SearchTool
                                refresh={(values) => {
                                    this.setState({ searchParams: values }, () => {
                                        controller.reset()
                                    })
                                }}
                            />
                        )
                    }}
                    renderHeaderExtra={() => {
                        return (
                            <React.Fragment>
                                {/* <Button authId='template:download' icon={<DownloadOutlined />} onClick={this.onDownLoad} type='primary' ghost>
                                    模板下载
                                </Button> */}
                                <PermissionWrap funcCode='/dtstd/collect/manage/add'>
                                    <Button authId='standard:manualjob:create' onClick={this.onAdd} type='primary'>
                                        新增标准采集
                                    </Button>
                                </PermissionWrap>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            page,
                            page_size: pageSize,
                        })
                    }}
                    editColumnProps={{
                        width: 100,
                        createEditColumnElements: (index, record, defaultElements) => {
                            const { extractor } = record
                            let log1Label = '日志详情'
                            let log2Label = ''
                            if (extractor.simLogId && extractor.simLogId !== '') {
                                log2Label = '仿真日志'
                            }

                            return RichTableLayout.renderEditElements([
                                {
                                    label: log1Label,
                                    onClick: (e) => this.recordLogDetail(e, index, extractor),
                                },
                                {
                                    log2Label,
                                    onClick: (e) => this.recordLogDetail(e, index, extractor, true),
                                    disabled: !log2Label,
                                },
                            ])
                        },
                    }}
                />
                <RecordSubmit visible={addContentVisible} onSuccess={() => this.controller.refresh()} />
                <HandCollectionRecordList selectRowFlag={this.selectRowFlag} />
            </React.Fragment>
        )
    }
}
