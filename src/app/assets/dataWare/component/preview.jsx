import { message, Table, Tabs, Tooltip } from 'antd'
import { getPreview } from 'app_api/wordSearchApi'
import React, { Component } from 'react'
import '../index.less'
const { TabPane } = Tabs

export default class dataSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            tableData: [],
        }
    }

    componentDidMount = () => {
        this.getPreviewData()
    }

    getPreviewData = async () => {
        let params = { businessId: this.props.id }
        let res = await getPreview(params)
        if (res.code === 200) {
            let data = res.data.header
            let columns = []
            data.map((value, index) => {
                columns.push({
                    title: value,
                    dataIndex: res.data.header[index],
                    key: res.data.header[index],
                    width: 170,
                    render: (text) => (
                        <Tooltip placement='left' title={text}>
                            {text}
                        </Tooltip>
                    ),
                })
            })
            let tableData = []
            res.data.body.map((value, index) => {
                let obj = {}
                value.map((val, ind) => {
                    obj[res.data.header[ind]] = val
                })
                tableData.push({
                    ...obj,
                    key: index,
                })
            })
            this.setState({
                columns,
                tableData,
            })
        }
    }

    render() {
        const { tableData, columns } = this.state
        return (
            <div className='editTable'>
                <Table
                    style={{ background: '#FFFFFF' }}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={tableData}
                    columns={columns}
                    scroll={{ x: 'calc(100%)', y: 540 }}
                    // 720
                />
            </div>
        )
    }
}
