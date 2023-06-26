import { httpObj } from '@/api/base'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import { Key } from 'react'

/**
 * DataArchitectApi
 */
class DataArchitectApi {
    static requestDatasourceOverview(dataSourceId: Key) {
        return httpObj.httpGet(`/quantchiAPI/model/query/getDsModelOverview/${dataSourceId}`)
    }

    static requestDatabaseListByDataSourceId(dataSourceId: Key) {
        return httpObj.httpGet(`/quantchiAPI/model/query/listDb/${dataSourceId}`)
    }

    static async requestDatabaseOverview(databaseId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/getDbModelOverview/${databaseId}`)
        return res.data
    }

    static async requestModelListByDatabaseId(params: { page: number; pageSize: number; databaseId: Key; keyword?: string; modelStatus?: ModelStatus }) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/query/pageDbModel`, params)
        return res.data
    }

    static async requestOfflineCount(databaseId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/modelAlertTipsForDb/${databaseId}`)
        return res.data
    }

    static async requestModelOfflinMsg(modelId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/modelAlertTipsForModel/${modelId}`)
        return res.data
    }

    static async requestEntityListByDatabase(params: { databaseId: Key; page: number; pageSize: number; keyword?: string; entityType?: EntityType }) {
        const res = await httpObj.httpPost(`/quantchiAPI/entity/query/pageEntityModel`, params)
        return res.data
    }

    static async requestModelDetail(modelId: Key, params?: { tableName?: string }) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/query/get`, { modelId, ...params })
        return res.data
    }

    static async requestModelHistoryList(params: { modelId: Key; page: number; pageSize: number }) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/pageModelVersion`, params)
        return res.data
    }

    static async publishModel(modelId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/command/deployModel/${modelId}`)
        return res.data
    }

    static async offlineModel(modelId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/command/unDeployModel/${modelId}`)
        return res.data
    }

    static async requestFieldList(tableId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/columnList/${tableId}`)
        return res.data
    }

    static async requestLinkEntityAndTable(params: { entityId: Key; tableId: Key; mainTable?: boolean; oldEntityId?: Key }) {
        const res = await httpObj.httpGet(`/quantchiAPI/entity/command/mapTable`, params)
        return res.data
    }

    static async removeTableFromModel(params: { tableId: Key; modelId: Key }) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/command/deleteModelTable`, params)
        return res.data
    }

    static async setMainEntity(params: { modelId: Key; entityId: Key; mainEntityFlag: boolean }) {
        const res = await httpObj.httpGet(`/quantchiAPI/entity/command/modelMapEntity`, params)
        return res.data
    }

    static async editModel(modelId: Key, data: any) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/command/edit`, { ...data, modelId })
        return res.data
    }

    static async requestTableList(modelId: Key, inModel: boolean) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/listModelTable`, { modelId, inModel })
        return res.data
    }

    static async addTableToModel(params: {
        modelId: Key
        relationTable: {
            tableId: Key
            columnId: Key
            relationTableId: Key
            relationColumnId: Key

            relationDatabaseId?: Key
            databaseId?: Key
            datasourceId?: Key
            relationDatasourceId?: Key
        }
    }) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/command/addModelTable`, params)
        return res.data
    }

    static async requestDatabaseEr(databaseId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/entity/query/entityErGraph/${databaseId}`)
        return res.data
    }

    static async requestModelEr(modelId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/query/getModelErGraph/${modelId}`)
        return res.data
    }

    /**
     *
     * @param modelId
     * @returns
     */
    static async requestModelInfo(modelId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/dw/query/modelInfo/${modelId}`)
        return res.data
    }

    static async requestRemoveTableMessage(data: { modelId: Key; tableId: Key }) {
        const res = await httpObj.httpPost(`/quantchiAPI/model/command/deleteModelTable/confirm`, data)
        return res.data
    }

    static async requestModelInfoTableList(param: { modelId: Key; tableName?: string }) {
        const res = await httpObj.httpGet(`/quantchiAPI/model/dw/query/pageTable`, { ...param, pageSize: 9999, page: 1 })
        return res.data
    }
}
export default DataArchitectApi
