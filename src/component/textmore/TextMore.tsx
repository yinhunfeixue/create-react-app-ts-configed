import IComponentProps from '@/base/interfaces/IComponentProps'
import classNames from 'classnames'
import React, { Component } from 'react'
import './TextMore.less'

interface ITextMoreState {
    showMore: boolean
    visibleAll: boolean
}
interface ITextMoreProps extends IComponentProps {
    lineHeight?: number
    maxLine?: number
}

/**
 * TextMore
 */
class TextMore extends Component<ITextMoreProps, ITextMoreState> {
    private container: HTMLElement | null = null

    constructor(props: ITextMoreProps) {
        super(props)
        this.state = {
            showMore: false,
            visibleAll: false,
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResizeHandler)
        this.updateShowMore()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler)
    }

    private windowResizeHandler = () => {
        this.updateShowMore()
    }

    private updateShowMore() {
        if (!this.container) {
            return
        }
        // 计算container的高度，如果高度大于
        const containerHeight = this.container.offsetHeight
        let showMore = false
        if (containerHeight > this.maxHeight) {
            showMore = true
        }
        console.log('more', showMore)
        this.setState({ showMore })
    }

    private get maxHeight() {
        const { lineHeight = 21, maxLine = 1 } = this.props
        return lineHeight * maxLine
    }

    private renderControl() {
        const { showMore, visibleAll } = this.state
        if (!showMore) {
            return
        }

        return (
            <a className='TextMoreControl' onClick={() => this.setState({ visibleAll: !visibleAll })}>
                {visibleAll ? '收起' : '更多'}
            </a>
        )
    }

    render() {
        const { children, lineHeight } = this.props
        const { visibleAll } = this.state
        return (
            <div
                style={{
                    lineHeight: `${lineHeight}px`,
                    maxHeight: visibleAll ? 'unset' : `${this.maxHeight}px`,
                    overflow: 'hidden',
                }}
                className={classNames('TextMoreWrap', visibleAll ? 'TextMoreWrapVisibleAll' : '')}
            >
                <div
                    ref={(target) => {
                        this.container = target
                    }}
                >
                    {children}
                    {this.renderControl()}
                </div>
            </div>
        )
    }
}

export default TextMore
