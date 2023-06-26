import IComponentProps from '@/base/interfaces/IComponentProps'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './GraphPageLayout.less'

interface IGraphPageLayoutState {
    isFull: boolean
}
interface IGraphPageLayoutProps extends IComponentProps {
    /**
     * 头部内容
     */
    headerChildren?: ReactNode

    /**
     * 主体内容
     */
    mainChildren: ReactNode
    renderControlChildren?: (params: IGraphPageLayoutControlParams) => ReactNode
    defaultIsFull?: boolean
    renderRightSliderChildren?: () => ReactNode
}

export interface IGraphPageLayoutControlParams {
    isFull: boolean
    fullFunction: () => void
}

/**
 * GraphPageLayout
 */
class GraphPageLayout extends Component<IGraphPageLayoutProps, IGraphPageLayoutState> {
    constructor(props: IGraphPageLayoutProps) {
        super(props)
        this.state = {
            isFull: Boolean(props.defaultIsFull),
        }
    }

    private fullFunction = () => {
        const { isFull } = this.state
        this.setState({ isFull: !isFull })
    }

    render() {
        const { headerChildren, renderControlChildren, mainChildren, className, style, renderRightSliderChildren } = this.props
        const { isFull } = this.state
        return (
            <div className={classNames('GraphPageLayout', className)} style={style}>
                <div className={classNames('GraphPageLayoutWrap', isFull ? 'GraphPageLayoutWrapFull' : '')}>
                    {/* 顶部黑条 */}
                    {headerChildren && <div className='GraphPageLayoutHeader'>{headerChildren}</div>}
                    <main>
                        {/* 图表区 */}
                        <div className='ChartWrap'>
                            {/* 操作区 */}
                            {renderControlChildren && (
                                <div className='GraphPageLayoutControlContainer'>
                                    {renderControlChildren({
                                        isFull,
                                        fullFunction: this.fullFunction,
                                    })}
                                </div>
                            )}
                            {/* 图表区 */}
                            <div className='Chart'>{mainChildren}</div>
                        </div>
                        {/* 右侧弹出区 */}
                        {renderRightSliderChildren && <div className='RightSlider'>{renderRightSliderChildren()}</div>}
                    </main>
                </div>
            </div>
        )
    }
}

export default GraphPageLayout
