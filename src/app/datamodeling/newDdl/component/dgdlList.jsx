import { Button, Input, Select, Tooltip, Modal, message } from 'antd'
import React, { Component } from 'react'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { configCategory, configType, delRoot, rootList, saveRoot, delDatamodelingTable } from 'app_api/metadataApi'
import { datamodelingTable, datasourceFilter, groupFilter, creatorFilter } from 'app_api/dataModeling'
import '../../index.less'

export default class DgdlList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            loading: false,
            showEmptyIcon: true,
            tableData: [],
            sourceList: [],
            groupList: [],
            userList: [],
        }
        this.columns = [
            {
                title: '表名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                width: 190,
                render: (text, record) =>
                    text ? (
                        <Tooltip
                            title={
                                <span>
                                    {text}
                                    <br />
                                    {record.tableNameEn}
                                </span>
                            }
                        >
                            <div className='tableLabel'>
                                <div>{text}</div>
                                <br />
                                <div>{record.tableNameEn}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '所属数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
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
                title: '表分组',
                dataIndex: 'groupName',
                key: 'groupName',
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
                title: '字段数',
                dataIndex: 'columnNums',
                key: 'columnNums',
                width: 100,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '创建人',
                dataIndex: 'createUser',
                key: 'createUser',
                width: 100,
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
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
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
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <div>
                            {text == 2 ? <StatusLabel type='success' message='已治理' /> : null}
                            {text == 1 ? <StatusLabel type='minus' message='待治理' /> : null}
                        </div>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.getTableList()
        this.getFilter()
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            status: 1,
        }
        let res = await datamodelingTable(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                showEmptyIcon: res.total ? false : this.state.showEmptyIcon,
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
    getFilter = async () => {
        let res = await datasourceFilter({ status: 1 })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
        let res1 = await groupFilter({ status: 1 })
        if (res1.code == 200) {
            this.setState({
                groupList: res1.data,
            })
        }
        let res2 = await creatorFilter({ status: 1 })
        if (res2.code == 200) {
            this.setState({
                userList: res2.data,
            })
        }
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
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
    search = async () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    openDetailPage = (data) => {
        this.props.addTab('dgdl表详情', { ...data })
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '你确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                delDatamodelingTable({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.search()
                    }
                })
            },
        })
    }
    render() {
        const { queryInfo, tableData, sourceList, showEmptyIcon, groupList, userList } = this.state
        return (
            <div>
                {showEmptyIcon ? (
                    <div className='emptyIcon'>
                        <IconFont type='icon-kongzhuangtai' />
                        <div>暂无数据，在DDL详情页选择"治理申请"后生成</div>
                    </div>
                ) : (
                    <RichTableLayout
                        disabledDefaultFooter
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                if (record.status == 2) {
                                    return [
                                        <a onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                            详情
                                        </a>,
                                    ]
                                } else {
                                    return [
                                        <a onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                            详情
                                        </a>,
                                        <a onClick={this.deleteData.bind(this, record)} key='edit'>
                                            删除
                                        </a>,
                                    ]
                                }
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
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表中／英文名' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'datasourceId')} value={queryInfo.datasourceId} placeholder='数据源'>
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'groupCode')} value={queryInfo.groupCode} placeholder='表分组'>
                                        {groupList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'createUser')} value={queryInfo.createUser} placeholder='创建人'>
                                        {userList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'governStatus')} value={queryInfo.governStatus} placeholder='状态'>
                                        <Select.Option key={0} value={1}>
                                            待治理
                                        </Select.Option>
                                        <Select.Option key={1} value={2}>
                                            已治理
                                        </Select.Option>
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
                )}
            </div>
        )
    }
}
