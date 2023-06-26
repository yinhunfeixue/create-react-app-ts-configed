import { Form } from '@ant-design/compatible';
import { Button, Checkbox, Col, Input, Row, Select } from "antd";
import { fromStandard } from "app_api/standardApi";
import CONSTANTS from 'app_constants';
import React from "react";


const FormItem  = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const {SELECT_PAGE_SIZE} = CONSTANTS

const formItemLayout = {
    wrapperCol: {
        span: 16
    },
    labelCol: {
         span: 7
    }
};
const formItemLayoutOne = {
    wrapperCol: {
        span: 21,
    },
    labelCol: {
         span: 3
    }
}
const options = [
    { label: '完全映射', value: '1' },
    { label: '部分映射', value: '2' },
    { label: '无需映射', value: '3' },
];
const fieldOption = [
    { label: '完全映射', value: '1' },
    { label: '部分映射', value: '2' },
    { label: '无法映射', value: '4' },
];

@Form.create()
export default class CodeValueMapSearchTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData:[],
            sourceSystemCodeItem:[],
        };
        console.log(this.props)
    }

    async componentDidMount(){
        this.props.form.setFieldsValue({
            mappingType:this.props.type==="field"?["1","2","4"]:["1","2","3"]
        })
        this.setState({
            pageData: this.totalToArr(this.props.location.state.total)
        })
        this.getSourceSystemCodeItem()
    }

    getSourceSystemCodeItem = async ()=>{
        let res = this.props.type==='standard'? await  fromStandard({standardId:this.props.location.state.id}) : await fromStandard({id: this.props.location.state.id})
        this.setState({
            sourceSystemCodeItem:res.data
        })
    }

    handleSubmit = (e)=>{
        e.preventDefault()
        this.props.form.validateFields((err,value)=>{
            if(!err){
                this.props.getMapData(value)
            }
        })
    }

    totalToArr = (total)=>{
        let pageSize = SELECT_PAGE_SIZE
        let arr = []
        let pages = Math.ceil(total / pageSize)
        for(let i=0;i<pages;i++){
            arr.push({
                start:SELECT_PAGE_SIZE * i+1,
                page:i+1,
                end:total-SELECT_PAGE_SIZE * (pages-i-1)
            })
        }
        return arr
    }

    getCheckedStatus = ()=>{
        return this.props.form.getFieldValue("mappingType").join(",")
    }

    render() {
        const {getFieldDecorator} =this.props.form
        const {pageData,sourceSystemCodeItem} = this.state
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={7}>
                            {
                                this.props.type==='field'&&
                                <FormItem
                                    {...formItemLayout}
                                    label="标准代码项"
                                >
                                    {getFieldDecorator('metaCodeItemName', {
                                        rules: [{ required: true, message: '请输入标准代码项!' }],
                                        initialValue:this.props.location.state.name
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            }
                            {
                                this.props.type==='standard'&& <FormItem
                                    {...formItemLayout}
                                    label="源系统代码项"
                                >
                                    {getFieldDecorator('metaCodeItemId', {
                                        rules: [{ required: true, message: '请选择源系统代码项!' }],
                                    })(
                                        <Select >
                                            {
                                                sourceSystemCodeItem.map(item=>(
                                                    <Option key={item.id} value={item.id}>{`${item.datasource}.${item.database}.${item.name}`}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            }

                        </Col>
                        <Col span={4}>
                            <FormItem
                                label=""
                                {...formItemLayoutOne}
                            >
                                {getFieldDecorator('q')(
                                    <Input  placeholder="请输入代码值/代码值名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem
                                {...formItemLayout}
                                label="显示条数"
                            >{
                                getFieldDecorator('page')(
                                    <Select>
                                        {
                                            pageData.map(item =>(<Option key={item.key} value={item.page}>{`${item.start}-${item.end}`}</Option>))
                                        }
                                    </Select>
                                )
                            }
                            </FormItem>
                        </Col>
                        <Col span={3} style={{ paddingTop : '6px'}}>
                                <Button type="primary" htmlType="submit">搜索</Button>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <FormItem
                                {...formItemLayoutOne}
                                label="关系类型"
                            >
                                {getFieldDecorator('mappingType')(
                                    <CheckboxGroup options={this.props.type==="field"?fieldOption:options} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}
