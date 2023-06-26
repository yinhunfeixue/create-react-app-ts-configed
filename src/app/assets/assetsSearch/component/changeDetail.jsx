import EmptyLabel from '@/component/EmptyLabel'
import { Button, message, Modal, Table, Tooltip } from 'antd'
import { businessPublish, releaseMetricsSummary, unreleaseDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'

const confirm = Modal.confirm

export default class AssetChangeDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            btnLoading: false,
        }
        this.columns = [
            {
                title: '变更类型',
                dataIndex: 'type',
                key: 'type',
                width: 200,
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
                title: '变更内容',
                dataIndex: 'content',
                key: 'content',
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
                title: '修改时间',
                dataIndex: 'changeTime',
                key: 'changeTime',
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
                title: '修改人',
                dataIndex: 'changeUserName',
                key: 'changeUserName',
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
        ]
    }
    componentDidMount = () => {
        this.getTableList()
    }
    getTableList = async (params = {}) => {
        let query = {
            assetsId: this.props.param.id,
        }
        this.setState({ loading: true })
        let res = await unreleaseDetail(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
        }
    }
    confirmContent = () => {
        return (
            <div>
                <div>版本信息：{this.props.param.versionDesc}</div>
                {this.props.param.type == 10 || this.props.param.type == 11 ? null : <div>待发布指标数量：{this.props.param.notReleaseMetricsNumber}</div>}
            </div>
        )
    }
    releaseAsset = async () => {
        let that = this
        confirm({
            title: that.props.param.type == 10 ? '更新维度资产？' : that.props.param.type == 11 ? '更新事实资产？' : '更新汇总资产并发布指标？',
            content: that.confirmContent(),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.setState({ btnLoading: true })
                if (that.props.param.type == 10 || that.props.param.type == 11) {
                    businessPublish({ businessId: that.props.param.id }).then((res) => {
                        that.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            that.props.addTab('资产管理与发布')
                        }
                    })
                } else {
                    releaseMetricsSummary({ summaryId: that.props.param.id }).then((res) => {
                        that.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            that.props.addTab('资产管理与发布')
                        }
                    })
                }
            },
        })
    }
    render() {
        const { loading, tableData, btnLoading } = this.state
        return (
            <div>
                <div className='HControlGroup' style={{ marginBottom: 16 }}>
                    <Button disabled={!this.props.param.canUpdate} onClick={this.releaseAsset} loading={btnLoading} type='primary'>
                        更新资产
                    </Button>
                    <span style={{ color: '#666', marginLeft: 8 }}>更新资产后，将自动生成V2版本并替代目前版本的资产</span>
                </div>
                <Table columns={this.columns} dataSource={tableData} loading={loading} rowKey='id' pagination={false} />
            </div>
        )
    }
}
