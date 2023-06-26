import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Button, Tooltip, Card, Spin, Select, message, Modal } from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import _ from 'underscore'
import { getBusiness, leftQuickTip } from 'app_api/wordSearchApi'
import DataList from './dataList'
import FormulaList from './formulaList'
import './leftContent.less'
import store from '../store'
import { observer } from 'mobx-react'
import AddNewCol from '../../../component/addNewCol'
import { getFormula, delFormula } from 'app_api/addNewColApi'
import BusinessDrawer from 'app_page/dama/component/businessDrawer1'
import CollspeWarp from 'app_component_main/menuCollspeWarp'
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
            indexList: [],
            businessId: this.props.businessId || 0,
            keyword: '',
            fetching: false,
            formulaVisible: false,
            isEdit: false
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        this.initList()
        // this.getFormula({ tempBusinessId: store.tempBusinessId, usableBusinessIds: store.usableBusinessIds })
    }
    // 切换业务线拿到指标
    initList = async (id, type) => {
        let { businessIds } = store
        businessIds = this.props.businessIds || []
        store.setBusinessIds(businessIds)
        // store.setBusinessIds(businessIds)
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
    // 抽屉开关
    showDrawer = () => {
        this.BusinessDrawerDom.showDrawer(true, { businessId: store.businessIds.slice() })
    };
    // 搜索框选择中
    onSearch = async (value) => {
        this.setState({
            fetching: true,
            keyword: value
        })
        let params = {
            keyword: value,
            usableBusinessIds: store.usableBusinessIds
        }
        if (store.tempBusinessId && store.tempBusinessId.length > 0) {
            params.tempBusinessId = store.tempBusinessId
        }
        let res = await leftQuickTip(params)
        if (res.code === 200) {
            this.setState({
                indexList: res.data,
                fetching: false
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
    onSearhIndex = async (value) => {
        let { usingBusinessIds, businessIds } = store
        let params = {
            businessIds,
            usingBusinessIds
        }
        let key = value.replace(/<span class='highlight'>/g, '').replace(/<\/span>/g, '')
        store.getSearchMetricsBusiness({ ...params, keyword: key })
        this.setState({
            keyword: key
        })
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
    }
    // 清空
    clear = () => {
        let { usingBusinessIds, businessIds } = store
        let params = {
            businessIds,
            usingBusinessIds
        }
        store.getSearchMetricsBusiness(params)
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
        console.log(params,'delFormula')
        let res = await delFormula(params)
        if (res.code === 200) {
            message.success('删除成功')
            this.getFormula({ tempBusinessId: store.tempBusinessId, usableBusinessIds: store.usableBusinessIds })
            this.props.delFormula(params)
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    render() {
        const { leftSelectOption, disableBusiness, usableBusiness, formulaList, leftLoading } = store
        const {
            dataList, topic, fetching, keyword,
            formulaVisible, isEdit, indexList
        } = this.state
        return (
            <div className='kwLeftMenu'>
                <div className='leftHeader'>
                    <div className='changeData' style={{ paddingTop: '30px' }}>
                        <Button type='primary' onClick={this.showDrawer} style={{ width: '120px', borderRadius: '3px' }} >选择数据</Button>
                    </div>
                </div>
                <div className='keySearch'>
                    <Select
                        style={{ width: 188 }}
                        showSearch
                        // mode='tags'
                        // allowClear
                        placeholder='查找指标'
                        filterOption={false}
                        onSelect={this.onSearhIndex}
                        onSearch={this.onSearch}
                        value={keyword}
                        onBlur={
                            (value) => {
                                this.onSetSearch(value)
                            }
                        }
                        notFoundContent={fetching ? <Spin size='small' /> : null}
                    >
                        {
                            indexList.map((value, index) => {
                                return <Option key={index} value={value}><span dangerouslySetInnerHTML={{ __html: value }}></span></Option>
                            })
                        }
                    </Select>
                    {/* 重置搜索条件*/}
                    <Button type='' icon={<SyncOutlined />} onClick={this.clear} className='buttonupdate' />
                    <Button type='primary' icon={<SearchOutlined />} onClick={this.onSearchMethod} style={{ height: '29px', display: 'inline-block', position: 'absolute', right: '0px' }} />
                </div>
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
            </div>
        )
    }
}
