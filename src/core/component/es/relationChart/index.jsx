import G6 from '@antv/g6'
import React from 'react'
// import _ from 'underscore'
import _ from 'lodash'
import './style.less'
// const G6 = require('@antv/g6')
// const G6Plugins = require('@antv/g6/build/plugins')
const Util = G6.Util
//import '@antv/g6/build/plugin.tool.highlightSubgraph'

/**
 * 分层级 血缘关系图 展示
 * @param  {Object} [params={option:{ 数据参照 defaultOption },sourceData:{ 树状结构数据}}] [description]
 * option:{ 数据参照 defaultOption }
 * sourceData:{ } 树状结构数据，格式参照 this.sourceData，
 * 注意：每层根节点不需要 parent，非最外层节点都需要指定parent、type（group|node）、level（节点所在层）、depth（所在树的节点深度）
 * 概念澄清：层级 指的是 渲染后的 所在 列，每一列一个层级
 *
 * refreshGraph 关系图初始外部调用方法 @params {'sourceData':树状数据，'option':定义显示配置}
 *
 *扩展时，对外暴露的方法 addChildren @params{node:{ 当前操作的节点 },expandNodeList:[点击已经展开的节点list]}
 *隐藏时，对外暴露的方法 hideChildren @params{node:{ 当前操作的节点 },expandNodeList:[点击已经展开的节点list]}
 *删除时，对外暴露的方法 removeChildren @params{node:{ 当前操作的节点 },expandNodeList:[点击已经展开的节点list]}
 */
