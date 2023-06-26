import IconFont from '@/component/IconFont'
import { Alert, Button, Form, Input } from 'antd'
import { usersPass } from 'app_api/userAuthApi'
import { Tools } from 'app_common'
import Cache from 'app_utils/cache'
import React from 'react'
import './resetPassword.less'

const FormItem = Form.Item

class ResetPasswordForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            errorMsg: undefined,
            loading: false,
        }
    }

    onBlur = (e) => {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }
    compareToFirstPassword = async (rule, value) => {
        const form = this.form
        if (value && value !== form.getFieldValue('newPass')) {
            return Promise.reject('新旧密码不一致，请重新填写!')
        } else {
            return Promise.resolve()
        }
    }

    handleSubmit = (values) => {
        const userInfo = Cache.get('userinfo')
        let req = values
        req.oldPassword = Tools.encrypt(values.oldPass)
        req.newPassword = Tools.encrypt(values.newPass)
        req.username = userInfo.english_name
        delete req.confirm

        this.setState({ loading: true })
        usersPass(req)
            .then((res) => {
                if (res.code == '200') {
                    Cache.clear()
                    this.props.history.push('/login')
                } else {
                    this.setState({ errorMsg: res.msg })
                }
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    goBack = () => {
        this.props.hidePage()
    }

    render() {
        const { errorMsg, loading } = this.state

        return (
            <div className='resetPassword'>
                <header className='formTitle'>修改密码</header>
                <Form onFinish={this.handleSubmit} ref={(target) => (this.form = target)}>
                    <FormItem
                        name='oldPass'
                        rules={[
                            {
                                required: true,
                                message: '请输入旧密码',
                            },
                            {
                                max: 16,
                                message: '旧密码不能超过16个字符',
                            },
                            {
                                min: 6,
                                message: '旧密码不能少于6个字符',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<IconFont type='icon-mima' />}
                            placeholder='请输入旧密码'
                            style={{
                                height: '44px',
                            }}
                        />
                    </FormItem>

                    <FormItem
                        name='newPass'
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                            {
                                max: 16,
                                message: '新密码不能超过16个字符',
                            },
                            {
                                min: 6,
                                message: '新密码不能少于6个字符',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<IconFont type='icon-mima' />}
                            placeholder='请输入新密码'
                            style={{
                                height: '44px',
                            }}
                        />
                    </FormItem>
                    <FormItem
                        style={{ marginBottom: 32 }}
                        name='confirm'
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                            {
                                max: 16,
                                message: '新密码不能超过16个字符',
                            },
                            {
                                min: 6,
                                message: '新密码不能少于6个字符',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<IconFont type='icon-mima' />}
                            placeholder='请确认新密码'
                            style={{
                                height: '44px',
                            }}
                            onBlur={this.onBlur}
                        />
                    </FormItem>
                    {errorMsg ? <Alert showIcon className='ErrorMsg' message={errorMsg} type='warning' /> : null}
                    <FormItem style={{ marginBottom: 32 }}>
                        <div className='ControlGroup'>
                            <Button type='primary' htmlType='submit' block loading={loading}>
                                确定
                            </Button>
                            <Button onClick={this.goBack} block disabled={loading}>
                                返回
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default ResetPasswordForm
