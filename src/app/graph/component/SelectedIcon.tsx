import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import React, { Component } from 'react'
import './SelectedIcon.less'

interface ISelectedIconState {}
interface ISelectedIconProps extends IComponentProps {}

/**
 * SelectedIcon
 */
class SelectedIcon extends Component<ISelectedIconProps, ISelectedIconState> {
    render() {
        return (
            <div className='SelectedIconWrap'>
                <div className='SelectedIconBg'>
                    <IconFont className='SelectedIcon' type='e679' useCss />
                </div>
            </div>
        )
    }
}

export default SelectedIcon
