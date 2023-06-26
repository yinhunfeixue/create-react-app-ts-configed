import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * LineMulSetting
 */
class LineMulSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.LINE_MUL
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { multivaluedPojo, dataType } = boardData
        const data = multivaluedPojo.map((item) => {
            return {
                ...item,
                value: Number(item.value),
                label: `${item.label}`,
            }
        })

        chart.data(data)
        chart.scale({
            label: {
                range: [0, 1],
            },
            value: {
                nice: true,
            },
        })

        chart.tooltip({
            showCrosshairs: true,
            shared: true,
        })

        chart.axis('value', {
            label: {
                formatter: (val) => {
                    return val
                },
            },
        })

        chart
            .line()
            .position('label*value')
            .color('type')
            .tooltip('type*value', (type, value) => {
                return {
                    name: type,
                    value: ChartConfig.formTooltipValue(value, dataType),
                }
            })
        // chart.point().position('label*value').color('type').shape('circle')
    }
}
export default LineMulSetting
