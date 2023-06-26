import IconFont from '@/component/IconFont'
import { Tooltip } from 'antd'
import React from 'react'
import styles from './OverviewItem.module.less'
interface IOverviewItemProps {
    data: {
        icon?: string
        title: React.ReactNode
        content: React.ReactNode
        showTag?: boolean
    }
}
/**
 * OverviewItem
 */
const OverviewItem: React.FC<IOverviewItemProps> = (props) => {
    const { icon, title, content, showTag } = props.data
    return (
        <div className={styles.OverviewItem}>
            <img src={icon} className={styles.Icon} />
            <main>
                <h5>
                    <span>{title}</span>
                    {showTag ? (
                        <Tooltip title='血缘字段标识'>
                            <IconFont type='icon-dingwei' />
                        </Tooltip>
                    ) : (
                        <span />
                    )}
                </h5>
                <div>{content}</div>
            </main>
        </div>
    )
}
export default OverviewItem
