import { Chart } from '@antv/g2'
import React, { Component } from 'react'
import moment from 'moment'

let chart = null
export default class WelcomeBarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            chartData: props.chartData,
        }
    }
    componentDidMount = () => {
        this.initChart()
    }
    initChart = () => {
        let { chartData } = this.state
        chart = new Chart({
            container: 'dataWare_container1aa',
            forceFit: true,
            height: 280,
            padding: [40, 50, 40, 60],
        })
        chart.source(chartData)
        chart.scale({
            assessColumnRatio: {
                min: 0,
                max: 100,
                alias: '落标率',
            },
            markingColumnRatio: {
                min: 0,
                max: 100,
                alias: '对标率',
            },
        })

        chart.axis('assessColumnRatio', false)
        chart.axis('markingColumnRatio', {
            label: {
                formatter: (val) => {
                    return val + '%'
                },
            },
        })

        chart.legend({
            position: 'top-right', // 设置图例的显示位置
            layout: 'horizontal',
            // itemGap: 20, // 图例项之间的间距
            marker: 'hyphen',
            offsetX: 25,
            offsetY: 0,
        })

        chart.line().position('createTime*markingColumnRatio').color('#1890FF')
        chart.line().position('createTime*assessColumnRatio').color('#42D0D5')

        chart.render()
    }

    render() {
        let { loading } = this.state
        return <div style={{ overflow: 'hidden' }} id='dataWare_container1aa'></div>
    }
}
