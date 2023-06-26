import NumberChart from '@/app/dataDissect/component/charts/NumberChart'
import TextChart from '@/app/dataDissect/component/charts/TextChart'
import TimeChart from '@/app/dataDissect/component/charts/TimeChart'
import FieldType from '@/app/dataDissect/enum/FieldType'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React, { MouseEventHandler, useState } from 'react'
import styles from './DetailItem.module.less'
interface IDetailItemProps {
    data: any
    className?: string
    onClick?: MouseEventHandler
}
/**
 * DetailItem
 */
const DetailItem: React.FC<IDetailItemProps> = (props) => {
    const { data, className, onClick } = props
    const [open, setOpen] = useState(false)

    const { columnTransformType, columnName, isBloodColumn, dataType } = data

    const chartTypeDic: { [key in FieldType]: Function } = {
        [FieldType.TEXT]: TextChart,
        [FieldType.INT]: NumberChart,
        [FieldType.FLOAT]: NumberChart,
        [FieldType.TIME]: TimeChart,
        [FieldType.DATE]: TimeChart,
    }
    const chartType = chartTypeDic[columnTransformType]
    const typeText = FieldType.toString(columnTransformType)
    const typeThemeColor = FieldType.toColor(columnTransformType)

    const samplingDataList = data.samplingDataList || []

    return (
        <div className={classNames(styles.DetailItem, className)} onClick={onClick} style={{ width: open ? 360 : 240 }}>
            {/* 图表区头部 */}
            <header>
                <div className={styles.HGroup}>
                    <div className={styles.Tag} style={{ backgroundColor: typeThemeColor }}>
                        {typeText}
                    </div>
                    {isBloodColumn && (
                        <Tooltip title='血缘字段标识'>
                            <IconFont type='icon-dingwei' />
                        </Tooltip>
                    )}
                    <span className={styles.FieldName}>{columnName}</span>
                </div>
                <IconFont type='icon-bili' onClick={() => setOpen(!open)} />
            </header>
            {/* 图表 */}
            <main>{chartType ? React.createElement(chartType, { data }) : <EmptyLabel />}</main>
            {/* 列表页头部 */}
            <header>
                <div className={styles.HGroup}>
                    {isBloodColumn && (
                        <Tooltip title='血缘字段标识'>
                            <IconFont type='icon-dingwei' />
                        </Tooltip>
                    )}
                    <span>{columnName}</span>
                </div>
                <span className='unImportText'>[{dataType}]</span>
            </header>
            {/* 列表 */}
            <main className={styles.List}>
                {new Array(10).fill(' ').map((item: string, index: number) => {
                    return (
                        <div className={styles.ListItem} key={index}>
                            {samplingDataList[index] || ' '}
                        </div>
                    )
                })}
            </main>
        </div>
    )
}
export default DetailItem
