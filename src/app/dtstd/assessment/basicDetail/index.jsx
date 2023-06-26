import React, { Component } from 'react'
import { Modal, Select, message, Input, Button, Divider, InputNumber, Radio, Checkbox, Table } from 'antd'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { PlusOutlined } from '@ant-design/icons'
import { queryEstimateColumnList } from 'app_api/standardApi'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import './index.less'

const InputGroup = Input.Group

/**
 * 添加关联关系
 */

class BasicDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            basicList: [],
            basicListCopy: [],
        }
        this.columns = [
            {
                dataIndex: 'columnName',
                key: 'columnName',
                title: '字段名称',
                width: '25%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '字段类型',
                width: '25%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'standardName',
                key: 'standardName',
                title: '标准名称',
                width: '25%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'estimatePassRate',
                key: 'estimatePassRate',
                title: '评估通过率',
                width: '25%',
                render: (text) => (text || 0) + '%',
            },
        ]

        this.detailcolumns = [
            {
                dataIndex: 'assessDesc',
                key: 'assessDesc',
                title: '评估标准',
                width: '25%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'columnInfo',
                key: 'columnInfo',
                title: '字段信息',
                width: '30%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'standardInfo',
                key: 'standardInfo',
                title: '标准信息',
                width: '30%',
                render: (text) => text || '~',
            },
            {
                dataIndex: 'assessResult',
                key: 'assessResult',
                title: '评估结果',
                width: '15%',
                render: (text) => (text ? <StatusLabel type='success' message='通过' /> : <StatusLabel type='error' message='不通过' />),
            },
        ]
    }

    close = () => {
        this.setState({ visible: false })
    }

    openModal = async (params) => {
        await this.setState({ visible: true })
        const res = await queryEstimateColumnList({ tableId: params.tableId })
        if (res.code === 200) {
            this.setState({ basicList: res.data, basicListCopy: res.data })
        }
    }

    searchHandle = (value) => {
        const { basicListCopy } = this.state
        const arr = Object.assign([], basicListCopy)

        this.setState({ basicList: arr.filter((basic) => basic.columnName.indexOf(value) > -1) })
    }

    render() {
        const { visible, basicList } = this.state
        return (
            <DrawerLayout
                onCancel={() => this.close()}
                drawerProps={{
                    className: 'basicDetailDrawer',
                    title: '落标详情',
                    width: 960,
                    visible,
                    onClose: this.close,
                    maskClosable: true,
                }}
                renderFooter={null}
            >
                <Input.Search placeholder='字段搜索' onSearch={this.searchHandle} />
                <Table
                    rowKey={'columnId'}
                    dataSource={basicList}
                    columns={this.columns}
                    pagination={false}
                    expandedRowRender={(record) => (
                        <div style={{ padding: '8px 8px 8px 32px', backgroundColor: '#EBEDF0' }}>
                            <Table dataSource={record.columnAssessList} columns={this.detailcolumns} pagination={false} />
                        </div>
                    )}
                />
            </DrawerLayout>
        )
    }
}

export default BasicDetail
