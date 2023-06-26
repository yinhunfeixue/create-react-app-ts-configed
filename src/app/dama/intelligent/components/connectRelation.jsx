import {NotificationWrap} from 'app_common'
import React, {Component} from 'react';
import GeneralTable from "app_page/dama/component/generalTable";
import {delTableRelation, getTableRelation} from "app_api/modelApi";
import {Button,  Modal} from "antd";
import AddRelationForm from "./addRelationForm";

class ConnectRelation extends Component {
    constructor(props) {
        super(props);
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.getTableRow(selectedRows)
            },
            type: 'checkbox'
        }
        this.state = {
            tableData:[],
            tableLoading: false,
            pagination : {
                total:'',
                page: 1,
                page_size: 10,
                paginationDisplay:"none"
            },
            visible:false,
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60
            }, {
                title: `字段英文名`,
                dataIndex: `fromFieldEnglishName`,
                key: `fromFieldEnglishName`,
                render:(_,record)=> <a
                    href=""
                    onClick={(e)=>{e.preventDefault();
                        this.props.addTab("字段详情",{id:record[`fromFieldId`]})}}>
                    {_}
                </a>
            }, {
                title: `字段中文名`,
                dataIndex: `fromFieldName`,
                key: `fromFieldName`,
            },{
                title: `关联表`,
                dataIndex: `toTableEnglishName`,
                key: `toTableEnglishName`,
                render:(_,record)=><span>
                    {
                        this.props.id==record.toTableId?record.fromTableEnglishName:_
                    }
                </span>
            }
            ,{
                title: `关联表字段英文名`,
                dataIndex: `toFieldEnglishName`,
                key: `toFieldEnglishName`,
                render:(_,record)=> <a
                    href=""
                    onClick={
                        (e)=>{e.preventDefault();
                            this.props.addTab("字段详情",{id:record[`toFieldId`]})}}>
                    {_}
                </a>
            },{
                title: `关联表字段中文名`,
                dataIndex: `toFieldName`,
                key: `toFieldName`,
            },{
                title:"方向",
                dataIndex:"direction",
                key:"direction"
            }
        ];
    }

    componentDidMount() {
        // console.log(this.props)
        this.getTableData({})
    }

    getTableData = async (params)=>{
        let param = { ...this.state.pagination, ...params ,tableId:this.props.id,businessId:this.props.businessId}
        this.setState({
            pagination :param,
            tableLoading:true
        })
        let res = await getTableRelation(param)
        this.setState({
            tableLoading:false,
            tableData:res.data,
            pagination:{
                ...this.state.pagination,
                total: res.total,
                paginationDisplay:"block",
            }
        })
        this.selectedRows=[]
    }
    getTableRow = (arr)=>{
        this.selectedRows = arr
    }
    delRelationConfirm=()=>{
        if (this.selectedRows.length===0){
            NotificationWrap.warning("请选择要删除的对象")
            return
        }
        Modal.confirm({
            title: '确认删除？',
            content: '点击确认删除！',
            okText:'确认',
            cancelText:'取消',
            onOk:() =>{
                this.delRelation()
            },
            onCancel() {},
        })
    }
    delRelation = async ()=>{
        let res = await delTableRelation(this.selectedRows)
        if (res.code!=200){
            NotificationWrap.error(res.msg)
            return
        }
        this.selectedRows = []
        this.getTableData({page:1})
        this.props.onCancel&&this.props.onCancel()
    }
    onCancel=()=>{
        this.setState({
            visible:false
        });
        this.getTableData()
        this.props.onCancel&&this.props.onCancel()
    }


    render() {
        const {getTableData,columns,rowSelection,onCancel} = this
        const {tableData,tableLoading,pagination,visible} = this.state
        return (
            <div>
                <div style={{marginBottom:10}}>
                    <Button onClick={()=>this.setState({visible: true})} className="addBtn" style={{marginRight:10}} >添加</Button>
                    <Button onClick={this.delRelationConfirm} className="editBtn">删除</Button>
                </div>
                <GeneralTable
                    tableProps={{
                        tableData,
                        columns,
                        rowSelection,
                        rowKey:"key",
                        tableLoading
                    }}
                    paginationProps={{
                        pagination,
                        getTableData,
                        showSizeChanger:true,
                        showQuickJumper:true
                    }}
                />
                <Modal
                    title={"添加关系"}
                    visible={visible}
                    footer={null}
                    onCancel={onCancel}
                    destroyOnClose
                    width={800}
                >
                    <AddRelationForm {...this.props} tableId={this.props.id} onCancel={this.onCancel}/>
                </Modal>
            </div>
        )
    }
}


export default ConnectRelation;
