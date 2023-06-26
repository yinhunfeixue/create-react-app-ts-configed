import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Switch, Modal } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
import { filterRule, saveFilterRule, delFilterRule } from 'app_api/autoManage'
const { Option } = Select
import AddFilterRule from './addFilterRule'
import RuleDetailDrawer from './component/ruleDetailDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'

export default class ManageFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            loadingStatus: false,
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '规则描述',
                dataIndex: 'description',
                key: 'description',
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
                title: '最新修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 180,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '修改人',
                dataIndex: 'updateUser',
                key: 'updateUser',
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
                dataIndex: 'enable',
                key: 'enable',
                width: 100,
                render: (text, record, index) => {
                    const { loadingStatus } = this.state
                    return (
                        <Switch
                            loading={loadingStatus}
                            onChange={this.changeStatus.bind(this, index)}
                            disabled={!PermissionManage.hasFuncPermission('/setting/gov_filter/rules/switch')}
                            checkedChildren='启用'
                            unCheckedChildren='禁用'
                            checked={text}
                        />
                    )
                },
            },
        ]
    }
    componentWillMount = () => {}
    changeStatus = async (index) => {
        let { tableData } = this.state
        let query = {
            ...tableData[index],
            enable: !tableData[index].enable,
        }
        this.setState({ loadingStatus: true })
        let res = await saveFilterRule(query)
        this.setState({ loadingStatus: false })
        if (res.code == 200) {
            tableData[index].enable = !tableData[index].enable
            this.setState({
                tableData,
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
        let res = await filterRule(query)
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
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openDetailPage = (data) => {
        this.ruleDetailDrawer && this.ruleDetailDrawer.openModal(data)
    }
    openAddPage = (data, type) => {
        this.addFilterRule && this.addFilterRule.openModal(data, type)
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '确定删除该规则吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                delFilterRule({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.search()
                    }
                })
            },
        })
    }
    render() {
        const { queryInfo, tableData } = this.state
        return (
            <React.Fragment>
                <div className='manageFilter'>
                    <RichTableLayout
                        title='过滤规则列表'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/setting/gov_filter/rules/add'>
                                    <Button type='primary' onClick={this.openAddPage.bind(this, {}, 'add')}>
                                        新增规则
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        editColumnProps={{
                            width: 180,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '编辑',
                                        onClick: this.openAddPage.bind(this, record, 'edit'),
                                        funcCode: '/setting/gov_filter/rules/edit',
                                    },
                                    {
                                        label: '详情',
                                        onClick: this.openDetailPage.bind(this, record),
                                    },
                                    {
                                        label: '删除',
                                        onClick: this.deleteData.bind(this, record),
                                        funcCode: '/setting/gov_filter/rules/delete',
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
                                    <Input.Search allowClear style={{ width: 380 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入规则名称' />
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
                <AddFilterRule search={this.search} ref={(dom) => (this.addFilterRule = dom)} />
                <RuleDetailDrawer ref={(dom) => (this.ruleDetailDrawer = dom)} />
            </React.Fragment>
        )
    }
}
