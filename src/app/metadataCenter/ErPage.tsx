import { requestGraphData } from '@/api/metadataIndex'
import GraphControl from '@/app/graph/component/GraphControl'
import GraphPageLayout from '@/app/graph/component/GraphPageLayout'
import NodePosition from '@/app/graph/enum/NodePosition'
import ErDisplayLevel from '@/app/metadataCenter/enum/ErDisplayLevel'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import ErGraph from '@/app/metadataCenter/er/ErGraph'
import { IErResItem, IErTable, IErTreeNode } from '@/app/metadataCenter/interface/IErTable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import AutoTip from '@/component/AutoTip'
import TreeControl from '@/utils/TreeControl'
import { Empty, Radio, Spin } from 'antd'
import React, { Component } from 'react'
import './ErPage.less'

interface IErPageState {
    data?: IErTreeNode
    displayLevel: ErDisplayLevel
    loading: boolean
}
interface IErPageProps extends IComponentProps {
    id: string
    type: MetaDataType
}

/**
 * ErPage
 */
class ErPage extends Component<IErPageProps, IErPageState> {
    private erGraph!: ErGraph
    constructor(props: IErPageProps) {
        super(props)
        this.state = {
            loading: false,
            displayLevel: ErDisplayLevel.ALL,
        }
    }

    componentDidMount() {
        this.requestData()
    }

    private requestData() {
        const { id, type } = this.props
        this.setState({ loading: true })
        return requestGraphData(id, type)
            .then((res) => {
                const data = res.data
                const { mainTableInfo, tableErLinkList } = data as { mainTableInfo: IErTable; tableErLinkList: IErResItem[] }
                if (!mainTableInfo) {
                    return
                }
                const treeControl = new TreeControl<IErResItem>()
                // 获取主结点
                const mainNode: IErTreeNode = {
                    id: mainTableInfo.tableId,
                    position: NodePosition.CENTER,
                    table: mainTableInfo,
                    children: [],
                }

                const isLeft = (item: IErResItem) => item.linkType !== 1
                // 获取左右子树
                const leftList: IErResItem[] = tableErLinkList ? tableErLinkList.filter((item) => isLeft(item)) : []
                const righList: IErResItem[] = tableErLinkList ? tableErLinkList.filter((item) => !isLeft(item)) : []

                const createErTreeNode = (node: IErResItem, position: NodePosition, children: IErTreeNode[] | undefined) => {
                    const { tableInfo, linkTableFieldId, mainTableFieldId } = node
                    const { tableId } = tableInfo
                    return {
                        id: `${tableId}-${linkTableFieldId}-${mainTableFieldId}`,
                        position: position,
                        table: node.tableInfo,
                        children: children || undefined,
                    }
                }

                const leftTree = treeControl.map<IErTreeNode>(leftList, (node, index, oldParent, newChildren) => {
                    return createErTreeNode(node, NodePosition.LEFT, newChildren)
                })

                const rightTree = treeControl.map<IErTreeNode>(righList, (node, index, oldParent, newChildren) => {
                    return createErTreeNode(node, NodePosition.RIGHT, newChildren)
                })

                mainNode.children = [...(leftTree || []), ...(rightTree || [])]
                this.setState({ data: mainNode })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    render() {
        const { data, displayLevel, loading } = this.state
        if (loading) {
            return (
                <Spin spinning>
                    <div style={{ marginTop: 60 }} />
                </Spin>
            )
        }
        if (!data) {
            return <Empty description='暂无数据' style={{ marginTop: 60 }} />
        }

        const { tableEnglishName, tableChineseName } = data.table
        const showDisplayRadio = Boolean(data.children && data.children.length)
        return (
            <GraphPageLayout
                className='ErPage'
                renderControlChildren={(params) => {
                    const { isFull, fullFunction } = params
                    return (
                        <>
                            <AutoTip className='ErTitle' content={`${tableEnglishName} ${tableChineseName ? `[${tableChineseName}]` : ''}`} />
                            <GraphControl
                                getGraph={() => {
                                    return this.erGraph.graph
                                }}
                                onReload={() => this.requestData()}
                                fullFunction={fullFunction}
                                isFull={isFull}
                            >
                                {/* 有子结点时，显示切换按钮 */}
                                {showDisplayRadio && (
                                    <Radio.Group
                                        value={displayLevel}
                                        onChange={(event) => {
                                            const value = event.target.value
                                            this.setState({ displayLevel: value })
                                        }}
                                        options={ErDisplayLevel.ALL_LIST.map((item) => {
                                            return {
                                                value: item,
                                                label: ErDisplayLevel.toString(item),
                                            }
                                        })}
                                    />
                                )}
                            </GraphControl>
                        </>
                    )
                }}
                mainChildren={
                    data ? (
                        <ErGraph
                            ref={(target) => {
                                if (target) {
                                    this.erGraph = target
                                }
                            }}
                            displayLevel={displayLevel}
                            data={data}
                        />
                    ) : (
                        <Empty />
                    )
                }
            />
        )
    }
}

export default ErPage
