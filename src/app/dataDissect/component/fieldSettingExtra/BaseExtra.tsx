import IFieldSettingExtraProps from '@/app/dataDissect/component/fieldSettingExtra/interface/IFieldSettingExtraProps'
import { CheckboxOptionType, Radio } from 'antd'
import classNames from 'classnames'
import React, { ReactNode } from 'react'
import './BaseExtra.less'

interface IBaseExtraProps extends IFieldSettingExtraProps {
    options: Array<CheckboxOptionType | string | number>
    customRender: (onOk: (value: any) => void, defaultValue?: string) => void
    title?: ReactNode
    defaultValue?: string
}
/**
 * BaseExtra
 */
const BaseExtra: React.FC<IBaseExtraProps> = (props) => {
    const { options, customRender, defaultValue, onOk, className, style, title = '参数设置' } = props

    // 检查是否有对应的radio值，如果有，则给radio.group; 没有，则给customRender
    const hasRadioSelect = options.find((item) => {
        return item === defaultValue || (item as CheckboxOptionType).value === item
    })
    console.log('defaultValue', options, defaultValue, hasRadioSelect)
    return (
        <div className={classNames('BaseExtra', className)} style={style}>
            <h5>{title}</h5>
            <Radio.Group options={options} onChange={(event) => onOk(event.target.value)} defaultValue={hasRadioSelect ? defaultValue : undefined} />
            {customRender(onOk, hasRadioSelect ? undefined : defaultValue)}
        </div>
    )
}
export default BaseExtra
