import sendPost, { formData, httpObj } from './base'

import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const serverListNew = CONSTANTS['API_LIST']['examination']

export async function postDeleteTaskJob(){
    // todo by webpack5
}

export async function getRuleClassTree(params = {}) {
    const data = await sendPost('/quantchiAPI/api/getRuleClassTree', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getMetaTree(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/check/getMetaTree', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getRuleClass(params = {}) {
    const data = await sendPost('/quantchiAPI/api/getRuleClass', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新增或更新业务规则
export async function addBusiRules(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/check/busiRules', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
// 新增或更新技术规则
export async function addTechRules(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/check/techRules', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除业务规则
export async function deleteBusiRules(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/check/deleteBusiRules', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除技术规则
export async function deleteTechRules(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/check/deleteTechRules', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 质检开始-----------------------------------------------------------------------------------
// 重新核检
export async function generalReportRecheck(params = {}) {
    const data = await sendPost('/examination/general_report/recheck', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取手动核检列表
export async function getManualList(params = {}) {
    const data = await sendPost('/examination/manual_op', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 今日核检结果(上半部分)
export async function getGeneralReport(params = {}) {
    const data = await sendPost('/examination/general_report/statistic', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 今日核检结果(下半部分表格)
export async function getGeneralReportTable(params = {}) {
    const data = await sendPost('/examination/general_report/abnormal_table', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 今日检核结果-查看完整结果报告 (第一部分)
export async function getDetailReportStatistic(params = {}) {
    const data = await sendPost('/examination/detail_report/statistic', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 今日检核结果-查看完整结果报告 (第2部分)
export async function getDetailReportAbnormal(params = {}) {
    const data = await sendPost('/examination/detail_report/abnormal_table', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 今日检核结果-查看完整结果报告 (第3部分)
export async function getDetailReportTables(params = {}) {
    const data = await sendPost('/examination/detail_report/tables', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查看详情 触发
export async function detailReportPage(params = {}) {
    const data = await sendPost('/examination/detail_report/detail_page', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 历史报告(1)
export async function getHistoryReport(params = {}) {
    const data = await sendPost('/examination/history_report', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 历史报告(2)
export async function getHistoryManualReport(params = {}) {
    const data = await sendPost('/examination/history_report/manual', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 规则配置
export async function getRuleSet(params = {}) {
    const data = await sendPost('/examination/rule_set', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 规则配置-新增规则数值格式下拉框选择
export async function addRulePage(params = {}) {
    const data = await sendPost('/examination/rule_set/add_rule_page', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 规则配置-规则详情
export async function rulePageDetail(params = {}) {
    const data = await sendPost('/examination/rule_set/detail_page', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 规则配置-新增规则
export async function addRule(params = {}) {
    const data = await sendPost('/examination/rule_set/add_rule', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 字段分类
export async function getFieldCategory(params = {}) {
    const data = await sendPost('/examination/field_category', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取检核结果通知对象列表
export async function getNoticeList(params = {}) {
    const data = await sendPost('/examination/notice', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新增或修改当前检核结果通知
export async function addOrUpdateNotice(params = {}) {
    const data = await sendPost('/examination/notice/save', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动核检-添加-搜索
export async function manualSearch(params = {}) {
    const data = await sendPost('/examination/manual_op/add/search', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动核检-添加-按逻辑表搜索完之后的展开
export async function manualUnfold(params = {}) {
    const data = await sendPost('/examination/manual_op/add/unfold', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动核检-按术语添加 确定按钮
export async function manualTermSubmit(params = {}) {
    const data = await sendPost('/examination/manual_op/add/term/submit', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动核检-按逻辑表添加 确定按钮
export async function manualTableSubmit(params = {}) {
    const data = await sendPost('/examination/manual_op/add/table/submit', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动核检-开始手动核检
export async function manualBeginExam(params = {}) {
    const data = await sendPost('/examination/manual_op/begin', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 质检结束----------------------------------------------------------------------------

// 新的java接口质检------------------start----------------------------------------
// 查询检核规则业务规则
export async function getSettingsNewList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchBusin'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function getRuleNewList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function getSystemList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['systemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除自动或手动核检任务
export async function deleteJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['deleteJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 增加或修改自动或手动核检任务
export async function editJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['editJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检索质量核检任务列表
export async function searchJob(params = {}) {
    const data = await httpObj.httpGet(serverListNew['searchJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取核检任务统计
export async function statisticHistory(params = {}) {
    const data = await httpObj.httpPost(serverListNew['statisticHistory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取核检任务统计
export async function statisticHistoryGeneral(params = {}) {
    const data = await httpObj.httpPost(serverListNew['statisticHistoryGeneral'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取核检任务统计top
export async function statisticHistoryTopN(params = {}) {
    const data = await httpObj.httpPost(serverListNew['statisticHistoryTopN'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 历史任务统计信息
export async function statisticResult(params = {}) {
    const data = await httpObj.httpGet(`${serverListNew['statisticResult']}${params.id}/statistic`)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 增加或修改自动或手动核检任务
export async function execute(params = {}) {
    const data = await httpObj.httpGet(serverListNew['execute'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除业务规则
export async function checkDelete(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 新增或更新检核规则
export async function addCheck(params = {}) {
    const data = await httpObj.httpPost(serverListNew['addCheck'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取检核规则-获取sql
export async function getSql(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getSql'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核规则详情
export async function getCheck(params = {}) {
    const data = await httpObj.httpGet(serverListNew['addCheck'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取检核规则
export async function searchCheck(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchCheck'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 执行
export async function checkExec(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkExec'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核概要  获取核检任务历史列表 （按天统计页面同一个接口调两次 参数不一样）
export async function checkHistory(params = {}) {
    const data = await httpObj.httpGet(serverListNew['checkHistory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核概要  获取核检规则列表概要
export async function checkRuleList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkRuleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核概要  获取核检规则列表概要
export async function getCheckRuleList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['checkRuleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核概要  获取核检规则列表概要 导出
export async function checkRuleListExport(params = '') {
    // window.open(serverListNew['checkRuleListExport'] + params, '_self')

    httpObj.httpGetDownload(serverListNew['checkRuleListExport'] + params, {})
    return
}
// 检核概要  获取核检规则异常结果明细
export async function exceptionDetail(params = {}) {
    const data = await httpObj.httpPost(serverListNew['exceptionDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 检核概要  获取核检规则异常结果明细 导出
export async function exceptionDetailExport(params = '') {
    // window.open(serverListNew['exceptionDetailExport'] + params, '_self')

    httpObj.httpGetDownload(serverListNew['exceptionDetailExport'] + params, {})
    return
}

/**
 * 订阅规则 我的订阅列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function ruleSubscribeList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['ruleSubscribeList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 订阅规则 订阅列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function subscribeList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['subscribeList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 订阅规则 订阅列表   查看详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSubscribeDetail(params = {}) {
    const data = await httpObj.httpGet(serverListNew['subscribeDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 订阅规则 订阅列表   添加或者更新订阅
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postSubscribeDetail(params = {}) {
    const data = await httpObj.httpPost(serverListNew['subscribeList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 订阅规则 订阅列表  删除订阅
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteSubscribe(params = {}) {
    const data = await httpObj.httpPost(serverListNew['deleteSubscribe'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取调度组列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSchedule(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getSchedule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增修改规则组
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postSchedule(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getSchedule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取规则执行日志
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function execHistory(params = {}) {
    const data = await httpObj.httpGet(serverListNew['execHistory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function execLog(params = {}) {
    const data = await httpObj.httpGet(serverListNew['execLog'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function jobExec(params = {}) {
    const data = await httpObj.httpPost(serverListNew['jobExec'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function jobAbort(params = {}) {
    const data = await httpObj.httpPost(serverListNew['jobAbort'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取任务明细
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function scheduleDetail(params = {}) {
    const data = await httpObj.httpGet(serverListNew['scheduleDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 停止任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function checkAbort(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkAbort'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 挂起任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function checkJobHang(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkJobHang'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 激活任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function checkJobActive(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkJobActive'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除任务
export async function checkJobDelete(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkJobDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 责任人维护列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getCheckOwner(params = {}) {
    const data = await httpObj.httpGet(serverListNew['checkOwner'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 责任人维护添加或更新
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postCheckOwner(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkOwner'], formData(params))
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 责任人维护删除
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteCheckOwner(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkOwnerDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 责任人维护明细
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function checkOwnerDetail(params = {}) {
    const data = await httpObj.httpGet(serverListNew['checkOwnerDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReport(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReport'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function getEvaluationReport(params = {}) {
    const data = await httpObj.httpGet(serverListNew['evaluationReport'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function getEvaluationReportTitle(params = {}) {
    const data = await httpObj.httpGet(serverListNew['evaluationReportTitle'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportToggle(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReportToggle'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportDelete(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReportDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportPreview(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReportPreview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportSqlParse(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReportSqlParse'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportField(params = {}) {
    const data = await httpObj.httpGet(serverListNew['evaluationReportField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function reportStatisticInstitution(params = {}) {
    const data = await httpObj.httpGet(serverListNew['reportStatisticInstitution'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function reportStatisticLatest(params = {}) {
    const data = await httpObj.httpGet(serverListNew['reportStatisticLatest'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function reportStatisticGeneral(params = {}) {
    const data = await httpObj.httpGet(serverListNew['reportStatisticGeneral'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function reportStatisticPeriod(params = {}) {
    const data = await httpObj.httpGet(serverListNew['reportStatisticPeriod'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportInstitutions(params = {}) {
    const data = await httpObj.httpGet(serverListNew['evaluationReportInstitutions'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function evaluationReportExec(params = {}) {
    const data = await httpObj.httpPost(serverListNew['evaluationReportExec'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新的java接口质检------------------end----------------------------------------

// 检核表分析
export async function exTableAnalysisTopN(params = {}) {
    const data = await httpObj.httpGet(serverListNew['exTableAnalysisTopN'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function timeLibraryShow(params = {}) {
    const data = await httpObj.httpGet(serverListNew['timeLibraryShow'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function errorRule(params = {}) {
    const data = await httpObj.httpGet(serverListNew['errorRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function errorField(params = {}) {
    const data = await httpObj.httpGet(serverListNew['errorField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getGeneral(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getGeneral'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getAbnormalData(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getAbnormalData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getPeriodData(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getPeriodData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getExceptionDetail(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getExceptionDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getExceptionColumn(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getExceptionColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取质量检核调度任务
export async function getQualityTaskJobById(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getQualityTaskJobById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 保存质量检核调度任务
export async function saveQualityTaskJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveQualityTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取检核规则
export async function selectRule(params = {}) {
    const data = await httpObj.httpPost(serverListNew['selectRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取任务规则
export async function getTaskRuleListByTaskId(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getTaskRuleListByTaskId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询报告列表
export async function getReports(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getReports'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 保存单个评估指标
export async function saveEvaluation(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveEvaluation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

//获取报告单个指标
export async function getReportIndex(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getReportIndex'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取报告问题清单
export async function getReportProblemList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getReportProblemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询检核报告
export async function getReportChart(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getReportChart'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询规则历史明细
export async function getRuleHisInfo(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getRuleHisInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询规则历史趋势
export async function getRuleHisChart(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getRuleHisChart'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询单个规则信息
export async function selectRuleById(params = {}) {
    const data = await httpObj.httpPost(serverListNew['selectRuleById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询问题清单
export async function getCheckResltItemList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckResltItemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取任务下规则类型树
export async function getTaskRuleTypeTree(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getTaskRuleTypeTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 刷新报告
export async function refreshReport(params = {}) {
    const data = await httpObj.httpPost(serverListNew['refreshReport'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询单个规则检核结果
export async function getTaskResultById(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getTaskResultById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

//
export async function getMetadataTreeForRule(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getMetadataTreeForRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新-检核业务规则接口

export async function bizRuleSearch(params = {}) {
    const data = await httpObj.httpPost(serverListNew['bizRuleSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizRuleToggleStatus(params = {}) {
    const data = await httpObj.httpGet(serverListNew['bizRuleToggleStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizRuleDelete(params = {}) {
    const data = await httpObj.httpGet(serverListNew['bizRuleDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 检核依据值获取
export async function checkRuleTree(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkRuleTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function baseconfig(params = {}) {
    const data = await httpObj.httpGet(serverListNew['baseconfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getBizRuleById(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getBizRuleById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizRuleSaveOrEdit(params = {}) {
    const data = await httpObj.httpPost(serverListNew['bizRuleSaveOrEdit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function databaseList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['databaseList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function techRuleList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['techRuleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteRuleList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['deleteRuleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getTechRuleById(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getTechRuleById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function createTechRule(params = {}) {
    const data = await httpObj.httpPost(serverListNew['createTechRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchColumnField(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchColumnField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function toSql(params = {}) {
    const data = await httpObj.httpPost(serverListNew['toSql'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function updateTechRule(params = {}) {
    const data = await httpObj.httpPost(serverListNew['updateTechRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function checkExpression(params = {}) {
    const data = await httpObj.httpPost(serverListNew['checkExpression'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizTypeList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['bizTypeList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizTypeSaveOrEdit(params = {}) {
    const data = await httpObj.httpGet(serverListNew['bizTypeSaveOrEdit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizTypeDelete(params = {}) {
    const data = await httpObj.httpGet(serverListNew['bizTypeDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizTypeReorder(params = {}) {
    const data = await httpObj.httpPost(serverListNew['bizTypeReorder'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getQaTaskList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getQaTaskList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getTaskExecutorList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getTaskExecutorList'] + '?taskJobId=' + params.taskJobId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getQaTaskExeRuleList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getQaTaskExeRuleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getManagerListByTableId(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getManagerListByTableId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getTablePartitionSearchCondition(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getTablePartitionSearchCondition'] + '?tableId=' + params.tableId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dateColumns(params = {}) {
    const data = await httpObj.httpGet(serverListNew['dateColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function ruleToggleStatus(params = {}) {
    const data = await httpObj.httpGet(serverListNew['ruleToggleStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function periodExample(params = {}) {
    const data = await httpObj.httpPost(serverListNew['periodExample'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function producePeriodFunc(params = {}) {
    const data = await httpObj.httpPost(serverListNew['producePeriodFunc'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function resultList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['resultList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getCheckResultList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckResultList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getCheckResultItemList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckResultItemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getResultSearchCondition(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getResultSearchCondition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getCheckResultById(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckResultById'] + '?taskResultId=' + params.taskResultId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getSearchCondition4CheckResultList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getSearchCondition4CheckResultList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getCheckHistoryItemList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckHistoryItemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getCheckHistoryStatisticsData(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCheckHistoryStatisticsData'] + '?taskId=' + params.taskId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDatasourceCondition(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getDatasourceCondition'] + '?bizRuleId=' + params.bizRuleId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDatabaseCondition(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getDatabaseCondition'] + '?bizRuleId=' + params.bizRuleId + '&datasourceId=' + params.datasourceId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function listAllDatasourceData(params = {}) {
    const data = await httpObj.httpPost(serverListNew['listAllDatasourceData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function listAllDatabaseDataByDatasourceId(params = {}) {
    const data = await httpObj.httpPost(serverListNew['listAllDatabaseDataByDatasourceId'] + '?datasourceId=' + params.datasourceId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryBizRuleGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryBizRuleGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveBizRuleGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveBizRuleGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function updateBizRuleGroupName(params = {}) {
    const data = await httpObj.httpPost(serverListNew['updateBizRuleGroupName'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteBizRuleGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['deleteBizRuleGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function taskGroupList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['taskGroupList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function createTaskGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['createTaskGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function updateTaskGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['updateTaskGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteTaskGroup(params = {}) {
    const data = await httpObj.httpDel(serverListNew['deleteTaskGroup'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function taskGroupTableList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['taskGroupTableList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function changeTaskGroupStatus(params = {}) {
    const data = await httpObj.httpPost(serverListNew['changeTaskGroupStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getColumnByTableId(params = {}) {
    const data = await httpObj.httpGet(serverListNew['getColumnByTableId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function changeTableStatus(params = {}) {
    const data = await httpObj.httpPost(serverListNew['changeTableStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function changeTechRuleStatus(params = {}) {
    const data = await httpObj.httpPost(serverListNew['changeTechRuleStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function batchRunTest(params = {}) {
    const data = await httpObj.httpPost(serverListNew['batchRunTest'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function changeTableFocusState(params = {}) {
    const data = await httpObj.httpGet(serverListNew['changeTableFocusState'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function updateTableInfo(params = {}) {
    const data = await httpObj.httpPost(serverListNew['updateTableInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function addTableToTaskGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['addTableToTaskGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function removeTableFromTaskGroup(params = {}) {
    const data = await httpObj.httpPost(serverListNew['removeTableFromTaskGroup'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function runJobNow(params = {}) {
    const data = await httpObj.httpPost(serverListNew['runJobNow'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchTables(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchTables'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function queryExecRecords(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryExecRecords'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryExecInfoDetail(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryExecInfoDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function taskGroupDetail(params = {}) {
    const data = await httpObj.httpGet(serverListNew['taskGroupDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryCheckRangeList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['queryCheckRangeList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryTableSource(params = {}) {
    const data = await httpObj.httpGet(serverListNew['queryTableSource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryLatestRecords(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryLatestRecords'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryWrongRecord(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryWrongRecord'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryHistoryRecords(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryHistoryRecords'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryHistoryRecordDetails(params = {}) {
    const data = await httpObj.httpPost(serverListNew['queryHistoryRecordDetails'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryTableRecordsDetail(params = {}) {
    const data = await httpObj.httpGet(serverListNew['queryTableRecordsDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryRuleOverview(params = {}) {
    const data = await httpObj.httpGet(serverListNew['queryRuleOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}