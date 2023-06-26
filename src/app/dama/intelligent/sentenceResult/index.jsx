import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Layout, Switch } from 'antd'
import store from './store'
import { observer } from 'mobx-react'
import _ from 'underscore'
import '../intelligent.less'
import './index.less'
import '../kwResult/keyWordSearch/index.less'
import SearchResult from '../components/searchResult'
import KwLeftContent from './kwLeftContent/leftContent'
// import KeyWordSearch from './keyWordSearch'
import Search from 'app_images/搜索.svg'
import IntelligentSelect from '../components/intelligentSelect'
// import DataLoading from '../components/loading'
import HistoryQuery from '../components/historyQuery'
import Prompt from 'app_images/prompt.svg'
import Prompt1 from 'app_images/prompt1.svg'
import DataLoading from '../components/loading'
import ProjectUtil from '@/utils/ProjectUtil'

import { addBoardView } from 'app_api/dashboardApi'
import { intelDownload, handleSwitchData, getAggregationData } from 'app_api/intelligentApi'

const { Header, Footer, Sider, Content } = Layout

@observer
export default class SentenceResult extends Component {
    constructor(props) {
        super(props)
        // this.redioDefultValue = this.pageParams.value

        this.state = {
            // tags: [],
            tableLoading: false,
        }
    }
    componentWillMount = () => {
        if (this.pageParams.tempBusinessId) {
            store.setTempBusinessId(this.pageParams.tempBusinessId)
        }
        if (this.pageParams.businessIds) {
            store.setBusinessIds(this.pageParams.businessIds)
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    // componentWillMount = () => {
    //     //
    //     this.init()
    // }

    componentDidMount = () => {
        this.init()
    }

    init = async () => {
        store.clearAll()
        console.log(this.pageParams, '----this.pageParams')
        if (this.pageParams.businessId) {
            store.changeRadioValue(this.pageParams.businessIds.slice(), this.pageParams.type)
            store.setTempBusinessId(this.pageParams.tempBusinessId)
            store.setBusinessIds(this.pageParams.businessIds)
            if (this.pageParams.q) {
                let param = this.pageParams
                this.intelligentSelect.setInputValue(this.pageParams.q)
                if (this.pageParams.dataSourceType === 'dashboardView') {
                    console.log(this.pageParams,'dashboardView++++')
                    // 看板跳转过来的
                    param['chartType'] = this.pageParams.chartType ? this.pageParams.chartType : 'Table'
                    param['chartParam'] = this.pageParams.chartParam
                }
                param.businessIds = this.pageParams.businessIds.slice()
                param.tempBusinessId = this.pageParams.tempBusinessId
                delete param.businessId
                await store.onSearch(param)
                this.searchAction()
            }
        } else {
            store.clearContent()
        }
    }

    handleSearch = async (e) => {
        // this.setState({
        //     tableCurrentPage: 1,
        //     // resultKey: 'result_tab_1'
        // }, () => {
        //     this.getSearchResultData()
        // })

        let req = {}

        let inputValue = this.intelligentSelect.getKeyWord()
        req.q = inputValue
        // req.page = 1
        // req.page_size = 20
        // req.businessId = store.businessId
        req.businessIds = store.businessIds
        // 根据id找radioList对应的中文名传给后台
        // let radioList = store.radioList.slice()
        // radioList.map((item) => {
        //     if (item.id.toString() === req.businessId) {
        //         req.businessName = item.businessTypeName
        //     }
        // })
        await store.onSearch(req)

        // 保存历史问句
        HistoryQuery.store(inputValue, store.businessId)

        this.searchAction()
    }

    // searchAction = () => {
    //     this.result.getSourceData && this.result.getSourceData()
    // }

    searchAction = () => {
        // this.setLoading()
        const { sourceData, sourceDataCode, loading, businessId, nodeList } = store
        let params = {
            sourceData,
            sourceDataCode,
            businessId,
            nodeList,
            loading,
        }
        this.searchResultDom && this.searchResultDom.getSourceData && this.searchResultDom.getSourceData(params)
    }

    onSwitch = (checked) => {
        // console.log(store.businessIds.slice(),'onSwitch')
        if (!checked) {
            // this.props.removeTab('sentenceSearch')
            this.props.addTab('kewordSearch', { type: store.type, businessId: store.businessId, businessIds: store.businessIds, tempBusinessId: store.tempBusinessId })
        }
    }
    addCondition = () => {
        this.intelligentSelect.addKeyWord()
    }

    handleDownload = () => {
        // 原来是直接下载最后一步的数据，现在点到哪个步骤就下载当前的
        // const { stempList } = this.state
        // let queryStr = ''
        // _.map(stempList, (item, key) => {
        //     if (item.active) {
        //         queryStr = item.node
        //     }
        // })
        let queryStr = this.intelligentSelect.getKeyWord()
        // let queryStr = this.splitSelectQuery
        //     ? this.splitSelectQuery
        //     : this.props.keyword
        let req = '?query=' + encodeURIComponent(queryStr) + '&businessIds=' + store.usableBusinessIds + '&tempBusinessId=' + store.tempBusinessId
        intelDownload(req)
    }
    onCompose = async (value, compose, queryNodes, composeList) => {
        let params = {
            queryNodes,
            selected: {
                begIndex: compose.begIndex,
                endIndex: compose.endIndex,
                serializeNode: value.serializeNode
            },
            composeList: composeList,
            unrecognized: store.unrecognized,
            // businessId: store.businessId,
            q: store.inputValue,
            businessIds: store.businessIds
        }
        await store.onSearch(params)
        this.searchAction()
    }

    // 明细接口调用
    handleDetail = (params) => {
        // return getSearchDetail({ ...params, businessId: store.businessId, q:store.inputValue })
    }

    // 图形切换接口调用
    handleSwitchChart = (params) => {
        return handleSwitchData({ ...params, businessIds: store.usableBusinessIds, q: store.inputValue, tempBusinessId: store.tempBusinessId })
    }

    // 统计数据接口调用
    handleAggregationData = (params) => {
        return getAggregationData({ ...params, businessIds: store.usableBusinessIds, q: store.inputValue, tempBusinessId: store.tempBusinessId })
    }

    handleAddBoardView = (params) => {
        return addBoardView({
            ...params,
            businessType: store.type,
            businessIds: store.usableBusinessIds,
            tempBusinessId: store.tempBusinessId,
            // nodeList: store.nodeList,
            queryType: 1,
            queryContent: store.inputValue,
            queryParam: JSON.stringify(store.candidates.queryNodes)
        })
    }

    // 清除右侧所有内容
    clearStatus = () => {
        this.intelligentSelect.setInputValue('')
        store.clearContent()
        store.clearAll()
    }

    render() {
        const { unrecognized, candidates, businessId, tags, loading, sourceDataCode } = store
        // console.log(businessId, '----------businessId-----businessId------------')
        return (
            <div style={{ height: '100%' }}>
                <Layout className='intelligent'>
                    <Sider className='leftContent'>
                        <KwLeftContent
                            searchAction={this.searchAction}
                            businessId={this.pageParams.businessId}
                            businessIds={store.businessIds}
                            itemType={this.pageParams.type}
                            clearStatus={this.clearStatus}
                            {...this.props}
                        />
                    </Sider>
                    <Layout style={{ paddingLeft: '250px', background: '#f5f5f5' }}>
                        <Header>
                            <div className='intelligent_search intelligentSearchTab'>
                                <div className='searchWrap'>
                                    <div className='searchContent '>
                                        <div
                                            className='kwSearch'
                                            style={{ padding: 0 }}
                                        >
                                            <IntelligentSelect
                                                businessId={store.businessId}
                                                businessIds={store.businessIds}
                                                tempBusinessId={store.tempBusinessId}
                                                // onChange={this.searchInputChange}
                                                // defaultValue={inputValue}
                                                ref={(e) => { this.intelligentSelect = e }}
                                                onInputClick={this.handleSearch.bind(this, null)}
                                            />
                                        </div>
                                        <div
                                            className='rightBtn'
                                            style={{ width: '152px' }}
                                        >
                                            <span className='del' onClick={this.handleSearch}>
                                                <img src={Search} style={{ width: '100%' }} />
                                            </span>
                                            <span className='intell'>
                                                <Switch defaultChecked onChange={this.onSwitch} /> 智能取数
                                            </span>
                                            <span className='blankLine' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Header>
                        <Content className='wrap' style={{ height: '100%' }}>
                            {
                                !(candidates && 'queryNodes' in candidates && candidates.composeList.length > 0) && unrecognized && unrecognized.length > 0 && <div className='warnWrap'>
                                    <div className='warnList'>
                                        <img src={Prompt1} className='warnLogo' />
                                        没有查询到和“{store.unrecognized.slice().join(',')}”相关的指标或数据
                                    </div>
                                                                                                                                                               </div>
                            }
                            {
                                candidates && 'queryNodes' in candidates && candidates.composeList.length > 0 &&
                                <div className='warnWrap'>
                                    <div className='warnList'>
                                        <img src={Prompt} className='warnLogo' />
                                    查询中的“{candidates.composeList[0].text}”匹配到了多个指标。以下结果中，我们使用了 “{candidates.composeList[0].current.node}” 进行计算。您还可以查询:
                                        {
                                            candidates.composeList[0].compose.map((value, index) => {
                                                return <a key={index} style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: '16px', textDecoration: 'underline' }} onClick={this.onCompose.bind(this, value, candidates.composeList[0], candidates.queryNodes, candidates.composeList)}>{value.node}</a>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                loading ? null : sourceDataCode === 200 ? <div style={{ padding: '0 20px 0 16px' }}>
                                    <div className='parsing'>
                                        <div className='parsingHeader'>
                                                问句解析后条件如下，你还可以<a onClick={this.addCondition} >+添加条件</a>
                                        </div>
                                        <div className='parsingContent'>
                                            {
                                                tags && tags.map((value, index) => {
                                                    return <div className='parseCard'>{value}</div>
                                                })
                                            }
                                        </div>
                                    </div>
                                                                          </div> : null
                            }

                            <div style={{ height: 'calc(100vh - 161px)', padding: '0 20px 0 16px', minHeight: '495px' }}>
                                {/* <Result ref={(e) => { this.result = e }} handleDownload={this.handleDownload} /> */}

                                <div className='kwMain' >
                                    {
                                        !sourceDataCode
                                            ? <div className='promptUserMessage'>请输入你要查询的数据</div>
                                            : loading ? <DataLoading />

                                                : <SearchResult
                                                    ref={(e) => { this.searchResultDom = e }}
                                                    // handleDownload={this.handleDownload}
                                                    detailBtn={false}
                                                    addDashboardBtn
                                                    funcs={{
                                                        handleDetail: this.handleDetail,
                                                        handleSwitchChart: this.handleSwitchChart,
                                                        handleAggregationData: this.handleAggregationData,
                                                        handleDownload: this.handleDownload,
                                                        handleAddBoardView: this.handleAddBoardView
                                                    }}
                                                  />
                                    }
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
