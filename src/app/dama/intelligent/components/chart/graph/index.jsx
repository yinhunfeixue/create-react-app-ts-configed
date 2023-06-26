import {NotificationWrap} from 'app_common'
import React, {Component} from 'react'
import {Graph} from 'app_component'
import _ from 'lodash'

export default class GraphView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalTitle: '',
            events:props.events || {}
        }

        this.optionConfig = {
            selectedColor: 'red', // 选中颜色
            currentBusinessColor: '#fbcb45', // 当前业务节点颜色
            noBusinessColor: '#667bbf', // 非当前业务节点颜色
            lineColor : '#4e90e8', // 线的颜色
        }
        this.selectedRows = {}
        //this.lineColor = '#4e90e8'
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nodeData) {
            this.selectedRows = {}
            let options = this.prepareOption(nextProps.nodeData)
            this.intelModelGraph.refreshGraph(options)
        }
    }

    prepareOption = (nodeData) => {
        let nodes = []
        if (nodeData.nodes === undefined) {
            return {}
        }

        nodeData.nodes.forEach((item) => {
            item["name"] = item["fromTableId"] + ''
            if ( item.dimTable === "1" ) {
                item["symbol"] = "circle"
                item["symbolSize"] = 80
            } else if( item.dimTable === ""  ) {
                item["symbol"] = ""
            }

            item["draggable"] = true

            nodes.push(item)
        })

        let colors = []
        nodeData.groups.forEach((g) => {
            if (g.name) {
                colors.push(this.optionConfig.currentBusinessColor)
            } else {
                colors.push(this.optionConfig.noBusinessColor)
            }
        })

        let edges = []
        nodeData.edges.forEach((edge) => {
            edge['name'] = edge['value']
            edge['value'] = edge['value'].length
            edges.push(edge)
        })

        let options = {
            nodeData: nodes,
            edgesData: edges,
            extraOption: {
                color: colors, // 黄色、蓝色
                series: {
                    top: 10,
                    hoverAnimation: true,
                    nodeScaleRatio: 0,
                    draggable:true,
                    force: {
                        repulsion: 3500,
			            gravity: 0.4,
                        //layoutAnimation: false
                    },

                    symbolSize: [130, 40],
                    symbol: 'path://M19.300,3.300 L253.300,3.300 C262.136,3.300 269.300,10.463 269.300,19.300 L269.300,21.300 C269.300,30.137 262.136,37.300 253.300,37.300 L19.300,37.300 C10.463,37.300 3.300,30.137 3.300,21.300 L3.300,19.300 C3.300,10.463 10.463,3.300 19.300,3.300 Z',
                    edgeSymbol: ['none', 'arrow'],
                    edgeSymbolSize: [2, 8],
                    edgeLabel: {
                        normal: {
                            show: true,
                            formatter: function(param) {
                                return param.data.name
                            },
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    categories: nodeData.groups,
                    focusNodeAdjacency: true,
                    roam: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            textStyle: {
                                fontSize: 10
                            },
                            formatter: function(param) {
                                if( param.data.fromTableName ) {
                                    return param.data.fromTableName+'\n'+param.data.fromTableEnglishName
                                }else{
                                    return param.data.fromTableEnglishName
                                }

                            },
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'dotted',
                            opacity: 0.9,
                            width: 1,
                            curveness: 0.1,
                            color: this.optionConfig.lineColor
                        }
                    }
                }
            },
            visualMap: false
        }
        return options
    }

    /**
     * [handleChangeColor 改变内部已选中节点颜色]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleSelectedNodeColor = (e) => {
        let optionConfig = {
            itemStyle: {
                normal: {
                    color: this.optionConfig.currentBusinessColor,
                }
            }
        }

        let selectedNodes = []
        _.forEach(this.selectedRows, (item, key) => {
            selectedNodes.push(item.data)
        })
        this.intelModelGraph.setNodeAttr(selectedNodes, optionConfig)
        this.selectedRows = {}
    }

    handleDblclick = (e) => {
        if (this.props.dblclick) {
            this.props.dblclick(e)
        }
    }

    /**
     * [handleClick 节点点击事件，记录点击得节点数据]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleClick = (e) => {
        let key = e.seriesIndex+'_'+e.dataIndex
        //高亮时候配置
        let optionConfig = {
            itemStyle:{
                normal: {
                    color:this.optionConfig.selectedColor,
                }
            }
        }

        if (this.selectedRows[key]) {
            //第二次点击颜色恢复,从缓存队列中去除
            let color = this.selectedRows[key]['color']
            optionConfig.itemStyle.normal.color = color
            this.intelModelGraph.setNodeAttr([e], optionConfig)
            delete this.selectedRows[key]
        } else {
            //第一次点击颜色高亮,并缓存被选中节点
            this.intelModelGraph.setNodeAttr([e], optionConfig)
            this.selectedRows[key] = {
                'data': e,
                'color':e.color
            }
        }

    }

    // 获取选中的节点数据
    getSelectedNodes = () => {
        let selectedRows = {}
        _.forEach(this.selectedRows, (item,key) => {
            selectedRows[key] = item.data.data
        })
        return selectedRows
    }

    render() {
        //console.log(this.state.events,'---this.state.events');
        return (
            <Graph
                title={this.state.modalTitle}
                dblclick={this.handleDblclick}
                click={this.handleClick}
                ref={(refs) => {
                    this.intelModelGraph = refs
                }}
                {...this.props}
            />
        )
    }
}
