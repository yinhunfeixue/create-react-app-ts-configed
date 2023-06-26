import React, { Component } from 'react'
import { Drawer, Card, Popconfirm, Tabs, Menu, Row, Col, Input } from 'antd'
import './index.less'
import _ from 'underscore'
import { getBusiness, getDatamanagerCategory, getDatamanagerBusiness } from 'app_api/wordSearchApi'
import DataLoading from '../loading'
import SelectIcon from 'app_images/SelectedMark.svg'
import { removeFromMyAssets, assetSelected } from 'app_api/dataAssetApi'

const { TabPane } = Tabs
const { Search } = Input

class BusinessDrawer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataList: [],
            selectList: [], // 选中数据的列表
            selecGroupList: [],
            businessId: [],
            busiGroupId: '',
            busiGroupList: [],
            visible: false, // 抽屉开关
            menuSelectedKeys: [],
            loading: false,
            keyword: ''
        }
    }

    componentDidMount = () => {
    }

    showDrawer = (status, data) => {
        // this.getDataList()
        this.setState({
            loading: true
        })
        this.getBusinessGroup(data)
        this.setState({
            visible: status,
            businessId: data.businessId.slice()
        })
    };

    getDatamanagerBusinessData = async (params = {}) => {
        let param = {
            ...params,
            needDetail: true
        }
        let res = await getDatamanagerBusiness(param)
        return res.data
    }

    getSelectedBussiness = async (data, detailKeyword) => {
        let businessIds = this.state.businessId.join(',')
        if (data) {
            businessIds = data.join(',')
        }
        this.setState({
            loading: true
        })
        let params = {
            businessIds
        }
        if (detailKeyword) {
            params.detailKeyword = detailKeyword
        }
        let dataList = await this.getDatamanagerBusinessData(params)
        this.setState({
            loading: false,
            dataList
        })
    }

    getBusinessGroup = async (data) => {
        let res = await getDatamanagerCategory({ filterUnindex: true })
        let busiGroupId = 'selectedData'
        let busiGroupList = []
        let selecGroupList = [
            { busiGroupId: 'selectedData', busiGroupName: '已选数据', tableCount: data.businessId.length }
        ]
        if (res.code === 200) {
            // busiGroupId = res.data[0].busiGroupId
            busiGroupId = 'selectedData'
            busiGroupList = res.data
            this.getSelectedBussiness(data.businessId)
            // let dataList = await this.getDatamanagerBusinessData({
            //     busiGroupId
            // })
            // this.setState({
            //     loading: false,
            //     dataList
            // })
        }
        this.setState({
            selecGroupList,
            busiGroupList,
            busiGroupId,
            menuSelectedKeys: [busiGroupId]
        })
    }

    // 获取业务线
    getDataList = async () => {
        let res = await getBusiness({ page: 1, page_size: 100, withUsed: 1 })
        if (res.code === 200) {
            this.setState({
                dataList: res.data,
            })
        }
    }

    // 添加业务线
    addBusiness = async (data, id, type) => {
        let query = {
            businessId: data.businessId,
            selected: true
        }
        let res = await assetSelected(query)
        if (res.code == 200) {
            const { businessId, selecGroupList } = this.state
            if (businessId.findIndex((value) => value === id) >= 0) {
                return
            } else {
                businessId.unshift(id)
                selecGroupList[0].tableCount = businessId.length
                this.setState({
                    businessId,
                    selecGroupList
                })
            }
            this.props.addIdList && this.props.addIdList(id, type)
        }
    }
    // 取消业务线
    deleteBusiness = async (data, id, type) => {
        let query = {
            businessId: data.businessId,
            selected: false
        }
        let res = await assetSelected(query)
        if (res.code == 200) {
            const { businessId, selecGroupList } = this.state
            let dataIndex = businessId.findIndex((val) => val === id)
            businessId.splice(dataIndex, 1)
            selecGroupList[0].tableCount = businessId.length
            this.setState({
                businessId,
                selecGroupList
            })
            this.props.delIdList && this.props.delIdList(id, type)
        }
    }

    onClose = () => {
        this.setState({
            visible: false
        })
    }

    onTabClick = (item) => {
        if (item.key === 'selectedData') {
            this.getSelectedBussiness()
            this.setState({
                menuSelectedKeys: [item.key],
                busiGroupId: item.key,
            })
            return
        }
        this.setState({
            busiGroupId: item.key,
            menuSelectedKeys: [item.key],
            keyword: '',
            loading: true
        }, async () => {
            let dataList = await this.getDatamanagerBusinessData({
                busiGroupId: item.key
            })

            this.setState({
                dataList,
                loading: false
            })
        })
    }

    searchBusiness = async (value) => {
        if (this.state.busiGroupId === 'selectedData') {
            console.log(this.state.busiGroupId, value)
            this.getSelectedBussiness(this.state.businessId, value)
            return
        }
        this.setState({
            loading: true
        }, async () => {
            let dataList = await this.getDatamanagerBusinessData({
                busiGroupId: this.state.busiGroupId,
                detailKeyword: value

            })
            this.setState({
                dataList,
                loading: false,
            })
        })
    }
    onInput = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }

    render() {
        const {
            dataList, businessId, busiGroupId,
            selecGroupList, busiGroupList, menuSelectedKeys,
            loading, keyword
        } = this.state
        // 分组菜单数据
        const menuList = [...selecGroupList, ...busiGroupList]
        return (
            <div>
                <Drawer
                    title='选择数据'
                    placement='right'
                    onClose={this.onClose}
                    visible={this.state.visible}
                    // width='700'
                    width='calc(100% - 200px)'
                    headerStyle={{
                        width: '100%',
                        height: '55px'
                    }}
                    bodyStyle={{
                        border: 0,
                        padding: 0,
                        height: '100%'
                    }}
                    drawerStyle={{
                        // maxWidth: '1183px',
                        // display: 'flex',
                        // flexWrap: 'wrap',
                        // background: '#e8e8e8',
                        height: '100%',
                        overflow: 'hidden'
                        // padding: '24px 1%'
                    }}
                >
                    <div className='card-container'>
                        <div className='menuBar'>
                            <Menu
                                onClick={this.onTabClick}
                                selectedKeys={menuSelectedKeys}
                                style={{ border: 0, background: 'rgba(247,248,250,1)' }}
                            >
                                {
                                    _.map(menuList, (cate, key) => {
                                        return (
                                            <Menu.Item key={cate.busiGroupId} >
                                                <Row className='menuTitle'>
                                                    <Col span='20' >
                                                        <div className='titleName' >{cate.busiGroupName}</div>
                                                    </Col>
                                                    <Col span='4' >{cate.tableCount}</Col>
                                                </Row>
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </Menu>
                        </div>
                        <div style={{ background: '#fff', height: '100%', flexGrow: 1, paddingTop: '16px' }}>
                            <Row gutter={16}>
                                <Col span='24'>
                                    <div className='searchTool' >
                                        <Search
                                            placeholder='请输入表英文名或中文名'
                                            onSearch={value => this.searchBusiness(value)}
                                            onChange={this.onInput}
                                            style={{
                                                width: 300,
                                                float: 'right',
                                                // paddingTop: '8px'
                                            }}
                                            value={keyword}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span='24'>
                                    <div style={{
                                        height: '100%',
                                        padding: '8px',
                                        overflow: 'auto',
                                        height: 'calc(100vh - 100px)'
                                    }}>
                                        {
                                            loading ? <div style={{ paddingTop: '20%', width: '100%', minHeight: '100%' }}><DataLoading /></div> : dataList.length > 0 ? _.map(dataList, (value, index) => {
                                                let backgroundColor = '#48D1E0'
                                                if (value.type === -1) {
                                                    backgroundColor = '#48D1E0'
                                                }
                                                else if (value.type === 1) {
                                                    backgroundColor = '#2E76F0'
                                                } else if (value.type === 0) {
                                                    backgroundColor = '#36C07F'
                                                } else if (value.type === 6) {
                                                    backgroundColor = '#FF9933'
                                                } else {
                                                    backgroundColor = '#F98142'
                                                }
                                                return (
                                                    <Popconfirm
                                                        placement='bottom'
                                                        title={`移除 “${value.businessTypeName}” 后您将丢失当前的搜索内容`}
                                                        onConfirm={this.deleteBusiness.bind(this, value, value.id, value.type)}
                                                        okText='确认'
                                                        cancelText='取消'
                                                        disabled={businessId.findIndex((val) => val === value.id) === -1}
                                                    >
                                                        <Card
                                                            key={index}
                                                            className='contentCard'
                                                        >
                                                            <div
                                                                className={businessId.findIndex((val) => val === value.id) > -1 ? 'selectCard businessMode' : 'businessMode'}
                                                                onClick={businessId.findIndex((val) => val === value.id) === -1 && this.addBusiness.bind(this, value, value.id, value.type)}
                                                            >
                                                                <p style={{
                                                                    fontSize: '14px',
                                                                    color: '#000000',
                                                                    overflow: 'hidden',
                                                                    fontWeight: 500
                                                                }}
                                                                >
                                                                    <span style={{ display: 'inline-block' }} className='businessTitle' >{value.businessTypeName}</span>
                                                                    <span
                                                                        style={{
                                                                            float: 'right',
                                                                            padding: '1px 13px',
                                                                            color: '#FFFFFF',
                                                                            borderRadius: '4px',
                                                                            background: backgroundColor
                                                                        }}
                                                                    >
                                                                        {value.type === -1 && '数据集合集'}
                                                                        {value.type === 0 && '业务线'}
                                                                        {value.type === 1 && '数据集'}
                                                                        {value.type === 2 && '用户数据'}
                                                                        {value.type === 3 && '系统表'}
                                                                        {value.type === 4 && 'WorkSheet'}
                                                                        {value.type === 5 && '中间结果表'}
                                                                        {value.type === 6 && 'etl数据集'}
                                                                        {value.type === 8 && 'SQL数据集'}
                                                                    </span>
                                                                </p>
                                                                <div style={{ minHeight: '110px' }}>
                                                                    <p className='userInfo' >
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
                                                                </div>
                                                                {
                                                                    businessId.findIndex((val) => val === value.id) > -1 && <div className='selectedIcon'><img src={SelectIcon} /></div>
                                                                }
                                                                {/* <p style={{ overflow: 'hidden', position: 'absolute', right: '24px', bottom: '10px' }}>
                                                                    {
                                                                        businessId === value.id
                                                                            ? <Button disabled style={{ float: 'right', borderRadius: '4px' }}>正在使用</Button>
                                                                            : <Button onClick={this.onChangeBusiness.bind(this, value.id, value.type)} style={{ float: 'right', borderRadius: '4px' }}>选择数据</Button>
                                                                    }
                                                                </p> */}
                                                            </div>
                                                        </Card>
                                                    </Popconfirm>
                                                )
                                            }) : <div style={{ paddingTop: '20%', textAlign: 'center' }}>当前分组下暂无相关业务线</div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default BusinessDrawer
