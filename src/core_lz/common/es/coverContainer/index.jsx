import React from 'react'
import './index.less'

const container = (props) => {
        return (
            <div className="cover_container">
                <div className='cover_container_content'>
                    {props.children}
                </div>
            </div>
        )
}
export default container