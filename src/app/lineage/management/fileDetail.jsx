import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import Code from '@/components/code/Code'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, List, message, Pagination, Select, Spin, Tabs, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { extractLog, getJobById, getLineageFileById, searchLineageJobLog } from 'app_api/metadataApi'
import React, { Component } from 'react'
// import '../style.less'
const { TabPane } = Tabs

export default class sourceAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            logId: '',
            spinLoading: false,
            recordData: [],
            current: 1,
            total: 0,
            tabValue: '1',
            loading: false,
            tableData: [],
            sqlContent: '',
            fileInfo: {},
            detailInfo: {
                edmSpecsTaskDTO: {
                    databaseIdNameList: [],
                },
                edmSpecsTaskResultDTO: {},
            },
            queryInfo: {
                filename: '',
                statusList: undefined,
                strategyList: undefined,
            },
        }
        this.columns = [
            {
                title: '所属任务名称',
                dataIndex: 'jobName',
                key: 'jobName',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '分析结果',
                dataIndex: 'status',
                key: 'status',
                width: 120,
                render: (text, record) => {
                    switch (text) {
                        case 1:
                            return <StatusLabel message={record.statusDesc} type='success' />
                        case 2:
                            return <StatusLabel message={record.statusDesc} type='error' />
                        default:
                            return <StatusLabel message={record.statusDesc} type='info' />
                    }
                },
            },
            {
                title: '更新策略',
                dataIndex: 'strategy',
                key: 'strategy',
                width: 100,
                render: (text, record) => {
                    if (text == 1) {
                        return '保守全量'
                    } else if (text == 2) {
                        return '激进全量'
                    } else if (text == 3) {
                        return '增量更新'
                    } else if (text == 4) {
                        return '替换'
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '分析时长（秒）',
                dataIndex: 'duration',
                key: 'duration',
                width: 150,
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
                width: 200,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '任务创建人',
                dataIndex: 'createdUser',
                key: 'createdUser',
                width: 100,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
    }
    componentWillMount = () => {
        this.getFilePreview()
    }
    getFilePreview = async () => {
        let res = await getLineageFileById({ id: this.props.location.state.id, withFileContent: true })
        if (res.code == 200) {
            this.setState({
                fileInfo: res.data,
                sqlContent: res.data.content,
            })
            ProjectUtil.setDocumentTitle(res.data.name)
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
    openDetailPage = async (data) => {
        let res = await getJobById({ id: data.jobId })
        if (res.code == 200) {
            data.pageType = 1
            data.jobType = 1
            data.id = data.jobId
            data.name = data.jobName
            this.props.addTab('任务详情', data)
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            fileId: this.props.location.state.id,
            jobName: queryInfo.filename,
            statusList: queryInfo.statusList || queryInfo.statusList == 0 ? [queryInfo.statusList] : [],
            strategyList: queryInfo.strategyList ? [queryInfo.strategyList] : [],
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
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo.filename = ''
        queryInfo.statusList = undefined
        queryInfo.strategyList = undefined
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    onChangeTab = (e) => {
        this.setState({
            tabValue: e,
        })
        if (e == '2') {
            this.getTableList({})
        }
    }
    changeSelect = async (name, value) => {
        let { queryInfo } = this.state
        queryInfo[name] = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeName = (e) => {
        let { queryInfo } = this.state
        queryInfo.filename = e.target.value
        this.setState({
            queryInfo,
        })
    }

    render() {
        const { tableData, loading, modalVisible, detailInfo, sqlContent, tabValue, queryInfo, spinLoading, recordData, current, total, fileInfo } = this.state
        if (!queryInfo) {
            return
        }
        return (
            <React.Fragment>
                <TableLayout
                    title={fileInfo.name}
                    renderTable={() => {
                        return (
                            <React.Fragment>
                                <Module title='基本信息'>
                                    <div className='MiniForm Grid4'>
                                        <FormItem label='数据源'>{fileInfo.datasourceNameEn || <EmptyLabel />}</FormItem>
                                        <FormItem label='SQL类型：'>{fileInfo.datasourceType || <EmptyLabel />}</FormItem>
                                        <FormItem label='责任人：'>{fileInfo.owner || <EmptyLabel />}</FormItem>
                                    </div>
                                </Module>
                                <Tabs animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                    <TabPane tab='文件预览' key='1'>
                                        <div style={{ textAlign: 'left', marginBottom: 16 }}>仅展示最新版本 更新时间：{fileInfo.latestUpdateTime || <EmptyLabel />}</div>
                                        <div style={{ background: '#F7F8FA', padding: 15, minHeight: 480, width: '100%', resize: 'none', outline: 'none', border: 'none' }}>
                                            <Code code={sqlContent} />
                                        </div>
                                    </TabPane>
                                    <TabPane tab='更新历史' key='2'>
                                        <RichTableLayout
                                            disabledDefaultFooter
                                            smallLayout
                                            renderSearch={(controller) => {
                                                this.controller = controller
                                                return (
                                                    <React.Fragment>
                                                        <Input.Search allowClear value={queryInfo.filename} placeholder='输入任务名称' onSearch={this.search} onChange={this.changeName} />
                                                        <Select allowClear placeholder='分析结果' value={queryInfo.statusList} onChange={this.changeSelect.bind(this, 'statusList')}>
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
                                                        <Select allowClear placeholder='更新策略' value={queryInfo.strategyList} onChange={this.changeSelect.bind(this, 'strategyList')}>
                                                            <Option value={1} key={1}>
                                                                保守全量
                                                            </Option>
                                                            <Option value={2} key={2}>
                                                                激进全量
                                                            </Option>
                                                            <Option value={3} key={3}>
                                                                增量更新
                                                            </Option>
                                                            <Option value={4} key={4}>
                                                                替换
                                                            </Option>
                                                        </Select>
                                                        <Button onClick={this.reset} className='searchBtn'>
                                                            重置
                                                        </Button>
                                                    </React.Fragment>
                                                )
                                            }}
                                            tableProps={{
                                                columns: this.columns,
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
                                                width: 80,
                                                createEditColumnElements: (index, record) => {
                                                    return [
                                                        {
                                                            label: '日志',
                                                            onClick: this.openDataLog.bind(this, record),
                                                        },
                                                    ].map((item) => {
                                                        return (
                                                            <a key={item.label} onClick={item.onClick}>
                                                                {item.label}
                                                            </a>
                                                        )
                                                    })
                                                },
                                            }}
                                        />
                                    </TabPane>
                                </Tabs>
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
                        if (!modalVisible) {
                            return null
                        }
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
                    }}
                >
                    {modalVisible ? (
                        <div>
                            <Spin spinning={spinLoading}>
                                <div style={{ maxHeight: 350 }}>
                                    <List size='small' dataSource={recordData} renderItem={(item) => <List.Item className='modalList'>{item.content}</List.Item>} />
                                </div>
                            </Spin>
                        </div>
                    ) : null}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
