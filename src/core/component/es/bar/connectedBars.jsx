import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
import {JfCard} from 'app_common';
import moment from 'moment';
import SliceStyle from 'app_js/sliceStyle'
/*
extraOption:{topOption,bottomOption,base},
topData:[{name:'',data:[]}],上半部分系列
bottomData:[{name:'',data:[]}],下半部分系列
xAxisData:{name:'',data:[]},x轴
dataUnit:{top:[],bottom:[]}单位
tooltipData:{  附加的提示条数据
    top:[{}],
    bottom:[{}]
}
tooltipType:'' 提示条类型 可选 plain/top 默认top;
xAppendtoTip:{
format:[originalFormat,toFormat]可选
}
*/
const {
    textColor,
    lineColor,
    seriesColor,
    axisNameColor,
    yAxisSplitLineColor,
    legendInactiveColor
} = SliceStyle;
export default class ConnectedBars extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        this.state = {
            loading:true
        }
        //公共的默认option
        this.defaultOption = {
            //系列公共配置
            series:{
                type:'bar'
            },
            grid:{
                top:'23%',
                bottom:'17%',
                left:'center',
                width:'80%'
            },
            xAxis:{
                axisTick:{
                    alignWithLabel:true
                },
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                },
                axisLabel:{
                    color:textColor
                }
            },
            yAxis:{
                splitNumber:4,
                show:true,
                scale:true,
                //y轴适当向两边延伸
                nameTextStyle:{
                    color:axisNameColor,
                    padding:[0,50,0,0]
                },
                splitLine:{
                    show:false,
                    lineStyle:{
                        color:yAxisSplitLineColor
                    }
                },
                axisLabel:{
                    color:textColor
                },
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            },
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'shadow'
                }
            },
            legend:{
                show:false,
                orient:'vertical',
                icon: 'circle',
                itemWidth: 9,
                itemHeight: 9,
                inactiveColor: legendInactiveColor,
                top:'middle',
                textStyle:{
                    color:textColor
                }
            },
            color:seriesColor
        };
        //两个图的option, topOption为上方的图，bottomOption为下方的图
        this.topOption = {};
        this.bottomOption = {};
    }
    //组件加载完成后对两个折线图setOption
    componentDidMount(){
        //渲染图形的容器
        let topDom = this.refs.topChart;
        this.topChart = echarts.init(topDom);
        let bottomDom = this.refs.bottomChart;
        this.bottomChart = echarts.init(bottomDom);
    }
    resize(){
        this.topChart.resize();
        this.bottomChart.resize();
    }
    //更新数据 topData/bottomData同props，xAxisDataList同props中xAxisData.data
    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.topChart.clear();
        this.bottomChart.clear();
        this.topChart.setOption(this.topOption);
        this.bottomChart.setOption(this.bottomOption);
        echarts.connect([this.topChart,this.bottomChart]);
        this.setState({loading:false})
    }
    //根据数据组合两个option
    prepareOption(params={}) {
        this.topData = params.topData.slice();
        this.bottomData = params.bottomData.slice();
        let _this = this;
        this.extraOption = params.extraOption||{};
        $.extend(true,this.defaultOption,this.extraOption.base||{});
        let array = ['top','bottom'];
        let showTopN = this.props.showTopN||{};
        let dataUnit = params.dataUnit||{top:[],bottom:[]};
        //对两个option操作
        for(let i=0;i<array.length;i++){
            let type = array[i];
            let data = this[type+'Data'];
            let legendData = [];
            //仅显示n条
            let selectedN = showTopN[type];
            //图例列表
            let selected = {};
            let series = data.map(function(item,index) {
                legendData.push(item.name);
                if(selectedN&&index>=selectedN){
                    selected[item.name] = false;
                }
                return $.extend(true,{},_this.defaultOption.series,item);
            });
            //最终组合形成两个折线图的option
            let tooltip = {
                //位置固定在左上角
                position:[10,0],
                backgroundColor:'transparent',
                textStyle:{
                    color:textColor
                },
                formatter:function(tipParams) {
                    let tooltipString = '';
                    if(params.tooltipData&&params.tooltipData[type]){
                        tooltipString=params.tooltipData[type].map(function(tooltipItem) {
                            if(tooltipItem.seriesIndex!=undefined){
                                let seriesData = params[type+'Data'][tooltipItem.seriesIndex];
                                return seriesData.name+' : '+seriesData.data[tipParams[0].dataIndex]
                                +(dataUnit[type][tooltipItem.seriesIndex]||'');
                            }
                            return tooltipItem.name+tooltipItem.data[tipParams[0].dataIndex]+(tooltipItem.unit||'');
                        }).join('  ');
                    }
                    else {
                        tooltipString = tipParams.map(function(item) {
                            return item.seriesName+"："+item.value+(dataUnit[type][item.seriesIndex]||'');
                        }).join("  ");
                    }
                    let xString = '';
                    //如果需要显示x轴信息
                    if(_this.props.xAppendtoTip){
                        let format = _this.props.xAppendtoTip.format;
                        //x轴时间格式化
                        if(format){
                            xString = moment(tipParams[0].name,format[0]).format(format[1]);
                        }
                        else {
                            xString = tipParams[0].name;
                        }
                    }
                    return xString+tooltipString;
                }
            };
            if(_this.props.tooltipType==='plain'){
                tooltip = {
                    position:'auto',
                    backgroundColor:'rgba(50,50,50,0.7)',
                    formatter:function(tipParams) {
                        let tooltipString = '';
                        if(params.tooltipData&&params.tooltipData[type]){
                            tooltipString=params.tooltipData[type].map(function(tooltipItem) {
                                if(tooltipItem.seriesIndex!=undefined){
                                    let seriesData = params[type+'Data'][tooltipItem.seriesIndex];
                                    return seriesData.name+' : '+seriesData.data[tipParams[0].dataIndex]
                                    +(dataUnit[type][tooltipItem.seriesIndex]||'');
                                }
                                return tooltipItem.name+tooltipItem.data[tipParams[0].dataIndex]+(tooltipItem.unit||'');
                            }).join('<br />');
                        }
                        else {
                            tooltipString = tipParams.map(function(item) {
                                return item.seriesName+"："+item.value+(dataUnit[type][item.seriesIndex]||'');
                            }).join("<br />");
                        }
                        let xString = '';
                        //如果需要显示x轴信息
                        if(_this.props.xAppendtoTip){
                            let format = _this.props.xAppendtoTip.format;
                            //x轴时间格式化
                            if(format){
                                xString = moment(tipParams[0].name,format[0]).format(format[1]);
                            }
                            else {
                                xString = tipParams[0].name;
                            }
                            xString+='<br />';
                        }
                        return xString+tooltipString;
                    }
                };
            }
            this[type+"Option"].baseOption = $.extend(true,{},this.defaultOption,{
                series,
                legend:{
                    data:legendData,
                    selected
                },
                //配置提示条组件显示内容
                tooltip,
                xAxis:{
                    name:params.xAxisData.name,
                    //x轴数据
                    data:params.xAxisData.data
                }
            },this.extraOption[type+'Option']||{});
        }
    }
    render(){
        return (<JfCard title={this.props.title} hasTip={this.props.hasTip} loading={this.state.loading}>
            <div className="markets_exponent_chart">
                <div ref="topChart" style={{width:'100%',height:'50%'}}></div>
                <div ref="bottomChart" style={{width:'100%',height:'50%'}}></div>
            </div>
        </JfCard>);
    }
}
