import EntityType from '@/app/dataArchitect/enum/EntityType'

/**
 * IEntity
 */
export default interface IEntity {
    entityId: string
    entityName: string
    type: EntityType
    tableName: string
    modelNames: string[]
    desc?: string
    topicName?: string
    topicId?: string
    topicPath?: string
}
