/**
 * ISimpleField
 */
export default interface ISimpleField {
    dataType: string
    fieldCName: string
    fieldEName: string
    fieldId: string

    /**
     * 是否标记此字段，true表示标记，此时字段血缘图中字段会显示一个定位图标
     */
    mark: boolean
}
