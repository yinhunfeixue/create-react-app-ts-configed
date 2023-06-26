import { Row, Col, Menu, Modal, Button, Input, Checkbox, Form, Select, Radio, TimePicker } from 'antd'
// import './index.less'
// import { addBoardView } from 'app_api/dashboardApi'
import _ from 'underscore'
// import DataLoading from '../../loading'
const { TextArea } = Input
import { Range } from 'immutable'

import moment from 'moment'
const format = 'HH:mm'

const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
}

class UpdateView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // sourceData: this.props.sourceData,
            visible: false,
            validateMessage: {},
            boardCreateInfo: {},
            validateSubmitMessage: '',
            id: 0,
            visible: false,
            isUpdate: true,
            reportData: {},
            systemDefaultSchedule: true,
            scheduleDay: '',
            scheduleTime: '00:00',
            scheduleTimeout: 600
        }

        this.validateField = {
            'name': '标题',
            'description': '描述'
        }

        this.updateTypes = [
            {
                label: '每天',
                value: 'day'
            },
            {
                label: '每周',
                value: 'week'
            },
            {
                label: '每月',
                value: 'month'
            }
        ]

        this.weekList = [
            {
                label: '周一',
                value: 1,
            },
            {
                label: '周二',
                value: 2,
            },
            {
                label: '周三',
                value: 3,
            },
            {
                label: '周四',
                value: 4,
            },
            {
                label: '周五',
                value: 5,
            },
            {
                label: '周六',
                value: 6,
            },
            {
                label: '周日',
                value: 7,
            },
        ]

        this.monthList = Range(1, 32)
    }

    handleOk = async (e) => {
        console.log(e)
        e.stopPropagation()
        let reportData = this.state.reportData
        let saveInfo = {
            id: reportData.id,
            systemDefaultSchedule: this.state.systemDefaultSchedule,
            scheduleDay: this.state.scheduleDay,
            scheduleTime: this.state.scheduleTime,
            scheduleTimeout: this.state.scheduleTimeout
        }

        reportData = {
            ...reportData,
            ...saveInfo
        }
        this.props.handleEditUpdateSetting && this.props.handleEditUpdateSetting(saveInfo)

        this.setState({
            reportData,
            visible: false,
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        // if (!_.isEmpty(prevState.chartType)) {
        //     this.chartCom && this.chartCom.forceFit()
        // }
    }

    handleCancel = (e) => {
        console.log(e)
        let reportData = this.state.reportData
        this.setState({
            visible: false,
            systemDefaultSchedule: reportData.systemDefaultSchedule,
            scheduleTime: reportData.time,
            scheduleDay: reportData.scheduleDay,
            scheduleTimeout: reportData.scheduleTimeout
        })
    }

    visibleModal = (status, data) => {
        if (status) {
            this.setState({
                id: data.id,
                visible: status,
                reportData: data,
                systemDefaultSchedule: data.systemDefaultSchedule,
                isUpdate: !data.systemDefaultSchedule,
                scheduleTime: data.scheduleTime,
                scheduleDay: data.scheduleDay,
                scheduleTimeout: data.scheduleTimeout || 600
            })
        } else {
            this.setState({
                visible: false,
                validateMessage: {},
                boardCreateInfo: {},
                validateSubmitMessage: '',
                name: '',
                description: '',
                scheduleTimeout: 600
            })
        }
    }

    updateSetting = () => {
        this.setState({
            visible: true,
        })
    };

    handleTypeDate = (value) => {
        this.setState({
            scheduleDay: value
        })
    }

    onTimeChange = (t, timeString) => {
        this.setState({
            scheduleTime: timeString
        })
    }

    defaultSet = (e) => {
        if (e.target.checked) {
            this.setState({
                isUpdate: false,
                systemDefaultSchedule: true,
                scheduleTime: this.state.reportData.defaultTime || '00:00',
                scheduleDay: this.state.reportData.defaultDay
            })
        } else {
            this.setState({
                isUpdate: true,
                systemDefaultSchedule: false,
                scheduleTime: this.state.reportData.scheduleTime || '00:00',
                scheduleDay: this.state.reportData.scheduleDay
            })
        }
    }

    handleChangeInput = (e) => {
        const { value } = e.target
        this.setState({
            scheduleTimeout: value
        })
    }

    render() {
        // console.log(visible, name, reportData, '-----title--修改视图标题---')
        const {
            visible,
            params,
            validateMessage,
            validateSubmitMessage,
            name,
            description,
            materialized,
            isUpdate,
            scheduleInfo,
            reportData,
            scheduleDay,
            scheduleTime,
            scheduleTimeout
        } = this.state
        // console.log(visible, name, reportData, '-----title--修改视图标题---')
        return (
            <Modal
                title='报表更新规则设置'
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                height='300px'
            >
                <div>
                    <Row gutter='16' >
                        <Col span='4' />
                        <Col span='20' >
                            <Checkbox checked={this.state.systemDefaultSchedule} onChange={this.defaultSet}>使用系统默认设置（{reportData.cycle === 1 ? `每月 ${reportData.defaultDay}日 ` : '每日 '}{reportData.defaultTime}）</Checkbox>
                        </Col>
                    </Row>
                </div>
                <div style={{ paddingTop: '24px' }}>
                    <Row gutter='16'>
                        <Col span='4' />
                        <Col span='20' className='updateCfgCls' >
                            <span>
                                {reportData.cycle === 1 ? '每月' : '每日'}
                            </span>
                            {
                                reportData.cycle === 1 ? <span style={{ paddingLeft: '8px' }}>
                                    <Select disabled={!isUpdate} value={scheduleDay || 1} onChange={this.handleTypeDate} >
                                        {this.monthList.map((v, k) => (
                                            <Option key={v}>{v}日</Option>
                                        ))}
                                    </Select>
                                                         </span> : null
                            }
                            <span style={{ paddingLeft: '8px' }}><TimePicker disabled={!isUpdate} onChange={this.onTimeChange} value={moment(scheduleTime || '00:00', format)} format={format} /></span>
                        </Col>
                    </Row>
                </div>
                <div style={{ paddingTop: '24px' }}>
                    <Row gutter='16'>
                        <Col span='4' />
                        <Col span='20' >
                            <span>
                                超时
                            </span>
                            <span style={{ paddingLeft: '8px' }}><Input value={scheduleTimeout} style={{ width: '127px' }} onChange={this.handleChangeInput} /> 秒 <span style={{ fontSize: '12px' }}>(更新超时设置，默认600秒)</span></span>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default UpdateView
