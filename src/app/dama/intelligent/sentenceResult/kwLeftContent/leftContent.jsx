import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Button, Drawer, Card, List, Spin, Select, message, Modal  } from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import _ from 'underscore'
// import { getBusiness, getCommonIndex, getTableList, getTableDetial, searchIndex, getSearchOption } from 'app_api/modelApi'
import { getMetrics, getBusiness, searchMetrics } from 'app_api/intelligentApi'
import { leftQuickTip } from 'app_api/wordSearchApi'

import DataList from './dataList'
import FormulaList from './formulaList'
import AddNewCol from '../../../component/addNewCol'
import '../../intelligent.less'
import './leftContent.less'
import { getFormula, delFormula } from 'app_api/addNewColApi'
import CollspeWarp from 'app_component_main/menuCollspeWarp'
import BusinessDrawer from 'app_page/dama/component/businessDrawer1'

import store from '../store'
import { observer } from 'mobx-react'

const { Option, OptGroup } = Select

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // eslint-disable-next-line react/no-unused-state
            visible: false, // 抽屉开关
            topic: '',
            dataList: [],
            commonList: [],
            type: 0,
            tableList: [],
            indexList: [],
            businessId: this.props.businessId || 0,
            ifRes: false,
            keyword: '',
            fetching: false,
            formulaVisible: false,
            isEdit: false
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        this.initList()
        // this.getOriginList(this.props.businessId, this.props.itemType)
        // this.getDataList()
    }
    // 获取业务线
    // getDataList = async () => {
    //     let res = await getBusiness({ page: 1, page_size: 100, ignoreTypes: 2 })
    //     if (res.code === 200) {
    //         this.setState({
    //             dataList: res.data,
    //         })
    //     }
    // }

    // 切换业务线拿到指标
    initList = async (id, type) => {
        let { businessIds } = store
        businessIds = this.props.businessIds || []
        store.setBusinessIds(businessIds)
        store.getSearchMetricsBusiness({ businessIds })
    }
    // 添加可用数据
    setUsingBusinessId = async (id, type) => {
        let { usingBusinessIds, businessIds, businessIdList } = store
        if (businessIds.slice().findIndex((val) => val === id) < 0) {
            businessIds.unshift(id)
            businessIdList.unshift({ id, type })
            await store.setBusinessIds(businessIds)
            await store.setBusinessIdList(businessIdList)
            let params = {
                businessIds,
                usingBusinessIds
            }
            store.getSearchMetricsBusiness(params)
            this.setState({
                keyword: '',
                indexList: []
            }, () => {
                this.props.getSearchViewList && this.props.getSearchViewList()
            })
        }
    }
    // 删除已用数据
    delUsingBusinessId = async (id, type) => {
        let { usingBusinessIds, businessIds, businessIdList } = store
        let index = businessIds.slice().findIndex((val) => val === id)
        businessIds.splice(index, 1)
        await store.setBusinessIds(businessIds)
        businessIdList.splice(index, 1)
        await store.setBusinessIdList(businessIdList)
        let dataIndex = usingBusinessIds.slice().findIndex((val) => val === id)
        console.log(dataIndex, dataIndex > -1)
        if (dataIndex > -1) {
            store.clearParams()
            store.clearLeftParams()
            usingBusinessIds = []
        }
        let params = {
            businessIds,
            usingBusinessIds
        }
        store.getSearchMetricsBusiness(params)
        this.setState({
            keyword: '',
            indexList: []
        }, () => {
            this.props.getSearchViewList && this.props.getSearchViewList()
        })
    }


    // 切换业务线拿到指标
    getOriginList= async (id, type) => {
        store.changeRadioValue(id, type)
        let res = await getBusiness({ page: 1, page_size: 100, businessId: id, type })
        if (res.code === 200) {
            this.setState({
                businessId: id,
                type,
                topic: res.data.businessTypeName,
            })
        }
        // 获取常用指标
        let commonRes = await getMetrics({ page: 1, pageSize: 10000, businessId: id, type })
        if (commonRes.code === 200) {
            this.setState({
                tableList: commonRes.data,
            })
        }
    }
    // // 抽屉开关
    // showDrawer = () => {
    //     this.setState({
    //         visible: true,
    //     })
    // };

    // 抽屉开关
    showDrawer = () => {
        // this.setState({
        //     visible: true,
        // })
        this.BusinessDrawerDom.showDrawer(true, { businessId: store.businessIds.slice() })
        // this.BusinessDrawerDom.showDrawer(true, { businessId: this.state.businessId })
    };

    // onClose = () => {
    //     this.setState({
    //         visible: false
    //     })
    // }

    // 切换业务
    // onChangeBusiness = (id, type) => {
    //     this.props.clearStatus()
    //     this.getOriginList(id, type)
    //     this.onClose()
    //     this.setState({
    //         keyword: '',
    //         indexList: []
    //     })
    // }

    // 键盘精灵
    onSearch = async (value) => {
        let { type, businessId } = this.state
        this.setState({
            fetching: true
        })
        let params = {
            keyword: value,
            businessId,
            type,
            usableBusinessIds: store.usableBusinessIds
        }
        if (store.tempBusinessId && store.tempBusinessId.length > 0) {
            params.tempBusinessId = store.tempBusinessId
        }
        let res = await leftQuickTip(params)
        if (res.code === 200) {
            this.setState({
                indexList: res.data,
                fetching: false,
                keyword: value
            })
        }
        // thisKey.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
    }
    onSetSearch = (value) => {
        this.setState({
            keyword: value
        })
    }
    // 下拉框选中
    onSearhIndex = async(value) => {
        let { usingBusinessIds, businessIds } = store
        let { type, businessId } = this.state
        let params = {
            businessIds,
            usingBusinessIds
        }
        let key = value.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
        store.getSearchMetricsBusiness({ ...params, keyword: key })
        // let res = await searchMetrics({ ...params,keyword: key, businessId, type })
        // this.setState({
        //     tableList: res.data,
        //     ifRes: true,
        //     keyword: key
        // })
    }

    // 搜索按钮方法
    onSearchMethod = async () => {
        let { usingBusinessIds, businessIds } = store
        let params = {
            businessIds,
            usingBusinessIds
        }
        let { keyword } = this.state
        store.getSearchMetricsBusiness({ ...params, keyword: keyword })
        // if (keyword.length > 0) {
        //     let res = await searchMetrics({ ...params,keyword, businessId })
        //     this.setState({
        //         tableList: res.data,
        //         ifRes: true,
        //     })
        // }
    }

    clear=() => {
        let { usingBusinessIds, businessIds } = store
        let params = {
            businessId: store.businessId,
            type: store.type,
            businessIds,
            usingBusinessIds
        }
        store.getSearchMetricsBusiness(params)
        // store.getMetricsMethod(params)
        // this.getOriginList(store.businessId, store.type)
        this.setState({
            keyword: '',
            indexList: []
        })
    }
    addNewFormula = () => {
        this.setState({
            formulaVisible: true
        })
    }
    // 关闭formula弹窗
    handleCancel = () => {
        this.addNewCol.clearParams()
        this.setState({
            formulaVisible: false
        })
    }
    // 保存formula
    saveFormula = async (params) => {
        let usableBusinessIds = store.usableBusinessIds
        this.getFormula({ tempBusinessId: params.tempBusinessId, usableBusinessIds })
        store.setTempBusinessId(params.tempBusinessId)
        message.success('保存成功')
    }
    // 获取新增列
    getFormula = async (params) => {
        let res = await getFormula(params)
        if (res.code === 200) {
            store.setFormulaList(res.data)
        }
    }
    delFormula = async (params) => {
        let res = await delFormula(params)
        if (res.code === 200) {
            message.success('删除成功')
            this.getFormula({ tempBusinessId: store.tempBusinessId, usableBusinessIds: store.usableBusinessIds })
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    handleOriginList = (id, type) => {
        // store.clearParams()
        // this.getOriginList(id, type)
        // this.setState({
        //     keyword: '',
        //     indexList: []
        // })
        this.props.clearStatus()
        this.getOriginList(id, type)
        // this.onClose()
        this.setState({
            keyword: '',
            indexList: []
        })
    }

    render() {
        const { dataList, commonList, topic, tableList, indexList, fetching, ifRes, keyword, formulaVisible, isEdit } = this.state
        const { leftSelectOption, disableBusiness, usableBusiness, formulaList, leftLoading } = store
        return (
            <div className='sentenceLeftMenu'>
                <div className='leftHeader'>
                    <div className='topic'>
                        <h3>{topic}</h3>
                    </div>
                    <div className='changeData'>
                        <Button type='primary' icon='' onClick={this.showDrawer} style={{ width: '120px' }} >选择数据</Button>
                    </div>
                </div>
                <div className='keySearch'>
                    <Select
                        style={{ width: 188 }}
                        showSearch
                        placeholder='查找指标'
                        filterOption={false}
                        onSelect={this.onSearhIndex}
                        onSearch={this.onSearch}
                        onBlur={
                            (value) => {
                                this.onSetSearch(value)
                            }
                        }
                        value={keyword}
                        notFoundContent={fetching ? <Spin size='small' /> : null}
                    >
                        {
                            indexList.map((value, index) => {
                                return <Option key={index} value={value}><span dangerouslySetInnerHTML={{ __html: value }}></span></Option>
                            })
                        }
                    </Select>
                    <Button type='' icon={<SyncOutlined/>} onClick={this.clear} className='buttonupdate' />
                    <Button type='primary' icon={<SearchOutlined/>} onClick={this.onSearchMethod} style={{ height: '29px', display: 'inline-block', position: 'absolute', right: '0px' }} />
                </div>
                {/*<div className='leftList'>*/}
                    {/*{*/}
                        {/*tableList.map((value, index) => {*/}
                            {/*return <DataList key={index} topic={value.cname} initList={value.metrics} dataLentgh={5} />*/}
                        {/*})*/}
                    {/*}*/}
                {/*</div>*/}
                <Spin spinning={leftLoading}>
                    <div className='leftChild'>
                        {
                            usableBusiness && usableBusiness.length > 0
                                ? usableBusiness.map((value, index) => {
                                return (
                                    <CollspeWarp title={value.cname || value.ename} key={index} listStyle={{ paddingLeft: 0 }}>
                                        {
                                            value.children.length === 1 && value.children[0].cname === value.cname ? <DataList initList={value.children[0].metrics} leftSelectOption searchAction={this.props.searchAction} />
                                                : value.children.map((val, keyIndex) => {
                                                return <DataList formulaList={formulaList} key={keyIndex} topic={val.cname} initList={val.metrics} leftSelectOption searchAction={this.props.searchAction} />
                                            })
                                        }
                                    </CollspeWarp>
                                )
                            })
                                : <div> 没有结果 </div>
                        }
                        {
                            formulaList.slice().length > 0 &&
                            <CollspeWarp title='公式函数' listStyle={{ paddingLeft: 0 }}>
                                <FormulaList delFormula={this.delFormula} formulaList={formulaList} key='formula' topic='公式函数' saveFormula={this.saveFormula} initList={formulaList.slice()} dataLentgh={5} leftSelectOption searchAction={this.props.searchAction} />
                            </CollspeWarp>
                        }
                        {
                            (disableBusiness && disableBusiness.length > 0) && disableBusiness.map((value, index) => {
                                return (<CollspeWarp disabled title={value.cname || value.ename} key={index} listStyle={{ paddingLeft: 0 }} />)
                            })
                        }
                    </div>
                </Spin>
                <div className='formulaBtn'>
                    <span className='addFormula' style={{ color: store.businessIds.length > 0 ? '#000' : '#999' }} onClick={store.businessIds.length > 0 && this.addNewFormula}>新增计算公式</span>
                </div>
                <BusinessDrawer
                    ref={(dom) => { this.BusinessDrawerDom = dom }}
                    addIdList={this.setUsingBusinessId}
                    delIdList={this.delUsingBusinessId}
                    showFooter={false}
                    {...this.props}
                    // handleOriginList={this.handleOriginList}
                />
                {
                    formulaVisible && <Modal
                        title='添加公式列'
                        visible={this.state.formulaVisible}
                        // onOk={this.handleOk}
                        footer={null}
                        onCancel={this.handleCancel}
                        width={1005}
                    >
                        <AddNewCol
                            businessIds={store.businessIds}
                            usableBusinessIds={store.usableBusinessIds}
                            handleCancel={this.handleCancel}
                            saveFormula={this.saveFormula}
                            isEdit={isEdit}
                            scope={2}
                            tempBusinessId={store.tempBusinessId}
                            formulaList={formulaList}
                            wrappedComponentRef={(refs) => { this.addNewCol = refs }}
                        />
                    </Modal>
                }

                {/* <Drawer
                    title='选择数据'
                    placement='right'
                    onClose={this.onClose}
                    visible={this.state.visible}
                    // width='700'
                    width='auto'
                    headerStyle={{
                        width: '100%'
                    }}
                    drawerStyle={{
                        maxWidth: '1183px',
                        // maxWidth: '1136px',
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    {
                        dataList.map((value, index) => {
                            let backgroundColor = '#48D1E0'
                            if (value.type === -1) {
                                backgroundColor = '#48D1E0'
                            } else if (value.type === 1) {
                                backgroundColor = '#2E76F0'
                            } else if (value.type === 0) {
                                backgroundColor = '#36C07F'
                            } else {
                                backgroundColor = '#F98142'
                            }
                            return (
                                <Card
                                    key={index}
                                    className='leftContentCard'
                                    style={{
                                        width: '48%',
                                        background: '#F6F8FA',
                                        marginBottom: '20px',
                                        marginRight: '1%',
                                        marginLeft: '1%',
                                        display: 'inline-block',
                                        overflow: 'hidden',
                                        height: '230px'
                                    }}
                                >
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#000000',
                                        overflow: 'hidden',
                                        fontWeight: 500 }}
                                    >
                                        <span style={{ display: 'inline-block', width: '355px' }}>{value.businessTypeName}</span>
                                        <span
                                            style={{
                                                float: 'right',
                                                padding: '1px 13px',
                                                color: '#FFFFFF',
                                                borderRadius: '4px',
                                                background: backgroundColor
                                            }}
                                        >
                                            {value.type === -1 && '数据集合集' }
                                            {value.type === 0 && '业务线' }
                                            {value.type === 1 && '数据集' }
                                            {value.type === 2 && '用户数据' }
                                        </span>
                                    </p>
                                    <p style={{ fontSize: '12px' }} >
                                        {
                                            value.creator ? <span style={{ marginRight: '10px' }}>创建人：{value.creator}</span> : null
                                        }
                                        {
                                            value.createTime ? <span style={{ marginRight: '10px' }}>创建时间：{value.createTime}</span> : null
                                        }
                                        {
                                            value.latestMetaIndexTime ? <span>更新时间：{value.latestMetaIndexTime}</span> : null
                                        }
                                    </p>
                                    <p>
                                        {
                                            value.modelTableList && value.modelTableList.length > 0
                                                ? <span>{value.businessTypeName}业务覆盖了{value.modelTableList.map((val, index) => {
                                                    if (index < 2) {
                                                        return <span>{val.cname || val.ename},</span>
                                                    } else if (index === 2) {
                                                        return <span>{val.cname || val.ename}等</span>
                                                    }
                                                })}{value.modelTableList.length}个业务类别,包含{value.metricsNumber}个指标项。
                                                  </span> : null
                                        }
                                    </p>
                                    <p style={{ overflow: 'hidden' }}>
                                        {
                                            this.state.businessId === value.id
                                                ? <Button disabled style={{ float: 'right' }}>正在使用</Button>
                                                : <Button onClick={this.onChangeBusiness.bind(this, value.id, value.type)} style={{ float: 'right' }}>切换业务</Button>
                                        }

                                    </p>
                                </Card>
                            )
                        })
                    }
                </Drawer> */}
            </div>
        )
    }
}
