import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import store from './store'
import { observer } from 'mobx-react'
import _ from 'underscore'
import '../intelligent.less'
import './index.less'
import SearchResult from '../components/searchResult'
import KwLeftContent from './kwLeftContent/leftContent'
import KeyWordSearch from './keyWordSearch'
import DataLoading from '../components/loading'
import DrillList from './drillList'

import { addBoardView } from 'app_api/dashboardApi'
import { searchViewList, deleteSearchViewList, searchViewAdd } from 'app_api/wordSearchApi'
import { kwdDownload, handleSwitchData, getAggregationData, getSearchDetail, getDrillIndexList, getDrillDownSearch } from 'app_api/wordSearchApi'

import Cache from 'app_utils/cache'
import ProjectUtil from '@/utils/ProjectUtil'


const { Header, Footer, Sider, Content } = Layout

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.redioDefultValue = this.pageParams.value

        this.state = {
            tableLoading: false,
            menuSelectedKeys: [],
            drillDisplay: 'none',
            drillIndexComponent: null,
            searchViewDataList: [],
            viewIds: []
        }
    }

    componentWillMount = () => {
        this.init()
    }

    componentDidMount = () => {
        this.initDidMount()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    init = async () => {
        // 初始的加载清除 kws_columnsHeader session
        Cache.remove('kws_columnsHeader')
        store.clearAll()
        if (this.pageParams.tempBusinessId) {
            store.setTempBusinessId(this.pageParams.tempBusinessId)
        }

        if (this.pageParams.busiGroupId) {
            store.setBusiGroupId(this.pageParams.busiGroupId)
        }
        if (this.pageParams.businessIds) {
            store.setBusinessIds(this.pageParams.businessIds)
        }

        if (this.pageParams.businessId) {
            store.changeRadioValue(this.pageParams.businessId, this.pageParams.type || 0)
            store.clearContent()
        } else {
            store.clearContent()
        }
    }

    initDidMount = async () => {
        console.log(this.pageParams, store.businessIds, '-----------this.pageParams----------')
        if (this.pageParams.businessIds) {
            if (this.pageParams.nodeList) {
                let param = {
                    businessIds: store.businessIds,
                    type: this.pageParams.type || 0,
                    nodeList: this.pageParams.nodeList,
                    tempBusinessId: this.pageParams.tempBusinessId
                }
                store.setSearchItem(this.pageParams.nodeList, true)

                store.leftSelected(this.pageParams.nodeList)
                if (this.pageParams.dataSourceType === 'dashboardView') {
                    // 看板跳转过来的视图得重新识别 NODELIST
                    await store.onMatch({ ...param })
                    param['nodeList'] = store.searchItem
                    param['chartType'] = this.pageParams.chartType ? this.pageParams.chartType : 'Table'
                    param['chartParam'] = this.pageParams.chartParam
                }
                await store.onSearch({ ...param })

                // 搜索视图数据请求
                this.getSearchViewList()

                this.searchAction()
            }
        }
        this.search.onSearchFocus()
    }

    // setLoading = (status = true) => {
    //     this.KwContent.setLoading(status)
    // }

    searchAction = () => {
        this.setState({
            drillIndexComponent: null
        })
        const { sourceData, sourceDataCode, loading, businessId, nodeList, busiGroupId } = store
        console.log(sourceDataCode, '----------------------searchActionsearchAction---------')
        let params = {
            sourceData,
            sourceDataCode,
            businessId,
            nodeList,
            loading,
            busiGroupId
        }
        this.searchResultDom && this.searchResultDom.getSourceData && this.searchResultDom.getSourceData(params)
    }

    handleDownload = () => {
        let params = {
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId,
            viewIds: store.viewSelectedIds
        }
        kwdDownload(params)
    }

    // 明细接口调用
    handleDetail = (params) => {
        return getSearchDetail({
            ...params,
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId,
            viewIds: store.viewSelectedIds
        })
    }

    // 图形切换接口调用
    handleSwitchChart = (params) => {
        this.setState({
            drillIndexComponent: null
        })
        return handleSwitchData({
            ...params,
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId,
            viewIds: store.viewSelectedIds
        })
    }

    // 统计数据接口调用
    handleAggregationData = (params) => {
        return getAggregationData({
            ...params,
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId,
            viewIds: store.viewSelectedIds
        })
    }

    handleAddBoardView = (params) => {
        return addBoardView({
            ...params,
            businessIds: store.usableBusinessIds,
            tempBusinessId: store.tempBusinessId,
            queryType: 0,
            queryParam: JSON.stringify(store.nodeList),
            searchViewIds: store.viewSelectedIds
        })
    }

    handleAddSearchView = async (params) => {
        let searchViewDataList = this.state.searchViewDataList
        let data = await searchViewAdd({
            ...params,
            keywordSearchParam: {
                businessIds: store.usableBusinessIds,
                tempBusinessId: store.tempBusinessId,
                nodeList: store.nodeList,
                searchViewIds: store.viewSelectedIds
            }
        })

        if (data.code === 200) {
            // 如果有 tempBusinessId 需要更新 tempBusinessId
            let tempBusinessId = data.data.tempBusinessId
            if (tempBusinessId) {
                store.setTempBusinessId(tempBusinessId)
            }

            if (params.type === '1') {
                // 搜索视图，才更新搜索视图页面模块
                searchViewDataList.push(data.data)

                this.setState({
                    searchViewDataList
                }, () => {
                    this.search.renderViewList(searchViewDataList, 'expend')
                })
            }
        }

        return data
    }

    getDrillIndexListData = async (params) => {
        let data = await getDrillIndexList({
            ...params,
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId
        })
        if (data.code === 200) {
            return data.data
        } else {
            return []
        }
    }

    handleDrillSearch = async (param) => {
        let data = await getDrillDownSearch({
            ...param,
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId
        })
        if (data.code === 200) {
            let param = {
                businessIds: store.usableBusinessIds,
                nodeList: data.data
            }
            store.setSearchItem(param.nodeList, true)
            store.leftSelected(param.nodeList)

            // await store.onSearch(param)
            // this.searchAction()

            this.handleSearchAction(param)
        } else {
            // return []
        }
    }

    // 下钻数据列表
    handleDrillDownData = async (param) => {
        this.setState({
            drillIndexComponent: null
        })

        let data = await this.getDrillIndexListData({})

        const { clientWidth, clientTop, clientLeft } = this.kwMainDom
        this.setState({
            drillIndexComponent: <DrillList
                params={{
                    ...param,
                    data: data
                }}
                ref={(dom) => {
                    this.drillListDom = dom
                }}
                handleDrillSearch={this.handleDrillSearch}
                getDrillIndexListData={this.getDrillIndexListData}
            />
        })
    }

    getSearchViewList = async () => {
        let data = await searchViewList({
            businessIds: store.usableBusinessIds,
            tempBusinessId: store.tempBusinessId
        })

        store.setViewSelectedIds([])

        if (data.code === 200) {
            this.setState({
                searchViewDataList: data.data
            }, () => {
                this.search.renderViewList(data.data)
            })
        }
    }

    // 视图删除
    handleDeleteViewList = async (data) => {
        let res = await deleteSearchViewList({
            viewId: data.viewId,
            tempBusinessId: store.tempBusinessId
        })

        let searchViewDataList = this.state.searchViewDataList
        if (res.code === 200) {
            let viewIdsSelected = []
            let searchActionIs = false
            searchViewDataList.map((val, k) => {
                if (val.selected) {
                    viewIdsSelected.push(val.viewId)
                    if (val.viewId === data.viewId) {
                        searchActionIs = true
                    }
                }
            })

            store.setViewSelectedIds(viewIdsSelected)
            searchViewDataList = searchViewDataList.filter(({ viewId }) => viewId !== data.viewId)

            console.log(searchViewDataList, '----delete-----searchViewDataList')
            this.setState({
                searchViewDataList
            }, () => {
                this.search.renderViewList(searchViewDataList, 'expend')

                searchActionIs && this.handleSearchAction()
            })
            NotificationWrap.success('删除成功！')
        }
    }

    handleSearchAction = async (params = {}) => {
        await store.onSearch({
            businessIds: store.usableBusinessIds,
            nodeList: store.nodeList,
            tempBusinessId: store.tempBusinessId,
            viewIds: store.viewSelectedIds,
            ...params
        })
        // this.setState({
        //     viewIds
        // })
        this.searchAction()
    }
    delFormula = (params) => {
        this.search.delFormula(params)
    }
    render() {
        const {
            sourceDataCode,
            loading,
        } = store

        const { drillIndexComponent, searchViewDataList } = this.state
        return (
            <div style={{ height: '100%' }}>
                <Layout className='intelligent' style={{ height: '100%' }}>
                    <Sider className='leftContent'>
                        <KwLeftContent delFormula={this.delFormula} {...this.props} businessIds={store.businessIds} searchAction={this.handleSearchAction} getSearchViewList={this.getSearchViewList} />
                    </Sider>
                    <Layout style={{ paddingLeft: '250px', background: '#f5f5f5' }}>
                        <Header>
                            <div className='intelligent_search intelligentSearchTab'>
                                <KeyWordSearch
                                    // searchAction={this.searchAction}
                                    ref={(refs) => { this.search = refs }}
                                    tabOperate={{
                                        addTab: this.props.addTab,
                                        // removeTab: this.props.removeTab
                                    }}
                                    handleDeleteViewList={this.handleDeleteViewList}
                                    handleSearchAction={this.handleSearchAction}
                                />
                            </div>
                        </Header>
                        <Content className='wrap' style={{ height: '100%' }}>

                            <div style={{ height: '100%', padding: '0 20px 0 16px', minHeight: '495px' }}>
                                <div className='kwMain' ref={(e) => { this.kwMainDom = e }} >
                                    {
                                        !sourceDataCode
                                            ? <div className='promptUserMessage'>请输入你要查询的数据 或 从列表中选中你感兴趣的内容开始查询</div>
                                            : loading ? <DataLoading />

                                                : <SearchResult
                                                    ref={(e) => { this.searchResultDom = e }}
                                                    // handleDownload={this.handleDownload}
                                                    detailBtn
                                                    addDashboardBtn
                                                    addSearchViewBtn
                                                    funcs={{
                                                        handleDetail: this.handleDetail,
                                                        handleSwitchChart: this.handleSwitchChart,
                                                        handleAggregationData: this.handleAggregationData,
                                                        handleDownload: this.handleDownload,
                                                        handleDrillDownData: this.handleDrillDownData,
                                                        handleAddBoardView: this.handleAddBoardView,
                                                        handleAddSearchView: this.handleAddSearchView
                                                    }}
                                                />
                                    }
                                    {drillIndexComponent}
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
