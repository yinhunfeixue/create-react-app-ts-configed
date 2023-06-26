import {
    httpObj
} from './base'

import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['autoManage']

export async function addManualJob(params = {}) {
    const data = await httpObj.httpPost(apiList['addManualJob'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getManualJob(params = {}) {
    const data = await httpObj.httpPost(apiList['getManualJob'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDataSource(params = {}) {
    const data = await httpObj.httpPost(apiList['getDataSource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getGenFileDataSource(params = {}) {
    const data = await httpObj.httpPost(apiList['getGenFileDataSource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addDgdlGen(params = {}) {
    const data = await httpObj.httpPost(apiList['addDgdlGen'] + '?fileTpl=' + params.fileTpl + '&jobName=' + params.jobName + '&datasourceId=' + params.datasourceId + '&fileName=' + params.fileName + '&isNormative=' + params.isNormative + '&synchronously=' + params.synchronously)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDGDLFile(params = {}) {
    httpObj.httpGetDownload(apiList['getDGDLFile'], params)
    return
}

export async function displayTableCountsByPartOfDataSourceName(params = {}) {
    const data = await httpObj.httpPost(apiList['displayTableCountsByPartOfDataSourceName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function displayItemCountsGroupByTable(params = {}) {
    const data = await httpObj.httpPost(apiList['displayItemCountsGroupByTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function displayAuditRecordsByItem(params = {}) {
    const data = await httpObj.httpPost(apiList['displayAuditRecordsByItem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function displayColumnInfoByDGDLItem(params = {}) {
    const data = await httpObj.httpPost(apiList['displayColumnInfoByDGDLItem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dgdlItemConfirm(params = {}) {
    const data = await httpObj.httpPost(apiList['dgdlItemConfirm'] + '?checkOrNot=' + params.checkOrNot + '&item=' + params.item + '&userName=' + params.userName, params.columnDGDLItemList)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function GovByDatasourceManually(params = {}) {
    const data = await httpObj.httpPost(apiList['GovByDatasourceManually'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDGDLJobLog(params = {}) {
    const data = await httpObj.httpGet(apiList['getDGDLJobLog'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function displayTableInfoByDGDLItem(params = {}) {
    const data = await httpObj.httpPost(apiList['displayTableInfoByDGDLItem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tableDGDLconfirm(params = {}) {
    const data = await httpObj.httpPost(apiList['tableDGDLconfirm'] + '?checkOrNot=' + params.checkOrNot + '&item=' + params.item + '&userName=' + params.userName, params.tableDGDLItem)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function latestVersionList(params = {}) {
    const data = await httpObj.httpGet(apiList['latestVersionList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function latestDiffStatistic(params = {}) {
    const data = await httpObj.httpGet(apiList['latestDiffStatistic'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function latestDiffDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['latestDiffDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function latestDiffDetailFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['latestDiffDetailFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateVerInfo(params = {}) {
    const data = await httpObj.httpPost(apiList['updateVerInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function fixedVersionList(params = {}) {
    const data = await httpObj.httpPost(apiList['fixedVersionList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function submitter(params = {}) {
    const data = await httpObj.httpGet(apiList['submitter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function versionDiffStatistic(params = {}) {
    const data = await httpObj.httpGet(apiList['versionDiffStatistic'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function versionDiffDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['versionDiffDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function versionDiffDetailFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['versionDiffDetailFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getLatestDiff(params = {}) {
    const data = await httpObj.httpGet(apiList['getLatestDiff'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function domainTypes(params = {}) {
    const data = await httpObj.httpGet(apiList['domainTypes'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function subscribe(params = {}) {
    const data = await httpObj.httpPost(apiList['subscribe'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function pushTypes(params = {}) {
    const data = await httpObj.httpGet(apiList['pushTypes'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveSubscribe(params = {}) {
    const data = await httpObj.httpPost(apiList['saveSubscribe'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function manageSubscribe(params = {}) {
    const data = await httpObj.httpPost(apiList['manageSubscribe'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function manageSubscribeFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['manageSubscribeFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function removeSubsUser(params = {}) {
    const data = await httpObj.httpPost(apiList['removeSubsUser'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function subsUserList(params = {}) {
    const data = await httpObj.httpPost(apiList['subsUserList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveSubsUserList(params = {}) {
    const data = await httpObj.httpPost(apiList['saveSubsUserList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function pushRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['pushRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function pushRecordUsers(params = {}) {
    const data = await httpObj.httpGet(apiList['pushRecordUsers'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dsSetting(params = {}) {
    const data = await httpObj.httpPost(apiList['dsSetting'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function dsSettingDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['dsSetting'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveDsSetting(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDsSetting'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterTable(params = {}) {
    const data = await httpObj.httpPost(apiList['filterTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterTableDb(params = {}) {
    const data = await httpObj.httpPost(apiList['filterTableDb'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function changeFilterStatus(params = {}) {
    const data = await httpObj.httpPost(apiList['changeFilterStatus'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterRule(params = {}) {
    const data = await httpObj.httpPost(apiList['filterRule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterRuleDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['filterRule'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delFilterRule(params = {}) {
    const data = await httpObj.httpDel(apiList['filterRule'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveFilterRule(params = {}) {
    const data = await httpObj.httpPost(apiList['saveFilterRule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterTypes(params = {}) {
    const data = await httpObj.httpGet(apiList['filterTypes'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function filterOpts(params = {}) {
    const data = await httpObj.httpGet(apiList['filterOpts'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function schemaDiffTask(params = {}) {
    const data = await httpObj.httpPost(apiList['schemaDiffTask'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function schemaDiffTaskDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['schemaDiffTask'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function taskFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['taskFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function diffStatistic(params = {}) {
    const data = await httpObj.httpGet(apiList['diffStatistic'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function diffDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['diffDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function diffDetailFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['diffDetailFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function taskDetailForEdit(params = {}) {
    const data = await httpObj.httpGet(apiList['taskDetailForEdit'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveTask(params = {}) {
    const data = await httpObj.httpPost(apiList['saveTask'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function latestDiffTree(params = {}) {
    const data = await httpObj.httpGet(apiList['latestDiffTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function schemaDiffTree(params = {}) {
    const data = await httpObj.httpPost(apiList['schemaDiffTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tableVersionList(params = {}) {
    const data = await httpObj.httpGet(apiList['tableVersionList'] + params.id, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function fixedVersionTree(params = {}) {
    const data = await httpObj.httpGet(apiList['fixedVersionTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datasourceMappingFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['datasourceMappingFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDatabaselist(params = {}) {
    const data = await httpObj.httpGet(apiList['getDatabaselist'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getTables(params = {}) {
    const data = await httpObj.httpPost(apiList['getTables'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function whitelistTableSave(params = {}) {
    const data = await httpObj.httpPost(apiList['whitelistTableSave'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function databaseList(params = {}) {
    const data = await httpObj.httpGet(apiList['databaseList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}



export async function inputWhitelistTableByFile(params = {}) {
    const data = await httpObj.httpPost(apiList['inputWhitelistTableByFile'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function whiteListTableDelete(params = {}) {
    const data = await httpObj.httpDel(apiList['whiteListTableDelete'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}