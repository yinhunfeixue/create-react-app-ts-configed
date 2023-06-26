import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { DataView } from '@antv/data-set'
import { Chart } from '@antv/g2_4'

/**
 * PieNestSetting
 */
class PieNestSetting implements IChartSetting {
    match(graphType: ChartType): boolean {
        return graphType === ChartType.PIE_NEST
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges } = boardData
        const data = dataIndexByRanges.map((item) => ({
            name: item.name,
            type: item.type,
            value: Number(item.textData),
        }))

        const colors = ChartConfig.COLORS

        const colorMap = {}
        Array.from(new Set(data.map((item) => item.type))).forEach((item, index) => {
            colorMap[item] = colors[index % colors.length]
        })

        // 通过 DataSet 计算百分比
        const dv = new DataView()
        dv.source(data).transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent',
        })

        chart.data(dv.rows)
        chart.scale({
            percent: {
                formatter: (val) => {
                    val = (val * 100).toFixed(2) + '%'
                    return val
                },
            },
        })
        chart.coordinate('theta', {
            radius: 0.5,
        })
        chart.tooltip({
            showTitle: false,
            showMarkers: false,
        })
        chart.legend(false)
        chart
            .interval()
            .adjust('stack')
            .position('percent')
            .color('type', (type) => colorMap[type])
            .label('type', {
                offset: -10,
            })
            .tooltip('type*percent*value', (item, percent, value) => {
                percent = (percent * 100).toFixed(2) + '%'
                return {
                    name: item,
                    value: `${value} (${percent})`,
                }
            })
            .style({
                lineWidth: 1,
                stroke: '#fff',
            })

        const outterView = chart.createView()
        const dv1 = new DataView()
        dv1.source(data).transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent',
        })

        outterView.data(dv1.rows)
        outterView.scale({
            percent: {
                formatter: (val) => {
                    val = (val * 100).toFixed(2) + '%'
                    return val
                },
            },
        })
        outterView.coordinate('theta', {
            innerRadius: 0.5 / 0.75,
            radius: 0.75,
        })
        outterView
            .interval()
            .adjust('stack')
            .position('percent')
            .color('type*name', (type) => colorMap[type])
            .label('name*percent*value', (name, percent, value) => {
                percent = (percent * 100).toFixed(2) + '%'
                return {
                    content: `${name}: ${percent}`,
                }
            })
            .tooltip('type*name*percent*value', (type, item, percent, value) => {
                percent = (percent * 100).toFixed(2) + '%'
                return {
                    name: `${type}-${item}`,
                    value: `${value} (${percent})`,
                }
            })
            .style({
                lineWidth: 1,
                stroke: '#fff',
            })

        chart.interaction('element-highlight')
    }
}
export default PieNestSetting
