import { TreeSelect } from 'antd'
import React, { Component } from 'react'

const TreeNode = TreeSelect.TreeNode
/**
 * @todo 增加不异步渲染的条件 目前的做法是在 props.getData 里把参数 recursive 改写
 * @todo 增加搜索功能
 * @Description: 通用树组件
 * @author Xiaomin Ye
 * @Email lovemegowin@gmail.com  /  xmye@quant-chi.com
 * @createDate 2019/3/25
 * @props
 */

class CommonTreeSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            treeDefaultExpandedKeys: [],
            value: this.props.value || undefined,
        }
    }

    componentDidMount() {
        this.init()
    }

    init = () => {
        this.getData({
            recursive: true,
            depth: 3,
        })
    }

    handleChange = (value) => {
        console.log(value)
        this.triggerChange(value)
        this.setState({ value })
    }

    handleSelect = (value, node) => {
        const { onSelect } = this.props
        let res = onSelect && onSelect(value, node)
        console.log(res)
        if (res && res.assert) {
            setTimeout(() => this.handleChange({ value: undefined }))
        }
    }

    triggerChange = (changedValue) => {
        // console.log(changedValue)
        const onChange = this.props.onChange
        onChange && onChange(changedValue)
    }

    getData = (param) => {
        this.props.getData(param).then((res) => {
            if (res.data.length > 0) {
                let treeId = res.data[0].id
                this.setState({
                    treeData: res.data,
                    treeDefaultExpandedKeys: [treeId],
                })
            }
        })
    }

    loop = (data) =>
        data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode key={item.id} value={`${item.id}`} title={item[this.props.name || 'name']} dataRef={item}>
                        {this.loop(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.id} value={`${item.id}`} title={item[this.props.name || 'name']} dataRef={item} />
        })

    onLoadData = (treeNode) =>
        new Promise(async (resolve) => {
            if (this.props.sync || treeNode.props.children) {
                resolve()
                return
            }
            let res = await this.props.getData(
                {
                    recursive: false,
                    parent: treeNode.props.value,
                },
                treeNode
            )
            treeNode.props.dataRef.children = res.data
            this.setState({
                treeData: [...this.state.treeData],
            })
            resolve()
        })

    render() {
        const { treeData, treeDefaultExpandedKeys, value } = this.state
        const { labelInValue, onChange, onSelect, ...restProps } = this.props
        return (
            <div>
                <TreeSelect
                    value={value}
                    style={{ width: '100%' }}
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    dropdownMatchSelectWidth
                    placeholder={this.props.placeholder ? this.props.placeholder : ''}
                    allowClear
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    loadData={this.onLoadData}
                    labelInValue={labelInValue}
                    {...restProps}
                >
                    {this.loop(treeData)}
                </TreeSelect>
            </div>
        )
    }
}

export default CommonTreeSelect
