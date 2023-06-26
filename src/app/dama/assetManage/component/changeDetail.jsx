import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import { Button, message, Modal, Spin, Table, Tooltip } from 'antd'
import { releaseMetricsSummary, unreleaseDetail } from 'app_api/metadataApi'
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
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 48,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
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
            assetsId: this.props.location.state.id,
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
                <div>版本信息：{this.props.location.state.versionDesc}</div>
                <div>待发布指标数量：{this.props.location.state.notReleaseMetricsNumber}</div>
            </div>
        )
    }
    releaseAsset = async () => {
        let that = this
        confirm({
            title: '更新汇总资产并发布指标？',
            content: that.confirmContent(),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.setState({ btnLoading: true })
                releaseMetricsSummary({ summaryId: that.props.param.id }).then((res) => {
                    that.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.props.addTab('资产管理与发布')
                    }
                })
            },
        })
    }
    render() {
        const { loading, tableData, btnLoading } = this.state
        return (
            <div>
                {tableData.length ? (
                    <div className='searchArea'>
                        <Button disabled={!this.props.location.state.canUpdate} onClick={this.releaseAsset} loading={btnLoading} type='primary'>
                            更新资产
                        </Button>
                        <span style={{ color: '#666', marginLeft: 8 }}>更新资产后，将自动生成V2版本并替代目前版本的资产</span>
                    </div>
                ) : null}
                {tableData.length ? (
                    <div>
                        <Table
                            bordered
                            columns={this.columns}
                            dataSource={tableData}
                            loading={loading}
                            rowKey='id'
                            pagination={false}
                            // scroll={{ x: 1500 }}
                        />
                    </div>
                ) : (
                    <Spin spinning={loading}>
                        <div className='emptyIconArea' style={{ marginTop: 24 }}>
                            <div className='iconContent'>
                                <EmptyIcon description='当前汇总资产无变更内容' />
                            </div>
                        </div>
                    </Spin>
                )}
            </div>
        )
    }
}
