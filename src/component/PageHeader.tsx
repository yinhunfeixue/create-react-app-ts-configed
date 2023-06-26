import React, { Component, ReactNode } from 'react'
import './PageHeader.less'

interface IPageHeaderState {}
interface IPageHeaderProps {
    title: ReactNode
    extra?: ReactNode
    onBack?: () => void
}

/**
 * 页头
 * 包含：返回键、标题、右则扩展区
 */
class PageHeader extends Component<IPageHeaderProps, IPageHeaderState> {
    render() {
        const { extra, title, onBack } = this.props
        return (
            <div className='PageHeader'>
                <div className='nameContainer'>
                    <div
                        className='back'
                        onClick={() => {
                            if (onBack) {
                                onBack()
                            } else {
                                if (history.length > 1) {
                                    history.back()
                                } else {
                                    window.close()
                                }
                            }
                        }}
                    >
                        <span className='iconfont icon-zuo'></span>
                    </div>
                    <div className='taskName'>{title}</div>
                </div>
                <div className='PageHeaderExtra'>{extra}</div>
            </div>
        )
    }
}

export default PageHeader
