import SumItem from '@/app/dataDissect/component/charts/SumItem'
import ProjectUtil from '@/utils/ProjectUtil'
import classNames from 'classnames'
import ReactECharts from 'echarts-for-react'
import React from 'react'
import chartStyles from './Chart.module.less'

interface ITextChartProps {
    data: {
        uniqueValueAndNum: { id: string; name: string }[]
        dataMaxLength: number
        dataMinLength: number
        nullValueDataNum: number
        nullValueDataPercent: number
        emptyStringDataNum: number
        emptyStringDataPercent: number
        uniqueValueNum: number
    }
}
/**
 * TextChart
 */
const TextChart: React.FC<ITextChartProps> = (props) => {
    const { uniqueValueAndNum = [], uniqueValueNum, dataMaxLength, dataMinLength, nullValueDataNum, nullValueDataPercent, emptyStringDataNum, emptyStringDataPercent } = props.data
    const data = uniqueValueAndNum.map((item) => {
        return {
            type: item.id,
            value: item.name,
        }
    })

    return (
        <div className={chartStyles.ChartWrap}>
            {/* 头部 */}
            <header>
                {[
                    {
                        label: 'NULL值',
                        count: nullValueDataNum,
                        percent: ProjectUtil.fixedNumber(nullValueDataPercent, 4),
                    },
                    {
                        label: '空字符串',
                        count: emptyStringDataNum,
                        percent: ProjectUtil.fixedNumber(emptyStringDataPercent),
                    },
                ].map((item, index) => {
                    return <SumItem {...item} key={index} />
                })}
            </header>
            {/* 枚举值柱图 */}
            <main>
                <div style={{ marginBottom: 8 }}>
                    <span className={classNames(chartStyles.Label)}>枚举值 </span>
                    <span className={classNames(chartStyles.ImportantText)}>{ProjectUtil.formatBigNumber(uniqueValueNum)}</span>
                </div>
                <ReactECharts
                    style={{ height: 92 }}
                    option={{
                        tooltip: {
                            show: true,
                            formatter: `{b} <b>{c}%</b>`,
                        },
                        grid: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        },
                        yAxis: { type: 'category', data: data.map((item) => item.type) },
                        xAxis: {
                            type: 'value',
                        },
                        label: {
                            show: true,
                            position: 'left',
                            align: 'left',
                            distance: -5,
                            fontSize: 12,
                            color: '#2D3033',
                            formatter: `{b}`,
                        },
                        color: '#51A1FF',
                        series: [
                            {
                                data: data.map((item) => item.value),
                                type: 'bar',
                                barWidth: 14,
                                barCategoryGap: 4,
                            },
                        ],
                    }}
                />
            </main>
            {/* 字段长度 */}
            <footer>
                <div className={classNames(chartStyles.Label)} style={{ marginBottom: 4 }}>
                    字段长度
                </div>
                <div className={classNames(chartStyles.ImportantText)}>
                    Min ({dataMinLength}) ~ ({dataMaxLength}) Max
                </div>
            </footer>
        </div>
    )
}
export default TextChart
