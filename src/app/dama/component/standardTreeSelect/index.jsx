import React, {Component} from 'react';
import {getStandardCategory} from "app_api/standardApi";
import {TreeSelect} from "antd";

const TreeNode = TreeSelect.TreeNode
/**
 * @Description: 标准分类树组件
 * @author Xiaomin Ye
 * @Email lovemegowin@gmail.com  /  xmye@quant-chi.com
 * @createDate 2019/3/25
 * @props
 */

class StandardTreeSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
            treeData: [],
            treeDefaultExpandedKeys:[],
            value:this.props.value||""
        }
    }

    componentDidMount() {
        this.getStandardCategoryData({
            recursive:true,
            depth:3
        })
    }

    handleChange=(value)=>{
        this.triggerChange(value)
        this.setState({value})
    }

    triggerChange = (changedValue) => {
        console.log(changedValue)
        const onChange = this.props.onChange;
        onChange&&onChange(changedValue);
    }

    getStandardCategoryData = (param)=>{
        getStandardCategory(param).then(res => {
            if (res.data.length > 0) {
                let treeId = res.data[0].id
                this.setState({
                    treeData: res.data,
                    treeDefaultExpandedKeys:[treeId]
                })
            }
        })
    }

    loop = (data) => data.map((item) => {
        if (item.children && item.children.length) {
            return <TreeNode key={item.id} value={`${item.id}`} isLeaf={item.leaf} title={item.name}  dataRef={item}>{this.loop(item.children)}</TreeNode>
        }
        return <TreeNode key={item.id} value={`${item.id}`} isLeaf={item.leaf} title={item.name} dataRef={item} />
    })

    onLoadData =  treeNode => new Promise(async (resolve) => {
        if (treeNode.props.children) {
            console.log(1111)
            resolve()
            return
        }
        console.log(treeNode)
        let res = await getStandardCategory({
            recursive:false,
            parent:treeNode.props.value
        })
        treeNode.props.dataRef.children = res.data;
        this.setState({
            treeData: [...this.state.treeData],
        });
        resolve();
    })

    render() {
        const {treeData,treeDefaultExpandedKeys,value} = this.state

        return (
            <div>
                <TreeSelect
                    value={value}
                    style={{width:"100%"}}
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    dropdownMatchSelectWidth
                    placeholder=''
                    allowClear
                    onChange={this.handleChange}
                    loadData={this.onLoadData}
                    {...this.props}
                >
                    {this.loop(treeData)}
                </TreeSelect>
            </div>
        )
    }
}

export default StandardTreeSelect;
