import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu, message, Modal, Select, Tabs } from 'antd';
import { deleteTask, searchLineageJob } from 'app_api/metadataApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import DirectoryCollect from './directoryCollect'
import FileCollect from './fileCollect'
import PermissionWrap from '@/component/PermissionWrap'

const { TabPane } = Tabs

const confirm = Modal.confirm

export default class sourceAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            tabValue: '1',
            loading: false,
            tableData: [],
            deviationOutrangeTableCount: 0,
            missingPartitionTableCount: 0,
            partitionedTableCount: 0,
            tableId: '',
            needIgnorance: false,
            sqlContent: '',
            detailInfo: {
                edmSpecsTaskDTO: {
                    databaseIdNameList: [],
                },
                edmSpecsTaskResultDTO: {},
            },
            queryInfo: {
                jobTypeList: undefined,
                name: '',
                strategyList: undefined,
                statusList: undefined,
            },
            disabledFileCollect: false,
        }
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                align: 'left',
                width: '22%',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '任务执行状态',
                dataIndex: 'status',
                key: 'status',
                width: '16%',
                render: (text, record) => {
                    if (text == 2) {
                        return <StatusLabel type='error' message={record.statusMessage} />
                    } else if (text == 1) {
                        return <StatusLabel type='success' message={record.statusMessage} />
                    } else if (text == 0) {
                        return <StatusLabel type='loading' message={record.statusMessage} />
                    } else {
                        return <StatusLabel type='warning' message={record.statusMessage} />
                    }
                },
            },
            {
                title: '数据源名称',
                dataIndex: 'datasourceName',
                key: 'columnNameCn',
                align: 'left',
                width: '16%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '更新策略',
                dataIndex: 'strategy',
                key: 'strategy',
                width: '10%',
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
                title: '采集类型',
                dataIndex: 'jobType',
                key: 'jobType',
                width: '12%',
                render: (text, record) => {
                    if (text == 1) {
                        return '文件采集'
                    } else if (text == 2) {
                        return '目录采集'
                    }
                },
            },
            {
                title: '最新执行时间',
                dataIndex: 'execAt',
                key: 'execAt',
                width: '14%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '责任人',
                dataIndex: 'owner',
                key: 'owner',
                width: '12%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.searchLineageJobExist()
    }
    openDetailPage = (data) => {
        data.pageType = data.jobType
        this.props.addTab('任务详情', data)
    }
    openEditPage = (data) => {
        // this.props.addTab('目录采集', { title: '编辑目录采集', ...data })
        this.setState({ visibleDirectory: true, directoryParam: { title: '编辑目录采集', ...data } })
    }
    deleteTask = (data) => {
        return deleteTask([data]).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            jobTypeList: queryInfo.jobTypeList ? [queryInfo.jobTypeList] : [],
            strategyList: queryInfo.strategyList ? [queryInfo.strategyList] : [],
            statusList: queryInfo.statusList || queryInfo.statusList == 0 ? [queryInfo.statusList] : [],
            name: this.state.queryInfo.name,
        }
        this.setState({ loading: true })
        let res = await searchLineageJob(query)
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
        }
        this.setState({ loading: false })
        return {
            dataSource: res.data,
            total: res.total,
        }
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
        queryInfo.name = ''
        queryInfo.statusList = undefined
        queryInfo.strategyList = undefined
        queryInfo.jobTypeList = undefined
        await this.setState({
            queryInfo,
        })
        this.search()
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
        queryInfo.name = e.target.value
        this.setState({
            queryInfo,
        })
    }
    searchLineageJobExist = async () => {
        let query = {
            page: 1,
            pageSize: 100000,
            jobTypeList: [2],
        }
        let res = await searchLineageJob(query)
        if (res.code == 200) {
            this.setState({
                disabledFileCollect: res.data.length ? true : false,
            })
        }
    }
    onClickMenu = (e) => {
        if (e.key == 1) {
            this.setState({ visibleFileCollect: true })
        } else {
            this.setState({ visibleDirectory: true })
        }
    }

    render() {
        const { tableData, loading, modalVisible, detailInfo, sqlContent, tabValue, queryInfo, disabledFileCollect, visibleDirectory, directoryParam } = this.state
        const menu = (
            <Menu onClick={this.onClickMenu}>
                <Menu.Item key='1'>文件采集</Menu.Item>
                <Menu.Item disabled={disabledFileCollect} key='2'>
                    目录采集
                </Menu.Item>
            </Menu>
        )
        return (
            <React.Fragment>
                <RichTableLayout
                    title='采集任务'
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/lineage/collect/task/manage/collect'>
                                <Dropdown overlay={menu} placement='bottomLeft'>
                                    <Button style={{ width: 100, marginRight: 8 }} type='primary'>
                                        血缘采集
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </PermissionWrap>
                        );
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={queryInfo.name} onSearch={this.search} onChange={this.changeName} placeholder='输入任务名称' />
                                <Select placeholder='分析结果' allowClear value={queryInfo.statusList} onChange={this.changeSelect.bind(this, 'statusList')}>
                                    <Option value={3} key={3}>
                                        未分析
                                    </Option>
                                    <Option value={0} key={0}>
                                        分析中
                                    </Option>
                                    <Option value={1} key={1}>
                                        完成
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
                                <Select allowClear placeholder='采集类型' value={queryInfo.jobTypeList} onChange={this.changeSelect.bind(this, 'jobTypeList')}>
                                    <Option value={1} key={1}>
                                        文件采集
                                    </Option>
                                    <Option value={2} key={2}>
                                        目录采集
                                    </Option>
                                </Select>
                                <Button onClick={this.reset} className='searchBtn'>
                                    重置
                                </Button>
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
                    tableProps={{
                        columns: this.columns,
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteTask(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/lineage/collect/task/manage/delete'
                        }
                    }}
                    editColumnProps={{
                        width: '16%',
                        createEditColumnElements: (index, record, defaultElements) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '详情',
                                    onClick: this.openDetailPage.bind(this, record),
                                },
                                {
                                    label: '编辑',
                                    funcCode: '/lineage/collect/task/manage/edit',
                                    onClick: this.openEditPage.bind(this, record),
                                    disabled: record.jobType !== 2,
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {this.renderFileCollection()}
                {visibleDirectory && (
                    <DirectoryCollect
                        location={{
                            state: directoryParam || {},
                        }}
                        visible={visibleDirectory}
                        onClose={() => this.setState({ visibleDirectory: false })}
                        onSuccess={() => {
                            this.setState({ visibleDirectory: false })
                            this.search()
                        }}
                    />
                )}
            </React.Fragment>
        );
    }

    renderFileCollection() {
        const { visibleFileCollect } = this.state
        return visibleFileCollect ? (
            <FileCollect
                visible={visibleFileCollect}
                onClose={() => {
                    this.setState({ visibleFileCollect: false })
                    this.search()
                }}
            />
        ) : null
    }
}
