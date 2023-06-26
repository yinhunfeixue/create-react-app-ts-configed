import ErLinkType from '@/app/dataArchitect/enum/ErLinkType'
import NodePosition from '@/app/graph/enum/NodePosition'
import { ModelConfig, TreeGraphData } from '@antv/g6'
import { Key } from 'react'

export enum NodeType {
    table = 1,
    model = 3,
}

/**
 * IErNode
 */
export default interface IErNode<T extends ModelConfig = ModelConfig> extends TreeGraphData {
    data: T
    children?: IErNode<T>[]
    position: NodePosition
    nodeType: NodeType
}

export interface IModelNode extends ModelConfig {
    modelId: Key
    modelEnglishName: string
    modelChineseName: string
    mainEntityName: string
    commonTableId?: Key
    /**
     * 共用表名称
     */
    commonTableName?: string
    erLinkType?: ErLinkType
    modelTableInfoList: {
        entityName: string
        tableChineseName: string
        tableEnglishName: string
        tableId: Key
    }[]
}

export interface ITableNode extends ModelConfig {
    tableId: Key
    tableEnglishName: string
    tableZHName: string
    dbName: string
    tableDbEnglishName?: string
    erLinkType?: ErLinkType
    fieldInfoList: {
        fieldId: Key
        fieldName: string
        fieldNameDesc: string
        fieldPrecision: string
        fieldType: string
        fkType: number
        pkType: number
    }[]
}
