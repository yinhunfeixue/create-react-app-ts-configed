import Module from '@/component/Module';
import { Checkbox, Col, DatePicker, Divider, Radio, Row, Select, TimePicker } from 'antd';
import { Form } from '@ant-design/compatible';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import SvgIcon from 'app_component_main/SvgIcon/index.tsx';
import moment from 'moment';
import React, { Component } from 'react';
import '../../index.less';

const FormItem = Form.Item
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const CheckboxGroup = Checkbox.Group
const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
const fixUpdateUnitList = [
    {id: 1, name: '自然日'},
    {id: 2, name: '自然周'},
    {id: 3, name: '自然月'},
    {id: 4, name: '自然季度'},
    {id: 5, name: '自然年'},
]
export default class StepThree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: this.props.addTaskInfo,
            timeRange: [],
            rangeTime: [],
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
            ]
        }
    }
    componentWillMount = () => {
        this.getTimeStepList()
        this.nextStep()
    }
    changeSelect = (name, e) => {
        let { addTaskInfo } = this.state
        if (name == 'fixUpdateValue' || name == 'allValue') {
            addTaskInfo.businessData.rangeInfo[name] = e
        } else {
            addTaskInfo[name] = e
        }
        this.setState({
            addTaskInfo
        })
    }
    onChangePicker = async (dates, dateStrings) => {
        let { addTaskInfo } = this.state
        addTaskInfo.startTime = dateStrings[0]
        addTaskInfo.endTime = dateStrings[1]
        await this.setState({
            timeRange: dates,
            addTaskInfo
        })
    }
    onChangeRangePicker = (dates, dateStrings) => {
        console.log(dates,'dates')
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.rangeInfo.customizeBeginTime = dateStrings[0]
        addTaskInfo.businessData.rangeInfo.customizeEndTime = dateStrings[1]
        this.setState({
            rangeTime: dates,
            addTaskInfo
        })
    }
    changeInput = (name, e) => {
        let { addTaskInfo } = this.state
        if (name == 'type') {
            addTaskInfo.timePeriod.type = e.target.value
        } else if (name == 'rangeType') {
            addTaskInfo.businessData.rangeInfo.rangeType = e.target.value
        } else if (name == 'fixUpdateUnit') {
            addTaskInfo.businessData.rangeInfo.fixUpdateUnit = e.target.value
        } else {
            addTaskInfo[name] = e.target.value
        }
        this.setState({
            addTaskInfo
        })
    }
    changeFrequency = async (e) => {
        let { addTaskInfo } = this.state
        addTaskInfo.frequency = e.target.value
        await this.setState({
            addTaskInfo
        })
        this.changeTimePeriod()
        this.renderCheck()
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
            monthPlainOptions
        })
    }
    changeExecuteMinute = (name, e) => {
        const { addTaskInfo } = this.state
        addTaskInfo.timePeriod[name].executeMinute = e
        // 计算窗口结束时间
        if (addTaskInfo.frequency == 4) {
            addTaskInfo.timePeriod[name].endTime = moment(addTaskInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addTaskInfo.frequency == 5) {
            addTaskInfo.timePeriod[name].endTime = moment(addTaskInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addTaskInfo.frequency == 6) {
            addTaskInfo.timePeriod[name].endTime = moment(addTaskInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addTaskInfo.timePeriod[name].endTime.substring(0, 2) == '今天') {
            addTaskInfo.timePeriod[name].endTime = addTaskInfo.timePeriod[name].endTime.replace(/今天/, '当日')
        }
        if (addTaskInfo.timePeriod[name].endTime.substring(0, 2) == '明天') {
            addTaskInfo.timePeriod[name].endTime = addTaskInfo.timePeriod[name].endTime.replace(/明天/, '次日')
        }
        this.setState({
            addTaskInfo,
        })
        console.log(addTaskInfo)
    }
    weekTimeChange = async (name, value) => {
        const { addTaskInfo } = this.state
        addTaskInfo[name] = value
        await this.setState({
            addTaskInfo,
        })
        this.changeTimePeriod()
    }
    changeTimePeriod = () => {
        const { addTaskInfo } = this.state
        if (addTaskInfo.timePeriod.type == 2) {
            this.changeExecuteMinute('allSet', addTaskInfo.timePeriod.allSet.executeMinute)
        }
        if (addTaskInfo.timePeriod.type == 3) {
            this.changeExecuteMinute('working', addTaskInfo.timePeriod.working.executeMinute)
            this.changeExecuteMinute('weekend', addTaskInfo.timePeriod.weekend.executeMinute)
        }
    }
    changeTimePeriodType = async (e) => {
        const { addTaskInfo } = this.state
        addTaskInfo.timePeriod.type = e.target.value
        await this.setState({
            addTaskInfo,
        })
        this.changeTimePeriod()
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
            monthPlainOptions
        })
    }
    nextStep = () => {
        let { timeRange, rangeTime, addTaskInfo } = this.state
        if (addTaskInfo.startTime && addTaskInfo.endTime) {
            timeRange = [moment(addTaskInfo.startTime), moment(addTaskInfo.endTime)]
        }
        if (addTaskInfo.businessData.rangeInfo.customizeBeginTime && addTaskInfo.businessData.rangeInfo.customizeEndTime) {
            rangeTime = [moment(addTaskInfo.businessData.rangeInfo.customizeBeginTime), moment(addTaskInfo.businessData.rangeInfo.customizeEndTime)]
        }
        this.renderCheck()
        this.setState({
            timeRange,
            rangeTime
        })
    }
    postData = () => {
        let { addTaskInfo } = this.state
        this.props.getNewTaskInfo(addTaskInfo)
    }
    render() {
        const {
            addTaskInfo,
            timeRange,
            rangeTime,
            timeStepList,
            weekPlainOptions,
            monthPlainOptions,
        } = this.state
        return (
            <div>
                <Module title='范围设置' style={{ marginBottom: 15 }}></Module>
                <FormItem label='检核范围' {...tailFormItemLayout}>
                    <Radio.Group
                        disabled={(addTaskInfo.businessData.partitionInfo.isPartition && addTaskInfo.businessData.partitionInfo.partitionMode == 2) || !addTaskInfo.businessData.partitionInfo.isPartition}
                        value={addTaskInfo.businessData.rangeInfo.rangeType} onChange={this.changeInput.bind(this, 'rangeType')}>
                        <Radio value={1}>全量</Radio>
                        <Radio value={2}>自定义</Radio>
                        <Radio value={3}>定期更新</Radio>
                    </Radio.Group>
                    {
                        addTaskInfo.businessData.partitionInfo.isPartition && addTaskInfo.businessData.partitionInfo.partitionMode == 2 ?
                            <Select style={{ width: '50%', marginTop: 24, display: 'block' }} value={addTaskInfo.businessData.rangeInfo.allValue} onChange={this.changeSelect.bind(this, 'allValue')} placeholder='请选择'>
                                <Option value={1} key={1}>
                                    上一期
                                </Option>
                                <Option value={2} key={2}>
                                    本期
                                </Option>
                            </Select>
                            :null
                    }
                    {
                        addTaskInfo.businessData.rangeInfo.rangeType == 2 || addTaskInfo.businessData.rangeInfo.rangeType == 3 ?
                            <div className='rangeArea'>
                                <Row gutter={8}>
                                    {
                                        addTaskInfo.businessData.rangeInfo.rangeType == 2?
                                            <Col span={24}>
                                                <FormItem required label='自定义' {...tailFormItemLayout}>
                                                    <RangePicker style={{ width: '100%' }} value={rangeTime} allowClear={false} separator='-' onChange={this.onChangeRangePicker} />
                                                </FormItem>
                                            </Col>
                                            :null
                                    }
                                    {
                                        addTaskInfo.businessData.rangeInfo.rangeType == 3?
                                            <Col span={24}>
                                                <FormItem label='定期更新' {...tailFormItemLayout}>
                                                    <Select style={{ width: '50%' }} value={addTaskInfo.businessData.rangeInfo.fixUpdateValue} onChange={this.changeSelect.bind(this, 'fixUpdateValue')} placeholder='请选择'>
                                                        <Option value={1} key={1}>
                                                            上一期
                                                        </Option>
                                                        <Option value={2} key={2}>
                                                            本期
                                                        </Option>
                                                    </Select>
                                                    <Radio.Group style={{ margin: '16px 0' }} value={addTaskInfo.businessData.rangeInfo.fixUpdateUnit} onChange={this.changeInput.bind(this, 'fixUpdateUnit')}>
                                                        {
                                                            fixUpdateUnitList.map((item) => {
                                                                return (<Radio value={item.id}>{item.name}</Radio>)
                                                            })
                                                        }
                                                    </Radio.Group>
                                                    <div className='formTip'>说明：数据根据设置的时间自动更新，生成相应的数据范围。</div>
                                                    <div className='formTip'>例如：当前时间是11.8日，选择上一期和自然月，生成的检核范围为 2021.10.1 ~ 2021.10.31</div>
                                                </FormItem>
                                            </Col>
                                            :null
                                    }
                                </Row>
                            </div>
                            :null
                    }
                </FormItem>
                <Divider/>
                <Module title='周期设置' style={{ marginBottom: 15 }}></Module>
                <FormItem label='调度起止日期' {...tailFormItemLayout}>
                    <RangePicker style={{ width: '100%' }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />
                </FormItem>
                <FormItem label='调度时间' {...tailFormItemLayout}>
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
                                        <FormItem required label='每天' {...tailFormItemLayout}>
                                            <TimePicker style={{ width: '100%' }} allowClear={false} format='HH:mm:ss' locale={locale} placeholder='请选择时间' defaultValue={moment('00:00:00', 'HH:mm:ss')} value={addTaskInfo.time} mode={'time'} showTime={true} onChange={this.weekTimeChange.bind(this, 'time')} />
                                        </FormItem>
                                    </Col>
                                    :null
                            }
                            {
                                addTaskInfo.frequency == 5?
                                    <Col span={24}>
                                        <FormItem required label='每周' {...tailFormItemLayout}>
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
                                        <FormItem required label='每月' {...tailFormItemLayout}>
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
                                    :null

                            }
                        </Row>
                    </div>
                </FormItem>
                <FormItem label='窗口时长' {...tailFormItemLayout}>
                    <Radio.Group value={addTaskInfo.timePeriod.type} onChange={this.changeTimePeriodType}>
                        <Radio value={1}>不设置</Radio>
                        <Radio value={2}>单时间窗口</Radio>
                        <Radio value={3}>多时间窗口</Radio>
                    </Radio.Group>
                    {
                        addTaskInfo.timePeriod.type == 2 || addTaskInfo.timePeriod.type == 3 ?
                            <div className='rangeArea'>
                                {
                                    addTaskInfo.timePeriod.type == 2 ?
                                        <FormItem label='单时间窗口' {...tailFormItemLayout}>
                                            <span className='timeTitle'>周一～周日窗口时长：</span>
                                            <Select style={{ width: '120px' }} value={addTaskInfo.timePeriod.allSet.executeMinute} onChange={this.changeExecuteMinute.bind(this, 'allSet')} placeholder="请选择">
                                                {
                                                    timeStepList.map((item, index) => {
                                                        return (<Option key={index} value={item.value}>{item.key}</Option>)
                                                    })
                                                }
                                            </Select>
                                            <span className='timeEndTip'>窗口结束时间：<span>{addTaskInfo.timePeriod.allSet.endTime}</span></span>
                                        </FormItem>
                                        :null
                                }
                                {
                                    addTaskInfo.timePeriod.type == 3 ?
                                        <FormItem label='多时间窗口' {...tailFormItemLayout}>
                                            <div>
                                                <span className='timeTitle'>周一～周五窗口时长：</span>
                                                <Select style={{ width: '120px' }} value={addTaskInfo.timePeriod.working.executeMinute} onChange={this.changeExecuteMinute.bind(this, 'working')} placeholder="请选择">
                                                    {
                                                        timeStepList.map((item, index) => {
                                                            return (<Option key={index} value={item.value}>{item.key}</Option>)
                                                        })
                                                    }
                                                </Select>
                                                <span className='timeEndTip'>窗口结束时间：<span>{addTaskInfo.timePeriod.working.endTime}</span></span>
                                            </div>
                                            <div style={{ marginTop: 16 }}>
                                                <span className='timeTitle'>周六～周日窗口时长：</span>
                                                <Select style={{ width: '120px' }} value={addTaskInfo.timePeriod.weekend.executeMinute} onChange={this.changeExecuteMinute.bind(this, 'weekend')} placeholder="请选择">
                                                    {
                                                        timeStepList.map((item, index) => {
                                                            return (<Option key={index} value={item.value}>{item.key}</Option>)
                                                        })
                                                    }
                                                </Select>
                                                <span className='timeEndTip'>窗口结束时间：<span>{addTaskInfo.timePeriod.weekend.endTime}</span></span>
                                            </div>
                                        </FormItem>
                                        :null
                                }
                            </div>
                            :null
                    }
                </FormItem>
            </div>
        )
    }
}