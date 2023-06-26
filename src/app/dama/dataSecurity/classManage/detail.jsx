import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Input, Select, Tooltip, Tag } from 'antd'
import { getExternalList, getTaskDetail } from 'app_api/metadataApi'
import ProjectUtil from '@/utils/ProjectUtil'
import { getTableInfoWithDs, getDsColumnLevelList, getDsColumnLevelListFilters } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import './index.less'


export default class ClassManageDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {},
            taskDetail: {},
            desensitizeTagFilters: [],
            levelFilters: [],
            levelOriginFilters: []
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'physicalField',
                key: 'physicalField',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段中文名',
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'level',
                key: 'level',
                title: '安全等级',
                width: 100,
                render: (text, record) => (
                    text ?
                        (<Tag color={text == 1 ? 'blue' : (text == 2 ? 'geekblue' : (text == 3 ? 'purple' : (text == 4 ? 'orange' : 'red')))}>
                            {record.levelName}
                        </Tag>)
                        : (<EmptyLabel />)
                ),
            },
            {
                title: '敏感标签',
                dataIndex: 'tagName',
                key: 'tagName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '敏感等级',
                dataIndex: 'sensitivityLevelName',
                key: 'sensitivityLevelName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '敏感规则',
                dataIndex: 'ruleName',
                key: 'ruleName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = async () => {
        this.getTaskDetailData()
        this.getFilters()
        if (this.pageParams.tabValue == 2) {
            let { queryInfo } = this.state
            queryInfo.keyword = this.pageParams.ename
            await this.setState({
                queryInfo
            })
            this.search()
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getFilters = async () => {
        let res = await getDsColumnLevelListFilters({tableId: this.pageParams.id})
        if (res.code == 200) {
            this.setState({
                desensitizeTagFilters: res.data.desensitizeTagFilters ? res.data.desensitizeTagFilters : [],
                levelFilters: res.data.levelFilters ? res.data.levelFilters : [],
                levelOriginFilters: res.data.levelOriginFilters
            })
        }
    }
    getTaskDetailData = async () => {
        let res = await getTableInfoWithDs({tableId: this.pageParams.id})
        if (res.code == 200) {
            this.setState({
                taskDetail: res.data
            })
        }
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
        })
        if (!e.target.value) {
            this.search()
        }
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {}
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: this.pageParams.id,
            ...queryInfo
        }
        let res = await getDsColumnLevelList(query)
        if (res.code == 200) {
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
    openEditPage = () => {
        this.props.addTab('安全配置', {id: this.pageParams.id})
    }
    renderTitle = (data) => {
        return (
            <div>{data.physicalTable + (data.tableName ? '（' + data.tableName + '）' : '')}
                {
                    data.hasDesensitizeRules ?
                        <Tooltip title='含敏感标签'>
                            <span className='sensitiveLabel'>敏</span>
                        </Tooltip>
                        : null
                }
            </div>
        )
    }
    render() {
        const {
            queryInfo,
            taskDetail,
            desensitizeTagFilters,
            levelFilters,
            levelOriginFilters,
        } = this.state
        let { physicalDatabase, firstClassPath, datasourceIdentifier, levelName, level } = taskDetail
        return (
            <React.Fragment>
                <div className='classManageDetail'>
                    <TableLayout
                        title={this.renderTitle(taskDetail)}
                        disabledDefaultFooter
                        renderHeaderExtra={() => {
                            if (this.pageParams.confirm || this.pageParams.tabValue == '2') {
                                return (
                                    <Button type='primary' onClick={this.openEditPage}>
                                        编辑
                                    </Button>
                                )
                            } else {
                                return ''
                            }
                        }}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '所属库',
                                                    content: physicalDatabase,
                                                },
                                                {
                                                    label: '所属系统',
                                                    content: datasourceIdentifier,
                                                },
                                                {
                                                    label: '分类',
                                                    content: firstClassPath,
                                                },
                                                {
                                                    label: '表安全等级',
                                                    content: levelName ? <Tag color={level == 1 ? 'blue' : (level == 2 ? 'geekblue' : (level == 3 ? 'purple' : (level == 4 ? 'orange' : 'red')))}>
                                                        {levelName}
                                                    </Tag> : '',
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return (
                                <ModuleTitle
                                    style={{ marginBottom: 15 }}
                                    title='字段安全等级'
                                />
                            )
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'columnId',
                        }}
                        editColumnProps={{
                            hidden: true,
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
                                        placeholder='请输入字段名'
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'level'
                                        )}
                                        value={queryInfo.level}
                                        placeholder='安全等级'
                                        style={{ width: 160 }}
                                    >
                                        {
                                            levelFilters.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'desensitizeTagId'
                                        )}
                                        value={queryInfo.desensitizeTagId}
                                        placeholder='敏感标签'
                                        style={{ width: 160 }}
                                    >
                                        {
                                            desensitizeTagFilters.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
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
                                }
                            })
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}