import DimType from '@/app/kpiCharts/enum/DimType'
import TimeEnum from '@/app/kpiCharts/enum/TimeEnum'

/**
 * IBoard
 */
export default interface IBoard {
    id: string
    name: string
    description?: string
    /**
     * 统计周期
     */
    statPeriod: TimeEnum

    /**
     * 统计维度
     */
    statRange: DimType

    themeId: number

    /**
     * 维度值
     */
    rangeIdList: string

    panelTypeId: number

    // 概况列表
    indexDataList?: IBoardOverview[]

    // 图表数据
    graphDataList?: IBoardChart[]
}

export interface IBoardOverview {
    name: string
    value: number
    preValue: number
    unit: string
    ratio: number
}

export interface IBoardChart {
    dataIndexByRanges: any[]
    multivaluedPojo: any[]
    indexNameList: string[]
    title: string
    baseGraphId: number
    graphTypeId: number
    description?: string
    /**
     * 数据类型，1数值 2比例
     */
    dataType: 1 | 2
}
