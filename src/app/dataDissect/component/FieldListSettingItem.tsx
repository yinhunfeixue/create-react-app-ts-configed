import FieldType from '@/app/dataDissect/enum/FieldType'
import IconFont from '@/component/IconFont'
import classNames from 'classnames'
import React, { ReactNode, useState } from 'react'
import styles from './FieldListSettingItem.module.less'
interface IFieldListSettingItemProps {
    /**
     * 字段类型
     */
    fieldType: FieldType
    renderExtra?: (onOk: (params: any) => void) => ReactNode
    className?: string
    onOk: (type: FieldType, params?: any) => void
    tagClassName?: string
    visibleExtra?: boolean
    onVisibleExtra: () => void
}
/**
 * FieldListSettingItem
 */
const FieldListSettingItem: React.FC<IFieldListSettingItemProps> = (props) => {
    const { renderExtra, fieldType, className, onOk, tagClassName, visibleExtra: propsVisibleExtraIndex, onVisibleExtra } = props
    const [visibleExtra, setVisibleExtra] = useState(false)
    const extraOnOk = (params: any) => {
        setVisibleExtra(false)
        onOk(fieldType, params)
    }

    const extraNode = renderExtra && renderExtra(extraOnOk)
    return (
        <React.Fragment>
            {/* 字段tag */}
            <div
                className={classNames(styles.FieldListSettingItem, className)}
                onClick={() => {
                    // 如果有扩展面板，显示扩展面板；没有则触发onOK
                    if (!extraNode) {
                        onOk(fieldType)
                    }
                }}
                onMouseEnter={() => {
                    if (extraNode) {
                        setVisibleExtra(true)
                        onVisibleExtra()
                    }
                }}
                onMouseOut={(event) => {
                    const { currentTarget, relatedTarget } = event
                    if (!event.target || !currentTarget.contains(relatedTarget as Node)) {
                        console.log('out')

                        setVisibleExtra(false)
                    }
                }}
            >
                <div className={tagClassName} style={{ backgroundColor: FieldType.toColor(fieldType) }}>
                    {FieldType.toString(fieldType)}
                </div>
                {Boolean(extraNode) && <IconFont type='e636' useCss />}
                {/* 扩展的操作内容 */}
                {propsVisibleExtraIndex && visibleExtra ? extraNode : null}
            </div>
        </React.Fragment>
    )
}
export default FieldListSettingItem
