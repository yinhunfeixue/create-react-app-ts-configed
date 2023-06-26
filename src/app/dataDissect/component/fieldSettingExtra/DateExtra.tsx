import BaseExtra from '@/app/dataDissect/component/fieldSettingExtra/BaseExtra'
import IFieldSettingExtraProps from '@/app/dataDissect/component/fieldSettingExtra/interface/IFieldSettingExtraProps'
import { Input, message } from 'antd'
import React, { useState } from 'react'
/**
 * DateExtra
 */
const DateExtra: React.FC<IFieldSettingExtraProps> = (props) => {
    const { onOk, defaultValue } = props
    const valueList = [`yyyy-mm-dd`, `yyyy/mm/dd`]
    const [inputValue, setInputValue] = useState(defaultValue)
    return (
        <BaseExtra
            {...props}
            title='日期格式'
            options={valueList}
            defaultValue={defaultValue}
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
                                        message.error(`请输入自定义日期`)
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
export default DateExtra
