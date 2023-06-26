import { CaretDownOutlined, CaretRightOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { Component } from 'react'
import './index.less'
export default class DataList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
        }
    }

    onFold = () => {
        this.setState({
            visible: !this.state.visible,
        })
    }
    showDrawer = (viewId, businessId) => {
        console.log(this.props.disabled, 'this.props.disabled')
        this.props.showDrawer(viewId, businessId, true)
    }
    changeCreateSql = (viewId, businessId) => {
        if (this.props.disabled) {
            return
        }
        this.props.changeEditSql(viewId, businessId)
    }
    render() {
        const { visible } = this.state
        let blockClass = visible ? 'block' : 'collseBlock'
        let bodyClass = this.props.disabled ? 'disableBlock' : this.props.bodyClass ? this.props.bodyClass + ' menuCollspeWarp' : 'menuCollspeWarp'
        let listStyle = this.props.listStyle || {}
        return (
            <div className={bodyClass}>
                <div className='foldHeader'>
                    <div className='CollspeArrowIcon'>
                        {/* {!this.props.disabled && visible ? <img onClick={this.onFold} className='foldIcon' src={DownArrow} /> : <img onClick={this.onFold} className='foldIcon' src={LeftArrow} />} */}
                        {!this.props.disabled && visible ? (
                            <CaretDownOutlined onClick={this.onFold} className='foldIcon' />
                        ) : (
                            <CaretRightOutlined onClick={this.onFold} className='foldIcon' />
                        )}
                    </div>
                    {this.props.icon && <span class='Icon'>{this.props.icon}</span>}
                    <Tooltip placement='top' title={this.props.title}>
                        <span className='foldName'>{this.props.title}</span>
                    </Tooltip>
                    {this.props.showIcon ? (
                        <span style={{ zIndex: '99', marginLeft: '5px' }}>
                            <Tooltip
                                placement='top'
                                title={
                                    <span>
                                        切换数据集
                                        <br />
                                        修改后请重新输
                                        <br />
                                        入口径并保存
                                    </span>
                                }
                            >
                                <SwapOutlined
                                    onClick={this.showDrawer.bind(this, this.props.viewId, this.props.businessId)}
                                    style={{ marginRight: '8px', cursor: 'pointer', color: '#333' }} />
                            </Tooltip>
                            <Tooltip
                                placement='top'
                                title={
                                    <span>
                                        修改数据集
                                        <br />
                                        修改后请重新输
                                        <br />
                                        入口径并保存
                                    </span>
                                }
                            >
                                {!this.props.numberUsed && this.props.businessType == 8 ? (
                                    <EditOutlined
                                        onClick={this.changeCreateSql.bind(this, this.props.viewId, this.props.businessId)}
                                        style={{ cursor: this.props.disabled ? 'not-allowed' : 'pointer', color: this.props.disabled ? '#b3b3b3' : '#333' }} />
                                ) : null}
                            </Tooltip>
                        </span>
                    ) : null}
                </div>
                {!this.props.disabled && visible && (
                    <div style={{ paddingTop: '8px' }} className={blockClass} style={{ ...listStyle }}>
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }
}
