import IComponentProps from '@/base/interfaces/IComponentProps'
import ModuleTitle from '@/component/module/ModuleTitle'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './Module.less'

interface IModuleState {}
interface IModuleProps extends IComponentProps {
    renderHeaderExtra?: () => ReactNode
}

/**
 * Module
 */
class Module extends Component<IModuleProps, IModuleState> {
    render() {
        const { title, className, style, children, renderHeaderExtra } = this.props
        return (
            <div className={classNames('Module', className)} style={style}>
                <ModuleTitle title={title} renderHeaderExtra={renderHeaderExtra} className='ModuleTitle' />
                <main>{children}</main>
            </div>
        )
    }
}

export default Module
