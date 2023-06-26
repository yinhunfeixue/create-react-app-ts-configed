import React, {Component} from 'react'
import {JfCard} from 'app_common';
import _ from 'underscore';
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

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
const {
    textColor,
    ringPiePlaceHolderColor,
    ringPiePlaceHolderEmphasisColor,
    seriesColor
} = SliceStyle;
export default class RingPie extends Component{
    constructor(props){
        super(props);

        this.state={
            title:this.props.title,//模块标题　　
            extraOptions:this.props.extraOptions, //option扩展配置项
            loading:true
        };

        this.serisesCenter = ['50%','50%'];
        this.placeHolderStyle = {
            normal: {
                label: {
                    show: false,
                    position: "center"
                },
                labelLine: {
                    show: false
                },
                color: ringPiePlaceHolderColor,
            },
            emphasis: {
                color: ringPiePlaceHolderEmphasisColor
            }
        };

        this.serisesItem = {
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: ['55%', '61%'],
            center: ['30%', '57%'],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'outside',
                        color:textColor
                    },
                    labelLine: {
                        show: false,
                        length: 0,
                        smooth: 0.5
                    },
                }
            },
            data: [{

            }, {

                itemStyle: this.placeHolderStyle
            }]
        };

        this.option = {

            title : [

            ],
            legend: {
                top:'5.1%',
                left: 'center',
                itemHeight:8,
                itemWidth:8,
                itemGap:80,
                data: [],
                textStyle:{
                    color:textColor
                }
            },
            series : []
        };

    }

    componentDidMount(){
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
    }

    getSeriesData(data){
        let seriesData = [];
        _(data).map((v,k)=>{
            $.extend(true,v,this.serisesItem,{
                itemStyle:{
                    normal:{
                        color:seriesColor?seriesColor[(k/(seriesColor.length||1))]:undefined
                    }
                }
            });
            seriesData.push(v);
        });

        return seriesData;
    }

    prepareOption(args = {}) {

        let seriesDataRes = [];

        if( args.seriesData ){
            seriesDataRes = this.getSeriesData(args.seriesData);
            this.option.series = seriesDataRes;
        }

        if( args.extraOption ){
            $.extend(true,this.option,args.extraOption);
        }

    }

    resize(){
        this.ecObj.resize();
    }

    refreshGraph(args){
        this.prepareOption(args);
        this.ecObj.clear();
        this.ecObj.setOption(this.option);
        this.setState({
            loading:false
        })
    }


    render(){
        return (
            <JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="chart_height" >
                    <div style={{width:'100%',height:'100%'}} ref="container" > </div>
                </div>
            </JfCard>
        )
    }
}
