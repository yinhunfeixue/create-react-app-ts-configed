import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Button, Divider, Input, List, message, Pagination, Select, Spin, Tabs, Tooltip } from 'antd'
import { extractLog, getJobById, searchLineageJobLog } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './collectTaskDetail.less'
const { TabPane } = Tabs

export default class sourceAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            tabValue: this.props.location.state.pageType !== 2 ? '2' : '1',
            loading: false,
            tableData: [],
            deviationOutrangeTableCount: 0,
            missingPartitionTableCount: 0,
            partitionedTableCount: 0,
            tableId: '',
            needIgnorance: false,
            sqlContent: '',
            queryInfo: {},
            detailInfo: {},
            spinLoading: false,
            recordData: [],
            current: 1,
            total: 0,
            logId: '',
        }
        this.exeColumns = [
            {
                title: '执行ID',
                dataIndex: 'executeId',
                key: 'executeId',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '更新文件数',
                dataIndex: 'updateNums',
                key: 'updateNums',
                align: 'right',
                width: 100,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '分析结果',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: 120,
                render: (text, record) => {
                    if (text == 2) {
                        return (
                            <Tooltip placement='topLeft' title={record.statusDesc}>
                                <span style={{ color: '#F23F30' }}>
                                    <CloseCircleFilled style={{ color: '#F23F30', paddingRight: '5px' }} />
                                    {record.statusDesc}
                                </span>
                            </Tooltip>
                        )
                    } else if (text == 1) {
                        return (
                            <Tooltip placement='topLeft' title={record.statusDesc}>
                                <span style={{ color: '#6CB324' }}>
                                    <CheckCircleFilled style={{ paddingRight: '5px' }} />
                                    {record.statusDesc}
                                </span>
                            </Tooltip>
                        )
                    } else {
                        return (
                            <Tooltip placement='topLeft' title={record.statusDesc}>
                                <span>{record.statusDesc}</span>
                            </Tooltip>
                        )
                    }
                },
            },
            {
                title: '耗时（秒）',
                dataIndex: 'duration',
                key: 'duration',
                align: 'right',
                width: 120,
                render: (text, record) => {
                    if (text < 0) {
                        return <EmptyLabel />
                    }
                    return <span>{parseFloat((parseInt(text) / 1000).toFixed(3))}</span>
                },
            },
            {
                title: '开始时间',
                dataIndex: 'execTime',
                key: 'execTime',
                align: 'center',
                width: 150,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '结束时间',
                dataIndex: 'finishTime',
                key: 'finishTime',
                align: 'center',
                width: 150,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
        this.columns = [
            {
                title: '文件名称',
                dataIndex: 'filename',
                key: 'filename',
                minWidth: 300,
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'status',
                title: '分析结果',
                key: 'status',
                width: 100,
                render: (text, record) => {
                    if (text == 2) {
                        return (
                            <Tooltip placement='topLeft' title={record.statusDesc}>
                                <span style={{ color: '#F23F30' }}>
                                    <CloseCircleFilled style={{ color: '#F23F30', paddingRight: '5px' }} />
                                    {record.statusDesc}
                                </span>
                            </Tooltip>
                        )
                    } else if (text == 1) {
                        return <StatusLabel message={record.statusDesc} type='success' />
                    } else {
                        return <StatusLabel message={record.statusDesc} type='info' />
                    }
                },
            },
            {
                title: '最新开始时间',
                dataIndex: 'execTime',
                key: 'execTime',
                width: 200,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '最新结束时间',
                dataIndex: 'finishTime',
                key: 'finishTime',
                width: 200,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '分析时长（秒）',
                dataIndex: 'duration',
                key: 'duration',
                width: 160,
                render: (text, record) => {
                    if (text < 0) {
                        return <EmptyLabel />
                    }
                    return <span>{parseFloat((parseInt(text) / 1000).toFixed(3))}</span>
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getDetailInfo()
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    openSqlflowPage = (data) => {
        data.id = data.fileId
        console.log('data', data)
        this.props.addTab('sqlFlow', data)
    }
    openRecordPage = (data) => {
        this.props.addTab('血缘文件详情', { ...data, id: data.fileId })
    }
    getDetailInfo = async () => {
        let res = await getJobById({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    openDataLog = async (data) => {
        await this.setState({
            modalVisible: true,
            logId: data.logId,
        })
        this.getExtractLog()
    }
    getExtractLog = async () => {
        let query = {
            logId: this.state.logId,
            page: this.state.current,
            pageSize: 10,
        }
        this.setState({ spinLoading: true })
        let res = await extractLog(query)
        this.setState({ spinLoading: false })
        if (res.code == 200) {
            let recordData = []
            res.data.map((item) => {
                recordData.push({
                    content: item[1],
                })
            })
            this.setState({
                recordData,
                total: res.total,
            })
        }
    }
    openDetailPage = (data) => {
        data.pageType = 3
        data.parentId = data.id
        data.name = this.props.location.state.name
        this.props.addTab('任务详情', { title: '执行详情', ...data })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            jobId: this.props.location.state.pageType == 3 ? undefined : this.props.location.state.id,
            jobType: this.props.location.state.pageType == 2 ? this.props.location.state.jobType : undefined,
            parentId: this.props.location.state.parentId,
            filename: queryInfo.filename,
            executeId: queryInfo.executeId,
            statusList: queryInfo.statusList || queryInfo.statusList == 0 ? [queryInfo.statusList] : [],
        }
        this.setState({ loading: true })
        let res = await searchLineageJobLog(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)

            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    search = () => {
        // this.getTableList()
        this.controller.reset()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo.filename = ''
        queryInfo.executeId = ''
        queryInfo.statusList = undefined
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    onChangeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    handlePaginationOnChangeRecord = async (page) => {
        await this.setState({
            current: page,
        })
        this.getExtractLog()
    }
    showTotalRecord = (total, range) => {
        const totalPageNum = Math.ceil(total / 10)
        return `共${totalPageNum}页，${total}条数据`
    }
    changeSelect = async (name, value) => {
        let { queryInfo } = this.state
        queryInfo[name] = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeExecuteId = (e) => {
        let { queryInfo } = this.state
        queryInfo.executeId = e.target.value
        this.setState({
            queryInfo,
        })
    }
    changeName = (e) => {
        let { queryInfo } = this.state
        queryInfo.filename = e.target.value
        this.setState({
            queryInfo,
        })
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { tableData, loading, modalVisible, sqlContent, tabValue, spinLoading, recordData, current, total, queryInfo, detailInfo } = this.state

        const { pageType, executeId, updateNums, statusDesc, status, name } = this.pageParam

        let strategyName = <EmptyLabel />
        if (detailInfo.strategy == 1) {
            strategyName = '保守全量'
        } else if (detailInfo.strategy == 2) {
            strategyName = '激进全量'
        } else if (detailInfo.strategy == 3) {
            strategyName = '增量更新'
        } else if (detailInfo.strategy == 4) {
            strategyName = '替换'
        }
        return (
            <React.Fragment>
                <TableLayout
                    title='任务详情'
                    className='collectTaskDetail'
                    renderTable={() => {
                        return (
                            <React.Fragment>
                                <Module title='基础信息'>
                                    <div className='MiniForm Grid4'>
                                        {RenderUtil.renderFormItems(
                                            pageType == 3
                                                ? [
                                                      {
                                                          label: '执行ID',
                                                          content: executeId,
                                                      },
                                                      {
                                                          label: '更新文件数',
                                                          content: updateNums,
                                                      },
                                                      {
                                                          label: '分析结果',
                                                          content: <span style={{ color: status == '1' ? '#6CB324' : status == '2' ? '#F23F30' : '' }}>{statusDesc}</span>,
                                                      },
                                                  ]
                                                : [
                                                      {
                                                          label: '任务名称',
                                                          content: name,
                                                      },
                                                      {
                                                          label: '数据源',
                                                          content: detailInfo.datasourceName,
                                                      },
                                                      {
                                                          label: '更新策略',
                                                          content: strategyName,
                                                      },
                                                      {
                                                          label: 'SQL类型',
                                                          content: detailInfo.type,
                                                      },
                                                      {
                                                          label: '存储类型',
                                                          content: detailInfo.storageType == 1 ? 'HDFS' : detailInfo.storageType == 2 ? 'File' : <EmptyLabel />,
                                                      },
                                                      {
                                                          label: '文件目录',
                                                          content: detailInfo.directoryPath,
                                                      },
                                                  ]
                                        )}
                                    </div>
                                </Module>
                                <Module title='文件列表'>
                                    <RichTableLayout
                                        smallLayout
                                        disabledDefaultFooter
                                        tableProps={{
                                            columns: pageType == 2 ? this.exeColumns : this.columns,
                                        }}
                                        renderSearch={(controller) => {
                                            this.controller = controller
                                            return pageType == 2 ? (
                                                <React.Fragment>
                                                    <Input.Search allowClear value={queryInfo.executeId} onChange={this.changeExecuteId} onSearch={this.search} placeholder='输入执行ID' />
                                                    <Select placeholder='分析结果' allowClear value={queryInfo.statusList} onChange={this.changeSelect.bind(this, 'statusList')}>
                                                        <Option value={0} key={0}>
                                                            未分析
                                                        </Option>
                                                        <Option value={3} key={3}>
                                                            分析中
                                                        </Option>
                                                        <Option value={1} key={1}>
                                                            已分析
                                                        </Option>
                                                        <Option value={2} key={2}>
                                                            分析失败
                                                        </Option>
                                                    </Select>
                                                    <Button onClick={this.reset}>重置</Button>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Input.Search allowClear value={queryInfo.filename} onChange={this.changeName} onSearch={this.search} placeholder='输入文件名' />
                                                    <Select placeholder='分析结果' allowClear value={queryInfo.statusList} onChange={this.changeSelect.bind(this, 'statusList')}>
                                                        <Option value={0} key={0}>
                                                            未分析
                                                        </Option>
                                                        <Option value={3} key={3}>
                                                            分析中
                                                        </Option>
                                                        <Option value={1} key={1}>
                                                            已分析
                                                        </Option>
                                                        <Option value={2} key={2}>
                                                            分析失败
                                                        </Option>
                                                    </Select>

                                                    <Button onClick={this.reset}>重置</Button>
                                                </React.Fragment>
                                            )
                                        }}
                                        requestListFunction={(page, pageSize) => {
                                            return this.getTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                },
                                            })
                                        }}
                                        editColumnProps={{
                                            width: 180,
                                            createEditColumnElements: (index, record, defaultElements) => {
                                                return RichTableLayout.renderEditElements(
                                                    pageType == 2
                                                        ? [
                                                              {
                                                                  label: '查看明细',
                                                                  onClick: this.openDetailPage.bind(this, record),
                                                              },
                                                          ]
                                                        : [
                                                              {
                                                                  label: '可视化',
                                                                  disabled: record.status == 0 || record.status == 2,
                                                                  onClick: this.openSqlflowPage.bind(this, record),
                                                              },
                                                              {
                                                                  label: '日志',
                                                                  disabled: record.status == 0,
                                                                  onClick: this.openDataLog.bind(this, record),
                                                              },
                                                              {
                                                                  label: '详情',
                                                                  disabled: record.status == 0,
                                                                  onClick: this.openRecordPage.bind(this, record),
                                                              },
                                                          ]
                                                )
                                            },
                                        }}
                                    />
                                </Module>
                            </React.Fragment>
                        )
                    }}
                />

                <DrawerLayout
                    drawerProps={{
                        title: '日志详情',
                        width: 800,
                        visible: modalVisible,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        if (modalVisible) {
                            return (
                                <Pagination
                                    current={current}
                                    total={total}
                                    onChange={this.handlePaginationOnChangeRecord}
                                    showTotal={(total) => (
                                        <span>
                                            总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                        </span>
                                    )}
                                />
                            )
                        }
                    }}
                >
                    {modalVisible ? (
                        <Spin spinning={spinLoading}>
                            <List size='small' dataSource={recordData} renderItem={(item) => <List.Item className='modalList'>{item.content}</List.Item>} />
                        </Spin>
                    ) : null}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
