import { message } from 'antd'
import { getMetadataTree } from 'app_api/metadataApi'
import ExpandTree from 'app_component_main/leftContainer/expandTree'
import KeyboardWizard from 'app_page/dama/component/keyboardWizard'
import React, { Component } from 'react'

export default class SourceToFieldSearchTree extends Component {
    constructor(props) {
        super(props)

        this.state = {
            treeData: [],
            defaultTreeSelectedKeys: [],
            totalNum: 0, //搜索时后台返回的最大长度，现在是超过50条截断
        }

        this.searchKeyWord = ''
        this.area = 'datasource database table column'
    }

    componentDidMount() {
        this.getMetadataTree()
    }

    getMetadataTree = () => {
        let treeId = ''
        getMetadataTree({ code: 'XT001' }).then((res) => {
            if (res.code == '200') {
                treeId = res.data.id
                this.setState({
                    treeData: [res.data],
                    defaultTreeSelectedKeys: [treeId.toString()],
                    totalNum: res.total,
                })
            }
        })
    }
    // 点击浏览输入框 搜索触发
    reviewInputChange = (value) => {
        this.expandTree.setLoading()
        this.searchKeyWord = value
        getMetadataTree({ keyword: value, code: 'XT001' }).then((res) => {
            if (res.code == '200') {
                this.setState({
                    treeData: [res.data],
                    defaultTreeSelectedKeys: [res.data].length > 0 ? [res.data.id.toString()] : null,
                    totalNum: res.total,
                })
            }
        })
    }
    // 清空重新请求
    handleInputChange = (value, flag) => {
        if (flag) {
            this.reviewInputChange(value)
        }
    }
    onTreeSelect = (value, e) => {
        this.props.onTreeSelect && this.props.onTreeSelect(value, e)
    }
    render() {
        const { defaultTreeSelectedKeys, treeData, totalNum } = this.state
        return (
            <div>
                <KeyboardWizard area={this.area} search={true} reload={true} handleSearch={this.reviewInputChange} handleInputChange={this.handleInputChange} style={{ width: '135px' }} />

                <ExpandTree
                    defaultExpandAll={true}
                    totalNum={totalNum}
                    ref={(node) => {
                        this.expandTree = node
                    }}
                    treeData={treeData}
                    defaultTreeSelectedKeys={defaultTreeSelectedKeys}
                    onTreeSelect={this.onTreeSelect}
                    itemKey='id'
                    itemTitle='name'
                    searchKeyWord={this.searchKeyWord}
                />
            </div>
        )
    }
}
