import { Menu, message } from 'antd'
import { getSuggestion } from 'app_api/addNewColApi'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../../store'
import './index.less'
const { SubMenu } = Menu
@observer
export default class searchBlock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visable: true,
            listOption: [],
            contentvalue: this.props.params.text || '',
            leftPos: 0,
            isPot: true,
        }
    }
    componentDidMount() {
        window.addEventListener('click', this.scrollEvent.bind(this))
        this['input'].addEventListener('compositionstart', this.unSearch, false)
        this['input'].addEventListener('compositionend', this.inSearch, false)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.scrollEvent.bind(this))
        this['input'].removeEventListener('compositionstart', this.unSearch, false)
        this['input'].removeEventListener('compositionend', this.inSearch, false)
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        if (nextProps.isMerge) {
            this.setState({
                contentvalue: nextProps.params.text,
            })
            this['input'].innerText = nextProps.params.text
        }
        // this.setState({
        //     type: nextProps.params.type,
        //     status: nextProps.params.status,
        // })
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

    changeValue = async (e) => {
        const { searchItem } = store
        const { isPot } = this.state
        let ev = e || window.event
        const value = ev.target.innerText
        let key = this.props.dataIndex
        let originArr = [...searchItem]
        if (ev) {
            if (ev.nativeEvent) {
                ev.nativeEvent.stopImmediatePropagation()
                ev.stopPropagation()
            } else {
                ev.cancelBubble = true
            }

            if (ev.keyCode == 65 && ev.ctrlKey) {
                ev.preventDefault()
                return
            }
            if (ev.ctrlKey) {
                ev.preventDefault()
                return
            }
            if (ev.keyCode && ev.keyCode === 13 && value.length === 0) {
                ev.preventDefault()
                return
            }
            // if (ev.keyCode && ev.keyCode === 37 || ev.keyCode === 39) {
            //     return
            // }
            if (ev.keyCode && ev.keyCode === 8 && value.length === 0) {
                let key = this.props.dataIndex
                this.props.deleteBlank(key)
                return
            }
        }
        var range = window.getSelection()
        let pos = 0
        if (range.getRangeAt(0)) {
            let cursurPosition = range.getRangeAt(0)
            pos = cursurPosition.endOffset
        }
        originArr.splice(key, 1, { text: value })
        store.setMouseInf(key, pos)
        if (isPot) {
            await store.setSearchItem(originArr)
            this.getSuggestionInf()
        }
    }

    // 获取推荐
    getSuggestionInf = async (arr) => {
        this.props.closeOtherOption(this.props.key)
        const { searchItem, businessId, nodePos, mousePos, usingBusinessIds } = store
        // 光标在整个句式的位置
        let contentPos = 0
        // 整个句子内容
        let contentAll = ''
        // 识别后的node列表
        let currentNodeList = []
        let key = nodePos
        let originArr = [...searchItem]
        originArr.map((value, index) => {
            if (index < key) {
                contentPos = contentPos + value.text.length
            }
            contentAll = contentAll + value.text
        })
        // let pos = 0
        // var range = window.getSelection()
        // if (range.getRangeAt(0)) {
        //     let cursurPosition = range.getRangeAt(0)
        //     pos = cursurPosition.endOffset
        // }
        contentPos = contentPos + mousePos
        // let re = new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)
        // console.log(re.test(contentAll), contentAll, contentPos)
        // if (!re.test(contentAll)) {
        //     contentAll = '`' + contentAll + '`'
        // }
        let params = {
            businessId: businessId,
            // formula: contentAll,
            formulaTokens: originArr,
            cursor: contentPos,
        }
        if (store.tempBusinessId && store.tempBusinessId.length && store.tempBusinessId.length > 0 && store.scope === 2) {
            params.tempBusinessId = store.tempBusinessId
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }

        this.closeOption()
        let res = await getSuggestion(params)
        if (res.code === 200) {
            await this.setState({
                visable: true,
                listOption: res.data.candidates,
            })
            if (this.checkList && this.checkList.offsetWidth && this.checkContent && this.checkContent.offsetLeft > 300) {
                this.setState({
                    // leftPos: 441 - this.checkContent.offsetLeft - this.checkList.offsetWidth
                    leftPos: 441 - this.checkList.offsetWidth,
                })
            } else {
                this.setState({
                    leftPos: 0,
                })
            }
            let definition = []
            let posContentLength = contentPos
            let currentIndex = 0
            let endIndex = 0
            // 识别后光标所在位置下标
            res.data &&
                res.data.tokens &&
                res.data.tokens.map((value, index) => {
                    if (posContentLength > value.text.length) {
                        if (endIndex > 0) {
                            return
                        } else {
                            posContentLength = posContentLength - value.text.length
                            currentIndex += 1
                        }
                    } else {
                        endIndex = index
                        return
                    }
                    if (value.type === 'FUNCTION') {
                        let comment = value.comment.replace(/[\n\r]/g, '<br>')
                        definition.push({
                            text: value.text,
                            comment,
                        })
                    }
                })
            if (res.data.tokens && arr.length !== res.data.tokens.length) {
                await store.setSearchItem(res.data.tokens, true)
                this.props.cursorPosition(currentIndex, posContentLength)
            } else {
                store.setSearchItem(res.data.tokens || [])
            }
            let useBusinessIds = res.data.usedBusinessIds
            if (!(useBusinessIds.toString() === usingBusinessIds.toString())) {
                await store.setUsingBusinessIds(useBusinessIds)
                this.props.getTablelist()
            }
            store.setDefinition(definition)
            if (res.data.message) {
                store.setErrTip(res.data.message)
            } else {
                store.setErrTip('')
            }
        } else {
            store.setDefinition([])
            store.setErrTip('')
        }
    }

    // 设置选项
    checkOption = async (value, e) => {
        const { searchItem, businessId, usingBusinessIds } = store
        let ev = e || window.event
        if (ev) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
        let contentAll = ''
        let currentContent = ''
        // 光标定位所需要的内容块
        let posContent = ''
        let selectContent = value.cname
        // 开始替换的节点或者插入的节点
        let tokenStart = value.tokenStart
        let currentStart = 0
        let startNode = 0
        // 结束替换的节点或者插入的节点
        let tokenStop = value.tokenStop
        let currentEnd = 0
        let endNode = 0
        if (tokenStart === tokenStop) {
            let tokenLength = tokenStart
            searchItem.some((value, index) => {
                tokenStart -= value.text.length
                if (tokenStart <= 0) {
                    return true
                } else {
                    startNode += 1
                    endNode += 1
                }
            })
        } else {
            searchItem.some((value, index) => {
                if (currentStart === tokenStart) {
                    startNode = index
                }
                currentStart += value.text.length
                currentEnd += value.text.length
                if (currentEnd === tokenStop) {
                    endNode = index
                    return true
                }
            })
        }
        searchItem.map((value, index) => {
            contentAll = contentAll + value.text
        })
        let str1 = contentAll.substring(0, value.tokenStart)
        let str2 = contentAll.substring(value.tokenStop, contentAll.length)
        let re = new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
        let re2 = new RegExp(/^[0-9]+$/)
        let matchArr = ['IF', 'ELSE', 'TRUE', 'FALSE', 'NULL']
        if (value.candidateType === 2 && (!re.test(selectContent) || re2.test(selectContent) || matchArr.findIndex((val) => val === selectContent.toLocaleUpperCase()) > -1)) {
            selectContent = '`' + selectContent + '`'
        }
        currentContent = str1 + selectContent + str2
        posContent = str1 + selectContent

        if (startNode === endNode) {
            if (value.tokenStart === value.tokenStop) {
                searchItem.splice(startNode + 1, 0, { ...value, text: selectContent })
            } else {
                searchItem.splice(startNode, 1, { ...value, text: selectContent })
            }
        } else {
            searchItem.splice(startNode, endNode - startNode + 1, { ...value, text: selectContent })
        }

        let params = {
            businessId: businessId,
            formula: currentContent,
            formulaTokens: searchItem,
            // cursor: currentContent.length
            // visable: false,
            // contentvalue: currentContent,
        }
        if (store.tempBusinessId && store.tempBusinessId.length > 0 && store.scope === 2) {
            params.tempBusinessId = store.tempBusinessId
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        this.props.closeOtherOption(this.props.key)
        this.closeOption()
        let posContentLength = posContent.length
        let currentIndex = 0
        let res = await getSuggestion(params)
        let currentNodeList = []
        if (res.code === 200) {
            let endIndex = 0
            currentNodeList = res.data.tokens
            res.data.tokens.map((value, index) => {
                // currentNodeList.push({
                //     text: value.text
                // })
                if (posContentLength > value.text.length) {
                    if (endIndex > 0) {
                        return
                    } else {
                        posContentLength = posContentLength - value.text.length
                        currentIndex += 1
                    }
                } else {
                    endIndex = index
                    return
                }
            })
            let useBusinessIds = res.data.usedBusinessIds
            if (!(useBusinessIds.toString() === usingBusinessIds.toString())) {
                await store.setUsingBusinessIds(useBusinessIds)
                this.props.getTablelist()
            }
            await store.setIsMerge(true)
            await store.setSearchItem(currentNodeList, true)
            this.props.cursorPosition(currentIndex, posContentLength)
        }
    }

    // 失去焦点事件
    onBlur = (e) => {
        let ev = e || window.event
        let value = ev.target.innerText
        this.closeOption()
        // if (this.state.contentvalue === value && value.length > 0) {
        //     return
        // }
        let key = this.props.dataIndex
        if (value.length === 0) {
            this.props.deleteBlank(key, true)
            return
        }
    }
    // 输入框获焦事件
    focusValue = async (e) => {
        const { searchItem } = store
        let arr = [...searchItem]
        let ev = e || window.event
        let value = this['input'].innerText
        let key = this.props.dataIndex
        if (ev.nativeEvent) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
        if (ev.returnValue) {
            ev.returnValue = false
        }
        arr.splice(key, 1, { ...arr[key], text: value })
        // arr.splice(key, 1, { ...arr[key], status: 3 })
        ev.preventDefault()

        await store.setSearchItem(arr)

        var range = window.getSelection()
        if (range.getRangeAt(0)) {
            let pos = 0
            let cursurPosition = range.getRangeAt(0)
            pos = cursurPosition.endOffset
            console.log(key, pos, cursurPosition)
            await store.setMouseInf(key, pos)
        }
        this.getSuggestionInf()
    }

    // 移除部分影响输入事件
    preventEvent = (e) => {
        const { searchItem } = store
        let ev = e || window.event
        let value = ev.target.innerText
        let arr = [...searchItem]
        let key = this.props.dataIndex
        console.log(e)
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
        if (ev.keyCode === 8) {
            var range = window.getSelection()
            let pos = 0
            if (range.getRangeAt(0)) {
                let cursurPosition = range.getRangeAt(0)
                pos = cursurPosition.endOffset
            }
            if (pos === 0) {
                if (key !== 0) {
                    this.props.cursorPosition(key - 1, arr[key - 1].text.length)
                }
            }
        }
        // 左右键事件去除
        if (e.keyCode === 37 || e.keyCode === 39) {
            return
        }
    }
    prevent = (e) => {
        let ev = e || window.event
        // eslint-disable-next-line brace-style
        if (ev && ev.preventDefault) {
            ev.preventDefault()
        } else {
            ev.returnValue = false
        }
        if (ev) {
            ev.nativeEvent.stopImmediatePropagation()
            ev.stopPropagation()
        } else {
            ev.cancelBubble = true
        }
    }
    closeOption = () => {
        this.setState({
            visable: false,
        })
    }
    render() {
        const { visable, listOption, contentvalue, leftPos } = this.state
        return (
            <div contentEditable='false' className='searchItem'>
                <div
                    onKeyUp={this.changeValue}
                    onKeyDown={this.preventEvent}
                    // onFocus={this.focusValue}
                    onBlur={this.onBlur}
                    onClick={this.focusValue}
                    contentEditable='true'
                    style={{ display: 'inline-block' }}
                    className='normalIn searchBlock'
                    ref={(ref) => {
                        this['input'] = ref
                    }}
                >
                    {contentvalue}
                </div>
                {visable && listOption && listOption.length > 0 && (
                    <div
                        className='selectList'
                        onMouseDown={this.prevent}
                        ref={(ref) => {
                            this['checkContent'] = ref
                        }}
                    >
                        <div
                            className='blockList'
                            style={{ left: leftPos }}
                            contentEditable={false}
                            ref={(ref) => {
                                this['checkList'] = ref
                            }}
                        >
                            {listOption.map((value, index) => {
                                return (
                                    <div className='blockOpiton' contentEditable='fasle' key={index} value={value} onClick={this.prevent} onMouseDown={this.checkOption.bind(this, value)}>
                                        <div style={{ display: 'inline-block', position: 'relative' }}>
                                            <span style={{ display: 'inline-block', marginBottom: '-4px', fontSize: '12px' }}>{value.cname}</span>
                                            {value.businessName && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#999', lineHeight: '20px' }}>{value.businessName}</span>}
                                            {value.candidateType === 0 && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#999', lineHeight: '20px' }}>{value.pname}</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
