import React, {Component} from 'react'
import {JfCard} from 'app_common';
import _ from 'underscore';
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

//import './css/index.css';

/*

extraOptions ：配置项指定
    例如：
    extraOptions={
        {legend:{show:false,data:['直接访问']},
        extra:{selectedIndex:0,label:{normal:{show:false}},serisesCenter:['50%','60%']}} // extra为特别的扩展项配置，自定义的一些影响显示的配置项
    }

serisesData:[{"name":'12312','data':[{value:3355, name:'直接访问'},{value:3355, name:'直接访问'}]}],
    示例：
    [{
        name:'视频广告',
        data:[{value:3355, name:'直接访问'},{value:3355, name:'直接访问'},{value:3355, name:'直接访问'}]
    }]

extraOptions:{} //扩展配置
*/
const {textColor,seriesColor} = SliceStyle;

export default class ChartPie extends Component{
    constructor(props){
        super(props);

        this.state={
            title:this.props.title,//模块标题　　
            extraOptions:this.props.extraOptions, //option扩展配置项
            loading:true
        };

        //每系列label配置信息
        this.label = {
            normal:{
                show: true,
                //position:'inside',
                //align:'left',
                color:textColor,
                formatter: "{b}\n{d}%"
            }
        };
        this.serisesCenter = ['50%','50%'];
        this.serisesRadius = '50%'
        this.option = {
            title:{
                text:'',
                left:'16%',
                //align:'center',
                textStyle:{
                    color:textColor,
                    //align:'center',
                    fontSize:'13'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            color: seriesColor,
            grid: {
                bottom:'7%',
                left: '7%',
            //    containLabel: true
            },
            legend: {
                show:true,
                top:'7%',
                orient: 'vertical',
                x : 'left',
                data:[],
                textStyle: {
                    color: textColor
                }
            },
            tooltip : {
                trigger: 'item',
                //position: ['20%', '80%'],
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            series: [
                {
                    name:'交易金额分布',
                    type:'pie',
                    //radius : '15%',
                    //center: ['50%', '60%'],
                //    center:['20%','60%'],

            //        stack: '总量',
                    data:[],
                },

            ]
        };


    }

    componentDidMount(){
        let dom = this.refs.container,_this = this;
        this.ecObj = echarts.init(dom);
        this.ecObj.on('click', function (params) {
            // console.log(params,'params')
            // console.log(_this,'_this')
           if(_this.props.echartsClick){
                _this.props.echartsClick(params)
           }
        })
    }

    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.ecObj.clear();
        // console.log(this.option);
        this.ecObj.setOption(this.option);
        this.setState({loading:false});
    }

    resize(){
        this.ecObj.resize();
    }

       // prepareOption(params={} xAxisData,seriesData,extraOptions) {
    prepareOption(params={}) {

        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];

        if( params.extraOptions&&params.extraOptions.extra != undefined ){
            ///每系列label 显示格式等配置信息
            if( params.extraOptions.extra.label != undefined ){
                $.extend(true,this.label,params.extraOptions.extra.label);
            }

            //serisesCenter 每个系列的饼图所处容器内的位置
            if( params.extraOptions.extra.serisesCenter != undefined ){
                $.extend(true,this.serisesCenter,params.extraOptions.extra.serisesCenter);
            }
            // console.log(params.extraOptions.extra)
             //serisesCenter 每个系列的饼图所处容器内的位置
             if( params.extraOptions.extra.serisesRadius != undefined ){
                this.serisesRadius = params.extraOptions.extra.serisesRadius
                // console.log(this.serisesRadius,22222222222222222)
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
            this.ecObj.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.extraOptions.extra.selectedIndex
            });

            this.ecObj.dispatchAction({
                type: 'highlight',
                // 可选，系列 index，可以是一个数组指定多个系列
                seriesIndex:0,
                // 可选，数据的 index
                dataIndex:params.extraOptions.extra.selectedIndex,
            });
        }
    }

    getSeriesData(data){
        // console.log(this.serisesRadius,"this.serisesRadiusthis.serisesRadius")
        let seriesData = [];
        _(data).map((v,k)=>{
            //v['smooth'] = true;
            v['radius'] = this.serisesRadius;
            v['type'] = 'pie';
            v['label'] = this.label;
            v['center'] = this.serisesCenter;
            v['labelLine']={emphasis:{show:true}};
        //    v['markPoint'] = {symbol:'circle'};
            seriesData.push(v);
        });

        return seriesData;
    }

    render(){
        return (

            <JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="markets_exponent_line" >
                    <div style={{width:this.props.width?this.props.width:'100%', height:this.props.height ? this.props.height:'100%'}} ref="container" > </div>
                </div>
            </JfCard>
        )
    }
}
