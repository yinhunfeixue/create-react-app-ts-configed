import TableLayout from '@/component/layout/TableLayout'
import { Form } from '@ant-design/compatible'
import { Button, message, Steps } from 'antd'
import { getQualityTaskJobById, saveQualityTaskJob } from 'app_api/examinationApi'
import Cache from 'app_utils/cache'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'
import StepOne from './component/stepOne'
import StepThree from './component/stepThree'
import StepTwo from './component/stepTwo'

const { Step } = Steps

class AddTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 0,
            checkRuleListTotal: 0,
            loading: false,
            addTaskInfo: {
                primaryKeys: [],
                weekChecboxValue: [],
                monthChecboxValue: [],
                timePeriod: {
                    allSet: {
                        endTime: '当日02:00',
                        executeMinute: 120,
                        startTime: '',
                    },
                    working: {
                        endTime: '当日02:00',
                        executeMinute: 120,
                        startTime: '',
                    },
                    weekend: {
                        endTime: '当日04:00',
                        executeMinute: 240,
                        startTime: '',
                    },
                    startTime: '',
                    type: 1,
                },
                days: '',
                frequency: 4,
                time: moment('00:00:00', 'HH:mm:ss'),
                businessData: {
                    checkRuleList: [],
                    datasourceIdName: {},
                    databaseIdName: {},
                    tableIdName: {},
                    managerIdName: {},
                    partitionInfo: {
                        isPartition: false,
                    },
                    rangeInfo: {
                        rangeType: 1,
                        fixUpdateUnit: 1,
                    },
                },
            },
        }
        this.form = {}
    }
    componentWillMount = async () => {
        if (this.props.location.state.pageType == 'edit') {
            await this.getDetail()
        }
    }
    getDetail = async () => {
        let query = {}
        if (this.props.location.state.useBusinessId == true) {
            query = {
                businessId: this.props.location.state.id,
            }
        } else {
            query = {
                id: this.props.location.state.id,
            }
        }
        let res = await getQualityTaskJobById(query)
        if (res.code == 200) {
            res.data.businessData.partitionInfo = JSON.parse(res.data.businessData.partitionInfo)
            res.data.businessData.rangeInfo = JSON.parse(res.data.businessData.rangeInfo)
            res.data.time = moment(res.data.time, 'HH:mm:ss')
            res.data.weekChecboxValue = []
            res.data.monthChecboxValue = []
            if (res.data.frequency == 5) {
                res.data.weekChecboxValue = res.data.days.split('|')
            } else if (res.data.frequency == 6) {
                res.data.monthChecboxValue = res.data.days.split('|')
            }
            res.data.primaryKeys = []
            res.data.businessData.primaryKeys.map((item) => {
                res.data.primaryKeys.push(item.id)
            })
            await this.setState({
                addTaskInfo: res.data,
            })
            this.stepOne && this.stepOne.getEditData(res.data)
        }
    }
    nextStep = async () => {
        let { currentStep } = this.state
        if (currentStep == 0) {
            ;(await this.stepOne) && this.stepOne.nextStep()
            let { addTaskInfo } = this.state
            if (!addTaskInfo.businessData.tableIdName.id) {
                message.info('请选择数据表')
                return
            }
            if (
                addTaskInfo.businessData.partitionInfo.isPartition &&
                (!addTaskInfo.businessData.partitionInfo.partitionColumnId || !addTaskInfo.businessData.partitionInfo.partitionDateFormat || !addTaskInfo.businessData.partitionInfo.partitionMode)
            ) {
                message.info('请选择分区信息')
                return
            }
            if (!addTaskInfo.primaryKeys.length) {
                message.info('请选择主键')
                return
            }
            if (!addTaskInfo.businessData.bizType) {
                message.info('请选择业务类型')
                return
            }
        } else if (currentStep == 1) {
            let { checkRuleListTotal } = this.state
            if (!checkRuleListTotal) {
                message.info('请添加规则')
                return
            }
        }
        this.setState({
            currentStep: currentStep + 1,
        })
    }
    preStep = async () => {
        let { currentStep } = this.state
        await this.setState({
            currentStep: currentStep - 1,
        })
        if (currentStep == 1) {
            this.stepOne && this.stepOne.preStep()
        }
    }

    postData = async () => {
        ;(await this.stepThree) && this.stepThree.postData()
        let { addTaskInfo } = this.state
        let query = {
            ...addTaskInfo,
            businessData: { ...addTaskInfo.businessData },
            taskType: 2,
            taskSubType: 201,
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
        if (!addTaskInfo.time) {
            message.info('请选择调度时间')
            return
        }
        query.businessData.partitionInfo = JSON.stringify(query.businessData.partitionInfo)
        query.businessData.rangeInfo = JSON.stringify(query.businessData.rangeInfo)
        query.time = moment(addTaskInfo.time).format('HH:mm:ss')
        this.setState({ loading: true })
        let res = await saveQualityTaskJob(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('检核任务')
        } else {
            console.log(addTaskInfo.businessData.rangeInfo, 'addTaskInfo.businessData.rangeInfo')
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
        this.props.addTab('检核任务')
    }
    render() {
        const { currentStep, addTaskInfo, loading } = this.state
        const { pageType } = this.props.location.state
        return (
            <React.Fragment>
                <div className='addTask'>
                    <TableLayout
                        title={pageType == 'edit' ? '编辑检核任务' : '新增检核任务'}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <div style={{ marginBottom: 28 }}>
                                        <Steps size='small' current={currentStep}>
                                            <Step title='基本信息' />
                                            <Step title='核验对象' />
                                            <Step title='调度信息' />
                                        </Steps>
                                    </div>
                                    {currentStep == 0 || currentStep == 2 ? (
                                        <div class='EditMiniForm ruleForm formWidth'>
                                            <Form ref={(target) => (this.form = target)} style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                                {currentStep == 0 ? (
                                                    <StepOne
                                                        ref={(dom) => {
                                                            this.stepOne = dom
                                                        }}
                                                        addTaskInfo={addTaskInfo}
                                                        // setFieldsValue={this.form.setFieldsValue}
                                                        getNewTaskInfo={this.getNewTaskInfo}
                                                        pageType={this.props.location.state.pageType}
                                                    />
                                                ) : null}
                                                {currentStep == 2 ? (
                                                    <StepThree
                                                        ref={(dom) => {
                                                            this.stepThree = dom
                                                        }}
                                                        addTaskInfo={addTaskInfo}
                                                        // setFieldsValue={this.form.setFieldsValue}
                                                        getNewTaskInfo={this.getNewTaskInfo}
                                                    />
                                                ) : null}
                                            </Form>
                                        </div>
                                    ) : null}
                                    {currentStep == 1 ? (
                                        <StepTwo
                                            ref={(dom) => {
                                                this.stepTwo = dom
                                            }}
                                            addTaskInfo={addTaskInfo}
                                            // setFieldsValue={setFieldsValue}
                                            getNewColumnData={this.getNewColumnData}
                                        />
                                    ) : null}
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
export default AddTask
