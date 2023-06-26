import ProjectUtil from '@/utils/ProjectUtil'
import { Spin } from 'antd'
import React, { Component } from 'react'

require('es6-promise').polyfill()

const CACHE = new Map()

export default class Bundle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mod: null,
        }
    }

    componentWillMount() {
        this.load(this.props)
        const defaultTitle = '量之数据运营平台 DOP'
        const { title } = this.props
        ProjectUtil.setDocumentTitle(title)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        // 注意这里，使用Promise对象; mod.default导出默认
        if (props.jsxPath) {
            // 针对tab类页面组件的加载做cache
            const key = props.jsxPath
            // let mod = null
            if (CACHE.has(key)) {
                let mod = CACHE.get(key)
                this.setState({ mod })
            } else {
                props.load().then((res) => {
                    let mod = res.default || res
                    CACHE.set(key, mod.default || mod)
                    this.setState({ mod })
                })
            }
        } else {
            props.load().then((res) => {
                let mod = res.default || res
                this.setState({ mod })
            })
        }
    }

    render() {
        const { mod } = this.state
        const { children } = this.props
        return mod ? children(mod) : <Spin size='large' spinning style={{ marginTop: 100, width: '100%' }} />
    }
}
