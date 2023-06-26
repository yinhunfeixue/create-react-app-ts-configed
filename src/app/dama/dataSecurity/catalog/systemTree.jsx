import { Spin, Tree } from 'antd'
import immutable from 'immutable'
import React from 'react'
import './index.less'

const TreeNode = Tree.TreeNode

export default class SystemTree extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spinLoading: true,
            defaultTreeSelectedKeys: [],
            defaultExpandedKeys: [],
            treeData: [],
            autoExpandParent: true,
            selectedparentId: ''
        }

        this.prevCustomSelectData = {}
        this.expandedKeysAll = []
    }

    onExpand = (expandedKeys) => {
        this.setState({ defaultExpandedKeys: expandedKeys, autoExpandParent: false })
    }
    expandTree = (data) => {
        if (data.children&&data.children.length) {
            let { defaultExpandedKeys } = this.state
            if (defaultExpandedKeys.includes(data.id)) {
                let index = defaultExpandedKeys.indexOf(data.id)
                defaultExpandedKeys.splice(index, 1)
            } else {
                defaultExpandedKeys.push(data.id)
            }
            this.setState({
                defaultExpandedKeys,
                autoExpandParent: false
            })
        }
    }
    getTreeData = async (treeData, selectedKeys, defaultExpandAll) => {
        this.setState({ spinLoading: true })
        this.setState({
            treeData,
            defaultTreeSelectedKeys: selectedKeys
        })
        if (defaultExpandAll) {
            await this.findAllKeys(treeData)
            this.setState({
                defaultExpandedKeys: this.expandedKeysAll,
            })
        }
        this.setState({ spinLoading: false })
    }
    getExpandedKeys = (defaultExpandedKeys) => {
        this.setState({
            defaultExpandedKeys
        })
    }
    findAllKeys = (treeData) => {
        _.map(treeData, (item, key) => {
            if (key == 0) {
                if (item.children && item.children.length) {
                    this.findAllKeys(item.children)
                    this.expandedKeysAll.push(item.id + '')
                } else {
                    this.expandedKeysAll.push(item.id + '')
                }
            }
        })
    }

    onSelect = (selectedKeys, e) => {
        console.log(selectedKeys,e, 'onSelect')
        if (!e.selectedNodes.length) {
            return
        }
        if (e.selectedNodes[0].dataRef.type !== this.props.selectType) {
            return
        }
        if (selectedKeys && selectedKeys.length) {
            this.setState({ defaultTreeSelectedKeys: selectedKeys })
            if (e.selectedNodes.length > 0) {
                this.setState({
                    selectedparentId: e.selectedNodes[0].dataRef.parent
                })
            }
            if (this.props.onTreeSelect) {
                this.props.onTreeSelect(selectedKeys, e)
            }
        }
    }

    render() {
        const { itemKey, itemTitle } = this.props
        const { defaultExpandedKeys, treeData, selectedparentId } = this.state
        const renderTitle = (item) => {
            return (
                <span className='treeName' onClick={this.expandTree.bind(this, item)}>
                    {
                        item.type == 1 && item.dataWarehouse ?
                            <span style={{
                                width: 20,
                                height: 14,
                                background: '#95A9BD',
                                borderRadius: '2px',
                                color: '#fff',
                                fontSize: '9px',
                                padding: '0 3px',
                                marginRight: 3
                            }}>DW</span> : null
                    }
                    {item[itemTitle]}
                </span>
            )
        }
        const loop = (data) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    let children = item.children.slice()
                    return (
                        <TreeNode dataRef={item}
                                  // disabled
                                  key={item[itemKey]} title={renderTitle(item)}>
                            {loop(children)}
                        </TreeNode>
                    )
                }
                return <TreeNode dataRef={item}
                                 // disabled={item.type !== 1}
                                 key={item[itemKey]} title={renderTitle(item)} />
            })
        return (
            <Spin spinning={this.state.spinLoading}>
                {treeData && treeData.length ? (
                    <Tree
                        className='LineTree systemTree'
                        defaultExpandAll={defaultExpandedKeys ? undefined : true}
                        expandedKeys={defaultExpandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        selectedKeys={this.state.defaultTreeSelectedKeys}
                        onSelect={this.onSelect}
                        onExpand={this.onExpand}
                    >
                        {loop(treeData)}
                    </Tree>
                ) : null}
            </Spin>
        )
    }
}
