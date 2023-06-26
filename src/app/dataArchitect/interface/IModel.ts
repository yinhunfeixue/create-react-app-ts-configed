import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import ModelType from '@/app/dataArchitect/enum/ModelType'

/**
 * IModel
 */
export default interface IModel {
    modelId: string
    modelEnglishName: string
    modelChineseName?: string
    mainEntityName: string
    entityCount: number
    tableCount: number
    hasUpdate?: boolean
    modelStatus: ModelStatus
    modelType: ModelType
    modelPath?: string

    modelTableList?: any[]
}
