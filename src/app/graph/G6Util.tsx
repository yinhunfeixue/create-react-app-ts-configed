import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import ILinkInfo from '@/app/graph/interface/ILinkInfo'
import IMiddleTableNode from '@/app/graph/interface/IMiddleTableNode'
import IPageNodeData from '@/app/graph/interface/IPageNodeData'
import IReport from '@/app/graph/interface/IReport'
import ISimpleField from '@/app/graph/interface/ISimpleField'
import ITable from '@/app/graph/interface/ITable'
import ITreeGraphRes, { IReportForTableGraphRes, IReportGraphRes } from '@/app/graph/interface/ITreeGraphRes'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import TreeControl from '@/utils/TreeControl'
import { Point } from '@antv/coord'
import G6, { G6GraphEvent, Graph, NodeConfig } from '@antv/g6'
import { Rect } from '@antv/g6-react-node'

import Lodash from 'lodash'
import React from 'react'

interface IParseParam {
    /**
     * 服务器资源
     */
    res: ITreeGraphRes
    /**
     * 中心表ID
     */
    centerId: string

    /**
     * 默认是否折叠，true表示默认折叠，只时只会展开左右各一级
     */
    collapsed?: boolean

    reportRes?: IReportForTableGraphRes
}

/**
 * G6Util
 */
class G6Util {
    static focusItem(graph: Graph, id: string) {
        graph.focusItem(id)
        const node = graph.getNodes().find((item) => item.getID() === id)
        // g6的bug，forcusItem是把结点左上角放在了画面中心，所以要反向偏移结点尺寸的一半
        // g6修复后，会表现为结点偏左上，删除此处的代码即可
        if (node) {
            const box = node.getBBox()
            graph.translate(-box.width / 2, -box.height / 2)
        }
    }
    static fittingString(str: string, maxWidth: number, fontSize: number) {
        if (!str) {
            return ''
        }
        const ellipsis = '...'
        const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
        let currentWidth = 0
        let res = str
        const pattern = new RegExp('[\u4E00-\u9FA5]+')
        str.split('').forEach((letter, i) => {
            if (currentWidth > maxWidth - ellipsisLength) return
            if (pattern.test(letter)) {
                currentWidth += fontSize
            } else {
                currentWidth += G6.Util.getLetterWidth(letter, fontSize)
            }
            if (currentWidth > maxWidth - ellipsisLength) {
                res = `${str.substr(0, i)}${ellipsis}`
            }
        })
        return res
    }

    /**
     * 根据指定规则，clone标准树
     * 1. 可设置隐藏左树/右树
     * 2. 可设置隐藏中间表
     * 3. 添加分页结点
     * @param node
     * @param hideLeft
     * @param hideRight
     */
    public static cloneStandardTree<T = ITable>(node: ITreeNodeData<T>, hideMiddle?: boolean, hideLeft?: boolean, hideRight?: boolean) {
        let result = Lodash.cloneDeep(node)
        if (!result.children) {
            return result
        }
        if (hideLeft) {
            result.children = result.children.filter((item) => item.position !== NodePosition.LEFT)
        }

        if (hideRight) {
            result.children = result.children.filter((item) => item.position !== NodePosition.RIGHT)
        }

        if (hideMiddle) {
            result = this.cloneToHideMiddleNode(result)
        }

        result = this.cloneWidthPageNode(result)
        return result
    }

    /**
     * 转换为带分页结点的树
     * @param tree
     */
    private static cloneWidthPageNode<T = ITable>(node: ITreeNodeData<T>, pageSize = 8): ITreeNodeData<T> {
        const { children } = node
        if (!children) {
            return node
        }
        // 先递归处理子结点
        for (let i = 0; i < children.length; i++) {
            const item = children[i]
            children[i] = this.cloneWidthPageNode(item)
        }

        const { id: parentId, position } = node

        // 递归子结点，如果子结点超出数量，创建分页结点
        if (children.length > pageSize) {
            const pageNode: IPageNodeData<T> = {
                id: `${parentId}-${Math.random()}-pageNode`,
                current: 0,
                dataSource: children,
                parentId,
                nodeType: NodeType.page,
                position,
            }
            const newChildren: ITreeNodeData<T>[] = [pageNode, ...children.slice(0, pageSize)]
            node.children = newChildren
        }
        return node
    }

