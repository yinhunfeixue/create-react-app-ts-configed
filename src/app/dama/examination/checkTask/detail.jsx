import ProjectUtil from '@/utils/ProjectUtil'
import { Spin, Tabs } from 'antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import CheckResult from './component/checkResult/checkResult'
import CheckRuleTab from './component/checkRule/checkRule'
import TaskDashboard from './component/dashboard/dashboard'
import TaskDisplayDrawer from './component/taskDisplayDrawer'
import TaskParams from './component/taskParams/taskParams'
import TaskRecordData from './component/taskRecord/taskRecord'
import './index.less'
import store from './store'

const TabPane = Tabs.TabPane

@observer
export default class TaskDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount = () => {
        const { selectedTaskInfo } = store
        // let data = selectedTaskInfo.id ? selectedTaskInfo : this.pageParam
        let data = this.pageParam
        store.onSelectTask(data)
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    openTaskDisplay = () => {
        const { taskDisplayModal } = store
        store.changeTaskDisplayModal(!taskDisplayModal)
    }
    back = () => {
        this.props.addTab('检核任务')
    }
    changeTab = (e) => {
        store.changeTab(e)
    }
    refresh = () => {
        const { tabValue } = store
        if (tabValue == 1) {
            this.taskDashboard && this.taskDashboard.refresh()
        } else if (tabValue == 2) {
            this.checkRuleTab && this.checkRuleTab.refresh()
        } else if (tabValue == 3) {
            this.taskParams && this.taskParams.refresh()
        } else if (tabValue == 4) {
            this.taskRecordData && this.taskRecordData.refresh()
        } else if (tabValue == 5) {
            this.checkResult && this.checkResult.refresh()
        }
    }
    getNewDisplayData = () => {
        this.taskDisplayDrawer && this.taskDisplayDrawer.getTableList()
    }
    render() {
        const { taskDisplayModal, tabValue, selectedTaskInfo, pageLoading } = store
        return (
            <React.Fragment>
                <div className='taskDetail'>
                    <div className='detailHeader'>
                        <div className='nameContainer'>
                            <div className='back' onClick={this.back}>
                                <span className='iconfont icon-zuo'></span>
                            </div>
                            <div className='taskName' onClick={this.openTaskDisplay}>
                                {selectedTaskInfo.name}
                                <span className='iconfont icon-botton_down'></span>
                            </div>
                        </div>
                        <div className='tabContainer'>
                            <Tabs activeKey={tabValue} animated={false} tabPosition='top' onChange={this.changeTab}>
                                <TabPane tab='任务概览' key='1'></TabPane>
                                <TabPane tab='检核规则' key='2'></TabPane>
                                <TabPane tab='任务参数' key='3'></TabPane>
                                <TabPane tab='执行记录' key='4'></TabPane>
                                <TabPane tab='检核结果' key='5'></TabPane>
                                {/*<TabPane tab='数据整改' key='6'>*/}
                                {/*</TabPane>*/}
                                {/*<TabPane tab='质量分析' key='7'>*/}
                                {/*</TabPane>*/}
                            </Tabs>
                        </div>
                    </div>
                    <Spin spinning={pageLoading}>
                        <div className='taskContent commonScroll'>
                            {tabValue == '1' ? <TaskDashboard getNewDisplayData={this.getNewDisplayData} ref={(dom) => (this.taskDashboard = dom)} /> : null}
                            {tabValue == '2' ? <CheckRuleTab getNewDisplayData={this.getNewDisplayData} ref={(dom) => (this.checkRuleTab = dom)} /> : null}
                            {tabValue == '3' ? <TaskParams ref={(dom) => (this.taskParams = dom)} /> : null}
                            {tabValue == '4' ? <TaskRecordData ref={(dom) => (this.taskRecordData = dom)} /> : null}
                            {tabValue == '5' ? <CheckResult ref={(dom) => (this.checkResult = dom)} /> : null}
                        </div>
                    </Spin>
                </div>
                <TaskDisplayDrawer refresh={this.refresh} ref={(dom) => (this.taskDisplayDrawer = dom)} />
            </React.Fragment>
        )
    }
}
