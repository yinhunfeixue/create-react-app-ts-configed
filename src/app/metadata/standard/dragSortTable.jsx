import { Table } from 'antd'
import update from 'immutability-helper'
import React from 'react'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

let dragingIndex = -1

class BodyRow extends React.Component {
    render() {
        const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props
        const style = { ...restProps.style, cursor: 'move' }

        let { className } = restProps
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += ' drop-over-downward'
            }
            if (restProps.index < dragingIndex) {
                className += ' drop-over-upward'
            }
        }

        return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />))
    }
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index
        return {
            index: props.index,
        }
    },
}

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
    },
}

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource('row', rowSource, (connect) => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow)
)


export default class DragSortingTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.dataSource,
        }
    }

    components = {
        body: {
            row: DragableBodyRow,
        },
    }

    moveRow = async (dragIndex, hoverIndex) => {
        if (this.props.from == 'dataTable' && !this.props.canMove) {
            return
        }
        const { data } = this.state
        const dragRow = data[dragIndex]

        await this.setState(
            update(this.state, {
                data: {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                },
            })
        )
        this.props.getSortData(this.state.data)
    }

    componentWillReceiveProps = (nextProps) =>{
        this.setState({data: nextProps.dataSource})
    }

    render() {
        console.log(this.state.data, 'columnList++++')
        return (
            <DndProvider backend={HTML5Backend}>
                <Table
                    className={this.props.className}
                    rowKey={this.props.rowKey}
                    columns={this.props.columns}
                    dataSource={this.state.data}
                    // components={this.components}
                    rowClassName={() => 'editable-row'}
                    pagination={false}
                    // onRow={(record, index) => ({
                    //     index,
                    //     moveRow: this.moveRow,
                    // })}
                    {...this.props}
                />
            </DndProvider>
        )
    }
}

// ReactDOM.render(<DragSortingTable />, mountNode);
