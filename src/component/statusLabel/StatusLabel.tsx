import IComponentProps from '@/base/interfaces/IComponentProps'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import React, { Component } from 'react'
import './StatusLabel.less'
interface IStatusLabelState {}
interface IStatusLabelProps extends IComponentProps {
    type: 'success' | 'info' | 'warning' | 'error' | 'loading' | 'minus' | 'uncheck' | 'greyWarning' | 'originWarning' | 'greyWarning2' | 'disabled'
    message: string

    /**
     * 文字颜色是否同步为图标颜色，默认false
     */
    syncTextColor?: boolean
}

const ICONS = {
    success: 'icon-duifill1',
    info: 'icon-jinggaofill',
    warning: 'icon-jinggaofill',
    error: 'icon-cuofill',
    loading: 'loading',
    minus: 'icon-fillweiwancheng',
    uncheck: 'icon-duifill1',
    greyWarning: 'icon-jinggaofill',
    originWarning: 'icon-jinggaofill',
    greyWarning2: 'icon-gantan-fill',
    disabled: 'icon-jinyong',
}

const COLORS = {
    success: '#339933',
    info: '#4d73ff',
    warning: '#cc0000',
    error: '#cc0000',
    loading: 'black',
    minus: '#FF9900',
    uncheck: '#C4C8CC',
    greyWarning: '#888888',
    originWarning: '#FF9900',
    greyWarning2: '#C4C8CC',
    disabled: '#cc0000',
}
/**
 * StatusLabel
 */
class StatusLabel extends Component<IStatusLabelProps, IStatusLabelState> {
    render() {
        const { type, message, style, className, syncTextColor } = this.props
        const colorStyle = { color: COLORS[type] }
        return (
            <div className={classNames('StatusLabel', className)} style={style}>
                {type == 'loading' ? <LoadingOutlined className='Icon' /> : <span className={'Icon iconfont ' + ICONS[type]} style={colorStyle}></span>}
                <div style={syncTextColor ? colorStyle : undefined}>{message}</div>
            </div>
        )
    }
}

export default StatusLabel
