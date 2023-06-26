import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['dataSecurity']

// 左侧树信息
export async function datasecuritySearchTree(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecuritySearchTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 过滤器信息
export async function datasecuritySearchFilters(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecuritySearchFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 搜索数据
export async function datasecuritySearch(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecuritySearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 获取数据安全级别列表
export async function dataSecurityLevelList(params = {}) {
    const data = await httpObj.httpGet(apiList['dataSecurityLevelList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取单个配置分类分级列表数据
export async function dsColumnInfoList(params = {}) {
    const data = await httpObj.httpGet(apiList['dsColumnInfoList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取字段配置预览数据
export async function previewColumnBatchConfig(params = {}) {
    const data = await httpObj.httpPost(apiList['previewColumnBatchConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 保存字段配置数据
export async function saveColumnBatchConfig(params = {}) {
    const data = await httpObj.httpPost(apiList['saveColumnBatchConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存单个配置数据
export async function saveSingleConfig(params = {}) {
    const data = await httpObj.httpPost(apiList['saveSingleConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存表配置数据
export async function saveTableBatchConfig(params = {}) {
    const data = await httpObj.httpPost(apiList['saveTableBatchConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据表详情页：获取表的字段的安全级别数据
export async function listTableDetailDsData(params = {}) {
    const data = await httpObj.httpPost(apiList['listTableDetailDsData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取单个配置分类分级列表数据
export async function getDsColumnInfoList(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsColumnInfoList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取字段最新发布版本和未发布数据
export async function getDsColumnDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsColumnDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listColumnHistory(params = {}) {
    const data = await httpObj.httpPost(apiList['listColumnHistory'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsTableDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsTableDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchDsVersion(params = {}) {
    const data = await httpObj.httpPost(apiList['searchDsVersion'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function listTableHistory(params = {}) {
    const data = await httpObj.httpPost(apiList['listTableHistory'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getFixVersionStatisticsData(params = {}) {
    const data = await httpObj.httpGet(apiList['getFixVersionStatisticsData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function queryDsTableClassifyFixVersionData(params = {}) {
    const data = await httpObj.httpPost(apiList['queryDsTableClassifyFixVersionData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function queryDsColumnClassifyFixVersionData(params = {}) {
    const data = await httpObj.httpPost(apiList['queryDsColumnClassifyFixVersionData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getSystemInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['getSystemInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function confirmFixVersion(params = {}) {
    const data = await httpObj.httpPost(apiList['confirmFixVersion'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsVersionById(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsVersionById'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function searchDsTableFixVersionData(params = {}) {
    const data = await httpObj.httpPost(apiList['searchDsTableFixVersionData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function searchDsColumnFixVersionData(params = {}) {
    const data = await httpObj.httpPost(apiList['searchDsColumnFixVersionData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitizerule(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitizerule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function delDesensitizerule(params = {}) {
    const data = await httpObj.httpDel(apiList['desensitizerule'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function saveDesensitizerule(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDesensitizerule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnDesensitizerule(params = {}) {
    const data = await httpObj.httpPost(apiList['columnDesensitizerule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function delColumnDesensitizerule(params = {}) {
    const data = await httpObj.httpDel(apiList['columnDesensitizerule'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function addColumnRule(params = {}) {
    const data = await httpObj.httpPost(apiList['addColumnRule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateColumnRule(params = {}) {
    const data = await httpObj.httpPost(apiList['updateColumnRule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnDesensitizeruleDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['columnDesensitizerule'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listAllAuditUser(params = {}) {
    const data = await httpObj.httpGet(apiList['listAllAuditUser'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchActiveDsTableClassifyData(params = {}) {
    const data = await httpObj.httpPost(apiList['searchActiveDsTableClassifyData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function confirmAudit(params = {}) {
    let paramsStr = ''
    if (params.tableIdList) {
        params.tableIdList.map((item,index) => {
            paramsStr += index == 0?('tableIdList=' + item):('&tableIdList=' + item)
        })
    }
    const data = await httpObj.httpPost(apiList['confirmAudit'] + '?' + paramsStr)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getAuditContentByTableId(params = {}) {
    const data = await httpObj.httpGet(apiList['getAuditContentByTableId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsAuditLogById(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsAuditLogById'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchDsAuditLog(params = {}) {
    const data = await httpObj.httpPost(apiList['searchDsAuditLog'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitizeruleDatasource(params = {}) {
    const data = await httpObj.httpGet(apiList['desensitizeruleDatasource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitizeruleDatabase(params = {}) {
    const data = await httpObj.httpGet(apiList['desensitizeruleDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listAllConfigedDatabase(params = {}) {
    const data = await httpObj.httpGet(apiList['listAllConfigedDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function listAllConfigedDatasource(params = {}) {
    const data = await httpObj.httpGet(apiList['listAllConfigedDatasource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function dataSecurityDownload(params) {
    httpObj.httpPostDownload(apiList['dataSecurityDownload'], params)
    return
}

export async function toggleRuleStatus(params = {}) {
    const data = await httpObj.httpPost(apiList['toggleRuleStatus'] + '?id=' + params.id + '&status=' + params.status)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getSystemTree(params = {}) {
    const data = await httpObj.httpGet(apiList['getSystemTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function DelSystemTree(params = {}) {
    const data = await httpObj.httpDel(apiList['getSystemTree'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sortNodes(params = {}) {
    const data = await httpObj.httpPost(apiList['sortNodes'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function flatPreview(params = {}) {
    const data = await httpObj.httpGet(apiList['flatPreview'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function replaceBizTree(params = {}) {
    const data = await httpObj.httpGet(apiList['replaceBizTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function suggestPath(params = {}) {
    const data = await httpObj.httpGet(apiList['suggestPath'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addBizTree(params = {}) {
    const data = await httpObj.httpPost(apiList['addBizTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateBizTree(params = {}) {
    const data = await httpObj.httpPost(apiList['updateBizTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function bizTree(params = {}) {
    const data = await httpObj.httpGet(apiList['bizTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delBizTree(params = {}) {
    const data = await httpObj.httpDel(apiList['bizTree'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delDataWarehouseTree(params = {}) {
    const data = await httpObj.httpDel(apiList['dataWarehouseTree'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function dataWarehouseTree(params = {}) {
    const data = await httpObj.httpGet(apiList['dataWarehouseTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addDataWarehouseTree(params = {}) {
    const data = await httpObj.httpPost(apiList['addDataWarehouseTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function updateDataWarehouseTree(params = {}) {
    const data = await httpObj.httpPost(apiList['updateDataWarehouseTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function listByCodes(params = {}) {
    const data = await httpObj.httpPost(apiList['listByCodes'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function analysisThemeTree(params = {}) {
    const data = await httpObj.httpGet(apiList['analysisThemeTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function DelAnalysisThemeTree(params = {}) {
    const data = await httpObj.httpDel(apiList['analysisThemeTree'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addAnalysisThemeTree(params = {}) {
    const data = await httpObj.httpPost(apiList['addAnalysisThemeTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateAnalysisThemeTree(params = {}) {
    const data = await httpObj.httpPost(apiList['updateAnalysisThemeTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTagClass(params = {}) {
    const data = await httpObj.httpGet(apiList['desensitiseTagClass'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delDesensitiseTagClass(params = {}) {
    const data = await httpObj.httpDel(apiList['desensitiseTagClass'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveDesensitiseTagClass(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDesensitiseTagClass'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTag(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitiseTag'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function desensitiseTagDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['desensitiseTag'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function changeTagStatus(params = {}) {
    const data = await httpObj.httpPost(apiList['changeTagStatus'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sensitiveLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['sensitiveLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tagSecurityLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['tagSecurityLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function allSensitiveLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['allSensitiveLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveDesensitiseTag(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDesensitiseTag'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delDesensitiseTagColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['delDesensitiseTagColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTagColumnPreview(params = {}) {
    const data = await httpObj.httpGet(apiList['desensitiseTagColumnPreview'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function systemFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['systemFilter'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function databaseFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['databaseFilter'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTagColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitiseTagColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveDesensitiseTagColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDesensitiseTagColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTagColumnSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitiseTagColumnSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitiseTagColumnSearchFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitiseTagColumnSearchFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function mappingSystem(params = {}) {
    const data = await httpObj.httpPost(apiList['mappingSystem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function mappingDatabase(params = {}) {
    const data = await httpObj.httpGet(apiList['mappingDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveMappingDatabase(params = {}) {
    const data = await httpObj.httpPost(apiList['saveMappingDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function defTagInLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['defTagInLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 数据编目
export async function catalogSystemTree(params = {}) {
    const data = await httpObj.httpGet(apiList['catalogSystemTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function systemCatalog(params = {}) {
    const data = await httpObj.httpGet(apiList['systemCatalog'] + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogNondwTable(params = {}) {
    const data = await httpObj.httpPost(apiList['catalogNondwTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogNondwTableFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['catalogNondwTableFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogNondwBizTree(params = {}) {
    const data = await httpObj.httpGet(apiList['catalogNondwBizTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function suggestClassifyByDept(params = {}) {
    const data = await httpObj.httpGet(apiList['suggestClassifyByDept'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function nonDwSaveSys(params = {}) {
    const data = await httpObj.httpPost(apiList['nonDwSaveSys'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function nonDwSaveTable(params = {}) {
    const data = await httpObj.httpPost(apiList['nonDwSaveTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function nonDwTableSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['nonDwTableSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function nonDwTableSearchSuggest(params = {}) {
    const data = await httpObj.httpPost(apiList['nonDwTableSearchSuggest'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sysLevelConfig(params = {}) {
    const data = await httpObj.httpGet(apiList['sysLevelConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogDwTable(params = {}) {
    const data = await httpObj.httpPost(apiList['catalogDwTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwSaveSys(params = {}) {
    const data = await httpObj.httpPost(apiList['dwSaveSys'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogDwTableFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['catalogDwTableFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwTableSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['dwTableSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwTableSearchSuggest(params = {}) {
    const data = await httpObj.httpPost(apiList['dwTableSearchSuggest'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function catalogDwTree(params = {}) {
    const data = await httpObj.httpGet(apiList['catalogDwTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwAnalysisThemeTree(params = {}) {
    const data = await httpObj.httpGet(apiList['dwAnalysisThemeTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function saveDwTable(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDwTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveThemeTable(params = {}) {
    const data = await httpObj.httpPost(apiList['saveThemeTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datasecurityTree(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecurityTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datasecurityLevelSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecurityLevelSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function datasecurityLevelSearchFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['datasecurityLevelSearchFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveTableBatchConfigForLevel(params = {}) {
    const data = await httpObj.httpPost(apiList['saveTableBatchConfigForLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function previewTableBatchConfig(params = {}) {
    const data = await httpObj.httpPost(apiList['previewTableBatchConfig'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getTableInfoWithDs(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableInfoWithDs'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsColumnLevelList(params = {}) {
    const data = await httpObj.httpPost(apiList['getDsColumnLevelList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsColumnLevelListFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsColumnLevelListFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDsTagInfoList(params = {}) {
    const data = await httpObj.httpGet(apiList['getDsTagInfoList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveLevelAndTagInfo(params = {}) {
    const data = await httpObj.httpPost(apiList['saveLevelAndTagInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelSearchConfirm(params = {}) {
    const data = await httpObj.httpPost(apiList['levelSearchConfirm'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function saveColumnTagBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['saveColumnTagBatch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function previewColumnTagBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['previewColumnTagBatch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelDatasourceFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['levelDatasourceFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelDatabaseFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['levelDatabaseFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelTableFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['levelTableFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function securityLevelFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['securityLevelFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function desensitizeTagFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['desensitizeTagFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function securityTree(params = {}) {
    const data = await httpObj.httpGet(apiList['securityTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addSecurityTree(params = {}) {
    const data = await httpObj.httpPost(apiList['addSecurityTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateSecurityTree(params = {}) {
    const data = await httpObj.httpPost(apiList['updateSecurityTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function delSecurityTree(params = {}) {
    const data = await httpObj.httpDel(apiList['securityTree'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addEigen(params = {}) {
    const data = await httpObj.httpPost(apiList['addEigen'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function editEigen(params = {}) {
    const data = await httpObj.httpPost(apiList['editEigen'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function eigenList(params = {}) {
    const data = await httpObj.httpGet(apiList['eigenList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getTableData(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function removeEigen(params = {}) {
    const data = await httpObj.httpGet(apiList['removeEigen'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sortEigen(params = {}) {
    const data = await httpObj.httpPost(apiList['sortEigen'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function auditListDs(params = {}) {
    const data = await httpObj.httpPost(apiList['auditListDs'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listTableByds(params = {}) {
    const data = await httpObj.httpPost(apiList['listTableByds'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listByDs(params = {}) {
    const data = await httpObj.httpGet(apiList['listByDs'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listAuditColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['listAuditColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnConfirmAudit(params = {}) {
    const data = await httpObj.httpPost(apiList['columnConfirmAudit'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnSampling(params = {}) {
    const data = await httpObj.httpPost(apiList['columnSampling'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dsSysTree(params = {}) {
    const data = await httpObj.httpGet(apiList['dsSysTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function tableClassifyLvByDatasourceId(params = {}) {
    const data = await httpObj.httpGet(apiList['tableClassifyLvByDatasourceId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelListTableByDs(params = {}) {
    const data = await httpObj.httpPost(apiList['levelListTableByDs'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnClassifyLvByDatasourceId(params = {}) {
    const data = await httpObj.httpGet(apiList['columnClassifyLvByDatasourceId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelStatistic(params = {}) {
    const data = await httpObj.httpGet(apiList['levelStatistic'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function listColumnByTableId(params = {}) {
    const data = await httpObj.httpPost(apiList['listColumnByTableId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bindEigenWithColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['bindEigenWithColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function eigenFilters(params = {}) {
    const data = await httpObj.httpPost(apiList['eigenFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function statisticByClassIds(params = {}) {
    const data = await httpObj.httpGet(apiList['statisticByClassIds'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function levelSecurityTree(params = {}) {
    const data = await httpObj.httpPost(apiList['levelSecurityTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function levelColumnSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['levelColumnSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 导入安全分类文件
 * @param {*} params 
 * @returns 
 */
export async function updateDatasecurity(file) {
    const formData = new FormData()
    formData.append('file', file)
    const data = await httpObj.httpPost(`/quantchiAPI/api/datasecurity/saveDataSecurityByFile`, formData)
    if (data === undefined) {
        return false
    }
    return data.data
}