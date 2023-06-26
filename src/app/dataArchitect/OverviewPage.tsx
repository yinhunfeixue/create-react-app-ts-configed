import DataArchitectApi from '@/api/DataArchitectApi'
import { getSystemDs } from '@/api/systemApi'
import DatabaseItem from '@/app/dataArchitect/component/DatabaseItem'
import IDatabase from '@/app/dataArchitect/interface/IDatabase'
import IDataSource from '@/app/dataArchitect/interface/IDataSource'
import IModelOwner from '@/app/dataArchitect/interface/IModelOwner'
import SliderLayout from '@/component/layout/SliderLayout'
import Module from '@/component/Module'
import { SearchTree } from '@/components'
import { defaultTitleRender } from '@/components/trees/SearchTree'
import TreeControl from '@/utils/TreeControl'
import { Input, Spin } from 'antd'
import React, { ReactNode, useEffect, useState } from 'react'
import styles from './OverviewPage.module.less'

const iconEntity = require('app_images/dataArchitect/icon_entity.png')
const iconTable = require('app_images/dataArchitect/icon_table.png')
const iconModel = require('app_images/dataArchitect/icon_model.png')
const iconDraftModel = require('app_images/dataArchitect/icon_draftModel.png')

interface IOverviewPageProps {}
/**
 * 预览页
 * 包含：系统-->数据源列表、数据源概览、数据源中的数据库列表
 */
const OverviewPage: React.FC<IOverviewPageProps> = (props) => {
    const [treeData, setTreeData] = useState([])
    const [selectedDataSource, setSelectedDataSource] = useState<IDataSource | undefined>()
    const [databaseList, setDatabaseList] = useState<IDatabase[]>([])
    const [searchKey, setSearchKey] = useState('')
    const [overview, setOverview] = useState<IModelOwner | undefined>(undefined)

    const [loadingOverview, setLoadingOverview] = useState(false)
    const [loadingDatabaseList, setLoadingDatabaseList] = useState(false)

    useEffect(() => {
        requestSystemTree()
    }, [])

    useEffect(() => {
        requestDatabaseList()
        requestOverview()
    }, [selectedDataSource])

    const requestSystemTree = () => {
        const modifyTreeDataList = (arr: any) => {
            arr.forEach((child: any) => {
                child.key = `systemId${child.systemId}`
                child.title = child.systemName
                child.children = child.dsList
                child.children.forEach((item: any) => {
                    item.key = `datasourceId${item.datasourceId}`
                    item.title = item.datasourceName
                })
            })
            return arr
        }
        getSystemDs({ page: 1, page_size: Number.MAX_SAFE_INTEGER }).then((res) => {
            setTreeData(modifyTreeDataList(res.data))
        })
    }

    const requestDatabaseList = () => {
        if (!selectedDataSource) {
            return
        }
        const { datasourceId } = selectedDataSource
        setLoadingDatabaseList(true)
        DataArchitectApi.requestDatabaseListByDataSourceId(datasourceId)
            .then((res) => {
                setDatabaseList(res.data.data || [])
            })
            .finally(() => {
                setLoadingDatabaseList(false)
            })
    }

    const requestOverview = () => {
        if (!selectedDataSource) {
            return
        }
        const { datasourceId } = selectedDataSource
        setLoadingOverview(true)
        DataArchitectApi.requestDatasourceOverview(datasourceId)
            .then((res) => {
                setOverview(res.data.data)
            })
            .finally(() => {
                setLoadingOverview(false)
            })
    }

    const renderCard = (data: { icon: string; title: ReactNode; value: ReactNode; unit?: string }) => {
        const { icon, title, value, unit = '个' } = data
        return (
            <div className={styles.OverviewCard}>
                <img src={icon} />
                <main>
                    <h5>{title}</h5>
                    <div>
                        <em>{value}</em>
                        <span>{unit}</span>
                    </div>
                </main>
            </div>
        )
    }

    const overviewList = overview
        ? [
              {
                  icon: iconTable,
                  title: '表数量',
                  value: overview.tableCount,
              },
              {
                  icon: iconEntity,
                  title: '实体数量',
                  value: overview.entityCount,
              },
              {
                  icon: iconModel,
                  title: '模型数量',
                  value: overview.modelCount,
              },
              {
                  icon: iconDraftModel,
                  title: '发布/草稿模型',
                  value: `${overview.modelDeployCount} | ${overview.modelDraftCount}`,
              },
          ]
        : []

    const displayDatabaseList = databaseList.filter((item) => {
        return !searchKey || item.databaseName.toLowerCase().includes(searchKey.toLowerCase())
    })

    const selectChain = selectedDataSource ? new TreeControl().searchChain(treeData, (node) => node.datasourceId === selectedDataSource.datasourceId) : undefined

    return (
        <SliderLayout
            className={styles.OverviewPage}
            sliderBodyStyle={{ padding: 0 }}
            renderSliderHeader={function (): React.ReactNode {
                return '系统目录'
            }}
            renderSliderBody={() => {
                return (
                    <SearchTree
                        style={{ height: '100%' }}
                        treeTitleRender={(node, searchValue) => {
                            return defaultTitleRender(
                                node,
                                (data: any) => {
                                    return {
                                        icon: data.hasOwnProperty('systemIcon') ? <img style={{ width: 14, height: 14 }} src={data.systemIcon} /> : <span className='iconfont icon-xitong'> </span>,
                                        title: data.systemName || data.datasourceName,
                                    }
                                },
                                searchValue
                            )
                        }}
                        treeProps={{
                            treeData,
                            onSelect: (key, info: any) => setSelectedDataSource(info.node),
                        }}
                        defaultSelectedEqual={(node: any) => {
                            return Boolean(node.datasourceId)
                        }}
                        disableNodeSelect={(node) => !node.hasOwnProperty('datasourceId')}
                    />
                )
            }}
            renderContentHeader={function (): React.ReactNode {
                return selectChain ? selectChain.map((item) => item.title).join(' / ') : ''
            }}
            renderContentBody={function (): React.ReactNode {
                return (
                    <React.Fragment>
                        <Module title='数据概览'>
                            <Spin spinning={loadingOverview}>
                                <div className={styles.OverviewGroup}>
                                    {overviewList.map((item, index) => {
                                        return <React.Fragment key={index}>{renderCard(item)}</React.Fragment>
                                    })}
                                </div>
                            </Spin>
                        </Module>
                        <Module title='数据库信息'>
                            <div className='VControlGroup'>
                                <Input.Search placeholder='数据库名称' style={{ width: 462 }} value={searchKey} onChange={(event) => setSearchKey(event.target.value)} />
                                {/* 数据库列表 */}
                                <Spin spinning={loadingDatabaseList}>
                                    <div className={styles.DatabaseGroup}>
                                        {displayDatabaseList.map((item, index) => {
                                            return <DatabaseItem key={index} data={item} />
                                        })}
                                    </div>
                                </Spin>
                            </div>
                        </Module>
                    </React.Fragment>
                )
            }}
        />
    )
}
export default OverviewPage
