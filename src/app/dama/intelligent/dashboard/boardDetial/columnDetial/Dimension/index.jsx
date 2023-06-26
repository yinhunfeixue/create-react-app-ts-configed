import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Button, Spin, Select } from 'antd'
import _ from 'underscore'
import './index.less'
import { getPinboardFilter } from 'app_api/dashboardApi'
const { Option, OptGroup } = Select

export default class Dimension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: this.props.options || [],
            select: this.props.select || []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            select: nextProps.select,
            options: nextProps.options
        })
    }

    onCancel = () => {
        this.props.onCancel()
    }
    handleChange(value) {
        this.setState({
            select: value
        })
    }

    getOption = async (keyword) => {
        let params = {
            columnId: this.props.indexId,
            pinboardId: this.props.pinboardId,
            keyword: keyword
        }
        let res = await getPinboardFilter(params)
        if (res.code === 200) {
            this.setState({
                options: res.data.values
            })
        }

    }
    // 确定按钮方法
    changeInf = () => {
        const { select } = this.state
        let params = {
            columnId: this.props.indexId,
            select
        }
        if (this.props.isAdd) {
            this.props.addNewFilter(params)
        } else {
            this.props.updateFilter(params)
        }

    }
    render() {
        const { select, options } = this.state
        const { isAdd, indexName, indexId, extraName } = this.props
        let topicClass = isAdd ? 'Dimension addDimension' : 'Dimension'
        return (
            <div className={topicClass} id={`dimension${indexId + extraName}`}>
                {
                    isAdd && <div className='filterTopic'>
                        请设置过滤组件默认过滤条件，如果没有设置默认过滤条件，系统将不使用“{indexName}”进行过滤
                    </div>
                }
                <div className='indexContent'>
                    <Select
                        // mode="tags"
                        mode="multiple"
                        style={{ width: '100%', height: '32px' }}
                        onChange={this.handleChange}
                        // tokenSeparators={[',']}
                        filterOption={false}
                        onSearch={this.getOption}
                        open={true}
                        placeholder={`选择${indexName}的默认过滤条件`}
                        dropdownMenuStyle={
                            {
                                height: '250px'
                            }
                        }
                        getPopupContainer={
                            () => document.getElementById(`dimension${indexId + extraName}`)
                        }
                        value={select}
                    >
                        {
                            options.map((value, index) => {
                                return (<Option key={index} value={value}>{value}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='boardBottomBtn'>
                    <Button onClick={this.onCancel} style={{ marginRight: '10px' }}>取消</Button>
                    <Button type='primary' onClick={this.changeInf}>确定</Button>
                </div>
            </div>
        )
    }
}