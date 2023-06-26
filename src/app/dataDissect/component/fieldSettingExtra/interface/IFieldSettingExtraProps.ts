import { CSSProperties } from 'react'

/**
 * IFieldSettingExtraProps
 */
export default interface IFieldSettingExtraProps {
    onOk: (params: any) => void
    className?: string
    style?: CSSProperties
    defaultValue?: string
}
