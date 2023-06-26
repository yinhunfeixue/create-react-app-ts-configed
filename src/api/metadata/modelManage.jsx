/**
 * 数仓视图-接口
 */
import sendPost, { formData, httpObj } from '../base'
import _ from 'underscore'

import CONSTANTS from 'app_constants'
import qs from 'qs'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['dataWarehouse']

/**
 * 应用模型列表数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAppModelList(params = {}) {
    const data = await httpObj.httpGet(apiList['appModelList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 应用模型修改
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function saveAppModelModify(params = {}) {
    const data = await httpObj.httpPost(apiList['appModelModify'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 应用模型关联数据列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAppModelRelationList(params = {}) {
    const data = await httpObj.httpGet(apiList['appModelRelationList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 应用模型引用数据列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAppModelReference(params = {}) {
    const data = await httpObj.httpGet(apiList['appModelReference'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 应用模型图示数据
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAppModelRelationGraph(params = {}) {
    const data = await httpObj.httpGet(apiList['appModelRelationGraph'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 应用模型图示概览
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAppModelOverview(params = {}) {
    const data = await httpObj.httpGet(apiList['appModelOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}