import { message } from 'antd'
import { getDimensionCategory } from 'app_api/dimensionApi'
import { TreeSelect } from 'app_component'
import React, { Component } from 'react'

export default class DimensionCategoryTree extends Component {
    constructor(props) {
        super(props)
        console.log(props, 'dd')
        this.state = {
            treeData: [],
            selectedValue: props.value || '',
        }
    }

    componentWillMount() {
        getDimensionCategory().then((res) => {
            if (res.code == '200') {
                if (res.data.length > 0) {
                    this.setState({
                        treeData: res.data,
                    })
                }
            }
        })
    }

    onTreeSelect = (state, value) => {
        if (this.props.onTreeSelect) {
            this.props.onTreeSelect(value)
        }
        const { onChange } = this.props
        if (onChange) {
            onChange(Object.assign({}, state, value))
        }
    }

    render() {
        const { treeData, selectedValue } = this.state

        return (
            // <DataSourceTree checkStrictly={true} onCheck={this.treeCheck} />
            <TreeSelect treeData={treeData} onTreeSelect={this.onTreeSelect} selectedValue={selectedValue} />
        )
    }
}
