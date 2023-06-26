import { Tabs } from 'antd'
import React, { Component } from 'react'
import './index.less'
import IndexmaAsset from './indexmaAsset'

const TabPane = Tabs.TabPane

export default class AssetManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabValue: '1',
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
            <div className='commonTablePage assetManage' style={{ background: '#f7f7f7', padding: '24px 48px' }}>
                <div className='title'>资产管理与发布</div>
                <div className='card-container'>
                    <Tabs type='card' activeKey={tabValue} onChange={this.changeTab}>
                        <TabPane tab='指标资产' key='1'>
                            {tabValue == '1' ? <IndexmaAsset {...this.props} /> : null}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
