import React, { Component } from 'react'
import { NotificationWrap } from 'app_common'
import { List, Button, Modal, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'underscore'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'
import leftDel from 'app_images/leftDel.svg'
import Filter from 'app_images/过滤.svg'
import modifyOutline from 'app_images/modifyOutline.svg'
import DimensionSelect from '../../columnDetial/Dimension'
import MeasureSelect from '../../columnDetial/Measure'
import DateSelect from '../../columnDetial/Date'
import { getPinboardFilter, filterCreate, filterUpdate, filterDelete } from 'app_api/dashboardApi'
import Warn from 'app_images/warn.png'
import store from '../../store'
import { observer } from 'mobx-react'
@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 原始数据
            dataList: this.props.dataList || [],
            // 默认数组长度
            initList: this.props.dataList || [],
            ifFold: true,
            indexName: '',
            visible: false,
            // 判断是否为添加
            isAdd: true,
            indexType: 1,
            // 度量和时间回显所用值
            firstMark: '大于等于',
            firstValue: '',
            secondMark: '小于等于',
            secondValue: '',
            // 维度回显所用值
            select: [],
            options: [],
            // 度量和时间的最大/最小值
            minValue: '0',
            maxValue: '1',
            // 删除确认框
            deleteVisable: false,
            // 需要删除的id
            deleteId: '',
            isLoading: false
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
    //  是否显示更多，备用
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
            // eslint-disable-next-line react/no-unused-state
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
    addOption = async (item) => {
        this.setState({
            isLoading: true,
            currentId: item.metricsId
        })
        let res = await getPinboardFilter({ pinboardId: store.pinboardId, columnId: item.metricsId })
        switch (item.columnType) {
            case 2: this.setState({ select: res.data.select, options: res.data.values }); break
            case 1:
                this.setState({
                    firstMark: '大于等于',
                    secondMark: '小于等于',
                    firstValue: res.data.interval.firstValue,
                    secondValue: res.data.interval.secondValue,
                    maxValue: res.data.interval.maxValue,
                    minValue: res.data.interval.minValue
                }); break
            case 3:
                this.setState({
                    firstMark: '大于等于',
                    firstValue: null,
                    secondMark: '小于等于',
                    secondValue: null,
                    maxValue: res.data.interval.maxValue,
                    minValue: res.data.interval.minValue
                }); break
        }
        this.setState({
            visible: true,
            isLoading: false,
            indexType: item.columnType,
            indexName: item.cname,
            indexId: item.metricsId,
            businessId: item.businessId,
            isAdd: true
        })
    }
    // 编辑按钮方法
    editOption = async (item) => {
        this.setState({
            isLoading: true,
            currentId: item.metricsId
        })
        let res = await getPinboardFilter({ pinboardId: store.pinboardId, columnId: item.metricsId })
        switch (item.columnType) {
            case 2: this.setState({ select: res.data.select, options: res.data.values }); break
            case 1:
                this.setState({
                    firstMark: res.data.interval.firstMark,
                    firstValue: res.data.interval.firstValue,
                    secondMark: res.data.interval.secondMark,
                    secondValue: res.data.interval.secondValue,
                    maxValue: res.data.interval.maxValue,
                    minValue: res.data.interval.minValue
                }); break
            case 3:
                this.setState({
                    firstMark: res.data.interval.firstMark,
                    firstValue: res.data.interval.firstValue,
                    secondMark: res.data.interval.secondMark,
                    secondValue: res.data.interval.secondValue,
                    maxValue: res.data.interval.maxValue,
                    minValue: res.data.interval.minValue
                }); break
        }
        this.setState({
            visible: true,
            indexType: item.columnType,
            indexName: item.cname,
            indexId: item.metricsId,
            isAdd: false,
            businessId: item.businessId,
            isLoading: false
        })
    }
    // 关闭弹窗
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    // 添加新过滤组件
    addNewFilter = async (params) => {
        let param = { pinboardId: store.pinboardId, businessId: this.state.businessId, ...params }
        let res = await filterCreate(param)
        if (res.code === 200) {
            this.setState({
                visible: false
            })
            store.getData(store.pinboardId)
        }
    }
    // 编辑过滤组件
    updateFilter = async (params) => {
        let param = { pinboardId: store.pinboardId, businessId: this.state.businessId, ...params }
        let res = await filterUpdate(param)
        if (res.code === 200) {
            this.setState({
                visible: false
            })
            store.getData(store.pinboardId)
        }
    }
    // 删除过滤组件
    delOption = async (id) => {
        let res = await filterDelete({ pinboardId: store.pinboardId, columnId: id })
        if (res.code === 200) {
            message.success('删除成功')
            store.getData(store.pinboardId)
            this.setState({
                deleteVisable: false
            })
        } else {
            NotificationWrap.warning(res.msg)
        }
        // this.setState({
        //     deleteId: id,
        //     deleteVisable: true
        // })
    }
    // 确认删除
    onDelete = async () => {
        let res = await filterDelete({ pinboardId: store.pinboardId, columnId: this.state.deleteId })
        if (res.code === 200) {
            message.success('删除成功')
            store.getData(store.pinboardId)
            this.setState({
                deleteVisable: false
            })
        } else {
            NotificationWrap.warning(res.msg)
        }
    }

    // 取消删除
    cancelDel = () => {
        this.setState({
            deleteVisable: false
        })
    }

    render() {
        const { topic, dataLentgh } = this.props
        const { leftSelectId } = store
        const {
            dataList, ifFold, initList, indexId,
            isAdd, isLoading, currentId,
            indexName, visible, indexType, deleteVisable,
            options, select,
            maxValue, minValue,
            firstMark, firstValue, secondMark, secondValue
        } = this.state
        return (
            <div>
                <List
                    header={<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{topic}</div>}
                    dataSource={dataList}
                    renderItem={(item) => (
                        <List.Item
                            className='listItem'
                            style={{
                                // marginLeft: '15px',
                                border: 'none',
                                overflowWrap: 'break-word',
                                paddingBottom: 0,
                                paddingTop: 0
                            }}
                        >
                            <div className='itemType'>
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
                                dangerouslySetInnerHTML={{ __html: item.cname || item.ename }}
                            >
                            </span>
                            {
                                leftSelectId.slice().indexOf(item.metricsId) > -1
                                    ? <div className='statusArr'>
                                        <div className='itemStatus1' onClick={this.editOption.bind(this, item)}>
                                            {
                                                (isLoading && currentId === item.metricsId)
                                                    ? <LoadingOutlined style={{ fontSize: 16 }}/>
                                                    : <img src={modifyOutline} />
                                            }
                                        </div>
                                        <div className='itemStatus2' onClick={this.delOption.bind(this, item.metricsId)}><img src={leftDel} /></div>
                                    </div>
                                    : <div className='statusArr'>
                                        <div className='itemStatus'>
                                            {
                                                isLoading && currentId === item.metricsId
                                                    ? <LoadingOutlined style={{ fontSize: 16 }}/>
                                                    : <img src={Filter} onClick={this.addOption.bind(this, item)} />
                                            }
                                        </div>
                                    </div>
                            }
                        </List.Item>
                    )}
                />
                <div style={{ paddingTop: '10px', fontSize: '12px' }}>
                    {initList.length > dataLentgh ? ifFold ? <a onClick={this.unFold}>+展示更多</a> : <a onClick={this.onFold}>-收起</a> : null}
                </div>
                <Modal
                    title={indexName}
                    visible={visible}
                    style={{ width: '496px' }}
                    bodyStyle={{ padding: '24px 0' }}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {
                        indexType === 2 &&
                        <DimensionSelect
                            indexName={indexName}
                            extraName='left'
                            isAdd={isAdd}
                            addNewFilter={this.addNewFilter}
                            updateFilter={this.updateFilter}
                            indexId={indexId}
                            pinboardId={store.pinboardId}
                            onCancel={this.handleCancel}
                            options={options}
                            select={select}
                        />
                    }
                    {
                        indexType === 1 &&
                        <MeasureSelect
                            indexName={indexName}
                            isAdd={isAdd}
                            addNewFilter={this.addNewFilter}
                            updateFilter={this.updateFilter}
                            indexId={indexId}
                            onCancel={this.handleCancel}
                            maxValue={maxValue}
                            minValue={minValue}
                            firstMark={firstMark}
                            firstValue={firstValue}
                            secondMark={secondMark}
                            secondValue={secondValue}
                        />
                    }
                    {
                        indexType === 3 &&
                        <DateSelect
                            indexName={indexName}
                            isAdd={isAdd}
                            addNewFilter={this.addNewFilter}
                            updateFilter={this.updateFilter}
                            indexId={indexId}
                            onCancel={this.handleCancel}
                            maxValue={maxValue}
                            minValue={minValue}
                            firstMark={firstMark}
                            firstValue={firstValue}
                            secondMark={secondMark}
                            secondValue={secondValue}
                        />
                    }
                </Modal>
                <Modal
                    title='提示'
                    visible={deleteVisable}
                    footer={null}
                    onCancel={this.cancelDel}
                >
                    <div style={{ textAlign: 'center', height: '40px', lineHeight: '24px' }}><img src={Warn} style={{ marginRight: '10px' }} />您是否要删除该过滤组件</div>
                    <div style={{ textAlign: 'right' }}><Button onClick={this.cancelDel} style={{ marginRight: '20px' }}>取消</Button><Button type='primary' onClick={this.onDelete}>确定</Button></div>
                </Modal>
            </div>
        )
    }
}
