import React, {Component} from 'react'
import {Table} from 'antd';
import {JfCard} from 'app_common';
import _ from 'underscore';
//const jQuery = window.jQuery = $ = window.$ = require('jquery');
const echarts = require('echarts');
const $ =  require('jquery');
//import './css/index.css';

/*
title: '上证指数' //页面模块显示名称
tagfields: ['erlier'] //需要做颜色处理的字段
tableHeader:{name:'指标名称',detailed:'指标明细',erlier:'同比'}
    示例： data:["2015/1/5","2015/1/6","2015/1/7"

tableRowData:[{name:'全国股基总市值',detailed:'334,455,599',erlier:'1.52%'},{name:'指标名称',detailed:'指标明细',erlier:'同比'}]
    示例：data:
*/

const tableHeaderList = [
    {
        title: '指标名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '指标值(亿元)',
        dataIndex: 'detail',
        key: 'detailed',
    }, {
        title: '同比',
        dataIndex: 'mom',
        key: 'erlier',
    }
]

//股基交易信息概览

export default class IndexDotTable extends Component{
    constructor(props){
        super(props);

        // this.state={
        //     title:this.props.title,
        //     tagfields:this.props.tagfields ? this.props.tagfields : [],

        //     tableRowDataList : [
        //         {
        //             key: '1',
        //             name: '全国股基总市值',
        //             detailed: '334,455,599',
        //             erlier: <span className="anticon-upp">+1.52% </span>
        //           }, {
        //             key: '2',
        //             name: '公司股基总市值',
        //             detailed: '334,455,599',
        //             erlier: <span className="anticon-downn">-0.65% </span>
        //           }, {
        //             key: '3',
        //             name: <span>市场占有率</span>,
        //             detailed: '0.67%',
        //             erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '4',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-upp">+0.65% </span>
        //          }, {
        //            key: '05',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '06',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '07',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '08',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-upp">+0.65% </span>
        //          }, {
        //            key: '09',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '10',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-upp">+0.65% </span>
        //          }, {
        //            key: '11',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-downn">-0.65% </span>
        //          }, {
        //            key: '12',
        //            name: '公司股基总市值',
        //            detailed: '334,455,599',
        //            erlier: <span className="anticon-upp">+0.65% </span>
        //          }
        //      ]
        // };
    }


    preapeData(tableHeaderFields,rowData){
        let tableHeader = [];
        _(tableHeaderFields).map((v,k)=>{
            //divHtml += v.seriesName+'：'+v.value+"<br />";
            let th = {
                title: v,
                dataIndex: k,
                key: k,
            };
            tableHeader.push(th);
        });

        let tableRowDataList = [];
        _(rowData).map((v,k)=>{
            let row = {};
            //console.log('------------'+k);
            row['key'] = k + 1;
            _(tableHeaderFields).map((fv,f)=>{
                //divHtml += v.seriesName+'：'+v.value+"<br />";
                //console.log(fk);
                if( v[f] != undefined ){
                    row[f] = v[f];
                }
                //console.log(f,this.state.tagfields);
                if( $.inArray(f, this.state.tagfields) != -1 ){
                    row[f] = v[f];
                    //console.log();

                    if( parseInt(v[f]) > 0 ){
                        row[f] = (<span className="anticon-upp">+{v[f]}</span>);
                    }else if( parseInt(v[f]) < 0 ){
                        row[f] = (<span className="anticon-downn">{v[f]}</span>);
                    }else{
                        row[f] = v[f];
                    }
                }
            });

            tableRowDataList.push(row);
            //console.log(tableRowDataList);
        });

        return {'header':tableHeader,'data':tableRowDataList};
    }

    componentDidMount(){
        //let tableRowDataList = [];
        //let tableHeader = [];
        if( this.props.tableHeader && this.props.tableRowData){
            let dataList= this.preapeData(this.props.tableHeader,this.props.tableRowData);
            let headerData = dataList['header'];
            let rowData = dataList['data'];
            //tableHeader = dataList
            //console.log(headerData,rowData);
            this.setState({
                tableHeaderList:headerData,
                tableRowDataList:rowData,
                //title:'21312132122'
            });
            //console.log(this.state.tableHeaderList);
        }
    }

    refreshGraph(headerList,rowDataList){
        let dataList= this.preapeData(headerList,rowDataList);
        let headerData = dataList['header'];
        let rowData = dataList['data'];
        //tableHeader = dataList
        //console.log(headerData,rowData);
        this.setState({
            tableHeaderList:headerData,
            tableRowDataList:rowData,
            //title:'21312132122'
        });

    }

    render(){
        return (
            <JfCard title={this.props.title} bordered={false} loading={this.props.loading} hasTip={this.props.hasTip}>
                <div className="table_stock_based">
                    <Table columns={tableHeaderList} dataSource={this.props.dataSource} pagination={false}  />
                </div>
            </JfCard>
        )
    }
}
