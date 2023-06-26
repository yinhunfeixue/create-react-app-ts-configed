import React, { Component } from 'react'
import './index.less'
import ModifyFill from 'app_images/ModifyFill.svg'
import { Dropdown, Tooltip, Menu, DatePicker, Icon, Tabs, Row, Col } from 'antd'

import { NotificationWrap } from 'app_common'
import GroupIcon from 'app_images/chart/GroupIcon.svg'

import Widget from '../../boardDetial/content/widget'

import Error from 'app_images/error.svg'
import { getBoardDetial } from 'app_api/dashboardApi'
const { TabPane } = Tabs

const style = {
    width: '100%',
    height: '100%'
}

// @observer
export default class ReportDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isGetResult: false,
            name: '',
            description: '',
            reportData: {},
            TimeFilterComponent: null,
            views: [],
            repViews: [],
            dashViews: [],
            dashPos: [],
            repPos: []
        }
    }

    componentDidMount = async () => {
        this.handleRenderViewContent(this.props.param)
    }

    handleRenderViewContent = async (param) => {
        let res = await getBoardDetial({ ...param })
        if (res.code === 200) {
            let data = res.data
            let views = data.views
            let viewPosition = JSON.parse(data.viewPosition || '[]')
            let repViews = []
            let dashViews = []
            let repViewsObj = []
            let dashViewsObj = []
            let viewPositionObj = {}
            // let repPos = []
            // let dashPos = []

            views.map((val, key) => {
                val.style = style
                if (val.inReports) {
                    repViews.push(val)
                    repViewsObj[val.id] = val
                } else {
                    dashViews.push(val)
                    dashViewsObj[val.id] = val
                }
            })

            if (viewPosition.length > 0) {
                let repViewsPosList = []
                let dashViewsPosList = []

                viewPosition.map((val, key) => {
                    viewPositionObj[val.id] = 1
                    if (repViewsObj[val.id]) {
                        repViewsPosList.push({ ...repViewsObj[val.id], ...val })
                    } else {
                        // dashViewsPosList.push(val)
                        dashViewsPosList.push({ ...dashViewsObj[val.id], ...val })
                    }
                })

                if (repViewsPosList.length > 0) {
                    repViews = repViewsPosList
                }

                if (dashViewsPosList.length > 0) {
                    dashViewsObj.map((obj, k) => {
                        if (!viewPositionObj[k]) {
                            dashViewsPosList.push(obj)
                        }
                    })
                    dashViews = dashViewsPosList
                }
            }

            console.log(data, '----------handleRenderViewContenthandleRenderViewContent----------')
            this.setState({
                reportData: data,
                id: data.id,
                name: data.name,
                description: data.description,
                views: data.views,
                viewPosition: data.viewPosition || '[]',
                repViews,
                dashViews,
                isGetResult: true
            }, () => {
            })
        }
    }

    editCell = (data) => {

    }

    handleViewRender = (data) => {
        this.props.addTab('dataSearchIndex', { data, dataSourceType: 'dashboardView' })
    }

    setIsEmpty = (bl) => {
        this.setState({
            isEmpty: bl
        })
    }

    tabChangeView = () => {

    }

    viewSearchResult = (data) => {
        this.props.addTab('dataSearchIndex', { data, dataSourceType: 'dashboardView' })
        console.log(data, '-----------viewSearchResult-----------')
    }

    render() {
        const {
            name,
            isEmpty,
            description,
            TimeFilterComponent,
            reportData,
            views,
            dashViews,
            repViews,
            isGetResult
        } = this.state
        console.log(dashViews, repViews, '-----------dashViews, repViews------------')
        return (
            <div className='reportBoardTab'>
                <div style={{ padding: '35px 136px 0 136px' }}>
                    <div className='boardTitle'>{name}</div>
                </div>
                <Tabs className='normalTab' defaultActiveKey='1' onChange={this.tabChangeView} tabBarStyle={{ textAlign: 'center' }} >
                    <TabPane tab='数据看板' key='1'>
                        <div className='reportDashboard'>
                            {
                                dashViews.length < 1 ? isGetResult ? <div className='blankContent'><div className='contentIcon'><img src={Error} /><div>看板里没有内容</div></div></div> : null
                                    : <div style={style}>
                                        {
                                            dashViews.map((val, key) => {
                                                return (
                                                    <div className='viewReport' style={{ width: '100%', minHeight: '300px', ...val.style }}>
                                                        <div className='viewBack'>
                                                            <div className='viewHeader'>
                                                                <Dropdown
                                                                    overlay={
                                                                        <div className='dropdownModelRep' >
                                                                            <Row gutter='16'>
                                                                                <Col><div className='downItem' onClick={() => { this.viewSearchResult(val) }}>查看搜索结果</div></Col>
                                                                            </Row>

                                                                        </div>
                                                                    }

                                                                    trigger={['click']}

                                                                >
                                                                    <span style={{ float: 'right', border: '0', cursor: 'pointer', marginTop: '-3px' }} ><img src={GroupIcon} /></span>
                                                                </Dropdown>
                                                                <div className='viewTitle'>
                                                                    <Tooltip placement='topLeft' title={val.name} >
                                                                        {val.name}
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            <div className='viewDesc'>
                                                                <Tooltip placement='topLeft' title={val.description} >
                                                                    {val.description}
                                                                </Tooltip>
                                                            </div>
                                                            <div className='viewBody'>
                                                                <Widget params={{
                                                                    ...val,
                                                                }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                      </div>
                            }
                        </div>
                    </TabPane>
                    <TabPane tab='数据报表' key='2'>
                        <div className='reportDashboard'>
                            {
                                repViews.length < 1 ? isGetResult ? <div className='blankContent'><div className='contentIcon'><img src={Error} /><div>报表里没有内容</div></div></div> : null
                                    : <div style={style}>
                                        {
                                            repViews.map((val, key) => {
                                                return (
                                                    <div className='viewReport' style={{ width: '100%', minHeight: '300px', ...val.style }}>
                                                        <div className='viewBack'>
                                                            <div className='viewHeader'>
                                                                <Dropdown
                                                                    overlay={
                                                                        <div className='dropdownModelRep' >
                                                                            <Row gutter='16'>
                                                                                <Col><div className='downItem' onClick={() => { this.viewSearchResult(val) }}>查看搜索结果</div></Col>
                                                                            </Row>

                                                                        </div>
                                                                    }

                                                                    trigger={['click']}

                                                                >
                                                                    <span style={{ float: 'right', border: '0', cursor: 'pointer', marginTop: '-3px' }} ><img src={GroupIcon} /></span>
                                                                </Dropdown>
                                                                <div className='viewTitle'>
                                                                    <Tooltip placement='topLeft' title={val.name} >
                                                                        {val.name}
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            <div className='viewDesc'>
                                                                <Tooltip placement='topLeft' title={val.description} >
                                                                    {val.description}
                                                                </Tooltip>
                                                            </div>
                                                            <div className='viewBody'>
                                                                <Widget params={{
                                                                    ...val,
                                                                }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                      </div>
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
