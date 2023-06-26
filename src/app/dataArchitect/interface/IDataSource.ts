import IModelOwner from '@/app/dataArchitect/interface/IModelOwner'

/**
 * IDataSource
 */
export default interface IDataSource extends IModelOwner {
    datasourceId: string
}
