import React from 'react'
import {Col, Select} from 'antd';
import _ from 'underscore';

const Option = Select.Option;
/*
    通过forWhat参数设置 是否放在form组件里使用
    默认不放在form组件里使用
    forWhat：form时 放在form组件里使用（就是自定义表单item，也可以不用自己封装的 直接用antd原生的输入控件，标准表单域，标签，下拉菜单，文本域等。）
    如果放在form组件里使用 就没有独立的setter和getter方法 统一通过 handleSubmit方法获取值

    不放在form组件时使用方法：
        用Row包裹
        具体使用可参见 src/app/hrSpliteFilter/dep.jsx
        controllerData: 里面具体有以下参数
                        与其他组件类似 buttons和checkBoxGroup 里详细说明，不在一一列举
                        multiple: 是否可多选

    放在form组件里使用方法：
    （优点： 1、可以设置校验规则
            2、字段统一通过handleSubmit方法获取到）
    首先看antd form 自定义表单控件的封装
    在自己封装组件的时候注意要理解文档里说的：
    自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：
        提供受控属性 value 或其它与 valuePropName 的值同名的属性。
        提供 onChange 事件或 trigger 的值同名的事件。
        不能是函数式组件。
    ※※※※※※※※※※※※注意这里的 triggerChange() 和 fixControlledValue 就是为了解决上述问题，否则在form组件（在src/component/form/form.jsx）handleSubmit方法中的 this.props.form.validateFields 取不到对应的 getFieldDecorator 时第一个参数的设置的字段名。※※※※※※※※※※※※
    具体可参见 src/app/example/filterAndForm.jsx,在index_lr.jsx里将 注释掉的 "key": "sub2" 那一项取消注释
    controllerData: 里面具体有以下参数
                    与其他组件类似
                    multiple: 是否可多选
    function :
    onDataChange:   下拉框值改变的时候，如果props有该方法，就调用此方法
 */

const fixControlledValue = (rawValue, type) => {
    if (rawValue) {
        return rawValue[type]
    } else {
        return undefined
    }
}

export default class SelectGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || {},
            value: ''
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
            if (key == 'year') {
                fromData.endDate = item == null
                    ? ''
                    : item;
            } else {
                fromData[key] = item;
            }
        })

        return fromData;
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
        });
    }

    delControllerData(name) {
        let data = this.state.controllerData;
        if (data[name] != undefined) {
            delete data[name];
            this.setState({controllerData: data});
        }
    }

    handleUnitChange(name, value) {
        this.setState({
            value
        }, () => {
            this.triggerChange()
        });

        if (this.props.onDataChange) {
            this.props.onDataChange(name, value);
        }
    }

    triggerChange() {
        const {onChange} = this.props;
        if (onChange) {
            onChange({value: this.state.value});
        }
    }

    render() {
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            options,
            label,
            placeholder,
            multiple,
            forWhat,
            showSearch
        } = this.state.controllers;

        const {value} = this.props
        const fixedUnit = fixControlledValue(value, 'value');

        return (
            (forWhat && forWhat === 'form')
            ? <Select showSearch={showSearch
                    ? showSearch
                    : true} mode={multiple
                    ? "multiple"
                    : undefined} onChange={(key) => {
                    this.handleUnitChange(name, key)
                }} value={fixedUnit} placeholder={placeholder} style={{
                    width: '100%'
                }}>
                {
                    _.map(options, function(option, index) {
                        return <Option value={option.value} key={index} disabled={option.disabled} title={option.label}>{option.label}</Option>;
                    })
                }
            </Select>
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
                            ? wrapperCol
                            : '58%'
                    }}>
                    <Select showSearch={true} mode={multiple
                            ? "multiple"
                            : undefined} onChange={(e) => {
                            this.onDataChange(name, e)
                        }} placeholder={placeholder} value={this.state.controllerData[name]} style={{
                            width: '100%'
                        }} optionFilterProp='children'>
                        {
                            _.map(options, function(option, index) {
                                return <Option value={option.value} key={index} disabled={option.disabled} title={option.label}>{option.label}</Option>;
                            })
                        }
                    </Select>
                </div>
            </Col>);
    }
}
