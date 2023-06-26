import PermissionManage from '@/utils/PermissionManage'
import { PlusOutlined, SwapOutlined } from '@ant-design/icons'
import { Dropdown, Menu, message, Modal, Select, Spin } from 'antd'
import { sortNodes, suggestPath } from 'app_api/dataSecurity'
import { deleteTreeNode, getNodeSourceCountByNodeId, getStandardTree } from 'app_api/systemManage'
import React, { Component } from 'react'
import CategoryEditDrawer from './component/editDrawer'
import CategorySortDrawer from './component/sortDrawer'
import './index.less'

const maxlevel = 5
export default class DataCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
                treeCode: '',
                page: 1,
                pageSize: 1000,
            },
            selectSuggest: undefined,
            selectedPath: [],
            loading: false,
            selectedItem: [],
            selectedTitle: [],
            showTreeData: false,
            checkDelete: false,
            filterList: ['交易业务参数信息 > 交易业务参数信息'],
            treeData: [],
            delLoading: false,
            treeId: '',
            suggestList: [],
            levelList: [],
            showSelectDropdown: false,
        }
    }
    componentWillMount = async () => {
        await this.getBizTree()
        this.getSuggestPath()
    }
    getBizTree = async () => {
        let { queryInfo } = this.state
        this.setState({ loading: true })
        let res = await getStandardTree({ code: 'ZT002', status: 0 })
        this.setState({ loading: false })
        if (res.code == 200) {
            queryInfo.treeCode = res.data.code
            this.setState({
                treeId: res.data.id,
                queryInfo,
                treeData: res.data.children,
            })
        }
    }
    reload = async () => {
        await this.getBizTree()
        this.getSuggestPath()
        let { selectedItem, treeData, selectedTitle } = this.state
        let selectedpath = []
        selectedTitle.map((item) => {
            selectedpath.push(item.id)
        })
        await this.setState({ selectedItem: [], selectedTitle: [] })
        selectedpath.map((item) => {
            this.getTreeData(treeData, item)
        })
    }

    getSuggestPath = async () => {
        let { queryInfo } = this.state
        let res = await suggestPath({
            ...queryInfo,
        })
        if (res.code == 200) {
            res.data.map((item) => {
                item.pathNameDesc = item.nodeNames ? item.nodeNames.join(' > ') : ''
                item.nodeIdString = item.nodeIds ? item.nodeIds.join(',') : ''
            })
            this.setState({
                suggestList: res.data,
            })
        }
    }
    clearInput = async (e, node) => {
        if (e == undefined) {
            await this.setState({
                selectSuggest: e,
                selectedPath: [],
                selectedItem: [],
                selectedTitle: [],
            })
            this.handleSearch('')
        } else {
            await this.setState({
                selectSuggest: e,
                selectedPath: node.props.nodeIds,
            })
        }
        this.getSelectedItem()
    }
    getSelectedItem = async () => {
        let { selectedPath, treeData } = this.state
        await this.setState({ selectedItem: [], selectedTitle: [] })
        selectedPath.map((item) => {
            this.getTreeData(treeData, item)
        })
    }
    getTreeData = (treeData, id) => {
        let { selectedItem, selectedTitle } = this.state
        treeData.map((item) => {
            if (item.id == id) {
                if (item.children.length === 0) {
                    selectedItem.push(item)
                    if (selectedTitle.length == item.level) {
                        selectedTitle[selectedTitle.length - 1] = item
                    } else {
                        selectedTitle.push(item)
                    }
                    this.setState({
                        selectedTitle,
                    })
                } else {
                    selectedItem.push(item)
                    this.setState({
                        selectedTitle: [...selectedItem],
                    })
                }
                this.setState({
                    selectedItem,
                })
                let categoryContent = document.querySelector('.categoryContent')
                categoryContent.style.maxWidth = (selectedItem.length + 1) * 280 + 'px'
            } else {
                if (item.children.length) {
                    this.getTreeData(item.children, id)
                }
            }
        })
    }
    renderDropdown = (menu) => {
        let { suggestList } = this.state
        return (
            <React.Fragment>
                <div className='dropdownTitle'>
                    搜索到<span>{suggestList.length}</span>个结果
                </div>
                {menu}
            </React.Fragment>
        )
    }
    onClickMenu = (data, index, e) => {
        const { treeData } = this.state
        if (e.key == 1) {
            let { treeData, selectedItem, treeId } = this.state
            let parentInfo = { treeId }
            if (index) {
                parentInfo = selectedItem[index - 1]
            }
            this.categoryEditDrawer && this.categoryEditDrawer.openEditModal(parentInfo, data, treeData)
        } else {
            this.deleteData(data)
        }
    }

    renderTreeItem = (level) => {
        let { treeData, selectedItem, selectedTitle } = this.state
        let array = []
        if (level == 1) {
            array = [...treeData]
        } else {
            if (selectedItem[level - 2].children.length === 0) {
                array = []
            } else {
                array = selectedItem[level - 2].children
            }
        }
        array = array !== undefined ? array : []
        const menu = (data, index) => (
            <Menu onClick={this.onClickMenu.bind(this, data, index)}>
                {PermissionManage.hasFuncPermission('/dtstd/categroy/edit') && <Menu.Item key='1'>编辑</Menu.Item>}
                {PermissionManage.hasFuncPermission('/dtstd/categroy/delete') && (
                    <Menu.Item key='2'>
                        <span style={{ color: '#CC0000' }}>删除</span>
                    </Menu.Item>
                )}
            </Menu>
        )
        return (
            <div className={`itemContent HideScroll ${level === 1 ? 'borderBottom' : ''}`}>
                {array.map((item) => {
                    return (
                        <div className={(selectedTitle[level - 1] ? selectedTitle[level - 1].name : undefined) == item.name ? 'itemDiv itemDivSelected' : 'itemDiv'}>
                            <div className='itemTitle' onClick={this.selectTree.bind(this, item)}>
                                <span className='titleValue'>
                                    {level === 1 ? (
                                        <img style={{ width: 14, height: 14, borderRadius: 1, marginTop: 1 }} src={item.description} />
                                    ) : level === 2 && !(selectedTitle[0] && selectedTitle[0].name === '代码标准') ? (
                                        <span className='iconfont icon-shujuyu' />
                                    ) : (
                                        <span className='iconfont icon-fenlei' />
                                    )}
                                    {item.name}
                                </span>
                                {level > 1 && (
                                    <Dropdown overlay={menu(item, level - 1)} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                        <span className='iconfont icon-more' style={{ right: item.level >= maxlevel ? '19px' : '35px' }}></span>
                                    </Dropdown>
                                )}
                                <span className='titleIcon'>{item.level >= maxlevel ? null : <span className='iconfont icon-you' style={{ marginLeft: 4 }}></span>}</span>
                            </div>
                        </div>
                    )
                })}
                {!array.length ? (
                    <div className='emptyLabel'>暂无分类信息{PermissionManage.hasFuncPermission('/dtstd/categroy/add') && <a onClick={this.openAddDrawer.bind(this, level - 1)}>请添加分类</a>}</div>
                ) : null}
            </div>
        )
    }
    selectTree = (data) => {
        let { selectedItem, selectedTitle } = this.state
        if (selectedItem.length) {
            if (data.level == 1) {
                selectedItem = [data]
            } else {
                let array = []
                for (let i = 0; i < data.level - 1; i++) {
                    array.push(selectedItem[i])
                }
                array.push(data)
                selectedItem = [...array]
            }
        } else {
            selectedItem.push(data)
        }
        this.setState({
            selectedItem,
            selectedTitle: [...selectedItem],
        })
        // transition生效必须使用max-width
        let categoryContent = document.querySelector('.categoryContent')
        categoryContent.style.maxWidth = (selectedItem.length + 1) * 280 + 'px'
    }
    openAddDrawer = (index) => {
        let { treeData, selectedItem, treeId } = this.state
        let parentInfo = { treeId }
        if (index) {
            parentInfo = selectedItem[index - 1]
        }
        this.categoryEditDrawer && this.categoryEditDrawer.openAddModal(parentInfo, treeData)
    }
    openSortDrawer = (index) => {
        let { selectedItem, treeData } = this.state
        let data = []
        if (index) {
            data = selectedItem[index - 1].children
        } else {
            data = treeData
        }
        this.categorySortDrawer && this.categorySortDrawer.openModal(data)
    }
    deleteData = async (data) => {
        Modal.confirm({
            title: `删除“${data.name}”`,
            content: '是否确认删除分类',
            okText: '删除',
            cancelText: '取消',
            okType: 'danger',
            okButtonProps: { type: 'primary', loading: this.state.delLoading },
            onOk: () => {
                this.confirmDelete(data)
            },
        })
    }

    confirmDelete = (data) => {
        if (data.children.length) {
            message.error('删除失败，请先清空子节点')
            return
        }
        this.setState({ delLoading: true })
        getNodeSourceCountByNodeId({ id: data.id }).then((res) => {
            this.setState({ delLoading: false })
            if (res.code == 200) {
                if (res.data) {
                    message.error('删除失败，该分类正在使用')
                } else {
                    deleteTreeNode({ id: data.id }).then((response) => {
                        if (response.code == 200) {
                            message.success('删除成功')
                            this.onCancel()
                            this.reload()
                        } else {
                            message.error(response.msg)
                        }
                    })
                }
            }
        })
    }

    onCancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeCheckbox = (e) => {
        this.setState({
            checkDelete: e.target.checked,
        })
    }
    getSortData = async (data) => {
        let query = []
        data.map((item) => {
            query.push(item.id)
        })
        // this.setState({loading: true})
        let res = await sortNodes(query)
        // this.setState({loading: false})
        if (res.code == 200) {
            this.reload()
        }
    }
    handleSearch = async (value) => {
        let { queryInfo } = this.state
        queryInfo.keyword = value
        await this.setState({
            queryInfo,
            showSelectDropdown: true,
        })
        this.getSuggestPath()
    }

    getCurrentRenderData = (level) => {
        let { treeData, selectedItem, selectedTitle } = this.state
        let array = []
        if (level == 1) {
            array = [...treeData]
        } else {
            array = selectedItem[level - 2].children
        }
        array = array !== undefined ? array : []
        return array
    }

    blur = () => {
        const { suggestList, selectSuggest } = this.state
        if (!selectSuggest) {
            this.setState({
                suggestList: [],
            })
        }
    }

    getSelectedTitleName = (index) => {
        const { selectedItem, selectedTitle } = this.state
        return selectedTitle[index] ? selectedTitle[index].name : index === 0 ? '标准' : selectedTitle[0] && selectedTitle[0].name === '代码标准' ? '分类' : index > 1 ? '业务条线' : '数据域'
    }

    render() {
        const { selectedPath, suggestList, selectSuggest, treeData, selectedItem, selectedTitle, checkDelete, loading, delLoading, showSelectDropdown } = this.state
        let renderLength = []

        for (let i = 0; i < selectedItem.length + 1; i++) {
            renderLength.push(' ')
        }

        const that = this

        return (
            <div className='dataCategory'>
                <CategoryEditDrawer reload={this.reload} ref={(dom) => (this.categoryEditDrawer = dom)} />
                <CategorySortDrawer getSortData={this.getSortData} ref={(dom) => (this.categorySortDrawer = dom)} />
                <Spin spinning={loading}>
                    <div>
                        <div className='dataTitle'>标准分类</div>
                        <div style={{ width: 280 }}>
                            <Select
                                allowClear
                                showSearch
                                className='categorySelect'
                                filterOption={false}
                                onSearch={this.handleSearch}
                                style={{ minWidth: '280px', width: 'auto', margin: '18px 0 16px 0' }}
                                dropdownClassName={showSelectDropdown ? 'categoryDropdown' : 'categoryDropdown hideDropdown'}
                                placeholder='请输入标准名称'
                                value={selectSuggest}
                                onChange={this.clearInput}
                                dropdownRender={this.renderDropdown}
                                suffixIcon={<span className='iconfont icon-sousuo'></span>}
                                onFocus={this.blur}
                                dropdownStyle={{ height: 266 }}
                            >
                                {suggestList.map((item) => {
                                    return (
                                        <Select.Option nodeIds={item.nodeIds} key={item.nodeIdString} value={item.nodeIdString}>
                                            <span dangerouslySetInnerHTML={{ __html: item.pathNameDesc }}></span>
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className='categoryContent'>
                            {renderLength.slice(0, maxlevel).map((item, index) => {
                                console.log('selectedTitle', selectedTitle[index - 1])
                                return (
                                    <div className={`categoryItem`}>
                                        <div className={selectedTitle[index] ? 'itemHeader' : 'itemHeader itemHeaderGrey'}>{this.getSelectedTitleName(index)}</div>
                                        {this.renderTreeItem(index + 1)}
                                        {index >= 0 && (
                                            <div className={`itemFooter ${that.getCurrentRenderData(index + 1).length > 0 && index !== 0 ? '' : 'footerHide'}`}>
                                                {PermissionManage.hasFuncPermission('/dtstd/categroy/add') && (
                                                    <div onClick={this.openAddDrawer.bind(this, index)}>
                                                        <PlusOutlined />
                                                        添加
                                                    </div>
                                                )}
                                                {PermissionManage.hasFuncPermission('/dtstd/categroy/sort') && (
                                                    <div onClick={this.openSortDrawer.bind(this, index)}>
                                                        <SwapOutlined />
                                                        排序
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}
