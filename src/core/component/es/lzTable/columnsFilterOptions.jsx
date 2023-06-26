/**
 * @description 列表下拉列表组件封装
 */
import { Row, Col, Tooltip, Spin, Checkbox, Collapse } from 'antd'
// import Highlighter from 'react-highlight-words';
import React, { Component } from 'react'
import _ from 'underscore'
import './style.less'

const { Panel } = Collapse;

export default class ColumnsFilterOptions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataList: [{ id: 1, name: '' }],
            checkedValues: [],
            loading: false
        }
    }

    setDataOptions = (dataList, checkedValues) => {
        console.log(dataList, checkedValues, '-----------setDataOptions----------')
        this.setState({
            dataList,
            checkedValues,
            loading: false
        })
    }

    setLoading = (status) => {
        this.setState({
            loading: status
        })
    }

    onChange = (checkedValues) => {
        console.log(checkedValues, '------onChange-------onChange------')
        // let checkedItems = []
        // _.map(this.state.dataList, (d, k) => {
        //     if (checkedValues.includes(d.id)) {
        //         checkedItems.push(d)
        //     }
        // })
        //
        // this.setState({
        //     checkedValues
        // }, () => {
        //     this.props.onChange && this.props.onChange(checkedValues, checkedItems)
        // })
    }

    clickCheckBox = (id) => {
        let { checkedValues } = this.state
        let hasChecked = false
        console.log(id, checkedValues, '_________________clickCheckBox')
        if (checkedValues.includes(id)) {
            checkedValues.splice(checkedValues.indexOf(id), 1)
        } else {
            checkedValues.push(id)
        }

        let checkedItems = []
        _.map(this.state.dataList, (d, k) => {
            if (checkedValues.includes(d.id)) {
                checkedItems.push(d)
            }
        })
        console.log(checkedValues, '------onChange-------onChange------')

        this.setState({
            checkedValues
        }, () => {
            this.props.onChange && this.props.onChange(checkedValues, checkedItems)
        })
    }

    getShortName = (value) => {
        if (value) {
            if (value.length > 22) {
                return value.slice(0, 22) + '...'
            } else {
                return value
            }
        } else {
            return '（空白）'
        }
    }

    render() {
        console.log(this.state.dataList, '-----render+++++123-------------')
        const loop = data => data.map((item,index) => {
            if (item.children && item.children.length) {
                return <Collapse defaultActiveKey={[index]} style={{ paddingLeft: (item.level - 1)*5 + 'px' }}>
                    <Panel header={item.name} key={index}>
                        {loop(item.children)}
                    </Panel>
                </Collapse>
            }
            return <Col span={24} style={{ height: 32 }} onClick={this.clickCheckBox.bind(this, item.id)}>
                <Checkbox value={item.id}>
                    <Tooltip placement='topLeft' title={item.name}>
                        <span>{this.getShortName(item.name)}</span>
                    </Tooltip>
                </Checkbox>
            </Col>
        });
        return (
            <div className='lzTableFilterCheckBox'>
                <Spin spinning={this.state.loading} >
                    {
                        this.state.dataList && this.state.dataList.length > 0 ?
                            <Checkbox.Group style={{ width: '260px', minHeight: '100px' }} onChange={this.onChange} value={this.state.checkedValues}>
                                <Row>
                                    {
                                        loop(this.state.dataList)
                                    }
                                </Row>
                            </Checkbox.Group> : null
                    }
                </Spin>
            </div>
        )
    }
}
