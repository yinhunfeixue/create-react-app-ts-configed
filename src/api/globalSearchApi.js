import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['SERVER_LIST']
const apiList = CONSTANTS['API_LIST']['globalsearch']

/**
 * 全局搜索 下拉框条件获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function searchConditionSelect(params = {}) {
    const data = await httpObj.httpGet(apiList['searchConditionSelect'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 获取全局搜索结果
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postGlobalSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['globalSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function globalSearch(params = {}) {
    const data = await httpObj.httpGet(apiList['globalSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 键盘精灵接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function quickTip(params = {}) {
    const data = await httpObj.httpGet(apiList['quickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 导出接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function exportData(params = {}) {
    // window.open(`${apiList['export']}${params}`, '_self')
    httpObj.httpGetDownload(`${apiList['export']}${params}`, params)
    return
}

export async function exportAll(params = {}) {
    httpObj.httpPostDownload(apiList['exportAll'], params)
    return
}

/**
 * 获取筛选内容和筛选搜索接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getFilterBoxData(params = {}) {
    const data = await httpObj.httpPost(apiList['getFilterBoxData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 获取表头接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function config(params = {}) {
    const data = await httpObj.httpGet(apiList['config'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}