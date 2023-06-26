import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * HBarMulSetting
 */
class HBarMulSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.HBAR_MUL
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { multivaluedPojo, dataType } = boardData
        const { size, gap } = ChartConfig.barConfig
        const data = multivaluedPojo.map((item) => {
            return {
                ...item,
                value: Number(item.value),
            }
        })

        chart.data(data)
        chart.coordinate().transpose().scale(1, -1)
        chart.axis('label', ChartConfig.hbarYOption())
        chart.axis('value', {
            position: 'right',
        })

        chart.tooltip({
            shared: true,
            showMarkers: false,
        })

        chart
            .interval({
                dodgePadding: 0,
            })
            .position('label*value')
            .color('type')
            .size(size)
            .adjust([
                {
                    type: 'dodge',
                },
            ])
            .tooltip('type*value', (type, value) => {
                return {
                    name: type,
                    value: ChartConfig.formTooltipValue(value, dataType),
                }
            })

        chart.interaction('active-region')
    }

    height(boardData: IBoardChart): number {
        const { length } = boardData.multivaluedPojo
        const { size, gap } = ChartConfig.barConfig
        return length * size + (length / 2) * gap + 50
    }
}
export default HBarMulSetting
