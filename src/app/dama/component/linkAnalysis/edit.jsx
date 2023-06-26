import { Button } from 'antd'
import { deleteMetadataTree, editMetadataTree, metadataTree } from 'app_api/metadataApi'
import GeneralTree from 'app_page/dama/component/Tree'
import React, { Component } from 'react'

export default class SystemTree extends Component {
    constructor(props) {
        super(props)
        this.tree = ''
    }
    componentWillMount() {}

    componentDidMount() {}
    getData = async () => {
        return await metadataTree({ hasDatasource: false })
    }
    editData = async (req) => {
        return await editMetadataTree(req)
    }
    deleteData = async (req) => {
        return await deleteMetadataTree(req)
    }
    addSystemLevel = () => {
        this.tree.handleAddClick()
    }

    render() {
        return (
            <div>
                <Button type='primary' onClick={this.addSystemLevel}>
                    添加系统层次
                </Button>
                <GeneralTree
                    callback={this.props.location.state.callback}
                    ref={(node) => {
                        this.tree = node
                    }}
                    width={320}
                    getData={this.getData}
                    editData={this.editData}
                    deleteData={this.deleteData}
                    disableAdd={[2]}
                />
            </div>
        )
    }
}
