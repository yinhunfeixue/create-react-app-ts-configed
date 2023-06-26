import React, {Component} from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery'
import echarts from 'echarts'
import SliceStyle from 'app_js/sliceStyle'

/*
seriesData:[{name:'',data:[]}]
yAxisData/xAxisData:[{name:'',data:[]}]
title:'',
visualMap:boolean,
visualMapColor:[]
percentData:[[]] 与seriesData对应
dataUnit
rankChangeData 排名变化数据
showTopN 显示前n个图例
tooltipData:[{seriesIndex:number},{name:'',data:[],unit:''}]提示条数据 数据中已存在采取前一种形式，否则采取后一种
*/
const {
    lineColor,
    textColor,
    axisNameColor,
    yAxisSplitLineColor,
    legendInactiveColor,
    tipBackgroundColor,
    seriesColor,
    visualMapColor,
    barUpColor,
    barDownColor,
} = SliceStyle

export default class NewBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            loading:true
        };
        let _this = this;
        let dataUnit = _this.props.dataUnit||[];
        this.defaultOption = {}
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

    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
    }

    prepareOption(params={}){

        let _this = this;
        let series = [];
        let visualMap = null;
        let dataUnit = params.dataUnit||[];
        this.defaultOption = {
            series:{
                type:'bar',
                barMaxWidth:30,
                barMinHeight:1,
                barGap:0,
                label:{
                    normal:{
                        show:true,
                        position:params.yAxisData?'right':'top'
                    }
                }
            },
            grid:{
                containLabel:true,
                left:'5%',
                bottom:'10%'
            },
            xAxis:{
                show:params.yAxisData?false:true,
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                axisLabel:{
                    // interval:0,
                    color:textColor,
                    rich:{
                        normal:{},
                        up:{
                            color:barUpColor
                        },
                        down:{
                            color:barDownColor
                        }
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                },
                boundaryGap: ['0', '3%']
            },
            yAxis:{
                //y轴适当向两边延伸
                splitNumber:4,
                nameTextStyle:{
                    color:axisNameColor,
                    padding:[0,50,0,0]
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        color:lineColor
                    }
                },

                axisTick:{
                    show:false
                },
                show:true,
                axisLabel:{
                    interval:0,
                    color:textColor,
                    rich:{
                        normal:{},
                        up:{
                            color:barUpColor
                        },
                        down:{
                            color:barDownColor
                        }
                    }
                },
                splitLine:{
                    show:(!params.yAxisData),
                    lineStyle:{
                        color:yAxisSplitLineColor
                    }
                },
                inverse:params.yAxisData?true:false,
            },
            legend:{
                show:false,
                orient:'vertical',
                icon: 'circle',
                itemWidth: 9,
                itemHeight: 9,
                inactiveColor: legendInactiveColor,
                textStyle:{
                    color:textColor
                },
                right:20,
                top:20
            },
            visualMap:null,
            tooltip:{
                show:true,
                // backgroundColor:tipBackgroundColor,
                trigger:'axis',
                position:function (point) {
                    // 固定在顶部
                    return [point[0], '10%'];
                },
                axisPointer:{
                    type:'shadow'
                },
                formatter:function(tipParams) {
                    if(!params.tooltipData){
                        return tipParams[0].name+'<br />'
                        +tipParams.map(function(item) {
                            return item.seriesName+' : '+item.value+(dataUnit?dataUnit[item.seriesIndex]||'':'');
                        }).join('<br />');
                    }
                    return tipParams[0].name+'<br />'
                    +params.tooltipData.map(function(item) {
                        if(item.seriesIndex!==undefined){
                            let tar = params.seriesData[item.seriesIndex];
                            return tar.name+' : '+tar.data[tipParams[0].dataIndex]+(dataUnit?dataUnit[item.seriesIndex]||'':'');
                        }
                        return item.name+' : '+item.data[tipParams[0].dataIndex]+(item.unit||'');
                    }).join('<br />');
                }
            },
            color:seriesColor
        };
        //柱形上的数字
        this.defaultOption.series.label.normal.formatter = function(labelParams) {
            let appendString = ''
            //加上占比数据
            if(params.percentData){
                let joinChar = '';
                // if(_this.props.yAxisData){
                    joinChar = '\n';
                // }
                // else {
                //     joinChar = '\n';
                // }
                appendString = joinChar+params.percentData[labelParams.seriesIndex][labelParams.dataIndex];
            }
            let value;
            //横向柱状图中每个数据项有两个值，不显示第二个用于定位y轴的值
            if($.isArray(labelParams.value)){
                value = labelParams.value[0];
            }
            else {
                value = labelParams.value;
            }
            return value+(dataUnit[labelParams.seriesIndex]||'')+appendString;
        };
        if(params.seriesData.length>1||!params.visualMap){
            series = params.seriesData.map(function(item,index) {
                return $.extend(true,{},_this.defaultOption.series,item);
            });
        }
        else {
            series = params.seriesData.map(function(item,index) {
                return $.extend(true,{},_this.defaultOption.series,{
                    name:item.name,
                    data:params.yAxisData?item.data.map(function(dataItem,dataIndex) {
                        return [dataItem,dataIndex];
                    }):item.data
                });
            });
            let max = Math.max.apply(Math,params.seriesData[0].data);
            let min = Math.min.apply(Math,params.seriesData[0].data);
            if(min===max){
                max+=1;
            }
            visualMap = {
                max:max,
                min:min,
                dimension:params.yAxisData?0:undefined,
                inRange:{
                    color:params.visualMapColor||visualMapColor,
                },
                show:false,
                type:'continuous'
            };
        }
        this.option = $.extend(true,{},this.defaultOption,{
            series,
            visualMap,
            xAxis:params.xAxisData,
            yAxis:params.yAxisData
        },params.extraOption||{});
        let selected = {};
        this.option.legend.data = params.seriesData.map(function(item,index) {
            if(params.showTopN){
                selected[item.name] = (index<params.showTopN);
            }
            return item.name;
        });
        this.option.legend.selected = selected;
        if(params.rankChangeData){
            let rankChangeData = params.rankChangeData;
            let formatter = function(value,index) {
                let rankValue = rankChangeData[index];
                let style = 'normal';
                let content = '-';
                if(rankValue>0){
                    style = 'up';
                    content = '↑'+rankValue;
                }
                else if (rankValue<0) {
                    style = 'down';
                    content = '↓'+(-rankValue);
                }
                return value+'({'+style+'|'+content+'})';
            }
            if(params.yAxisData){
                this.option.yAxis.axisLabel.formatter = formatter;
            }
            else {
                this.option.xAxis.axisLabel.formatter = formatter;
            }
        }
    }

    render(){
        return (<JfCard title={this.state.title||''} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div style={{width:this.props.width?this.props.width:'100%', height:this.props.height ? this.props.height:'100%'}} ref="chart" > </div>
            </div>
        </JfCard>);
    }
}
