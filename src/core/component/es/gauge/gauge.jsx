import React, {Component} from 'react'
import {JfCard} from 'app_common';
import _ from 'underscore';

const $ = require('jquery');
const echarts = require('echarts');

//import './css/index.css';

/*

extraOption ：配置项指定
    例如：
    extraOption={
        {legend:{show:false,data:['直接访问']},
        extra:{selectedIndex:0,label:{normal:{show:false}},serisesCenter:['50%','60%']}} // extra为特别的扩展项配置，自定义的一些影响显示的配置项
    }

serisesData:[{"name":'12312','data':[{value:3355, name:'直接访问'},{value:3355, name:'直接访问'}]}],
    示例：
    [{
        name:'视频广告',
        data:[{value:3355, name:'直接访问'},{value:3355, name:'直接访问'},{value:3355, name:'直接访问'}]
    }]

extraOption:{} //扩展配置
*/

export default class Gauge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title, //模块标题
            extraOptions: this.props.extraOptions, //option扩展配置项
            loading: true,
            data: 0
        };

        let angle = [
                220, -40
            ],
            splitNum = 5,
            alertVal = 0,
            targetVal = 0,
            curVal = this.state.data;

        this.option = {
            backgroundColor: '#fff',
            tooltip: {
                show: false,
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '最外层环仪表盘',
                    z: 3,
                    type: "gauge",
                    min: 0,
                    max: 100,
                    startAngle: angle[0],
                    endAngle: angle[1],
                    splitNumber: splitNum + 5,
                    axisLine: {
                        lineStyle: {
                            color: [
                                [1, "#deeeff"]
                            ],
                            width: 5
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "#fff",
                            width: 2
                        },
                        length: 0,
                        splitNumber: 1
                    },
                    axisLabel: {
                        distance: -25,
                        formatter: function(v) {
                            if (v % 1 == 0 && v != alertVal)
                                return v;
                            }
                        ,
                        textStyle: {
                            color: "#999"
                        }
                    },
                    splitLine: {
                        show: true,
                        length: 10,
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#ff388a",
                            shadowColor: 'rgba(255, 152, 194, 0.5)',
                            shadowBlur: 8
                        }
                    },
                    detail: {
                        formatter: "达成 {value}%",
                        offsetCenter: [
                            0, "60%"
                        ],
                        textStyle: {
                            fontSize: 17,
                            color: "#333"
                        }
                    },
                    title: {
                        show: false
                    },
                    pointer: {
                        length: '95%'
                    },
                    data: [
                        {
                            name: "",
                            value: curVal
                        }
                    ]
                }, {
                    name: "警戒值仪表盘",
                    type: "gauge",

                    startAngle: angle[0],
                    endAngle: angle[1],
                    splitNumber: splitNum + 5,
                    axisLine: {
                        lineStyle: {
                            color: [
                                [1, "transparent"]
                            ],
                            width: 10
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "#fff",
                            width: 2
                        },
                        length: 0,
                        splitNumber: 1
                    },
                    axisLabel: {
                        distance: -40,
                        formatter: function(v) {
                            if (v == alertVal)
                                return v + '▼';
                                //else if(v==alertVal) return ''
                            }
                        ,
                        textStyle: {
                            color: "#fb5310",
                            fontWeight: 700
                        }
                    },
                    splitLine: {
                        show: true,
                        length: 10,
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "transparent"
                        }
                    },
                    pointer: {
                        length: 0
                    },
                    detail: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    data: [
                        {
                            name: "",
                            value: ''
                        }
                    ]
                }, {
                    name: "内环仪表盘",
                    type: "gauge",
                    min: 0,
                    max: 100,
                    radius: '70%',
                    startAngle: angle[0],
                    endAngle: angle[1],
                    splitNumber: splitNum,
                    axisLine: {
                        lineStyle: {
                            color: [
                                [
                                    0.2, '#71d398'
                                ],
                                [
                                    0.4, '#ffcb63'
                                ],

                                [
                                    1, "#fe4d6e"
                                ]
                            ],
                            width: 15
                        }

                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        length: 15,
                        lineStyle: {
                            color: '#fff',
                            width: 1
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "transparent"
                        }
                    },
                    pointer: {
                        length: 0
                    },
                    detail: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    data: [
                        {
                            name: "",
                            value: ''
                        }
                    ]
                }
            ]
        };

    }

    componentDidMount() {
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        // this.ecObj.setOption(this.option);
        this.setState({loading: false});
    }

    getSeriesData(data) {
        let seriesData = [];
        _(data).map((v, k) => {
            seriesData.push(v);
        });

        return seriesData;
    }

    prepareOption(args = {}) {
        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];

        if (args.seriesData) {
            seriesDataRes = this.getSeriesData(args.seriesData);
            this.option.series[0].data[0].value = seriesDataRes[0].data;
        }

        if (args.extraOption) {
            $.extend(true, this.option, args.extraOption);
        }

    }

    resize() {
        this.ecObj.resize();
    }

    refreshGraph(args) {
        this.prepareOption(args);
        this.ecObj.clear();
        this.ecObj.setOption(this.option);
        this.setState({loading: false})
    }

    render() {
        return (<JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="chart_height">
                <div style={{
                        width: this.props.width
                            ? this.props.width
                            : "100%",
                        height: this.props.height
                            ? this.props.height
                            : "100%"
                    }} ref="container"></div>
            </div>
        </JfCard>)
    }
}
