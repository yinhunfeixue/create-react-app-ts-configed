import React, {Component} from 'react'
import {JfCard} from 'app_common';
import moment from 'moment';
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

/*
title:''
lineData:[{name:'',data:[]}]
xAxisData:[],
timeType:'',['Y'/'D']
*/
const {
    textColor
} = SliceStyle;
export default class RankLines extends Component {
    constructor(props) {
        super(props);
        let _this = this;
        this.state = {
            title:this.props.title,
            loading:true
        };
        this.color = ['#00d5fa', '#65cca5',   '#21bcf8', '#eada55','#0090ce','#bea0e3','#00a2e1', '#07a19c', '#39f99c','#85d0dd','#bea0e3','#00a2e1',];
        this.defaultOption = {
            series:{
                type:'line',
                showAllSymbol:true,
                symbolSize:20,

                label:{
                    normal:{
                        show:true,
                        position:'inside',
                        color:'#000'
                    },
                    emphasis:{
                        //高亮时字体颜色
                        color:'#fff',
                        fontSize:14,
                        fontWeight:'bold'
                    }
                },

                lineStyle:{
                    normal:{
                        //线条透明度
                        opacity:0.2
                    }
                },
                itemStyle:{
                    normal:{
                        opacity:1,
                    },
                    emphasis:{
                        opacity:1,
                        shadowBlur:8,
                        shadowColor:'#fff'
                    }
                }
            },
            grid:{
                left:'8%',
                right:'12%',
                bottom:'23%'
            },
            xAxis:{
                type:'category',
                axisLine:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color:textColor
                }
            },
            yAxis:{
                show:false
            },
            dataZoom : {
              show : true,
              realtime:false,
              backgroundColor: 'rgba(105,101,116,0.1)',
              handleColor: '#fff',
              fillerColor: 'rgba(105,101,116,.3)',
              dataBackgroundColor: 'rgba(131,126,145,0.5)',
              height: 22,
              start : 0,
              end : 50,
              x:100,
              textStyle:{
                  color:textColor
              },
            },
            legend:{
                show:true,
                orient:'vertical',
                right:'3%',
                icon: 'circle',
               itemWidth: 7,
               itemHeight: 7,
               inactiveColor: '#7d7996',
                textStyle:{
                    color:textColor
                },
                top:'middle'
            },
            color:this.color
        };
        this.option = {};
        this.selected = {};
    }
    componentDidMount(){
        let dom = this.refs.chart;
        this.chart = echarts.init(dom);
        let _this = this;
        this.highlightLine();
        // this.prepareOption();
        // this.chart.setOption(this.option);
        // this.chart.on('legendselectchanged',function(params) {
        //     let selected = _this.selected;
        //     selected[params.name] = !selected[params.name];
        //     let color = [];
        //     let i=0;
        //     for(let key in selected){
        //         if(selected[key]){
        //             color.push(_this.color[i]);
        //         }
        //         else {
        //             color.push('#000');
        //         }
        //         i++;
        //     }
        //     _this.chart.dispatchAction({
        //         name:params.name,
        //         type:'legendSelect'
        //     });
        //     _this.chart.setOption({
        //         color
        //     });
        // });
    }

    componentWillReceiveProps(nextProps){
        this.setState({title:nextProps.title});
    }

    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setState({loading:false});
    }

    highlightLine(){
        let _this = this;
        //高亮同一折线图的其他点
        this.chart.on('mouseover',function(params) {
            let color = _this.color.map(function(item,index) {
                if(index===params.seriesIndex){
                    return item;
                }
                return '#46425b';
            });
            _this.option.color = color;
            $.extend(true,_this.option.series[params.seriesIndex],{
                z:6,
                lineStyle:{
                    normal:{
                        //线条高亮透明度
                        opacity:1
                    }
                }
            });

            if( _this.option.dataZoom != undefined ){
                delete _this.option.dataZoom;
            }

            _this.chart.setOption(_this.option);
            _this.chart.dispatchAction({
                type:'highlight',
                seriesIndex:params.seriesIndex
            });
        });
        this.chart.on('mouseout',function(params) {
            _this.option.color = _this.color;
            $.extend(true,_this.option.series[params.seriesIndex],{
                z:2,
                lineStyle:{
                    normal:{
                        //取消线条高亮
                        opacity:0.5
                    }
                }
            });
            _this.chart.setOption(_this.option);
            _this.chart.dispatchAction({
                type:'downplay',
                seriesIndex:params.seriesIndex
            });
        });
    }

    resize(){
        this.chart.resize();
    }
    prepareOption(params={}){
        let _this = this;
        let legendData = [];
        this.defaultOption.yAxis.min = params.min||0;
        let series = params.lineData.map(function(line,index) {
            legendData.push(line.name);
            _this.selected[line.name] = true;
            return $.extend(true,{},_this.defaultOption.series,{
                name:line.name,
                data:line.data,
                itemStyle:{
                    emphasis:{
                        color:_this.color[index]
                    }
                }
            });
        });
        this.option = $.extend(true,{},this.defaultOption,{
            series,
            xAxis:{
                data:params.xAxisData
            },
            legend:{
                data:legendData
            },
            tooltip:{
                formatter:function(tipParams) {
                    let timeString = '';
                    if(params.timeType==='Y'){
                        timeString = tipParams.name+'年';
                    }
                    else {
                        timeString = moment(tipParams.name,'YYYY-MM-DD').format("YYYY年M月D日");
                    }
                    return timeString+'，'+tipParams.seriesName+'排名第'+tipParams.value+'。';
                }
            },
        });

    }
    render(){
        return (<JfCard title={this.state.title} loading={this.state.loading}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>)
    }
}
