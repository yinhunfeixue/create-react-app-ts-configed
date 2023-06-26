import React, { Component } from 'react'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { CloseCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu } from 'antd';
import Cache from 'app_utils/cache'
import './style.less'
import { quickTip } from 'app_api/globalSearchApi'
import CONSTANTS from 'app_constants'

const MenuItem = Menu.Item

export default class KeyboardWizard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            menuItems: [],
            inputValue: this.props.defaultValue || '',
            selectedKeys: [], // menu的active项
        }

        this.selectedKeysIndex = -1 // menuItems数组的下标
        this.getMenus = _.debounce(this.getMenus, CONSTANTS.TIME_OUT)
    }

    setInputValue(inputValue) {
        this.setState({ inputValue })
    }

    // mebu的onClickMenu事件 传过来是key，value的形式，但是handleKeyDown方法里调用的时候传进来的是key，做下区分
    onClickMenu = (key, keyDown) => {
        let thisKey = key.key
        if (keyDown) {
            thisKey = key
        } else {
            this.setState({
                menuItems: [],
                inputValue: thisKey.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
            })
        }

        // 外部组件如果需要选择之后就请求数据，可以用这个方法
        this.props.onChange && this.props.onChange(thisKey.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, ''))
    }

    getMenus(req) {
        // quickTip(req).then((res) => {
        //     if (res.code == 200) {
        //         this.setState({ menuItems: res.data })
        //     }
        // })
    }

    searchInputChange = (e) => {
        e.persist()
        let { value } = e.target
        this.setState({ inputValue: value })
        this.props.onChange && this.props.onChange(value)
        let req = {}
        req.keyword = value.trim()
        // 全局搜索从localStory里拿
        if (this.props.from && this.props.from === 'global') {
            req.area = Cache.get('globalSearchCondition') && Cache.get('globalSearchCondition').area ? Cache.get('globalSearchCondition').area.join(' ') : ''
        } else {
            req.area = this.props.area
        }
        this.getMenus(req)
    }

    // 注意给组件绑定onKeyDown这种方法
    // *****用ReactDOM.findDOMNode找到真实dom 在触发trigger click方法下拉框的选项自动出现*****
    // 38=上键，37=左键 ,40=下键，39=右键 ，13=回车
    handleKeyDown = (e) => {
        let { menuItems } = this.state
        let senderName = ReactDOM.findDOMNode(this.refs.thisMenu)
        if (e.keyCode == 40) {
            // 是否到底了
            if (this.selectedKeysIndex > menuItems.length - 2) {
                this.selectedKeysIndex = -1
                this.selectedKeysIndex++
                $(senderName).scrollTop(0)
            } else {
                this.selectedKeysIndex++
                if (this.selectedKeysIndex > 5) {
                    $(senderName).scrollTop((this.selectedKeysIndex - 5) * 32)
                }
            }

            // 是否找到这一条数据(虽然这块代码和下面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
            if (menuItems[this.selectedKeysIndex]) {
                let thisId = menuItems[this.selectedKeysIndex]
                this.setState({
                    selectedKeys: [thisId]
                }, () => {
                    this.onClickMenu(thisId, true)
                })
            }
        } else if (e.keyCode == 38) {
            // 是否到顶了
            if (this.selectedKeysIndex < 1) {
                this.selectedKeysIndex = menuItems.length
                this.selectedKeysIndex--
            } else {
                this.selectedKeysIndex--
            }
            $(senderName).scrollTop((this.selectedKeysIndex - 5) * 32)

            // 是否找到这一条数据(虽然这块代码和上面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
            if (menuItems[this.selectedKeysIndex]) {
                let thisId = menuItems[this.selectedKeysIndex]
                this.setState({
                    selectedKeys: [thisId]
                }, () => {
                    this.onClickMenu(thisId, true)
                })
            }
        } else if (e.keyCode == 13) {
            // 回车的时候将menuItems置空 （下拉框消失）
            if (this.selectedKeysIndex == -1) {
                this.setState({
                    menuItems: [],
                    inputValue: this.state.inputValue.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, ''),
                }, () => {
                    this.handleSearch()
                    this.props.onChange && this.props.onChange(this.state.inputValue, true)
                })
            } else {
                this.setState({
                    menuItems: [],
                    inputValue: menuItems[this.selectedKeysIndex].replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
                }, () => {
                    this.handleSearch()
                    this.props.onChange && this.props.onChange(this.state.inputValue, true)
                })
            }
        }
    }

    // flag为true 代表刷新 相当于传空值
    handleSearch = (flag) => {
        this.setState({
            menuItems: [],
        })
        if (this.props.handleSearch) {
            if (flag === '刷新') {
                this.setState({
                    inputValue: ''
                })
            }
            this.props.handleSearch(flag === '刷新' ? '' : this.state.inputValue)
        }
    }

    // 同样是调用handleInputChange方法 清空的时候有第二个参数 代表点了清空（差X）否则只是输入框值的改变 点差的时候重新请求
    emitEmpty = () => {
        this.inputRef.focus()
        this.setState({ inputValue: '' })
        if (this.props.handleInputChange) {
            this.props.handleInputChange('', true)
        }
        this.props.onChange('')
    }

    inputClick = () => {
        this.setState({
            menuItems: []
        })
    }

    render() {
        const {
            selectedKeys,
            menuItems,
            inputValue
        } = this.state

        const {
            search,
            reload,
            placeholder,
            style,
            size,
            prefix
        } = this.props

        const suffix = inputValue ? <CloseCircleOutlined onClick={this.emitEmpty} /> : null

        return (
            <span onKeyDown={this.handleKeyDown} className='inputCloseSearchNew'>
                <Dropdown
                    overlay={
                        <Menu onClick={this.onClickMenu} className='searchMenu' ref='thisMenu' selectedKeys={selectedKeys} style={{ minWidth: '200px' }}>
                            {_.map(menuItems, (item, key) => {
                                return (
                                    <MenuItem key={item}>
                                        <span dangerouslySetInnerHTML={{ __html: item }}></span>
                                    </MenuItem>
                                )
                            })}
                        </Menu>
                    }

                    visible={menuItems.length}
                >
                    <span >
                        <span className='ant-input-affix-wrapper' style={style || {}}>
                            <Input
                                size={size || 'default'}
                                placeholder={placeholder || '请输入搜索条件'}
                                prefix={prefix || null}
                                suffix={suffix || <span />}
                                value={inputValue}
                                // onChange={_.debounce(this.searchInputChange.bind(this),300)}
                                onChange={this.searchInputChange}
                                ref={(node) => this.inputRef = node}
                                onPressEnter={this.props.onInputClick}
                                onClick={this.inputClick}
                            />
                            {/* 浏览树和右上角全局搜索有要键盘精灵，单独设置*/}
                            {search ? <SearchOutlined onClick={this.handleSearch} /> : null}
                            {reload ? <ReloadOutlined onClick={this.handleSearch.bind(this, '刷新')} /> : null}
                        </span>
                    </span>
                </Dropdown>
            </span>
        );
    }
}
