import ErDisplayType from '@/app/dataArchitect/enum/ErDisplayType'
import ErLinkType from '@/app/dataArchitect/enum/ErLinkType'
import IErNode, { IModelNode, ITableNode, NodeType } from '@/app/dataArchitect/interface/IErNode'
import NodePosition from '@/app/graph/enum/NodePosition'
import G6Util from '@/app/graph/G6Util'
import ErDisplayLevel from '@/app/metadataCenter/enum/ErDisplayLevel'
import { IErField } from '@/app/metadataCenter/interface/IErTable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import PageUtil from '@/utils/PageUtil'
import { Point } from '@antv/g2_4/lib/interface'
import G6, { IGroup, ModelConfig, TreeGraph } from '@antv/g6'
import { createNodeFromReact, Rect, Text } from '@antv/g6-react-node'
import { CircleStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Circle'
import { RectStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Rect'
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text'
import Lodash from 'lodash'
import React, { Component } from 'react'
import styles from './ErGraph.module.less'

const maxDisplayFieldCount = 8

interface IErGraphState {}
interface IErGraphProps extends IComponentProps {
    data: IErNode<ITableNode | IModelNode>
    modelDisplayType?: ErDisplayType
    fieldDisplayType?: ErDisplayLevel
    style?: React.CSSProperties
}

const NODE_CONFIG = {
    field: {
        height: 34,
    },
    border: {
        width: 380,
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
                    // 绘制连接线
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

                    const endNode: IErNode<IModelNode | ITableNode> = cfg.targetNode._cfg.model
                    const { erLinkType, commonTableName } = endNode.data as IModelNode

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
                    const rightMul = false

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

                    /*********** 开始绘制文字 ***************/
                    const labelList: { color: string; text: string }[] = []

                    // 如果有erLinkType
                    if (erLinkType) {
                        labelList.push({
                            text: ErLinkType.toString(erLinkType),
                            color: '#2D3033',
                        })
                    }

                    // 如果有commonTableName，则绘制commonTableName
                    if (commonTableName) {
                        labelList.push({
                            text: commonTableName as string,
                            color: 'rgba(91, 127, 163, 1)',
                        })
                    }

                    // 按一行文字20px高度，计算文字位置
                    const lineHeight = 24
                    const startY = centerPoint.y + lineHeight - (labelList.length * lineHeight) / 2
                    for (let i = 0; i < labelList.length; i++) {
                        const item = labelList[i]
                        group.addShape('text', {
                            attrs: {
                                text: item.text,
                                x: centerPoint.x,
                                y: startY + i * lineHeight,
                                textAlign: 'center',
                                fill: item.color,
                                fontSize: 14,
                            },
                        })
                    }
                },
            },
            'polyline'
        )
    }

    protected renderNode = (param: { cfg: ModelConfig }) => {
        const node = param.cfg as any
        const { nodeType } = node
        switch (nodeType) {
            case NodeType.model:
                return this.renderModel(node as IErNode<IModelNode>)
            case NodeType.table:
                return this.renderTable(node as IErNode<ITableNode>)
            default:
                return (
                    <Rect style={{}}>
                        <Text style={{ fill: '#999999' }}>empty</Text>
                    </Rect>
                )
        }
    }

    private renderTable(node: IErNode<ITableNode>) {
        const { data, titleHover } = node
        const { tableZHName, tableEnglishName, dbName, tableDbEnglishName, fieldInfoList = [] } = data
        const displayFieldList = this.getDisplayFieldList(fieldInfoList)

        return (
            // 外边框
            <Rect style={{ ...this.getWrapStyle(), stroke: 'rgba(64, 129, 255, 1)' }}>
                {/* 内边框 */}
                <Rect style={this.getBodyStyle()}>
                    {/* 头部 */}
                    <Rect style={{ ...this.getHeaderStyle(), fill: 'rgba(64, 129, 255, 1)' }}>
                        {[
                            {
                                icon: unescape(`%ueb94`),
                                label: `${tableEnglishName}${tableZHName ? `[${tableZHName}]` : ''}`,
                                onClick: () => PageUtil.addTab('sysDetail', { id: data.tableId }, true),
                            },
                            {
                                icon: unescape(`%ue6c4`),
                                label: tableDbEnglishName || dbName || '-',
                            },
                        ].map((item) => {
                            return (
                                <Rect style={this.getHGroupStyle({ padding: [4, 0, 4, 0] })}>
                                    <Text style={this.getIconTextStyle({ margin: [0, 4, 0, 0] })}>{item.icon}</Text>
                                    <Text
                                        style={{ ...this.getHeaderTextStyle(), fontWeight: titleHover && item.onClick ? 'bold' : '', cursor: item.onClick ? 'pointer' : 'unset' }}
                                        onClick={item.onClick}
                                        onMouseOver={() => {
                                            this.graph.updateItem(node.id, { titleHover: true })
                                        }}
                                        onMouseOut={() => {
                                            this.graph.updateItem(node.id, { titleHover: undefined })
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </Rect>
                            )
                        })}
                    </Rect>
                    {displayFieldList && displayFieldList.length && (
                        <Rect style={this.getContentStyle()}>
                            {G6Util.renderScroller<typeof fieldInfoList[0]>({
                                graph: this.graph,
                                node,
                                dataSource: displayFieldList,
                                itemHeight: NODE_CONFIG.field.height,
                                maxDisplayCount: maxDisplayFieldCount,
                                itemRender: (item, scroller: boolean) => {
                                    const { fieldName, fieldNameDesc, fieldType, fkType, pkType } = item
                                    const isFk = this.isFkOrPk(fkType)
                                    const isPK = this.isFkOrPk(pkType)
                                    const nameWidth = 120
                                    const itemHeight = NODE_CONFIG.field.height
                                    let tableNameWidth = 240
                                    if (scroller) {
                                        tableNameWidth = tableNameWidth - 20
                                    }

                                    const fitFieldName = G6Util.fittingString(fieldName, nameWidth, 14)
                                    const fitFieldNameDesc = G6Util.fittingString(fieldNameDesc, nameWidth, 14)
                                    const fitFieldType = G6Util.fittingString(fieldType, tableNameWidth, 14)

                                    const textStyle: TextStyle = {
                                        ...this.getEntityTextStyle(),
                                        width: nameWidth,
                                    }
                                    return (
                                        <Rect style={{ height: itemHeight }}>
                                            <Rect style={{ ...this.getEntityItemStyle(), height: itemHeight - 1 }}>
                                                <Rect style={{ ...this.getHGroupStyle(), width: nameWidth + 20 }}>
                                                    {[
                                                        {
                                                            icon: unescape('%ue710'),
                                                            enable: isFk,
                                                            color: '#28a895',
                                                        },
                                                        {
                                                            icon: unescape('%ue711'),
                                                            enable: isPK,
                                                            color: '#1393dc',
                                                        },
                                                    ]
                                                        .filter((item) => item.enable)
                                                        .map((item) => {
                                                            return <Text style={this.getIconTextStyle({ margin: [0, 4, 0, 0], fill: item.color })}>{item.icon}</Text>
                                                        })}
                                                    <Text style={{ ...textStyle }}>{fitFieldName || '-'}</Text>
                                                </Rect>
                                                <Text style={{ ...textStyle }}>{fitFieldNameDesc || '-'}</Text>
                                                <Text style={{ ...this.getEntityTextStyle(), fill: `rgba(158, 163, 168, 1)` }}>{fitFieldType || '-'}</Text>
                                            </Rect>
                                            {/* 下边框 */}
                                            <Rect style={{ fill: 'rgba(163, 177, 191, 0.3)', height: 1 }} />
                                        </Rect>
                                    )
                                },
                            })}
                        </Rect>
                    )}
                </Rect>
            </Rect>
        )
    }

    private renderModel(node: IErNode<IModelNode>) {
        const { data } = node
        const { modelChineseName, modelEnglishName, mainEntityName, modelTableInfoList = [] } = data
        const { modelDisplayType } = this.props
        return (
            // 外边框
            <Rect style={this.getWrapStyle()}>
                {/* 内边框 */}
                <Rect style={this.getBodyStyle()}>
                    {/* 头部 */}
                    <Rect style={this.getHeaderStyle()}>
                        {[
                            {
                                icon: unescape(`%ue738`),
                                label: modelChineseName || modelEnglishName || '',
                            },
                            {
                                icon: unescape(`%ue73c`),
                                label: `主实体：${mainEntityName}`,
                            },
                        ].map((item) => {
                            return (
                                <Rect style={this.getHGroupStyle({ padding: [4, 0, 4, 0] })}>
                                    <Text style={this.getIconTextStyle({ margin: [0, 4, 0, 0] })}>{item.icon}</Text>
                                    <Text style={this.getHeaderTextStyle()}>{item.label}</Text>
                                </Rect>
                            )
                        })}
                    </Rect>
                    {modelDisplayType !== ErDisplayType.MAIN_ENTITY ? (
                        <Rect style={this.getContentStyle()}>
                            {G6Util.renderScroller<typeof modelTableInfoList[0]>({
                                graph: this.graph,
                                node,
                                dataSource: modelTableInfoList,
                                maxDisplayCount: maxDisplayFieldCount,
                                itemHeight: NODE_CONFIG.field.height,
                                itemRender: (item, scroller: boolean) => {
                                    const { entityName, tableChineseName, tableEnglishName } = item
                                    const entityNameWidth = 120
                                    const itemHeight = NODE_CONFIG.field.height
                                    let tableNameWidth = 240
                                    if (scroller) {
                                        tableNameWidth = tableNameWidth - 20
                                    }

                                    const fitEntityName = G6Util.fittingString(entityName, entityNameWidth, 14)
                                    const fitTableName = G6Util.fittingString(`${tableEnglishName}${tableChineseName ? `[${item.tableChineseName}]` : ''}`, tableNameWidth, 14)
                                    return (
                                        <Rect style={{ height: itemHeight }}>
                                            <Rect style={{ ...this.getEntityItemStyle(), height: itemHeight - 1 }}>
                                                <Rect style={{ width: 100, margin: [0, 20, 0, 0] }}>
                                                    <Text style={this.getEntityTextStyle()}>{fitEntityName || '-'}</Text>
                                                </Rect>
                                                <Text style={{ ...this.getEntityTextStyle(), width: tableNameWidth }}>{fitTableName}</Text>
                                            </Rect>
                                            {/* 下边框 */}
                                            <Rect style={{ fill: 'rgba(163, 177, 191, 0.3)', height: 1 }} />
                                        </Rect>
                                    )
                                },
                            })}
                        </Rect>
                    ) : null}
                </Rect>
            </Rect>
        )
    }

    private getHGroupStyle(style?: RectStyle): RectStyle {
        return {
            ...style,
            flexDirection: 'row',
            alignItems: 'center',
        }
    }

    private getWrapStyle(): RectStyle {
        return {
            stroke: '#686EE2',
            padding: 2,
            strokeOpacity: 0.2,
            width: NODE_CONFIG.border.width,
        }
    }

    private getBodyStyle(): RectStyle {
        return {
            fill: 'white',
            stroke: '#686EE2',
        }
    }

    private getHeaderStyle(): RectStyle {
        return {
            fill: `#686EE2`,
            padding: [4, 7, 4, 7],
        }
    }

    private getHeaderTextStyle(): TextStyle {
        return {
            ...this.getCommonTextStyle(),
            fill: 'white',
        }
    }

    private getContentStyle(): RectStyle {
        return {
            fill: 'white',
        }
    }

    private getEntityItemStyle(): RectStyle {
        return this.getHGroupStyle({
            padding: [0, 12, 0, 12],
        })
    }

    private getEntityTextStyle(style?: TextStyle): TextStyle {
        return {
            fill: '#2D3033',
        }
    }

    private getIconTextStyle(style?: TextStyle): TextStyle {
        return { ...this.getCommonTextStyle(), fill: 'white', fontFamily: 'iconfont', width: 14, ...style }
    }

    private getCommonTextStyle(): TextStyle {
        return {
            fontSize: 14,
        }
    }

    private isFkOrPk(value?: number) {
        return value && [2, 3].includes(value)
    }

    private getDisplayFieldList(fieldList: any[]) {
        let result = []
        const { fieldDisplayType } = this.props
        switch (fieldDisplayType) {
            case ErDisplayLevel.TABLE:
                return []
            case ErDisplayLevel.IMPORTANT:
                result = fieldList.filter((item) => this.isFkOrPk(item.pkType) || this.isFkOrPk(item.fkType) || item.partitionFlag)
                break
            default:
                result = fieldList.concat()
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
                getHeight: (node: IErNode<IModelNode>) => {
                    let fieldList = node.data.modelTableInfoList || node.data.fieldInfoList || []
                    const { field } = NODE_CONFIG
                    // 如果是物理表，筛选字段
                    if (node.nodeType === NodeType.table) {
                        fieldList = this.getDisplayFieldList(fieldList)
                    }
                    const result = 58 + field.height * Math.min(fieldList.length, maxDisplayFieldCount)
                    return result
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
                    {
                        type: 'edge-tooltip',
                        formatText: function formatText(node: any) {
                            const model: IErNode<IModelNode> = node.targetNode._cfg.model
                            if (model.data && model.data.commonTableName) {
                                return '共用表: ' + model.data.commonTableName
                            }
                            return ''
                        },

                        shouldUpdate: function shouldUpdate(e: any) {
                            const model = e.item._cfg.target._cfg.model
                            return model.data && model.data.commonTableName
                        },
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
        const nameList = ['modelDisplayType', 'fieldDisplayType', 'data']
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
        const { style } = this.props
        return <div id='erContainer' style={{ height: '100%', ...style }} className={styles.ErGraphContainer}></div>
    }
}

export default ErGraph