    /**
     * 解析为隐藏中间表
     * @param node
     * @param labelFunction
     */
    private static cloneToHideMiddleNode<T>(node: ITreeNodeData<T>, labelFunction: (node: ITreeNodeData<T>) => string = (item) => item.label || item.id): ITreeNodeData<T> {
        // 中心结点、中心结点的子列表  和当前graphData相同
        // 循环“中心结点的子列表”，对于其中一项
        // 循环子树
        //   1. 创建中间表结点
        //   2. 对于有子列表的结点，添加到中间表的dataSource中
        //   3. 无子列表的结点（叶子结点），添加到中间表的children中
        const result = node
        const treeController = new TreeControl<ITreeNodeData<T>>()

        const { children } = result
        if (!children) {
            return result
        }

        // 循环左右子树
        children.forEach((iconNode) => {
            const { children } = iconNode
            if (!children || !children.length) {
                return
            }
            // 创建中间表结点，并设置为唯一子结点
            const middleNode: IMiddleTableNode<T> = {
                id: `middleNode-${iconNode.position}`,
                position: iconNode.position,
                current: 0,
                nodeType: NodeType.middle,
                dataSource: [],
                children: [],
            }

            iconNode.children = [middleNode]

            if (children) {
                // 循环子树
                treeController.forEach(children, (item) => {
                    if (item.children && item.children.length) {
                        middleNode.dataSource.push({
                            ...item,
                            children: undefined,
                        })
                    } else {
                        if (middleNode.children) {
                            middleNode.children.push(item)
                        }
                    }
                })
            }
        })

        return result
    }

    /**
     * 创建标准树
     * 中心点-->左圆形图标结点-->左树
     * 中心点-->右圆形图标结点-->右树
     * @param params
     */
    public static parseStandardTree<T = ITable>(params: IParseParam): ITreeNodeData<T> | undefined {
        const { res, centerId, collapsed = true, reportRes } = params
        const { tableInfo, linkWrapperPredecessors, linkWrapperSuccessors, fieldInfo } = res
        if (!tableInfo || !tableInfo[centerId]) {
            return
        }

        // 创建中心表结点
        const result = G6Util.createTableNode(tableInfo[centerId], NodePosition.CENTER, linkWrapperPredecessors[centerId] ? linkWrapperPredecessors : linkWrapperSuccessors, fieldInfo)
        result.children = []
        const existIds: { [key: string]: number } = { [centerId]: 1 }

        // 创建左树
        const leftIcon = this.createIconNode(NodePosition.LEFT)
        leftIcon.children = G6Util.createTree(centerId, tableInfo, fieldInfo, linkWrapperPredecessors, NodePosition.LEFT, existIds, collapsed, reportRes)
        // 左树有子结点时，显示左树圆点
        if (leftIcon.children && leftIcon.children.length) {
            result.children.push(leftIcon)
        }

        // 创建右树
        const rightIcon = this.createIconNode(NodePosition.RIGHT)
        rightIcon.children = G6Util.createTree(centerId, tableInfo, fieldInfo, linkWrapperSuccessors, NodePosition.RIGHT, existIds, collapsed, reportRes)
        // 设置报表子表
        rightIcon.children.push(...this.getReportNodeChildren(centerId, NodePosition.RIGHT, existIds, reportRes))
        // 右树有子结点时，显示右树圆点
        if (rightIcon.children && rightIcon.children.length) {
            result.children.push(rightIcon)
        }
        return result as any
    }

