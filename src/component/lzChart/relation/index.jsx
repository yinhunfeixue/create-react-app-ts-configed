import IconFont from '@/component/IconFont'
import { Button, Col, Row, Tooltip } from 'antd'
import * as go from 'gojs'
import React, { Component } from 'react'
import _ from 'underscore'
import minus from './images/minus.png'
import plus from './images/plus.png'
import './index.less'

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
            node.background = this.operateCenterColor
        } else {
            node.background = this.highlightColor
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

    componentDidMount() {
        if (!this.diagram) {
            this.diagram = this.initDiagram()
        } else {
            this.diagram.div = null
        }
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
        return scale
    }

    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDivRelation')
        let parentDiv = document.getElementById('chartDiagram')
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDivRelation')
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDivRelation')
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDivRelation')
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    showToolTip = (obj, diagram, tool) => {
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

    initDiagram = () => {
        // this.initElement()
        let highlightColor = this.highlightColor

        // let $ = go.GraphObject.make // for conciseness in defining templates
        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip,
            // do nothing on hide: This tooltip doesn't hide unless the mouse leaves the diagram
        })
        let myDiagram = $(go.Diagram, 'diagramDivRelation', {
            // validCycle: go.Diagram.CycleNotDirected, // don't allow loops
            // initialAutoScale: go.Diagram.Uniform, // 自适应
            // initialDocumentSpot: go.Spot.Center,
            // initialViewportSpot: go.Spot.TopCenter,
            // initialContentAlignment: go.Spot.Center, // 加载位置
            // scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
            // 'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
            scale: 0.7,
            'toolManager.hoverDelay': 500,
            allowDelete: true,
            // layout: $(go.ForceDirectedLayout),
            // layout: $(go.ForceDirectedLayout, {
            //     defaultSpringLength: 100,
            //     defaultElectricalCharge: 200,
            //     arrangesToOrigin: true,
            // }),
            'undoManager.isEnabled': true,
        })

        // myDiagram.layout = $(go.LayeredDigraphLayout, { layerSpacing: 100, isRealtime: false })
        myDiagram.layout = $(go.LayeredDigraphLayout, { isRealtime: false, layerSpacing: 200, columnSpacing: 50 })

        let fieldTemplate = $(
            go.Panel,
            'TableRow',
            new go.Binding('portId', 'key'),
            {
                background: 'transparent', // so this port's background can be picked by the mouse
                fromSpot: go.Spot.RightSide, // links only go from the right side to the left side
                toSpot: go.Spot.LeftSide,
                // width: 150,
                // minSize: new go.Size(100, 30),
                fromLinkable: true,
                toLinkable: true,
                click: (e, field) => {
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
                    field.background = this.operateCenterColor
                    this.props.markText &&
                        this.props.markText({
                            centerNode: field.data,
                            markNodes: this.highLightNodesByClick,
                            operate: 'saveCenter',
                        })
                },
                mouseEnter: (e, field) => {
                    // 如果当前节点没有被选中高亮，则执行当前事件的高亮操作
                    if (!this.highLightNodesByClick[field.data.key]) {
                        // field.background = highlightColor
                        // this.props.markText && this.props.markText(field.data, 'enterCenter')

                        this.highlightAllPathByEnter(field)
                        field.background = this.operateCenterColor
                        this.props.markText &&
                            this.props.markText({
                                centerNode: field.data,
                                markNodes: this.highLightNodesByEnter,
                                operate: 'enterCenter',
                            })
                    }
                },
                mouseLeave: (e, field) => {
                    // 如果当前节点没有被选中高亮，则执行当前事件的清除高亮操作
                    // if (!this.highLightNodesByClick[field.data.key]) {
                    // field.background = 'transparent'
                    this.props.clearMarkText && this.props.clearMarkText()
                    this.clearEnterNodes()
                    // }
                },
            },
            // $(go.Picture,
            //     {
            //         column: 0,
            //         name: 'Picture',
            //         // segmentIndex: 1,
            //         // segmentFraction: 0.5
            //         margin: new go.Margin(1, 5, 1, 10),
            //     },
            //     new go.Binding('source', 'keyType', (keyType) => {
            //         if (keyType === 1) {
            //             return '/resources/images/relation/primaryKey.png'
            //         } else if (keyType === 2) {
            //             return '/resources/images/relation/foreignKey.png'
            //         }
            //     }),
            // ),
            $(
                go.TextBlock,
                {
                    column: 0,
                    margin: new go.Margin(1, 10, 1, 10),
                    stretch: go.GraphObject.Horizontal,
                    font: '14px PingFangSC-Regular,PingFang SC',
                    wrap: go.TextBlock.None,
                    overflow: go.TextBlock.OverflowEllipsis,
                    // and disallow drawing links from or to this text:
                    // fromLinkable: false, toLinkable: false
                },
                new go.Binding('text', 'name')
            )

            // $(go.Picture,
            //     {
            //         column: 2,
            //         name: 'Picture',
            //         // segmentIndex: 1,
            //         // segmentFraction: 0.5
            //         margin: new go.Margin(1, 5, 1, 10),
            //     },
            //     new go.Binding('source', 'keyType', (keyType) => {
            //         if (keyType === 1) {
            //             // return '/resources/images/relation/primaryKey.png'
            //         } else if (keyType === 2) {
            //             // return '/resources/images/relation/foreignKey.png'
            //         }
            //     }),
            // ),
        )

        // This template represents a whole "record".
        myDiagram.nodeTemplate = $(
            go.Node,
            'Auto',
            {
                // fromSpot: go.Spot.RightSide,
                // toSpot: go.Spot.LeftSide,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                minSize: new go.Size(150, 30),
                // isShadowed: true,in
                // from: go.Spot.RightSide, // links only go from the right side to the left side
                // to: go.Spot.LeftSide,
                // width: 150,
                // shadowOffset: new go.Point(3, 3),
                // shadowColor: '#C5C1AA',
                // selectionAdorned: true,
                // avoidable: false
                // selectable: false
            },
            $(
                go.Shape,
                { fill: '#fff', stroke: '#8CBF73' },
                new go.Binding('stroke', 'type', (keyType) => {
                    // return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                    return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                })
            ),
            new go.Binding('location', 'location').makeTwoWay(),

            $(
                go.Panel,
                'Vertical',
                { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(
                    go.Panel,
                    'Table',
                    {
                        stretch: go.GraphObject.Horizontal,
                        background: '#8CBF73',
                        minSize: new go.Size(150, 30),
                    },
                    new go.Binding('background', 'type', (keyType) => {
                        // return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                        return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                    }),
                    $(
                        go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 0,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC',
                        },
                        new go.Binding('text', 'name')
                    )
                    // $('PanelExpanderButton', 'LIST', { column: 1 })
                ),
                $(
                    go.Panel,
                    'Table',
                    {
                        name: 'LIST',
                        stretch: go.GraphObject.Horizontal,
                        minSize: new go.Size(150, 30),
                        // defaultAlignment: go.Spot.Left,
                        // defaultStretch: go.GraphObject.Horizontal,
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultRowSeparatorStroke: 'gray',
                        itemTemplate: fieldTemplate,
                    },
                    new go.Binding('itemArray', 'children')
                ) // end Table Panel of items
            ) // end Vertical Panel
        ) // end Node
        myDiagram.linkTemplate = $(
            go.Link,
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
            $(
                go.Shape,
                { strokeWidth: 1.5, stroke: '#979797', fill: '#979797' },
                new go.Binding('stroke', 'isHighlighted', (h) => {
                    return h ? highlightColor : '#979797'
                }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => {
                    return h ? 2 : 1
                }).ofObject()
            ),
            $(go.Shape, { toArrow: 'Standard', stroke: '#979797' }, new go.Binding('fill', '#979797'))
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

    bindNodeData = (data) => {
        // this.diagram.div = null
        if (data.nodeDataArray && data.nodeDataArray.length > 0) {
            this.diagram.model = $(go.GraphLinksModel, {
                copiesArrays: true,
                copiesArrayObjects: true,
                linkFromPortIdProperty: 'fromPort',
                linkToPortIdProperty: 'toPort',
                nodeDataArray: data.nodeDataArray || {},
                linkDataArray: data.linkDataArray || {},
            })

            // let scale = this.getScacle(data.nodeDataArray)
            this.diagram.scale = 0.7
            let overview = document.getElementById('overviewDivRelation')
            // if (scale !== 0.8) {
            overview.style.display = 'inline'
            if (this.myOverview == null) {
                this.myOverview = $(go.Overview, 'overviewDivRelation', { observed: this.diagram, contentAlignment: go.Spot.Center })
            }
            // } else {
            //     overview.style.display = 'none'
            // }

            // this.initAllNodeVisible()
        }
        this.setState({
            data,
        })
    }

    initAllNodeVisible = () => {
        // let slices = []
        for (let nit = this.diagram.nodes; nit.next(); ) {
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

    handleModelChange = () => {}

    decreaseZoom = () => {
        this.diagram.commandHandler.decreaseZoom()
    }

    increaseZoom = () => {
        this.diagram.commandHandler.increaseZoom()
    }

    resetZoom = () => {
        this.bindNodeData(this.state.data)
    }

    render() {
        const { styleLeft, styleTop, nodeInfo, styleDisplay, linkInfo, etlProcessList } = this.state
        return (
            <div className='lzChartRelation'>
                <div id='chartDiagram' style={{ position: 'relative', height: '100%' }}>
                    <div id='diagramDivRelation' className='diagramComponent'></div>
                    <div id='overviewDivRelation' className='overviewComponent' style={{ display: 'none' }}></div>
                </div>
                <div className='ControlGroup'>
                    <div className='SubGroup'>
                        <Tooltip placement='topLeft' title='恢复到初始视图'>
                            <Button type='text' size='small' onClick={this.resetZoom} icon={<IconFont type='e6cc' useCss style={{ color: '#5E6266' }} />} />
                        </Tooltip>
                    </div>
                    <div className='SubGroup'>
                        <Button type='text' size='small' onClick={this.increaseZoom}>
                            <img src={plus} />
                        </Button>
                        <Button type='text' size='small' onClick={this.decreaseZoom}>
                            <img src={minus} />
                        </Button>
                    </div>
                </div>
                <div
                    className='node-tooltip'
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        display: styleDisplay,
                        left: styleLeft,
                        top: styleTop,
                    }}
                >
                    {!_.isEmpty(nodeInfo) ? (
                        <div>
                            <Row>
                                <Col span='24'>
                                    <span className='field-name'>表英文名:</span>
                                    <span>{nodeInfo.tableEName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span='24'>
                                    <span className='field-name'>表中文名:</span>
                                    <span>{nodeInfo.tableCName}</span>
                                </Col>
                            </Row>
                            <Row>
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
                            </Row>
                        </div>
                    ) : null}
                    {!_.isEmpty(linkInfo) ? (
                        <div>
                            {_.map(linkInfo, (link, k) => {
                                return (
                                    <Row>
                                        <Col span='24'>{link}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}
