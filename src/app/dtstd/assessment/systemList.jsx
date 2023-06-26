// 检核规则
import EmptyLabel from '@/component/EmptyLabel'
import ProjectUtil from '@/utils/ProjectUtil'

import { Button, Divider, Input, Tooltip, Progress, Select, Spin, Empty, Cascader, Popover, Tabs, Row, Col, Modal, message, Switch, Rate, Popconfirm, Menu, Dropdown } from 'antd'
import React, { Component } from 'react'
import Cache from 'app_utils/cache'
import './index.less'
import { estimateSystemTree, executeEstimate, deleteEstimateInfo } from 'app_api/standardApi'
import AddAssessmentSystem from './addAssessmentSystem/index'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import _ from 'lodash'

const storageKey = 'data-directory'
let init = true
const setStorage = (value) => {
    sessionStorage.setItem(storageKey, JSON.stringify(value))
}
const getStorage = () => {
    let s = {}
    try {
        s = JSON.parse(sessionStorage.getItem(storageKey) || '{}')
    } catch (err) {
        s = {}
    }
    return s
}

export default class SystemList extends Component {
    constructor(props) {
        super(props)
        const storage = getStorage() || {}
        this.state = {
            isTreeSearch: false,
            treeQueryInfo: {
                datasourceName: '',
                indexma: [0],
            },
            treeData: [],
            treeDataCopy: [],
            treeLoading: false,
            selectedTable: storage.selectedTable || {},
            datasourceIds: [],
        }
    }
    componentDidMount = async () => {
        // 开始缓存
        init = true
        if (this.pageParams.systemId) {
            await this.onSelect(this.pageParams)
        }
        this.refresh()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    refresh = async () => {
        await this.getLeftTreeData()
        this.refreshDetail()
    }

    refreshDetail = () => {
        let { treeData, selectedTable } = this.state
        if (selectedTable.systemId) {
            this.onSelect(selectedTable)
        } else {
            this.onSelect(treeData.length ? treeData[0] : {})
        }
    }

    getLeftTreeData = async () => {
        let { selectedTable } = this.state
        this.setState({ treeLoading: true })
        let res = await estimateSystemTree({})
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            let hasData = false
            res.data.map((item) => {
                if (item.systemId == selectedTable.systemId) {
                    hasData = true
                }
                item.cNameCompleteRate = item.cNameCompleteRate ? parseFloat(item.cNameCompleteRate.split('%')[0]).toFixed(2) : 0
            })
            this.polling(res.data)
            if (!hasData) {
                await this.onSelect({})
            }
            await this.setState({
                treeData: _.cloneDeep(res.data),
                treeDataCopy: _.cloneDeep(res.data),
            })
        }
    }

    polling = (list) => {
        clearTimeout(this.timer)
        const res = list.filter((item) => !item.isComplete)
        if (res.length > 0) {
            this.timer = setInterval(() => {
                this.getSystemtree()
            }, 500)
        }
    }

    getSystemtree = async () => {
        let res = await estimateSystemTree({})
        if (res.code === 200) {
            const list = res.data.filter((item) => !item.isComplete)
            if (list.length > 0) {
                res.data.map((item) => {
                    item.cNameCompleteRate = item.cNameCompleteRate ? parseFloat(item.cNameCompleteRate.split('%')[0]).toFixed(2) : 0
                })
                await this.setState({
                    treeData: _.cloneDeep(res.data),
                    treeDataCopy: _.cloneDeep(res.data),
                })
            } else {
                this.refresh()
                clearTimeout(this.timer)
            }
        }
    }

    changeSearchValue = (e) => {
        const { treeDataCopy } = this.state
        const searchkey = e.target.value
        this.setState({ searchkey: searchkey, treeData: treeDataCopy.filter((data) => data.systemName.indexOf(searchkey) > -1) })
        document.querySelector('.tableArea').scrollTop = 0
        // await this.setState({
        //     treeData: [],
        // })
        // await this.getLeftTreeData()
        // let { treeData, selectedTable } = this.state
        // if (!selectedTable.systemId) {
        //     this.onSelect(treeData.length ? treeData[0] : {})
        // }
    }

    onSelect = async (data) => {
        await this.setState({
            selectedTable: { ...data },
        })
        const storage = getStorage() || {}
        storage.selectedTable = data
        setStorage(storage)
        this.props.getSelectSystemData(data)
    }

