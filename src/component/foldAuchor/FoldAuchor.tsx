import IconFont from '@/component/IconFont'
import { Anchor } from 'antd'
import { AnchorContainer, AnchorProps } from 'antd/lib/anchor/Anchor'
import classNames from 'classnames'
import React, { Component } from 'react'
import './FoldAuchor.less'

interface IFoldAuchorState {
    visible: boolean
}
interface IFoldAuchorProps extends AnchorProps {
    getContainer?: () => AnchorContainer
}

/**
 * 可折叠的锚点
 */
class FoldAuchor extends Component<IFoldAuchorProps, IFoldAuchorState> {
    constructor(props: IFoldAuchorProps) {
        super(props)
        this.state = {
            visible: true,
        }
    }
    render() {
        const { children, className, style, ...anchorProps } = this.props
        const { visible } = this.state
        return (
            <div style={style} className={classNames('FoldAuchor', visible ? '' : 'FoldAuchorHide', className)}>
                {/* 折叠图标 */}
                <IconFont onClick={() => this.setState({ visible: !visible })} className={classNames('FoldAuchorIcon')} type='icon-you' />
                {/* 锚点 */}
                <Anchor affix={false} className='FoldAuchorAuthor' {...anchorProps} showInkInFixed>
                    {children}
                </Anchor>
            </div>
        )
    }
}

export default FoldAuchor
