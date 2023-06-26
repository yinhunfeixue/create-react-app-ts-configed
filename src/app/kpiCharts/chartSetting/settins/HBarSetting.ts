import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * HBarSetting
 */
class HBarSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.HBAR
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges, indexNameList, dataType } = boardData
        const { size, gap } = ChartConfig.barConfig
        const data = dataIndexByRanges.map((item) => ({
            type: item.name,
            value: Number(item.textData),
            percent: Number(item.percent),
        }))
        chart.data(data.reverse())
        chart.coordinate().transpose()

        chart.axis('type', ChartConfig.hbarYOption())
        chart
            .interval({
                intervalPadding: gap,
            })
            .size(size)
            .position('type*value')
            .tooltip('value', (value) => {
                return {
                    name: indexNameList[0],
                    value: ChartConfig.formTooltipValue(value, dataType),
                }
            })
        chart.interaction('active-region')
    }

    height(boardData: IBoardChart): number {
        const { length } = boardData.dataIndexByRanges
        const { size, gap } = ChartConfig.barConfig
        return length * size + (length - 1) * gap + 50
    }
}
export default HBarSetting
