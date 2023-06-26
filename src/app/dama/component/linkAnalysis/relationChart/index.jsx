import { Button, Tooltip } from 'antd'
import * as go from 'gojs'
import React, { Component } from 'react'
import _ from 'underscore'
import minus from './images/minus.png'
import plus from './images/plus.png'
import resetPng from './images/reset.png'
import './index.less'

const $ = go.GraphObject.make

export default class RelationChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            styleLeft: '0px',
            styleTop: '0px',
            nodeInfo: {},
            styleDisplay: 'none',
            linkInfo: [],
            data: {},
            toolPosition: 'left',
            // nodeDataArray: [
            //     { key: 'g000', isGroup: true, label: 'g000123213fdsfsfsfs' },
            //     { key: 'g111', group: 'g000', label: 'g111gdfgdgfgdfgdfgdfgdfgdfgdfgfdg' },
            //     { key: 'g222', group: 'g000', label: 'g222' },
            //     { key: 'g333', group: 'g000', label: 'g333' },
            //     { key: 'Alpha', color: '#FEE900', label: 'Alphafdgdfgdfgdfgdfgfdgdgdf' },
            //     { key: 'Omega', isGroup: true, label: 'Omega' },
            //     { key: 'Beta', group: 'Omega', label: 'Beta' },
            //     { key: 'Gamma', group: 'Omega', label: 'Gamma' },
            //     { key: 'Epsilon', group: 'Omega', label: 'Epsilon' },
            //     { key: 'Zeta', group: 'Omega', label: 'Zeta' },
            //     { key: 'Delta', isGroup: true, label: 'Delta' },
            //     { key: 'Delta1', group: 'Delta', label: 'Delta1' },
            //     { key: 'Delta2', group: 'Delta', label: 'Delta2' },
            //     { key: 'Delta3', group: 'Delta', label: 'Delta3' },
            //     { key: 'Delta4', group: 'Delta', label: 'Delta4' },
            //     { key: 'c1111', isGroup: true, label: 'c1111' },
            //     { key: 'c2222', group: 'c1111', label: 'c2222' },
            //     { key: 'c3333', group: 'c1111', label: 'c3333' },
            //     { key: 'c4444', group: 'c1111', label: 'c4444' },
            //     { key: 'c555', group: 'c1111', label: 'c555' },
            // ],
            // linkDataArray: [
            //     { from: 'Alpha', to: 'Gamma', label: 'ag' }, // from a Node to the Group
            //     { from: 'Beta', to: 'Gamma', label: 'agb' }, // this link is a member of the Group
            //     { from: 'Beta', to: 'Epsilon', label: 'age' }, // this link is a member of the Group
            //     { from: 'Gamma', to: 'Zeta', label: 'agz' }, // this link is a member of the Group
            //     { from: 'Epsilon', to: 'Zeta', label: 'a12g' }, // this link is a member of the Group
            //     { from: 'Alpha', to: 'Delta4', label: 'a13g' }, // from the Group to a Node
            //     { from: 'Delta2', to: 'Delta1', label: 'a666g' }, // this link is a member of the Group
            //     { from: 'Delta3', to: 'Delta4', label: 'ag77' }, // this link is a member of the Group
            //     { from: 'Delta1', to: 'Delta4', label: 'ag99' }, // this link is a member of the Group
            //     { from: 'Delta2', to: 'Delta4', label: 'ag88' }, // this link is a member of the Group
            //     { from: 'c3333', to: 'c555', label: 'ag665' },
            //     { from: 'Delta', to: 'c555', label: 'ag4564' },
            //     { from: 'Alpha', to: 'c2222', label: 'ag464643' },
            //     { from: 'Epsilon', to: 'c3333', label: 'ag242' },
            //     { from: 'g333', to: 'Alpha', label: 'a21123g' },
            //     { from: 'g333', to: 'c3333', label: 'a13123g' },
            //     { from: 'Epsilon', to: 'Delta4', label: '5555Delta4' },
            //     { from: 'g222', to: 'Beta', label: 'g222Beta' },
            // ]
        }

        this.diagram = null
        this.myOverview = null
        this.selectedNode = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highlightColor = '#FFC811'
        this.containerId = 'linkAnalysisMainChart'
        this.graphConfig = {
            group: {
                fill: '#608FBF', // 分组填充颜色
                stroke: '#608FBF', // 分组边框颜色,
                headerBackground: '#608FBF', // 分组头部背景色,
                bodyBackground: '#ffffff', // 分组内容主体背景色,
                center: '#F2B06D', // 中心节点的颜色
            },
            node: {
                fill: 'white', // 节点边框颜色
                stroke: '#608FBF', // 节点边框颜色
                highlight: '#8CCFFF',
                selected: '#FEE900', // 节点选中时的颜色
                center: '#FEE900', // 中心节点的颜色
            },
            link: {
                stroke: '#979797',
                highlight: '#0095FF',
            },
        }
    }

    highlightLink = (link, show) => {
        console.log(link)
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke']
        link.elt(0).strokeWidth = show ? '2' : '1'
        if (link.fromNode) {
            link.fromNode.isHighlighted = show
        }

        if (link.toNode) {
            link.toNode.isHighlighted = show
        }

        // link.toNode.isHighlighted = show
    }

    highlightAllPath = (node, pos = 'init') => {
        if (!node) {
            return
        }
        let nodeId = node.data.key

        if (this.highLightNodes[nodeId]) {
            return
        } else {
            this.highLightNodes[nodeId] = 1
        }

        node.linksConnected.each((link) => {
            let fromNode = link.fromNode
            let toNode = link.toNode

            if (pos == 'init') {
                this.highlightLink(link, true)
                if (fromNode) {
                    if (fromNode.data.key === nodeId) {
                        // this.highLightNodes[toNode.data.key] = 1
                        this.highlightAllPath(toNode, 'to')
                    } else {
                        // this.highLightNodes[fromNode.data.key] = 1
                        this.highlightAllPath(fromNode, 'from')
                    }
                }
            }

            if (pos == 'from') {
                if (toNode && toNode.data.key === nodeId) {
                    // this.highLightNodes[fromNode.data.key] = 1
                    this.highlightLink(link, true)
                    this.highlightAllPath(fromNode, 'from')
                }
            }

            if (pos == 'to') {
                if (fromNode && fromNode.data.key === nodeId) {
                    // this.highLightNodes[toNode.data.key] = 1
                    this.highlightLink(link, true)
                    this.highlightAllPath(toNode, 'to')
                }
            }
        })
    }

    componentWillMount() {
        //this.setState({totalloading:true})
        this.generateContainerId()
    }

    componentDidMount() {
        // this.bindNodeData(this.props.data)
    }

    //生成容器id，避免多次引用重复
    generateContainerId = () => {
        let idNumber = parseInt(200 * Math.random() * 10 * Math.random())
        this.containerId = this.containerId + idNumber
    }

    showToolTip = (obj, diagram, tool) => {
        // var toolTipDIV = document.getElementById('toolTipDIV')
        let pt = diagram.lastInput.viewPoint
        let styleLeft = pt.x + 'px'
        let styleTop = pt.y + 20 + 'px'
        let nodeInfo = obj.data.info || {}
        let linkInfo = obj.data.labels || []
        let styleDisplay = 'block'
        this.setState({
            styleLeft,
            styleTop,
            nodeInfo,
            styleDisplay,
            linkInfo,
        })
    }

    hideToolTip = (diagram, tool) => {
        this.setState({
            styleDisplay: 'none',
        })
    }

    getScacle = (data) => {
        let scale = 0.8
        if (data) {
            if (data.length > 20) {
                scale = 0.5
            } else if (data.length > 60) {
                scale = 0.3
            } else if (data.length > 100) {
                scale = 0.3
            }
        }
        return scale
    }

    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDivTableLink' + this.containerId)
        let parentDiv = document.getElementById('chartDiagram' + this.containerId)
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDivTableLink' + this.containerId)
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDivableLink' + this.containerId)
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDivableLink' + this.containerId)
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    expendGroupNodes = (key) => {}

    initDiagram = () => {
        // this.initElement()
        let highlightColor = this.highlightColor

        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip,
        })

        let scale = this.getScacle(this.state.data.nodes)

        const diagram = $(go.Diagram, 'diagramDivTableLink' + this.containerId, {
            // initialAutoScale: go.Diagram.Uniform, // 自适应
            scale: scale,

            // initialDocumentSpot: go.Spot.TopCenter,
            // initialViewportSpot: go.Spot.TopCenter,
            initialContentAlignment: go.Spot.Center, // 加载位置
            scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
            'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
            'dragSelectingTool.isEnabled': false,
            'animationManager.isEnabled': false,
            'toolManager.hoverDelay': 500,
            allowResize: true,
            // selectable: false,
            click: (e) => {
                // background click clears any remaining highlighteds
                e.diagram.startTransaction('clear')
                e.diagram.clearHighlighteds()
                e.diagram.commitTransaction('clear')
            },
        })

        diagram.groupTemplate = $(
            go.Group,
            'Auto',
            {
                // minSize: new go.Size(150, 80),
                // layout: $(go.LayeredDigraphLayout, { direction: 270, columnSpacing: 20 }),
                layout: $(go.TreeLayout, {
                    angle: 0,
                    arrangement: go.TreeLayout.ArrangementVertical,
                    isRealtime: false,
                    nodeSpacing: 30,
                    // nodeSpacing: 10,
                    layerSpacing: 40,
                    layerStyle: go.TreeLayout.LayerUniform,
                }),
                // selectable: false,
                // isSubGraphExpanded: false,
                // when a group is expanded, if it contains no parts, generate a subGraph inside of it
                subGraphExpandedChanged: (group) => {
                    // if (group.memberParts.count === 0) {
                    //     this.expendGroupNodes(group.data.key);
                    // }
                    // return false
                },
            },
            $(
                go.Shape,
                'Rectangle', // surrounds everything
                {
                    name: 'GROUP',
                    // parameter1: 5,
                    fill: this.graphConfig['group']['fill'],
                    strokeWidth: 1,
                    stroke: this.graphConfig['group']['stroke'],
                },
                new go.Binding('desiredSize', 'size', go.Size.parse)
            ),
            $(
                go.Panel,
                'Vertical', // position header above the subgraph
                { defaultStretch: go.GraphObject.Horizontal },
                $(
                    go.Panel,
                    'Table',
                    {
                        name: 'GROUPTITLE',
                        stretch: go.GraphObject.Horizontal,
                        background: this.graphConfig['group']['headerBackground'],
                    },
                    // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                    $(
                        go.TextBlock, // group title near top, next to button
                        { alignment: go.Spot.Left, font: '12pt Sans-Serif', margin: 5, stroke: '#ffffff' },
                        new go.Binding('text', 'label')
                    ),
                    $('SubGraphExpanderButton', { column: 1, alignment: go.Spot.Right, margin: 5 })
                ),

                $(
                    go.Placeholder, // represents area for all member parts
                    { padding: new go.Margin(10, 100), background: this.graphConfig['group']['bodyBackground'] }
                )
            )
        )

        diagram.layout = $(go.LayeredDigraphLayout, { direction: 270, layerSpacing: 10, isRealtime: false, setsPortSpots: false })
        // diagram.layout = $(go.TreeLayout,  // the layout for the entire diagram
        //     {
        //         angle: 270,
        //         arrangement: go.TreeLayout.ArrangementHorizontal,
        //         isRealtime: false,
        //         layerSpacing: 40,
        //         // layerStyle: go.TreeLayout.LayerUniform
        //     })
        diagram.nodeTemplate = $(
            go.Node,
            'Auto',
            {
                // width: 179,
                minSize: new go.Size(150, 30),
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                // selectable: false,
                toolTip: myToolTip, // define a tooltip for each node that displays the color as text
                click: (e, node) => {
                    if (this.props.from == 'dataAsset') {
                        return
                    }
                    let tb = node.findObject('SHAPE')
                    if (tb !== null) {
                        this.highLightNodes = {}
                        let nodeData = node.data
                        console.log(nodeData.key, this.props.selectedId, '------node--click----')
                        // 中心点之外的节点才触发点击事件
                        if (nodeData.key != this.props.selectedId) {
                            if (this.selectedNode.key && this.selectedNode.key === nodeData.key) {
                                node.diagram.clearHighlighteds()
                                // tb.stroke = this.graphConfig['node']['highlight']
                                node.isHighlighted = false
                                // tb.fill = this.graphConfig['node']['center'] ? this.graphConfig['node']['center'] : 'white'
                                this.selectedNode = []
                            } else {
                                node.diagram.clearHighlighteds()
                                // node.linksConnected.each((l) => { this.highlightLink(l, true) })
                                this.highlightAllPath(node)
                                node.isHighlighted = true
                                // tb.stroke = this.graphConfig['node']['highlight']
                                tb.fill = this.graphConfig['node']['selected']
                                this.selectedNode = node.data
                            }
                        }

                        this.props.drillNode && this.props.drillNode(node.data)
                    }
                },
                doubleClick: (e, node) => {
                    let nodeData = node.data
                    // 中心点之外的节点才触发点击事件
                    if (nodeData.key != this.props.selectedId) {
                        this.props.nodeClick && this.props.nodeClick(e, node)
                    }
                },
            },
            new go.Binding('location', 'loc', go.Point.parse),
            $(
                go.Shape,
                'Rectangle',
                {
                    strokeWidth: 1,
                    name: 'SHAPE',
                    stroke: this.graphConfig['node']['stroke'],
                },
                new go.Binding('fill', 'isHighlighted', (h, shape) => {
                    // let nKey = shape.part.data.key
                    // if (nkey == this.props.selectedId) {
                    //     return this.graphConfig['node']['center']
                    // } else {
                    return shape.part.data.key == this.props.selectedId ? this.graphConfig['node']['center'] : h ? this.graphConfig['node']['highlight'] : 'white'
                    // }
                }).ofObject(),
                // new go.Binding('stroke', 'isHighlighted',  (h) => { return h ? this.graphConfig['node']['highlight'] : this.graphConfig['node']['stroke'] }).ofObject(),
                new go.Binding('strokeDashArray', 'isTemp', (h) => {
                    return h ? [3, 2] : ''
                })
            ),
            $(
                go.Panel,
                'Table',
                {
                    stretch: go.GraphObject.Horizontal,
                },
                $(
                    go.Picture,
                    {
                        column: 0,
                        name: 'Picture',
                        // segmentIndex: 1,
                        // segmentFraction: 0.5
                        margin: new go.Margin(5, 0, 5, 5),
                        // stroke: 'purple', strokeWidth: 2,
                        // strokeDashArray: [6, 6, 2, 2]
                    },
                    new go.Binding('source', 'domain', (domain) => {
                        if (domain == 'report_cate' || domain == 'report') {
                            return '/resources/images/dataMap/report.svg'
                        }
                    })
                ),

                $(
                    go.TextBlock,
                    {
                        // margin: 5,
                        margin: new go.Margin(5, 5, 5, 0),
                        column: 1,
                        name: 'TEXT',
                        font: '10.5pt PingFangSC-Regular,PingFang SC',
                        stroke: 'rgba(0,0,0,1)',
                        overflow: go.TextBlock.OverflowEllipsis,
                    },
                    new go.Binding('text', 'label')
                )
            )
        )
        diagram.linkTemplate = $(
            go.Link,
            {
                routing: go.Link.AvoidsNodes, // 连接线避开节点
                // routing: go.Link.Orthogonal,
                curve: go.Link.JumpOver, // lian
                // curve: go.Link.Bezier,
                toolTip: myToolTip,
                corner: 20,
                selectable: false,
                click: (e, link) => {
                    console.log(link, link.stroke, '--------link.stroke-------')
                    if (!_.isEmpty(this.selectedLink) && this.selectedLink.__gohashid === link.__gohashid) {
                        this.highlightLink(link, false)
                        this.selectedLink = {}
                    } else {
                        if (!_.isEmpty(this.selectedLink)) {
                            this.highlightLink(this.selectedLink, false)
                        }
                        link.diagram.clearHighlighteds()
                        this.highlightLink(link, true)
                        this.selectedLink = link
                    }
                },
            },
            $(
                go.Shape,
                { strokeWidth: 1, stroke: this.graphConfig['link']['stroke'] },
                new go.Binding('stroke', 'isHighlighted', (h) => {
                    return h ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke']
                }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => {
                    return h ? 2 : 1
                }).ofObject(),
                new go.Binding('strokeDashArray', 'direct', (h) => {
                    return h ? '' : [3, 2]
                })
            ),
            $(
                go.Shape,
                { toArrow: 'Standard', fill: '#a6b7c4', stroke: '#a6b7c4' },
                new go.Binding('fill', 'isHighlighted', (h, shape) => {
                    return h ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke']
                }).ofObject(),
                new go.Binding('stroke', 'isHighlighted', (h, shape) => {
                    return h ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke']
                }).ofObject()
            )
        )

        return diagram
    }

    centerStyleInit = () => {
        if (this.props.selectedId) {
            let centerNode = this.diagram.findNodeForKey(this.props.selectedId)
            if (centerNode) {
                console.log(centerNode, '------------centerNode----11111-------')

                centerNode.isHighlighted = true
                let tb = centerNode.findObject('SHAPE')
                // tb.stroke = this.graphConfig['node']['highlight']
                tb.fill = this.graphConfig['node']['center']
                this.diagram.commandHandler.scrollToPart(centerNode)

                if (centerNode.data.group) {
                    let groupNode = this.diagram.findNodeForKey(centerNode.data.group)
                    console.log(groupNode, '------------groupNode-----------')
                    let tg = groupNode.findObject('GROUP')
                    tg.stroke = this.graphConfig['group']['center']
                    tg.fill = this.graphConfig['group']['center']
                    let tgt = groupNode.findObject('GROUPTITLE')
                    tgt.background = this.graphConfig['group']['center']
                    // if () {

                    // }
                }
            }
        }
    }

    bindNodeData = (data) => {
        if (this.diagram) {
            this.diagram.div = null
        }

        if (this.myOverview) {
            this.myOverview.div = null
        }

        this.diagram = this.initDiagram()
        console.log(data)
        // this.diagram.model = new go.GraphLinksModel(data.nodes || [], data.edges || [])
        this.diagram.model = $(go.GraphLinksModel, {
            // nodeKeyProperty: "id",
            nodeDataArray: data.nodes || [],
            linkDataArray: data.edges || [],
        })
        let scale = this.getScacle(data.nodes)
        this.diagram.scale = scale
        // console.log(this.diagram.findNodeForKey(this.props.selectedId), '----this.diagram.findNodeForKey(this.props.selectedId)')
        this.centerStyleInit()
        // Overview
        let overview = document.getElementById('overviewDivableLink' + this.containerId)
        if (scale < 0.8) {
            overview.style.display = 'inline'
            // if (this.myOverview == null) {
            this.myOverview = $(go.Overview, 'overviewDivableLink' + this.containerId, { observed: this.diagram, contentAlignment: go.Spot.Center })
            // }
        } else {
            overview.style.display = 'none'
        }
        this.setState({
            data,
        })

        // this.diagram.div = null
    }

    resize = () => {
        this.diagram.requestUpdate()
    }

    handleModelChange = () => {}

    decreaseZoom = () => {
        this.diagram.commandHandler.decreaseZoom()
    }

    increaseZoom = () => {
        this.diagram.commandHandler.increaseZoom()
    }

    resetZoom = () => {
        // this.diagram.commandHandler.resetZoom()
        // this.diagram.commandHandler.zoomToFit()

        this.bindNodeData(this.state.data)
    }

    onMenuClick = (item) => {
        let params = ''
        console.log(item, '--------------downDependyRelationFile--------------')
        if (item.key === '1') {
            params = 'tableId=' + this.props.selectedId
        } else {
        }
        this.props.downDependyRelationFile && this.props.downDependyRelationFile(params)
    }

    render() {
        const { styleLeft, styleTop, nodeInfo, styleDisplay, linkInfo, toolPosition } = this.state
        let chartDiagramGrapId = 'diagramDivTableLink' + this.containerId
        let diagramDomOvewId = 'overviewDivableLink' + this.containerId
        let chartDiagramId = 'chartDiagram' + this.containerId
        return (
            <div className='graph-relation'>
                <div id={chartDiagramId} style={{ position: 'relative', height: '100%' }}>
                    <div id={chartDiagramGrapId} className='diagram-component'></div>
                    <div id={diagramDomOvewId} className='overview-component'></div>
                </div>
                <div style={{ float: toolPosition, zIndex: '999', bottom: '0px', position: 'absolute' }}>
                    <div className='padding-row'>
                        <Tooltip placement='topLeft' title='恢复到初始视图'>
                            <Button type='dashed' size='small' onClick={this.resetZoom}>
                                <img src={resetPng} />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className='padding-row'>
                        <Button type='dashed' size='small' onClick={this.increaseZoom}>
                            <img src={plus} />
                        </Button>
                    </div>
                    <div className='padding-row'>
                        <Button type='dashed' size='small' onClick={this.decreaseZoom}>
                            <img src={minus} />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
