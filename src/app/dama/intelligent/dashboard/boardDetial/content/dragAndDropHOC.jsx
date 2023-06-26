import React from 'react'
import { DndContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const DragAndDropHOC = (props) => {
    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}

export default {
    HTML5: DndContext(HTML5Backend)(DragAndDropHOC)
}
