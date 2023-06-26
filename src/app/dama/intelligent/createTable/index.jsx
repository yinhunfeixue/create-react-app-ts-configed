import React, { Component } from 'react'
import { Steps } from 'antd'
import './index.less'
const { Step } = Steps
import Step1 from './step1.jsx'
import Step2 from './step2.jsx'
import Step3 from './step3.jsx'
import store from './store'
import { observer } from 'mobx-react'
import ProjectUtil from '@/utils/ProjectUtil'
import { getReportDetail } from 'app_api/dashboardApi'

@observer
export default class dataManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: this.pageParams.ifCreate ? 0 : 1,
            // eslint-disable-next-line react/no-unused-state
            isResult: false
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    componentDidMount = () => {
        if (this.pageParams.ifCreate) {
            store.setPinboardId(this.pageParams.pinboardId)
        }
        else {
            store.setStatus(this.pageParams.ifCreate)
            store.setReportId(this.pageParams.id)
            // this.getDetial(this.pageParams.id)
        }
    }

    componentWillUnmount = () => {
        store.clearContent()
    }

    // componentWillMount = () => {
    //     if (!this.pageParams.ifCreate) {
    //         store.setStatus(this.pageParams.ifCreate)
    //         store.setReportId(this.pageParams.id)
    //         this.getDetial(this.pageParams.id)
    //     }
    // }

    static getDerivedStateFromProps = (props) => {
        if (props.param.ifCreate) {
            store.setPinboardId(props.param.pinboardId)
        } else {
            store.setStatus(props.param.ifCreate)
            store.setReportId(props.param.id)
        }
        return null
    }

    getDetial = async (id) => {
        let params = {
            id: this.pageParams.id,
            showPbViews: true
        }
        let pinboardId = 0
        let res = await getReportDetail(params)
        if (res.code === 200) {
            store.setTableInf(res.data.name, res.data.cycle, res.data.type)
            store.setPinboardId(res.data.pinboardId)
            // store.setSelectList()
            let selectList = []
            res.data.pbViews.map((value, index) => {
                selectList.push({
                    boardId: value.pbViewId,
                    boardName: value.pbViewName,
                    dateColumnKey: value.dateColumn.reportsColumnKey
                })
            })
            // await store.setSelectList(selectList)
            this.setState({
                current: 1
            })
            pinboardId = res.data.pinboardId
            return { pinboardId, selectList }
        }
    }
    // 下一页
    next = () => {
        const { current } = this.state
        console.log(current)
        this.setState({
            current: current + 1
        })
    }
    // 上一页
    prev = () => {
        const { current } = this.state
        this.setState({
            current: current - 1
        })
    }

    render() {
        const { current } = this.state
        return (
            <div className='intelligentManageStep'>
                <div className='stepHeader'>
                    {this.pageParams.ifCreate ? '创建报表' : '编辑报表'}
                </div>
                <div className='importData'>
                    <Steps current={current}>
                        <Step key={0} title='选择报表类型' />
                        <Step key={1} title='添加数据视图' />
                        <Step key={2} title='合并数据视图' />
                    </Steps>
                </div>
                {
                    !store.isResult &&
                    <div className='importContent'>
                        {current === 0 && <Step1 next={this.next} removeTab={this.props.remove} addTab={this.props.addTab} />}
                        {current === 1 && <Step2 next={this.next} getDetial={this.getDetial} prev={this.prev} />}
                        {current === 2 && <Step3 next={this.next} removeTab={this.props.remove} prev={this.prev} addTab={this.props.addTab} reload={this.props.reloadTab} />}
                    </div>
                }
            </div>
        )
    }
}
