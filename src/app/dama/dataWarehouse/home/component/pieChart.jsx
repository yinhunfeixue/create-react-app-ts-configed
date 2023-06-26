import G2 from '@antv/g2'
import React, { Component } from 'react'

let chart = null
export default class WelcomePieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            chartData: [],
            totalCount: 0,
        }
    }
    componentDidMount = () => {
        this.initChart()
    }
    setChartData = async (value) => {
        console.log(value, 'setChartData')
        await this.setState({
            chartData: value.citeOdsViolationTableDetail,
            totalCount: value.citeOdsViolationTableNumber,
        })
        if (chart) {
            console.log(chart, 'chart+++')
            let parent = document.getElementById(this.props.id)
            parent.innerHTML = ''
            this.initChart()
            // chart.changeData(value.citeOdsViolationTableDetail)
        }
    }
    initChart = () => {
        let { chartData } = this.state
        let that = this
        chart = new G2.Chart({
            container: that.props.id,
            forceFit: true,
            ...that.props.heightInfo,
        })
        chart.source(chartData)
        chart.coord('theta', {
            radius: 0.75,
            innerRadius: 0.6,
        })
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {rate}（{value}）</li>',
        })
        // chart.guide().html({
        //     position: [ '50%', '50%' ],
        //     html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">总计<br><span style="color:#8c8c8c;font-size:20px">' + this.state.totalCount + '</span></div>',
        //     alignX: 'middle',
        //     alignY: 'middle'
        // });
        // chart.legend(false)
        chart.legend({
            position: 'right',
            itemGap: 20,
            ...that.props.lengendInfo,
        })
        const interval = chart
            .intervalStack()
            .position('tableCount')
            .color('levelTagValueName', ['#536DFE', '#69F0AE', '#FFD740', '#40C4FF', '#FF5252', '#E040FB'])
            .label('rate', {
                formatter: (val, item) => {
                    return item.point.rate + '%'
                },
            })
            // .label('rate', {
            //     offset: -8,
            //     textStyle: {
            //         fill: 'white',
            //         fontSize: 12,
            //         shadowBlur: 2,
            //         shadowColor: 'rgba(0, 0, 0, .45)'
            //     },
            //     rotate: 0,
            //     autoRotate: false,
            //     formatter: (text, item) => {
            //         return String(item.point.rate);
            //     }
            // })
            .tooltip('levelTagValueName*tableCount*rate', (levelTagValueName, tableCount, rate) => {
                return {
                    name: levelTagValueName,
                    value: tableCount,
                    rate: rate + '%',
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
                <div id={this.props.id}></div>
            </div>
        )
    }
}
