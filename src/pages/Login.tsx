import IPageProps from '@/base/interfaces/IPageProps';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
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
            <Input placeholder="用户名" />
          </FormItem>
          <FormItem>
            <Input placeholder="密码" />
          </FormItem>
          <FormItem>
            <Button
              onClick={() => {
                // window.location.hash = '/';
                axios.get('http://www.baidu.com/sfadsfa/sfasda');
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

export default Login;
