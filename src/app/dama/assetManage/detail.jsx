import EmptyLabel from '@/component/EmptyLabel'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button, message, Tabs, Tooltip } from 'antd'
import { metricsSummaryDetail, releaseMetricsSummary, unreleaseDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import AssetChangeDetail from './component/changeDetail'
import AssetColumn from './component/column'
import AssetHistoryVersion from './component/historyVersion'
import './index.less'
const TabPane = Tabs.TabPane

export default class AssetManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabValue: '0',
            detailInfo: {},
            changeTableData: [],
            changeTotal: 0,
            loading: false,
            showSearchResult: false,
            showMoreBtn: false,
            showMore: false,
            releaseLoading: false,
            unreleaseData: [],
        }
        this.changeColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 48,
            },
            {
                title: '变更类型',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 120,
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
                dataIndex: 'englishName',
                key: 'englishName',
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
                dataIndex: 'englishName',
                key: 'englishName',
                width: 120,
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
                dataIndex: 'englishName',
                key: 'englishName',
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
        this.versionColumns = [
            {
                title: '版本号',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 120,
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
                dataIndex: 'englishName',
                key: 'englishName',
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
                dataIndex: 'englishName',
                key: 'englishName',
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
                dataIndex: 'englishName',
                key: 'englishName',
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
                dataIndex: 'englishName',
                key: 'englishName',
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
        // if (this.props.location.state.tabValue) {
        //     this.setState({
        //         tabValue: this.props.location.state.tabValue
        //     })
        // }
        if (this.props.location.state.status == 0) {
            this.setState({
                tabValue: '1',
            })
        } else {
            this.getChangeDetail()
        }
        this.getDetailInfo()
    }
    getDetailInfo = async () => {
        let res = await metricsSummaryDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            await this.setState({
                detailInfo: res.data,
            })
            this.getDesc()
        }
    }
    getDesc = () => {
        let ele = document.querySelector('.desc')
        let descHeight = parseInt(window.getComputedStyle(ele).height)
        console.log(descHeight, 'descHeight')
        if (descHeight > 60) {
            this.setState({
                showMoreBtn: true,
            })
        }
    }
    changeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        if (e == 1) {
            this.getDesc()
        }
    }
    reset = () => {}
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        this.getTableList({})
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
        }
        // this.setState({loading: true})
        // let res = await factassetsSearch(query)
        // if (res.code == 200) {
        //     let param = {
        //         ...params.filterSelectedList,
        //         page: params.pagination ? params.pagination.page : 1,
        //         pageSize: params.pagination ? params.pagination.page_size : 20,
        //         // dataIndex
        //     }
        //     let data = {
        //         data: res.data,
        //         total: res.total
        //     }
        //     this.setState({
        //         changeTableData: res.data,
        //         changeTotal: res.total,
        //     })
        //     this.lzTableDom && this.lzTableDom.setTableData(data, param)
        // }
        // this.setState({loading: false})
    }
    changeMore = () => {
        this.setState({
            showMore: !this.state.showMore,
        })
    }
    releaseAsset = async () => {
        this.setState({ releaseLoading: true })
        let res = await releaseMetricsSummary({ summaryId: this.props.location.state.id })
        this.setState({ releaseLoading: false })
        if (res.code == 200) {
            message.success('发布成功')
            this.props.addTab('资产管理与发布')
        }
    }
    getChangeDetail = async (params = {}) => {
        let query = {
            assetsId: this.props.location.state.id,
        }
        let res = await unreleaseDetail(query)
        if (res.code == 200) {
            if (!res.data.length) {
                this.setState({
                    tabValue: '1',
                })
            }
            this.setState({
                unreleaseData: res.data,
            })
        }
    }
    render() {
        const { tabValue, detailInfo, loading, changeTableData, changeTotal, showSearchResult, showMore, showMoreBtn, releaseLoading, unreleaseData } = this.state
        return (
            <div className='commonTablePage assetManage assetManageDetail' style={{ background: '#f7f7f7', padding: '24px 48px' }}>
                <div className='assetTitle'>
                    <div className='assetIcon'>汇</div>
                    <div style={{ width: 'calc(100% - 300px)' }}>
                        <Tooltip placement='topLeft' title={detailInfo.name + detailInfo.englishName}>
                            <div className='title'>
                                {detailInfo.name || <EmptyLabel />} {detailInfo.englishName || <EmptyLabel />}
                            </div>
                        </Tooltip>
                        <div>
                            <span className='atomLabel'>业务板块：</span>
                            <Tooltip title={detailInfo.bizModuleName}>
                                <span className='atomContent'>{detailInfo.bizModuleName || <EmptyLabel />}</span>
                            </Tooltip>
                            <span className='atomLabel'>主题域：</span>
                            <Tooltip title={detailInfo.themeName}>
                                <span className='atomContent'>{detailInfo.themeName || <EmptyLabel />}</span>
                            </Tooltip>
                            {/*<span className='atomLabel'>业务过程：</span>*/}
                            {/*<span className='atomContent'>{detailInfo.bizModuleName}</span>*/}
                            <span className='atomLabel'>负责人：</span>
                            <Tooltip title={detailInfo.businessManagerName}>
                                <span className='atomContent'>{detailInfo.businessManagerName || <EmptyLabel />}</span>
                            </Tooltip>
                        </div>
                    </div>
                    {detailInfo.status ? (
                        <div>
                            <div style={{ marginBottom: 8 }} className='versionLabel'>
                                <span style={{ color: '#666' }}>版本信息：</span>
                                {detailInfo.versionDesc || <EmptyLabel />}
                            </div>
                            <div className='versionLabel'>
                                <span style={{ color: '#666' }}>最新更新时间：</span>
                                {detailInfo.updateTime || <EmptyLabel />}
                            </div>
                        </div>
                    ) : (
                        <div style={{ width: 300 }}>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ color: '#666' }}>状态：</span>未发布
                            </div>
                            <Button loading={releaseLoading} onClick={this.releaseAsset} type='primary'>
                                发布资产
                            </Button>
                        </div>
                    )}
                </div>
                <div className='card-container'>
                    {/*<span style={{ color: '#666', fontSize: '14px', position: 'absolute', right: '16px', top: '12px', zIndex: '99' }}>*/}
                    {/*<Tooltip title={'显示与#metric_name#具有相同统计粒度的衍生指标'}>*/}
                    {/*<Icon style={{color: '#666', marginRight: 4}} type="info-circle"/>*/}
                    {/*</Tooltip>*/}
                    {/*什么是关联指标？</span>*/}
                    <Tabs activeKey={tabValue} onChange={this.changeTab}>
                        {detailInfo.status == 1 && unreleaseData.length ? (
                            <TabPane tab='变更总览' key='0'>
                                <AssetChangeDetail {...this.props} />
                            </TabPane>
                        ) : null}
                        <TabPane tab='基本信息' key='1'>
                            <div className='detailArea'>
                                <div className='title' style={{ textAlign: 'left' }}>
                                    基础信息
                                </div>
                                <div>
                                    <span className='atomLabel'>资产类型：</span>
                                    <span className='atomContent'>汇总资产</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>资产名称：</span>
                                    <span className='atomContent'>{detailInfo.name || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>资产英文名称：</span>
                                    <span className='atomContent'>{detailInfo.englishName || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>业务板块：</span>
                                    <span className='atomContent'>{detailInfo.bizModuleName || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>主题域：</span>
                                    <span className='atomContent'>{detailInfo.themeName || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>统计粒度：</span>
                                    <span className='atomContent'>{detailInfo.statisticalColumn || <EmptyLabel />}</span>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <span className='atomLabel'>业务描述：</span>
                                    <span className={showMore ? 'atomContent' : 'atomContent desc'}>{detailInfo.description || <EmptyLabel />}</span>
                                    {showMoreBtn ? (
                                        <span onClick={this.changeMore} style={{ width: 100, display: 'inline-block', textAlign: 'right', color: '#1890ff', cursor: 'pointer' }}>
                                            {showMore ? '收起' : '展开全部'}
                                            {showMore ? <UpOutlined /> : <DownOutlined />}
                                        </span>
                                    ) : null}
                                </div>
                                <div className='title' style={{ textAlign: 'left' }}>
                                    管理属性
                                </div>
                                <div>
                                    <span className='atomLabel'>业务归口部门：</span>
                                    <span className='atomContent'>{detailInfo.busiDepartName || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>技术归口部门：</span>
                                    <span className='atomContent'>{detailInfo.techDepartName || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>业务负责人：</span>
                                    <span className='atomContent'>{detailInfo.businessManagerName || <EmptyLabel />}</span>
                                </div>
                                <div className='title' style={{ textAlign: 'left' }}>
                                    技术信息
                                </div>
                                <div>
                                    <span className='atomLabel'>创建人：</span>
                                    <span className='atomContent'>{detailInfo.createUser || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>创建时间：</span>
                                    <span className='atomContent'>{detailInfo.createTime || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>修改人：</span>
                                    <span className='atomContent'>{detailInfo.updateUser || <EmptyLabel />}</span>
                                </div>
                                <div>
                                    <span className='atomLabel'>更新时间：</span>
                                    <span className='atomContent'>{detailInfo.updateTime || <EmptyLabel />}</span>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab='字段信息' key='2'>
                            {tabValue == 2 ? <AssetColumn statisticalColumn={detailInfo.statisticalColumn} {...this.props} /> : null}
                        </TabPane>
                        {detailInfo.status == 1 ? (
                            <TabPane tab='历史版本' key='3'>
                                {tabValue == 3 ? (
                                    <div style={{ marginTop: 24 }}>
                                        <AssetHistoryVersion {...this.props} />
                                    </div>
                                ) : null}
                            </TabPane>
                        ) : null}
                    </Tabs>
                </div>
            </div>
        )
    }
}
