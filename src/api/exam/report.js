/*
 * @Author: your name
 * @Date: 2020-09-07 14:56:46
 * @LastEditTime: 2020-09-10 14:45:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dmp_frontend_shzq_update\src\api\exam\report.js
 */
import { httpObj } from '../base'
import CONSTANTS from 'app_constants'

// const serverList = CONSTANTS['SERVER_LIST']
// const connectWho = 'dmpTestServer'
// const serverListNew = CONSTANTS['API_LIST']['examination']
// const serverList = CONSTANTS['SERVER_LIST']
// const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['examination']

/**
 * 检核报告-源
 * @param {*} params 
 */
export async function getReportSourceList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportSource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告-规则
 * @param {*} params 
 */
export async function getReportRuleList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportRule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 系统 LIST
 * @param {*} params 
 */
export async function getReportSystemSelectList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportSystemSelect'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 负责人 LIST
 * @param {*} params 
 */
export async function getReportManagerList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportManager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 数据源 LIST
 * @param {*} params 
 */
export async function getReportDatasourceList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportDatasource'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 数据库 LIST
 * @param {*} params 
 */
export async function getReportDatabaseList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 数据表 LIST
 * @param {*} params 
 */
export async function getReportDataTableList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportDataTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 数据表 LIST
 * @param {*} params 
 */
export async function getReportSummaryList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportSummary'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 规则趋势 LIST
 * @param {*} params 
 */
export async function getReportRuleTrendList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportRuleTrend'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 检核报告- 规则趋势 LIST
 * @param {*} params 
 */
export async function getReportSystemSummaryList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportSystemSummary'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getReportCheckDateList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportCheckDate'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}