import IComponentProps from '@/base/interfaces/IComponentProps'
import React, { Component } from 'react'

interface IEmptyLabelState {}
interface IEmptyLabelProps extends IComponentProps {}

/**
 * EmptyLabel
 */
class EmptyLabel extends Component<IEmptyLabelProps, IEmptyLabelState> {
    render() {
        return <span className='EmptyLabel'>-</span>
    }
}

export default EmptyLabel
