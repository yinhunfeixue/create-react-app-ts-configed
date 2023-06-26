import React, {Component} from 'react';
import {JfCard} from 'app_common';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Modal, Table } from 'antd';
import _ from 'underscore';

/*
type 'rank' 表示排名类型的指标看板
modalData 对话框内的说明表格内容，默认格式[{name:'',description:''}]，没有此说明则不设
columns 对话框表格的列，默认为 name 及 description 两列，且不显示表头，可重新设置
topIcon 指标看板上方的图标，设为 false 隐藏，有默认值
mainIndicator 位于指标看板上半部分的指标，{name,value,dataUnit,yoy,mom}(名称，值，单位，同比，环比)
otherIndicators 位于指标看板下半部分的多个指标 [{name,value,dataUnit}]
title,loading,hasTip(切片容器标配，根据需求配置)
*/
export default class Indicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false
        };
        this.modalData = _.map(this.props.modalData,(item,index)=>(
            {
                key:index,
                ...item
            }
        ));
        this.columns = this.props.columns||[
            {
                dataIndex: 'name',
                key: 'name',
                colSpan:0
            },
            {
                dataIndex: 'description',
                key: 'description',
                colSpan:0
            }
        ];
        if(this.props.topIcon===false){
            this.topIcon = null;
        }
        else {
            this.topIcon = this.props.topIcon||<i className="over_icon "></i>;
        }
    }
    showModal(){
        let modalVisible = !this.state.modalVisible;
        this.setState({modalVisible});
    }
    render(){
        let {mainIndicator,otherIndicators} = this.props;
        let i_y = '', t_y = '', i_m = '', t_m = '';
        if(mainIndicator.yoy>0){
            i_y = 'caret-up';
            t_y = 'text-red';
        }
        else if (mainIndicator.yoy<0) {
            i_y = 'caret-down';
            t_y = 'text-success';
        }
        if(mainIndicator.mom>0){
            i_m = 'caret-up';
            t_m = 'text-red';
        }
        else if (mainIndicator.mom<0) {
            i_m = 'caret-down';
            t_m = 'text-success';
        }
        let isRank = false;
        if(this.props.type==='rank'){
            isRank = true;
        }
        let lastRank = 0, nextRank = 0;
        if(isRank){
            lastRank = mainIndicator.rank-1;
            nextRank = mainIndicator.rank+1;
        }
        return (
            <JfCard title={this.props.title} bordered={false} loading={this.props.loading} hasTip={this.props.hasTip}>
                <div className="table_stock_based">
                    {this.topIcon}
                    {
                        isRank?
                        <div className="top_center"><h1>第{mainIndicator.rank}名</h1></div>:
                        [<div className="pull-left" key='1'>
                           <h1>{mainIndicator.value}<i>{mainIndicator.dataUnit||''}</i></h1>
                           {mainIndicator.name||''}
                           {this.modalData.length>0?<ExclamationCircleOutlined onClick={this.showModal.bind(this)} />:null}
                        </div>,
                        <div className="pull-right" key='2'>
                            同比
                            <span className={t_y}><LegacyIcon type={i_y}/>
                            {mainIndicator.yoy}%
                             </span>
                             <br />
                            环比
                            <span className={t_m}><LegacyIcon type={i_m}/>
                            {mainIndicator.mom}%
                            </span>
                        </div>,
                        <div className="clearfix" key='3'></div>]
                    }
               </div>
                <div className="overview_top_footer">
                    <div className="pull-left">
                    <div>{lastRank?('排名：'+lastRank):null}</div>
                    <div>{nextRank?('排名：'+nextRank):null}</div>
                    {_.map(otherIndicators,(indicator,index)=>(
                        <div key={index}>{(indicator.name||'')}</div>
                    ))}
                    </div>
                    <div className="pull-right">
                    {isRank?<div>{mainIndicator.lastCompany||''}<br />{mainIndicator.nextCompany||''}</div>:null}
                    {_.map(otherIndicators,(indicator,index)=>(
                        <div key={index}>{(indicator.value)+(indicator.dataUnit||'')}</div>
                    ))}
                    </div>
                    <div className="clearfix"></div>
                </div>
                {(!isRank)&&<Modal footer={null} title='说明' visible={this.state.modalVisible}
                onCancel={this.showModal.bind(this)}
                >
                    <Table pagination={false}
                    dataSource={this.modalData}
                    columns={this.columns}
                    />
                </Modal>}
            </JfCard>
        );
    }
}
