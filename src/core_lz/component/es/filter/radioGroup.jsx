import React from 'react'
import {Col, Radio} from 'antd';
import _ from 'underscore';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
/*
    用Row包裹
    具体使用可参见 src/app/hrSpliteFilter/dep.jsx
    controllerData:      里面具体有以下参数
        width:           Col的span 数字
        labelCol：       label的宽度 百分比
        wrapperCol：     按钮的宽度 百分比
        className：      样式名
        name：           controllers里的字段名
        label:           组件祖册label
        defaultValue:    默认值
        radioSize:       radio大小  默认值为 large
        radioOptions:    数组对象，里面时键值对  例如： [{label: '男',value: '1'}, {label: '女',value: '2'}]
        placeholder:     placeholder
        haveConnect:    是否有与其他组件有关联，
                        true  代表有关联
                        false 代表没有关联
                        有关联的话就调用传进来的  config.onChangBtn；没有的话就调用自己    onDataChange   区别看hr系统的人员画像部门类型与其他radio

    function:
        onDataChange            值改变时的方法，非空，不传只改变自己的state
        setSignControllerData   设置初始值
        setControllerData       设置初始值 并返回与当前state合并之后的值
        getControllerData       返回state
        delControllerData       清空组件state
 */

export default class RadioGroupFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || {}
        }

        this.onDataChange = this.onDataChange.bind(this);
    }

    onDataChange(name, data) {
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
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            haveConnect,
            onChangBtn,
            placeholder,
            radioOptions,
            label,
            defaultValue,
            className,
            radioSize
        } = this.state.controllers;

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
                <RadioGroup onChange={haveConnect
                        ? onChangBtn
                        : (e) => {
                            this.onDataChange(name, e.target.value)
                        }} placeholder={placeholder} className={className || ''} defaultValue={defaultValue} size={radioSize
                        ? radioSize
                        : 'large'}>
                    {
                        _.map(radioOptions, function(option, index) {
                            return <RadioButton value={option.value} key={index}>{option.label}</RadioButton>;
                        })
                    }
                </RadioGroup>
            </div>
        </Col>);
    }
}
