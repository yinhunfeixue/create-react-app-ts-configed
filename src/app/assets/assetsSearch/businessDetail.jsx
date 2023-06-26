import EmptyLabel from '@/component/EmptyLabel'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, message, Table, Tabs, Tooltip } from 'antd'
import { bizAssetsDetail, businessPublish, internalTableRelation, unreleaseDetail } from 'app_api/metadataApi'
import EntityRelation from 'app_page/dama/component/entityRelation'
import React, { Component } from 'react'
import './businessDetail.less'
import BizLimit from './component/bizLimit'
import BusinessColumn from './component/businessColumn'
import AssetChangeDetail from './component/changeDetail'
import AssetHistoryVersion from './component/historyVersion'
import AssetPreview from './component/preview'
import RelateAsset from './component/relateAsset'
import RelateIndexma from './component/relateIndexma'

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
        this.colors = {
            1: '#F26D6D',
            2: '#636399',
            0: '#8CBF73',
        }
        this.entityChart = {}
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '来源表',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
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
                title: '数据库',
                dataIndex: 'physicalDatabaseName',
                key: 'physicalDatabaseName',
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
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text, record) => <span>{text}</span>,
            },
        ]
    }

    get propsParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount = () => {
        console.log('this，', this.propsParam)
        if (this.propsParam.status == 0 || this.propsParam.type == 11 || this.propsParam.showVersion == false) {
            this.setState({
                tabValue: '1',
            })
        } else {
            this.getChangeDetail()
        }
        if (this.propsParam.type == 10) {
            this.columns = [
                {
                    title: '维度名称',
                    dataIndex: 'name',
                    key: 'name',
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
                    title: '来源表',
                    dataIndex: 'physicalTableName',
                    key: 'physicalTableName',
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
                    title: '数据库',
                    dataIndex: 'physicalDatabaseName',
                    key: 'physicalDatabaseName',
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
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    render: (text, record) => <span>{text}</span>,
                },
                {
                    title: '技术负责人',
                    dataIndex: 'businessManagerName',
                    key: 'businessManagerName',
                    render: (text, record) => <span>{text}</span>,
                },
            ]
        }
        this.getDetailInfo()
    }
    getDetailInfo = async () => {
        let res = await bizAssetsDetail({ id: this.propsParam.id })
        if (res.code == 200) {
            res.data.relateAssets = res.data.relateAssets ? res.data.relateAssets : []
            await this.setState({
                detailInfo: res.data,
            })
            ProjectUtil.setDocumentTitle(res.data.englishName)
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
            // this.getDesc()
        } else if (e == 4) {
            this.getNodeData()
        }
    }
    getNodeData = async () => {
        let res = await internalTableRelation({ businessId: this.propsParam.id })
        if (res.code == 200) {
            this.entityChart.bindNodeData(res.data)
        }
    }
    changeMore = () => {
        this.setState({
            showMore: !this.state.showMore,
        })
    }
    releaseAsset = async () => {
        this.setState({ releaseLoading: true })
        let res = await businessPublish({ businessId: this.propsParam.id })
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
                {/* 页头 */}
                <header>
                    <div
                        className='assetIcon'
                        style={{
                            background: detailInfo.type == 'atomic' || detailInfo.type == 11 ? '' : '#EA8137',
                        }}
                    >
                        {detailInfo.type == 10 ? '维' : '事'}
                    </div>
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
                                ].concat(
                                    detailInfo.type !== 10
                                        ? [
                                              {
                                                  label: '业务过程：',
                                                  content: detailInfo.bizProcessName,
                                              },
                                              {
                                                  label: '最新发布时间：',
                                                  content: detailInfo.lastPublishTime,
                                              },
                                          ]
                                        : []
                                ),
                                'atomLabel'
                            )}
                        </div>
                        {this.propsParam.showVersion == false ? null : (
                            <div style={{ marginTop: 10 }}>
                                {detailInfo.status
                                    ? RenderUtil.renderSplitList(
                                          [
                                              {
                                                  label: '版本信息：',
                                                  content: detailInfo.versionDesc,
                                              },
                                              {
                                                  label: '最新更新时间：',
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
                        )}
                    </div>
                    {this.propsParam.showVersion && !detailInfo.status ? (
                        <div className='HeaderExtra'>
                            <img src={iconUnpublish} />
                        </div>
                    ) : null}
                </header>
                <main>
                    <Tabs activeKey={tabValue} onChange={this.changeTab}>
                        {detailInfo.status == 1 && unreleaseData.length && detailInfo.type == 10 && this.propsParam.showVersion !== false ? (
                            <TabPane tab='变更总览' key='0'>
                                <AssetChangeDetail {...this.props} />
                            </TabPane>
                        ) : null}
                        <TabPane tab='基本信息' key='1' style={{ marginTop: 8 }}>
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
                            {detailInfo.type !== 10 && (
                                <React.Fragment>
                                    <Module title='业务分类'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                { label: '业务板块', content: detailInfo.bizModuleName },
                                                { label: '主题域', content: detailInfo.themeName },
                                                { label: '业务过程', content: detailInfo.bizProcessName },
                                                { label: '业务负责人', content: detailInfo.businessManagerName },
                                            ])}
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
                                </React.Fragment>
                            )}
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
                            <Divider />
                            <Module title='数据来源'>
                                <Table columns={this.columns} dataSource={detailInfo.relateAssets} rowKey='id' pagination={false} />
                            </Module>
                        </TabPane>
                        <TabPane tab='字段信息' key='2'>
                            {tabValue == 2 ? <BusinessColumn {...this.props} /> : null}
                        </TabPane>
                        {detailInfo.status == 1 && detailInfo.type == 10 && this.propsParam.showVersion !== false ? (
                            <TabPane tab='历史版本' key='3'>
                                {tabValue == 3 ? <AssetHistoryVersion {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                        {detailInfo.type == 11 || detailInfo.type == 10 ? (
                            <TabPane tab='模型关系' key='4'>
                                {tabValue == 4 ? (
                                    <div style={{ height: 'calc(100vh - 150px)' }}>
                                        <EntityRelation
                                            ref={(dom) => {
                                                this.entityChart = dom
                                            }}
                                            colors={this.colors}
                                            canEdit={false}
                                        />
                                    </div>
                                ) : null}
                            </TabPane>
                        ) : null}
                        {detailInfo.type == 11 ? (
                            <TabPane tab='关联指标' key='5'>
                                {tabValue == 5 ? <RelateIndexma {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                        {detailInfo.type == 11 || detailInfo.type == 10 ? (
                            <TabPane tab='业务限定' key='6'>
                                {tabValue == 6 ? <BizLimit {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                        {detailInfo.type == 10 ? (
                            <TabPane tab='关联事实' key='8'>
                                {tabValue == 8 ? <RelateAsset {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                        {detailInfo.type == 11 || detailInfo.type == 10 ? (
                            <TabPane tab='数据预览' key='7'>
                                {tabValue == 7 ? <AssetPreview {...this.props} /> : null}
                            </TabPane>
                        ) : null}
                    </Tabs>
                </main>
            </div>
        )
    }
}
