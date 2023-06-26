import DissectStatus from '@/app/dataDissect/enum/DissectStatus'
import DissectType from '@/app/dataDissect/enum/DissectType'

/**
 * IAnalysisResult
 */
export default interface IAnalysisResult {
    analysisStatus: DissectStatus
    analysisTime?: number
    analysisType?: DissectType
    databaseName?: string
    datasourceName?: string
    tableId: string
    tableName?: string
    statusMessage?: string
}
