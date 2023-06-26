import DataArchitectApi from '@/api/DataArchitectApi'
import ErGraph from '@/app/dataArchitect/component/ErGraph'
import ErDisplayType from '@/app/dataArchitect/enum/ErDisplayType'
import IDatabase from '@/app/dataArchitect/interface/IDatabase'
import IErNode, { IModelNode, ITableNode } from '@/app/dataArchitect/interface/IErNode'
import ErUtil from '@/app/dataArchitect/utils/ErUtil'
import GraphControl from '@/app/graph/component/GraphControl'
import GraphPageLayout from '@/app/graph/component/GraphPageLayout'
import EmptyIcon from '@/component/EmptyIcon'
import { Empty, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './EntityEr.module.less'

interface IEntityErProps {
    database: IDatabase
}

/**
 * 实体Er图
 */
const EntityEr: React.FC<IEntityErProps> = (props) => {
    const { database } = props
    const { databaseId } = database
    const [displayType, setDisplayType] = useState<ErDisplayType>(ErDisplayType.ALL_TABLE)
    const [graphData, setGraphData] = useState<IErNode<IModelNode | ITableNode>>()
    const [graphKey, setGraphKey] = useState('')

    useEffect(() => {
        requestData()
    }, [databaseId])

    const graphRef = useRef<ErGraph>(null)

    const changeDisplayType = (value: ErDisplayType) => {
        setDisplayType(value)
    }

    const requestData = () => {
        return DataArchitectApi.requestDatabaseEr(databaseId) ///'8871650267362116278'
            .then((res) => {
                if (res.code === 200) {
                    const data = ErUtil.parseDatabaseErData(res.data)
                    setGraphData(data)
                } else {
                    setGraphData(undefined)
                }
                setGraphKey(Date.now().toString())
            })
            .catch(() => {
                setGraphData(undefined)
            })
    }
    if (!graphData) {
        return <EmptyIcon />
    }

    return (
        <GraphPageLayout
            className={styles.EntityEr}
            mainChildren={graphData ? <ErGraph style={{ height: 800 }} key={graphKey} data={graphData} modelDisplayType={displayType} ref={graphRef} /> : <Empty />}
            renderControlChildren={(params) => {
                const { isFull, fullFunction } = params
                return (
                    <>
                        <span className={styles.DBName}>{database.databaseName}</span>
                        <GraphControl
                            getGraph={() => {
                                return (graphRef.current as ErGraph).graph
                            }}
                            onReload={() => requestData()}
                            isFull={isFull}
                            fullFunction={fullFunction}
                        >
                            <Select
                                style={{ width: 90 }}
                                bordered={false}
                                value={displayType}
                                onChange={(value) => changeDisplayType(value)}
                                options={ErDisplayType.ALL.map((item) => {
                                    return {
                                        value: item,
                                        label: ErDisplayType.toString(item),
                                    }
                                })}
                            />
                        </GraphControl>
                    </>
                )
            }}
        />
    )
}
export default EntityEr
