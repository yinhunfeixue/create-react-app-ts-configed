import EmptyIcon from '@/component/EmptyIcon'
import { Card, Drawer, Input, message, Modal, Spin, Tabs, Tree } from 'antd'
import { removeFromMyAssets } from 'app_api/dataAssetApi'
import { bizAssets, bizClassifyTree } from 'app_api/metadataApi'
import { getBusiness, getDatamanagerCategory } from 'app_api/wordSearchApi'
import SelectIcon from 'app_images/SelectedMark.png'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import store from '../../store'
import DataLoading from '../loading'
import './index.less'

const { TabPane } = Tabs
const { Search } = Input
const TreeNode = Tree.TreeNode

const { confirm } = Modal

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
            viewId: '',
            isEdit: false,
            classifyTreeData: [],
            treeLoading: false,
            bizModuleId: '',
            themeId: '',
            keyword: '',
            classifyNodeIds: [],
        }
    }

    componentDidMount = () => {}
    getBizClassifyTree = async () => {
        this.setState({ treeLoading: true })
        let res = await bizClassifyTree()
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            let obj = [
                {
                    id: '',
                    name: '我的所有业务资产',
                    child: res.data,
                },
            ]
            console.log(obj, 'obj++++')
            this.setState({
                classifyTreeData: obj,
            })
        }
    }
    getBizAssets = async () => {
        let res = await bizAssets()
    }
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
        this.getBizClassifyTree()
        this.getDatamanagerBusinessData()
        // this.getBusinessGroup(data)
        console.log(data.businessId.slice(), 'data.businessId.slice')
        this.setState({
            visible: status,
            businessId: data.businessId.slice(),
            viewId: data.viewId,
            isEdit: data.isEdit,
        })
    }

    getDatamanagerBusinessData = async () => {
        let { businessId, classifyNodeIds } = this.state
        let param = {
            needAll: true,
            keyword: this.state.keyword,
            classifyNodeIds,
        }
        this.setState({ loading: true })
        let res = await bizAssets(param)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                dataList: res.data,
            })
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
            params.keyword = detailKeyword
        }
        if (this.state.busiGroupId == 'selectedData') {
            params.businessIds = this.state.businessId[0]
            delete params.busiGroupId
        }
        let dataList = await this.getDatamanagerBusinessData(params)
        this.setState({
            loading: false,
            dataList,
        })
    }

    getBusinessGroup = async (data) => {
        let res = await getDatamanagerCategory({ filterUnindex: true, needUsingGroup: false })
        let busiGroupId = this.state.busiGroupId ? this.state.busiGroupId : 'selectedData'
        let busiGroupList = []
        let selecGroupList = this.state.selecGroupList.length ? this.state.selecGroupList : [{ busiGroupId: 'selectedData', busiGroupName: '已选', tableCount: data.businessId[0] ? '1' : '0' }]
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
        let { businessId, selecGroupList } = this.state

        if (businessId.includes(id)) {
            return
        }
        if (this.state.isEdit) {
            let that = this
            confirm({
                title: '确认切换该数据集吗',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    businessId = [id]
                    selecGroupList[0].tableCount = 1
                    that.setState({
                        businessId,
                        selecGroupList,
                    })
                    that.props.bindDataAset({ viewId: that.state.viewId, relateDatasetId: id })
                    that.props.addIdList && that.props.addIdList(id, type)
                    that.getBusinessGroup({ businessId: [] })
                },
            })
        } else {
            await store.clearButton()
            businessId = [id]
            this.setState({
                businessId,
            })
            this.props.addIdList && this.props.addIdList(id, type)
        }
        this.onClose()
    }
    // 取消业务线
    deleteBusiness = async (data, id, type) => {
        return
        // let query = {
        //     businessId: data.businessId,
        //     selected: false
        // }
        // let res = await assetSelected(query)
        // if (res.code == 200) {
        let { businessId, selecGroupList } = this.state
        // let dataIndex = businessId.findIndex((val) => val === id)
        // businessId.splice(dataIndex, 1)
        businessId = []
        // selecGroupList[0].tableCount = businessId.length
        this.setState({
            businessId,
            selecGroupList,
        })
        this.props.delIdList && this.props.delIdList(id, type)
        console.log(businessId, 'businessId')
        this.getBusinessGroup({ businessId: [] })
        // this.showDrawer(true,{ businessId: [] })
        // } else {
        // }
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    onTabClick = async (item) => {
        if (item.key === 'selectedData') {
            await this.setState({
                menuSelectedKeys: [item.key],
                busiGroupId: item.key,
            })
            this.getSelectedBussiness()
            return
        }
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

    searchBusiness = async () => {
        // if (this.state.busiGroupId === 'selectedData') {
        //     console.log(this.state.busiGroupId, value)
        //     this.getSelectedBussiness(this.state.businessId, value)
        //     return
        // }
        // this.setState({
        //     loading: true
        // }, async () => {
        //     let dataList = await this.getDatamanagerBusinessData({
        //         busiGroupId: this.state.busiGroupId,
        //         keyword: value
        //
        //     })
        //     this.setState({
        //         dataList,
        //         loading: false,
        //     })
        // })
        this.getDatamanagerBusinessData()
    }
    onInput = async (e) => {
        await this.setState({
            keyword: e.target.value,
        })
        if (!e.target.value) {
            this.searchBusiness()
        }
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
    onTreeSelect = async (selectedKeys, e) => {
        console.log(selectedKeys, e, 'selectedKeys')
        await this.setState({
            bizModuleId: e.node.props.dataRef.moduleId,
            themeId: e.node.props.dataRef.themeId,
            classifyNodeIds: selectedKeys,
        })
        this.getDatamanagerBusinessData()
    }

    render() {
        const { dataList, businessId, busiGroupId, selecGroupList, busiGroupList, menuSelectedKeys, loading, keyword, classifyTreeData, treeLoading } = this.state
        let tagList = [
            { name: '标签1', type: '1' },
            { name: '标签2', type: '2' },
        ]
        // 分组菜单数据
        const menuList = [...selecGroupList, ...busiGroupList]
        let paddingBottom = this.props.showFooter ? '125px' : '20px'

        const loop = (data) =>
            data.map((item) => {
                if (item.child && item.child.length) {
                    return (
                        <TreeNode dataRef={item} key={item.id} title={item.name}>
                            {loop(item.child)}
                        </TreeNode>
                    )
                }
                return <TreeNode dataRef={item} key={item.id} title={item.name} />
            })
        return (
            <div>
                <Drawer
                    title={<span style={{ fontWeight: 'bold' }}>选择数据</span>}
                    placement='right'
                    onClose={this.onClose}
                    visible={this.state.visible}
                    width={1160}
                    headerStyle={{
                        width: '100%',
                        height: '55px',
                    }}
                    bodyStyle={{
                        padding: 0,
                        flexGrow: 1,
                        flexShrink: 1,
                        overflow: 'auto',
                    }}
                    drawerStyle={{
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className='dataAsset-card-container'>
                        <div className='menuBar'>
                            <Spin spinning={treeLoading}>
                                {classifyTreeData.length ? (
                                    <Tree defaultExpandAll={true} onSelect={this.onTreeSelect}>
                                        {loop(classifyTreeData)}
                                    </Tree>
                                ) : (
                                    <div style={{ height: 200 }} />
                                )}
                            </Spin>
                        </div>
                        <main>
                            <div className='searchTool'>
                                <Input.Search
                                    allowClear
                                    placeholder='请输入资产名称'
                                    onSearch={(value) => this.searchBusiness(value)}
                                    onChange={this.onInput}
                                    style={{
                                        width: 418,
                                    }}
                                    value={keyword}
                                />
                            </div>
                            {loading ? (
                                <div style={{ paddingTop: '20%', width: '100%', minHeight: '100%' }}>
                                    <DataLoading />
                                </div>
                            ) : dataList.length > 0 ? (
                                <div className='CardGroup'>
                                    {_.map(dataList, (value, index) => {
                                        let backgroundColor = value.type === 10 ? '#5E79DF' : '#EF861D'
                                        const label = value.type === 10 ? '维度资产' : '事实资产'

                                        return (
                                            <Card key={index} className='contentCard' bordered={false}>
                                                <div
                                                    className={businessId[0] == value.id ? 'selectCard businessMode' : 'businessMode'}
                                                    onClick={this.addBusiness.bind(this, value, value.id, value.type)}
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
                                                            {value.name}
                                                        </span>
                                                        <span
                                                            style={{
                                                                float: 'right',
                                                                padding: '2px 5px',
                                                                color: '#FFFFFF',
                                                                borderRadius: '2px',
                                                                fontSize: '12px',
                                                                background: backgroundColor,
                                                            }}
                                                        >
                                                            {label}
                                                        </span>
                                                    </p>
                                                    <div>
                                                        <p className='LineClamp1'>
                                                            业务分类：
                                                            <span>
                                                                {value.bizModuleName}／{value.themeName}／{value.bizProcessName}
                                                            </span>
                                                        </p>
                                                        <p className='columnArea'>
                                                            字段信息：
                                                            {value.columns &&
                                                                value.columns.map((item) => {
                                                                    return <span>{item.name} </span>
                                                                })}
                                                        </p>
                                                    </div>
                                                    <div className='selectedIcon' style={{ visibility: businessId[0] == value.id ? 'visible' : 'hidden' }}>
                                                        <img src={SelectIcon} />
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            ) : (
                                <EmptyIcon description='当前分组下暂无相关资产' />
                            )}
                        </main>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default BusinessDrawer
