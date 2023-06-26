import './index.less'
import React, { Component } from 'react'
import { Form, Switch, Button, Row, Col, Checkbox, Radio,Tooltip, DatePicker, Pagination, Input, Menu, Table, message, Modal, Select, Tabs } from 'antd';
import { discoverConfig, saveDiscoverConfig, discoverConfigStatus } from 'app_api/metadataApi'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import RenderUtil from '@/utils/RenderUtil'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'

const { RangePicker, TimePicker } = DatePicker


const { Option } = Select
const FormItem = Form.Item
const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}

export default class DiscoverSetDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnLoading: false,
            modalVisible: false,
            addInfo: {
                scannerScopeList: [{}],
                enableFlag: 1,
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
            },
            timeRange: [],
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
            timeStepList: []
        }
    }
    openModal = async () => {
        await this.setState({
            modalVisible: true,
        })
        this.getDetail()
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
    getDetail = async () => {
        let { timeRange } = this.state
        let res = await discoverConfig()
        if (res.code == 200) {
            res.data.scannerScopeList = res.data.scannerScopeList ? res.data.scannerScopeList : [{ip: undefined}]
            res.data.scannerWay = res.data.scannerWay ? res.data.scannerWay : 2
            res.data.addType = res.data.frequency !== 0 ? 1 : 0
            timeRange = res.data.startTime ? [moment(res.data.startTime), moment(res.data.endTime)] : []
            res.data.time = res.data.time ? moment(res.data.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
            res.data.weekChecboxValue = []
            res.data.monthChecboxValue = []
            if (res.data.frequency == 5) {
                res.data.weekChecboxValue = res.data.days.split('|')
            } else if (res.data.frequency == 6) {
                res.data.monthChecboxValue = res.data.days.split('|')
            }
            res.data.timePeriod = res.data.timePeriod ? res.data.timePeriod : {
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
            }
            await this.setState({
                addInfo: res.data,
                timeRange
            })
            this.getTimeStepList()
            this.renderCheck()
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    changeSelect = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e ? 1 : 0
        this.setState({
            addInfo,
        })
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        if (name == 'addType') {
            addInfo.frequency = e.target.value ? 4 : 0
        }
        this.setState({
            addInfo,
        })
    }
    handleChange = (index, name, e) => {
        let { addInfo } = this.state
        if (name == 'type') {
            addInfo.scannerScopeList[index].type = e
        } else {
            addInfo.scannerScopeList[index].ip = e.target.value
        }
        this.setState({
            addInfo,
        })
    }
    onChangePicker = async (dates, dateStrings) => {
        let { addInfo } = this.state
        addInfo.startTime = moment(dateStrings[0]).format('YYYY-MM-DD 00:00:00')
        addInfo.endTime = moment(dateStrings[1]).format('YYYY-MM-DD 23:59:59')
        console.log(addInfo.endTime)
        await this.setState({
            timeRange: dates,
            addInfo,
        })
    }
    changeFrequency = async (e) => {
        let { addInfo } = this.state
        addInfo.frequency = e.target.value
        await this.setState({
            addInfo,
        })
        this.changeTimePeriod()
        this.renderCheck()
    }
    changeTimePeriod = () => {
        const { addInfo } = this.state
        if (addInfo.timePeriod.type == 2) {
            this.changeExecuteMinute('allSet', addInfo.timePeriod.allSet.executeMinute)
        }
        if (addInfo.timePeriod.type == 3) {
            this.changeExecuteMinute('working', addInfo.timePeriod.working.executeMinute)
            this.changeExecuteMinute('weekend', addInfo.timePeriod.weekend.executeMinute)
        }
    }
    changeExecuteMinute = (name, e) => {
        const { addInfo } = this.state
        addInfo.timePeriod[name].executeMinute = e
        // 计算窗口结束时间
        if (addInfo.frequency == 4) {
            addInfo.timePeriod[name].endTime = moment(addInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addInfo.frequency == 5) {
            addInfo.timePeriod[name].endTime = moment(addInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addInfo.frequency == 6) {
            addInfo.timePeriod[name].endTime = moment(addInfo.time.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (addInfo.timePeriod[name].endTime.substring(0, 2) == '今天') {
            addInfo.timePeriod[name].endTime = addInfo.timePeriod[name].endTime.replace(/今天/, '当日')
        }
        if (addInfo.timePeriod[name].endTime.substring(0, 2) == '明天') {
            addInfo.timePeriod[name].endTime = addInfo.timePeriod[name].endTime.replace(/明天/, '次日')
        }
        this.setState({
            addInfo,
        })
        console.log(addInfo)
    }
    renderCheck = () => {
        const { addInfo, weekPlainOptions, monthPlainOptions } = this.state
        weekPlainOptions.map((week) => {
            week.checked = false
        })
        monthPlainOptions.map((month) => {
            month.checked = false
        })
        addInfo.weekChecboxValue.map((item) => {
            weekPlainOptions.map((week) => {
                if (item == week.value) {
                    week.checked = true
                }
            })
        })
        addInfo.monthChecboxValue.map((item) => {
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
    weekTimeChange = async (name, value) => {
        const { addInfo } = this.state
        addInfo[name] = value
        await this.setState({
            addInfo,
        })
        this.changeTimePeriod()
    }
    changeCheckBox = async (name, e) => {
        const { addInfo } = this.state
        addInfo[name] = e.sort((a, b) => parseInt(a) - parseInt(b))
        await this.setState({
            addInfo,
        })
        this.renderCheck()
    }
    changeTimePeriodType = async (e) => {
        const { addInfo } = this.state
        addInfo.timePeriod.type = e.target.value
        await this.setState({
            addInfo,
        })
        this.changeTimePeriod()
    }
    deleteData = (index) => {
        let { addInfo } = this.state
        addInfo.scannerScopeList.splice(index, 1)
        this.setState({
            addInfo,
        })
    }
    addData = () => {
        let { addInfo } = this.state
        addInfo.scannerScopeList.push({ip: undefined})
        this.setState({
            addInfo,
        })
    }
    postData = async () => {
        let { addInfo } = this.state
        let query = {
            ...addInfo,
        }
        console.log('query', query)
        query.frequency = addInfo.addType == '0' ? 0 : query.frequency
        if (addInfo.enableFlag) {
            let hasEmptyData = query.scannerScopeList.some(obj => {
                return Object.values(obj).some(val => !val);
            });
            if (hasEmptyData) {
                message.info('请填写扫描范围')
                return
            }
            if (query.frequency == 5) {
                query.days = addInfo.weekChecboxValue.join('|')
                if (!addInfo.weekChecboxValue.length) {
                    message.info('请选择每周的周几')
                    return
                }
            } else if (query.frequency == 6) {
                query.days = addInfo.monthChecboxValue.join('|')
                if (!addInfo.monthChecboxValue.length) {
                    message.info('请选择每月的几号')
                    return
                }
            }
            if (query.frequency !== 0) {
                if (!addInfo.startTime || !addInfo.endTime) {
                    message.info('请选择调度起止日期')
                    return
                }
                if (!addInfo.time) {
                    message.info('请选择调度时间')
                    return
                }
            }
            query.time = moment(addInfo.time).format('HH:mm:ss')
            this.setState({ btnLoading: true })
            let res = await saveDiscoverConfig(query)
            this.setState({ btnLoading: false })
            if (res.code == 200) {
                discoverConfigStatus({id: addInfo.id, enableFlag: addInfo.enableFlag}).then(resp => {
                    if (resp.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.props.refresh()
                    }
                })
            }
        } else {
            let res = await discoverConfigStatus({id: addInfo.id, enableFlag: addInfo.enableFlag})
            if (res.code == 200) {
                message.success('操作成功')
                this.cancel()
                this.props.refresh()
            }
        }
    }
    render() {
        const {
            modalVisible,
            addInfo,
            btnLoading,
            timeRange,
            weekPlainOptions,
            monthPlainOptions,
            timeStepList
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterTableDetail',
                    title: '数据源发现配置',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false
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
                        <Form className='EditMiniForm Grid1 timePeriodArea'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '数据源发现',
                                    content: (
                                        <Switch onChange={this.changeSelect.bind(this, 'enableFlag')} checked={addInfo.enableFlag == 1} />
                                    ),
                                },
                                {
                                    label: <span>扫描范围
                                        <Tooltip title={<div>
                                            <div>格式示例：</div>
                                            <div>192.168.1.1,2,3</div>
                                            <div>192.168.1.1,2,3</div>
                                            <div>192.168.2-3.1-255</div>
                                            <div>192.168.3-5,7.1</div>
                                        </div>}>
                                        <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginLeft: 4 }}/>
                                    </Tooltip>
                                    </span>,
                                    hide: !addInfo.enableFlag,
                                    content: (
                                        <div>
                                            {
                                                addInfo.scannerScopeList.map((item, index) => {
                                                    return (
                                                        <div>
                                                            <Input.Group compact style={{ width: '92%', marginRight: 18, marginBottom: 8 }}>
                                                                <Select style={{ width: '30%' }} placeholder='请选择' value={item.type} onChange={this.handleChange.bind(this, index, 'type')}>
                                                                    <Option value={1} key={1}>
                                                                        全网段
                                                                    </Option>
                                                                    <Option value={2} key={2}>
                                                                        子网段
                                                                    </Option>
                                                                    <Option value={3} key={3}>
                                                                        特定ip
                                                                    </Option>
                                                                </Select>
                                                                <Input
                                                                    placeholder='格式示例：192.168.1.1,2,3'
                                                                    style={{ width: '70%' }}
                                                                    value={item.ip}
                                                                    onChange={this.handleChange.bind(this, index, 'ip')}
                                                                />
                                                            </Input.Group>
                                                            {
                                                                addInfo.scannerScopeList.length > 1 && (<span onClick={this.deleteData.bind(this, index)} style={{ color: '#F54B45', cursor: 'pointer', verticalAlign: 'super' }} className='iconfont icon-lajitong'></span>)
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                            {/*<Button style={{ padding: 0 }} onClick={this.addData} icon={<PlusOutlined />} type='link'>*/}
                                                {/*添加范围*/}
                                            {/*</Button>*/}
                                        </div>
                                    ),
                                },
                                {
                                    label: '扫描方式',
                                    hide: !addInfo.enableFlag,
                                    content: (
                                        <Radio.Group value={addInfo.scannerWay} onChange={this.changeInput.bind(this, 'scannerWay')}>
                                            <Radio value={1}>快速
                                                <Tooltip title={<div>快速扫描模式，只扫描数据库的默认端口</div>}>
                                                    <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginLeft: 4 }}/>
                                                </Tooltip>
                                            </Radio>
                                            <Radio value={2}>全量
                                                <Tooltip title={<div>全量模式，扫描每台主机的所有端口，比较耗时</div>}>
                                                    <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginLeft: 4 }}/>
                                                </Tooltip>
                                            </Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '执行周期',
                                    hide: !addInfo.enableFlag,
                                    content: (
                                        <Radio.Group value={addInfo.addType} onChange={this.changeInput.bind(this, 'addType')}>
                                            <Radio value={0}>单次任务</Radio>
                                            <Radio value={1}>周期任务</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '调度起止日期',
                                    hide: addInfo.addType == 0 || !addInfo.enableFlag,
                                    content: <RangePicker style={{ width: '100%' }} value={timeRange} allowClear={false} separator='-' onChange={this.onChangePicker} />,
                                },
                                {
                                    label: '调度时间',
                                    hide: addInfo.addType == 0 || !addInfo.enableFlag,
                                    content: (
                                        <div>
                                            <Radio.Group value={addInfo.frequency} onChange={this.changeFrequency}>
                                                <Radio value={4}>每天</Radio>
                                                <Radio value={5}>每周</Radio>
                                                <Radio value={6}>每月</Radio>
                                            </Radio.Group>
                                            <div className='rangeArea'>
                                                <Row gutter={8}>
                                                    {addInfo.frequency == 4 ? (
                                                        <Col span={12}>
                                                            <FormItem required label='每天' {...tailFormItemLayout}>
                                                                <TimePicker
                                                                    style={{ width: '100%' }}
                                                                    allowClear={false}
                                                                    format='HH:mm:ss'
                                                                    locale={locale}
                                                                    placeholder='请选择时间'
                                                                    defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                    value={addInfo.time}
                                                                    mode={'time'}
                                                                    showTime={true}
                                                                    onChange={this.weekTimeChange.bind(this, 'time')}
                                                                />
                                                            </FormItem>
                                                        </Col>
                                                    ) : null}
                                                    {addInfo.frequency == 5 ? (
                                                        <Col span={24}>
                                                            <FormItem required label='每周' {...tailFormItemLayout}>
                                                                <div className='editautoDay'>
                                                                    <div className='editautoDayCheck'>
                                                                        <Checkbox.Group value={addInfo.weekChecboxValue} onChange={this.changeCheckBox.bind(this, 'weekChecboxValue')}>
                                                                            {weekPlainOptions.map((item) => {
                                                                                return (
                                                                                    <Checkbox value={item.value}>
                                                                                        {item.checked ? <SvgIcon name='icon_tag_top' /> : null}
                                                                                        {item.label}
                                                                                    </Checkbox>
                                                                                )
                                                                            })}
                                                                        </Checkbox.Group>
                                                                    </div>
                                                                    <span style={{ color: '#606366' }}>的</span>
                                                                    <TimePicker
                                                                        allowClear={false}
                                                                        format='HH:mm:ss'
                                                                        locale={locale}
                                                                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                        placeholder='请选择'
                                                                        value={addInfo.time}
                                                                        mode={'time'}
                                                                        showTime={true}
                                                                        onChange={this.weekTimeChange.bind(this, 'time')}
                                                                    />
                                                                </div>
                                                            </FormItem>
                                                        </Col>
                                                    ) : null}
                                                    {addInfo.frequency == 6 ? (
                                                        <Col span={24}>
                                                            <FormItem required label='每月' {...tailFormItemLayout}>
                                                                <div className='editautoDay editautoMonth'>
                                                                    <div className='editautoDayCheck'>
                                                                        <Checkbox.Group value={addInfo.monthChecboxValue} onChange={this.changeCheckBox.bind(this, 'monthChecboxValue')}>
                                                                            {monthPlainOptions.map((item) => {
                                                                                return (
                                                                                    <Checkbox value={item.value}>
                                                                                        {item.checked ? <SvgIcon name='icon_tag_top' /> : null}
                                                                                        {item.value}
                                                                                    </Checkbox>
                                                                                )
                                                                            })}
                                                                        </Checkbox.Group>
                                                                    </div>
                                                                    <span style={{ color: '#606366' }}>的</span>
                                                                    <TimePicker
                                                                        allowClear={false}
                                                                        format='HH:mm:ss'
                                                                        locale={locale}
                                                                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                                                                        placeholder='请选择时间'
                                                                        value={addInfo.time}
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
                                    hide: addInfo.addType == 0 || !addInfo.enableFlag,
                                    content: (
                                        <div>
                                            <Radio.Group value={addInfo.timePeriod.type} onChange={this.changeTimePeriodType}>
                                                <Radio value={1}>不设置</Radio>
                                                <Radio value={2}>单时间窗口</Radio>
                                                <Radio value={3}>多时间窗口</Radio>
                                            </Radio.Group>
                                            {addInfo.timePeriod.type == 2 || addInfo.timePeriod.type == 3 ? (
                                                <div className='rangeArea'>
                                                    {addInfo.timePeriod.type == 2 ? (
                                                        <FormItem label='单时间窗口' {...tailFormItemLayout}>
                                                            <span className='timeTitle'>周一～周日窗口时长：</span>
                                                            <Select
                                                                style={{ width: '120px' }}
                                                                value={addInfo.timePeriod.allSet.executeMinute}
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
                                                                    窗口结束时间：<span>{addInfo.timePeriod.allSet.endTime}</span>
                                                                </span>
                                                        </FormItem>
                                                    ) : null}
                                                    {addInfo.timePeriod.type == 3 ? (
                                                        <FormItem label='多时间窗口' {...tailFormItemLayout}>
                                                            <div>
                                                                <span className='timeTitle'>周一～周五窗口时长：</span>
                                                                <Select
                                                                    style={{ width: '120px' }}
                                                                    value={addInfo.timePeriod.working.executeMinute}
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
                                                                        窗口结束时间：<span>{addInfo.timePeriod.working.endTime}</span>
                                                                    </span>
                                                            </div>
                                                            <div style={{ marginTop: 16 }}>
                                                                <span className='timeTitle'>周六～周日窗口时长：</span>
                                                                <Select
                                                                    style={{ width: '120px' }}
                                                                    value={addInfo.timePeriod.weekend.executeMinute}
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
                                                                        窗口结束时间：<span>{addInfo.timePeriod.weekend.endTime}</span>
                                                                    </span>
                                                            </div>
                                                        </FormItem>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                    ),
                                },
                                ]
                            )}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}