import { initUserInfo } from '@/api/userAuthApi'
import { Alert, Button, Form, Input } from 'antd'
import { login } from 'app_api/userAuthApi'
import { Tools } from 'app_common'
import Cache from 'app_utils/cache'
import React from 'react'
import Banner from '../../../resources/images/login/banner.png'
import './index.less'
import './style.less'

const BaseName = process.env.BASE_URL || ''

const FormItem = Form.Item

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errorMsg: undefined,
            loading: false,
        }
    }

    // 在浏览器里直接输入 域名、端口号的时候 登录过就根据当前登录的角色直接跳转到对应的主页
    componentWillMount() {
        if (Cache.get('login')) {
            // location.href = `${BaseName}/`
            console.log(' this.props.history', this.props.history)
            this.props.history.push({ pathname: '/' })
            return
        }
    }

    // 登录成功之后要set localStory的userData 在baselayout里面从localStory的userData去user信息，不要像原来一样在 index主页里取
    handleSubmit = (values) => {
        values.password = Tools.encrypt(values.password)
        this.setState({ loading: true, errorMsg: '' })
        login(values)
            .then((res) => {
                if (res.code == '200') {
                    Cache.set('userinfo', res.data)
                    Cache.set('login', 'true')
                    Cache.set('userName', values.username)
                    if (res.data.roleIds) {
                        Cache.set('roleIds', res.data.roleIds)
                        if (res.data.roleIds.includes(-2)) {
                            Cache.set('canChangeAsset', false)
                        } else {
                            Cache.set('canChangeAsset', true)
                        }
                    }

                    return initUserInfo()
                        .then((data) => {
                            const { initialComplete } = data
                            if (initialComplete) {
                                Cache.set('currentMenu', ['/kpiCharts'])
                                this.props.history.push('/kpiCharts')
                            } else {
                                window.location.href = `${BaseName}/dataWare/guide`
                            }
                        })
                        .catch((error) => {
                            this.setState({ errorMsg: res.msg })
                        })
                } else {
                    this.setState({ errorMsg: res.msg })
                }
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    render() {
        const { errorMsg, loading } = this.state
        return (
            <div className='loginPage'>
                <div className='Wrap'>
                    <div className='Left'>
                        <main>
                            <h1>欢迎登录</h1>
                            <h2>量之智能，让您更好地决策！</h2>
                            <Form layout='vertical' onFinish={this.handleSubmit} autoComplete='off'>
                                <FormItem
                                    label='帐号'
                                    colon={false}
                                    name='username'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入用户名',
                                        },
                                    ]}
                                >
                                    <Input autocomplete='off' placeholder='账号' />
                                </FormItem>
                                <FormItem
                                    label='密码'
                                    colon={false}
                                    style={{ marginBottom: 48 }}
                                    name='password'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入密码',
                                        },
                                    ]}
                                >
                                    <Input.Password autocomplete='off' placeholder='密码' />
                                </FormItem>
                                {errorMsg ? <Alert className='ErrorInfo' showIcon message={errorMsg} type='warning' /> : null}
                                <FormItem>
                                    <Button block type='primary' htmlType='submit' className='btnLogin' loading={loading}>
                                        登录
                                    </Button>
                                </FormItem>
                            </Form>
                        </main>
                    </div>
                    <img className='ImgBanner' src={Banner} />
                </div>
                <footer>
                    <em>
                        <span>杭州量之智能科技有限公司</span>
                    </em>
                </footer>
            </div>
        )
    }
}

export default NormalLoginForm
