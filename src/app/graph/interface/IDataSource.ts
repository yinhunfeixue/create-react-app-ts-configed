import { ReactText } from 'react'

/**
 * IDataSource
 */
export default interface IDataSource {
    dataWarehouse: boolean
    databaseCount: number
    datasourceCName: string
    datasourceId: ReactText
    lineageTableCount: number
    techniqueManager: string
}
