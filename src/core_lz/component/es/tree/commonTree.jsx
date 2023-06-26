import { Spin, Tree } from 'antd'
import immutable from 'immutable'
import React from 'react'

const TreeNode = Tree.TreeNode

/*
    props:
        itemKey:
            类型：string
            描述：渲染树节点是 作为key的字段
        itemTitle:
            类型：string
            描述：渲染树节点是 作为item的字段
*/

export default class CommonTree extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spinLoading: true,
            defaultTreeSelectedKeys: [],
            defaultExpandedKeys: [],
            treeData: [],
            autoExpandParent: true,
        }

        this.prevCustomSelectData = {}
        this.expandedKeysAll = []
    }

    onExpand = (expandedKeys) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({ defaultExpandedKeys: expandedKeys, autoExpandParent: false })
    }

    componentDidMount = () => {
        this.setTreeData(this.props)
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // 注意 这里要用immutable！！！！！！
        this.setTreeData(nextProps)
    }

    setTreeData = (nextProps) =>{
        if (!immutable.is(immutable.fromJS(nextProps), immutable.fromJS(this.prevCustomSelectData))) {
            if (nextProps.treeData.length > 0) {
                this.setState({
                    treeData: nextProps.treeData,
                    defaultTreeSelectedKeys: nextProps.defaultTreeSelectedKeys ? nextProps.defaultTreeSelectedKeys : null,
                    defaultExpandedKeys: nextProps.defaultExpandedKeys ? nextProps.defaultExpandedKeys : null,
                    spinLoading: false,
                })
                if (this.props.defaultExpandAll) {
                    this.findAllKeys(nextProps.treeData)

                    this.setState({
                        defaultExpandedKeys: this.expandedKeysAll,
                    })
                }
                this.prevCustomSelectData = nextProps
            } else {
                this.setState({ spinLoading: false })
            }
        }
    }

    findAllKeys = (treeData) => {
        _.map(treeData, (item, key) => {
            if (item.children && item.children.length) {
                this.findAllKeys(item.children)
                this.expandedKeysAll.push(item.id + '')
            } else {
                this.expandedKeysAll.push(item.id + '')
            }
        })
    }

    onSelect = (selectedKeys, e) => {
        if (selectedKeys && selectedKeys.length) {
            this.setState({ defaultTreeSelectedKeys: selectedKeys })
            if (this.props.onTreeSelect) {
                this.props.onTreeSelect(selectedKeys, e)
            }
        }
    }

    render() {
        const { itemKey, itemTitle } = this.props
        const { defaultExpandedKeys, treeData } = this.state
        const loop = (data) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    let children = item.children.slice()
                    return (
                        <TreeNode key={itemKey ? item[itemKey] : item.key} title={itemTitle ? item[itemTitle] : item.category_name}>
                            {loop(children)}
                        </TreeNode>
                    )
                }
                return <TreeNode key={itemKey ? item[itemKey] : item.key} title={itemTitle ? item[itemTitle] : item.category_name} />
            })
        console.log('defaultExpandedKeys', defaultExpandedKeys, treeData)
        return (
            <Spin spinning={this.state.spinLoading}>
                {treeData && treeData.length ? (
                    <Tree
                        className='LineTree'
                        defaultExpandAll={defaultExpandedKeys ? undefined : true}
                        // expandedKeys={defaultExpandedKeys}
                        // autoExpandParent={this.state.autoExpandParent}
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
