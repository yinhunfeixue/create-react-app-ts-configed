import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
import {JfCard} from 'app_common'
import CONSTANTS from 'app_constants';
import SliceStyle from 'app_js/sliceStyle';
/*
params:{
    category:['业务量','市场份额','融资利率水平'],
    provinceThreshold:[],  省份气泡上升下降阈值
    range:[
        [0,1000],
        [0,100],
        [0,100]
    ],
    countryData:[
        {
            name:'浙江',
            data:[
                [500,0],
                [20,0.5],
                [30,3]
            ]
        }
    ],
    provinceData:{
        '浙江':{
            mapData:[
                {
                    name:'杭州市',
                    value:[200,5,6]
                }
            ],
            scatterData:[
                {
                    name:'116',
                    value:[121.557668, 29.828356, -0.0111, -0.013, 0.083],
                    rate:[],
                    message:''
                }
            ]
        }
    },
    dataUnit:['万','%','%']
}
*/
const {
    mapScatterSelectedColor,
    mapScatterColor,
    mapVisualMapColor,
    mapScatterUpColor,
    mapScatterDownColor,
    scaleBtnOnColor,
    scaleBtnOffColor,
    lineColor,
    textColor,
} = SliceStyle;

class MultiDimMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            loading:true
        };
        this.province = this.props.defaultProvince||'浙江';
        this.coord = {
            '安徽':[117.0,32.0],
            '澳门':[113.56,22.15],
            '北京':[116.55,40.2],
            '重庆':[108.0,29.9],
            '福建':[118.0,26.0],
            '甘肃':[102.4,38.1],
            '广东':[113.2,23.05],
            '广西':[108.0,24.15],
            '贵州':[107.06,27.22],
            '海南':[109.88,18.49],
            '河北':[115.0,38.9],
            '河南':[113.0,34.0],
            '黑龙江':[127.6,48.2],
            '湖北':[112.7,31.5],
            '湖南':[113.0,27.2],
            '江苏':[120.0,33.2],
            '江西':[116.0,27.5],
            '吉林':[125.4,43.43],
            '辽宁':[123.0,41.0],
            '内蒙古':[111.0,42.0],
            '宁夏':[106.3,37.6],
            '青海':[96.4,36.0],
            '山东':[118.5,36.0],
            '上海':[121.68, 31.21],
            '山西':[112.0,38.0],
            '陕西':[108.6,34.9],
            '四川':[102.5,30.57],
            '台湾':[121.2,24.5],
            '天津':[117.50,39.25],
            '香港':[114.2,22.35],
            '新疆':[86.0,41.5],
            '西藏':[90.2,30.9],
            '云南':[102.4,25.25],
            '浙江':[120.0,29.18]
        };
        this.provinceNameMap = {
            "安徽":"anhui",
    	    "北京":"beijing",
    	    "福建":"fujian",
    	    "广东":"guangdong",
    	    "贵州":"guizhou",
    	    "河北":"hebei",
    	    "河南":"henan",
    	    "湖南":"hunan",
    	    "江西":"jiangxi",
    	    "辽宁":"liaoning",
    	    "宁夏":"ningxia",
    	    "山东":"shandong",
    	    "陕西":"shanxi1",
    	    "四川":"sichuan",
    	    "天津":"tianjin",
    	    "新疆":"xinjiang",
    	    "云南":"yunnan",
    	    "澳门":"aomen",
    	    "重庆":"chongqing",
    	    "甘肃":"gansu",
    	    "广西":"guangxi",
    	    "海南":"hainan",
    	    "黑龙江":"heilongjiang",
    	    "湖北":"hubei",
    	    "江苏":"jiangsu",
    	    "吉林":"jilin",
    	    "内蒙古":"neimenggu",
    	    "青海":"qinghai",
    	    "上海":"shanghai",
    	    "山西":"shanxi",
    	    "台湾":"taiwan",
    	    "香港":"xianggang",
    	    "西藏":"xizang",
    	    "浙江":"zhejiang"
        };
        this.icon = 'path://M916.48 755.2c0-7.68-6.4-14.08-15.36-14.08-5.12 0-10.24 2.56-12.8 6.4 0 0 0 0 0 0-2.56 2.56-11.52 11.52-23.04 23.04-8.96 8.96-19.2 19.2-30.72 30.72l-116.48-116.48 0 0c-5.12-5.12-11.52-8.96-19.2-8.96-14.08 0-25.6 11.52-25.6 25.6 0 7.68 3.84 14.08 8.96 19.2l0 0 116.48 116.48c-10.24 10.24-19.2 19.2-28.16 28.16-11.52 11.52-20.48 20.48-23.04 23.04 0 0 0 0 0 0-3.84 2.56-6.4 7.68-6.4 12.8 0 7.68 6.4 14.08 14.08 15.36 0 0 0 0 0 0l0 0 15.36 0 103.68 0 14.08 0 12.8 0c3.84 0 7.68-1.28 10.24-3.84 2.56-2.56 3.84-6.4 3.84-10.24l0-12.8 0-14.08 0-103.68L916.48 755.2 916.48 755.2C916.48 755.2 916.48 755.2 916.48 755.2zM119.04 282.88c5.12 0 10.24-2.56 12.8-6.4 0 0 0 0 0 0 2.56-2.56 11.52-11.52 23.04-23.04 7.68-7.68 17.92-17.92 28.16-28.16L318.72 358.4l0 0c5.12 3.84 10.24 6.4 17.92 6.4 14.08 0 25.6-11.52 25.6-25.6 0-6.4-2.56-12.8-6.4-17.92l0 0L220.16 188.16c11.52-11.52 21.76-21.76 30.72-30.72 11.52-11.52 20.48-20.48 23.04-23.04 0 0 0 0 0 0 3.84-2.56 6.4-7.68 6.4-12.8 0-7.68-6.4-14.08-14.08-15.36 0 0 0 0 0 0l0 0-15.36 0-103.68 0-14.08 0-12.8 0C115.2 106.24 111.36 108.8 108.8 111.36 106.24 113.92 104.96 117.76 104.96 121.6l0 12.8 0 14.08 0 103.68 0 15.36 0 0c0 0 0 0 0 0C104.96 276.48 111.36 282.88 119.04 282.88zM700.16 348.16c6.4 0 12.8-2.56 17.92-6.4l0 0 117.76-117.76c10.24 10.24 20.48 20.48 28.16 28.16 11.52 11.52 20.48 20.48 23.04 23.04 0 0 0 0 0 0 2.56 3.84 7.68 6.4 12.8 6.4 7.68 0 14.08-6.4 15.36-14.08 0 0 0 0 0 0l0 0 0-15.36 0-103.68 0-14.08 0-12.8c0-3.84-1.28-7.68-3.84-10.24-2.56-2.56-6.4-3.84-10.24-3.84l-12.8 0-14.08 0-103.68 0L755.2 107.52l0 0c0 0 0 0 0 0-7.68 0-14.08 6.4-14.08 15.36 0 5.12 2.56 10.24 6.4 12.8 0 0 0 0 0 0 2.56 2.56 11.52 11.52 23.04 23.04 8.96 8.96 19.2 19.2 29.44 29.44l-117.76 117.76c0 0 0 0 0 0l0 0 0 0c-3.84 5.12-6.4 10.24-6.4 17.92C674.56 336.64 686.08 348.16 700.16 348.16zM336.64 660.48c-7.68 0-14.08 2.56-17.92 7.68l0 0L185.6 801.28c-10.24-10.24-20.48-20.48-29.44-29.44-11.52-11.52-20.48-20.48-23.04-23.04 0 0 0 0 0 0-2.56-3.84-7.68-6.4-12.8-6.4-7.68 0-14.08 6.4-15.36 14.08 0 0 0 0 0 0l0 0 0 15.36 0 103.68 0 14.08 0 12.8c0 3.84 1.28 7.68 3.84 10.24 2.56 2.56 6.4 3.84 10.24 3.84l12.8 0 14.08 0 103.68 0 15.36 0 0 0c0 0 0 0 0 0 7.68 0 14.08-6.4 14.08-15.36 0-5.12-2.56-10.24-6.4-12.8 0 0 0 0 0 0-2.56-2.56-11.52-11.52-23.04-23.04-8.96-8.96-19.2-19.2-29.44-29.44l133.12-133.12 0 0c5.12-5.12 7.68-11.52 7.68-17.92C362.24 672 350.72 660.48 336.64 660.48z';
        //省份地图气泡选中状态
        this.selected = {};
        this.dataUnit = '';
        this.categoryName = '';
        this.userData = {};
        //ajax请求地图json目录
        this.resourcesURL = '/resources/lib/echarts/map/json';
        this.provinceName = this.provinceNameMap[this.province];
        this.tooltipCountry = this.tooltipCountry.bind(this);
    }
    componentDidMount(){
        let countryDom = this.refs.countryChart;
        let provinceDom = this.refs.provinceChart;
        this.countryChart = echarts.init(countryDom);
        this.provinceChart = echarts.init(provinceDom);
        this.setTimeLineEvent();
        this.provinceChartClickEvent();
        this.setCountryChartEvent();
    }
    //点击省份地图上的气泡（气泡选择事件）
    provinceChartClickEvent(){
        let provinceName = this.provinceName;
        this.provinceChart.on('click',(params)=>{
           if(!this.selected[provinceName]){
               this.selected[provinceName] = [];
           }
           if (params.seriesIndex === 1) {
                let status = !this.selected[provinceName][params.dataIndex];
                if(this.props.onClickProvinceScatter){
                    this.props.onClickProvinceScatter(status,params.name);
                }
                this.selected = {};
                this.selected[provinceName] = [];
                this.selected[provinceName][params.dataIndex] = status;
                this.provinceChart.setOption({
                    series:[{
                        data:this.provinceData
                    },{
                        symbolSize:(value,paramsSymbol)=>{
                            return this.selected[provinceName][paramsSymbol.dataIndex]?15:10
                        },
                        itemStyle:{
                            normal:{
                                color:(paramsSymbol)=>{
                                    return this.selected[provinceName][paramsSymbol.dataIndex]?mapScatterSelectedColor:mapScatterColor
                                }
                            }
                        }
                    }]
                });
            }
        });
    }
    //时间轴组件切换事件
    setTimeLineEvent(){
        let provinceThreshold = 0;

        //切换维度，中国地图由timeline自动切换，timelinechanged事件设置省地图的联动
        this.countryChart.on('timelinechanged',(params)=>{
            let index = params.currentIndex;
            let option = {
                tooltip:{
                    formatter:(paramsTip)=>{
                        return this.tooltipProvince(paramsTip,index);
                    }
                }
            };
            if(this.userData.provinceThreshold&&this.userData.provinceThreshold[index]!=undefined){
                provinceThreshold = this.userData.provinceThreshold[index];
            }
            this.categoryName = this.userData.category[index];
            this.dataUnit = this.userData.dataUnit[index];
            this.countryChart.setOption({
                baseOption:{
                    tooltip:{
                        formatter:this.tooltipCountry
                    }
                }
            });
            option.visualMap=[
                {
                    type:'continuous',
                    seriesIndex:0,
                    //映射到当前维度数据
                    dimension:params.currentIndex,
                    //当前维度对应范围
                    min:this.userData.range[index][0],
                    max:this.userData.range[index][1],
                    text:['高','低'],
                    calculable:true,
                    color:mapVisualMapColor
                },
                {
                    type: 'piecewise',
                    show: false,
                    pieces: [
                        {gt:provinceThreshold, label: '上升', color: mapScatterUpColor},
                        {value:provinceThreshold, label: '持平', color: mapScatterColor},
                        {lt:provinceThreshold, label: '下降', color: mapScatterDownColor}
                    ],
                    seriesIndex: 1,
                    //切换映射的维度
                    dimension: 2+index
                }
            ];
            this.provinceChart.setOption(option);
        });
    }
    resize(){
        this.countryChart.resize();
        this.provinceChart.resize();
    }

    refreshGraph(arg){
        const params = {...arg};
        this.prepareOption(params);
        this.provinceChart.clear();
        this.countryChart.clear();
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+`${this.resourcesURL}/china.json`,
        	timeout: 10000,
        	success :(areaJson)=>{
          		echarts.registerMap('china', areaJson);
                this.countryChart.setOption(this.countryOption);
        	}
        });
        let provinceName = this.provinceNameMap[this.province];
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+`${this.resourcesURL}/province/${provinceName}.json`,
        	timeout: 10000,
        	success :(areaJson)=>{
              	echarts.registerMap(this.province, areaJson);
                this.provinceChart.setOption(this.provinceOption);
        	}
        });
        this.setState({loading:false});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.defaultProvince){
            this.province = nextProps.defaultProvince;
        }
    }
    onClickScale(type,params){
        //是否开启缩放及平移
        const roam = !params.option.series[0].roam;
        const borderColor = roam?scaleBtnOnColor:scaleBtnOffColor;
        let series = [{roam},{}];
        if(type==='province'&&params.option.series.length===2){
            series = [{roam,data:this.userData.provinceData[this.province].mapData}]
        }
        else if (params.option.series.length===1) {
            series = [{roam}];
        }
        this[type+'Chart'].setOption({
            series,
            geo:{roam},
            toolbox:{
                feature:{
                    myScale:{
                        iconStyle:{
                            normal:{
                                borderColor
                            }
                        }
                    }
                }
            }
        });
    }
    //省级地图两个系列的tooltip（地图、散点），参数：点，维度index
    tooltipProvince(params,index) {
        if(params.seriesIndex===0){
            return params.name+"<br/>"+this.categoryName+":"+(params.data.value?params.data.value[index]:'0')+this.dataUnit;
        }
        else{
            let message=params.data.message?"<br/>"+params.data.message:'';
            const rate = params.data.rate?`<br/>变化率：${params.data.rate[index]}%`:'';
            message+="<br/>"+this.categoryName+"："+params.data.value[index+2]+this.dataUnit;
            return params.name+message;
        }
    }
    //中国地图的提示框回调
    tooltipCountry(params) {
        if(!params.data){
            return;
        }
        if (params.data.value) {
            const rate = (params.data.value[1]!==undefined)?`<br/>变化量：${params.data.value[1]}%`:'';
            return `${params.data.name}<br/>${this.categoryName}：${params.data.value[0]}${this.dataUnit}${rate}`;
        }
        else {
            return ''
        }
    }

    prepareOption(params) {
        //用于timeline的options
        let options =[];
        for(let i = 0;i<params.category.length;i++){ //每一项对应一个维度
            options.push({
                //设置visualMap的最大最小值
                visualMap:[
                    {
                        min:params.range[i][0],
                        max:params.range[i][1]
                    }
                ],
                //每个维度中加入两个系列的数据（地图及点）
                series: (params.countryData&&params.countryData[0].data[0].length===2)?[
                    {
                        data: params.countryData.map(function (item) {
                            return {name: item.name, value: item.data[i]};
                        })
                    },
                    {
                        data: params.countryData.map((item)=>{
                            return this.coord[item.name].concat([item.data[i][0]]);
                        })
                    }
                ]:[{
                    data: params.countryData.map(function (item) {
                        return {name: item.name, value: item.data[i]};
                    })
                }]
            });
        }

        this.categoryName = params.category[0];
        this.dataUnit = params.dataUnit[0];
        this.userData = params;

        //打开后中国地图的默认状态
        let visualMap = [
            {
                //连续型
                type: 'continuous',
                show: false,
                //对应地图序列
                seriesIndex: 0,
                //两端的文本
                text: ['高', '低'],
                calculable: true,
                color: mapVisualMapColor,
                //地图数据中的第0项，每个维度对应具体值（dimension=1为变化值）
                dimension: 0
            }
        ];
        let series = [
            {
                type: 'map',
                roam: false,
                // map: 'china',
                geoIndex:0,
                zoom:0.9,
                itemStyle: {
                    normal: {
                        borderWidth:1,
                        borderColor:lineColor,
                        "areaColor": "#ccc"
                    }
                },
                //显示label，中国地图中为省名，省级地图中为次一级地名
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: '0'
                        }
                    }
                }
            }
        ];
        if(params.countryData&&params.countryData[0].data[0].length===2){
            visualMap.push({
                //分段型
                type: 'piecewise',
                pieces: [
                    {gt: 0, label: '上升', color: mapScatterUpColor},
                    {value: 0, label: '持平', color: mapScatterColor},
                    {lt: 0, label: '下降', color: mapScatterDownColor}
                ],
                //用于散点系列
                seriesIndex: 1,
                //散点系列前两个dimension为经纬度
                dimension: 2
            });
            series.push({
                //散点
                type: 'scatter',
                //不触发动作，显示信息直接与地图结合，散点仅作上升或下降的映射
                silent: true,
                coordinateSystem: 'geo'
            });
        }
        this.countryOption={
            baseOption: {
                timeline:{
                    show:params.category.length===1?false:true,
                    //位置
                    top:'top',
                    //没有找到直接确定间隔的方式，因此采用了设置左右间距的方式
                    left:'10%',
                    right:(100-22*params.category.length)+'%',
                    lineStyle:{
                        show:false
                    },
                     //选中样式
                    checkpointStyle:{
                        color:'#74c4f5',
                        borderWidth:1,
                        borderColor:'#118fde',
                        animation:false
                    },
                    controlStyle:{
                        show:false
                    },
                    axisType:'category',
                    data:params.category,
                    //timeline组件的label显示间隔为0，即全部显示
                    label:{
                        normal:{
                            interval:0
                        }
                    }
                },
                toolbox:{
                    right:25,
                    itemSize:12,
                    iconStyle:{
                        normal:{
                            borderColor:scaleBtnOffColor
                        }
                    },
                    feature:{
                        myScale:{
                            show: true,
                            title: '地图缩放',
                            icon:this.icon,
                            onclick: this.onClickScale.bind(this,'country')
                        }
                    }
                },
                visualMap,
                tooltip: {
                    formatter: this.tooltipCountry.bind(this)
                },
                //目前版本echarts的地图组件geo与类型为map的series的地图不能共用，需要分别设置
                geo: {
                    //roam设置为true会有移动过程中geo地图与series地图有时不能重合的问题，因此仅设置为支持放大缩小功能
                    roam:false,
                    map: 'china',
                    zoom:0.9
                },
                series
            },
            options
        };
        //省级地图初始状态，浙江省，第一个维度
        const provinceThreshold = params.provinceThreshold?(params.provinceThreshold[0]||0):0;
        this.provinceData = params.provinceData[this.province].mapData.map(function (item) {
            item.label = {
                normal:{
                    show:true
                }
            };
            return item;
        });
        this.provinceOption = {
            title:{
                text:"浙江",
                left:'15%'
            },
            geo:{
                map:'浙江',
                roam:false,
                //为使放大缩小功能及省级地图在同一容器内切换的功能正常实现，设置当前视角中心（经纬度）
                center:null,
                //关闭动画效果
                animation:false,
                //初始化放大倍数
                zoom:1.1
            },
            series:[
                {
                    type:'map',
                    geoIndex:0,
                    roam:false,
                    animation:false,
                    zoom:1.1,
                    itemStyle: {
                        normal: {
                            borderWidth:1,
                            borderColor:lineColor,
                            "areaColor": "#ccc"
                        },
                        emphasis: {                 // 也是选中样式

                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 14,
                                    color: '#ed514c'

                                }
                            }
                        }
                    },
                    center:null,
                    data:this.provinceData
                },
                {
                    type:'scatter',
                    coordinateSystem:'geo',
                    animation:false,
                    data:params.provinceData[this.province].scatterData,
                    itemStyle:{
                        normal:{
                            color:mapScatterColor
                        }
                    }
                }
            ],
            tooltip:{
                formatter:(params)=>{
                    return this.tooltipProvince(params,0);
                }
            },
            toolbox:{
                right:15,
                itemSize:12,
                iconStyle:{
                    normal:{
                        borderColor:scaleBtnOffColor
                    }
                },
                feature:{
                    myScale:{
                        show: true,
                        title: '地图缩放',
                        icon:this.icon,
                        onclick: this.onClickScale.bind(this,'province')
                    }
                }
            },
            visualMap:[
                {
                    type:'continuous',
                    seriesIndex:0,
                    show: false,
                    dimension:0,
                    min:params.range[0][0],
                    max:params.range[0][1],
                    text:['高','低'],
                    calculable:true,
                    color:mapVisualMapColor
                },
                {
                    type: 'piecewise',
                    show: false,
                    pieces: [
                        {gt:provinceThreshold, label: '上升', color: '#ed514c'},
                        {value:provinceThreshold, label: '持平', color: '#ffa845'},
                        {lt:provinceThreshold, label: '下降', color: '#81f8b1'}
                    ],
                    seriesIndex: 1,
                    dimension: 2
                }
            ]
        };
    }
    setCountryChartEvent(){
        this.countryChart.on('click',(params)=>{
            if(params.componentType==='series'&&params.seriesIndex===0&&(params.value||(params.value===0))){
                this.province = params.name;
                this.setProvince(params.name);
            }
        });
    }
    //切换省份
    setProvince(province){
        let data = {};
        if(this.props.getProvinceData){
            data = this.props.getProvinceData(province);
        }
        else {
            data = this.userData.provinceData[province];
        }
        let provinceName = this.provinceNameMap[province];
        this.provinceName = provinceName;
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+`${this.resourcesURL}/province/${provinceName}.json`,
        	data:{},
        	timeout: 10000,
        	success :(areaJson)=>{
              	echarts.registerMap(provinceName, areaJson);
                this.provinceData = data.mapData.map((item)=>{
                      item.label = {
                          normal:{
                              show:true
                          }
                      };
                      return item;
                })
                this.provinceChart.setOption({
                    geo:{
                        map:provinceName,
                        //重新设置中心视角及放大倍数
                        center:null,
                        zoom:1.1
                    },
                    title:{
                        text:province
                    },
                    series:[
                        {
                            zoom:1.1,
                            center:null,
                            data:this.provinceData
                        },
                        {
                            data:data.scatterData,
                            symbolSize:(value,params)=>{
                                if(!this.selected[provinceName]){
                                    this.selected[provinceName]=[];
                                }
                                return this.selected[provinceName][params.dataIndex]?15:10
                            },
                            itemStyle:{
                                normal:{
                                    color:(params)=>{
                                        if(!this.selected[provinceName]){
                                            this.selected[provinceName]=[];
                                        }
                                        return this.selected[provinceName][params.dataIndex]?'#ff0000':'#ffa845'
                                    }
                                }
                            }
                        }
                    ]
                });
        	}
        });
    }
    render(){
        return (<JfCard title={this.state.title||''} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="countryChart"  className="kpi_business_map_left" style={{width:'50%',height:'100%',float:'left'}}></div>
                <div ref="provinceChart"  className="kpi_business_map_right" style={{width:'50%',height:'100%',float:'left'}}></div>
            </div>
        </JfCard>);
    }
}

export default MultiDimMap;
