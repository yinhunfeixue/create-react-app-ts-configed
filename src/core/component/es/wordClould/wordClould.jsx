import React, {Component} from 'react'
import {JfCard} from 'app_common';

const $ = require('jquery');
const echarts = require('echarts');
require('echarts-wordcloud');
//import './css/index.css';

/*
    echarts3里没有wordcloud字符云库，许另外npm安装echarts-wordcloud
    配置例如：this.defaultOption
    其他配置 参照：https://github.com/ecomfe/echarts-wordcloud
*/

export default class WordClould extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title, //模块标题
            extraOptions: this.props.extraOptions, //option扩展配置项
            loading: true,
            data: 0,
            data_tag: [],
            tagTitle: []
        };

        this.defaultOption = {
            baseOption: {
                timeline: {
                    data: ["2017-04-01", "2017-05-01", "2017-06-01"]
                },
                title: {
                    text: '特征标签',
                    textStyle: {
                        fontWeight: 'normal'
                    }
                },
                series: [
                    {
                        width: '100%',
                        height: '100%',
                        type: 'wordCloud',
                        gridSize: 10,
                        sizeRange: [
                            14, 14
                        ],
                        rotationRange: [
                            0, 0
                        ],
                        shape: 'circle',
                        textStyle: this.createRandomItemStyle()
                    }
                ]
            },
            options: [
                {
                    series: [
                        {
                            data: [
                                {
                                    name: 'Macys',
                                    value: 6181
                                }, {
                                    name: 'Amy Schumer',
                                    value: 4386
                                }, {
                                    name: 'Jurassic World',
                                    value: 4055
                                }
                            ]
                        }
                    ]
                }, {
                    series: [
                        {
                            data: [
                                {
                                    name: 'Macys111111',
                                    value: 6181
                                }, {
                                    name: 'Amy Schumer111111111',
                                    value: 4386
                                }, {
                                    name: 'Jurassic World1111111',
                                    value: 4055
                                }
                            ]
                        }
                    ]
                }, {
                    series: [
                        {
                            data: [
                                {
                                    name: 'Macys2222',
                                    value: 6181
                                }, {
                                    name: 'Amy Schumer222222',
                                    value: 4386
                                }, {
                                    name: 'Jurassic World2222222',
                                    value: 4055
                                }
                            ]
                        }
                    ]
                }
            ]
        };

    }

    createRandomItemStyle() {
        return {
            normal: {
                color: function() {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 1,
                shadowColor: '#333'
            }
        };
    }

    componentDidMount() {
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        this.ecObj.setOption(this.defaultOption);
        this.setState({loading: false});
    }

    prepareOption(args = {}) {
        let baseOptionRes = [];
        let legendRes = [];

        if (args.extraOption) {
            $.extend(true, this.defaultOption.baseOption, args.extraOption);
        }

        if (args.options) {
            this.defaultOption.options = args.options;
        }

    }

    resize() {
        this.ecObj.resize();
    }

    refreshGraph(args) {
        this.prepareOption(args);
        this.ecObj.clear();
        this.ecObj.setOption(this.defaultOption);
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
