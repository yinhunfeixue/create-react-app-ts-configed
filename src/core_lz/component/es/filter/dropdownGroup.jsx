import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu } from 'antd';
import _ from 'underscore';
/*
    用Row包裹
    具体使用可参见 src/app/managementSpliteFilter/limithold.jsx
    controllerData:     里面具体有以下参数
        dropList        下拉框项
 */

export default class DropdownGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || {}
        }

        this.onDataChange = this.onDataChange.bind(this);
    }

    onDataChange(name, data) {
        // console.log(name);
        // console.log(data);
        this.setState({
            controllerData: {
                ...this.state.controllerData,
                [name]: data
            }
        });
        if (this.props.onDataChange) {
            this.props.onDataChange(name, data);
        }
    }

    setControllerData(data, isAdd = false) {
        if (isAdd) {
            this.setState({
                controllerData: {
                    ...this.state.controllerData,
                    ...data
                }
            })
            return this.getControllerData({
                ...this.state.controllerData,
                ...data
            })
        } else {
            this.setState({controllerData: data});
            return this.getControllerData(data)
        }
    }

    getControllerData(list) {
        let fromData = {};
        const copyDate = _.extend(
            {}, list != undefined
            ? list
            : this.state.controllerData);

        _.map(copyDate, (item, key) => {
            fromData[key] = item;
        })

        return fromData
    }

    componentWillReceiveProps(nextProps) {
        this.setState({controllers: nextProps.controllers});
    }

    setSignControllerData(name, data) {
        this.setState({
            controllerData: {
                ...this.state.controllerData,
                [name]: data
            }
        })
    }

    delControllerData(name) {
        let data = this.state.controllerData;
        if (data[name] != undefined) {
            delete data[name];
            this.setState({controllerData: data});
        }
    }

    render() {
        // console.log(this.state.controllers);
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            label,
            placeholder,
            dropList,
            onClickBtn
        } = this.state.controllers;

        const __menu = (<Menu onClick={onClickBtn}>
            {
                dropList.map(item =>< Menu.Item key = {
                    item.id
                } > {
                    item.label
                } < /Menu.Item>)
                }
        </Menu>)

        const leftLabel = '';

        return (
            <Col span={width}>
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
                    <Dropdown overlay={__menu}>
                        <Button>
                            {label}
                            <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
            </Col>
        );
    }
}
