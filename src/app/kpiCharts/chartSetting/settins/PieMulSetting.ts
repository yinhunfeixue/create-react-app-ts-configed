import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * PieMulSetting
 */
class PieMulSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.PIE_MUL
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { dataIndexByRanges } = boardData
        const data = dataIndexByRanges.map((item) => ({
            type: item.name,
            value: Number(item.textData),
        }))

        const total = data.reduce((preValue, currentValue) => {
            return preValue + currentValue.value
        }, 0)

        const colors = ChartConfig.COLORS

        chart.data(data)
        chart.legend(false)
        chart.tooltip({
            showMarkers: false,
        })
        chart.facet('rect', {
            fields: ['type'],
            padding: 20,
            showTitle: false,
            eachView: (view, facet) => {
                if (!facet) {
                    return
                }
                const { data, columnIndex } = facet

                let color = colors[columnIndex % colors.length]
                data.push({ type: '其他', value: total - data[0].value })
                view.data(data)
                view.coordinate('theta', {
                    radius: 0.8,
                    innerRadius: 0.5,
                })
                view.interval().adjust('stack').position('value').color('type', [color, '#eceef1']).style({
                    opacity: 1,
                })
                view.annotation().text({
                    position: ['50%', '50%'],
                    content: data[0].type,
                    style: {
                        fontSize: 12,
                        fill: '#8c8c8c',
                        fontWeight: 300,
                        textBaseline: 'bottom',
                        textAlign: 'center',
                    },
                    offsetY: -12,
                })

                view.annotation().text({
                    position: ['50%', '50%'],
                    content: data[0].value,
                    style: {
                        fontSize: 18,
                        fill: '#000',
                        fontWeight: 500,
                        textAlign: 'center',
                    },
                    offsetY: 10,
                })

                view.interaction('element-active')
            },
        })
    }
}
export default PieMulSetting
