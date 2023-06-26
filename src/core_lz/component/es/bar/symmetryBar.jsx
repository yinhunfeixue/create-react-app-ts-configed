import React, {Component} from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

/*
title:'',
orient:'' 可选['vertical','horizontal'], 默认横向，即horizontal
positiveSeriesData:{name:'',data:[]}, 横向表现为上部，纵向表现为右部
negativeSeriesData:{name:'',data:[]}, 横向表现为下部，纵向表现为左部
axisData:{name:'',data:[]}  中间的轴的数据
percentData:{  百分比数据
    positive:[],
    negative:[]
}
positiveTitle:[]/''
negativeTitle:[]/''
extraOption 额外配置
dataUnit:['',''] positive,negative
*/
const {
    textColor,
    lineColor
} = SliceStyle;
export default class SymmetryBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        };
    }
    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
    }
    resize(){
        this.chart.resize();
    }
    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setState({
            loading:false
        })
    }
    //柱形上的标签配置，较复杂，单列出，参数type表示正向或负向
    getLabelOption(type,params){
        let _this = this;
        let position = {};
        let dataUnit = params.dataUnit||[];
        //标签位置配置
        if(this.props.orient==='vertical'){
            position = {
                positive:'insideLeft',
                negative:'insideRight'
            };
        }
        else {
            position = {
                positive:'insideBottom',
                negative:'insideTop'
            };
        }
        return {
            normal:{
                show:true,
                color:textColor,
                position:position[type],
                distance:20,
                align:'center',
                formatter:function(labelParams) {
                    let dataIndex = labelParams.dataIndex;
                    if(params.positiveTitle||params.negativeTitle){
                        const title = params[`${type}Title`]||'';
                        if(dataIndex===0){
                            //适应多排的情况
                            if($.isArray(title)){
                                return `{title|${title.join('}\n\n{title|')}}`;
                            }
                            return `{title|${title}}`;
                        }
                        dataIndex-=1;
                    }
                    let percentString = '';
                    //百分比数据，目前未加数据处理
                    if(params.percentData){
                        let percent = params.percentData[type][dataIndex];
                        let style = '';
                        if(percent<0){
                            style='green';
                            percent = percent+'\n%';
                        }
                        else {
                            style='normal';
                            percent = '+'+percent+'%';
                        }
                        if(type==='positive'){
                            percentString = '{'+style+'|'+percent+'}\n\n';
                        }
                        else {
                            percentString = '\n\n{'+style+'|'+percent+'}';
                        }
                    }
                    //两边标签对称
                    if(type==='positive'){
                        return percentString+'{normal|'
                        +params.positiveSeriesData.data[dataIndex]+(dataUnit[0]||'')+'}';
                    }
                    return '{normal|'+params.negativeSeriesData.data[dataIndex]+(dataUnit[1]||'')+'}'+percentString;
                },
                //富文本标签样式，百分比为负数时显示为绿色
                rich:{
                    green:{
                        color:'#1fffc5'
                    },
                    normal:{
                        color:textColor
                    },
                    title:{
                        color:textColor,
                        fontSize:12,
                        fontStyle:'italic'
                    }
                }
            }
        };
    }
    prepareOption(params={}){
        let categoryAxis = '';
        let valueAxis = '';
        let percentData = params.percentData;
        let _this = this;
        //适应横纵两种图
        if(this.props.orient==='vertical'){
            categoryAxis = 'yAxis';
            valueAxis = 'xAxis';
        }
        else {
            categoryAxis = 'xAxis';
            valueAxis = 'yAxis';
        }
        let positiveSeriesData = params.positiveSeriesData;
        let negativeSeriesData = params.negativeSeriesData;
        let positiveMax = Math.max.apply(Math,positiveSeriesData.data);
        let negativeMax = Math.max.apply(Math,negativeSeriesData.data);
        //数据系列两个，背景系列两个（用于标签对齐显示）
        let series = [{
            type:'bar',
            barWidth: '53%',
            name:positiveSeriesData.name
        },{
            type:'bar',
            barWidth: '53%',
            name:negativeSeriesData.name,
        },{
            type:'bar',
            itemStyle:{
                normal:{
                    opacity:1
                }
            },
            barWidth: '53%',
            label:this.getLabelOption('positive',params),
            z:5
        },{
            type:'bar',
            //多系列位置重叠
            barGap:'-100%',
            itemStyle:{
                normal:{
                    opacity:1
                }
            },
            barWidth: '53%',
            label:this.getLabelOption('negative',params),
            z:5
        }];
        let negativeSeriesShowLabel = false;
        let positiveSeriesShowLabel = false;
        let seriesData = [
            positiveSeriesData.data.map(function(item) {
                if( item > 0){
                    positiveSeriesShowLabel = true;
                }
                return item;
            }),
            negativeSeriesData.data.map(function(item) {
                if( item > 0){
                    negativeSeriesShowLabel = true;
                }
                return -item;
            }),
            positiveSeriesData.data.map(function() {
                return positiveMax;
            }),
            negativeSeriesData.data.map(function() {
                return -negativeMax;
            })
        ];
        if( negativeSeriesShowLabel == false ){
            //negativeSeries 值都为零的时候，不显示label
             delete series[3].label;
        }

        if( positiveSeriesShowLabel == false ){
            //positiveSeries 值都为零的时候，不显示label
             delete series[2].label;
        }

        let axisDataList = params.axisData.data;
        if(params.positiveTitle||params.negativeTitle){
            //在第一个位置增加一组数据，用于对齐显示标题
            series[0].data = [0].concat(seriesData[0]);
            series[1].data = [0].concat(seriesData[1]);
            series[2].data = [positiveMax].concat(seriesData[2]);
            series[3].data = [-negativeMax].concat(seriesData[3]);
            axisDataList = [''].concat(axisDataList);
        }
        else {
            for(let i=0;i<4;i++){
                series[i].data = seriesData[i];
            }
        }

        this.option = {
            series,
            grid:{
                top:'3%',
                bottom:'15%'

            },
            legend:{
                show:false,
                data:[positiveSeriesData.name,negativeSeriesData.name],
                orient:'vertical',
                left:'right',
                top:'middle',
                align:'left'
            },
            xAxis:{
                z:5,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    show:true,
                    color:textColor,
                    interval:0
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                position:'bottom'

            },
            yAxis:{
                z:5,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    show:true,
                    color:textColor,
                    interval:0
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                }
            },
            color:['#1374c8', '#2f97f0', 'transparent', 'transparent']
        };
        this.option[categoryAxis].data = axisDataList;
        this.option[valueAxis].show = false;
        if(this.props.orient==='vertical'){
            this.option.yAxis.inverse = true;
        }
        if(this.props.extraOption||params.extraOption){
            $.extend(true,this.option,this.props.extraOption,params.extraOption);
        }
    }

    render(){
        return (<JfCard title={this.props.title} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
