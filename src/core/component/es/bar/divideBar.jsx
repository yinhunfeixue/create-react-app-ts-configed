import React from 'react'
import {JfCard} from 'app_common'
import $ from 'jquery';
import echarts from 'echarts';
import BaseComponent from '../baseComponent';
import ico from '../../resources/dmp/images/ico.png'
import SliceStyle from 'app_js/sliceStyle';

const {seriesColor,lineColor,textColor} = SliceStyle;

export default class DivideBar extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title
        };
        let _this = this;
        this.option = {};
        this.widthCut = {};
        let dataUnit = _this.props.dataUnit||[];
        let renderItemFun = this.renderItem.bind(this);
        let tooltipShowFun = this.tooltipShow.bind(this);
        this.defaultOption = {
            color: seriesColor,
            grid: {
                left: '0%',
                top: '7%',
                right: '3%',
                bottom: '20%',
                containLabel: true
            },
            tooltip: {
                show:true,
                formatter:function (params) {
                    return tooltipShowFun(params);
                }
            },
            xAxis: [{
                name:'指标值',
                type: 'value',
                //这个一定要设，不然barWidth和bins对应不上
                scale: true,
                axisLine:{
                    show:true,
                    lineStyle:{
                        //width:10
                        color:lineColor
                    }
                },
                axisTick:{
                    show:false,
                },
                axisLabel:{
                    show:false,
                    color:textColor
                }
            }],
            yAxis: [{
                name:'人数比例',
                type: 'value',
                axisLine:{
                    lineStyle:{
                        color:lineColor
                    }
                }
            }],
            series: [{
                type: 'bar',
                barWidth: '99.3%',
                itemStyle:{
                    normal:{
                        borderColor:lineColor,
                        borderWidth:1,
                    }
                },
                label: {
                    show:true,
                    normal: {
                        show: false,
                        position: 'top',
                        formatter: function (params) {
                            return params.value[1];
                        }
                    }
                },
                markPoint: { // markLine 也是同理
                           symbol:'image://'+ico,
                           symbolSize:11,
                           label:{
                               normal: {
                                   show:true,
                                   color:textColor,
                                   formatter:'{c}\n\n{b}',
                                   position:'bottom',
                               }
                           },
                           tooltip: {
                               show:false,
                               //formatter:'{c}\n\n{b}',
                           },
                           data: [
                               {
                                   name:'25%',
                                   value:8.5,
                                   coord: [63, 0],

                               },
                               {
                                   name:'50%',
                                   value:8.5,
                                   coord: [70, 0],
                               }
                           ]
                       },
                data: [
                    [62.5,3],
                    [67.5,8],
                    [72.5,9],
                    [77.5,5],
                    [82.5,10],
                    [87.5,3],
                ]
            }]
        };
    }

    tooltipShow(params){
        let dix = params['dataIndex'];
        if( this.widthCut[dix] != undefined ){
            let s0 = Math.floor(this.widthCut[dix][0] * 100) / 100;
            let s1 = Math.floor(this.widthCut[dix][1] * 100) / 100;
            return "指标区间："+s0+"~"+s1+"<br />"+"人数比例："+params.value[1]+"%";
        }

    }

    renderItem(params, api) {

        console.log(api);
        var yValue = api.value(2);
        var start = api.coord([api.value(0), yValue]);
        var size = api.size([api.value(1) - api.value(0), yValue]);
        var style = api.style();

        var res = {
            type: 'rect',
            shape: {
                x: start[0] + 1,
                y: start[1],
                width: size[0] - 2,
                height: size[1]
            },
            style: style
        };
        console.log(res);
        return res;
    }

    refreshGraph(arg) {
        const params = {
            ...arg
        };

        if ( params['widthCut'] !=undefined ){
            this.widthCut = params['widthCut'];
        }
        //this.option = this.defaultOption;
        this.prepareOption(params);
        this.ecObj.clear();
        console.log(this.defaultOption);
        this.ecObj.setOption(this.option);
        this.setState({loading: false})
        // this.setState({title:name+'各项支出趋势图'});
    }

    componentDidMount() {
        // this.prepareOption(params.xAxisData,params.seriesData,params.extraOption);
        //this.option = this.defaultOption;
        const containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        //this.option = this.defaultOption;
        // this.ecObj.setOption(this.defaultOption);
        // this.option = {};
    }

    // componentDidMount(){
    //     let dom = this.refs.container;
    //     this.chart = echarts.init(dom);
    //     this.prepareOption();
    //     console.log(this.defaultOption);
    //     this.chart.setOption(this.defaultOption);
    // }
    prepareOption(params = {}) {

        let _this = this;
        if (params.extraOption) {
            this.option = $.extend(true, {},this.defaultOption, params.extraOption);
        }else{
            this.option = $.extend(true, {},this.defaultOption);
        }

        if (params.series) {
            $.extend(true,this.option.series, params.series);
        }


    }

    render(){
        return (<JfCard title={this.state.title||''}>
            <div className="markets_exponent_chart">
                <div ref="container" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
