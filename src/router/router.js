import BaseLayout from '@/component/baseLayout/baseLayout.jsx'
import PageUtil from '@/utils/PageUtil'
import { Bundle } from 'app_common'
import tabConfig from 'app_config'
import Cache from 'app_utils/cache'
import React, { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
let menuList = []

const baseName = process.env.BASE_URL || '/'
const BaseName = process.env.BASE_URL || ''

const PrivateRoute = ({ component: Component, ...rest }) => {
    // return <Route {...rest} render={(props) => <Component {...rest} {...props} date={rest.date || false} />} />
    return <Route {...rest} render={(props) => <Component {...rest} {...props} date={rest.date || false} />} />
}

class RouteList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        console.log('routerList')
    }
    componentWillMount = async () => {
        await this.init()
    }
    init = () => {
        menuList = []
        this.getMenuList(tabConfig)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
    getMenuList = (data) => {
        data.map((item) => {
            menuList.push(item)
            if (item.children) {
                this.getMenuList(item.children)
            }
        })
    }

    login = (props) => {
        const history = this.createHistory()
        return <Bundle load={() => import('../app/login/index')}>{(Page) => <Page {...props} history={history} />}</Bundle>
    }
    BaseLayout = (props) => {
        const location = useLocation()
        const history = this.createHistory()
        return <BaseLayout location={location} {...props} history={history} />
    }

    createHistory = () => {
        const navigate = useNavigate()
        const history = {
            push: (param) => {
                if (typeof param === 'string') {
                    navigate(param)
                } else {
                    const { pathname, state } = param
                    navigate(pathname, { state })
                }
            },
        }
        return history
    }

    renderMenuRouter = () => {
        const argsRender = Cache.get('argsRender')
        const list = menuList.map((item) => {
            item.component = (props) => {
                const location = useLocation()
                const params = useParams()
                return (
                    <Bundle jsxPath={item.path} load={() => import(`app_page/${item.path}`)} title={item.title || item.name}>
                        {(Page) => <Page {...props} location={location} addTab={PageUtil.addTab} {...argsRender} />}
                    </Bundle>
                )
            }
        })

        return menuList.map((item, i) => {
            return <Route exact path={item.route} element={React.createElement(item.component, this.props)} />
        })
    }
    render() {
        let defRouter = this.props.defRouter
        if (this.props.defRouter == undefined) {
            defRouter = Cache.get('currentMenu') ? Cache.get('currentMenu')[0] : '/kpiCharts'
        }
        const { mList, lastUpdateDate } = this.props
        const BaseLayout = this.BaseLayout
        console.log('router', this)
        return (
            <BrowserRouter basename={baseName}>
                <Routes>
                    <Route path='/login' exact element={<this.login />} />
                    <Route
                        path='/'
                        element={
                            <BaseLayout>
                                <Outlet />
                            </BaseLayout>
                        }
                    >
                        {this.renderMenuRouter()}
                    </Route>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default RouteList
