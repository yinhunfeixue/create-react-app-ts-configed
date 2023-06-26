import TreeMap, { ICfg, NodeStyles } from '@/app/graph/component/TreeMap'
import NodePosition from '@/app/graph/enum/NodePosition'
import G6Util from '@/app/graph/G6Util'
import { ModelConfig } from '@antv/g6'
import { Group, Rect, Text } from '@antv/g6-react-node'
import { RectStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Rect'
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text'
import React from 'react'

/**
 * TableGraph
 */
class TableGraph extends TreeMap {
    protected override getContentStyle(state: keyof NodeStyles): RectStyle {
        return super.getContentStyle(state, { height: 66 })
    }

    protected override renderContent(param: { cfg: ModelConfig }) {
        const { position, extraData, children, isClone } = param.cfg as unknown as ICfg
        const headerStyle = this.getHeaderStyle(position)
        const headerTextStyle = this.getHeaderTextStyle(position)
        const footerStyle = this.getFooterStyle(position)

        const { tableEName, datasourceCName, databaseEname, tableId } = extraData
        // 表名
        const tableName = G6Util.fittingString(tableEName, this.tableNameWidth, this.tableNameFontSize)
        let dataSourceLabel = `${datasourceCName}/${databaseEname}`

        // 数据源名
        dataSourceLabel = G6Util.fittingString(dataSourceLabel, this.tableContentRectWidth - this.tableContentRectPadding * 2, this.dataSourceFontSize)

        const contentProps = this.getContentProps(param)

        const { hideMenu } = this.props

        const { isDebugger } = this

        const isLeaf = !isClone && (!children || !children.length) && position !== NodePosition.CENTER

        return (
            <Group>
                {/* 图标 + 表名 */}
                <Rect capture={false} style={headerStyle} {...contentProps}>
                    <Text capture={false} style={headerTextStyle} {...contentProps}>
                        {unescape('%ueb94')} {isDebugger ? tableId : ''} {tableName}
                    </Text>
                </Rect>
                {/* 数据源 */}
                <Text capture={false} style={footerStyle} {...contentProps}>
                    {dataSourceLabel}
                </Text>
                {/* 菜单 */}
                {isLeaf && !hideMenu && (
                    <Text
                        id='menuIcon'
                        zIndex={99}
                        style={
                            {
                                fill: '#5E6266',
                                cursor: 'pointer',
                                height: this.circleFontSize,
                                fontFamily: 'iconfont',
                                x: this.tableRectWidth,
                                y: this.circleFontSize + 10,
                                position: 'absolute',
                            } as TextStyle
                        }
                    >
                        {unescape('%ue6e8')}
                    </Text>
                )}
            </Group>
        )
    }
}

export default TableGraph
