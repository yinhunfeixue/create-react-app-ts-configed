import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import PermissionManage from '@/utils/PermissionManage'
import { Button, ConfigProvider, Divider, Dropdown, Layout, Menu, message } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { logout } from 'app_api/userAuthApi'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import tabConfig from 'app_config'
import ResetPassword from 'app_page/login/resetPassword'
import Cache from 'app_utils/cache'
import 'babel-polyfill'
import qs from 'qs'
import React, { Component } from 'react'
import _ from 'underscore'
import icon_user from '../../../resources/images/admin.png'
import Breadcrumb from './breadcrumb'
import './index.less'
/* import ClientMonitor from 'skywalking-client-js'; */

const BaseName = process.env.BASE_URL || ''

let menuDetailList = []
let timer = null

const { SubMenu } = Menu
const { Header, Sider, Content, Footer } = Layout

function clearPageSession() {
    sessionStorage.setItem('data-directory', '{}')
}

export default class BaseLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routeRender: true,
            defaultSelectedKeys: '', // 上面的tab默认选中的key
            defRouter: this.props.defRouter ? this.props.defRouter : '/',
            menuItemList: {},
            isLeftMenu: true,
            headerBottomList: [], // 头部下方list
            headerBottomListSelectedKeys: '', // 头部下方list选中的key,
            resetPasswordDisplay: false, // 重置密码是否显示,
            queryList: {},
            secondMenuList: [], // 二级菜单
            secondSelectedKeys: '', // 头部下方list选中的key,
            currentSelectedKey: '',

            collapsed: true,
            menuSelectedInfo: {
                selectedMenuKey: 0,
                hoverMenuKey: 0,
                childrenMenu: [],
                childrenMenuBackup: [],
            },
            selectedMenuKey: 0,
            childrenMenu: [],
            hoverChildrenMenu: [],
            menuItemTitle: '',
            hoverMenuTitle: '',
            openKeys: Cache.get('openKeys') || [],
            current: [],
            isHovered: false,
            hoverKey: 0,
            params: {},
            profileVisible: false,
        }
        this.rootSubmenuKeys = ['sub1', 'sub2', 'sub4']

        this.menuTitleMap = {}
        this.menuTopIndex = {}
        this.lastUpdateDate = {}
        this.userInfo = Cache.get('userinfo')

        this.menuSecodeUrlChildren = {}
        this.menuSecodeIdChildren = {}

        PageUtil.addTab = this.addTab
    }
    register() {
        /* ClientMonitor.customOptions.pagePath = window.location.href */
    }

    checkRouterConfig() {
        let error = ''
        const nameDic = {}
        const pathDic = {}
        const routeDic = {}
        tabConfig.forEach((item) => {
            const { name, path, route } = item

            // 如果存在相同的，则记录
            if (nameDic[name]) {
                error += `name=${name} 重复<br/>`
            }
            /* if (pathDic[path]) {
                error += `path=${path} 重复<br/>`
            } */
            if (routeDic[route]) {
                error += `route=${route} 重复<br/>`
            }

            nameDic[name] = true
            pathDic[path] = true
            routeDic[route] = true
        })
        if (error) {
            message.error({
                content: <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: `路由重复<br/>${error}` }} />,
            })
        }
    }

    componentWillMount = async () => {
        this.checkRouterConfig()
        this.setState({
            collapsed: Cache.get('menuCollapsed') !== undefined ? Cache.get('menuCollapsed') : this.state.collapsed,
        })
        let wetherLogin = Cache.get('login')
        let pathname = window.location.pathname
        // 如果用户信息不存在，则跳转到登录页面
        if (!wetherLogin && pathname != '/login') {
            window.location.href = `${BaseName}/login`
            // this.props.history.push('/login')
            return
        }

        // 获取用户权限栏目数据
        const menuList = Cache.get('menuData') || []
        // 获取当前浏览器url地址段
        let secondSelectedKeys = this.urlUnite(this.props.location.pathname)
        let secondMenuList = []
        let defaultSelectedKeys = ''

        menuList.map((value, index) => {
            if (value.children.length > 0) {
                value.children.map((value1, index) => {
                    // 二级栏目对应的
                    this.menuSecodeUrlChildren[this.urlUnite(value1.code)] = value1.children
                    this.menuSecodeIdChildren[value1.id] = value1.children
                })
            }
        })

        if (secondSelectedKeys == '/') {
            if (menuList.length > 0 && menuList[0]['children'].length > 0) {
                defaultSelectedKeys = menuList[0]['id'] + ''
                secondMenuList = menuList[0]['children']
                secondSelectedKeys = this.urlUnite(menuList[0]['children'][0]['code'])
            }
        } else {
            // pathname 存在
            menuList.map((value, index) => {
                if (this.urlUnite(value.code) == secondSelectedKeys) {
                    defaultSelectedKeys = value.id + ''
                    secondMenuList = value.children
                } else {
                    if (value.children.length > 0) {
                        value.children.map((value1, index) => {
                            // 存储高级功能里的项 render的时候通过headerBottomListSelectedKeys找到对应的改机功能
                            if (this.urlUnite(value1.code) == secondSelectedKeys) {
                                defaultSelectedKeys = value1.parent_id + ''
                                secondMenuList = value.children
                            }
                        })
                    }
                }
            })
        }

        // url 参数处理
        let queryList = this.parseUrlSearchParams()

        menuList.map((item) => {
            item.children = this.setParentId(item.children, item.id)
        })

        this.filterMenuList(menuList)

        await this.setState({
            menuItemList: menuList,
            secondMenuList,
            defaultSelectedKeys,
            secondSelectedKeys,
            queryList,
        })

        this.initMenu()
        await this.initDetailMenu()
        this.redirect(pathname)
    }

    filterMenuList = (menuList) => {
        for (let index = 0; index < menuList.length; index++) {
            const element = menuList[index]
            menuList[index].children = this.filterMenuList(menuList[index].children.filter((item) => item.authType === 1))
        }
        return menuList
    }

    redirect = (pathname) => {
        let pathExist = this.getPath(pathname, menuDetailList)
        if (!pathExist) {
            // 判断当前地址是否存在，不存在时跳转首页
            this.props.history.push({ pathname: '/kpiCharts' })
        }
        this.register()
    }
    removeBeginAndEndTrail = (path = '') => {
        let _path = path
        if (_path.startsWith('/')) {
            _path = _path.substring(1, _path.length)
        }
        if (_path.endsWith('/')) {
            _path = _path.substring(0, _path.length - 1)
        }
        return path
    }
    matchRouteId = (route = '', path = '') => {
        if (!route.includes(':')) return false
        // 去掉首尾斜杠
        const routeArr = this.removeBeginAndEndTrail(route).split('/')
        const pathArr = this.removeBeginAndEndTrail(path).split('/')
        let matchCount = 0
        routeArr.forEach((v, i) => {
            if (v === pathArr[i] || (v.includes(':') && !!pathArr[i])) {
                matchCount++
            }
        })
        return matchCount === routeArr.length
    }
    getPath = (path, data) => {
        // 这个判断意义是啥？暂时先把id路由的放过去
        for (let i = 0; i < data.length; i++) {
            if (data[i].route == path || this.matchRouteId(data[i].route, path)) {
                return true
            } else {
                if (data[i].children) {
                    if (data[i].children.length) {
                        this.getPath(path, data[i].children)
                    }
                }
            }
        }
        return false
    }

    // url 统一处理,统一 ‘/’结尾
    urlUnite = (url) => {
        let regx = /\/$/
        if (!regx.test(url)) {
            url = url + '/'
        }
        return url
    }

    // url 参数处理
    parseUrlSearchParams = () => {
        return qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    }
    renderVersionInfo = () => {
        let license = this.userInfo.license ? this.userInfo.license : { remainDays: 0, versionType: 0, registerDate: '-' }
        return (
            <div className='versionContent'>
                <div
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        paddingBottom: 16,
                        borderBottom: '1px solid rgba(102, 102, 102, 0.1)',
                        marginBottom: 23,
                    }}
                >
                    体验版
                </div>
                <div style={{ fontSize: '14px' }}>
                    注册日期
                    <span style={{ float: 'right' }}>{license.registerDate}</span>
                </div>
                <div
                    style={{
                        fontSize: '14px',
                        margin: '16px 0 24px 0',
                        color: license.remainDays < 10 ? '#FE293B' : '#1890ff',
                    }}
                >
                    {license.remainDays < 10 ? <span>!</span> : null}
                    剩余时间
                    <span style={{ float: 'right' }}>{license.remainDays}天</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>为了不影响您的服务体验，请尽快联系销售顾问升级</div>
            </div>
        )
    }
    // 渲染页面用户信息块
    renderUserInfo = () => {
        let userInfo = this.userInfo
        let enName = ''
        if (userInfo) {
            if (userInfo.english_name) {
                enName = userInfo.english_name
            } else if (userInfo.lastname) {
                enName = userInfo.lastname
            } else {
                enName = userInfo.loginid
            }
            // 右上角用户详细信息
            return (
                <div className='UserOverlay'>
                    {/* 用户信息 */}
                    <div className='UserInfo'>
                        <img className='ImgHead' src={userInfo.head_portrait ? userInfo.head_portrait : icon_user} />
                        <h3>{userInfo.english_name ? userInfo.english_name : userInfo.lastname}</h3>
                        <div>{userInfo.login_time}（最近登录）</div>
                    </div>
                    <Divider />
                    {/* 菜单 */}
                    <div>
                        {[
                            {
                                icon: 'icon-zuzhi',
                                label: userInfo.department,
                            },
                            {
                                icon: 'icon-user1',
                                label: userInfo.role,
                            },
                        ].map((item) => {
                            return (
                                <div key={item.label} className='IconLabel'>
                                    <IconFont type={item.icon} />
                                    <span>{item.label}</span>
                                </div>
                            )
                        })}
                    </div>
                    <Divider />
                    <footer>
                        <Button onClick={this.resetPassword}>修改密码</Button>
                        <Button onClick={this.logout}>退出登录</Button>
                    </footer>
                </div>
            )
        } else {
            return null
        }
    }

    logout = () => {
        logout().then(async (res) => {
            if (res.code == '200') {
                Cache.clear()
                // 要用这种 不能用下面注释的 否则会请求退出前页面请求的接口，不知道为什么
                if (res.data && res.data.casUrl) {
                    window.location.href = res.data.casUrl
                } else {
                    this.props.history.push('/login')
                }
            }
        })
    }

    resetPassword = () => {
        this.setState({
            resetPasswordDisplay: true,
        })
        // this.props.history.push('/resetPassword')
    }

    secondMenuListItemClick = ({ key }) => {
        this.setState({ secondSelectedKeys: this.urlUnite(key) })
    }

    hidePage = () => {
        this.setState({
            resetPasswordDisplay: false,
        })
    }
    openWelcomePage = () => {
        let initialComplete = Cache.get('userinfo').initialComplete
        if (initialComplete) {
            this.setState({
                current: [],
                collapsed: true,
                selectedMenuKey: 0,
            })
            this.props.history.push('/kpiCharts')
        }
    }

    toggle = async (e) => {
        let { current, menuItemList } = this.state
        this.getParentId(menuItemList, current[0], 1)
        this.setState({
            routeRender: false,
            collapsed: !this.state.collapsed,
        })
        Cache.set('menuCollapsed', !this.state.collapsed)
    }
    onSelectMenu = async (data) => {
        let { menuSelectedInfo, isHovered, current, menuItemTitle, childrenMenu, selectedMenuKey, hoverChildrenMenu } = this.state
        menuItemTitle = data.title
        selectedMenuKey = data.id
        childrenMenu = data.children
        hoverChildrenMenu = data.children
        if (menuSelectedInfo.selectedMenuKey == data.id) {
            return
        }
        const childrenMenyFilter = childrenMenu.filter(this.filterMenuItem)
        current = childrenMenyFilter[0]['children'].length > 0 ? [childrenMenyFilter[0]['children'].filter(this.filterMenuItem)[0]['code']] : [childrenMenyFilter[0]['code']]
        this.setState({
            routeRender: true,
        })

        if (current[0] == '/dc/tech_search') {
            this.addTab('元数据搜索', {}, true)
        } else {
            this.props.history.push({ pathname: current[0], state: {} })
            this.redirect(current[0])
            await this.setState({
                current,
                menuItemTitle,
                selectedMenuKey,
                childrenMenu,
                hoverChildrenMenu,
                collapsed: Cache.get('menuCollapsed') ? Cache.get('menuCollapsed') : false,
                openKeys: [childrenMenyFilter[0]['code']],
            })
            Cache.set('openKeys', [childrenMenyFilter[0]['code']])
            this.saveMenu()
        }
        // 清除缓存
        clearPageSession()
    }
    setTimeout = (data) => {
        setTimeout(this.onEnterMenu(data), 5000)
    }
    onEnterMenu = (data) => {
        let { hoverMenuTitle, hoverChildrenMenu } = this.state
        hoverMenuTitle = data.title
        this.onEnterMenuIntvar = setTimeout(() => {
            this.setState({
                isHovered: true,
                hoverChildrenMenu: [...data.children],
                hoverMenuTitle,
                hoverKey: data.id,
                routeRender: false,
            })
        }, 400)
    }
    onLeaveMenu = () => {
        setTimeout(() => {
            this.setState({
                isHovered: false,
                hoverKey: '',
                routeRender: false,
            })
        }, 300)
    }
    saveMenu = () => {
        const { current } = this.state
        Cache.set('currentMenu', current)
    }
    initMenu = async () => {
        let { menuItemList, current } = this.state
        current = Cache.get('currentMenu') ? Cache.get('currentMenu') : []
        await this.setState({
            current,
        })
        this.getParentId(menuItemList, current[0], 1)
    }
    onOpenChange = (openKeys) => {
        this.setState({
            openKeys: openKeys.length > 1 ? [openKeys[1]] : openKeys,
        })
        Cache.set('openKeys', openKeys.length > 1 ? [openKeys[1]] : openKeys)
    }
    highFunctionClick = async (e) => {
        let { menuItemList, current } = this.state
        current = [e.key]
        await this.setState({
            // current,
            routeRender: true,
            collapsed: Cache.get('menuCollapsed') ? Cache.get('menuCollapsed') : false,
            // openKeys: [e.keyPath[1]]
        })
        let param = {}
        if (e.key == '/sys/collect/logs') {
            param = { area: 'metadata' }
        }
        const menuItem = this.getMenuItem(e.key)
        if (menuItem) {
            const { layout } = menuItem
            if (layout === 'full') {
                this.openNewPage(menuItem, param)
                return
            } else {
                this.props.history.push({ pathname: e.key, state: param })
            }
        } else {
            this.props.history.push({ pathname: e.key, state: param })
        }
        await this.setState({
            current,
            openKeys: [e.keyPath[1]],
        })
        Cache.set('openKeys', [e.keyPath[1]])
        Cache.remove('selectedTagCategory')
        Cache.remove('tabValue')
        Cache.remove('bizRuleGroupId')
        this.getParentId(menuItemList, current[0], 1)
        this.saveMenu()
        this.redirect(e.key)
        // 清除缓存
        clearPageSession()
    }
    getChildrenMenu = async (key) => {
        let { menuItemList, childrenMenu, menuItemTitle, selectedMenuKey } = this.state
        menuItemList.map((item) => {
            if (item.id == key) {
                childrenMenu = item.children
                menuItemTitle = item.title
            }
        })
        await this.setState({
            childrenMenu,
            menuItemTitle,
            selectedMenuKey: key,
        })
    }
    getParentId = (data, url, level) => {
        data.map((item) => {
            if (item.children && item.children.length && level < 3) {
                this.getParentId(item.children, url, level + 1)
            } else {
                if (item.code == url) {
                    this.getChildrenMenu(item.parentMenuId)
                }
            }
        })
    }
    setParentId = (data, id) => {
        data.map((item) => {
            item.parentMenuId = id
            if (item.children && item.children.length) {
                this.setParentId(item.children, id)
            }
        })
        return data
    }
    getMenuDetailList = (data) => {
        data.map((item) => {
            menuDetailList.push(item)
            if (item.children) {
                this.getMenuDetailList(item.children)
            }
        })
    }
    initDetailMenu = async () => {
        menuDetailList = []
        this.getMenuDetailList(tabConfig)
        await this.setState({
            params: Cache.get('routeParam') ? Cache.get('routeParam') : {},
        })
    }
    subMenuRender = (menuData, title) => {
        let { current, openKeys } = this.state
        const maxLevel = 1
        /**
         *
         * @param {any[]} menuList
         * @param {number} level
         * @returns {ItemType}
         */
        const createMenuItems = (menuList, level = 0) => {
            if (!menuList || !menuList.length || level > maxLevel) {
                return undefined
            }

            return menuList.filter(this.filterMenuItem).map((item) => {
                return {
                    key: item.code,
                    label: item.title,
                    children: createMenuItems(item.children, level + 1),
                }
            })
        }

        return (
            <div>
                <div className='subMenuTitle'>{title}</div>
                <div className='subMenuItem HideScroll'>
                    <Menu openKeys={openKeys} items={createMenuItems(menuData)} mode='inline' selectedKeys={current} onOpenChange={this.onOpenChange} onClick={this.highFunctionClick} />
                </div>
            </div>
        )
    }
    addTab = async (comkey, param = {}, openNewTab) => {
        const { currentSelectedKey, current, routeRender, params } = this.state
        let argsRender = {
            needRender: routeRender,
            defRouter: current[0],
            currentSelectedKey: currentSelectedKey,
            chlidrenMenu: [],
            params: params,
            addTab: this.addTab,
        }
        await Cache.set('argsRender', argsRender)
        // 打开新窗口时，不刷新当前页面
        await Cache.set('routeParam', param) // 存储页面传参，刷新时从cache里取
        menuDetailList.map((item) => {
            if (item.name == comkey) {
                if (!openNewTab) {
                    // 是否打开新窗口
                    this.props.history.push({ pathname: item.route, state: param })
                    this.register()
                } else {
                    this.openNewPage(item, param)
                }
            }
        })
    }

    openNewPage(item, param) {
        let paramsStr = '?viewName='
        _.map(param, (v, k) => {
            paramsStr += '&' + k + '=' + v
        })
        window.open(item.route + paramsStr)
    }

    getMenuItem(pathName) {
        const pathname = pathName || this.props.location.pathname
        return menuDetailList.find((item) => item.route === pathname)
    }

    render() {
        const { pathname } = this.props.location
        if (!PermissionManage.hasFuncPermission(pathname) && !this.disabledPermission) {
            return this.render401()
        }

        const menuItem = this.getMenuItem()
        if (menuItem) {
            const { layout } = menuItem
            switch (layout) {
                case 'full':
                    return this.renderFull()
                case 'fullScreen':
                    return this.renderFullScreen()
            }
        }
        return this.renderDefault()
    }

    get disabledPermission() {
        return Cache.get('disabledPermission')
    }

    render401() {
        return this.renderFull(
            <div className='NoPermissionContent'>
                <main>
                    <IconFont type='e6bb' useCss />
                    <h2>抱歉，你的账号暂无权限查看</h2>
                    <p>如有需要，请联系管理员授权</p>
                </main>
            </div>
        )
    }

    renderFullScreen() {
        return (
            <ConfigProvider locale={zhCN}>
                <div className='baseLayout fullScreen'>{this.renderChildren()}</div>
            </ConfigProvider>
        )
    }

    renderFull(children = undefined) {
        const { currentSelectedKey, current } = this.state

        return (
            <ConfigProvider locale={zhCN}>
                <div className='baseLayout'>
                    <Layout className='layoutContent  commonScroll'>
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Header className='PageHeader'>
                                <div onClick={this.openWelcomePage} className='logo HLogo'>
                                    <img src={require(`app_images/baselayout/logo.png`)} />
                                </div>
                                <Breadcrumb addTab={this.addTab} {...this.props} />
                                {this.renderHeaderProfile()}
                            </Header>
                            <div className='pageContent FullPageContent'>{children || this.renderChildren()}</div>
                        </div>
                    </Layout>
                    {this.renderPassword()}
                </div>
            </ConfigProvider>
        )
    }
    changeProfileVisible = (e) => {
        if (!e) {
            this.setState({
                profileVisible: false,
            })
        }
    }
    closeTimer = () => {
        clearTimeout(timer)
    }
    openRenderUserInfo = () => {
        timer = setTimeout(() => {
            this.setState({
                profileVisible: true,
            })
        }, 300)
    }

    renderHeaderProfile() {
        let license = this.userInfo.license ? this.userInfo.license : { remainDays: 0, versionType: 1 }
        let { profileVisible } = this.state
        return (
            <div className='header_profile' key='b'>
                <div
                    className='pull-right'
                    style={{
                        height: '100%',
                        width: license.versionType == 0 ? 191 : 'auto',
                    }}
                >
                    {this.userInfo ? (
                        <Dropdown overlay={this.renderUserInfo()} visible={profileVisible} onVisibleChange={this.changeProfileVisible}>
                            <span className='profileArea' onMouseEnter={this.openRenderUserInfo} onMouseLeave={this.closeTimer}>
                                <img src={icon_user} />
                                <span
                                    style={{
                                        color: '#333',
                                    }}
                                    className='profileName'
                                >
                                    {this.userInfo.english_name ? this.userInfo.english_name : this.userInfo.loginid}
                                </span>
                                <span className={profileVisible ? 'iconfont icon-xiangxia rotateIcon' : 'iconfont icon-xiangxia'}></span>
                            </span>
                        </Dropdown>
                    ) : null}
                </div>
            </div>
        )
    }

    renderPassword() {
        const { resetPasswordDisplay } = this.state
        return resetPasswordDisplay ? (
            <div className='resetPasswordContainer'>
                <ResetPassword history={this.props.history} hidePage={this.hidePage} />
            </div>
        ) : null
    }

    filterMenuItem = (item) => {
        return this.disabledPermission ? true : item.selected
    }

    renderChildren() {
        const { currentSelectedKey, current, routeRender, params } = this.state
        return (
            <div style={{ height: '100%', padding: 15, display: 'flex', flexDirection: 'column', overflow: 'auto' }} id='pageContent'>
                <div id='dropdownContainer' style={{ position: 'relative' }} />
                {this.props.children}
            </div>
        )
    }

    // 如果 url 传入参数 iframe=true，则不显示上部及左边导航栏
    renderDefault() {
        const {
            menuItemList,
            isLeftMenu,
            currentSelectedKey,
            secondMenuList,
            defaultSelectedKeys,
            secondSelectedKeys,
            queryList,

            collapsed,
            current,
            menuItemTitle,
            hoverMenuTitle,
            selectedMenuKey,
            childrenMenu,
            hoverChildrenMenu,
            isHovered,
            hoverKey,
        } = this.state

        let chlidrenMenuKey = secondSelectedKeys.length > 0 ? this.menuSecodeUrlChildren[secondSelectedKeys] || {} : {}

        let pathname = window.location.pathname
        const menuRender = (data) => {
            data.map((item) => {
                if (item.children && item.children.length) {
                    return <Menu.ItemGroup title={item.title}>{menuRender(item.children)}</Menu.ItemGroup>
                } else {
                    return <Menu.Item key={item.code}>{item.title}</Menu.Item>
                }
            })
        }
        return (
            <ConfigProvider locale={zhCN}>
                <Layout className='baseLayout'>
                    <Sider
                        className={collapsed || pathname == '/kpiCharts' ? 'menuSiderMini' : 'menuSider'}
                        style={{
                            position: 'fixed',
                            left: 0,
                            zIndex: 4,
                        }}
                    >
                        <div className='menuContainer'>
                            <div onClick={this.openWelcomePage} className='logo'>
                                <img src={require(`app_images/baselayout/logo.png`)} />
                            </div>
                            <div className='menuContent HideScroll'>
                                <div onMouseLeave={this.onLeaveMenu}>
                                    {menuItemList.filter(this.filterMenuItem).map((item, index) => {
                                        return (
                                            <div
                                                onClick={this.onSelectMenu.bind(this, item)}
                                                onMouseEnter={this.onEnterMenu.bind(this, item)}
                                                onMouseLeave={() => clearTimeout(this.onEnterMenuIntvar)}
                                                style={{
                                                    background: hoverKey == item.id ? 'rgba(14, 24, 58, 0.6)' : '',
                                                }}
                                                className={selectedMenuKey == item.id ? 'menuItemSelected menuItem' : 'menuItem'}
                                                key={item.id}
                                            >
                                                <div className='menuTitle'>
                                                    <div className='menuLogo'>
                                                        {item.columnClass ? (
                                                            <IconFont
                                                                type={selectedMenuKey == item.id ? 'icon-' + item.columnClass + '_cli' : 'icon-' + item.columnClass + '_nor'}
                                                                style={{ fontSize: 24 }}
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className='menuName'>{item.title}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {isHovered ? (
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: '0px',
                                                left: '65px',
                                                float: 'none',
                                                zIndex: '1000',
                                                width: '145px',
                                            }}
                                            className='layoutSubMenuContent'
                                        >
                                            {this.subMenuRender(hoverChildrenMenu, hoverMenuTitle)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        {!collapsed && pathname !== '/kpiCharts' ? <div className='layoutSubMenuContent'>{this.subMenuRender(childrenMenu, menuItemTitle)}</div> : null}
                    </Sider>
                    <Layout className={collapsed || pathname == '/kpiCharts' ? 'layoutContent collapsedContent commonScroll' : 'layoutContent uncollapsedContent commonScroll'}>
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Header style={{ background: '#fff', padding: 0 }}>
                                <Breadcrumb addTab={this.addTab} {...this.props} />
                                {this.renderHeaderProfile()}
                            </Header>
                            <div className='pageContent'>{this.renderChildren()}</div>
                        </div>
                    </Layout>
                    {this.renderPassword()}
                    <div
                        className='trigger'
                        style={{
                            boxShadow: current.length && pathname !== '/kpiCharts' ? '' : 'none',
                        }}
                    >
                        <SvgIcon
                            style={{
                                visibility: current.length && pathname !== '/kpiCharts' ? 'visible' : 'hidden',
                            }}
                            onClick={this.toggle}
                            name={this.state.collapsed ? '展开' : '收起'}
                        />
                    </div>
                </Layout>
            </ConfigProvider>
        )
    }
}
