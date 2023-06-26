import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Input, message, Select, Switch, Tag } from 'antd'
import { changeTagStatus, desensitiseTag, sensitiveLevel, tagSecurityLevel } from 'app_api/dataSecurity'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import AddTagDrawer from './addTagDrawer'
import TagDetailDrawer from './tagDetailDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'

export default class SensitiveTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnLoading: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            modalVisible: false,
            tagTypeList: [],
            sensitivityLevelList: [],
            levelList: [],
            type: 'edit',
        }
        this.columns = [
            {
                title: '标签名称',
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
                title: '标签类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
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
                title: '安全等级',
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                width: 90,
                render: (text, record) =>
                    text ? <Tag color={text == 1 ? 'blue' : text == 2 ? 'geekblue' : text == 3 ? 'purple' : text == 4 ? 'orange' : 'red'}>{record.securityLevelName}</Tag> : <EmptyLabel />,
            },
            {
                title: '敏感级别',
                dataIndex: 'sensitivityLevelName',
                key: 'sensitivityLevelName',
                width: 90,
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
                title: '默认脱敏规则',
                dataIndex: 'defaultRuleName',
                key: 'defaultRuleName',
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
                title: '映射字段',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: 90,
                render: (text, record) => <a onClick={this.openColumnPage.bind(this, record)}>{text}</a>,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => {
                    return (
                        <Switch
                            onChange={this.changeStatusSwitch.bind(this, record, index)}
                            checkedChildren='开启'
                            unCheckedChildren='禁用'
                            disabled={!PermissionManage.hasFuncPermission('/dt_security/sensitive_tag/switch')}
                            checked={text == 1}
                        />
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTagSecurityLevel()
        this.getSensitiveLevel()
    }
    getTagSecurityLevel = async () => {
        let res = await tagSecurityLevel()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    getSensitiveLevel = async () => {
        let res = await sensitiveLevel()
        if (res.code == 200) {
            this.setState({
                sensitivityLevelList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
        }
        let res = await desensitiseTag(query)
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
    changeStatusSwitch = async (data, index) => {
        let { tableData } = this.state
        let query = {
            id: data.id,
            status: data.status == 1 ? 0 : 1,
        }
        let res = await changeTagStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].status = query.status
            this.setState({
                tableData,
            })
        }
    }
    openColumnPage = (data) => {
        this.props.addTab('映射字段', { id: data.id })
    }
    openEditModal = (data, type) => {
        if (type == 'look') {
            this.tagDetailDrawer && this.tagDetailDrawer.openModal(data)
        } else {
            this.addTagDrawer && this.addTagDrawer.openModal(data, type)
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
    reloadTable = () => {
        this.search()
        this.getTagSecurityLevel()
        this.getSensitiveLevel()
    }
    render() {
        const { tableData, queryInfo, levelList, sensitivityLevelList } = this.state
        return (
            <React.Fragment>
                <div className='dataMasking'>
                    <RichTableLayout
                        title='敏感标签'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/dt_security/sensitive_tag/add'>
                                    <Button type='primary' onClick={this.openEditModal.bind(this, {}, 'add')}>
                                        新增敏感标签
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '编辑',
                                        onClick: this.openEditModal.bind(this, record, 'edit'),
                                        funcCode: '/dt_security/sensitive_tag/edit',
                                    },
                                    {
                                        label: '详情',
                                        onClick: this.openEditModal.bind(this, record, 'look'),
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
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入敏感标签名' />
                                    <Select onChange={this.changeStatus.bind(this, 'securityLevel')} value={queryInfo.securityLevel} placeholder='安全等级' style={{ width: '160px' }}>
                                        {levelList.map((item) => {
                                            return (
                                                <Option name={item.name} value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select onChange={this.changeStatus.bind(this, 'sensitivityLevel')} value={queryInfo.sensitivityLevel} placeholder='敏感级别' style={{ width: '160px' }}>
                                        {sensitivityLevelList.map((item) => {
                                            return (
                                                <Option name={item.name} value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
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
                </div>
                <TagDetailDrawer ref={(dom) => (this.tagDetailDrawer = dom)} />
                <AddTagDrawer reloadTable={this.reloadTable} ref={(dom) => (this.addTagDrawer = dom)} />
            </React.Fragment>
        )
    }
}
