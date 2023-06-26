import React, {Component} from 'react'
import {Tabs} from 'antd';

const TabPane = Tabs.TabPane;

export default class CommonTabs extends Component {

    render() {
        const {tabsList} = this.props;
        const {defaultActiveTabKey} = this.props;
        return (<Tabs className='normalTab' defaultActiveKey={defaultActiveTabKey} onChange={this.props.callback}>
            {
                tabsList.length > 0
                    ? tabsList.map((tab, key) => {
                        return (<TabPane tab={tab.title} key={tab.key}>{tab.content}</TabPane>)
                    })
                    : undefined
            }
        </Tabs>)
    }
}
