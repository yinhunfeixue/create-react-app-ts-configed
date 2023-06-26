import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * LineSetting
 */
class LineSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.LINE
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges, indexNameList, dataType } = boardData

        const data = dataIndexByRanges.map((item) => ({
            name: item.name,
            value: Number(item.textData),
        }))
        chart.data(data)
        chart.scale({
            value: {
                nice: true,
            },
        })
        chart
            .line()
            .position('name*value')

            .tooltip('value', (value) => {
                return {
                    name: indexNameList[0],
                    value: ChartConfig.formTooltipValue(value, dataType),
                }
            })
    }
}
export default LineSetting
