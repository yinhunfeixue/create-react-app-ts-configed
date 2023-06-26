import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import { Chart } from '@antv/g2_4'

/**
 * LineDoubleYSetting
 */
class LineDoubleYSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.LINE_DOUBLE_Y
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { indexNameList, multivaluedPojo } = boardData
        const colors = ChartConfig.COLORS
        const data: any[] = multivaluedPojo.map((item) => ({
            name: item.name,
            textData: Number(item.textData),
            textData1: Number(item.textData1),
        }))

        const valueNameList = ['textData', 'textData1']

        for (let i = 0; i < valueNameList.length; i++) {
            const item = valueNameList[i]
            chart.axis(item, {
                title: {
                    text: indexNameList[i],
                    position: 'end',
                    autoRotate: false,
                    offset: 1,
                    style: {
                        textBaseline: 'top',
                        y: 4,
                    },
                },
                grid: i === 0 ? undefined : null,
            })
            chart.scale({
                [item]: {
                    alias: indexNameList[i],
                    nice: true,
                },
            })
            chart
                .line()
                .position(`name*${item}`)
                .color(colors[i])
                .shape(i === 0 ? 'line' : 'dash')
        }
        chart.appendPadding = [30, 0, 0, 0]
        chart.tooltip({
            showCrosshairs: true,
            shared: true,
        })

        chart.data(data)
    }
}
export default LineDoubleYSetting
