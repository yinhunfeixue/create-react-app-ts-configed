import IErNode, { IModelNode, ITableNode, NodeType } from '@/app/dataArchitect/interface/IErNode'
import NodePosition from '@/app/graph/enum/NodePosition'
import { Key } from 'react'

/**
 * ErUtil
 */
class ErUtil {
    static parseModelErData(data: any): IErNode<IModelNode | ITableNode> {
        let id = 1
        const pareseTable = (table: any, linkList: any[], position?: NodePosition, erLinkType?: linkType) => {
            const result: IErNode<IModelNode | ITableNode> = {
                data: {
                    ...table,
                    erLinkType,
                },
                nodeType: NodeType.table,
                position: position || NodePosition.CENTER,
                id: (id++).toString(),
            }
            if (linkList && linkList.length) {
                const children: any[] = []
                linkList.forEach((item: any, index) => {
                    // 分别获取子模型和子表格
                    const { modelInfo, tableInfo, type, tableLinkErLinkList, linkType } = item
                    // 1是表，3是模型
                    if (type === 1) {
                        children.push(pareseTable(tableInfo, tableLinkErLinkList, position || (index % 2 === 0 ? NodePosition.LEFT : NodePosition.RIGHT), linkType))
                    } else {
                        const modelNode: IErNode<IModelNode | ITableNode> = {
                            data: {
                                ...modelInfo,
                                erLinkType: linkType,
                            },
                            position: position || NodePosition.CENTER,
                            nodeType: NodeType.model,
                            id: (id++).toString(),
                        }
                        children.push(modelNode)
                    }
                })
                result.children = children || []
            }

            return result
        }

        // 获取主结点
        const { mainTableInfo, tableErLinkList } = data
        return pareseTable(mainTableInfo, tableErLinkList)
    }

    static parseDatabaseErData(data: any): IErNode<IModelNode> | undefined {
        const { midModelId, linkModelInfoMap, modelInfoMap } = data
        /**
         * 记录已经读取的数据ID，不重复读取，防止死循环
         */
        const usedDic: { [key: string]: true } = {}
        let id = 1

        const createNode = (modelId: Key, position?: NodePosition) => {
            if (!modelId) {
                return
            }
            usedDic[modelId] = true
            // 获取表自身的数据
            const selfData = modelInfoMap[modelId]
            // 获取子列表
            const childrenList = linkModelInfoMap[modelId]

            const result: IErNode<IModelNode> = {
                data: {
                    ...selfData,
                    modelTableInfoList: selfData.modelTableList,
                },
                position: position || NodePosition.CENTER,
                nodeType: NodeType.model,
                id: (id++).toString(),
            }

            if (childrenList && childrenList.length) {
                const children: IErNode<IModelNode>[] = []
                childrenList.forEach((item: any, index: number) => {
                    if (!usedDic[item.linkModelId]) {
                        let data = createNode(item.linkModelId, position || (index % 2 === 0 ? NodePosition.LEFT : NodePosition.RIGHT))
                        if (data) {
                            data.data = {
                                ...data.data,
                                commonTableId: item.commonTableId,
                                commonTableName: item.commonTableName,
                                erLinkType: item.erLinkType,
                            }
                            children.push(data)
                        }
                    }
                })
                result.children = children
            }

            return result
        }

        return createNode(midModelId)
    }
}
export default ErUtil
