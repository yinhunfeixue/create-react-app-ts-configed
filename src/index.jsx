import '@ant-design/compatible/assets/index.css'
import { Button, Cascader, ConfigProvider, Empty, Input, Result, Select, Tree, TreeSelect } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import Cache from 'app_utils/cache'
import ReactDOM from 'react-dom'
/* import ClientMonitor from 'skywalking-client-js' */
import moment from 'moment'
import '../resources/din/din.css'
import '../resources/iconfont/iconfont.css'
import { initUserInfo } from './api/userAuthApi'
import EmptyIcon from './component/EmptyIcon'
import './index.less'
import RouteList from './router/router'

import 'moment/locale/zh-cn'
import PageUtil from './utils/PageUtil'

moment.locale('zh-cn')

/* ClientMonitor.register({
    collector: window.location.origin,
    service: 'DMP_Frontend',
    pagePath: window.location.href,
    serviceVersion: 'v1.0.0',
    // useFmp: true,
    // enableSPA: true
}); */

const getPopupContainer = () => {
    return document.getElementById('drawerLayoutDropContainer') || document.getElementById('dropdownContainer') || document.body
}

Input.Search.defaultProps = Object.assign({ allowClear: true }, Input.Search.defaultProps)

Select.defaultProps = Object.assign(
    {
        getPopupContainer,
        showSearch: false,
        showArrow: true,
    },
    Select.defaultProps
)
TreeSelect.defaultProps = Object.assign(
    {
        getPopupContainer,
        showArrow: true,
    },
    TreeSelect.defaultProps
)

Cascader.defaultProps = Object.assign(
    {
        getPopupContainer,
    },
    Cascader.defaultProps
)

Tree.defaultProps = Object.assign({ showLine: { showLeafIcon: false } }, Tree.defaultProps)

// 根据QueryString参数名称获取值
const getQueryStringByName = (name) => {
    var result = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))

    if (result == null || result.length < 1) {
        return ''
    }
    return result[1]
}

window.document.addEventListener('copy', (event) => {
    const data = event.clipboardData
    if (!data) {
        return
    }
    event.preventDefault()
    let text = window.getSelection().toString()
    text = text.replace(/^[ \t]*(.*?)[ \t]*$/, '$1')
    data.setData('Text', text)
})

let App = (props) => {
    console.log('app', props)

    return (
        <ConfigProvider
            locale={zhCN}
            renderEmpty={(name) => {
                switch (name) {
                    case 'Table':
                        return <EmptyIcon />
                    default:
                        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            }}
        >
            <RouteList />
        </ConfigProvider>
    )
}

const loginToken = getQueryStringByName('jwt')

const userAuth = async () => {
    let pathname = window.location.pathname
    if (pathname != '/login') {
        try {
            await initUserInfo()
        } catch (error) {
            ReactDOM.render(
                <div className='LoginError'>
                    <Result
                        status='info'
                        title='登录失败，请重新登录'
                        extra={[
                            <Button
                                type='primary'
                                key='console'
                                onClick={() => {
                                    Cache.clear()
                                    // window.location.href = '/login'
                                    PageUtil.addTab('login')
                                }}
                            >
                                登录
                            </Button>,
                        ]}
                    />
                    {error}
                </div>,
                document.getElementById('dmpIndexPage')
            )
            return
        }
    }

    ReactDOM.render(<App />, document.getElementById('dmpIndexPage'))
}

const userInfo = Cache.get('userinfo')
let loginStatus = false
if (userInfo) {
    if (userInfo.loginid) {
        ReactDOM.render(<App />, document.getElementById('dmpIndexPage'))
        loginStatus = true
    }
}

if (!loginStatus) {
    if (loginToken) {
        Cache.set('jwtQuantchi', loginToken)
    }
    userAuth()
}
