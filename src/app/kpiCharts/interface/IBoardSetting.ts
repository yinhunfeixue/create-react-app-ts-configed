/**
 * IBoardSetting
 */
export default interface IBoardSetting {
    id: string
    name: string
    panelTypeId: string
    description: string

    statPeriod?: string | number
    statRange?: string | number
    rangeIdList?: string
    graphSelectList: string
}
