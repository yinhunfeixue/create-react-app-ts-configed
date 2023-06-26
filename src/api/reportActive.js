import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['SERVER_LIST']
const apiList = CONSTANTS['API_LIST']['reportActive']

// 报表激活列表
export async function activeList(params = {}) {
    const data = await httpObj.httpGet(apiList['activeList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取报表激活统计信息
export async function statistic(params = {}) {
    const data = await httpObj.httpGet(apiList['statistic'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 用户上次操作的报表(返回可能为空)
export async function lastOptReports(params = {}) {
    const data = await httpObj.httpGet(apiList['lastOptReports'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 用户进入激活界面
export async function enterActive(params = {}) {
    const data = await httpObj.httpGet(apiList['enterActive'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取报表下的视图信息
export async function activeViews(params = {}) {
    const data = await httpObj.httpPost(apiList['activeViews'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取报表下的指标
export async function activeMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList['activeMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 绑定报表与指标
export async function bindActiveMetrics(params = {}) {
    const data = await httpObj.httpPost(apiList['activeMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 搜索
export async function activeSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['activeSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 节点匹配
export async function match(params = {}) {
    const data = await httpObj.httpPost(apiList['match'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 键盘精灵
export async function quickTip(params = {}) {
    const data = await httpObj.httpPost(apiList['quickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存指标口径
export async function saveMtrics(params = {}) {
    const data = await httpObj.httpPost(apiList['saveMtrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 视图绑定数据集
export async function bindViews(params = {}) {
    const data = await httpObj.httpPost(apiList['bindViews'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 创建数据集
export async function saveSqlTable(params = {}) {
    const data = await httpObj.httpPost(apiList['saveSqlTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 解绑报表与指标
export async function deleteMetrics(params = {}) {
    const data = await httpObj.httpDel(apiList['deleteMetrics'], { data: params })
    if (data === undefined) {
        return false
    }
    return data.data
}

// clearMetricsQueryInfo
export async function clearQuery(params) {
    const data = await httpObj.httpPUT(apiList['clearQuery'] + '?metricsId=' + params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 修改报表信息(包括字段信息)
export async function changeReport(params) {
    const data = await httpObj.httpPost(apiList['changeReport'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 为报表打标签
export async function externalTag(params) {
    const data = await httpObj.httpPost(apiList['externalTag'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 删除报表标签
export async function delExternalTag(params = {}) {
    const data = await httpObj.httpDel(apiList['externalTag'] + '?reportsId=' + params.reportsId + '&tagIds=' + params.tagIds)
    if (data === undefined) {
        return false
    }
    return data.data
}