import {NotificationWrap} from 'app_common'
import React, {Component} from 'react';
import {Button, Form, Input, Select} from "antd";
import TableFieldsSelect from "app_page/dama/component/tableFieldsSearchSelect";
import {editTable} from "app_api/modelApi";

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
const Option = Select.Option

/**
 * todo 模型入口的存在domain的格式已经变了 需要修改下数据结构 但是当前没有数据没法调试 后台也没有提供对应的数据结构样例 等有数据了再调把
 */

@Form.create()
class TableField extends Component {
    constructor(props) {
        super(props);
        this.state={
            required:false
        }
        console.log(this.props)
    }

    handleSubmit = async(e)=>{
        e.preventDefault()
        this.props.form.validateFields(async (err,value)=>{
            if (!err){
                console.log(value)
                value.primaryKey = value.primaryKey.join(",")
                let res = await editTable({
                    businessId:this.props.param.businessId,
                    id:this.props.param.tableId||this.props.param.id||"",
                    domain:{
                        domainName:value.domainName,
                        domainNameField: value.nameField,
                        businessId:this.props.param.businessId
                    },
                    ...value
                })
                if (res.code!=200){
                    NotificationWrap.error(res.msg)
                    return
                }
                this.onCancel()
            }
        })
    }

    componentDidMount() {
        this.init()
    }

    init = ()=>{
        const {
            param:{
                dataBaseName,
                dimTable,
                domainName,
                domainNameField,
                tableEnglishName,
                tableName,
                timeField,
                timeFormat,
                primaryKey,
                physical_table,
                table_name,
                physical_db,
                time_field,
                time_format,
                primary_key,
                domain_name,
                name_field,
                dim_table
            }
        } = this.props
        this.props.form.setFieldsValue({
            physicalTable:tableEnglishName||physical_table,
            tableName:tableName||table_name,
            physicalDb:dataBaseName||physical_db,
            timeField:timeField||time_field,
            timeFormat:timeFormat||time_format,
            primaryKey:primaryKey&&primaryKey.split(',')||primary_key&&primary_key.split(',')||[],
            domainName:domainName||domain_name,
            nameField:domainNameField||name_field,
            dimTable:dimTable||dim_table
        })
    }
    handleChange=(field,value)=>{
        this.props.form.setFieldsValue({
            [field]:value
        })
        this.props.form.validateFields([field], { force: true })
    }
    handleDomainChange=(e)=>{
        if (e.target.value){
            this.setState({
                required:true
            },()=>this.props.form.validateFields(['nameField'], { force: true }));
        } else{
            this.setState({
                required:false
            },()=>this.props.form.validateFields(['nameField'], { force: true }));
        }
    }
    onCancel = ()=>{
        const { onCancel }=this.props.param
        onCancel||this.props.removeTab("修改表属性")
        onCancel&&onCancel()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {required}=this.state
        const {noDomain} = this.props.param
        return (
            <Form style={{height:1000}}>
                <Form.Item
                    {...formItemLayout}
                    label="表英文名"
                >
                    {getFieldDecorator('physicalTable', {
                        rules: [{
                            required: true, message: '请输入表英文名',
                        }],
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="表中文名"
                >
                    {getFieldDecorator('tableName', {
                        rules: [{
                            required: true, message: '请输入表中文名',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="所属数据库"
                >
                    {getFieldDecorator('physicalDb', {
                        rules: [{
                            required: true, message: '请选择所属数据库',
                        }],
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="时间字段"
                >
                    {getFieldDecorator('timeField')(
                        <TableFieldsSelect
                            valueField={"physical_field"}
                            tableId={this.props.param.tableId||this.props.param.id}
                            onChange={(value)=>this.handleChange("timeField",value)}
                            mode={null}/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="时间字段类型"
                >
                    {getFieldDecorator('timeFormat')(
                        <Select>
                            <Option value={"yyyyMMdd"}>yyyyMMdd(20180108)</Option>
                            <Option value={"yyyy-MM-dd"}>yyyy-MM-dd(2018-01-08)</Option>
                            <Option value={"yyyy/MM/dd"}>yyyy/MM/dd(2018/01/08)</Option>
                            <Option value={"yyyyMMdd HH:mm:ss"}>yyyyMMdd  HH:mm:ss(20180108 01:08:08)</Option>
                            <Option value={"yyyy-MM-dd HH:mm:ss"}>yyyy-MM-dd HH:mm:ss(2018-01-08 01:08:08)</Option>
                            <Option value={"yyyy/MM/dd HH:mm:ss"}>yyyy/MM/dd HH:mm:ss(2018/01/08 01:08:08)</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="主键"
                >
                    {getFieldDecorator('primaryKey', {
                        rules: [{
                            required: true, message: '请选择主键',
                        }],
                    })(
                        <TableFieldsSelect
                            valueField={"physical_field"}
                            tableId={this.props.param.tableId||this.props.param.id}
                            onChange={(value)=>this.handleChange("primaryKey",value)}
                        />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="表类型"
                >
                    {getFieldDecorator('dimTable', {
                        rules: [{
                            required: true, message: '请选择表类型',
                        }],
                    })(
                        <Select>
                            <Option value={"1"}>维度表</Option>
                            <Option value={"0"}>事实表</Option>
                            <Option value={"2"}>未知</Option>
                        </Select>
                    )}
                </Form.Item>
                {!noDomain&&<Form.Item
                    {...formItemLayout}
                    label="domain名称"
                >
                    {getFieldDecorator('domainName', {
                        rules: [{
                            pattern: /^[\u4e00-\u9fa5]*$/, message: '请输入中文字符',
                        }],
                    })(
                        <Input onChange={this.handleDomainChange}/>
                    )}
                </Form.Item>}
                {!noDomain&&<Form.Item
                    {...formItemLayout}
                    label="domain name字段"
                >
                    {getFieldDecorator('nameField', {
                        rules: [{
                            required: required, message: '请选择domain name字段',
                        }],
                    })(
                        <TableFieldsSelect
                            valueField={"physical_field"}
                            tableId={this.props.param.tableId||this.props.param.id}
                            onChange={(value)=>this.handleChange("nameField",value)}
                            mode={null} allowClear/>
                    )}
                </Form.Item>}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" onClick={this.handleSubmit}style={{marginRight:20}}>保存</Button>
                    <Button onClick={this.onCancel}>取消</Button>
                </Form.Item>
            </Form>
        )
    }
}


export default TableField;
