import React, {Component} from 'react'
import {JfCard} from 'app_common';

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

export default class Mixin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title, //模块标题
            extraOptions: this.props.extraOptions, //option扩展配置项
            loading: true
        };

        this.option = {
            "calculable": true,
            "tooltip": {
                "trigger": "axis",
                formatter: function(params) {
                    var res = params[1].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (params[i].value != undefined && params[i].value != "-") {
                            res += '<br/><font color="' + params[i].color + '" size="4">●</font>' + params[i].seriesName + ' : ' + params[i].value
                        } else {
                            res += '<br/><font color="red" size="4">●</font>面包 :- '
                        }
                    }
                    return res;
                }
            },
            "legend": {
                "data": []
            },

            "grid": {
                left: '10%',
                right: '0%',
                // bottom: '0%',
                // top: '0%',
                height: '55%',
                width: '87%'
            },
            "xAxis": [
                {
                    "data": []
                }
            ],
            "yAxis": [
                {
                    "type": "value",
                    "name": "万元",
                    nameTextStyle: {
                        color: '#999',
                        fontSize: 12
                    },
                    "axisLabel": {
                        "formatter": "{value}"
                    },
                    "splitArea": {
                        "show": true
                    },
                    "scale": true
                }
            ],
            "series": []
        }
    }

    componentDidMount() {
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        // this.ecObj.setOption(this.option);
        this.setState({loading: false});
    }

    prepareOption(args = {}) {
        $.extend(true, this.option, this.props.extraOptions);
        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];

        if (args.seriesData) {
            $.extend(true, this.option.series, args.seriesData);
        }
        if (args.xAxisData) {
            $.extend(true, this.option.xAxis[0].data, args.xAxisData);
        }
        if (args.legendData) {
            $.extend(true, this.option.legend.data, args.legendData);
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
