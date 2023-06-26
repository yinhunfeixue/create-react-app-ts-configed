import IModelOwner from '@/app/dataArchitect/interface/IModelOwner'

/**
 * IDatabase
 */
export default interface IDatabase extends IModelOwner {
    databaseId: string
    databaseName: string
    collectTime?: string
    datasourcePath?: string
}
