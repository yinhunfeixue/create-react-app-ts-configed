import sendPost, { httpObj } from './base'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['createSql']
const connectWho = 'dmpTestServer'

// 表英文名校验
export async function checkEname(params = {}) {
    const data = await httpObj.httpGet(apiList['checkEname'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 执行Sql(预览数据)
export async function exec(params = {}) {
    const data = await httpObj.httpPost(apiList['exec'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// Sql格式化
export async function format(params = {}) {
    const data = await httpObj.httpPost(apiList['format'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取Sql表信息
export async function tableInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['tableInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// ER模型
export async function sqlModel(params = {}) {
    const data = await httpObj.httpPost(apiList['sqlModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// Sql解析接口
export async function sqlParse(params = {}) {
    const data = await httpObj.httpPost(apiList['sqlParse'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存Sql表
export async function saveSql(params = {}) {
    const data = await httpObj.httpPost(apiList['saveSql'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 被使用列表
export async function areUsed(params = {}) {
    const data = await httpObj.httpGet(apiList['areUsed'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}