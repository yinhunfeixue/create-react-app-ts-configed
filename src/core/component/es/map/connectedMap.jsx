import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
import {JfCard} from 'app_common'
import CONSTANTS from 'app_constants';

/*
countryData:{name:[],data:[{name:'',value:[1,2]}]} 全国地图数据（包括地图及地图上的点的数据）
provinceData:[{name,value}]
provinceScatterData:[{name:'',value:[x,y,v]}]
provinceScatterName:[''] 省地图散点数据除经纬度外名称
provinceScatterUnit:['']
countryMapUnit:'',
provinceMapUnit:''
mapVisualColor:[] 地图颜色范围
*/
class ConnectedMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province:this.props.defaultProvince||'浙江',
            title:this.props.title,
            loading:true
        };
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
    }
    componentDidMount(){
        let countryDom = this.refs.countryChart;
        let provinceDom = this.refs.provinceChart;
        // this.prepareOption();
        this.countryChart = echarts.init(countryDom);
        this.provinceChart = echarts.init(provinceDom);
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
        let _this = this;
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/china.json',
        	timeout: 10000,
        	success : function(areaJson){
          		echarts.registerMap('china', areaJson);
                _this.countryChart.setOption(_this.countryOption);
                _this.setCountryChartEvent();
        	}
        });
        let provinceName = this.provinceNameMap[this.state.province];
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/province/'+provinceName+'.json',
        	timeout: 10000,
        	success : function(areaJson){
              	echarts.registerMap(_this.state.province, areaJson);
                _this.provinceChart.setOption(_this.provinceOption);
        	}
        });
        this.setState({loading:false});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.defaultProvince){
            this.setState({province:nextProps.defaultProvince})
        }
    }
    prepareOption(params) {
        let _this = this;
        let scatterColor = params.scatterColor||['#eb331f','#ffd071','#95f3bb'];
        let countryValues = params.countryData.data.map(function(item) {
            return item.value[0];
        });
        let provinceValues = params.provinceData.data.map(function(item) {
            return item.value;
        });
        let countryMax = Math.max.apply(Math,countryValues);
        let countryMin = Math.min.apply(Math,countryValues);
        if(countryMin===countryMax){
            countryMin-=1;
        }
        let provinceMax = Math.max.apply(Math,provinceValues);
        let provinceMin = Math.min.apply(Math,provinceValues);
        if(provinceMax===provinceMin){
            provinceMin-=1;
        }
        let countrySeriesName = params.countryData.name||[];
        let countryDataList = params.countryData.data;
        this.countryOption = {
            tooltip: {
                formatter:function(tipParams) {
                    if(tipParams.value||(tipParams.value===0)){
                        return tipParams.name+'<br />'
                        +countryDataList[0].value.map(function(item,index) {
                            return countrySeriesName[index]+' : '+countryDataList[tipParams.dataIndex].value[index]+(params.countryMapUnit||'');
                        }).join('<br />');
                    }
                }
            },
            series:[{
                name:countrySeriesName[0],
                type:'map',
                map:'china',
                zoom:1.1,
                //显示label，中国地图中为省名，省级地图中为次一级地名
                label: {
                    normal: {
                        show: false
                    }
                },
                roam:params.roamCountry,
                data:params.countryData.data.map(function(item) {
                    return {
                        name:item.name,
                        value:item.value[0]
                    }
                })
            },{
                name:countrySeriesName[1],
                type:'scatter',
                //不触发动作，显示信息直接与地图结合，散点仅作上升或下降的映射
                silent: true,
                itemStyle:{
                    normal:{
                        color:'#eb331f'
                    }
                },
                coordinateSystem:'geo',
                data:params.countryData.data.map(function(item) {
                    return _this.coord[item.name].concat(item.value[1]);
                })
            }],
            geo:{
                map: 'china',
                zoom:1.1,
                roam:params.roamCountry,
            },
            visualMap:[{
                type: 'continuous',
                show: false,

                //对应地图序列
                seriesIndex: 0,
                max:countryMax,
                min:countryMin,
                color: params.mapVisualColor||['#3d9bfd', 'lightskyblue']
            }
            // ,{
            //     //分段型
            //     hoverLink:false,
            //     selectedMode:false,
            //     type: 'piecewise',
            //     itemSymbol:'pin',
            //     controller:{
            //         outOfRange:{
            //             color:'#ccc'
            //         }
            //     },
            //     textStyle: {
            //         fontSize: 12,
            //         color: '#ffffff'
            //     },
            //     left: '3%',
            //
            //     pieces: [
            //         {gt: 0, label: '上升', color: scatterColor[0]},
            //         {value: 0, label: '持平', color: scatterColor[1]},
            //         {lt: 0, label: '下降', color: scatterColor[2]}
            //     ],
            //     //用于散点系列
            //     seriesIndex: 1,
            //     //散点系列前两个dimension为经纬度
            //     dimension: 2
            // }
        ]
        };
        let dataUnit = params.provinceScatterUnit||[];
        this.provinceOption = {
            series:[{
                type:'map',
                roam:params.roamProvince,
                map:this.state.province,
                name:params.provinceData.name,
                geoIndex:0,
                data:params.provinceData.data.map(function(item) {
                    return {
                        ...item,
                        label:{
                            normal:{
                                show:true
                            }
                        }
                    }
                }),
                label: {
                    normal: {
                        show: false
                    }
                },
            },{
                type:'scatter',
                data:params.provinceScatterData,
                coordinateSystem:'geo',
                itemStyle:{
                    normal:{
                        color:'#eb331f'
                    }
                }
            }],
            tooltip:{
                formatter:function(tipParams) {
                    if(tipParams.seriesIndex===0){
                        if(tipParams.value||tipParams.value===0){
                            return tipParams.name+'<br />'+tipParams.seriesName+' : '+tipParams.value+(params.provinceMapUnit||'');
                        }
                    }
                    else {
                        let dataIndex = tipParams.dataIndex;
                        let value = tipParams.value.slice(2);
                        return tipParams.name+'<br />'+value.map(function(item,index) {
                            return params.provinceScatterName[index]+" : "+item
                            +(dataUnit[index]||'');
                        }).join('<br />');

                    }
                },
                textStyle:{
                     // fontSize:'12px'
                }
            },
            geo:{
                map:this.state.province,
                roam:params.roamProvince,
            },
            animation:false,
            visualMap:[{
                type: 'continuous',
                show: false,
                //对应地图序列
                seriesIndex: 0,
                max:provinceMax,
                min:provinceMin,
                color: params.mapVisualColor||['#3d9bfd', 'lightskyblue']
            }
            // ,{
            //     //分段型
            //     type: 'piecewise',
            //     show:false,
            //     pieces: [
            //         {gt: 0, label: '上升', color: scatterColor[0]},
            //         {value: 0, label: '持平', color: scatterColor[1]},
            //         {lt: 0, label: '下降', color: scatterColor[2]}
            //     ],
            //     //用于散点系列
            //     seriesIndex: 1,
            //     //散点系列前两个dimension为经纬度
            //     dimension: 2
            // }
        ]
        };
    }
    setCountryChartEvent(){
        let _this = this;
        this.countryChart.on('click',function(params) {
            if(params.componentType==='series'&&params.seriesIndex===0&&(params.value||(params.value===0))){
                _this.setState({province:params.name});
                _this.setProvince(params.name);
            }
        });
    }
    //切换省份
    setProvince(province){
        let data = this.props.getProvinceData(province);
        let provinceName = this.provinceNameMap[province];
        let _this = this;
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/province/'+provinceName+'.json',
        	data:{},
        	timeout: 10000,
        	success : function(areaJson){
              	echarts.registerMap(provinceName, areaJson);
                _this.provinceChart.setOption({
                    series:[{
                        map:provinceName,
                        center:null,
                        data:data.provinceData.data.map(function(item) {
                            return {
                                ...item,
                                label:{
                                    normal:{
                                        show:true
                                    }
                                }
                            }
                        })
                    },{
                        data:data.provinceScatterData
                    }],
                    geo:{
                        map:provinceName,
                        center:null,
                        zoom:1
                    }
                });
        	}
        });
    }
    render(){
        return (<JfCard title={this.state.title||''} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div className="markets_exponent_chart">
                <div ref="countryChart"  className="kpi_business_map_left"></div>
            <div ref="provinceChart"  className="kpi_business_map_right"></div>
            </div>
        </JfCard>);
    }
}

export default ConnectedMap;