    public static parseStandardTreeForReport<T = IReport>(res: IReportGraphRes): ITreeNodeData<T> | undefined {
        const report = { ...res }
        const { tableInfo, fieldInfo, linkWrapper } = res.reportLineage
        // @ts-ignore
        delete report.reportLineage

        const centerId = report.reportId

        const existIds: { [key: string]: number } = { [centerId]: 1 }
        // 中心结点
        const result = this.reportDataToNodeData(report, NodePosition.CENTER)
        result.children = []

        // 左结点
        const leftIcon = this.createIconNode(NodePosition.LEFT)
        leftIcon.children = this.createTree(centerId, tableInfo, fieldInfo, linkWrapper, NodePosition.LEFT, existIds)
        result.children.push(leftIcon)
        // 右结点
        const rightIcon = this.createIconNode(NodePosition.RIGHT)
        rightIcon.children = []
        result.children.push(rightIcon)

        return result as ITreeNodeData<T>
    }

    private static createIconNode(position: NodePosition): ITreeNodeData {
        return {
            id: `icon_${position}_${Math.random()}`,
            label: position,
            position: position,
            nodeType: NodeType.icon,
        }
    }

    static measureText(str: string, fontSize: number) {
        const pattern = new RegExp('[\u4E00-\u9FA5]+')
        let currentWidth = 0
        str.split('').forEach((letter, i) => {
            if (pattern.test(letter)) {
                currentWidth += fontSize
            } else {
                currentWidth += G6.Util.getLetterWidth(letter, fontSize)
            }
        })
        return currentWidth
    }

    static getReportNodeChildren(tableId: string, position: NodePosition, existIds: { [key: string]: number }, reportRes?: IReportForTableGraphRes): ITreeNodeData<IReport>[] {
        if (!reportRes) {
            return []
        }
        const { tableReportLink, reportInfoMap } = reportRes
        if (!tableReportLink || !reportInfoMap) {
            return []
        }
        const reportChildenIds = tableReportLink[tableId]
        if (reportChildenIds && reportChildenIds.length) {
            const reportList = reportChildenIds
                // 过滤不存在的数据
                .filter((item) => Boolean(reportInfoMap[item]))
                .map((item) => {
                    const node = G6Util.reportDataToNodeData(reportInfoMap[item], position)
                    const existCount = existIds[item] || 0
                    existIds[item] = existCount + 1
                    if (existCount) {
                        node.id = `${item}_clone_${existIds[item]}`
                        node.isClone = true
                    }
                    return node
                })
            return reportList
        }
        return []
    }

    static createTree(
        parentId: string,
        tableDic: { [key: string]: ITable },
        fieldDic: { [key: string]: ISimpleField },
        linkInfo: ILinkInfo,
        position: NodePosition,
        existIds: { [key: string]: number },
        collapsed = true,
        reportRes?: IReportForTableGraphRes
    ): ITreeNodeData<ITable | IReport>[] {
        // 获取关联的结点ID列表
        // 循环ID列表，创建结点，并对结点递归生成子树
        const childrenInfo = linkInfo[parentId]
        if (!childrenInfo) {
            return []
        }

        // 获取物理表的子表
        const childIds: string[] = Object.keys(childrenInfo.linkTableFiledMap || {})
        if (!childIds || !childIds.length) {
            return []
        }

        const result = childIds
            .map((item) => {
                const existCount = existIds[item] || 0
                existIds[item] = existCount + 1
                if (tableDic[item]) {
                    const node: ITreeNodeData<ITable | IReport> = this.createTableNode(tableDic[item], position, linkInfo, fieldDic, childrenInfo.linkTableFiledMap[item])
                    node.collapsed = collapsed
                    // 如果相同ID已使用过，设置为分身结点; 否则递归设置子列表
                    if (existCount) {
                        node.id = `${item}_clone_${existIds[item]}`
                        node.isClone = true
                    } else {
                        // 设置物理表子表
                        node.children = this.createTree(item, tableDic, fieldDic, linkInfo, position, existIds, collapsed, reportRes)
                        // 设置报表子表
                        node.children.push(...this.getReportNodeChildren(item, position, existIds, reportRes))
                    }

                    if (node.extraData) {
                        const extraData: ITable = node.extraData as ITable
                        const linkFields = childrenInfo.linkTableFiledMap[item]
                        const itemLinkInfo = linkInfo[item]
                        extraData.isRelyTable = !Boolean(linkFields.length)
                        // 设置子表数量
                        let childCount = 0
                        if (itemLinkInfo && itemLinkInfo.linkTableFiledMap) {
                            childCount += Object.keys(itemLinkInfo.linkTableFiledMap).length
                        }
                        // 子表数量加上子报表数量
                        if (reportRes && reportRes.tableReportLink && reportRes.tableReportLink[item]) {
                            childCount += reportRes.tableReportLink[item].length
                        }
                        if (position === NodePosition.LEFT) {
                            extraData.predecessorsCount = childCount
                        } else {
                            extraData.successorsCount = childCount
                        }
                    }
                    return node
                }
                return undefined
            })
            .filter((item) => Boolean(item)) as ITreeNodeData<ITable>[]
        return result
    }

