import React from 'react'
import {Col, Select} from 'antd';
import _ from 'underscore';

const Option = Select.Option;
/*
    用Row包裹
    具体使用可参见 src/app/managementSpliteFilter/limithold.jsx
    inputSelectData: 输入下拉框的数据

    controllerData: 里面具体有以下参数
 */

export default class InputSelectGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || {},
            inputSelectData: this.props.inputSelectData
                ? this.props.inputSelectData
                : []
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
            if ([
                'exchangeType',
                'stockAccount',
                'secuCode',
                'customerNo',
                'assetSection',
                'prodCode',
                'sexId'
            ].indexOf(key) >= 0) {
                if (typeof item === 'string') {
                    fromData[key] = item;
                } else {
                    fromData[key] = item.join(',');
                }

            } else {
                fromData[key] = item;
            }
        })

        return fromData
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            controllers: nextProps.controllers,
            inputSelectData: nextProps.inputSelectData
                ? nextProps.inputSelectData
                : []
        });
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
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            label,
            placeholder,
            mode
        } = this.state.controllers;

        let inputSelectVal = this.state.controllerData[name];
        if (inputSelectVal == undefined || inputSelectVal == '') {
            inputSelectVal = [];
        }

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
                {label}
            </div>
            <div style={{
                    float: 'left',
                    position: 'relative',
                    display: 'inline-block',
                    width: wrapperCol
                        ? wrapperCol
                        : '58%'
                }}>
                <Select mode={mode
                        ? mode
                        : "tags"} value={inputSelectVal} placeholder={placeholder} style={{
                        width: '100%'
                    }} onChange={(e) => {
                        this.onDataChange(name, e)
                    }}>
                    {this.state.inputSelectData.map(d => <Option key={d.stock_account} value={d.stock_account}>{d.stock_account}</Option>)}
                </Select>
            </div>
        </Col>);
    }
}