export default class RelationChart extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            totalloading:false
        }
        //容器ID
        this.containerId = 'container'

        //默认配置项，可再外部定义
        this.defaultOption = {
            'marginX': 20, //左边距
            'marginY': 20, //上边距
            'groupWidth': 200, //分组的宽度
            'groupTitleHeight': 20, //分组标题的高度
            'xSpace': 100, //层级之间横向的间隔
            'ySpace': 20, //节点或群组之间纵向的间隔
            'nodeWidth': 160, //未启用，目前叶子节点大小是动态计算，越往内扩展节点越小
            'nodeHeight': 20, // 叶子节点高度
            'nodePaddingLeft': 20, //内左侧边距
            'nodePaddingTop': 20, //内上侧边距
            'groupLayout': { //画布 初始配置
                'fitView': 'tl', //参看g6的文档
                'width': window.innerWidth,
                'height': window.innerHeight,
                'fitViewPadding':[0,0,0,50],
                'defaultIntersectBox': 'rect'
            },
            'nodeStyle': {

                // 'hightLightColor': '#eb2f96', //鼠标选中时的颜色
                'backgroundColor': '#ffffcc', //节点背景颜色配置

                //节点样式配置，css直接生效
                'textStyle': 'color:#333;text-align:center;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;border:1px solid #ffcc65;text-indent: 5px;display:inline-block;border-radius: 3px;font-size:12px;',
            },
            'hightLight': {
                'color':"#ffc811", //相关节点和线的颜色
                'selectNodeColor':'#ffc811' //选中的节点或线的颜色
            },
            'groupStyle': [{
                //group外框div样式，css直接生效
                'borderStyle': 'border:1px solid #8fa6c6;border-radius: 5px;color:#333;overflow:hidden;',

                //group标题div样式，css直接生效
                'textStyle': 'border-top: 3px solid #2166d9;color:#333;font-size:12px;border-top-left-radius: 5px;text-indent: 5px;padding-top: 5px;border-top-right-radius: 5px;',
                'color':'#e8f1fd',
                'toolStyle': { //节点工具条配置
                    'show': true,
                    'style': '',
                    'btnStyle': { //节点工具条配置
                        'edit': { //编辑按钮
                            'show': true,
                            'icon': 'anticon anticon-form',
                            'style': 'color:#efb126;text-indent: 0px;padding-top: 3px;cursor: pointer;padding-right: 5px;',
                        },
                        'expend': { //展开按钮
                            'show': true,
                            // 'icon': 'anticon anticon-plus-circle YellowColor',
                            'icon': 'anticon YellowColor',
                            'style': 'color:#efb126;text-indent: 0px;padding-top: 3px;cursor: pointer;padding-right: 5px;'
                        },
                        'hide': { //隐藏按钮
                            'show': true,
                            // 'icon': 'anticon anticon-minus-circle',
                            'icon': 'anticon',
                            'style': 'color:#efb126;text-indent: 0px;padding-top: 3px;cursor: pointer;padding-right: 5px;'
                        },
                        'del': { //删除按钮
                            'show': true,
                            'icon': 'anticon anticon-close-circle RedColor',
                            'style': 'color:#ff5c46;padding-right: 8px;font-size:inherit;padding-top: 3px;cursor: pointer;text-indent: 0px;'
                        }
                    }
                }
            }],
            'edgeStyle': { //边样式
                //'color': '#1890ff',
                //'hightLightColor': '#eb2f96',
                'radius':25,
                'endArrow': {
                    'style': {
                        'fill': '#87bfff'
                    }
                },
            }

        }

        //外部传入树状数据
        this.sourceData = {
            nodes: [
                [{
                    id: 'group1',
                    level: 1,
                    label: '群组1',
                    type: 'group',
                    depth: 1,
                    // parent:'root',
                    children: [{
                        id: 'group2',
                        level: 1,
                        label: '群组sub1',
                        type: 'group',
                        depth: 2,
                        parent: 'group1',
                        children: [{
                            id: 'node1',
                            level: 1,
                            label: 'node1',
                            type: 'node',
                            depth: 3,
                            parent: 'group2',
                        },
                            {
                                id: 'node2',
                                level: 1,
                                label: 'node2',
                                type: 'node',
                                depth: 3,
                                parent: 'group2',
                            }
                        ]
                    },
                        {
                            id: 'group3',
                            level: 1,
                            label: '群组sub2',
                            type: 'group',
                            parent: 'group1',
                            depth: 2,
                            children: [{
                                id: 'node10',
                                level: 1,
                                label: 'node10',
                                type: 'node',
                                depth: 3,
                                parent: 'group3',
                            }]
                        }
                    ]
                },
                    {
                        id: 'group4',
                        level: 1,
                        label: '群组4',
                        depth: 1,
                        type: 'group',
                        children: [{
                            id: 'group5',
                            level: 1,
                            label: '群组sub3',
                            type: 'group',
                            depth: 2,
                            parent: 'group4',
                            children: [{
                                id: 'node3',
                                level: 1,
                                label: 'node3',
                                type: 'node',
                                depth: 3,
                                parent: 'group5',
                            },
                                {
                                    id: 'node4',
                                    level: 1,
                                    label: 'node4',
                                    type: 'node',
                                    depth: 3,
                                    parent: 'group5',
                                }
                            ]
                        },
                            {
                                id: 'group6',
                                level: 1,
                                label: '群组sub4',
                                type: 'group',
                                depth: 2,
                                parent: 'group4',
                                // children:[
                                //     {
                                //         id: 'node11',
                                //         level: 1,
                                //         label: 'node3',
                                //         type:'node',
                                //         depth:3,
                                //         parent:'group6',
                                //     }
                                // ]
                            }
                        ]
                    },
                ],
                [{
                    id: 'group7',
                    level: 2,
                    label: '群组7',
                    depth: 1,
                    type: 'group',
                    children: [{
                        id: 'group8',
                        level: 2,
                        label: '群组sub5',
                        type: 'group',
                        depth: 2,
                        parent: 'group7',
                        children: [{
                            id: 'node5',
                            level: 2,
                            label: 'node5',
                            depth: 3,
                            type: 'node',
                            parent: 'group8'

                        },
                            {
                                id: 'node6',
                                level: 2,
                                label: 'node6',
                                depth: 3,
                                type: 'node',
                                parent: 'group8',
                                // visible:false,
                            }
                        ]
                    }, ]
                }, ],
                [{
                    id: 'group9',
                    level: 2,
                    label: '群组9',
                    depth: 1,
                    type: 'group',
                    children: [{
                        id: 'group11',
                        level: 2,
                        label: '群组sub11',
                        type: 'group',
                        depth: 2,
                        parent: 'group9',
                        children: [{
                            id: 'node51',
                            level: 2,
                            label: 'node51',
                            depth: 3,
                            type: 'node',
                            parent: 'group11'

                        },
                            {
                                id: 'node61',
                                level: 2,
                                label: 'node61',
                                depth: 3,
                                type: 'node',
                                parent: 'group11',
                                // visible:false,
                            }
                        ]
                    }, ]
                }, ]
            ],
            edges: [{
                id: 'edge1',
                target: 'node2',
                source: 'node5'
            },
                {
                    id: 'edge2',
                    target: 'node3',
                    source: 'group6'
                },
                {
                    id: 'edge3',
                    target: 'node4',
                    source: 'group7'
                },
                {
                    id: 'edge5',
                    target: 'node1',
                    source: 'node5'
                },
                {
                    id: 'edge51',
                    target: 'node1',
                    source: 'node51'
                }
            ]
        }

        //树状数据转换后的中间数据
        //数据格式： 大致如：[[{},{},{}],[{},{}],[{},{}]] 每一个[{},{},{}]表示一个层级的数据
        this.groupNodeList = [],

            //计算得到XY后的节点LIST数据
            this.nodesXY = {}

        //g6 graph 实例
        // this.group = {}

        //渲染前的最终数据
        this.graphData = {}

        //操作展开过的节点 ID OBJECT
        this.expendNodeCache = {}

        //隐藏数据临时存储，暂不使用
        this.hideCacheNodeList = {} //格式{nodeId:[]}

        //中间存储所有节点数据nodeId=>{id:'node1',type:'group'...}
        this.nodeKeyValues = {}

        //中间存储当前展示的nodeid 数据,['group1','group2','group3','node1','node2']
        this.nodeIdList = []

    }

    //获取节点ID 所在的层级深度
    // getTreeDepth = (nodeId) => {
    //     let depth = 0
    //     if (this.treeKeyObjList[nodeId] != undefined) {
    //         depth++
    //         let cdepth = this.getTreeDepth(this.treeKeyObjList[nodeId])
    //         depth = depth + cdepth
    //     }
    //     return depth
    // }

    // loopNodes = (data) => {
    //
    // }

    //遍历单层下的树数据,按树的顺序，转成成List格式
    loopNodes = ( params ) => {
        let defParams = {
            parent:'',
            level:1
        }
        let {nodes, parent,  level } = { ...defParams, ...params }

        let nodeList = []
        let nodeIdList = []
        let _this = this
        nodes.forEach(function(n, k) {
            let nodeData = n
            nodeData.parent = parent
            nodeData.level = level

            if (n.children != undefined) {

                let children = n.children
                delete nodeData.children
                nodeList.push(nodeData)
                //nodeIdList.push[nodeData.id]

                let childrenNodes = _this.loopNodes({nodes:children, parent:nodeData.id, level:level})
                childrenNodes.forEach(function(cn, ck) {;
                    nodeList.push(cn)
                })

            } else {
                nodeList.push(nodeData)

            }
        })
        return nodeList
    }

    //树状数据转换成nodeList，节点的顺序必须按照 根节点开始，先父亲再子节点的顺序一个个分支遍历
    treeDataToListData = (treeDataNodes) => {
        let nodeLevelList = []
        let _this = this
        treeDataNodes.forEach(function(nodes, k) {
            let level = k + 1
            let levelList = _this.loopNodes({nodes:nodes,level:level})
            nodeLevelList.push(levelList)
        })
        return nodeLevelList
    }

    loopSourceData = (data, redone = false) => {
        let _this = this
        //let nXyList = {}
        let {
            marginX,
            marginY,
            xSpace,
            ySpace,
            nodeWidth,
            nodeHeight,
            groupWidth,
            groupTitleHeight,
            nodePaddingLeft
        } = _this.defaultOption
        let preDepth = 1
        let isNode = 0
        let nodeNum = 0 // 当前节点同level的node类型累计
        let groupNum = 0 // 当前节点同level的group类型累计
        let ySpaceExtra = 0

        let nodeList = []
        data.forEach(function(n, k) {
            //if( n.id == undefined ){
            if (_this.nodesXY[n.id] == undefined || redone) {
                _this.nodesXY[n.id] = {}
                _this.nodesXY[n.id]['x'] = marginX + (n.level - 1) * groupWidth + (n.level - 1) * xSpace + (n.depth - 1) * nodePaddingLeft

                if (n.depth < preDepth) {
                    //如果当前深度小于上一个节点，则需要累加 ySpace
                    ySpaceExtra = ySpaceExtra + (preDepth - n.depth) * ySpace
                }
                preDepth = n.depth

                _this.nodesXY[n.id]['y'] = marginY + k * ySpace + nodeHeight * nodeNum + ySpaceExtra + groupNum * groupTitleHeight
                if (n.type == 'node') {
                    _this.nodesXY[n.id]['y'] += ySpace
                }

                if (n.type == 'node') {
                    nodeNum++
                }

                if (n.type == 'group') {
                    groupNum++
                }


                nodeList.push({ ...data[k],
                    ..._this.nodesXY[n.id]
                })

            }else{
                if (n.type == 'node') {
                    nodeNum++
                }

                if (n.type == 'group') {
                    groupNum++
                }
            }
        })

        return nodeList
    }

    /**
     * [getNodesXY 获取所有节点xy坐标]
     * @param  {[type]}  nodes          [需要计算XY的节点数据]
     * @param  {Boolean} [redone=false] [是否重算]
     * @return {[type]}                 [计算XY后的节点数据]
     */
    getNodesXY = (nodes, redone = false) => {
        let _this = this
        // let nodes = this.sourceData.nodes
        nodes.forEach(function(n, k) {
            nodes[k] = _this.loopSourceData(n, redone)
        })
        return nodes
    }

    getFilterGroupNodeList = (groupNodeList, filterGroupList) => {
        let _this = this
        groupNodeList.forEach(function(node, i) {
            if (node.type == 'group') {
                if (filterGroupList[node.parent]) {
                    filterGroupList[node.id] = node

                    //判断过的不再判断，不然会无限的循环
                    delete groupNodeList[i]

                    filterGroupList = _this.getFilterGroupNodeList(groupNodeList, filterGroupList)
                }
            }
        })
        return filterGroupList
    }

    /**
     * [filterChildrenByGroup 根据输入的group数据，过滤点该节点下的所有类型节点]
     * @param  {[object]} data [需要过滤的节点详细数据]
     * @return {[object]}      [groupNodeList: 过滤后节点list数据；filterNodeList：被过滤的节点id数据]
     */
    getfilterNodesByGroup = (data) => {
        let groupNodeList = this.groupNodeList[data.level - 1]
        let filterNodeList = {}
        filterNodeList[data.id] = data

        //查找并删除group
        filterNodeList = this.getFilterGroupNodeList(groupNodeList, filterNodeList)
        // groupNodeList = nodeList.groupNodeList
        // filterNodeList = nodeList.filterNodeList

        //删除group下的节点
        groupNodeList.forEach(function(node, i) {
            if (node.type == 'node') {
                if (filterNodeList[node.parent]) {
                    //delete groupNodeList[i]
                    filterNodeList[node.id] = node
                }
            }
        })

        return filterNodeList
    }

    editClick = async (item,e) => {
        let data =  item.model
        if (this.props.editClick == undefined)
            return

        await this.props.editClick(data)
    }

    //获取节点在groupNodeList数据中的位置
    getCurrentNodePos = (data) => {
        let pos = 'None'
        let groupNodeList = this.groupNodeList[data.level - 1]
        //得到节点的位置
        groupNodeList.forEach(function(node, k) {
            if (node.id == data.id) {
                pos = k
            }
        })

        return pos
    }

    getExpendNodes = () => {
        return Object.keys(this.expendNodeCache)
    }

    delExpendNode = (data) => {
        if (this.expendNodeCache[data.id] != undefined) {
            delete this.expendNodeCache[data.id]
        }
    }

    //删除某个节点相关的线
    removeNodeEdge = (item) => {
        let _this = this
        let sEdges = item.getEdges()
        //console.log(data,'---expend node---')
        sEdges.forEach((n, i) => {
            //console.log(n,'---delete edge---')
            if ( n.model.source == item.model.id ||  n.model.target == item.model.id ) {
                _this.graph.remove(n.model.id)
            }
        })

    }

    //节点添加，扩展子节点
    expendNodeClick = async (item, e) => {
        let _this = this
        let data = item.model
        //console.log(item.getChildren(),'------------addclick');
        if (this.props.addChildren == undefined)
            return

        //删除展开节点上的线，因为展开后应该是指到子节点
        this.removeNodeEdge(item)


        let childrenData = await this.props.addChildren({
            'node': data,
            'expandNodeList': this.getExpendNodes()
        })
        let expandNodeList = this.loopNodes( {nodes:childrenData.nodes, parent:data.id, level:data.level} )


        //在节点位置后面插入展开的子节点数据
        let pos = this.getCurrentNodePos(data)
        let groupNodeList = this.groupNodeList[data.level - 1]
        if (pos != 'None') {
            groupNodeList = _.concat(groupNodeList.slice(0, pos + 1), expandNodeList, groupNodeList.slice(pos + 1))
            this.groupNodeList[data.level - 1] = groupNodeList
        }

        //重新计算当前层级下节点的XY,并Update，已经存在的节点，追加新的节点
        let renderGroupNodeList = []
        renderGroupNodeList.push(groupNodeList)
        let groupNodes = this.getNodesXY(renderGroupNodeList, true)

        //更新当前层级的原有的位置，添加新的节点
        let currentGroupNodes = groupNodes[0]
        currentGroupNodes.reverse()
        let updateList = []

        //先添加后修改
        currentGroupNodes.forEach(function(n, i) {
            let node = _this.graph.find(n.id)
            if (node) {
                _this.graph.update(node, n)
            } else {
                _this.graph.add(n.type, n)
            }
        })

        //添加边数据
        let edges = this.edgesFilter(childrenData.edges)
        edges.forEach(function(n, i) {
            let node = _this.graph.find(n.id)
            if (!node) {
                _this.graph.add('edge', n)
            } else {
            }
        })

        this.expendNodeCache[data.id] = 1


        //重置布局大小
        this.changeLayoutSize()
    }

    //隐藏当前节点下的子节点
    hideNodeClick = (item,e) => {
        let _this = this

        let data = item.model

        //隐藏子节点的时候，所有子节点的关系线，得接入到当前节点上
        let childrens = item.getChildren()
        childrens.forEach((n, k) => {
            let cid = n.id
            let edges = n.getEdges()
            edges.forEach((cn, ck) =>{

                let backEdge = {}

                if ( cn.model.source == cid ){
                    backEdge['id'] = data.id + '_' + cn.model.target
                    backEdge['source'] = data.id
                    backEdge['target'] = cn.model.target
                }

                if( cn.model.target == cid ) {
                    backEdge['id'] = cn.model.source + '_' + data.id
                    backEdge['target'] = data.id
                    backEdge['source'] = cn.model.source
                }

                if( backEdge['id'] ){
                    let node = _this.graph.find(backEdge['id'])
                    if( !node ){
                        //不存在则添加
                        _this.graph.add('edge',backEdge)
                    }
                }

            })
        })

        this.removeNodes(data, 'hide')

        //从扩展数据删除
        this.delExpendNode(data)

        if (this.props.hideChildren != undefined) {
            this.props.hideChildren({
                'node': data,
                'expandNodeList': this.getExpendNodes()
            })
        }


    }

    handleNodeClick=({model},e)=>{
        this.props.handleNodeClick&&this.props.handleNodeClick(model,e)
    }

    /**
     * [removeNodes 根据操作节点，删除该节点下所有节点]
     * @param  {[type]} data            [description]
     * @param  {String} [operate='del'] [默认删除当前节点，隐藏的时候不删除当前节点, del 删除, hide 隐藏]
     * @return {[type]}                 [description]
     */
    removeNodes = (data, operate = 'del') => {
        let _this = this

        // 删除要显示的节点
        let filterNodeList = this.getfilterNodesByGroup(data)
        if (operate == 'hide') {
            //隐藏的时候，不能删除当前节点
            delete filterNodeList[data.id]
        }

        _.forEach(filterNodeList, function(val, nodeId) {
            _this.graph.remove(nodeId)
        })

        //获取需要显示的节点列表
        let groupNodeList = this.groupNodeList[data.level - 1]

        //保存隐藏的子节点数据,暂不完全实现
        // if( operate == 'hide'  ){
        //     let keys = Object.keys(filterNodeList)
        //     let filterNodeListLength = keys.length
        //     let pos = this.getCurrentNodePos(data)
        //     let hideNodeList = groupNodeList.slice[pos+1, pos+filterNodeListLength]
        //     this.hideCacheNodeList[data.id] = hideNodeList
        // }

        groupNodeList = _.filter(groupNodeList, function(n) {
            if (filterNodeList[n.id]) {
                return false
            } else {
                return true
            }
        });

        this.groupNodeList[data.level - 1] = groupNodeList

        //重新计算所有节点的XY,并Update
        let renderGroupNodeList = []
        renderGroupNodeList.push(groupNodeList)
        let groupNodes = this.getNodesXY(renderGroupNodeList, true)

        let currentGroupNodes = groupNodes[0]
        currentGroupNodes.reverse()
        currentGroupNodes.forEach(function(n, i) {
            if (n.level == data.level) {
                _this.graph.update(n.id, n)
            }
        })

    }

    //删除节点
    removeNodeClick = (item,e) => {
        let data = item.model
        if (this.props.removeChildren == undefined)
            return

        let res = this.props.hideChildren({
            'node': data,
            'expandNodeList': this.getExpendNodes()
        })

        if (res.status) {
            //删除成功
            //从扩展数据中删除
            this.delExpendNode(data)

            this.removeNodes(data)
        }
    }

    //根据分层及 depth 排序后的 nodes 数据（中间list数据），转成成渲染前的 groups 和 nodes
    //格式化成g6 的 groups 和 nodes 数据
    getRenderGroupNodes = (groupNodeList) => {
        let _this = this
        let nodeRelationData = {
            nodes: [],
            groups: [],
        }
        let nodes = this.getNodesXY(groupNodeList)

        nodes.forEach(function(n, k) {
            n.forEach(function(cn, ck) {
                if (cn.type == 'group') {
                    nodeRelationData['groups'].push(cn)
                } else {
                    nodeRelationData['nodes'].push(cn)
                }
            })
        })
        nodeRelationData['groups'].reverse()
        return nodeRelationData
    }

    /**
     * [edgesFilter edges数据容错处理]
     * @param  {[type]} edges [description]
     * @return {[type]}       [description]
     */
    edgesFilter = (edges) => {
        //过滤掉自己指向自己的数据
        let showEdges = []
        if(edges){
            edges.forEach(function(edge, k) {
                if (edge.source != edge.target) {
                    showEdges.push(edge)
                }
            })
        }
        return showEdges
    }

    /**
     * [prepareNodeData 树状 的源数据转换成 渲染前数据处理]
     * @param  {[object tree]} sourceData [源数据]
     * @return {[object]}            [渲染前的g6数据]
     */
    prepareNodeData = (sourceData) => {

        let _this = this
        let relationDataList = {}

        let edges = this.edgesFilter(sourceData.edges)

        let groupNodeList = this.treeDataToListData(sourceData.nodes)

        //保存中间结果，以便其他操作调用
        this.groupNodeList = groupNodeList

        //得到渲染前的 nodes 和 groups，格式化成g6的数据结构
        let groupNodes = this.getRenderGroupNodes(groupNodeList)

        relationDataList = { ...groupNodes,
            edges: edges
        }

        return relationDataList
    }

    //生成容器id，避免多次引用重复
    getContainerId = () => {
        let idNumber = parseInt(100 * Math.random() * 10 * Math.random())
        this.containerId = this.containerId + idNumber
    }

    componentWillMount() {
        //this.setState({totalloading:true})
        this.getContainerId()
    }

    componentDidMount() {
        if (this.props.option != undefined) {
            this.assignOption(this.props.option)
        }
        //this.setState({totalloading:false})
    }

    /**
     * [assignOption 自定义配置 与 默认配置合并处理]
     * @param  {[object]} option [自定义配置]
     * @return {[void]}        [无]
     */
    assignOption(option) {
        let defGroupStyle = this.defaultOption.groupStyle
        let optionGroupStyle = []
        if (option.groupStyle != undefined) {
            optionGroupStyle = option.groupStyle
            //自定义的groupStyle配置，每一级的配置都要和默认级别groupStyle合并，如对应级别没有，则以第一个groupStyle为基准配置
            optionGroupStyle.forEach(function(s, i) {
                if (defGroupStyle[i] == undefined) {
                    optionGroupStyle[i] = _.merge({}, defGroupStyle[0], s)
                } else {
                    optionGroupStyle[i] = _.merge({}, defGroupStyle[i], s)
                }
            })
            option.groupStyle = optionGroupStyle
        }
        _.merge(this.defaultOption, option)
    }

    /**
     * [refreshGraph 外部调用方法]
     * @param  {[obejct]} params [{sourceData:{}格式数据，参照 this.sourceData ,option:{显示配置}}}]
     * @return {[type]}        [description]
     */
    refreshGraph = (params) => {
        //params = {...params, ...this.sourceData}
        //this.setState({totalloading:false})
        if (params.option != undefined) {
            this.assignOption(params.option)
        }

        if (params.sourceData != undefined) {
            this.graphData = this.prepareNodeData(params.sourceData)
        }

        this.renderGraph(this.graphData)
    }

    objectToString = (objData) => {
        let dList = []
        _.forEach(objData, function(val, key) {
            dList.push(key + ":" + val)
        })
        return dList.join(';')
    }

    //计算画布大小
    getLayoutSize = () => {
        let _this = this
        const {
            marginX,
            marginY,
            xSpace,
            ySpace,
            // nodeWidth,
            // nodeHeight,
            groupWidth,
            groupTitleHeight,
            // nodePaddingLeft,
            groupLayout,
            // edgeStyle,
            // groupStyle,
            // nodeStyle
        } = this.defaultOption
        console.log(groupLayout,'-----groupLayout')
        //动态计算宽度
        let levelNum = this.groupNodeList.length //节点层次数
        let layoutWidth = levelNum * groupWidth + (levelNum - 1) * xSpace + marginX * 2 //计算需要的布局宽度
        if (groupLayout.width > layoutWidth) { //如果需要的宽度大于初始配置，则用初始配置的宽度
            layoutWidth = groupLayout.width
        }

        //动态计算高度
        //获取节点最多的层级，应该是最高的一层
        let nodeLenKey = 'None'
        let nodeLengthMax = 0
        this.groupNodeList.forEach(function(nodelist, k) {

            let nodeLength = nodelist.length
            if (nodeLength > nodeLengthMax) {
                nodeLengthMax = nodeLength
                nodeLenKey = k
            }
        })
        //console.log(nodeLenKey, '----nodeLength')
        let layoutHeight = 0
        if (nodeLenKey != 'None') {
            //需要计算最长列的最外层， group的个数，累加每个group的高度 就是画布需要的高度

            let cGroupNodeList = this.graph.getGroups();

            //最外层group的个数
            let groupCurrentListNum = 0

            //最多节点所在列的level，也就是第几列
            nodeLenKey = nodeLenKey + 1

            cGroupNodeList.forEach(function(g, k) {
                let gModel = g.model
                //console.log(gModel, '--------model')
                if (gModel.type == 'group' && gModel.level == nodeLenKey && gModel.depth == 1 ) {
                    //console.log(gModel, '--------model=============')
                    let childrenBBox = g.getChildrenBBox()
                    if (isFinite(childrenBBox.height)) {
                        //如果有子节点，则能取到childrenBox
                        layoutHeight = layoutHeight + childrenBBox.height + groupTitleHeight
                    } else {
                        //如果没有子节点，则只有title的height
                        layoutHeight = layoutHeight + groupTitleHeight
                    }
                    groupCurrentListNum++
                }
            })

            //如果没有找到，说明数据列被合并了，而且最长列最外层只有一个group
            let maxLenGroupNode = []
            if( !groupCurrentListNum ){
                cGroupNodeList.forEach(function(g, k) {
                    let gModel = g.model
                    //console.log(gModel, '--------model')
                    if (gModel.type == 'group' && gModel.level == nodeLenKey && gModel.depth == 2 ) {
                        maxLenGroupNode.push(_this.graph.find(gModel.parent))
                        //return
                    }
                })

                if( maxLenGroupNode.length ){
                    maxLenGroupNode.forEach(function(g, k) {
                        let childrenBBox = g.getChildrenBBox()
                        if (isFinite(childrenBBox.height)) {
                            //如果有子节点，则能取到childrenBox
                            layoutHeight = layoutHeight + childrenBBox.height + groupTitleHeight
                        } else {
                            //如果没有子节点，则只有title的height
                            layoutHeight = layoutHeight + groupTitleHeight
                        }
                    })
                }

                groupCurrentListNum = maxLenGroupNode.length

            }

            layoutHeight = layoutHeight + (groupCurrentListNum + 1) * ySpace + marginY * 3
        }
        //console.log(layoutWidth, layoutHeight, '====================')
        if ( groupLayout.height > layoutHeight  ) { //如果需要的宽度大于初始配置，则用计算后的宽度
            layoutHeight = groupLayout.height
        }

        if( groupLayout['fitViewPadding'] && groupLayout['fitViewPadding'][4] ){
            layoutWidth = layoutWidth + groupLayout['fitViewPadding'][4]
        }
       //layoutWidth = layoutWidth * 1.2
        //layoutHeight = layoutHeight*1.2
        
        return {
            width: layoutWidth,
            height: layoutHeight
        }

    }

    //重置画布的大小
    changeLayoutSize = () => {
        let {
            width,
            height
        } = this.getLayoutSize()
        //console.log(width, height, '-------------------------')
       this.graph.changeSize(width, height)
    }

    //初始交互事件
    initBehaviour = () => {

        // 注册鼠标单击节点,节点及相关边高亮
        // 注册单击关系,高亮当前关系和节点
        this.nodeLinkHightlight()
    }

    /**
     * 高亮选中节点及最近的上下游
     */
    nodeRelationHightlight = () => {
        const {
            nodeStyle,
            edgeStyle,
            hightLight
        } = this.defaultOption
        let _this = this

        let showNodesCache = {};
        G6.registerBehaviour('nodeHightlight', graph => {
            graph.behaviourOn('node:click', ev => {
                let isClick =  0
                if ( showNodesCache[ev.item.model.id]  ) {
                    //判断是否点击了当前节点
                    isClick = 1
                }

                if (showEdgesCache != 'None') {
                    //清楚上次选中节点的高亮效果
                    graph.update(showEdgesCache, {
                        color: edgeStyle.color,
                        size:1
                    });

                    let source = showEdgesCache.getSource()
                    let target = showEdgesCache.getTarget()
                    graph.update(source, {
                        color: ''
                    });
                    graph.update(target, {
                        color: ''
                    });
                    showEdgesCache = 'None'
                }

                if ( _.isEmpty(showNodesCache) === false ) {
                    //console.log('------------------=-============================')
                    _.forEach(showNodesCache, (node, k) => {
                        //console.log(node,'12312');
                        //清楚上次选中节点的高亮效果
                        graph.update(node, {
                            // color: nodeStyle.backgroundColor
                            color: ''
                        });
                        let edges = node.getEdges()
                        edges.forEach(function(edge, k) {
                            graph.update(edge, {
                                color: edgeStyle.color,
                                size:1
                            });
                        })
                    })
                    showNodesCache = {}
                }

                if ( !isClick  ) {
                    graph.update(ev.item, {
                        color: hightLight.selectNodeColor
                    });
                    let edges = ev.item.getEdges()
                    edges.forEach(function(edge, k) {
                        //高亮边线
                        graph.update(edge, {
                            color: hightLight.color,
                            size:3,
                            index: 1
                        });

                        //高亮两边节点
                        let source = edge.getSource()
                        let target = edge.getTarget()

                        //高亮对应节点
                        if( source.id != ev.item.model.id ){
                            graph.update(source, {
                                color: hightLight.color
                            });
                            showNodesCache[source.id] = source
                        }

                        if( target.id != ev.item.model.id ){
                            graph.update(target, {
                                color: hightLight.color
                            });
                            showNodesCache[target.id] = target
                        }

                    })

                    //上次点击过的node
                    showNodesCache[ev.item.model.id] = ev.item
                }



            });

        });


        注册单击关系,高亮当前关系和节点
        let showEdgesCache = 'None';
        G6.registerBehaviour('edgeHightlight', graph => {
            graph.behaviourOn('edge:click', ev => {
                let isClick =  0
                if (showEdgesCache != 'None' && showEdgesCache.model.id == ev.item.model.id ) {
                    isClick =  1
                }

                if (showNodesCache.length > 0) {
                    showNodesCache.forEach(function(node, k) {
                        //清除上次选中节点的高亮效果
                        graph.update(node, {
                            color: ''
                        });
                        let edges = node.getEdges()
                        edges.forEach(function(edge, k) {
                            graph.update(edge, {
                                color: edgeStyle.color,
                                size:1
                            });
                        })
                    })
                    showNodesCache = []
                }

                if (showEdgesCache != 'None') {
                    //清除上次选中节点的高亮效果
                    graph.update(showEdgesCache, {
                        color: edgeStyle.color,
                        size:1
                    });
                    let source = showEdgesCache.getSource()
                    let target = showEdgesCache.getTarget()
                    graph.update(source, {
                        //color: nodeStyle.backgroundColor
                        color: ''
                    });
                    graph.update(target, {
                        //color: nodeStyle.backgroundColor
                        color: ''
                    });

                    showEdgesCache = 'None'
                }

                if ( !isClick  ) {
                    graph.update(ev.item, {
                        color: hightLight.selectNodeColor,
                        size:3,
                        index: 1
                    });
                    let source = ev.item.getSource()
                    let target = ev.item.getTarget()
                    graph.update(source, {
                        color: hightLight.color
                    });
                    graph.update(target, {
                        color: hightLight.color
                    });

                    //上次点击过的node
                    showEdgesCache = ev.item
                }
            });
        });

    }

    /**
     * 高亮整条链路节点
     */
    nodeLinkHightlight = () => {
        const {
            nodeStyle,
            edgeStyle,
            hightLight
        } = this.defaultOption

        let _this = this

        // 注册鼠标单击节点,节点及相关边高亮
        let showNodesCache = {};
        let showEdgesCache = 'None';

        G6.registerBehaviour('nodeHightlight', graph => {
            graph.behaviourOn('node:click', ev => {
                let isClick =  0
                if ( showNodesCache[ev.item.model.id]  ) {
                    //判断是否点击了当前节点
                    isClick = 1
                }

                if ( _.isEmpty(showNodesCache) === false ) {
                    _.forEach(showNodesCache, function(itm, key) {
                        let arrObj = {
                            color: ''
                        }
                        if( itm.type === 'edge' ){
                            arrObj['size'] = 1
                        }
                        graph.update(itm, arrObj)
                    })
                    showNodesCache = {}
                }

                if ( !isClick ){
                    showNodesCache = _this._getRelationLinkItem(ev.item)
                    _.forEach(showNodesCache, function(itm, key) {
                        let arrObj = {
                            color: hightLight.color
                        }
                        if( itm.type === 'edge' ){
                            arrObj['size'] = 3
                        }
                        graph.update(itm, arrObj)
                    })
                }
            })

            graph.behaviourOn('edge:click', ev => {
                let isClick =  0
                if ( showNodesCache[ev.item.model.id]  ) {
                    //判断是否点击了当前节点
                    isClick = 1
                }

                if ( _.isEmpty(showNodesCache) === false ) {
                    _.forEach(showNodesCache, function(itm, key) {
                        let arrObj = {
                            color: ''
                        }
                        if( itm.type === 'edge' ){
                            arrObj['size'] = 1
                        }
                        graph.update(itm, arrObj)
                    })
                    showNodesCache = {}
                }

                if ( !isClick ){
                    let source = ev.item.getSource()
                    let target = ev.item.getTarget()       
                    let sourceList = _this._getRelationLinkItem(source, 'source')
                    let targetList = _this._getRelationLinkItem(target, 'target')
                    showNodesCache = Object.assign(sourceList, targetList)
                    showNodesCache[ev.item.id] = ev.item
                    _.forEach(showNodesCache, function(itm, key) {
                        let arrObj = {
                            color: hightLight.color
                        }
                        if( itm.type === 'edge' ){
                            arrObj['size'] = 3
                        }
                        graph.update(itm, arrObj)
                    })
                }
                
            })

        })
    }

    /**
     * 根据输入节点
     * 1、获取整体链路节点
     * 2、获取向上追溯节点
     * 3、获取向下扩展节点
     */
    _getRelationLinkItem = (item, direction ='init') => {
        let _this = this
        let itemList = {}
        let edges = item.getEdges()
        itemList[item.id] = item
        edges.forEach(function(edge, k) {           
            let source = edge.getSource()
            let target = edge.getTarget()
            let cItemList = {}
            if( direction === 'init' ){
                console.log(edge,'-----edge----')
                itemList[edge.id] = edge            
                if( source.id === item.id ){
                    //向下扩展
                    cItemList = _this._getRelationLinkItem(target, 'target')
                }

                if( target.id === item.id ){
                    //向上追溯
                    cItemList = _this._getRelationLinkItem(source, 'source')
                }

            } else if ( direction === 'target' ){
                if( source.id === item.id ){
                    itemList[edge.id] = edge
                    //向下扩展
                    cItemList = _this._getRelationLinkItem(target, 'target')
                }

            } else if ( direction === 'source' ){
                if( target.id === item.id ){
                    itemList[edge.id] = edge
                    //向上追溯
                    cItemList = _this._getRelationLinkItem(source, 'source')
                }
            }
            
            itemList = Object.assign(itemList, cItemList)
        })

        return itemList
        
    }

    //画布拖拽
    dragLayout = () => {
        // 拖拽画布交互
        let lastPoint = void 0;
        let graph = this.graph
        graph.on('canvas:mouseenter', function() {
            // graph.css({
            //     cursor: '-webkit-grabbing'
            // });
        });
        graph.on('dragstart', function() {
            graph.css({
                cursor: '-webkit-grabbing'
            });
        });
        graph.on('drag', function(ev) {
            if (lastPoint) {
                graph.translate(ev.domX - lastPoint.x, ev.domY - lastPoint.y);
            }
            lastPoint = {
                x: ev.domX,
                y: ev.domY
            };
        });
        graph.on('dragend', function() {
            lastPoint = undefined;
            graph.css({
                cursor: ''
            });
        });
        graph.on('canvas:mouseleave', function() {
            lastPoint = undefined;
        });
    }

    //渲染图像效果
    renderGraph = (graphData) => {
        const {
            marginX,
            marginY,
            xSpace,
            ySpace,
            nodeWidth,
            nodeHeight,
            groupWidth,
            groupTitleHeight,
            nodePaddingLeft,
            groupLayout,
            edgeStyle,
            groupStyle,
            nodeStyle
        } = this.defaultOption

        let offsetx = 2
        let _this = this


        //交互事件初始化
        this.initBehaviour()

        this.graph = {}

        G6.registerGroup('groupNode', {
            anchor(item) {
                return [
                    [0, 0.5],
                    [1, 0.5]
                ];
            },
            draw(item) {
                const group = item.getGraphicGroup();

                //获取所有子区域的包围盒，从中动态获取高度、宽度等数据
                let childrenBox = item.getChildrenBBox()

                let rectShow = isFinite(childrenBox.x)
                let x = group.model.x
                let y = group.model.y
                let depth = group.model.depth

                let groupStyleOption = groupStyle
                let groupStyleLength = groupStyleOption.length

                let width = isFinite(childrenBox.width) ? childrenBox.width : groupWidth
                let height = isFinite(childrenBox.height) ? childrenBox.height : groupTitleHeight

                let hWidth = width + nodePaddingLeft * 2
                let hHeight = height + ySpace * 2 + groupTitleHeight
                let currentGroupStyle = {}
                //group.model.type = "node"

                //样式从配置里面获取逻辑
                if (groupStyleLength >= depth) {
                    currentGroupStyle = groupStyleOption[depth - 1]
                } else {
                    currentGroupStyle = groupStyleOption[groupStyleLength - 1]
                }

                let textStyle = ''
                let borderStyle = ''
                let toolStyle = {}
                let titleColor = ''

                if (currentGroupStyle.borderStyle != undefined) {
                    borderStyle = currentGroupStyle.borderStyle
                }

                if (currentGroupStyle.textStyle != undefined) {
                    textStyle = currentGroupStyle.textStyle
                }

                if (currentGroupStyle.color != undefined) {
                    titleColor = currentGroupStyle.color
                }

                if( group.model.color != undefined && group.model.color != '' ){
                    titleColor = group.model.color
                }

                //console.log(titleColor,'-----titleColor')
                //toolStyle
                if (currentGroupStyle.toolStyle != undefined) {
                    toolStyle = currentGroupStyle.toolStyle
                }

                if (!rectShow) {
                    //当group没有子节点的时候，以下值无法获取，按规则自计算
                    let maxY = y + groupTitleHeight
                    let gWidth = groupWidth - (depth - 1) * nodePaddingLeft * 2
                    //节点的宽度 + 节点的x坐标
                    let maxX = gWidth + x
                    childrenBox = {
                        'minX': x,
                        'minY': y,
                        'maxX': maxX,
                        'maxY': maxY,
                        'centerX': (x + maxX) / 2,
                        'centerY': (y + maxY) / 2,
                        'height': groupTitleHeight,
                        'width': gWidth,
                        'x': x,
                        'y': y
                    }

                    hWidth = childrenBox.width
                    hHeight = groupTitleHeight
                }

                let html = G6.Util.createDOM(`<div style="height:${hHeight}px;width:${hWidth+2}px;z-index:${depth};${borderStyle}" ></div>`);
                let htmlTitle = G6.Util.createDOM(`<div style="width:${hWidth}px;height:${groupTitleHeight}px;background-color:${titleColor};${textStyle}" ></div>`);
                let groupHtmlTitle = G6.Util.createDOM(`<a style="width: 120px;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" id="group_${group.model.id}"  title="${group.model.label}">${group.model.label}</a>`)

                // groupHtmlTitle.addEventListener('click', function(e) {
                //     _this.handleNodeClick(item,e)
                // })

                htmlTitle.appendChild(groupHtmlTitle)
                if (toolStyle.show) { //节点工具条显示配置处理
                    let params = {
                        ...group.model
                    }

                    let groupHtmlTool = G6.Util.createDOM(`<span class="spanfloat"></span>`)

                    if (toolStyle.btnStyle.expend.show && !rectShow) { //expend扩展事件按钮显示
                        let groupHtmlExpand = G6.Util.createDOM(`<i class="${toolStyle.btnStyle.expend.icon}" style="${toolStyle.btnStyle.expend.style}"><svg t="1571908424527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4661" width="16" height="16"><path d="M884.392 476.688h-336.6v-336.6c0-19.422-15.891-35.312-35.313-35.312-19.421 0-35.311 15.89-35.311 35.312v336.6H140.567c-19.421 0-35.312 15.89-35.312 35.311 0 19.422 15.89 35.312 35.312 35.312h336.6v336.6c0 19.421 15.89 35.311 35.311 35.311 19.422 0 35.312-15.89 35.312-35.312V547.312h336.6c19.421 0 35.312-15.89 35.312-35.312 0.001-19.421-15.89-35.312-35.31-35.312z" p-id="4662" fill="#f6b331"></path></svg></i>`)
                        groupHtmlExpand.addEventListener('click', function(e) {
                            _this.expendNodeClick(item,e)
                        })

                        groupHtmlTool.appendChild(groupHtmlExpand);
                    }

                    if (toolStyle.btnStyle.hide.show && rectShow) { //hide隐藏事件按钮显示
                        let groupHtmlHide = G6.Util.createDOM(`<i class="${toolStyle.btnStyle.hide.icon}" style="${toolStyle.btnStyle.hide.style}"><svg t="1571909448683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3240" width="16" height="16"><path d="M928 544H96c-19.2 0-32-12.8-32-32s12.8-32 32-32h832c19.2 0 32 12.8 32 32s-12.8 32-32 32z" p-id="3241" fill="#f6b331"></path></svg></i>`)
                        groupHtmlHide.addEventListener('click', function(e) {
                            _this.hideNodeClick(item,e)
                        })
                        groupHtmlTool.appendChild(groupHtmlHide);
                    }

                    if (toolStyle.btnStyle.del.show) { //del删除事件按钮显示
                        let groupHtmlDelete = G6.Util.createDOM(`<i class="${toolStyle.btnStyle.del.icon}" style="${toolStyle.btnStyle.del.style}"></i>`)
                        groupHtmlDelete.addEventListener('click', function(e) {
                            _this.removeNodeClick(item,e)
                        })
                        groupHtmlTool.appendChild(groupHtmlDelete)
                    }

                    if (toolStyle.btnStyle.edit.show) { //edit扩展事件按钮显示
                        let groupHtmlEdit = G6.Util.createDOM(`<i class="${toolStyle.btnStyle.edit.icon}" style="${toolStyle.btnStyle.edit.style}"></i>`)
                        groupHtmlEdit.addEventListener('click', function(e) {
                            _this.editClick(item,e)
                        })
                        groupHtmlTool.appendChild(groupHtmlEdit)
                    }

                    htmlTitle.appendChild(groupHtmlTool)
                }

                html.appendChild(htmlTitle)

                return group.addShape('html', {
                    attrs: {
                        x: x,
                        y: y,
                        html,
                        height: hHeight,
                        width: hWidth
                    }
                })
            }
        });

        G6.registerNode('rectNode', {
            anchor(item) {
                return [
                    [0, 0.5],
                    [1, 0.5]
                ];
            },
            // draw(item){
            //     const group = item.getGraphicGroup();
            //     const model = item.getModel();
            //     let height = nodeHeight // 一半高
            //     let depth = model.depth
            //     let width = groupWidth - (depth - 1)*nodePaddingLeft*2
            //     group.addShape('text', {
            //       attrs: {
            //         x: 0,
            //         y: 0,
            //         fill: '#333',
            //         text: model.label
            //       }
            //     });
            //     return group.addShape('rect', {
            //       attrs: {
            //         x: 0,
            //         y: 0,
            //         width: width,
            //         height: height,
            //         stroke: 'red'
            //       }
            //     });
            // },
            // x:function(item){
            //     let model = item.model
            //     let depth = model.depth
            //     let width = groupWidth - (depth - 1)*nodePaddingLeft*2
            //     return width/2
            // },
            //shape:'rect',
            // size:function(item){
            //     let model = item.model
            //     //let width = nodeWidth // 一半宽
            //     let height = nodeHeight // 一半高
            //     let depth = model.depth
            //     let width = groupWidth - (depth - 1)*nodePaddingLeft*2
            //     return [width,height]
            // },

            draw(item) {
                const group = item.getGraphicGroup();
                let model = item.model
                let x = model.x
                let y = model.y

                let height = nodeHeight // 一半高
                let depth = model.depth
                let width = groupWidth - (depth - 1) * nodePaddingLeft * 2

                //获取节点样式配置
                let textStyleList = []
                let textStyle = ''
                if (nodeStyle.textStyle != undefined) {
                    textStyle = nodeStyle.textStyle
                }

                let backgroundColor = nodeStyle.backgroundColor
                if (model.color != undefined && model.color != '') {
                    backgroundColor = model.color
                }

                return group.addShape('html', {
                    // visible: false,
                    attrs: {
                        x: 0,
                        y: -height / 2,
                        html: '<span style="height:' + height + 'px;width:' + width + 'px;z-index:' + depth + ';background-color:' + backgroundColor + ';' + textStyle + '" title="' + model.label + '">' + model.label + '</span>',
                        height: height,
                        width: width
                    }
                })
            }
            // anchor: [
            //     [0, 0.5],     // 左边中点
            //     [1, 0.5]      // 右边中点
            // ],
            // getPath: function getPath(item) {
            //     console.log(item.model.x)
            //     let model = item.model
            //     //let width = nodeWidth // 一半宽
            //     let height = nodeHeight // 一半高
            //     let depth = model.depth
            //     let width = groupWidth - (depth - 1)*nodePaddingLeft*2
            //     return G6.Util.getRectPath(width/2, -height/2, width, height, 10);
            // }
        });

        G6.registerEdge('edgeLine', {
            getPath(item) {
                let points = item.getPoints()
                let source = item.getSource()
                let sourceModel = source.model
                let target = item.getTarget()
                let targetModel = target.model

                let offset = 25
                let radius = edgeStyle.radius ? edgeStyle.radius : offset
                let start = points[0];
                let end = points[points.length - 1];
                let hgap = end.x - start.x;
                let ygap = end.y - start.y;


                if( sourceModel.level == targetModel.level ){
                    //处理同列画线的问题
                    hgap = (sourceModel.depth - 1)*nodePaddingLeft + xSpace/2
                    return [
                        ['M', start.x, start.y],
                        ['C', start.x - hgap + radius, start.y, start.x - hgap, start.y + ygap/2, end.x, end.y],
                    ]
                }else{
                    //处理跨列同一水平线上，直线重叠的问题
                    if (end.y == start.y) {
                        //console.log(end.x , start.x, '---end.x > start.x---')
                        return [
                            ['M', start.x, start.y],
                            ['C', start.x + hgap / 4, start.y + radius + nodeHeight/2, end.x - hgap / 2, end.y - radius - nodeHeight/2, end.x, end.y]
                        ];
                    }
                }

                return [
                    ['M', start.x, start.y],
                    ['C', start.x + hgap / 2, start.y, end.x - hgap / 2, end.y, end.x, end.y]
                ];
            }
        })


        this.graph = new G6.Graph({
            container: this.containerId,
            ...groupLayout,
            modes: {
                default: ['nodeHightlight', 'edgeHightlight'],
            },
            // mode
        })
        this.graph.node({
            shape: 'rectNode',
            ...nodeStyle
        })
        this.graph.group({
            shape: 'groupNode'
        })
        this.graph.edge({
            shape: 'edgeLine',
            // zIndex: 100,
            ...edgeStyle
        })

        this.graph.on('node:click', (ev)=>{
            //console.log(ev)
            _this.handleNodeClick(ev.item, ev.domEvent)
        });

        this.graph.read(graphData)

        this.changeLayoutSize()

        this.dragLayout()
    }


    render() {
        let containerId = this.containerId
        return (
            <div style = {{width: '100%', height: '100%'}} id = {containerId}>
            </div>
        );
    }
}
