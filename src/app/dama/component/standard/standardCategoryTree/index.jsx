import { message, TreeSelect } from 'antd'
import { getTree } from 'app_api/systemManage'
import React, { Component } from 'react'

const TreeNode = TreeSelect.TreeNode

const loop = (data) =>
    data.map((item) => {
        if (item.children && item.children.length) {
            return (
                <TreeNode key={item.id} value={item.id} title={item.name}>
                    {loop(item.children)}
                </TreeNode>
            )
        }
        return <TreeNode key={item.id} isLeaf={true} value={item.id} title={item.name} />
    })

class StandardCateGoryTree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            value: this.props.value || '',
        }
    }

    componentDidMount() {
        this.getTreeData()
    }

    onSelect = (value, node, e) => {
        if (value) {
            if (e.triggerNode.props.isLeaf) {
                console.log(value)
                this.triggerChange(value)
                this.setState({ value })
            } else {
                this.setState({ value: undefined })
                message.warning('请选择标准分类树（最后一层）！')
            }
        }
    }
    triggerChange = (value) => {
        const onChange = this.props.onChange
        onChange && onChange(value)
    }
    getTreeData = async () => {
        let res = await getTree({ code: 'ZT002' })
        this.setState({
            treeData: [res.data],
        })
    }
    render() {
        const { treeData, value } = this.state
        return (
            <TreeSelect
                dropdownStyle={{
                    maxHeight: 300,
                    overflow: 'auto',
                }}
                style={{ width: 240 }}
                onChange={this.onSelect}
                {...this.props}
                value={value}
            >
                {treeData.length > 0 ? loop(treeData) : null}
            </TreeSelect>
        )
    }
}

export default StandardCateGoryTree
