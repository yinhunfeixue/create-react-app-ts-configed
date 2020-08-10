import IPageProps from '@/base/interfaces/IPageProps';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Component } from 'react';

interface ILoginSate {}
/**
 * 登录页
 */
class Login extends Component<IPageProps, ILoginSate> {
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
            <Button onClick={() => {}}>登录</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Login;
