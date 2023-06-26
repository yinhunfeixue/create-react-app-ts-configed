import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Cascader, Input, message, Modal, Select, Switch } from 'antd'
import { baseconfig, bizRuleDelete, bizRuleSearch, bizRuleToggleStatus, checkRuleTree } from 'app_api/examinationApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'

const { Option } = Select

export default class BusinessRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
                ruleTypeId: [],
                useForBiz: undefined,
                status: undefined,
            },
            sorted: true,
            typeList: [],
            bizList: [],
            tableData: [],
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 200,
                render: (text) =>
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
                dataIndex: 'ruleDesc',
                key: 'ruleDesc',
                width: 200,
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
                title: '适用业务',
                dataIndex: 'useForBizDesc',
                key: 'useForBizDesc',
                width: 120,
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
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 160,
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
                title: '技术规则',
                dataIndex: 'techRuleCount',
                key: 'techRuleCount',
                width: 120,
                sorter: true,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.openTechRulePage.bind(this, record)}>{text}</a>
                    </Tooltip>
                ),
            },
            {
                title: '状态',
                dataIndex: 'statusDesc',
                key: 'statusDesc',
                width: 120,
                render: (text, record, index) => (
                    <div>
                        <Switch onChange={this.changeStatusSwitch.bind(this, record, index)} checkedChildren='启用' unCheckedChildren='禁用' checked={record.status == 1} />
                    </div>
                ),
            },
        ]
    }
    componentWillMount = () => {
        this.getRuleTree()
        this.baseconfigList()
    }
    changeStatusSwitch = async (data, index) => {
        let { tableData } = this.state
        let query = {
            id: data.id,
            status: data.status == 1 ? 2 : 1,
        }
        let res = await bizRuleToggleStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].status = query.status
            tableData[index].statusDesc = query.status == 1 ? '启用' : '禁用'
            this.setState({
                tableData,
            })
        }
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            this.setState({
                typeList: this.deleteSubList(res.data.children),
            })
        }
    }
    baseconfigList = async () => {
        let res = await baseconfig({ group: 'useForBiz' })
        if (res.code == 200) {
            this.setState({
                bizList: res.data,
            })
        }
    }
    openTechRulePage = (data) => {
        this.props.addTab('实现技术规则', { ...data })
    }
    openEditModal = async (data) => {
        data.pageType = 'edit'
        this.props.addTab('编辑业务规则', { ...data })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'sorter')
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: queryInfo.keyword,
            ruleTypeIdList: queryInfo.ruleTypeId.length ? [queryInfo.ruleTypeId[queryInfo.ruleTypeId.length - 1]] : [],
            statusList: queryInfo.status ? [queryInfo.status] : [],
            useForBizList: queryInfo.useForBiz ? [queryInfo.useForBiz] : [],
            techRuleCountOrder: params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined,
        }
        let res = await bizRuleSearch(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                sorted: params.sorter.order,
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
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            ruleTypeId: [],
        }
        await this.setState({
            queryInfo,
            sorted: true,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '确定删除此条规则吗？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                let res = await bizRuleDelete({ id: data.id })
                if (res.code == 200) {
                    message.success('操作成功')
                    that.search()
                }
            },
        })
    }
    openAddPage = () => {
        this.props.addTab('新增业务规则')
    }
    changeType = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.ruleTypeId = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    render() {
        const { queryInfo, typeList, bizList, tableData } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    title='业务规则'
                    renderHeaderExtra={() => {
                        return (
                            <Button type='primary' onClick={this.openAddPage}>
                                定义业务规则
                            </Button>
                        )
                    }}
                    editColumnProps={{
                        width: 120,
                        createEditColumnElements: (_, record) => {
                            return [
                                <a onClick={this.openEditModal.bind(this, record)} key='edit'>
                                    编辑
                                </a>,
                                <a onClick={this.deleteData.bind(this, record)} key='delete'>
                                    删除
                                </a>,
                            ]
                        },
                    }}
                    tableProps={{
                        columns: this.columns,
                        key: 'tableNameEn',
                        dataSource: tableData,
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入规则名称' />
                                <Select allowClear onChange={this.changeStatus.bind(this, 'useForBiz')} value={queryInfo.useForBiz} placeholder='适用业务' style={{ width: 160 }}>
                                    {bizList.map((item) => {
                                        return (
                                            <Option value={item.code} key={item.code}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Cascader
                                    allowClear
                                    expandTrigger='hover'
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    value={queryInfo.ruleTypeId}
                                    options={typeList}
                                    style={{ width: 160 }}
                                    onChange={this.changeType}
                                    displayRender={(label) => label[label.length - 1]}
                                    popupClassName='searchCascader'
                                    placeholder='规则类型'
                                />
                                <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='状态' style={{ width: 160 }}>
                                    <Option value={1} key={1}>
                                        启用
                                    </Option>
                                    <Option value={2} key={2}>
                                        禁用
                                    </Option>
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
                            sorter: sorter || {},
                        })
                    }}
                />
            </React.Fragment>
        )
    }
}
