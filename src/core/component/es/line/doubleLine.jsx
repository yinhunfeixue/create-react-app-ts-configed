import React, {Component} from 'react'
import SliceStyle from 'app_js/sliceStyle';
import {JfCard} from 'app_common';
import _ from 'underscore';
//const jQuery = window.jQuery = $ = window.$ = require('jquery');
const echarts = require('echarts');
const $ =  require('jquery');

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

//折线类数据
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
                }
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

            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '40',
                top: '60',
                containLabel: true
            },
            animation: false,
            series: []
        };
    }

    componentDidMount(){
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
    }

    resize(){
        this.ecObj.resize();
    }

    getSeriesData(seriesOtherData){
        let seriesData = [];
        if( seriesOtherData ){
            _(seriesOtherData).map((v,k)=>{
                v['smooth'] = true;
                v['type'] = 'line';
                v['yAxisIndex'] = k;
                seriesData.push(v);
            });
        }

        return seriesData;
    }

    refreshGraph(xAxisData,seriesOtherData){
        this.prepareOption();

        this.option.series = this.getSeriesData(seriesOtherData);

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
        seriesData = this.getSeriesData(this.props.seriesOtherData);
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
