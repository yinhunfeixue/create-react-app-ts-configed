import { Col, message, Select } from 'antd'
import immutable from 'immutable'
import React from 'react'
import _ from 'underscore'
/*
    用Row包裹
    具体使用可参见 src/app/managementSpliteFilter/limithold.jsx
    inputSelectData:    输入下拉框的数据

    controllerData:     里面具体有以下参数
                        regRule:                    校验规则
                        regInfo:                    校验不成功后提示语
    function            customSelectOnHandleChange  值改变触发的事件，可以外部传 也可以自己配置校验规则和校验失败的提示信息
                        customSelectOnBlur           鼠标移开时触发，调用props.customSelectOnChange方法，把得到的数据放到state里
 */

export default class CustomSelectGroup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || {},
            inputSelectData: [],
        }

        this.prevCustomSelectData = [] //上一次填写的客户号，如果下一次onblur的值一样，不在发请求，防止重复渲染

        this.onDataChange = this.onDataChange.bind(this)
        this.customSelectOnHandleChange = this.customSelectOnHandleChange.bind(this)
        this.customSelectOnBlur = this.customSelectOnBlur.bind(this)
    }

    onDataChange(name, data) {
        this.setState({
            controllerData: {
                ...this.state.controllerData,
                [name]: data,
            },
        })
        if (this.props.onDataChange) {
            this.props.onDataChange(name, data)
        }
    }

    setControllerData(data, isAdd = false) {
        if (isAdd) {
            this.setState({
                controllerData: {
                    ...this.state.controllerData,
                    ...data,
                },
            })
            return this.getControllerData({
                ...this.state.controllerData,
                ...data,
            })
        } else {
            this.setState({ controllerData: data })
            return this.getControllerData(data)
        }
    }

    getControllerData(list) {
        let fromData = {}
        const copyDate = _.extend({}, list != undefined ? list : this.state.controllerData)

        _.map(copyDate, (item, key) => {
            if (['exchangeType', 'stockAccount', 'secuCode', 'customerNo', 'assetSection', 'prodCode', 'sexId'].indexOf(key) >= 0) {
                if (typeof item === 'string') {
                    fromData[key] = item
                } else {
                    fromData[key] = item.join(',')
                }
            } else {
                fromData[key] = item
            }
        })

        return fromData
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ controllers: nextProps.controllers })
    }

    setSignControllerData(name, data) {
        this.setState({
            controllerData: {
                ...this.state.controllerData,
                [name]: data,
            },
        })
    }

    delControllerData(name) {
        let data = this.state.controllerData
        if (data[name] != undefined) {
            delete data[name]
            this.setState({ controllerData: data })
        }
    }

    customSelectOnHandleChange(name, data, regRule, regInfo) {
        const check_data = data.length == 0 ? '00000000' : data[data.length - 1]
        const num_reg = regRule ? regRule : ''
        if (num_reg.test(check_data)) {
            this.onDataChange(name, data)
        } else {
            message.info(regInfo)
        }
    }

    customSelectOnBlur(name, data) {
        // console.log("customSelectOnBlur");
        const _this = this
        if (!immutable.is(immutable.fromJS(data), immutable.fromJS(this.prevCustomSelectData))) {
            this.props.customSelectOnChange(data, (res) => {
                const __data = res.map((v) => v.stock_account)
                _this.setState({
                    inputSelectData: res,
                    controllerData: {
                        ..._this.state.controllerData,
                        ['stockAccount']: __data,
                    },
                })
                _this.prevCustomSelectData = data
            })
        }
    }

    render() {
        let { width, labelCol, wrapperCol, name, label, placeholder, regRule, regInfo } = this.state.controllers

        let customSelectVal = this.state.controllerData[name]
        if (customSelectVal == undefined || customSelectVal == '') {
            customSelectVal = []
        }

        return (
            <Col span={width}>
                <div
                    style={{
                        display: 'inline-block',
                        width: labelCol ? labelCol : '42%',
                        textAlign: 'left',
                        float: 'left',
                        paddingTop: '4px',
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        float: 'left',
                        position: 'relative',
                        display: 'inline-block',
                        width: wrapperCol ? wrapperCol : '58%',
                    }}
                >
                    <Select
                        mode='tags'
                        value={customSelectVal}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                        }}
                        onChange={
                            this.props.customSelectOnHandleChange
                                ? this.props.customSelectOnHandleChange
                                : (e) => {
                                      this.customSelectOnHandleChange(name, e, regRule, regInfo)
                                  }
                        }
                        onBlur={(e) => {
                            this.customSelectOnBlur(name, e)
                        }}
                    ></Select>
                </div>
            </Col>
        )
    }
}
