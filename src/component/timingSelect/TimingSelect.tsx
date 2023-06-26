import TimingType from '@/component/timingSelect/TimingType'
import { Select, TimePicker } from 'antd'
import { DefaultOptionType } from 'antd/lib/select'
import { Moment } from 'moment'
import React, { Component } from 'react'
import './TimingSelect.less'

interface TimingValue {
    type?: TimingType
    time?: Moment
    day?: number
}

interface ITimingSelectState {
    value: TimingValue
}
interface ITimingSelectProps {
    onChange?: (value: TimingValue) => void
}

/**
 * 定时选择器，可选择以下3类时间
 * 1. 天/时分
 * 2. 周/星期/时分
 * 3. 月/日期/时分
 */
class TimingSelect extends Component<ITimingSelectProps, ITimingSelectState> {
    public static getValueError(value: TimingValue) {
        const { type, day, time } = value
        // 检查type
        // 如果type=week， month，检查day
        // 检查time
        if (!type) {
            return '请选择类型'
        }
        switch (type) {
            // 周、月，需要三个都有值
            case TimingType.WEEK:
            case TimingType.MONTH:
                if (!day) {
                    return `请选择日期`
                }
        }

        if (!time) {
            return `请选择时间`
        }

        return ''
    }

    constructor(props: ITimingSelectProps) {
        super(props)
        this.state = {
            value: {},
        }
    }

    public getError() {
        return TimingSelect.getValueError(this.state.value)
    }

    public setValue(value: TimingValue) {
        this.setState({ value })
    }

    private renderDaySelect() {
        const { value } = this.state
        let list: DefaultOptionType[] = []
        switch (value.type) {
            case TimingType.WEEK:
                list = ['一', '二', '三', '四', '五', '六', '日'].map((item, index) => {
                    return {
                        value: index + 1,
                        label: `周${item}`,
                    }
                })
                break
            case TimingType.MONTH:
                list = new Array(31).fill('').map((_, index) => {
                    return {
                        value: index + 1,
                        label: `${index + 1}日`,
                    }
                })
                break
            default:
                return null
        }

        return (
            <Select
                options={list}
                value={value.day}
                onChange={(param) => {
                    this.setState(
                        {
                            value: {
                                ...value,
                                day: param,
                            },
                        },
                        () => this.onValueChange()
                    )
                }}
            />
        )
    }

    private validateValue() {
        const { value } = this.state
        const { type, day, time } = value
        switch (type) {
            // 周、月，需要三个都有值
            case TimingType.WEEK:
            case TimingType.MONTH:
                return type && day && time
            // 其它情况只需要type、time有值
            default:
                return type && time
        }
    }

    private onValueChange() {
        const { onChange } = this.props
        if (onChange) {
            if (this.validateValue()) {
                const { value } = this.state
                onChange(value)
            }
        }
    }

    render() {
        const { value: stateValue } = this.state
        return (
            <div className='TimingSelect'>
                {/* 类型 */}
                <Select
                    className='TimingSelectType'
                    style={{ width: 160 }}
                    value={stateValue.type}
                    options={TimingType.ALL.map((item) => ({ value: item, label: TimingType.toString(item) }))}
                    onChange={(type) => {
                        // 切换类型后，清空星期、日期
                        this.setState(
                            {
                                value: {
                                    type,
                                    time: stateValue.time,
                                },
                            },
                            () => this.onValueChange()
                        )
                    }}
                />
                {/* 日期 */}
                {this.renderDaySelect()}
                {/* 值 */}
                <TimePicker
                    format='HH:mm'
                    value={stateValue.time}
                    onChange={(value) => {
                        this.setState(
                            {
                                value: {
                                    ...stateValue,
                                    time: value || undefined,
                                },
                            },
                            () => this.onValueChange()
                        )
                    }}
                />
            </div>
        )
    }
}

export default TimingSelect
