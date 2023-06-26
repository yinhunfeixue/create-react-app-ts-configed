import { Tag } from 'antd'
import React from 'react'
function LevelTag(props) {
    const { value, type, onClick } = props
    if (type == 'text') {
        return (
            <span onClick={onClick}>{value == 1 ? '一级' : (value == 2 ? '二级' : (value == 3 ? '三级' : (value == 4 ? '四级' : '五级')))}</span>
        )
    } else {
        return (
            <Tag onClick={onClick} color={value == 1 ? 'blue' : (value == 2 ? 'geekblue' : (value == 3 ? 'purple' : (value == 4 ? 'orange' : 'red')))}>
                {value == 1 ? '一级' : (value == 2 ? '二级' : (value == 3 ? '三级' : (value == 4 ? '四级' : '五级')))}
            </Tag>
        )
    }
}

export default LevelTag