    onClickMenu = (data, e) => {
        e.domEvent.stopPropagation()
        if (e.key == 1) {
            this.executeEstimate(data.systemId)
        } else if (e.key == 2) {
            this.props.openValutareConfig()
        } else if (e.key == 3) {
            let _that = this
            Modal.confirm({
                title: '删除评估系统',
                icon: <ExclamationCircleFilled />,
                content: '删除将包括该系统历史统计',
                okText: '删除',
                cancelText: '取消',
                okButtonProps: {
                    danger: true,
                },
                async onOk() {
                    _that.deleteEstimateInfo(data.systemId)
                },
            })
        }
    }

    executeEstimate = async (systemId) => {
        const res = await executeEstimate({ systemId })
        if (res.code === 200) {
            message.success('执行成功')
            this.refresh()
        }
    }

    deleteEstimateInfo = async (systemId) => {
        const res = await deleteEstimateInfo({ systemId })
        if (res.code === 200) {
            message.success('删除成功')
            this.refresh()
        }
    }

    openModal = () => {
        this.systemRef.openModal()
    }

    render() {
        const { treeData, treeDataCopy, treeLoading, isTreeSearch, selectedTable, searchkey } = this.state
        const menu = (data) => (
            <Menu style={{ minWidth: '110px' }} onClick={(e) => this.onClickMenu(data, e)}>
                <Menu.Item key='1'>立即执行</Menu.Item>
                <Menu.Item key='2'>评估标准配置</Menu.Item>
                <Menu.Item key='3'>
                    <span style={{ color: '#CC0000' }}>删除</span>
                </Menu.Item>
            </Menu>
        )
        // let showCnameCompleteRate = treeQueryInfo.indexma.includes(0)
        return (
            <div className='systemList_body'>
                <div className='slider'>
                    <div className='leftHeader'>
                        <div className='headerTitle'>评估系统列表</div>
                        <span style={{ marginTop: 2 }}>
                            <Tooltip title='添加系统'>
                                <span onClick={this.openModal} className='plusOutlined_wrap'>
                                    <PlusOutlined />
                                </span>
                            </Tooltip>

                            <AddAssessmentSystem
                                wrappedComponentRef={(node) => {
                                    this.systemRef = node
                                }}
                                refresh={this.refresh}
                            />
                        </span>
                    </div>
                    <div className='HideScroll tableArea'>
                        {treeDataCopy.length ? (
                            <div className='searchGroup'>
                                <span className='icon-sousuo iconfont'></span>
                                <Input.Search onChange={this.changeSearchValue} placeholder='系统名称' />
                            </div>
                        ) : null}

                        {treeData.length || searchkey ? (
                            <div className='tree_body HideScroll'>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ? (
                                        <div>
                                            {treeData.map((item, index) => {
                                                return (
                                                    <div onClick={this.onSelect.bind(this, item)} className={selectedTable.systemId == item.systemId ? 'tableItem tableItemSelected' : 'tableItem'}>
                                                        <div className='systemTitle'>
                                                            <img src={item.systemIcon} />
                                                            <span className='systemName'> {item.systemName}</span>
                                                            <span className='systemRate'>{item.estimatePassRate || 0}%</span>
                                                            <span className='desc'>评估通过率</span>
                                                        </div>
                                                        <div className='progressArea'>
                                                            {item.isComplete ? (
                                                                <span className='tagName' style={{ color: '#5B7FA3' }}>
                                                                    评估完成
                                                                </span>
                                                            ) : (
                                                                <span className='tagName' style={{ color: '#4081FF' }}>
                                                                    正在评估...
                                                                </span>
                                                            )}

                                                            <Dropdown overlay={menu(item)} trigger={['click']} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                                                <span onClick={(e) => e.stopPropagation()} className='iconfont icon-more' style={{ right: '35px' }}></span>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: 80, textAlign: 'center', color: '#C4C8CC' }}>- 暂无数据 -</div>
                                    )}
                                </Spin>
                            </div>
                        ) : (
                            <Spin spinning={treeLoading}>
                                <Empty
                                    style={{ margin: '80px 0 0 0' }}
                                    image={<img src={require('app_images/dataCompare/empty_icon.png')} />}
                                    description={<span style={{ fontFamily: 'PingFangSC-Medium, PingFang SC', fontWeight: '500' }}>暂无数据</span>}
                                    imageStyle={{
                                        height: 120,
                                    }}
                                >
                                    <div style={{ color: '#5E6266' }}>
                                        你可以 <a onClick={() => this.openModal()}>添加系统</a>
                                    </div>
                                </Empty>
                            </Spin>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
