import EmptyLabel from '@/component/EmptyLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Input, List, message, Modal, Pagination, Select, Spin } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { deleteFile, extractLog, fileDownload, getSourceList, searchLineageFile } from 'app_api/metadataApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'

const Option = Select.Option
const confirm = Modal.confirm

const strategyObj = [
    // {
    //     value: 0,
    //     text: '删除'
    // },
    {
        value: 1,
        text: '保守全量',
    },
    {
        value: 2,
        text: '激进全量',
    },
    {
        value: 3,
        text: '增量更新',
    },
    {
        value: 4,
        text: '替换',
    },
]

// @Authorization('admin')
class BloodUpdateIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tablePagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none',
            },
            tableData: [],
            sourceData: [],
            name: undefined,
            strategy: undefined,
            datasource: undefined,
            creater: undefined,
            status: undefined,
            loading: false,
            selectedRowKeys: [],
            userList: [],
            modalVisible: false,
            queryInfo: {
                datasourceIdList: undefined,
                name: '',
                ownerList: undefined,
                statusList: undefined,
            },
            spinLoading: false,
            recordData: [],
            current: 1,
            total: 0,
            logId: '',
        }

        this.columns = [
            {
                dataIndex: 'name',
                title: '文件名称',
                key: 'name',
                width: '30%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'status',
                title: '分析结果',
                key: 'status',
                width: '14%',
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
                dataIndex: 'latestUpdateTime',
                title: '最近更新时间',
                key: 'latestUpdateTime',
                width: '18%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'datasourceNameEn',
                title: '所属数据源',
                key: 'datasourceNameEn',
                width: '16%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'owner',
                title: '责任人',
                key: 'owner',
                width: '12%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            // {
            //     dataIndex: 'operate',
            //     title: ' 操作',
            //     key: 'operate',
            //     width: 150,
            //     render: (text, record) => {
            //         return (
            //             <span>
            //                 <Button type='link' title='可视化' disabled={record.status == 0 || record.status == 2} onClick={this.openSqlflowPage.bind(this, record)} style={{ width: 24 }}>
            //                     <Icon
            //                         style={{
            //                             width: '24px',
            //                             height: '24px',
            //                             color: record.status == 0 || record.status == 2 ? '' : '#333',
            //                             lineHeight: '27px',
            //                             background: record.status == 0 || record.status == 2 ? '#f5f5f5' : '#e6f7ff',
            //                             borderRadius: '50%',
            //                             marginRight: '4px',
            //                         }}
            //                         type='branches'
            //                     />
            //                 </Button>
            //                 <Button type='link' title='日志' disabled={record.status == 0} onClick={this.openDataLog.bind(this, record)} style={{ width: 24 }}>
            //                     <Icon
            //                         style={{
            //                             width: '24px',
            //                             height: '24px',
            //                             color: record.status == 0 ? '' : '#333',
            //                             lineHeight: '27px',
            //                             background: record.status == 0 ? '#f5f5f5' : '#e6f7ff',
            //                             borderRadius: '50%',
            //                             marginRight: '4px',
            //                         }}
            //                         type='bars'
            //                     />
            //                 </Button>
            //                 <Button type='link' title='详情' disabled={record.status == 0} onClick={this.openRecordPage.bind(this, record)} style={{ width: 24 }}>
            //                     <Icon
            //                         style={{
            //                             width: '24px',
            //                             height: '24px',
            //                             color: record.status == 0 ? '' : '#333',
            //                             lineHeight: '27px',
            //                             background: record.status == 0 ? '#f5f5f5' : '#e6f7ff',
            //                             borderRadius: '50%',
            //                             marginRight: '4px',
            //                         }}
            //                         type='file-search'
            //                     />
            //                 </Button>
            //                 <Dropdown overlay={this.menu1.bind(this, record)}>
            //                     <Icon style={{ lineHeight: '27px !important' }} className='editIcon' type='ellipsis' />
            //                 </Dropdown>
            //             </span>
            //         )
            //     },
            // },
        ]
        // 选中的key值，用于修改成功的回调覆盖tableData
        this.editKey = ''
        this.tableSelectedRows = [] // 表格里选择的项
        this.paramOption = {} // 物理表格新的数据
    }

    componentDidMount() {
        this.getTableData({})
        this.getDataSourceData()
        this.getUserData()
    }

    openRecordPage = (data) => {
        this.props.addTab('血缘文件详情', data)
    }
    openSqlflowPage = (data) => {
        this.props.addTab('sqlFlow', data)
    }
    deleteTask = (data) => {
        return deleteFile({ fileId: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    getShortName = (value) => {
        if (value) {
            if (value.length > 10) {
                return value.substr(0, 10) + '…'
            } else {
                return value
            }
        } else {
            return ''
        }
    }

    getDataSourceData() {
        getSourceList().then((res) => {
            if (res.code == '200') {
                this.setState({
                    sourceData: res.data,
                })
            }
        })
    }

    getTableData = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            datasourceIdList: this.state.queryInfo.datasourceIdList ? [this.state.queryInfo.datasourceIdList] : [],
            ownerList: this.state.queryInfo.ownerList ? [this.state.queryInfo.ownerList] : [],
            statusList: this.state.queryInfo.statusList || this.state.queryInfo.statusList == 0 ? [this.state.queryInfo.statusList] : [],
            name: this.state.queryInfo.name,
        }
        this.setState({ loading: true })
        let res = await searchLineageFile(query)
        this.setState({ loading: false })
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
    }

    changeName = (e) => {
        let { queryInfo } = this.state
        queryInfo.name = e.target.value
        this.setState({
            queryInfo,
        })
    }

    changeSelect = async (name, value) => {
        let { queryInfo } = this.state
        queryInfo[name] = value
        await this.setState({
            queryInfo,
        })
        this.searchTableData()
    }
    onLook = (record) => {
        this.props.addTab('采集任务-查看详情', record)
    }

    resetCondition = async () => {
        let { queryInfo } = this.state
        queryInfo.name = ''
        queryInfo.statusList = undefined
        queryInfo.ownerList = undefined
        queryInfo.datasourceIdList = undefined
        await this.setState({
            queryInfo,
        })
        this.searchTableData()
    }

    searchTableData = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    onIndexmaCheckboxChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    download = async (idList) => {
        await fileDownload({ id: idList.join(',') })
        message.info('系统准备下载')
    }
    cancel = () => {
        this.setState({ modalVisible: false })
    }
    openDataLog = async (data) => {
        await this.setState({
            modalVisible: true,
            logId: data.logId,
        })
        this.getExtractLog()
    }
    handlePaginationOnChangeRecord = async (page) => {
        await this.setState({
            current: page,
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
    showTotalRecord = (total, range) => {
        const totalPageNum = Math.ceil(total / 10)
        return `共${totalPageNum}页，${total}条数据`
    }

    render() {
        const {
            tableData,
            tablePagination,
            name,
            strategy,
            datasource,
            creater,
            status,
            sourceData,
            loading,
            selectedRowKeys,
            userList,
            modalVisible,
            queryInfo,
            spinLoading,
            recordData,
            current,
            total,
        } = this.state

        return (
            <React.Fragment>
                <RichTableLayout
                    title='血缘文件'
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear placeholder='请输入文件名' value={queryInfo.name} onSearch={this.searchTableData} onChange={this.changeName} />

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
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp='children'
                                    placeholder='数据源'
                                    value={queryInfo.datasourceIdList}
                                    onChange={this.changeSelect.bind(this, 'datasourceIdList')}
                                    dropdownMatchSelectWidth={false}
                                >
                                    {sourceData.map((item) => {
                                        return (
                                            <Option title={item.identifier} value={item.id} key={item.id}>
                                                {item.identifier}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select showSearch allowClear optionFilterProp='children' placeholder='责任人' value={queryInfo.ownerList} onChange={this.changeSelect.bind(this, 'ownerList')}>
                                    {userList.map((item) => {
                                        return (
                                            <Option value={item.username} key={item.id}>
                                                {item.username}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.resetCondition}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableData({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteTask(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/lineage/files/manage/delete',
                        }
                    }}
                    editColumnProps={{
                        width: '24%',
                        createEditColumnElements: (index, record, defaultElements) => {
                            return [
                                {
                                    label: '可视化',
                                    onClick: this.openSqlflowPage.bind(this, record),
                                    disabled: record.status == 0 || record.status == 2,
                                },
                                {
                                    label: '日志',
                                    onClick: this.openDataLog.bind(this, record),
                                    disabled: record.status == 0,
                                },
                                {
                                    label: '详情',
                                    disabled: record.status == 0,
                                    onClick: this.openRecordPage.bind(this, record),
                                },
                            ]
                                .filter((item) => !item.disabled)
                                .map((item) => {
                                    return (
                                        <a key={item.label} onClick={item.onClick}>
                                            {item.label}
                                        </a>
                                    )
                                })
                                .concat(defaultElements)
                        },
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: '日志详情',
                        visible: modalVisible,
                        onClose: this.cancel,
                        width: 800,
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
                                <div>
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

export default BloodUpdateIndex
