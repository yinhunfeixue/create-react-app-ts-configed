import TreeMap from '@/app/graph/component/TreeMap'
import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import G6Util from '@/app/graph/G6Util'
import ITable from '@/app/graph/interface/ITable'
import { ModelConfig } from '@antv/g6'
import { Group, Rect, Text } from '@antv/g6-react-node'
import React from 'react'

/**
 * FieldGraph
 */
class FieldGraph extends TreeMap {
    protected override getNodeHeight(node: any) {
        const { nodeType, extraData } = node
        switch (nodeType) {
            case NodeType.icon:
            case NodeType.page:
            case NodeType.middle:
                return super.getNodeHeight(node)
            case NodeType.report:
                return 55
            default:
                const { fields } = extraData
                if (fields) {
                    return fields.length * 27 + 37
                }
        }
        return 70
    }

    protected override renderContent(param: { cfg: ModelConfig }): React.ReactNode {
        const { position, extraData }: { id: string; position: NodePosition; label: string; extraData: ITable; isClone: boolean; state: string; selected: boolean } = param.cfg as any

        const { tableEName, fields, tableId } = extraData

        const contentProps = this.getContentProps(param)
        const footerStyle = this.getFooterStyle(position)
        const headerTextStyle = this.getHeaderTextStyle(position)
        const { isDebugger } = this

        return (
            <Group capture={false}>
                {G6Util.renderScroller({
                    graph: this.graph,
                    node: param.cfg as any,
                    dataSource: fields,
                    itemHeight: 30,
                    itemRender: (item, scroll) => {
                        const { mark } = item
                        const { fieldCName, fieldEName, fieldId } = item
                        const fieldLabel = G6Util.fittingString(
                            `${isDebugger ? fieldId : ''}${fieldCName || fieldEName || ''}`,
                            scroll ? this.tableNameWidth - 20 : this.tableNameWidth,
                            this.tableNameFontSize
                        )
                        // 获取字段名称占用的宽度 1.5=左侧图标宽度 + 1个空白的宽度
                        const fieldWidth = G6Util.measureText(fieldLabel, this.tableNameFontSize) + this.tableNameFontSize * 1.5
                        return (
                            <Rect capture={false} style={{ height: 30 }}>
                                <Rect capture={false} style={{ flexDirection: 'row' }} {...contentProps}>
                                    <Text capture={false} style={{ ...headerTextStyle, width: fieldWidth }} {...contentProps}>
                                        {/* 字段图标  字段名   */}
                                        {unescape('%ue6c3')} {fieldLabel}
                                    </Text>
                                    {/* 定位图标 */}
                                    {mark && (
                                        <Text capture={false} style={{ fill: 'rgb(255, 102, 102)', fontFamily: 'iconfont' }}>
                                            {unescape('%ue6d9')}
                                        </Text>
                                    )}
                                </Rect>
                                {/* 分隔线 */}
                                <Rect capture={false} style={{ height: 1, fill: 'l(180) 0:rgba(163, 177, 191, 0) 1:rgba(163, 177, 191, 0.3)', margin: [6, 0, 6, 0] }} />
                            </Rect>
                        )
                    },
                })}

                {/* 表名 */}
                <Text capture={false} style={footerStyle} {...contentProps}>
                    {isDebugger ? tableId : ''}
                    {tableEName}
                </Text>
            </Group>
        )
    }
}

export default FieldGraph
