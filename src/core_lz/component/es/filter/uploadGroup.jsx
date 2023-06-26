import React from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Col, Upload } from 'antd';

const Dragger = Upload.Dragger;
/*
    用Row包裹

    controllerData:         里面具体有以下参数
        iconType            区域中间图标样式
        text                区域中间文字
        accept	            接受上传的文件类型,
        customRequest	    通过覆盖默认的上传行为，可以自定义自己的上传实现
        multiple:           是否多选
        showUploadList:     是否展示 uploadList, 可设为一个对象，用于单独设定 showPreviewIcon 和 showRemoveIcon
        Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean }
        onRemove  	        点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。
 */

export default class UploadGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllers: this.props.controllers || {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({controllers: nextProps.controllers});
    }

    render() {
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            label,
            uploadprops,
            iconType,
            text,
            forWhat
        } = this.state.controllers;
        // console.log(this.state.controllers);
        return (forWhat && forWhat === 'form')
        ? <Dragger {...uploadprops}>
            <p className="ant-upload-drag-icon">
                <LegacyIcon type={iconType
                        ? iconType
                        : "inbox"}/>
            </p>
            <p className="ant-upload-text">{
                    text
                        ? text
                        : '请上传内容'
                }</p>
        </Dragger>
        : <Col span={width}>
            <div style={{
                    display: 'inline-block',
                    width: labelCol,
                    textAlign: 'left',
                    float: 'left',
                    paddingTop: '4px'
                }}>
                {label}
            </div>
            <div style={{
                    float: 'left',
                    position: 'relative',
                    display: 'inline-block',
                    width: wrapperCol
                }}>
                <Dragger {...uploadprops}>
                    <p className="ant-upload-drag-icon">
                        <LegacyIcon type={iconType
                                ? iconType
                                : "inbox"}/>
                    </p>
                    <p className="ant-upload-text">{
                            text
                                ? text
                                : '请上传内容'
                        }</p>
                </Dragger>
            </div>
        </Col>;
    }
}
