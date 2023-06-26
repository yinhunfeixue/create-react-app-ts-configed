import React, { Component } from 'react'
import _ from 'lodash'

const echarts = require('echarts')

// import './css/index.css';

/*
xAxisData:{name:'日期',data:[]},
    示例： data:["2015/1/5","2015/1/6","2015/1/7"

seriesData:[{"name":'12312','data':'[]},{"name":'12312','data':'[]}],
    示例：
    [{
        name:'视频广告',
        data:[150, 232, 201, 154, 190, 330, 410]
    }]

extraOption:{} //扩展配置
showTopN:number //仅显示前n个系列
dataUnit:[] 单位
tooltipData:[{seriesIndex:number},{name:'',data:[],unit:''}]提示条数据 数据中已存在采取前一种形式，否则采取后一种
*/

export default class DatasetChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: this.props.title,
            loading: this.props.loading || true
        }
        this.itemAreaStyle = {} // {normal: {areaStyle: {type: 'default'}}} 面积图时配置
        this.option = {
            grid: {
                // left: '5%',
                // right: '5%',
                // top: '10',
                // bottom: '10',
                containLabel: true,
            },
            color: ['#329cfd', '#13c2c2', '#2fc25b', '#facc14', '#f04864', '#8543e0'],
            legend: {},
            tooltip: {
            },
            // dataset: {
            //     // 提供一份数据。
            //     source: [
            //         ['product', '2015', '2016', '2017'],
            //         ['Matcha Latte', 43.3, 85.8, 93.7],
            //         ['Milk Tea', 83.1, 73.4, 55.1],
            //         ['Cheese Cocoa', 86.4, 65.2, 82.5],
            //         ['Walnut Brownie', 72.4, 53.9, 39.1]
            //     ]
            // },
            // // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            // xAxis: { type: 'category' },
            // // 声明一个 Y 轴，数值轴。
            // yAxis: {},
            // // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            // series: [
            //     { type: 'bar' },
            //     { type: 'bar' },
            //     { type: 'bar' }
            // ]
        }

        this.typeOptions = {
            'bar': {
                series: {
                    'barMaxWidth': 30
                },
                base: {
                    legend: {
                        formatter: function (name) {
                            if (!name) return ''
                            if (name.length > 8) {
                                name = name.slice(0, 8) + '...'
                            }
                            return name
                        },
                        tooltip: {
                            show: true
                        },
                        type: 'scroll',
                        //      right: 0,
                        top: 0,
                    },
                    axisLabel: {
                        fontSize: 10
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                }
            },
            'line': {
                series: {

                },
                base: {
                    legend: {
                        formatter: function (name) {
                            if (!name) return ''
                            if (name.length > 8) {
                                name = name.slice(0, 8) + '...'
                            }
                            return name
                        },
                        tooltip: {
                            show: true
                        },
                        type: 'scroll',
                        //     right: 0,
                        top: 0,
                    },
                    axisLabel: {
                        fontSize: 10
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                }
            },
            'scatter': {
                series: {

                },
                base: {
                    visualMap: {
                        show: false,
                        inRange: {
                            symbolSize: [10, 30]
                        }
                    }
                }
            },
            'pie': {
                base: {
                    legend: {
                        formatter: function (name) {
                            if (!name) return ''
                            if (name.length > 8) {
                                name = name.slice(0, 8) + '...'
                            }
                            return name
                        },
                        tooltip: {
                            show: true
                        },
                        type: 'scroll',
                        // right: 0,
                        top: 0,
                    }
                }
            }
        }
        this.baseOption = {
            'yAxis': {
                splitNumber: 8
            }
        }
    }

    resize() {
        this.ecObj.resize()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading })
    }

    refreshGraph(arg) {
        const params = {
            ...arg
        }
        this.prepareOption(params)
        this.ecObj.clear()
        console.log(JSON.stringify(this.option), '-----this.option')
        this.ecObj.setOption(this.option)
        this.setState({ loading: false })
    }

    // 计算最大值、最小值，多轴的时候，分割线对齐问题处理
    setyAxisMaxMin = (item) => {
        // console.log(item, '===========startstart================')
        if (item.max !== undefined && item.min !== undefined) {
            let max = item.max
            let min = item.min
            if (Math.abs(max) > Math.abs(min)) {
                max = (Math.abs(max) * 1.2).toFixed(2)
                if (min >= 0) {
                    min = 0
                } else {
                    min = -max
                }
            } else {
                max = (Math.abs(min) * 1.2).toFixed(2)
                if (min >= 0) {
                    min = 0
                } else {
                    min = -max
                }
            }

            item.max = max
            item.min = min
            item.interval = max / item.splitNumber
        }
        // console.log(item, '===========itemitemitem================')
        return item
    }

    componentDidMount() {
        const containerEle = this.refs.container
        this.ecObj = echarts.init(containerEle)
        // this.ecObj.setOption(this.option);
    }

    prepareOption(params = {}) {
        let _this = this

        // 数据长度
        let itemLen = params.option.dataset.source.length - 1
        if (itemLen > 8 && itemLen < 23 && params.option.xAxis) {
            // 当x轴数值项比较多的时候，x轴文本显示倾斜
            params.option.xAxis = _.merge({}, params.option.xAxis, {
                axisLabel: {
                    interval: 0,
                    rotate: -30,
                    fontSize: 10
                }})
        }

        // 处理yAxis问题：1、多Y轴，分隔线不对齐问题
        if (params.option.yAxis && this.baseOption.yAxis) {
            if (_.isArray(params.option.yAxis)) {
                params.option.yAxis.forEach((yEle, index) => {
                    yEle.type = yEle.type || 'value'

                    if (yEle.type === 'value') {
                        params.option.yAxis[index] = _.merge({}, yEle, this.baseOption.yAxis)
                        params.option.yAxis[index] = this.setyAxisMaxMin(params.option.yAxis[index])
                    }
                })
            } else {
                params.option.yAxis.type = params.option.yAxis.type || 'value'
                if (params.option.yAxis.type === 'value') {
                    params.option.yAxis = _.merge({}, params.option.yAxis, this.baseOption.yAxis)
                    params.option.yAxis = this.setyAxisMaxMin(params.option.yAxis)
                }
            }
        }

        if (params.option.series) {
            params.option.series.forEach((element, index) => {
                let chartType = element.type
                // if (chartType == 'pie') {
                //     // 饼图且图列比较多的时候，图例摆放的位置调整位可滚动分页查看
                //     params.option = _.merge({}, params.option, { legend: {
                //         type: 'scroll',
                //         orient: 'vertical',
                //         right: 10,
                //         top: 20,
                //         bottom: 20,
                //     }})
                // }
                if (chartType && this.typeOptions[chartType]) {
                    if (this.typeOptions[chartType]['series']) {
                        params.option.series[index] = _.merge({}, element, this.typeOptions[chartType]['series'])
                    }

                    if (this.typeOptions[chartType]['base']) {
                        params.option = _.merge({}, params.option, this.typeOptions[chartType]['base'])
                    }
                }
            })
        }
        console.log(params, '--------------paramsparams---chart---')
        _.merge(this.option, params.option)
    }

    downLoad = () => {
        var img = new Image()
        img.src = this.ecObj.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        })
        this.downloadFile('数据图.png', img.src)
    }

    downloadFile(fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content)

        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)

        // aLink.dispatchEvent(evt);
        aLink.click()
    }
    // base64转blob
    base64ToBlob(code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length

        let uInt8Array = new Uint8Array(rawLength)

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], { type: contentType })
    }
    render() {
        return (
            <div style={{
                width: this.props.width
                    ? this.props.width
                    : '100%',
                height: this.props.height
                    ? this.props.height
                    : '100%'
            }} ref='container'
            >
            </div>
        )
    }
}
