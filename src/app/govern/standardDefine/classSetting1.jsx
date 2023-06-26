import EmptyIcon from '@/component/EmptyIcon'
import TableLayout from '@/component/layout/TableLayout'
import { Input, message, Spin } from 'antd'
import { addTreeNode, deleteTreeNode, getNodeSourceCountByNodeId, getTree, updateTreeNode } from 'app_api/systemManage'
import EditTree from 'app_page/dama/component/EditTree'
import React from 'react'
import './ClassSetting.less'

const { TextArea } = Input

class TreeEditManage extends React.Component {
    constructor() {
        super()
        this.state = {
            treeData: [],
            treeExpandKeys: [],
            addTypeModalVisible: false,
            addSystemModalVisible: false,
            type: 'add',
            loading: false,
            listLoading: false,
            codeRule: false, // 编号是否重复
            nameRule: false, // 名称是否重复
            addTypeInfo: {
                code: '',
                description: '',
                name: '',
                parentId: '',
            },
        }
    }
    componentWillMount = () => {
        this.getData()
    }
    getData = async () => {
        const expandedKeys = this.tree ? this.tree.getExpandedKeys() : []
        this.setState({
            treeData: [],
            listLoading: true,
            treeExpandKeys: expandedKeys,
        })
        let params = {
            code: 'ZT002',
        }
        let res = await getTree(params)
        if (res.code == 200) {
            res.data.level = 0
            // res.data = this.getColor(res.data)
            await this.getColor(res.data)
            console.log(res.data, 'depth')
            this.setState({
                treeData: [res.data],
            })
        }
        this.setState({ listLoading: false })
    }
    getColor = (data, color) => {
        data.children.map((item, index) => {
            item.color = color ? color : index + 1
            if (item.children.length) {
                // item.children.map((value) => {
                //     value.color = item.color
                // })
                this.getColor(item, item.color)
            }
        })
        console.log(data, 'data+++++')
    }
    editData = async (req) => {}
    deleteData = (data) => {
        if (data.children.length) {
            message.error('该节点下已有资源，无法删除')
            return
        }
        getNodeSourceCountByNodeId({ id: data.id }).then((res) => {
            if (res.code == 200) {
                if (res.data) {
                    message.error('该节点下已有资源，无法删除')
                } else {
                    deleteTreeNode({ id: data.id }).then((response) => {
                        if (response.code == 200) {
                            message.success(response.msg)
                            if (this.props.location.state.callback) {
                                this.props.location.state.callback()
                            }
                            this.getData()
                        } else {
                            message.error(response.msg)
                        }
                    })
                }
            }
        })
    }
    getNode = (data) => {
        console.log('data', data)
    }
    postAddType = async (data, type) => {
        this.setState({ loading: true })
        let res
        if (type == 'add') {
            res = await addTreeNode(data)
        } else {
            res = await updateTreeNode(data)
        }
        if (res.code == 200) {
            message.success(res.msg ? res.msg : '操作成功')
            if (this.props.location.state.callback) {
                this.props.location.state.callback()
            }
            this.getData()
        }
        this.setState({ loading: false })
    }
    onExpand = (id) => {
        this.ThreedTree.treeExpand(id)
    }
    expandNode = (id) => {
        this.tree.ExpandTree(id)
    }

    render() {
        const { addTypeModalVisible, type, loading, listLoading, addTypeInfo, codeRule, nameRule, treeData, addSystemModalVisible, treeExpandKeys } = this.state

        return (
            <TableLayout
                title='标准分类'
                className='ClassSetting'
                renderDetail={() => {
                    return treeData.length ? (
                        <EditTree
                            data={this.getNode}
                            ref={(node) => {
                                this.tree = node
                            }}
                            className='NoLineTree'
                            showLine={false}
                            width='100%'
                            treeData={treeData}
                            openAddModal={this.openAddModal}
                            postAddType={this.postAddType}
                            deleteData={this.deleteData}
                            disableEdit={[0, 1]}
                            disableDelete={[0, 1]}
                            disableAdd={[0, 5]}
                            onExpand={this.onExpand}
                            depth={5}
                            type='categoryEdit'
                            selectable={true}
                            authIdAdd='standard:category:create'
                            authIdEdit='standard:category:update'
                            expandedKeys={treeExpandKeys}
                            authIdDelete='standard:category:delete'
                        />
                    ) : (
                        <Spin spinning={listLoading}>
                            <EmptyIcon />
                        </Spin>
                    )
                }}
            />
        )
    }
}

export default TreeEditManage
