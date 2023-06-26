import React, { Component } from 'react'
import './index.less'
import ModifyFill from 'app_images/ModifyFill.svg'
import { Dropdown, Menu, DatePicker, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';


import { NotificationWrap } from 'app_common'
import EditView from './editView'
import UpdateView from './updateRule'
import Widget from './widget'

import moment from 'moment'
import Error from 'app_images/error.svg'
import { getReportDetail, createTable, deleteTable } from 'app_api/dashboardApi'
const { RangePicker, MonthPicker } = DatePicker

const style = {
    width: '100%',
    height: '100%'
}

const dateFormat = 'YYYY-MM-DD'
const monthFormat = 'YYYY-MM'

// @observer
export default class ReportDetial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ifEmpty: false,
            name: '',
            description: '',
            reportData: {},
            TimeFilterComponent: null,
            reportsViews: [],
            timeFormat: 'YYYY-MM-DD',
            startTime: null,
            endTime: null,
            initAction: true
        }

        this.menuList = (
            <Menu>
                {/* <Menu.Item>
                    <span >
                        修改报表标题描述
                    </span>
                </Menu.Item> */}
                <Menu.Item>
                    <span onClick={() => { this.setUpdateRule() }}>
                        修改报表更新规则
                    </span>
                </Menu.Item>
                <Menu.Item>
                    <span onClick={() => { this.redirectEdit() }}>
                        编辑报表
                    </span>
                </Menu.Item>
                <Menu.Item>
                    <span onClick={() => { this.reportDashboard() }}>
                        报表看板
                    </span>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm
                        title='确定要删除?'
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => { this.deleteReport() }}
                        okText='确定'
                        cancelText='取消'
                    >
                        <span >
                        删除
                        </span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )
    }

    componentDidMount = async () => {
        this.handleRenderViewContent(this.props.param)
    }

    redirectEdit = () => {
        console.log('编辑报表')
        let params = {
            id: this.state.id,
            ifCreate: false
        }
        // this.props.removeTab('createTable')
        this.props.addTab('createTable', params)
        // this.props.addTab('',)
    }

    reportDashboard = () => {
        console.log('报表看板')
        let params = {
            // id: 149
            id: this.state.pinboardId,
        }
        this.props.addTab('reportDashboard', params)
    }

    deleteReport = async () => {
        console.log('删除报表')
        let params = {
            id: this.state.id,
        }
        let res = await deleteTable(params)
        if (res.code === 200) {
            NotificationWrap.success('删除成功！')

            // this.props.removeTab('reportDetail')
            // 回到看板列表
            this.props.reloadTab('dashboardList')
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    handleRenderViewContent = async (param) => {
        let res = await getReportDetail({ ...param })
        if (res.code === 200) {
            let data = res.data
            console.log(data, '----------handleRenderViewContenthandleRenderViewContent----------')
            this.setState({
                reportData: data,
                id: data.id,
                pinboardId: data.pinboardId,
                name: data.name,
                description: data.description,
                reportsViews: data.reportsViews
            }, () => {
                this.getReportTime(data)
            })
        }
    }

    editCell = (data) => {

    }

    getReportTime = (data) => {
        let type = data.type
        let cycle = data.cycle
        console.log(type, cycle, '---------fssfsfdsfdsf----------')
        let TimeFilterComponent = null
        let startTime = data.startTime
        let endTime = data.endTime
        let timeFormat = this.state.timeFormat
        // if (type === 1) {
        //     // 聚合报表
        //     if (cycle === 1) {
        //         // 月报表
        //         TimeFilterComponent = (
        //             <MonthPicker key='t11' defaultValue={moment().subtract(1, 'months')} format={monthFormat} onChange={this.onDataChange} />
        //         )
        //     } else {
        //         // 日报表
        //         TimeFilterComponent = (
        //             <DatePicker key='t10' defaultValue={moment().subtract(1, 'days')} format={dateFormat} onChange={this.onDataChange} />
        //         )
        //     }
        // } else {
        //     // 明细报表

        //     if (cycle === 1) {
        //         // 月报表
        //         TimeFilterComponent = (
        //             <RangePicker key='t01'
        //                 defaultValue={[moment().subtract(6, 'months'), moment().subtract(1, 'months')]}
        //                 format={monthFormat}
        //                 mode={['month', 'month']}
        //                 onChange={this.onDataChange}
        //             />
        //         )
        //     } else {
        //         // 日报表
        //         TimeFilterComponent = (
        //             <RangePicker key='t00'
        //                 defaultValue={[moment().subtract(7, 'days'), moment().subtract(1, 'days')]}
        //                 format={dateFormat}
        //                 onChange={this.onDataChange}
        //                 // ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
        //             />
        //         )
        //     }
        // }

        if (type === 1) {
            // 聚合报表
            if (cycle === 1) {
                timeFormat = monthFormat
                // 月报表
                // TimeFilterComponent = (
                //     <MonthPicker key='t11' allowClear={false} defaultValue={moment(startTime, monthFormat)} format={monthFormat} onChange={this.onDataChange} />
                // )
            } else {
                timeFormat = dateFormat
                // 日报表
                // TimeFilterComponent = (
                //     <DatePicker key='t10' allowClear={false} defaultValue={moment(startTime, dateFormat)} format={dateFormat} onChange={this.onDataChange} />
                // )
            }
        } else {
            // 明细报表

            if (cycle === 1) {
                timeFormat = monthFormat
                // 月报表
                // TimeFilterComponent = (
                //     <RangePicker key='t01' allowClear={false}
                //         value={[moment(startTime, monthFormat), moment(endTime, monthFormat)]}
                //         format={monthFormat}
                //         mode={['month', 'month']}
                //         onChange={this.onDataChange}
                //     />
                // )
            } else {
                timeFormat = dateFormat
                // 日报表
                // TimeFilterComponent = (
                //     <RangePicker key='t00' allowClear={false}
                //         defaultValue={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                //         format={dateFormat}
                //         onChange={this.onDataChange}
                //         // ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
                //     />
                // )
            }
        }

        this.setState({
            TimeFilterComponent,
            timeFormat,
            startTime,
            endTime
        })
    }

    handleViewRender = (data) => {
        this.props.addTab('dataSearchIndex', { data, dataSourceType: 'dashboardView' })
    }

    setIsEmpty = (bl) => {
        this.setState({
            isEmpty: bl
        })
    }

    onDataChange = (dates) => {
        console.log(dates, '-----------dates--------')
        let timeFormat = this.state.timeFormat
        let startTime = ''
        let endTime = ''
        if (Array.isArray(dates)) {
            startTime = dates[0].format(timeFormat)
            endTime = dates[1].format(timeFormat)
        } else {
            startTime = dates.format(timeFormat)
            endTime = dates.format(timeFormat)
        }

        console.log({
            startTime,
            endTime
        }, '---------onDataChange----------')

        this.setState({
            startTime,
            endTime,
            initAction: false
        })
    }

    // 编辑看板名称/描述
    editName = (data) => {
        this.editViewDom.visibleModal(true, {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description
        })
    }

    handleEditBoardView = async (data) => {
        let res = await createTable(data)
        if (res.code === 200) {
            this.setState({
                id: data.id,
                name: data.name,
                description: data.description
            })

            // 刷新看板列表
            this.props.reloadTab('dashboardList')
            NotificationWrap.success('修改成功！')
            return true
        } else {
            NotificationWrap.error(res.msg)
            return false
        }
    }

    // 设置更新规则
    setUpdateRule = () => {
        this.updateViewDom.visibleModal(true, this.state.reportData)
    }

    handleEditUpdateSetting = async (data) => {
        let reportData = this.state.reportData
        reportData = {
            ...reportData,
            ...data
        }
        let res = await createTable(data)
        if (res.code === 200) {
            this.setState({
                reportData
            })

            NotificationWrap.success('修改成功！')
        } else {
            NotificationWrap.error(res.msg)
        }
        return res
    }

    onPanelChange = (dates) => {
        this.onDataChange(dates)
        this.setState({
            open: false
        })
    }

    handleOpenChange = (status) => {
        console.log(status, '----open----status---')
        this.setState({
            open: status
        })
        // if (!status) {
        //   handleDateTimeChange(moment2string(dateTime));
        // }
    }

    // handleOpenChange = (status) => {
    //     // console.log(status)
    //     if (status) {
    //         this.setState({ open: true })
    //     } else {
    //         this.setState({ open: false })
    //     }
    // }

    render() {
        const {
            name,
            isEmpty,
            description,
            TimeFilterComponent,
            reportData,
            reportsViews,
            startTime,
            endTime,
            open
        } = this.state
        console.log(startTime,
            endTime, '------------------------------')
        return (
            <div className='reportDetial'>
                <div className='detialHeader'>
                    <h6 className='topic1'>报表</h6>
                    <div className='topic2'>
                        <span>{name}</span>
                        <img onClick={this.editName} className='changeName' src={ModifyFill} />
                        {
                            !isEmpty &&
                            <div className='rightBtn'>
                                <Dropdown overlay={this.menuList}>
                                    <span className='filterBtn'>
                                        {/* <img className='filterIcon' src={Filter} /> */}
                                    操作
                                    </span>
                                </Dropdown>
                            </div>
                        }
                    </div>
                </div>
                {
                    isEmpty ? <div className='blankContent'><div className='contentIcon'><img src={Error} /><div>看板里还没有内容</div></div></div>
                        : <div style={style}>
                            <div className='viewReport' style={{ width: '50%', height: '160px' }} >
                                <div className='viewBack'>
                                    <span className='viewText' style={{ paddingRight: '8px' }}>时间范围</span>
                                    {
                                        reportData.type === 1
                                            ? reportData.cycle === 1

                                                ? <MonthPicker key='t11' allowClear={false} value={moment(startTime, monthFormat)} format={monthFormat} onChange={this.onDataChange} />
                                                : reportData.cycle === 0 ? <DatePicker key='t10' allowClear={false} value={moment(startTime, dateFormat)} format={dateFormat} onChange={this.onDataChange} /> : null

                                            : reportData.cycle === 1
                                                ? <RangePicker key='t01' allowClear={false}
                                                    value={[moment(startTime, monthFormat), moment(endTime, monthFormat)]}
                                                    format={monthFormat}
                                                    mode={['month', 'month']}
                                                    // onChange={this.onDataChange}
                                                    open={open}
                                                    // onChange={this.onDataChange}
                                                    onPanelChange={this.onPanelChange}
                                                    onOpenChange={this.handleOpenChange}
                                                />
                                                : reportData.cycle === 0 ? <RangePicker key='t00' allowClear={false}
                                                    value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                                                    format={dateFormat}
                                                    onChange={this.onDataChange}
                                                                           /> : null
                                    }
                                </div>
                            </div>
                            <div className='viewReport' style={{ width: '50%', height: '160px' }}>
                                <div className='viewBack'>
                                    <div style={{ overflowY: 'auto', height: '100%', wordBreak: 'break-all' }}>
                                        <div className='viewText' style={{ opacity: description ? 1 : 0.45 }} >{description || '暂无报表描述'}</div>
                                    </div>
                                </div>
                            </div>
                            {
                                reportsViews.map((val, key) => {
                                    return (
                                        <div className='viewReport' style={{ width: '100%', minHeight: '300px' }}>
                                            <div className='viewBack'>
                                                <div className='viewBody'>
                                                    <Widget params={{
                                                        ...val,
                                                        startTime,
                                                        endTime,
                                                        initAction: this.state.initAction
                                                    }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                }
                <EditView
                    ref={(dom) => { this.editViewDom = dom }}
                    handleEditBoardView={this.handleEditBoardView}
                />

                <UpdateView
                    ref={(dom) => { this.updateViewDom = dom }}
                    handleEditUpdateSetting={this.handleEditUpdateSetting}
                />
            </div>
        )
    }
}
