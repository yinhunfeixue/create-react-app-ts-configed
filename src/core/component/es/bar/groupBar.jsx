import React, {Component} from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

/*
seriesGroupData:[{
    groupName:'',
    seriesData:[
        []
    ]
}]
xAxisData:[{name:'',data:[]}]
title:'',
dataUnit
showTopN
legendTitles
*/
const {
    textColor,
    lineColor,
    barUpColor,
    barDownColor,
    axisNameColor,
    yAxisSplitLineColor,
    legendInactiveColor
} = SliceStyle;
export default class GroupBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            loading:true
        };
        this.defaultOption = {}
    }

    refreshGraph(arg){
        const params = {...arg};
        this.chart.clear();
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setLegendEvent();
        this.setState({loading:false});
    }

    setLegendEvent(){
        let _this = this;
        this.chart.on('legendselectchanged',function(params) {
            let seriesNames = _this.seriesNames[_this.groupNames[params.name]];
            let selected = params.selected[params.name];
            let actionType = selected?'legendSelect':'legendUnSelect';
            for(let i=0;i<seriesNames.length;i++){
                if(seriesNames[i]!==params.name){
                    _this.chart.dispatchAction({
                        type:actionType,
                        name:seriesNames[i]
                    });
                }
            }
        });
    }

    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
    }

    prepareOption(params={}){
        let _this = this;
        let series = [];
        this.groupNames = {};
        let legendData = [];
        let groupLength = params.legendTitles.length;
        let dataUnit = params.dataUnit||[];
        this.defaultOption = {
            series:{
                type:'bar',
                barMaxWidth:30,
                barMinHeight:1,
                label:{
                    normal:{
                        show:false
                    }
                }
            },
            grid:{
                containLabel:true,
                left:'5%',
                bottom:'3%',
                top:'0%'
            },
            xAxis:{
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                axisLabel:{
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
                    lineStyle:{
                        color:yAxisSplitLineColor
                    }
                }
            },
            legend:{
                show:true,
                orient:'vertical',
                inactiveColor: legendInactiveColor,

                itemWidth: 20,
                itemHeight:8,
                itemGap:4.7,
                textStyle:{
                    color:textColor,
                    fontSize:'11'
                },
                right:30,
                top:20
            },
            visualMap:null,
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'shadow'
                },
                formatter:function(tipParams) {
                    return tipParams.map(function(item) {
                        let legendTitleIndex = item.seriesIndex%groupLength;
                        let tooltipString = '';
                        if(legendTitleIndex===0){
                            if(item.seriesIndex!==0){
                                tooltipString = '<br />';
                            }
                            tooltipString += _this.groupNames[item.seriesName]+' : '
                            +params.legendTitles[0]+item.value+(dataUnit[0]||'');
                        }
                        else{
                            tooltipString = '，'+params.legendTitles[legendTitleIndex]
                            +item.value+(dataUnit[0]||'');
                        }
                        return tooltipString;
                    }).join('');
                }
            },
            color:['#4caff6','#82bde7','#59b5ac','#7ccfc6','#7aae89','#8ccaa2','#93ae73','#adca8a','#b3b45c','#c8c965'  ,'#bca544','#f5dd5d','#d7a930','#fdd148','#eea93f','#ffc15a','#d88536','#fba757'],

        };
        this.seriesNames = {};
        for(let i=0;i<params.seriesGroupData.length;i++){
            let groupItem = params.seriesGroupData[i];
            legendData.push([]);
            this.seriesNames[groupItem.groupName] = [];
            for (let j=0;j<groupItem.seriesData.length;j++){
                let seriesName = groupItem.groupName+'-'+params.legendTitles[j];
                legendData[i].push(seriesName);
                this.groupNames[seriesName] = groupItem.groupName;
                this.seriesNames[groupItem.groupName].push(seriesName);
                series.push($.extend(true,{},_this.defaultOption.series,{
                    name:seriesName,
                    data:groupItem.seriesData[j],
                    stack:groupItem.groupName
                }));
            }
        }
        let title = [];
        let legend = legendData[0].map(function(item,index) {
            title.push({
                text:params.legendTitles[index],
                top:'6',
                right:120+37*index+'px',
                textStyle:{
                    fontSize:11,
                    fontWeight:'normal',
                    color:textColor
                }
            });
            let selected = {};
            let data = legendData.map(function(legendItem,legendIndex) {
                if(params.showTopN){
                    if(legendIndex>=params.showTopN){
                        selected[legendItem[index]] = false;
                    }
                    else {
                        selected[legendItem[index]] = true;
                    }
                }
                return legendItem[index];
            });
            return $.extend(true,{},_this.defaultOption.legend,{
                data,
                formatter:function(name) {
                    if(index===0){
                        return _this.groupNames[name];
                    }
                    return ' ';
                },
                top:'20',
                right:80+67*index+'px',
                selected
            });
        });
        this.option = $.extend(true,{},this.defaultOption,{
            series,
            xAxis:params.xAxisData,
            legend,
            title
        },params.extraOption||{});
    }
    resize(){
        this.chart.resize();
    }
    render(){
        return (<JfCard title={this.state.title||''} hasTip={this.props.hasTip} loading={this.state.loading}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
