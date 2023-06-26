import React, {Component} from 'react'
import SliceStyle from 'app_js/sliceStyle';
import {JfCard} from 'app_common';
import _ from 'underscore';
//const jQuery = window.jQuery = $ = window.$ = require('jquery');
const echarts = require('echarts');
const $ =  require('jquery');
//import './css/index.css';

/**
title: '上证指数' //页面模块显示名称

extraOptions ：配置项指定
    例如：
    extraOptions={
        {legend:{show:false,data:['直接访问']},
        extra:{klineItemStyle:{}}} // extra为特别的扩展项配置，自定义的一些影响显示的配置项
    }

xAxisData:{name:'日期',data:[]},
    示例： data:["2015/1/5","2015/1/6","2015/1/7"

//k线数据
seriesKData:{name:'k线',data:[]},
    示例：data: [[开盘价，收盘价，最低价，最高价],[3258.63,3350.52,3253.88,3369.28],[3330.8,3351.45,3303.18,3394.22]

//其他系列折线类数据
seriesOtherData: {name:'交易金额',data:[]},

*/
const {klineColor,klineColor0,klineBorderColor,klineBorderColor0,seriesColor} = SliceStyle;
export default class KlineLine extends Component{
    constructor(props){
        super(props);
        this.state={
            title:this.props.title
        };
        //kline显示tip颜色配置
        this.klineItemStyle = {
            normal: {
                color: klineColor,
                color0: klineColor0,
                borderColor: klineBorderColor,
                borderColor0: klineBorderColor0
            }
        };
        this.option = {
            //backgroundColor: '#21202D',
            color:seriesColor,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: '#376df4',
                        width: 2,
                        opacity: 1
                    }
                },
                formatter: function(params) {
                    let time  = params[0].name;
                    let tipHtml  = `${time}`;
                    _(params).map((v,k)=>{
                        if( v['seriesType'] == 'candlestick' ){

                            let kd    = params[0].data;
                            tipHtml  += `<br>${v.seriesName}<br>开盘：${kd[1]}  最高：${kd[4]}<br>收盘：${kd[2]}  最低：${kd[3]} `;

                        }else{
                            tipHtml  += '<br> '+v.seriesName+'：'+v.value;
                        }
                    });

                    return tipHtml;
                }.bind(this)
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: { color: '#65607f' },
                    textStyle: {
                        color: '#9db7c0'
                    }
                }
            },
            yAxis: [
                {
                    // show: false,
                    scale: true,
                    // splitNumber:4,
                //    max: 7000,
		     //       min: 0,
                    position:'right',
                    axisLine: { lineStyle: { color: '#65607f' } },
                    //splitLine: { show: false }
                },
                {
		            type: 'value',
                    // show: false,
		            scale: true,
		            // nameGap:20,
		            //max: 3000,
		            //min: 0,
		            // boundaryGap: [0.2, 1]
		        }

            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '6%',
                top: '30',
                containLabel: true
            },
            animation: false,
            series: [
                    {
                        type: 'candlestick',
                        itemStyle: {
                            normal: {
                                color: '#FD1050',
                                color0: '#0CF49B',
                                borderColor: '#FD1050',
                                borderColor0: '#0CF49B'
                            }
                        }
                    },
                    {
                        smooth: true,
                        yAxisIndex: 1,
                        type:'line',
            //            stack: '总量',
                        data:[]
                    }
                ]
        };
    }

    componentDidMount(){
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
    }

    resize(){
        this.ecObj.resize();
    }

    getSeriesData(seriesKData,seriesOtherData){
        let seriesData = [];
        if( seriesKData ){
            let kseries = {
                type: 'candlestick',
                name: seriesKData.name,
                itemStyle: this.klineItemStyle,
                data:seriesKData.data
            };
            seriesData.push(kseries);
        }

        if( seriesOtherData ){
            _(seriesOtherData).map((v,k)=>{
                v['smooth'] = true;
                v['type'] = 'line';
                v['yAxisIndex'] = 1;
                seriesData.push(v);
            });
        }

        return seriesData;
    }

    refreshGraph(xAxisData,seriesKData,seriesOtherData){
        this.prepareOption();

        this.option.series = this.getSeriesData(seriesKData,seriesOtherData);

        if( xAxisData ){
            this.option.xAxis.data = xAxisData;
        }

        this.ecObj.setOption(this.option);
    }


    prepareOption() {
        let _this = this;
        let extraOptions = this.props.extraOptions;
        if(this.props.extraOptions){
            $.extend(true,this.option,extraOptions);
        }

        if( extraOptions !=undefined && extraOptions.extra != undefined ){
            ///每系列label 显示格式等配置信息
            if( extraOptions.extra.klineItemStyle != undefined ){
                $.extend(true,this.klineItemStyle,extraOptions.extra.klineItemStyle);
            }
        }

        let seriesData = [];
        seriesData = this.getSeriesData(this.props.seriesKData,this.props.seriesOtherData);
        this.option.series = seriesData;

        if( this.props.xAxisData ){
            $.extend(this.option,{
                xAxis:{
                    type: 'category',
                    axisLine: { lineStyle: { color: '#8392A5' } },
                    name:this.props.xAxisData.name,
                    data:this.props.xAxisData.data
                }
            });
        }
    }

    shouldComponentUpdate(){
        return false
    }

    render(){
        return (
            <JfCard title={this.state.title} bordered={false} >
                <div className="markets_exponent_line" style={{width:'100%',height:'200px'}}>
                    <div style={{width:this.props.width?this.props.width:'100%',height:this.props.height?this.props.height:'100%'}} ref="container" ></div>
                </div>
            </JfCard>
        )
    }
}
