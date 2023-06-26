import React, { Component } from 'react'
import { Button, Drawer, Card, List, Popover } from 'antd'
import _ from 'underscore'
import leftAdd from 'app_images/leftAdd.svg'
import leftDel from 'app_images/leftDel.svg'
import leftSelect from 'app_images/leftSelect.svg'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'
import './leftContent.less'
import { observer } from 'mobx-react'
import store from '../store'

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 原始数据
            dataList: this.props.initList || [],
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        this.unFold()
    }
    componentWillReceiveProps = (nextState) => {
        if (nextState.initList !== this.state.initList) {
            this.unFold(nextState)
        }
    }

    unFold = () => {
        this.setState({
            dataList: this.props.initList,
        })
    }

    addOption = async (name, id, businessId) => {
        const { leftSelectOption, businessIds } = store
        let arr = [...leftSelectOption]
        let usingBusinessIds = store.usingBusinessIds.slice()
        // let ifHas = arr.findIndex((val) => val.id === id)
        // if (ifHas < 0) {
        if (arr.findIndex((val) => val.id === id && val.buinessId === businessId) < 0) {
            arr.push({ content: name, id, businessId })
        }
        // if (usingBusinessIds.findIndex((val) => val === businessId) === -1) {
        // usingBusinessIds.push(businessId)
        // store.setUsingBusinessIds(usingBusinessIds)
        // let params = {
        //     businessIds,
        //     usingBusinessIds
        // }
        // store.getSearchMetricsBusiness(params)
        // }
        await store.setLeftOption(arr)
        this.selectOption()
    }
    // 取消选项
    delOption = async (name, id, businessId) => {
        const { leftSelectOption, usingBusinessIds, businessIds } = store
        let arr = [...leftSelectOption]
        let dataIndex = 0
        arr.map((value, index) => {
            if (value.id === id && value.businessId === businessId) {
                dataIndex = index
            }
        })
        arr.splice(dataIndex, 1)
        await store.delLeftOption(arr, id)
        if (arr.findIndex((val) => val.businessId === businessId) === -1) {
            let dataIndex = usingBusinessIds.findIndex((val) => val === businessId)
            // usingBusinessIds.splice(dataIndex, 1)
            // store.setUsingBusinessIds(usingBusinessIds)
            // let params = {
            //     businessIds,
            //     usingBusinessIds
            // }
            // store.getSearchMetricsBusiness(params)
        }
        this.selectOption()
    }

    // 设置选项
    selectOption = async () => {
        let param = {
            businessIds: store.usableBusinessIds,
            type: store.type,
            nodeList: store.searchItem
        }
        await store.onMatch(param)
        if (store.ambiguityList.length === 1 && store.ambiguityList[0].status === 1) {
            store.clearContent()
            return
        } else {
            param.nodeList = store.searchItem.slice()
            // await store.onSearch(param)
            this.props.searchAction && this.props.searchAction(param)
        }
    }

    getTypeName = (text) => {
        switch (text) {
            case 'integer': return '整数类型'
            case 'string': return '整数类型'
            case 'date': return '文本类型'
            case 'decimal': return '小数类型'
            default: return text
        }
    }

    render() {
        let leftSelectOption = store.leftSelectOption.slice()
        const { dataList } = this.state
        return (
            <div className='leftChildBlock'>
                <List
                    header={this.props.topic || null}
                    dataSource={dataList.slice()}
                    renderItem={(item) => (
                        <List.Item
                            className='listItem'
                            style={{
                                border: 'none',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <Popover placement='rightTop' style={{ padding: '25px' }} content={
                                (
                                    <div style={{ width: '200px' }}>
                                        <p style={{ marginBottom: '10px' }}><span style={{ fontSize: '14px', fontWeight: 500 }}>字段名：</span><span dangerouslySetInnerHTML={{ __html: item.cname }}></span></p>
                                        <p style={{ marginBottom: '10px', width: '100%', wordBreak: 'break-word' }}><span style={{ fontSize: '14px', fontWeight: 500 }}>数据来源：</span><span dangerouslySetInnerHTML={{ __html: item.contextPath }}></span></p>
                                        <p style={{ marginBottom: '20px', width: '100%', wordBreak: 'break-word' }}><span style={{ fontSize: '14px', fontWeight: 500 }}>数据类型：</span><span dangerouslySetInnerHTML={{ __html: this.getTypeName(item.type) }}></span></p>
                                        {/* <p style={{ marginBottom: '20px', width: '100%'}}>别名：<span dangerouslySetInnerHTML={{ __html: item.alias ? item.alias: 无}}></span></p> */}
                                        <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 500 }}>数据示例:</p>
                                        <p>
                                            {item.sample && item.sample.map((value, index) => {
                                                return (
                                                    <p
                                                        style={{
                                                            marginBottom: '10px',
                                                            width: '100%',
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden', textOverflow: 'ellipsis'
                                                        }} key={index}
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: value }}></span>
                                                    </p>
                                                )
                                            })}
                                        </p>
                                    </div>
                                )
                            } trigger='hover'
                            >
                                {
                                    leftSelectOption.findIndex((val) => val.id === item.columnId && val.businessId === item.businessId) > -1
                                        ? <div className='statusArr'>
                                            <div className='itemStatus1'><img src={leftSelect} /></div>
                                            <div className='itemStatus2' onClick={this.delOption.bind(this, item.cname, item.columnId, item.businessId)}><img src={leftDel} /></div>
                                        </div>
                                        : <div className='statusArr'>
                                            <div className='itemStatus'>
                                                <img src={leftAdd} onClick={this.addOption.bind(this, item.cname, item.columnId, item.businessId)} />
                                            </div>
                                        </div>
                                }
                                <div className='itemType'>
                                    {item.columnType === 1 && <img src={Measure} />}
                                    {item.columnType === 2 && <img src={Dimension} />}
                                    {item.columnType === 3 && <img src={Date} />}
                                </div>
                                <span
                                    className='itemText'
                                    style={{
                                        maxWidth: '155px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'top'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: item.cname }}
                                >
                                </span>
                            </Popover>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
