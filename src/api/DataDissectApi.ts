import { httpObj } from '@/api/base'
import DissectType from '@/app/dataDissect/enum/DissectType'
import FieldType from '@/app/dataDissect/enum/FieldType'
import SpotCheckType from '@/app/dataDissect/enum/SpotCheckType'
import IDissectSetting from '@/app/dataDissect/interface/IDissectSetting'
import { Key } from 'react'

/**
 * 数据剖析
 */
class DataDissectApi {
    static async requestResultList(params: { page: number; pageSize: number; keyword?: string; analysisType?: DissectType; databaseId?: Key; datasourceId?: Key }) {
        const res = await httpObj.httpPost(`/service-qa/dataAnalysis/queryAnalysisResultList`, params)
        return res.data
    }

    static async requestConfigData(tableId: Key) {
        const res = await httpObj.httpGet(`/service-qa/dataAnalysis/getTableConfig`, { tableId })
        return res.data
    }

    static async requestFieldList(tableId: Key) {
        const res = await httpObj.httpGet(`/service-qa/dataAnalysis/queryDefaultTranslateType`, { tableId })
        return res.data
    }

    static async removeConfig(tableId: Key) {
        const res = await httpObj.httpDel(`/service-qa/dataAnalysis/deleteConfig`, { params: { tableId } })
        return res.data
    }

    static async saveDissectSetting(data: IDissectSetting, isEdit = true) {
        const body = {
            analysisType: data.analysisType,
            columnConfigList: data.columnConfigList,
            databaseId: data.target.databaseId,
            databaseName: data.target.databaseName,
            datasourceId: data.target.datasourceId,
            datasourceName: data.target.datasourceName,
            latelyAnalysisRecordId: data.latelyAnalysisRecordId,
            product: data.target.product,
            samplingConfig: data.samplingType === SpotCheckType.CONTINUOUS ? data.spotNumber : data.spotSql,
            samplingType: data.samplingType,
            tableId: data.target.tableId,
            tableName: data.target.tableName,
        }

        const url = isEdit ? `/service-qa/dataAnalysis/editConfig` : `/service-qa/dataAnalysis/addConfig`

        const res = await httpObj.httpPost(url, body)
        return res.data
    }

    static async requestResultDetail(params: { tableId: Key; columnName?: string; columnTransformType?: FieldType }) {
        const res = await httpObj.httpGet(`/service-qa/dataAnalysis/queryAnalysisResultDetail`, params)
        return res.data
    }

    static async requestDatabaseTree() {
        const res = await httpObj.httpGet(`/service-qa/dataAnalysis/queryTableSource`)
        return res.data
    }

    static async requestDissectTableList(databaseId: Key) {
        const res = await httpObj.httpGet(`/service-qa/dataAnalysis/getNoConfigTableList`, { databaseId })
        return res.data
    }
}
export default DataDissectApi
