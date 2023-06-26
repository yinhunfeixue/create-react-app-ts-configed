import IComponentProps from '@/base/interfaces/IComponentProps'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './ModuleTitle.less'

interface IModuleTitleState {}
interface IModuleTitleProps extends IComponentProps {
    renderHeaderExtra?: () => ReactNode
    suffix?: ReactNode,
}

/**
 * ModuleTitle
 */
class ModuleTitle extends Component<IModuleTitleProps, IModuleTitleState> {
    render() {
        const { title, renderHeaderExtra, className, style, suffix = '' } = this.props
        return (
            <header className={classNames('ModuleTitle', className)} style={style}>
                <h2>{title}{suffix}</h2>
                <div>{renderHeaderExtra && renderHeaderExtra()}</div>
            </header>
        )
    }
}

export default ModuleTitle
