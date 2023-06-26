import React from 'react'
import './index.less'
function HeaderTitle(props) {
    const { name, method } = props
    return (
        <div className='nameContainer'>
            <div className='back' onClick={method}>
                <span className='iconfont icon-zuo'></span>
            </div>
            <div className="taskName">{name}</div>
        </div>
    )
}

export default HeaderTitle