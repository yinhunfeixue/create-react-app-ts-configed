import React, {Component} from 'react'
import {JfCard} from 'app_common';
import _ from 'underscore';
import SliceStyle from 'app_js/sliceStyle';

const $ = require('jquery');
const echarts = require('echarts');

//import './css/index.css';

/*
xAxisData:{name:'日期',data:[]},
    示例： data:["2015/1/5","2015/1/6","2015/1/7"

seriesData:[{"name":'12312','data':'[]},{"name":'12312','data':'[]}],
    示例：
    [{
        name:'视频广告',
        data:[150, 232, 201, 154, 190, 330, 410]
    }]

extraOption:{} //扩展配置
showTopN:number //仅显示前n个系列
dataUnit:[] 单位
tooltipData:[{seriesIndex:number},{name:'',data:[],unit:''}]提示条数据 数据中已存在采取前一种形式，否则采取后一种
*/
// {
//     xAxis:[2010],   x轴数据集合
//     seriesData:[
//         {
//             data:[]
//         },
//         {
//             data:[]
//         }
//     ]
//     series:{
//         "2010":{
//             "key1":"value1",
//             "key2":
//         }
//     }
//     [{data:[]},{}]
// }
const {
    seriesColor,
    legendInactiveColor,
    textColor,
    xAxisSplitLineColor,
    lineColor,
    yAxisSplitLineColor,
    axisNameColor,
    tipTextColor,
} = SliceStyle;
export default class ChartLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title,
            loading: this.props.loading || true
        };
        let _this = this;
        this.itemAreaStyle = {}; //{normal: {areaStyle: {type: 'default'}}} 面积图时配置
        this.option = {
            color: seriesColor,
            grid: {
                left: '5%',
                right: '9%',
                bottom: '6%',
                top: '10%',
                containLabel: true
            },
            legend: {
                show: false,
                data: [],
                top: '5%',
                left: '9%',
                icon: 'circle',
                itemWidth: 8,
                inactiveColor: legendInactiveColor,
                textStyle: {
                    color: textColor
                }
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: { //网格线
                    show: false,
                    lineStyle: {
                        color: xAxisSplitLineColor,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: lineColor
                    }
                },
                data: [],
                axisLabel: {
                    show: true,
                    // interval: 0, 表示x轴值所有显示
                    color: textColor
                }
            },
            yAxis: {
                splitNumber: 4,
                show: true,
                offset: 0,
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: textColor
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: { //网格线
                    show: true,
                    lineStyle: {
                        color: yAxisSplitLineColor,
                        type: 'solid'
                    }
                },
                nameLocation: 'middle',
                nameGap: 38,
                nameTextStyle: {
                    color: axisNameColor
                }
            },
            series: [
                {
                    smooth: true,
                    type: 'line',
                    data: []
                }
            ]
        };

    }

    resize() {
        this.ecObj.resize();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({loading: nextProps.loading})
    }

    refreshGraph(arg) {
        const params = {
            ...arg
        };
        this.prepareOption(params);
        this.ecObj.clear();
        this.ecObj.setOption(this.option);
        this.setState({loading: false})
    }

    componentDidMount() {
        const containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        // this.ecObj.setOption(this.option);
    }

    getSeriesData(data, dataUnit = []) {
        let seriesDataRes = [];
        let legendRes = [];

        _(data).map((v, k) => {
            v['smooth'] = true;
            v['type'] = 'line';
            v['itemStyle'] = this.itemAreaStyle;
            v['label'] = {
                normal: {
                    show: false,
                    formatter: '{c}' + (
                    dataUnit[k] || '')
                }
            };
            seriesDataRes.push(v);
            legendRes.push(v['name']);
        });

        return {seriesDataRes: seriesDataRes, legendRes: legendRes};
    }

    prepareOption(params = {}) {

        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];
        let itemAreaStyleShow = false;
        let dataUnit = params.dataUnit || [];
        const addOption = {
            tooltip: {
                trigger: 'axis',
                bordeRadius: 10,

                position: "top",
                textStyle: {
                    fontSize: 14,
                    color: tipTextColor
                },
                formatter: function(re) {
                    //提示条没有额外配置则使用原有数据
                    if (!params.tooltipData) {
                        return re[0].name + '<br />' + re.map(function(item) {
                            return item.seriesName + ' : ' + item.value + (dataUnit[item.seriesIndex] || '');
                        }).join('<br />');
                    }
                    //提示条有额外配置
                    return re[0].name + '<br />' + params.tooltipData.map(function(item) {
                        //数据来自系列中的数据
                        if (item.seriesIndex !== undefined) {
                            let tar = params.seriesData[item.seriesIndex];
                            return tar.name + ' : ' + tar.data[re[0].dataIndex] + (dataUnit[item.seriesIndex] || '');
                        }
                        //数据额外配置
                        return item.name + ' : ' + item.data[re[0].dataIndex] + (item.unit || '');
                    }).join('<br />');
                }
            }
        }
        if (params.extraOption) {
            $.extend(true, this.option, params.extraOption);

            //this.label
            if (params.extraOption.extra != undefined) {
                if (params.extraOption.extra.itemAreaStyle != undefined) {
                    itemAreaStyleShow = true;
                    $.extend(true, this.itemAreaStyle, params.extraOption.extra.itemAreaStyle);
                }
            }

        }

        if (params.seriesData) {
            let resList = this.getSeriesData(params.seriesData, params.dataUnit);
            this.option.series = resList['seriesDataRes'];
            this.option.legend.data = resList['legendRes'];
        }

        if (params.xAxisData) {
            this.option.xAxis = {
                ...this.option.xAxis,
                name: params.xAxisData.name,
                data: params.xAxisData.data
            }
        }
        if (params.showTopN) {
            this.option.legend.selected = {};
            let legendData = this.option.legend.data;
            for (let i = 0; i < legendData.length; i++) {
                if (i >= params.showTopN) {
                    this.option.legend.selected[legendData[i]] = false;
                }
            }
        }

        $.extend(true, this.option, addOption, params.extraOption);

    }

    render() {
        return (<JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="chart_height">
                <div style={{
                        width: this.props.width
                            ? this.props.width
                            : '100%',
                        height: this.props.height
                            ? this.props.height
                            : '100%'
                    }} ref="container"></div>
            </div>
        </JfCard>)
    }
}
