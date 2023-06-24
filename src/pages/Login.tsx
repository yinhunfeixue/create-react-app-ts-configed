import IPageProps from '@/base/interfaces/IPageProps';
import UrlUtil from '@/utils/UrlUtil';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Component } from 'react';
import styles from './Login.module.less';

interface ILoginSate {}
/**
 * 登录页
 */
class Login extends Component<IPageProps, ILoginSate> {
  requestLogin(data: any) {
    const { query } = this.props;
    const backUrl: string = query?.backUrl as string;
    if (backUrl) {
      window.location.href = backUrl;
    } else {
      UrlUtil.toUrl('/');
    }
  }

  render() {
    return (
      <div className={styles.Login}>
        <main>
          <Form
            layout="vertical"
            onFinish={(values) => {
              this.requestLogin(values);
            }}
          >
            <FormItem
              label="帐号"
              name="phone"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="用户名" />
            </FormItem>
            <FormItem
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="密码" />
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                block
                size="large"
                onClick={() => {}}
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </main>
      </div>
    );
  }
}

export default Login;
