import EmptyLabel from '@/component/EmptyLabel'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, message, Tabs, Tooltip } from 'antd'
import { metricsSummaryDetail, releaseMetricsSummary, unreleaseDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './businessDetail.less'
import AssetChangeDetail from './component/changeDetail'
import AssetColumn from './component/column'
import AssetHistoryVersion from './component/historyVersion'

const iconUnpublish = require('app_images/unpublish.png')

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

    get propsParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount = () => {
        if (this.propsParam.status == 0) {
            this.setState({
                tabValue: '1',
            })
        } else {
            this.getChangeDetail()
        }
        this.getDetailInfo()
    }
    getDetailInfo = async () => {
        let res = await metricsSummaryDetail({ id: this.propsParam.id })
        if (res.code == 200) {
            await this.setState({
                detailInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.englishName)
            this.getDesc()
        }
    }
    getDesc = () => {
        // let ele = document.querySelector('.desc')
        // let descHeight = parseInt(window.getComputedStyle(ele).height)
        // console.log(descHeight, 'descHeight')
        // if (descHeight > 60) {
        //     this.setState({
        //         showMoreBtn: true,
        //     })
        // }
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
    }
    changeMore = () => {
        this.setState({
            showMore: !this.state.showMore,
        })
    }
    releaseAsset = async () => {
        this.setState({ releaseLoading: true })
        let res = await releaseMetricsSummary({ summaryId: this.propsParam.id })
        this.setState({ releaseLoading: false })
        if (res.code == 200) {
            message.success('发布成功')
            this.props.addTab('资产管理与发布')
        }
    }
    getChangeDetail = async (params = {}) => {
        let query = {
            assetsId: this.propsParam.id,
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
            <div className='businessDetail'>
                <header>
                    <div className='assetIcon'>汇</div>
                    <div>
                        <h2>
                            {detailInfo.englishName || <EmptyLabel />} {detailInfo.name || <EmptyLabel />}
                        </h2>
                        <div>
                            {RenderUtil.renderSplitList(
                                [
                                    {
                                        label: '业务板块：',
                                        content: detailInfo.bizModuleName,
                                    },
                                    {
                                        label: '主题域：',
                                        content: detailInfo.themeName,
                                    },
                                    {
                                        label: '负责人：',
                                        content: detailInfo.businessManagerName,
                                    },
                                ],
                                'atomLabel'
                            )}
                        </div>
                        <div style={{ marginTop: 10 }}>
                            {detailInfo.status
                                ? RenderUtil.renderSplitList(
                                      [
                                          {
                                              label: '版本信息',
                                              content: detailInfo.versionDesc,
                                          },
                                          {
                                              label: '最新更新时间',
                                              content: detailInfo.updateTime,
                                          },
                                      ],
                                      'atomLabel'
                                  )
                                : RenderUtil.renderSplitList(
                                      [
                                          {
                                              label: '',
                                              content: (
                                                  <Button loading={releaseLoading} onClick={this.releaseAsset} type='primary'>
                                                      发布资产
                                                  </Button>
                                              ),
                                          },
                                      ],
                                      'atomLabel'
                                  )}
                        </div>
                    </div>
                    {!detailInfo.status ? (
                        <div className='HeaderExtra'>
                            <img src={iconUnpublish} />
                        </div>
                    ) : null}
                </header>
                <main>
                    <Tabs activeKey={tabValue} onChange={this.changeTab}>
                        {detailInfo.status == 1 && unreleaseData.length ? (
                            <TabPane tab='变更总览' key='0'>
                                <AssetChangeDetail {...this.props} />
                            </TabPane>
                        ) : null}
                        <TabPane tab='基本信息' key='1'>
                            <Module title='基本信息'>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems(
                                        [
                                            {
                                                label: '资产类型',
                                                content: detailInfo.type == 10 ? '维度资产' : '事实资产',
                                            },
                                            {
                                                label: '资产名称',
                                                content: detailInfo.name,
                                            },
                                            {
                                                label: '资产英文名称',
                                                content: detailInfo.englishName,
                                            },
                                        ]
                                            .concat(
                                                detailInfo.type == 10
                                                    ? [
                                                          {
                                                              label: '业务板块',
                                                              content: detailInfo.bizModuleName,
                                                          },
                                                          {
                                                              label: '主题域',
                                                              content: detailInfo.themeName,
                                                          },
                                                      ]
                                                    : []
                                            )
                                            .concat([
                                                {
                                                    label: '业务描述',
                                                    content: detailInfo.description,
                                                },
                                            ])
                                    )}
                                </div>
                            </Module>
                            <Divider />
                            <Module title='管理信息'>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        { label: '业务归口部门', content: detailInfo.busiDepartName },
                                        { label: '技术归口部门', content: detailInfo.techDepartName },
                                        { label: '业务负责人', content: detailInfo.businessManagerName },
                                    ])}
                                </div>
                            </Module>
                            <Divider />
                            <Module title='技术信息' className='MiniForm'>
                                <div className=' Grid4'>
                                    {RenderUtil.renderFormItems([
                                        { label: '创建人', content: detailInfo.createUser },
                                        { label: '创建时间', content: detailInfo.createTime },
                                        { label: '修改人', content: detailInfo.updateUser },
                                        { label: '更新时间', content: detailInfo.updateTime },
                                    ])}
                                </div>
                            </Module>
                        </TabPane>
                        <TabPane tab='字段信息' key='2'>
                            {tabValue == 2 ? <AssetColumn statisticalColumn={detailInfo.statisticalColumn} {...this.props} /> : null}
                        </TabPane>
                        {detailInfo.status == 1 ? (
                            <TabPane tab='历史版本' key='3'>
                                {tabValue == 3 ? <AssetHistoryVersion {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                    </Tabs>
                </main>
            </div>
        )
    }
}
