import { Form } from '@ant-design/compatible';
import { Alert, Col, Row } from 'antd';
import React from 'react';
import _ from 'underscore';


const FormItem = Form.Item;

/*
    props:
        formLayout：             表单排列方向，默认horizontal 竖向排列  此外还有'vertical'|'inline'
        className：              样式类名
        formItemLayout:         表单项所占页面宽度 参数是对象{} 数字与Col类似 ，共24列
                                字段：{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }
                                也可以设置 xm lg 等
        tailFormItemLayout：    表单提交按钮样式 参数是对象{} 数字与Col类似 ，共24列
                                字段：{labelCol: { span: 12 }, wrapperCol: { span: 12, offset: 4 } }
        fromItemList：          表单项具体的组件：
                                参数是数组[] 里面是对象，数组每一项包括：
                                lable：描述文字
                                decorator：getFieldDecorator方法的第一个参数 提交时validateFields方法返回的字段名
                                decoratorParam：getFieldDecorator方法的第二个参数 可以设置初始值 initialValue、子节点值属性 valuePropName、校验规则rules等，具体看官网
                                controll：具体的组件 可以是antd 提供的  也可以是自定义组件，自定义组件封装方法具体看src/component/filter/selectGroup.jsx封装的过程及注意项
        tailFormItem：          提交按钮，一般为一个没有任何事件的button，因为 form 表单有自己的onSubmit提交事件
        notice：                除了rules规则在每个item下的提示以外的 显示在提交按钮上面的提示，一般为请求后台出错的提示
        noticeClosable:         Alert组件是否显示关闭按钮 默认不显示关闭按钮

    function：                  提供formItem里控件的方法，不够自己扩展
        onCloseHandle:          Alet组件关闭按钮触发的事件
        handleConfirmBlur：     鼠标失去焦点出发事件
        checkConfirmPassword：  确认密码控件事件，src/app/admin/resetPassword.jsx 页面
        checkConfirm：          确认事件
        setFieldsValue（object）:         设置表单项的值 例如修改和查看时使用
        getFieldsValue（object）:         获取表单项的值
        compareFiledsValue（oldvalue, newValue） 比较两个值是否相等 返回true or false
*/

class RegistrationForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            confirmDirty: false
        };

        // bind function
        this.onCloseHandle = this.onCloseHandle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log("err, values");
            // console.log(err);
            // console.log(values);
            if (this.props.handleSubmit) {
                this.props.handleSubmit(err, values)
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({
            confirmDirty: this.state.confirmDirty || !!value
        });
    }

    setFieldsValue(fileds) {
        this.props.form.setFieldsValue(fileds);
    }

    getFieldsValue(fileds) {
        this.props.form.getFieldsValue(fileds);
    }

    compareFiledsValue(oldvalue, newValue) {
        let {form} = this.props;
        if (form.getFieldValue(oldvalue) !== form.getFieldValue(newValue)) {
            return false;
        } else {
            return true;
        }
    }

    checkConfirmPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('您两次输入的密码不同!');
        } else {
            callback();
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    onCloseHandle(e) {
        if (this.props.onCloseHandle) {
            this.props.onCloseHandle(e);
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            fromItemList,
            formItemLayout,
            tailFormItemLayout,
            tailFormItem,
            formLayout,
            notice,
            noticeClosable,
            className
        } = this.props;

        return (<div>
            <Row>
                <Col span={24}>
                    <Form layout={formLayout
                            ? formLayout
                            : 'horizontal'} className={className} onSubmit={this.handleSubmit}>
                        {
                            _.map(fromItemList, (item, index) => {
                                return <FormItem {...formItemLayout} label={item.lable} key={index}>
                                    {getFieldDecorator(`${item.decorator}`, item.decoratorParam)(item.controll)}
                                </FormItem>
                            })
                        }

                        {
                            notice && <Alert style={{
                                        marginBottom: 24
                                    }} message={notice} type="error" showIcon="showIcon" closable={noticeClosable
                                        ? noticeClosable
                                        : true} onClose={this.onCloseHandle}/>
                        }

                        {
                            tailFormItem
                                ? <FormItem {...tailFormItemLayout}>
                                        {tailFormItem}
                                    </FormItem>
                                : ""
                        }
                    </Form>
                </Col>
            </Row>
        </div>);
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;

module.exports = WrappedRegistrationForm;
