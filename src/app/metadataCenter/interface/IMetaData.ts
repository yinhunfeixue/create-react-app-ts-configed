import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'

/**
 * IMetaData
 */
export default interface IMetaData extends ITable, ISQL, IField, IReport, IMetaModel {
    id: string
    columnChnName: string
    columnEnName: string
}

export interface ITable {
    domain: MetaDataType
    bloodTableNum: number
    chnCompleteRatio: string
    columnEnNameList: ColumnEnNameList[]
    columnMarkRatio: string
    columnNum: number
    controlledColumnNum: number
    databaseId: string
    databaseName: string
    datasourceId: string
    datasourceName: string
    datasourceType: string
    isCredible: boolean
    otherLabel: ITag[]
    relationTableNum: number
    sensitiveColumnNum: number
    sensitiveLabel: ITag[]
    systemId: string
    systemName: string
    tableEnName: string
    tableChnName: string
    tableId: string
    techManager: string
    warehouseLevel: string
    warehouseClassify: string
    relationAppNum: number

    /**
     * 是否敏感数据
     */
    isSensitive?: boolean

    /**
     * 是否受控
     */
    isControlled?: boolean
}
export interface IReport {
    reportId: string
    reportMenu: string
    businessManager: string
    reportLevel: string
    allChainRelationNum: number
    sourceQualityRatio: number
    reportName: string
    updatePeriod: string
    relationTableNum: number
}
export interface ISQL {
    sqlType: string
    dataUpdateTime: string
    lineageName: string
    lineageId: string
}

export interface IField {
    columnId: string
    columnType: string
    isPrimaryKey: boolean
    isForeignKey: boolean
    mappingStandard: string
    securityLevel: string
    securityClassify: string
    checkRule: string
    jobName: string
}

interface ITag {
    tagId: string
    tagName: string
    tagType: number
}

interface ColumnEnNameList {
    isForeignKey: boolean
    isPrimaryKey: boolean
    name: string
    rank: number
}

interface IMetaModel {
    columnChnName: string
    columnEnName: string
    columnId: string
    databaseId: string
    databaseName: string
    datasourceId: string
    datasourceName: string
    domain: MetaDataType
    modelChineseName: string
    modelEnglishName: string
    modelEntityList: IModelEntityList[]
    modelId: string
    modelTypeDesc: string
    product: string
    systemId: string
    systemName: string
    tableChnName: string
    tableCount: number
    tableEnName: string
    tableId: string
    topic: string
}

interface IModelEntityList {
    entityName: string
    mainEntityFlag: boolean
}
