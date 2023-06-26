import G2 from '@antv/g2'
import React, { Component } from 'react'

let chart = null
export default class WelcomeBarChart extends Component {
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
            chart.changeData(value)
        }
    }
    initChart = () => {
        let { chartData } = this.state
        let that = this
        chart = new G2.Chart({
            container: 'dataWare_container1',
            forceFit: true,
            height: 260,
            // padding: [ 50, 50, 50, 50 ]
        })
        chart.source(chartData)
        chart.axis('value', {
            label: {
                formatter: (val) => {
                    return that.getToFixedNum(val * 100)
                },
            },
        })
        chart
            .interval()
            .position('key*value')
            .tooltip('key*value', function (key, value) {
                return {
                    key,
                    value: that.getToFixedNum(value * 100),
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
                <div id='dataWare_container1'></div>
            </div>
        )
    }
}
