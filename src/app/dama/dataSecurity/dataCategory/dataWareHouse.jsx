import EmptyLabel from '@/component/EmptyLabel'
import PermissionManage from '@/utils/PermissionManage'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Menu, message, Modal, Select, Spin, Tag } from 'antd'
import { dataSecurityLevelList, dataWarehouseTree, delDataWarehouseTree, sortNodes, suggestPath } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import DataWareEditDrawer from './component/dataWareEditDrawer'
import DataWareDetailDrawer from './component/detailDrawer'
import DataCategoryPreview from './component/preview'
import CategorySortDrawer from './component/sortDrawer'
import TopicFieldMapping from './component/TopicFieldMapping'
import './index.less'

export default class DataCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPreview: false,
            queryInfo: {
                keyword: '',
                treeCode: '',
                page: 1,
                pageSize: 1000,
            },
            selectSuggest: undefined,
            selectedPath: [],
            loading: false,
            delInfo: {},
            selectedItem: [],
            selectedTitle: [],
            showTreeData: false,
            modalVisible: false,
            checkDelete: false,
            filterList: ['交易业务参数信息 > 交易业务参数信息'],
            treeData: [],
            delLoading: false,
            treeId: '',
            suggestList: [],
            levelList: [],
            showSelectDropdown: false,
            // treeData: []

            checked: false,
        }
    }
    componentWillMount = async () => {
        await this.getBizTree()
        this.getSuggestPath()
        this.getDataSecurityLevelList()
    }
    getBizTree = async () => {
        let { queryInfo, checked } = this.state
        this.setState({ loading: true })
        let res = await dataWarehouseTree({ attrFilter: checked })
        this.setState({ loading: false })
        if (res.code == 200) {
            queryInfo.treeCode = res.data.code
            this.setState({
                treeId: res.data.id,
                queryInfo,
                treeData: res.data.children,
                // showPreview: res.data.children.length ? false : true
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
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data,
            })
        }
    }
    getSuggestPath = async () => {
        let { queryInfo, checked } = this.state
        let res = await suggestPath({
            ...queryInfo,
            attrFilter: checked,
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
                if (item.businessTag == 3) {
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
            <div>
                <div className='dropdownTitle'>
                    搜索到<span>{suggestList.length}</span>个结果
                </div>
                {menu}
            </div>
        )
    }
    onClickMenu = (data, index, e) => {
        const { treeData } = this.state
        if (e.key == 1) {
            this.dataWareDetailDrawer && this.dataWareDetailDrawer.openModal(data)
        } else if (e.key == 2) {
            this.openMapping(data)
        } else {
            if (data.directSourceCount) {
                message.info('该分类被引用，不能删除')
                return
            }
            this.deleteData(data)
        }
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i = 0; i < levelList.length; i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
    }
    renderTreeItem = (level) => {
        let { treeData, selectedItem, selectedTitle } = this.state
        let array = []
        if (level == 1) {
            array = [...treeData]
        } else {
            array = selectedItem[level - 2].children
        }
        array = array !== undefined ? array : []
        const menu = (data, index) => (
            <Menu style={{ width: 130 }} onClick={this.onClickMenu.bind(this, data, index)}>
                <Menu.Item key='1'>详情</Menu.Item>
                {PermissionManage.hasFuncPermission('/dt_classification/def/dw_sub/edit') && <Menu.Item key='2'>编辑业务信息</Menu.Item>}
                {PermissionManage.hasFuncPermission('/dt_classification/def/dw_sub/delete') && (
                    <Menu.Item key='3'>
                        <span style={{ color: '#CC0000' }}>删除</span>
                    </Menu.Item>
                )}
            </Menu>
        )
        return (
            <div className='itemContent HideScroll'>
                {array.map((item) => {
                    return (
                        <div className={(selectedTitle[level - 1] ? selectedTitle[level - 1].name : undefined) == item.name ? 'itemDiv itemDivSelected' : 'itemDiv'}>
                            <div className='itemTitle' onClick={this.selectTree.bind(this, item)}>
                                {item.businessTag == 2 && item.securityLevel ? (
                                    <Tag
                                        color={
                                            item.securityLevel == 1 ? 'blue' : item.securityLevel == 2 ? 'geekblue' : item.securityLevel == 3 ? 'purple' : item.securityLevel == 4 ? 'orange' : 'red'
                                        }
                                    >
                                        {this.getLevelDesc(item.securityLevel)}
                                    </Tag>
                                ) : null}
                                <span className='titleValue'>
                                    {!item.attributionCompletion && <span className='titleCompletion' />}
                                    {item.businessTag == 1 ? <img width={14} height={14} src={(item.bizInfo || {}).icon} /> : <span className={`iconfont icon-wenjian1 business${item.businessTag}`} />}
                                    {item.name}
                                </span>
                                {item.businessTag !== 1 && (
                                    <Dropdown overlay={menu(item, level - 1)} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                        <span className='iconfont icon-more' style={{ right: level != 1 && item.businessTag == 3 ? '19px' : '35px' }}></span>
                                    </Dropdown>
                                )}
                                <span className='titleIcon'>{level != 1 && item.businessTag == 3 ? null : <span className='iconfont icon-you' style={{ marginLeft: 4 }}></span>}</span>
                            </div>

                            {(selectedTitle[level - 1] ? selectedTitle[level - 1].name : undefined) == item.name ? (
                                <div className='itemDesc'>
                                    {item.businessTag == 1 && (
                                        <div>
                                            <label>系统ID：</label>
                                            <span style={{ width: 180 }}>
                                                {/* <AutoTip content={item.objectId || <EmptyLabel/>} /> */}
                                                {item.objectId || <EmptyLabel />}
                                            </span>
                                        </div>
                                    )}
                                    {item.businessTag == 2 && (
                                        <React.Fragment>
                                            <div>
                                                <label>业务归属部门：</label>
                                                <span style={{ width: 150 }}>
                                                    {/* <AutoTip content={item.businessDepartmentNames || <EmptyLabel/>} /> */}
                                                    {item.businessDepartmentNames || <EmptyLabel />}
                                                </span>
                                            </div>
                                            <div>
                                                <label>业务负责人：</label>
                                                <span style={{ width: 155 }}>
                                                    {/* <AutoTip content={item.businessManager || <EmptyLabel/>} /> */}
                                                    {item.businessManager || <EmptyLabel />}
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    <div>
                                        <label>描述：</label>
                                        <span style={{ width: 190 }}>
                                            {/* <AutoTip content={item.description || <EmptyLabel/>} /> */}
                                            {item.description || <EmptyLabel />}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )
                })}
                {!array.length ? <div className='emptyLabel'>暂无信息</div> : null}
            </div>
        )
    }
    selectTree = (data) => {
        let { selectedItem, selectedTitle } = this.state
        if (data.businessTag == 3) {
            if (selectedItem.length < data.level) {
                if (selectedTitle.length == data.level) {
                    selectedTitle[selectedTitle.length - 1] = data
                } else {
                    selectedTitle.push(data)
                }
                this.setState({
                    selectedTitle,
                })
            } else {
                let array = []
                for (let i = 0; i < data.level - 1; i++) {
                    array.push(selectedItem[i])
                }
                selectedItem = [...array]
                selectedTitle = [...array]
                selectedTitle.push(data)
                this.setState({
                    selectedItem,
                    selectedTitle,
                })
            }
            return
        }
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
        this.dataWareEditDrawer && this.dataWareEditDrawer.openAddModal(parentInfo, treeData)
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
        await this.setState({
            delInfo: data,
        })
        const that = this
        Modal.confirm({
            title: `删除“${data.name || ''}”`,
            content: '是否确认删除分类',
            okText: '删除',
            cancelText: '取消',
            okType: 'danger',
            okButtonProps: { type: 'primary', loading: this.state.delLoading },
            onOk() {
                that.confirmDelete()
            },
        })
    }
    confirmDelete = async () => {
        this.setState({ delLoading: true })
        let res = await delDataWarehouseTree({ id: this.state.delInfo.id })
        this.setState({ delLoading: false })
        if (res.code == 200) {
            message.success('删除成功')
            this.onCancel()
            this.reload()
        }
    }
    changePreviewStatus = async () => {
        this.setState({
            showPreview: false,
        })
        this.getBizTree()
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
        let res = await sortNodes(query)
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
    checkChange = (e) => {
        const that = this
        this.setState(
            {
                checked: e.target.checked,
                selectedItem: [],
                selectedTitle: [],
            },
            () => {
                that.getBizTree()
            }
        )
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

    getTitle = (level) => {
        if (level <= 1) {
            return '数仓系统'
        }
        if (level == 2) {
            return '数仓主题'
        }
        if (level == 3) {
            const current = this.getCurrentRenderData(level)
            if (current.length <= 0) {
                const prev = this.state.selectedItem[level - 2]
                return prev.businessTag == 2 && prev.hasChild ? '数仓主题' : '业务过程'
            } else {
                const target = current[0]
                return target.businessTag == 2 ? '数仓主题' : '业务过程'
            }
        }
        if (level == 4) {
            return '业务过程'
        }
    }

    blur = () => {
        const { suggestList, selectSuggest } = this.state
        if (!selectSuggest) {
            this.setState({
                suggestList: [],
            })
        }
    }

    openMapping(target, parentSystem) {
        this.setState({
            openMapping: true,
            mappingTarget: target,
            mappingParentSystem: parentSystem,
        })
    }

    render() {
        const {
            selectedPath,
            openMapping,
            mappingTarget,
            mappingParentSystem,
            suggestList,
            selectSuggest,
            treeData,
            selectedItem,
            selectedTitle,
            showPreview,
            modalVisible,
            checkDelete,
            loading,
            delLoading,
            showSelectDropdown,
        } = this.state
        let renderLength = []
        for (let i = 0; i < selectedItem.length + 1; i++) {
            if (i == 0 || i == 1) {
                renderLength.push(' ')
            } else {
                // 新的逻辑看上级是否有hasChild
                const prev = selectedItem[i - 1]
                if (prev.hasChild || prev.businessTag == 2) {
                    renderLength.push(' ')
                }
            }
        }
        const that = this
        return (
            <div className='dataCategory'>
                <Spin spinning={loading}>
                    {showPreview ? (
                        <DataCategoryPreview changePreviewStatus={this.changePreviewStatus} />
                    ) : (
                        <div>
                            <div className='dataTitle'>
                                数仓主题配置
                                <span>
                                    <Checkbox onChange={this.checkChange}>仅显示未完善</Checkbox>
                                </span>
                            </div>
                            <div style={{ width: 280 }}>
                                <Select
                                    allowClear
                                    showSearch
                                    className='categorySelect'
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    style={{ minWidth: '280px', width: 'auto', margin: '18px 0 16px 0' }}
                                    dropdownClassName={showSelectDropdown ? 'categoryDropdown' : 'categoryDropdown hideDropdown'}
                                    placeholder='请输入主题/业务过程名称'
                                    value={selectSuggest}
                                    onChange={this.clearInput}
                                    dropdownRender={this.renderDropdown}
                                    suffixIcon={<span className='iconfont icon-sousuo'></span>}
                                    onFocus={this.blur}
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
                                {renderLength.map((item, index) => {
                                    return (
                                        <div className='categoryItem'>
                                            <div className={selectedTitle[index] ? 'itemHeader' : 'itemHeader itemHeaderGrey'}>
                                                {selectedTitle[index] ? selectedTitle[index].name : that.getTitle(index + 1)}
                                            </div>
                                            {this.renderTreeItem(index + 1)}
                                            {/* 新增映射按钮，只有一级主题域有（第2列） */}
                                            <div className={`itemFooter ${index === 1 ? '' : 'footerHide'} ${that.getCurrentRenderData(index + 1).length > 0 ? '' : 'footerHide'}`}>
                                                {PermissionManage.hasFuncPermission('/dt_classification/def/dw_sub/add') && (
                                                    <div onClick={() => this.openMapping(undefined, selectedItem[0])}>
                                                        <PlusOutlined />
                                                        添加主题映射
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </Spin>
                <TopicFieldMapping
                    open={openMapping}
                    target={mappingTarget}
                    parentSystem={mappingParentSystem}
                    onSuccess={() => {
                        this.setState({ openMapping: false })
                        this.reload()
                    }}
                    onCancel={() => this.setState({ openMapping: false })}
                />
                <DataWareDetailDrawer type='dataWare' ref={(dom) => (this.dataWareDetailDrawer = dom)} />
                <DataWareEditDrawer treeData={treeData} reload={this.reload} ref={(dom) => (this.dataWareEditDrawer = dom)} />
                <CategorySortDrawer getSortData={this.getSortData} ref={(dom) => (this.categorySortDrawer = dom)} />
                <Modal title='删除编目' visible={modalVisible} footer={null} onCancel={this.onCancel} width={640} className='deleteCategpryModal'>
                    {modalVisible ? (
                        <div>
                            <div style={{ margin: '16px 24px 24px 24px' }}>
                                <div className='catalogTitle'>重要提示</div>
                                <div className='catalogDesc'>1. 删除分类时将同时删除该分类下子级的所有信息。</div>
                                <div className='catalogDesc'>2. 删除分类是不可逆的操作。</div>
                                <div className='catalogDesc'>3. 删除分类，将影响相关业务的分类信息，包括但不限于业务分类，表分类。操作前，请确认所有数据已妥善处理，建议您谨慎操作。</div>
                            </div>
                            <div className='footer'>
                                <Checkbox checked={checkDelete} onChange={this.changeCheckbox}>
                                    我已充分了解提示信息
                                </Checkbox>
                                <div style={{ float: 'right' }}>
                                    <Button onClick={this.onCancel}>取消</Button>
                                    <Button loading={delLoading} onClick={this.confirmDelete} disabled={!checkDelete} style={{ marginLeft: 8 }} type='danger'>
                                        确认删除
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </Modal>
            </div>
        )
    }
}
