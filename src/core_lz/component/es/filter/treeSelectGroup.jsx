import React from 'react'
import {Col, TreeSelect} from 'antd';
import _ from 'underscore';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
/*
    用Row包裹
    具体使用可参见 src/app/hrSpliteFilter/dep.jsx
    controllerData: 里面具体有以下参数
        与其他组件类似
        multiple: 是否可多选
 */

export default class TreeSelectGroup extends React.Component {

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
            placeholder,
            label,
            className,
            treeData
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
                <TreeSelect value={this.state.controllerData[name]} onChange={(e) => {
                        this.onDataChange(name, e)
                    }} className={className || ''} placeholder={placeholder} treeDefaultExpandAll={true} showCheckedStrategy={SHOW_PARENT} treeData={treeData} treeCheckable="treeCheckable" style={{
                        width: '100%'
                    }} dropdownMatchSelectWidth={false} treeNodeFilterProp='label' dropdownClassName={'ant-select-dropdown-transaction'}/>
            </div>
        </Col>);
    }
}
