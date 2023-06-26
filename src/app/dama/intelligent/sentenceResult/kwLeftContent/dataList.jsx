import React, { Component } from 'react'
import { List, Popover } from 'antd'
import _ from 'underscore'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'

import '../../intelligent.less'

export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 原始数据
            dataList: this.props.dataList || [],
            // 默认数组长度
            initList: this.props.dataList || [],
            ifFold: true
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        this.onFold()
    }
    componentWillReceiveProps = (nextState) => {
        if (nextState.initList !== this.state.initList) {
            this.onFold(nextState)
        }
    }

    unFold = () => {
        this.setState({
            dataList: this.props.initList,
            ifFold: false
        })
    }
    onFold = (nextState) => {
        let { initList, dataLentgh } = this.props
        if (nextState && nextState.initList) {
            initList = nextState.initList
        }
        let dataList = initList.slice(0, dataLentgh)
        this.setState({
            dataList,
            ifFold: true,
            dataLentgh,
            initList
        })
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
        const { topic, dataLentgh } = this.props
        const { dataList, ifFold, initList } = this.state
        return (
            <div className='leftList'>
                <List
                    header={<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{topic}</div>}
                    dataSource={dataList}
                    renderItem={(item) => (
                        <List.Item
                            className='listItem listItem1'
                            style={{
                                // marginLeft: '15px',
                                border: 'none',
                                overflowWrap: 'break-word',
                                paddingBottom: 0,
                                paddingTop: 0
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
                                                return <p style={{ marginBottom: '10px', width: '100%', wordBreak: 'break-word', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} key={index}><span dangerouslySetInnerHTML={{ __html: value }}></span></p>
                                            })}
                                        </p>
                                    </div>
                                )
                            } trigger='hover'
                            >
                                <div className='itemType' style={{ marginLeft: '28px' }}>
                                    {item.columnType === 1 && <img src={Measure} />}
                                    {item.columnType === 2 && <img src={Dimension} />}
                                    {item.columnType === 3 && <img src={Date} />}
                                </div>
                                <span
                                    className='itemText'
                                    style={{
                                        maxWidth: '105px',
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
                <div style={{ paddingTop: '10px', fontSize: '12px' }}>
                    { initList.length > dataLentgh ? ifFold ? <a onClick={this.unFold}>+展示更多</a> : <a onClick={this.onFold}>-收起</a> : null }
                </div>
            </div>
        )
    }
}
