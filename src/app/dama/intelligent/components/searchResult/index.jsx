import React, { Component } from 'react'
// import G2 from '@antv/g2'
import { Row, Col, Card, Menu, Radio, Tooltip } from 'antd'

import _ from 'underscore'
import copy from 'copy-to-clipboard'
import './index.less'
// import LzChart from '../lzChart'
// import Config from '../lzChart/config'
import { NotificationWrap } from 'app_common'
import { LzChart, LzChartConfig as Config } from 'app_component'
import SvgChart from './svgChart'
import ChartSettingForm from './chartSettingForm'
import TableContent from './table'
import TableDetail from './detail'
import TableInspactor from './inspactor'
// import store from '../store'
// import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import DataLoading from '../loading'
import Dashboard from './dashboard'

import SearchView from './searchView'

// import Cache from 'app_utils/cache'
// const Config = LzChart.Config
// const { Global } = G2 // 获取 Global 全局对象
// Global.setTheme('dark') // 传入值为 'default'、'dark' 的一种，如果不是，那么使用 default 主题。

/**
 * 可视化显示结果组件
 * 支持表格、透视表、以及各种图形展示的支持
 */
export default class SearchResult extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sourceData: {}, // 搜索返回的数据
            chartData: {}, // 图部分具体数据
            chartExist: false, // 推荐的图是否存在
            chartLevel: 0, // 推荐等级，0 不优先展示， 1 优先展示
            chartSelectStatus: {
                'Geo': false,
                'Line': false,
                'StackedColumn': false,
                'Bar': false,
                'Bubble': false,
                'Column': false,
                'Scatter': false,
                'Pie': false,
                'StackedBar': false,
                'PivotTable': true
            }, // 图的可选状态
            statistic: [], // 统计数据
            chartType: '', // 图的类型
            chartSetting: '', // 图表设置组件变量
            // eslint-disable-next-line react/no-unused-state
            chartSettingShow: false, // true 已经展开， false 隐藏
            chartSettingTitle: '', // 右侧设置板块标题
            chartSettingKey: '', // 当前active的设置版本ID
            chartShow: true,
            contentComponent: null, // 表格及图表主体内容组件变量
            renderType: 'table', // 图或表或其他效果, 默认表格
            renderTitle: '', // 显示标题
            // loading: false,
            searchstatus: false, // false 未请求，true 已请求
            sourceDataCode: 0,
            chartStatus: true, // false 切换失败，true 切换成功
            visible: false, // 明细数据modal是否显示控制变量
            contentLoading: false, // 主题内容块 LOADING 切换变量
            menuSelectedKeys: [], // 右侧工具条 ACTIVE ID 存储变量
            loading: true,
            msgTitle: '',
            busiGroupId: 0
        }

        this.itemSettings = {}
    }

    componentDidMount() {
        const e = document.createEvent('Event')
        e.initEvent('resize', true, true)
        window.dispatchEvent(e)

        this.init()
    }

    init = () => {
        // this.getSourceData()

        // console.log('remove --- kws_columnsHeader')
        // // // 初始的加载清除 kws_columnsHeader session
        // Cache.remove('kws_columnsHeader')
    }

    setLoading = (loading) => {
        this.setState({
            loading
        })
    }

    // 搜索数据获取后数据处理
    getSourceData = async (params = {}) => {
        if (params.sourceData && params.sourceDataCode) {
            this.setState({
                sourceData: toJS(params.sourceData),
                sourceDataCode: params.sourceDataCode,
                businessId: params.businessId,
                nodeList: params.nodeList,
                busiGroupId: params.busiGroupId
                // loading: params.loading
            }, () => {
                this.searchRenderView()
            })
        } else {
            this.searchRenderView()
        }

        // store.setLoading(false)
    }

    // 搜索触发后数据处理及相关state的设置，及render搜索后第一次结果
    searchRenderView = () => {
        // 清除 用户图表的设定
        this.itemSettings = {}

        let sourceData = this.state.sourceData
        let sourceDataCode = this.state.sourceDataCode

        if (sourceDataCode === 200) {
            if (sourceData.chartx) {
                const chartx = sourceData.chartx
                if (chartx.code === 200) {
                    let data = chartx.data
                    if (!_.isEmpty(data.chartData)) {
                        // data.chartData.options.geoms = data.chartData.options.geoms.slice()
                        // data.chartData.dataset = data.chartData.dataset.slice()
                        this.setState({
                            chartLevel: data.chartData.level,
                            chartType: data.chartData.chartType,
                            chartSelectStatus: data.chartSelectStatus,
                            chartData: data.chartData,
                            chartStatus: true,
                            chartExist: true,
                            msgTitle: '',
                            statistic: data.tableData ? data.tableData : [],
                            renderType: data.chartData.level ? 'chart' : 'table',
                        }, () => {
                            this.initRenderContent()
                            this.rightChartSettingRender(this.state.chartSettingKey)
                        })
                    } else {
                        this.setState({
                            chartLevel: 0,
                            chartType: '',
                            chartSelectStatus: !_.isEmpty(data.chartSelectStatus) ? data.chartSelectStatus : this.state.chartSelectStatus,
                            chartData: {},
                            chartExist: false,
                            chartStatus: false,
                            msgTitle: '',
                            statistic: data.tableData ? data.tableData : [],
                            renderType: 'table'
                        }, () => {
                            this.initRenderContent()
                            this.rightChartSettingRender(this.state.chartSettingKey)
                        })
                    }
                } else {
                    this.setState({
                        chartLevel: 0,
                        chartType: '',
                        // chartSelectStatus: {},
                        chartData: {},
                        chartStatus: false,
                        chartExist: false,
                        msgTitle: '',
                        statistic: [],
                        renderType: 'table'
                    }, () => {
                        this.initRenderContent()
                        this.rightChartSettingRender(this.state.chartSettingKey)
                    })
                }
            } else {
                this.setState({
                    chartLevel: 0,
                    chartType: '',
                    // chartSelectStatus: {},
                    chartData: {},
                    chartExist: false,
                    chartStatus: false,
                    statistic: [],
                    msgTitle: '',
                    renderType: 'table'
                }, () => {
                    this.initRenderContent()
                    this.rightChartSettingRender(this.state.chartSettingKey)
                })
            }

            // this.setState({
            //     loading: false
            // }, () => {

            // })
        } else {
            this.setState({
                chartLevel: 0,
                chartType: '',
                // chartSelectStatus: {},
                chartData: {},
                chartStatus: false,
                statistic: [],
                chartExist: false,
                renderType: 'table',
                msgTitle: '',
                // loading: false
            })
        }

        this.setState({
            loading: false
        })
    }

    handleSwitchUserDefined = (itemSettings) => {
        this.itemSettings = itemSettings
        this.getSwitchData(this.state.chartType, itemSettings)
    }

    // 图切换时数据的获取及处理
    getSwitchData = async (type, chartParam = {}) => {
        let params = {
            // businessId: this.state.businessId,
            chartType: type,
            // nodeList: this.state.nodeList,
            chartParam: chartParam
        }

        // store.setLoading(true)
        this.setState({
            contentLoading: true
        })

        let switchData = await this.props.funcs.handleSwitchChart(params)
        // store.setLoading(false)
        console.log(switchData.data.chartData,'switchData.data.chartData++++')
        this.setState({
            contentLoading: false
        })
        if (switchData.code === 200) {
            let chartData = switchData.data.chartData
            this.setState({
                chartStatus: true,
                chartType: type,
                chartData,
                renderTitle: chartData.title,
                msgTitle: switchData.msg || '',
                // loading: false
            }, () => {
                this.changRenderType(true)
            })
        } else {
            // 切图失败
            this.setState({
                renderType: 'chart',
                chartStatus: false,
                chartType: type,
                chartData: {
                    chartType: type,
                    title: ''
                },
                msgTitle: switchData.msg,
                renderTitle: '',
            }, () => {
                if (this.chart) {
                    // console.log('------切图失败 chart======存在--------')
                    this.chart.reRender({
                        chartData: this.state.chartData,
                        msgTitle: switchData.msg,
                        chartStatus: false
                    })
                } else {
                    // console.log('------切图失败 chart不存在--------')
                    this.renderContent(true, { msgTitle: switchData.msg })
                }
            })
        }
    }

    chartRender = (type) => {
        this.getSwitchData(type, this.itemSettings)
    }

    // 图形切换触发事件
    handleChangeChart = (type) => {
        let chartSelectStatus = this.state.chartSelectStatus
        // console.log(type, '-----changeType')
        if (chartSelectStatus[type]) {
            this.setState({
                chartType: type,
                renderType: 'chart'
            }, () => {
                this.chartRender(type)
                this.chartListRender()
            })
        } else {
            console.log('不可切换！！！')
        }
    }

    rightChartSettingRender = (chartSettingKey) => {
        if (chartSettingKey === 'chartSetting') {
            this.chartSettingRender()
        } else if (chartSettingKey === 'chartList') {
            this.chartListRender()
        } else if (chartSettingKey === 'inspactor') {
            this.inspactorRender()
        } else if (chartSettingKey === 'sql') {
            this.sqlRender()
        }
    }

    // 右侧工具条切换触发事件
    handleChartToolBarClick = (item) => {
        // 已经显示的 CARD 面板，再次点击，隐藏，不是同一个则切换至相应面板
        // this.chart.forceFit()
        if (item.key !== this.state.chartSettingKey) {
            this.rightChartSettingRender(item.key)
        }

        // 展开收起的时候触发图渲染
        // 图形展示下，如果切换右侧工具按钮，不重新加载图
        if (this.state.renderType === 'chart') {
            if (!this.state.chartSettingShow) {
                // 右侧显示的时候
                this.changRenderType(true, false)
            }

            if (item.key === this.state.chartSettingKey) {
                // 点击 工具条，并且配置界面收起的时候
                // this.chart.forceFit()
                this.changRenderType(true, false)
            }
        }

        let menuSelectedKeys = this.state.menuSelectedKeys
        if (menuSelectedKeys.length > 0) {
            if (menuSelectedKeys.includes(item.key)) {
                menuSelectedKeys = []
            } else {
                menuSelectedKeys = [item.key]
            }
        } else {
            menuSelectedKeys = [item.key]
        }

        this.setState({
            menuSelectedKeys,
            chartStatus: this.state.chartStatus,
            chartSettingShow: !(item.key === this.state.chartSettingKey), // 两次点击同一工具按钮收起面板
            chartSettingKey: item.key === this.state.chartSettingKey ? '' : item.key
        })
    }

    // CHART 自定义设置面板渲染
    chartSettingRender = () => {
        let chartSetting = null
        this.setState({
            chartSettingTitle: '图表设置',
            chartSetting: null
        }, () => {
            if (this.state.renderType === 'chart') {
                const settings = this.state.chartData.settings

                // console.log(settings, '--------chartItemschartItems----------')
                if (!_.isEmpty(this.state.chartData) && this.chart) {
                    let chartItems = this.chart.getItems()
                    chartSetting = (
                        <ChartSettingForm
                            settings={settings}
                            chartItems={chartItems}
                            chartType={this.state.chartType}
                            svgChart={SvgChart}
                            validateItemSetting={this.validateItemSetting}
                            handleSwitchUserDefined={this.handleSwitchUserDefined}
                        />
                    )
                } else {
                    chartSetting = <div>该功能数据视图下不可用！</div>
                }
            } else {
                chartSetting = <div>该功能数据视图下不可用！</div>
            }

            this.setState({
                chartSettingTitle: '图表设置',
                chartSetting
            })
        })
    }

    // 图类型 LIST 列表
    chartListRender = () => {
        let chartSelectStatus = this.state.chartSelectStatus
        let chartExist = this.state.chartExist
        console.log(Config, '----------chartSelectStatus---chartListRender------')
        let chartList = _.map(Config['lzChart'], (val, key) => {
            // let cgridStyle = gridStyle
            if (this.state.chartType == key) {
                return (
                    <Card.Grid bordered={false} className='antCardgridActive' style={{ backgroundColor: '#eaedf2' }} >
                        <div className='chartImg' >{SvgChart[key]['img']}</div>
                        <div className='chartName' >{SvgChart[key]['name']}</div>
                    </Card.Grid>
                )
            } else {
                let gridClassName = 'antCardgridActive'
                if (!chartSelectStatus[key]) {
                    // 不能点
                    gridClassName = 'antCardgridNoActive'
                }

                return (
                    <Card.Grid bordered={false} hoverable={gridClassName !== 'antCardgridNoActive'} className={gridClassName} onClick={this.handleChangeChart.bind(this, key)} >
                        <div title={gridClassName === 'antCardgridNoActive' ? '当前条件该图形不支持' : ''} >
                            <div className='chartImg' >{SvgChart[key]['img']}</div>
                            <div className='chartName' >{SvgChart[key]['name']}</div>
                        </div>
                    </Card.Grid>
                )
            }
        })
        this.setState({
            chartSettingTitle: '图表类型',
            chartSetting: chartList
        })
    }

    // 查询详情
    inspactorRender = () => {
        this.setState({
            chartSettingTitle: '查询详情',
            chartSetting: <TableInspactor sourceData={this.state.sourceData} />
        })
    }

    copyToClipboard = () => {
        let copyStatus = copy(this.state.sourceData.sql)
        if (copyStatus) {
            NotificationWrap.success('复制成功！')
        } else {
            NotificationWrap.success('复制失败！')
        }
    }

    sqlRender = () => {
        this.setState({
            chartSettingTitle: '查询SQL',
            chartSetting: <div
                style={{
                    // overflowY: 'auto',
                    height: '100%',
                    // wordBreak: 'break-word'
                }}
            >
                {
                    this.state.sourceData && this.state.sourceData.sql ? <div style={{
                        // overflowY: 'auto',
                        height: '20px'
                    }}>
                        <a style={{ float: 'right' }} onClick={this.copyToClipboard}> 复制</a>
                    </div> : null
                }

                <div
                    style={{
                        overflowY: 'auto',
                        height: '100%',
                        wordBreak: 'break-word',
                        width: '100%'
                    }}
                >
                    {this.state.sourceData.sql || null}
                </div>
            </div>
        })
    }

    // 隐藏功能切换及设置面板
    hiddenSettingPannel = () => {
        this.setState({
            // chartShow: false,
            chartSettingShow: false,
            chartSettingKey: '',
            chartSettingTitle: '',
            chartSetting: '',
            menuSelectedKeys: []
        }, () => {
            if (this.state.renderType === 'chart' && this.chart && this.state.chartStatus) {
                this.chart.forceFit()
            }
        })
    }

    validateItemSetting = (item, itemSettings) => {
        return this.chart.validateItemSetting(item, itemSettings)
    }

    // 搜索触发后优先展示表或图的逻辑处理
    initRenderContent = () => {
        if (this.state.chartExist && this.state.chartLevel) {
            // 搜索后的优先展示判断, 此时优先展示图
            this.setState({
                renderType: 'chart',
                renderTitle: this.state.chartData.title
            }, () => {
                this.changRenderType(true)
            })
        } else {
            if (this.tableContent) {
                this.setState({
                    renderType: 'table',
                    renderTitle: this.state.sourceData.title
                })
                this.tableContent.getTableData(this.state.sourceData)
            } else {
                this.renderContent()
            }
        }
    }

    // 图或表组件 RENDER
    renderContent = (showChart = false, data = {}) => {
        if (this.contentContainer) {
            const { clientHeight } = this.contentContainer
            if (showChart) {
                console.log(this.state.chartData, 'this.state.chartData')
                this.setState({
                    renderType: 'chart',
                    chartType: this.state.chartData.chartType || '',
                    renderTitle: this.state.chartData.title ? this.state.chartData.title : '',
                    contentComponent: <LzChart
                        ref={(e) => { this.chart = e }}
                        chartData={this.state.chartData}
                        chartStatus={this.state.chartStatus}
                        msgTitle={this.state.msgTitle}
                        {...data}
                        getDrillDownData={this.props.funcs.handleDrillDownData}
                    />
                }, () => {
                    if (this.state.chartSettingKey === 'chartSetting') {
                        this.chartSettingRender()
                    }
                })
            } else {
                this.setState({
                    renderType: 'table',
                    // chartType: '',
                    renderTitle: this.state.sourceData.title,
                    contentComponent: <TableContent
                        ref={(e) => { this.tableContent = e }}
                        absolute
                        sourceData={{
                            ...this.state.sourceData,
                            headCfg: this.props.headCfg || {}
                        }}
                        statistic={this.state.statistic}
                        tableStaticsHide={this.props.tableStaticsHide}
                        getAggregationData={this.props.funcs.handleAggregationData}
                        getDrillDownData={this.props.funcs.handleDrillDownData}
                        {...data}
                    />
                }, () => {
                    if (this.state.chartSettingKey === 'chartSetting') {
                        this.chartSettingRender()
                    }
                })
            }
        }
    }

    /**
     * @param reRender 是否重绘
     */
    changRenderType = (showChart, reRender = true) => {
        if (showChart) {
            if (!_.isEmpty(this.state.chartData)) {
                if (this.state.chartType && this.chart) {
                    this.chart.reRender({
                        chartData: this.state.chartData,
                        msgTitle: this.state.msgTitle,
                        chartStatus: this.state.chartStatus,
                        reRender
                    })
                } else {
                    this.renderContent(true)
                }
            }
        } else {
            this.renderContent(false)
        }
    }

    // 下载事件
    downloadImageChart = () => {
        let sourceData = this.state.sourceData
        let total = sourceData.total
        if (total > 0) {
            if (this.state.renderType === 'chart' && this.state.chartType && this.chart) {
                if (this.state.chartType === 'PivotTable') {
                    this.props.funcs.handleDownload && this.props.funcs.handleDownload()
                } else {
                    this.chart.downloadImage(this.state.renderTitle)
                }
            } else {
                console.log('非图下载逻辑！')
                if (this.state.renderType === 'table') {
                    this.props.funcs.handleDownload && this.props.funcs.handleDownload()
                }
            }
        }
    }

    showDetail = () => {
        this.detailTable.visibleModal(true)
        // this.setState({
        //     visible: true,
        // }, () => {
        //     this.detailTable.getTableData()
        // })
    }

    showDashboard = () => {
        let params = {
            title: this.state.renderTitle
        }
        this.dashboardDom.visibleModal(true, params)
    }

    showSearchView = () => {
        let params = {
            busiGroupId: this.state.busiGroupId
        }
        this.searchViewDom.visibleModal(true, params)
    }

    handleAddBoardView = (params) => {
        console.log(this.itemSettings, this.state.chartData, '----------this.itemSettings')
        let cItemSettings = {}
        if (_.isEmpty(this.itemSettings) && this.state.chartData && this.state.chartData.settings && this.state.chartData.settings.selectedValues) {
            let selectedValues = this.state.chartData.settings.selectedValues
            _.map(selectedValues, (element, key) => {
                if (Array.isArray(element)) {
                    cItemSettings[key] = []
                    _.map(element, (val, k) => {
                        cItemSettings[key].push(val.name)
                    })
                } else {
                    cItemSettings[key] = element
                }
            })
        }

        //  console.log(this.itemSettings, cItemSettings, '----------this.itemSettings')

        let param = {
            ...params,
            chartType: this.state.renderType === 'chart' ? this.state.chartType : '',
            chartParam: this.state.renderType === 'chart' ? !_.isEmpty(this.itemSettings) ? this.itemSettings : !_.isEmpty(cItemSettings) ? cItemSettings : {} : {}
        }
        if (this.props.funcs.handleAddBoardView) {
            return this.props.funcs.handleAddBoardView(param)
        }
    }

    handleAddSearchView = (params) => {
        let param = {
            ...params,
            // chartType: this.state.renderType === 'chart' ? this.state.chartType : '',
            // chartParam: this.state.renderType === 'chart' ? this.itemSettings : {}
        }
        if (this.props.funcs.handleAddSearchView) {
            return this.props.funcs.handleAddSearchView(param)
        }
        return {}
    }

    render() {
        const {
            chartData,
            chartType,
            chartSetting,
            chartSettingShow,
            chartSettingTitle,
            chartShow,
            chartSettingKey,
            contentComponent,
            renderType,
            renderTitle,
            // loading,
            // sourceData,
            // sourceDataCode,
            menuSelectedKeys,
            contentLoading,
            sourceData,
            sourceDataCode,
            loading
        } = this.state

        // console.log(sourceDataCode, loading, '---------sourceDataCode--loading------')
        return (
            <div className='kwSearchMainContent' >
                {
                    sourceDataCode === 500 ? <div className='promptUserWrong'><span>出错啦</span>{SvgChart['Wrong']['img']}</div>
                        : sourceDataCode === 200 && sourceData.total != undefined ? <div className='content' >
                            <div className='rowLeft'>
                                <div className='bkTitlePanel' >
                                    <Row type='flex' >
                                        <Col span={12}>
                                            <Tooltip placement='topLeft' title={renderTitle} >
                                                <h1>{renderTitle}</h1>
                                            </Tooltip>
                                        </Col>
                                        <Col span={12} className='bkChartTable'>
                                            {!this.props.downBtnHide ? <div className='bk-icon-down' title='数据下载' onClick={this.downloadImageChart} >{SvgChart['Down']['img']}</div> : null}
                                            {this.props.detailBtn ? <div className='bk-icon-desc' onClick={this.showDetail} title='明细数据'>{SvgChart['Desc']['img']}</div> : null}
                                            {this.props.addDashboardBtn ? <div className='bk-icon-desc' onClick={this.showDashboard} title='添加至看板'>{SvgChart['Dashboard']['img']}</div> : null}
                                            {this.props.addSearchViewBtn ? <div className='bk-icon-desc' onClick={this.showSearchView} title='添加搜索视图'>{SvgChart['TagSaveIcon']['img']}</div> : null}

                                            {!this.props.dataGraphHide
                                                ? <Radio.Group value={renderType} buttonStyle='solid'>
                                                    <Radio.Button value='table' title='' onClick={this.changRenderType.bind(this, false)}><div title='表格视图'>{SvgChart['Table']['img']}</div></Radio.Button>
                                                    <Radio.Button value='chart' title='' disabled={!!_.isEmpty(chartData)} style={{ 'cursor': !_.isEmpty(chartData) ? 'pointer' : 'default' }} onClick={this.changRenderType.bind(this, true)}><div title='图表视图' className='disabledBtn'><span>{SvgChart[chartType || 'Chart']['img']}</span></div></Radio.Button>
                                                </Radio.Group> : null}
                                        </Col>
                                    </Row>
                                </div>
                                <div className='bkAnswerBody' ref={(e) => { this.contentContainer = e }}>
                                    {
                                        !chartShow ? null : contentLoading ? <DataLoading /> : contentComponent
                                    }
                                </div>
                            </div>
                            <div className='rowRight' style={{ display: !this.props.rightHide ? '' : 'none' }}>
                                <div className='chartListPanel' style={{ display: chartSettingShow ? 'block' : 'none' }} >
                                    <Card bordered={false} title={chartSettingTitle} className='rightCustomized' extra={<i onClick={this.hiddenSettingPannel} >{SvgChart['Colose']['img']}</i>} >
                                        {/* {chartSettingKey==='chartSetting' ? <ChartSettingForm settings={chartData.data.chartData.settings} chart={this.chart} /> : chartSetting} */}

                                        {chartSetting}

                                    </Card>

                                </div>
                                <div className='chartToolBar' >
                                    <Menu onClick={this.handleChartToolBarClick} selectedKeys={menuSelectedKeys} style={{ border: 0 }} >
                                        <Menu.Item key='chartList' ><div title='图表类型'>{SvgChart['Chart']['img']}<i>{SvgChart['ChartHover']['img']}</i></div></Menu.Item>
                                        <Menu.Item key='chartSetting' ><div title='图表设置'>{SvgChart['Setting']['img']}<i>{SvgChart['SettingHover']['img']}</i></div></Menu.Item>
                                        <Menu.Item key='inspactor' ><div title='INSPACTOR'>{SvgChart['Inspactor']['img']}<i>{SvgChart['InspactorHover']['img']}</i></div></Menu.Item>
                                        <Menu.Item key='sql' ><div title='查询SQL' style={{ fontWeight: '600' }} >SQL</div></Menu.Item>
                                    </Menu>
                                </div>
                            </div>
                        </div> : <div className='promptUserWrong'>没有查询到相关的指标或数据，请重新输入</div>
                }
                <TableDetail ref={(dom) => { this.detailTable = dom }} handleDetail={this.props.funcs.handleDetail} />

                <Dashboard ref={(dom) => { this.dashboardDom = dom }} handleAddBoardView={this.handleAddBoardView} />

                <SearchView ref={(dom) => { this.searchViewDom = dom }} importFrom={this.props.importFrom} handleAddSearchView={this.handleAddSearchView} radioOptions={this.props.searchViewRadioOptions} />
            </div>
        )
    }
}
