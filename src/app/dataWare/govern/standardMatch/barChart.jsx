import G2 from '@antv/g2'
import React, { Component } from 'react'
import DataSet from '@antv/data-set'
// import './index.less'

let chart = null
export default class DataStandardBarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            chartData: [],
        }
    }
    componentDidMount = () => {
        this.initChart()
    }
    setChartData = async (value) => {
        console.log(value, 'setChartData')
        await this.setState({
            chartData: value,
        })
        if (chart) {
            console.log(chart, 'chart+++')
            chart.changeData(this.getData(value))
        }
    }
    getData = (data) => {
        let array = []
        data.map((item) => {
            array.push(
                {
                    name: '已落标',
                    rate: item.fullMatchedRate,
                    nums: item.fullMatchedNums,
                    dwLevelName: item.dwLevelName,
                },
                {
                    name: '部分落标',
                    rate: item.partMatchedRate,
                    nums: item.partMatchedNums,
                    dwLevelName: item.dwLevelName,
                },
                {
                    name: '未落标',
                    rate: item.nonMatchedRate,
                    nums: item.nonMatchedNums,
                    dwLevelName: item.dwLevelName,
                }
            )
        })
        console.log(array, 'array')
        return array
    }
    initChart = () => {
        let { chartData } = this.state
        let fields = []
        chartData.map((item) => {
            fields.push(item.dwLevelName)
        })
        let that = this
        const ds = new DataSet()
        const dv = ds.createView().source(that.getData(chartData))
        dv.transform({
            type: 'fold',
            fields: fields,
            key: 'dwLevelName',
            value: 'rate',
        })
        chart = new G2.Chart({
            container: 'dataStandard_container1',
            forceFit: true,
            height: 360,
        })
        chart.source(dv)
        chart.tooltip(true, {
            containerTpl: '<div class="g2-tooltip">' + '<div class="g2-tooltip-title" style="margin:10px 0;"></div>' + '<ul class="g2-tooltip-list"></ul></div>',
            itemTpl: '<li data-index={index}>{name}: {rate}（{nums}）',
        })
        chart.axis('rate', {
            label: {
                formatter: (val) => {
                    return that.getToFixedNum(val * 100)
                },
            },
        })
        chart.axis('dwLevelName', {
            label: {
                autoRotate: false,
                formatter: (value) => {
                    return value.length > 5 ? value.slice(0, 5) + '...' : value
                },
            },
        })
        chart
            .intervalStack()
            .position('dwLevelName*rate')
            .color('name')
            .tooltip('name*rate*nums', function (name, rate, nums) {
                return {
                    name,
                    rate: that.getToFixedNum(rate * 100),
                    nums,
                }
            })
        chart.render()
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    getLabel = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '')
        } else {
            return '0'
        }
    }
    render() {
        let { loading } = this.state
        return (
            <div>
                <div id='dataStandard_container1'></div>
            </div>
        )
    }
}
