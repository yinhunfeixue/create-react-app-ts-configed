import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Input, message, Tooltip } from 'antd'
import { checkRuleTree, getQualityTaskJobById, getTechRuleById, techRuleList } from 'app_api/examinationApi'
import moment from 'moment'
import React, { Component } from 'react'
import RuleDetailDrawer from '../component/ruleDetailDrawer'
import '../index.less'

const weekMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}

export default class TaskDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskInfo: {
                businessData: {
                    managerIdName: {},
                    primaryKeys: [],
                },
            },
            queryInfo: {
                keyword: '',
                ruleTypeId: [],
            },
            tableData: [],
            logModalVisible: false,
            typeList: [],
            circleInfo: '',
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleName) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleName}>
                                    {record.bizRuleDTO.ruleName}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    {text}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    }
                },
            },
            {
                title: '规则描述',
                dataIndex: 'ruleDesc',
                key: 'ruleDesc',
                ellipsis: true,
                minWidth: 150,
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleDesc) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleDesc}>
                                    {record.bizRuleDTO.ruleDesc}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    {text}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    }
                },
            },
            {
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 140,
                ellipsis: true,
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleTypeName) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleTypeName}>
                                    {record.bizRuleDTO.ruleTypeName}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    {text}
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    }
                },
            },
            {
                title: '问题级别',
                dataIndex: 'severityLevelDesc',
                key: 'severityLevelDesc',
                width: 100,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '阈值',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 100,
                ellipsis: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = async () => {
        this.getDetail()
        this.getRuleTree()

        ProjectUtil.setDocumentTitle(this.pageParam.name)
    }
    getDetail = async () => {
        let { circleInfo } = this.state
        let query = {}
        if (this.pageParam.useBusinessId == true) {
            query = {
                businessId: this.pageParam.id,
            }
        } else {
            query = {
                id: this.pageParam.id,
            }
        }
        let res = await getQualityTaskJobById(query)
        if (res.code == 200) {
            circleInfo = this.timeCircle(res.data)
            this.setState({
                taskInfo: res.data,
                circleInfo,
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            ruleTypeId: [],
        }
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
            tableId: this.pageParam.qaTableId,
            ruleTypeIds: queryInfo.ruleTypeId.length ? [queryInfo.ruleTypeId[queryInfo.ruleTypeId.length - 1]] : [],
            validBizRuleFlag: true,
            status: 1,
            ...queryInfo,
        }
        let res = await techRuleList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.bizRuleDTO = item.bizRuleDTO == undefined ? {} : item.bizRuleDTO
            })
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
    changeType = async (value, selectedOptions) => {
        let { queryInfo } = this.state
        queryInfo.ruleTypeId = value ? value : []
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getRuleDetail = async (data) => {
        let res = await getTechRuleById({ id: data.id })
        if (res.code == 200) {
            this.ruleDetailDrawer && this.ruleDetailDrawer.openModal(res.data)
        }
    }
    timeCircle = (record) => {
        let time = record.time !== undefined && record.time ? record.time : ''
        let startTime = record.startTime !== undefined ? moment(record.startTime).format('YYYY-MM-DD') : ''
        let endTime = record.endTime !== undefined ? moment(record.endTime).format('YYYY-MM-DD') : ''
        let circleInfo = ''
        if (record.frequency == 4) {
            circleInfo = `每天 ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 5) {
            let weekString = ''
            _.map(record.days.split('|'), (item, key) => {
                weekString += `${weekMap[item]}${key + 1 == record.days.split('|').length ? '' : '、'}`
            })
            circleInfo = `每周${weekString} ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        } else if (record.frequency == 6) {
            let monthString = ''
            _.map(record.days.split('|'), (item, key) => {
                monthString += `${item}${key + 1 == record.days.split('|').length ? '' : '、'}`
            })
            circleInfo = `每月${monthString}号 ${time}；${startTime}${startTime && endTime ? '~' : ''}${endTime}`
        }
        return circleInfo
    }
    openAddPage = () => {
        let data = this.pageParam
        data.pageType = 'edit'
        this.props.addTab('编辑检核任务', { ...data })
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { taskInfo, queryInfo, typeList, circleInfo } = this.state
        let { businessName, name } = this.pageParam
        let partitionInfo = {}
        let primaryKeys = ''
        if (taskInfo.businessData) {
            partitionInfo = taskInfo.businessData.partitionInfo ? JSON.parse(taskInfo.businessData.partitionInfo) : {}
            taskInfo.businessData.primaryKeys.map((item, index) => {
                primaryKeys += item.name + (index + 1 !== taskInfo.businessData.primaryKeys.length ? '、' : '')
            })
        } else {
            taskInfo.businessData = {
                managerIdName: {},
                primaryKeys: [],
            }
        }
        return (
            <React.Fragment>
                <div className='techRule'>
                    <TableLayout
                        title={businessName + (name ? '（' + name + '）' : '')}
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.openAddPage}>
                                    编辑任务
                                </Button>
                            )
                        }}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '表名称',
                                                    content: taskInfo.name,
                                                },
                                                {
                                                    label: '适用业务',
                                                    content: taskInfo.businessData.bizType,
                                                },
                                                {
                                                    label: '创建人',
                                                    content: taskInfo.createUser,
                                                },
                                                {
                                                    label: '创建时间',
                                                    content: moment(taskInfo.createTime).format('YYYY-MM-DD HH:mm:ss'),
                                                },
                                                {
                                                    label: '修改人',
                                                    content: taskInfo.updateUser,
                                                },
                                                {
                                                    label: '最后修改时间',
                                                    content: moment(taskInfo.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <Module title='配置信息' style={{ marginTop: 16 }}>
                        <div className='MiniForm Grid4'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '分区字段',
                                    content: partitionInfo.partitionColumnName,
                                },
                                {
                                    label: '分区格式',
                                    content: partitionInfo.partitionDateFormat,
                                },
                                {
                                    label: '主键',
                                    content: primaryKeys,
                                },
                                {
                                    label: '负责人',
                                    content: taskInfo.businessData.managerIdName.name,
                                },
                                {
                                    label: '检核周期',
                                    content: circleInfo,
                                },
                                {
                                    label: '检核范围',
                                    content: taskInfo.businessData.checkRangeView,
                                },
                            ])}
                        </div>
                    </Module>
                    <RichTableLayout
                        renderDetail={() => {
                            return <ModuleTitle style={{ marginBottom: 15 }} title='检核字段' />
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.getRuleDetail.bind(this, record)} key='detail'>
                                        详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入字段／规则名称' />
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
                <RuleDetailDrawer
                    ref={(dom) => {
                        this.ruleDetailDrawer = dom
                    }}
                />
            </React.Fragment>
        )
    }
}
