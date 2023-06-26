import React, {Component} from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

/*
极坐标堆叠柱状图
seriesData:[{name:'',data:[]}]
radiusAxisData:{name:'',data:[]} 半径轴数据
title:''
*/
const {
    textColor,
    lineColor,
    angleAxisSplitLineColor,
    legendInactiveColor,
    seriesColor
} = SliceStyle;
export default class PolarBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            loading:true
        };
        this.defaultOption = {
            angleAxis: {
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:angleAxisSplitLineColor
                    }
                },
                polarIndex:0
            },
            radiusAxis: {
                polarIndex:0,
                type: 'category',
                z: 10,
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                axisLabel:{
                    color:textColor
                }
            },
            polar: {
                radius:'64%',
                center:['50%', '55%']


            },
            series:{
                type: 'bar',
                center: ['50%', '55%'],

                coordinateSystem: 'polar',
                stack: 'sum',

                polarIndex:0
            },
            color:seriesColor,
            legend: {
                show: true,
                // orient:'vertical',
                top:'4%',
                left:'2%',
                itemHeight: 8,
                itemWidth: 12,
                inactiveColor: legendInactiveColor,
                textStyle:{
                    color:textColor
                }
            },
            tooltip:{
                trigger: 'item'
            }
        };
    }

    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
    }

    componentWillReceiveProps(nextProps){
        this.setState({title:nextProps.title});
    }

    resize(){
        this.chart.resize();
    }

    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setState({loading:false});
    }

    prepareOption(params={}){
        let _this = this;
        let legendData = [];
        let series = params.seriesData.map(function(item) {
            legendData.push(item.name);
            return $.extend(true,{},_this.defaultOption.series,{
                name:item.name,
                data:item.data
            });
        });
        this.option = $.extend(true,{},this.defaultOption,{
            series,
            radiusAxis:params.radiusAxisData,
            legend:{
                data:legendData
            },
            tooltip:{
                formatter: `{a} <br/>{b} : {c} ${params.dataUnit||''}`
            }
        },params.extraOption);
    }

    render(){
        return (<JfCard title={this.state.title} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
