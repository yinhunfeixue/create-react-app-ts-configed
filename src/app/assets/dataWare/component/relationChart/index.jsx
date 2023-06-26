import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import './index.less'
import resetPng from './images/reset.png'
import plus from './images/plus.png'
import minus from './images/minus.png'

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
            etlProcessList: [],
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
        this.selectedNode = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highlightColor = '#FFC811'
    }

    highlightLink = (link, show) => {
        // console.log(link.elt(0), link.fromPort, '------link-----')
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.highlightColor : '#a6b7c4'
        link.elt(0).strokeWidth = show ? '2' : '1'
        link.fromPort.background = show ? this.highlightColor : 'transparent'
        link.toPort.background = show ? this.highlightColor : 'transparent'
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

    // selectedHighlightLink = (link, show) => {
    //     link.isSelected = show
    //     // link.isHighlighted = show
    //     link.fromNode.isHighlighted = show
    //     link.toNode.isHighlighted = show
    // }

    // highlightAllPath = (node, pos = 'init') => {
    //     // link.isHighlighted = show
    //     // link.fromNode.isHighlighted = show
    //     // link.toNode.isHighlighted = show

    //     // let fromNode = link.fromNode
    //     // let toNode = link.toNode
    //     console.log(node.data)
    //     console.log(this.highLightNodes)
    //     let nodeId = node.data.key

    //     if (this.highLightNodes[nodeId]) {
    //         return
    //     } else {
    //         this.highLightNodes[nodeId] = 1
    //     }

    //     node.linksConnected.each((link) => {
    //         let fromNode = link.fromNode
    //         let toNode = link.toNode

    //         if (pos == 'init') {
    //             this.highlightLink(link, true)
    //             if (fromNode.data.key === nodeId) {
    //                 // this.highLightNodes[toNode.data.key] = 1
    //                 this.highlightAllPath(toNode, 'to')
    //             } else {
    //                 // this.highLightNodes[fromNode.data.key] = 1
    //                 this.highlightAllPath(fromNode, 'from')
    //             }
    //         }

    //         if (pos == 'from') {
    //             if (toNode.data.key === nodeId) {
    //                 // this.highLightNodes[fromNode.data.key] = 1
    //                 this.highlightLink(link, true)
    //                 this.highlightAllPath(fromNode, 'from')
    //             }
    //         }

    //         if (pos == 'to') {
    //             if (fromNode.data.key === nodeId) {
    //                 // this.highLightNodes[toNode.data.key] = 1
    //                 this.highlightLink(link, true)
    //                 this.highlightAllPath(toNode, 'to')
    //             }
    //         }
    //     })
    // }

    componentDidMount() {
        if (!this.diagram) {
            console.log('----chart----componentDidMountcomponentDidMountcomponentDidMount--------')
            this.diagram = this.initDiagram()
            // if (this.props.data && this.props.data.nodeDataArray && this.props.data.nodeDataArray.length > 0) {
            //     this.bindNodeData(this.props.data)
            // }
        }
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
          //   var toolTipDIV = document.getElementById('toolTipDIV')
          //   toolTipDIV.style.display = 'none'

          this.setState({
              styleDisplay: 'none'
          })
      }

    // showToolTip = (obj) => {
    //     if (obj !== null) {
    //         var node = obj.part
    //         console.log(node.data)
    //         return node.data.label
    //     }
    // }

    handlePannelTransaction = () => {
        console.log('-------------------handlePannelTransaction')
        this.setState({
            styleDisplay: 'none'
        })
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

        let $ = go.GraphObject.make // for conciseness in defining templates
        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip
            // do nothing on hide: This tooltip doesn't hide unless the mouse leaves the diagram
        })
        let myDiagram = $(go.Diagram, 'diagramDiv',
            {
                // validCycle: go.Diagram.CycleNotDirected, // don't allow loops
                initialAutoScale: go.Diagram.Uniform, // 自适应
                // initialDocumentSpot: go.Spot.Center,
                // initialViewportSpot: go.Spot.TopCenter,
                // initialContentAlignment: go.Spot.Center, // 加载位置
                scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
                'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
                'toolManager.hoverDelay': 500,
                allowDelete: true,
                // layout: $(go.ForceDirectedLayout),
                layout: $(go.ForceDirectedLayout, {
                    defaultSpringLength: 100,
                    defaultElectricalCharge: 200,
                    arrangesToOrigin: true,
                }),
                'undoManager.isEnabled': true,
            })

        // myDiagram.layout = $(go.LayeredDigraphLayout, { layerSpacing: 100, isRealtime: false })

        let fieldTemplate = $(go.Panel, 'TableRow',
            new go.Binding('portId', 'id'),
            {
                background: 'transparent', // so this port's background can be picked by the mouse
                fromSpot: go.Spot.Right, // links only go from the right side to the left side
                toSpot: go.Spot.Left,

                fromLinkable: true, toLinkable: true,
                mouseEnter: (e, field) => {
                    // console.log(field, '------fieldfield-------')
                    field.background = highlightColor
                    // field.fromSpot.isHighlighted = true
                    // field.toSpot.isHighlighted = true
                    this.highlightNode(field, true)
                },
                mouseLeave: (e, field) => {
                    field.background = 'transparent'
                    this.highlightNode(field, false)
                }
            },
            $(go.Picture,
                {
                    column: 0,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
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
                new go.Binding('text', 'cname')),

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
                        // return '/resources/images/relation/primaryKey.png'
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
                width: 150,
                // shadowOffset: new go.Point(3, 3),
                // shadowColor: '#C5C1AA',
                // selectionAdorned: true,
                // avoidable: false
            },
            $(go.Shape, { fill: '#fff', stroke: '#FAAF64' }),
            new go.Binding('location', 'location').makeTwoWay(),
		  // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
		  // clear out any desiredSize set by the ResizingTool.
            new go.Binding('desiredSize', 'visible', function(v) { return new go.Size(NaN, NaN) }).ofObject('LIST'),

            $(go.Panel, 'Vertical',
                { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(go.Panel, 'Table',
                    { stretch: go.GraphObject.Horizontal, background: '#FAAF64' },
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 0,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            // stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC'
                        },
                        new go.Binding('text', 'tableName')),
                    $('PanelExpanderButton', 'LIST', { column: 1 })
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
                        itemTemplate: fieldTemplate
                    },
                    new go.Binding('itemArray', 'fields')
                ) // end Table Panel of items
            ) // end Vertical Panel
        ) // end Node
        myDiagram.linkTemplate = $(go.Link,
            // { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
                selectionAdorned: true,
                layerName: 'Foreground',
                reshapable: true,
                routing: go.Link.AvoidsNodes,
                corner: 10,
                curve: go.Link.JumpOver,
                mouseEnter: (e, link) => { this.highlightLink(link, true) },
                mouseLeave: (e, link) => { this.highlightLink(link, false) }
            },
            $(go.Shape,
                { strokeWidth: 1.5, stroke: '#979797', fill: '#979797' },
                new go.Binding('stroke', 'isHighlighted', (h) => { return h ? highlightColor : '#979797' }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject(),
            ),
            // $(go.Shape, // the arrowhead
            //     {
            //         fromArrow: 'Standard',
            //         stroke: '#979797',
            //         // fill: '#979797'
            //         // segmentIndex: 0,
            //         // segmentFraction: 0.5
            //     }
            // ),
            // $(go.Shape, // the arrowhead
            //     {
            //         toArrow: 'Standard',
            //         stroke: '#979797',
            //         // fill: '#979797',
            //         segmentIndex: -1,
            //         segmentFraction: 0.5
            //     }
            // ),

            // 图片
            $(go.Picture,
                {
                    // column: 2,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
                },
                new go.Binding('source', 'join', (join) => {
                    if (join === 0) {
                        return '/resources/images/relation/left.png'
                    } else if (join === 1) {
                        return '/resources/images/relation/right.png'
                    } else if (join === 2) {
                        return '/resources/images/relation/inner.png'
                    } else {
                        return '/resources/images/relation/outer.png'
                    }
                }),
            ),
            // 箭头
            $(go.Shape, { toArrow: 'Standard', fill: '#a6b7c4', stroke: '#a6b7c4' },
                new go.Binding('fill', 'isHighlighted', (h, shape) => { return h ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke'] }).ofObject(),
                new go.Binding('stroke', 'isHighlighted', (h, shape) => { return h ? this.graphConfig['link']['highlight'] : this.graphConfig['link']['stroke'] }).ofObject(),
            ),
            // $(go.TextBlock,
            //     {
            //         textAlign: 'center',
            //         font: 'bold 14px sans-serif',
            //         stroke: '#1967B3',
            //         segmentIndex: 0,
            //         segmentFraction: 0.5,
            //         segmentOffset: new go.Point(NaN, NaN),
            //         segmentOrientation: go.Link.OrientUpright
            //     },
            //     new go.Binding('text', 'text')),
            // $(go.TextBlock, // the "to" label
            //     {
            //         textAlign: 'center',
            //         font: 'bold 14px sans-serif',
            //         stroke: '#1967B3',
            //         segmentIndex: -1,
            //         segmentFraction: 0.5,
            //         segmentOffset: new go.Point(NaN, NaN),
            //         segmentOrientation: go.Link.OrientUpright
            //     },
            //     new go.Binding('text', 'toText')),

        )
        // )

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
        console.log(data, '--------bindNodeData--------')
        // this.setState({
        //     etlProcessList
        // })

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
            let overview = document.getElementById('overviewDiv')
            if (scale !== 0.8) {
                overview.style.display = 'inline'
                let myOverview = $(go.Overview, 'overviewDiv', // the HTML DIV element for the Overview
                    { observed: this.diagram, contentAlignment: go.Spot.Center }) // tell it which Diagram to show and pan
            } else {
                overview.style.display = 'none'
            }
        }
        this.setState({
            data
        })
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
            etlProcessList
        } = this.state
        return (
            <div className='graph-relation' >
                {/* <div >
                    <span style={{ paddingLeft: '8px', zIndex: '999', float: 'left', left: '10px', position: 'absolute', top: '65px' }} >

                        <Dropdown
                            overlay={
                                <Menu onClick={this.onMenuClick}>
                                    {
                                        _.map(etlProcessList, (epros, k) => {
                                            return (
                                                <Menu.Item key={epros.businessId} >
                                                    {epros.businessTypeName}
                                                </Menu.Item>
                                            )
                                        })
                                    }
                                </Menu>
                            }
                            placement='bottomCenter'
                        >

                            <Button type='primary' disabled={!(etlProcessList.length > 0)} >
                                 修改关联关系<Icon type='down' />
                            </Button>
                        </Dropdown>
                    </span>
                </div> */}
                <div id='chartDiagram' style={{ 'position': 'relative', height: '100%' }}>
                    <div id='diagramDiv' className='diagram-component'></div>
                    <div id='overviewDiv' className='overview-component' style={{ display: 'none' }}></div>
                </div>
                <div style={{ zIndex: '999', position: 'absolute' }}>
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
