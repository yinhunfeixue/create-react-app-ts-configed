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

export default class Radar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title, //模块标题
            extraOptions: this.props.extraOptions, //option扩展配置项
            loading: true,
            data: 0
        };

        this.option = {
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            radar: {
                indicator: [],
                radius: 85
            },
            series: [
                {
                    name: '',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                color: 'rgba(218,207,237,0.7)'
                            },
                            color: '#baa9d8'
                        }
                    },
                    data: [
                        {
                            value: [],
                            name: '用户模型'
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
            $.extend(true, this.option.series, seriesDataRes);
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
        // console.log(this.option);
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
