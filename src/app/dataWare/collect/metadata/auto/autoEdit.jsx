import EmptyIcon from '@/component/EmptyIcon'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Checkbox, Col, DatePicker, Divider, Form, message, Radio, Row, Select, TimePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { datasourceSupport, getSourceTaskList, saveDataCollection } from 'app_api/metadataApi'
import CONSTANTS from 'app_constants'
import { observer } from 'mobx-react'
import moment from 'moment'
// import 'moment/locale/zh-cn'
import React, { Component } from 'react'
import _ from 'underscore'
// import '../style.less'
import './index.less'
import store from './store'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        xs: {
            span: 14,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 6,
        },
        sm: {
            span: 6,
        },
    },
}

const formItemLayouttime = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 20,
        },
    },
}

const weekPlainOptions = [
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

const monthPlainOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
]

const taskType = [
    {
        label: '库表结构',
        value: '1',
    },
    {
        label: '主外键+关联关系',
        value: '2',
    },
    {
        label: '存储过程',
        value: '3',
    },
    {
        label: '索引',
        value: '4',
    },
    {
        label: 'DDL',
        value: '5',
    },
    {
        label: '表存储空间',
        value: '6',
    },
    {
        label: '统计量',
        value: '7',
    },
]

@observer
export default class EditAutoCollection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            datasourceId: undefined,
            onceTimeChecked: false,
            everyDayChecked: false,
            everyDayTimeValue: '',
            weekTimeValue: '',
            everyWeekChecked: false,
            everyMonthChecked: false,
            monthTimeValue: '',
            weekChecboxValue: [],
            monthChecboxValue: [],
            startDateValue: undefined,
            endDateValue: undefined,
            startOrEndDisabled: false, //开始、结束日期是否禁用
            taskList: [],
            selectIndex: 0,
            canSave: false,
            dataSourceType: '',
            timeStepList: [], // 窗口时长选择框
            network: '',
        }

        this.typeOpr = ''
    }

    async componentWillMount() {
        const state = this.pageParam
        await store.getDataSourceData(1)
        console.log('will mount', this)
        // // delete
        // const { sourceData } = store
        // this.changeDatasourceId({ key: 1377, label: '上海测试血缘库' })
        // // delete end
        this.getTimeStepList()
        if (state.pageType != 'add' || state.from != 'autoCollection') {
            this.setState({
                datasourceId: {
                    key: state.datasourceId,
                    label: state.datasourceName,
                },
            })
            this.typeOpr = state.pageType
            this.changeDatasourceId({
                key: state.datasourceId,
                label: state.datasourceName,
            })
        }
        if (this.props.location.state.from === 'dataSourceManage') {
            console.log(this.props.location.state.datasourceIdInfo, 'key')
            this.setState({
                datasourceId: {
                    key: state.datasourceIdInfo.key,
                    label: state.datasourceIdInfo.label,
                },
            })
            this.changeDatasourceId(state.datasourceIdInfo)
            this.typeOpr = 'edit'
        }
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount() {}

    getTimeStepList = () => {
        let array = []
        for (let i = 1; i < 49; i++) {
            array.push({ key: i / 2 + '小时', value: (i / 2) * 60 })
        }
        array.unshift({ key: '1分钟', value: 1 })
        this.setState({
            timeStepList: array,
        })
    }

    getSourceTaskListData = (params) => {
        const { dataSourceType } = this.state
        getSourceTaskList(params).then((res) => {
            if (res.code == 200) {
                res.data.taskList.map((item) => {
                    item.everyDayTimeValue = moment('00:00:00', 'HH:mm:ss')
                    item.weekTimeValue = moment('00:00:00', 'HH:mm:ss')
                    item.monthTimeValue = moment('00:00:00', 'HH:mm:ss')
                    item.weekChecboxValue = ''
                    item.monthChecboxValue = ''
                    item.startDateValue = ''
                    item.endDateValue = ''
                    item.startOrEndDisabled = ''
                    item.time = item.time ? moment(item.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                    // item.frequency = item.frequency == 0 ? 4 : item.frequency
                    item.addType = item.frequency !== 0 ? 1 : 0
                    if (item.timePeriod == undefined) {
                        item.timePeriod = {
                            type: 1,
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
                        }
                    }

                    item.disabled = false
                })
                // 判断是否禁止勾选
                if (params.key === undefined) return
                datasourceSupport({ datasourceId: params.key }).then((response) => {
                    if (response.code == 200) {
                        res.data.taskList.map((item, index) => {
                            _.map(response.data, (value, k) => {
                                if (item.taskSubType == k) {
                                    item.disabled = !value.enabled
                                    item.msg = value.msg || '当前数据源不支持该类型采集任务'
                                }
                            })
                        })
                        this.setState({
                            taskList: res.data.taskList,
                        })
                        const { taskList } = this.state
                        if (this.props.location.state.pageType == 'edit') {
                            taskList.map((item, index) => {
                                item.time = item.time ? moment(item.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                                if (item.frequency == 4) {
                                    item.everyDayTimeValue = item.time !== undefined && item.time ? moment(item.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                                } else if (item.frequency == 5) {
                                    item.weekChecboxValue = item.days.split('|')
                                    item.weekTimeValue = item.time !== undefined && item.time ? moment(item.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                                } else if (item.frequency == 6) {
                                    item.monthChecboxValue = item.days.split('|')
                                    item.monthTimeValue = item.time !== undefined && item.time ? moment(item.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                                }
                                item.startDateValue = item.startTime && item.startTime !== '' ? moment(item.startTime) : undefined
                                item.endDateValue = item.endTime && item.endTime !== '' ? moment(item.endTime) : undefined
                                item.startOrEndDisabled = item.frequency == 0 ? true : false

                                if (this.props.location.state.from == 'autoCollection') {
                                    if (item.taskSubType == this.props.location.state.taskSubType) {
                                        this.selectCheckbox(index)
                                    }
                                }
                            })
                            this.setState({
                                taskList,
                            })
                            if (this.props.location.state.from == 'dataSourceManage') {
                                for (let i = 0; i < taskList.length; i++) {
                                    if (taskList[i].status) {
                                        this.selectCheckbox(i)
                                        break
                                    }
                                }
                            }
                        }
                        this.getCanSave()
                    } else {
                        message.error(response.msg)
                    }
                })
            }
        })
    }
    onStartChange = (index, value) => {
        console.log(value)
        const { taskList } = this.state
        taskList[index].startDateValue = value
        this.setState({
            taskList,
        })
    }
    onEndChange = (index, value) => {
        console.log(value)
        const { taskList } = this.state
        taskList[index].endDateValue = value
        this.setState({
            taskList,
        })
    }
    onWeekCheckChange = (index, value) => {
        console.log(value)
        const { taskList } = this.state
        taskList[index].weekChecboxValue = value
        this.setState({
            taskList,
        })
    }
    onMonthCheckChange = (index, value) => {
        console.log(value)
        const { taskList } = this.state
        taskList[index].monthChecboxValue = value
        this.setState({
            taskList,
        })
    }

    everyDayTimeChange = (index, value) => {
        const { taskList } = this.state
        taskList[index].everyDayTimeValue = value
        this.setState({
            taskList,
        })
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }
    weekTimeChange = (index, value) => {
        const { taskList } = this.state
        taskList[index].weekTimeValue = value
        this.setState({
            taskList,
        })
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }
    monthTimeChange = (index, value) => {
        const { taskList } = this.state
        taskList[index].monthTimeValue = value
        this.setState({
            taskList,
        })
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }

    changeDatasourceId = (value) => {
        const { sourceData } = store
        const obj = { key: value.key, label: value.label }
        _.map(sourceData, (item, index) => {
            if (item.id == value.key) {
                this.setState({
                    dataSourceType: item.product,
                    network: item.network,
                })
            }
        })
        this.setState({ datasourceId: obj })
        this.getSourceTaskListData({ key: value.key })
    }

    getCanSave = () => {
        const { taskList, datasourceId } = this.state
        let canSave = false
        console.log(taskList, 'tasklist')
        taskList.map((item) => {
            if (item.status && datasourceId != undefined) {
                canSave = true
            }
        })
        this.setState({
            canSave,
        })
    }

    onSave = () => {
        const { taskList, datasourceId } = this.state
        let postTaskInfo = [...taskList]
        let everyDayTimeCheck = true
        let weekTimeCheck = true
        let weekDayCheck = true
        let monthDayCheck = true
        let monthTimeCheck = true
        let startTimeCheck = true
        let endTimeCheck = true
        let timeCompareCheck = true
        taskList.map((item, index) => {
            item.frequency = item.addType == '0' ? 0 : item.frequency
            if (item.frequency == 4 && item.status) {
                if (item.everyDayTimeValue === '' || !item.everyDayTimeValue) {
                    console.log('days')
                    everyDayTimeCheck = false
                } else {
                    console.log(item.everyDayTimeValue,'item.everyDayTimeValue+++')
                    postTaskInfo[index].time = moment(item.everyDayTimeValue).format('HH:mm:ss')
                }
            } else if (item.frequency == 5 && item.status) {
                if (item.weekChecboxValue.length < 1) {
                    console.log('weeksdays')
                    weekDayCheck = false
                } else {
                    postTaskInfo[index].days = item.weekChecboxValue.join('|')
                }
                if (item.weekTimeValue === '' || !item.weekTimeValue) {
                    console.log('weekstime')
                    weekTimeCheck = false
                } else {
                    postTaskInfo[index].time = moment(item.weekTimeValue, 'HH:mm:ss')
                }
            } else if (item.frequency == 6 && item.status) {
                if (item.monthChecboxValue.length < 1) {
                    console.log('monthsdays')
                    monthDayCheck = false
                } else {
                    postTaskInfo[index].days = item.monthChecboxValue.join('|')
                }
                if (item.monthTimeValue === '' || !item.monthTimeValue) {
                    console.log('weekstime')
                    monthTimeCheck = false
                } else {
                    postTaskInfo[index].time = moment(item.monthTimeValue, 'HH:mm:ss')
                }
            }
            if (item.frequency == 0) {
                postTaskInfo[index].time = '00:00:00'
                console.log(postTaskInfo[index].time,'postTaskInfo[index].time')
            }
            postTaskInfo[index].startTime = item.startDateValue ? item.startDateValue.format('YYYY-MM-DD') : undefined
            postTaskInfo[index].endTime = item.endDateValue ? item.endDateValue.format('YYYY-MM-DD') : undefined
            console.log(postTaskInfo[index].startTime, postTaskInfo[index].endTime)
            if (!postTaskInfo[index].startTime && item.status) {
                startTimeCheck = false
            }
            if (!postTaskInfo[index].endTime && item.status) {
                endTimeCheck = false
            }
            if (startTimeCheck && endTimeCheck) {
                if (postTaskInfo[index].endTime < postTaskInfo[index].startTime && item.status) {
                    timeCompareCheck = false
                }
            }
        })
        if (!everyDayTimeCheck) {
            message.warning('请选择每天的具体时间')
            return
        }
        if (!weekDayCheck) {
            message.warning('请选择每周的周几')
            return
        }
        if (!weekTimeCheck) {
            message.warning('请选择每周的周几的具体时间')
            return
        }
        if (!monthDayCheck) {
            message.warning('请选择每月的几号')
            return
        }
        if (!monthTimeCheck) {
            message.warning('请选择每月几号具体时间')
            return
        }
        // if (!startTimeCheck) {
        //     message.warning("请选择起始日期")
        //     return
        // }
        // if (!endTimeCheck) {
        //     message.warning("请选择结束日期")
        //     return
        // }
        if (!timeCompareCheck) {
            message.warning('起始日期应早于结束日期')
            return
        }
        let req = {}
        req.datasourceData = { id: datasourceId.key, name: datasourceId.label }
        req.taskList = postTaskInfo
        req.network = this.state.network
        saveDataCollection(req).then((res) => {
            if (res.code == '200') {
                message.success(res.msg)
                this.back()
            }
        })
    }

    back() {
        if (this.props.location.state.from == 'dataSourceManage') {
            this.props.addTab('数据源管理', { reload: true })
        } else {
            this.props.addTab('autoTask', { reload: true })
        }
    }

    onChangeCheckbox = (index, e) => {
        const { taskList } = this.state
        taskList[index].status = e.target.checked ? 1 : 0
        this.setState({
            taskList,
        })
        this.getCanSave()
        console.log(taskList)
    }
    selectCheckbox = (index) => {
        const { taskList } = this.state
        if (taskList[index].disabled) {
            return
        }
        this.setState({
            selectIndex: index,
        })
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }

    onRadioChange = (index, e) => {
        console.log(e)
        const { taskList } = this.state
        taskList[index].frequency = e.target.value
        taskList[index].startOrEndDisabled = e.target.value == 0 ? true : false
        this.setState({
            taskList,
        })
        console.log(taskList)
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }
    onTimeRadioChange = (index, e) => {
        console.log(e)
        const { taskList } = this.state
        taskList[index].timePeriod.type = e.target.value
        this.setState({
            taskList,
        })
        if (taskList[index].timePeriod.type == 2) {
            this.changeExecuteMinute(index, 'allSet', taskList[index].timePeriod.allSet.executeMinute)
        }
        if (taskList[index].timePeriod.type == 3) {
            this.changeExecuteMinute(index, 'working', taskList[index].timePeriod.working.executeMinute)
            this.changeExecuteMinute(index, 'weekend', taskList[index].timePeriod.weekend.executeMinute)
        }
    }
    changeExecuteMinute = (index, name, e) => {
        console.log(index, name, e)
        const { taskList } = this.state
        taskList[index].timePeriod[name].executeMinute = e
        // 计算窗口结束时间
        if (taskList[index].frequency == 4) {
            taskList[index].timePeriod[name].endTime = moment(taskList[index].everyDayTimeValue.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (taskList[index].frequency == 5) {
            taskList[index].timePeriod[name].endTime = moment(taskList[index].weekTimeValue.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (taskList[index].frequency == 6) {
            taskList[index].timePeriod[name].endTime = moment(taskList[index].monthTimeValue.format('YYYY-MM-DD HH:mm:ss')).add(e, 'minutes').locale('zh-cn').calendar()
        }
        if (taskList[index].timePeriod[name].endTime.substring(0, 2) == '今天') {
            console.log(taskList[index].timePeriod[name].endTime.substring(0, 2))
            taskList[index].timePeriod[name].endTime = taskList[index].timePeriod[name].endTime.replace(/今天/, '当日')
        }
        if (taskList[index].timePeriod[name].endTime.substring(0, 2) == '明天') {
            taskList[index].timePeriod[name].endTime = taskList[index].timePeriod[name].endTime.replace(/明天/, '次日')
        }
        this.setState({
            taskList,
        })
        console.log(taskList)
    }

    renderTimes(item, index) {
        const { selectIndex, taskList } = this.state
        const { frequency } = taskList[index]
        let result = null
        switch (frequency) {
            // 天
            case 4:
                result = (
                    <TimePicker
                        allowClear={false}
                        format='HH:mm:ss'
                        locale={locale}
                        placeholder='请选择时间'
                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                        value={item.everyDayTimeValue}
                        mode={'time'}
                        showTime={true}
                        onChange={this.everyDayTimeChange.bind(this, index)}
                    />
                )
                break
            // 周
            case 5:
                result = (
                    <div className='editautoDay'>
                        <div className='editautoDayCheck'>
                            <CheckboxGroup value={item.weekChecboxValue} options={weekPlainOptions} onChange={this.onWeekCheckChange.bind(this, index)} />
                        </div>
                        <span>的</span>
                        <TimePicker
                            allowClear={false}
                            format='HH:mm:ss'
                            locale={locale}
                            placeholder='请选择时间'
                            defaultValue={moment('00:00:00', 'HH:mm:ss')}
                            value={item.weekTimeValue}
                            mode={'time'}
                            showTime={true}
                            onChange={this.weekTimeChange.bind(this, index)}
                        />
                    </div>
                )
                break
            // 月
            case 6:
                result = (
                    <div className='editautoDay editautoMonth'>
                        <div className='editautoDayCheck'>
                            <CheckboxGroup value={item.monthChecboxValue} options={monthPlainOptions} onChange={this.onMonthCheckChange.bind(this, index)} />
                        </div>
                        <span>的</span>
                        <TimePicker
                            allowClear={false}
                            format='HH:mm:ss'
                            locale={locale}
                            defaultValue={moment('00:00:00', 'HH:mm:ss')}
                            placeholder='请选择时间'
                            value={item.monthTimeValue}
                            mode={'time'}
                            showTime={true}
                            onChange={this.monthTimeChange.bind(this, index)}
                        />
                    </div>
                )
                break
            default:
                break
        }

        return (
            <div className='FormPart' style={{ borderRadius: 8 }}>
                {result}
            </div>
        )
    }
    changeAddtype = (index, e) => {
        const { taskList } = this.state
        taskList[index].addType = e.target.value
        taskList[index].frequency = e.target.value ? 4 : 0
        this.setState({
            taskList,
        })
    }

    render() {
        let { sourceData } = store
        const {
            datasourceId,
            onceTimeChecked,
            everyDayChecked,
            everyDayTimeValue,
            everyWeekChecked,
            weekTimeValue,
            everyMonthChecked,
            monthTimeValue,
            weekChecboxValue,
            monthChecboxValue,
            startDateValue,
            endDateValue,
            startOrEndDisabled,
            taskList,
            selectIndex,
            canSave,
            timeStepList,
        } = this.state

        let sourceList = []
        sourceData.forEach((item, index) => {
            if (this.props.location.state.from == 'autoCollection' && this.props.location.state.pageType == 'add' && item.taskTypeCount) {
            } else {
                sourceList.push(item)
            }
        })

        const { pageType } = this.pageParam
        const isAdd = pageType === 'add'

        return (
            <TableLayout
                className='editAutoCollection'
                title={isAdd ? '新建采集任务' : '编辑采集任务'}
                showFooterControl
                renderTable={() => {
                    return (
                        <React.Fragment>
                            <Module title='数据源选择'>
                                <div className='EditMiniForm'>
                                    <FormItem label='数据源'>
                                        <Select
                                            style={{ width: 400 }}
                                            disabled={this.typeOpr == 'edit' || this.props.location.state.from == 'dataSourceManage' ? true : false}
                                            showSearch
                                            optionFilterProp='children'
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            labelInValue={true}
                                            onChange={this.changeDatasourceId}
                                            value={datasourceId}
                                            placeholder='请输入数据源'
                                        >
                                            {sourceList.map((d) => (
                                                <Option key={d.id} value={d.id}>
                                                    {d.dsName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </div>
                            </Module>
                            <Divider />
                            {taskList.length ? (
                                <Module title='选择需要开启的任务'>
                                    <div
                                        style={{
                                            display: taskList.length ? 'block' : 'none',
                                        }}
                                        className='formtableContainer'
                                    >
                                        <div className='checkboxContainer'>
                                            {taskList.map((item, index) => {
                                                return (
                                                    <div className='checkboxMiddle'>
                                                        <div onClick={this.selectCheckbox.bind(this, index)} className={selectIndex == index ? 'checked checkboxDiv' : 'checkboxDiv'}>
                                                            <Checkbox
                                                                disabled={item.disabled}
                                                                checked={item.status ? true : false}
                                                                onChange={this.onChangeCheckbox.bind(this, index)}
                                                                value={item.taskSubType}
                                                            ></Checkbox>
                                                            <span
                                                                style={{
                                                                    fontSize: '14px',
                                                                    marginLeft: '8px',
                                                                    color: item.disabled ? '#C4C8CC' : '#333',
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                            <div className='setInfo'>
                                                                <span
                                                                    style={{
                                                                        display: item.frequency == 4 && item.status ? 'inline-block' : 'none',
                                                                    }}
                                                                >
                                                                    每天调度
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: item.frequency == 5 && item.status ? 'inline-block' : 'none',
                                                                    }}
                                                                >
                                                                    每周调度
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: item.frequency == 6 && item.status ? 'inline-block' : 'none',
                                                                    }}
                                                                >
                                                                    每月调度
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: selectIndex == index && !item.status ? 'inline-block' : 'none',
                                                                        color: '#F27900',
                                                                    }}
                                                                >
                                                                    请勾选开启任务
                                                                </span>
                                                            </div>
                                                            {item.disabled ? <div className='disabledTip'>{item.msg}</div> : ''}
                                                        </div>

                                                        <Form
                                                            className='checkboxRight'
                                                            layout='horizontal'
                                                            style={{
                                                                display: selectIndex == index ? 'inline-block' : 'none',
                                                            }}
                                                        >
                                                            <h2>设置调度信息</h2>
                                                            <FormItem label='执行周期'>
                                                                <Radio.Group value={item.addType} onChange={this.changeAddtype.bind(this, index)}>
                                                                    <Radio value={1}>周期任务</Radio>
                                                                    <Radio value={0}>单次任务</Radio>
                                                                </Radio.Group>
                                                            </FormItem>
                                                            {
                                                                item.addType == 1 ?
                                                                    <div>
                                                                        <FormItem label='调度起止日期'>
                                                                            <DatePicker value={item.startDateValue} onChange={this.onStartChange.bind(this, index)} locale={locale} placeholder='开始日期' />
                                                                            <span style={{ margin: '0 8px' }}>~</span>
                                                                            <DatePicker value={item.endDateValue} onChange={this.onEndChange.bind(this, index)} locale={locale} placeholder='结束日期' />
                                                                        </FormItem>
                                                                        <FormItem label='调度时间'>
                                                                            <Radio.Group onChange={this.onRadioChange.bind(this, index)} value={item.frequency}>
                                                                                <Radio value={4}>每天</Radio>
                                                                                <Radio value={5}>每周</Radio>
                                                                                <Radio value={6}>每月</Radio>
                                                                            </Radio.Group>
                                                                        </FormItem>
                                                                        {this.renderTimes(item, index)}
                                                                        <FormItem label='设置窗口时长'>
                                                                            <Row>
                                                                                <Col span={24}>
                                                                                    <Radio.Group onChange={this.onTimeRadioChange.bind(this, index)} value={item.timePeriod.type}>
                                                                                        <Radio value={1}>不设置</Radio>
                                                                                        <Radio value={2}>单时间窗口</Radio>
                                                                                        <Radio value={3}>多时间窗口</Radio>
                                                                                    </Radio.Group>
                                                                                </Col>
                                                                            </Row>
                                                                            <div
                                                                                className='FormPart'
                                                                                style={{
                                                                                    display: item.timePeriod.type == 1 ? 'none' : 'block',
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className='HControlGroup'
                                                                                    style={{
                                                                                        display: item.timePeriod.type == 2 ? 'block' : 'none',
                                                                                    }}
                                                                                >
                                                                                    <span className='timeTitle'>周一～周日窗口时长:</span>
                                                                                    <Select
                                                                                        style={{
                                                                                            width: '90px',
                                                                                        }}
                                                                                        value={item.timePeriod.allSet.executeMinute}
                                                                                        onChange={this.changeExecuteMinute.bind(this, index, 'allSet')}
                                                                                        placeholder='请选择'
                                                                                    >
                                                                                        {timeStepList.map((item, index) => {
                                                                                            return (
                                                                                                <Option key={index} value={item.value}>
                                                                                                    {item.key}
                                                                                                </Option>
                                                                                            )
                                                                                        })}
                                                                                    </Select>
                                                                                    <span className='timeEndTip'>
                                                                            窗口结束时间：
                                                                                        {item.timePeriod.allSet.endTime}
                                                                        </span>
                                                                                </div>
                                                                                <div
                                                                                    className='HControlGroup'
                                                                                    style={{
                                                                                        display: item.timePeriod.type == 3 ? 'block' : 'none',
                                                                                    }}
                                                                                >
                                                                                    <span className='timeTitle'>周一～周五窗口时长:</span>
                                                                                    <Select
                                                                                        style={{
                                                                                            width: '90px',
                                                                                        }}
                                                                                        value={item.timePeriod.working.executeMinute}
                                                                                        onChange={this.changeExecuteMinute.bind(this, index, 'working')}
                                                                                        placeholder='请选择'
                                                                                    >
                                                                                        {timeStepList.map((item, index) => {
                                                                                            return (
                                                                                                <Option key={index} value={item.value}>
                                                                                                    {item.key}
                                                                                                </Option>
                                                                                            )
                                                                                        })}
                                                                                    </Select>
                                                                                    <span className='timeEndTip'>
                                                                            窗口结束时间：
                                                                                        {item.timePeriod.working.endTime}
                                                                        </span>
                                                                                </div>
                                                                                <div
                                                                                    className='HControlGroup'
                                                                                    style={{
                                                                                        display: item.timePeriod.type == 3 ? 'block' : 'none',
                                                                                    }}
                                                                                >
                                                                                    <span className='timeTitle'>周六周日窗口时长：</span>
                                                                                    <Select
                                                                                        style={{
                                                                                            width: '90px',
                                                                                        }}
                                                                                        value={item.timePeriod.weekend.executeMinute}
                                                                                        onChange={this.changeExecuteMinute.bind(this, index, 'weekend')}
                                                                                        placeholder='请选择'
                                                                                    >
                                                                                        {timeStepList.map((item, index) => {
                                                                                            return (
                                                                                                <Option key={index} value={item.value}>
                                                                                                    {item.key}
                                                                                                </Option>
                                                                                            )
                                                                                        })}
                                                                                    </Select>
                                                                                    <span className='timeEndTip'>
                                                                            窗口结束时间：
                                                                                        {item.timePeriod.weekend.endTime}
                                                                        </span>
                                                                                </div>
                                                                            </div>
                                                                        </FormItem>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </Form>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Module>
                            ) : (
                                <EmptyIcon description='暂无任务，请先在上方选择数据源' />
                            )}
                        </React.Fragment>
                    )
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={canSave ? false : true} type='primary' onClick={_.debounce(this.onSave.bind(this), CONSTANTS.TIME_OUT)}>
                                保存
                            </Button>
                            <Button onClick={() => this.back()}>取消</Button>
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
