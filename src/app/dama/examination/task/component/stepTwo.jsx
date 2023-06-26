import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import { Button, message, Popconfirm, Switch, Tooltip, Form } from 'antd'
import { createTechRule, deleteRuleList, getTechRuleById, ruleToggleStatus, techRuleList, updateTechRule } from 'app_api/examinationApi'
import React, { Component } from 'react'
import RuleDetailDrawer from '../../component/ruleDetailDrawer'
import '../../index.less'
import AddRuleDrawer from './addRuleDrawer'

const FormItem = Form.Item

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
class StepTwo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: this.props.addTaskInfo,
            columnData: [],
            total: 0,
            addRuleVisible: false,
            ruleModalType: 'add',
            btnLoading: false,

            techRuleInfo: {},
            ruleCondition: {},
            ruleInfo: {},
            columnInfo: {},
            ruleParam: {},
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
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
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleName) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleName}>
                                    <span className='LineClamp'>{record.bizRuleDTO.ruleName}</span>
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='LineClamp'>{text}</span>
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
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleDesc) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleDesc}>
                                    <span className='LineClamp'>{record.bizRuleDTO.ruleDesc}</span>
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='LineClamp'>{text}</span>
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    }
                },
            },
            {
                title: '规则类别',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                render: (text, record) => {
                    if (record.sqlSource) {
                        if (record.bizRuleDTO.ruleTypeName) {
                            return (
                                <Tooltip placement='topLeft' title={record.bizRuleDTO.ruleTypeName}>
                                    <span className='LineClamp'>{record.bizRuleDTO.ruleTypeName}</span>
                                </Tooltip>
                            )
                        } else {
                            return <EmptyLabel />
                        }
                    } else {
                        if (text) {
                            return (
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='LineClamp'>{text}</span>
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
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
            {
                title: '检核状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => (
                    <div>
                        <Switch onChange={this.changeStatusSwitch.bind(this, record, index)} checkedChildren='启用' unCheckedChildren='禁用' checked={record.status == 1} />
                    </div>
                ),
            },
        ]
    }
    componentWillMount = () => {}
    addData = async () => {
        await this.setState({
            ruleModalType: 'add',
            addRuleVisible: true,
        })
        this.addRuleDrawer && this.addRuleDrawer.getRuleData('add')
    }

    editData = async (data) => {
        await this.setState({
            ruleModalType: 'edit',
            addRuleVisible: true,
        })
        this.addRuleDrawer && this.addRuleDrawer.getRuleData('edit', data)
    }
    deleteData = async (data) => {
        let res = await deleteRuleList([data.id])
        if (res.code == 200) {
            message.success('操作成功')
            this.search()
        }
    }
    getDetail = async (data) => {
        let res = await getTechRuleById({ id: data.id })
        if (res.code == 200) {
            this.ruleDetailDrawer && this.ruleDetailDrawer.openModal(res.data)
        }
    }
    changeStatusSwitch = async (data, index) => {
        let { columnData } = this.state
        let query = {
            id: data.id,
            status: data.status == 1 ? 2 : 1,
        }
        let res = await ruleToggleStatus(query)
        if (res.code == 200) {
            columnData[index].status = query.status
            this.setState({
                columnData,
            })
        }
    }
    cancel = () => {
        this.setState({
            addRuleVisible: false,
        })
    }
    getTableList = async (params = {}) => {
        let { addTaskInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            tableId: addTaskInfo.businessData.tableIdName.id,
            validBizRuleFlag: true,
        }
        let res = await techRuleList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.bizRuleDTO = item.bizRuleDTO == undefined ? {} : item.bizRuleDTO
            })
            this.setState({
                columnData: res.data,
                total: res.total,
            })
            this.props.getNewColumnData(res.total)
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
    getPostData = (data) => {
        this.setState({
            techRuleInfo: data.techRuleInfo,
            ruleInfo: data.ruleInfo,
            ruleParam: data.ruleParam,
            ruleCondition: data.ruleCondition,
            columnInfo: data.columnInfo,
        })
    }
    checkBeforePost = () => {
        let { ruleParam, techRuleInfo, ruleInfo, ruleCondition, columnInfo } = this.state
        console.log(columnInfo, 'columnInfo++++')
        console.log(ruleParam, techRuleInfo, 'ruleParam')
        if (techRuleInfo.sqlSource) {
            if (!ruleInfo.id) {
                message.info('请选择业务规则')
                return false
            }
            if (ruleInfo.ruleTypeId == 'JHFL44' && !ruleCondition.expression) {
                message.info('请填写逻辑表达式')
                return false
            }
            if (ruleParam.minValueMsg) {
                return false
            }
            if (ruleParam.hasParam == 1 && ruleParam.content == 1 && !ruleParam.containContents.length) {
                message.info('请选择内容规范')
                return false
            }
            if (ruleParam.hasParam == 1 && ruleParam.content == 1 && ruleParam.isContain == 1 && ruleParam.hasSp && !ruleParam.specialChars.length) {
                message.info('特殊字符不能为空')
                return false
            }
        } else {
            if (!columnInfo.ruleTypeId) {
                message.info('请选择规则类别')
                return false
            }
        }
        return true
    }
    postData = async () => {
        ;(await this.addRuleDrawer) && this.addRuleDrawer.postData()
        setTimeout(() => {
            let { ruleModalType, techRuleInfo, ruleInfo, ruleParam, ruleCondition, columnInfo } = this.state
            if (!this.checkBeforePost()) {
                return
            }
            techRuleInfo.columnEntityList = [columnInfo]
            // this.form.validateFields().then((err, values) => {
            //     if (!err) {
            let queryParam = this.queryFormat(ruleParam)
            let query = {
                ...techRuleInfo,
                bizRuleId: ruleInfo.id,
                ruleParam: JSON.stringify(queryParam),
                ruleCondition: JSON.stringify(ruleCondition),
            }
            this.setState({ btnLoading: true })
            if (ruleModalType == 'add') {
                createTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.search()
                    }
                })
            } else {
                updateTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.search()
                    }
                })
            }
            //     }
            // })
        }, 500)
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    queryFormat = (ruleParam) => {
        let { ruleInfo } = this.state
        switch (ruleInfo.ruleTypeId) {
            case 'JHFL43':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL38':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL42':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL44':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL45':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                    datasource: ruleParam.datasource,
                    database: ruleParam.database,
                    table: ruleParam.table,
                    column: ruleParam.column,
                }
                break
            case 'JHFL40':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL41':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL39':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                    datasource: ruleParam.datasource,
                    database: ruleParam.database,
                    code: ruleParam.code,
                    values: ruleParam.values,
                }
                break
            default:
                break
        }
        return ruleParam
    }
    render() {
        const { columnData, total, addRuleVisible, ruleModalType, btnLoading, addTaskInfo } = this.state
        return (
            <div className='stepTwo'>
                <ModuleTitle
                    title={'检核规则（' + total + '）'}
                    renderHeaderExtra={() => {
                        return (
                            <Button type='primary' onClick={this.addData}>
                                添加规则
                            </Button>
                        )
                    }}
                />
                <RichTableLayout
                    disabledDefaultFooter
                    editColumnProps={{
                        width: 150,
                        createEditColumnElements: (_, record) => {
                            return [
                                <a onClick={this.editData.bind(this, record)} key='edit'>
                                    编辑
                                </a>,
                                <a onClick={this.getDetail.bind(this, record)} key='detail'>
                                    详情
                                </a>,
                                <Popconfirm placement='topLeft' title='确定要删除检核规则吗？' onConfirm={this.deleteData.bind(this, record)} okText='确定' cancelText='取消'>
                                    <a key='delete'>删除</a>
                                </Popconfirm>,
                            ]
                        },
                    }}
                    tableProps={{
                        columns: this.columns,
                        dataSource: columnData,
                        key: 'id',
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
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
                <DrawerLayout
                    drawerProps={{
                        title: ruleModalType == 'edit' ? '编辑规则' : '添加规则',
                        className: 'addRuleDrawer',
                        width: 568,
                        visible: addRuleVisible,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button onClick={this.postData} key='submit' type='primary' loading={btnLoading}>
                                    确定
                                </Button>
                                <Button key='back' onClick={this.cancel}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {addRuleVisible && <AddRuleDrawer addTaskInfo={addTaskInfo} getPostData={this.getPostData} ref={(dom) => (this.addRuleDrawer = dom)} />}
                </DrawerLayout>
                <RuleDetailDrawer
                    ref={(dom) => {
                        this.ruleDetailDrawer = dom
                    }}
                />
            </div>
        )
    }
}
export default StepTwo
