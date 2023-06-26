import NodePosition from '@/app/graph/enum/NodePosition'
import G6Util from '@/app/graph/G6Util'
import ErDisplayLevel from '@/app/metadataCenter/enum/ErDisplayLevel'
import { IErField, IErTreeNode } from '@/app/metadataCenter/interface/IErTable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import PageUtil from '@/utils/PageUtil'
import { Point } from '@antv/coord'
import G6, { IGroup, ModelConfig, TreeGraph } from '@antv/g6'
import { createNodeFromReact, Rect, Text } from '@antv/g6-react-node'
import { CircleStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Circle'
import { RectStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Rect'
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text'
import Lodash from 'lodash'
import React, { Component } from 'react'

const maxDisplayFieldCount = 10

interface IErGraphState {}
interface IErGraphProps extends IComponentProps {
    data: IErTreeNode
    displayLevel: ErDisplayLevel
}

const NODE_CONFIG = {
    field: {
        height: 32,
    },
    border: {
        width: 400,
        padding: 2,
    },

    header: {
        height: 58,
        marginBottom: 4,
        padding: 12,
    },
}

/**
 * ErGraph
 */
class ErGraph extends Component<IErGraphProps, IErGraphState> {
    public graph!: TreeGraph

    protected resizeObserver?: ResizeObserver
    private debounceUpdateGraphSize: Function

    constructor(props: IErGraphProps) {
        super(props)
        this.state = {}
        this.debounceUpdateGraphSize = Lodash.debounce(this.updateGraphSize, 1000)
    }

    getNodeStyle(): RectStyle {
        return {}
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = undefined
        }
    }

    private listenerResize() {
        const graphContainer = this.graphContainer
        if (graphContainer) {
            this.resizeObserver = new ResizeObserver(this.resizeHandler)
            this.resizeObserver.observe(graphContainer)
        }
    }

    private get graphContainer() {
        return document.getElementById('erContainer')
    }

    protected resizeHandler = () => {
        this.debounceUpdateGraphSize()
    }

    private updateGraphSize() {
        const graph = this.graph
        if (!graph || graph.get('destroyed')) {
            return
        }
        const container = this.graphContainer
        if (!container || !container.scrollWidth || !container.scrollHeight) {
            return
        }

        graph.changeSize(container.clientWidth, Math.floor(container.clientHeight))
    }

    private register() {
        G6.registerNode('reactClass', {
            ...createNodeFromReact(this.renderNode),
            getAnchorPoints: () => {
                return [
                    [0, 0.5], // 左侧中间
                    [1, 0.5], // 右侧中间
                ]
            },
        })

        G6.registerEdge(
            'line-arrow',
            {
                getControlPoints: (cfg: any) => {
                    const { startPoint, endPoint } = cfg
                    if (Math.abs(endPoint.y - startPoint.y) < 10) {
                        return undefined
                    }
                    const centerX = startPoint.x + (endPoint.x - startPoint.x) / 2
                    return [
                        { x: centerX, y: startPoint.y },
                        { x: centerX, y: endPoint.y },
                    ]
                },
                draw: (cfg: ModelConfig | any, group: IGroup | any) => {
                    const { startPoint, endPoint } = cfg

                    const keyShape = group.addShape('path', {
                        attrs: {
                            path: [
                                ['M', startPoint.x, startPoint.y],
                                ['L', endPoint.x, endPoint.y],
                            ],
                            stroke: 'rgba(163, 177, 191, 1)',
                            radius: 20,
                        },
                        name: 'path-shape',
                    })
                    return keyShape
                },
                afterDraw: (cfg: ModelConfig | any, group: IGroup | any) => {
                    const shape = group.get('children')[0]

                    const endNode: IErTreeNode = cfg.targetNode._cfg.model

                    let leftPoint: Point = shape.getPoint(0)
                    let rightPoint: Point = shape.getPoint(1)
                    if (endNode.position === NodePosition.LEFT) {
                        leftPoint = shape.getPoint(1)
                        rightPoint = shape.getPoint(0)
                    }
                    const centerPoint: Point = {
                        x: leftPoint.x + (rightPoint.x - leftPoint.x) / 2,
                        y: leftPoint.y + (rightPoint.y - leftPoint.y) / 2,
                    }

                    const leftMul = false
                    const rightMul = true

                    const r = 4
                    const arrowWidth = 5
                    const lineColor = '#A3B1BF'
                    const lineWidth = 1
                    const circleAtt: CircleStyle = {
                        r: r,
                        stroke: '#4081FF',
                        fill: 'white',
                    }

                    // 左侧箭头1
                    group.addShape('path', {
                        attrs: {
                            stroke: lineColor,
                            lineWidth,
                            path: [
                                ['M', leftPoint.x + arrowWidth, leftPoint.y - arrowWidth],
                                ['L', leftPoint.x + arrowWidth, leftPoint.y + arrowWidth],
                            ],
                        },
                    })
                    if (leftMul) {
                        // 左侧箭头N
                        group.addShape('path', {
                            attrs: {
                                stroke: lineColor,
                                lineWidth,
                                path: [
                                    ['M', leftPoint.x, leftPoint.y - arrowWidth + 2],
                                    ['L', leftPoint.x + arrowWidth, leftPoint.y],
                                    ['L', leftPoint.x, leftPoint.y + arrowWidth - 2],
                                ],
                            },
                            name: 'm',
                        })
                    }

                    // 右侧箭头1
                    group.addShape('path', {
                        attrs: {
                            stroke: lineColor,
                            lineWidth,
                            path: [
                                ['M', rightPoint.x - arrowWidth, rightPoint.y - 6],
                                ['L', rightPoint.x - arrowWidth, rightPoint.y + 6],
                            ],
                        },
                    })
                    if (rightMul) {
                        // 右侧箭头N
                        group.addShape('path', {
                            attrs: {
                                stroke: lineColor,
                                lineWidth,
                                path: [
                                    ['M', rightPoint.x, rightPoint.y - arrowWidth + 2],
                                    ['L', rightPoint.x - arrowWidth, rightPoint.y],
                                    ['L', rightPoint.x, rightPoint.y + arrowWidth - 2],
                                ],
                            },
                            name: 'm',
                        })
                    }

                    // 左侧圆球
                    group.addShape('circle', {
                        attrs: {
                            ...circleAtt,
                            x: leftPoint.x + r + arrowWidth + lineWidth,
                            y: leftPoint.y,
                        },
                    })

                    // 右侧圆球
                    group.addShape('circle', {
                        attrs: {
                            ...circleAtt,
                            x: rightPoint.x - r - arrowWidth - lineWidth,
                            y: rightPoint.y,
                        },
                    })

                    // 中间文字
                    group.addShape('text', {
                        attrs: {
                            text: `${leftMul ? 'N' : '1'}:${rightMul ? 'N' : '1'}`,
                            x: centerPoint.x,
                            y: centerPoint.y,
                            textAlign: 'center',
                            textBaseline: 'middle',
                            fill: '#2D3033',
                            fontSize: 14,
                        },
                    })
                },
            },
            'polyline'
        )
    }

    private getBgColor(node: IErTreeNode) {
        switch (node.position) {
            case NodePosition.CENTER:
                return '#2AC0E4'
            default:
                return `#4081FF`
        }
    }

    private getBorderStyle(node: IErTreeNode): RectStyle {
        const { width, padding } = NODE_CONFIG.border
        return {
            stroke: this.getBgColor(node),
            strokeOpacity: 0.2,
            padding,
            width,
        }
    }

    private getBodyStyle(node: IErTreeNode): RectStyle {
        return {
            fill: 'white',
        }
    }

    private getHeaderStyle(node: IErTreeNode): RectStyle {
        const { height, marginBottom, padding } = NODE_CONFIG.header
        const { displayLevel } = this.props
        const showField = displayLevel !== ErDisplayLevel.TABLE
        return {
            fill: this.getBgColor(node),
            height,
            margin: [0, 0, showField ? marginBottom : 0, 0],
            padding,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
        }
    }

    private getHeaderTextStyle(): TextStyle {
        return {
            fill: 'white',
            fontSize: 14,
            lineHeight: 1.5,
        }
    }

    private getFieldStyle(): RectStyle {
        return {
            height: NODE_CONFIG.field.height,
            padding: [0, 12, 0, 12],
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }
    }

    private getFieldTextStyle(): TextStyle {
        return {
            fill: '#2D3033',
            width: 100,
            fontSize: 14,
            margin: [0, 16, 0, 0],
        }
    }

    private getIconTextStyle(): TextStyle {
        return { fontSize: 14, fontFamily: 'iconfont', width: 14 }
    }

    private getDisplayFieldList(node: IErTreeNode) {
        const { table } = node
        const { fieldInfoList } = table
        let result = []
        const { displayLevel } = this.props
        switch (displayLevel) {
            case ErDisplayLevel.ALL:
                result = fieldInfoList.concat()
                break
            case ErDisplayLevel.IMPORTANT:
                result = fieldInfoList.filter((item) => this.isFkOrPk(item.pkType) || this.isFkOrPk(item.fkType) || item.partitionFlag)
                break
            default:
                return []
        }

        result.sort((a, b) => {
            const getSortIndex = (field: IErField): number => {
                // 顺序为PK、FK、分区字段、其它
                if (this.isFkOrPk(field.pkType)) {
                    return 1
                } else if (this.isFkOrPk(field.fkType)) {
                    return 2
                } else if (field.partitionFlag) {
                    return 3
                }
                return 4
            }

            return getSortIndex(a) - getSortIndex(b)
        })
        return result
    }

    private isFkOrPk(value?: number) {
        return value && [2, 3].includes(value)
    }

    protected renderNode = (param: { cfg: ModelConfig }) => {
        const node: IErTreeNode = param.cfg as any
        const fontSize = 14

        const { table, titleHover } = node
        const fieldList = this.getDisplayFieldList(node)
        let { tableEnglishName, tableDbEnglishName, tableChineseName } = table

        const borderStyle = this.getBorderStyle(node)
        const headerTextStyle = this.getHeaderTextStyle()

        const fieldStyle = this.getFieldStyle()
        const fieldTextStyle = this.getFieldTextStyle()
        const iconTextStyle = { ...this.getIconTextStyle(), margin: [0, 4, 0, 0] }

        const showScollBar = fieldList.length > maxDisplayFieldCount

        // 字段最多显示5个
        const startIndex = Number(node.startIndex) || 0
        const displayFieldList = showScollBar ? fieldList.slice(startIndex, startIndex + maxDisplayFieldCount) : fieldList

        const headerTextWidth = NODE_CONFIG.border.width - NODE_CONFIG.border.padding * 2 - 50
        let tableDisplayName = `${tableEnglishName} ${tableChineseName ? `[${tableChineseName}]` : ''}`
        tableDisplayName = G6Util.fittingString(tableDisplayName, headerTextWidth, fontSize)

        tableDbEnglishName = G6Util.fittingString(tableDbEnglishName, headerTextWidth, fontSize)

        const isCenterNode = node.position === NodePosition.CENTER

        return (
            // 外框
            <Rect style={borderStyle}>
                {/* 内框 */}
                <Rect style={this.getBodyStyle(node)}>
                    {/* 头部 */}
                    <Rect style={this.getHeaderStyle(node)}>
                        {/* 表名 */}
                        <Rect style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...iconTextStyle, fill: 'white', lineHeight: 1.5 }}>{unescape(`%ue6a7`)}</Text>
                            <Text
                                style={{ ...headerTextStyle, cursor: isCenterNode ? 'auto' : 'pointer', fontWeight: titleHover ? 'bold' : '' }}
                                onClick={() => {
                                    if (!isCenterNode) {
                                        PageUtil.addTab('sysDetail', { id: table.tableId }, true)
                                    }
                                }}
                                onMouseOver={() => {
                                    if (!isCenterNode) {
                                        this.graph.updateItem(node.id, { titleHover: true })
                                    }
                                }}
                                onMouseOut={() => {
                                    if (!isCenterNode) {
                                        this.graph.updateItem(node.id, { titleHover: undefined })
                                    }
                                }}
                            >
                                {tableDisplayName}
                            </Text>
                        </Rect>
                        {/* 数据库名 */}
                        <Rect style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...iconTextStyle, fill: 'white', lineHeight: 1.5 }}>{unescape(`%ue6c4`)}</Text>
                            <Text style={{ ...headerTextStyle, fontFamily: 'iconFont' }}>{tableDbEnglishName}</Text>
                        </Rect>
                    </Rect>
                    {/* 字段列表 */}
                    {displayFieldList && displayFieldList.length
                        ? G6Util.renderScroller({
                              graph: this.graph,
                              node,
                              dataSource: fieldList,
                              itemHeight: NODE_CONFIG.field.height,
                              itemRender: (item) => {
                                  if (!item) {
                                      return <Rect style={{ ...fieldStyle }}></Rect>
                                  }
                                  const { pkType, fkType, partitionFlag } = item
                                  const isPk = this.isFkOrPk(pkType)
                                  const isFk = this.isFkOrPk(fkType)
                                  let { fieldName = '', fieldNameDesc = '', fieldType = '', fieldPrecision } = item
                                  const fieldLableWidth = 100

                                  const displayIconCount = [isPk, isFk, partitionFlag].filter((item) => item).length
                                  fieldName = G6Util.fittingString(fieldName, fieldLableWidth - displayIconCount * 18, fontSize)
                                  fieldNameDesc = G6Util.fittingString(fieldNameDesc, fieldLableWidth, fontSize)
                                  fieldType = G6Util.fittingString(`${fieldType} ${fieldPrecision}`, 120, fontSize)
                                  return (
                                      <Rect style={{ ...fieldStyle }}>
                                          <Rect style={{ width: 120, flexDirection: 'row', alignItems: 'center' }}>
                                              {/* 名称 */}
                                              {isFk && <Text style={{ ...iconTextStyle, fill: '#28A895' }}>{unescape(`%ue710`)}</Text>}
                                              {isPk && <Text style={{ ...iconTextStyle, fill: '#1393DC' }}>{unescape(`%ue711`)}</Text>}
                                              {partitionFlag && <Text style={{ ...iconTextStyle, fill: '#FF9B43' }}>{unescape(`%ue70f`)}</Text>}
                                              <Text style={{ ...fieldTextStyle }}>{fieldName}</Text>
                                          </Rect>
                                          {/* 中文名 */}
                                          <Text style={{ ...fieldTextStyle }}>{fieldNameDesc}</Text>
                                          {/* 类型 */}
                                          <Text style={{ width: 110, fill: '#9EA3A8', fontSize }}>{fieldType}</Text>
                                      </Rect>
                                  )
                              },
                          })
                        : null}
                </Rect>
            </Rect>
        )
    }

    private initChart() {
        const { data } = this.props

        this.graph = new G6.TreeGraph({
            container: this.graphContainer as HTMLElement,
            layout: {
                type: 'mindmap',
                direction: 'H',
                getWidth: () => {
                    return NODE_CONFIG.border.width
                },
                getHeight: (node: IErTreeNode) => {
                    const fieldList = this.getDisplayFieldList(node)
                    const { header, field } = NODE_CONFIG
                    return header.height + header.marginBottom + (field.height + 1) * Math.min(fieldList.length, maxDisplayFieldCount)
                },
                getHGap: () => 120,
                getVGap: () => 8,
                getSide: (node: any) => {
                    const { data } = node
                    return data.position
                },
            },
            defaultNode: {
                type: 'reactClass',
            },
            defaultEdge: {
                type: 'line-arrow',
            },
            modes: {
                default: [
                    {
                        type: 'drag-canvas',
                        allowDragOnItem: true,
                    },
                ],
            },
        })

        this.graph.data(data)
        this.graph.render()
        this.addEventListener()
    }

    private addEventListener() {
        this.graph.on('click', (e) => {
            const onClick = e.target.cfg.onClick
            if (onClick) {
                onClick()
            }
        })
        this.graph.on('mouseover', (e) => {
            const onMouseOver = e.target.cfg.onMouseOver
            if (onMouseOver) {
                onMouseOver()
            }
        })
        this.graph.on('mouseout', (e) => {
            const onMouseOut = e.target.cfg.onMouseOut
            if (onMouseOut) {
                onMouseOut()
            }
        })
    }

    componentDidMount() {
        this.register()
        this.initChart()
        const { data } = this.props
        G6Util.focusItem(this.graph, data.id)
        this.listenerResize()
    }

    componentDidUpdate(preProps: IErGraphProps) {
        const nameList = ['displayLevel']
        const { data } = this.props
        for (let item of nameList) {
            if (preProps[item] !== this.props[item]) {
                this.graph.getNodes().map((item) => {
                    this.graph.updateItem(item, { startIndex: 0 })
                })
                this.graph.changeData(data)
                G6Util.focusItem(this.graph, data.id)
            }
        }
    }

    render() {
        return <div id='erContainer' style={{ width: '100%', height: '100%', overflow: 'hidden' }}></div>
    }
}

export default ErGraph
