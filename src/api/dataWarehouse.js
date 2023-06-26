import sendPost, { formData, httpObj } from './base'
import CONSTANTS from 'app_constants';
const serverListNew = CONSTANTS['API_LIST']['dataWarehouse']

// 获取标签溯源任务列表
export async function getSourceTrackTaskJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getSourceTrackTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 保存标签溯源任务列表
export async function saveSourceTrackJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveSourceTrackJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 全链概览统计数
export async function fullchainOverviewStat(params = {}) {
    const data = await httpObj.httpGet(serverListNew['fullchainOverviewStat'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 溯源概览统计数
export async function sourceTraceOverviewStat(params = {}) {
    const data = await httpObj.httpGet(serverListNew['sourceTraceOverviewStat'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 孤立表
export async function isolatedTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['isolatedTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 无去向表
export async function noTargetToTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['noTargetToTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 无来向表
export async function noSourceFromTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['noSourceFromTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 无业务标签表
export async function noBizTagTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['noBizTagTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 无分级标签表
export async function noHierrachyTagTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['noHierrachyTagTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 库模型关系列表
export async function dbModelRelationList(params = {}) {
    const data = await httpObj.httpGet(serverListNew['dbModelRelationList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 库模型列表
export async function dbModelList(params = {}) {
    const data = await httpObj.httpPost(serverListNew['dbModelList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 库模型图示
export async function dbModelRelationGraph(params = {}) {
    const data = await httpObj.httpGet(serverListNew['dbModelRelationGraph'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取关系推理任务列表
export async function getInferenceTaskJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getInferenceTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 保存关系推理任务列表
export async function saveInferenceJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveInferenceJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 表名筛选
export async function tableSearch(params = {}) {
    const data = await httpObj.httpGet(serverListNew['tableSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 库模型孤立表
export async function dbModelIsolatedTable(params = {}) {
    const data = await httpObj.httpGet(serverListNew['dbModelIsolatedTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除关联关系
export async function deleteRelation(params = {}) {
    const data = await httpObj.httpDel(serverListNew['deleteRelation'], { data: params })
    if (data == undefined) {
        return false
    }
    return data.data
}

// 判断是否需要关系推理
export async function needRelationInference(params = {}) {
    const data = await httpObj.httpPost(serverListNew['needRelationInference'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 码值推理记录
export async function getCodeItemTaskJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['getCodeItemTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 保存代码项推理任务
export async function saveCodeItemJob(params = {}) {
    const data = await httpObj.httpPost(serverListNew['saveCodeItemJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 代码项推理列表
export async function rcolumncode(params = {}) {
    const data = await httpObj.httpGet(serverListNew['rcolumncode'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


// 可添加的字段
export async function canAddColumn(params = {}) {
    const data = await httpObj.httpPost(serverListNew['canAddColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 未确认数量
export async function notConfirmNumber(params = {}) {
    const data = await httpObj.httpGet(serverListNew['notConfirmNumber'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取最近推理时间
export async function lastInferenceTime(params = {}) {
    const data = await httpObj.httpGet(serverListNew['lastInferenceTime'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新增代码项推理逻辑
export async function addByColumnIds(params = {}) {
    const data = await httpObj.httpPost(serverListNew['addByColumnIds'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 操作代码项推理记录
export async function operation(params = {}) {
    const data = await httpObj.httpPost(serverListNew['operation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 代码项推理详情
export async function rcolumncodeDetail(params) {
    const data = await httpObj.httpGet(serverListNew['rcolumncodeDetail'] + `/${params}`, {})
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取代码项列表
export async function codeItem(params = {}) {
    const data = await httpObj.httpGet(serverListNew['codeItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 修改绑定代码项
export async function modifyCode(params = {}) {
    const data = await httpObj.httpPost(serverListNew['modifyCode'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 新增/修改代码项
export async function addCodeItem(params = {}) {
    const data = await httpObj.httpPost(serverListNew['addCodeItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 代码项名称是否存在
export async function codeItemNameExist(params = {}) {
    const data = await httpObj.httpGet(serverListNew['codeItemNameExist'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 根据ID获取代码项
export async function codeItemDetail(params) {
    const data = await httpObj.httpGet(serverListNew['codeItemDetail'] + `/${params}`, {})
    if (data == undefined) {
        return false
    }
    return data.data
}

// 解除代码项绑定
export async function deleteCodeItem(params = {}) {
    const data = await httpObj.httpPost(serverListNew['deleteCodeItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


//**************影响分析*********************//
export async function getDiffDetailTable(params = {}) {
    const data = await httpObj.httpPost(serverListNew['diffDetailTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDiffDetailColumn(params = {}) {
    const data = await httpObj.httpPost(serverListNew['diffDetailColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDiffDetailItem(path, params = {}) {

    const data = await httpObj.httpPost(`${serverListNew['diffDetailItem']}${path}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 影响分析数据获取
 * @param {*} path 
 * @param {*} params 
 */
export async function getDiffDetailLineagesList(params = {}) {
    const data = await httpObj.httpPost(`${serverListNew['diffDetailLineages']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 影响分析字段下拉框
 * @param {*} path 
 * @param {*} params 
 */
export async function getDiffDetailLineagesFieldList(path, params = {}) {

    const data = await httpObj.httpPost(`${serverListNew['diffDetailLineagesSelects']}${path}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 变更过滤后字段信息导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
// export async function getFieldDiffDownload(params = '') {
//     // let paramsStr = ""
//     // _.map(params, (v, k) => {
//     //     paramsStr +=
//     // })

//     // window.open(apiList['fieldDiffDownload'] + '?' + params, '_self')
//     httpObj.httpPostDownload(serverListNew['diffDetailDownload'], params)
//     return
// }

/**
 * 变更所有字段信息导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDiffDiffDownloadAll(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['fieldDiffDownloadAll'] + '?' + params, '_self')
    httpObj.httpPostDownload(serverListNew['diffDetailDownload'], params)
    return
}

/**
 * 血缘变更所有字段信息导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDiffDetailLineagesDownload(params = '') {
    httpObj.httpPostDownload(serverListNew['diffDetailLineagesDownload'], params)
    return
}
//****************END********************//


//****************主数据推理********************//

// 主数据推理列表
export async function inferenceMaindata(params = {}) {
    const data = await httpObj.httpGet(serverListNew['inferenceMaindata'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataLastInferenceTime
export async function inferenceMaindataLastInferenceTime(params = {}) {
    const data = await httpObj.httpGet(serverListNew['inferenceMaindataLastInferenceTime'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataAddByTableIds
export async function inferenceMaindataAddByTableIds(params = {}) {
    const data = await httpObj.httpPost(serverListNew['inferenceMaindataAddByTableIds'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataCanAddTables
export async function inferenceMaindataCanAddTables(params = {}) {
    const data = await httpObj.httpPost(serverListNew['inferenceMaindataCanAddTables'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataModifyColumn
export async function inferenceMaindataModifyColumn(params = {}) {
    const data = await httpObj.httpPost(serverListNew['inferenceMaindataModifyColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataOperation
export async function inferenceMaindataOperation(params = {}) {
    const data = await httpObj.httpPost(serverListNew['inferenceMaindataOperation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// searchField
export async function searchField(params = {}) {
    const data = await httpObj.httpPost(serverListNew['searchField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// inferenceMaindataNotConfirmNumber
export async function inferenceMaindataNotConfirmNumber(params = {}) {
    const data = await httpObj.httpGet(serverListNew['inferenceMaindataNotConfirmNumber'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

//****************END********************//
// 分区统计

// 分区表统计数
export async function tablePartitionStats(params = {}) {
    const data = await httpObj.httpGet(serverListNew['tablePartitionStats'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 分区信息概览
export async function tablePartitionOverview(params = {}) {
    const data = await httpObj.httpGet(serverListNew['tablePartitionOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 分区列表
export async function tablePartitionItem(params = {}) {
    const data = await httpObj.httpPost(serverListNew['tablePartitionItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 不同类型分区表统计列表
export async function tableListForPartition(params = {}) {
    const data = await httpObj.httpPost(serverListNew['tableListForPartition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 选择要忽略的问题
export async function ignoreProblems(params = {}) {
    const data = await httpObj.httpPost(serverListNew['ignoreProblems'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 修改分区配置内容
export async function editConfigureOfTablePartition(params = {}) {
    const data = await httpObj.httpPost(serverListNew['editConfigureOfTablePartition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查看分区配置内容
export async function queryConfigureOfTablePartition(params = {}) {
    const data = await httpObj.httpGet(serverListNew['queryConfigureOfTablePartition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查看分区键格式
export async function partitionKeyFormat(params = {}) {
    const data = await httpObj.httpGet(serverListNew['partitionKeyFormat'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息完整度
export async function chineaseName(params = {}) {
    const data = await httpObj.httpGet(serverListNew['chineaseName'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 字段对标统计
export async function columnMapStandard(params = {}) {
    const data = await httpObj.httpGet(serverListNew['columnMapStandard'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function columnMatchStandard(params = {}) {
    const data = await httpObj.httpGet(serverListNew['columnMatchStandard'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dwLevelInfoStatistic(params = {}) {
    const data = await httpObj.httpGet(serverListNew['dwLevelInfoStatistic'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function nameSpecification(params = {}) {
    const data = await httpObj.httpGet(serverListNew['nameSpecification'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metadataAndLineage(params = {}) {
    const data = await httpObj.httpGet(serverListNew['metadataAndLineage'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function initializeProgress(params = {}) {
    const data = await httpObj.httpGet(serverListNew['initializeProgress'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function initializeNextStep(params = {}) {
    const data = await httpObj.httpGet(serverListNew['initializeNextStep'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
