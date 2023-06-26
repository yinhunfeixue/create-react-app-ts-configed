import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * IChartSetting
 */
export default interface IChartSetting {
    match(chartType: ChartType): boolean
    setting(chart: Chart, boardData: IBoardChart): void
    height?(boardData: IBoardChart): number
}
