import CONSTANTS from 'app_constants'
import { httpObj } from './base'

const serverList = CONSTANTS['SERVER_LIST']
const apiList = CONSTANTS['API_LIST']['tagManage']

/**
 * 入湖标签 左侧树获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getLeftTreeFromApp(params = {}) {
    const data = await httpObj.httpGet(apiList['leftTreeFromApp'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 入湖标签 列表获取
 * 三种类别
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function baseTableRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['baseTableRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function sourceTableRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceTableRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function systemTableRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['systemTableRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 删除标签
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function untaggle(params = {}) {
    const data = await httpObj.httpDel(apiList['untaggle'], { data: params })
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 创建标签
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function createTag(params = {}) {
    const data = await httpObj.httpPost(apiList['createTag'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 添加标签
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function taggleTagObject(params = {}) {
    const data = await httpObj.httpPost(apiList['taggleTagObject'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 查询所有可添加标签
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function allTagValue(params = {}) {
    const data = await httpObj.httpPost(apiList['allTagValue'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 查询所有可删除标签
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteableTagValue(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteableTagValue'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 标签应用场景，目标对象
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTagTypeAppliableScene(params = {}) {
    const data = await httpObj.httpGet(apiList['tagTypeAppliableScene'], params)
    if (data === undefined) {
        return false
    }
    let res = data.data
    res.data.map((d) => {
        d.label = d.showName
        d.value = d.id
    })
    console.log(res, '--------tagTypeAppliableSceneData--------')
    return res
}

/**
 * 标签分类
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTagTypeManagementTree(params = {}) {
    const data = await httpObj.httpGet(apiList['tagTypeManagementTree'], params)
    if (data === undefined) {
        return false
    }
    let res = data.data
    // res.data.map((d) => {
    //     d.label = d.showName
    //     d.value = d.id
    // })
    // console.log(res, '--------tagTypeAppliableSceneData--------')
    return res
}

/**
 * 查询标签列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function bizObjectRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['bizObjectRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 标签类型的添加修改
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function saveTagTypeHandle(params = {}) {
    const data = await httpObj.httpPost(apiList['saveTagType'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 根据标签分类获取标签 LIST
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTagValueListByType(tagValueId, params = {}) {
    const data = await httpObj.httpGet(apiList['tagValueApi'] + `${tagValueId}/tagValues`, params)
    if (data === undefined) {
        return false
    }
    let res = data.data
    return res
}

/**
 * 标签的修改
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function tagModifyHandle(params = {}) {
    const data = await httpObj.httpPost(apiList['tagModify'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
