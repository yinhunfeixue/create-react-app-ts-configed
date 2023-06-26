import { httpObj } from './base'

import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['SERVER_LIST']
const apiList = CONSTANTS['API_LIST']['eastReport']

// 文件上传
export async function upload(params = {}) {
    const data = await httpObj.httpPost(apiList['upload'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 文件上传详情
export async function fileDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['fileDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 文件上传记录
export async function fileRecord(params = {}) {
    const data = await httpObj.httpGet(apiList['fileRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取EAST列表
export async function eastList(params = {}) {
    const data = await httpObj.httpPost(apiList['eastList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 所有分类名称
export async function eastClassNames(params = {}) {
    const data = await httpObj.httpPost(apiList['eastClassNames'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取EAST下的检核规则状态
export async function dataQuality(params = {}) {
    const data = await httpObj.httpPost(apiList['dataQuality'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取EAST下的数据规范
export async function dataSpecification(params = {}) {
    const data = await httpObj.httpPost(apiList['dataSpecification'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取EAST详情
export async function eastDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['eastDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 下载
export async function downloadErrorCheck(params = {}) {
    httpObj.httpPostDownload(`${apiList['downloadErrorCheck'] + '?id=' + params.id}`)
    return
    // window.open(`${apiList['fdGovernanceList']}${params.status || ''}/download/?status=${params.status}&datasourceId=${params.datasourceId}`, '_self')
}
// export async function downloadErrorCheck(params = {}) {
//     const data = await httpObj.httpPost(apiList['downloadErrorCheck'] + '?id=' + params.id)
//     if (data === undefined) {
//         return false
//     }
//     return data.data
// }

// 重新检核
export async function eastRecheck(params = {}) {
    const data = await httpObj.httpPost(apiList['eastRecheck'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// East下的所有字段信息
export async function eastColumn(params = {}) {
    const data = await httpObj.httpGet(apiList['eastColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 修改East信息
export async function updateEast(params = {}) {
    const data = await httpObj.httpPost(apiList['east'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}