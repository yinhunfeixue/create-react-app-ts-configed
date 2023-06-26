/**
 * IField
 */
export default interface IField {
    actualDatasourceId: number
    codeItem?: any
    columnType: number
    columnTypeStatus: number
    contextPath: string
    dataType: string
    databaseId: string
    datasource: string
    datasourceId: number
    datasourceName: string
    desensitiseTag?: any
    effectTime: string
    entityId: string
    hasEffect: boolean
    heatRating: number
    id: string
    inPartitionDetail: boolean
    isAutoInc: boolean
    isCodeField: boolean
    isForeignKey: boolean
    isIndex: boolean
    isNull: boolean
    isPrimarykey: boolean
    isTemp: boolean
    levelConfirm: boolean
    physicalDb: string
    physicalField: string
    physicalFieldDesc: string
    physicalTable: string
    physicalTableId: string
    position: number
    securityLevel: string
    uri: string
}
