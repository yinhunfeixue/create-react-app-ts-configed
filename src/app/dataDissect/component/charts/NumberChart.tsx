import SumItem from '@/app/dataDissect/component/charts/SumItem'
import AutoTip from '@/component/AutoTip'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import classNames from 'classnames'
import React from 'react'
import chartStyles from './Chart.module.less'
import styles from './NumberChart.module.less'
interface INumberChartProps {
    data: {
        nullValueDataNum: number
        nullValueDataPercent: number
        zeroValueDataNum: number
        zeroValueDataPercent: number
        averageValue: number
        quantileList: string[]
    }
}
/**
 * NumberChart
 */
const NumberChart: React.FC<INumberChartProps> = (props) => {
    const { nullValueDataNum, nullValueDataPercent, zeroValueDataNum, zeroValueDataPercent, averageValue, quantileList } = props.data
    return (
        <div className={classNames(chartStyles.ChartWrap, styles.NumberChart)}>
            {/* 头部 */}
            <header>
                {[
                    {
                        label: 'NULL值',
                        count: nullValueDataNum,
                        percent: nullValueDataPercent,
                    },
                    {
                        label: '0值',
                        count: zeroValueDataNum,
                        percent: zeroValueDataPercent,
                    },
                ].map((item, index) => {
                    return <SumItem {...item} key={index} />
                })}
            </header>
            <main>
                <div className={classNames(chartStyles.Label)}>分位图</div>
                <div className={styles.ChartContainer}>
                    <IconFont className={styles.VLine} type='icon-fenweitu' />
                    <div className={styles.HLine} />
                    {/* 左侧文字 */}
                    {['Min', '25%', '50%', '75%', '100%'].map((item, index) => {
                        return (
                            <span key={item} style={{ position: 'absolute', left: 0, top: `${index * 20}%` }}>
                                {item}
                            </span>
                        )
                    })}
                    {/* 右侧文字 */}
                    {quantileList.map((item, index) => {
                        return <AutoTip content={item} style={{ position: 'absolute', width: 'unset', left: 75, right: 10, top: `${index * 20}%` }} />
                    })}
                </div>
                <div className='HControlGroup'>
                    <span className={styles.AvgIcon} />
                    <span className={classNames(chartStyles.ImportantText)}>Avg ({ProjectUtil.fixedNumber(averageValue)})</span>
                </div>
            </main>
        </div>
    )
}
export default NumberChart
