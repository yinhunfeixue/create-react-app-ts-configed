import EmptyLabel from '@/component/EmptyLabel'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Cascader, Input, message, Modal, Select, Tree } from 'antd'
import { assetsBizModuleAndTheme, assetsMetricsSummary, releaseMetricsSummary, summaryMetricsEtlDownload } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'

const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class IndexmaAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                bizModuleIds: [],
                keyword: '',
                themeIds: [],
                status: undefined,
            },
            total: 0,
            showSearchResult: false,

            bizClassifyDefList: [],
            themeDefList: [],
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
            },
            {
                title: '汇总资产名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={this.openDetailModal.bind(this, record)}>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '汇总资产英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标数（已发布）',
                dataIndex: 'metricsNumber',
                key: 'metricsNumber',
                className: 'tableCellAlignRight',
                width: 120,
                render: (text, record) => <span>{text - record.notReleaseMetricsNumber}</span>,
            },
            {
                title: '指标数（待发布）',
                dataIndex: 'notReleaseMetricsNumber',
                key: 'notReleaseMetricsNumber',
                className: 'tableCellAlignRight',
                width: 120,
                render: (text, record) => <span>{text}</span>,
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: (text, record) => <span>{text ? '已发布' : '未发布'}</span>,
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.status == 0 ? (
                                <Tooltip title='发布'>
                                    <img className='editImg' onClick={this.releaseAsset.bind(this, record)} src={require('app_images/publish.png')} />
                                </Tooltip>
                            ) : null}
                            {record.status == 1 ? (
                                <span>
                                    <Tooltip title='ETL下载'>
                                        <DownloadOutlined className='editIcon' onClick={this.download.bind(this, record)} />
                                    </Tooltip>
                                    <Tooltip title='更新'>
                                        <ReloadOutlined
                                            style={{
                                                color: record.canUpdate ? '#666' : '#B3B3B3',
                                                cursor: record.canUpdate ? 'pointer' : 'not-allowed',
                                            }}
                                            className='editIcon'
                                            onClick={this.reload.bind(this, record)}
                                        />
                                    </Tooltip>
                                </span>
                            ) : null}
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
    }
    download = async (data) => {
        message.info('系统正准备下载')
        let query = {
            summaryId: data.id,
            summaryName: data.name,
            versionNum: data.versionNum,
        }
        let res = await summaryMetricsEtlDownload(query)
    }
    releaseAsset = async (data) => {
        let that = this
        confirm({
            title: '发布汇总资产，将向数据资产目录发布汇总资产下所包含的衍生指标和原子指标',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.setState({ loading: true })
                releaseMetricsSummary({ summaryId: data.id }).then((res) => {
                    that.setState({ loading: true })
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.getTableList({})
                    }
                })
            },
        })
    }
    reload = (data) => {
        if (!data.canUpdate) {
            return
        }
        this.setState({ loading: true })
        releaseMetricsSummary({ summaryId: data.id }).then((res) => {
            this.setState({ loading: true })
            if (res.code == 200) {
                message.success('操作成功')
                this.getTableList({})
            }
        })
    }
    openDetailModal = async (data) => {
        this.props.addTab('资产详情', data)
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await assetsBizModuleAndTheme()
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data.bizModuleDefList),
                themeDefList: this.deleteSubList(res.data.themeDefList),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.subList.length) {
                delete item.subList
            } else {
                this.deleteSubList(item.subList)
            }
        })
        console.log(data, 'deleteSubList')
        return data
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            bizModuleId: queryInfo.bizModuleIds.length ? queryInfo.bizModuleIds[queryInfo.bizModuleIds.length - 1] : '',
            themeId: queryInfo.themeIds.length ? queryInfo.themeIds[queryInfo.themeIds.length - 1] : '',
        }
        this.setState({ loading: true })
        let res = await assetsMetricsSummary(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                total: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        this.getTableList()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.bizModuleIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeTheme = async (value, selectedOptions) => {
        console.log(value, 'value')
        let { queryInfo } = this.state
        queryInfo.themeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            themeIds: [],
            bizModuleIds: [],
            status: undefined,
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    render() {
        let { tableData, loading, queryInfo, total, showSearchResult, themeDefList, bizClassifyDefList } = this.state
        return (
            <div>
                {showSearchResult || total ? (
                    <div className='searchArea' style={{ marginTop: 0 }}>
                        <div style={{ float: 'right' }}>
                            <Select allowClear onChange={this.changeType.bind(this, 'status')} value={queryInfo.status} style={{ width: '120px', marginRight: '8px' }} placeholder='状态'>
                                <Option value={0} key={0}>
                                    未发布
                                </Option>
                                <Option value={1} key={1}>
                                    已发布
                                </Option>
                            </Select>
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={bizClassifyDefList}
                                value={queryInfo.bizModuleIds}
                                style={{ width: '120px', marginRight: '8px' }}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeBusi}
                                placeholder='业务板块'
                            />
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={themeDefList}
                                value={queryInfo.themeIds}
                                style={{ width: '120px', marginRight: '8px' }}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeTheme}
                                placeholder='主题域'
                            />
                            <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} style={{ width: 180 }} placeholder='搜索汇总资产' />
                            <Button onClick={this.reset} style={{ marginLeft: 8 }} className='searchBtn'>
                                重置
                            </Button>
                        </div>
                    </div>
                ) : null}
                <div>
                    <LzTable
                        key='1'
                        columns={this.columns}
                        dataSource={tableData}
                        ref={(dom) => {
                            this.lzTableDom = dom
                        }}
                        getTableList={this.getTableList}
                        loading={loading}
                        rowKey='id'
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                        // scroll={{ x: 1500 }}
                    />
                </div>
            </div>
        )
    }
}
