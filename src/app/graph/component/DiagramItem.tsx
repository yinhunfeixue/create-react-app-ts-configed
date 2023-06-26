import IComponentProps from '@/base/interfaces/IComponentProps'
import React, { Component, ReactNode } from 'react'
import './DiagramItem.less'

interface IDiagramItemState {}
interface IDiagramItemProps extends IComponentProps {
    color: string
    label: ReactNode
}

/**
 * DiagramItem
 */
class DiagramItem extends Component<IDiagramItemProps, IDiagramItemState> {
    render() {
        const { color, label } = this.props
        return (
            <div className='DiagramItem'>
                <div className='Pill' style={{ background: color }} />
                {label}
            </div>
        )
    }
}

export default DiagramItem
