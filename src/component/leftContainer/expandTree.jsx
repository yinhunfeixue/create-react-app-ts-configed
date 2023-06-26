import { CloseOutlined } from '@ant-design/icons';
import { Alert, message, Spin, Tooltip, Tree } from 'antd';
import { metadataTreeWithPaging } from 'app_api/metadataApi'
import catagorySvg from 'app_images/tree-catagory.svg'
import databaseSvg from 'app_images/tree-dataBase.svg'
import homeSvg from 'app_images/tree-home.svg'
import sourceSvg from 'app_images/tree-source.svg'
import systemSvg from 'app_images/tree-system.svg'
import immutable from 'immutable'
import React from 'react'
/*
    props:
        itemKey:
            类型：string
            描述：渲染树节点是 作为key的字段
        itemTitle:
            类型：string
            描述：渲染树节点是 作为item的字段
        noExpand:
        数据源及以下 是否可展开
*/
import './style.less'

const TreeNode = Tree.TreeNode

export default class ExpandTree extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spinLoading: true,
            defaultTreeSelectedKeys: [],
            defaultExpandedKeys: [],
            treeData: [],
            moreTipsDis: 'none',
            nodataTipsDis: 'none',
        }

        this.maxLength = 50 // 搜索时后台返回的最大长度，现在是超过50条截断
        this.prevTreeData = {}
        this.page_size = 50 // 请求分页时候每页多少个
        this.expandArr = [] // 有关键词搜索的时候 将展开的id放到这里
    }

    onExpand = (expandedKeys) => {
        this.setState({ defaultExpandedKeys: expandedKeys })
    }

    setLoading = () => {
        this.setState({ spinLoading: true })
    }
    removeLoading = () => {
        this.setState({ spinLoading: false })
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps,'nextPropsnextProps')
        // 注意 这里要用immutable！！！！！！
        if (!immutable.is(immutable.fromJS(nextProps), immutable.fromJS(this.prevTreeData))) {
            if (nextProps.treeData.length > 0) {
                let defaultExpandedKeys = []
                if (nextProps.searchKeyWord === '') {
                    if (nextProps.defaultTreeSelectedKeys) {
                        defaultExpandedKeys = nextProps.defaultTreeSelectedKeys
                    }
                } else {
                    this.expandAll(nextProps.treeData)
                    defaultExpandedKeys = this.expandArr
                }
                this.setState({
                    treeData: nextProps.treeData,
                    defaultTreeSelectedKeys: nextProps.defaultTreeSelectedKeys ? nextProps.defaultTreeSelectedKeys : null,
                    spinLoading: false,
                    defaultExpandedKeys,
                })
            } else {
                this.setState({
                    treeData: [],
                    spinLoading: false,
                })
            }

            this.prevTreeData = nextProps
        } else {
            this.setState({
                spinLoading: false,
            })
        }
        nextProps.totalNum > this.maxLength
            ? this.setState({
                  moreTipsDis: 'block',
              })
            : this.setState({
                  moreTipsDis: 'none',
              })
        nextProps.searchKeyWord && nextProps.searchKeyWord !== '' && nextProps.treeData.length == 0
            ? this.setState({
                  nodataTipsDis: 'block',
              })
            : this.setState({
                  nodataTipsDis: 'none',
              })
    }

    expandAll = (treeData) => {
        _.map(treeData, (item, key) => {
            if (item.children && item.children.length) {
                this.expandAll(item.children)
                this.expandArr.push(item.id)
            } else {
                //  this.expandArr.push(item.id)
            }
        })
    }

    onSelect = (selectedKeys, e) => {
        this.setState({ defaultTreeSelectedKeys: selectedKeys })
        if (this.props.onTreeSelect) {
            let newSelectedkeys = []
            // 将 1_234这样的key 转成234 因为后台数据id有可能重复 所以要让后台拼接一下，作为唯一的id 取的时候要处理一下
            if (selectedKeys.length > 0) {
                newSelectedkeys[0] = selectedKeys[0].substr(selectedKeys[0].lastIndexOf('_') + 1)
            }

            this.props.onTreeSelect(newSelectedkeys, e)
        }
    }

    onLoadData = (treeNode) => {
        // 这个方法返回一个异步操作
        return new Promise((resolve) => {
            // 只要点向下的箭头就要去请求，为了兼容 删除表和字段
            // if (treeNode.props.children) {
            //     resolve()
            //     return
            // }

            // 如果有searchKeyWord 就不去请求，因为点搜索的时候已经把所有的都返回了
            // if(this.props.searchKeyWord !== ""){
            //   resolve()
            //   return
            // }

            let req = {}
            if (treeNode.props.dataRef.type == 'datasource') {
                // 有些只需要展示到数据源层级
                if (this.props.noExpand) {
                    resolve()
                    return
                } else {
                    req.datasourceId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
                    req.page_size = this.page_size
                    this.resetTreeData(req, treeNode, resolve)
                }
            } else if (treeNode.props.dataRef.type == 'system') {
                req.systemId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
                req.page_size = this.page_size
                this.resetTreeData(req, treeNode, resolve)
            } else if (treeNode.props.dataRef.type == 'table') {
                req.tableId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
                req.page_size = this.page_size
                this.resetTreeData(req, treeNode, resolve)
            } else if (treeNode.props.dataRef.type == 'database') {
                // 只展示到库，展开库不请求
                if (this.props.notExpendDatabase) {
                    resolve()
                    return
                } else {
                    req.databaseId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
                    req.page_size = this.page_size
                    this.resetTreeData(req, treeNode, resolve)
                }
            } else if (treeNode.props.dataRef.type == 'page') {
                req[treeNode.props.dataRef.parentType] = treeNode.props.dataRef.parentId
                req.page_size = treeNode.props.dataRef.pageSize
                req.page = treeNode.props.dataRef.page
                this.resetTreeData(req, treeNode, resolve)
            } else {
                resolve()
            }
        })
    }

    // otherParams 为其他参数，这里指模型管理的树 需要只有模型的数据源和库 方便从父组件里加
    resetTreeData = (req, treeNode, resolve) => {
        metadataTreeWithPaging({ ...req, ...this.props.otherParams }).then((res) => {
            if (res.code == '200') {
                if (res.data.length) {
                    treeNode.props.dataRef.children = res.data
                    this.setState({
                        treeData: [...this.state.treeData],
                    })
                    resolve()
                } else {
                    resolve()
                }
            } else {
                resolve()
                message.error(res.msg ? res.msg : '请求树失败')
            }
        })
    }

    closeTips = (type) => {
        this.setState({
            [type]: 'none',
        })
    }

    render() {
        const { itemKey, itemTitle } = this.props

        const loop = (data, parentData, depth) =>
            data.map((item, keys) => {
                let hightLightTitle = ''
                if (item.highlight) {
                    hightLightTitle = (
                        <Tooltip title={item.highlight}>
                            <span dangerouslySetInnerHTML={{ __html: item.highlight }}></span>
                        </Tooltip>
                    )
                } else {
                    hightLightTitle = itemTitle ? <Tooltip title={item[itemTitle]}>{item[itemTitle]}</Tooltip> : <Tooltip title={item.category_name}>{item.category_name}</Tooltip>
                }

                let className = ''
                let imgUrl = ''
                if (item.type == 1) {
                    imgUrl = catagorySvg
                } else if (item.type == 2) {
                    imgUrl = systemSvg
                } else if (item.type == 3) {
                    imgUrl = sourceSvg
                } else if (item.type == 4) {
                    imgUrl = databaseSvg
                } else {
                    imgUrl = homeSvg
                }
                console.log(imgUrl, 'imgUrl')
                if (item.children && item.children.length) {
                    let children = item.children.slice()

                    if (item.type === 2) {
                        className = `tree_${item.type}_${depth}`
                    } else {
                        if (item.type === 3 && item.dsType === 'CTSEC') {
                            className = `tree_${item.type}_warning`
                        } else {
                            className = `tree_${item.type}`
                        }
                    }
                    if (this.props.type == 'versionPublish') {
                        if (item.type !== 4) {
                            return (
                                <TreeNode
                                    icon={this.props.noIcon ? null : <img src={imgUrl} />}
                                    parentData={parentData}
                                    className={className}
                                    key={itemKey ? item[itemKey] : item.key}
                                    title={hightLightTitle}
                                    dataRef={item}
                                >
                                    {loop(children, item, depth + 1)}
                                </TreeNode>
                            )
                        }
                    } else {
                        return (
                            <TreeNode
                                icon={this.props.noIcon ? null : <img src={imgUrl} />}
                                parentData={parentData}
                                className={className}
                                key={itemKey ? item[itemKey] : item.key}
                                title={hightLightTitle}
                                dataRef={item}
                            >
                                {loop(children, item, depth + 1)}
                            </TreeNode>
                        )
                    }
                } else {
                    if (item.type === 2) {
                        className = `tree_${item.type}_${depth}`
                    } else {
                        if (item.type === 3 && item.dsType === 'CTSEC') {
                            className = `tree_${item.type}_warning`
                        } else {
                            className = `tree_${item.type}`
                        }
                    }
                    if (this.props.type == 'versionPublish') {
                        if (item.type !== 4) {
                            return (
                                <TreeNode
                                    icon={this.props.noIcon ? null : <img src={imgUrl} />}
                                    parentData={parentData}
                                    isLeaf={item.leaf}
                                    className={className}
                                    key={itemKey ? item[itemKey] : item.key}
                                    title={hightLightTitle}
                                    dataRef={item}
                                />
                            )
                        }
                    } else {
                        return (
                            <TreeNode
                                icon={this.props.noIcon ? null : <img src={imgUrl} />}
                                parentData={parentData}
                                isLeaf={item.leaf}
                                className={className}
                                key={itemKey ? item[itemKey] : item.key}
                                title={hightLightTitle}
                                dataRef={item}
                            />
                        )
                    }
                }
            })

        const { spinLoading, moreTipsDis, nodataTipsDis, defaultExpandedKeys, defaultTreeSelectedKeys, treeData } = this.state

        return (
            <Spin spinning={spinLoading}>
                {/* 这里不能直接用 Alert的 closable 属性 关闭了 就没有了*/}
                {
                    <div style={{ display: moreTipsDis }} className='tipsContainer'>
                        <Alert message='搜索返回结果过多，没有展示全部记录，建议优化关键词提高搜索效果。' type='warning' showIcon className='treeTips' />
                        <CloseOutlined onClick={this.closeTips.bind(this, 'moreTipsDis')} className='tipsIcon' />
                    </div>
                }

                {
                    <div style={{ display: nodataTipsDis }} className='tipsContainer '>
                        <Alert message='未搜索到结果，建议换其他搜索词尝试。' type='warning' showIcon className='treeTips' />
                        <CloseOutlined onClick={this.closeTips.bind(this, 'nodataTipsDis')} className='tipsIcon' />
                    </div>
                }

                <Tree
                    className='commonScroll expandTree'
                    // loadData={this.onLoadData}
                    expandedKeys={defaultExpandedKeys}
                    showIcon={true}
                    autoExpandParent={false}
                    selectedKeys={defaultTreeSelectedKeys}
                    onSelect={this.onSelect}
                    defaultExpandAll
                    onExpand={this.onExpand}
                >
                    {loop(treeData, null, 1)}
                </Tree>
            </Spin>
        );
    }
}
