import SumItem from '@/app/dataDissect/component/charts/SumItem'
import classNames from 'classnames'
import React from 'react'
import chartStyles from './Chart.module.less'
import styles from './TimeChart.module.less'

interface ITimeChartProps {
    data: {
        nullValueDataNum: number
        nullValueDataPercent: number
        dataMaxValue: string
        dataMinValue: string
    }
}
/**
 * TimeChart
 */
const TimeChart: React.FC<ITimeChartProps> = (props) => {
    const { nullValueDataNum, nullValueDataPercent, dataMaxValue, dataMinValue } = props.data
    return (
        <div className={classNames(chartStyles.ChartWrap, styles.TimeChart)}>
            {/* 头部 */}
            <header>
                {[
                    {
                        label: 'NULL值',
                        count: nullValueDataNum,
                        percent: nullValueDataPercent,
                    },
                ].map((item, index) => {
                    return <SumItem {...item} key={index} />
                })}
            </header>
            <main>
                <div className={classNames(chartStyles.Label)}>时间分布</div>
                <div className={classNames(chartStyles.ImportantText)}>[Min] {dataMinValue}</div>
                <div className={classNames(chartStyles.ImportantText)}>[Max] {dataMaxValue}</div>
            </main>
        </div>
    )
}
export default TimeChart
