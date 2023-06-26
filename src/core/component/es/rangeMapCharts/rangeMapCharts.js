import React from 'react';
import {JfCard} from 'app_common';

const echarts = require('echarts');
export default class RangeMapCharts extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
          //  loading:true,
            title:this.props.title,//模块标题　　
            extraOptions:this.props.extraOptions, //option扩展配置项
            loading:true,
        };
        this.radius = ['50%', '60%'];
        this.serisesCenter = ['50%','50%'];
        // 指定图表的配置项和数据
         this.labelTop = {
            normal : {
                label : {
                    show : true,
                    position : 'center',
                    formatter : '{b}\n{d}%',
                    textStyle: {
                        baseline : 'bottom'
                    },
                    fontSize:'20',
                },
                labelLine : {
                    show : false
                }
            }
        };
        this.labelBottom = {
            normal:{
                color: '#ccc',
                label : {
                    show : false,
                    fontSize:'10',
                    position : 'center'
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {

            }
        };

        this.lineOption= {
            series: [
                {
                    type:'pie',
                    radius: this.radius,
                    center : ['13%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#96e0f0' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },

                        }
                    },

                    data:[
                        {
                            value:75,
                            name:'术语',
                            top:'23%',
                            itemStyle:this.labelTop,
                        },
                        {value:25, name:'other',itemStyle:this.labelBottom},
                    ]
                },
                {
                    type:'pie',
                    radius: this.radius,
                    center : ['37%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#b6ee89' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#64b524' // 100% 处的颜色
                                }]
                            },

                        }
                    },
                    data:[
                        {
                            value:35,
                            name:'应用',
                            itemStyle:this.labelTop

                        },
                        {value:65, name:'other',itemStyle:this.labelBottom},
                    ]
                },
                {
                    type:'pie',
                    radius: this.radius,
                    center : ['62%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#f5e495' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#ffb64d' // 100% 处的颜色
                                }]
                            },

                        }
                    },
                    data:[
                        {
                            value:65,
                            name:'报表',
                            itemStyle:this.labelTop
                        },
                        {value:35, name:'other',itemStyle:this.labelBottom},
                    ]
                },
                {
                    type:'pie',
                    radius: this.radius,
                    center : ['87%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#c8a5f7' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#714ca1' // 100% 处的颜色
                                }]
                            },

                        }
                    },
                    data:[
                        {
                            value:25,
                            name:'服务',
                            itemStyle:this.labelTop

                        },
                        {value:75, name:'other',itemStyle:this.labelBottom},
                    ]
                },
            ]
        }


this.option = {
            series: []
        };

    }
    componentDidMount(){

        this.drawGraph();
    }

    //获得初始化的chart
    getChartsInit(){
        let myChart = echarts.init(document.getElementById('chartsRangemap'));
        return myChart;
    }
      //模拟外部数据
     drawGraph(){
         this.getChartsInit().setOption(this.lineOption);
         this.setState({loading:false});
        // this.setresize();
     }

    //当外部有数据时再调用
    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.getChartsInit().setOption(this.option);
        this.setState({loading:false});
     //   this.setresize();

    }

    // prepareOption(params={} xAxisData,seriesData,extraOptions) {
    prepareOption(params={}) {
        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];

        if( params.extraOptions.extra != undefined ){
            ///每系列label 显示格式等配置信息
            if( params.extraOptions.extra.label != undefined ){
                $.extend(true,this.label,params.extraOptions.extra.label);
            }

            //serisesCenter 每个系列的饼图所处容器内的位置
            if( params.extraOptions.extra.serisesCenter != undefined ){
                $.extend(true,this.serisesCenter,params.extraOptions.extra.serisesCenter);
            }
        }

        if( params.seriesData ){
            // console.log(params.seriesData);
            // _(seriesData).map((v,k)=>{
            //     //v['smooth'] = true;
            //     v['type'] = 'pie';
            //     v['label'] = this.label;
            //     //v['center'] = ['50%','50%'];
            //     v['center'] = this.serisesCenter;
            //     seriesDataRes.push(v);
            //     //legendRes.push(v['name']);
            // });
            seriesDataRes = this.getSeriesData(params.seriesData);
            // console.log(seriesDataRes);
            // $.extend(this.option,{
            //     series:seriesDataRes
            // });
            //console.log(this.option);
            this.option.series = seriesDataRes;
            //this.option.legend.data = legendRes;
        }
        if( params.extraOptions ){
            $.extend(true,this.option,params.extraOptions);
        }

        let selected = false;
        if( params.extraOptions && params.extraOptions.extra != undefined && params.extraOptions.extra.selectedIndex != undefined ){
            selected = true;
            //selectedDefault = this.props.extraOptions.selected;
        }

        if( selected ){
            // selected 为true 时默认选择第条数据
            //this.option.series[0]['data'][this.props.extraOptions.extra.selectedIndex]['selected'] = true;
        }

        if( selected ){
            // selected 为true 时默认显示第一条记录的tip效果
            this.getChartsInit().dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.extraOptions.extra.selectedIndex
            });

            this.getChartsInit().dispatchAction({
                type: 'highlight',
                // 可选，系列 index，可以是一个数组指定多个系列
                seriesIndex:0,
                // 可选，数据的 index
                dataIndex:params.extraOptions.extra.selectedIndex,
            });
        }
    }

    //获得seriesData的数据
    getSeriesData(data){
        let seriesData = [];
        _(data).map((v,k)=>{
            v['type'] = 'pie';
            v['radius']=this.radius;
            v['avoidLabelOverlap'] =false;
            v['itemStyle']={normal: {}};
            seriesData.push(v);
        });

        return seriesData;
    }
    //对window对象添加监听句柄，resize当窗口或框架被重新调整大小时触发
  /*  setresize(){
        window.addEventListener('resize', function () {
            this.getChartsInit().resize();
        });
    }*/

    render(){
        return(
            <JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="chart_height" >
                    <div  id="chartsRangemap"  style={{width:'100%',height:'250px'}} ref="container" > </div>
                </div>
            </JfCard>
        );
    }
}
