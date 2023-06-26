import G2 from '@antv/g2'
import React, { Component } from 'react'

var chart = null
export default class GaugeChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            chartDataValue: this.props.value,
        }
    }
    componentDidMount = () => {
        this.initChart()
    }
    setChartData = async (value) => {
        console.log(value, 'setChartData')
        await this.setState({
            chartDataValue: value,
        })
        if (chart) {
            console.log(chart, 'chart+++')
            let parent = document.getElementById(this.props.id)
            parent.innerHTML = ''
            this.initChart()
        }
    }
    initChart = () => {
        const Shape = G2.Shape
        // 自定义Shape 部分
        Shape.registerShape('point', 'pointer', {
            drawShape(cfg, group) {
                const center = this.parsePoint({
                    // 获取极坐标系下画布中心点
                    x: 0,
                    y: 0,
                })
                // 绘制指针
                group.addShape('line', {
                    attrs: {
                        x1: center.x,
                        y1: center.y,
                        x2: cfg.x,
                        y2: cfg.y,
                        stroke: cfg.color,
                        lineWidth: 4,
                        lineCap: 'round',
                    },
                })
                return group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 9.75,
                        stroke: cfg.color,
                        lineWidth: 3.5,
                        fill: '#fff',
                    },
                })
            },
        })
        console.log(this.state.chartDataValue, '111111')
        const data = [{ value: this.state.chartDataValue * 100 }]
        chart = new G2.Chart({
            container: this.props.id,
            forceFit: true,
            height: 220,
            padding: [0, 0, 30, 0],
        })
        chart.source(data)

        chart.coord('polar', {
            startAngle: (-9 / 8) * Math.PI,
            endAngle: (1 / 8) * Math.PI,
            radius: 0.85,
        })
        chart.scale('value', {
            min: 0,
            max: 100,
            nice: false,
            tickInterval: 12.5,
        })

        chart.axis('1', false)
        chart.axis('value', {
            zIndex: 2,
            line: null,
            label: {
                offset: -15,
                textStyle: {
                    fontSize: 14,
                    textAlign: 'center',
                },
            },
            tickLine: null,
            grid: null,
        })
        chart.legend(false)
        chart.point().position('value*1').shape('pointer').color('#1890FF').active(false)

        // 绘制仪表盘背景
        chart.guide().arc({
            zIndex: 0,
            top: false,
            start: [0, 0.965],
            end: [25, 0.965],
            style: {
                // 底灰色
                stroke: '#FF5252',
                lineWidth: 13,
            },
        })
        chart.guide().arc({
            zIndex: 0,
            top: false,
            start: [25, 0.965],
            end: [75, 0.965],
            style: {
                // 底灰色
                stroke: '#FFD740',
                lineWidth: 13,
            },
        })
        chart.guide().arc({
            zIndex: 0,
            top: false,
            start: [75, 0.965],
            end: [100, 0.965],
            style: {
                // 底灰色
                stroke: '#536DFE',
                lineWidth: 13,
            },
        })
        for (let i = 1; i < 8; i++) {
            chart.guide().arc({
                zIndex: 0,
                start: [12.5 * i, 0.965],
                end: [12.5 * i + 0.3, 0.965],
                style: {
                    // 底灰色
                    stroke: '#fff',
                    lineWidth: 13,
                },
            })
        }

        // 绘制指标数字
        chart.guide().html({
            position: ['50%', '95%'],
            html:
                '<div style="width: 300px;text-align: center;">' +
                '<p style="font-size: 24px;color: #545454;margin: 0;">' +
                (this.state.chartDataValue * 100).toFixed(2).replace(/[.]?0+$/g, '') +
                '%</p>' +
                '<p style="font-size: 14px;color: #333;marginTop: 16px;">' +
                (this.props.title || '') +
                '</p>' +
                '</div>',
        })

        chart.render()
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
