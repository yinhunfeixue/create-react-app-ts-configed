import React, {Component} from 'react'
import {JfCard} from 'app_common'

const $ =  require('jquery');
const echarts = require('echarts');

/*
pieSeriesData:[    一个饼图为一项
    [
        {name:'',data:[]},   一块扇形为一项，data中每项对应x轴数据
        {name:'',data:[]}
    ],
    [
        {name:'',data:[]}
    ]
]
singleData:{} 单个数据
totalData:{} 数据总和
[onClickPie 点击饼图事件]
xAxisData:{name:'',data:[]}
tooltipData:[{name:'',data:[],unit:''}] 附加到单月数据后的提示条数据
dataUnit:'' 单位
*/

export default class WaterfallBarPie extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading:true
        }

        this.defaultOption = {
            yAxis: {
                nameTextStyle:{
                    color:'#7d919e',
                },
                splitNumber:4,
                axisLine:{
                    show:false,
                    lineStyle:{
                        color:'#65607f'
                    }
                },
                axisTick:{
                    show:false
                },
                show:true,
                axisLabel:{
                    color:'#9db7c0'
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#65607f'
                    }
                }
            },
            color:['#6acafa', '#b7a2e7', '#f0ba4e', '#f88db9', '#71d398', '#8d9df2']
        };
    }


    resize(){
        this.chart.resize();
    }

    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
        if(this.props.onClickPie){
            this.setPieEvent();
        }
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

    setTimeline(index){
        this.chart.dispatchAction({
            type:'timelineChange',
            currentIndex:index
        });
    }

    setPieEvent(){
        let _this = this;
        this.chart.on('click',function(params) {
            if(params.seriesType==='pie'){
                _this.props.onClickPie(params.name);
            }
        });
    }

    prepareOption(params={}) {
        let _this = this;
        let singleDataList = params.singleData.data;
        let sum = 0;
        const addOption = {
            timeline:{
                show:false,
                data:params.xAxisData.data
            },
            gird:{

            },
            xAxis:{
                data:params.xAxisData.data,
                axisLine:{
                    show:false
                },
                axisLabel:{
                    color:'#7d919e'
                },
                axisTick:{
                    show:false
                }
            },
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'shadow'
                },
                formatter:function(re) {
                    if(re[0].seriesType==='bar'&&(re[1].value!=='-')){
                        _this.setTimeline(re[0].dataIndex);
                    };
                    if(re[1].value==='-'){
                        return re[2].name+' : '+re[2].value+(params.dataUnit||'');
                    }
                    let tooltipString = '';
                    //单月附加的数据
                    if(params.tooltipData){
                        tooltipString = params.tooltipData.map(function(item) {
                            return '<br />'+item.name+' : '+item.data[re[0].dataIndex]+(item.unit||'');
                        }).join('');
                    }
                    return re[1].seriesName+' : '+re[1].value+(params.dataUnit||'')+tooltipString;
                }
            }
        }
        let baseData = [0].concat(singleDataList.slice(0,singleDataList.length-1).map(function(item) {
            sum+=item;
            return sum;
        }));
        baseData.push('-');
        let baseSeries = [{
            type:'bar',
            data:baseData,
            stack:'single',
            itemStyle:{
                normal:{
                    color:'transparent'
                }
            }
        },{
            name:params.singleData.name,
            type:'bar',
            data:singleDataList.concat(['-']),
            stack:'single'
        },{
            type:'bar',
            name:params.totalData.name,
            barGap:'-100%',
            data:singleDataList.map(function(item) {
                return '-';
            }).concat([params.totalData.value])
        }].concat(params.pieSeriesData.map(function(item,index) {
            return {
                type:'pie',
                radius:[0,"22%"],
                center:[28+index*36+'%','18%'],
                hoverAnimation:false,
                z:100,
                label:{
                    normal:{
                        formatter:'{b}\n{c}'+(params.dataUnit||'')
                    }
                },
                labelLine:{
                    normal:{
                        length:1,
                        length2:1
                    }
                },
                animation:false
            };
        }));
        let options = params.xAxisData.data.map(function(xItem,xIndex) {
            let sum = 0;
            let option = {
                //加上饼图数据
                series:[{},{},{}].concat(params.pieSeriesData.map(function(pieItem,pieIndex) {

                    return {
                        //扇形数据
                        data:pieItem.map(function(item) {
                            let __total = item.data[xIndex];
                            if (!isNaN(item.data[xIndex])) {
                                __total = Number(item.data[xIndex]);
                            }
                            if(pieIndex===0){
                                sum+=__total;
                            }
                            return {
                                name:item.name,
                                value:item.data[xIndex]
                            };
                        })
                    };
                }))
            };
            let math_num_1 = params.pieSeriesData[0][0].data[xIndex];
            if (!isNaN(params.pieSeriesData[0][0].data[xIndex])) {
                math_num_1 = Number(params.pieSeriesData[0][0].data[xIndex]);
            }
            if (!isNaN(sum)) {
                sum = Number(sum)
            }
            //第一个饼图的第一块对应弧度
            let a = 2*Math.PI*math_num_1/sum;
            option.series[4].markLine = {
                data:[
                    [{
                        x:'27%',
                        y:'7%'
                    },{
                        x:'65%',
                        y:'7%'
                    }],
                    [{
                        // x:22.5+Math.sin(a)*8+'%',
                        // y:19-Math.cos(a)*11+'%'
                        x:'27%',
                        y:'29%'
                    },{
                        x:'65%',
                        y:'29%'
                    }]
                ]
            };
            return option;
        });
        baseSeries[4].markLine = {
            silent:true,
            symbol:'none'
        };
        this.option = {
            baseOption:$.extend(true,{},this.defaultOption,addOption,{
                series:baseSeries
            }),
            options
        };
    }

    render(){
        return (
            <JfCard title={this.props.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="markets_exponent_line" >
                    <div style={{width:'100%',height:'100%'}} ref="chart"> </div>
                </div>
            </JfCard>
        )
    }
}
