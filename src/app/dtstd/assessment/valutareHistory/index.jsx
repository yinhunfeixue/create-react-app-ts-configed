import React, { Component } from 'react'
import { Modal, Select, message, Input, Button, Divider, InputNumber, Radio, Checkbox, Table } from 'antd'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { PlusOutlined } from '@ant-design/icons'
import { estimateHistoryOverview } from 'app_api/standardApi'
import moment from 'moment'
import BarChart from './barChart'
import Module from '@/component/Module'

const InputGroup = Input.Group

/**
 * 添加关联关系
 */

class ValutareHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            historyList: [],
            newKey: 1,
        }
        this.columns = [
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: '评估时间',
                render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '~'),
            },
            {
                dataIndex: 'columnNum',
                key: 'columnNum',
                title: '字段数',
                render: (text) => text || 0,
            },
            {
                dataIndex: 'markingColumnNum',
                key: 'markingColumnNum',
                title: '对标字段数',
                render: (text) => text || 0,
            },
            {
                dataIndex: 'markingColumnRatio',
                key: 'markingColumnRatio',
                title: '对标率',
                render: (text) => (text || 0) + '%',
            },
            {
                dataIndex: 'assessColumnNum',
                key: 'assessColumnNum',
                title: '落标字段数',
                render: (text) => text || 0,
            },
            {
                dataIndex: 'assessColumnRatio',
                key: 'assessColumnRatio',
                title: '落标率',
                render: (text) => (text || 0) + '%',
            },
        ]
    }

    close = () => {
        this.setState({ visible: false })
    }

    openModal = async (systemId) => {
        await this.setState({ visible: true })
        const res = await estimateHistoryOverview({ systemId })
        if (res.code === 200) {
            this.setState({ historyList: res.data, newKey: this.state.newKey + 1 })
        }
    }

    render() {
        const { visible, historyList, newKey } = this.state
        return (
            <React.Fragment>
                <DrawerLayout
                    onCancel={() => this.close()}
                    drawerProps={{
                        className: 'basicDetailDrawer',
                        title: '落标评估历史',
                        width: 960,
                        visible,
                        onClose: this.close,
                        maskClosable: true,
                    }}
                    renderFooter={null}
                >
                    <Module style={{ padding: '8px 0 0 0' }} key={newKey} title='落标趋势'>
                        {historyList.length > 0 && <BarChart chartData={historyList} />}
                    </Module>
                    <Module style={{ padding: 0 }} title='评估统计'>
                        <Table rowKey={'columnId'} dataSource={historyList} columns={this.columns} pagination={false} />
                    </Module>
                </DrawerLayout>
            </React.Fragment>
        )
    }
}

export default ValutareHistory
