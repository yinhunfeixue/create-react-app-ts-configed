import sendPost, { httpObj } from './base'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['dashboard']
const connectWho = 'dmpTestServer'

// 获取数据看板列表
export async function getBoardList(params = {}) {
    const data = await httpObj.httpGet(apiList['getBoardList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据看板删除
export async function boardAdd(params = {}) {
    const data = await httpObj.httpPost(apiList['boardAdd'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据看板删除
export async function deleteBoard(params = {}) {
    const data = await httpObj.httpPost(apiList['delete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取数据看板列表详情
export async function getBoardDetial(params = {}) {
    const data = await httpObj.httpGet(apiList['getBoardDetial'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 修改数据看板信息
export async function boardUpdate(params = {}) {
    const data = await httpObj.httpPost(apiList['boardUpdate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取左侧栏数据
export async function getMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList['getMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 看板左侧栏搜索
export async function getMetricsSearch(params = {}) {
    const data = await httpObj.httpGet(apiList['getMetricsSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 左侧栏键盘精灵
export async function getQuickTip(params = {}) {
    const data = await httpObj.httpGet(apiList['quickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取单个过滤器详细信息
export async function getPinboardFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['getPinboardFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 创建单个过滤器详细信息
export async function filterCreate(params = {}) {
    const data = await httpObj.httpPost(apiList['filterCreate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 更新单个过滤器详细信息
export async function filterUpdate(params = {}) {
    const data = await httpObj.httpPost(apiList['filterUpdate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 更新单个过滤器详细信息
export async function filterDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['filterDelete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加看板视图
export async function addBoardView(params = {}) {
    const data = await httpObj.httpPost(apiList['addBoardView'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 创建看板
export async function createBoard(params = {}) {
    const data = await httpObj.httpPost(apiList['createBoard'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除看板视图
export async function viewDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['viewDelete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取某一视图数据
export async function getViewInfo(params = {}) {
    const data = await httpObj.httpPost(apiList['viewInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 编辑看板视图
export async function viewEdit(params = {}) {
    const data = await httpObj.httpPost(apiList['viewEdit'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 视图对应的查询相关信息
export async function viewSearchInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['viewSearchInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取列表数据
export async function getTableList(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取列表数据
export async function deleteTable(params = {}) {
    const data = await httpObj.httpGet(apiList['deleteTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 创建/修改报表
export async function createTable(params = {}) {
    const data = await httpObj.httpPost(apiList['createTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取推荐合并字段
export async function getMergeSuggestion(params = {}) {
    const data = await httpObj.httpGet(apiList['mergeSuggestion'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取预览报表
export async function getPreviewData(params = {}) {
    const data = await httpObj.httpPost(apiList['getPreviewData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 校验重名
export async function checkName(params) {
    const data = await httpObj.httpGet(apiList['duplicate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取看板中所有视图信息
export async function getPinBoardView(params) {
    const data = await httpObj.httpGet(apiList['getPinBoardView'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取报表的详情信息
export async function getReportDetail(params) {
    const data = await httpObj.httpGet(apiList['getReportDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取报表的详情信息
export async function getReportContent(params) {
    const data = await httpObj.httpGet(apiList['getReportContent'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取报表的详情信息
export async function eTableHead(params) {
    const data = await httpObj.httpPost(apiList['eTableHead'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
