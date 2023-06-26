import React, { Component } from 'react'
import { Button, Row, Col, Menu, Dropdown, Tooltip, Select, Divider, Input } from 'antd';
import _ from 'underscore'
import * as go from 'gojs'
import CONSTANT from './CONSTANT';
import './index.less'

const $ = go.GraphObject.make
var names = {}

export default class TreeChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [JSON.parse(JSON.stringify(this.props.treeData))],
            nodeDataArray: []
        }
        this.diagram = null
        this.containerId = 'diagramDomGraph'
    }

    componentWillMount() {
        //this.setState({totalloading:true})
        this.generateContainerId()
    }

    componentDidMount() {
        this.getParentId()

        console.log(this.state.treeData, 'JSON.parse(JSON.stringify(this.props.treeData))')
        if (!this.diagram) {
            this.diagram = this.initDiagram()
        }
    }
    treeExpand = (id) => {
        console.log(id)
    }

    //生成容器id，避免多次引用重复
    generateContainerId = () => {
        let idNumber = parseInt(100 * Math.random() * 10 * Math.random())
        this.containerId = this.containerId + idNumber
    }


    // 初始化图相关的dom元素，避免重复创建报错
    initElement = () => {
        let mygoChart = document.getElementById('diagramDomTree' + this.containerId)
        let parentDiv = document.getElementById('chartDiagramTree' + this.containerId)
        parentDiv.removeChild(mygoChart)
        let div = document.createElement('div')
        div.setAttribute('id', 'diagramDomTree' + this.containerId)
        div.setAttribute('class', 'diagramComponent')
        parentDiv.appendChild(div)
    }

    initDiagram = () => {
        this.initElement()
        let $ = go.GraphObject.make;
        let diagram = $(go.Diagram, "diagramDomTree" + this.containerId,
            {
                initialAutoScale: go.Diagram.UniformToFill,
                // define the layout for the diagram
                layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 })
            });
        diagram.nodeTemplate =
            $(go.Node, 'Horizontal',
                { selectionChanged: this.nodeSelectionChanged },
                $(go.Panel, "Auto",
                    $(go.Shape,
                        { stroke: null },
                        new go.Binding("fill", "color"),
                        new go.Binding("figure", "fig")
                    ),
                    $(go.TextBlock,
                        {
                            font: "bold 12px Helvetica, bold Arial, sans-serif",
                            stroke: "white", margin: 10
                        },
                        new go.Binding("text", "name"))
                ),
                $("TreeExpanderButton", { margin: 5 })
            );
        diagram.linkTemplate =
            $(go.Link,
                { selectable: false },
                {
                    curve: go.Link.Bezier,
                    toEndSegmentLength: 30, fromEndSegmentLength: 30, curviness: 20
                },
                $(go.Shape, { fill: '#999999', stroke: '#999999', strokeWidth: 1 }) // the link shape, with the default black stroke
            );

        let nodeDataArray = this.getTreeData(this.state.treeData)
        // create the model for the DOM tree
        diagram.model =
            $(go.TreeModel, {
                isReadOnly: true,  // don't allow the user to delete or copy nodes
                // build up the tree in an Array of node data
                nodeDataArray
            });
    }
    getTreeData = (data) => {
        let { nodeDataArray } = this.state
        data.map((item) => {
            let color = item.level == 0 ? '#636399' : CONSTANT.BACKGROUNDCOLOR[item.color % 6 ? (item.color % 6 - 1) : 5]
            let fig = item.level == 0 ? 'Circle' : 'Rectangle'
            nodeDataArray.push({ key: item.id, name: item.name, parent: item.parentId, color: color, fig: fig })
            this.setState({ nodeDataArray })
            if (item.children.length) {
                this.getTreeData(item.children)
            }
        })
        return nodeDataArray
    }
    getParentId = () => {
        this.state.treeData.map((item) => {
            if (item.children.length) {
                item.children.map((child) => {
                    child.parentId = item.id
                })
            }
        })
        this.setState({ treeData: this.state.treeData })
    }
    nodeSelectionChanged(node) {
        if (node.isSelected) {
            // names[node.data.name].style.backgroundColor = "lightblue";
        } else {
            // names[node.data.name].style.backgroundColor = "";
        }
    }
    render() {
        let chartDiagramTreeId = 'chartDiagramTree' + this.containerId
        let diagramDomTreeId = 'diagramDomTree' + this.containerId
        return (
            <div style={{ width: 'calc(100% - 220px)', height: '100%', display: 'inline-block' }}>
                <div id={chartDiagramTreeId} className='chartContainerTree' style={{ width: '100%', height: '100%' }}>
                    <div id={diagramDomTreeId} className='diagramComponent' style={{ height: '100%' }}></div>
                </div>
            </div>
        )
    }
}