import React from 'react'
import {Col, DatePicker} from 'antd';
import _ from 'underscore';
import moment from 'moment';
import 'moment/locale/zh-cn';

const {MonthPicker} = DatePicker;
moment.locale('zh-cn');
/*
    用Row包裹
    具体使用可参见 src/app/hrSpliteFilter/staff.jsx
    controllerData:  里面具体有以下参数
        controllerData[0]     开始月分
        controllerData[1]     结束月分
        与...其他组件类似
        startAllowClear：        开始日期是否可清除    默认值为false
        endAllowClear：          结束日期是否可清除   默认值为false

    function:
        onDataChange            值改变时的方法，非空，不传只改变自己的state
        setSignControllerData   设置初始值
        setControllerData       设置初始值 并返回与当前state合并之后的值
        getControllerData       返回state
        delControllerData       清空组件state
        onRangMonthChange       值改变时触发
 */

export default class RangeMonthPickerGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || []
        }

        //check月份选择disabled
        this.isRankMonthCheck = {
            startMonth: undefined,
            endMonth: undefined
        };

        // bind function
        this.onDataChange = this.onDataChange.bind(this);
    }

    onRangMonthChange(name, data) {
        this.isRankMonthCheck[name] = data.valueOf();

        if (this.props.onRangMonthChange) {
            this.props.onRangMonthChange({[name]: data.format('YYYYMM')});
        }
        this.setState({
            controllerData: {
                ...this.state.controllerData,
                [name]: data
            }
        });
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

            if (['startMonth', 'endMonth'].indexOf(key) >= 0) {
                if (item instanceof moment) {
                    fromData[key] = item == null
                        ? ''
                        : item.format('YYYYMM');
                } else {
                    fromData[key] = item == null
                        ? ''
                        : item;
                }
            } else {
                fromData[key] = item;
            }
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
        let startMonthConfig = this.state.controllers[0],
            startAllowClear = startMonthConfig.allowClear,
            startMonthWidth = startMonthConfig.width,
            startMonthLabelCol = startMonthConfig.labelCol,
            startMonthWrapperCol = startMonthConfig.wrapperCol,
            startMonthName = startMonthConfig.name,
            startMonthLabel = startMonthConfig.label,

            endMonthConfig = this.state.controllers[1],
            endAllowClear = endMonthConfig.allowClear,
            endMonthWidth = endMonthConfig.width,
            endMonthLabelCol = endMonthConfig.labelCol,
            endMonthWrapperCol = endMonthConfig.wrapperCol,
            endMonthName = endMonthConfig.name,
            endMonthLabel = endMonthConfig.label;

        const startMonthValue = this.state.controllerData[startMonthName];
        this.isRankMonthCheck[startMonthName] = startMonthValue
            ? startMonthValue.valueOf()
            : '';

        const endMonthValue = this.state.controllerData[endMonthName];
        this.isRankMonthCheck[endMonthName] = endMonthValue
            ? endMonthValue.valueOf()
            : '';

        return (<div>
            <Col span={startMonthWidth}>
                <div style={{
                        display: 'inline-block',
                        width: startMonthLabelCol
                            ? startMonthLabelCol
                            : '42%',
                        textAlign: 'left',
                        float: 'left',
                        paddingTop: '4px'

                    }}>
                    {startMonthLabel}
                </div>
                <div style={{
                        float: 'left',
                        position: 'relative',
                        display: 'inline-block',
                        width: startMonthWrapperCol
                            ? startMonthWrapperCol
                            : '58%'
                    }}>
                    <MonthPicker allowClear={startAllowClear
                            ? startAllowClear
                            : false} disabledDate={current => {
                            return this.isRankMonthCheck.endMonth
                                ? current && this.isRankMonthCheck.endMonth < current.valueOf()
                                : false
                        }} value={this.state.controllerData[startMonthName]} onChange={this.onRangMonthChange.bind(this, startMonthName)}/>
                </div>
            </Col>
            <Col span={endMonthWidth}>
                <div style={{
                        display: 'inline-block',
                        width: endMonthLabelCol
                            ? endMonthLabelCol
                            : '42%',
                        textAlign: 'left',
                        float: 'left',
                        paddingTop: '4px'

                    }}>
                    {endMonthLabel}
                </div>
                <div style={{
                        float: 'left',
                        position: 'relative',
                        display: 'inline-block',
                        width: endMonthWrapperCol
                            ? endMonthWrapperCol
                            : '58%'
                    }}>
                    <MonthPicker allowClear={endAllowClear
                            ? endAllowClear
                            : false} disabledDate={current => {
                            return this.isRankMonthCheck.startMonth
                                ? current && current.valueOf() < this.isRankMonthCheck.startMonth
                                : false
                        }} value={this.state.controllerData[endMonthName]} onChange={this.onRangMonthChange.bind(this, endMonthName)}/>
                </div>
            </Col>
        </div>);
    }
}
