import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * PieSetting
 */
class PieSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.PIE
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges } = boardData

        const data = dataIndexByRanges.map((item) => ({
            item: item.name,
            count: item.textData,
            percent: Number(item.percent) / 100,
        }))

        chart.data(data)
        chart.legend(false)
        chart.scale('percent', {
            formatter: (val) => {
                val = val * 100 + '%'
                return val
            },
        })
        chart.coordinate('theta', {
            radius: 0.75,
            innerRadius: 0.6,
        })
        chart.tooltip({
            showTitle: false,
            showMarkers: false,
            itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
        })

        chart
            .interval()
            .adjust('stack')
            .position('percent')
            .color('item')
            .label('percent', (percent) => {
                return {
                    content: (data) => {
                        return `${data.item}: ${percent * 100}%`
                    },
                }
            })
            .tooltip('item*percent', (item, percent) => {
                percent = percent * 100 + '%'
                return {
                    name: item,
                    value: percent,
                }
            })

        chart.interaction('element-active')
    }
}
export default PieSetting
