import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * BarMulSetting
 */
class BarMulSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.BAR_MUL
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { multivaluedPojo, dataType } = boardData

        const data = multivaluedPojo.map((item) => {
            return {
                ...item,
                value: Number(item.value),
            }
        })

        chart.data(data)

        chart.axis('value', {
            position: 'right',
        })
        chart.axis('label', {
            label: {
                offset: 12,
            },
        })

        chart.tooltip({
            shared: true,
            showMarkers: false,
        })

        chart
            .interval()
            .position('label*value')
            .color('type')
            .adjust([
                {
                    type: 'dodge',
                    marginRatio: 0,
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
}
export default BarMulSetting
