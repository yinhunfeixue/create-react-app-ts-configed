import { Button, Form, Input } from '@/pages/node_modules/antd';
import { FormComponentProps } from '@/pages/node_modules/antd/lib/form';
import FormItem from '@/pages/node_modules/antd/lib/form/FormItem';
import React, { Component } from '@/pages/node_modules/react';

/**
 * 登录页
 */
class Login extends Component<FormComponentProps, any> {
  render() {
    return (
      <div>
        <Form layout="inline">
          <FormItem>
            {this.props.form.getFieldDecorator('name')(<Input />)}
          </FormItem>
          <FormItem>
            {this.props.form.getFieldDecorator('password')(<Input />)}
          </FormItem>
          <FormItem>
            <Button
              onClick={() => {
                this.props.form.validateFields((errors, values) => {
                  if (!errors) {
                    // console.log(values);
                  }
                });
              }}
            >
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
