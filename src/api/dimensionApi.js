import CONSTANTS from 'app_constants'

import {httpObj} from './base'

const apiList = CONSTANTS.API_LIST.dimension

/**
 * [getDimensionList 维度列获取接口]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDimensionList(params = {}) {
    const data = await httpObj.httpGet(apiList.list, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [dimensionAddEdit description]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function dimensionAddEdit(params = {}) {
    const data = await httpObj.httpPost(apiList.addEdit, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [dimensionAddEdit 维度主题获取]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDimensionDomain(params = {}) {
    const data = await httpObj.httpGet(apiList.dimensionDomain, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [dimensionAddEdit 标准列]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getStandardDomain(params = {}) {
    const data = await httpObj.httpGet(apiList.standardDomain, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [dimensionAddEdit 维度类别]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDimensionCategory(params = {}) {
    const data = await httpObj.httpGet(apiList.dimensionCategory, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * [dimensionAddEdit 删除]
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delDimensionList(params = {}) {
    const data = await httpObj.httpPost(apiList.delDomain, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function featchDimensionValue(params = {}) {
    const data = await httpObj.httpGet(apiList.dimensionValue, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function standardCode(params = {}) {
    const data = await httpObj.httpGet(apiList.standardCode, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
