import IComponentProps from '@/base/interfaces/IComponentProps'
import React, { Component } from 'react'

interface ISimpleEmptyState {}
interface ISimpleEmptyProps extends IComponentProps {}

/**
 * SimpleEmpty
 */
class SimpleEmpty extends Component<ISimpleEmptyProps, ISimpleEmptyState> {
    render() {
        const { className, style } = this.props
        return (
            <div className={className} style={{ marginTop: 80, textAlign: 'center', color: '#C4C8CC', ...style }}>
                - 暂无数据 -
            </div>
        )
    }
}

export default SimpleEmpty
