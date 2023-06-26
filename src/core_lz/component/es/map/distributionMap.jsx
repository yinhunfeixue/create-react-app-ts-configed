import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
import {JfCard} from 'app_common'
import CONSTANTS from 'app_constants';
/*
countryData:[{name,value}]
provinceData:[{name:'',value,scatterData:[{name:'',value:[]}]}]
*/
export default class DistributionMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province:this.props.defaultProvince||'zhejiang',
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
        this.areaColor = '#acf3ff';
    }
    componentDidMount(){
        let countryDom = this.refs.countryChart;
        let provinceDom = this.refs.provinceChart;
        this.countryChart = echarts.init(countryDom);
        this.provinceChart = echarts.init(provinceDom);
    }
    resize(){
        this.countryChart.resize();
        this.provinceChart.resize();
    }

    refreshGraph(arg){
        const params = {...arg};
        let _this = this;
        this.prepareOption(params);
        this.provinceChart.clear();
        this.countryChart.clear();
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/china.json',
        	timeout: 10000,
        	success : function(areaJson){
          		echarts.registerMap('china', areaJson);
                _this.countryChart.setOption(_this.countryOption);
                _this.setCountryChartEvent();
        	}
        });
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/province/'+this.state.province+'.json',
        	timeout: 10000,
        	success : function(areaJson){
              	echarts.registerMap(_this.state.province, areaJson);
                _this.provinceChart.setOption(_this.provinceOption);
                _this.setState({loading:false})
        	}
        });
    }
    prepareOption(params) {
        let _this = this;
        this.countryOption = {
            series:[{
                type:'map',
                map:'china',
                zoom:1.1,
                roam:params.roamCountry,
                //显示label，中国地图中为省名，省级地图中为次一级地名
                label: {
                    normal: {
                        show: false
                    }
                },
                data:params.countryData.map(function(item) {
                    return {
                        name:item.name,
                        value:item.value,
                        itemStyle:{
                            normal:{
                                areaColor:_this.areaColor
                            }
                        }
                    }
                })
            },{
                type:'scatter',
                //不触发动作，显示信息直接与地图结合，散点仅作上升或下降的映射
                silent: true,
                coordinateSystem:'geo',
                data:params.countryData.map(function(item) {
                    return _this.coord[item.name];
                }),
                symbolSize:8,
                itemStyle:{
                    normal:{
                        color:'#fa2b15'
                    }
                }
            }],
            geo:{
                map: 'china',
                roam:params.roamCountry,
                zoom:1.1
            }
        };
        let provinceScatterData = [];
        for(let i=0;i<params.provinceData.length;i++){
            let scatterData = params.provinceData[i].scatterData;
            let city = params.provinceData[i].name;
            //散点上附加城市名称信息
            for(let j=0;j<scatterData.length;j++){
                provinceScatterData.push({
                    name:scatterData[j].name,
                    value:scatterData[j].value.concat([city])
                });
            }
        }
        this.provinceOption = {
            series:[{
                type:'map',
                zoom:0.9,
                roam:params.roamProvince,
                map:this.state.province,
                geoIndex:0,
                data:params.provinceData
                .map(function(item) {
                    return {
                        name:item.name,
                        value:item.value||0,
                        // itemStyle:{
                        //     normal:{
                        //         areaColor:_this.areaColor
                        //     }
                        // },
                        // label:{
                        //     normal:{
                        //         show:true
                        //     }
                        // }
                    };
                })
            },{
                type:'scatter',
                data:provinceScatterData,
                coordinateSystem:'geo',
                symbolSize:8,
                itemStyle:{
                    normal:{
                        color:'#eb331f'
                    }
                }
            }],
            tooltip:{
                formatter:function(tipParams) {
                    if(tipParams.seriesIndex===0){
                        return ;
                    }
                    let dataIndex = tipParams.dataIndex;
                    let value = tipParams.value[2];
                    return value+'<br />'+tipParams.name;
                }
            },
            geo:{
                map:this.state.province,
                roam:params.roamProvince,
                zoom:0.9
            },
            visualMap:{
                show: false,
                //对应地图序列
                seriesIndex: 0,
                inRange: {
                    color: [_this.areaColor, _this.areaColor]
                },
            },
            animation:false
        };
    }
    setCountryChartEvent(){
        let _this = this;
        this.countryChart.on('click',function(params) {
            if(params.componentType==='series'&&params.seriesIndex===0&&(params.data.itemStyle)){
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
        let provinceScatterData = [];
        for(let i=0;i<data.length;i++){
            let scatterData = data[i].scatterData;
            let city = data[i].name;
            //散点上附加城市名称信息
            for(let j=0;j<scatterData.length;j++){
                provinceScatterData.push({
                    name:scatterData[j].name,
                    value:scatterData[j].value.concat([city])
                });
            }
        }
        $.ajax({
        	url:CONSTANTS.APP_BASE_URL+'/resources/lib/echarts/map/json/province/'+provinceName+'.json',
        	data:{},
        	timeout: 10000,
        	success : function(areaJson){
              	echarts.registerMap(provinceName, areaJson);
                _this.provinceChart.setOption({
                    series:[{
                        zoom:0.9,
                        map:provinceName,
                        center:null,
                        data:data.map(function(item) {
                            return {
                                name:item.name,
                                value:item.value||0,
                                itemStyle:{
                                    normal:{
                                        areaColor:_this.areaColor
                                    }
                                },
                                label:{
                                    normal:{
                                        show:true
                                    }
                                }
                            };
                        })
                    },{
                        data:provinceScatterData
                    }],
                    geo:{
                        zoom:0.9,
                        map:provinceName,
                        center:null
                    }
                });
        	}
        });
    }
    render(){
        return (<JfCard title={this.state.title||''} loading={this.state.loading}>
            <div className="markets_exponent_chart">
                <div ref="countryChart" style={{width:'55%',height:'95%',float:'left'}}></div>
            <div ref="provinceChart" style={{width:'45%',height:'100%',float:'left'}} className="map_sj_right"></div>
            </div>
        </JfCard>);
    }
}
