// import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Icon } from 'antd'
import store from '../kwResult/store'
import { observer } from 'mobx-react'
import ProjectUtil from '@/utils/ProjectUtil'
import { toJS } from 'mobx'
import './index.less'
import _ from 'underscore'
// import { PanelContainer } from 'app_common'
import QueueAnim from 'rc-queue-anim'
import SvgChart from './svgChart'
import Search from 'app_images/搜索.svg'
import { viewSearchInfo } from 'app_api/dashboardApi'

@observer
export default class IntelligentIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indexSampleList: []
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount = async () => {
        if (this.pageParams && this.pageParams.data && this.pageParams.dataSourceType) {
            // this.props.removeTab('dataSearchIndex')
            let data = this.pageParams.data
            let res = await this.handlePinboardViewData(data)
            console.log(res, '----------resresresres-----------')
            if (res.code === 200) {
                let vData = res.data
                // console.log(vData, '----------vDatavData-----------')
                if (vData.queryType) {
                    // 智能取数
                    this.props.addTab('sentenceSearch', {
                        queryNodes: vData.queryParam || '',
                        type: vData.businessType,
                        businessId: vData.businessId,
                        businessIds: vData.businessIds,
                        q: vData.queryContent || '',
                        chartType: vData.chartType,
                        chartParam: vData.chartParam,
                        dataSourceType: this.pageParams.dataSourceType,
                        tempBusinessId: vData.tempBusinessId || '',
                    })
                } else {
                    // keywordSearch
                    this.props.addTab('kewordSearch', {
                        nodeList: vData.queryParam ? JSON.parse(vData.queryParam) : [],
                        type: vData.businessType,
                        businessId: vData.businessId,
                        businessIds: vData.businessIds,
                        dataSourceType: this.pageParams.dataSourceType,
                        tempBusinessId: vData.tempBusinessId || '',
                        tempFormulaList: vData.tempFormulaList || '',
                        chartType: vData.chartType,
                        chartParam: vData.chartParam
                    })
                }
            } else {

            }
        } else {
            this.init()
        }
    }

    init = async () => {
        let params = {}
        if (this.pageParams && this.pageParams.businessId) {
            params = this.pageParams
            // store.changeRadioValue(this.props.param.businessId, this.props.param.type || 0)
        }

        await store.getIndexSampleData(params)
        let indexSampleList = toJS(store.indexSampleList)
        this.searchAction(indexSampleList)

        this.setState({
            indexSampleList
        })
    }

    // handleSettingClick=() => {
    //     this.props.addTab('设置')
    // }

    searchAction = (indexSampleData) => {
        let indexSampleList = indexSampleData ? indexSampleData : this.state.indexSampleList
        if (indexSampleList.length > 0) {
            let businessId = indexSampleList[0]['businessId']
            let busiGroupId = indexSampleList[0]['busiGroupId']
            let type = indexSampleList[0]['type']
            console.log({ type, businessId }, '----------{ type, businessId }--------------')
            // this.props.removeTab('dataSearchIndex')
            this.props.addTab('kewordSearch', { type, businessId, busiGroupId })
        } else {
            // this.props.removeTab('dataSearchIndex')
            this.props.addTab('kewordSearch')
        }
    }

    sampleClick = (params, type, businessId, busiGroupId) => {
        console.log('2313213213213213')
        let indexSampleList = this.state.indexSampleList
        if (indexSampleList.length > 0) {
            // let businessId = businessId
            // this.props.removeTab('dataSearchIndex')
            this.props.addTab('kewordSearch', { ...params, type, businessId: businessId, busiGroupId })
        }
    }

    handlePinboardViewData = async (data) => {
        return await viewSearchInfo({ id: data.id })
    }

    render() {
        let { indexSampleList } = this.state
        // 因为要竖排 所以分成了两个数组
        console.log(indexSampleList, '---------indexSampleListindexSampleList---------')

        return (
            <div className='kw_intelligent_index' >

                {/* <QueueAnim component='div' type='right' className='intelligent_home_img' >
                    <em key='a'></em>
                    
                    <p key='b'><b>欢迎使用数据搜索!</b></p>
                    
                </QueueAnim>
                <div className='clearfix'></div>
                <div style={{ marginTop: '20px' }}>
                    <a className='bk-search-box' onClick={this.searchAction} >
                        <img src={Search} />
                    </a>
                </div>

                <div className='dataSearchList'>
                    <div className='dataSearchListTitle'>如何开始数据探查之旅?</div>
                    <div className='dataSearchListul1'>
                        <div className='dataSearchListul'>
                            <ul>
                                <li className='dataSearchListIcon1'>
                                    <h2>添加一个度量指标</h2>
                                    <b>{SvgChart['Icon1']['img']}</b>
                                    <span>度量指标是一个数值，可以用于统计和计算。</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'>
                                        {
                                            indexSampleList['0'] && _.map(indexSampleList['0']['samples'], (val, index) => {
                                                return (
                                                    <i key={index} onClick={this.sampleClick.bind(this, val, indexSampleList['0']['type'], indexSampleList['0']['businessId'], indexSampleList['0']['busiGroupId'])} >{val.showName}</i>
                                                )
                                            })
                                        }
                                    </div>
                                </li>
                                <li className='dataSearchListIcon2'>
                                    <h2>添加一个维度</h2>
                                    <b>{SvgChart['Icon2']['img']}</b>
                                    <span>当你把一个维度运用在度量指标上时，可以把把度量进行分组统计或计算。</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'>
                                        {
                                            indexSampleList['1'] && _.map(indexSampleList['1']['samples'], (val, index) => {
                                                return (
                                                    <i key={index} onClick={this.sampleClick.bind(this, val, indexSampleList['1']['type'], indexSampleList['1']['businessId'], indexSampleList['0']['busiGroupId'])} >{val.showName}</i>
                                                )
                                            })
                                        }
                                    </div>
                                </li>
                                <li className='dataSearchListIcon3'>
                                    <h2>添加一个过滤条件</h2>
                                    <b>{SvgChart['Icon3']['img']}</b>
                                    <span>过滤条件可以帮助你缩小结果范围。过滤条件可以作用在度量上，也可以作用在维度上。</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'>
                                        {
                                            indexSampleList['2'] && _.map(indexSampleList['2']['samples'], (val, index) => {
                                                return (
                                                    <i key={index} onClick={this.sampleClick.bind(this, val, indexSampleList['2']['type'], indexSampleList['2']['businessId'], indexSampleList['0']['busiGroupId'])} >{val.showName}</i>
                                                )
                                            })
                                        }
                                    </div>
                                </li>
                                <li className='dataSearchListIcon4'>
                                    <h2>计算</h2>
                                    <b>{SvgChart['Icon4']['img']}</b>
                                    <span>支持对指标进行计算，包括合计、平均值，计数，按年汇总等。</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'>
                                        {
                                            indexSampleList['3'] && _.map(indexSampleList['3']['samples'], (val, index) => {
                                                return (
                                                    <i key={index} onClick={this.sampleClick.bind(this, val, indexSampleList['3']['type'], indexSampleList['3']['businessId'], indexSampleList['0']['busiGroupId'])} >{val.showName}</i>
                                                )
                                            })
                                        }
                                    </div>
                                </li>
                                <li className='dataSearchListIcon5'>
                                    <h2>排序</h2>
                                    <b>{SvgChart['Icon5']['img']}</b>
                                    <span>支持对指标进行计算，包括合计、平均值，计数，按年汇总等。</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'>
                                        {
                                            indexSampleList['4'] && _.map(indexSampleList['4']['samples'], (val, index) => {
                                                return (
                                                    <i key={index} onClick={this.sampleClick.bind(this, val, indexSampleList['4']['type'], indexSampleList['4']['businessId'], indexSampleList['0']['busiGroupId'])} >{val.showName}</i>
                                                )
                                            })
                                        }
                                    </div>
                                </li>
                                <li className='dataSearchListIcon6'>
                                    <h2>可视化展示</h2>
                                    <b>{SvgChart['Icon6']['img']}</b>
                                    <span>根据您输入的内容，自动将结果进行可视化的展示，清晰直观的对数据进行探查</span>
                                    <em>示例</em>
                                    <div className='dataSearchListTag'><i onClick={this.searchAction} >开始使用</i></div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                <div className='clearfix'></div> */}

            </div>
        )
    }
}
