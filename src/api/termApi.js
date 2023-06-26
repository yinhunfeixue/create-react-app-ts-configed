import CONSTANTS from 'app_constants'
import _ from 'underscore'
import sendPost, { httpObj } from './base'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['term']

// 术语开始----------------------------------------------------------------------

// 左侧类别 tree
export async function getTermCategory(params = {}) {
    const data = await sendPost('/dmp/term/category', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data.data
}

// 左侧类别 tree
export async function getPortraitCategory(params = {}) {
    const data = await sendPost('/dmp/portrait/category', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data.data
}

// 获取下拉框值
export async function getControlConfig(params = {}) {
    const data = await sendPost('/dmp/control/config', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 增加术语
export async function saveTerm(params = {}) {
    let formData = new FormData()

    if (params.params.uploadfile != undefined) {
        formData.append('uploadfile', params.params.uploadfile)
        delete params.params.uploadfile
    }

    console.log(params)
    _.map(params, (v, k) => {
        if (k == 'params') {
            v = JSON.stringify(v)
        }
        formData.append(k, v)
    })

    const data = await sendPost('/dmp/myterm/save', 'post', formData, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 请求术语列表
export async function getTermList(params = {}) {
    const data = await sendPost('/dmp/term/list', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 请求我的术语列表
export async function getMyTermList(params = {}) {
    const data = await sendPost('/dmp/myterm/list', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 术语列表的文件上传
export async function uploadTermFile(params = {}) {
    let formData = new FormData()

    if (params.uploadfile != undefined) {
        formData.append('uploadfile', params.uploadfile)
        delete params.uploadfile
    }

    const data = await sendPost('/dmp/myterm/upload', 'post', formData, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 术语中文名和英文名的校验
export async function termCheckunique(params = {}) {
    const data = await sendPost('/dmp/myterm/checkunique', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 业务口径接口 生成sql
export async function bmsQuery(params = {}) {
    const data = await sendPost('/query', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 业务口径接口 出现多条时，选择
export async function bmsQueryfromsearch(params = {}) {
    const data = await sendPost('/queryFromSearch', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// // 业务口径接口 生成sql
// export async function bmsQuery(params = {}) {
//   const data = await httpObj.httpGet(apiList["query"], params);
//   if (data == undefined) {
//     return false;
//   }
//   return data.data;
// }
//
// // 业务口径接口 出现多条时，选择
// export async function bmsQueryfromsearch(params = {}) {
//   const data = await httpObj.httpPost(apiList['queryfromsearch'], params);
//   if (data == undefined) {
//     return false;
//   }
//   return data.data;
// }

// 技术口径执行预览
export async function bmsRunsql(params = {}) {
    const data = await sendPost('/bms/runsql', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 详细信息接口(术语列表) 这里有些区别 后台要/dmp/myterm/detail/31这样传 不是/dmp/myterm/detail?id=31
export async function termDetail(params = '') {
    const data = await sendPost('/dmp/term/detail' + params, 'get', {}, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 术语详情 物理属性接口
export async function getTermPhysical(params = {}) {
    const data = await sendPost('/dmp/term/physical', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 详细信息接口(我的术语) 这里有些区别 后台要/dmp/myterm/detail/31这样传 不是/dmp/myterm/detail?id=31
export async function myTermDetail(params = '') {
    const data = await sendPost('/dmp/myterm/detail' + params, 'get', {}, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 术语搜索
export async function termSearch(params = {}) {
    const data = await sendPost('/dmp/term/search', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 历史记录
export async function termUpdatelog(params = {}) {
    const data = await sendPost('/dmp/term/updatelog', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 术语审核列表
export async function termChecklist(params = {}) {
    const data = await sendPost('/dmp/myterm/checklist', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/*
术语审核各操作接口
    id： 1
    operate： 多操作用逗号分隔
        check_ready：提交审核,
        check_pass：审核通过
 */

export async function mytermOperate(params = {}) {
    const data = await sendPost('/dmp/myterm/operate', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
// 术语结束----------------------------------------------------------------------

// 新的术语相关------------------------------------------------------------------

/**
 * 添加术语
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function addTerm(params = {}) {
    const data = await httpObj.httpPost(apiList['term'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 查询术语(单个查询、也就是查看某个详情)
 * @param  {Object} [params=string] [description]
 * @return {data}             [description]
 */
export async function getTerm(params = {}) {
    const data = await httpObj.httpGet(`${apiList['term']}${params}`)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 查询术语（查看列表）
 * @param  {Object} [params=string] [description]
 * @return {data}             [description]
 */
export async function getTermListAll(params = {}) {
    const data = await httpObj.httpGet(apiList['term'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 指标开始------------------------------------------------------------------
//上传文件
export async function uploadFile(params = {}) {
    let formData = new FormData()

    if (params.uploadfile != undefined) {
        formData.append('file', params.uploadfile)
        delete params.uploadfile
    }

    _.map(params, (v, k) => {
        formData.append(k, v)
    })

    const data = await httpObj.httpPost(apiList['termUploadFile'], formData)
    if (data == undefined) {
        return false
    }
    return data.data
}

//血缘关系图
export async function getBloodGraphData(params = {}) {
    const data = await httpObj.httpGet(apiList['blood'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

//血缘关系图点击节点
export async function getNodeDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['node'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 业务线查询（指标列表左侧树）
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function selectBusiness(params = {}) {
    const data = await httpObj.httpPost(apiList['selectBusiness'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标查询 -v2 list
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function selectMetric(params = {}) {
    const data = await httpObj.httpGet(apiList['metrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标查询 -v2 detail
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function selectMetricById(params = {}) {
    const data = await httpObj.httpGet(`${apiList['metrics']}/${params.id ? params.id : params.entityId}`)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标查询 -v1
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function selectMetricOld(params = {}) {
    const data = await httpObj.httpPost(apiList['selectMetric'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标新增
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function insertMetric(params = {}) {
    const data = await httpObj.httpPost(apiList['insertMetric'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标删除
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function deleteTarget(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteTarget'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 查询指标物理字段信息
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function selectPhysicalProperty(params = {}) {
    const data = await httpObj.httpPost(apiList['selectPhysicalProperty'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 *  查询指标-字段映射
 * @param params
 * @returns {Promise<*>}
 */
export async function selectMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['selectMapping'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  添加指标-字段映射
 * @param params
 * @returns {Promise<*>}
 */
export async function addMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['insertMapping'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function addMappingBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['insertMappingBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  删除指标-字段映射
 * @param params
 * @returns {Promise<*>}
 */
export async function deleteMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteMapping'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  删除指标-字段映射
 * @param params
 * @returns {Promise<*>}
 */
export async function deleteMappingBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteMappingBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  懒加载查询标准树
 * @param params
 * @returns {Promise<*>}
 */
export async function getStandardTree(params = {}) {
    const data = await httpObj.httpPost(apiList['getStandardTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  查询指标-标准映射
 * @param params
 * @returns {Promise<*>}
 */
export async function selectStandardRelation(params = {}) {
    const data = await httpObj.httpPost(apiList['selectStandardRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  保存指标-标准映射
 * @param params
 * @returns {Promise<*>}
 */
export async function insertStandardRelation(params = {}) {
    const data = await httpObj.httpPost(apiList['insertStandardRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  保存指标-标准映射
 * @param params
 * @returns {Promise<*>}
 */
export async function insertStandardRelationBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['insertStandardRelationBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 *  删除指标-标准映射
 * @param params
 * @returns {Promise<*>}
 */
export async function deleteStandardRelation(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteStandardRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取任务列表
 * @param params
 * @returns {Promise<*>}
 */
export async function getManualJob(params = {}) {
    const data = await httpObj.httpPost(apiList['getManualJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 添加任务接口
 * @param params
 * @returns {Promise<*>}
 */
export async function postManualJob(params = {}) {
    let formData = new FormData()

    if (params.uploadfile != undefined) {
        formData.append('file', params.uploadfile)
        delete params.uploadfile
    }

    _.map(params, (v, k) => {
        formData.append(k, v)
    })

    const data = await httpObj.httpPost(apiList['manualJob'], formData)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除任务
 * @param params
 * @returns {Promise<*>}
 */
export async function deleteManualJob(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteManualJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 实用业务模型视图
 * @param params
 * @returns {Promise<*>}
 */
export async function businessTypeView(params = {}) {
    const data = await httpObj.httpGet(apiList['businessTypeView'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 逻辑模型视图
 * @param params
 * @returns {Promise<*>}
 */
export async function logicModel(params = {}) {
    const data = await httpObj.httpGet(apiList['logicModel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 逻辑血缘视图
 * @param params
 * @returns {Promise<*>}
 */
export async function LogicFieldLineage(params = {}) {
    const data = await httpObj.httpGet(apiList['LogicFieldLineage'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 逻辑血缘addChildren增量接口
 * @param params
 * @returns {Promise<*>}
 */
export async function logicField(params = {}) {
    const data = await httpObj.httpPost(apiList['logicField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 指标升级标准接口
 * @param params
 * @returns {Promise<*>}
 */
export async function upgradeMetrics(params = {}) {
    const data = await httpObj.httpPost(apiList['upgradeMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 标准列表查询接口(我的申请、新的申请)
 * @param params
 * @returns {Promise<*>}
 */
export async function getStandardList(params = {}) {
    const data = await httpObj.httpGet(apiList['getStandardList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标新增接口(我的申请、新的申请)
 * @param params
 * @returns {Promise<*>}
 */
export async function apiMetrics(params = {}) {
    const data = await httpObj.httpPost(apiList['apiMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标发布
 * @param params
 * @returns {Promise<*>}
 */
export async function metricsPublish(params = {}) {
    const data = await httpObj.httpPost(apiList['metricsPublish'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取指标分类树
 * @param params
 * @returns {Promise<*>}
 */
export async function metricsCategory(params = {}) {
    const data = await httpObj.httpGet(apiList['metricsCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 指标分类树删除特定项
 * @param params
 * @returns {Promise<*>}
 */
export async function metricsCategoryDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['metricsCategoryDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增||修改指标分类树
 * @param params
 * @returns {Promise<*>}
 */
export async function metricsCategoryEdit(params = {}) {
    const data = await httpObj.httpPost(apiList['metricsCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取报表指标详情
 * @param params
 * @returns {Promise<*>}
 */
export async function columnDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['columnDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取报表字段的口径Sql
export async function caliberSql(params = {}) {
    const data = await httpObj.httpGet(apiList['caliberSql'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取指标简要信息
export async function metricsSimpleList(params = {}) {
    const data = await httpObj.httpGet(apiList['metricsSimpleList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取指标绑定统计(若不需根据列表中的选择事实变化，则无需传入参)
export async function metricsBindStatistic(params = {}) {
    const data = await httpObj.httpGet(apiList['metricsBindStatistic'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 报表绑定指标信息列表
export async function metricsBindList(params = {}) {
    const data = await httpObj.httpGet(apiList['metricsBindList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 修改报表信息(包括字段信息)
export async function completeReport(params = {}) {
    const data = await httpObj.httpPost(apiList['completeReport'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 解除显示列与指标间的关系
export async function unbindMetrics(params) {
    const data = await httpObj.httpPUT(apiList['unbindMetrics'] + '?columnId=' + params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取指标技术口径
export async function techInfo(params) {
    const data = await httpObj.httpGet(apiList['techInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 确认技术口径
export async function confirmTechInfo(params) {
    const data = await httpObj.httpPost(apiList['confirmTechInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 解析指标技术口径
export async function parseTechInfo(params) {
    const data = await httpObj.httpGet(apiList['parseTechInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 保存技术口径字段关联关系
export async function saveRelateColumn(params) {
    const data = await httpObj.httpPost(apiList['saveRelateColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 删除指标技术口径关联字段
export async function deleteRelateColumn(params) {
    const data = await httpObj.httpPost(apiList['deleteRelateColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标-字段关联接口
export async function columnRelation(params) {
    const data = await httpObj.httpGet(apiList['columnRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标-字段关联统计接口
export async function columnRelationStatistics(params) {
    const data = await httpObj.httpGet(apiList['columnRelationStatistics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标详情页：指标质量监控列表
export async function listMetricsQaResult(params) {
    const data = await httpObj.httpPost(apiList['listMetricsQaResult'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标监控：质量监控接口
export async function statisticsMetricsQaMonitor(params) {
    const data = await httpObj.httpPost(apiList['statisticsMetricsQaMonitor'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标监控：规则定义接口
export async function statisticsMetricsQaRuleDefine(params) {
    const data = await httpObj.httpPost(apiList['statisticsMetricsQaRuleDefine'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标监控：规则执行接口
export async function statisticsMetricsRuleExecute(params) {
    const data = await httpObj.httpPost(apiList['statisticsMetricsRuleExecute'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标监控：字段指标关联接口
export async function listMetricsColumnRelated(params) {
    const data = await httpObj.httpPost(apiList['listMetricsColumnRelated'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取规则源库表字段信息
export async function getColumnExtInfo(params) {
    const data = await httpObj.httpGet(apiList['getColumnExtInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 指标结束--------------------------------------------------------------

export async function atomicMetricsSearch(params) {
    const data = await httpObj.httpPost(apiList['atomicMetricsSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function suggestColumnType(params) {
    const data = await httpObj.httpPost(apiList['suggestColumnType'] + '?function=' + params.function + '&columnId=' + params.columnId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveOrUpdate(params) {
    const data = await httpObj.httpPost(apiList['saveOrUpdate'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function listFunctions(params) {
    const data = await httpObj.httpGet(apiList['listFunctions'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getSearchConditionBizProcess(params) {
    const data = await httpObj.httpGet(apiList['getSearchConditionBizProcess'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getSearchConditionBizModuleAndTheme(params) {
    const data = await httpObj.httpGet(apiList['getSearchConditionBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['getClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getAtomicMetricsById(params) {
    const data = await httpObj.httpPost(apiList['getAtomicMetricsById'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function existsAtomicMetrics(params) {
    const data = await httpObj.httpGet(apiList['existsAtomicMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteAtomicMetricsById(params) {
    const data = await httpObj.httpPost(apiList['deleteAtomicMetricsById'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsSimple(params) {
    const data = await httpObj.httpGet(apiList['factassetsSimple'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsColumns(params) {
    const data = await httpObj.httpPost(apiList['factassetsColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getBizClassifyById(params) {
    const data = await httpObj.httpGet(apiList['getBizClassifyById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getClassifyById(params) {
    const data = await httpObj.httpGet(apiList['getClassifyById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDatasourceId(params) {
    const data = await httpObj.httpPost(apiList['getDatasourceId'] + '?physicalColumnId=' + params.columnId)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 衍生指标
export async function derivativeMetricsSearch(params) {
    const data = await httpObj.httpPost(apiList['derivativeMetricsSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDerBizModuleAndTheme(params) {
    const data = await httpObj.httpGet(apiList['getDerBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDerClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['getDerClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDerBizProcess(params) {
    const data = await httpObj.httpGet(apiList['getDerBizProcess'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteDerById(params) {
    const data = await httpObj.httpPost(apiList['deleteDerById'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDerById(params) {
    const data = await httpObj.httpPost(apiList['getDerById'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function preCreateDerivativeMetrics(params) {
    const data = await httpObj.httpPost(apiList['preCreateDerivativeMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function createDerivativeMetrics(params) {
    const data = await httpObj.httpPost(apiList['createDerivativeMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function updateDerivativeMetrics(params) {
    const data = await httpObj.httpPost(apiList['updateDerivativeMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function statisticalperiodSimple(params) {
    const data = await httpObj.httpPost(apiList['statisticalperiodSimple'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function derivativeMetricsSql(params) {
    const data = await httpObj.httpGet(apiList['derivativeMetricsSql'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getRelatedMetrics(params) {
    const data = await httpObj.httpPost(apiList['getRelatedMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDeriveRelatedMetrics(params) {
    const data = await httpObj.httpPost(apiList['getDeriveRelatedMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsTree(params) {
    const data = await httpObj.httpPost(apiList['metricsTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsSearch(params) {
    const data = await httpObj.httpPost(apiList['metricsSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessSearch(params) {
    const data = await httpObj.httpPost(apiList['businessSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function businessTree(params) {
    const data = await httpObj.httpPost(apiList['businessTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
