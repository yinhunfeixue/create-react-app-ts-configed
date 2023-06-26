import BoardItem from '@/app/kpiCharts/components/BoardItem'
import IBoardData from '@/app/kpiCharts/interface/IBoardData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import classNames from 'classnames'
import React, { Component, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './BoardGroup.less'

interface IBoardGroupState {}
interface IBoardGroupProps extends IComponentProps {
    dataSource: IBoardData[]
    columnNumber: number
    onSortChange: (oldIndex: number, newIndex: number) => void
    onDeleteItem?: (id: string) => void
    disableDrag?: boolean
}

/**
 * BoardGroup
 */
class BoardGroup extends Component<IBoardGroupProps, IBoardGroupState> {
    private DraggableBoardItem(props: { data: IBoardData; disableDrag?: boolean; index: number; dropHandler: (oldIndex: number, newIndex: number) => void; onDeleteItem?: (id: string) => void }) {
        const type = 'boardItem'
        const { data, dropHandler, index, onDeleteItem, disableDrag } = props
        const [, drag] = useDrag({
            item: { data, type, index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        })

        const [{ isOver, dropClassName }, drop] = useDrop({
            accept: type,
            drop: (item, monitor) => {
                const { index: dragIndex } = monitor.getItem() || {}
                dropHandler(dragIndex, index)
            },
            collect(monitor) {
                const { index: dragIndex } = monitor.getItem() || {}
                if (index === dragIndex) {
                    return {}
                }
                return {
                    isOver: monitor.isOver(),
                    dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
                }
            },
        })

        const ref = useRef<HTMLDivElement>(null)

        if (!disableDrag) {
            drag(drop(ref))
        }

        return (
            <div ref={ref} className={classNames('BoardItemWrap', isOver ? dropClassName : '')}>
                {Boolean(onDeleteItem) && (
                    <IconFont
                        className='IconClose'
                        useCss
                        type='e672'
                        onClick={() => {
                            if (onDeleteItem) {
                                onDeleteItem(data.previewData.id)
                            }
                        }}
                    />
                )}
                <BoardItem data={data} />
            </div>
        )
    }

    private moveBoard = (newIndex: number, oldIdex: number) => {
        const { onSortChange } = this.props
        onSortChange(newIndex, oldIdex)
    }

    render() {
        const { dataSource, columnNumber = 3, onDeleteItem, disableDrag } = this.props
        // 把看板分成指定的列数后，再渲染
        const list: IBoardData[][] = new Array(columnNumber).fill(0).map(() => [])
        dataSource.forEach((item, index) => {
            const columnIndex = index % columnNumber
            list[columnIndex].push(item)
        })

        const content = (
            <div className='BoardGroup'>
                {list.map((column, columnIndex) => {
                    return (
                        <div className='Column'>
                            {column.map((item, index) => {
                                return disableDrag ? (
                                    <BoardItem data={item} />
                                ) : (
                                    <this.DraggableBoardItem
                                        onDeleteItem={onDeleteItem}
                                        index={columnNumber * index + columnIndex}
                                        data={item}
                                        key={item.previewData.id}
                                        dropHandler={this.moveBoard}
                                        disableDrag={disableDrag}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )

        return disableDrag ? content : <DndProvider backend={HTML5Backend}>{content}</DndProvider>
    }
}

export default BoardGroup
