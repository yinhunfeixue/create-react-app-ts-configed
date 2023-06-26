import Request from '@/api/request'
import CONSTANTS from 'app_constants'
import * as qs from 'qs'
import _ from 'underscore'
import {
    httpObj
} from './base'

const serverList = CONSTANTS['API_LIST']['standard']

export async function desensitizerule(){
    // todo by webpack5
}

/**
 * 标准数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getStandardList(params = {}) {
    const data = await httpObj.httpPost(serverList['standardList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 标准数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function GetStandardList(params = {}) {
    const data = await httpObj.httpGet(serverList['standardList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 标准类目获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getStandardCategory(params = {}) {
    const data = await httpObj.httpGet(serverList['standardCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 *代码定义弹出框值获取
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getCodeDefinition(params = {}) {
    const data = await httpObj.httpPost(serverList['codeDefinition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 标准废弃
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardDiscard(params = {}) {
    let formData = new FormData()
    _.map(params, (v, k) => {
        if (k == 'params') {
            v = JSON.stringify(v)
        }
        formData.append(k, v)
    })

    const data = await httpObj.httpPost(serverList['standardDiscard'], formData)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 标准的字段映射列表
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardMapField(params = {}) {
    const data = await httpObj.httpGet(serverList['standardMapField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 标准的指标映射列表
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardMapTarget(params = {}) {
    const data = await httpObj.httpPost(serverList['standardMapTarget'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增标准-字段映射
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function addStandardMapField(params = {}) {
    const data = await httpObj.httpPost(serverList['addStandardMapField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增标准-字段映射
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function addStandardMapFieldBatch(params = {}) {
    const data = await httpObj.httpPost(serverList['addStandardMapFieldBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增标准-指标映射
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function addStandardMapTarget(params = {}) {
    const data = await httpObj.httpPost(serverList['addStandardMapTarget'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除标准-字段映射
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function delStandardMapField(params = {}) {
    const data = await httpObj.httpPost(serverList['delStandardMapField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除标准-指标映射
 *@param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function delStandardMapTarget(params = {}) {
    const data = await httpObj.httpPost(serverList['delStandardMapTarget'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 标准分类树的修改新增
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function editStandardCategory(params = {}) {
    const data = await httpObj.httpPost(serverList['editStandardCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 标准分类树的删除
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function deleteStandardCategory(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteStandardCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 标准的修改和新增
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function addOrModifyStandard(params = {}) {
    const data = await httpObj.httpPost(serverList['addOrModifyStandard'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 查看标准引用列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardMapping(params = {}) {
    const data = await httpObj.httpGet(serverList['standardMapping'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取代码值
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getStandardCodeValue(params = {}) {
    const data = await httpObj.httpGet(serverList['standardCodeValue'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 新增或修改代码值
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function postStandardCodeValue(params = {}) {
    const data = await httpObj.httpPost(serverList['standardCodeValue'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除代码值
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function deleteStandardCodeValue(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteStandardCodeValue'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 标准-代码值映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardCodeMap(params = {}) {
    const data = await httpObj.httpGet(serverList['standardCodeMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 源系统代码项
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fromStandard(params = {}) {
    const data = await httpObj.httpGet(serverList['fromStandard'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 源系统代码项  树
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardCodeValueTree(params = {}) {
    const data = await httpObj.httpGet(serverList['standardCodeValueTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取映射列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function metadataCodeValueMapList(params = {}) {
    const data = await httpObj.httpGet(serverList['metadataCodeValueMapList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 代码值映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeValueMap(params = {}) {
    const data = await httpObj.httpGet(serverList['codeValueMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function codeValueMapDownload(params = {}) {
    window.open(`${serverList['codeValueMap']}/download?${qs.stringify(params)}`, '_self')
}

export async function postCodeValueMap(params = {}) {
    const data = await httpObj.httpPost(serverList['codeValueMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function codeMap(params = {}) {
    const data = await httpObj.httpPost(serverList['codeMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function exportModelExcel(params = {}) {
    window.open(`${serverList['exportModelExcel']}?${qs.stringify(params)}`, '_self')
}

export async function standardDelete(params = {}) {
    const data = await httpObj.httpPost(serverList['standardDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function downloadExeclTemplate(params = {}) {
    const res = await Request.httpGetDownload(serverList['downloadExeclTemplate'], params).then((res) => {
        console.log('下载中')
    })
}


// 获取树
export async function getTree(params = {}) {
    const data = await httpObj.httpPost(serverList['getTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除树节点
export async function deleteTreeNode(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加树节点
export async function addTreeNode(params = {}) {
    const data = await httpObj.httpPost(serverList['addTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 更新树节点
export async function updateTreeNode(params = {}) {
    const data = await httpObj.httpPost(serverList['updateTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}



// 检查同级名称是否重复
export async function checkNodeName(params = {}) {
    const data = await httpObj.httpPost(serverList['checkNodeName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取节点资源数量
export async function getNodeSourceCountByNodeId(params = {}) {
    const data = await httpObj.httpPost(serverList['getNodeSourceCountByNodeId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取变更记录
export async function standardHistoryRecord(params = {}) {
    const data = await httpObj.httpGet(serverList['standardHistoryRecord'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 获取变更详情
export async function standardHistoryRecords(params = {}) {
    const data = await httpObj.httpGet(serverList['standardHistoryRecords'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 我的标准变更待办任务
export async function getTaskTodo(params = {}) {
    const data = await httpObj.httpGet(serverList['getTaskTodo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 提交任务结果
export async function taskGo(params = {}) {
    const data = await httpObj.httpPost(serverList['taskGo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 发起审核流程
export async function submitChange(params = {}) {
    const data = await httpObj.httpPost(serverList['submitChange'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 查询标准原始内容
export async function applyInfo(params) {
    const data = await httpObj.httpGet(serverList['applyInfo'] + `/${params}/applyInfo`)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 任务详情
export async function getChangeDetail(params) {
    const data = await httpObj.httpGet(serverList['getChangeDetail'] + `/${params}/detail`)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取数仓层级和数据库列表接口
export async function getNameCnManualAddSearchCondition(params = {}) {
    const data = await httpObj.httpGet(serverList['getNameCnManualAddSearchCondition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动添加中文信息页面：列表查询接口
export async function listManualAddTableData(params = {}) {
    const data = await httpObj.httpPost(serverList['listManualAddTableData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动添加中文信息页面：表详情数据展示接口
export async function getManualTableDetail(params = {}) {
    const data = await httpObj.httpPost(serverList['getManualTableDetail'] + '?tableId=' + params.tableId)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 手动添加中文信息页面：提交保存接口
export async function saveManualData(params = {}) {
    const data = await httpObj.httpPost(serverList['saveManualData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息自动抽取页面：列表查询接口
export async function listEtlExtractTableData(params = {}) {
    const data = await httpObj.httpPost(serverList['listEtlExtractTableData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息自动抽取页面：获取数仓层级和数据库列表接口
export async function getNameCnEtlSearchCondition(params = {}) {
    const data = await httpObj.httpGet(serverList['getNameCnEtlSearchCondition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息自动抽取页面：统计数据接口
export async function getEtlStatisticsData(params = {}) {
    const data = await httpObj.httpGet(serverList['getEtlStatisticsData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息自动抽取页面：表详情数据展示接口
export async function getEtlTableDetail(params = {}) {
    const data = await httpObj.httpPost(serverList['getEtlTableDetail'] + '?tableId=' + params.tableId)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 中文信息自动抽取页面：提交保存接口
export async function saveEtlData(params = {}) {
    const data = await httpObj.httpPost(serverList['saveEtlData'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：标准列表
export async function dwappStandard(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappStandard'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 标准对标：指定标准统计信息
export async function dwappStandardStatistic(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappStandardStatistic'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 标准对标：标准详情
export async function dwappStandardDetail(params = {}) {
    const data = await httpObj.httpGet(serverList['dwappStandardDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：标准下的字段信息
export async function dwappStandardColumn(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappStandardColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：标准下的字段信息
export async function dwappTagInLevel(params = {}) {
    const data = await httpObj.httpGet(serverList['dwappTagInLevel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：标准下的字段信息
export async function addRelation(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteRelation'] + params.standardId, params.columnIds)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：关联字段的下数据库信息
export async function dwappDatabase(params = {}) {
    const data = await httpObj.httpGet(serverList['dwappDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 标准对标：搜索字段信息
export async function dwappColumnSearch(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappColumnSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 拥有血缘文件的数据源信息
export async function lineageDatasource(params = {}) {
    const data = await httpObj.httpGet(serverList['lineageDatasource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 血缘文件重写
export async function standardRewrite(params = {}) {
    const data = await httpObj.httpGet(serverList['standardRewrite'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取统计数据(图标等数据)
export async function getColumnStandardMatchStatistics(params = {}) {
    const data = await httpObj.httpGet(serverList['getColumnStandardMatchStatistics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 搜索落标详情任务执行结果
export async function searchJobResult(params = {}) {
    const data = await httpObj.httpPost(serverList['searchJobResult'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 执行任务
export async function executeJob(params = {}) {
    const data = await httpObj.httpPost(serverList['executeJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 导出落标详情
export async function exportJobResult(params = {}) {
    httpObj.httpPostDownload(serverList['exportJobResult'], params)
    return
}

// 保存配置任务
export async function saveJob(params = {}) {
    const data = await httpObj.httpPost(serverList['saveJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 搜索字段过滤器
export async function columnFilters(params = {}) {
    const data = await httpObj.httpPost(serverList['columnFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 数仓层次下的标签信息
export async function tagInLevel(params = {}) {
    const data = await httpObj.httpGet(serverList['tagInLevel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 数仓标签下的数据库信息
export async function levelDatabase(params = {}) {
    const data = await httpObj.httpPost(serverList['levelDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 智能对标列表(簇对标)
export async function standardCluster(params = {}) {
    const data = await httpObj.httpPost(serverList['standardCluster'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 智能对标完成率
export async function clusterStatistic(params = {}) {
    const data = await httpObj.httpPost(serverList['clusterStatistic'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 智能对标簇字段
export async function clusterColumn(params = {}) {
    const data = await httpObj.httpPost(serverList['clusterColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 确认簇对应标准
export async function clusterConfirm(params = {}) {
    const data = await httpObj.httpPost(serverList['clusterConfirm'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取所有簇
export async function dwappCluster(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappCluster'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 统计信息
export async function dwappClusterStatistic(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappClusterStatistic'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 编辑标准
export async function editStandard(params = {}) {
    const data = await httpObj.httpPost(serverList['editStandard'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 簇详情
export async function clusterDetail(params = {}) {
    const data = await httpObj.httpPost(serverList['clusterDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 修改簇信息
export async function clusterSave(params = {}) {
    const data = await httpObj.httpPost(serverList['clusterSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 簇下字段信息
export async function dwappClusterColumn(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappClusterColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 簇下字段信息
export async function dwappClusterColumnWithStatus(params = {}) {
    const data = await httpObj.httpPost(serverList['dwappClusterColumnWithStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 簇下数仓层级信息
export async function dwLevelTag(params = {}) {
    const data = await httpObj.httpGet(serverList['dwLevelTag'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 簇下数据库信息
export async function dwDatabase(params = {}) {
    const data = await httpObj.httpGet(serverList['dwDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dwDatasource(params = {}) {
    const data = await httpObj.httpGet(serverList['dwDatasource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 簇下数据表信息
export async function dwTable(params = {}) {
    const data = await httpObj.httpGet(serverList['dwTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 所删字段的相关字段
export async function relateWhenDelete(params = {}) {
    const data = await httpObj.httpPost(serverList['relateWhenDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 删除簇下字段
export async function deleteCluster(params = {}) {
    const data = await httpObj.httpDel(serverList['deleteCluster'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 补充中文信息
export async function fillChinese(params = {}) {
    const data = await httpObj.httpPost(serverList['fillChinese'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDatabaseByLevelId(params = {}) {
    const data = await httpObj.httpGet(serverList['getDatabaseByLevelId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchJobResultCondition(params = {}) {
    const data = await httpObj.httpPost(serverList['searchJobResultCondition'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dwappDatasource(params = {}) {
    const data = await httpObj.httpGet(serverList['dwappDatasource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function changeStandardStatus(params = {}) {
    const data = await httpObj.httpPost(serverList['changeStandardStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getStandardDataType(params = {}) {
    const data = await httpObj.httpGet(serverList['getStandardDataType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getStandardLevel(params = {}) {
    const data = await httpObj.httpGet(serverList['getStandardLevel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getStdSrc(params = {}) {
    const data = await httpObj.httpGet(serverList['getStdSrc'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function standardEdit(params = {}) {
    const data = await httpObj.httpPost(serverList['standardEdit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function dicDsList(params = {}) {
    const data = await httpObj.httpPost(serverList['dicDsList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicDsInfo(params = {}) {
    const data = await httpObj.httpGet(serverList['dicDsInfo'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicDsOverview(params = {}) {
    const data = await httpObj.httpGet(serverList['dicDsOverview'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicDsTable(params = {}) {
    const data = await httpObj.httpPost(serverList['dicDsTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicTableInfo(params = {}) {
    const data = await httpObj.httpGet(serverList['dicTableInfo'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicTableOverview(params = {}) {
    const data = await httpObj.httpGet(serverList['dicTableOverview'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicField(params = {}) {
    const data = await httpObj.httpPost(serverList['dicField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveDicField(params = {}) {
    const data = await httpObj.httpPost(serverList['saveDicField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveDicTable(params = {}) {
    const data = await httpObj.httpPost(serverList['saveDicTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicWordSpecs(params = {}) {
    const data = await httpObj.httpGet(serverList['dicWordSpecs'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function specSwitch(params) {
    const data = await httpObj.httpGet(serverList['specSwitch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function specSwitchOpera(params) {
    const data = await httpObj.httpGet(serverList['specSwitchOpera'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dicFieldRefresh(params) {
    const data = await httpObj.httpPost(serverList['dicFieldRefresh'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryDetailInfo(params) {
    const data = await httpObj.httpGet(serverList['queryDetailInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryDefaultBizRule(params) {
    const data = await httpObj.httpGet(serverList['queryDefaultBizRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function queryCheckRuleByStandardId(params) {
    const data = await httpObj.httpGet(serverList['queryCheckRuleByStandardId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryUdcCode(params) {
    const data = await httpObj.httpGet(serverList['queryUdcCode'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function estimateSystemTree(params) {
    const data = await httpObj.httpGet(serverList['estimateSystemTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function estimateOverview(params) {
    const data = await httpObj.httpGet(serverList['estimateOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryEstimateTableList(params) {
    const data = await httpObj.httpPost(serverList['queryEstimateTableList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}



export async function queryNotEstimateSystemList(params) {
    const data = await httpObj.httpGet(serverList['queryNotEstimateSystemList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveConfig(params) {
    const data = await httpObj.httpPost(serverList['saveConfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryConfigBySystemId(params) {
    const data = await httpObj.httpGet(serverList['queryConfigBySystemId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryEstimateColumnList(params) {
    const data = await httpObj.httpGet(serverList['queryEstimateColumnList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function estimateHistoryOverview(params) {
    const data = await httpObj.httpGet(serverList['estimateHistoryOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryTableSource(params) {
    const data = await httpObj.httpGet(serverList['queryTableSource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function executeEstimate(params) {
    const data = await httpObj.httpGet(serverList['executeEstimate'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteEstimateInfo(params = {}) {
    console.log("params", params)
    const data = await httpObj.httpDel(serverList['deleteEstimateInfo'] + "?systemId=" + params.systemId)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function queryRowsNumByDatasourceId(params) {
    const data = await httpObj.httpGet(serverList['queryRowsNumByDatasourceId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function queryTablesRowNumByTableIds(params) {
    const data = await httpObj.httpPost(serverList['queryTablesRowNumByTableIds'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}