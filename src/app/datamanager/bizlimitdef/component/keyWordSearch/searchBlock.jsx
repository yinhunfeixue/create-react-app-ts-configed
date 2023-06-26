import { CloseOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { bizLimitQuickTip, matchBizLimit } from 'app_api/metadataApi'
import { logSuggestion } from 'app_api/wordSearchApi'
import History from 'app_images/kwHistory.svg'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'
import Filter from 'app_images/过滤.svg'
import _, { debounce } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../../store'
import './index.less'

@observer
export default class searchBlock extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listOption: [],
            // 显现下拉框
            visable: false,
            contentvalue: this.props.params.content,
            type: this.props.params.type,
            status: this.props.params.status,
            // 由键盘精灵拿到的额外参数
            lastValue: '',
            // 是否触发识别
            isPot: true,
        }
        this.getKeyWord = debounce(this.getKeyWord, 80)
    }
    // 这个生命周期钩子在以后react升级后可能不在支持, 可以用getDerivedStateFromProps替代
    componentWillReceiveProps = (nextProps, nextState) => {
        if (nextProps.isMerge) {
            this.setState({
                contentvalue: nextProps.params.content,
            })
        }
        this.setState({
            type: nextProps.params.type,
            status: nextProps.params.status,
        })
    }
    componentDidMount() {
        // 监听点击事件，解决下拉框关不掉的问题
        window.addEventListener('click', this.scrollEvent.bind(this))
        // 对输入法进行监听，在中文输入法未结束时不会请求键盘精灵
        this['input'].addEventListener('compositionstart', this.unSearch, false)
        this['input'].addEventListener('compositionend', this.inSearch, false)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.scrollEvent.bind(this))
        this['input'].removeEventListener('compositionstart', this.unSearch, false)
        this['input'].removeEventListener('compositionend', this.inSearch, false)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (_.isEqual(this.state, nextState)) {
            return false
        }

        return true
    }

    // 添加事件监听
    scrollEvent(e) {
        let ev = e || window.event
        const target = ev.target
        if (this.checkList && target !== this.checkList) {
            this.setState({
                visable: false,
            })
        }
    }
    // 输入法情况不触发识别
    unSearch = () => {
        this.setState({
            isPot: false,
        })
    }
    // 触发识别
    inSearch = () => {
        this.setState({
            isPot: true,
        })
        let params = {
            target: {
                innerText: this['input'].innerText,
            },
        }
        this.changeValue(params)
    }
    // 选择框
    checkOption = async (value, params, dataIndex, e) => {
        const { searchItem } = store
        let ev = e || window.event
        // ev.persist()
        let key = this.props.dataIndex
        let currentContent = value
        let arr = [...searchItem]
        let logParams = {
            totalSize: value.length,
            keyword: this['input'].innerText,
            selectIndex: dataIndex,
        }
        // 记录用户选择行为
        let logRes = await logSuggestion(logParams)
        if (logRes.code !== 200) {
            message.error(logRes.msg)
        }
        let currentParams = params
        // 判断是选项插入当前搜索内容还是直接替换
        if ('end' in params && 'start' in params) {
            if (params.end === -1 && params.start === -1) {
                currentParams = arr[key]
                currentContent = this['input'].innerText
                currentParams.content = this['input'].innerText
                if (currentParams.sentenceTagNode) {
                    currentParams.status = 0
                    currentParams.sentenceTagNode[0] = params
                }
            } else {
                let content = currentParams.content
                let str1 = content.substring(0, params.start)
                let str2 = content.substring(params.end, content.length)
                currentContent = str1 + value + str2
                currentParams.content = currentContent
                if (currentParams.sentenceTagNode) {
                    currentParams.sentenceTagNode.push(params)
                }
                this['input'].innerText = currentContent
            }
        }
        this.setState({
            contentvalue: currentContent,
            extraParam: currentParams,
            type: currentParams.type,
            status: currentParams.status,
            visable: false,
        })
        // if (currentParams.status === 0 || currentParams.status === 1) {
        //     delete currentParams.status
        // }
        // 解决本地赋值的怪异问题，提前插入新值
        arr.splice(key, 1, { ...currentParams })
        await store.setSearchItem(arr, true)
        this.props.onEnter(key, { ...currentParams })
        if (ev.target) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
    }
    // 移除部分影响输入事件
    preventEvent = (e) => {
        let ev = e || window.event
        let value = ev.target.innerText
        if (e) {
            e.nativeEvent.stopImmediatePropagation()
            e.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
        if (ev.keyCode === 13) {
            ev.preventDefault()
            if (ev.returnValue) {
                ev.returnValue = false
            }
            return
        }
        if (ev.keyCode === 8 && value.length === 0) {
            let key = this.props.dataIndex
            this.props.deleteBlank(key)
            return
        }
        // 左右键事件去除
        if (e.keyCode === 37 || e.keyCode === 39) {
            return
        }
    }
    // 输入框输入情况
    changeValue = async (e) => {
        const { searchItem } = store
        const { isPot } = this.state
        let ev = e || window.event
        const value = ev.target.innerText
        let key = this.props.dataIndex
        if (ev) {
            if (ev.nativeEvent) {
                ev.nativeEvent.stopImmediatePropagation()
                ev.stopPropagation()
            } else {
                ev.cancelBubble = true
            }

            if (ev.keyCode && ev.keyCode === 13 && value.length === 0) {
                ev.preventDefault()
                return
            }
            if ((ev.keyCode && ev.keyCode === 37) || ev.keyCode === 39) {
                return
            }
            if (ev.keyCode && ev.keyCode === 8 && value.length === 0) {
                let key = this.props.dataIndex
                this.props.deleteBlank(key)
                return
            }
        }

        let logParams = {
            totalSize: 0,
            keyword: this['input'].innerText,
            selectIndex: -1,
        }
        let logRes = await logSuggestion(logParams)
        if (logRes.code !== 200) {
            message.error(logRes.msg)
        }
        // 是否结束了中文输入法
        if (isPot) {
            if (value.length > 0) {
                let originArr = [...searchItem]
                if (originArr[key].status === 3) {
                    originArr.splice(key, 1, { ...originArr[key], content: value })
                } else {
                    originArr.splice(key, 1, { content: value })
                }
                let params = {
                    nodeList: originArr,
                    tempBusinessId: store.tempBusinessId,
                }
                params.businessIds = store.usableBusinessIds
                let res = await matchBizLimit(params)
                if (res.code === 200) {
                    // 是否和之前节点合并
                    let ifCollose = originArr.length !== res.data.length
                    let param = {
                        businessIds: store.usableBusinessIds,
                        nodeList: res.data,
                        currentIndex: key,
                    }
                    store.leftSelected(res.data)
                    var range = window.getSelection()
                    let pos = 0
                    if (range.getRangeAt(0)) {
                        let cursurPosition = range.getRangeAt(0)
                        param.position = cursurPosition.startOffset
                        pos = cursurPosition.endOffset
                    }
                    await store.setSearchItem(res.data, ifCollose)
                    await store.findAmbiguity(res.data)
                    // 判断合并行为， 手动让光标定位到合适的位置
                    if (ifCollose) {
                        // this.setState({
                        //     contentvalue: res.data[key].content
                        // }
                        // , () => {
                        //     this['input'].innerText = res.data[key].content
                        // }
                        // )
                        if (originArr.length < res.data.length) {
                            if (pos >= originArr[key].content.length) {
                                this.props.preFocus(key + 1)
                                param.position = res.data[key + 1].content.length
                            } else {
                                this.props.preFocus(key)
                                param.position = res.data[key].content.length
                            }
                        } else {
                            if (res.data[key] && res.data[key].content.indexOf(value) > -1) {
                                this.props.preFocus(key, pos)
                            } else {
                                param.currentIndex = key - 1
                                this.props.preFocus(key - 1, pos + originArr[key - 1].content.length)
                            }
                        }
                    } else {
                        if (res.data[key] && value !== res.data[key].content) {
                            this.setState(
                                {
                                    contentvalue: res.data[key].content,
                                },
                                () => {
                                    this.props.preFocus(key, pos)
                                }
                            )
                        } else {
                            this.getKeyWord(param)
                        }
                    }
                    if (store.ambiguityList.length === 1 && store.ambiguityList[0].status === 1) {
                        store.clearContent()
                    } else {
                        await store.onSearch(params)
                        this.props.searchAction && this.props.searchAction()
                    }
                    //   this.props.edit(key, { content: value }, true)
                }
            }
        }
        // this.props.hiddenOption(key)
    }

    // 输入框获焦事件
    focusValue = async (e) => {
        const { searchItem } = store
        const { isPot } = this.state
        let arr = [...searchItem]
        let ev = e || window.event
        let value = ev.target.innerText
        let key = this.props.dataIndex
        if (arr[key].status !== 3 && arr[key].status !== 1) {
            if (arr[key].content !== value) {
                arr.splice(key, 1, { content: value })
            }
        } else {
            arr.splice(key, 1, { ...arr[key], content: value })
        }
        // arr.splice(key, 1, { ...arr[key], status: 3 })
        var range = window.getSelection()
        var cursurPosition = range.getRangeAt(0)
        let params = {
            businessIds: store.usableBusinessIds,
            nodeList: arr,
            currentIndex: key,
            position: cursurPosition.startOffset,
        }
        if (isPot) {
            this.getKeyWord(params)
        }
        this.props.hiddenOption(key)
        if (ev.nativeEvent) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
    }

    // 调用键盘精灵
    getKeyWord = async (param) => {
        let params = {
            tempBusinessId: store.tempBusinessId,
            ...param,
        }
        let res = await bizLimitQuickTip(params)
        if (res.code === 200) {
            this.setState({
                listOption: res.data,
                visable: true,
            })
        }
    }
    // 失去焦点事件
    onBlur = (e) => {
        let ev = e || window.event
        let value = ev.target.innerText
        if (this.state.contentvalue === value && value.length > 0) {
            return
        }
        let key = this.props.dataIndex
        if (value.length === 0) {
            this.props.deleteBlank(key, true)
            return
        }
    }

    // 添加新编辑内容
    addNewEdit = (e) => {
        let ev = e || window.event
        this.setState({
            visable: false,
        })
        if (ev.keyCode === 13) {
            this.search()
            ev.preventDefault()
            return
        }
        if (e.keyCode === 8) {
            var range = window.getSelection()
            range.selectAllChildren(this['input'])
            range.collapseToEnd()
            return
        }
        if (e.keyCode === 37 || e.keyCode === 39) {
            return
        }
        if (ev.target) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
        let key = this.props.dataIndex
        this.props.addNewEdit(key)
    }
    // 搜索方法
    search = () => {
        this.props.onSearch()
    }

    // 删除
    delBlock = (e) => {
        let ev = e || window.event
        if (ev.target) {
            ev.preventDefault()
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
        let key = this.props.dataIndex
        this.props.deleteBlank(key, false, true)
    }
    // 关闭选择框
    closeCheckOption = () => {
        this.setState({
            visable: false,
        })
    }

    cancelblank = (e) => {
        let ev = e || window.event
        if (ev.target) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
    }
    prevent = (e) => {
        let ev = e || window.event
        // eslint-disable-next-line brace-style
        if (ev && ev.preventDefault) {
            ev.preventDefault()
        }
        // IE阻止默认事件
        else {
            ev.returnValue = false
        }
    }

    render() {
        const { contentvalue, type, status, visable } = this.state
        const { listOption } = this.state
        return (
            <div contentEditable='false'>
                <div className='kwBlock'>
                    <div
                        onKeyUp={this.changeValue}
                        onKeyDown={this.preventEvent}
                        // onInput={this.changeValue}
                        // onpropertychange={this.changeValue}
                        onFocus={this.focusValue}
                        onBlur={this.onBlur}
                        onClick={this.focusValue}
                        contentEditable='true'
                        style={{ display: 'inline-block' }}
                        className={
                            (status === 0 && type === 1 && 'normal searchBlock') ||
                            (status === 0 && (type === 2 || type === 3) && 'normal1 searchBlock') ||
                            (status === 0 && (type === 4 || 5) && 'normal2 searchBlock') ||
                            (status === 2 && 'unormal1 searchBlock') ||
                            ((status === 1 || status === 3) && 'unormal2 searchBlock') ||
                            'normalIn searchBlock'
                        }
                        ref={(ref) => {
                            this['input'] = ref
                        }}
                        // dangerouslySetInnerHTML={{ _html: contentvalue }}
                    >
                        {contentvalue}
                    </div>
                    <div className='del' onClick={this.delBlock}>
                        <CloseOutlined />
                    </div>
                    <div
                        className='block'
                        contentEditable='true'
                        onClick={this.cancelblank}
                        // onKeyDown={this.addNewEdit}
                        onFocus={this.addNewEdit}
                        style={{ minWidth: '8px', display: 'inline-block' }}
                        ref={(ref) => {
                            this['text'] = ref
                        }}
                    />
                </div>
                <div className='selectList' onMouseDown={this.prevent}>
                    {visable && listOption && listOption.length > 0 && (
                        <div
                            className='blockList'
                            contentEditable={false}
                            ref={(ref) => {
                                this['checkList'] = ref
                            }}
                        >
                            {listOption.map((value, index) => {
                                return (
                                    <div className='blockOpiton' contentEditable='fasle' key={index} value={value} onMouseDown={this.checkOption.bind(this, value.content, value, index)}>
                                        <span className='optionLogo' style={{ position: 'absolute' }}>
                                            {value.isHistory && <img src={History} />}
                                            {!value.isHistory && value.type === 1 && <img src={Measure} />}
                                            {!value.isHistory && value.type === 2 && <img src={Dimension} />}
                                            {!value.isHistory && value.type === 3 && <img src={Date} />}
                                            {!value.isHistory && value.type === 4 && <img src={Filter} />}
                                        </span>
                                        <div style={{ display: 'inline-block', position: 'relative', paddingLeft: '20px' }}>
                                            <span style={{ display: 'block', marginBottom: '-4px', fontSize: '12px' }}>{value.content}</span>

                                            <span style={{ fontSize: '12px', color: '#999', lineHeight: '20px' }}>{value.cnTable}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
