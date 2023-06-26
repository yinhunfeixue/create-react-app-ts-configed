// 安全分类配置
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import LevelTag from '@/component/LevelTag'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'
import { DownloadOutlined, PlusOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, message, Modal, Select, Spin, Upload } from 'antd'
import { dataSecurityLevelList, delSecurityTree, eigenList, removeEigen, securityTree, sortEigen, sortNodes, suggestPath, updateDatasecurity } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import SecurityDetailDrawer from '../component/securityDetailDrawer'
import SecurityEditDrawer from '../component/securityEditDrawer'
import CategorySortDrawer from '../component/sortDrawer'
import '../index.less'

export default class SecuritySet extends Component {
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
            checkDelete: false,
            filterList: ['交易业务参数信息 > 交易业务参数信息'],
            treeData: [
                {
                    id: 1,
                    name: '一级分类',
                    level: 1,
                    hasChild: true,
                    businessTag: 1,
                    children: [
                        {
                            id: '1-1',
                            name: '二级分类',
                            level: 2,
                            hasChild: true,
                            businessTag: 1,
                            children: [
                                {
                                    id: '1-2',
                                    name: '三级分类',
                                    level: 3,
                                    hasChild: true,
                                    businessTag: 1,
                                    children: [
                                        {
                                            id: '1-3',
                                            name: '四级分类',
                                            level: 4,
                                            hasChild: true,
                                            businessTag: 1,
                                            children: [
                                                {
                                                    id: '1-4',
                                                    name: '五级分类',
                                                    level: 5,
                                                    hasChild: true,
                                                    businessTag: 1,
                                                    children: [
                                                        {
                                                            id: '1-5',
                                                            name: '六级分类',
                                                            level: 6,
                                                            hasChild: true,
                                                            businessTag: 1,
                                                            children: [
                                                                {
                                                                    id: '1-6',
                                                                    name: '七级分类',
                                                                    level: 7,
                                                                    hasChild: true,
                                                                    businessTag: 1,
                                                                    children: [
                                                                        {
                                                                            id: '1-7',
                                                                            name: '八级分类',
                                                                            level: 8,
                                                                            hasChild: true,
                                                                            businessTag: 1,
                                                                            children: [
                                                                                {
                                                                                    id: '1-8',
                                                                                    name: '九级分类',
                                                                                    level: 9,
                                                                                    hasChild: true,
                                                                                    businessTag: 1,
                                                                                    children: [
                                                                                        { id: '1-9', name: '特征', level: 10, businessTag: 2, children: [] },
                                                                                        { id: '1-9-1', name: '特征-1', level: 10, businessTag: 2, children: [] },
                                                                                        { id: '1-9-2', name: '特征-2', disabled: true, level: 10, businessTag: 2, children: [] },
                                                                                    ],
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: '1-1-2',
                            name: '二级分类1-1',
                            level: 2,
                            hasChild: false,
                            businessTag: 1,
                            children: [{ id: '1-9-2', name: '特征1-1', level: 3, businessTag: 2, children: [] }],
                        },
                    ],
                },
                {
                    id: 2,
                    name: '一级分类1',
                    level: 1,
                    hasChild: true,
                    businessTag: 1,
                    children: [
                        {
                            id: '2-1',
                            name: '二级分类1',
                            level: 2,
                            hasChild: true,
                            businessTag: 1,
                            children: [
                                {
                                    id: '2-2',
                                    name: '三级分类1',
                                    level: 3,
                                    hasChild: true,
                                    businessTag: 1,
                                    children: [
                                        {
                                            id: '2-3',
                                            name: '四级分类1',
                                            level: 4,
                                            hasChild: true,
                                            businessTag: 1,
                                            children: [
                                                {
                                                    id: '2-4',
                                                    name: '五级分类1',
                                                    level: 5,
                                                    hasChild: true,
                                                    businessTag: 1,
                                                    children: [
                                                        {
                                                            id: '2-5',
                                                            name: '六级分类1',
                                                            level: 6,
                                                            hasChild: true,
                                                            businessTag: 1,
                                                            children: [
                                                                {
                                                                    id: '2-6',
                                                                    name: '七级分类1',
                                                                    level: 7,
                                                                    hasChild: true,
                                                                    businessTag: 1,
                                                                    children: [
                                                                        {
                                                                            id: '2-7',
                                                                            name: '八级分类1',
                                                                            level: 8,
                                                                            hasChild: true,
                                                                            businessTag: 1,
                                                                            children: [
                                                                                {
                                                                                    id: '2-8',
                                                                                    name: '九级分类1',
                                                                                    level: 9,
                                                                                    hasChild: true,
                                                                                    businessTag: 1,
                                                                                    children: [{ id: '2-9', name: '特征1', level: 10, businessTag: 2, children: [] }],
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { id: 3, name: '一级分类2', level: 1, hasChild: false, businessTag: 1, children: [{ id: '3-9', name: '特征2', level: 2, businessTag: 2, children: [] }] },
            ],
            delLoading: false,
            treeId: '',
            suggestList: [],
            levelList: [],
            traitList: [],
            showSelectDropdown: false,
            businessTag: '1',
        }
    }
    componentWillMount = async () => {
        await this.getBizTree()
        this.getSuggestPath()
        this.getDataSecurityLevelList()
    }
    getBizTree = async () => {
        let { queryInfo } = this.state
        this.setState({ loading: true })
        let res = await securityTree()
        this.setState({ loading: false })
        if (res.code == 200) {
            queryInfo.treeCode = res.data.code
            this.setState({
                treeId: res.data.id,
                queryInfo,
                treeData: res.data.children,
                showPreview: res.data.children.length ? false : true,
            })
        }
    }
    getEigenList = async (selectedTitle, selecChange) => {
        console.log(selectedTitle, 'getEigenList')
        const { selectedPath } = this.state
        let matchItem
        if (selectedTitle[selectedTitle.length - 1].level == 9 || !selectedTitle[selectedTitle.length - 1].hasChild) {
            this.setState({ loading: true })
            let res = await eigenList({ classId: selectedTitle[selectedTitle.length - 1].id })
            this.setState({ loading: false })
            if (res.code == 200) {
                res.data.map((item) => {
                    item.businessTag = 2
                    item.name = item.eigenName
                    item.description = item.eigenDesc
                    item.securityLevel = item.level
                    item.level = selectedTitle.length + 1
                    if (item.id == selectedPath[selectedPath.length - 1]) {
                        matchItem = item
                    }
                })
                if (matchItem) {
                    matchItem.name = matchItem.eigenName
                }
                console.log('matchItem', matchItem)
                this.setState({
                    selectedTitle: [...selectedTitle, ...(!selecChange && matchItem ? [matchItem] : [])],
                    traitList: res.data,
                })
                this.triggerScroll()
            }
        }
    }

    triggerScroll() {
        this.setState({
            needScroll: true,
        })
    }

    scrollItemsIntoView() {
        const { selectedTitle } = this.state
        this.setState({ needScroll: false })
        selectedTitle.map((item) => {
            const { id } = item
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                })
            }
        })
    }

    componentDidUpdate() {
        const { needScroll } = this.state
        if (needScroll) {
            this.scrollItemsIntoView()
        }
    }

    reload = async () => {
        console.log('reload+++++')
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
        let { queryInfo } = this.state
        let res = await suggestPath(queryInfo)
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
        console.log(e, node, 'node++++')
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
        this.setState({ selectedItem: [], selectedTitle: [] })
        selectedPath.map((item) => {
            this.getTreeData(treeData, item)
        })
    }
    getTreeData = (treeData, id) => {
        let { selectedItem, selectedTitle } = this.state
        treeData.map((item) => {
            if (item.id == id) {
                if (item.businessTag == 2) {
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
                //console.log(selectedItem, 'getTreeData')
                this.getEigenList(selectedItem)
                this.triggerScroll()
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
        e.domEvent.stopPropagation()
        if (e.key == 1) {
            this.securityDetailDrawer && this.securityDetailDrawer.openModal(data)
        } else if (e.key == 2) {
            let { treeData, selectedItem, treeId } = this.state
            let parentInfo = { treeId }
            if (index) {
                parentInfo = selectedItem[index - 1]
            }
            this.securityEditDrawer && this.securityEditDrawer.openEditModal(parentInfo, data, selectedItem)
        } else {
            if (data.directSourceCount) {
                Modal.warning({
                    title: '删除分类',
                    content: '该分类被引用不可删除，请先取消数据关联。',
                })
            } else {
                this.deleteData(data)
            }
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
        let { treeData, selectedItem, selectedTitle, traitList, selectedPath } = this.state
        let array = []
        if (level == 1) {
            array = [...treeData]
        } else {
            if (selectedItem[level - 2].level == 9 || !selectedItem[level - 2].hasChild) {
                array = traitList
            } else {
                array = selectedItem[level - 2].children
            }
        }
        array = array !== undefined ? array : []
        const menu = (data, index) => (
            <Menu onClick={this.onClickMenu.bind(this, data, index)}>
                <Menu.Item key='1'>详情</Menu.Item>
                {PermissionManage.hasFuncPermission('/dt_calssification/def/securitySet/edit') && <Menu.Item key='2'>编辑</Menu.Item>}
                {PermissionManage.hasFuncPermission('/dt_calssification/def/securitySet/delete') && (
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
                        <div
                            id={item.id}
                            className={
                                (selectedTitle[level - 1] ? selectedTitle[level - 1].name : undefined) == item.name
                                    ? item.status == false
                                        ? 'itemDiv itemDivSelected itemDivDisabled'
                                        : 'itemDiv itemDivSelected'
                                    : item.status == false
                                    ? 'itemDivDisabled itemDiv'
                                    : 'itemDiv'
                            }
                        >
                            <div className='itemTitle' onClick={this.selectTree.bind(this, item)}>
                                {item.businessTag !== 2 ? <span style={{ color: '#F7B500', marginRight: 8 }} className='iconfont icon-wenjian1'></span> : null}
                                {(item.businessTag == 2 || !item.hasChild) && item.securityLevel ? <LevelTag value={item.securityLevel} /> : null}
                                <span className='titleValue'>{item.name}</span>
                                <Dropdown overlay={menu(item, level - 1)} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                    <span className='iconfont icon-more' style={{ right: item.businessTag == 2 ? '19px' : '35px' }}></span>
                                </Dropdown>
                                <span className='titleIcon'>{item.businessTag == 2 ? null : <span className='iconfont icon-you' style={{ marginLeft: 4 }}></span>}</span>
                            </div>

                            {(selectedTitle[level - 1] ? selectedTitle[level - 1].name : undefined) == item.name ? (
                                <div className='itemDesc'>
                                    <div>描述：{item.description || <EmptyLabel />}</div>
                                    {item.businessTag == 2 ? <div>敏感标签：{item.tagName || <EmptyLabel />}</div> : null}
                                </div>
                            ) : null}
                        </div>
                    )
                })}
                {!array.length ? (
                    <div className='emptyLabel'>
                        暂无分类信息<a onClick={this.openAddDrawer.bind(this, level - 1)}>请添加分类</a>
                    </div>
                ) : null}
            </div>
        )
    }
    selectTree = async (data) => {
        let { selectedItem, selectedTitle } = this.state
        if (data.businessTag == 2) {
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
                await this.setState({
                    selectedItem,
                    selectedTitle,
                })
                if (data.level == 9 || !data.hasChild) {
                    this.getEigenList(selectedItem, true)
                }
            }
            this.triggerScroll()
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
        await this.setState({
            selectedItem,
            selectedTitle: [...selectedItem],
        })
        if (data.level == 9 || !data.hasChild) {
            this.getEigenList(selectedItem, true)
        }
        // transition生效必须使用max-width
        let categoryContent = document.querySelector('.categoryContent')
        categoryContent.style.maxWidth = (selectedItem.length + 1) * 280 + 'px'
        this.triggerScroll()
    }
    openAddDrawer = (index) => {
        let { treeData, selectedItem, treeId } = this.state
        let parentInfo = { treeId }
        if (index) {
            parentInfo = selectedItem[index - 1]
        }
        //console.log('parentInfo', parentInfo, selectedItem);
        this.securityEditDrawer && this.securityEditDrawer.openAddModal(parentInfo, selectedItem)
    }
    openSortDrawer = (index) => {
        let { selectedItem, treeData, traitList } = this.state
        let data = []
        if (index) {
            if (selectedItem[index - 1].level == 9 || !selectedItem[index - 1].hasChild) {
                data = traitList
            } else {
                data = selectedItem[index - 1].children
            }
        } else {
            data = treeData
        }
        let businessTag = data[0] !== undefined ? data[0].businessTag : '1'
        this.setState({
            businessTag,
        })
        this.categorySortDrawer && this.categorySortDrawer.openModal(data, businessTag)
    }
    deleteData = async (data) => {
        await this.setState({
            delInfo: data,
        })
        if (data.childNodeCount) {
            Modal.warning({
                title: '删除分类',
                content: '请先清空子节点，再进行删除。',
                okText: '知道了',
                okType: 'default',
            })
        } else {
            let that = this
            Modal.confirm({
                title: data.businessTag !== 2 ? '删除分类' : '删除特征',
                content: data.businessTag !== 2 ? '您确定删除分类吗？' : '您确定删除特征吗？',
                okText: '删除',
                cancelText: '取消',
                okButtonProps: {
                    danger: true,
                },
                onOk() {
                    that.confirmDelete()
                },
            })
        }
    }
    confirmDelete = async () => {
        let { delInfo } = this.state
        this.setState({ delLoading: true })
        let res = {}
        if (delInfo.businessTag == '2') {
            res = await removeEigen({ eigenId: delInfo.id })
        } else {
            res = await delSecurityTree({ id: delInfo.id })
        }
        this.setState({ delLoading: false })
        if (res.code == 200) {
            message.success('删除成功')
            this.reload()
        }
    }
    changePreviewStatus = async () => {
        this.setState({
            showPreview: false,
        })
        await this.getBizTree()
        this.getSuggestPath()
    }
    changeCheckbox = (e) => {
        this.setState({
            checkDelete: e.target.checked,
        })
    }
    getSortData = async (data) => {
        let { businessTag } = this.state
        let query = []
        data.map((item) => {
            query.push(item.id)
        })
        let res = {}
        if (businessTag == '2') {
            res = await sortEigen(query)
        } else {
            res = await sortNodes(query)
        }
        if (res.code == 200) {
            console.log('getSortData++++')
            this.reload()
        }
    }
    handleSearch = async (value) => {
        console.log(value, 'handleSearch')
        let { queryInfo } = this.state
        queryInfo.keyword = value
        await this.setState({
            queryInfo,
            showSelectDropdown: true,
        })
        this.getSuggestPath()
    }
    renderEmpty() {
        return (
            <TableLayout
                className='securitySetEmpty'
                title='安全分类配置'
                renderDetail={() => {
                    return (
                        <div className='securitySetEmptyBody'>
                            <IconFont type='icon-kongshuju' style={{ fontSize: 100 }} />
                            <div className='Des'>暂无安全分类信息，建议选择“文件导入”创建</div>
                            <div className='HControlGroup'>
                                <PermissionWrap funcCode='/dt_calssification/def/securitySet/add'>
                                    <Button icon={<PlusOutlined />} ghost type='primary' onClick={this.openAddDrawer.bind(this, 0)}>
                                        添加分类
                                    </Button>
                                </PermissionWrap>
                                <PermissionWrap funcCode='/dt_calssification/def/securitySet/upload'>
                                    <Button icon={<UploadOutlined />} type='primary' onClick={() => this.setState({ visibleUpload: true })}>
                                        文件导入
                                    </Button>
                                </PermissionWrap>
                            </div>
                        </div>
                    )
                }}
            />
        )
    }

    renderUploadModal() {
        const { visibleUpload, fileList, uploadLoading } = this.state
        const hasFile = Boolean(fileList && fileList.length)
        const requestUpload = () => {
            this.setState({ uploadLoading: true })
            updateDatasecurity(fileList[0])
                .then((res) => {
                    const { code, msg } = res
                    if (code === 200) {
                        message.success(msg || '导入成功')
                        resetUpload()
                        this.reload()
                    }
                })
                .finally(() => {
                    this.setState({ uploadLoading: false })
                })
        }
        const resetUpload = () => {
            this.setState({
                fileList: undefined,
                uploadLoading: false,
                visibleUpload: false,
            })
        }
        return (
            <Modal
                title='文件导入（安全分类）'
                visible={visibleUpload}
                wrapClassName='securitySetUploadModal'
                okButtonProps={{
                    disabled: !hasFile,
                    title: hasFile ? '' : '请选择文件',
                    loading: uploadLoading,
                }}
                cancelButtonProps={{
                    disabled: uploadLoading,
                }}
                onOk={requestUpload}
                onCancel={() => {
                    resetUpload()
                }}
            >
                <div>
                    <p>1. 下载导入模板，完善信息</p>
                    <a>
                        <DownloadOutlined /> 下载模板
                    </a>
                </div>
                <div>
                    <p>2. 导入完善好的表格（支持xlsx格式）</p>
                    <Upload.Dragger
                        multiple={false}
                        accept='.xlsx'
                        customRequest={(options) => {
                            this.setState({ fileList: [options.file] })
                        }}
                        onRemove={(file) => {
                            this.setState({ fileList: fileList.filter((item) => item !== file) })
                        }}
                        fileList={fileList}
                    >
                        <p className='ant-upload-drag-icon'>
                            <UploadOutlined />
                        </p>
                        <p className='ant-upload-text'>请点击或拖拽进行上传！</p>
                    </Upload.Dragger>
                </div>
            </Modal>
        )
    }

    renderTree() {
        const { selectedPath, suggestList, selectSuggest, treeData, selectedItem, selectedTitle, showPreview, checkDelete, loading, delLoading, showSelectDropdown } = this.state
        let renderLength = []
        for (let i = 0; i < selectedItem.length + 1; i++) {
            renderLength.push(' ')
        }
        return (
            <div>
                <div className='dataTitle'>安全分类配置</div>
                <div style={{ width: 280 }}>
                    {/* 搜索框 */}
                    <Select
                        allowClear
                        showSearch
                        className='categorySelect'
                        filterOption={false}
                        onSearch={this.handleSearch}
                        style={{ minWidth: '280px', width: 'auto', margin: '18px 0 16px 0' }}
                        dropdownClassName={showSelectDropdown ? 'categoryDropdown' : 'categoryDropdown hideDropdown'}
                        placeholder='请输入特征名称'
                        value={selectSuggest}
                        onChange={this.clearInput}
                        dropdownRender={this.renderDropdown}
                        suffixIcon={<span className='iconfont icon-sousuo'></span>}
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
                <Spin spinning={loading}>
                    <div className='categoryContent'>
                        {/* 多级分类 */}
                        {renderLength.map((item, index) => {
                            return (
                                <div className='categoryItem'>
                                    {/* 分类头部名称，有选中项显示选中的分类名称；否则显示N级 */}
                                    <div className={selectedTitle[index] ? 'itemHeader' : 'itemHeader itemHeaderGrey'}>
                                        {selectedTitle[index]
                                            ? selectedTitle[index].name
                                            : selectedTitle[index - 1]
                                            ? selectedTitle[index - 1].level < 9 && selectedTitle[index - 1].hasChild
                                                ? index + 1 + '级'
                                                : '特征'
                                            : index + 1 + '级'}
                                    </div>
                                    {/* 分类项列表 */}
                                    {this.renderTreeItem(index + 1)}
                                    <div className='itemFooter'>
                                        <PermissionWrap funcCode='/dt_calssification/def/securitySet/add'>
                                            <div onClick={this.openAddDrawer.bind(this, index)}>
                                                <PlusOutlined />
                                                添加
                                            </div>
                                        </PermissionWrap>
                                        <PermissionWrap funcCode='/dt_calssification/def/securitySet/sort'>
                                            <div onClick={this.openSortDrawer.bind(this, index)}>
                                                <SwapOutlined />
                                                排序
                                            </div>
                                        </PermissionWrap>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Spin>
            </div>
        )
    }

    render() {
        const { treeData } = this.state
        const hasData = Boolean(treeData && treeData.length)

        return (
            <React.Fragment>
                {/* 如果有数据，显示层级树；否则 ，显示空状态内容 */}
                {hasData ? <div className='dataCategory securitySet'>{this.renderTree()}</div> : this.renderEmpty()}
                <SecurityDetailDrawer ref={(dom) => (this.securityDetailDrawer = dom)} />
                <SecurityEditDrawer reload={this.reload} ref={(dom) => (this.securityEditDrawer = dom)} />
                <CategorySortDrawer getSortData={this.getSortData} ref={(dom) => (this.categorySortDrawer = dom)} />
                {this.renderUploadModal()}
            </React.Fragment>
        )
    }
}
