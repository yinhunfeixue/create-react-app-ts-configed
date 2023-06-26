import React, { Component } from 'react'
import { getBoardList, deleteBoard, boardAdd } from 'app_api/dashboardApi'
import { Tabs } from 'antd'
import './index.less'
import BoardList from './boardList'
import TableList from './tableList'

const { TabPane } = Tabs
export default class dataManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentKey: '1'
        }
    }
    onChange = (key) => {
        console.log(key)
        this.setState({
            currentKey: key
        })
    }
    render() {
        const { currentKey } = this.state
        return (
            <div className='boardTab'>
                <Tabs className='normalTab' defaultActiveKey={currentKey} onChange={this.onChange} tabBarStyle={{ textAlign: 'center' }}>
                    <TabPane tab='数据看板' key='1'>
                        {
                            currentKey === '1' && <BoardList addTab={this.props.addTab} />
                        }
                    </TabPane>
                    <TabPane tab='数据报表' key='2'>
                        {
                            currentKey === '2' && <TableList addTab={this.props.addTab} />
                        }
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
