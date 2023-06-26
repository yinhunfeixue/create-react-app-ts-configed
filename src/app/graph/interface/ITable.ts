import ISimpleField from '@/app/graph/interface/ISimpleField'

interface ITable {
    databaseEname: string
    databaseId: string
    datasourceCName: string
    tableEName: string
    tableCName: string
    tableId: string
    techniqueManager: string
    predecessorsCount: number
    successorsCount: number
    dwLevelTagName: string
    datasourceId: string
    datasourceType: string

    /**
     * 是否是依赖表
     */
    isRelyTable?: boolean

    fields: ISimpleField[]
}

export default ITable
