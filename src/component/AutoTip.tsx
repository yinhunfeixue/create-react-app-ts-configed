import IComponentProps from '@/base/interfaces/IComponentProps'
import { Tooltip, TooltipProps } from 'antd'
import classNames from 'classnames'
import lodash from 'lodash'
import React, { Component, CSSProperties, ReactNode } from 'react'
import './AutoTip.less'

interface IAutoTipState {
    showTooltip: boolean
}
interface IAutoTipProps extends IComponentProps {
    content: ReactNode
    toolTipClassName?: string
    toolTipStyle?: CSSProperties

    toolTipProps?: TooltipProps
}

/**
 * AutoTip
 */
class AutoTip extends Component<IAutoTipProps, IAutoTipState> {
    private wrapRef = React.createRef<HTMLDivElement>()
    private contentRef = React.createRef<HTMLSpanElement>()

    private debounceCheckTooltip: Function

    constructor(props: IAutoTipProps) {
        super(props)
        this.state = {
            showTooltip: false,
        }
        this.debounceCheckTooltip = lodash.debounce(this.checkTooltip, 1000)
    }

    componentDidMount() {
        this.debounceCheckTooltip()
        window.addEventListener('resize', this.resizeHandler)
    }

    componentDidUpdate() {
        this.debounceCheckTooltip()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    resizeHandler = () => {
        this.debounceCheckTooltip()
    }

    private checkTooltip() {
        const content = this.contentRef.current
        const wrap = this.wrapRef.current
        if (!content || !wrap) {
            return
        }
        const showTooltip = content.offsetWidth > wrap.clientWidth || content.offsetHeight > wrap.offsetHeight
        if (showTooltip !== this.state.showTooltip) {
            this.setState({ showTooltip })
        }
    }

    render() {
        const { content, style, className, onClick, toolTipClassName, toolTipStyle, toolTipProps, title } = this.props
        const { showTooltip } = this.state
        const isString = typeof content === 'string'

        const contentNode = isString ? <span title='' dangerouslySetInnerHTML={{ __html: content }} /> : <span title=''>{content}</span>

        const contentElement = (
            <div onClick={onClick} ref={this.wrapRef} style={style} className={classNames('AutoTip', className)}>
                {React.cloneElement(contentNode, { ref: this.contentRef })}
            </div>
        )
        return showTooltip ? (
            <Tooltip {...toolTipProps} style={toolTipStyle} overlayClassName={toolTipClassName} title={title || contentNode}>
                {contentElement}
            </Tooltip>
        ) : (
            contentElement
        )
    }
}

export default AutoTip
