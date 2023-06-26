import React, { Component } from 'react'
import './index.less'
import DownArrow from 'app_images/downArrow.svg'
import LeftArrow from 'app_images/leftArrow.svg'
export default class DataList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
        }
    }

    onFold = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render() {
        const { visible } = this.state
        let blockClass = visible ? 'block' : 'collseBlock'
        let bodyClass = this.props.disabled ? 'disableBlock' : this.props.bodyClass ? this.props.bodyClass + ' foldBlock' : 'foldBlock'
        let listStyle = this.props.listStyle || {}
        return (
            <div className={bodyClass}>
                <div className='foldHeader'>
                    <div className='arrowImg'>
                        {(!this.props.disabled && visible) ? <img onClick={this.onFold} className='foldIcon' src={DownArrow} /> : <img onClick={this.onFold} className='foldIcon' src={LeftArrow} />}
                    </div>
                    {
                        this.props.icon && <span class='Icon'>{this.props.icon}</span>
                    }
                    <span className='foldName'>{this.props.title}</span>
                </div>
                {/* {visible && <div className={blockClass}>{this.props.children}</div>} */}
                {(!this.props.disabled && visible) && <div className={blockClass} style={{ ...listStyle }}>{this.props.children}</div>}
            </div>
        )
    }
}
