import React, {Component} from 'react'
import {Modal, Table} from 'antd';
import {JfCard} from 'app_common';
// import {getBranchIn} from 'app_api';
const $ =  require('jquery');
const echarts = require('echarts');

//import './css/index.css';

/*
xAxisData:{name:'日期',data:[]},
    示例： data:["2015/1/5","2015/1/6","2015/1/7"

rawData:[{"name":'12312','data':'[]},{"name":'12312','data':'[]}],
    示例：
    [{
        name:'视频广告',
        data:[150, 232, 201, 154, 190, 330, 410]
    }]
*/

export default class TableModal extends Component{
    constructor(props){
        super(props);
        this.state={
            visible: false,
            secuName:'',
            columns : [
                {
                    title: '排名',
                    dataIndex: 'c_order',
                    className: 'table-ranking',
                    width:'12%'
                }, {
                    title: '券商名称',
                    dataIndex: 'secu_name',
                    width:'45%'
                }, {
                    title: '全国营业部总量',
                    dataIndex: 'c_branch',
                    render: (text,record) => (<a onClick={this.showModal.bind(this,record.secu_name)}>{text}</a>)
                }, {
                    title: '本月新增',
                    dataIndex: 'c_branch_add'
                }
            ],
            tableData : this.props.tableData,
            dataSourceModalData : [],
            columnsModal : [
                {
                    title: '营业部名称',
                    dataIndex: 'branch_name',
                    key: 'branch_name'
                }, {
                    title: '营业部地址',
                    dataIndex: 'branch_address',
                    key: 'branch_address'
                }
            ],
            rank:this.props.rank,
            modalLoading:false
        };
        this.endDate = this.props.modalDate;
        this.modalSourceData = {};
    }

    componentWillReceiveProps(nextProps){
        this.setState({tableData:nextProps.tableData,rank:nextProps.rank});
        this.endDate = nextProps.modalDate;
        this.modalSourceData = {};
        let containerEle = this.refs.container;
        let toSctoll = $(containerEle).find('.ant-table-body')[0];
        toSctoll.scrollTop = toSctoll.scrollHeight*((this.props.rank-5)/(this.props.tableData.length||1));
    }

    async showModal(secuName) {
        if(this.state.visible){
            this.setState({visible:false,dataSourceModalData:[]});
        }
        else {
            let dataSourceModalData = [];
            if(!this.modalSourceData[secuName]){
                this.setState({visible:true,modalLoading:true});
                // this.modalSourceData[secuName] = await getBranchIn({endDate:this.endDate,secuName});
                this.setState({dataSourceModalData:this.modalSourceData[secuName],modalLoading:false,secuName});
            }
            else {
                dataSourceModalData = this.modalSourceData[secuName];
                this.setState({visible:true,dataSourceModalData,secuName});
            }
        }
    }

    componentDidMount(){

        this.prepareOption();
        //console.log("11111111111111111111111111");
        let containerEle = this.refs.container;
        //console.log(containerEle);
        //console.log(this.option);
        let toSctoll = $(containerEle).find('.ant-table-body')[0];
        toSctoll.scrollTop = toSctoll.scrollHeight*((this.props.rank-5)/(this.props.tableData.length||1));
    }

    prepareOption() {
        let _this = this;
        if(this.props.extraOptions){
            $.extend(true,this.option,extraOptions);
        }else{


        }
    }

    render(){
        return (

            <JfCard  bordered={false} >
                <div ref='container'>
                    <Table columns={this.state.columns} rowClassName={(record)=>(record.key===this.state.rank?'kpi-active':'')}
                    dataSource={this.state.tableData} pagination={false} scroll={{y:385}}/>
                    <Modal title={this.state.secuName+'营业部分布明细'} visible={this.state.visible} width={900} onCancel={this.showModal.bind(this)} footer={null}>
                        <div className="modal_table">
                            <Table columns={this.state.columnsModal} loading={this.state.modalLoading}
                            dataSource={this.state.dataSourceModalData} rowKey='branch_name'/>
                        </div>
                    </Modal>
                </div>
            </JfCard>
        )
    }
}
