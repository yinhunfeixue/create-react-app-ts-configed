import { Breadcrumb } from 'antd'
import tabConfig from 'app_config'
import Cache from 'app_utils/cache'
import React, { Component, useEffect } from 'react'
import './index.less'
import { useParams, useNavigate } from 'react-router-dom';

function widthRouter(Child) {
    return props => {
        const params = useParams();
        return <Child {...props} locationParams={params} />
    }
}

class BreadCrumb extends Component {
    constructor(props) {
        super(props)
        this.state = {
            path: [],
            pathname: '',
        }
    }
    componentDidMount = () => {
    }

    getPath = (menuList, pathname, params) => {
        let temppath = []
        const that = this;
        try {
            function getNodePath(node) {
                temppath.push(node)
                //找到符合条件的节点，通过throw终止掉递归
                if (that.replaceRouteId(node.route) === pathname) {
                    node.params = params
                    throw new Error('GOT IT!')
                }
                if (node.children && node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        getNodePath(node.children[i])
                    }
                    //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                    temppath.pop()
                } else {
                    //找到叶子节点时，删除路径当中的该叶子节点
                    temppath.pop()
                }
            }
            for (let i = 0; i < menuList.length; i++) {
                getNodePath(menuList[i])
            }
        } catch (e) {
            return temppath
        }
    }
    replaceRouteId = (route) => {
        if(!route.includes(':')) return route;
        const params = this.props.locationParams;
        Object.keys(params).forEach(v => {
            route = route.replace(`:${v}`, params[v])
        })
        return route;
    }
    render() {
        // const {
        //     path,
        //     pathname
        // } = this.state
        let pathname = this.props.location.pathname
        let params = this.props.location.state
        let menuList = Cache.get('breadCrumbPath') !== undefined && Cache.get('breadCrumbPath') ? Cache.get('breadCrumbPath') : tabConfig
        let path = this.getPath(menuList, pathname, params)
        // this.setState({
        //     path,
        //     pathname
        // })
        Cache.set('breadCrumbPath', menuList)
        return (
            <div className='Breadcrumb-container'>
                <Breadcrumb separator={<span className='iconfont icon-you' style={{ fontSize: 14 }}></span>}>
                    {path &&
                        path.map((item) =>
                            item.name === '首页' ? (
                                <Breadcrumb.Item key={item.route}>
                                    <span>{item.name}</span>
                                </Breadcrumb.Item>
                            ) : (
                                <Breadcrumb.Item key={item.route}>
                                    {pathname == this.replaceRouteId(item.route) ? (
                                        <span>{item.title || item.name}</span>
                                    ) : (
                                        <span className='BreadcrumbLink' onClick={() => {
                                            Cache.remove('selectedTagCategory')
                                            Cache.remove('tabValue')
                                            this.props.addTab(item.name, { ...item.params })
                                        }}>
                                            {item.title || item.name}
                                        </span>
                                    )}
                                </Breadcrumb.Item>
                            )
                        )}
                </Breadcrumb>
            </div>
        )
    }
}

export default widthRouter(BreadCrumb)
