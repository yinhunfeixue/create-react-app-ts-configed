import ChartConfig from '@/app/kpiCharts/chartSetting/ChartConfig'
import { Chart } from '@antv/g2_4'

/**
 * Theme
 */
class Theme {
    install(chart: Chart) {
        chart.theme({
            styleSheet: {
                brandColor: ChartConfig.COLORS[0],
                paletteQualitative10: ChartConfig.COLORS,
                paletteQualitative20: ChartConfig.COLORS,
            },
        })
    }
}
export default Theme
