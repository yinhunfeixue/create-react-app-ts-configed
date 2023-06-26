import DissectStatus from '@/app/dataDissect/enum/DissectStatus'
import DissectType from '@/app/dataDissect/enum/DissectType'
import IAnalysisResult from '@/app/dataDissect/interface/IAnalysisResult'
import IconFont from '@/component/IconFont'
import classNames from 'classnames'
import React, { CSSProperties, ReactNode } from 'react'
import { Time } from 'utils'
import styles from './DataDissectSettingItem.module.less'

interface IDataDissectSettingItemProps {
    data: IAnalysisResult
    footerExtra?: ReactNode
    className?: string
    children?: ReactNode
    onClick?: React.MouseEventHandler<HTMLDivElement>
}
/**
 * DataDissectSettingItem
 */
const DataDissectSettingItem: React.FC<IDataDissectSettingItemProps> = (props) => {
    const { footerExtra, className, children, onClick, data } = props
    const { tableName, analysisTime, databaseName, datasourceName, analysisStatus, analysisType } = data

    const time = analysisTime
    const dbName = `${datasourceName}/${databaseName}`
    const status = analysisStatus

    const dissectTypeName = DissectType.toFullString(analysisType)
    const dissectStatus = DissectStatus.toString(status)
    const statusColor = DissectStatus.toColor(status)
    const statusBorderColor = DissectStatus.toBorderColor(status)

    return (
        <div className={classNames(styles.DataDissectSettingItem, className)} onClick={onClick}>
            <header className={styles.IconText}>
                <IconFont type='icon-wulibiao' />
                <span className={styles.Text}>{tableName}</span>
            </header>
            <main>
                {[
                    {
                        icon: 'icon-ku',
                        text: dbName,
                    },
                    {
                        icon: 'icon-time1',
                        text: Time.formatTimeDetail(time),
                    },
                ].map((item, index) => {
                    return (
                        <div key={index} className={styles.IconText}>
                            <IconFont type={item.icon} style={{ fontSize: 16 }} />
                            <span className={styles.Text}>{item.text}</span>
                        </div>
                    )
                })}
            </main>
            <footer>
                <div className={styles.TagGroup}>
                    {[
                        {
                            text: dissectTypeName,
                        },
                        {
                            text: dissectStatus,
                            color: statusColor,
                            borderColor: statusBorderColor,
                        },
                    ].map((item, index) => {
                        const itemStyle: CSSProperties = {
                            color: item.color,
                            border: `1px solid ${item.borderColor}`,
                        }
                        if (item.color) {
                            itemStyle.backgroundColor = 'transparent'
                        }
                        return (
                            <div className={styles.TagItem} style={itemStyle} key={index}>
                                {item.text}
                            </div>
                        )
                    })}
                </div>
                {footerExtra || <span />}
            </footer>
            {children}
        </div>
    )
}
export default DataDissectSettingItem
