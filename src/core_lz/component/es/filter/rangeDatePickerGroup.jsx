import React from 'react'
import {Col, DatePicker} from 'antd';
import _ from 'underscore';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
/*
    用Row包裹
    具体使用可参见 src/app/managementSpliteFilter/limithold.jsx
    controllerData: 里面具体有以下参数
        controllerData[0]     开始日期
        controllerData[1]     结束日期
        与...其他组件类似
        startAllowClear：        开始日期是否可清除    默认值为false
        endAllowClear：          结束日期是否可清除   默认值为false

    function:
        onDataChange            值改变时的方法，非空，不传只改变自己的state
        setSignControllerData   设置初始值
        setControllerData       设置初始值 并返回与当前state合并之后的值
        getControllerData       返回state
        delControllerData       清空组件state

 */

export default class RangeDatePickerGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            controllerData: {},
            controllers: this.props.controllers || []
        }

        // bind function

        this.intervalDateOnChange = this.intervalDateOnChange.bind(this);
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

            if (['startDate', 'endDate', 'startDate1', 'endDate1'].indexOf(key) >= 0) {
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

    disabledStartDate = (startValue, index) => {
        const endValue = this.state.controllerData['endDate' + index];
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue, index) => {
        const startValue = this.state.controllerData['startDate' + index];
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() < startValue.valueOf();
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

    intervalDateOnChange(name, value) {
        let date = value == null
            ? ''
            : value.format("YYYYMMDD");
        this.onDataChange(name, value);
    }

    render() {
        let startDateConfig = this.state.controllers[0],
            startAllowClear = startDateConfig.allowClear,
            startDateWidth = startDateConfig.width,
            startDateLabelCol = startDateConfig.labelCol,
            startDateWrapperCol = startDateConfig.wrapperCol,
            startDateName = startDateConfig.name,
            startDateLabel = startDateConfig.label,
            startDisableIndex = startDateConfig.disableIndex,

            endDateConfig = this.state.controllers[1],
            endAllowClear = endDateConfig.allowClear,
            endDateWidth = endDateConfig.width,
            endDateLabelCol = endDateConfig.labelCol,
            endDateWrapperCol = endDateConfig.wrapperCol,
            endDateName = endDateConfig.name,
            endDateLabel = endDateConfig.label,
            endDisableIndex = endDateConfig.disableIndex;

        const startDateValue = this.state.controllerData[startDateName];
        const endDateValue = this.state.controllerData[endDateName];

        let startDateDom = "";
        if (startDateValue == undefined) {
            startDateDom = <DatePicker disabledDate={(e) => {
                    return this.disabledStartDate(e, startDisableIndex || '')
                }} format="YYYY-MM-DD" key={startDateLabel} style={{
                    width: '100%'
                }} onChange={value => {
                    this.intervalDateOnChange(startDateName, value)
                }} allowClear={startAllowClear
                    ? startAllowClear
                    : true}/>;
        } else {
            startDateDom = <DatePicker disabledDate={(e) => {
                    return this.disabledStartDate(e, startDisableIndex || '')
                }} format="YYYY-MM-DD" key={startDateLabel} style={{
                    width: '100%'
                }} value={startDateValue} onChange={value => {
                    this.intervalDateOnChange(startDateName, value)
                }} allowClear={startAllowClear
                    ? startAllowClear
                    : true}/>;
        }

        let endDateDom = "";
        if (endDateValue == undefined) {
            endDateDom = <DatePicker disabledDate={(e) => {
                    return this.disabledEndDate(e, endDisableIndex || '')
                }} format="YYYY-MM-DD" key={endDateLabel} style={{
                    width: '100%'
                }} onChange={value => {
                    this.intervalDateOnChange(endDateName, value)
                }} allowClear={endAllowClear
                    ? endAllowClear
                    : true}/>;
        } else {
            endDateDom = <DatePicker disabledDate={(e) => {
                    return this.disabledEndDate(e, endDisableIndex || '')
                }} format="YYYY-MM-DD" key={endDateLabel} style={{
                    width: '100%'
                }} value={endDateValue} onChange={value => {
                    this.intervalDateOnChange(endDateName, value)
                }} allowClear={endAllowClear
                    ? endAllowClear
                    : true}/>;
        }

        return (<div>
            <Col span={startDateWidth}>
                <div style={{
                        display: 'inline-block',
                        width: startDateLabelCol
                            ? startDateLabelCol
                            : '42%',
                        textAlign: 'left',
                        float: 'left',
                        paddingTop: '4px'

                    }}>
                    {startDateLabel}
                </div>
                <div style={{
                        float: 'left',
                        position: 'relative',
                        display: 'inline-block',
                        width: startDateWrapperCol
                            ? startDateWrapperCol
                            : '58%'
                    }}>
                    {startDateDom}</div>
            </Col>
            <Col span={endDateWidth}>
                <div style={{
                        display: 'inline-block',
                        width: endDateLabelCol
                            ? endDateLabelCol
                            : '42%',
                        textAlign: 'left',
                        float: 'left',
                        paddingTop: '4px'

                    }}>
                    {endDateLabel}
                </div>
                <div style={{
                        float: 'left',
                        position: 'relative',
                        display: 'inline-block',
                        width: endDateWrapperCol
                            ? endDateWrapperCol
                            : '58%'
                    }}>
                    {endDateDom}
                </div>
            </Col>
        </div>);
    }
}
