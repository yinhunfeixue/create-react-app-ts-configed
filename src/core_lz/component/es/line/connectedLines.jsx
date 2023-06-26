import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
import {JfCard} from 'app_common'
import moment from 'moment';
import {Modal} from 'antd';
import SliceStyle from 'app_js/sliceStyle';

/*
extraOption:{topOption,bottomOption,base},
topData:[{name:'',data:[]}],上半部分系列
bottomData:[{name:'',data:[]}],下半部分系列
xAxisData:{name:'',data:[]},x轴
showPie:boolean 是否显示饼图,
sumName:{top:'',bottom:''}显示总和时标注的名称，没有则不配置
dataUnit:{top:[],bottom:[]}单位
topPieData:[{name:'',data:[]}] 在showPie的情况下，使用额外的饼图数据
bottomPieData:[{name:'',data:[]}]
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
    seriesColor,
    lineColor,
    axisNameColor,
    yAxisSplitLineColor,
    legendInactiveColor,
} = SliceStyle;
class ConnectedLines extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        this.state = {
            loading:this.props.loading ||true,
            modalVisible:false
        }
        //两个折线图公共的默认option
        this.defaultOption = {

            //折线及饼图系列公共配置
            series:[{
                type:'line',
                areaStyle:{
                    normal:{
                        opacity:0.5
                    }
                },
                //折线堆叠
                stack:'sum',
                z:50
            },{
                type:'pie',
                center:["27%","22%"],
                radius:[0,"33%"],
                hoverAnimation:false,
                label:{
                    normal:{
                        position:'inside',
                        formatter:'{b}\n{d}%'
                    }
                },
                animation:false,
                z:100
            }],
            grid:{
                top:'23%',
                bottom:'17%',
                left:'center',
                width:'80%'

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
                boundaryGap:['10%','10%'],
                splitLine:{
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
                //位置固定在左上角
                position:[10,0],
                backgroundColor:'transparent',
            },
            legend:{
                show:false,
                orient:'vertical',
                right:'0',
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
        //两个折线图的option, topOption为上方折线图，bottomOption为下方折线图
        this.topOption = {};
        this.bottomOption = {};
    }
    //触发时间轴组件切换事件，切换饼图数据
    setTimeline(type,index){
        let appendString = 'Chart';
        if(this.state.modalVisible){
            appendString = 'ChartModal';
        }
        this[type+appendString].dispatchAction({
            type: 'timelineChange',
            currentIndex: index
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            loading:nextProps.loading
        })
    }
    //组件加载完成后对两个折线图setOption
    componentDidMount(){
        //渲染图形的容器
        let topDom = this.refs.topChart;
        this.topChart = echarts.init(topDom);
        let bottomDom = this.refs.bottomChart;
        this.bottomChart = echarts.init(bottomDom);
        echarts.connect([this.topChart,this.bottomChart]);
    }
    resize(){
        this.topChart.resize();
        this.bottomChart.resize();
    }

    refreshGraph(arg){
        const params = {...arg};
        this.topData = params.topData.slice();
        this.bottomData = params.bottomData.slice();
        this.topChart.clear();
        this.bottomChart.clear();
        this.prepareOption(params);
        this.topChart.setOption(this.topOption);
        this.bottomChart.setOption(this.bottomOption);
        this.setState({
            loading:false
        })
        // this.setState({title:name+'各项支出趋势图'});
    }

    //根据数据组合两个option
    prepareOption(arg={}) {
        let _this = this;
        this.extraOption = arg.extraOption||{};
        const addOption = {
            //时间轴组件，用于折线图提示条变化时切换饼图数据
            timeline:{
                data:arg.xAxisData.data,
                show:false,
                currentIndex:arg.xAxisData.data.length-1
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
                name:arg.xAxisData.name,
                //x轴数据
                data:arg.xAxisData.data
            }
        }
        this.defaultOption.xAxis = {};
        // const __defaultOption = {...this.defaultOption,...addOption,...this.extraOption.base};
        // console.log({...this.defaultOption});
        // console.log(JSON.stringify(__defaultOption));
        $.extend(true,this.defaultOption,addOption,this.extraOption.base||{});
        // console.log(JSON.stringify(this.defaultOption));

        let array = ['top','bottom'];
        let showTopN = arg.showTopN||{};
        let dataUnit = arg.dataUnit||{top:[],bottom:[]};
        //对两个option操作
        for(let i=0;i<array.length;i++){
            let type = array[i];
            let data = this[type+'Data'];
            let timelineSeries = [];
            let legendData = [];
            //额外的系列相关配置
            let extraSeriesOption = {};
            if(_this.extraOption[type+'Option']&&_this.extraOption[type+'Option'].series){
                extraSeriesOption = _this.extraOption[type+'Option'].series;
            }
            //仅显示n条
            let selectedN = showTopN[type];
            //图例列表
            let selected = {};
            //基础Option的系列中添加折线图数据（折线图数据固定）
            let baseSeries = data.map(function(item,index) {
                //扩展的option中折线图系列无需替换数据
                timelineSeries.push({});
                legendData.push(item.name);
                if(selectedN&&index>=selectedN){
                    selected[item.name] = false;
                }
                return $.extend(true,{},_this.defaultOption.series[0],item,extraSeriesOption[0]);
            });
            let options = [];
            //是否需要显示饼图
            if(arg.showPie){
                //为timeline组件准备多个扩展的option, 每组饼图数据对应一个option
                let pieData = data;
                if(arg[type+'PieData']){
                    pieData = arg[type+'PieData'];
                }
                options = arg.xAxisData.data.map(function(xItem,index) {
                    return {
                        //不同x轴数据时，对应的饼图数据
                        series:timelineSeries.concat({
                            data:pieData.map(function(item) {
                                return {
                                    name:item.name,
                                    value:item.data[index]
                                };
                            })
                        })
                    };
                });
                this[type+"Option"].options = options;
                //基础option中增加饼图的基础配置
                baseSeries = baseSeries.concat(this.defaultOption.series[1]);
            }
            //最终组合形成两个折线图的option
            let tooltip = {
                textStyle:{
                    color:textColor
                },
                formatter:function(params) {
                    if(arg.showPie){
                        //切换饼图数据
                        _this.setTimeline(type,params[0].dataIndex);
                    }
                    let sumValue = 0;
                    let tooltipString = params.map(function(item) {
                        //每个系列的总和
                        sumValue+=item.value;
                        return '<em >'+item.seriesName+"："+item.value+(dataUnit[type][item.seriesIndex]||'')+'</em>';
                    }).join("   ");
                    let sum = '';
                    //如果需要分别显示两个折线图的总和
                    if(arg.sumName){
                        sum = '<em >'+arg.sumName[type]+"："+sumValue+(dataUnit[type][0]||'')+'   '+'</em>';
                    }
                    //额外的提示条信息
                    let appendString = '';
                    if(arg.tooltipData&&arg.tooltipData[type]){
                        appendString='<em>'+arg.tooltipData[type].map(function(appendItem) {
                            return appendItem.name+appendItem.data[params[0].dataIndex]+(appendItem.unit||'');
                        }).join('</em><em>')+'</em>';
                    }
                    let xString = '';
                    //如果需要显示x轴信息
                    if(arg.xAppendtoTip){
                        let format = arg.xAppendtoTip.format;
                        //x轴时间格式化
                        if(format){
                            xString = moment(params[0].name,format[0]).format(format[1]);
                        }
                        else {
                            xString = params[0].name;
                        }
                        if(arg.showPie){
                            xString = '<em> '+xString+'</em>';
                        }
                    }
                    return xString+appendString+tooltipString+sum;
                }
            };
            if(arg.tooltipType==='plain'){
                tooltip = {
                    position:'auto',
                    backgroundColor:'rgba(50,50,50,0.7)',
                    formatter:function(params) {
                        if(arg.showPie){
                            //切换饼图数据
                            _this.setTimeline(type,params[0].dataIndex);
                        }
                        let sumValue = 0;
                        let tooltipString = params.map(function(item) {
                            //每个系列的总和
                            sumValue+=item.value;
                            return item.seriesName+"："+item.value+(dataUnit[type][item.seriesIndex]||'');
                        }).join('<br />');
                        let sum = '';
                        //如果需要分别显示两个折线图的总和
                        if(arg.sumName){
                            sum = arg.sumName[type]+"："+sumValue+(dataUnit[type][0]||'')+'<br />';
                        }
                        //额外的提示条信息
                        let appendString = '';
                        if(arg.tooltipData&&arg.tooltipData[type]){
                            appendString='<br />'+arg.tooltipData[type].map(function(appendItem) {
                                return appendItem.name+': '+appendItem.data[params[0].dataIndex]+(appendItem.unit||'');
                            }).join('<br />');
                        }
                        let xString = '';
                        //如果需要显示x轴信息
                        if(arg.xAppendtoTip){
                            let format = arg.xAppendtoTip.format;
                            //x轴时间格式化
                            if(format){
                                xString = moment(params[0].name,format[0]).format(format[1]);
                            }
                            else {
                                xString = params[0].name;
                            }
                            xString+='<br />';
                        }
                        return xString+sum+tooltipString+appendString;
                    }
                };
            }
            this[type+"Option"].baseOption = $.extend(true,{},this.defaultOption,addOption,{
                series:baseSeries,
                legend:{
                    data:legendData,
                    selected
                },
                //配置提示条组件显示内容
                tooltip
            },this.extraOption[type+'Option']||{});
        }
    }
    setModalVisible(modalVisible) {
        this.setState({ modalVisible },()=>{
            if(!this.topChartModal&&modalVisible){
                let topDomModal = this.refs.topChart_modal;
                this.topChartModal = echarts.init(topDomModal);
                let bottomDomModal = this.refs.bottomChart_modal;
                this.bottomChartModal = echarts.init(bottomDomModal);
                echarts.connect([this.topChartModal,this.bottomChartModal]);
                this.topChartModal.setOption(this.topOption);
                this.bottomChartModal.setOption(this.bottomOption);
            }
        });
    }
    render(){
        if(this.props.largeModal){
            return (
                <JfCard title={this.props.title} loading={this.state.loading} hasTip={this.props.hasTip}>
                    <div className="markets_exponent_chart ">
                        <div ref="topChart" style={{width:'100%',height:'50%'}}></div>
                        <div ref="bottomChart" style={{width:'100%',height:'50%'}}></div>
                    </div>
                    <i className="anticon anticon-arrows-alt"  onClick={() => this.setModalVisible(true)}></i>
                    <Modal
                        title={this.props.title}
                        width={1000}
                        visible={this.state.modalVisible}
                        onOk={() => this.setModalVisible(false)}
                        onCancel={() => this.setModalVisible(false)}
                         className="market_modal_footer"
                       >
                       <div className="markets_exponent_chart market_span_1">
                           <div ref="topChart_modal"  className="market_modal_l"></div>
                           <div ref="bottomChart_modal"  className="market_modal_r"></div>
                       </div>
                     </Modal>
                </JfCard>
            );
        }
        return (<JfCard title={this.props.title} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="topChart" style={{width:'100%',height:'50%'}} ></div>
                <div ref="bottomChart" style={{width:'100%',height:'50%'}} ></div>
            </div>
        </JfCard>);
    }
}

export default ConnectedLines;
