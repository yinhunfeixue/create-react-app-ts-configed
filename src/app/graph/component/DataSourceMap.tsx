import G6TreeRender from '@/app/graph/G6TreeRender'
import G6Util from '@/app/graph/G6Util'
import IComponentProps from '@/base/interfaces/IComponentProps'
import G6, { ArrowConfig, EdgeConfig, Graph, INode, Item, ModelConfig, NodeConfig } from '@antv/g6'
import { Circle, createNodeFromReact, Rect, Text } from '@antv/g6-react-node'
import { CommonShapeProps } from '@antv/g6-react-node/dist/ReactNode/Shape/common'
import React, { Component } from 'react'

interface IDataSourceMapState {}
interface IDataSourceMapProps extends IComponentProps {
    dataSource: IDataSourceMapData
    onNodeClick: (item: NodeConfig) => void
    onZoomChange?: (value: number) => void
}

export interface IDataSourceMapData {
    nodes: (NodeConfig & INodeData)[]
    edges: EdgeConfig[]
}

interface INodeData {
    count?: number
}

type NodeState = 'normal' | 'hover'

/**
 * DataSourceMap
 */
class DataSourceMap extends Component<IDataSourceMapProps, IDataSourceMapState> {
    private _graph!: Graph

    componentDidMount() {
        this.formatDataSource()
        G6.registerNode('reactCircle', {
            ...createNodeFromReact(this.renderNode),
        })
        this.renderChart()

        window.addEventListener('resize', this.resizeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    private resizeHandler = () => {
        const graph = this.graph
        if (!graph || graph.get('destroyed')) {
            return
        }
        const container = document.getElementById('container')
        if (!container || !container.scrollWidth || !container.scrollHeight) {
            return
        }
        graph.changeSize(container.offsetWidth, container.offsetHeight)
    }

    private formatDataSource() {
        const { dataSource } = this.props

        const { edges } = dataSource
        edges.forEach((item) => {
            // 不同结点设置不同的箭头偏移量
            item.style = {
                ...this.getEdgeStyle('normal'),
                endArrow: this.getArrow(item, 'normal'),
            }
            item.stateStyles = {
                hover: {
                    ...this.getEdgeStyle('hover'),
                    endArrow: this.getArrow(item, 'hover'),
                },
            }
        })
    }

    private getArrow(edge: EdgeConfig, state: NodeState): ArrowConfig {
        const { dataSource } = this.props
        const { nodes } = dataSource
        const { target } = edge
        const arrow = G6.Arrow.triangle(10, 10, 25)
        const result = {
            path: arrow,
            ...this.getEdgeStyle(state),
        }
        if (!target) {
            return result
        }

        const node = nodes.find((item) => item.id === target)
        if (!node) {
            return result
        }

        // 获取target结点，获取结点的r
        const r = this.getR(node)
        result.path = G6.Arrow.triangle(10, 10, r / 2)
        return result
    }

    private renderNode = (param: { cfg: ModelConfig }) => {
        const { label, state, single, count, selected }: { label: string; state: string; single: string; count: number; selected: boolean } = param.cfg as any
        const bgStyle: { [key: string]: { [key: string]: CommonShapeProps } } = {
            normal: {
                common: {
                    fill: 'l(45) 0:#F7FBFF 0.43:#E6F3FF 1:#B3DAFF',
                    shadowColor: '',
                    shadowBlur: 0,
                    shadowOffsetY: 0,
                },
                hover: {
                    fill: 'l(45) 0:#5388FF 1:#415AFF',
                    shadowColor: `rgba(76, 129, 236, 0.28)`,
                    shadowBlur: 26,
                    shadowOffsetY: 19,
                },
            },
            single: {
                common: {
                    fill: 'l(45) 0:#FFFFFF 0.43:#F7F8FC 1:#C2C6F2',
                    shadowColor: '',
                    shadowBlur: 0,
                    shadowOffsetY: 0,
                },
                hover: {
                    fill: 'l(131) 0:#AFC1FF 1:#4D39FF',
                    shadowColor: `rgba(76, 129, 236, 0.28)`,
                    shadowBlur: 26,
                    shadowOffsetY: 19,
                },
            },
        }

        const bg2Style = {
            normal: {
                hover: {
                    fill: 'l(45) 0:rgba(67, 199, 254, 0) 0.39:rgba(45, 126, 245, 0.37) 0.9:rgba(22, 96, 245, 0.9) 1:164DF3',
                },
            },
            single: {
                hover: {
                    fill: 'l(137) 0:rgba(69, 134, 255, 0) 0.39:rgba(38, 70, 255, 0.5) 0.86:#6B39FF 1:#5F30EB',
                    shadowColor: `rgba(76, 129, 236, 0.28)`,
                    shadowBlur: 26,
                    shadowOffsetY: 19,
                },
            },
        }

        const bg3Style = {
            normal: {
                common: {
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    cursor: 'pointer',
                },
                hover: {
                    fill: 'l(45) 0:#4DC9FF 0.22:rgba(86, 196, 255, 0.77) 0.55:rgba(25, 166, 251, 0.08) 1:rgba(35, 80, 249, 0)',
                },
            },
            single: {
                common: {
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    cursor: 'pointer',
                },
                hover: {
                    fill: 'l(136) 0:#86AEFF 0.22:rgba(56, 154, 255, 0.77) 0.55:rgba(0, 76, 255, 0.08) 1:rgba(32, 98, 255, 0)',
                },
            },
        }

        const textStyle: { [key: string]: CommonShapeProps } = {
            hover: {
                fill: 'rgba(255, 255, 255, 1)',
            },
            normal: {
                fill: 'rgba(45, 48, 51, 1)',
            },
        }

        const getStyle = (style: any, nodeType: string, nodeState: string, selected: boolean) => {
            const firstLevel = style[nodeType] || style
            if (selected) {
                return firstLevel['hover']
            }
            return firstLevel[nodeState]
        }

        let r = this.getR(param.cfg as INodeData)

        const nodeType = single ? 'single' : 'normal'
        const nodeState = state ? state : 'common'
        const useBgStyle = getStyle(bgStyle, nodeType, nodeState, selected) //bgStyle[nodeType][nodeState]
        const useBg2Style = getStyle(bg2Style, nodeType, nodeState, selected) //bg2Style[nodeType][nodeState]
        const useBg3Style = { ...bg3Style[nodeType].common, ...getStyle(bg3Style, nodeType, nodeState, selected) } //...bg3Style[nodeType][nodeState] }

        const useTextStyle = getStyle(textStyle, '', state, selected) || textStyle.normal //[state as string] || textStyle.normal

        const nameLabelMaxWidth = r * 6
        const nameLabelFontSize = 14
        const useName = G6Util.fittingString(label, nameLabelMaxWidth, nameLabelFontSize)
        const nameTooltip = useName === label ? undefined : label
        const nameWidth = G6Util.measureText(useName, nameLabelFontSize)

        const isHover = state === 'hover' || selected
        return (
            <Rect style={{ alignItems: 'center' }}>
                <Rect style={{ height: 22, width: r * 2 }} />
                <Circle
                    draggable
                    animation={{
                        delay: 0,
                        duration: 2000,
                        easing: 'easeLinear',
                    }}
                    style={{
                        ...useBgStyle,
                        r,
                    }}
                >
                    {/* 套两个circle只是因为样式需要: 三层渐变色叠加，和功能无关 */}
                    <Circle
                        style={{
                            r,
                            ...useBg2Style,
                            opacity: isHover ? 1 : 0,
                        }}
                    >
                        <Circle
                            style={{
                                r,
                                ...useBg3Style,
                                opacity: isHover ? 1 : 0,
                                padding: [10, 10, 10, 10],
                            }}
                        >
                            <Text style={{ ...useTextStyle, fontFamily: 'iconfont', fontSize: 16, cursor: 'pointer', margin: [0, 0, 0, 16] }}>
                                {unescape('%ue6c5')} {count ? count.toString() : '0'}
                            </Text>
                        </Circle>
                    </Circle>
                </Circle>
                <Rect style={{ height: 22, justifyContent: 'flex-end' }}>
                    <Text tooltip={nameTooltip} style={{ fill: 'rgba(45, 48, 51, 1)', width: nameWidth, flexDirection: 'row', alignItems: 'center', fontSize: nameLabelFontSize }}>
                        {useName}
                    </Text>
                </Rect>
            </Rect>
        )
    }

    private getR(node: INodeData) {
        const { count } = node
        let r = 50
        if (count) {
            if (count > 10000) {
                r = 100
            } else if (count > 1000) {
                r = 70
            }
        }
        return r
    }

    private getEdgeStyle(state: NodeState) {
        const edgeStyle = {
            normal: {
                stroke: 'rgba(163, 177, 191, 0.3)',
                fill: 'rgba(163, 177, 191, 0.3)',
            },
            hover: {
                stroke: 'rgba(163, 177, 191, 1)',
                fill: 'rgba(163, 177, 191, 1)',
            },
        }

        return edgeStyle[state] || edgeStyle.normal
    }

    private renderChart() {
        const { dataSource, onZoomChange } = this.props
        const tooltip = G6TreeRender.createTooltip()
        this._graph = new G6.Graph({
            container: 'container',
            linkCenter: true,
            animate: false,
            layout: {
                type: 'force',
                linkDistance: 200,
                preventOverlap: true,
                nodeSpacing: 100,
                nodeSize: 100,
                nodeStrength: 20,
            },
            defaultNode: {
                type: 'reactCircle',
            },
            defaultEdge: {
                type: 'line',
                style: {
                    ...this.getEdgeStyle('normal'),
                    endArrow: {
                        path: G6.Arrow.triangle(10, 10, 25),
                        ...this.getEdgeStyle('normal'),
                    },
                },
            },
            edgeStateStyles: {
                hover: {
                    ...this.getEdgeStyle('hover'),
                    endArrow: {
                        path: G6.Arrow.triangle(10, 10, 25),
                        ...this.getEdgeStyle('hover'),
                    },
                },
            },
            modes: {
                default: [
                    {
                        type: 'drag-canvas',
                        allowDragOnItem: true,
                    },
                    'zoom-canvas',
                ],
            },
            plugins: [tooltip],
        })

        const graph = this.graph

        graph.data(dataSource)
        graph.render()

        // 设置单结点状态
        graph.getNodes().forEach((item) => {
            if (!item.getEdges().length) {
                graph.updateItem(item, { single: true })
            }
        })

        graph.on('node:mouseenter', (evt) => {
            const { item } = evt
            if (item) {
                this.hoverItem(item, true)
            }
        })

        graph.on('node:click', (evt) => {
            const { item } = evt
            const { onNodeClick } = this.props
            if (item && item._cfg && item._cfg.model) {
                this.selectItem(item.getID())
                onNodeClick(item._cfg.model as NodeConfig)
            }
        })

        graph.on('wheelzoom', () => {
            const zoom = graph.getZoom()
            if (onZoomChange) {
                onZoomChange(zoom)
            }
        })

        graph.on('node:mouseleave', (evt) => {
            const { item } = evt
            if (item) {
                this.hoverItem(item, false)
            }
        })
    }

    public selectItem(id: string) {
        const nodeList = this.graph.getNodes()
        // 清除所有结点的选中状态
        nodeList.forEach((item) => {
            this.graph.updateItem(item, { selected: false })
        })
        const item = nodeList.find((item) => (item._cfg ? item._cfg.id === id : false))
        if (item) {
            G6Util.focusItem(this.graph, id)
            this.graph.updateItem(item, { selected: true })
            this.hoverItem(item, true)
        }
    }

    public rerenderChart() {
        this.graph.render()
    }

    public visibleSingeNode(vibible: boolean) {
        this.graph.getNodes().forEach((item) => {
            if (item.getEdges().length === 0) {
                if (vibible) {
                    this.graph.showItem(item.getID())
                } else {
                    this.graph.hideItem(item.getID())
                }
            }
        })
    }

    private hoverItem(item: Item, hover: boolean) {
        const node = item as INode
        const graph = this.graph
        if (node) {
            const state = {
                state: hover ? 'hover' : '',
            }
            // 清理所有结点状态
            graph.getNodes().forEach((item) => {
                graph.updateItem(item, { state: '' })
            })
            graph.getEdges().forEach((item) => {
                graph.setItemState(item, 'hover', false)
            })
            graph.updateItem(node, { ...state })
            node.getEdges().forEach((item) => {
                if (item.getTarget() !== node) {
                    graph.setItemState(item, 'hover', hover)
                }
                graph.updateItem(item.getTarget(), { ...state })
            })
        }
    }

    public get graph() {
        return this._graph
    }

    render() {
        const { style, className } = this.props
        return <div id='container' className={className} style={style} />
    }
}

export default DataSourceMap
