import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Button, Spin, Select } from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import _ from 'underscore'
// import { getMetrics, leftQuickTip } from 'app_api/wordSearchApi'
import { getMetrics, getMetricsSearch, getQuickTip } from 'app_api/dashboardApi'
import DataList from './dataList'
import './leftContent.less'
import DownArrow from 'app_images/downArrow.svg'
import LeftArrow from 'app_images/leftArrow.svg'
import { observer } from 'mobx-react'
import store from '../../store'

const { Option, OptGroup } = Select

const CollspeWarp = class DataList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
        }
    }

    onFold = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render() {
        const { visible } = this.state
        let blockClass = visible ? 'block' : 'collseBlock'
        return (
            <div className='foldBlock'>
                <div className='foldHeader'>
                    {visible ? <img onClick={this.onFold} className='foldIcon' src={DownArrow} /> : <img onClick={this.onFold} className='foldIcon' src={LeftArrow} />}
                    <span className='foldName'>{this.props.title}</span>
                </div>
                {/* {visible && <div className={blockClass}>{this.props.children}</div>} */}
                <div className={blockClass}>{this.props.children}</div>
            </div>
        )
    }
}

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableList: [],
            indexList: [],
            keyword: '',
            fetching: false
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = () => {
        this.getMetricsList()
    }
    getMetricsList = async () => {
        let res = await getMetrics({
            pinboardId: store.pinboardId
        })
        if (res.code === 200) {
            this.setState({
                tableList: res.data
            })
        } else {
            NotificationWrap.warning(res.msg)
        }
    }

    // 搜索框选择中
    onSearch = async (value) => {
        this.setState({
            fetching: true,
            keyword: value
        })
        let res = await getQuickTip({ keyword: value, pinboardId: store.pinboardId })
        if (res.code === 200) {
            this.setState({
                indexList: res.data,
                fetching: false
            })
        }
        // thisKey.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
    }
    // 下拉框选中
    onSearhIndex = async (value) => {
        let key = value.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
        let res = await getMetricsSearch({ keyword: key, pinboardId: store.pinboardId })
        this.setState({
            keyword: key
        })
        if (res.code === 200) {
            this.setState({
                tableList: res.data
            })
        }
    }
    // 搜索按钮方法
    onSearchMethod = async () => {
        let { keyword } = this.state
        let res = await getMetricsSearch({ keyword: keyword, pinboardId: store.pinboardId })
        if (res.code === 200) {
            this.setState({
                tableList: res.data
            })
        }
    }
    // 清空
    clear = async () => {
        let res = await getMetrics({ pinboardId: store.pinboardId })
        if (res.code === 200) {
            this.setState({
                tableList: res.data
            })
        }
        this.setState({
            keyword: '',
            indexList: []
        })
    }

    render() {
        const { tableList, indexList, keyword, fetching } = this.state
        return (
            <div>
                <div className='keySearch'>
                    <Select
                        style={{ width: 188 }}
                        showSearch
                        // allowClear
                        placeholder='查找指标'
                        filterOption={false}
                        onSelect={this.onSearhIndex}
                        onSearch={this.onSearch}
                        value={keyword}
                        notFoundContent={fetching ? <Spin size='small' /> : null}
                    >
                        {
                            indexList.map((value, index) => {
                                return <Option key={index} value={value}><span dangerouslySetInnerHTML={{ __html: value }}></span></Option>
                            })
                        }
                    </Select>
                    {/* 重置搜索条件*/}
                    <Button type='' icon={<SyncOutlined/>} onClick={this.clear} className='buttonupdate' />
                    <Button type='primary' icon={<SearchOutlined/>} onClick={this.onSearchMethod} style={{ height: '29px', display: 'inline-block', position: 'absolute', right: '0px' }} />
                </div>
                {
                    tableList && tableList.length > 0
                        ? <div>{tableList.map((value, index) => {
                            return (
                                <CollspeWarp title={value.cname} key={index}>
                                    <div className='leftList'>
                                        {
                                            value.children.map((value1, index1) => {
                                                return <DataList key={index1} topic={value1.cname} initList={value1.metrics} pinboardId={this.props.dataId} dataLentgh={2000} />
                                            })
                                        }
                                    </div>
                                </CollspeWarp>
                            )
                        })}
                          </div>
                        : null
                }
            </div>
        )
    }
}
