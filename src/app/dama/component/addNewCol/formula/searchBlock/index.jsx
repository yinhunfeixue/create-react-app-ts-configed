import { message } from 'antd'
import { getSuggestion } from 'app_api/addNewColApi'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../../store'
import './index.less'
import SearchBlock from './searchBlock'
@observer
export default class searchBlock extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    // 输入新条件
    onFocus = async (e) => {
        let { searchItem } = store
        // let { searchItem } = this.state
        let arr = [...searchItem]
        let length = arr.length - 1
        if (arr.length > 0 && arr[length].content.length < 1) {
            this['child' + (arr.length - 1)].input.focus()
            this['child' + (arr.length - 1)].focusValue()
        } else {
            this.addNewEdit(length)
        }
        let ev = e || window.event
        if (ev.keyCode == 65 && ev.ctrlKey) {
            ev.preventDefault()
            return
        }
    }
    // 插入新行
    addNewEdit = async (index) => {
        let { searchItem } = store
        // let { searchItem } = this.state
        let arr = [...searchItem]
        arr.splice(index + 1, 0, { content: '' })
        await store.setSearchItem(arr, true)
        if (this['child' + (index + 1)]) {
            this['child' + (index + 1)].input.focus()
            this['child' + (index + 1)].focusValue()
        }
        store.setMouseInf(index + 1, 0)
    }
    // 插入函数/符号
    setItem = async (content, type) => {
        // type == 1 为函数情况
        const { searchItem, nodePos, mousePos, businessId, usingBusinessIds } = store
        let arr = [...searchItem.slice()]
        let pos = 0
        if (!arr[nodePos]) {
            arr.splice(nodePos, 0, { content: '' })
            await store.setSearchItem(arr, true)
        }
        // 插入节点前鼠标在总句式中的位置
        let prePos = 0

        arr.map((value, index) => {
            if (index < nodePos) {
                prePos += value.content.length
            }
        })
        let itemValue1 = arr[nodePos].content ? arr[nodePos].content.substring(0, mousePos) : ''
        let itemValue2 = arr[nodePos].content ? arr[nodePos].content.substring(mousePos, arr[nodePos].content.length) : ''
        let value = ''
        if (type === 1) {
            value = content + '()'
            arr[nodePos].content = itemValue1 + value + itemValue2
            pos = prePos + itemValue1.length + value.length - 1
        } else if (type === 3) {
            value = content
            arr[nodePos].content = itemValue1 + value + itemValue2
            pos = prePos + itemValue1.length + value.length
        } else {
            let re = new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
            let re2 = new RegExp(/^[0-9]+$/)
            let matchArr = ['IF', 'ELSE', 'TRUE', 'FALSE', 'NULL']
            if (!re.test(content) || re2.test(content) || matchArr.findIndex((val) => val === content.toLocaleUpperCase()) > -1) {
                content = '`' + content + '`'
            }
            value = content
            arr[nodePos].content = itemValue1 + value + itemValue2
            pos = prePos + itemValue1.length + value.length
        }

        // let contentPos = 0
        // 整个句子内容
        let contentAll = ''
        // 识别后的node列表
        let currentNodeList = []
        // let key = nodePos
        arr.map((value, index) => {
            contentAll = contentAll + value.content
        })
        let params = {
            businessId: businessId,
            formula: contentAll,
            cursor: pos,
        }
        let currentIndex = 0
        if (store.tempBusinessId && store.tempBusinessId.length > 0 && store.scope === 2) {
            params.tempBusinessId = store.tempBusinessId
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        let res = await getSuggestion(params)
        if (res.code === 200) {
            res.data.tokens.map((value, index) => {
                currentNodeList.push({
                    content: value.text,
                })
            })
            res.data.tokens.some((value, index) => {
                if (pos > value.text.length) {
                    pos = pos - value.text.length
                    currentIndex += 1
                } else {
                    return pos <= value.text.length
                }
            })
            let useBusinessIds = res.data.usedBusinessIds
            if (!(useBusinessIds.toString() === usingBusinessIds.toString())) {
                await store.setUsingBusinessIds(useBusinessIds)
                this.props.getTablelist()
            }
            store.setMouseInf(currentIndex, pos)
            await store.setSearchItem(currentNodeList, true)
            this.cursorPosition(currentIndex, pos)
        }
        // store.setSearchItem(currentNodeList)
        // this.cursorPosition(nodePos, pos)
    }
    /**
     *  删除空行
     *  @param {Number,Boolean,Boolean} [删除位置下标, 对象内容是否为空, 是否获取焦点到上个未删除节点]
     */
    deleteBlank = async (index, isBlank, isFoucus) => {
        let { searchItem } = store
        let arr = [...searchItem]
        console.log(index, isBlank)
        arr.splice(index, 1)
        if (isBlank) {
            if (arr.length < 1) {
                store.setMouseInf(0, 0)
                await store.setSearchItem([], true)
                store.setErrTip('')
            } else {
                store.setMouseInf(index - 1, searchItem[index - 1].content.length)
                await store.setSearchItem(arr, true)
            }
            return
        }
        if (arr.length < 1) {
            let params = {
                nodeList: [{ content: '' }],
            }
            store.setMouseInf(0, 0)
            store.setSearchItem([{ content: '' }], true)
            store.setErrTip('')
            this['child0'].input.focus()
            this['child0'].focusValue()
        } else if (index === 0) {
            let params = {
                nodeList: arr,
            }
            await store.setSearchItem(arr, true)
            this['child0'].input.focus()
            this['child0'].focusValue()
        } else {
            await store.setSearchItem(arr, true)
            store.setMouseInf(index - 1, searchItem[index - 1].content.length)
            this.cursorPosition(index - 1, searchItem[index - 1].content.length)
            // if (!isFoucus) {
            //     var range = window.getSelection()
            //     range.selectAllChildren(this['child' + (index - 1)].input)
            //     range.collapseToEnd()
            // }
        }
    }
    // 光标定位方法
    cursorPosition = (nodePos, pos) => {
        this['child' + nodePos].input.focus()
        this['child' + nodePos].focusValue()
        let selection = window.getSelection()
        let range = selection.getRangeAt(0)
        var textNode = range.startContainer
        range.setStart(textNode, pos)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        store.setMouseInf(nodePos, pos)
    }
    onKeyDown = async (e) => {
        let ev = e || window.event
        console.log(e.keyCode)
        const { searchItem } = store
        if (e.keyCode === 39 || e.keyCode === 37) {
            return false
        }
        if (e.keyCode !== 8) {
            this.onFocus(e)
        }
        if (e.keyCode === 8) {
            let selection = window.getSelection()
            let range = selection.getRangeAt(0)
            if (range.endOffset === searchItem.length && range.startOffset === 0) {
                store.setMouseInf(0, 0)
                await store.setSearchItem([], true)
                this.onFocus()
            }
        }
    }

    closeOtherOption = (dataIndex) => {
        let { searchItem } = store
        searchItem.map((value, index) => {
            if (index !== dataIndex) {
                this['child' + index].closeOption()
            }
        })
    }
    render() {
        const { searchItem, isMerge } = store
        return (
            <div style={{ padding: ' 8px 16px 8px 16px' }}>
                <div
                    className='wordSuggestion kwSearch'
                    contentEditable='true'
                    onKeyDown={this.onKeyDown}
                    // onKeyDown={this.onFocus}
                    onClick={this.onFocus}
                    ref={(refs) => {
                        this.search = refs
                    }}
                    style={{ height: this.props.isHasDefinition ? '136px' : '284px' }}
                >
                    {searchItem.map((value, index) => {
                        return (
                            <SearchBlock
                                ref={(ref) => {
                                    this['child' + index] = ref
                                }}
                                key={index}
                                dataIndex={index}
                                // addNewEdit={this.addNewEdit}
                                deleteBlank={this.deleteBlank}
                                // edit={this.editContent}
                                // onEnter={this.onEnter}
                                // onSearch={this.onSearch}
                                // hiddenOption={this.hiddenOption}
                                // searchAction={this.props.searchAction}
                                // preFocus={this.preFocus}
                                getTablelist={this.props.getTablelist}
                                closeOtherOption={this.closeOtherOption}
                                cursorPosition={this.cursorPosition}
                                isMerge={isMerge}
                                params={value}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}
