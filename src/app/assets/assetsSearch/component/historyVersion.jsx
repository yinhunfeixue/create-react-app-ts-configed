import EmptyLabel from '@/component/EmptyLabel'
import { message, Table, Tooltip } from 'antd'
import { releaseHistory, summaryMetricsEtlDownload } from 'app_api/metadataApi'
import React, { Component } from 'react'

export default class AssetHistoryVersion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
        }
        this.columns = [
            {
                title: '版本号',
                dataIndex: 'versionDesc',
                key: 'versionDesc',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '更新日志',
                dataIndex: 'description',
                key: 'description',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '发布时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作人',
                dataIndex: 'publishUserName',
                key: 'publishUserName',
                width: 100,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '脚本信息',
                dataIndex: 'versionDesc',
                key: 'versionDesc',
                width: 100,
                render: (text, record) => (
                    <span onClick={this.download.bind(this, record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                        下载
                    </span>
                ),
            },
        ]
    }
    componentDidMount = () => {
        if (this.props.param.type == 10 || this.props.param.type == 11) {
            this.columns.pop()
        }
        this.getTableList()
    }
    download = async (data) => {
        message.info('系统正准备下载')
        let query = {
            summaryId: this.props.param.id,
            summaryName: this.props.param.name,
            versionNum: data.versionNum,
        }
        let res = await summaryMetricsEtlDownload(query)
    }
    getTableList = async (params = {}) => {
        let query = {
            assetsId: this.props.param.id,
        }
        this.setState({ loading: true })
        let res = await releaseHistory(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
        }
    }
    render() {
        const { loading, tableData } = this.state
        return <Table columns={this.columns} dataSource={tableData} loading={loading} rowKey='id' pagination={false} />
    }
}
