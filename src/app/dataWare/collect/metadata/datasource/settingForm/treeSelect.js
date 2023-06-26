import {
    message,
    TreeSelect
} from 'antd'
import {
    getMetadataTree,
    metadataDBTree
} from 'app_api/metadataApi'
import {
    getTree
} from 'app_api/systemManage'
import React, {
    Component
} from 'react'
const TreeNode = TreeSelect.TreeNode

export default class TreeSelectComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            treeData: [],
            treeExpandedKeys: [],
        }
        this.firstValue = null
    }

    componentWillMount() {
        // toDatabase原来是选择到数据源层，现在又有的地方是到数据库，有些改了 有些没改 目前用这种传参数方式
        if (this.props.toDatabase) {
            metadataDBTree().then((res) => {
                if (res.code == '200') {
                    this.setState({
                        treeData: res.data,
                        value: this.props.treeSelectValue ? this.props.treeSelectValue : undefined,
                    })
                }
            })
        } else {
            this.getMetadataTree()
        }
    }

    getMetadataTree = async () => {
        // console.log(this.props,'this.propsthis.props')
        let res = {}
        let params = {}

        if (this.props.requestParams) {
            params = {
                ...this.props.requestParams,
            }
        }

        if (this.props.type == 'addDataSource') {
            res = await getTree({
                code: 'XT001',
                ...params
            })
        } else {
            res = await getMetadataTree({
                code: 'XT001',
                ...params
            })
        }
        if (res.code == 200) {
            if (this.props.firstDataSource) {
                this.findFirstDataSource([res.data])

                this.setState({
                        treeData: [res.data],
                        value: this.firstValue,
                    },
                    () => {
                        // 版本查看的时候需要默认显示第一个数据源，并作为搜索条件，做一次查询
                        this.props.changeSelectValue && this.props.changeSelectValue(this.firstValue, true)
                    }
                )
            } else {
                this.setState({
                    treeData: [res.data],
                    value: this.props.treeSelectValue ? this.props.treeSelectValue : undefined,
                })
            }
            if (this.props.type == 'addDataSource') {
                const {
                    treeData,
                    treeExpandedKeys
                } = this.state
                treeData.map((item) => {
                    treeExpandedKeys.push(item.id)
                })
                console.log(treeData, 'addDataSource++++')
                this.setState({
                    treeExpandedKeys
                })
            }
        }
    }

    findFirstDataSource = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == 3) {
                this.firstValue = data[i].id
                return false
            } else {
                if (!this.firstValue) {
                    this.findFirstDataSource(data[i].children)
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps,'nextPropsnextPropsnextProps')
        // if(!this.props.firstDataSource){
        // console.log(nextProps)
        this.setState({
            value: nextProps.treeSelectValue,
        })
        // }
    }
    // lastChild 组件内是否需要判断是不是最后一层，false就是不判断 ture 就是判断（ 默认的没有lastChild属性，因为到目前为止，需基本都是需要判断是不是最后一层的） props 为 lastChild='false'
    // 注意不能 1、lastChild={false} 因为默认的没有lastChild属性 2、父组件虽然不判断是否为最后一层，但是不管是不是叶子节点都要触发 this.props.treeSelect 因为父组件要做判断 如果只在是叶子节点里触发 this.props.treeSelect 只要选择过一次叶子节点 父组件就一直能拿到当前选择的值
    treeOptionSelect(value, name, e) {
        console.log(value, name, e, 'eeee')
        if (this.props.lastChild && this.props.lastChild === 'false') {
            this.setState({
                value
            })
            this.props.treeSelect(e, value)
        } else {
            // 点X清空的时候 是没有 triggerNode 的 要判断一下
            if (e.triggerNode) {
                if (e.triggerNode.props.isLeaf) {
                    this.setState({
                        value
                    })
                } else {
                    message.warning('请选择最后一层')
                    // this.setState({ value: undefined })
                    return
                }
            } else {
                this.setState({
                    value
                })
            }
            this.props.treeSelect(e, value)
        }
    }

    onTreeExpand = (keys) => {
        let {
            treeExpandedKeys
        } = this.state
        treeExpandedKeys = keys
        this.setState({
            treeExpandedKeys
        })
    }

    render() {
        const {
            treeData,
            value,
            treeExpandedKeys
        } = this.state
        const {
            disabled,
            placeholder
        } = this.props;
        // 添加或修改自动采集任务的悬挂节点 不需要数据源层
        const loop = (data, depth) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    // 这里是为了处理 如果下拉框只到系统 显示叶子节点（因为这个接口 后台给到数据库）
                    if (this.props.type == 'addDataSource') {
                        if (item.level == 2 && depth != 1) {
                            return <TreeNode key = {
                                item.id
                            }
                            isLeaf = {
                                true
                            }
                            path = {
                                depth
                            }
                            dataRef = {
                                item
                            }
                            value = {
                                item.id
                            }
                            title = {
                                item.name
                            }
                            />
                        } else {
                            return ( <
                                TreeNode disabled key = {
                                    item.id
                                } /* isLeaf={(item.children || []).length <= 0} */
                                path = {
                                    depth
                                }
                                dataRef = {
                                    item
                                }
                                value = {
                                    item.id
                                }
                                title = {
                                    item.name
                                } > {
                                    loop(item.children, depth + 1)
                                } <
                                /TreeNode>
                            )
                        }
                    } else if (this.props.type == 'selectDataSource') {
                        if (item.type == 3) {
                            return <TreeNode key = {
                                item.id
                            }
                            isLeaf = {
                                true
                            }
                            path = {
                                depth
                            }
                            dataRef = {
                                item
                            }
                            value = {
                                item.id
                            }
                            title = {
                                item.name
                            }
                            />
                        } else {
                            return ( <
                                TreeNode key = {
                                    item.id
                                }
                                isLeaf = {
                                    false
                                }
                                path = {
                                    depth
                                }
                                dataRef = {
                                    item
                                }
                                value = {
                                    item.id
                                }
                                title = {
                                    item.name
                                } > {
                                    loop(item.children, depth + 1)
                                } <
                                /TreeNode>
                            )
                        }
                    } else {
                        return ( <
                            TreeNode key = {
                                item.id
                            }
                            isLeaf = {
                                false
                            }
                            path = {
                                depth
                            }
                            dataRef = {
                                item
                            }
                            value = {
                                item.id
                            }
                            title = {
                                item.name
                            } > {
                                loop(item.children, depth + 1)
                            } <
                            /TreeNode>
                        )
                    }
                    // if(this.props.noResource && item.children[0].type === 3){
                    //     return <TreeNode key={item.id} isLeaf={true} path={depth} dataRef={item} value={item.id} title={item.name}/>
                    // }else{
                    //     return <TreeNode key={item.id} isLeaf={false} path={depth} dataRef={item} value={item.id} title={item.name}>{loop(item.children, depth+1)}</TreeNode>
                    // }
                } else {
                    return <TreeNode disabled = {
                        item.level != 2 && depth != 1
                    }
                    key = {
                        item.id
                    }
                    isLeaf = {
                        true
                    }
                    path = {
                        depth
                    }
                    dataRef = {
                        item
                    }
                    value = {
                        item.id
                    }
                    title = {
                        item.name
                    }
                    />
                    // if(this.props.noResource){
                    //     if(item.type !== 3){
                    //         return <TreeNode key={item.id} isLeaf={true} path={depth} dataRef={item} value={item.id} title={item.name}/>
                    //     }
                    // }else{
                    //     return <TreeNode key={item.id} isLeaf={true} path={depth} dataRef={item} value={item.id} title={item.name}/>
                    // }
                }
            })
        return ( <
            TreeSelect value = {
                value || undefined
            } {
                ...this.props
            }
            style = {
                {
                    width: this.props.width || '100%',
                    margin: this.props.margin || '',
                }
            }
            dropdownStyle = {
                {
                    maxHeight: 300,
                    overflow: 'auto',
                }
            }
            showSearch = {
                true
            }
            dropdownMatchSelectWidth
            // treeExpandedKeys={treeExpandedKeys}
            // onTreeExpand={this.onTreeExpand}
            disabled = {
                disabled
            }
            placeholder = {
                placeholder ? placeholder : '请选择数据源'
            }
            allowClear = {
                false
            }
            treeDefaultExpandAll treeNodeFilterProp = 'title'
            onChange = {
                this.treeOptionSelect.bind(this)
            } > {
                treeData.length > 0 ? loop(treeData, 1) : null
            } <
            /TreeSelect>
        )
    }
}