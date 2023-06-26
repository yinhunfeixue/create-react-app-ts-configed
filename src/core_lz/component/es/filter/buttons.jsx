import React from 'react'
import {Button, Col} from 'antd';
/*
    用Row包裹
    具体使用可参见 src/app/hrSpliteFilter/personal.jsx
    controllerData:     里面具体有以下参数
        width:          Col的span 数字
        leftLabel：     组件左侧的label （为了与其他组件统一，也有label，但是为 ''）
        labelCol：      label的宽度 百分比
        wrapperCol：    按钮的宽度 百分比
        name：          controllers里的字段名
        className :     样式名称
        style：         扩展样式
        onClickBtn :    点击回调函数
        value：         值
        disabled:       是否禁用状态
        label:          button的内容
 */

export default class Buttons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            controllers: this.props.controllers || {}
        }
    }

    render() {
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            className,
            style,
            onClickBtn,
            value,
            disabled,
            label
        } = this.state.controllers;
        let leftLabel = '';
        return (<Col span={width}>
            <div style={{
                    display: 'inline-block',
                    width: labelCol
                        ? labelCol
                        : '42%',
                    textAlign: 'left',
                    float: 'left',
                    paddingTop: '4px'
                }}>
                {leftLabel}
            </div>
            <div style={{
                    float: 'left',
                    position: 'relative',
                    display: 'inline-block',
                    width: wrapperCol
                        ? wrapperCol
                        : '58%'
                }}>
                <Button className={className || ''} style={style} onClick={onClickBtn} value={value} disabled={disabled || false}>{label}</Button>
            </div>
        </Col>);
    }
}
