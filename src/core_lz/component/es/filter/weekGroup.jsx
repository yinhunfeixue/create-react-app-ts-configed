import React from 'react'
import {Col, DatePicker} from 'antd';
import _ from 'underscore';
/*
    用Row包裹
    具体使用可参见 src/app/managementSpliteFilter/transaction.jsx
    controllerData: 里面具体有以下参数
        与其他组件类似
 */

export default class WeekGroup extends React.Component {

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

            if (key == 'week') {
                const copyWeek = item == null
                    ? ''
                    : item.format('YYYYMMDD');
                fromData.endDate = item == null
                    ? ''
                    : moment(copyWeek).endOf('week').subtract(2, "days").format('YYYYMMDD');
                fromData.startDate = item == null
                    ? ''
                    : moment(copyWeek).startOf('week').format('YYYYMMDD');
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
        let {
            width,
            labelCol,
            wrapperCol,
            name,
            options,
            label,
            allowClear
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
                <DatePicker disabledDate={(currentDate) => {
                        return (currentDate.weekday() === 5 || currentDate.weekday() === 6);
                    }} allowClear={allowClear
                        ? allowClear
                        : false} value={this.state.controllerData[name]} format="YYYY-MM-DD" onChange={this.onDataChange.bind(this, name)}/>
            </div>
        </Col>);
    }
}
