import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * BarSetting
 */
class BarSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.BAR
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges, indexNameList, dataType } = boardData
        const data = dataIndexByRanges.map((item) => ({
            type: item.name,
            value: Number(item.textData),
            percent: Number(item.percent),
        }))
        chart.data(data)

        chart
            .interval()
            .position('type*value')
            .tooltip('value', (value) => {
                return {
                    name: indexNameList[0],
                    value: ChartConfig.formTooltipValue(value, dataType),
                }
            })
        chart.interaction('active-region')
    }
}
export default BarSetting
