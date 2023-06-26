import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import './style.less'
import { Steps } from 'antd'
import { observer } from 'mobx-react'
import Step1 from 'app_page/dama/intelligent/newBusiness/steps/step1'
import Step2 from 'app_page/dama/intelligent/newBusiness/steps/step2'
import Step3 from 'app_page/dama/intelligent/newBusiness/steps/step3'
import FieldSettingModal from 'app_page/dama/intelligent/newBusiness/fieldSettingModal'
import Store from './store'
import ProjectUtil from '@/utils/ProjectUtil'

const Step = Steps.Step

@observer
class NewBusiness extends Component {
    constructor(props) {
        super(props)
        this.store = new Store()
        this.store.param = this.pageParams
        this.state = {
            current: 0,
            steps: [{
                title: '1、基础信息设置',
                content: <Step1 next={this.next} prev={this.prev} {...this.store.param} addTab={this.props.addTab} store={this.store} />,
            }, {
                title: '2、表信息设置',
                content: <Step2 next={this.next} prev={this.prev} {...this.store.param} addTab={this.props.addTab} store={this.store} />,
            }, {
                title: '3、索引构建',
                content: <Step3 next={this.next} prev={this.prev} {...this.store.param} addTab={this.props.addTab} store={this.store} />,
            }]
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    componentDidMount =() => {
        if (this.pageParams.metaIndexStatus || this.pageParams.metaIndexStatus === 0) {
            this.store.metaIndexStatus = this.pageParams.metaIndexStatus
        }
        if (this.pageParams.indexStatus || this.pageParams.indexStatus === 0) {
            this.store.indexStatus = this.pageParams.indexStatus
        }
    }

    prev = () => {
        const current = this.state.current - 1
        this.setState({ current })
    }

    next = () => {
        const current = this.state.current + 1
        this.setState({ current })
    }

    render() {
        const { steps, current } = this.state
        return (
            <div className='intellStep'>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className='steps-content'>{steps[current].content}</div>
                <FieldSettingModal {...this.props} store={this.store} destroyOnClose />
            </div>
        )
    }
}

export default NewBusiness
