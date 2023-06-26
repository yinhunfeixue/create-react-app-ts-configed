import { Button, Card, Col, Drawer, Input, Menu, message, Modal, Row, Tabs, Tag } from 'antd'
import { assetSelected, removeFromMyAssets } from 'app_api/dataAssetApi'
import { getBusiness, getDatamanagerBusiness, getDatamanagerCategory } from 'app_api/wordSearchApi'
import deletePng from 'app_images/delete.png'
import disabledDletePng from 'app_images/disabled-delete.png'
import SelectIcon from 'app_images/SelectedMark.svg'
import previewPng from 'app_images/查看详情.svg'
import settingPng from 'app_images/配置.svg'
import Cache from 'app_utils/cache'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import DataLoading from '../loading'
import './index.less'

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
            keyword: '',
        }
    }

    componentDidMount = () => {}
    removeMyAsset = (data) => {
        if (!this.props.showFooter && !data.configComplete) {
            return
        }
        let that = this
        Modal.confirm({
            title: '将此条数据从我的资产移除？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                let res = await removeFromMyAssets(data.businessId)
                if (res.code == 200) {
                    that.showDrawer(true, { businessId: [] })
                }
            },
        })
    }

    showDrawer = (status, data) => {
        // this.getDataList()
        this.setState({
            loading: true,
        })
        this.getBusinessGroup(data)
        this.setState({
            visible: status,
            businessId: data.businessId.slice(),
        })
    }

    getDatamanagerBusinessData = async (params = {}) => {
        let { businessId } = this.state
        let param = {
            ...params,
            needDetail: true,
        }
        let res = await getDatamanagerBusiness(param)
        if (res.code == 200) {
            res.data.map((item) => {
                if (item.selected) {
                    if (!businessId.includes(item.id)) {
                        businessId.push(item.id)
                    }
                }
            })
            this.setState({ businessId })
            return res.data
        } else {
            return []
        }
    }

    getSelectedBussiness = async (data, detailKeyword) => {
        let businessIds = this.state.businessId.join(',')
        if (data) {
            businessIds = data.join(',')
        }
        this.setState({
            loading: true,
        })
        let params = {
            // businessIds,
            busiGroupId: this.state.busiGroupId,
        }
        if (detailKeyword) {
            params.detailKeyword = detailKeyword
        }
        let dataList = await this.getDatamanagerBusinessData(params)
        this.setState({
            loading: false,
            dataList,
        })
    }

    getBusinessGroup = async (data) => {
        let res = await getDatamanagerCategory({ filterUnindex: true })
        let busiGroupId = this.state.busiGroupId ? this.state.busiGroupId : '-1'
        let busiGroupList = []
        let selecGroupList = [
            // { busiGroupId: 'selectedData', busiGroupName: '已选数据', tableCount: data.businessId.length }
        ]
        if (res.code === 200) {
            // busiGroupId = res.data[0].busiGroupId
            await this.setState({
                busiGroupId,
            })
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
            menuSelectedKeys: [busiGroupId],
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
        if (!this.props.showFooter && !data.configComplete) {
            return
        }
        const { businessId, selecGroupList } = this.state
        console.log(businessId, id, 'addBusiness')
        if (businessId.includes(id)) {
            this.deleteBusiness(data, id, type)
            return
        }
        let query = {
            businessId: data.businessId,
            selected: true,
        }
        let res = await assetSelected(query)
        if (res.code == 200) {
            if (businessId.findIndex((value) => value === id) >= 0) {
                return
            } else {
                businessId.unshift(id)
                // selecGroupList[0].tableCount = businessId.length
                this.setState({
                    businessId,
                    selecGroupList,
                })
            }
            this.props.addIdList && this.props.addIdList(id, type)
            console.log(businessId, 'businessId')
            this.getBusinessGroup({ businessId: [] })
            // this.showDrawer(true,{ businessId: [] })
        }
    }
    // 取消业务线
    deleteBusiness = async (data, id, type) => {
        let query = {
            businessId: data.businessId,
            selected: false,
        }
        let res = await assetSelected(query)
        if (res.code == 200) {
            const { businessId, selecGroupList } = this.state
            let dataIndex = businessId.findIndex((val) => val === id)
            businessId.splice(dataIndex, 1)
            // selecGroupList[0].tableCount = businessId.length
            this.setState({
                businessId,
                selecGroupList,
            })
            this.props.delIdList && this.props.delIdList(id, type)
            console.log(businessId, 'businessId')
            this.getBusinessGroup({ businessId: [] })
            // this.showDrawer(true,{ businessId: [] })
        }
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    onTabClick = (item) => {
        // if (item.key === '-1') {
        //     this.getSelectedBussiness()
        //     this.setState({
        //         menuSelectedKeys: [item.key],
        //         busiGroupId: item.key,
        //     })
        //     return
        // }
        this.setState(
            {
                busiGroupId: item.key,
                menuSelectedKeys: [item.key],
                keyword: '',
                loading: true,
            },
            async () => {
                let dataList = await this.getDatamanagerBusinessData({
                    busiGroupId: item.key,
                })

                this.setState({
                    dataList,
                    loading: false,
                })
            }
        )
    }

    searchBusiness = async (value) => {
        // if (this.state.busiGroupId === '-1') {
        //     console.log(this.state.busiGroupId, value)
        //     this.getSelectedBussiness(this.state.businessId, value)
        //     return
        // }
        this.setState(
            {
                loading: true,
            },
            async () => {
                let dataList = await this.getDatamanagerBusinessData({
                    busiGroupId: this.state.busiGroupId,
                    detailKeyword: value,
                })
                this.setState({
                    dataList,
                    loading: false,
                })
            }
        )
    }
    onInput = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    getDetail = (value, data) => {
        if (!this.props.showFooter && !data.configComplete) {
            return
        }
        this.setState({
            visible: false,
        })
        this.props.addTab('dataAsssetDetail', { editMode: value, data: data, from: 'dataManage' })
    }
    formatTime = (value) => {
        if (!value) {
            return ''
        }
        let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log(moment(currentTime) - moment(value), 'currentTime - value')
        let time = (moment(currentTime) - moment(value)) / 1000
        console.log(time / 3600, 'time/3600')
        if (time / 3600 > 1 && time / 3600 < 24) {
            return '最近' + Math.ceil(time / 3600) + '小时'
        } else if (time / 3600 > 24) {
            return value
        } else {
            return '最近' + Math.ceil(time / 60) + '分钟'
        }
    }
    getKeywordSearch = () => {
        const { dataList, businessId } = this.state
        let isConfigComplete = true
        dataList.map((item) => {
            businessId.map((item1) => {
                if (item.businessId == item1) {
                    if (!item.configComplete) {
                        isConfigComplete = false
                    }
                }
            })
        })
        if (!isConfigComplete) {
            message.error('未配置的资产不可直接使用，请先进行配置')
            return
        }
        this.setState({
            visible: false,
        })
        this.props.addTab('kewordSearch', { businessIds: this.state.businessId })
    }
    getCreateEtl = () => {
        const { dataList, businessId } = this.state
        let isConfigComplete = true
        dataList.map((item) => {
            businessId.map((item1) => {
                if (item.businessId == item1) {
                    if (!item.configComplete) {
                        isConfigComplete = false
                    }
                }
            })
        })
        if (!isConfigComplete) {
            message.error('未配置的资产不可直接使用，请先进行配置')
            return
        }
        this.setState({
            visible: false,
        })
        this.props.addTab('createETL', { from: 'dataAsset', businessId })
    }

    render() {
        const { dataList, businessId, busiGroupId, selecGroupList, busiGroupList, menuSelectedKeys, loading, keyword } = this.state
        let tagList = [
            { name: '标签1', type: '1' },
            { name: '标签2', type: '2' },
        ]
        // 分组菜单数据
        const menuList = [...selecGroupList, ...busiGroupList]
        let paddingBottom = this.props.showFooter ? '125px' : '20px'
        return (
            <div>
                <Drawer
                    title='我的资产'
                    placement='right'
                    onClose={this.onClose}
                    visible={this.state.visible}
                    width='calc(100% - 200px)'
                    headerStyle={{
                        width: '100%',
                        height: '55px',
                    }}
                    bodyStyle={{
                        border: 0,
                        padding: 0,
                        height: '100%',
                        paddingBottom: paddingBottom,
                    }}
                    drawerStyle={{
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div className='dataAsset-card-container'>
                        <div className='menuBar'>
                            <Menu onClick={this.onTabClick} selectedKeys={menuSelectedKeys} style={{ border: 0, background: 'rgba(247,248,250,1)' }}>
                                {_.map(menuList, (cate, key) => {
                                    return (
                                        <Menu.Item key={cate.busiGroupId}>
                                            <Row className='menuTitle'>
                                                <Col span='20'>
                                                    <div className='titleName'>{cate.busiGroupName}</div>
                                                </Col>
                                                <Col span='4'>{cate.tableCount}</Col>
                                            </Row>
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        </div>
                        <div style={{ background: '#fff', height: '100%', flexGrow: 1, paddingTop: '16px', width: 'calc(100% - 200px)' }}>
                            <Row gutter={16}>
                                <Col span='24'>
                                    <div className='searchTool'>
                                        <Search
                                            placeholder='请输入表英文名或中文名'
                                            onSearch={(value) => this.searchBusiness(value)}
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
                            <Row gutter={16} style={{ height: 'calc(100% - 60px)' }}>
                                <Col span='24' style={{ height: '100%' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            padding: '8px',
                                            overflow: 'auto',
                                            height: '100%',
                                        }}
                                    >
                                        {loading ? (
                                            <div style={{ paddingTop: '20%', width: '100%', minHeight: '100%' }}>
                                                <DataLoading />
                                            </div>
                                        ) : dataList.length > 0 ? (
                                            _.map(dataList, (value, index) => {
                                                let backgroundColor = '#48D1E0'
                                                if (value.type === -1) {
                                                    backgroundColor = '#48D1E0'
                                                } else if (value.type === 1) {
                                                    backgroundColor = '#7EB2E6'
                                                } else if (value.type === 0) {
                                                    backgroundColor = '#36C07F'
                                                } else if (value.type === 3) {
                                                    backgroundColor = '#8AD6E6'
                                                } else if (value.type === 6) {
                                                    backgroundColor = '#FF9933'
                                                } else {
                                                    backgroundColor = '#FAAF64'
                                                }
                                                return (
                                                    <div style={{ display: 'inline-block', position: 'relative', width: '50%' }}>
                                                        {/*<Popconfirm*/}
                                                        {/*placement='bottom'*/}
                                                        {/*title={`确定移除 “${value.businessTypeName}”吗？`}*/}
                                                        {/*onConfirm={this.deleteBusiness.bind(this, value, value.id, value.type)}*/}
                                                        {/*okText='确认'*/}
                                                        {/*cancelText='取消'*/}
                                                        {/*disabled={businessId.findIndex((val) => val === value.id) === -1}*/}
                                                        {/*>*/}
                                                        {/*</Popconfirm>*/}
                                                        <Card key={index} className='contentCard'>
                                                            <div
                                                                className={businessId.findIndex((val) => val === value.id) > -1 ? 'selectCard businessMode' : 'businessMode'}
                                                                onClick={this.addBusiness.bind(this, value, value.id, value.type)}
                                                                style={{
                                                                    opacity: !this.props.showFooter && !value.configComplete ? '0.5' : '1',
                                                                    cursor: !this.props.showFooter && !value.configComplete ? 'not-allowed' : 'pointer',
                                                                }}
                                                                title={!this.props.showFooter && !value.configComplete ? '未配置，暂不可选' : ''}
                                                            >
                                                                <p
                                                                    style={{
                                                                        fontSize: '14px',
                                                                        color: '#000000',
                                                                        overflow: 'hidden',
                                                                        marginTop: '0px',
                                                                    }}
                                                                >
                                                                    <span style={{ display: 'inline-block' }} className='businessTitle'>
                                                                        {value.businessTypeName}
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            float: 'right',
                                                                            padding: '0px 4px',
                                                                            color: '#FFFFFF',
                                                                            borderRadius: '2px',
                                                                            fontSize: '12px',
                                                                            background: backgroundColor,
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
                                                                        {value.type === 9 && '模板数据集'}
                                                                    </span>
                                                                    {!value.configComplete ? <span style={{ float: 'right', color: '#F23F30', marginRight: '8px' }}>未配置</span> : null}
                                                                </p>
                                                                <div style={{ minHeight: '110px' }}>
                                                                    <p className='userInfo'>
                                                                        {value.type == 3 ? <span>源库路径：{value.contextPath}</span> : <span>业务分类：{value.classPath}</span>}
                                                                    </p>
                                                                    <p className='tagList'>
                                                                        {value.tagList &&
                                                                            value.tagList.map((tag) => {
                                                                                return <Tag color='blue'>{tag.tagName}</Tag>
                                                                            })}
                                                                    </p>
                                                                    <p className='columnArea'>
                                                                        字段：
                                                                        {value.columnList &&
                                                                            value.columnList.map((item) => {
                                                                                return <span>{item.cname} </span>
                                                                            })}
                                                                    </p>
                                                                </div>
                                                                {businessId.findIndex((val) => val === value.id) > -1 && (
                                                                    <div className='selectedIcon'>
                                                                        <img src={SelectIcon} />
                                                                    </div>
                                                                )}
                                                                {/* <p style={{ overflow: 'hidden', position: 'absolute', right: '24px', bottom: '10px' }}>
                                                                 {
                                                                 businessId === value.id
                                                                 ? <Button disabled style={{ float: 'right', borderRadius: '4px' }}>正在使用</Button>
                                                                 : <Button onClick={this.onChangeBusiness.bind(this, value.id, value.type)} style={{ float: 'right', borderRadius: '4px' }}>选择数据</Button>
                                                                 }
                                                                 </p> */}
                                                            </div>
                                                        </Card>
                                                        <p
                                                            className='btnArea'
                                                            style={{
                                                                marginBottom: '0px',
                                                                opacity: !this.props.showFooter && !value.configComplete ? '0.5' : '1',
                                                                cursor: !this.props.showFooter && !value.configComplete ? 'not-allowed' : 'pointer',
                                                            }}
                                                        >
                                                            <span className='time'>{this.formatTime(value.addAssetsTime)}</span>
                                                            <span className='btn'>
                                                                <span onClick={this.getDetail.bind(this, false, value)}>
                                                                    <img src={previewPng} />
                                                                    详情
                                                                </span>
                                                                {!value.configComplete && Cache.get('canChangeAsset') ? (
                                                                    <span onClick={this.getDetail.bind(this, true, value)}>
                                                                        <img src={settingPng} />
                                                                        配置
                                                                    </span>
                                                                ) : null}
                                                                {!value.numberUsed ? (
                                                                    <span onClick={this.removeMyAsset.bind(this, value)}>
                                                                        <img style={{ width: '20px', height: '20px' }} src={deletePng} />
                                                                        从我的资产移除
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ color: '#b3b3b3' }}>
                                                                        <img style={{ width: '12px', height: '12px' }} src={disabledDletePng} />
                                                                        使用中无法移除
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div style={{ paddingTop: '20%', textAlign: 'center' }}>当前分组下暂无相关业务线</div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {this.props.showFooter ? (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                borderTop: '1px solid #e8e8e8',
                                padding: '21px 16px',
                                textAlign: 'right',
                                left: 0,
                                background: '#fff',
                                borderRadius: '0 0 4px 4px',
                            }}
                        >
                            <span style={{ marginRight: 8 }}>已选{businessId.length}项</span>
                            <Button disabled={!businessId.length} onClick={this.getKeywordSearch} type='primary' style={{ marginRight: 8, padding: '0 8px' }}>
                                去智能取数使用
                            </Button>
                            <Button disabled={!businessId.length} onClick={this.getCreateEtl} type='primary' style={{ padding: '0 8px' }}>
                                去创建ETL数据集
                            </Button>
                        </div>
                    ) : null}
                </Drawer>
            </div>
        )
    }
}

export default BusinessDrawer
