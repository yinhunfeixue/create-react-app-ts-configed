import React, { Component } from 'react'
import EmptyIcon from '@/component/EmptyIcon';
import { Select, Spin } from 'antd'

const RichSelect = (props) => {
    let { emptyLoading, dataSource, dataKey, value, mode } = props
    let array = []
    dataSource&&dataSource.map((item) => {
        array.push(item[dataKey])
    })
    if (mode == 'multiple') {
        if (!array.length) {
            props.value = []
        } else {
            for (let i=0;i<props.value.length;i++) {
                if (!array.includes(props.value[i])) {
                    props.value.splice(i, 1)
                }
            }
        }
    } else {
        if (!array.length || !array.includes(props.value)) {
            props.value = undefined
        }
    }
    return <Select
        {...props} />
}
export default RichSelect