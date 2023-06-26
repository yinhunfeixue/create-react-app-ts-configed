import React, { Component } from 'react';
import * as echarts from 'echarts'
export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            configInfo: this.props.configInfo,
            labelHtml: this.props.data[0].name,
            valueHtml: this.props.data[0].value,
            id: this.props.id,
        }
    }
    initChart = () => {
        var myChart = null
        var option = {}
        var currentIndex = 0
        var fhourTime = null

        const { id, data, configInfo } = this.props
        // this.setState({
        //     labelHtml: this.props.data[0].name,
        //     valueHtml: this.props.data[0].value,
        // })
        console.log(data, 'initChart')
        var chartDom = document.getElementById(id)
        if (JSON.stringify(myChart) !== 'null') {
            myChart.dispose()
            // clearInterval(fhourTime)
        }
        myChart = echarts.getInstanceByDom(chartDom)
        myChart = echarts.init(chartDom)
        option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}：{d}%'
            },
            legend: {
                ...configInfo.legendInfo
            },
            // 饼图颜色
            color: ['#40BFF6', '#3A9DFF', '#F7C739', '#76DEE2', '#42D0D5', '#40BFF6'],
            series: [
                ...configInfo.seriesInfo
            ]
        }
        option && myChart.setOption(option)
        // 饼图自动播放
        // var dataLen = option.series[0].data.length
        // let that = this
        // fhourTime = setInterval(function () {
        //     myChart.dispatchAction({
        //         type: 'downplay',
        //         seriesIndex: 0,
        //         dataIndex: currentIndex
        //     })
        //     currentIndex = (currentIndex + 1) % dataLen
        //     myChart.dispatchAction({
        //         type: 'highlight',
        //         seriesIndex: 0,
        //         dataIndex: currentIndex
        //     })
        //     that.setState({
        //         labelHtml: that.props.data[currentIndex].name,
        //         valueHtml: that.props.data[currentIndex].value
        //     })
        // }, 2000)
        // // 鼠标移入停止轮播
        // myChart.on('mousemove', function (e) {
        //     clearInterval(fhourTime)
        //     // 取消轮播当前高亮效果
        //     myChart.dispatchAction({
        //         type: 'downplay',
        //         seriesIndex: 0,
        //         dataIndex: currentIndex
        //     })
        // })
        // // 鼠标移出恢复轮播
        // myChart.on('mouseout', function () {
        //     fhourTime = setInterval(function () {
        //         myChart.dispatchAction({
        //             type: 'downplay',
        //             seriesIndex: 0,
        //             dataIndex: currentIndex
        //         })
        //         currentIndex = (currentIndex + 1) % dataLen
        //         myChart.dispatchAction({
        //             type: 'highlight',
        //             seriesIndex: 0,
        //             dataIndex: currentIndex
        //         })
        //         that.setState({
        //             labelHtml: that.props.data[currentIndex].name,
        //             valueHtml: that.props.data[currentIndex].value
        //         })
        //     }, 2000)
        // })
    }
    render() {
        let { id, valueHtml, labelHtml } = this.state
        return (
            <div style={{ position: 'relative' }}>
                <div className="guideHtml">
                    {valueHtml}<span>%</span>
                    <div>{labelHtml}</div>
                </div>
                <div id={id}></div>
            </div>
        )
    }
}