import NodePosition from '@/app/graph/enum/NodePosition'
import { TreeGraphData } from '@antv/g6'

/**
 * IErTable
 */
export interface IErTable {
    tableId: string
    tableDbEnglishName: string
    tableEnglishName: string
    tableChineseName: string
    fieldInfoList: IErField[]
}

export interface IErField {
    fieldId: string
    fieldName: string
    fieldNameDesc: string
    fieldType: string
    pkType?: number
    fkType?: number
    partitionFlag: boolean
    fieldPrecision: string
}

export interface IErTreeNode extends TreeGraphData {
    table: IErTable
    children?: IErTreeNode[]
    position: NodePosition
}

export interface IErResItem {
    linkTableFieldId: string
    linkType: 1 | 2
    mainTableFieldId: string
    tableInfo: IErTable
}
