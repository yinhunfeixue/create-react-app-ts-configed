/**
 * 元数据-运营报告 gataway
 * 存储空间接口调用层
 * 重复资源接口调用层
 */
import sendPost, { formData, httpObj } from '../base'
import _ from 'underscore'

import CONSTANTS from 'app_constants'
import qs from 'qs'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['metadata']

/**
 * 系统报告资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSystemView(params = {}) {
    const data = await httpObj.httpPost(apiList['systemView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDataSourceView(params = {}) {
    const data = await httpObj.httpPost(apiList['datasourceView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据库资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDataBaseView(params = {}) {
    const data = await httpObj.httpPost(apiList['databaseView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableView(params = {}) {
    const data = await httpObj.httpPost(apiList['tableView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


/**
 * 数据表资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSystemEnum(params = {}) {
    const data = await httpObj.httpPost(apiList['systemEnum'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


/**
 * 数据表资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDatasourceEnum(params = {}) {
    const data = await httpObj.httpPost(apiList['datasourceEnum'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDatabaseEnum(params = {}) {
    const data = await httpObj.httpPost(apiList['databaseEnum'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表资源数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableEnum(params = {}) {
    const data = await httpObj.httpPost(apiList['tableEnum'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 重复资源统计
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getRedundancyView(params = {}) {
    const data = await httpObj.httpPost(apiList['getRedundancyView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 重复资源分布
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getRedundancyViewDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['getRedundancyViewDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


/**
 * 重复资源任务获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getRedundancyCheckTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['getRedundancyCheckTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


/**
 * 重复资源任务执行
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function saveRedundancyCheckJob(params = {}) {
    const data = await httpObj.httpPost(apiList['saveRedundancyCheckJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}