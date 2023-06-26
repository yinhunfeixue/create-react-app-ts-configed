import G2 from '@antv/g2'
import Slider from '@antv/g2-plugin-slider'
import { message } from 'antd'
import { getChartData } from 'app_api/metadataApi'
import React, { Component } from 'react'

export default class DmChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            chartData: [],
        }
    }
    componentWillMount = () => {}
    showModal = async (value, data) => {
        this.setState({
            loading: true,
            modalVisible: value,
        })
        let res = await getChartData({ taskResultId: data.taskResultId })
        this.setState({
            loading: false,
        })
        if (res.code == 200) {
            this.setState({
                chartData: res.data,
            })
            let array = this.getDataset(res.data)
            this.initChart(array)
        }
    }
    getDataset = (chartData) => {
        let array = []
        chartData.map((item, index) => {
            array.push(
                {
                    key: index,
                    type: '表规范率',
                    timeDay: item.timeDay,
                    rate: item.tablePassRate,
                    problemNums: item.tableProblemNums,
                    totalNums: item.tableNums,
                    executeId: item.executeId,
                    startTime: item.startTime,
                    endTime: item.endTime,
                },
                {
                    key: index,
                    type: '字段规范率',
                    timeDay: item.timeDay,
                    rate: item.columnPassRate,
                    problemNums: item.columnProblemNums,
                    totalNums: item.columnNums,
                    executeId: item.executeId,
                    startTime: item.startTime,
                    endTime: item.endTime,
                }
            )
        })
        console.log(array, 'array++')
        return array
    }
    initChart = (array) => {
        let { chartData } = this.state
        let that = this
        const chart = new G2.Chart({
            container: 'container',
            forceFit: true,
            height: 300,
            padding: [50, 50, 50, 50],
        })
        chart.source(array)
        chart.tooltip(true, {
            containerTpl: '<div class="g2-tooltip">' + '<div class="g2-tooltip-title" style="margin:10px 0;"></div>' + '<ul class="g2-tooltip-list"></ul></div>',
            itemTpl:
                '<li data-index={index}>{type}: {rate}<br/>{problemName}: {problemNums}<br/>{totalName}: {totalNums}' +
                '<div style="display: {display}; margin: 6px 0 0 0;">执行ID: {executeId}<br/>检查开始时间: {startTime}<br/>检查结束时间: {endTime}</div></li>',
        })
        chart.axis('rate', {
            label: {
                formatter: (val) => {
                    return that.getLabel(val * 100)
                },
            },
        })
        chart.legend({
            position: 'top-right', // 设置图例的显示位置
            layout: 'horizontal',
            itemGap: 20, // 图例项之间的间距
            marker: 'hyphen',
        })
        chart
            .line()
            .position('timeDay*rate')
            .color('type')
            .tooltip('type*rate*problemNums*totalNums*executeId*startTime*endTime', function (type, rate, problemNums, totalNums, executeId, startTime, endTime) {
                return {
                    type,
                    rate: that.getToFixedNum(rate * 100),
                    problemNums,
                    totalNums,
                    problemName: type == '表规范率' ? '不规范表' : '不规范字段',
                    totalName: type == '表规范率' ? '检查表数' : '检查字段数',
                    executeId,
                    startTime,
                    endTime,
                    display: type == '表规范率' ? 'none' : 'block',
                }
            })
        chart.point().position('timeDay*rate').color('type').size(4).shape('circle').tooltip(false).style({
            stroke: '#fff',
            lineWidth: 1,
        })
        chart.render()
        if (chartData.length > 30) {
            let newData = that.getDataset(chartData.slice(0, 30))
            chart.changeData(newData)
            const slider = new Slider({
                container: 'slider', // dom 容器 id 或者 dom 容器对象
                width: 'auto', // slider 的宽度，默认为 'auto'，即自适应宽度
                height: 26, // slider 的高度，默认为 '26px'
                padding: [0, 80, 0, 80], // slider 所在画布 canvas 的内边距，用于对齐图表，默认与图表默认的 padding 相同
                start: 0, // 和状态量对应，滑块的起始点数值，如果是时间类型，建议将其转换为时间戳，方便数据过滤
                end: 29, // 和状态量对应，滑块的结束点数值，如果是时间类型，建议将其转换为时间戳，方便数据过滤
                minSpan: 30 * 24 * 60 * 60 * 1000, // 可选，用于设置滑块的最小范围，时间类型的数值必须使用时间戳，这里设置最小范围为 30 天
                maxSpan: 120 * 24 * 60 * 60 * 1000, // 可选，用于设置滑块的最大范围，时间类型的数值必须使用时间戳，这里设置最大范围为 120 天
                data: array, // slider 的数据源
                xAxis: 'timeDay', // 背景图的横轴对应字段，同时为数据筛选的字段
                yAxis: 'rate', // 背景图的纵轴对应字段
                onChange: ({ startValue, endValue }) => {
                    console.log(startValue, endValue, 'startValue')
                    let start = 0
                    let end = 0
                    chartData.map((item, index) => {
                        if (startValue == item.timeDay) {
                            start = index
                        }
                        if (endValue == item.timeDay) {
                            end = index + 1
                        }
                    })
                    let newData = that.getDataset(chartData.slice(start, end))
                    console.log(start, end, newData, 'index++++')
                    chart.changeData(newData)
                },
            })
            slider.render()
        }
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
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        let { modalVisible, loading } = this.state
        return (
            <div className='dmChart tableBuild'>
                {/*<Modal*/}
                {/*title='规范率走势图'*/}
                {/*visible={modalVisible}*/}
                {/*width={'80%'}*/}
                {/*footer={null}*/}
                {/*onCancel={this.cancel}*/}
                {/*>*/}
                {/*{*/}
                {/*modalVisible?*/}
                {/**/}
                {/*:null*/}
                {/*}*/}
                {/*</Modal>*/}
                {/* <div className='title'>
                    规范率走势图
                    <Tooltip
                        title={
                            <div>
                                <p>说明：</p>
                                <p>1、走势图X轴为日期，Y轴为规范率</p>
                                <p>2、默认展示30个日期的数据，若总体检查日期不满30个日期，则展示全部有检查数据的日期</p>
                                <p>3、若T日未检查，则T日不展示；若T日检查多次，则使用最新一次数据进行展示</p>
                            </div>
                        }
                    >
                        <Icon style={{ color: 'rgb(119,181,227)', margin: '7px 0 0 4px' }} type='info-circle' theme='filled' />
                    </Tooltip>
                </div> */}
                <div id='container'></div>
                <div id='slider'></div>
            </div>
        )
    }
}
