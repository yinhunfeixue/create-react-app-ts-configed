import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import ChartType from '@/app/kpiCharts/enum/ChartType'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2_4'
/**
 * HBarHeapUpSetting
 */
class HBarHeapUpSetting implements IChartSetting {
    match(chartType: ChartType): boolean {
        return chartType === ChartType.HBAR_HEAP_UP
    }
    setting(chart: Chart, boardData: IBoardChart): void {
        const { indexNameList, multivaluedPojo } = boardData
        const { size, gap } = ChartConfig.barConfig
        const data = multivaluedPojo.map((item) => {
            const result = {
                ...item,
            }
            indexNameList.forEach((item) => {
                result[item] = Number(result[item])
            })

            return result
        })

        const ds = new DataSet()
        const dv = ds.createView().source(data)
        dv.transform({
            type: 'fold',
            fields: indexNameList, // 展开字段集
            key: 'key', // key字段
            value: 'value', // value字段
            retains: ['id', 'name'], // 保留字段集，默认为除fields以外的所有字段
        })

        chart.coordinate().transpose()

        chart.data(dv.rows)
        chart.scale('value', { nice: true })

        chart.axis('name', ChartConfig.hbarYOption())
        chart.tooltip({
            shared: true,
            showMarkers: false,
        })

        chart.interval({ intervalPadding: gap }).adjust('stack').position('name*value').color('key').size(size)
        chart.interaction('active-region')
    }

    height(boardData: IBoardChart): number {
        const { length } = boardData.multivaluedPojo
        const { size, gap } = ChartConfig.barConfig
        return length * size + (length - 1) * gap + 50
    }
}
export default HBarHeapUpSetting
