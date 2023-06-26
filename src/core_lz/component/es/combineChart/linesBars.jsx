import React, {Component} from 'react'
import {JfCard} from 'app_common';

const $ =  require('jquery');
const echarts = require('echarts');

/*
seriesData:[{name:'',data:[]}]
xAxisData:[{name:'',data:[]}]
title:''
extraOption
dataUnit:[]
tooltipData:[{seriesIndex:number},{name:'',data:[],unit:''}]提示条数据 数据中已存在采取前一种形式，否则采取后一种
*/
export default class LinesBars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading:true
        }

        this.lineSeries = {
            smooth:true,
            z:100
        };
        this.barSeries = {
            z:2
        };
        this.defaultOption = {
            grid:{
                bottom:35,
                top:'18%'
            },
            xAxis:{
                axisLine:{
                    lineStyle:{
                        color:'#7d919e'
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
            yAxis:[{
                splitNumber:4,
                nameLocation:'middle',
                nameTextStyle:{
                    color:'#9db7c0',
                    padding:[0,0,20,0]
                },
                axisLine:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color:'#9db7c0'
                },
                splitLine:{
                    show:true,
                    lineStyle: {
                        color: ['#65607f']
                    }
                }
            },{
                splitNumber:4,
                nameLocation:'middle',
                nameRotate:270,
                nameTextStyle:{
                    color:'#9db7c0',
                    padding:[0,0,20,0]
                },
                axisLine:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color:'#9db7c0'
                },
                splitLine:{
                    show:false
                }
            }],
            legend:{

               itemWidth: 15,
               itemHeight: 5,
               top:'4%',
               inactiveColor: '#7d7996',
                textStyle:{
                    color:'#fff'
                }
            },
            color:['#00d1fa', '#b7a2e7', '#f0ba4e', '#f88db9', '#71d398', '#8d9df2']
        };
        this.option = {};
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
        // this.setState({title:name+'各项支出趋势图'});
    }

    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
        // this.prepareOption();
        // this.chart.setOption(this.option);
    }

    prepareOption(params={}){
        let _this = this;
        let legendData = [];
        const addOption = {
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'shadow'
                },
                formatter:function(re) {
                    if(!params.tooltipData){
                        return re[0].name+'<br />'
                        +re.map(function(item) {
                            return item.seriesName+' : '+item.value+(params.dataUnit?params.dataUnit[item.seriesIndex]||'':'');
                        }).join('<br />');
                    }
                    return re[0].name+'<br />'
                    +params.tooltipData.map(function(item) {
                        if(item.seriesIndex!==undefined){
                            let tar = params.seriesData[item.seriesIndex];
                            return tar.name+' : '+tar.data[re[0].dataIndex]+(params.dataUnit[item.seriesIndex]||'');
                        }
                        return item.name+' : '+item.data[re[0].dataIndex]+(item.unit||'');
                    }).join('<br />');
                }
            }
        }
        let series = params.seriesData.map(function(item) {
            legendData.push({
                name:item.name,

                icon:'pin'
            });
            return $.extend(true,{},_this[item.type+'Series'],item);
        });
        this.option = $.extend(
            true,
            {},
            this.defaultOption,{
                series,
                legend:{
                    data:legendData
                },
                xAxis:params.xAxisData
            },
            addOption,
            (params.extraOption||{})
        );
    }

    render(){
        return (
            <JfCard title={this.props.title} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="markets_exponent_chart" >
                    <div style={{width:'100%',height:'100%'}} ref="chart" > </div>
                </div>
            </JfCard>
        );
    }
}
