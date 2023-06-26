import BaseExtra from '@/app/dataDissect/component/fieldSettingExtra/BaseExtra'
import IFieldSettingExtraProps from '@/app/dataDissect/component/fieldSettingExtra/interface/IFieldSettingExtraProps'
import { Input, message } from 'antd'
import React, { useState } from 'react'
/**
 * TimeExtra
 */
const TimeExtra: React.FC<IFieldSettingExtraProps> = (props) => {
    const { onOk, defaultValue } = props
    const valueList = [`yyyy-mm-dd  HH:MM:SS`, `yyyy/mm/dd HH:MM:SS`]
    const [inputValue, setInputValue] = useState(defaultValue || '')
    return (
        <BaseExtra
            {...props}
            title='时间格式'
            options={valueList}
            customRender={() => {
                return (
                    <Input
                        placeholder='自定义格式'
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        suffix={
                            <a
                                onClick={() => {
                                    if (!inputValue) {
                                        message.error(`请输入自定义时间格式`)
                                        return
                                    }
                                    onOk(inputValue)
                                }}
                            >
                                确定
                            </a>
                        }
                    />
                )
            }}
        />
    )
}
export default TimeExtra
