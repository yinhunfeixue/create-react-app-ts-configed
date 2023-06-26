import React, { Component } from 'react'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { Dropdown, Input, Menu, Icon } from 'antd'
import { Select, Spin } from 'antd'
// import debounce from 'lodash/debounce'
import { queryInstance } from 'app_api/intelligentApi'
// import { height } from 'window-size'
// import { CacheService } from 'app_utils/cache'
import './style.less'
import HistoryQuery from '../historyQuery'

const { Option, OptGroup } = Select
const MenuItem = Menu.Item

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default class IntelligentSelect extends Component {
    constructor(props) {
        super(props)
        this.lastFetchId = 0
        // this.fetchUser = debounce(this.fetchUser, 800)

        this.state = {
            menuItems: [],
            inputValue: this.props.defaultValue || '',
            selectedKeys: [], // menu的active项
            data: [],
            value: [],
            // fetching: false,
            matchQuerys: [],
            visible: false,
            suggestLeftX: 0,
            handleFocusRun: true
        }
        this.onClickMenu = this.onClickMenu.bind(this)
        this.searchInputChange = this.searchInputChange.bind(this)
        this.queryStrings = []
        this.menuList = {}
        this.lastQueryString = ''
        this.selectedKeysIndex = -1// menuItems数组的下标
        this.historyQueryList = []
        this.inputWidth = 600
    }

    componentDidMount = () => {
        this.init()
        // input.
        // input.focus()
    }

    init = () => {
        this.inputFocus()
        //
    }

    inputFocus = () => {
        this.suggestInput.focus()
    }

    setInputValue(inputValue) {
        this.setState({ inputValue })
    }

    // mebu的onClickMenu事件 传过来是key，value的形式，但是handleKeyDown方法里调用的时候传进来的是key，做下区分
    onClickMenu(key, keyDown = false) {
        // console.log(key, keyDown, '------------------key, keyDownkey, keyDown')
        let thisKey = key.key
        if (keyDown) {
            thisKey = key
        }
        let queryStrings = [...this.queryStrings]
        let regx = /history\_/

        if (regx.test(thisKey)) {
            // 历史问句
            let keyIndexArr = thisKey.split('_')
            queryStrings.pop()
            queryStrings.push(this.state.matchQuerys[keyIndexArr[1]])
        } else {
            let menuValue = this.menuList[thisKey]
            let { cname } = menuValue
            queryStrings.pop()
            // let { replace_origin, cn_name } = menuValue
            // let originString = queryStrings.pop()
            // let replaced = originString
            // if (replace_origin) {
            //     let array = originString.split(replace_origin)
            //     let tail = array.pop()
            //     replaced = `${array.join(replace_origin)}${cn_name}${tail}`
            // }
            queryStrings.push(cname)
        }
        let inputValue = `${queryStrings.join('，')}`
        this.setState({ inputValue }, () => {
            // this.inputFocus()
        })
        // this.props.onChange(inputValue)

        if (!keyDown) {
            this.setState({
                menuItems: [],
                matchQuerys: [],
                // visible: false
            })
        }
    }

    getMenus(queryString) {
        this.historyQueryMatch(queryString, this.props.businessId)
        if ((!queryString.endsWith(' ')) && !_.isEmpty(queryString)) {
            let businessIds = ''
            if (this.props.businessIds.length) {
                businessIds = this.props.businessIds.join(',')
            }
            queryInstance({ q: queryString, businessIds: businessIds, tempBusinessId: this.props.tempBusinessId }).then((res) => {
                if (res.code == 200) {
                    _.map(res.data, (item) => {
                        this.menuList[item.id] = { ...item }
                    })
                    this.setState({ menuItems: res.data })
                }
            })
        } else {
            this.setState({
                menuItems: [],
            })
        }
    }

    // 历史问句匹配,返回最多5条匹配的字符串
    historyQueryMatch = (query, type) => {
        let matchQuerys = HistoryQuery.match(query, type)
        this.setState({
            matchQuerys,
            //   visible: true
        })
    }

    searchInputChange(e) {
        // console.log(e.target.getBoundingClientRect, 'e.target.getBoundingClientRect(------------')
        let { value } = e.target

        this.inputWidth = e.target.getBoundingClientRect().width
        // let iLeft = e.target.getBoundingClientRect().left
        // iLeft = $('#suggestInputId').offsetLeft
        console.log(value, '----searchInputChange')

        this.setState({ inputValue: value })
        // this.props.onChange(value)
        let queryStringArray = $.trim(value).split('，')
        let queryString = queryStringArray[queryStringArray.length - 1]
        this.queryStrings = [...queryStringArray]

        this.getMenus(queryString)
    }
 
    // 注意给组件绑定onKeyDown这种方法
    // *****用ReactDOM.findDOMNode找到真实dom 在触发trigger click方法下拉框的选项自动出现*****
    // 38=上键，37=左键 ,40=下键，39=右键 ，13=回车
    handleKeyDown = (e) => {
        // console.log(e, e.keyCode, '-----handleKeyDownhandleKeyDown.handleKeyDown----')
        let { menuItems, matchQuerys } = this.state
        let senderName = ReactDOM.findDOMNode(this.thisMenu)
        let optionLength = matchQuerys.length + menuItems.length
        // console.log(optionLength, '----optionLengthoptionLength-')
        // $(senderName).scrollTop(10)
        // this.thisMenu.focus()
        if (e.keyCode == 40) {
            // 按往下键， 是否到底了
            if (this.selectedKeysIndex > optionLength - 2) {
                this.selectedKeysIndex = -1
                this.selectedKeysIndex++
                $(senderName).scrollTop(0)
            } else {
                this.selectedKeysIndex++
                if (this.selectedKeysIndex > 5) {
                    $(senderName).scrollTop((this.selectedKeysIndex - 5) * 32)
                }
            }
            console.log(this.selectedKeysIndex, '-----向下键')
            if (this.selectedKeysIndex >= matchQuerys.length || matchQuerys.length === 0) {
                // 是否找到这一条数据(虽然这块代码和下面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
                if (menuItems[this.selectedKeysIndex - matchQuerys.length]) {
                    let thisId = menuItems[this.selectedKeysIndex - matchQuerys.length].id
                    this.setState({
                        selectedKeys: [thisId]
                    }, () => {
                        this.onClickMenu(thisId, true)
                    })
                }
            } else {
                // 是否找到这一条数据(虽然这块代码和下面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
                if (matchQuerys[this.selectedKeysIndex]) {
                    let thisId = 'history_' + this.selectedKeysIndex
                    this.setState({
                        selectedKeys: [thisId]
                    }, () => {
                        this.onClickMenu(thisId, true)
                    })
                }
            }
        } else if (e.keyCode == 38) {
            // 按往上键 是否到顶了
            if (this.selectedKeysIndex < 1) {
                this.selectedKeysIndex = optionLength
                this.selectedKeysIndex--
            } else {
                this.selectedKeysIndex--
            }

            console.log(this.selectedKeysIndex, '-----向上键')
            // console.log(this.selectedKeysIndex, '------this.selectedKeysIndexthis.selectedKeysIndex')
            $(senderName).scrollTop((this.selectedKeysIndex - 5) * 32)

            // 是否找到这一条数据(虽然这块代码和上面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
            if (this.selectedKeysIndex >= matchQuerys.length || matchQuerys.length === 0) {
                // 是否找到这一条数据(虽然这块代码和下面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
                if (menuItems[this.selectedKeysIndex - matchQuerys.length]) {
                    let thisId = menuItems[this.selectedKeysIndex - matchQuerys.length].id
                    this.setState({
                        selectedKeys: [thisId]
                    }, () => {
                        this.onClickMenu(thisId, true)
                    })
                }
            } else {
                // 是否找到这一条数据(虽然这块代码和下面一样 但是不能拿到if的外面，否则逻辑上有问题！！！！！)
                if (matchQuerys[this.selectedKeysIndex]) {
                    let thisId = 'history_' + this.selectedKeysIndex
                    this.setState({
                        selectedKeys: [thisId]
                    }, () => {
                        this.onClickMenu(thisId, true)
                    })
                }
            }
            // if (menuItems[this.selectedKeysIndex]) {
            //     let thisId = menuItems[this.selectedKeysIndex].id
            //     this.setState({
            //         selectedKeys: [thisId]
            //     }, () => {
            //         this.onClickMenu(thisId, true)
            //     })
            // }
        } else if (e.keyCode == 13) {
            // 回车的时候将menuItems置空 （下拉框消失）
            this.setState({ menuItems: [], matchQuerys: [] })
        }
    }

    handleBlur = async () => {
        // console.log('--------handleBlur=======handleBlur-----')
        await sleep(300)
        this.setState({
            menuItems: [],
            matchQuerys: [],
            // visible: false
        })
    }

    handleClick = (e) => {
        // console.log($('#suggestInputId').offset().left, $('#suggestInputId').offset().right, '----handleClickhandleClick-----')
        this.inputWidth = e.target.getBoundingClientRect().width
        let value = this.state.inputValue
        let queryStringArray = $.trim(value).split('，')
        let queryString = queryStringArray[queryStringArray.length - 1]
        this.queryStrings = [...queryStringArray]
        // if ((!value.endsWith(' ')) && (queryString !== '') && (queryString !== this.lastQueryString)) {

        this.getMenus(queryString)

        // if ((!value.endsWith(' ')) && (queryString !== '')) {
        //     this.lastQueryString = queryString
        //     this.getMenus(queryString)
        // } else {
        //     this.setState({
        //         menuItems: [],
        //         matchQuerys: [],
        //         // visible: false
        //     })
        // }
    }

    handleFocus = (e) => {
        // console.log('----handleFocus-----')
        // let value = this.state.inputValue
        // let queryStringArray = $.trim(value).split('，')
        // let queryString = queryStringArray[queryStringArray.length - 1]
        // this.queryStrings = [...queryStringArray]
        // // if ((!value.endsWith(' ')) && (queryString !== '') && (queryString !== this.lastQueryString)) {
        // if ((!value.endsWith(' ')) && (queryString !== '')) {
        //     this.lastQueryString = queryString
        //     this.getMenus(queryString)
        // } else {
        //     this.setState({
        //         menuItems: [],
        //         matchQuerys: [],
        //         // visible: false
        //     })
        // }
    }

    addKeyWord = () => {
        let regx = /，$/
        if (!regx.test($.trim(this.state.inputValue))) {
            this.setState({
                inputValue: this.state.inputValue + '，'
            }, () => {
                this.inputFocus()
            })
        }
        this.inputFocus()
    }

    getLeftX = () => {
        let inputValue = this.state.inputValue
        if (_.isEmpty(inputValue)) {
            return { leftX: 0, widthX: this.inputWidth }
        } else {
            let queryStringArray = inputValue.split('，')
            queryStringArray.pop()
            let vString = queryStringArray.join('，')
            let suggestLeftX = 20 + parseInt(vString.length) * 10
            let widthX = this.inputWidth - suggestLeftX
            widthX = widthX < 500 ? 500 : widthX
            return { leftX: suggestLeftX, widthX: widthX }
        }
    }

    getKeyWord = () => {
        return this.state.inputValue
    }

    render() {
        const { visible, suggestLeftX, selectedKeys } = this.state
        let { leftX, widthX } = this.getLeftX()
        // console.log(selectedKeys, '--------renderrender----selectedKeys------------')
        return (
            <span
                ref='container'
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
                style={{ display: 'inline-block', width: '100%' }}
            >
                <Dropdown
                    visible={this.state.matchQuerys.length > 0 || this.state.menuItems.length > 0}
                    overlay={
                        <Menu
                            className='intellSelectModel'
                            onClick={this.onClickMenu}
                            ref={(e) => { this.thisMenu = e }}
                            selectedKeys={selectedKeys}
                            style={{
                                left: `${leftX}px`,
                                // left: `${this.state.inputValue.length * 15}px`,
                                width: `${widthX}px`,
                                maxHeight: 200,
                                overflowY: 'auto'
                            }}
                        >
                            {
                                this.state.matchQuerys.length > 0
                                    ? <Menu.ItemGroup key='ItemGroup_1' title='历史问句'>
                                        {_.map(this.state.matchQuerys, (item, index) => {
                                            // let ctot = <span>66666<br />dfsfsffs</span>
                                            if (!_.isEmpty(item)) {
                                                return (
                                                    <MenuItem key={'history_' + index}>
                                                        <svg t='1569492508940' className='icon' style={{ 'verticalAlign': 'text-top' }} viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='5695' width='18' height='18'><path d='M512 272a240 240 0 1 1-240 240 240 240 0 0 1 240-240m0-48a288 288 0 1 0 288 288 288 288 0 0 0-288-288z' fill='#cdcdcd' p-id='5696'></path><path d='M616 528H496v-152a24 24 0 0 0-48 0v176a24 24 0 0 0 24 24h144a24 24 0 0 0 0-48z' fill='#cdcdcd' p-id='5697'></path></svg>
                                                        <span>{item}</span>
                                                    </MenuItem>
                                                )
                                            }
                                        })}
                                      </Menu.ItemGroup> : null
                            }

                            {
                                this.state.menuItems.length > 0
                                    ? <Menu.ItemGroup key='gItemGroup_2' title='相关指标'>
                                        {_.map(this.state.menuItems, (item, index) => {
                                            let showString = item.cnameHL
                                            if (item.parentName) {
                                                showString = showString + '  -' + item.parentName
                                            }
                                            return (
                                                <MenuItem key={item.id}>
                                                    <svg t='1569492949254' style={{ 'verticalAlign': 'text-top' }} className='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='6718' width='18' height='18'><path d='M192 480a256 256 0 1 1 512 0 256 256 0 0 1-512 0m631.776 362.496l-143.2-143.168A318.464 318.464 0 0 0 768 480c0-176.736-143.264-320-320-320S128 303.264 128 480s143.264 320 320 320a318.016 318.016 0 0 0 184.16-58.592l146.336 146.368c12.512 12.48 32.768 12.48 45.28 0 12.48-12.512 12.48-32.768 0-45.28' p-id='6719' fill='#cdcdcd'></path></svg>
                                                    <span dangerouslySetInnerHTML={{ __html: showString }} ></span>

                                                </MenuItem>
                                            )
                                        })}
                                    </Menu.ItemGroup> : null
                            }
                        </Menu>
                    }
                >
                    <Input
                        id='suggestInputId'
                        disabled={this.props.disabled}
                        onChange={this.searchInputChange}
                        onClick={this.handleClick}
                        ref={(e) => { this.suggestInput = e }}
                        //
                        // onFocus={this.handleFocus}
                        value={this.state.inputValue}
                        placeholder='请输入搜索内容...'
                        autoComplete='off'
                        onPressEnter={this.props.onInputClick}
                    />
                </Dropdown>
            </span>
        )
    }
}
