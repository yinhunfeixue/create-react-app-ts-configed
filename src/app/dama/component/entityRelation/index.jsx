import { Button, Input, Select, Tooltip } from 'antd'
import * as go from 'gojs'
import React, { Component } from 'react'
import _ from 'underscore'
import minus from './images/minus.png'
import plus from './images/plus.png'
import resetPng from './images/reset.png'
import './index.less'

const { Option } = Select
const { Search } = Input
const $ = go.GraphObject.make

export default class EntityRelation extends Component {
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
            editRelationVisible: this.props.editRelationVisible ? this.props.editRelationVisible : false,
        }

        this.diagram = null
        this.myOverview = null
        this.selectedNode = {}
        this.selectedField = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highLightNodeItems = {}
        this.highlightColor = '#66BFFF'
        this.sampleData = {
            linkDataArray: [
                {
                    connect: 1,
                    from: '2175053559610091053',
                    fromPort: '350152359003401854',
                    id: '981',
                    join: 0,
                    text: 'n',
                    to: '1983343608281095504',
                    toPort: '7943410321061752673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '1557319344458660325',
                    fromPort: '5735763385337248231',
                    id: '1026',
                    join: 1,
                    text: 'n',
                    to: '1983343608281095504',
                    toPort: '7943410321061752673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '5367315770607909400',
                    fromPort: '8116833326046893671',
                    id: '1176',
                    join: 1,
                    text: 'n',
                    to: '1983343608281095504',
                    toPort: '7943410321061752673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '5367315770607909400',
                    fromPort: '206502934857033181',
                    id: '1177',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8725470978308607939',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '2175053559610091053',
                    fromPort: '8687382920263443362',
                    id: '1211',
                    join: 0,
                    text: 'n',
                    to: '1557319344458660325',
                    toPort: '3732836904933487673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '2352828927466629653',
                    fromPort: '8370804876546356745',
                    id: '1255',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8687382920263443362',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '2352828927466629653',
                    fromPort: '8330183256736569239',
                    id: '1258',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8725470978308607939',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '2352828927466629653',
                    fromPort: '5154057041077082059',
                    id: '1260',
                    join: 1,
                    text: 'n',
                    to: '1983343608281095504',
                    toPort: '7943410321061752673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '2352828927466629653',
                    fromPort: '5154057041077082059',
                    id: '1261',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '350152359003401854',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '3784724265654039689',
                    fromPort: '9143043061839013249',
                    id: '1262',
                    join: 1,
                    text: 'n',
                    to: '1557319344458660325',
                    toPort: '3732836904933487673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '3784724265654039689',
                    fromPort: '9143043061839013249',
                    id: '1263',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8687382920263443362',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '3784724265654039689',
                    fromPort: '8354126893797876073',
                    id: '1264',
                    join: 1,
                    text: 'n',
                    to: '1983343608281095504',
                    toPort: '8667732924866213859',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '3784724265654039689',
                    fromPort: '7604674695740495691',
                    id: '1265',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8725470978308607939',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '3784724265654039689',
                    fromPort: '6823368930396947435',
                    id: '1266',
                    join: 1,
                    text: 'n',
                    to: '1557319344458660325',
                    toPort: '5751511849956319417',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '475456792154487895',
                    fromPort: '2482067581234510633',
                    id: '1535',
                    join: 1,
                    text: 'n',
                    to: '1557319344458660325',
                    toPort: '3732836904933487673',
                    toText: '1',
                },
                {
                    connect: 1,
                    from: '475456792154487895',
                    fromPort: '2482067581234510633',
                    id: '1536',
                    join: 1,
                    text: 'n',
                    to: '2175053559610091053',
                    toPort: '8687382920263443362',
                    toText: '1',
                },
            ],
            nodeDataArray: [
                {
                    fields: [
                        {
                            cname: '营业部ID',
                            dataType: 'INTEGER',
                            id: '350152359003401854',
                            keyType: 2,
                        },
                        {
                            cname: '客户ID',
                            dataType: 'STRING',
                            id: '8687382920263443362',
                            keyType: 2,
                        },
                        {
                            cname: '交易日期',
                            dataType: 'INTEGER',
                            id: '8725470978308607939',
                            keyType: 0,
                        },
                    ],
                    keyType: 2,
                    key: '2175053559610091053',
                    tableName: '交易日表1',
                },
                {
                    fields: [
                        {
                            cname: '营业部ID',
                            dataType: 'INTEGER',
                            id: '7943410321061752673',
                            keyType: 0,
                        },
                        {
                            cname: '营业部名称',
                            dataType: 'STRING',
                            id: '8667732924866213859',
                            keyType: 0,
                        },
                    ],
                    keyType: 1,
                    key: '1983343608281095504',
                    tableName: '营业部信息表1',
                },
                {
                    fields: [
                        {
                            cname: '客户ID',
                            dataType: 'STRING',
                            id: '3732836904933487673',
                            keyType: 0,
                        },
                        {
                            cname: '营业部ID',
                            dataType: 'INTEGER',
                            id: '5735763385337248231',
                            keyType: 2,
                        },
                        {
                            cname: '有效户',
                            dataType: 'INT',
                            id: '5751511849956319417',
                            keyType: 0,
                        },
                    ],
                    keyType: 0,
                    key: '1557319344458660325',
                    tableName: '客户信息表1',
                },
                {
                    fields: [
                        {
                            cname: '有效户',
                            dataType: 'INTEGER',
                            id: '6823368930396947435',
                            keyType: 2,
                        },
                        {
                            cname: '交易日期(月份)',
                            dataType: 'STRING',
                            id: '7604674695740495691',
                            keyType: 2,
                        },
                        {
                            cname: '营业部名称',
                            dataType: 'STRING',
                            id: '8354126893797876073',
                            keyType: 2,
                        },
                        {
                            cname: '客户ID',
                            dataType: 'STRING',
                            id: '9143043061839013249',
                            keyType: 2,
                        },
                    ],
                    keyType: 0,
                    key: '3784724265654039689',
                    tableName: 'V1',
                },
                {
                    fields: [
                        {
                            cname: '交易日期(月份)',
                            dataType: 'STRING',
                            id: '206502934857033181',
                            keyType: 2,
                        },
                        {
                            cname: '营业部ID',
                            dataType: 'INTEGER',
                            id: '8116833326046893671',
                            keyType: 2,
                        },
                    ],
                    keyType: 2,
                    key: '5367315770607909400',
                    tableName: 'V2',
                },
                {
                    fields: [
                        {
                            cname: '客户ID',
                            dataType: 'STRING',
                            id: '2482067581234510633',
                            keyType: 2,
                        },
                    ],
                    keyType: 1,
                    key: '475456792154487895',
                    tableName: '24234324',
                },
                {
                    fields: [
                        {
                            cname: '营业部ID',
                            dataType: 'INTEGER',
                            id: '5154057041077082059',
                            keyType: 2,
                        },
                        {
                            cname: '交易日期(月份)',
                            dataType: 'STRING',
                            id: '8330183256736569239',
                            keyType: 2,
                        },
                        {
                            cname: '客户ID',
                            dataType: 'STRING',
                            id: '8370804876546356745',
                            keyType: 2,
                        },
                    ],
                    keyType: 2,
                    key: '2352828927466629653',
                    tableName: 'V3',
                },
            ],
        }

        this.selectedLink = {}
        this.highLightLinks = {}
        this.containerId = 'diagramDomGraph'
    }
    componentWillMount() {
        //this.setState({totalloading:true})
        this.generateContainerId()
    }

    componentDidMount() {
        // if (!this.diagram) {
        //     this.diagram = this.initDiagram()
        // }
    }
    //生成容器id，避免多次引用重复
    generateContainerId = () => {
        let idNumber = parseInt(100 * Math.random() * 10 * Math.random())
        this.containerId = this.containerId + idNumber
    }

    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDivModel' + this.containerId)
        let parentDiv = document.getElementById('chartDiagram' + this.containerId)
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDivModel' + this.containerId)
        div.setAttribute('class', 'diagram-component')
        parentDiv.appendChild(div)

        let overview = document.getElementById('overviewDivModel' + this.containerId)
        parentDiv.removeChild(overview)
        let divOv = document.createElement('div')
        divOv.setAttribute('id', 'overviewDivModel' + this.containerId)
        divOv.setAttribute('class', 'overview-component')
        parentDiv.appendChild(divOv)
    }

    initDiagram = () => {
        this.initElement()
        let highlightColor = this.highlightColor

        let $ = go.GraphObject.make
        let myToolTip = $(go.HTMLInfo, {
            show: this.showToolTip,
            hide: this.hideToolTip,
        })
        let myDiagram = $(go.Diagram, 'diagramDivModel' + this.containerId, {
            // initialDocumentSpot: go.Spot.TopLeft,
            // initialViewportSpot: go.Spot.TopLeft,
            scrollMode: go.Diagram.InfiniteScroll, // 启动无限滚动，不受边界控制
            'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 启动滚轮缩放
            // 'dragSelectingTool.isEnabled': false,
            // 'animationManager.isEnabled': false,
            // 'toolManager.hoverDelay': 500,
            // // layout: $(go.ForceDirectedLayout),
            // layout: $(go.ForceDirectedLayout, {
            //     // defaultSpringLength: 100,
            //     // defaultElectricalCharge: 200,
            //     // arrangesToOrigin: true,
            // }),
            initialContentAlignment: go.Spot.TopCenter,
            allowDelete: false,
            allowCopy: false,
            layout: $(go.ForceDirectedLayout),
            'undoManager.isEnabled': true,
        })

        // myDiagram.layout = $(go.LayeredDigraphLayout, { layerSpacing: 100, isRealtime: false })

        let fieldTemplate = $(
            go.Panel,
            'TableRow',
            {
                name: 'FIELD',
                fromLinkable: true,
                toLinkable: true,
                click: (e, field) => {
                    // field.part.diagram.clearHighlighteds()
                    this.highlightItems(e, field)
                },
            },
            // $(
            //     go.Picture,
            //     {
            //         column: 0,
            //         name: 'Picture',
            //         // segmentIndex: 1,
            //         // segmentFraction: 0.5
            //         margin: new go.Margin(5, 5, 5, 10),
            //         // stroke: 'purple', strokeWidth: 2,
            //         // strokeDashArray: [6, 6, 2, 2]
            //     },
            //     new go.Binding('source', 'keyType', (keyType) => {
            //         if (keyType === 1) {
            //             return '/resources/images/relation/primaryKey.png'
            //         } else if (keyType === 2) {
            //             return '/resources/images/relation/foreignKey.png'
            //         }
            //     })
            // ),
            $(go.TextBlock,
                {
                    column: 0,
                    margin: new go.Margin(5, 5, 5, 10),
                    stretch: go.GraphObject.Horizontal,
                    font: '14px PingFangSC-Regular,PingFang SC',
                    wrap: go.TextBlock.None,
                    overflow: go.TextBlock.OverflowEllipsis,
                    // and disallow drawing links from or to this text:
                    // fromLinkable: false, toLinkable: false
                },
                new go.Binding('text', 'ename')),

            $(
                go.TextBlock,
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
                new go.Binding('text', 'cname')
            ),

            $(
                go.Picture,
                {
                    column: 2,
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
            )
        )

        // This template represents a whole "record".
        myDiagram.nodeTemplate = $(
            go.Node,
            'Auto',
            {
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                // isShadowed: true,
                width: 150,
                // shadowOffset: new go.Point(3, 3),
                // shadowColor: '#C5C1AA',
                // selectionAdorned: true,
                // avoidable: false
                opacity: 1,
            },
            $(
                go.Shape,
                { fill: '#fff', stroke: '#8CBF73' },
                new go.Binding('stroke', 'keyType', (keyType) => {
                    return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                })
            ),
            new go.Binding('location', 'location').makeTwoWay(),
            new go.Binding('desiredSize', 'visible', function (v) {
                return new go.Size(NaN, NaN)
            }).ofObject('LIST'),

            $(
                go.Panel,
                'Vertical',
                { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(
                    go.Panel,
                    'Table',
                    { stretch: go.GraphObject.Horizontal, background: '#8CBF73' },
                    new go.Binding('background', 'keyType', (keyType) => {
                        return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
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
                            // stretch: go.GraphObject.Horizontal,
                            // wrap: go.TextBlock.None,
                            // overflow: go.TextBlock.OverflowEllipsis,
                        },
                        new go.Binding('text', 'tableEnglishName')),
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 1,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC',
                            // stretch: go.GraphObject.Horizontal,
                            // wrap: go.TextBlock.None,
                            // overflow: go.TextBlock.OverflowEllipsis,
                        },
                        new go.Binding('text', 'tableName')),
                    $(go.TextBlock,
                        {
                            // alignment: go.Spot.Center,
                            column: 2,
                            alignment: go.Spot.Left,
                            margin: new go.Margin(5, 10, 5, 10),
                            stroke: 'white',
                            textAlign: 'center',
                            font: '14px PingFangSC-Regular,PingFang SC',
                            // stretch: go.GraphObject.Horizontal,
                            // wrap: go.TextBlock.None,
                            // overflow: go.TextBlock.OverflowEllipsis,
                        },
                        new go.Binding('text', 'tableType', (tableType) => {
                            if (tableType == 1) {
                                return '事实表'
                            }
                        })
                    ),
                    $(
                        go.Panel,
                        'Horizontal',
                        {
                            column: 3,
                            visible: false,
                        },
                        // $('Button',
                        //     {
                        //         width: 14, height: 14,
                        //         visible: this.state.addRelationVisible,
                        //         'ButtonBorder.stroke': null,
                        //         'ButtonBorder.fill': null,
                        //         '_buttonFillOver': null,
                        //         '_buttonStrokeNormal': '#fff',
                        //         // '_buttonStrokeOver': '#fff',
                        //         // '_buttonFillPressed': null,
                        //         click: this.incrementCount
                        //     },
                        //     new go.Binding('ButtonBorder.fill', 'keyType', (keyType) => {
                        //         return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                        //     }),
                        //     $(go.Shape, 'PlusLine')
                        // ),
                        new go.Binding('visible', 'fields', (fields) => {
                            return fields && fields.length
                        }),
                        $('PanelExpanderButton', 'LIST')
                    )
                ),
                $(
                    go.Panel,
                    'Table',
                    {
                        name: 'LIST',
                        stretch: go.GraphObject.Horizontal,
                        // minSize: new go.Size(100, 10),
                        // defaultAlignment: go.Spot.Left,
                        // defaultStretch: go.GraphObject.Horizontal,
                        // defaultColumnSeparatorStroke: 'gray',
                        // defaultRowSeparatorStroke: 'gray',
                        // isPanelMain: true,
                        itemTemplate: fieldTemplate,
                    },
                    new go.Binding('itemArray', 'fields')
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
                routing: go.Link.AvoidsNodes,
                corner: 10,
                curve: go.Link.JumpOver,
                toolTip: myToolTip,
                selectable: false,
                opacity: 1,
                // curve: go.Link.Bezier,
                // mouseEnter: (e, link) => { this.highlightLink(link, true) },
                // mouseLeave: (e, link) => { this.highlightLink(link, false) }
                click: (e, link) => {
                    // link.data.pic = 'test'
                    // this.updateLinkData(link)
                },
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
            $(
                go.Picture,
                {
                    // column: 2,
                    name: 'Picture',
                    width: 24,
                    height: 24,
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
                    click: (e, link) => {
                        console.log(link, '---------rrrrrrrrrrrrrrrrrrrr----------')
                        this.linkEditClick(e, link.part.data)
                    },
                },
                new go.Binding('source', 'join', (joinType) => {
                    if (this.props.canEdit) {
                        return '/resources/images/edit_round.png'
                    }
                })
            ),
            // $('Button',
            //     {
            //         // visible: this.state.editRelationVisible,
            //         margin: 2,
            //         width: 16,
            //         // click: incrementCounter
            //         'ButtonBorder.figure': 'Circle',
            //         'ButtonBorder.stroke': '#1890ff',
            //         click: (e, link) => {
            //             console.log(link, '---------rrrrrrrrrrrrrrrrrrrr----------')
            //             this.linkEditClick(e, link.part.data)
            //         }
            //     },
            //     new go.Binding('visible', 'visible', (visible) => {
            //         // if (this.state.editRelationVisible) {
            //         if (visible) {
            //             return true
            //         }
            //         // }
            //         return false
            //     }),
            //     // $(go.Picture,
            //     //     {
            //     //         name: 'Picture',
            //     //     },
            //     //     new go.Binding('source', 'visible', (visible) => {
            //     //         return '/resources/images/edit.png'
            //     //     }))
            //
            // ),

            // $(go.Shape, // the arrowhead
            //     {
            //         fromArrow: 'BackwardFork',
            //         stroke: '#979797',
            //         // fill: '#979797'
            //         // segmentIndex: 0,
            //         // segmentFraction: 0.5
            //     }
            // ),
            $(
                go.Shape, // the arrowhead
                {
                    toArrow: 'Standard',
                    stroke: '#979797',
                    // fill: '#979797',
                    // segmentIndex: -1,
                    // segmentFraction: 0.5
                }
            )
        )
        // )

        return myDiagram
    }

    highlightLink = (link, show) => {
        link.isHighlighted = show
        link.elt(0).stroke = show ? this.highlightColor : '#a6b7c4'
        link.elt(0).strokeWidth = show ? '2' : '1'

        if (show) {
            this.diagram.model.setDataProperty(link.data, 'visible', true)
            this.highLightLinks[link.data.id] = link
        } else {
            this.diagram.model.setDataProperty(link.data, 'visible', false)
        }
    }

    findAllSelectedItems = (operate) => {
        console.log('-----findAllSelectedItems------------------findAllSelectedItems-------')
        // let slices = []
        for (let nit = this.diagram.nodes; nit.next(); ) {
            let node = nit.value
            if (operate == 'clear') {
                node.opacity = 1
            } else {
                if (this.highLightNodes[node.key]) {
                    node.opacity = 1
                } else {
                    node.opacity = 0.3
                }
            }
            console.log(node)
        }

        for (let lit = this.diagram.links; lit.next(); ) {
            let link = lit.value
            if (operate == 'clear') {
                link.opacity = 1
            } else {
                if (this.highLightLinks[link.data.id]) {
                    link.opacity = 1
                } else {
                    link.opacity = 0.3
                }
            }
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
            for (let sit = list.elements; sit.next(); ) {
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

        this.findAllSelectedItems('clear')
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
                // console.log(' 如果上一次选中的为当前点击节点，则清除高亮效果')
                // 如果上一次选中的为当前点击节点，则清除高亮效果
                this.clearHighlights()
                this.selectedField = {}
            } else {
                // console.log('否则，清除效果后，当前节点相关项高亮')
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
            linkInfo,
        })
    }

    hideToolTip = (diagram, tool) => {
        this.setState({
            styleDisplay: 'none',
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
            businessTypeName: obj.part.data.tableName,
        }
        let style = {
            left: styleLeft,
            top: styleTop,
        }
        this.props.addRelation && this.props.addRelation(data, style)
    }

    linkEditClick = (e, obj) => {
        let pt = e.diagram.lastInput.viewPoint
        let styleLeft = pt.x - 15 + 'px'
        let styleTop = pt.y + 20 + 'px'
        let data = {
            businessId: obj.from,
            id: obj.id,
        }
        let style = {
            left: styleLeft,
            top: styleTop,
        }
        this.props.editRelation && this.props.editRelation(obj)
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

    bindNodeData = (array) => {
        let data = array
        console.log(data, 'bindNodeData')
        if (this.diagram) {
            this.diagram.div = null
        }

        if (this.myOverview) {
            this.myOverview.div = null
        }

        this.diagram = this.initDiagram()
        let items = []
        let nodes = []
        if (data.nodeDataArray && data.nodeDataArray.length > 0) {
            this.diagram.model = $(go.GraphLinksModel, {
                copiesArrays: true,
                copiesArrayObjects: true,
                // linkFromPortIdProperty: 'fromPort',
                // linkToPortIdProperty: 'toPort',
                nodeDataArray: data.nodeDataArray || [],
                linkDataArray: data.linkDataArray || [],
            })

            let scale = this.getScacle(data.nodeDataArray)
            // let overview = document.getElementById('overviewDivModel')
            // if (scale < 0.8) {
            //     overview.style.display = 'inline'
            //     let myOverview = $(go.Overview, 'overviewDivModel', // the HTML DIV element for the Overview
            //         { observed: this.diagram }) // tell it which Diagram to show and pan
            // } else {
            //     overview.style.display = 'none'
            // }
            let overview = document.getElementById('overviewDivModel' + this.containerId)
            if (scale < 0.8) {
                overview.style.display = 'inline'
                // if (this.myOverview == null) {
                // this.myOverview = $(go.Overview, 'overviewDivModel', { observed: this.diagram })
                this.myOverview = $(go.Overview, 'overviewDivModel' + this.containerId, { observed: this.diagram, contentAlignment: go.Spot.Center })
                // }
            } else {
                overview.style.display = 'none'
            }

            // nodes = data.nodeDataArray

            // 默认取出前面的 10 个 渲染至搜索下拉框中
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
        this.setState({
            data,
            // nodes,
            // items,
            // 'nodeLength': nodes.length
        })
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
                    key: node.key,
                })
                count = count + 1
            }
        })

        this.setState({
            items,
        })
    }

    setDropdownOpen = (open) => {
        this.setState({
            dropdownOpen: open,
        })
    }

    setOnBlurDisable = (status) => {
        this.setState({
            onBlurDisable: status,
        })
    }

    render() {
        const { styleLeft, styleTop, nodeInfo, styleDisplay, linkInfo, etlProcessList, items, dropdownOpen, onBlurDisable } = this.state
        let chartDiagramId = 'chartDiagram' + this.containerId
        let diagramDivModelId = 'diagramDivModel' + this.containerId
        let overviewDivModelId = 'overviewDivModel' + this.containerId
        return (
            <div className='graph-relation' style={{ 'position': 'relative' }}>
                <div id={chartDiagramId} style={{ height: '100%' }}>
                    <div id={diagramDivModelId} className='diagram-component'></div>
                    <div id={overviewDivModelId} className='overview-component' style={{ display: 'none' }}></div>
                </div>
                <div style={{ zIndex: '999', bottom: '10px', right: '10px', position: 'absolute' }}>
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
                {/*<div className='node-tooltip' style={{*/}
                {/*position: 'absolute',*/}
                {/*zIndex: 1000,*/}
                {/*display: styleDisplay,*/}
                {/*left: styleLeft,*/}
                {/*top: styleTop,*/}
                {/*// width: '30%'*/}
                {/*}}*/}
                {/*>*/}
                {/*修改*/}
                {/*</div>*/}
            </div>
        )
    }
}
