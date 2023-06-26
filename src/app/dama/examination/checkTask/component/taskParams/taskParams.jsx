// 任务参数
import EmptyLabel from '@/component/EmptyLabel'
import { Tooltip, Button, Cascader, Input, message, Divider, Select, Tabs, Switch, Dropdown, Menu, Space, Form } from 'antd';
import React, { Component } from 'react';
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import Cache from 'app_utils/cache'
import '../../index.less';
import store from '../../store'
import { observer } from 'mobx-react'
import SetParamsDrawer from './setParamsDrawer'

@observer
export default class TaskParams extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount = () => {

    }
    refresh = () => {
        store.getDetail()
    }
    openSetParamsModal = (type) => {
        this.setParamsDrawer&&this.setParamsDrawer.openModal(type)
    }
    render() {
        const { taskDetail, selectedTaskInfo } = store
        console.log("taskDetail", taskDetail)
        return (
            <div className="taskParams commonScroll">
                <div className='tableInfo'>
                    <ModuleTitle title={<div>检核范围<a onClick={this.openSetParamsModal.bind(this, '1')} className='titleBtn'>设置</a></div>} />
                    {
                        taskDetail.checkRangeView ?
                            <Form className='EditMiniForm InlineForm Grid1' style={{ rowGap: '16px' }}>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '检核范围',
                                        content: taskDetail.checkRangeView,
                                    },
                                    {
                                        label: '检核时间范围',
                                        hide: taskDetail.checkRange.rangeType === 1,
                                        content: taskDetail.checkRangeTimeView,
                                    },
                                ])}
                            </Form>
                            :
                            <div style={{ color: '#C4C8CC' }}>必填项，点击上方设置</div>
                    }
                </div>
                <div className='tableInfo'>
                    <ModuleTitle title={<div>执行周期<a onClick={this.openSetParamsModal.bind(this, '2')} className='titleBtn'>设置</a></div>} />
                    {
                        taskDetail.frequency !== undefined ?
                            <Form className='EditMiniForm InlineForm Grid1' style={{ rowGap: '16px' }}>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '调度方式',
                                        content: taskDetail.frequency == 0 ? '单次任务' : '周期任务',
                                    },
                                    {
                                        label: '调度起止时间',
                                        hide: taskDetail.frequency == 0,
                                        content: taskDetail.timeRangeDesc,
                                    },
                                    {
                                        label: '调度时间',
                                        hide: taskDetail.frequency == 0,
                                        content: taskDetail.circleInfo,
                                    },
                                    {
                                        label: '窗口时长',
                                        hide: taskDetail.frequency == 0,
                                        content: taskDetail.timePeriodDesc,
                                    },
                                ])}
                            </Form>
                            :
                            <div style={{ color: '#C4C8CC' }}>必填项，点击上方设置</div>
                    }
                </div>
                <div className='tableInfo'>
                    <ModuleTitle style={{ marginBottom: 0 }} title={<div>试跑环境<a onClick={this.openSetParamsModal.bind(this, '3')} className='titleBtn'>设置</a></div>} />
                    {
                        taskDetail.isTest ?
                            <Form className='EditMiniForm InlineForm Grid1' style={{ rowGap: '16px', marginTop: 16 }}>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '试跑数据源',
                                        content: taskDetail.testDatasourceNameCn,
                                    },
                                ])}
                            </Form>
                            : null
                    }
                </div>
                {/*<div className='tableInfo'>*/}
                    {/*<ModuleTitle title={<div>变量参数<a className='titleBtn'>设置</a></div>} />*/}
                {/*</div>*/}
                <SetParamsDrawer refresh={this.refresh} ref={(dom) => this.setParamsDrawer = dom} />
            </div>
        )
    }
}