    static createTableNode(tableData: ITable, position: NodePosition, linkInfo: ILinkInfo, fieldDic: { [key: string]: ISimpleField }, fieldIdList?: string[]): ITreeNodeData<ITable> {
        const { tableId } = tableData
        // 表自身的数据
        const result = this.tableDataToNodeData(tableData, position)
        // 字段数据
        const linkData = linkInfo[tableId]
        const extraData = result.extraData
        if (extraData) {
            // 优先使用外部传入的字段id（linkWrapperPredecessors[tableid].linkTableFiledMap[childTableid]），如没有，则使用fieldIdSet属性的值
            let fieldIdSet = fieldIdList
            if (!fieldIdSet && linkData) {
                fieldIdSet = fieldIdList || linkData.fieldIdSet
            }

            if (fieldIdSet) {
                const fields = fieldIdSet
                    .map((item) => {
                        return fieldDic[item]
                    })
                    .filter((item) => Boolean(item))
                extraData.fields = fields
            } else {
                extraData.fields = []
            }
        }
        return result
    }

    static reportDataToNodeData(report: IReport, position: NodePosition): ITreeNodeData<IReport> {
        return {
            id: report.reportId.toString(),
            position,
            label: report.reportName,
            nodeType: NodeType.report,
            extraData: { ...report },
        }
    }

    static tableDataToNodeData(tableData: ITable, position: NodePosition): ITreeNodeData<ITable> {
        return {
            id: tableData.tableId.toString(),
            position,
            label: tableData.tableEName,
            extraData: { ...tableData },
        }
    }

