import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import { Progress, Tooltip } from 'antd'
import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import styles from './ModelChart.module.less'

interface IModelChartProps {
    publishedCount: number
    draftModelCount: number

    className?: string
    style?: CSSProperties
}
/**
 * ModelChart
 */
const ModelChart: React.FC<IModelChartProps> = (props) => {
    const { publishedCount, draftModelCount, className, style } = props
    const percent = (publishedCount * 100) / (draftModelCount + draftModelCount)
    const list = [
        {
            color: ModelStatus.toColor(ModelStatus.PUBLISHED),
            type: '已发布',
            value: publishedCount,
        },
        {
            color: ModelStatus.toColor(ModelStatus.DRAFT),
            type: '草稿',
            value: draftModelCount,
        },
    ]

    const isEmpty = !publishedCount && !draftModelCount

    return (
        <Tooltip
            title={
                <div className={styles.Tip}>
                    <h4>模型状态</h4>
                    <div className={styles.DotGroup}>
                        {list.map((item) => {
                            return (
                                <div className={styles.DotItem} key={item.type}>
                                    <div className={styles.Icon} style={{ backgroundColor: item.color }} />
                                    <span>{item.type}</span>
                                    <span className={styles.Value}>{item.value}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        >
            <div className={classNames(styles.ModelChart, className)} style={style}>
                <Progress
                    width={32}
                    strokeWidth={21}
                    trailColor={isEmpty ? 'rgba(196, 200, 204, 1)' : ModelStatus.toColor(ModelStatus.DRAFT)}
                    showInfo={false}
                    strokeLinecap='butt'
                    strokeColor={ModelStatus.toColor(ModelStatus.PUBLISHED)}
                    type='circle'
                    percent={percent}
                />
                {/* 两个加点标识 */}
                <div className={styles.DotGroup}>
                    {list.map((item) => {
                        return (
                            <div className={styles.DotItem} key={item.type}>
                                <div className={styles.Icon} style={{ backgroundColor: item.color }} />
                                <span>{item.type}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Tooltip>
    )
}
export default ModelChart
