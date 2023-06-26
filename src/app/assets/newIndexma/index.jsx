import { Tabs } from 'antd'
import React, { Component } from 'react'
import AtomIndexma from './atomIndexma'
import DeriveIndexma from './deriveIndexma'
import './index.less'

const TabPane = Tabs.TabPane

export default class NewIndexma extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabValue: '0',
        }
    }
    componentWillMount = () => {
        if (this.props.location.state.tabValue) {
            this.setState({
                tabValue: this.props.location.state.tabValue,
            })
        }
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    render() {
        const { tabValue } = this.state
        return (
            <div className='commonTablePage'>
                <div className='title'>指标定义</div>
                <Tabs activeKey={tabValue} onChange={this.changeTab} style={{ marginTop: 16 }}>
                    <TabPane tab='原子指标' key='0'>
                        {tabValue == '0' ? <AtomIndexma {...this.props} /> : null}
                    </TabPane>
                    <TabPane tab='衍生指标' key='1'>
                        {tabValue == '1' ? <DeriveIndexma {...this.props} /> : null}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
