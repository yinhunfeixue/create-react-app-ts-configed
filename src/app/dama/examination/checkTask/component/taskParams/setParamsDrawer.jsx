// 设置任务参数
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Input, Form, message, Select, TimePicker, DatePicker, Radio, Row, Col, Switch, Checkbox } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import Cache from 'app_utils/cache'
import moment from 'moment'
import React, { Component } from 'react'
import store from '../../store'
import { observer } from 'mobx-react'
import '../../index.less'
import { updateTaskGroup } from 'app_api/examinationApi'
import { getSourceList } from 'app_api/metadataApi'

const FormItem = Form.Item
const { TextArea } = Input
const { MonthPicker, RangePicker, WeekPicker } = DatePicker
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
    { id: 1, name: '自然日' },
    { id: 2, name: '自然周' },
    { id: 3, name: '自然月' },
    { id: 4, name: '自然季度' },
    { id: 5, name: '自然年' },
]

@observer
export default class SetParamsDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: {
                primaryKeys: [],
                weekChecboxValue: [],
                monthChecboxValue: [],
                addType: '1',
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
                checkRange: {
                    rangeType: 1,
                    fixUpdateUnit: 1,
                },
            },
            modalVisible: false,
            btnLoading: false,
            datasourceList: [],
            modalType: '1',
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
            ],
        }
    }
    openModal = async (type) => {
        let { addTaskInfo, timeRange, rangeTime } = this.state
        const { taskDetail } = store
        taskDetail.addType = taskDetail.frequency !== 0 ? 1 : 0
        addTaskInfo = { ...taskDetail }
        if (type == '1') {
            addTaskInfo.checkRange = taskDetail.checkRange.rangeType ? taskDetail.checkRange : { rangeType: 2, fixUpdateUnit: 1 }
        }
        addTaskInfo.frequency = addTaskInfo.frequency !== undefined ? addTaskInfo.frequency : 4
        timeRange = addTaskInfo.startTime ? [moment(addTaskInfo.startTime), moment(addTaskInfo.endTime)] : []
        rangeTime = addTaskInfo.checkRange.customizeBeginTime ? [moment(addTaskInfo.checkRange.customizeBeginTime), moment(addTaskInfo.checkRange.customizeEndTime)] : []
        await this.setState({
            modalVisible: true,
            modalType: type,
            addTaskInfo,
            timeRange,
            rangeTime,
        })
        this.getTimeStepList()
        this.getDatasourceList()
        this.renderCheck()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getDatasourceList = async () => {
        let res = await getSourceList()
        if (res.code == 200) {
            this.setState({
                datasourceList: res.data,
            })
        }
    }
    changeSelect = (name, e, node) => {
        let { addTaskInfo } = this.state
        if (name == 'fixUpdateValue' || name == 'allValue') {
            addTaskInfo.checkRange[name] = e
        } else if (name == 'isTest') {
            addTaskInfo[name] = e ? 1 : 0
        } else if (name == 'testDatasourceId') {
            addTaskInfo[name] = e
            addTaskInfo.testDatasourceNameCn = node.props.title
        } else {
            addTaskInfo[name] = e
        }
        this.setState({
            addTaskInfo,
        })
    }
    onChangePicker = async (dates, dateStrings) => {
        let { addTaskInfo } = this.state
        addTaskInfo.startTime = moment(dateStrings[0]).format('YYYY-MM-DD 00:00:00')
        addTaskInfo.endTime = moment(dateStrings[1]).format('YYYY-MM-DD 23:59:59')
        console.log(addTaskInfo.endTime)
        await this.setState({
            timeRange: dates,
            addTaskInfo,
        })
    }
    onChangeRangePicker = (dates, dateStrings) => {
        console.log(dates, 'dates')
        let { addTaskInfo } = this.state
        addTaskInfo.checkRange.customizeBeginTime = dateStrings[0]
        addTaskInfo.checkRange.customizeEndTime = dateStrings[1]
        this.setState({
            rangeTime: dates,
            addTaskInfo,
        })
    }
    changeInput = (name, e) => {
        let { addTaskInfo } = this.state
        if (name == 'type') {
            addTaskInfo.timePeriod.type = e.target.value
        } else if (name == 'rangeType') {
            addTaskInfo.checkRange.rangeType = e.target.value
        } else if (name == 'fixUpdateUnit') {
            addTaskInfo.checkRange.fixUpdateUnit = e.target.value
        } else if (name == 'addType') {
            addTaskInfo[name] = e.target.value
            addTaskInfo.frequency = e.target.value ? 4 : 0
        } else {
            addTaskInfo[name] = e.target.value
        }
        this.setState({
            addTaskInfo,
        })
    }
    changeFrequency = async (e) => {
        let { addTaskInfo } = this.state
        addTaskInfo.frequency = e.target.value
        await this.setState({
            addTaskInfo,
        })
        this.changeTimePeriod()
        this.renderCheck()
    }
    getTimeStepList = () => {
        let { timeStepList, monthPlainOptions } = this.state
        timeStepList = []
        monthPlainOptions = []
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
        addTaskInfo[name] = e.sort((a, b) => parseInt(a) - parseInt(b))
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
    postData = async () => {
        let { addTaskInfo, modalType, rangeTime } = this.state
        let query = {
            ...addTaskInfo,
        }
        console.log('query', query)
        if (modalType == 1) {
            if (addTaskInfo.checkRange.rangeType == 2) {
                if (!addTaskInfo.checkRange.customizeBeginTime || !addTaskInfo.checkRange.customizeEndTime) {
                    message.info('请选择日期')
                    return
                }
            } else if (addTaskInfo.checkRange.rangeType == 3) {
                if (!addTaskInfo.checkRange.fixUpdateValue) {
                    message.info('请选择定期更新方式')
                    return
                }
            }
        } else if (modalType == '2') {
            query.frequency = addTaskInfo.addType == '0' ? 0 : query.frequency
            if (query.frequency == 5) {
                query.days = addTaskInfo.weekChecboxValue.join('|')
                if (!addTaskInfo.weekChecboxValue.length) {
                    message.info('请选择每周的周几')
                    return
                }
            } else if (query.frequency == 6) {
                query.days = addTaskInfo.monthChecboxValue.join('|')
                if (!addTaskInfo.monthChecboxValue.length) {
                    message.info('请选择每月的几号')
                    return
                }
            }
            if (query.frequency !== 0) {
                if (!addTaskInfo.startTime || !addTaskInfo.endTime) {
                    message.info('请选择调度起止日期')
                    return
                }
                if (!addTaskInfo.time) {
                    message.info('请选择调度时间')
                    return
                }
            }
            query.time = moment(addTaskInfo.time).format('HH:mm:ss')
        } else {
            if (addTaskInfo.isTest && !addTaskInfo.testDatasourceId) {
                message.info('请选择数据源')
                return
            }
        }
        query.partitionInfo = JSON.stringify(query.partitionInfo)
        this.setState({ btnLoading: true })
        let res = await updateTaskGroup(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.refresh()
        }
    }
    render() {
        const { taskDetail, selectedTaskInfo } = store
        const { addTaskInfo, modalType, modalVisible, btnLoading, datasourceList, timeRange, rangeTime, timeStepList, weekPlainOptions, monthPlainOptions } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: modalType == 1 ? '检核范围' : modalType == '2' ? '执行周期' : '试跑环境',
                    className: 'setParamsDrawer',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button disabled={btnLoading} onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {modalType == '1' ? (
                            <Form className='EditMiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '检核范围',
                                        content: (
                                            <div>
                                                <Radio.Group
                                                    // disabled={(addTaskInfo.partitionInfo.isPartition && addTaskInfo.partitionInfo.partitionMode == 2) || !addTaskInfo.partitionInfo.isPartition}
                                                    value={addTaskInfo.checkRange.rangeType}
                                                    onChange={this.changeInput.bind(this, 'rangeType')}
                                                >
                                                    <Radio value={1}>全量</Radio>
                                                    <Radio value={2}>自定义</Radio>
                                                    <Radio value={3}>定期更新</Radio>
                                                </Radio.Group>
                                                {/*{*/}
                                                {/*addTaskInfo.partitionInfo.isPartition && addTaskInfo.partitionInfo.partitionMode == 2 ?*/}
                                                {/*<Select style={{ width: '50%', marginTop: 24, display: 'block' }} value={addTaskInfo.checkRange.allValue} onChange={this.changeSelect.bind(this, 'allValue')} placeholder='请选择'>*/}
                                                {/*<Select.Option value={1} key={1}>*/}
                                                {/*上一期*/}
                                                {/*</Select.Option>*/}
                                                {/*<Select.Option value={2} key={2}>*/}
                                                {/*本期*/}
                                                {/*</Select.Option>*/}
                                                {/*</Select>*/}
                                                {/*:null*/}
                                                {/*}*/}
                                                {addTaskInfo.checkRange.rangeType == 2 || addTaskInfo.checkRange.rangeType == 3 ? (
                                                    <div className='rangeArea'>
                                                        <Row gutter={8}>
                                                            {addTaskInfo.checkRange.rangeType == 2 ? (
                                                                <Col span={24}>
                                                                    <FormItem label='自定义' {...tailFormItemLayout}>
                                                                        <RangePicker style={{ width: '100%' }} value={rangeTime} allowClear={false} separator='-' onChange={this.onChangeRangePicker} />
                                                                    </FormItem>
                                                                </Col>
                                                            ) : null}
                                                            {addTaskInfo.checkRange.rangeType == 3 ? (
                                                                <Col span={24}>
                                                                    <FormItem label='定期更新' {...tailFormItemLayout}>
                                                                        <Select
                                                                            style={{ width: '50%' }}
                                                                            value={addTaskInfo.checkRange.fixUpdateValue}
                                                                            onChange={this.changeSelect.bind(this, 'fixUpdateValue')}
                                                                            placeholder='请选择'
                                                                        >
                                                                            <Select.Option value={1} key={1}>
                                                                                上一期
                                                                            </Select.Option>
                                                                            <Select.Option value={2} key={2}>
                                                                                本期
                                                                            </Select.Option>
                                                                        </Select>
                                                                        <Radio.Group
                                                                            style={{ margin: '16px 0' }}
                                                                            value={addTaskInfo.checkRange.fixUpdateUnit}
                                                                            onChange={this.changeInput.bind(this, 'fixUpdateUnit')}
                                                                        >
                                                                            {fixUpdateUnitList.map((item) => {
                                                                                return <Radio value={item.id}>{item.name}</Radio>
                                                                            })}
                                                                        </Radio.Group>
                                                                        <div className='formTip'>说明：数据根据设置的时间自动更新，生成相应的数据范围。</div>
                                                                        <div className='formTip'>例如：当前时间是11.8日，选择上一期和自然月，生成的检核范围为 2021.10.1 ~ 2021.10.31</div>
                                                                    </FormItem>
                                                                </Col>
                                                            ) : null}
                                                        </Row>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ),
                                    },
                                ])}
                            </Form>
                        ) : null}
                        {modalType == '2' ? (
                            <Form className='EditMiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '任务周期',
                                        content: (
                                            <Radio.Group value={addTaskInfo.addType} onChange={this.changeInput.bind(this, 'addType')}>
                                                <Radio value={1}>周期任务</Radio>
                                                <Radio value={0}>单次任务</Radio>
                                            </Radio.Group>
                                        ),
                                    },
                                    {
                                        label: '调度起止日期',
                                        hide: addTaskInfo.addType == 0,
                                        content: <RangePicker style={{ width: '100%' }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />,
                                    },
                                    {
                                        label: '调度时间',
                                        hide: addTaskInfo.addType == 0,
                                        content: (
                                            <div>
                                                <Radio.Group value={addTaskInfo.frequency} onChange={this.changeFrequency}>
                                                    <Radio value={4}>每天</Radio>
                                                    <Radio value={5}>每周</Radio>
                                                    <Radio value={6}>每月</Radio>
                                                </Radio.Group>
                                                <div className='rangeArea'>
                                                    <Row gutter={8}>
                                                        {addTaskInfo.frequency == 4 ? (
                                                            <Col span={12}>
                                                                <FormItem required label='每天' {...tailFormItemLayout}>
                                                                    <TimePicker
                                                                        style={{ width: '100%' }}
                                                                        allowClear={false}
                                                                        format='HH:mm:ss'
                                                                        locale={locale}
                                                                        placeholder='请选择时间'
                                                                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                        value={addTaskInfo.time}
                                                                        mode={'time'}
                                                                        showTime={true}
                                                                        onChange={this.weekTimeChange.bind(this, 'time')}
                                                                    />
                                                                </FormItem>
                                                            </Col>
                                                        ) : null}
                                                        {addTaskInfo.frequency == 5 ? (
                                                            <Col span={24}>
                                                                <FormItem required label='每周' {...tailFormItemLayout}>
                                                                    <div className='editautoDay'>
                                                                        <div className='editautoDayCheck'>
                                                                            <CheckboxGroup value={addTaskInfo.weekChecboxValue} onChange={this.changeCheckBox.bind(this, 'weekChecboxValue')}>
                                                                                {weekPlainOptions.map((item) => {
                                                                                    return (
                                                                                        <Checkbox value={item.value}>
                                                                                            {item.checked ? <SvgIcon name='icon_tag_top' /> : null}
                                                                                            {item.label}
                                                                                        </Checkbox>
                                                                                    )
                                                                                })}
                                                                            </CheckboxGroup>
                                                                        </div>
                                                                        <span style={{ color: '#606366' }}>的</span>
                                                                        <TimePicker
                                                                            allowClear={false}
                                                                            format='HH:mm:ss'
                                                                            locale={locale}
                                                                            defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                            placeholder='请选择'
                                                                            value={addTaskInfo.time}
                                                                            mode={'time'}
                                                                            showTime={true}
                                                                            onChange={this.weekTimeChange.bind(this, 'time')}
                                                                        />
                                                                    </div>
                                                                </FormItem>
                                                            </Col>
                                                        ) : null}
                                                        {addTaskInfo.frequency == 6 ? (
                                                            <Col span={24}>
                                                                <FormItem required label='每月' {...tailFormItemLayout}>
                                                                    <div className='editautoDay editautoMonth'>
                                                                        <div className='editautoDayCheck'>
                                                                            <CheckboxGroup value={addTaskInfo.monthChecboxValue} onChange={this.changeCheckBox.bind(this, 'monthChecboxValue')}>
                                                                                {monthPlainOptions.map((item) => {
                                                                                    return (
                                                                                        <Checkbox value={item.value}>
                                                                                            {item.checked ? <SvgIcon name='icon_tag_top' /> : null}
                                                                                            {item.value}
                                                                                        </Checkbox>
                                                                                    )
                                                                                })}
                                                                            </CheckboxGroup>
                                                                        </div>
                                                                        <span style={{ color: '#606366' }}>的</span>
                                                                        <TimePicker
                                                                            allowClear={false}
                                                                            format='HH:mm:ss'
                                                                            locale={locale}
                                                                            defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                            placeholder='请选择时间'
                                                                            value={addTaskInfo.time}
                                                                            mode={'time'}
                                                                            showTime={true}
                                                                            onChange={this.weekTimeChange.bind(this, 'time')}
                                                                        />
                                                                    </div>
                                                                </FormItem>
                                                            </Col>
                                                        ) : null}
                                                    </Row>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: '窗口时长',
                                        hide: addTaskInfo.addType == 0,
                                        content: (
                                            <div>
                                                <Radio.Group value={addTaskInfo.timePeriod.type} onChange={this.changeTimePeriodType}>
                                                    <Radio value={1}>不设置</Radio>
                                                    <Radio value={2}>单时间窗口</Radio>
                                                    <Radio value={3}>多时间窗口</Radio>
                                                </Radio.Group>
                                                {addTaskInfo.timePeriod.type == 2 || addTaskInfo.timePeriod.type == 3 ? (
                                                    <div className='rangeArea'>
                                                        {addTaskInfo.timePeriod.type == 2 ? (
                                                            <FormItem label='单时间窗口' {...tailFormItemLayout}>
                                                                <span className='timeTitle'>周一～周日窗口时长：</span>
                                                                <Select
                                                                    style={{ width: '120px' }}
                                                                    value={addTaskInfo.timePeriod.allSet.executeMinute}
                                                                    onChange={this.changeExecuteMinute.bind(this, 'allSet')}
                                                                    placeholder='请选择'
                                                                >
                                                                    {timeStepList.map((item, index) => {
                                                                        return (
                                                                            <Select.Option key={index} value={item.value}>
                                                                                {item.key}
                                                                            </Select.Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                                <span className='timeEndTip'>
                                                                    窗口结束时间：<span>{addTaskInfo.timePeriod.allSet.endTime}</span>
                                                                </span>
                                                            </FormItem>
                                                        ) : null}
                                                        {addTaskInfo.timePeriod.type == 3 ? (
                                                            <FormItem label='多时间窗口' {...tailFormItemLayout}>
                                                                <div>
                                                                    <span className='timeTitle'>周一～周五窗口时长：</span>
                                                                    <Select
                                                                        style={{ width: '120px' }}
                                                                        value={addTaskInfo.timePeriod.working.executeMinute}
                                                                        onChange={this.changeExecuteMinute.bind(this, 'working')}
                                                                        placeholder='请选择'
                                                                    >
                                                                        {timeStepList.map((item, index) => {
                                                                            return (
                                                                                <Select.Option key={index} value={item.value}>
                                                                                    {item.key}
                                                                                </Select.Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <span className='timeEndTip'>
                                                                        窗口结束时间：<span>{addTaskInfo.timePeriod.working.endTime}</span>
                                                                    </span>
                                                                </div>
                                                                <div style={{ marginTop: 16 }}>
                                                                    <span className='timeTitle'>周六～周日窗口时长：</span>
                                                                    <Select
                                                                        style={{ width: '120px' }}
                                                                        value={addTaskInfo.timePeriod.weekend.executeMinute}
                                                                        onChange={this.changeExecuteMinute.bind(this, 'weekend')}
                                                                        placeholder='请选择'
                                                                    >
                                                                        {timeStepList.map((item, index) => {
                                                                            return (
                                                                                <Select.Option key={index} value={item.value}>
                                                                                    {item.key}
                                                                                </Select.Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <span className='timeEndTip'>
                                                                        窗口结束时间：<span>{addTaskInfo.timePeriod.weekend.endTime}</span>
                                                                    </span>
                                                                </div>
                                                            </FormItem>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ),
                                    },
                                ])}
                            </Form>
                        ) : null}
                        {modalType == '3' ? (
                            <Form className='EditMiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '试跑环境（建议开启试跑环境）',
                                        content: <Switch checked={addTaskInfo.isTest == 1} onChange={this.changeSelect.bind(this, 'isTest')} />,
                                    },
                                    {
                                        label: '数据源选择',
                                        hide: !addTaskInfo.isTest,
                                        content: (
                                            <Select
                                                showSearch
                                                optionFilterProp='title'
                                                value={addTaskInfo.testDatasourceId}
                                                onChange={this.changeSelect.bind(this, 'testDatasourceId')}
                                                placeholder='请选择'
                                            >
                                                {datasourceList.map((item, index) => {
                                                    return (
                                                        <Select.Option title={item.dsName} key={item.id} value={item.id}>
                                                            {item.dsName}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                ])}
                            </Form>
                        ) : null}
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
