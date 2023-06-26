import { httpObj } from './base'

export async function reuqestDataSourceMap() {
    const data = await httpObj.httpGet(`/quantchiAPI/api/lineage/graph/datasource`)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function reuqestDataSourceDetail(id) {
    const data = await httpObj.httpGet(`/quantchiAPI/api/lineage/graph/datasource/vertex/${id}`)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function reuqestTableList(datasourceId) {
    const data = await httpObj.httpPost(`/quantchiAPI/api/lineage/graph/datasource/lineage-table`, {
        datasourceId: Number(datasourceId),
        needAll: true,
        page: 1,
        pageSize: 10000,
    })
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function reuqestTableGraphData(tableId, fieldId) {
    const data = await httpObj.httpPost(`/quantchiAPI/api/lineage/graph/table`, { tableId, fieldId })
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestFieldList(tableId) {
    const data = await httpObj.httpPost(`/quantchiAPI/api/dwapp/table/column/normal`, { tableId, needAll: true, page: 1, pageSize: 10000 })
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestFieldGraphData(tableId, middleTableId, analyzeFieldIdList, isSuccessors) {
    const data = await httpObj.httpPost(`/quantchiAPI/api/lineage/graph/field`, { tableId, middleTableId, analyzeFieldIdList, isSuccessors })
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestFieldLinkPath(tableId, fieldId) {
    const data = await httpObj.httpPost(`/quantchiAPI/api/lineage/graph/field/link-path`, { tableId, fieldId })
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestReportListForTable(tableId) {
    const data = await httpObj.httpGet(`/quantchiAPI/api/lineage/graph/table/report/${tableId}`)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function reuqestReportGraphData(id) {
    const data = await httpObj.httpGet(`/quantchiAPI/api/lineage/graph/report/${id}`)
    if (data == undefined) {
        return false
    }
    return data.data
}
