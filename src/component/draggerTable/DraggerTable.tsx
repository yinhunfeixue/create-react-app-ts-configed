import MoveController from '@/utils/MoveController'
import ProjectUtil from '@/utils/ProjectUtil'
import { Table, TableProps } from 'antd'
import classNames from 'classnames'
import update from 'immutability-helper'
import L from 'lodash'
import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import DragableBodyRow from './dragableBodyRow'
import './DraggerTable.less'

interface IDraggerTableState {
    totalWidth: number
    data: any
}
interface IDraggerTableProps<T> extends TableProps<T> {
    enableDrag?: boolean
    enableDragSort?: boolean
    getDragSortData?: Function
    dataSource?: any
}

/**
 * DraggerTable
 */
class DraggerTable<T extends object = any> extends Component<IDraggerTableProps<T>, IDraggerTableState> {
    private tableWrap: HTMLDivElement | null = null

    constructor(props: IDraggerTableProps<T>) {
        super(props)
        this.state = {
            totalWidth: 0,
            data: props.dataSource,
        }
    }

    private async updateColumnSize(updateTotalWidth = true) {
        const { columns } = this.props
        if (!columns || !columns.length) {
            return
        }
        if (this.tableWrap && document.body.contains(this.tableWrap)) {
            const table = this.tableWrap.getElementsByTagName('table')[0]
            let thList = Array.from(table.getElementsByTagName('th'))
            let colList = Array.from(table.getElementsByTagName('col'))
            // 获取所有内容列（排除选择列)
            const contentColumns = thList.filter((item) => !item.classList.contains('ant-table-selection-column') && !item.classList.contains('ant-table-row-expand-icon-cell'))
            const contentCol = colList.filter((item) => !item.classList.contains('ant-table-selection-col') && !item.classList.contains('ant-table-expand-icon-col'))
            for (let i = 0; i < contentColumns.length; i++) {
                if (columns[i]) {
                    const size = contentColumns[i].getBoundingClientRect()
                    columns[i].width = size.width || contentColumns[i].offsetWidth
                }
            }

            // 查找最后一个非fixed的列，清除width,并将对应的col元素最小宽度设置为80
            for (let i = columns.length - 1; i >= 0; i--) {
                const item = columns[i]
                if (!item.fixed) {
                    if (contentCol && contentCol[i]) {
                        contentCol[i].style.minWidth = '80px'
                    }
                    break
                }
            }

            // 计算scroll的值
            let totalWidth = this.tableWrap.getBoundingClientRect().width

            const fixedColumns = thList.filter((item) => {
                const classList = item.classList
                return classList.contains('ant-table-cell-fix-left') || classList.contains('ant-table-cell-fix-right')
            })
            for (let item of fixedColumns) {
                totalWidth -= (item as HTMLElement).offsetWidth
            }

            // 进入下一个宏任务再重新渲染，否则当1个tab放1表格，来回切换，列会消失
            await ProjectUtil.sleep()
            if (updateTotalWidth) {
                this.setState({ totalWidth })
            }
        }
    }

    componentDidMount(): void {
        // 如果dataSource、columns都有值，更新一次尺寸
        const { dataSource, columns } = this.props
        if (!ProjectUtil.isEmptyArray(dataSource) && !ProjectUtil.isEmptyArray(columns)) {
            this.updateColumnSize()
        }
    }

    componentDidUpdate(prevProps: IDraggerTableProps<T>) {
        // 如果dataSource 或 columns从空变为有值，更新一次尺寸
        const { dataSource, columns } = this.props
        if (!L.isEqual(prevProps.dataSource, dataSource) || !L.isEqual(prevProps.columns, columns)) {
            this.updateColumnSize()
        }
    }

    private getScrollValue() {
        const { tableWrap } = this
        if (tableWrap) {
            const content = tableWrap.getElementsByClassName('ant-table-content')[0] as HTMLElement
            if (content) {
                return content.scrollWidth - content.offsetWidth
            }
        }
        return 0
    }

    moveRow = (dragIndex: any, hoverIndex: any) => {
        const { getDragSortData, dataSource } = this.props
        const dragRow = dataSource[dragIndex]
        const hoverRow = dataSource[hoverIndex]
        let res = update(dataSource, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
            ],
        })
        getDragSortData && getDragSortData({ dragRow, hoverRow, newList: res })
    }

    render() {
        const { columns, enableDrag = true, enableDragSort = false } = this.props
        const { totalWidth } = this.state
        const useColumns = columns
            ? columns.map((item, index) => {
                  const { fixed } = item
                  if (enableDrag) {
                      item.onHeaderCell = (data) => {
                          return {
                              fixed,
                              index,
                          } as any
                      }
                  }
                  return item
              })
            : []

        const scrolling = this.getScrollValue() > 0
        return (
            <div
                ref={(target) => {
                    this.tableWrap = target
                }}
            >
                <DndProvider backend={HTML5Backend}>
                    <Table
                        {...this.props}
                        scroll={{
                            x: totalWidth,
                        }}
                        // 加上key的原因是为了解决table的bug：动态设置列宽导致出现滚动条时，不显示阴影
                        key={scrolling ? 1 : 0}
                        className={classNames('DraggerTable', enableDrag ? 'DraggerTableEnable' : '')}
                        columns={useColumns}
                        onRow={(record, index) => {
                            let propsOnRow = {}
                            if (this.props.onRow) {
                                propsOnRow = this.props.onRow(record, index)
                            }
                            return {
                                ...propsOnRow,
                                ...{
                                    index,
                                    moveRow: this.moveRow,
                                },
                            }
                        }}
                        components={{
                            body: enableDragSort
                                ? {
                                      row: DragableBodyRow,
                                  }
                                : {},
                            header: {
                                cell: (props: any) => {
                                    const { children, fixed, style, className, index, ...restProps } = props

                                    // 固定的列，不能拖动；但是左侧固定列可以拖;
                                    // 排除展开列（ant-table-row-expand-icon-cell）、选择列（position=sticky)
                                    const disabledColumnDrag =
                                        ((fixed || (style && style.position === 'sticky')) && fixed !== 'left') || (className && className.includes('ant-table-row-expand-icon-cell'))
                                    return (
                                        <th {...restProps} style={style} className={classNames(className, 'DraggerTh')}>
                                            {children}
                                            {enableDrag && !disabledColumnDrag && (
                                                <div
                                                    className='DragElement'
                                                    ref={(target) => {
                                                        if (target && !target.getAttribute('bind')) {
                                                            const th = target.parentElement
                                                            if (th) {
                                                                target.setAttribute('bind', '1')
                                                                new MoveController(
                                                                    target,
                                                                    th,
                                                                    (value) => {
                                                                        if (th) {
                                                                            if (columns) {
                                                                                columns[index].width = Math.max(80, value.x)
                                                                                this.forceUpdate()
                                                                            }
                                                                        }
                                                                    },
                                                                    () => {
                                                                        // this.updateColumnSize(false)
                                                                    }
                                                                )
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </th>
                                    )
                                },
                            },
                        }}
                    />
                </DndProvider>
            </div>
        )
    }
}

export default DraggerTable
