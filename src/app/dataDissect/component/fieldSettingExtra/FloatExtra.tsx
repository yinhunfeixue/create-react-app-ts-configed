import BaseExtra from '@/app/dataDissect/component/fieldSettingExtra/BaseExtra'
import IFieldSettingExtraProps from '@/app/dataDissect/component/fieldSettingExtra/interface/IFieldSettingExtraProps'
import { InputNumber, message } from 'antd'
import React, { useState } from 'react'

interface IFloatExtraProps extends IFieldSettingExtraProps {}
/**
 * FloatExtra
 */
const FloatExtra: React.FC<IFloatExtraProps> = (props) => {
    const { onOk, defaultValue } = props
    const [value, setValue] = useState<number | null>(Number(defaultValue) || 0)
    return (
        <BaseExtra
            {...props}
            title='小数位数'
            options={[
                {
                    value: 2,
                    label: '默认2位数',
                },
            ]}
            customRender={() => {
                return (
                    <InputNumber
                        placeholder='自定义位数'
                        value={value}
                        onChange={(value) => setValue(value)}
                        addonAfter={
                            <a
                                onClick={() => {
                                    if (!value) {
                                        message.error(`请输入位数`)
                                        return
                                    }
                                    onOk(value)
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
export default FloatExtra
