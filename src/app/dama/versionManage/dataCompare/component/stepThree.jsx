import Module from '@/component/Module'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Col, DatePicker, Radio, Row, Select, Switch, TimePicker } from 'antd'
import { Form } from '@ant-design/compatible';
import { InfoCircleOutlined } from '@ant-design/icons';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import moment from 'moment'
import React, { Component } from 'react'
import RichSelect from '@/component/lzAntd/RichSelect'
import '../index.less'
const { RangePicker } = DatePicker
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
import { pushTypes } from 'app_api/autoManage'
import { requestUserList } from '@/api/systemApi'


const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
export default class StepThree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: this.props.addTaskInfo,
            timeRange: [],
            timeStepList: [],
            monthPlainOptions: [],
            weekPlainOptions: [
                {
                    label: '周一',
                    value: '1',
                },
                {
                    label: '周二',
                    value: '2',
                },
                {
                    label: '周三',
                    value: '3',
                },
                {
                    label: '周四',
                    value: '4',
                },
                {
                    label: '周五',
                    value: '5',
                },
                {
                    label: '周六',
                    value: '6',
                },
                {
                    label: '周日',
                    value: '7',
                },
            ],
            userList: [],
            typeList: []
        }
    }
    componentWillMount = () => {
        this.getTimeStepList()
        this.nextStep()
        this.getUserData()
        this.getPushTypes()
    }
    getTimeStepList = () => {
        let { timeStepList, monthPlainOptions } = this.state
        timeStepList = []
        for (let i = 1; i < 49; i++) {
            timeStepList.push({ key: i / 2 + '小时', value: (i / 2) * 60 })
        }
        // timeStepList.unshift({ key: '1分钟', value: 1 })
        for (let i = 1; i < 32; i++) {
            monthPlainOptions.push({ value: i.toString(), checked: false })
        }
        this.setState({
            timeStepList,
            monthPlainOptions,
        })
    }
    getData = (data) => {
        this.setState({
            addTaskInfo: data,
        })
    }

    changeAddType = (value) => {
        let { addTaskInfo } = this.state
        addTaskInfo.addType = value
        this.setState({
            addTaskInfo,
        })
    }
    onChangePicker = async (dates, dateStrings) => {
        let { addTaskInfo } = this.state
        addTaskInfo.startTime = dateStrings[0]
        addTaskInfo.endTime = dateStrings[1]
        await this.setState({
            timeRange: dates,
            addTaskInfo,
        })
    }
    changeFrequency = async (e) => {
        let { addTaskInfo } = this.state
        addTaskInfo.frequency = e.target.value
        await this.setState({
            addTaskInfo,
        })
        this.renderCheck()
    }
    weekTimeChange = async (name, value) => {
        const { addTaskInfo } = this.state
        addTaskInfo[name] = value
        await this.setState({
            addTaskInfo,
        })
    }
    changeCheckBox = async (name, e) => {
        const { addTaskInfo } = this.state
        addTaskInfo[name] = e
        await this.setState({
            addTaskInfo,
        })
        this.renderCheck()
    }
    renderCheck = () => {
        const { addTaskInfo, weekPlainOptions, monthPlainOptions } = this.state
        weekPlainOptions.map((week) => {
            week.checked = false
        })
        monthPlainOptions.map((month) => {
            month.checked = false
        })
        addTaskInfo.weekChecboxValue.map((item) => {
            weekPlainOptions.map((week) => {
                if (item == week.value) {
                    week.checked = true
                }
            })
        })
        addTaskInfo.monthChecboxValue.map((item) => {
            monthPlainOptions.map((month) => {
                if (item == month.value) {
                    month.checked = true
                }
            })
        })
        this.setState({
            weekPlainOptions,
            monthPlainOptions,
        })
    }
    nextStep = () => {
        let { timeRange, addTaskInfo } = this.state
        if (addTaskInfo.startTime && addTaskInfo.endTime) {
            timeRange = [moment(addTaskInfo.startTime), moment(addTaskInfo.endTime)]
        }
        addTaskInfo.addType = addTaskInfo.frequency == 0 ? '0' : '1'
        this.renderCheck()
        this.setState({
            timeRange,
            addTaskInfo
        })
    }
    postData = () => {
        let { addTaskInfo } = this.state
        addTaskInfo.frequency = addTaskInfo.addType == '0' ? 0 : addTaskInfo.frequency
        this.props.getNewTaskInfo(addTaskInfo)
    }
    renderModuleTitle = (title) => {
        let { addTaskInfo } = this.state
        return (
            <div>
                {title}
                <Switch style={{ marginLeft: 8 }} onChange={this.onSwitch} checked={addTaskInfo.alterPublish} />
            </div>
        )
    }
    onSwitch = (e) => {
        let { addTaskInfo } = this.state
        addTaskInfo.alterPublish = e
        addTaskInfo.pushTypes = []
        addTaskInfo.alterPublishUserIds = []
        this.setState({
            addTaskInfo
        })
    }
    changeSelect = (name, e) => {
        let { addTaskInfo } = this.state
        addTaskInfo[name] = e
        this.setState({
            addTaskInfo,
        })
    }
    getUserData = async () => {
        let { addTaskInfo } = this.state
        let res = await requestUserList({ needAll: true, status: 1 })
        if (res.code == 200) {
            // let array = []
            // res.data.map((item) => {
            //     array.push(item.id)
            // })
            // for (let i=0;i<addTaskInfo.alterPublishUserIds.length;i++) {
            //     if (!array.includes(addTaskInfo.alterPublishUserIds[i])) {
            //         addTaskInfo.alterPublishUserIds.splice(i, 1)
            //     }
            // }
            this.setState({
                userList: res.data,
                addTaskInfo
            })
        }
    }
    getPushTypes = async () => {
        let res = await pushTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data
            })
        }
    }
    render() {
        let {
            addTaskInfo,
            timeRange,
            weekPlainOptions,
            monthPlainOptions,
            userList,
            typeList
        } = this.state
        return (
            <div className='stepThree'>
                <Module title='调度周期设置'>
                    <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                        {RenderUtil.renderFormItems([
                            {
                                label: '',
                                content: <div className='tabBtn'>
                                    <Button onClick={this.changeAddType.bind(this, '1')} className={addTaskInfo.addType == '1'?'tabBtnItemSelected tabBtnItem':'tabBtnItem'}
                                    >
                                        {
                                            addTaskInfo.addType == '1'?<SvgIcon name="icon_tag_top" />:null
                                        }
                                        <span>周期任务</span>
                                    </Button>
                                    <Button onClick={this.changeAddType.bind(this, '0')} className={addTaskInfo.addType == '0'?'tabBtnItemSelected tabBtnItem':'tabBtnItem'}
                                    >
                                        {
                                            addTaskInfo.addType == '0'?<SvgIcon name="icon_tag_top" />:null
                                        }
                                        <span>单次任务</span>
                                    </Button>
                                </div>,
                            },
                            {
                                label: '调度起止日期',
                                hide: addTaskInfo.addType == '0',
                                content: <RangePicker style={{ width: '100%' }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />
                                ,
                            },
                            {
                                label: '调度时间',
                                hide: addTaskInfo.addType == '0',
                                content: <div style={{ marginTop: 4 }}>
                                    <Radio.Group value={addTaskInfo.frequency} onChange={this.changeFrequency}>
                                        <Radio value={4}>每天</Radio>
                                        <Radio value={5}>每周</Radio>
                                        <Radio value={6}>每月</Radio>
                                    </Radio.Group>
                                    <div className='rangeArea'>
                                        <Row gutter={8}>
                                            {
                                                addTaskInfo.frequency == 4?
                                                    <Col span={12}>
                                                        <FormItem label='每天' {...tailFormItemLayout}>
                                                            <TimePicker style={{ width: '100%' }} allowClear={false} format='HH:mm:ss' locale={locale} placeholder='请选择时间' defaultValue={moment('00:00:00', 'HH:mm:ss')} value={addTaskInfo.time} mode={'time'} showTime={true} onChange={this.weekTimeChange.bind(this, 'time')} />
                                                        </FormItem>
                                                    </Col>
                                                    :null
                                            }
                                            {
                                                addTaskInfo.frequency == 5?
                                                    <Col span={24}>
                                                        <FormItem label='每周' {...tailFormItemLayout}>
                                                            <div className='editautoDay'>
                                                                <div className='editautoDayCheck'>
                                                                    <CheckboxGroup value={addTaskInfo.weekChecboxValue} onChange={this.changeCheckBox.bind(this, 'weekChecboxValue')}>
                                                                        {
                                                                            weekPlainOptions.map((item) => {
                                                                                return (
                                                                                    <Checkbox value={item.value}>
                                                                                        {
                                                                                            item.checked ? <SvgIcon name="icon_tag_top" />:null
                                                                                        }
                                                                                        {item.label}
                                                                                    </Checkbox>
                                                                                )
                                                                            })
                                                                        }
                                                                    </CheckboxGroup>
                                                                </div>
                                                                <span style={{ color: '#606366' }}>的</span>
                                                                <TimePicker allowClear={false} format='HH:mm:ss' locale={locale} defaultValue={moment('00:00:00', 'HH:mm:ss')} placeholder='请选择' value={addTaskInfo.time} mode={'time'} showTime={true} onChange={this.weekTimeChange.bind(this, 'time')} />
                                                            </div>
                                                        </FormItem>
                                                    </Col>
                                                    :null
                                            }
                                            {
                                                addTaskInfo.frequency == 6 ?
                                                    <Col span={24}>
                                                        <FormItem label='每月' {...tailFormItemLayout}>
                                                            <div className='editautoDay editautoMonth'>
                                                                <div className='editautoDayCheck'>
                                                                    <CheckboxGroup value={addTaskInfo.monthChecboxValue} onChange={this.changeCheckBox.bind(this, 'monthChecboxValue')}>
                                                                        {
                                                                            monthPlainOptions.map((item) => {
                                                                                return (
                                                                                    <Checkbox value={item.value}>
                                                                                        {
                                                                                            item.checked ? <SvgIcon name="icon_tag_top" />:null
                                                                                        }
                                                                                        {item.value}
                                                                                    </Checkbox>
                                                                                )
                                                                            })
                                                                        }
                                                                    </CheckboxGroup>
                                                                </div>
                                                                <span style={{ color: '#606366' }}>的</span>
                                                                <TimePicker allowClear={false} format='HH:mm:ss' locale={locale} defaultValue={moment('00:00:00', 'HH:mm:ss')} placeholder='请选择时间' value={addTaskInfo.time} mode={'time'} showTime={true} onChange={this.weekTimeChange.bind(this, 'time')} />
                                                            </div>
                                                        </FormItem>
                                                    </Col>
                                                : null}
                                            </Row>
                                        </div>
                                    </div>

                            },
                        ])}
                    </Form>
                </Module>
                {
                    addTaskInfo.addType == '0' ? null :
                        <Module title={this.renderModuleTitle('变更通知')}>
                            {
                                addTaskInfo.alterPublish ?
                                    <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '接收方式',
                                                content: <Checkbox.Group value={addTaskInfo.pushTypes} onChange={this.changeSelect.bind(this, 'pushTypes')}>
                                                    {
                                                        typeList.map((item) => {
                                                            return (
                                                                <Checkbox value={item.id}>{item.name}</Checkbox>
                                                            )
                                                        })
                                                    }
                                                </Checkbox.Group>
                                                ,
                                            },
                                            {
                                                label: '接收人员',
                                                content: <RichSelect dataSource={userList} dataKey='id' mode="multiple" allowClear optionFilterProp='title' placeholder='请选择' value={addTaskInfo.alterPublishUserIds} onChange={this.changeSelect.bind(this, 'alterPublishUserIds')}>
                                                    {userList &&
                                                    userList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.name + item.account} key={item.id} value={item.id}>
                                                                {item.name}（{item.account}）
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </RichSelect>
                                                ,
                                            },
                                        ])}
                                    </Form>
                                    : null
                            }
                        </Module>
                }
            </div>
        )
    }
}