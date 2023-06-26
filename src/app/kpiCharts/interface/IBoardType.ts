/**
 * IBoardType
 */
export default interface IBoardType {
    id: string
    name: string
    description: string
    iconUrl: string
    rangeSelectList: string
    timeSelectList: string
    type: number
    graphSelectList: GraphSetting[]
}

export interface GraphSetting {
    baseGraphId: string
    description: string
    id: number
    title: string
    xAxisList: string
    yAxisList: string
}
