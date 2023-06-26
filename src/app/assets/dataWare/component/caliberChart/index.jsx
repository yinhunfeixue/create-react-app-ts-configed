import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import './index.less'
import resetPng from './images/reset.png'
import plus from './images/plus.png'
import minus from './images/minus.png'
import down from './images/down.png'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'

const $ = go.GraphObject.make

export default class CaliberRelationChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            styleLeft: '0px',
            styleTop: '0px',
            nodeInfo: {},
            styleDisplay: 'none',
            linkInfo: [],
            data: {}
        }

        this.diagram = null
        this.myOverview = null
        this.selectedNode = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highlightColor = '#FFC811'
    }

    highlightLink = (link, show) => {
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.highlightColor : '#a6b7c4'
        link.elt(0).strokeWidth = show ? '2' : '1'
        link.fromNode.isHighlighted = show
        link.toNode.isHighlighted = show
    }

    highlightAllPath = (node, pos = 'init') => {
        console.log(node.data)
        console.log(this.highLightNodes)
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
                if (fromNode.data.key === nodeId) {
                    // this.highLightNodes[toNode.data.key] = 1
                    this.highlightAllPath(toNode, 'to')
                } else {
                    // this.highLightNodes[fromNode.data.key] = 1
                    this.highlightAllPath(fromNode, 'from')
                }
            }

            if (pos == 'from') {
                if (toNode.data.key === nodeId) {
                    // this.highLightNodes[fromNode.data.key] = 1
                    this.highlightLink(link, true)
                    this.highlightAllPath(fromNode, 'from')
                }
            }

            if (pos == 'to') {
                if (fromNode.data.key === nodeId) {
                    // this.highLightNodes[toNode.data.key] = 1
                    this.highlightLink(link, true)
                    this.highlightAllPath(toNode, 'to')
                }
            }
        })
    }

    componentDidMount() {
        // this.bindNodeData(this.props.data)
    }

    showToolTip = (obj, diagram, tool) => {
        // var toolTipDIV = document.getElementById('toolTipDIV')
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
        let mygoChart = document.getElementById('diagramDiv')
        let parentDiv = document.getElementById('chartDiagram')
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDiv')
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDiv')
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDiv')
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    initDiagramTree = () => {

        // var $ = go.GraphObject.make;  // for conciseness in defining templates
        let $ = go.GraphObject.make
        let myDiagram =
            $(go.Diagram, "diagramDiv",  // Diagram refers to its DIV HTML element by id
                {
                    layout: $(go.TreeLayout,  // the layout for the entire diagram
                        {
                            angle: 90,
                            arrangement: go.TreeLayout.ArrangementHorizontal,
                            isRealtime: false
                        })
                });
        // define the node template for non-groups
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle",
                    { stroke: null, strokeWidth: 0 },
                    // new go.Binding("fill", "key")
                ),
                $(go.TextBlock,
                    { margin: 7, font: "Bold 14px Sans-Serif" },
                    //the text, color, and key are all bound to the same property in the node data
                    new go.Binding("text", "name"))
            );
        myDiagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.Orthogonal, corner: 10 },
                $(go.Shape, { strokeWidth: 2 }),
                $(go.Shape, { toArrow: "OpenTriangle" })
            );
        // define the group template
        myDiagram.groupTemplate =
            $(go.Group, "Auto",
                { // define the group's internal layout
                    layout: $(go.TreeLayout,
                        { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
                    // the group begins unexpanded;
                    // upon expansion, a Diagram Listener will generate contents for the group
                    isSubGraphExpanded: false,
                    // when a group is expanded, if it contains no parts, generate a subGraph inside of it
                    subGraphExpandedChanged: function (group) {
                        // if (group.memberParts.count === 0) {
                        //     randomGroup(group.data.key);
                        // }
                    }
                },
                $(go.Shape, "Rectangle",
                    { fill: null, stroke: "gray", strokeWidth: 2 }),
                $(go.Panel, "Vertical",
                    { defaultAlignment: go.Spot.Left },
                    $(go.Panel, "Horizontal",
                        { defaultAlignment: go.Spot.Top, background: '#8CBF73' },
                        // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                        $("SubGraphExpanderButton"),
                        $(go.TextBlock,
                            { font: "Bold 18px Sans-Serif", margin: 4 },
                            new go.Binding("text", "name"))
                    ),
                    // create a placeholder to represent the area where the contents of the group are
                    $(go.Placeholder,
                        { padding: new go.Margin(0, 10) })
                )  // end Vertical Panel
            );  // end Group

        return myDiagram
    }

    initDiagram = () => {
        // this.initElement()
        let highlightColor = this.highlightColor

        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip
        })

        let scale = this.getScacle(this.state.data.nodes)

        const diagram = $(go.Diagram, 'diagramDiv', {

            // // initialAutoScale: go.Diagram.Uniform, // 自适应
            // scale: scale,
            // initialDocumentSpot: go.Spot.TopCenter,
            // initialViewportSpot: go.Spot.TopCenter,
            initialContentAlignment: go.Spot.Center, // 加载位置
            scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
            'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
            'dragSelectingTool.isEnabled': false,
            'animationManager.isEnabled': false,
            'toolManager.hoverDelay': 500,

        })

        let fieldTemplate = $(go.Panel, 'TableRow',
            // $(go.RowColumnDefinition, { column: 0, width: 20 }),
            // $(go.RowColumnDefinition, { column: 1, minimum: 50 }),
            // $(go.RowColumnDefinition, { column: 2, width: 10 }),
            new go.Binding('portId', 'id'),
            {
                background: 'transparent', // so this port's background can be picked by the mouse
                fromSpot: go.Spot.Right, // links only go from the right side to the left side
                toSpot: go.Spot.Left,

                fromLinkable: true, toLinkable: true,
            },
            $(go.Picture,
                {
                    column: 0,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(10, 20, 10, 20),
                },
                new go.Binding('source', 'columnType', (keyType) => {
                    if (keyType == 1) {
                        return '/resources/images/度量.svg'
                    } else if (keyType == 2) {
                        return '/resources/images/维度.svg'
                    } else if (keyType == 3) {
                        return '/resources/images/日期.svg'
                    }
                }),
            ),
            $(go.TextBlock,
                {
                    column: 1,
                    // margin: new go.Margin(5, 10, 5, 0),
                    margin: 2,
                    stretch: go.GraphObject.Horizontal,
                    font: '14px PingFangSC-Regular,PingFang SC',
                    wrap: go.TextBlock.None,
                    overflow: go.TextBlock.OverflowEllipsis,
                },
                new go.Binding('text', 'name')),
            $("Button",
                {
                    margin: new go.Margin(10, 20, 10, 0),
                    column: 2,
                    'ButtonBorder.stroke': null,
                    'ButtonBorder.fill': null,
                    '_buttonFillOver': null,
                    '_buttonStrokeNormal': '#fff',
                    '_buttonStrokeOver': null,
                    click: (e, obj) => {
                        this.props.fieldClick && this.props.fieldClick(e, obj.panel.data)
                        console.log(obj.panel.data, '----------TextBlock----------')
                    }
                },
                $(go.TextBlock,
                    {
                        stroke: '#51b8ff',
                        font: '14px PingFangSC-Regular,PingFang SC',
                    },
                    new go.Binding('text', 'columnType', (keyType) => {
                        if (keyType == 1) {
                            return '···'
                        }
                        return null
                    })
                )
            ),
        )

        diagram.groupTemplate =
            $(go.Group, 'Auto',
                {
                    layout: $(go.TreeLayout,
                        { angle: 0, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false, nodeSpacing: 30 }),
                    isSubGraphExpanded: true,
                    // subGraphExpandedChanged: function (group) {
                    //     if (group.memberParts.count === 0) {
                    //         randomGroup(group.data.key);
                    //     }
                    // }
                },
                $(go.Shape,
                    'RoundedRectangle', // surrounds everything
                    // { strokeWidth: 1 },
                    // { stroke: null },
                    new go.Binding('fill', 'nodeType', (keyType) => {
                        return this.props.nodeTypes[keyType] && this.props.nodeTypes[keyType]['color'] ? this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                    })
                ),
                $(go.Panel, 'Vertical', // position header above the subgraph
                    { defaultAlignment: go.Spot.Center, defaultStretch: go.GraphObject.Horizontal },
                    $(go.Panel, 'Table',
                        { stretch: go.GraphObject.Horizontal },
                        new go.Binding('background', 'nodeType', (keyType) => {
                            // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                            return this.props.nodeTypes[keyType] && this.props.nodeTypes[keyType]['color'] ? this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                        }),
                        // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                        $(go.TextBlock, // group title near top, next to button
                            {
                                alignment: go.Spot.Left,
                                font: '14px PingFangSC-Regular,PingFang SC',
                                margin: 3,
                                // margin: new go.Margin(5, 10, 5, 10),
                                column: 0,
                                stroke: 'white'
                            },
                            new go.Binding('text', 'name')),
                        $('SubGraphExpanderButton', { column: 1, alignment: go.Spot.Right, margin: 3 }),
                    ),

                    $(go.Placeholder, // represents area for all member parts
                        { padding: new go.Margin(10, 100), background: 'white' })
                )
            )
        // declare the Diagram.layout:
        // diagram.layout = $(go.LayeredDigraphLayout, { direction: 90, layerSpacing: 10, isRealtime: false, setsPortSpots: false })
        diagram.layout = $(go.TreeLayout,  // the layout for the entire diagram
            {
                angle: 90,
                arrangement: go.TreeLayout.ArrangementHorizontal,
                isRealtime: false
            })

        diagram.nodeTemplate = $(go.Node, 'Auto',
            {
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                // isShadowed: true,
                // width: 150,
                minSize: new go.Size(100, 30),
            },
            $(go.Shape,
                // 'RoundedRectangle', 
                {},
                new go.Binding('fill', 'nodeType', (keyType) => {
                    // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                    return this.props.nodeTypes[keyType] && this.props.nodeTypes[keyType]['color'] ? this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                }),
                new go.Binding('stroke', 'nodeType', (keyType) => {
                    // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                    return this.props.nodeTypes[keyType] && this.props.nodeTypes[keyType]['color'] ? this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                })
            ),
            // new go.Binding('location', 'location').makeTwoWay(),
            // new go.Binding('desiredSize', 'visible', function (v) { return new go.Size(NaN, NaN) }).ofObject('LIST'),

            $(go.Panel, 'Vertical',
                // { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopCenter },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(go.Panel, 'Table',
                    { stretch: go.GraphObject.Horizontal },
                    new go.Binding('background', 'nodeType', (keyType) => {
                        // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                        return this.props.nodeTypes[keyType] && this.props.nodeTypes[keyType]['color'] ? this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                    }),
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 0,
                            alignment: go.Spot.Left,
                            // margin: 10,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC'
                        },
                        new go.Binding('text', 'name')),
                    $('PanelExpanderButton', 'LIST', { column: 1, visible: false },
                        new go.Binding('visible', 'fields', (fields) => {
                            console.log(fields, '-----PanelExpanderButton-----')
                            // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                            return fields && fields.length > 0
                        }),
                    )
                ),
                $(go.Panel, 'Table',
                    {
                        name: 'LIST',
                        stretch: go.GraphObject.Horizontal,
                        // minSize: new go.Size(100, 10),
                        // defaultAlignment: go.Spot.Left,
                        // defaultStretch: go.GraphObject.Horizontal,
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultRowSeparatorStroke: 'gray',
                        background: 'white',
                        visible: false,
                        itemTemplate: fieldTemplate,

                    },
                    new go.Binding('visible', 'fields', (fields) => {
                        console.log(fields, '-----PanelExpanderButton-----')
                        // return  this.props.nodeTypes[keyType]['color'] ?  this.props.nodeTypes[keyType]['color'] : '#8CBF73'
                        return fields && fields.length > 0
                    }),
                    new go.Binding('itemArray', 'fields')
                ) // end Table Panel of items
            ) // end Vertical Panel
        ) // end Node


        diagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.AvoidsNodes, corner: 10 },
                $(go.Shape, { strokeWidth: 1, stroke: '#b3b3b3', fill: '#b3b3b3' }),
                $(go.Picture,
                    {
                        name: 'Picture',
                        segmentIndex: 2,
                        segmentFraction: 0.5
                    },
                    new go.Binding('source', 'join', (join) => {
                        if (join === 2) {
                            return '/resources/images/relation/right.png'
                        } else if (join === 0) {
                            return '/resources/images/relation/inner.png'
                        } else if (join === 3) {
                            return '/resources/images/relation/outer.png'
                        } else {
                            return '/resources/images/relation/left.png'
                        }
                    })),
                $(go.Shape, { toArrow: "OpenTriangle" })
            );

        // diagram.linkTemplate =
        //     $(go.Link,
        //         {
        //             routing: go.Link.AvoidsNodes, // 连接线避开节点
        //             // routing: go.Link.Orthogonal,
        //             curve: go.Link.JumpOver, // lian

        //             toolTip: myToolTip,
        //             corner: 20,
        //             selectable: false,
        //             click: (e, link) => {
        //                 console.log(link, link.stroke, '--------link.stroke-------')
        //                 if (!_.isEmpty(this.selectedLink) && this.selectedLink.__gohashid === link.__gohashid) {
        //                     this.highlightLink(link, false)
        //                     this.selectedLink = {}
        //                 } else {
        //                     if (!_.isEmpty(this.selectedLink)) {
        //                         this.highlightLink(this.selectedLink, false)
        //                     }
        //                     link.diagram.clearHighlighteds()
        //                     this.highlightLink(link, true)
        //                     this.selectedLink = link
        //                 }
        //             }
        //         },
        //         $(go.Shape,
        //             { strokeWidth: 1, stroke: '#a6b7c4' },
        //             new go.Binding('stroke', 'isHighlighted', (h) => { console.log(h, '---isHighlighted---'); return h ? highlightColor : '#a6b7c4' }).ofObject(),
        //             new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject(),
        //             new go.Binding('strokeDashArray', 'direct', (h) => { return h ? '' : [3, 2] })
        //         ),
        //         $(go.Shape, { toArrow: 'Standard', fill: '#a6b7c4', stroke: '#a6b7c4' },
        //             new go.Binding('fill', 'isHighlighted', (h, shape) => { console.log(h, '---isHighlighted---'); return h ? highlightColor : '#a6b7c4' }).ofObject(),
        //             new go.Binding('stroke', 'isHighlighted', (h, shape) => { console.log(h, '---isHighlighted---'); return h ? highlightColor : '#a6b7c4' }).ofObject(),
        //         ),

        //     )

        return diagram
    }

    bindNodeData = (data) => {

        if (this.diagram) {
            this.diagram.div = null
        }
        this.diagram = this.initDiagram()
        // nodeKeyProperty: "key"
        // this.diagram.model = new go.GraphLinksModel(data.nodeDataList || [], data.relationList || [])
        this.diagram.model = $(go.GraphLinksModel, {
            nodeKeyProperty: "id",
            nodeDataArray: data.nodeDataList || [],
            linkDataArray: data.relationList || []
        })
        let scale = this.getScacle(data.nodeDataList)
        this.diagram.scale = scale
        // console.log(this.diagram.findNodeForKey(this.props.selectedId), '----this.diagram.findNodeForKey(this.props.selectedId)')
        // this.diagram.commandHandler.scrollToPart(this.diagram.findNodeForKey(this.props.selectedId))
        // Overview
        let overview = document.getElementById('overviewDiv')
        if (scale < 0.8) {
            overview.style.display = 'inline'
            if (this.myOverview == null) {
                this.myOverview = $(go.Overview, 'overviewDiv', { observed: this.diagram, contentAlignment: go.Spot.Center })
            }
        } else {
            overview.style.display = 'none'
        }
        this.setState({
            data
        })

        // this.diagram.div = null
    }
    handleModelChange = () => {

    }

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
        const {
            styleLeft,
            styleTop,
            nodeInfo,
            styleDisplay,
            linkInfo
        } = this.state
        return (
            <div className='graph-relation' >
                <div className='typeTableStyle' >
                    {
                        _.map(this.props.nodeTypes, (types, k) => {
                            return (
                                <div className='typeContainerStyle'>
                                    <div className='typeColor' style={{ 'background': types.color, 'borderColor': types.color }}></div>
                                    {types.name}
                                </div>
                            )
                        })
                    }
                </div>
                <div id='chartDiagram' style={{ 'position': 'relative' }}>
                    <div id='diagramDiv' className='diagram-component'></div>
                    <div id='overviewDiv' className='overview-component'></div>
                </div>
                <div style={{ float: 'right', zIndex: '999', bottom: '10px', right: '10px', position: 'absolute' }}>
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
