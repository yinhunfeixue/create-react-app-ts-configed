import React, {Component} from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';
/*
双坐标系柱状图
leftSeriesData&rightSeriesData:[{name,'',data:[]}]
yAxisData:{name:'',data:[]}
title:''
chartTitles:['','']
*/
const {
    textColor,
    lineColor,
    titleColor
} = SliceStyle;
export default class DbgridBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            title:this.props.title
        };
        this.defaultOption = {
            title:[{
                right:'30%',
                top:'2.2%',
                textStyle:{
                    color:titleColor,
                    fontSize:14,
                    fontWeight:'normal'
                }
            },{
                top:'2.2%',
                left:'70%',
                textStyle:{
                    color:titleColor,
                    fontSize:14,
                    fontWeight:'normal'
                }
            }],
            series:[{
                type:'bar',
                stack:'sum',
                xAxisIndex:0,
                yAxisIndex:0,
                label:{
                    normal:{
                        show:true,
                        position:'inside'
                    }
                },
                tooltip:{
                    show:true
                }
            },{
                type:'bar',
                stack:'sum1',
                xAxisIndex:1,
                yAxisIndex:1,
                label:{
                    normal:{
                        show:true,
                        position:'right'
                    }
                },
                tooltip:{
                    show:false
                }
            }],
            grid:[{
                left:'17%',
                top:'8%',
                right:'30%'
            },{
                left:'70%',
                top:'8%',
                right:'10%'
            }],
            xAxis:[{
                gridIndex:0,
                show:false,
                max: 102
            },{
                gridIndex:1,
                show:false
            }],
            yAxis:[{
                gridIndex:0,
                axisLine:{
                    show:false
                },
                inverse:true,

                axisLabel:{
                    textStyle:{
                        color:textColor
                    }
                }
            },{
                gridIndex:1,
                axisLabel:{
                    show:false
                },
                inverse:true,
                axisTick:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                }
            }],
            legend:{
                show:true,
                bottom:'5%',
                textStyle:{
                    color:textColor
                }
            },
            tooltip:{
                trigger:'axis'
            },
            color:['#005f9b', '#016cb4', '#0990d2', '#00a1e2', '#9ae2ff']
        };
    }
    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
    }

    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setState({loading:false});
    }

    componentWillReceiveProps(nextProps){
        this.setState({title:nextProps.title});
    }

    prepareOption(params={}){
        let _this = this;
        let legendData = [];
        let series = params.leftSeriesData.map(function(item) {
            legendData.push(item.name);
            return $.extend(true,{},_this.defaultOption.series[0],{
                name:item.name,
                data:item.data
            });
        }).concat(params.rightSeriesData.map(function(item) {
            return $.extend(true,{},_this.defaultOption.series[1],{
                name:item.name,
                data:item.data
            });
        }));
        let yAxis = this.defaultOption.yAxis.map(function(item) {
            return $.extend(true,{},item,params.yAxisData);
        });
        const chartTitles = params.chartTitles || [];
        this.option = $.extend(true,{},this.defaultOption,{
            series,
            yAxis,
            legend:{
                data:legendData
            },
            title:[{
                text:chartTitles[0]||''
            },{
                text:chartTitles[1]||''
            }]
        },params.extraOption);
    }
    resize(){
        this.chart.resize();
    }

    render(){
        return (<JfCard title={this.state.title} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
