import FieldListSettingItem from '@/app/dataDissect/component/FieldListSettingItem'
import DateExtra from '@/app/dataDissect/component/fieldSettingExtra/DateExtra'
import FloatExtra from '@/app/dataDissect/component/fieldSettingExtra/FloatExtra'
import TimeExtra from '@/app/dataDissect/component/fieldSettingExtra/TimeExtra'
import FieldType from '@/app/dataDissect/enum/FieldType'
import { Dropdown, Tooltip } from 'antd'
import React, { useState } from 'react'
import styles from './FieldValueTypeSelect.module.less'

interface IFieldValueTypeSelectProps {
    defaultValue?: IValue
    onChange: (value: IValue) => void
}

interface IValue {
    type: FieldType
    params: any
}
/**
 * FieldValueTypeSelect
 */
const FieldValueTypeSelect: React.FC<IFieldValueTypeSelectProps> = (props) => {
    const { defaultValue, onChange } = props
    const typeList = FieldType.ALL

    const [type, setType] = useState(defaultValue ? defaultValue.type : undefined)
    const [params, setParams] = useState(defaultValue ? defaultValue.params : undefined)
    const [visible, setVisible] = useState(false)
    const [visibleExtraIndex, setVisibleExtraIndex] = useState<number | undefined>()

    const getRenderExtraFunction = (fieldType: FieldType, onOk: (params: any) => void, defaultValue?: string) => {
        switch (fieldType) {
            case FieldType.TIME:
                return <TimeExtra onOk={onOk} defaultValue={defaultValue} />
            case FieldType.DATE:
                return <DateExtra onOk={onOk} defaultValue={defaultValue} />
            case FieldType.FLOAT:
                return <FloatExtra onOk={onOk} defaultValue={defaultValue} />
            default:
                return
        }
    }

    const node = (
        <div className={styles.FieldValueTag} style={{ backgroundColor: FieldType.toColor(type) }}>
            {FieldType.toString(type) || '请选择'}
        </div>
    )

    const tooltip = params ? (typeof params === 'string' ? params : JSON.stringify(params)) : ''
    console.log('select', params)

    return (
        <Dropdown
            visible={visible}
            trigger={['click']}
            onVisibleChange={(value) => setVisible(value)}
            overlay={
                <div className={styles.FieldValueTypeSelect}>
                    <h5>类型切换</h5>
                    {typeList.map((item, index) => {
                        return (
                            <FieldListSettingItem
                                key={index}
                                fieldType={item}
                                onOk={(type, params) => {
                                    setType(type)
                                    setParams(params)
                                    setVisible(false)
                                    onChange({
                                        type,
                                        params,
                                    })
                                }}
                                className={styles.FieldItem}
                                tagClassName={styles.FieldValueTag}
                                // 默认值只传给类型相同的选项
                                renderExtra={(onOk) => getRenderExtraFunction(item, onOk, item === type ? params : undefined)}
                                visibleExtra={visibleExtraIndex === index}
                                onVisibleExtra={() => setVisibleExtraIndex(index)}
                            />
                        )
                    })}
                </div>
            }
        >
            {tooltip ? <Tooltip title={tooltip}>{node}</Tooltip> : node}
        </Dropdown>
    )
}
export default FieldValueTypeSelect
