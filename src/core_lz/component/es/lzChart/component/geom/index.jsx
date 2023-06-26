import React, { Component } from 'react'
import G2 from '@antv/g2'
import './index.less'
import _ from 'lodash'
const Util = G2.Util
const { Global } = G2 // 获取 Global 全局对象
// Global.setTheme('dark') // 传入值为 'default'、'dark' 的一种，如果不是，那么使用 default 主题。

/**
 *  g2 图表渲染
 */
export default class ChartGeom extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: this.props.title,
            loading: this.props.loading || true,
            chartData: this.props.chartData || {},
            containerId: 'chartViewer',
            drillDisplay: 'none',
            drillLeft: 'auto',
            drillTop: 'auto',
            // indexHtml: null
        }

        this.containerOption = {
            forceFit: true,
            // width: '80%', // 指定图表宽度
            // height: window.innerHeight, // 指定图表高度
            options: {
            }
        }

        //  下钻指标列表
        this.drillItems = {}
        this.options = {}
    }

    // 生成容器id，避免多次引用重复
    getContainerId = () => {
        let idNumber = parseInt(100 * Math.random() * 10 * Math.random())
        let containerId = 'chartViewer' + idNumber
        this.setState({
            containerId,
        })
    }

    componentWillMount() {
        this.getContainerId()
    }

    componentDidMount() {
        this.init()
    }

    init = () => {
        this.chartInit()

        if (this.state.chartData && !_.isEmpty(this.state.chartData)) {
            this.chartRender()
        }
    }

    chartInit = () => {
        if (this.chartObj && !this.chartObj.destroyed) {
            this.chartObj.destroy()
        }

        if (this.state.chartData.colors) {
            console.log(this.state.chartData.colors, '----------this.state.chartData.colors------------')

            // let theme = Util.deepMix({
            //     defaultColor: this.state.chartData.colors[0],
            //     colors: this.state.chartData.colors
            // }, G2.Global)
            // G2.Global.setTheme(theme)

            // Global.registerTheme('newTheme', {
            //     colors: [ 'red', 'blue', 'yello' ]
            // })
            // G2.Global.colors = this.state.chartData.colors

            const theme = G2.Util.deepMix({
                colors: this.state.chartData.colors
            }, G2.Theme)

            G2.Global.setTheme(theme)
        }

        if (this.state.chartData.chartType) {
            let domHeight = G2.DomUtil.getHeight(this.chartViewerDom)
            domHeight = domHeight - 16
            if (this.props.height) {
                domHeight = this.props.height
            }
            if (this.state.chartData.dataset) {
                this.handleOptions(this.state.chartData)
                let containerOption = _.merge({}, this.containerOption, this.options.containerOption)
                this.chartObj = new G2.Chart({
                    container: this.state.containerId, // 指定图表容器 ID
                    forceFit: true,
                    padding: 'auto',
                    background: {
                        fill: '#fff'
                    },
                    height: domHeight || window.innerHeight,
                    ...containerOption,
                })
                console.log(JSON.stringify({
                    container: this.state.containerId, // 指定图表容器 ID
                    forceFit: true,
                    padding: 'auto',
                    background: {
                        fill: '#fff'
                    },
                    height: domHeight || window.innerHeight,
                    ...containerOption,
                }))

                this.chartObj.on('tooltip:change', (ev) => {
                    if (ev.items) {
                        this.drillItems = {
                            x: ev.x,
                            y: ev.y,
                            items: ev.items
                        }
                    }
                })

                this.chartObj.on('dblclick', (ev) => {
                    let selectedValues = this.state.chartData.settings.selectedValues
                    _.map(selectedValues, (value, key) => {
                        _.map(value, (v, k) => {
                            selectedValues[v['name']] = v
                        })
                    })

                    let selectRow = []
                    let item = this.drillItems
                    _.map(item['items'], (value, key) => {
                        let origin = value['point']['_origin']
                        _.map(origin, (v, k) => {
                            if (selectedValues[k] && selectedValues[k]['path']) {
                                selectRow.push({
                                    value: v,
                                    path: selectedValues[k]['path']
                                })
                            }
                        })
                    })

                    let params = {
                        item: item,
                        selectRow,
                        layout: {
                            drillDisplay: 'block',
                            drillLeft: item.x + 260,
                            // drillTop: '20%'
                            drillTop: item.y + 100
                        }
                    }

                    console.log(this.drillItems, params, '--------------drillItemsdrillItems--------------')
                    if (this.drillItems) {
                        this.renderIndexList(params)
                    }
                })

                console.log({
                    container: 'chartViewer', // 指定图表容器 ID
                    forceFit: true,
                    padding: 'auto',
                    background: {
                        fill: '#fff'
                    },
                    height: domHeight || window.innerHeight,
                    // renderer: 'svg',
                    ...containerOption,
                }, '----------------chartInit--')
            }
        }
    }

    handleOptions = (data) => {
        this.options = this.props.chartFactory.handleOptions(data)
    }

    chartRender = () => {
        const chartData = this.state.chartData
        if (chartData && !_.isEmpty(chartData) && this.chartObj && chartData.dataset) {
            let options = this.options.options
            console.log(JSON.stringify(options), '----chartRender----options------')
            const view = this.chartObj.view(
                {
                    options
                }
            )
            view.source(chartData.dataset)

            this.chartObj.render()
            this.chartObj.forceFit()
        }
    }

    rePaint = () => {
        this.chartObj.clear()
        this.chartRender()
    }

    /**
     * 重新整个渲染
     */
    reRender = (data) => {
        // this.chartData = data

        this.setState({
            chartData: data.chartData,
        }, () => {
            this.chartInit()
            this.chartRender()
        })
    }

    // 强制适配容器宽度
    forceFit = () => {
        if (this.chartObj) {
            this.chartObj.forceFit()
        }
    }

    // 图片下载
    downloadImage = (name) => {
        if (this.chartObj) {
            this.chartObj.downloadImage(name)
        }
    }

    // 下钻
    renderIndexList = async (params) => {
        if (this.props.getDrillDownData) {
            this.props.getDrillDownData(params)
        }
    }

    render() {
        const { containerId } = this.state
        return (
            <div className='lzChart' style={{ height: '100%', width: '100%', minHeight: '100%' }}>
                <div id={containerId} ref={(e) => { this.chartViewerDom = e }} style={{ height: '97%', width: '100%', margin: '0px auto', minHeight: '97%' }} ></div>
            </div>
        )
    }
}
