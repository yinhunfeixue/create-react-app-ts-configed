import React, { Component } from 'react'
import { Button, Tabs } from 'antd'
import FullTable from 'app_page/dama/intelligent/newBusiness/tables/fullTable'
import MainTable from 'app_page/dama/intelligent/newBusiness/tables/mainTable'
import FactTable from 'app_page/dama/intelligent/newBusiness/tables/factTable'
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'
import { modelIndex } from 'app_api/modelApi'

const TabPane = Tabs.TabPane

class Step2 extends Component {
    constructor() {
        super()
        this.state = {
            activeKey: '1'
        }
    }

    onCancel=() => {
        const { isEdit, isDetail } = this.props
        if (isEdit) {
            // this.props.removeTab('编辑业务')
            this.props.addTab('设置')
        } else if (isDetail) {
            // this.props.removeTab('业务详情')
            this.props.addTab('设置')
        } else {
            // this.props.removeTab('添加业务')
            this.props.addTab('设置')
        }
    }

    handleTabChange=(key) => {
        this.setState({
            activeKey: key
        })
    }

    next = async () => {
        const { store } = this.props
        const { businessId, modelId } = store
        if (!this.props.isDetail) {
            let res = await modelIndex({ businessId, modelId, reIndex: true })
            if (res.code != 200) {
                NotificationWrap.warning(res.msg)
                return
            }
            NotificationWrap.success(res.msg)
        }
        this.props.next()
    }

    render() {
        const { store, isDetail } = this.props
        const { activeKey } = this.state
        return (
            <div>
                <Tabs className='normalTab' activeKey={activeKey} onTabClick={this.handleTabChange} style={{ marginBottom: '5px' }}>
                    <TabPane tab='全部表' key='1'style={{ marginTop: '5px' }}>
                        {activeKey === '1' && <FullTable store={store} isDetail={isDetail} />}
                    </TabPane>
                    <TabPane tab='主体表' key='2' style={{ marginTop: '5px' }}>
                        {activeKey === '2' && <MainTable store={store} isDetail={isDetail} />}
                    </TabPane>
                    <TabPane tab='事实表' key='3' style={{ marginTop: '5px' }}>
                        {activeKey === '3' && <FactTable store={store} isDetail={isDetail} />}
                    </TabPane>
                </Tabs>
                <div>
                    <Button className='step2Btn' onClick={() => this.props.prev()}>上一步</Button>
                    <Button type='primary' onClick={() => this.next()}>下一步</Button>
                    <Button onClick={this.onCancel}>取消</Button>
                </div>
            </div>
        )
    }
}

export default Step2
