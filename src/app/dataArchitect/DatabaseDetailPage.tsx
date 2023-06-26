import DataArchitectApi from '@/api/DataArchitectApi'
import EntityEr from '@/app/dataArchitect/component/databaseDetail/EntityEr'
import EntityList from '@/app/dataArchitect/component/databaseDetail/EntityList'
import ModelList from '@/app/dataArchitect/component/databaseDetail/ModelList'
import ModelChart from '@/app/dataArchitect/component/ModelChart'
import IDatabase from '@/app/dataArchitect/interface/IDatabase'
import IconFont from '@/component/IconFont'
import PageFooter from '@/component/layout/PageFooter'
import ProjectUtil from '@/utils/ProjectUtil'
import { Divider, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './DatabaseDetailPage.module.less'

interface IDatabaseDetailPageProps {}
/**
 * 数据库详情
 * 包含：数据库信息、模型列表、实体列表、实体关系图
 */
const DatabaseDetailPage: React.FC<IDatabaseDetailPageProps> = (props) => {
    const [database, setDatabase] = useState<IDatabase>()
    const id = ProjectUtil.getPageParam(props).id

    useEffect(() => {
        requestDatabase()
    }, [])

    const requestDatabase = () => {
        DataArchitectApi.requestDatabaseOverview(id).then((res) => {
            setDatabase({
                ...res.data,
                databaseId: id,
            })
        })
    }

    const renderHeader = () => {
        if (!database) {
            return
        }
        const { databaseName, collectTime, datasourcePath, tableCount, entityCount, modelCount, modelDraftCount: draftModelCount, modelDeployCount } = database
        return (
            <header>
                <h3>
                    <IconFont type='icon-shujukufill' />
                    <span>{databaseName}</span>
                </h3>
                <div className={styles.Body}>
                    <div className={styles.Left}>
                        {[
                            {
                                icon: 'icon-ku',
                                label: '路径',
                                content: datasourcePath,
                            },
                            {
                                icon: 'icon-time1',
                                label: '采集时间',
                                content: collectTime,
                            },
                        ].map((item, index) => {
                            return (
                                <div key={index}>
                                    <IconFont type={item.icon} />
                                    <span>
                                        {item.label}：{item.content}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* 概览 */}
                    <div className={styles.Right}>
                        <div>
                            <h5>表数</h5>
                            <div className={styles.Value}>
                                <em>{tableCount}</em>张
                            </div>
                        </div>
                        <div>
                            <h5>关联实体</h5>
                            <div className={styles.Value}>
                                <em>{entityCount}</em>张
                            </div>
                        </div>
                        <Divider type='vertical' style={{ height: 40 }} />
                        <div>
                            <h5>模型</h5>
                            <div className={styles.Value}>
                                <em>{modelCount}</em>张
                            </div>
                        </div>
                        <ModelChart publishedCount={modelDeployCount} draftModelCount={draftModelCount} />
                    </div>
                </div>
            </header>
        )
    }
    return (
        <div className={styles.DatabaseDetailPage}>
            {renderHeader()}
            <main>
                <Tabs defaultActiveKey='0'>
                    {[
                        {
                            label: '实体模型',
                            content: <ModelList databaseId={id} />,
                        },
                        {
                            label: '实体列表',
                            content: <EntityList databaseId={id} />,
                        },
                        {
                            label: '实体关系图',
                            content: database ? <EntityEr database={database} /> : null,
                        },
                    ].map((item, index) => {
                        return (
                            <Tabs.TabPane tab={item.label} key={index}>
                                {item.content}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            </main>
            <PageFooter style={{ marginTop: 20 }} />
        </div>
    )
}
export default DatabaseDetailPage
