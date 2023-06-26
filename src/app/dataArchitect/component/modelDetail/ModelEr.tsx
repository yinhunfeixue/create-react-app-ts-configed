import DataArchitectApi from '@/api/DataArchitectApi'
import ErGraph from '@/app/dataArchitect/component/ErGraph'
import IErNode, { IModelNode, ITableNode, NodeType } from '@/app/dataArchitect/interface/IErNode'
import IModel from '@/app/dataArchitect/interface/IModel'
import ErUtil from '@/app/dataArchitect/utils/ErUtil'
import DiagramItem from '@/app/graph/component/DiagramItem'
import GraphControl from '@/app/graph/component/GraphControl'
import GraphPageLayout from '@/app/graph/component/GraphPageLayout'
import ErDisplayLevel from '@/app/metadataCenter/enum/ErDisplayLevel'
import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import TreeControl from '@/utils/TreeControl'
import { Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './ModelEr.module.less'

interface IModelErProps {
    model: IModel
}

/**
 * 实体Er图
 */
const ModelEr: React.FC<IModelErProps> = (props) => {
    const { model } = props
    const { modelId, modelChineseName, modelEnglishName } = model
    const [graphData, setGraphData] = useState<IErNode<IModelNode | ITableNode> | undefined>(undefined)
    const [fieldDisplayType, setFieldDisplayType] = useState(ErDisplayLevel.ALL)
    const [graphKey, setGraphKey] = useState('')
    const [showModel, setShowModel] = useState(true)

    useEffect(() => {
        requestData()
    }, [modelId])

    const graphRef = useRef<ErGraph>(null)

    const requestData = () => {
        return DataArchitectApi.requestModelEr(modelId)
            .then((res) => {
                if (res.code === 200 && res.data) {
                    const erData = ErUtil.parseModelErData(res.data)
                    setGraphData(erData)
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
    console.log('modelgraphData', graphData)

    const displayGraphData = showModel
        ? graphData
        : new TreeControl<IErNode<IModelNode | ITableNode>>().filter([graphData], (node) => {
              return node.nodeType !== NodeType.model
          })[0]

    return (
        <GraphPageLayout
            className={styles.ModelEr}
            mainChildren={<ErGraph key={graphKey} data={displayGraphData} fieldDisplayType={fieldDisplayType} ref={graphRef} />}
            renderControlChildren={(params) => {
                const { isFull, fullFunction } = params
                return (
                    <>
                        <span className={styles.ModelName}>
                            <IconFont type='icon-moxingfill' /> {modelEnglishName} {modelChineseName ? `[${modelChineseName}]` : ''}
                        </span>
                        <GraphControl
                            getGraph={() => {
                                return (graphRef.current as ErGraph).graph
                            }}
                            onReload={async () => requestData()}
                            isFull={isFull}
                            fullFunction={fullFunction}
                        >
                            {[
                                {
                                    color: 'rgba(64, 129, 255, 1)',
                                    label: '表',
                                },
                                {
                                    color: 'rgba(104, 110, 226, 1)',
                                    label: (
                                        <span>
                                            <span>模型</span>
                                            <IconFont style={{ fontSize: 16, marginLeft: 12 }} onClick={() => setShowModel(!showModel)} type={showModel ? 'icon-xianshi1' : 'icon-yincang1'} />
                                        </span>
                                    ),
                                },
                            ].map((item, index) => {
                                return <DiagramItem key={index} label={item.label} color={item.color} />
                            })}
                            <div className='hr' />
                            <Select
                                bordered={false}
                                value={fieldDisplayType}
                                onChange={(value) => setFieldDisplayType(value)}
                                style={{ width: 100 }}
                                dropdownMatchSelectWidth={false}
                                options={ErDisplayLevel.ALL_LIST.map((item) => {
                                    return {
                                        value: item,
                                        label: ErDisplayLevel.toString(item),
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
export default ModelEr
