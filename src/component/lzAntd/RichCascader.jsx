import React, { Component } from 'react'
import EmptyIcon from '@/component/EmptyIcon';
import { Cascader } from 'antd'

const RichCascader = (props) => {
    let { options, fieldNames, value = [] } = props
    const getTreeId = (options, array) => {
        options.map((item) => {
            array.push(item[fieldNames.value])
            if (item.children&&item.children.length) {
                getTreeId(item.children, array)
            }
        })
        return array
    }
    let array = getTreeId(options, [])
    value.map((item) => {
        if (!array.includes(item)) {
            props.value = []
        }
    })
    return <Cascader {...props} />
}
export default RichCascader