import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip, Select, Divider, Input } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import './index.less'
import resetPng from './images/reset.png'
import plus from './images/plus.png'
import minus from './images/minus.png'

const { Option } = Select
const { Search } = Input
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
            items: [],
            dropdownOpen: true,
            onBlurDisable: false,
            nodes: [],
            nodeLength: 0,
            addRelationVisible: this.props.addRelationVisible ? this.props.addRelationVisible : true,
            editRelationVisible: this.props.editRelationVisible ? this.props.editRelationVisible : false
        }

        this.diagram = null
        this.selectedNode = {}
        this.selectedField = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highLightNodeItems = {}
        this.highlightColor = '#66BFFF'
        this.linkHighlightColor = '#33333d'

        this.selectedLink = {}
        this.highLightLinks = {}

        this.highLightNodesByClick = {}
        this.highLightNodesByEnter = {}
        this.highLightLinksByClick = {}
        this.highLightLinksByEnter = {}
    }

    componentDidMount() {
        if (!this.diagram) {
            this.diagram = this.initDiagram()
        }
    }

    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDom')
        let parentDiv = document.getElementById('chartDiagram')
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDom')
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDom')
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDom')
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    initDiagram = () => {
        // this.initElement()
        let highlightColor = this.highlightColor

        let $ = go.GraphObject.make
        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip
        })
        let myDiagram = $(go.Diagram, 'diagramDom',
            {
                // initialAutoScale: go.Diagram.Uniform, // 自适应
                // initialDocumentSpot: go.Spot.Center,
                // initialViewportSpot: go.Spot.TopCenter,
                // initialContentAlignment: go.Spot.Center, // 加载位置
                // initialAutoScale: go.Diagram.UniformToFill,
                // scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
                // 'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
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

        myDiagram.layout = $(go.LayeredDigraphLayout, { isRealtime: false, layerSpacing: 300, columnSpacing: 100 })

        let fieldTemplate = $(go.Panel, 'TableRow',
            new go.Binding('portId', 'key'),
            {
                name: 'FIELD',
                fromLinkable: true, toLinkable: true,
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Left,
                click: (e, field) => {
                    this.props.markText && this.props.markText(field.data.coordinate)
                    if (this.selectedField.data) {
                        if (this.selectedField.data.key !== field.data.key) {
                            this.clearClickNodes()
                            field.background = highlightColor
                            this.highlightAllPathByClick(field)
                        }
                    } else {
                        field.background = highlightColor
                        this.highlightAllPathByClick(field)
                    }
                },
                mouseEnter: (e, field) => {
                    // // console.log(field, '------fieldfield-------')
                    // field.background = highlightColor
                    // // field.fromSpot.isHighlighted = true
                    // // field.toSpot.isHighlighted = true
                    this.props.markText && this.props.markText(field.data.coordinate)
                    this.highlightAllPathByEnter(field)
                },
                mouseLeave: (e, field) => {
                    this.clearEnterNodes()
                }

            },
            $(go.Picture,
                {
                    column: 0,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
                    // stroke: 'purple', strokeWidth: 2,
                    // strokeDashArray: [6, 6, 2, 2]
                },
                new go.Binding('source', 'keyType', (keyType) => {
                    if (keyType === 1) {
                        return '/resources/images/relation/primaryKey.png'
                    } else if (keyType === 2) {
                        return '/resources/images/relation/foreignKey.png'
                    }
                }),
            ),

            $(go.TextBlock,
                {
                    column: 1,
                    margin: new go.Margin(5, 10, 5, 0),
                    stretch: go.GraphObject.Horizontal,
                    font: '14px PingFangSC-Regular,PingFang SC',
                    wrap: go.TextBlock.None,
                    overflow: go.TextBlock.OverflowEllipsis,
                    // and disallow drawing links from or to this text:
                    // fromLinkable: false, toLinkable: false
                },
                new go.Binding('text', 'name')),

            $(go.Picture,
                {
                    column: 2,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
                },
                new go.Binding('source', 'keyType', (keyType) => {
                    if (keyType === 1) {
                        return '/resources/images/relation/Index.svg'
                    } else if (keyType === 2) {
                        // return '/resources/images/relation/foreignKey.png'
                    }
                }),
            ),
        )

        // This template represents a whole "record".
        myDiagram.nodeTemplate = $(go.Node, 'Auto',
            {
                // fromSpot: go.Spot.AllSides,
		        // toSpot: go.Spot.AllSides,
                // isShadowed: true,
                width: 300,
                // shadowOffset: new go.Point(3, 3),
                // shadowColor: '#C5C1AA',
                // selectionAdorned: true,
                // avoidable: false
                opacity: 1
            },
            $(go.Shape, { fill: '#fff', stroke: '#8CBF73' },
                new go.Binding('stroke', 'type', (keyType) => {
                    // return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                    return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                })),
            new go.Binding('location', 'location').makeTwoWay(),
            new go.Binding('desiredSize', 'visible', function(v) { return new go.Size(NaN, NaN) }).ofObject('LIST'),

            $(go.Panel, 'Vertical',
                { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(go.Panel, 'Table',
                    { stretch: go.GraphObject.Horizontal, background: '#8CBF73' },
                    new go.Binding('background', 'type', (keyType) => {
                        // return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                        return this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['color'] ? this.props.typeConfig[keyType]['color'] : '#8CBF73'
                    }),
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 0,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC',
                        },
                        new go.Binding('text', 'name')),
                    $(go.Panel, 'Horizontal',
                        { column: 1 },
                        $('PanelExpanderButton', 'LIST')
                    ),
                ),
                $(go.Panel, 'Table',
                    {
                        name: 'LIST',
                        stretch: go.GraphObject.Horizontal,
                        width: 300,
                        // visible: false,
                        // desiredSize: new go.Size(NaN, 60), // fixed width
                        // stretch: go.GraphObject.Fill, // but stretches vertically
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultColumnSeparatorStrokeWidth: 0.5,
                        // minSize: new go.Size(100, 10),
                        // defaultAlignment: go.Spot.Left,
                        // defaultStretch: go.GraphObject.Horizontal,
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultRowSeparatorStroke: 'gray',
                        // isPanelMain: true,
                        itemTemplate: fieldTemplate,

                    },
                    new go.Binding('visible', 'type', (keyType) => {
                        // console.log(this.props.typeConfig[keyType]['visible'], '--------this.props.typeConfig[keyType]-------')
                        return !!(this.props.typeConfig[keyType] && this.props.typeConfig[keyType]['visible'] == true)
                    }),
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
                corner: 30,
                // curve: go.Link.JumpOver,
                curve: go.Link.Bezier,
                toEndSegmentLength: 300,
                fromEndSegmentLength: 30,
                toolTip: myToolTip,
                selectable: false,
                opacity: 1,
                // curve: go.Link.Bezier,
                // mouseEnter: (e, link) => { this.highlightLink(link, true) },
                // mouseLeave: (e, link) => { this.highlightLink(link, false) }
                // click: (e, link) => {
                //     // link.data.pic = 'test'
                //     // this.updateLinkData(link)
                // }
            },
            $(go.Shape,
                { strokeWidth: 1.5, stroke: '#979797', fill: '#979797' },
                new go.Binding('stroke', 'isHighlighted', (h) => { return h ? this.linkHighlightColor : '#979797' }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject(),
            ),
            $(go.Shape,
                { toArrow: 'Standard', stroke: '#979797' },
                new go.Binding('fill', '#979797')),
        )

        return myDiagram
    }

    highlightLink = (link, show) => {
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.linkHighlightColor : '#a6b7c4'
        link.elt(0).strokeWidth = show ? '2' : '1'

        // link.fromPort.background = show ? this.highlightColor : 'transparent'
        // link.toPort.background = show ? this.highlightColor : 'transparent'

        // if (show) {
        //     this.diagram.model.setDataProperty(link.data, 'visible', true)
        //     this.highLightLinks[link.data.id] = link
        // } else {
        //     this.diagram.model.setDataProperty(link.data, 'visible', false)
        // }
    }

    highlightAllPathByClick = (node, pos = 'init') => {
        // console.log(node.data)
        // console.log(this.highLightNodes)
        let nodeId = node.data.key
        let portId = node.portId
        node.background = this.highlightColor

        if (this.highLightNodesByClick[nodeId]) {
            return
        } else {
            this.highLightNodesByClick[nodeId] = node
        }

        node.part.linksConnected.each((link) => {
            let linkData = link.data
            let fromNode = link.fromPort
            let toNode = link.toPort

            if (portId == linkData.fromPort || portId == linkData.toPort) {
                fromNode.background = this.highlightColor
                toNode.background = this.highlightColor

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
        node.background = this.highlightColor

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
                fromNode.background = this.highlightColor
                toNode.background = this.highlightColor

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

    clearClickNodes = () => {
        _.map(this.highLightNodesByClick, (n, k) => {
            n.background = 'transparent'
        })

        _.map(this.highLightLinksByClick, (n, k) => {
            this.highlightLink(n, false)
        })
    }

    clearEnterNodes = () => {
        _.map(this.highLightNodesByEnter, (n, k) => {
            if (!this.highLightNodesByClick[k]) {
                n.background = 'transparent'
            }
        })

        _.map(this.highLightLinksByEnter, (n, k) => {
            if (!this.highLightLinksByClick[k]) {
                this.highlightLink(n, false)
            }
        })
    }

    findAllSelectedItems = () => {
        // let slices = []
        for (let nit = this.diagram.nodes; nit.next();) {
            let node = nit.value
            // if (this.highLightNodes[node.key]) {
            //     node.opacity = 1
            // } else {
            //     node.opacity = 0.3
            // }
        }

        for (let lit = this.diagram.links; lit.next();) {
            let link = lit.value
            // if (this.highLightLinks[link.data.id]) {
            //     link.opacity = 1
            // } else {
            //     link.opacity = 0.3
            // }
        }
        // return slices
    }

    /**
     * 寻找图上 node下的字段对像
     *
     * @param {*} node
     * @param {*} eqId
     */
    findItemOBject = (node, eqId) => {
        let list = node.findObject('LIST')
        if (list) {
            for (let sit = list.elements; sit.next();) {
                let slicepanel = sit.value.findObject('FIELD')
                // console.log(slicepanel, eqId, '------slicepanel')
                if (slicepanel.data.id == eqId) {
                    // console.log(slicepanel, eqId, '------return slicepanel')
                    return slicepanel
                }
            }
        }
        return false
    }

    /**
     * 清除非相关线和字段的高亮效果
     */
    clearHighlights = () => {
        _.map(this.highLightNodeItems, (n, k) => {
            n.background = 'transparent'
        })
        _.map(this.highLightLinks, (l, k) => {
            // n.background = 'transparent'
            this.highlightLink(l, false)
        })
        this.highLightLinks = {}
        this.highLightNodes = {}
        this.highLightNodeItems = {}
    }

    /**
     * 高亮相关节点字段及线
     *
     * @param {*} field
     * @param {*} pos
     */
    highlightRelationItem = (field, pos = 'init') => {
        let nodeId = field.data.id

        if (this.highLightNodeItems[nodeId]) {
            return
        } else {
            field.background = this.highlightColor
            this.highLightNodeItems[nodeId] = field
        }

        field.part.linksConnected.each((link) => {
            let linkData = link.data
            let fromNodeId = linkData.fromPort
            let toNodeId = linkData.toPort
            let fromNode = link.fromPort
            let toNode = link.toPort
            // console.log(fromNode, toNode.findObject('LIST'), '--------fromNode, toNode-------')
            if (fromNodeId == nodeId || toNodeId == nodeId) {
                this.highlightLink(link, true)

                this.highLightNodes[linkData.from] = fromNode
                this.highLightNodes[linkData.to] = toNode
                toNode.findObject('LIST').visible = true
                fromNode.findObject('LIST').visible = true
                if (pos == 'init') {
                    if (fromNodeId === nodeId) {
                        let n = this.findItemOBject(toNode, toNodeId)
                        if (n) {
                            n.background = this.highlightColor
                            this.highLightNodeItems[n.data.id] = n
                        }
                    } else {
                        if (toNodeId === nodeId) {
                            let n = this.findItemOBject(fromNode, fromNodeId)
                            if (n) {
                                n.background = this.highlightColor
                                this.highLightNodeItems[n.data.id] = n
                            }
                        }
                    }
                }

                if (pos == 'from') {
                    if (toNodeId === nodeId) {
                        let n = this.findItemOBject(fromNode, fromNodeId)
                        if (n) {
                            n.background = this.highlightColor
                            this.highLightNodeItems[n.data.id] = n
                        }
                    }
                }

                if (pos == 'to') {
                    if (fromNodeId === nodeId) {
                        let n = this.findItemOBject(toNode, toNodeId)
                        if (n) {
                            n.background = this.highlightColor
                            this.highLightNodeItems[n.data.id] = n
                        }
                    }
                }
            }
        })

        this.findAllSelectedItems()
    }

    highlightItems = (e, field) => {
        if (this.selectedField.id) {
            if (this.selectedField.id == field.data.id) {
                // 如果上一次选中的为当前点击节点，则清除高亮效果
                this.clearHighlights()
                this.selectedField = {}
            } else {
                // 否则，清除效果后，当前节点相关项高亮
                this.clearHighlights()
                this.highlightRelationItem(field)
                this.selectedField = field.data
            }
        } else {
            this.highlightRelationItem(field)
            this.selectedField = field.data
        }
    }

    showToolTip = (obj, diagram, tool) => {
        let pt = diagram.lastInput.viewPoint
        let styleLeft = pt.x - 15 + 'px'
        let styleTop = pt.y + 'px'
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

    updateLinkData = (link) => {
        let linkData = link.data
        if (this.selectedLink.__gohashid) {
            if (linkData.__gohashid !== this.selectedLink.__gohashid) {
                this.diagram.model.setDataProperty(linkData, 'pic', 'red')
                this.diagram.model.setDataProperty(this.selectedLink, 'pic', '')
            }
        } else {
            this.diagram.model.setDataProperty(linkData, 'pic', 'red')
        }
        this.selectedLink = linkData
    }

    incrementCount = (e, obj) => {
        let pt = e.diagram.lastInput.viewPoint
        let styleLeft = pt.x - 15 + 'px'
        let styleTop = pt.y + 20 + 'px'
        let data = {
            businessId: obj.part.key,
            businessTypeName: obj.part.data.tableName
        }
        let style = {
            left: styleLeft,
            top: styleTop
        }
        this.props.addRelation && this.props.addRelation(data, style)
    }

    linkEditClick = (e, obj) => {
        let pt = e.diagram.lastInput.viewPoint
        let styleLeft = pt.x - 15 + 'px'
        let styleTop = pt.y + 20 + 'px'
        let data = {
            businessId: obj.from,
            id: obj.id
        }
        let style = {
            left: styleLeft,
            top: styleTop
        }
        this.props.editRelation && this.props.editRelation(data, style)
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
        // console.log(scale, '----scale---')
        return scale
    }

    bindNodeData = (data) => {
        let items = []
        let nodes = []
        if (data.nodeDataArray && data.nodeDataArray.length > 0) {
            this.diagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    linkFromPortIdProperty: 'fromPort',
                    linkToPortIdProperty: 'toPort',
                    nodeDataArray: data.nodeDataArray || {},
                    linkDataArray: data.linkDataArray || {}
                })

            let scale = this.getScacle(data.nodeDataArray)
            let overview = document.getElementById('overviewDom')
            // if (scale >= 0.8) {
            overview.style.display = 'inline'
            let myOverview = $(go.Overview, 'overviewDom', // the HTML DIV element for the Overview
                { observed: this.diagram, contentAlignment: go.Spot.Left }) // tell it which Diagram to show and pan
            // } else {
            //     overview.style.display = 'none'
            // }
            // nodes = data.nodeDataArray

            // // 默认取出前面的 10 个 渲染至搜索下拉框中
            // let nodeOptionsSource = []
            // if (data.nodeDataArray.length <= 10) {
            //     nodeOptionsSource = data.nodeDataArray
            // } else {
            //     nodeOptionsSource = data.nodeDataArray.slice(10)
            // }

            // _.map(nodeOptionsSource, (node, k) => {
            //     items.push({
            //         'label': node.tableName,
            //         'key': node.key
            //     })
            // })
        }
        // this.setState({
        //     data,
        //     nodes,
        //     items,
        //     'nodeLength': nodes.length
        // })
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
        this.bindNodeData(this.state.data)
    }

    selectedItem = (value) => {
        // console.log(value)
        if (!_.isEmpty(this.selectedNode)) {
            this.selectedNode.isSelected = false
        }
        let node = this.diagram.findNodeForKey(value)
        node.isSelected = true
        this.diagram.commandHandler.scrollToPart(node)
        this.selectedNode = node
    }

    searchItem = (value) => {
        console.log(value)
        let nodes = this.state.nodes
        let items = []
        let regex = new RegExp(`${value}`)
        let count = 0
        _.map(nodes, (node, k) => {
            if (count >= 10) {
                return
            }
            let label = node.tableName
            console.log(label, regex)
            if (regex.test(label)) {
                items.push({
                    label,
                    'key': node.key
                })
                count = count + 1
            }
        })

        this.setState({
            items
        })
    }

    setDropdownOpen = (open) => {
        this.setState({
            'dropdownOpen': open
        })
    }

    setOnBlurDisable = (status) => {
        this.setState({
            'onBlurDisable': status
        })
    }

    render() {
        const {
            styleLeft,
            styleTop,
            nodeInfo,
            styleDisplay,
            linkInfo,
            etlProcessList,
            items,
            dropdownOpen,
            onBlurDisable
        } = this.state
        return (
            <div className='graph-relation' >
                <div id='chartDiagram' style={{ 'position': 'relative', height: '100%' }}>
                    <div id='diagramDom' className='diagram-component'></div>
                    <div id='overviewDom' className='overview-component' style={{ display: 'none' }}></div>
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
                    修改
                </div>
            </div>

        )
    }
}
