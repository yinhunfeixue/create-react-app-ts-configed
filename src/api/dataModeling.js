import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['dataModeling']

// 列表 - 获取数据表治理列表
export async function governTable(params = {}) {
    const data = await httpObj.httpPost(apiList['governTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 编辑 - 获取表的治理信息
export async function governTableDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['governTable'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 列表 - 申请人过滤器
export async function applicantFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['applicantFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 编辑 - 获取字段的治理信息
export async function governColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['governColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveGovern(params = {}) {
    const data = await httpObj.httpPost(apiList['saveGovern'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sensitiveTagRule(params = {}) {
    const data = await httpObj.httpGet(apiList['sensitiveTagRule'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function foreignSelectorSuggest(params = {}) {
    const data = await httpObj.httpGet(apiList['foreignSelectorSuggest'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function foreignSelectorDb(params = {}) {
    const data = await httpObj.httpGet(apiList['foreignSelectorDb'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function foreignSelectorTable(params = {}) {
    const data = await httpObj.httpGet(apiList['foreignSelectorTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function foreignSelectorColumn(params = {}) {
    const data = await httpObj.httpGet(apiList['foreignSelectorColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function auditRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['auditRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function auditRecordDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['auditRecord'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function auditRecordFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['auditRecordFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function datamodelingTable(params = {}) {
    const data = await httpObj.httpPost(apiList['datamodelingTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datasourceFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['datasourceFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function groupFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['groupFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function creatorFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['creatorFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tableGroup(params = {}) {
    const data = await httpObj.httpGet(apiList['tableGroup'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function addTableGroup(params = {}) {
    const data = await httpObj.httpPost(apiList['tableGroup'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delTableGroup(params = {}) {
    const data = await httpObj.httpDel(apiList['tableGroup'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datamodelingTableDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['datamodelingTable'] + '/' + params.tableId)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tableColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['tableColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dataTypeFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['dataTypeFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function tableDdlDownload(params = {}) {
    httpObj.httpPostDownload(apiList['tableDdlDownload'], params)
    return
}

export async function rootAudit(params = {}) {
    const data = await httpObj.httpPost(apiList['rootAudit'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function parseDDL(params = {}) {
    const data = await httpObj.httpPost(apiList['parseDDL'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function detailForEdit(params = {}) {
    const data = await httpObj.httpGet(apiList['detailForEdit'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function candidateRootCheck(params = {}) {
    const data = await httpObj.httpPost(apiList['candidateRootCheck'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function candidateRootReplace(params = {}) {
    const data = await httpObj.httpPost(apiList['candidateRootReplace'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function suffixRoots(params = {}) {
    const data = await httpObj.httpGet(apiList['suffixRoots'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function simpleLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['simpleLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function generatePrefixOrSuffix(params = {}) {
    const data = await httpObj.httpPost(apiList['generatePrefixOrSuffix'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function partitionColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['partitionColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function governPartitionColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['governPartitionColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function partitionExpMeSql(params = {}) {
    const data = await httpObj.httpGet(apiList['partitionExpMeSql'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}