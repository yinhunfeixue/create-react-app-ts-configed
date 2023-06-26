import React, { Component } from 'react'
import { TreeSelect } from 'antd'

const TreeNode = TreeSelect.TreeNode
// import { Tree, Input } from 'antd'
//
// const TreeNode = Tree.TreeNode
// const Search = Input.Search

export default class TreeSelectComponent extends Component {
    constructor(props) {
        super(props)
        this.dataList = []
        this.dataKeyList = {}
        this.state = {
            treeData: props.treeData || [],
            selectedValue: props.selectedValue || null,
            titleField: props.titleField || 'name',
            treeSelectProps: { // 对应antd treeSelect组件 的props，可一样配置
                placeholder: '请选择',
                multiple: false,
                allowClear: true,
                treeDefaultExpandAll: true,
                showSearch: false
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.treeData) {
            this.setState(
                {
                    treeData: nextProps.treeData,
                }
            )
        }

        if (nextProps.selectedValue) {
            this.setState(
                {
                    selectedValue: nextProps.selectedValue
                }
            )
        }

        if (nextProps.treeSelectProps) {
            this.setState(
                {
                    treeSelectProps: nextProps.treeSelectProps
                }
            )
        }
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({ selectedValue: value });
        }
    }

    onChange = (value) => {
        this.setState({ selectedValue: value })
        this.triggerChange({ selectedValue: value })
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        if (this.props.onTreeSelect) {
            this.props.onTreeSelect(this.state, changedValue)
        }
    }
    renderTreeNodes = (data) => {
        // const { searchValue } = this.state;
        return data.map((item) => {
            let title = item[this.state.titleField]
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode title={title} value={item.id} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={title} value={item.id} key={item.id}  {...item} isLeaf={true} />

        })
    }

    render() {
        const { treeData, checkStrictly, treeSelectProps, selectedValue } = this.state
        return (
            <div>
                <TreeSelect
                    onChange={this.onChange}
                    value={selectedValue}
                    {...treeSelectProps}
                    disabled={this.props.disabled || false}
                >
                    {this.renderTreeNodes(treeData)}
                </TreeSelect>
            </div>
        )
    }

}
