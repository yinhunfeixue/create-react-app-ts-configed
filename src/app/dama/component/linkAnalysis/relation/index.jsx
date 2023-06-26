import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import './index.less'
import resetPng from './images/reset.png'
import plus from './images/plus.png'
import minus from './images/minus.png'

const $ = go.GraphObject.make

export default class Relation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            styleLeft: '0px',
            styleTop: '0px',
            nodeInfo: {},
            styleDisplay: 'none',
            linkInfo: [],
            data: {},
            etlProcessList: [],
            toolPosition: 'left'
        }

        this.diagram = null
        this.myOverview = null
        this.selectedNode = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highlightColor = '#d1d8de'
        this.linkHighlightColor = '#33333d'
        this.operateCenterColor = '#ead09f'

        this.selectedField = {}
        this.selectedLink = {}
        this.highLightLinks = {}

        this.highLightNodesByClick = {}
        this.highLightNodesByEnter = {}
        this.highLightLinksByClick = {}
        this.highLightLinksByEnter = {}
        this.containerId = 'linkAnalysisFieldGraph'

        this.graphConfig = {
            'group': {
                'fill': '#608FBF', // 分组填充颜色
                'stroke': '#608FBF', // 分组边框颜色,
                'headerBackground': '#608FBF', // 分组头部背景色,
                'bodyBackground': '#ffffff', // 分组内容主体背景色,
                'center': '#F2B06D', // 中心节点的颜色
            },
            'node': {
                'fill': '#636399', // 节点边框颜色
                'stroke': '#636399', // 节点边框颜色
                'highlight': '#8CCFFF',
                'selected': '#FEE900', // 节点选中时的颜色
                'center': '#F2B06D', // 中心节点的颜色
                'headerBackground': '#608FBF', // 分组头部背景色,
                // 'headerBackground': '#636399', // 分组头部背景色,
                'bodyBackground': '#ffffff', // 分组内容主体背景色,
            },
            'field': {
                'fill': '#fff', // 节点边框颜色
                'stroke': '#fff', // 节点边框颜色
                'highlight': '#8CCFFF',
                'selected': '#FEE900', // 节点选中时的颜色
                // 'center': '##F2B06D', // 中心节点的颜色
                // 'headerBackground': '#608FBF', // 分组头部背景色,
                // 'bodyBackground': '#ffffff', // 分组内容主体背景色,
            },
            'link': {
                'stroke': '#979797',
                'highlight': '#0095FF'
            }
        }
    }

    highlightLink = (link, show) => {
        // console.log(link.elt(0), link.fromPort, '------link-----')
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.linkHighlightColor : '#a6b7c4'
        link.elt(0).strokeWidth = show ? '2' : '1'
        // link.fromPort.background = show ? this.highlightColor : 'transparent'
        // link.toPort.background = show ? this.highlightColor : 'transparent'
    }

    highlightNode = (field, show) => {
        // console.log(field.data, '------fieldfield-------')
        let portId = field.portId
        field.part.linksConnected.each((link) => {
            // console.log(link.data, '------linkfield-------')
            let linkData = link.data
            if (portId == linkData.fromPort || portId == linkData.toPort) {
                this.highlightLink(link, show)
                // link.isHighlighted = show
                // link.elt(0).stroke = show ? this.highlightColor : '#a6b7c4'
                // link.elt(0).strokeWidth = show ? '2' : '1'
            }
        })
    }

    highlightAllPathByClick = (node, pos = 'init') => {
        console.log(node.data)
        // console.log(this.highLightNodes)
        let nodeId = node.data.key
        // let portId = node.portId
        if (pos == 'init') {
            node.background = this.graphConfig['field']['selected']
        } else {
            node.background = this.graphConfig['field']['highlight']
        }

        if (this.highLightNodesByClick[nodeId]) {
            return
        } else {
            this.highLightNodesByClick[nodeId] = node
        }

        node.part.linksConnected.each((link) => {
            let linkData = link.data
            let fromNode = link.fromPort
            let toNode = link.toPort

            if (nodeId == linkData.fromPort || nodeId == linkData.toPort) {
                // fromNode.background = this.highlightColor
                // toNode.background = this.highlightColor

                if (pos == 'init') {
                    this.highLightLinksByClick[link.data.key] = link
                    this.highlightLink(link, true)
                    if (fromNode.data.key === nodeId) {
                        this.highlightAllPathByClick(toNode, 'to')
                    } else {
                        this.highlightAllPathByClick(fromNode, 'from')
                    }
                }

                if (pos == 'from') {
                    if (toNode.data.key === nodeId) {
                        this.highLightLinksByClick[link.data.key] = link
                        this.highlightLink(link, true)
                        this.highlightAllPathByClick(fromNode, 'from')
                    }
                }

                if (pos == 'to') {
                    if (fromNode.data.key === nodeId) {
                        this.highLightLinksByClick[link.data.key] = link
                        this.highlightLink(link, true)
                        this.highlightAllPathByClick(toNode, 'to')
                    }
                }
            }
        })
    }

    highlightAllPathByEnter = (node, pos = 'init') => {
        // console.log(node.data)
        // console.log(this.highLightNodes)
        let nodeId = node.data.key
        if (pos == 'init') {
            node.background = this.operateCenterColor
        } else {
            node.background = this.highlightColor
        }

        let portId = node.portId

        if (this.highLightNodesByEnter[nodeId]) {
            return
        } else {
            this.highLightNodesByEnter[nodeId] = node
        }

        node.part.linksConnected.each((link) => {
            let linkData = link.data
            let fromNode = link.fromPort
            let toNode = link.toPort

            if (portId == linkData.fromPort || portId == linkData.toPort) {
                // fromNode.background = this.highlightColor
                // toNode.background = this.highlightColor

                if (pos == 'init') {
                    this.highLightLinksByEnter[link.data.key] = link
                    this.highlightLink(link, true)
                    if (fromNode.data.key === nodeId) {
                        this.highlightAllPathByEnter(toNode, 'to')
                    } else {
                        this.highlightAllPathByEnter(fromNode, 'from')
                    }
                }

                if (pos == 'from') {
                    if (toNode.data.key === nodeId) {
                        this.highLightLinksByEnter[link.data.key] = link
                        this.highlightLink(link, true)
                        this.highlightAllPathByEnter(fromNode, 'from')
                    }
                }

                if (pos == 'to') {
                    if (fromNode.data.key === nodeId) {
                        this.highLightLinksByEnter[link.data.key] = link
                        this.highlightLink(link, true)
                        this.highlightAllPathByEnter(toNode, 'to')
                    }
                }
            }
        })
    }

    clearClickNodes = () => {
        _.map(this.highLightNodesByClick, (n, k) => {
            n.background = 'transparent'
        })

        _.map(this.highLightLinksByClick, (n, k) => {
            this.highlightLink(n, false)
        })

        this.highLightNodesByClick = {}
        this.highLightLinksByClick = {}
        this.selectedField = {}
    }

    clearEnterNodes = () => {
        console.log(this.highLightNodesByEnter, '------this.highLightNodesByEnter-------')
        _.map(this.highLightNodesByEnter, (n, k) => {
            if (!this.highLightNodesByClick[k]) {
                n.background = 'transparent'
                // delete this.highLightNodesByEnter[k]
            }
        })

        _.map(this.highLightLinksByEnter, (n, k) => {
            if (!this.highLightLinksByClick[k]) {
                this.highlightLink(n, false)
                // delete this.highLightLinksByEnter[k]
            }
        })

        this.highLightNodesByEnter = {}
        this.highLightLinksByEnter = {}
    }

    componentWillMount() {
        //this.setState({totalloading:true})
        this.generateContainerId()
    }

    componentDidMount() {
        // if (!this.diagram) {
        //     this.diagram = this.initDiagram()
        // } else {
        //     this.diagram.div = null
        // }
    }

    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDivRelation' + this.containerId)
        let parentDiv = document.getElementById('chartDiagram' + this.containerId)
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDivRelation' + this.containerId)
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDivRelation' + this.containerId)
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDivRelation' + this.containerId)
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    showToolTip = (obj, diagram, tool) => {
        let pt = diagram.lastInput.viewPoint
        let styleLeft = pt.x + 'px'
        let styleTop = (pt.y + 20) + 'px'
        let nodeInfo = obj.data.info || {}
        let linkInfo = obj.data.labels || []
        let styleDisplay = 'block'
        this.setState({
            styleLeft,
            styleTop,
            nodeInfo,
            styleDisplay,
            linkInfo
        })
    }

    hideToolTip = (diagram, tool) => {
        this.setState({
            styleDisplay: 'none'
        })
    }

    initDiagram = () => {
        // this.initElement()
        let highlightColor = this.highlightColor

        // let $ = go.GraphObject.make // for conciseness in defining templates
        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip
            // do nothing on hide: This tooltip doesn't hide unless the mouse leaves the diagram
        })
        let myDiagram = $(go.Diagram, 'diagramDivRelation' + this.containerId,
            {
                initialContentAlignment: go.Spot.Center,
                scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
                'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
                'dragSelectingTool.isEnabled': false,
                'animationManager.isEnabled': false,
                'toolManager.hoverDelay': 500,
                allowResize: true,
            })

        // myDiagram.layout = $(go.LayeredDigraphLayout, { layerSpacing: 100, isRealtime: false })
        myDiagram.layout = $(go.LayeredDigraphLayout, { isRealtime: false, layerSpacing: 200, columnSpacing: 50 })

        let fieldTemplate = $(go.Panel, 'TableRow',
            new go.Binding('portId', 'key'),
            {
                background: 'transparent', // so this port's background can be picked by the mouse
                fromSpot: go.Spot.RightSide, // links only go from the right side to the left side
                toSpot: go.Spot.LeftSide,
                // width: 150,
                // minSize: new go.Size(100, 30),
                fromLinkable: true, toLinkable: true,
                click: (e, field) => {
                    if (this.props.from == 'dataAsset') {
                        return
                    }
                    if (this.props.from == 'indexma' && field.data.type !== 'column') {
                        return
                    }
                    console.log(e,'e++++')
                    console.log(field.data,'field++++')
                    this.props.getIndexmaNodeData && this.props.getIndexmaNodeData(field.data)
                    if (this.selectedField.data) {
                        if (this.selectedField.data.key !== field.data.key) {
                            this.clearClickNodes()
                            // field.background = highlightColor
                            this.highlightAllPathByClick(field)
                            this.selectedField = field
                        }
                    } else {
                        this.clearClickNodes()
                        // field.background = highlightColor
                        this.highlightAllPathByClick(field)
                        this.selectedField = field
                    }
                    field.background = this.graphConfig['field']['selected']
                    this.props.markText && this.props.markText({
                        centerNode: field.data,
                        markNodes: this.highLightNodesByClick,
                        operate: 'saveCenter'
                    })

                    // 下钻及节点详情展示
                    this.props.drillNode && this.props.drillNode({
                        ...field.data,
                        domain: 'report_field',
                        label: field.data.name
                    })
                }
            },
            new go.Binding('background', 'key', (id) => {
                if (this.props.selectedIds && this.props.selectedIds.includes(id)) {
                    return this.graphConfig['field']['selected']
                }
                return 'transparent'
            }),
            $(go.Picture,
                {
                    column: 0,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(1, 5, 1, 5),
                    width: 12,
                    height: 12
                },
                new go.Binding('source', 'checkRules', (keyType) => {
                    if (keyType) {
                        return '/resources/images/检.png'
                    }
                }),
            ),
            $(go.Picture,
                {
                    column: 0,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(1, 5, 1, 5),
                    width: 12,
                    height: 12
                },
                new go.Binding('source', 'columnNameType', (keyType) => {
                    if (keyType == 1) {
                        return '/resources/image/dataAsset/标准.png'
                    } else if (keyType == 2) {
                        return '/resources/image/dataAsset/指标.png'
                    }
                }),
            ),
            $(go.TextBlock,
                {
                    column: 1,
                    margin: new go.Margin(1, 10, 1, 1),
                    stretch: go.GraphObject.Horizontal,
                    font: '14px PingFangSC-Regular,PingFang SC',
                    wrap: go.TextBlock.None,
                    overflow: go.TextBlock.OverflowEllipsis,
                    // and disallow drawing links from or to this text:
                    // fromLinkable: false, toLinkable: false
                },
                new go.Binding('text', 'name')),
        )

        // This template represents a whole "record".
        myDiagram.nodeTemplate = $(go.Node, 'Auto',
            {
                // fromSpot: go.Spot.RightSide,
                // toSpot: go.Spot.LeftSide,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                minSize: new go.Size(150, 30),
            },
            // new go.Binding('stroke', 'type', (keyType) => {
            //     return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
            // }),
            new go.Binding('location', 'loc', go.Point.parse),
            $(go.Shape,
                { fill: '#fff', strokeWidth: 1 },
                new go.Binding('stroke', 'key', (id) => {
                    if (this.props.centerId && (id == this.props.centerId)) {
                        return this.graphConfig['node']['center']
                    }
                    return this.graphConfig['node']['headerBackground']
                }),
                // new go.Binding('stroke', 'type', (keyType) => {
                //     return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                // })
            ),
            // new go.Binding('location', 'location').makeTwoWay(),
            $(go.Panel, 'Vertical',
                {
                    stretch: go.GraphObject.Horizontal,
                    alignment: go.Spot.TopLeft
                },
                // $(go.Shape,
                //     { fill: '#fff' },
                //     new go.Binding('stroke', 'type', (keyType) => {
                //         return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                //     })
                // ),
                $(go.Panel, 'Table',
                    {
                        name: 'NODETITLE',
                        stretch: go.GraphObject.Horizontal,
                        // background: this.graphConfig['node']['headerBackground'],
                        minSize: new go.Size(150, 30)
                    },
                    new go.Binding('background', 'name', (keyType) => {
                        if (keyType !== '中间过程') {
                            return this.graphConfig['node']['headerBackground']
                        } else {
                            return '#D3D3D3'
                        }
                    }),
                    // new go.Binding('background', 'type', (keyType) => {
                    //     // return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                    //     return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                    // }),
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 0,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC',
                            // wrap: go.TextBlock.WrapFit,
                            // width: 100,
                        },
                        new go.Binding('text', 'contextPath')),
                    // $('SubGraphExpanderButton', 'LIST')
                    // $('PanelExpanderButton', 'LIST', { column: 1 })
                ),
                $(go.Panel, 'Table',
                    {
                        name: 'LIST',
                        stretch: go.GraphObject.Horizontal,
                        minSize: new go.Size(150, 30),
                        // defaultAlignment: go.Spot.Left,
                        // defaultStretch: go.GraphObject.Horizontal,
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultRowSeparatorStroke: 'gray',
                        itemTemplate: fieldTemplate
                    },
                    new go.Binding('itemArray', 'children')
                ) // end Table Panel of items
            ) // end Vertical Panel
        ) // end Node
        myDiagram.linkTemplate = $(go.Link,
            // { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
                selectionAdorned: true,
                layerName: 'Foreground',
                reshapable: true,
                // routing: go.Link.AvoidsNodes,
                // routing: go.Link.Orthogonal,
                // corner: 10,
                // curve: go.Link.JumpOver,
                corner: 30,
                // curve: go.Link.JumpOver,
                curve: go.Link.Bezier,
                toEndSegmentLength: 50,
                fromEndSegmentLength: 50,
                // mouseEnter: (e, link) => { this.highlightLink(link, true) },
                // mouseLeave: (e, link) => { this.highlightLink(link, false) }
            },
            $(go.Shape,
                { strokeWidth: 1.5, stroke: '#979797', fill: '#979797' },
                new go.Binding('stroke', 'isHighlighted', (h) => { return h ? highlightColor : '#979797' }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject(),
            ),
            $(go.Shape,
                { toArrow: 'Standard', stroke: '#979797' },
                new go.Binding('fill', '#979797'))

        )

        return myDiagram
    }

    getScacle = (data) => {
        let scale = 0.8
        if (data) {
            if (data.length > 30) {
                scale = 0.5
            } else if (data.length > 60) {
                scale = 0.3
            } else if (data.length > 100) {
                scale = 0.3
            }
        }
        console.log(scale, '----scale---')
        return scale
    }

    centerStyleInit = () => {
        console.log(this.props.centerId, '---------this.props.centerId-----------')
        if (this.props.centerId) {
            let centerNode = this.diagram.findNodeForKey(this.props.centerId)
            if (centerNode) {
                console.log(centerNode, '--------centerStyleInit--22222222222222222222-----')

                centerNode.isHighlighted = true
                // let tb = centerNode.findObject('SHAPE')
                // tb.stroke = this.graphConfig['node']['highlight']
                centerNode.stroke = this.graphConfig['node']['center']
                let tgt = centerNode.findObject('NODETITLE')
                tgt.background = this.graphConfig['node']['center']

                this.diagram.commandHandler.scrollToPart(centerNode)

                // if (centerNode.data.group) {
                //     let groupNode = this.diagram.findNodeForKey(centerNode.data.group)
                //     console.log(groupNode, '------------groupNode-----------')
                //     let tg = groupNode.findObject('GROUP')
                //     tg.stroke = this.graphConfig['group']['center']
                //     tg.fill = this.graphConfig['group']['center']
                //     let tgt = groupNode.findObject('GROUPTITLE')
                //     tgt.background = this.graphConfig['group']['center']
                // }
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


        // this.diagram.div = null
        if (data.nodes && data.edges) {
            this.diagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    linkFromPortIdProperty: 'fromPort',
                    linkToPortIdProperty: 'toPort',
                    nodeDataArray: data.nodes || [],
                    linkDataArray: data.edges || []
                })

            let scale = this.getScacle(data.nodes)
            this.diagram.scale = 0.7
            let overview = document.getElementById('overviewDivRelation' + this.containerId)

            this.centerStyleInit()
            if (scale < 0.8) {
                overview.style.display = 'inline'
                // if (this.myOverview == null) {
                // this.myOverview = $(go.Overview, 'overviewDivRelation', { observed: this.diagram })
                this.myOverview = $(go.Overview,
                    'overviewDivRelation' + this.containerId,
                    { observed: this.diagram, contentAlignment: go.Spot.Center }
                )
                // }
            } else {
                overview.style.display = 'none'
            }

            // this.initAllNodeVisible()
        }
        this.setState({
            data
        })
    }

    initAllNodeVisible = () => {
        // let slices = []
        for (let nit = this.diagram.nodes; nit.next();) {
            let node = nit.value
            // if (this.highLightNodes[node.key]) {
            //     node.opacity = 1
            // } else {
            //     node.opacity = 0.3
            // }
            let nodeData = node.data
            let list = node.findObject('LIST')
            list.visible = !!(this.props.typeConfig[nodeData.type] && this.props.typeConfig[nodeData.type]['visible'] == true)
        }

        this.diagram.layoutDiagram(true)
    }

    //生成容器id，避免多次引用重复
    generateContainerId = () => {
        let idNumber = parseInt(100 * Math.random() * 10 * Math.random())
        this.containerId = this.containerId + idNumber
    }

    handleModelChange = () => {

    }

    decreaseZoom = () => {
        this.diagram.commandHandler.decreaseZoom()
    }

    increaseZoom = () => {
        this.diagram.commandHandler.increaseZoom()
    }

    resize = () => {
        this.diagram.requestUpdate()
    }

    resetZoom = () => {
        this.bindNodeData(this.state.data)
    }

    // onMenuClick = (item) => {
    //     let params = ''
    //     console.log(item, '--------------downDependyRelationFile--------------')
    //     if (item.key === '1') {
    //         params = 'tableId=' + this.props.selectedId
    //     } else {

    //     }
    //     this.props.downDependyRelationFile && this.props.downDependyRelationFile(params)
    // }

    render() {
        const {
            styleLeft,
            styleTop,
            nodeInfo,
            styleDisplay,
            linkInfo,
            etlProcessList,
            toolPosition
        } = this.state

        let chartDiagramGrapId = 'diagramDivRelation' + this.containerId
        let diagramDomOvewId = 'overviewDivRelation' + this.containerId
        let chartDiagramId = 'chartDiagram' + this.containerId

        return (
            <div className='lzChartRelation' >
                <div id={chartDiagramId} style={{ 'position': 'relative', height: '100%' }}>
                    <div id={chartDiagramGrapId} className='diagramComponent'></div>
                    <div id={diagramDomOvewId} className='overviewComponent' style={{ display: 'none' }}></div>
                </div>
                <div style={{ float: toolPosition, zIndex: '999', bottom: '0px', position: 'absolute' }}>
                    <div className='padding-row' >
                        <Tooltip placement='topLeft' title='恢复到初始视图'>
                            <Button type='dashed' size='small' onClick={this.resetZoom} >
                                <img src={resetPng} />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className='padding-row' >
                        <Button type='dashed' size='small' onClick={this.increaseZoom} >
                            <img src={plus} />
                        </Button>
                    </div>
                    <div className='padding-row'>
                        <Button type='dashed' size='small' onClick={this.decreaseZoom} >
                            <img src={minus} />
                        </Button>
                    </div>
                </div>
                <div className='node-tooltip' style={{
                    position: 'absolute',
                    zIndex: 1000,
                    display: styleDisplay,
                    left: styleLeft,
                    top: styleTop,
                    // width: '30%'
                }}
                >
                    {
                        !_.isEmpty(nodeInfo) ? <div>
                            <Row >
                                {/* <Col span='8'>
                                        表英文名:
                                </Col>
                                <Col span='16'>
                                    {nodeInfo.tableEName}
                                </Col> */}
                                <Col span='24'>
                                    <span className='field-name'>表英文名:</span>
                                    <span>{nodeInfo.tableEName}</span>
                                </Col>
                            </Row>
                            <Row >
                                {/* <Col span='8'>
                                        表中文名:
                                </Col>
                                <Col span='18'>
                                    {nodeInfo.tableCName}
                                </Col> */}
                                <Col span='24'>
                                    <span className='field-name'>表中文名:</span>
                                    <span>{nodeInfo.tableCName}</span>
                                </Col>
                            </Row>
                            <Row >
                                {/* <Col span='8'>
                                        数据库:
                                </Col>
                                <Col span='16'>
                                    {nodeInfo.database}
                                </Col> */}
                                <Col span='24'>
                                    <span className='field-name'>数据库:</span>
                                    <span>{nodeInfo.database}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span='24'>
                                    <span className='field-name'>数据源:</span>
                                    <span>{nodeInfo.datasource}</span>
                                </Col>
                                {/* <Col span='8'>
                                        数据源:
                                </Col>
                                <Col span='16'>
                                    {nodeInfo.datasource}
                                </Col> */}
                            </Row>
                        </div> : null
                    }
                    {
                        !_.isEmpty(linkInfo) ? <div>
                            {
                                _.map(linkInfo, (link, k) => {
                                    return (
                                        <Row>
                                            <Col span='24'>
                                                {link}
                                            </Col>
                                        </Row>
                                    )
                                })
                            }

                        </div> : null
                    }

                </div>
            </div>

        )
    }
}
