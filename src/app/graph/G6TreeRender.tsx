import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import ProjectUtil from '@/utils/ProjectUtil'
import G6, { IG6GraphEvent, ModelConfig, TreeGraph, TreeGraphData } from '@antv/g6'
import { Circle, Rect, Text } from '@antv/g6-react-node'
import { CircleStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Circle'
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text'
import { message } from 'antd'
import React from 'react'

const PAGE_SIZE = 8

/**
 * G6TreeRender
 */
class G6TreeRender {
    /**
     * 渲染分页结点
     * @param param  结点数据
     * @param graph
     * @param onPageChange
     * @param size
     * @returns
     */
    static renderPageNode(
        param: { cfg: ModelConfig },
        graph: TreeGraph,
        size: {
            circleSize: number
            tableRectWidth: number
        },
        events: {
            onPageChange: (page: number) => void
            onSearch: (param: { cfg: ModelConfig }) => void
        }
    ) {
        const { dataSource, current }: { dataSource: any[]; current: number; parentId: string; id: string } = param.cfg as any
        const maxPage = G6TreeRender.getMaxPage(dataSource)
        const { circleSize, tableRectWidth } = size
        const { onPageChange, onSearch } = events

        const gap = circleSize + 4

        const nameTextStyle: TextStyle = {
            fill: 'rgba(94, 98, 102, 1)',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: 12,
        }

        const pageTextStyle: TextStyle = {
            fill: 'rgba(45, 48, 51, 1)',
            fontSize: 14,
        }

        const iconTextStyle: TextStyle = {
            fill: 'rgba(45, 48, 51, 1)',
            fontFamily: 'iconfont',
            fontSize: 14,
        }

        const disableArrowStyle: TextStyle = {
            fill: 'rgba(196, 200, 204, 1)',
        }

        const toPage = (page: number) => {
            G6TreeRender.toPage(graph, param.cfg, page).then((page) => {
                onPageChange(page)
            })
        }

        return (
            <Rect style={{ padding: [0, gap, 0, gap] }}>
                <Rect style={{ width: tableRectWidth, fill: 'white', alignItems: 'center', flexDirection: 'row', height: 40, padding: [0, 8, 0, 8] }}>
                    {/* 表数量 */}
                    <Text style={nameTextStyle}>表数量：{dataSource.length}</Text>
                    {/* 翻页 */}
                    <Text style={{ ...iconTextStyle, cursor: 'pointer', ...(current <= 0 ? disableArrowStyle : {}) }} onClick={() => toPage(current - 1)}>
                        {unescape(`%ue635`)}
                    </Text>
                    <Text style={pageTextStyle}>{(current + 1).toString()}</Text>
                    <Text style={{ ...iconTextStyle, cursor: 'pointer', ...(current >= maxPage ? disableArrowStyle : {}) }} onClick={() => toPage(current + 1)}>
                        {unescape(`%ue636`)}
                    </Text>
                    <Rect style={{ height: 12, width: 1, fill: `rgba(230, 232, 237, 1)`, margin: [0, 8, 0, 0] }} />
                    {/* 搜索 */}
                    <Text style={{ ...iconTextStyle, cursor: 'pointer', fill: `rgba(94, 98, 102, 1)` }} onClick={() => onSearch(param)}>
                        {unescape(`%ue6c8`)}
                    </Text>
                </Rect>
            </Rect>
        )
    }

    /**
     * 获取最大页码，从0开始
     * @param list
     * @param pageSize
     * @returns
     */
    static getMaxPage(list: any[], pageSize: number = PAGE_SIZE) {
        if (!list || !list.length) {
            return 0
        }
        return Math.ceil(list.length / pageSize) - 1
    }

    static getPageList<T = any>(list: T[], currentPage: number, pageSize = PAGE_SIZE): T[] {
        return list.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    }

    static async toPage(graph: TreeGraph, cfg: ModelConfig, page: number): Promise<number> {
        const { dataSource, parentId, id, current }: { dataSource: any[]; current: number; parentId: string; id: string } = cfg as any

        if (page === current) {
            return Promise.resolve(current)
        }
        const maxPage = G6TreeRender.getMaxPage(dataSource)
        const getNextChildren = (pageIndex: number) => {
            const list = this.getPageList(dataSource, pageIndex)
            return [cfg, ...list]
        }

        const effectPage = Math.min(maxPage, Math.max(0, page))
        const list = getNextChildren(effectPage)

        graph.updateItem(id, { current: effectPage })
        graph.updateChildren(list, parentId)

        // 延迟一会，等待动画完成
        await ProjectUtil.sleep(1000)

        this.updateEdgeState(graph)
        return Promise.resolve(effectPage)
    }

    static renderIcon(param: { cfg: ModelConfig }, size: { circleSize: number; circleFontSize: number }) {
        const { id, children, position } = param.cfg as { id: string; children: any[]; position: NodePosition }
        const iconProps: any = {
            name: 'collapse-back',
            modelId: id,
        }

        type StyleConfig = {
            common: CircleStyle | TextStyle
            center: Partial<CircleStyle>
            left: Partial<CircleStyle>
            right: Partial<CircleStyle>
        }

        type styleConfigKey = keyof StyleConfig

        const { circleSize, circleFontSize } = size

        const iconConfig: StyleConfig = {
            common: {
                r: circleSize / 2,
                justifyContent: 'center',
                alignItems: 'center',
                stroke: '#666666',
                fill: 'white',
                cursor: children.length ? 'pointer' : 'not-allowed',
            },
            center: {
                stroke: '#666666',
            },
            left: {
                stroke: 'rgba(64, 129, 255, 1)',
            },
            right: {
                stroke: 'rgba(64, 129, 255, 1)',
            },
        }

        const textConfig: StyleConfig = {
            common: {
                fontSize: circleFontSize,
                fill: 'rgba(45, 48, 51, 1)',
                fontFamily: 'normal',
                cursor: children.length ? 'pointer' : 'not-allowed',
            },
            center: {},
            left: {},
            right: {},
        }

        const iconStyle = {
            ...iconConfig.common,
            ...iconConfig[position as styleConfigKey],
        }

        const textStyle = {
            ...textConfig.common,
            ...textConfig[position as styleConfigKey],
        }

        let label = children ? (children as []).length.toString() : '0'
        label = this.formatIconLabel(label)

        return (
            <Circle style={iconStyle} {...iconProps}>
                <Text style={textStyle} {...iconProps}>
                    {label}
                </Text>
            </Circle>
        )
    }

    static formatIconLabel(label: string) {
        if (!label) {
            return ''
        }
        return label.length > 2 ? '...' : label
    }

    static handleCollapse(graph: TreeGraph, e: IG6GraphEvent) {
        const target = e.target
        const id = target.get('modelId')
        const isClone = target.get('isClone')
        if (isClone) {
            message.warn('环节点，不支持重复展开')
            return
        }
        const item = graph.findById(id)
        const nodeModel = item.getModel() as TreeGraphData
        nodeModel.collapsed = !nodeModel.collapsed
        graph.layout()
        graph.setItemState(item, 'collapse', nodeModel.collapsed)
        this.updateEdgeState(graph)
    }

    static updateEdgeState(graph: TreeGraph) {
        graph.getEdges().forEach((item) => {
            const node = item.getTarget()
            if (!node || !node._cfg || !node._cfg.model) {
                return
            }
            const { nodeType } = node._cfg.model

            let state = ''
            switch (nodeType) {
                case NodeType.icon:
                    state = 'iconEdge'
                    break
                case NodeType.page:
                    state = 'hide'
                    break
                default:
                    break
            }
            if (state) {
                graph.setItemState(item, state, true)
            }
        })
    }

    static addListener(graph: TreeGraph) {
        // @ts-ignore
        graph.on('collapse-back:click', (e) => {
            G6TreeRender.handleCollapse(graph, e)
        })

        graph.on('click', (e) => {
            const onClick = e.target.cfg.onClick
            if (onClick) {
                onClick()
            }
        })
        graph.on('node:mouseenter', (e) => {
            const onMouseEnter = e.target.cfg.onMouseEnter
            if (onMouseEnter) {
                onMouseEnter()
            }
        })
        graph.on('node:mouseout', (e) => {
            const onMouseLeave = e.target.cfg.onMouseLeave
            if (onMouseLeave) {
                onMouseLeave()
            }
        })
    }

    static createTooltip() {
        return new G6.Tooltip({
            offsetX: 30,
            offsetY: 0,
            getContent: (e) => {
                if (!e) {
                    return ''
                }
                const target = e.target
                const tooltip = target.get('tooltip')
                return tooltip || ''
            },
            shouldBegin(evt) {
                if (!evt) {
                    return false
                }
                const target = evt.target
                const tooltip = target.get('tooltip')

                return Boolean(tooltip)
            },
        })
    }
}
export default G6TreeRender
