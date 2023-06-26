import {NotificationWrap} from 'app_common'
import React, {Component} from 'react';
import {Button, Form, Select, Tooltip} from "antd";
import {addTableRelation, relationTableFiltrate} from "app_api/modelApi";
import TableFieldsSelect from "app_page/dama/component/tableFieldsSearchSelect";

const Option = Select.Option
const formItemLayout ={
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}
const buttonItemLayout =  {
    wrapperCol: { span: 14, offset: 6 },
}
let timeout
@Form.create()
class AddRelationForm extends Component {
    constructor(props) {
        super(props);
        this.state= {
            elseTables:[],
            tableId:"",
            direction:["from","to"],
            directionType:"0"
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.getElseTablesList({
            dataBaseId:this.props.dataBaseId||this.props.databaseId,
            tableId:this.props.tableId
        })
    }

    handleTableChange=(value)=>{
        console.log(value)
        this.props.form.setFieldsValue({
            elseFieldId:"",
            elseTableId:value
        })
        this.setState({
            tableId:value
        });
    }

    getElseTablesList = async (param)=>{
        let res = await relationTableFiltrate(param)
        if (res.code!=200){
            NotificationWrap.error(res.msg)
            return
        }
        this.setState({
            elseTables:res.data
        });
    }
    handleSearch=(value)=>{
        if (timeout){
            clearTimeout(timeout)
            timeout=null
            return
        }
        timeout=setTimeout(()=>this.getElseTablesList({
            dataBaseId:this.props.databaseId||this.props.dataBaseId,
            tableId:this.props.tableId,
            tableEnglishName:value
        }),150)
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        const {direction,directionType} = this.state
        this.props.form.validateFields((err,value)=>{
            if (!err) {
                if (directionType==='1'){
                    this.setState({
                        direction: direction.reverse()
                    },()=>{
                        this.addRelation(value)
                    })
                }else{
                    this.addRelation(value)
                }

            }
        })
    }
    addRelation = async (param)=>{
        const {direction} = this.state
        let params = {
            [`${direction[0]}FieldId`]:param.FieldId,
            [`${direction[0]}TableId`]:this.props.tableId,
            [`${direction[1]}FieldId`]:param.elseFieldId,
            [`${direction[1]}TableId`]:param.elseTableId,
            dataBaseId:this.props.dataBaseId
        }
        console.log(direction,params)
        let res = await addTableRelation({...params})
        if (res.code!=200){
            NotificationWrap.error(res.msg)
            return
        }
        this.props.onCancel()
    }

    handleDtTypeChange=(value)=>{
        this.setState({
            directionType: value,
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {elseTables,tableId,directionType} = this.state
        return (
            <Form>
                <Form.Item
                    label="字段"
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator(`FieldId`,{
                            rules: [{
                                required: true,
                                message: '请选择字段',
                            }],
                        })(
                            <TableFieldsSelect valueField={"id"} tableId={this.props.tableId} mode={null}/>
                        )
                    }
                </Form.Item>
                <Form.Item
                    label="关联的其他表"
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator(`elseTableId`,{
                            rules: [{
                                required: true,
                                message: '请选择关联的其他表',
                            }],
                        })(
                            <Select
                                onChange={this.handleTableChange}
                                // filterOption={false}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onSearch={this.handleSearch}
                                placeholder={"输入搜索，默认展示10条"}
                            >
                                {elseTables.map(item=><Option value={item.tableId}><Tooltip title={item.tableEnglishName + (item.tableName?`(${item.tableName})`:"")}>{item.tableEnglishName + (item.tableName?`(${item.tableName})`:"")}</Tooltip></Option>)}
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item
                    label="关联的其他表字段"
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator(`elseFieldId`,{
                            rules: [{
                                required: true,
                                message: '请选择关联的其他表的字段',
                            }],
                        })(
                            <TableFieldsSelect valueField={"id"} tableId={tableId} mode={null}/>
                        )
                    }
                </Form.Item>
                <Form.Item
                    label="方向"
                    {...formItemLayout}
                >
                    <Select value={directionType} onChange={this.handleDtTypeChange}>
                        <Option value={"0"}>本表指向关联表</Option>
                        <Option value={"1"}>关联表指向本表</Option>
                    </Select>
                </Form.Item>
                <Form.Item {...buttonItemLayout}>
                    <Button type="primary" onClick={this.handleSubmit} style={{marginRight:20}}>保存</Button>
                    <Button type="primary" onClick={this.props.onCancel}>取消</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default AddRelationForm;
