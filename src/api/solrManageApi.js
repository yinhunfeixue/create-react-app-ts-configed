import { httpObj, sendPost } from './base'
import _ from 'underscore'

import CONSTANTS from 'app_constants'
// import * as qs from "qs";

const serverList = CONSTANTS['API_LIST']['solrManage']

/**
 * 查询同步任务列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSyncTaskList(params = {}) {
    const data = await httpObj.httpPost(serverList['getSyncTaskList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 更新任务状态
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function changeSyncTaskStatus(params = {}) {
    const data = await httpObj.httpPost(serverList['changeSyncTaskStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 创建同步任务
export async function createSyncTask(params = {}) {
    const data = await httpObj.httpPost(serverList['createSyncTask'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/* 一致性检测结果获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSyncDiscoverResult(params = {}) {
    const data = await httpObj.httpPost(serverList['getSyncDiscoverResult'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询同步任务明细
/* 一致性检测结果详细情况获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSyncTaskDetailList(params = {}) {
    const data = await httpObj.httpPost(serverList['getSyncTaskDetailList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 查询同步任务列表
export async function searchTableByKeyword(params = {}) {
    const data = await httpObj.httpCancelPost(serverList['searchTableByKeyword'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 查询同步任务列表
export async function searchBusinessByKeyword(params = {}) {
    const data = await httpObj.httpCancelPost(serverList['searchBusinessByKeyword'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 查询单个任务
export async function getSyncTaskInfo(params = {}) {
    const data = await httpObj.httpPost(serverList['getSyncTaskInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
//
/* 执行一致性检测
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function doSyncDiscover(params = {}) {
    const data = await httpObj.httpPost(serverList['doSyncDiscover'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
