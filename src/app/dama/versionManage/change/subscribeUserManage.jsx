import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, message, Popconfirm, Select, Tooltip } from 'antd'
import { manageSubscribe, manageSubscribeFilter, pushTypes, removeSubsUser, schemaDiffTree } from 'app_api/autoManage'
import React from 'react'
import AddUserDrawer from './component/addUserDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import './index.less'
let firstChild = {}
export default class Catalog extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            treeData: [],
            isDataWarehouse: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            departmentList: [],
            typeList: [],
        }
        this.selectedRows = []
        this.columns = [
            {
                title: '用户',
                dataIndex: 'userName',
                key: 'userName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '部门',
                dataIndex: 'deptNameAll',
                key: 'deptNameAll',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '接收方式',
                dataIndex: 'pushTypesDesc',
                key: 'pushTypesDesc',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '接收时间',
                dataIndex: 'triggerTime',
                key: 'triggerTime',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.getTreeData()
        this.getPushTypes()
    }
    getFilter = async () => {
        let { selectedTagCategory } = this.state
        let res = await manageSubscribeFilter({ datasourceId: selectedTagCategory.id })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    getTreeData = async () => {
        let res = await schemaDiffTree()
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
            })
            await this.getFirstChild(res.data[0].children)
            this.systemTree && this.systemTree.getTreeData(this.state.treeData, [this.state.selectedTagCategory.id], true)
            this.search()
            this.getFilter()
        }
    }
    getFirstChild(val) {
        if (JSON.stringify(firstChild) != '{}') {
            return //如果res不再是空对象，退出递归
        } else {
            //遍历数组
            for (let i = 0; i < val.length; i++) {
                //如果当前的isleaf是true,说明是叶子节点，把当前对象赋值给res,并return，终止循环
                if (val[i].type == 1) {
                    firstChild = val[i]
                    this.setState({
                        selectedTagCategory: val[i],
                        isDataWarehouse: val[i].dataWarehouse,
                    })
                    return
                } else if (!val[i].children) {
                    //如果chidren为空，则停止这次循环
                    break
                } else {
                    //否则的话，递归当前节点的children
                    this.getFirstChild(val[i].children)
                }
            }
        }
    }
    onSelect = async (selectedKeys, e) => {
        console.log(selectedKeys, e)
        let { isDataWarehouse } = this.state
        let selectedTagCategory = {}
        if (e.selectedNodes.length > 0) {
            let selectedNode = e.selectedNodes[0]
            selectedTagCategory = selectedNode
            isDataWarehouse = selectedNode.dataWarehouse
        }
        await this.setState({
            selectedTagCategory,
            isDataWarehouse,
        })
        this.reset()
        this.getFilter()
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTagCategory } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: selectedTagCategory.id,
        }
        let res = await manageSubscribe(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.pushTypes = item.pushTypes ? item.pushTypes : []
                item.pushTypesDesc = ''
                item.pushTypes.map((node, index) => {
                    item.pushTypesDesc += this.getPushTypesDesc(node) + (index + 1 == item.pushTypes.length ? '' : '、')
                })
            })
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getPushTypesDesc = (value) => {
        let { typeList } = this.state
        for (let i = 0; i < typeList.length; i++) {
            if (typeList[i].id == value) {
                return typeList[i].name
            }
        }
    }
    getPushTypes = async () => {
        let res = await pushTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
        this.selectController.updateSelectedKeys([])
    }
    deleteData = async (data) => {
        let { selectedTagCategory } = this.state
        let query = {
            datasourceId: selectedTagCategory.id,
            userIds: data,
        }
        let res = await removeSubsUser(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.search()
            this.getFilter()
        }
    }
    openAddUserPage = () => {
        this.addUserDrawer && this.addUserDrawer.openModal(this.state.selectedTagCategory)
    }
    render() {
        const { selectedTagCategory, tableData, queryInfo, departmentList, treeData } = this.state
        return (
            <SliderLayout
                className='subscribeUserManage'
                style={{ height: '100%' }}
                renderSliderHeader={() => {
                    return '系统目录'
                }}
                renderContentHeader={() => {
                    return (
                        <div style={{ width: '100%', lineHeight: '32px' }}>
                            订阅人员
                            <PermissionWrap funcCode='/md/changes/subscribe/user_manage/add'>
                                <Button onClick={this.openAddUserPage} style={{ float: 'right' }} type='primary'>
                                    添加订阅人员
                                </Button>
                            </PermissionWrap>
                        </div>
                    )
                }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderBody={() => {
                    return ProjectUtil.renderSystemTree(treeData, this.onSelect)
                }}
                renderContentBody={() => {
                    return (
                        <div>
                            {selectedTagCategory.id ? (
                                <RichTableLayout
                                    className={!tableData.length ? 'replaceEmptyIcon' : ''}
                                    disabledDefaultFooter
                                    editColumnProps={{
                                        width: 100,
                                        createEditColumnElements: (_, record) => {
                                            return [
                                                <PermissionWrap funcCode='/md/changes/subscribe/user_manage/delete'>
                                                    <Popconfirm title='是否确定移出订阅' onConfirm={this.deleteData.bind(this, [record.userId])} okText='移出' cancelText='取消'>
                                                        <a>移出订阅</a>
                                                    </Popconfirm>
                                                </PermissionWrap>,
                                            ]
                                        },
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'userId',
                                        selectedEnable: true,
                                    }}
                                    renderSearch={(controller) => {
                                        this.controller = controller
                                        return (
                                            <React.Fragment>
                                                <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入用户名' />
                                                <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'deptId')} value={queryInfo.deptId} placeholder='部门'>
                                                    {departmentList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Button onClick={this.reset}>重置</Button>
                                            </React.Fragment>
                                        )
                                    }}
                                    requestListFunction={(page, pageSize, filter, sorter) => {
                                        return this.getTableList({
                                            pagination: {
                                                page,
                                                page_size: pageSize,
                                            },
                                        })
                                    }}
                                    renderFooter={(controller, defaultRender) => {
                                        let { selectedRows, selectedKeys } = controller
                                        this.selectController = controller
                                        return (
                                            <div style={{ width: '100%' }}>
                                                <PermissionWrap funcCode='/md/changes/subscribe/user_manage/delete'>
                                                    <Button style={{ marginRight: 16 }} type='primary' onClick={this.deleteData.bind(this, selectedKeys)}>
                                                        批量移出订阅
                                                    </Button>
                                                </PermissionWrap>

                                                {defaultRender()}
                                            </div>
                                        )
                                    }}
                                />
                            ) : null}
                            {!tableData.length ? (
                                <div className='title' style={{ margin: '24px 0' }}>
                                    <EmptyIcon
                                        description={
                                            <div>
                                                暂无人员订阅该数据源变更，可
                                                <PermissionWrap funcCode='/md/changes/subscribe/user_manage/add'>
                                                    <a onClick={this.openAddUserPage}>添加订阅人员</a>
                                                </PermissionWrap>
                                            </div>
                                        }
                                    />
                                </div>
                            ) : null}
                            <AddUserDrawer getFilter={this.getFilter} search={this.search} ref={(dom) => (this.addUserDrawer = dom)} />
                        </div>
                    )
                }}
            />
        )
    }
}
