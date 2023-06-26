import { CheckCircleFilled, CloseCircleFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons'
import { Input, message, Modal, Spin, Tree } from 'antd'
import classNames from 'classnames'
import React from 'react'
import './index.less'

const { TreeNode } = Tree
const confirm = Modal.confirm

export default class GeneralTree extends React.Component {
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
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        let res = await this.props.getData()
        this.setState({
            treeData: res.data,
            isEditing: false,
            loading: false,
        })
    }

    renderNode = (item, parentId) => {
        const { disableEdit, disableDelete, disableAdd } = this.state
        return (
            <div className='expand-wrapper'>
                <div
                    className={classNames({
                        'expand-overview-show': !item.inputActive,
                        'expand-overview-off': item.inputActive,
                    })}
                >
                    <span className='mg10'>{item.name}</span>
                    <div className='expand-edit'>
                        {disableEdit.indexOf(item.depth) === -1 ? <EditFilled className='expandIcon' onClick={(e) => this.handleEditClick(item, e)} /> : ''}
                        {disableDelete.indexOf(item.depth) === -1 ? <CloseCircleFilled className='expandIcon' onClick={(e) => this.showConfirm(item, e)} /> : ''}
                        {disableAdd.indexOf(item.depth) === -1 ? <PlusCircleFilled className='expandIcon' onClick={(e) => this.handleAddClick(item, e)} /> : ''}
                    </div>
                </div>
                <div
                    className={classNames({
                        'expand-overview-show': item.inputActive,
                        'expand-overview-off': !item.inputActive,
                    })}
                >
                    <Input
                        addonAfter={<CheckCircleFilled className='expandIcon' onClick={(e) => this.handleInputCompleteClick(item, parentId, e)} />}
                        value={item.name}
                        onChange={(e) => this.handleInputChange(item, e)}
                        onBlur={() => this.handleBlur(item, parentId)}
                    />
                </div>
            </div>
        )
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
        }
    }

    handleInputCompleteClick = async (item, parentId, e) => {
        if (!item.name) {
            return
        }
        e.stopPropagation()
        this.setState({ loading: true })
        let res = ''
        if (!item.id) {
            // 新增
            console.log(parentId)
            // if(!parentId){
            //     message.error("请选择悬挂节点")
            //     return
            // }
            let req = {
                parent: parentId,
                name: item.name,
            }
            res = await this.props.editData(req)
        } else {
            let req = {
                id: item.id,
                name: item.name,
            }
            res = await this.props.editData(req)
        }
        this.setState({ loading: false })
        if (res.code != '200') {
            return
        }
        if (this.props.callback) {
            this.props.callback()
        }
        const { data } = await this.props.getData()
        // const {treeData} = this.state
        // const newData = [...treeData,...data]
        // console.log(newData)
        // this.revertInputLoopData(treeData)
        this.setState({
            treeData: data,
            isEditing: false,
            loading: false,
        })
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
        this.updateData(treeData, item.id, e.target.value)
        this.setState({
            treeData,
        })
    }

    handleEditClick = (item, e) => {
        e.stopPropagation()
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

    showConfirm = (item, e) => {
        e.stopPropagation()
        confirm({
            title: '确认删除该节点？',
            onOk: () => {
                this.handleDeleteClick(item)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    handleDeleteClick = async (item) => {
        this.setState({ loading: true })
        let ids = []
        ids.push(item.id)
        let res = await this.props.deleteData(ids)
        if (res.code == '200') {
            this.getData()
            if (this.props.callback) {
                this.props.callback()
            }
        } else {
            this.revertInputLoopData(this.state.treeData)
        }
        this.setState({ loading: false })
    }

    handleAddClick = (item, e) => {
        e && e.stopPropagation()
        this.expandParent(item && item.id)
        const { treeData, isEditing } = this.state
        if (isEditing) {
            message.warning('请先完成以已激活的输入框')
            return
        }
        item ? this.addDataLoop(treeData, item.id) : this.addDataLoop(treeData)
        this.setState({
            treeData,
            isEditing: true,
        })
    }

    addDataLoop = (data, id) => {
        if (!id) {
            //如果parentId为空的情况下
            data.push({
                name: '',
                id: '',
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

    onSelect = (selectedKeys, e) => {
        const {
            node: {
                props: { eventKey },
            },
        } = e
        const { expandedKeys } = this.state
        const { onSelect } = this.props
        if (expandedKeys.indexOf(eventKey) >= 0) {
            expandedKeys.splice(expandedKeys.indexOf(eventKey), 1)
            this.setState({
                expandedKeys: expandedKeys,
                autoExpandParent: false,
            })
        } else {
            this.setState({
                expandedKeys: [...new Set([...expandedKeys, ...selectedKeys])],
                autoExpandParent: false,
            })
        }
        onSelect && onSelect(selectedKeys, e)
    }

    render() {
        const { treeData, isEditing, loading, expandedKeys, autoExpandParent } = this.state
        const loop = (data, parentId) =>
            data.map((item) => {
                const RenderNode = this.renderNode(item, parentId)
                if (item.children) {
                    return (
                        <TreeNode
                            // icon={({ selected }) => (<Icon type={selected ? 'frown' : 'frown-o'} />)}
                            className='test'
                            currentId={item.id}
                            key={item.id}
                            title={RenderNode}
                            order={item.order}
                            parentId={parentId}
                            path={item.path}
                        >
                            {loop(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode className='test' currentId={item.id} order={item.order} parentId={parentId} key={item.id} title={RenderNode} isLeaf path={item.path} />
            })
        return (
            <div className='App' style={{ width: this.props.width || 300 }}>
                <Spin spinning={loading}>
                    <Tree expandedKeys={expandedKeys} onExpand={this.onSelect} draggable={!isEditing} onDrop={this.onDrop} onSelect={this.onSelect} autoExpandParent={autoExpandParent}>
                        {loop(treeData)}
                    </Tree>
                </Spin>
            </div>
        )
    }
}
