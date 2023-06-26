import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import classNames from 'classnames'
import React, { Component, CSSProperties, ReactNode } from 'react'
import { Resizable } from 'react-resizable'
import './SliderLayout.less'
interface ISliderLayoutState {
    folded: boolean
    sliderWidth: number
}
interface ISliderLayoutProps extends IComponentProps {
    renderSliderHeader: () => ReactNode
    renderSliderBody: () => ReactNode
    renderContentHeader: () => ReactNode
    renderContentBody: () => ReactNode
    renderContentHeaderExtra?: () => ReactNode
    disabledFold?: boolean
    showScroller?: boolean

    sliderBodyStyle?: CSSProperties
}

/**
 * SliderLayout
 */
class SliderLayout extends Component<ISliderLayoutProps, ISliderLayoutState> {
    constructor(props: ISliderLayoutProps) {
        super(props)
        this.state = {
            folded: false,
            sliderWidth: 220,
        }
    }
    render() {
        const { className, sliderBodyStyle, style, disabledFold, showScroller, renderSliderHeader, renderSliderBody, renderContentHeader, renderContentBody, renderContentHeaderExtra } = this.props
        const { folded, sliderWidth } = this.state
        return (
            <div className={classNames('SliderLayout', folded ? 'SliderLayoutFoled' : '', className)} style={style}>
                <Resizable
                    width={sliderWidth}
                    height={0}
                    onResize={(event, data) => {
                        const { width } = data.size
                        const max = 400
                        const min = 220
                        this.setState({ sliderWidth: Math.min(max, Math.max(min, width)) })
                    }}
                    draggableOpts={{ enableUserSelectHack: true }}
                >
                    <div className='Slider' style={{ width: sliderWidth }}>
                        <header>{renderSliderHeader && renderSliderHeader()}</header>
                        <div style={sliderBodyStyle} className={classNames('ContentContainer', showScroller ? '' : 'HideScroll')}>
                            {renderSliderBody && renderSliderBody()}
                        </div>
                    </div>
                </Resizable>
                <main>
                    {!disabledFold && (
                        <IconFont
                            type={folded ? 'icon-zhankai1' : 'icon-shouqi1'}
                            className='IconFold'
                            onClick={() => {
                                this.setState({ folded: !folded })
                            }}
                        />
                    )}
                    {renderContentHeader && (
                        <header>
                            <span>{renderContentHeader()}</span>
                            {renderContentHeaderExtra && renderContentHeaderExtra()}
                        </header>
                    )}
                    <div className='ContentContainer'>{renderContentBody && renderContentBody()}</div>
                </main>
            </div>
        )
    }
}

export default SliderLayout
