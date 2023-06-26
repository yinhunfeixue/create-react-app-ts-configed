import { CheckOutlined } from '@ant-design/icons'
import { Button, List } from 'antd'
import React, { Component } from 'react'

export default class strSplitSelect extends Component {
    //构造函数
    constructor(props) {
        super(props)

        this.state = {
            // 定义drawList
            drawList: [],
            //list是否展开
            wetherExpendList: undefined
        }

        //定义一个全局对象用于存放要传递过去的序列号
        this.currentSeries = []
        //为了实现高亮定义一个数组存放加了active后的属性中间表
        this.newDataList = []
        this.prevCustomSelectData = {}
    }
    //数组去重
    select(arr) {
        let json = {}
        let arr2 = []
        for (let i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                json[arr[i]] = true
                arr2.push(arr[i])
            }
        }
        return arr2
    }
    //获取到截取数组对应的下标
    getIndexArray() {
        //定义一个数组存放索引
        let indexArray = []
        indexArray.push(0)
        this.props.termdata.map((item) => {
            indexArray.push(item.begIndex)
            indexArray.push(item.endIndex)
        })
        indexArray.push(this.props.queryNodes.length)
        let newArr = this.select(indexArray)
        return newArr
    }

    //构造要渲染的数据结构
    getListData() {
        let curDataList = []
        for (let i = 0; i < this.getIndexArray().length - 1; i++) {
            let obj = {}
            let Nodes = []
            let nodeStr = ""
            let seriesId = ""
            Nodes = this.props.queryNodes.slice(this.getIndexArray()[i], this.getIndexArray()[i + 1])
            obj.begIndex = this.getIndexArray()[i]
            obj.endIndex = this.getIndexArray()[i + 1]
            Nodes.map((item) => {
                nodeStr += item.node
                seriesId += item.serializeNode
            })
            obj.nodeStr = nodeStr
            obj.serializeNode = seriesId
            curDataList.push(obj)
        }
        return curDataList
    }

    //构造渲染组件的数据
    getDrawList() {
        this.getListData().map((itemP) => {
            let objj = {}
            let curList = []
            let result = this.props.termdata.some((item) => {
                if (item.begIndex == itemP.begIndex) {
                    curList = item.compose
                    objj.oldStr = itemP.nodeStr
                    objj.oldSerializeNode = itemP.serializeNode
                    objj.begIndex = item.begIndex.toString()
                    objj.endIndex = item.endIndex.toString()
                }
                return (itemP.begIndex == item.begIndex)
            })
            if (result == true) {
                let i = 0
                curList.map((it) => {
                    let obj = it //浅拷贝，两个对象指向同一个地址
                    if (i == 0) {
                        obj.active = true
                        i++
                    } else {
                        obj.active = false
                    }
                    // let obj = it 浅拷贝，两个对象指向同一个地址
                    // if (it.node === aaa) {
                    //     obj.active = true
                    // } else {
                    //     obj.active = false
                    // }
                })
                objj.List = curList
                this.newDataList.push(objj)
            } else {
                this.newDataList.push(itemP.nodeStr)
            }
        })

        //同时初始化传递给后端的数据
        this.newDataList.map((itemP) => {
            if ((typeof itemP) == 'string') {} else if (itemP.List.length > 0) {
                let obj = {}
                obj.begIndex = itemP.begIndex
                obj.endIndex = itemP.endIndex
                itemP.List.map((item) => {
                    if (item.active == true) {
                        obj.serializeNode = item.serializeNode
                    } else {}
                })
                this.currentSeries.push(obj)
            }
        })
        this.setState({drawList: this.newDataList, wetherExpendList: false})
    }

    componentDidMount() {
        this.getDrawList()
    }

    //改变序列码
    onUpdateSelectChange(value) {
        let arry = value.split('-')
        let obj = {}
        if (this.currentSeries.length == 0) {
            obj.begIndex = arry[2].toString()
            obj.endIndex = arry[3].toString()
            obj.serializeNode = arry[0]
            this.currentSeries.push(obj)
        } else {
            this.currentSeries.map((item) => {
                if (item.begIndex == arry[2]) {
                    item.serializeNode = arry[0]
                }
            })
        }
        //高亮
        this.newDataList.map((itemP) => {
            if ((typeof itemP) == 'string') {} else {
                //改变高亮:
                if (itemP.oldSerializeNode == arry[1]) {
                    itemP.List.map((itemS) => {
                        if (itemS.serializeNode == arry[0]) {
                            itemS.active = true
                        } else {
                            itemS.active = false
                        }
                    })
                }

            }
        })
        this.setState({drawList: this.newDataList})
    }

    //查询接口
    onQuery = () => {
        let obj = ""
        this.newDataList.map((itemP) => {
            if ((typeof itemP) == 'string') {
                obj += itemP
            } else {
                itemP.List.map((itemS) => {
                    if (itemS.active) {
                        obj += itemS.node
                    } else {}
                })
            }
        })
        if (this.currentSeries.length != 0) {
            this.props.onQuery(this.currentSeries, obj)
        }
    }

    // 点击展开 改变展开状态
    expendList = () => {
        this.setState({
            wetherExpendList: !this.state.wetherExpendList
        }, () => {
            this.props.resetAddBtnPosition()
        })
    }

    render() {
        const buttonTop = (this.props.maxSeletHeight - 30) / 2 + "px"
        const spanHeight = this.props.maxSeletHeight + "px"

        const {drawList,wetherExpendList} = this.state

        return (<div className="split-select-content">
            {
                //  2、获取到替换的字段并处理如果不存在替换则返回字段，否则返回list
                drawList.map((itemP) => {
                    if ((typeof itemP) == 'string') {
                        return (<span className="pull-left" style={{
                                lineHeight: "30px"
                            }}>
                            {itemP}
                        </span>)
                    } else {
                        if (itemP.List.length > 0) {
                            return (<span className={wetherExpendList?"result-select":"result-select-false"} style={{
                                    height: wetherExpendList?spanHeight:"30px",
                                    borderRadius:'3PX'
                                }}>
                                <List dataSource={itemP.List} renderItem={(itemS) => {
                                        return (<List.Item className={itemS.active
                                                ? "result-select-li-active"
                                                : "result-select-li"} onClick={this.onUpdateSelectChange.bind(this, `${itemS.serializeNode}-${itemP.oldSerializeNode}-${itemP.begIndex}-${itemP.endIndex}`)}>
                                            {itemS.node}
                                        </List.Item>)
                                    }}/>
                            </span>)
                        } else {
                            return (<span className="pull-left" style={{
                                    lineHeight: "30px",
                                    color: "red"
                                }}>
                                {itemP.oldStr}
                            </span>)
                        }
                    }
                })
            }
            <span className="pull-left">
                <Button onClick={this.expendList} className="reselt-button">{wetherExpendList?"收起":"展开"}</Button>
                <Button onClick={this.onQuery} className="reselt-button">
                <CheckOutlined />
                </Button>

            </span>

        </div>)
    }
}
