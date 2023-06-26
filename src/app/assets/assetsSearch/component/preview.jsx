import EmptyLabel from '@/component/EmptyLabel'
import { Table, Tooltip } from 'antd'
import { bizAssetsPreview } from 'app_api/metadataApi'
import React, { Component } from 'react'

export default class AssetPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            columns: [],
        }
    }
    componentDidMount = () => {
        this.getTableList()
    }
    getTableList = async (params = {}) => {
        let query = {
            businessId: this.props.param.id,
        }
        this.setState({ loading: true })
        let res = await bizAssetsPreview(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            let data = res.data.header
            let columns = []
            data.map((value, index) => {
                columns.push({
                    title: value,
                    dataIndex: res.data.header[index],
                    key: res.data.header[index],
                    width: 150,
                    render: (text) =>
                        text ? (
                            <Tooltip placement='topLeft' title={text}>
                                <span className='LineClamp1'>{text}</span>
                            </Tooltip>
                        ) : (
                            <EmptyLabel />
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
        const { loading, tableData, columns } = this.state
        return <Table columns={columns} dataSource={tableData} loading={loading} rowKey='id' pagination={false} scroll={{ x: columns.length * 150 }} />
    }
}
