import IComponentProps from '@/base/interfaces/IComponentProps'
import LogType from '@/component/logItem/LogType'
import { Divider } from 'antd'
import React, { Component } from 'react'
import './LogItem.less'

interface ILogItemState {}
interface ILogItemProps extends IComponentProps {
    time: string
    type?: LogType
    des: string
}

/**
 * LogItem
 */
class LogItem extends Component<ILogItemProps, ILogItemState> {
    render() {
        const { time, type = LogType.NORMAL, des } = this.props
        const color = LogType.toColor(type)
        const iconColor = LogType.toIconColor(type)
        return (
            <div className='LogItem'>
                {/* 方块 */}
                <div className='LogItemIcon' style={{ backgroundColor: iconColor }} />
                {/* 时间 */}
                <time>{time}</time>
                <Divider type='vertical' />
                {/* 类型和描述 */}
                <p>
                    <span className='LogItemType' style={{ color }}>
                        [{LogType.toString(type)}]
                    </span>
                    <span>{des}</span>
                </p>
            </div>
        )
    }
}

export default LogItem
