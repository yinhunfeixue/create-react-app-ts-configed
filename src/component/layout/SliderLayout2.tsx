import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './SliderLayout2.less'

interface ISliderLayout2State {
    visibleSlider: boolean
}
interface ISliderLayout2Props extends IComponentProps {
    renderSlider: () => ReactNode
    renderContent: () => ReactNode
}

/**
 * SliderLayout2
 */
class SliderLayout2 extends Component<ISliderLayout2Props, ISliderLayout2State> {
    constructor(props: ISliderLayout2Props) {
        super(props)
        this.state = {
            visibleSlider: true,
        }
    }

    render() {
        const { renderSlider, renderContent, className, style } = this.props
        const { visibleSlider } = this.state
        return (
            <div className={classNames('SliderLayout2', className)} style={style}>
                <div className={classNames('Slider', visibleSlider ? 'SliderVisible' : '')}>
                    <div className='SliderContentWrap'>
                        <div className='SliderContent'>{renderSlider()}</div>
                    </div>
                    <div className='IconSwitch' onClick={() => this.setState({ visibleSlider: !visibleSlider })}>
                        <IconFont type={visibleSlider ? 'icon-zuo' : 'icon-you'} />
                    </div>
                </div>
                <main>{renderContent()}</main>
            </div>
        )
    }
}

export default SliderLayout2
