import { Button, Input, Select, Tooltip, message, Tabs, Modal } from 'antd'
import React, { Component } from 'react'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { configCategory, configType, delRoot, rootList, saveRoot, delDatamodelingTable } from 'app_api/metadataApi'
import { datamodelingTable, datasourceFilter, groupFilter, creatorFilter } from 'app_api/dataModeling'
import '../index.less'
import DgdlList from './component/dgdlList'
import ProjectUtil from '@/utils/ProjectUtil'
import PermissionWrap from '@/component/PermissionWrap'

const { TabPane } = Tabs
export default class DdlList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            loading: false,
            tabValue: '1',
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
        ]
    }
    componentDidMount = () => {
        if (this.pageParam.tabValue) {
            this.setState({
                tabValue: this.pageParam.tabValue,
            })
        }
        this.getFilter()
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            status: 0,
        }
        let res = await datamodelingTable(query)
        if (res.code == 200) {
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
    getFilter = async () => {
        let res = await datasourceFilter({ status: 0 })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
        let res1 = await groupFilter({ status: 0 })
        if (res1.code == 200) {
            this.setState({
                groupList: res1.data,
            })
        }
        let res2 = await creatorFilter({ status: 0 })
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
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    openAddPage = () => {
        this.props.addTab('DDL新增表')
    }
    openDetailPage = (data, type) => {
        if (type == 'look') {
            data.showEditBtn = true
            this.props.addTab('dgdl表详情', { ...data })
        } else {
            data.title = '编辑表'
            data.pageType = 'edit'
            this.props.addTab('DDL编辑表', { ...data })
        }
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
        const { queryInfo, tabValue, tableData, sourceList, groupList, userList } = this.state
        return (
            <div className='ddlList'>
                <TableLayout
                    title='治理表生成'
                    renderHeaderExtra={() => {
                        return this.isEdit ? null : (
                            <PermissionWrap funcCode='/norm/ddl/manage/add'>
                                <Button type='primary' onClick={this.openAddPage}>
                                    新增表
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Tabs activeKey={tabValue} animated={false} tabPosition='top' onChange={this.changeTab}>
                                    <TabPane tab='DDL生成' key='1'>
                                        <RichTableLayout
                                            disabledDefaultFooter
                                            editColumnProps={{
                                                width: 170,
                                                createEditColumnElements: (_, record) => {
                                                    return RichTableLayout.renderEditElements([
                                                        {
                                                            label: '详情',
                                                            onClick: this.openDetailPage.bind(this, record, 'look'),
                                                        },
                                                        {
                                                            label: '编辑',
                                                            onClick: this.openDetailPage.bind(this, record, 'edit'),
                                                            funcCode: '/norm/ddl/manage/edit',
                                                        },
                                                        {
                                                            label: '删除',
                                                            onClick: this.deleteData.bind(this, record),
                                                            funcCode: '/norm/ddl/manage/delete',
                                                        },
                                                    ])
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
                                                        <Input.Search
                                                            allowClear
                                                            style={{ width: 280 }}
                                                            value={queryInfo.keyword}
                                                            onChange={this.changeKeyword}
                                                            onSearch={this.search}
                                                            placeholder='请输入表中／英文名'
                                                        />
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
                                                                    <Select.Option title={item.id} key={item.id} value={item.id}>
                                                                        {item.id}
                                                                    </Select.Option>
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
                                    </TabPane>
                                    <TabPane tab='DGDL生成' key='2'>
                                        {tabValue == 2 ? <DgdlList {...this.props} /> : null}
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        )
                    }}
                />
            </div>
        )
    }
}
