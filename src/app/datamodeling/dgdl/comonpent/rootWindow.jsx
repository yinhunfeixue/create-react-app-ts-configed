import React, { Component } from 'react'
import '../../index.less'
import { Tooltip } from 'antd'

class RootWindow extends Component {
    render() {
        const { renderNumber, openModal} = this.props
        return (
            <div className='rootWindow' onClick={openModal}>
                <div className='number'>
                    {renderNumber()}
                </div>
                <Tooltip placement='left' title='若存在备选词根，需对其信息补充'>
                    <div className='title'>备选词根</div>
                </Tooltip>
            </div>
        )
    }
}

export default RootWindow