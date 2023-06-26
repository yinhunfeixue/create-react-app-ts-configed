import ProjectUtil from '@/utils/ProjectUtil'
import classNames from 'classnames'
import React from 'react'
import chartStyles from './Chart.module.less'
import styles from './SumItem.module.less'

interface ISumItemProps {
    label: string
    count: number
    percent: number
    className?: string
}
/**
 * 总量展示项
 */
const SumItem: React.FC<ISumItemProps> = (props) => {
    const { label, count, percent, className } = props
    return (
        <div className={classNames(styles.SumItem, className)}>
            <div className={classNames(chartStyles.Label)}>{label}</div>
            <div>
                <span className={classNames(chartStyles.LargeImportantText)}>{ProjectUtil.formatBigNumber(count)}</span>个
            </div>
            <div className={classNames(chartStyles.ImportantText)}>/ {Number(percent.toFixed(2))}%</div>
        </div>
    )
}
export default SumItem
