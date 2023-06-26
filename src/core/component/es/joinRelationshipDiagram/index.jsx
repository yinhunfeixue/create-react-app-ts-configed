/**
 * 关联关系图，表示的是字段主外键关系
 * 如：LEFT, RIGHT, INNER, FULL等关系
 */
import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip, Select, Divider, Input } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import './index.less'
import resetPng from './images/reset.png'
import plus from './images/plus.png'
import minus from './images/minus.png'
import leftPng from './images/left.png'
import rightPng from './images/right.png'
import outerPng from './images/outer.png'
import innrePng from './images/inner.png'

const { Option } = Select
const { Search } = Input
const $ = go.GraphObject.make
const relationTypes = {
    'LEFT': '左连接',
    'RIGHT': '右连接',
    'INNER': ' 内连接',
    'FULL': '外连接',
    'CROSS': '外连接'
}
export default class JoinRelationshipDiagram extends Component {
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
        this.myOverview = null
        this.selectedNode = {}
        this.selectedField = {}
        this.selectedLink = {}
        this.highLightNodes = {}
        this.highLightNodeItems = {}
        this.highlightColor = '#66BFFF'
        this.sampleData = {
            "linkDataArray": [
                {
                    "from": "5627560039619094488",
                    "fromFieldText": "aid",
                    "fromPort": "1238906807788639619",
                    "id": "44822",
                    "text": "1",
                    "join": "LEFT",
                    "to": "3702414090830001272",
                    "toFieldText": "aid",
                    "toPort": "3927854588385745665",
                    "toText": "1"
                },
                {
                    "from": "3602840687749306578",
                    "fromFieldText": "aid",
                    "fromPort": "3953718327678676786",
                    "id": "44823",
                    "text": "1",
                    "join": "RIGHT",
                    "to": "3702414090830001272",
                    "toFieldText": "aid",
                    "toPort": "3927854588385745665",
                    "toText": "1"
                },
                {
                    "from": "5970431975426442044",
                    "fromFieldText": "jid",
                    "fromPort": "3209735411493834995",
                    "id": "44824",
                    "text": "1",
                    "join": "INNER",
                    "to": "6988831649020673977",
                    "toFieldText": "jid",
                    "toPort": "4771710422303584493",
                    "toText": "1"
                },
                {
                    "from": "1145614917479054240",
                    "fromFieldText": "jid",
                    "fromPort": "2822822499673847011",
                    "id": "44825",
                    "text": "1",
                    "join": "FULL",
                    "to": "6988831649020673977",
                    "toFieldText": "jid",
                    "toPort": "4771710422303584493",
                    "toText": "1"
                },
                {
                    "from": "5855915012939507260",
                    "fromFieldText": "kid",
                    "fromPort": "9172444698656983842",
                    "id": "44826",
                    "text": "1",
                    "join": "CROSS",
                    "to": "7161302614547487417",
                    "toFieldText": "kid",
                    "toPort": "1295015627977091900",
                    "toText": "1"
                },
                {
                    "from": "6387103165158855962",
                    "fromFieldText": "kid",
                    "fromPort": "5071061356717723842",
                    "id": "44827",
                    "text": "1",
                    "to": "7161302614547487417",
                    "toFieldText": "kid",
                    "toPort": "1295015627977091900",
                    "toText": "1"
                },
                {
                    "from": "6309493948044942884",
                    "fromFieldText": "kid",
                    "fromPort": "4859213860601332154",
                    "id": "44828",
                    "text": "1",
                    "to": "7161302614547487417",
                    "toFieldText": "kid",
                    "toPort": "1295015627977091900",
                    "toText": "1"
                },
                {
                    "from": "399295288205122285",
                    "fromFieldText": "citing",
                    "fromPort": "5822099660526797359",
                    "id": "44829",
                    "text": "1",
                    "to": "1145614917479054240",
                    "toFieldText": "pid",
                    "toPort": "1822969320297628142",
                    "toText": "1"
                },
                {
                    "from": "399295288205122285",
                    "fromFieldText": "cited",
                    "fromPort": "8300029602569290396",
                    "id": "44830",
                    "text": "1",
                    "to": "1145614917479054240",
                    "toFieldText": "pid",
                    "toPort": "1822969320297628142",
                    "toText": "1"
                },
                {
                    "from": "7013734867946970046",
                    "fromFieldText": "pid",
                    "fromPort": "6535493477496621526",
                    "id": "44831",
                    "text": "1",
                    "to": "1145614917479054240",
                    "toFieldText": "pid",
                    "toPort": "1822969320297628142",
                    "toText": "1"
                },
                {
                    "from": "6309493948044942884",
                    "fromFieldText": "pid",
                    "fromPort": "4757022643401185660",
                    "id": "44832",
                    "text": "1",
                    "to": "1145614917479054240",
                    "toFieldText": "pid",
                    "toPort": "1822969320297628142",
                    "toText": "1"
                },
                {
                    "from": "3602840687749306578",
                    "fromFieldText": "pid",
                    "fromPort": "2532493673972784319",
                    "id": "44833",
                    "text": "1",
                    "to": "1145614917479054240",
                    "toFieldText": "pid",
                    "toPort": "1822969320297628142",
                    "toText": "1"
                },
                {
                    "from": "1046605390734082585",
                    "fromFieldText": "cid",
                    "fromPort": "4134357167180544542",
                    "id": "44834",
                    "text": "1",
                    "to": "2969486015320165531",
                    "toFieldText": "cid",
                    "toPort": "6528238393176451009",
                    "toText": "1"
                },
                {
                    "from": "1145614917479054240",
                    "fromFieldText": "cid",
                    "fromPort": "8259859200696199669",
                    "id": "44835",
                    "text": "1",
                    "to": "2969486015320165531",
                    "toFieldText": "cid",
                    "toPort": "6528238393176451009",
                    "toText": "1"
                },
                {
                    "from": "5627560039619094488",
                    "fromFieldText": "did",
                    "fromPort": "3308703932828758172",
                    "id": "44836",
                    "text": "1",
                    "to": "8507663708190571718",
                    "toFieldText": "did",
                    "toPort": "4294972105617869796",
                    "toText": "1"
                },
                {
                    "from": "1046605390734082585",
                    "fromFieldText": "did",
                    "fromPort": "8911628580342596755",
                    "id": "44837",
                    "text": "1",
                    "to": "8507663708190571718",
                    "toFieldText": "did",
                    "toPort": "4294972105617869796",
                    "toText": "1"
                },
                {
                    "from": "5970431975426442044",
                    "fromFieldText": "did",
                    "fromPort": "4308634665461937002",
                    "id": "44838",
                    "text": "1",
                    "to": "8507663708190571718",
                    "toFieldText": "did",
                    "toPort": "4294972105617869796",
                    "toText": "1"
                },
                {
                    "from": "5855915012939507260",
                    "fromFieldText": "did",
                    "fromPort": "6269272013901710706",
                    "id": "44839",
                    "text": "1",
                    "to": "8507663708190571718",
                    "toFieldText": "did",
                    "toPort": "4294972105617869796",
                    "toText": "1"
                },
                {
                    "from": "7013734867946970046",
                    "fromFieldText": "did",
                    "fromPort": "8327845538506661696",
                    "id": "44840",
                    "text": "1",
                    "to": "8507663708190571718",
                    "toFieldText": "did",
                    "toPort": "4294972105617869796",
                    "toText": "1"
                },
                {
                    "from": "3702414090830001272",
                    "fromFieldText": "oid",
                    "fromPort": "2432673669462440088",
                    "id": "44841",
                    "text": "1",
                    "to": "3196457704582052685",
                    "toFieldText": "oid",
                    "toPort": "3843324171238584094",
                    "toText": "1"
                }
            ],
            "nodeDataArray": [
                {
                    "fields": [
                        {
                            "cname": "cited",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "8300029602569290396",
                            "keyType": 2
                        },
                        {
                            "cname": "citing",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "5822099660526797359",
                            "keyType": 2
                        }
                    ],
                    "key": "399295288205122285",
                    "tableName": "cite"
                },
                {
                    "fields": [
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "8911628580342596755",
                            "keyType": 2
                        },
                        {
                            "cname": "cid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4134357167180544542",
                            "keyType": 2
                        }
                    ],
                    "key": "1046605390734082585",
                    "tableName": "domain_conference"
                },
                {
                    "fields": [
                        {
                            "cname": "cid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "8259859200696199669",
                            "keyType": 2
                        },
                        {
                            "cname": "pid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "1822969320297628142",
                            "keyType": 0
                        },
                        {
                            "cname": "jid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "2822822499673847011",
                            "keyType": 2
                        }
                    ],
                    "key": "1145614917479054240",
                    "tableName": "publication"
                },
                {
                    "fields": [
                        {
                            "cname": "cid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "6528238393176451009",
                            "keyType": 0
                        }
                    ],
                    "key": "2969486015320165531",
                    "tableName": "conference"
                },
                {
                    "fields": [
                        {
                            "cname": "oid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "3843324171238584094",
                            "keyType": 0
                        }
                    ],
                    "key": "3196457704582052685",
                    "tableName": "organization"
                },
                {
                    "fields": [
                        {
                            "cname": "aid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "3953718327678676786",
                            "keyType": 2
                        },
                        {
                            "cname": "pid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "2532493673972784319",
                            "keyType": 2
                        }
                    ],
                    "key": "3602840687749306578",
                    "tableName": "writes"
                },
                {
                    "fields": [
                        {
                            "cname": "oid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "2432673669462440088",
                            "keyType": 2
                        },
                        {
                            "cname": "aid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "3927854588385745665",
                            "keyType": 0
                        }
                    ],
                    "key": "3702414090830001272",
                    "tableName": "author"
                },
                {
                    "key": "5268019237411561805",
                    "tableName": "ids"
                },
                {
                    "fields": [
                        {
                            "cname": "aid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "1238906807788639619",
                            "keyType": 2
                        },
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "3308703932828758172",
                            "keyType": 2
                        }
                    ],
                    "key": "5627560039619094488",
                    "tableName": "domain_author"
                },
                {
                    "fields": [
                        {
                            "cname": "kid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "9172444698656983842",
                            "keyType": 2
                        },
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "6269272013901710706",
                            "keyType": 2
                        }
                    ],
                    "key": "5855915012939507260",
                    "tableName": "domain_keyword"
                },
                {
                    "fields": [
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4308634665461937002",
                            "keyType": 2
                        },
                        {
                            "cname": "jid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "3209735411493834995",
                            "keyType": 2
                        }
                    ],
                    "key": "5970431975426442044",
                    "tableName": "domain_journal"
                },
                {
                    "fields": [
                        {
                            "cname": "kid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4859213860601332154",
                            "keyType": 2
                        },
                        {
                            "cname": "pid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4757022643401185660",
                            "keyType": 2
                        }
                    ],
                    "key": "6309493948044942884",
                    "tableName": "publication_keyword"
                },
                {
                    "fields": [
                        {
                            "cname": "kid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "5071061356717723842",
                            "keyType": 2
                        }
                    ],
                    "key": "6387103165158855962",
                    "tableName": "keyword_variations"
                },
                {
                    "fields": [
                        {
                            "cname": "jid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4771710422303584493",
                            "keyType": 0
                        }
                    ],
                    "key": "6988831649020673977",
                    "tableName": "journal"
                },
                {
                    "fields": [
                        {
                            "cname": "pid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "6535493477496621526",
                            "keyType": 2
                        },
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "8327845538506661696",
                            "keyType": 2
                        }
                    ],
                    "key": "7013734867946970046",
                    "tableName": "domain_publication"
                },
                {
                    "fields": [
                        {
                            "cname": "kid",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "1295015627977091900",
                            "keyType": 0
                        }
                    ],
                    "key": "7161302614547487417",
                    "tableName": "keyword"
                },
                {
                    "fields": [
                        {
                            "cname": "did",
                            "dataType": "INT",
                            "hasIndex": false,
                            "id": "4294972105617869796",
                            "keyType": 0
                        }
                    ],
                    "key": "8507663708190571718",
                    "tableName": "domain"
                }
            ]
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
            hide: this.hideToolTip
        })
        let myDiagram = $(go.Diagram, 'diagramDivModel' + this.containerId,
            {
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
                "undoManager.isEnabled": true
            })

        // myDiagram.layout = $(go.LayeredDigraphLayout, { layerSpacing: 100, isRealtime: false })

        let fieldTemplate = $(go.Panel, 'TableRow',
            {
                name: 'FIELD',
                fromLinkable: true, toLinkable: true,
                click: (e, field) => {
                    // field.part.diagram.clearHighlighteds()
                    this.highlightItems(e, field)
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
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                // isShadowed: true,
                width: 150,
                // shadowOffset: new go.Point(3, 3),
                // shadowColor: '#C5C1AA',
                // selectionAdorned: true,
                // avoidable: false
                opacity: 1
            },
            $(go.Shape, { fill: '#fff', stroke: '#8CBF73' },
                new go.Binding('stroke', 'keyType', (keyType) => {
                    return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
                })),
            new go.Binding('location', 'location').makeTwoWay(),
            new go.Binding('desiredSize', 'visible', function (v) { return new go.Size(NaN, NaN) }).ofObject('LIST'),

            $(go.Panel, 'Vertical',
                { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
                // $(go.Shape, { fill: '#fff', stroke: '979797' }),
                $(go.Panel, 'Table',
                    { stretch: go.GraphObject.Horizontal, background: '#8CBF73' },
                    new go.Binding('background', 'keyType', (keyType) => {
                        return this.props.colors[keyType] ? this.props.colors[keyType] : '#8CBF73'
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
                            // stretch: go.GraphObject.Horizontal,
                            // wrap: go.TextBlock.None,
                            // overflow: go.TextBlock.OverflowEllipsis,
                        },
                        new go.Binding('text', 'tableName')),
                    $(go.Panel, 'Horizontal',
                        {
                            column: 1,
                            visible: false
                        },
                        new go.Binding('visible', 'fields', (fields) => {
                            return fields && fields.length
                        }),
                        $('PanelExpanderButton', 'LIST')
                    ),
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
                        // isPanelMain: true,
                        itemTemplate: fieldTemplate,

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
                // toolTip: myToolTip,
                selectable: false,
                opacity: 1,
                // curve: go.Link.Bezier,
                // mouseEnter: (e, link) => { this.highlightLink(link, true) },
                // mouseLeave: (e, link) => { this.highlightLink(link, false) }
                click: (e, link) => {
                    // link.data.pic = 'test'
                    // this.updateLinkData(link)
                }
            },
            $(go.Shape,
                { strokeWidth: 1.5, stroke: '#979797', fill: '#979797' },
                new go.Binding('stroke', 'isHighlighted', (h) => { return h ? highlightColor : '#979797' }).ofObject(),
                new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject(),
            ),
            $(go.Picture,
                {
                    // column: 2,
                    name: 'Picture',
                    // segmentIndex: 1,
                    // segmentFraction: 0.5
                    margin: new go.Margin(5, 5, 5, 10),
                },
                new go.Binding('source', 'join', (joinType) => {
                    // console.log('11111111111111111111111111111111111111111111111111111111111111111111111111')
                    if (joinType === 'LEFT') {
                        return '/resources/images/relation/left.png'
                    } else if (joinType === 'RIGHT') {
                        return '/resources/images/relation/right.png'
                    } else if (joinType === 'INNER') {
                        return '/resources/images/relation/inner.png'
                    } else {
                        return '/resources/images/relation/outer.png'
                    }
                }),
            ),

            // $(go.Shape, // the arrowhead
            //     {
            //         fromArrow: 'BackwardFork',
            //         stroke: '#979797',
            //         // fill: '#979797'
            //         // segmentIndex: 0,
            //         // segmentFraction: 0.5
            //     }
            // ),
            // $(go.Shape, // the arrowhead
            //     {
            //         toArrow: 'Line',
            //         stroke: '#979797',
            //         // fill: '#979797',
            //         segmentIndex: -1,
            //         segmentFraction: 0.5
            //     }
            // )
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
        for (let nit = this.diagram.nodes; nit.next();) {
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

        for (let lit = this.diagram.links; lit.next();) {
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
            this.diagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    // linkFromPortIdProperty: 'fromPort',
                    // linkToPortIdProperty: 'toPort',
                    nodeDataArray: data.nodeDataArray || [],
                    linkDataArray: data.linkDataArray || []
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
                this.myOverview = $(go.Overview,
                    'overviewDivModel' + this.containerId,
                    { observed: this.diagram, contentAlignment: go.Spot.Center }
                )
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
        let chartDiagramId = 'chartDiagram' + this.containerId
        let diagramDivModelId = 'diagramDivModel' + this.containerId
        let overviewDivModelId = 'overviewDivModel' + this.containerId
        return (
            <div className='graph-relation' >
                <div id={chartDiagramId} style={{ 'position': 'relative', height: '100%' }}>
                    <div id={diagramDivModelId} className='diagram-component'></div>
                    <div id={overviewDivModelId} className='overview-component' style={{ display: 'none' }}></div>
                </div>
                {/* <div style={{ float: 'right', zIndex: '999', top: '10px', right: '10px', position: 'absolute' }}>
                 <Select
                 style={{ width: 240 }}
                 placeholder='请选择表'
                 open={dropdownOpen}
                 onDropdownVisibleChange={(open) => {
                 console.log(open)
                 if (!onBlurDisable) {
                 this.setDropdownOpen(open)
                 }
                 }}
                 onSelect={this.selectedItem}
                 dropdownRender={(menu) => (
                 <div>
                 <div
                 className='searchItem'
                 onMouseEnter={() => this.setOnBlurDisable(true)}
                 onMouseLeave={() => this.setOnBlurDisable(false)}
                 >
                 <Search
                 ref={(e) => { this.suggestInput = e }}
                 placeholder='请输入表名称'
                 // onMouseDown={(e) => {
                 //     // this.focus()
                 //     // this.suggestInput.focus()
                 //     e.preventDefault()
                 // }}
                 // autoFocus
                 onSearch={this.searchItem}
                 style={{ width: '100%' }}
                 />
                 <Divider style={{ margin: '4px 0' }} />
                 </div>
                 {menu}

                 </div>
                 )}
                 >
                 {items.map((item) => (
                 <Option key={item.key}>{item.label}</Option>
                 ))}
                 </Select>
                 </div> */}
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
