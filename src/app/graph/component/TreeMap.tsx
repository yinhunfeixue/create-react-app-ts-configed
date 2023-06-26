import TableSelectModal from '@/app/graph/component/TableSelectModal'
import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import G6TreeRender from '@/app/graph/G6TreeRender'
import G6Util from '@/app/graph/G6Util'
import IMiddleTableNode from '@/app/graph/interface/IMiddleTableNode'
import IPageNodeData from '@/app/graph/interface/IPageNodeData'
import IReport from '@/app/graph/interface/IReport'
import ITable from '@/app/graph/interface/ITable'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import TreeControl from '@/utils/TreeControl'
import G6, { ArrowConfig, IG6GraphEvent, IGroup, ModelConfig, TreeGraph } from '@antv/g6'
import { Circle, createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node'
import { CircleStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Circle'
import { RectStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Rect'
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text'
import { EventAttrs } from '@antv/g6-react-node/dist/Register/event'
import Lodash from 'lodash'
import qs from 'qs'
import React, { Component, ReactNode } from 'react'
import './TreeMap.less'

interface ITreeMapState {
    visibleSearchModal: boolean
    searchDataSource: ITreeNodeData<ITable>[]
    searchPageNode?: ModelConfig
    displayTree?: ITreeNodeData<ITable>
}
export interface ITreeMapProps<T = ITable> extends IComponentProps {
    dataSource: ITreeNodeData<T>
    onSelectedNode: (id: string | number, data: ITable, node: ITreeNodeData<T>) => void
    onZoomChange?: (value: number) => void
    hideMiddleNode: boolean
    hideLeft?: boolean
    hideRight?: boolean
    onPageChange?: () => void

    /**
     * 全链查看的目标表id
     */
    chainTargetId?: string
    onChainChange?: (id: string) => void

    hideMenu?: boolean
}

export interface ICfg {
    id: string
    position: NodePosition
    label: string
    extraData: ITable
    isClone: boolean
    state: string
    selected: boolean
    hover?: boolean
    children?: ICfg[]
}

export type NodeStyles = {
    /**
     * 通用样式
     */
    common: RectStyle & TextStyle

    /**
     * 中间表样式
     */
    center: RectStyle & TextStyle

    left?: RectStyle & TextStyle

    right?: RectStyle & TextStyle

    /**
     * 依赖表
     */
    relyTable?: RectStyle & TextStyle

    selected?: RectStyle & TextStyle

    hover?: RectStyle & TextStyle

    centerSelected?: RectStyle & TextStyle
}

const PAGE_SIZE = 8

/**
 * TreeMap
 */
class TreeMap extends Component<ITreeMapProps, ITreeMapState> {
    public graph!: TreeGraph

    protected tableRectWidth = 240
    protected tableRectPadding = 2
    protected tableContentRectWidth = this.tableRectWidth - this.tableRectPadding * 2
    protected tableContentRectPadding = 10
    protected tableIconWidth = 14
    protected tableIconMargin = 4
    protected tableNameWidth = this.tableContentRectWidth - this.tableContentRectPadding * 2 - this.tableIconWidth - this.tableIconMargin
    protected tableNameFontSize = 14
    protected dataSourceFontSize = 12

    protected circleSize = 16
    protected circleFontSize = 10

    protected resizeObserver?: ResizeObserver

    private debounceUpdateGraphSize: Function

    constructor(props: ITreeMapProps) {
        super(props)
        this.state = {
            visibleSearchModal: false,
            searchDataSource: [],
        }
        this.debounceUpdateGraphSize = Lodash.debounce(this.updateGraphSize, 1000)
    }

    public refresh() {
        this.graph.getNodes().forEach((item) => {
            this.graph.refreshItem(item)
        })
    }

    componentDidMount() {
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
                    const { startPoint, endPoint, targetNode } = cfg

                    const model = targetNode.getModel()
                    const { position, nodeType } = model

                    const arrow: ArrowConfig = {
                        path: G6.Arrow.triangle(5, 5, 0),
                        fill: 'rgba(163, 177, 191, 1)',
                    }

                    const showStartArrow = position === NodePosition.LEFT && !nodeType
                    const showEndArrow = position === NodePosition.RIGHT && !nodeType

                    const keyShape = group.addShape('path', {
                        attrs: {
                            path: [
                                ['M', startPoint.x, startPoint.y],
                                ['L', endPoint.x, endPoint.y],
                            ],
                            stroke: 'rgba(163, 177, 191, 1)',
                            radius: 10,
                            startArrow: showStartArrow ? arrow : false,
                            endArrow: showEndArrow ? arrow : false,
                        },
                        name: 'path-shape',
                    })
                    return keyShape
                },
            },
            'polyline'
        )

        this.initChart()
        this.listenerResize()
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = undefined
        }
    }

    protected createMenu() {
        const menu = new G6.Menu({
            offsetX: 6,
            offsetY: 10,
            itemTypes: ['node'],
            trigger: 'click',
            className: 'GraphMenuWrap',
            shouldBegin: (event?: IG6GraphEvent) => {
                if (event) {
                    event.stopPropagation()
                }
                if (event) {
                    if (event.target.cfg.id === 'menuIcon') {
                        return true
                    }
                }
                return false
            },

            getContent(e) {
                const result = document.createElement('div')
                result.className = 'GraphMenu'
                const ul = document.createElement('ul')
                const menuData = [
                    {
                        key: 'showChain',
                        label: '全链路查看',
                    },
                ]

                menuData.forEach((item) => {
                    const element = document.createElement('li')
                    element.innerText = item.label
                    element.id = item.key
                    ul.appendChild(element)
                })

                result.appendChild(ul)
                return result
            },
            handleMenuClick: (target, item) => {
                const { onChainChange } = this.props
                const { id } = target
                if (!onChainChange) {
                    return
                }
                switch (id) {
                    case 'showChain':
                        const dataId = item.getModel().id
                        if (dataId) {
                            onChainChange(dataId)
                        }
                        break

                    default:
                        break
                }
            },
        })
        return menu
    }

    protected get graphContainer() {
        return document.getElementById('container')
    }

    protected listenerResize() {
        const graphContainer = this.graphContainer
        if (graphContainer) {
            this.resizeObserver = new ResizeObserver(this.resizeHandler)
            this.resizeObserver.observe(graphContainer)
        }
    }

    protected resizeHandler = () => {
        this.debounceUpdateGraphSize()
    }

    private updateGraphSize() {
        console.log('updateGraphSize')

        const graph = this.graph
        if (!graph || graph.get('destroyed')) {
            return
        }
        const container = document.getElementById('container')
        if (!container || !container.scrollWidth || !container.scrollHeight) {
            return
        }

        graph.changeSize(container.clientWidth, Math.floor(container.clientHeight))
    }

    /**
     * **从数据逻辑上说**<br/>
     * 因为中心表包含左右两颗子树，其它表只有一颗子树，所以有两种表
     * 1. 中心表--包含1. 图表自身的方形结点，2. 左右2个圆形子结点，做为子树父结点
     * 2. 普通表--包含表自身结点，但是表自身结点包含3部分：方形结点，左右圆形结点
     *
     * 但是，因为g6不支持在结点中绘制子结点，所以**绘制逻辑**为：
     * 1. 圆形结点--只有中心结点的两侧有，分别做为左右子树的父结点
     * 2. 方形结点，根据结点性质，分为3种
     *
     *      1. 中心结点--只有方形
     *      2. 普通结点--方形、左右各1个圆形用于显示数量
     *      3. 叶子结点--方形、1个圆形结点用于显示父表数量
     * @param param
     * @returns
     */
    protected renderNode = (param: { cfg: ModelConfig }) => {
        const { nodeType } = param.cfg
        switch (nodeType) {
            case NodeType.icon:
                return this.renderIcon(param)
            case NodeType.page:
                return this.renderPageNode(param)
            case NodeType.middle:
                return this.renderMiddleNode(param)
            case NodeType.report:
                return this.renderReportNode(param)
            default:
                return this.renderCommonNode(param)
        }
    }

    protected get isDebugger() {
        return qs.parse(window.location.search, { ignoreQueryPrefix: true }).debugger
    }

    private renderReportNode(param: { cfg: ModelConfig }) {
        const { isDebugger } = this
        const { extraData, position } = param.cfg as unknown as ITreeNodeData<IReport>
        if (!extraData) {
            return null
        }

        const headerTextStyle = this.getHeaderTextStyle(position)
        const headerStyle = this.getHeaderStyle(position)
        const contentProps = this.getContentProps(param)
        const footerStyle = this.getFooterStyle(position)

        const { reportName, reportId, belongSystem } = extraData
        return this.renderCommonNode(
            param,
            <Group>
                <Rect capture={false} style={headerStyle} {...contentProps}>
                    <Text capture={false} style={headerTextStyle} {...contentProps}>
                        {unescape('%ue6c5')} {isDebugger ? reportId : ''} {reportName}
                    </Text>
                </Rect>
                {/* 数据源 */}
                <Text capture={false} style={footerStyle} {...contentProps}>
                    {belongSystem}
                </Text>
            </Group>
        )
    }

    protected renderMiddleNode(param: { cfg: ModelConfig }) {
        const { tableRectWidth } = this
        const rectPadding = 16
        const contentWidth = tableRectWidth - rectPadding * 2
        const { current, dataSource, id } = param.cfg as unknown as IMiddleTableNode<ITable>
        const pageList = G6TreeRender.getPageList(dataSource, current)
        const maxPage = G6TreeRender.getMaxPage(dataSource)

        const pageDotSize = 6
        const pageDotSelectWidth = 10
        const pageDotSelectColor = `rgba(77, 115, 255, 1)`

        const hidePage = maxPage === 0

        return (
            <Rect style={{ width: tableRectWidth, stroke: `rgba(163, 177, 191, 1)`, lineDash: [5, 3], padding: rectPadding }}>
                {/* 标题 */}
                <Text capture={false} style={{ fontSize: 14, fontWeight: 600, fill: `rgba(45, 48, 51, 1)`, width: contentWidth, margin: [0, 0, 16, 0] }}>
                    中间表 {dataSource.length || '暂无数据'}
                </Text>
                {/* 表名称 */}
                {pageList.length && (
                    <Rect capture={false} style={{}}>
                        <Text capture={false} key={Math.random()} style={{ width: contentWidth, fontSize: 12, lineHeight: 20, height: pageList.length * 20, fill: `rgba(94, 98, 102, 1)` }}>
                            {pageList
                                .map((item) => {
                                    return item.extraData ? item.extraData.tableEName : 'none'
                                })
                                .join('、\r\n')}
                        </Text>
                    </Rect>
                )}
                {/* 翻页器 */}
                <Rect style={{ flexDirection: 'row', margin: [16, 0, 0, 0], opacity: hidePage ? 0 : 1 }}>
                    {new Array(maxPage + 1).fill(0).map((_, index) => {
                        const selected = index === current
                        return (
                            <Rect
                                key={index}
                                onClick={() => {
                                    this.graph.updateItem(id, { current: index })
                                    this.graph.refreshItem(id)
                                    this.graph.layout()
                                }}
                                style={{
                                    cursor: 'pointer',
                                    fill: selected ? pageDotSelectColor : `rgba(196, 200, 204, 0.3)`,
                                    margin: [0, pageDotSize, 0, 0],
                                    width: selected ? pageDotSelectWidth : pageDotSize,
                                    height: pageDotSize,
                                    radius: pageDotSize / 2,
                                    opacity: hidePage ? 0 : 1,
                                }}
                            />
                        )
                    })}
                </Rect>
            </Rect>
        )
    }

    protected renderPageNode(param: { cfg: ModelConfig }) {
        const { onPageChange } = this.props
        return G6TreeRender.renderPageNode(
            param,
            this.graph,
            { circleSize: this.circleSize, tableRectWidth: this.tableRectWidth },
            {
                onPageChange: () => {
                    G6TreeRender.updateEdgeState(this.graph)
                    if (onPageChange) {
                        onPageChange()
                    }
                },
                onSearch: (params) => {
                    const dataSource = params.cfg.dataSource as ITreeNodeData<ITable>[]
                    if (!dataSource) {
                        return
                    }
                    this.setState({
                        visibleSearchModal: true,
                        searchPageNode: params.cfg,
                        searchDataSource: dataSource.concat(),
                    })
                },
            }
        )
    }

    protected renderIcon(param: { cfg: ModelConfig }) {
        return G6TreeRender.renderIcon(param, { circleSize: this.circleSize, circleFontSize: this.circleFontSize })
    }

    protected renderContent(param: { cfg: ModelConfig }): ReactNode {
        return <Text style={{ fill: 'red' }}>请重写renderContent函数</Text>
    }

    /**
     * 获取边框样式
     * @param state
     * @returns
     */
    protected getBorderStyle(state: keyof NodeStyles): RectStyle {
        const config: NodeStyles = {
            common: {
                width: this.tableRectWidth,
                padding: this.tableRectPadding,
                stroke: `rgba(64, 129, 255, 1)`,
                cursor: 'pointer',
            },
            center: {
                stroke: `rgba(64, 129, 255, 1)`,
            },
            left: {
                stroke: `rgba(255, 190, 127, 1)`,
            },
            right: {
                stroke: `rgba(140, 217, 255, 1)`,
            },

            relyTable: {
                stroke: `rgba(154, 161, 168, 1)`,
            },
            hover: {
                stroke: `rgba(64, 129, 255, 1)`,
            },
            selected: {
                stroke: `rgba(64, 129, 255, 1)`,
            },
        }

        return this.getStyleByState(config, state)
    }

    /**
     * 获取内容区样式
     * @param state
     * @returns
     */
    protected getContentStyle(state: keyof NodeStyles, commonStyle?: RectStyle): RectStyle {
        const config: NodeStyles = {
            common: {
                justifyContent: 'center',
                padding: this.tableContentRectPadding,
                fill: `rgba(64, 129, 255, 1)`,
                cursor: 'pointer',
                position: 'relative',
                ...commonStyle,
            },
            center: {
                fill: `rgba(64, 129, 255, 1)`,
            },
            left: {
                fill: `white`,
            },
            right: {
                fill: `white`,
            },
            relyTable: {
                fill: `white`,
            },
            selected: {
                fill: `rgba(242, 247, 255, 1)`,
            },
            centerSelected: { fill: `rgba(35, 94, 207, 1)` },
        } as any

        return this.getStyleByState(config, state)
    }

    /**
     * 获取Header样式
     * @param state
     * @returns
     */
    protected getHeaderStyle(state: keyof NodeStyles): RectStyle {
        const config: NodeStyles = {
            common: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: [0, 0, 7, 0],
            },
            center: {},
        }
        return this.getStyleByState(config, state)
    }

    /**
     * 获取标题栏样式
     * @param state
     * @returns
     */
    protected getHeaderTextStyle(state: keyof NodeStyles): TextStyle {
        const config: NodeStyles = {
            common: {
                fill: `rgba(45, 48, 51, 1)`,
                fontSize: this.tableNameFontSize,
                fontFamily: 'iconfont',
            },
            center: {
                fill: `rgba(255, 255, 255, 1)`,
            },
            left: {
                fill: `rgba(45, 48, 51, 1)`,
            },
            right: {
                fill: `rgba(45, 48, 51, 1)`,
            },
        }
        return this.getStyleByState(config, state)
    }

    /**
     * 获取页脚样式
     * @param state
     * @returns
     */
    protected getFooterStyle(state: keyof NodeStyles): RectStyle {
        const config: NodeStyles = {
            common: {
                fill: `rgba(45, 48, 51, 1)`,
                fontSize: this.dataSourceFontSize,
                cursor: 'pointer',
            },
            center: {
                fill: `rgba(255, 255, 255, 1)`,
            },
            left: {
                fill: `rgba(124, 131, 140, 1)`,
            },
            right: {
                fill: `rgba(124, 131, 140, 1)`,
            },
        }
        return this.getStyleByState(config, state)
    }

    protected getStyleByState(config: NodeStyles, state: keyof NodeStyles): RectStyle {
        if (!config) {
            return {}
        }

        const { common } = config
        return { ...common, ...config[state] }
    }

    public async focusItem(id: string) {
        const { displayTree } = this.state
        if (displayTree) {
            // 展开结点链
            const control = new TreeControl<ITreeNodeData<ITable>>()
            const chain = control.searchChain([displayTree], (nodeItem) => nodeItem.id === id)
            if (chain) {
                chain.forEach((item) => {
                    if (item.id !== id) {
                        item.collapsed = false
                    }
                })
                this.graph.layout()
                G6Util.focusItem(this.graph, id)
            }
        }
    }

    componentDidUpdate(preProps: ITreeMapProps) {
        const nameList = ['hideMiddleNode', 'hideLeft', 'hideRight', 'chainTargetId']
        for (let item of nameList) {
            if (preProps[item] !== this.props[item]) {
                this.renderChart()
            }
        }
    }

    protected getState(position: NodePosition, relyTable?: boolean, selected?: boolean, hover?: boolean): keyof NodeStyles {
        if (selected) {
            if (position === NodePosition.CENTER) {
                return 'centerSelected'
            }
            return 'selected'
        } else if (hover) {
            return 'hover'
        } else if (relyTable) {
            return 'relyTable'
        }
        return position
    }

    protected renderCommonNode(param: { cfg: ModelConfig }, children?: JSX.Element) {
        const { id, position, extraData, isClone, selected, hover } = param.cfg as unknown as ICfg

        const borderStyle = this.getBorderStyle(this.getState(position, extraData.isRelyTable, selected, hover))
        const contentStyle = this.getContentStyle(this.getState(position, extraData.isRelyTable, selected))

        const { onSelectedNode } = this.props

        const { circleFontSize, circleSize } = this

        const showCircle = position !== 'center'
        const circleStyle: CircleStyle = {
            r: circleSize / 2,
            stroke: '#C4C9CE',
            justifyContent: 'center',
            alignItems: 'center',
            fill: 'white',
            cursor: 'not-allowed',
        }

        const shortLineStyle: RectStyle = {
            fill: '#C4C9CE',
            width: 4,
            height: 1,
        }

        const hGroupStyle: RectStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            strokeOpacity: 0,
            fillOpacity: 0,
        }

        const circleTextStyle: TextStyle = {
            fontSize: circleFontSize,
            fill: isClone ? 'rgba(120, 124, 128, 1)' : '#2D3033',
            lineHeight: 1,
            fontFamily: 'normal',
        }

        const { predecessorsCount, successorsCount } = extraData

        // 左圆圈文字，左侧结点的左边圆圈表示子结点数量
        const leftNumber = predecessorsCount || 0

        // 右圆圈文字
        const rightNumber = successorsCount || 0

        const leftChildCircleStyle: CircleStyle = {
            ...circleStyle,
            stroke: 'rgba(255, 190, 127, 1)',
        }
        const rightChildCircleStyle: CircleStyle = {
            ...circleStyle,
            stroke: 'rgba(140, 217, 255, 1)',
        }

        const iconProps: any = {
            name: 'collapse-back',
            modelId: id,
            isClone,
            tooltip: isClone ? '环节点，不支持重复展开' : '',
        }

        const leftIconText = G6TreeRender.formatIconLabel(leftNumber.toString())
        const rightIconText = G6TreeRender.formatIconLabel(rightNumber.toString())

        const leftIconProps =
            position === NodePosition.LEFT
                ? iconProps
                : {
                      tooltip: leftIconText === '...' ? leftNumber.toString() : undefined,
                  }
        const rightIconProps =
            position === NodePosition.RIGHT
                ? iconProps
                : {
                      tooltip: rightIconText === '...' ? rightNumber.toString() : undefined,
                  }

        const tableProps: EventAttrs = {
            onClick: () => {
                if (onSelectedNode && extraData) {
                    onSelectedNode(extraData.tableId, extraData, param.cfg as any)
                    this.clearSelected()
                    this.selectItem(id, true)
                }
            },
            onMouseEnter: () => {
                this.setItemHover(id, true)
            },
            onMouseLeave: () => {
                this.setItemHover(id, false)
            },
        }

        // 左侧结点的左侧圆圈，当值等于0时，不显示
        const leftElementStyle: RectStyle = {
            opacity: position === NodePosition.LEFT && leftNumber === 0 ? 0 : 1,
            cursor: position === NodePosition.LEFT && !isClone ? 'pointer' : 'not-allowed',
        }

        // 右侧结点的右侧圆圈，当值等于0时，不显示
        const rightElementStyle: any = {
            opacity: position === NodePosition.RIGHT && rightNumber === 0 ? 0 : 1,
            cursor: position === NodePosition.RIGHT && !isClone ? 'pointer' : 'not-allowed',
        }

        return (
            <Rect style={{ ...hGroupStyle }}>
                {/* 左圆形 */}
                {showCircle && (
                    <Rect style={{ ...leftElementStyle, ...hGroupStyle }}>
                        <Circle
                            style={{ ...(position === NodePosition.LEFT && !isClone ? leftChildCircleStyle : circleStyle), ...leftElementStyle }}
                            // 左侧结点，点击左边圆形收放子树
                            {...leftIconProps}
                        >
                            <Text style={{ ...circleTextStyle, ...leftElementStyle }} {...leftIconProps}>
                                {leftIconText}
                            </Text>
                        </Circle>
                        <Rect style={{ ...shortLineStyle, ...leftElementStyle }} />
                    </Rect>
                )}
                {/*  外层边框 */}
                <Rect style={borderStyle}>
                    {/*  中间内容矩形 */}
                    <Rect style={contentStyle} {...tableProps}>
                        {children || this.renderContent(param)}
                    </Rect>
                </Rect>
                {/* 右圆形 */}
                {showCircle && (
                    <Rect style={{ ...hGroupStyle, ...rightElementStyle }}>
                        <Rect style={{ ...shortLineStyle, ...rightElementStyle }} />
                        <Circle style={{ ...(position === NodePosition.RIGHT && !isClone ? rightChildCircleStyle : circleStyle), ...rightElementStyle }} {...rightIconProps}>
                            <Text style={{ ...circleTextStyle, ...rightElementStyle }} {...rightIconProps}>
                                {rightIconText}
                            </Text>
                        </Circle>
                    </Rect>
                )}
            </Rect>
        )
    }

    protected getContentProps(param: { cfg: ModelConfig }) {
        const { id, extraData } = param.cfg as unknown as ICfg
        const { onSelectedNode } = this.props
        return {
            onClick: () => {
                if (onSelectedNode && extraData) {
                    onSelectedNode(extraData.tableId, extraData, param.cfg as any)
                    this.clearSelected()
                    this.selectItem(id, true)
                }
            },
        }
    }

    public selectItem(id: string, select: boolean) {
        this.graph.updateItem(id, { selected: select })
    }

    private setItemHover(id: string, hover: boolean) {
        this.graph.updateItem(id, { hover })
    }

    public clearSelected() {
        this.graph.getNodes().forEach((item) => {
            this.graph.updateItem(item, { selected: undefined })
        })
    }

    protected isIcon(nodeType?: string) {
        return nodeType === 'icon'
    }

    protected getNodeHeight(node: any) {
        const { nodeType, dataSource, current } = node
        switch (nodeType) {
            case NodeType.icon:
                return this.circleSize
            case NodeType.page:
                return 40
            case NodeType.middle:
                const length = dataSource.length
                const pageLength = Math.min(length, (current + 1) * PAGE_SIZE) - current * PAGE_SIZE
                return 83 + pageLength * 20
            default:
                return 70
        }
    }

    protected initChart() {
        const { onZoomChange } = this.props
        const tooltip = G6TreeRender.createTooltip()
        const menu = this.createMenu()
        const { circleSize } = this

        this.graph = new G6.TreeGraph({
            container: 'container',
            layout: {
                type: 'mindmap',
                direction: 'H',
                getHGap: (node: any) => {
                    const { nodeType, position } = node
                    // 从左向右
                    // 左侧图标，或 右侧非图标，间距=10
                    if ((position === NodePosition.LEFT && this.isIcon(nodeType)) || [NodePosition.CENTER].includes(position)) {
                        return 4
                    }
                    return 50
                },
                getVGap: (node: any) => {
                    return 8
                },
                getWidth: (node: any) => {
                    const { nodeType, position } = node
                    // 图标
                    if (this.isIcon(nodeType)) {
                        return circleSize
                    }
                    // 中心点
                    if (position === NodePosition.CENTER) {
                        return 240
                    }
                    // 方形 + 2个小圆形 + 2个短连线
                    return 240 + circleSize * 2 + 4 * 2
                },
                getHeight: (node: any) => this.getNodeHeight(node),
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
            edgeStateStyles: {
                iconEdge: {
                    type: 'line-arrow',
                    stroke: 'rgba(163, 177, 191, 1)',
                    endArrow: {
                        path: G6.Arrow.triangle(5, 5, 0),
                        opacity: 0,
                    },
                },
                hide: {
                    type: 'line-arrow',
                    opacity: 0,
                },
            },
            plugins: [tooltip, menu],
            modes: {
                default: [
                    {
                        type: 'drag-canvas',
                        allowDragOnItem: true,
                    },
                ],
            },
        })

        const graph = this.graph
        this.renderChart(true)
        G6TreeRender.updateEdgeState(graph)
        G6TreeRender.addListener(graph)

        graph.on('wheelzoom', (e) => {
            const zoom = graph.getZoom()
            if (onZoomChange) {
                onZoomChange(zoom)
            }
        })
    }

    private renderChart(init = false) {
        const { hideMiddleNode, dataSource, hideLeft, hideRight, chainTargetId } = this.props
        const graph = this.graph
        let node: ITreeNodeData<ITable> | undefined = undefined
        // 如果是全链模式
        if (chainTargetId) {
            node = this.createChainGraphData()
        }

        if (!node) {
            node = G6Util.cloneStandardTree(dataSource, hideMiddleNode, hideLeft, hideRight)
        }
        this.setState({ displayTree: node })
        if (init) {
            graph.data(node)
            graph.render()
        } else {
            graph.changeData(node)
        }

        G6Util.focusItem(graph, dataSource.id)
    }

    private createChainGraphData(): ITreeNodeData<ITable> | undefined {
        const { dataSource, chainTargetId } = this.props

        const treeControl = new TreeControl<ITreeNodeData<ITable>>()
        const chain = treeControl.searchChain([dataSource], (node) => {
            if (node.extraData) {
                return node.extraData.tableId === chainTargetId
            }
            return false
        })

        if (chain) {
            const singleChain = Lodash.cloneDeep(chain)
            singleChain.forEach((item, index) => {
                item.collapsed = false
                const nextItem = index < singleChain.length - 1 ? singleChain[index + 1] : undefined
                if (nextItem) {
                    item.children = [nextItem]
                } else {
                    item.children = undefined
                }
            })

            return singleChain[0]
        }

        return
    }

    public selectItemWidthPage(id: string, pageNode?: ModelConfig) {
        const selectItem = async () => {
            this.focusItem(id)
            this.graph.updateItem(id, { collapsed: false })
            G6TreeRender.updateEdgeState(this.graph)
            this.selectItem(id, true)
        }

        const { displayTree } = this.state
        if (!displayTree) {
            return
        }

        // 关闭除“中心结点、左右圆点”外的所有结点
        this.graph.getNodes().forEach((item) => {
            const model: ITreeNodeData = item.getModel() as ITreeNodeData
            if (!model.nodeType || ![NodeType.middle, NodeType.icon].includes(model.nodeType)) {
                this.graph.updateItem(item.getID(), { collapsed: true })
            }
        })

        const treeControl = new TreeControl<ITreeNodeData<ITable>>()
        this.clearSelected()
        //  如果id结点存在，直接focus
        const node = treeControl.search([displayTree], (item) => item.id === id)
        if (node) {
            selectItem()
            return
        }

        // 否则，查找页码结点，查找方式为：若指定了pageNode，使用指定值；未指定，则搜索所有pageNode结点，找到一个包含id的pageNode
        let targetPageNode: any = pageNode
        if (!targetPageNode) {
            const node = treeControl.search([displayTree], (item) => {
                const { nodeType, dataSource } = item as IPageNodeData<ITable>
                if (nodeType !== NodeType.page) {
                    return false
                }

                if (!dataSource) {
                    return false
                }

                return Boolean(dataSource.find((item) => item.id === id))
            })

            if (node) {
                targetPageNode = node
            }
        }
        if (targetPageNode) {
            const index = targetPageNode.dataSource.findIndex((item: IPageNodeData<ITable>) => item.id === id)
            if (index >= 0) {
                const page = Math.max(0, Math.ceil(index / PAGE_SIZE) - 1)
                if (targetPageNode) {
                    G6TreeRender.toPage(this.graph, targetPageNode, page).then(async () => {
                        selectItem()
                    })
                }
            }
        }
    }

    render() {
        const { style, className } = this.props
        const { visibleSearchModal, searchDataSource, searchPageNode } = this.state
        return (
            <>
                <div id='container' className={className} style={{ ...style, overflow: 'hidden' }} />
                {visibleSearchModal && (
                    <TableSelectModal
                        visible={visibleSearchModal}
                        onClose={() => this.setState({ visibleSearchModal: false })}
                        dataSource={searchDataSource}
                        onChange={(value) => {
                            this.setState({ visibleSearchModal: false })
                            this.selectItemWidthPage(value, searchPageNode)
                        }}
                    />
                )}
            </>
        )
    }
}

export default TreeMap
