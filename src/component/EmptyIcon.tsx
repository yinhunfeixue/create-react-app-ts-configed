import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import React, { Component, ReactNode } from 'react'

interface IEmptyIconState {}
interface IEmptyIconProps extends IComponentProps {
    description?: React.ReactNode
    title?: string

    /**
     * 字体图标类型
     */
    type?: string

    /**
     * 字体图标字号
     */
    iconSize?: number

    /**
     * 自定义图标元素
     */
    icon?: ReactNode
}

/**
 * EmptyIcon
 */
class EmptyIcon extends Component<IEmptyIconProps, IEmptyIconState> {
    render() {
        const { description = '暂无数据', title, className, style, type, icon, iconSize = 52 } = this.props
        return (
            <div style={{ textAlign: 'center', margin: 32, ...style }} className={className}>
                <div style={{ marginBottom: 16 }}>{icon || <IconFont type={type || 'icon-kongzhuangtai'} style={{ fontSize: iconSize }} />}</div>
                {title && (
                    <p
                        style={{
                            color: '#2D3033',
                            fontSize: 14,
                            marginBottom: 8,
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </p>
                )}
                <p style={{ color: '#5E6266' }}>{description}</p>
            </div>
        )
    }
}

export default EmptyIcon