    /**
     * 渲染滚动区域
     * @param graph
     */
    static renderScroller<T = any>(parmas: {
        graph: Graph
        node: NodeConfig
        dataSource: T[]
        itemHeight: number
        maxDisplayCount?: number
        itemRender: (data: T, scroller: boolean) => React.ReactNode
    }) {
        const { node, dataSource, itemHeight, maxDisplayCount = 8, itemRender, graph } = parmas
        if (!dataSource || !dataSource.length) {
            return undefined
        }

        const startIndex = Number(node.startIndex) || 0
        const showScollBar = dataSource.length > maxDisplayCount

        const isInBBox = (point: Point, bbox: any) => {
            const { x, y } = point
            const { minX, minY, maxX, maxY } = bbox

            return x < maxX && x > minX && y > minY && y < maxY
        }

        const displayFieldList = showScollBar ? dataSource.slice(startIndex, startIndex + maxDisplayCount) : dataSource
        if (!displayFieldList || !displayFieldList.length) {
            return <Rect style={{}} />
        }
        // 滚动条高度
        const barHeight = itemHeight * maxDisplayCount
        // 滑块高度
        const trackHeight = 20
        // 可滚动的总距离
        const maxScrollHeight = barHeight - trackHeight
        // 滚动到的最大序号
        const maxIndex = Math.max(0, dataSource.length - maxDisplayCount)
        // 滚动位置Y/可滚动的总距离 = 当前第一条序号/需要滚动的总数量，所以：滚动位置Y = 当前第一条序号/需要滚动的总数量 * 滚动的总距离
        const scrollPercent = (startIndex / maxIndex) * maxScrollHeight

        const wheelHandler = (e: WheelEvent) => {
            e.stopPropagation()
            e.preventDefault()

            const nodes = graph.getNodes().filter((n) => {
                const bbox = n.getBBox()
                return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox)
            })
            if (nodes && nodes.length) {
                const node = nodes[0]
                const model = node.getModel() as any
                const id = node.getID()
                const deltaY = e.deltaY
                let startIndex = Number(model.startIndex) || 0
                if (deltaY > 0) {
                    startIndex++
                } else {
                    startIndex--
                }
                startIndex = Math.max(0, Math.min(dataSource.length - maxDisplayCount, startIndex))
                graph.updateItem(id, { startIndex })
            }
        }

        const mouseDownHandler = (event: G6GraphEvent) => {
            const handler = event.target.cfg.onMouseDown
            if (handler) {
                handler(event)
            }
        }

        const mouseMoveHandler = (event: G6GraphEvent) => {
            const id = node.id
            const startPoint: any = node.scrollStartPoint
            if (startPoint) {
                const index = startPoint.index
                const currentPoint = { x: event.canvasX, y: event.canvasY }
                const distance = currentPoint.y - startPoint.y

                // 单位距离(滚动多少像素对应一条数据) = 总的可滚动距离 / 可滚动的数据数量
                const unitDistance = maxScrollHeight / maxIndex
                // 变化的序号数量 = 滚动总距离 / 单位距离
                const changedNumber = Math.floor(distance / unitDistance)
                // 当前序号 = (最小0，最大，变化后的值 )
                const currentIndex = Math.max(0, Math.min(maxIndex, index + changedNumber))
                graph.updateItem(id, { startIndex: currentIndex })
            }
        }

        const mouseUpHandler = () => {
            graph.updateItem(node.id, { scrollStartPoint: undefined })
        }

        const graphAny = graph as any

        graph.off('wheel', graphAny.wheel)
        graph.off('mousedown', graphAny.mouseDownHandler)
        graph.off('mousemove', graphAny.mouseMove)
        graph.off('mouseup', graphAny.mouseUpHandler)

        graph.on('wheel', wheelHandler)
        graph.on('mousedown', mouseDownHandler)
        graph.on('mousemove', mouseMoveHandler)
        graph.on('mouseup', mouseUpHandler)

        graphAny.wheel = wheelHandler
        graphAny.mouseDown = mouseDownHandler
        graphAny.mouseMove = mouseMoveHandler
        graphAny.mouseUp = mouseUpHandler

        return (
            <Rect style={{ flexDirection: 'row' }}>
                <Rect style={{ flex: 1 }}>
                    {/* 内容区 */}
                    {displayFieldList.map((item) => {
                        return itemRender(item, showScollBar)
                    })}
                </Rect>
                {/* 滚动条 */}
                {showScollBar && (
                    <Rect style={{ width: 10, stroke: '#eee', strokeOpacity: 0.7 }}>
                        {/* 滚块 */}
                        <Rect
                            style={{ margin: [scrollPercent, 0, 0, 0], fill: '#ccc', radius: 3, height: trackHeight, width: 10 }}
                            onMouseDown={(event) => {
                                graph.updateItem(node.id, { scrollStartPoint: { x: event.canvasX, y: event.canvasY, index: startIndex } })
                            }}
                        />
                    </Rect>
                )}
            </Rect>
        )
    }
}
export default G6Util
