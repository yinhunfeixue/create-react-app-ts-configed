import CONSTANTS from 'app_constants'

import { httpObj } from './base'

const apiList = CONSTANTS.API_LIST.modelManage

export async function delModelTableDomain(){
    // todo by webpack5
}

/**
 * [getSnowflakeModel 数据源模型数据接口]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSnowflakeModel(params = {}) {
    const data = await httpObj.httpPost(apiList.getSnowflakeModel, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * [getTableRelation
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.getTableRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * [delTableRelation
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delTableRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.delTableRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * [relationTableFiltrate
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function relationTableFiltrate(params = {}) {
    const data = await httpObj.httpPost(apiList.relationTableFiltrate, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [addTableRelation
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addTableRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.addRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [getTableSuggest 根据表名（中文名、英文名）获取表list
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableSuggest(params = {}) {
    const data = await httpObj.httpPost(apiList.snowflakeTableFiltrate, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// export async function getBusiness(params = {}) {
//     const data = await httpObj.httpPost(apiList.getBusiness, params)
//     if (data === undefined) {
//         return false
//     }
//     return data.data
// }
export async function insertBusinessRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.insertBusinessRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function deleteBusinessRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.deleteBusinessRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function getBusinessRelation(params = {}) {
    const data = await httpObj.httpPost(apiList.getBusinessRelation, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function editTable(params = {}) {
    const data = await httpObj.httpPost(apiList.editTable, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function deleteBusiness(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function insertBusiness (params = {}) {
    const data = await httpObj.httpPost(apiList['insertBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取模型列表
export async function getModel (params = {}) {
    const data = await httpObj.httpGet(apiList['addModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取模型详情
export async function getModelDetail (id = '') {
    const data = await httpObj.httpGet(`${apiList['addModel']}/${id}`)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除模型
export async function deleteModel (params = {}) {
    const data = await httpObj.httpPost(apiList['deleteModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 创建模型
export async function addModel (params = {}) {
    const data = await httpObj.httpPost(apiList['addModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 模型名称检查
export async function checkModelName (params = {}) {
    const data = await httpObj.httpGet(apiList['checkModelName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 模型表搜索
export async function advSearch (params = {}) {
    const data = await httpObj.httpGet(apiList['advSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 模型表搜索分组
export async function advSearchGroup (params = {}) {
    const data = await httpObj.httpGet(apiList['advSearchGroup'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 模型表检查
export async function checkModel (params = {}) {
    const data = await httpObj.httpPost(apiList['checkModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [getSnowflakeModel 数据源模型数据接口新的]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSnowflakeModelV2(params = {}) {
    const data = await httpObj.httpPost(apiList.getSnowflakeModelV2, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取模型关系列表
export async function getRelation (params = {}) {
    const data = await httpObj.httpGet(apiList['getRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加或者更新模型表关系
export async function aoeRelation (params = {}) {
    const data = await httpObj.httpPost(apiList['getRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除模型表关系
export async function deleteRelation (params = {}) {
    const data = await httpObj.httpPost(apiList['deleteRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取表已治理的字段
export async function govColumns (params = {}) {
    const data = await httpObj.httpGet(apiList['govColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取模型表详情列表
export async function getDetailTableList (params = {}) {
    const data = await httpObj.httpGet(apiList['getDetailTableList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取模型表下字段列表
export async function getDetailTableColumnList (params = {}) {
    const data = await httpObj.httpGet(apiList['getDetailTableColumnList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function modelTableDomain (params = {}) {
    const data = await httpObj.httpGet(apiList['modelTableDomain'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postModelTableDomain (params = {}) {
    const data = await httpObj.httpPost(apiList['modelTableDomain'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function modelTableFact (params = {}) {
    const data = await httpObj.httpGet(apiList['modelTableFact'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postModelTableFact (params = {}) {
    const data = await httpObj.httpPost(apiList['modelTableFact'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function modelTableFull (params = {}) {
    const data = await httpObj.httpGet(apiList['modelTableFull'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postModelTableFull (params = {}) {
    const data = await httpObj.httpPost(apiList['modelTableFull'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function getBusiness (params = {}) {
    const data = await httpObj.httpGet(apiList['business'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function getBusinessList (params = {}) {
    const data = await httpObj.httpPost(apiList['getBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function postBusiness (params = {}) {
    const data = await httpObj.httpPost(apiList['business'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function businessDelete (params = {}) {
    const data = await httpObj.httpPost(apiList['businessDelete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postModelTableColumn (params = {}) {
    const data = await httpObj.httpPost(apiList['modelTableColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function modelTableColumn (params = {}) {
    const data = await httpObj.httpGet(apiList['modelTableColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function modelIndex (params = {}) {
    const data = await httpObj.httpGet(apiList['modelIndex'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function modelUsage (params = {}) {
    const data = await httpObj.httpGet(apiList['modelUsage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getModelRelation (params = {}) {
    const data = await httpObj.httpGet(apiList['modelRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
