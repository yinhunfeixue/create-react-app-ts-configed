import IComponentProps from '@/base/interfaces/IComponentProps'
import EmptyLabel from '@/component/EmptyLabel'
import React, { Component, ReactNode } from 'react'

interface ITextItemState {}
interface ITextItemProps extends IComponentProps {
    value?: ReactNode
    render?: (value: ReactNode) => ReactNode
}

/**
 * TextItem
 */
class TextItem extends Component<ITextItemProps, ITextItemState> {
    render() {
        const { value, render } = this.props
        return render ? render(value) : value || <EmptyLabel />
    }
}

export default TextItem
