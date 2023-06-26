import { AxisOption } from '@antv/g2_4/lib/interface'

/**
 * ChartConfig
 */
class ChartConfig {
    static COLORS = [`#3A9DFF`, '#42D0D5', '#686EE2', '#EEB836', '#E8703F', '#8FC5FC', '#76DEE2', '#6B88EE', '#ED8D31']

    static formTooltipValue(value: number, dataType: 1 | 2) {
        if (dataType === 2) {
            return `${value}%`
        }
        return value
    }

    static hbarYOption(): AxisOption {
        return {
            verticalLimitLength: 100,
            tickLine: null,
            line: null,
            label: {
                autoEllipsis: true,
                offsetX: -12,
                style: {
                    fill: '#5E6266',
                },
            },
        }
    }

    static barConfig = {
        size: 12,
        gap: 12,
    }
}
export default ChartConfig
