import sendPost, { httpObj } from './base'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['scheduleManage']
const connectWho = 'dmpTestServer'

// 获取调度列表
export async function getScheduleList(params = {}) {
    const data = await httpObj.httpGet(apiList['queryList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据看板删除
export async function getSourceList(params = {}) {
    const data = await httpObj.httpGet(apiList['sourceList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加调度任务
export async function addScheduleTast(params = {}) {
    const data = await httpObj.httpPost(apiList['addSchedule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询某个调度的历史执行
export async function getScheduleHistory(id, params = {}) {
    let url = apiList['getSchedule'] + id + '/runs'
    const data = await httpObj.httpGet(url, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询某个调度的历史执行
export async function handleTask(id, params = {}) {
    let url = apiList['getSchedule'] + id + '/trigger'
    const data = await httpObj.httpGet(url, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询某个调度的某次历史执行的具体任务
export async function handleTaskDetial(id, time, params = {}) {
    let url = apiList['getSchedule'] + id + '/' + time + '/tasks'
    const data = await httpObj.httpGet(url, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 查询某个调度的某次历史执行的具体任务日志
export async function getTaskDetialLog(id, time, taskId, params = {}) {
    let url = apiList['getSchedule'] + id + '/' + time + '/' + taskId + '/log'
    const data = await httpObj.httpGet(url, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 暂停某个调度
export async function pauseSchedule(id) {
    let url = apiList['getSchedule'] + id + '/pause'
    const data = await httpObj.httpGet(url)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 恢复某个调度
export async function unpauseSchedule(id) {
    let url = apiList['getSchedule'] + id + '/unpause'
    const data = await httpObj.httpGet(url)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除调度
export async function deleteSchedule(id) {
    let url = apiList['getSchedule'] + id
    const data = await httpObj.httpDel(url)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 编辑调度
export async function editScheduleTast(id, params = {}) {
    let url = apiList['getSchedule'] + id
    const data = await httpObj.httpPost(url, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 检查调度表达式是否合法
export async function checkScheduleCron(params = {}) {
    const data = await httpObj.httpPost(apiList['checkScheduleCron'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}