import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm, Spin, Tooltip, Tree } from 'antd';
import { checkNodeName } from 'app_api/systemManage'
import DeletePng from 'app_images/delete.png'
import classNames from 'classnames'
import { Button } from 'lz_antd'
import moment from 'moment'
import React from 'react'
import './index.less'

const { TreeNode } = Tree

export default class EditTree extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            isEditing: false,
            loading: true,
            expandedKeys: [],
            autoExpandParent: true,
            disableEdit: this.props.disableEdit || [],
            disableDelete: this.props.disableDelete || [],
            disableAdd: this.props.disableAdd || [],
            deletePopVisible: false,
        }
    }
    componentWillMount = async () => {
        await this.getData()
        let expandedKeys = []
        this.expandAll(this.state.treeData, expandedKeys)
        this.setState({
            expandedKeys: expandedKeys,
        })
        console.log(expandedKeys, 'expandedKeys')
    }
    componentDidMount() {
        //document.querySelector('.exam_container').addEventListener('click',this.getData, false)
    }
    componentWillReceiveProps = (nextProps) => {
        this.getData()
    }

    getData = async () => {
        let res = this.props.treeData
        // let res =  await this.props.getData()
        let checkedKeys = []
        res.map((cate, index) => {
            checkedKeys.push(cate.id)
            if (cate.children) {
                cate.children.map((child, index) => {
                    checkedKeys.push(child.id)
                })
            }
        })
        res = await this.resetInputActive(res)
        this.setState({
            treeData: res,
            isEditing: false,
            loading: false,
        })
    }
    resetInputActive = (data) => {
        data.map((item) => {
            item.inputActive = false
            if (item.children) {
                this.resetInputActive(item.children)
            }
        })
        return data
    }
    onPopVisibleChange = (data, visible) => {
        if (!visible) {
            this.setState({ deletePopVisible: visible })
            return
        }
        this.setState({ deletePopVisible: visible })
    }
    getShortName = (value) => {
        if (value) {
            if (value.length > 9) {
                return value.slice(0, 9) + '...'
            } else {
                return value
            }
        } else {
            return '（空白）'
        }
    }
    renderNode = (item, parentId) => {
        const { disableEdit, disableDelete, disableAdd, deletePopVisible } = this.state
        return (
            <div className='expand-wrapper treeEditContent'>
                <div
                    className={classNames({
                        'expand-overview-show': !item.inputActive,
                        'expand-overview-off': item.inputActive,
                    })}
                >
                    <span className='mg10'>
                        <Tooltip title={item.name}>{this.getShortName(item.name)}</Tooltip>
                    </span>
                    <div className='expand-edit'>
                        {disableAdd.indexOf(item.depth || item.level) === -1 ? (
                            <Button
                                authId={this.props.type == 'treeEdit' ? (item.level == 0 ? this.props.authIdAddType : this.props.authIdAddSystem) : this.props.authIdAdd}
                                type='text'
                                onClick={(e) => this.handleAddClick(item, e)}
                            >
                                <PlusOutlined className='expandIcon' fill='#666666' />
                            </Button>
                        ) : (
                            ''
                        )}
                        {disableEdit.indexOf(item.depth || item.level) === -1 && item.userIsEdit !== false ? (
                            <Button
                                authId={this.props.type == 'treeEdit' ? (item.level == 1 ? this.props.authIdEditType : this.props.authIdEditSystem) : this.props.authIdEdit}
                                type='text'
                                onClick={(e) => this.handleEditClick(item, e)}
                            >
                                <EditOutlined className='expandIcon' fill='#666666' />
                            </Button>
                        ) : (
                            ''
                        )}
                        {disableDelete.indexOf(item.depth || item.level) === -1 && item.userIsDelete !== false ? (
                            <Popconfirm
                                title='删除后不可恢复，确定删么？'
                                okText='确定'
                                cancelText='取消'
                                onConfirm={(e) => this.handleDeleteClick(item)}
                                // visible={deletePopVisible}
                                // onVisibleChange={this.onPopVisibleChange.bind(this,item)}
                            >
                                <i className='anticon anticon-edit expandIcon'>
                                    <Button
                                        authId={this.props.type == 'treeEdit' ? (item.level == 1 ? this.props.authIdDeleteType : this.props.authIdDeleteSystem) : this.props.authIdDelete}
                                        type='text'
                                    >
                                        <img style={{ width: '20px', height: '20px', marginBottom: '4px' }} src={DeletePng} />
                                    </Button>
                                </i>
                            </Popconfirm>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div
                    className={classNames({
                        'expand-overview-show': item.inputActive,
                        'expand-overview-off': !item.inputActive,
                    })}
                >
                    <Input
                        ref='myInput'
                        placeholder='请输入类目名称'
                        maxLength={9}
                        addonAfter={
                            <span>
                                <span className={9 - item.name.length > 3 ? 'lengthTip' : 'lengthTipDanger'}>{item.name.length}／9</span>
                                <CloseOutlined onClick={(e) => this.handleInputDelete(item, parentId, e)} />
                                <CheckOutlined
                                    className={item.name ? 'enableIcon' : 'disableIcon'}
                                    onClick={(e) => this.handleInputCompleteClick(item, parentId, e)} />
                            </span>
                        }
                        value={item.name}
                        onChange={(e) => this.handleInputChange(item, e)}
                        onBlur={() => this.handleBlur(item, parentId)}
                    />
                </div>
            </div>
        );
    }

    handleBlur = (node, id) => {
        console.log(node, id)
        if (node.name) {
            return
        }
        if (!id) {
            // 根节点情况
            node.inputActive = false
            this.setState({
                treeData: this.state.treeData.filter((item) => !!item.id),
                isEditing: false,
            })
            return
        }
        let spliceIndex
        const { treeData } = this.state
        loop(treeData)
        this.setState({
            treeData,
            isEditing: false,
        })
        function loop(data) {
            data.forEach((item) => {
                if (item.id === id) {
                    if (!node.id) {
                        item.children.pop()
                    } else {
                        item.children.forEach((n, index) => {
                            if (n.id === node.id) {
                                spliceIndex = index
                            }
                        })
                        item.children.splice(spliceIndex, 1)
                    }
                } else if (item.children) {
                    loop(item.children)
                }
            })
        }
    }

    onDrop = async (info) => {
        this.setState({ loading: true })
        const dropKey = info.node.props.currentId
        const dropParentId = info.node.props.parentId
        const dragKey = info.dragNode.props.currentId
        let req
        if (info.dropToGap) {
            const dropOrder = info.node.props.order
            req = {
                id: dragKey,
                order: dropOrder,
                parent: dropParentId || 0,
            }
        } else {
            req = {
                id: dragKey,
                parent: dropKey,
            }
        }
        let res = await this.props.editData(req)
        if (res.code == '200') {
            this.getData()
        } else {
            message.error(res.msg)
        }
    }

    handleInputCompleteClick = async (item, parentId, e) => {
        if (!item.name) {
            return
        }
        e.stopPropagation()
        this.setState({ loading: true })
        if (!item.id) {
            // 新增
            let data = {
                parentId: item.level == 0 ? 0 : parentId,
                name: item.name,
                treeId: item.treeId,
                code: moment().format('x'),
            }
            let res = await checkNodeName({ name: data.name, parentId: data.parentId, treeId: data.treeId })
            if (!res.data) {
                this.props.postAddType(data, 'add')
            } else {
                message.error('类目名称重复！')
            }
        } else {
            let data = {
                id: item.id,
                name: item.name,
                parentId: item.parentId,
                treeId: item.treeId,
                code: item.code,
                level: item.level,
            }
            let res = await checkNodeName({ name: data.name, parentId: data.parentId, treeId: data.treeId, id: data.id })
            if (!res.data) {
                this.props.postAddType(data, 'edit')
            } else {
                message.error('类目名称重复！')
            }
        }
        this.setState({ loading: false })
    }

    revertInputLoopData = (data) => {
        data.forEach((item) => {
            item.inputActive = false
            if (item.children) {
                this.revertInputLoopData(item.children)
            }
        })
    }

    handleInputChange = (item, e) => {
        const { treeData } = this.state
        this.updateData(treeData, item.id, e.target.value.trim())
        this.setState({
            treeData,
        })
    }

    handleEditClick = (item, e) => {
        e.stopPropagation()
        this.expandParent(item && item.id)
        if (this.props.type == 'treeEdit') {
            this.props.openAddModal(item, 'edit')
        }
        if (this.props.type == 'categoryEdit') {
            const { treeData, isEditing } = this.state
            if (isEditing) {
                message.warning('请先完成以已激活的输入框')
                return
            }
            this.updateData(treeData, item.id, item.name)
            this.setState({
                treeData,
                isEditing: true,
            })
        }
    }

    updateData = (data, id, name) => {
        data.forEach((item) => {
            if (item.id !== id) {
                item.inputActive = false
                if (item.children) {
                    this.updateData(item.children, id, name)
                }
            } else {
                item.inputActive = true
                item.name = name
            }
        })
    }

    handleDeleteClick = async (item) => {
        this.setState({ loading: true })
        this.props.deleteData(item)
        this.setState({ loading: false })
    }

    handleInputDelete = async (item, parentId, e) => {
        e.stopPropagation()
        this.getData()
    }

    handleAddClick = async (item, e) => {
        e && e.stopPropagation()
        this.expandParent(item && item.id)
        if (this.props.type == 'treeEdit') {
            this.props.openAddModal(item, 'add')
        }
        if (this.props.type == 'categoryEdit') {
            const { treeData, isEditing } = this.state
            if (isEditing) {
                message.warning('请先完成以已激活的输入框')
                return
            }
            item ? this.addDataLoop(treeData, item.id) : this.addDataLoop(treeData)
            await this.setState({
                treeData,
                isEditing: true,
            })
            const input = this.refs.myInput
            console.log(input, 'this.input')
            input.focus()
        }
    }

    addDataLoop = (data, id) => {
        if (!id) {
            //如果parentId为空的情况下
            data.push({
                name: '',
                id: '',
                level: data[0].level,
                treeId: data[0].treeId ? data[0].treeId : data[0].id,
                inputActive: true,
            })
            return
        }
        data.forEach((item, index) => {
            if (item.id === id) {
                if (!item.children) {
                    item.children = []
                }
                item.children.push({
                    name: '',
                    id: '',
                    level: item.level,
                    treeId: item.treeId ? item.treeId : item.id,
                    inputActive: true,
                })
            } else {
                if (item.children) {
                    this.addDataLoop(item.children, id)
                }
            }
        })
    }

    expandParent = (parentId) => {
        if (parentId === undefined) {
            return
        }
        const { expandedKeys } = this.state
        this.setState({
            expandedKeys: [...new Set([...expandedKeys, `${parentId}`])],
            autoExpandParent: false,
        })
    }
    expandAll = (treeData, expandedKeys) => {
        _.map(treeData, (item, key) => {
            if (item.children && item.children.length) {
                this.expandAll(item.children, expandedKeys)
                // 元数据配置页只展示2层
                // if (this.props.type == 'treeEdit') {
                if (item.level < 1) {
                    expandedKeys.push(item.id)
                }
                // } else {
                //     if (item.level < this.props.depth) {
                //         expandedKeys.push(item.id)
                //     }
                // }
            } else {
                //  this.expandArr.push(item.id)
            }
        })
    }

    onExpand = (selectedKeys, e) => {
        console.log(selectedKeys, 'selectedKeys selectedKeys selectedKeys')
        // const {node:{props:{eventKey}}} = e
        const { expandedKeys } = this.state
        console.log(expandedKeys)
        this.setState({ expandedKeys: selectedKeys })
        const { onExpand } = this.props
        onExpand && onExpand(e.node.props.currentId)
    }

    ExpandTree = (id) => {
        // 同步展开或收起 功能先隐藏
        return
        console.log(id, 'ExpandTree+++++++++')
        const { expandedKeys } = this.state
        if (expandedKeys.includes(id)) {
            expandedKeys.splice(expandedKeys.indexOf(id), 1)
        } else {
            expandedKeys.push(id)
        }
        console.log(expandedKeys)
        this.setState({ expandedKeys })
    }

    onSelect = (selectedKeys, e) => {
        console.log(selectedKeys, 'selectedKeys')
        // const {node:{props:{eventKey}}} = e
        const { onSelect } = this.props
        onSelect && onSelect(selectedKeys, e)
        this.props.data(selectedKeys, e.node.props.type, e.node.props.name)
    }

    render() {
        const { treeData, isEditing, loading, expandedKeys, autoExpandParent } = this.state

        const loop = (data, parentId) =>
            data.map((item) => {
                const RenderNode = this.renderNode(item, parentId)
                if (item.level < this.props.depth || item.level == this.props.depth) {
                    if (item.children) {
                        let cItem = { ...item }
                        delete cItem.children
                        return (
                            <TreeNode
                                // icon={({ selected }) => (<Icon type={selected ? 'frown' : 'frown-o'} />)}
                                className={item.level == this.props.depth ? 'hasBorder' : ''}
                                currentId={item.id}
                                key={item.id}
                                title={RenderNode}
                                order={item.order}
                                parentId={parentId}
                                path={item.path}
                                type={item.type}
                                name={item.name}
                                dataRef={cItem}
                                selectable={this.props.selectable}
                            >
                                {loop(item.children, item.id)}
                            </TreeNode>
                        )
                    }
                    return (
                        <TreeNode
                            className='test'
                            type={item.type}
                            name={item.name}
                            currentId={item.id}
                            order={item.order}
                            parentId={parentId}
                            key={item.id}
                            title={RenderNode}
                            dataRef={item}
                            isLeaf
                            path={item.path}
                        />
                    )
                }
            })
        return (
            <div className='HideScroll' style={{ width: '220px', height: '100%', borderRight: '1px solid #d3d3d3', float: 'left' }}>
                <div className='editableTree' style={{ width: this.props.width || 300 }}>
                    <Spin spinning={loading}>
                        <Tree expandedKeys={expandedKeys} onExpand={this.onExpand} onSelect={this.onSelect} defaultSelectedKeys={this.props.defaultSelectedKeys || []}>
                            {loop(treeData)}
                        </Tree>
                    </Spin>
                </div>
            </div>
        )
    }
}
