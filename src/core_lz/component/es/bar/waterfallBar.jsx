import React, {Component} from 'react'
import {JfCard} from 'app_common'
import _ from 'underscore';

const $ =  require('jquery');
const echarts = require('echarts');

//import './css/index.css';

/*
瀑布图
extraOptions ：配置项指定
    例如：
    extraOptions={
        {legend:{show:false,data:['直接访问']},
        extra:{selectedIndex:0,label:{normal:{show:false}},serisesCenter:['50%','60%']}} // extra为特别的扩展项配置，自定义的一些影响显示的配置项
    }

xAxisData:{name:'日期',data:['201701','201702','201703','201704','201705','201706']} //x轴数据
serisesData:[300, 300, 500, 600, 1300,'-'] //用来做隐藏柱子实现瀑布图效果
totalSerisePosition:first， last 控制总量柱子显示的位置
viewType: up|down 递增|递减 展示效果
dataUnit: 系列数据单位等
*/

export default class WaterfallBar extends Component{
    constructor(props){
        super(props);

        this.state={
            title:this.props.title,//模块标题　　
            loading:true,
            extraOption:this.props.extraOption, //option扩展配置项
            totalSeriseData:this.props.totalSeriseData?this.props.totalSeriseData:{},
            viewType:this.props.viewType?this.props.viewType:'up',
        };
        let _this = this;

        //每系列label配置信息
        this.label = {
            normal:{
                show: true,
                //position:'inside',
                //align:'left',
                color:'#fff',
                formatter: "{b}\n{d}%"
            }
        };

        this.totalSeriseOption = {
            name: '本年累计佣金收入(万元)',
            type: 'bar',
            barGap:'-100%',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#23cdfa',
                    //color:'#6ddf27',
                    borderWidth:0,
                    borderColor:'#000'
                }
            },
            data:[]
        };

        this.defaultOption = {
            title: {
                // text: '深圳月最低生活费组成（单位:元）',
                // subtext: 'From ExcelHome',
                // sublink: 'http://e.weibo.com/1341556070/AjQH99che'
            },
            legend:{
                show:true,
                data:[],
                icon: 'circle',
               itemWidth: 9,
               itemHeight: 9,
               top:'5%',
               inactiveColor: '#7d7996',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                //type : 'value'
                splitNumber:4,
                nameTextStyle:{
                    color:'#7d919e',
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        color:'#65607f'
                    }
                },
                axisTick:{
                    show:false
                },
                show:true,
                axisLabel:{
                    color:'#9db7c0'
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#65607f'
                    }
                }
            },
            series: [

                {
                    name: '辅助',
                    type: 'bar',
                    stack:  '总量',
                    itemStyle: {
                        normal: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: [],
                    tooltip:{
                        show:false
                    }
                },

                {
                    name: '单月佣金收入(万元)',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal:
                        {
                            show: true,
                            position: 'inside'
                        }
                    },
                    itemStyle:{
                        normal:{
                            color:'#bea0e3',
                            borderWidth:0,
                            borderColor:'#000'
                        }
                    },
                    data:[]
                },

            ]
        };
    }

    componentDidMount(){
        //
        // if( this.props.totalSeriseOption != undefined ){
        //     $.extend(true,this.totalSeriseOption,this.props.totalSeriseOption);
        // }
        //
        // this.prepareOption(this.props.xAxisData,this.props.extraOptions,this.props.seriesData);
        // console.log("this.defaultOption");
        // console.log(this.defaultOption);
        let containerEle = this.refs.container;
        this.ecObj = echarts.init(containerEle);
        // this.ecObj.setOption(this.defaultOption);
    }

    resize(){
        this.ecObj.resize();
    }

    refreshGraph(arg){
        const params = {...arg};
        // this.setState({
        //     loading:false,
        //     viewType:params.viewType,
        //     totalSeriseData:params.totalSeriseData,
        // });
        this.prepareOption(params);
        this.ecObj.clear();
        this.ecObj.setOption(this.defaultOption);
        this.setState({
            loading:false
        })

        // this.setState({title:name+'各项支出趋势图'});
    }

    getSeriesData(sdata,totalSeriseData ={}){
        let seriesResData = [];
        let total = 0;
        let totalSerise = [];
        let waterfallSerise = sdata.data;
        let data = sdata.data;

        _(data).map((v,k)=>{
            //console.log(v);
            if( $.isNumeric(v) ){
                if (!isNaN(v)) {
                    v = Number(v);
                }
                total = v + total;
            }
            totalSerise.push('-');
            //helperSerData.push(cData);
        });

        if(totalSeriseData.position == "first"){
                totalSerise.unshift(total);
                waterfallSerise.unshift('-');
        }

        if(totalSeriseData.position == "last"){
                totalSerise.push(total);
                waterfallSerise.push('-');
        }

        //if(this.state.this.props.totalSerisePosition == "first"){
            this.defaultOption.series[1]['name'] = sdata.name;
            this.defaultOption.series[1]['data'] = waterfallSerise;
            if( totalSeriseData.show ){
                //console.log(this.state.totalSerisePosition);
                this.defaultOption.series[2] = this.totalSeriseOption;
                this.defaultOption.series[2]['name'] = totalSeriseData.name;
                this.defaultOption.series[2]['data'] = totalSerise;
            }
        //}




    }

    getHelperData(sHelperData,totalSeriseData={},viewType='up'){
        let helperData = sHelperData.data;
        if( helperData ){
            let helperSerData = [];
            let cData = 0;
            let total = 0;
            _(helperData).map((v,k)=>{
                //console.log(v);
                if( $.isNumeric(v) ){
                    total = Number(v) + total;
                }

                //helperSerData.push(cData);
            });
            //console.log(total);

            if( totalSeriseData.position == "first"){
                    helperSerData.push(0);
            }

            if( viewType =='down' ){
                //递增瀑布图

                /*******递增瀑布图辅助系列数据的处理，递增方式********/
                _(helperData).map((v,k)=>{
                    if( $.isNumeric(v) ){
                        if( cData == total){
                            helperSerData.push(0);
                        }else{
                            helperSerData.push(total - cData);
                            if (!isNaN(v)) {
                                v = Number(v);
                            }
                            cData = v + cData;
                        }
                    }else{
                        helperSerData.push(0);
                    }
                });
                /*********************END*********************/

            }else if( viewType =='up' ){
                _(helperData).map((v,k)=>{
                    if( $.isNumeric(v) ){
                        if( cData == total){
                            helperSerData.push(0);
                        }else{
                            helperSerData.push(cData);
                            if (!isNaN(v)) {
                                v = Number(v);
                            }
                            cData = v + cData;
                        }
                    }else{
                        helperSerData.push(0);
                    }
                });
            }

            if( totalSeriseData.position == "last"){
                    helperSerData.push(0);
            }
            //console.log("helperSerData");
            //console.log(helperSerData);
            ////this.serisesHelper.data = helperSerData;
            //$.extend(true,this.label,extraOptions.extra.label);
            //seriesDataRes.push(this.serisesHelper);
            //this.defaultOption[0]['name'] = v['name'];
            this.defaultOption.series[0]['data'] = helperSerData;
            //console.log(helperSerData);
        }
    }

    prepareOption(params={}) {

        let _this = this;
        let seriesDataRes = [];
        let legendRes = [];

        if( params.totalSeriseOption != undefined ){
            $.extend(true,this.totalSeriseOption,params.totalSeriseOption);
        }

        const addOption = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (re) {
                    //单月附加的数据
                    let tooltipString = '';
                    if(params.tooltipData){
                        tooltipString = params.tooltipData.map(function(item) {
                            return '<br />'+item.name+' : '+item.data[re[0].dataIndex]+(item.unit||'');
                        }).join('');
                    }
                    let sdUnit = params.dataUnit||'';
                    return re.map(function(item) {
                        let itemString = '';
                        switch (item.seriesIndex) {
                            case 1:
                                if(item.value!=='-'){
                                    itemString = item.name+'<br/>'+item.seriesName
                                    +' : '+item.value+sdUnit+tooltipString;
                                }
                                break;
                            case 2:
                                if(item.value!=='-'){
                                    itemString = item.seriesName + ' : ' + item.value+sdUnit;
                                }
                                break;
                            default:;
                        }
                        return itemString;
                    }).join('');
                }
            },
            xAxis: {
                type : 'category',
                splitLine: {show:false},
                axisLine:{
                    lineStyle:{
                        color:'#7d919e'
                    }
                },
                axisLabel: {
                        show: true,
                        interval: 0, //表示x轴值所有显示
                        textStyle: {
                            color: '#a2b7c5'
                        }
                },
                data : params.xAxisData.data
            }
        }


        // if( params.xAxisData ){
        //     addOption.xAxis.data = params.xAxisData.data;
        //     addOption.xAxis.name = params.xAxisData.name;
        // }

        if( params.seriesData ){
            this.getHelperData(params.seriesData,params.totalSeriseData,params.viewType);
            this.getSeriesData(params.seriesData,params.totalSeriseData);
        }

        if( params.extraOptions != undefined ){
            $.extend(true,this.defaultOption,addOption,params.extraOptions);
        }
    }

    // refreshGraph(xAxisData,seriesData,helperData){
    //     //console.log(xAxisData,seriesData);
    //     this.defaultOption.xAxis.data = xAxisData.data;
    //     this.defaultOption.xAxis.name = xAxisData.name;
    //
    //     if( helperData ){
    //         this.getHelperData(helperData);
    //     }
    //
    //     if( seriesData ){
    //         this.getSeriesData(seriesData);
    //     }
    //
    //
    //     this.ecObj.setOption(this.defaultOption);
    // }

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
