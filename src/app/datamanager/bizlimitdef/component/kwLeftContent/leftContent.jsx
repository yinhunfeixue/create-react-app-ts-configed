import { message, Select } from 'antd'
import { bindViews } from 'app_api/reportActive'
import CollspeWarp from 'app_component_main/menuCollspeWarp'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../../store'
import BusinessDrawer from '../businessDrawer1'
import DataList from './dataList'
import './leftContent.less'
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
            fetching: false,
            isEdit: false,
            viewsList: [],
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        // this.initList()
        // store.getActiveViews(this.props.reportsData.reportsId)
        // this.getFormula({ tempBusinessId: store.tempBusinessId, usableBusinessIds: store.usableBusinessIds })
    }
    // getActiveViews = async () => {
    //     let res = await activeViews({reportsId: this.props.reportsData.reportsId})
    //     if (res.code == 200) {
    //         this.setState({
    //             viewsList: res.data
    //         })
    //     } else {
    //     }
    // }
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
        // if (businessIds.findIndex((val) => val === id) < 0) {
        //     businessIds.unshift(id)
        businessIds = [id]
        businessIdList.unshift({ id, type })
        await store.setBusinessIds(businessIds)
        await store.setBusinessIdList(businessIdList)
        let params = {
            businessIds,
            usingBusinessIds,
        }
        store.getSearchMetricsBusiness(params)
        this.setState(
            {
                indexList: [],
            },
            () => {
                this.props.getSearchViewList && this.props.getSearchViewList()
            }
        )
        // }
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
            usingBusinessIds,
        }
        store.getSearchMetricsBusiness(params)
        this.setState(
            {
                indexList: [],
            },
            () => {
                this.props.getSearchViewList && this.props.getSearchViewList()
            }
        )
    }
    // 抽屉开关
    showDrawer = (viewId, businessId, isEdit) => {
        if (!store.showCreateBtn) {
            return
        }
        this.BusinessDrawerDom.showDrawer(true, { businessId: [businessId], viewId: viewId, isEdit })
    }
    createSql = (viewId, businessId) => {
        if (!store.showCreateBtn) {
            return
        }
        this.props.changeCreateSql(false, viewId, businessId)
    }
    changeEditSql = (viewId, businessId) => {
        this.props.changeCreateSql(true, viewId, businessId)
    }
    bindDataAset = async (data) => {
        let res = await bindViews(data)
        if (res.code == 200) {
            // this.BusinessDrawerDom.showDrawer(false)
            store.clearButton()
            // store.getActiveViews(this.props.reportsData.reportsId)
        }
    }

    displayDrawer() {
        const { businessIds } = store
        this.showDrawer('', businessIds[0], false)
    }

    render() {
        const { leftSelectOption, disableBusiness, usableBusiness, formulaList, leftLoading, viewsList, businessIds, loading } = store
        const { dataList, topic, fetching, isEdit, indexList } = this.state
        let showLeftTip = false
        viewsList.map((item) => {
            if (!item.businessId) {
                showLeftTip = true
            }
        })
        return (
            <div className='reportLeftContent commonScroll' style={{ overflowX: 'hidden' }}>
                <div className='viewEmptyContent'>
                    {usableBusiness && usableBusiness.length > 0 ? (
                        usableBusiness.map((value, index) => {
                            return (
                                <CollspeWarp title={value.cname || value.ename} key={index} listStyle={{ paddingLeft: 0 }}>
                                    {value.children.length === 1 && value.children[0].cname === value.cname ? (
                                        <DataList initList={value.children[0].metrics} leftSelectOption searchAction={this.props.searchAction} />
                                    ) : (
                                        value.children.map((val, keyIndex) => {
                                            return (
                                                <DataList formulaList={formulaList} key={keyIndex} topic={val.cname} initList={val.metrics} leftSelectOption searchAction={this.props.searchAction} />
                                            )
                                        })
                                    )}
                                </CollspeWarp>
                            )
                        })
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: 100 }}>
                            暂未添加数据, 请<a onClick={() => this.displayDrawer()}>选择</a>{' '}
                        </div>
                    )}
                </div>
                <BusinessDrawer
                    ref={(dom) => {
                        this.BusinessDrawerDom = dom
                    }}
                    addIdList={this.setUsingBusinessId}
                    delIdList={this.delUsingBusinessId}
                    showFooter={false}
                    bindDataAset={this.bindDataAset}
                    {...this.props}
                />
            </div>
        )
    }
}
