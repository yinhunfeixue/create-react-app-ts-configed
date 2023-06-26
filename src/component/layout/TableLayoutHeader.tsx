import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import React, { Component, ReactNode } from 'react'
import './TableLayoutHeader.less'

interface ITableLayoutHeaderState {}
export interface ITableLayoutHeaderProps {
    /**
     * 标题
     */
    title?: ReactNode

    /**
     * 头部右侧
     */
    renderHeaderExtra?: () => ReactNode

    /**
     * 是否启用返回
     */
    enableBack?: boolean

    /**
     * 自定义返回方法，设置此值后，无需再设置enableBack
     */
    onBack?: () => void
}

/**
 * TableLayoutHeader
 */
class TableLayoutHeader extends Component<ITableLayoutHeaderProps, ITableLayoutHeaderState> {
    render() {
        const { title, renderHeaderExtra, enableBack, onBack } = this.props
        const showBack = Boolean(enableBack || onBack)
        if (!title && !renderHeaderExtra) {
            return null
        }
        return (
            <header className='TableLayoutHeader'>
                <h2>
                    {showBack && (
                        <IconFont
                            type='e713'
                            useCss
                            className='TableLayoutHeaderIconBack'
                            onClick={() => {
                                ProjectUtil.historyBack()
                            }}
                        />
                    )}
                    {title}
                </h2>
                <div className='TableLayout_HeaderExtraContainer'>{renderHeaderExtra && renderHeaderExtra()}</div>
            </header>
        )
    }
}

export default TableLayoutHeader
