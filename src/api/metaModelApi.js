import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['metadata']

export async function queryMetaModelList(params = {}) {
    const data = await httpObj.httpGet(apiList['queryMetaModelList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function queryMetaModelDetailList(params = {}) {
    const data = await httpObj.httpGet(apiList['queryMetaModelDetailList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function changeEnableStatus(params = {}) {
    const data = await httpObj.httpGet(apiList['changeEnableStatus'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sortMetaModelDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['sortMetaModelDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sortGroup(params = {}) {
    const data = await httpObj.httpPost(apiList['sortGroup'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function deleteMetaModelDetail(params = {}) {
    const data = await httpObj.httpDel(apiList['deleteMetaModelDetail'] + '?metaModelDetailId=' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function editOrAddMetaModelDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['editOrAddMetaModelDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function metaModelDetailRelationCount(params = {}) {
    const data = await httpObj.httpGet(apiList['metaModelDetailRelationCount'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


















