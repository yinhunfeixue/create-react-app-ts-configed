import sendPost, { httpObj } from './base'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['createETL']
const connectWho = 'dmpTestServer'

// 数据集状态
export async function getRTLStatus(params = {}) {
    const data = await httpObj.httpGet(apiList['getETLStatus'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存数据集名称
export async function saveETLData(params = {}) {
    const data = await httpObj.httpPost(apiList['saveETLData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取分组和表
export async function getCategoryAndTable(params = {}) {
    const data = await httpObj.httpGet(apiList['getCategoryAndTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取字段
export async function getColumns(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取分组和表
export async function addColumns(params = {}) {
    const data = await httpObj.httpPost(apiList['addColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 删除字段/表
export async function delRelated(params = {}) {
    const data = await httpObj.httpDel(apiList['delETLdataSet'], { data: params })
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取已选数据
export async function getTableAndColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['getTableAndColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取已选数据
export async function leftQuickTip(params = {}) {
    const data = await httpObj.httpPost(apiList['quickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 修改显示名
export async function editShowName(params = {}) {
    const data = await httpObj.httpPatch(apiList['editShowName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 节点匹配
export async function getMatchData(params = {}) {
    const data = await httpObj.httpPost(apiList['getMatchData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 搜索
// 节点匹配
export async function getSearchData(params = {}) {
    const data = await httpObj.httpPost(apiList['getSearchData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取已选数据
export async function getQuickTip(params = {}) {
    const data = await httpObj.httpPost(apiList['getQuickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchViewAdd(params = {}) {
    const data = await httpObj.httpPost(apiList['searchView'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取过程表
export async function getSearchView(params = {}) {
    const data = await httpObj.httpGet(apiList['searchView'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchViewList(params = {}) {
    const data = await httpObj.httpPost(apiList['searchViewList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function deleteSearchViewList(params = {}) {
    const data = await httpObj.httpDel(apiList['searchView'], { data: params })
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getTableRelation(params = {}) {
    const data = await httpObj.httpGet(apiList['tableRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取过程表
export async function getETLName(params = {}) {
    const data = await httpObj.httpGet(apiList['getETLName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取过程表
export async function getEtlprocess(params = {}) {
    const data = await httpObj.httpGet(apiList['etlprocess'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取过程表
export async function callEtlRefresh(params = {}) {
    const data = await httpObj.httpPost(apiList['etlRefresh'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
