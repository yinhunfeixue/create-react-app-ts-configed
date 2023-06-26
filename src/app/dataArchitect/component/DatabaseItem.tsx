import ModelChart from '@/app/dataArchitect/component/ModelChart'
import IDatabase from '@/app/dataArchitect/interface/IDatabase'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import { Divider } from 'antd'
import React from 'react'
import styles from './DatabaseItem.module.less'

interface IDatabaseItemProps {
    data: IDatabase
}
/**
 * 数据库列表项
 * 包含：数据表名称、表数量、实体数量、模型数量
 */
const DatabaseItem: React.FC<IDatabaseItemProps> = (props) => {
    const { databaseId, databaseName, tableCount, entityCount, modelCount, modelDraftCount, modelDeployCount } = props.data

    const gotoDetailPage = () => {
        PageUtil.addTab('dataArchitectDatabase', { id: databaseId })
    }
    return (
        <div className={styles.DatabaseItem} onClick={() => gotoDetailPage()}>
            <header>
                <IconFont className={styles.IconDatabase} type='icon-shujukufill' />
                <span>{databaseName}</span>
            </header>
            <main>
                <div className={styles.Item}>
                    <h5>表数量</h5>
                    <div>
                        <span className={styles.Value}>{tableCount}</span>张
                    </div>
                </div>
                <div className={styles.Item}>
                    <h5>实体数量</h5>
                    <div>
                        <span className={styles.Value}>{entityCount}</span>张
                    </div>
                </div>
                <Divider type='vertical' style={{ height: 40 }} />
                <div className={styles.ModelInfo}>
                    <div className={styles.Item}>
                        <h5>模型数量</h5>
                        <div>
                            <span className={styles.Value}>{modelCount}</span>张
                        </div>
                    </div>
                    <ModelChart style={{ marginLeft: 20 }} publishedCount={modelDeployCount} draftModelCount={modelDraftCount} />
                </div>
            </main>
        </div>
    )
}
export default DatabaseItem
