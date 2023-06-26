import React, { Component } from 'react'
import './index.less'
export default class CollapseLabel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            visibleBtn: false,
        }
    }
    componentDidMount = () => {
        this.getVisibleBtn()
    }
    onFold = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    getVisibleBtn = () => {
        let containerWidth = this.labelArea.clientWidth - 50
        let eleWidth = this.collapseValue.clientWidth
        console.log(containerWidth, eleWidth, 'eleWidth')
        this.setState({
            visibleBtn: eleWidth == containerWidth ? true : false
        })
    }
    render() {
        const { visible,  visibleBtn } = this.state
        const { value } = this.props
        return (
            <div className='collapseLabel'>
                <div className='labelArea' ref={(dom) => this.labelArea = dom}>
                    <span ref={(dom) => this.collapseValue = dom} className={visible?'collapseValue':'collapse collapseValue'}>
                        {value}
                    </span>
                    {
                        visibleBtn?
                            <span className='moreBtn' onClick={this.onFold}>
                                <span className={visible ? 'iconfont icon-shang' : 'iconfont icon-xiangxia'}></span>
                            </span>
                            :null
                    }
                </div>
            </div>
        )
    }
}
