import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, message, Steps } from 'antd'
import { saveTask, schemaDiffTree, taskDetailForEdit } from 'app_api/autoManage'
import Cache from 'app_utils/cache'
import moment from 'moment'
import React, { Component } from 'react'
import StepOne from './component/stepOne'
import StepThree from './component/stepThree'
import StepTwo from './component/stepTwo'
import './index.less'

const { Step } = Steps

export default class AddCompareTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 0,
            checkRuleListTotal: 0,
            loading: false,
            treeData: [],
            addTaskInfo: {
                dataSourceLeft: {
                    name: '数据源1',
                    type: 'MYSQL',
                    columnSet: '',
                },
                dataSourceRight: {
                    name: '数据源2',
                    type: 'HIVE',
                },
                systemSet: '',
                dataTypeSet: '',
                addType: '1',
                weekChecboxValue: [],
                monthChecboxValue: [],
                days: '',
                frequency: 4,
                alterPublishUserIds: [],
                pushTypes: [],
                alterPublish: false,
            },
        }
    }
    componentDidMount = async () => {
        await this.getTreeData()
        if (this.pageParams.pageType == 'edit') {
            this.getDetail()
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTreeData = async () => {
        let { addTaskInfo } = this.state
        let res = await schemaDiffTree()
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
            })
            this.stepOne && this.stepOne.getData(res.data, addTaskInfo)
        }
    }
    getDetail = async () => {
        let { treeData } = this.state
        let query = {
            id: this.pageParams.id,
        }
        let res = await taskDetailForEdit(query)
        if (res.code == 200) {
            res.data.time = moment(res.data.time, 'HH:mm:ss')
            res.data.weekChecboxValue = []
            res.data.monthChecboxValue = []
            if (res.data.frequency == 5) {
                res.data.weekChecboxValue = res.data.days.split('|')
            } else if (res.data.frequency == 6) {
                res.data.monthChecboxValue = res.data.days.split('|')
            }
            res.data.alterPublishUserIds = res.data.alterPublishUserIds ? res.data.alterPublishUserIds : []
            res.data.sourceDsId = res.data.sourceDsId.toString()
            res.data.targetDsId = res.data.targetDsId.toString()
            await this.setState({
                addTaskInfo: res.data,
            })
            this.stepOne && this.stepOne.getData(treeData, res.data)
        }
    }
    nextStep = async () => {
        let { currentStep } = this.state
        if (currentStep == 0) {
            ;(await this.stepOne) && this.stepOne.nextStep()
            let { addTaskInfo } = this.state
            if (!addTaskInfo.name) {
                message.info('请输入任务名称')
                return
            }
            if (!addTaskInfo.sourceDsId || !addTaskInfo.targetDsId) {
                message.info('请选择树节点')
                return
            }
            if (addTaskInfo.sourceDsName == addTaskInfo.targetDsName) {
                message.info('参照系统与对比系统不可相同')
                return
            }
        } else if (currentStep == 1) {
            ;(await this.stepTwo) && this.stepTwo.nextStep()
            let { addTaskInfo } = this.state
            if (addTaskInfo.sourceDsProduct !== addTaskInfo.targetDsProduct) {
                if (!addTaskInfo.lineageMapConfId || !addTaskInfo.columnTypeMapConfId) {
                    message.info('请配置映射关系')
                    return
                }
            }
        }
        await this.setState({
            currentStep: currentStep + 1,
        })
    }
    preStep = async () => {
        let { currentStep, addTaskInfo, treeData } = this.state
        await this.setState({
            currentStep: currentStep - 1,
        })
        if (currentStep == 1) {
            this.stepOne && this.stepOne.getData(treeData, addTaskInfo)
        } else if (currentStep == 2) {
            ;(await this.stepThree) && this.stepThree.postData()
            this.stepTwo && this.stepTwo.getData(this.state.addTaskInfo)
        }
    }

    postData = async () => {
        ;(await this.stepThree) && this.stepThree.postData()
        let { addTaskInfo } = this.state
        let query = {
            ...addTaskInfo,
            operatorName: Cache.get('userName'),
        }
        if (addTaskInfo.frequency == 5) {
            query.days = addTaskInfo.weekChecboxValue.join('|')
            if (!addTaskInfo.weekChecboxValue.length) {
                message.info('请选择每周的周几')
                return
            }
        } else if (addTaskInfo.frequency == 6) {
            query.days = addTaskInfo.monthChecboxValue.join('|')
            if (!addTaskInfo.monthChecboxValue.length) {
                message.info('请选择每月的几号')
                return
            }
        }
        if (addTaskInfo.frequency !== 0) {
            if (!addTaskInfo.startTime || !addTaskInfo.endTime) {
                message.info('请选择调度起止日期')
                return
            }
            if (!addTaskInfo.time) {
                message.info('请选择调度时间')
                return
            }
        }
        if (addTaskInfo.alterPublish && (!addTaskInfo.pushTypes.length || !addTaskInfo.alterPublishUserIds.length)) {
            message.info('请填写接收信息')
            return
        }
        query.time = moment(addTaskInfo.time).format('HH:mm:ss')
        this.setState({ loading: true })
        let res = await saveTask(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('元数据对比')
        }
    }
    getNewTaskInfo = (data) => {
        this.setState({
            addTaskInfo: data,
        })
    }
    getNewColumnData = (data) => {
        this.setState({
            checkRuleListTotal: data,
        })
    }
    prePage = () => {
        this.props.addTab('元数据对比')
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    render() {
        const { currentStep, addTaskInfo, loading } = this.state
        const { pageType } = this.pageParams
        return (
            <React.Fragment>
                <div className='addCompareTask'>
                    <TableLayout
                        title={pageType == 'edit' ? '编辑对比任务' : '新增对比任务'}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <div style={{ marginBottom: 16 }}>
                                        <Steps size='small' current={currentStep}>
                                            <Step title='选择系统' />
                                            <Step title='任务设置' />
                                            <Step title='调度与通知' />
                                        </Steps>
                                    </div>
                                    <div class='addTaskArea'>
                                        {currentStep == 0 ? (
                                            <StepOne
                                                ref={(dom) => {
                                                    this.stepOne = dom
                                                }}
                                                addTaskInfo={addTaskInfo}
                                                getNewTaskInfo={this.getNewTaskInfo}
                                                pageType={pageType}
                                            />
                                        ) : null}
                                        {currentStep == 1 ? (
                                            <StepTwo
                                                ref={(dom) => {
                                                    this.stepTwo = dom
                                                }}
                                                addTaskInfo={addTaskInfo}
                                                getNewTaskInfo={this.getNewTaskInfo}
                                                {...this.props}
                                            />
                                        ) : null}
                                        {currentStep == 2 ? (
                                            <StepThree
                                                ref={(dom) => {
                                                    this.stepThree = dom
                                                }}
                                                addTaskInfo={addTaskInfo}
                                                getNewTaskInfo={this.getNewTaskInfo}
                                            />
                                        ) : null}
                                    </div>
                                </React.Fragment>
                            )
                        }}
                        showFooterControl
                        renderFooter={() => {
                            return (
                                <React.Fragment>
                                    {currentStep !== 0 ? (
                                        <Button type='primary' ghost onClick={this.preStep}>
                                            上一步
                                        </Button>
                                    ) : null}
                                    {currentStep !== 2 ? (
                                        <Button type='primary' onClick={this.nextStep}>
                                            下一步
                                        </Button>
                                    ) : null}
                                    {currentStep == 2 ? (
                                        <Button loading={loading} type='primary' onClick={this.postData}>
                                            保存
                                        </Button>
                                    ) : null}
                                    <Button onClick={this.prePage}>取消</Button>
                                </React.Fragment>
                            )
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
