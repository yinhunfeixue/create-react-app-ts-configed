import CONSTANTS from 'app_constants'
import qs from 'qs'
import _ from 'underscore'
import sendPost, { formData, httpObj } from './base'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['metadata']

// 重新解析血缘
export async function reanalysis(params = {}) {
    const data = await httpObj.httpGet(apiList['reanalysis'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表视图列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function viewList(params = {}) {
    const data = await httpObj.httpGet(apiList['viewList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 上传报表文件
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function reportUpload(params = {}) {
    const data = await httpObj.httpPost(apiList['reportUpload'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 查看文件分析日志
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function analysisLog(params = {}) {
    const data = await httpObj.httpGet(apiList['analysisLog'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表指标信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function columnList(params = {}) {
    const data = await httpObj.httpGet(apiList['columnList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 修改报表指标信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function editColumnList(params = {}) {
    const data = await httpObj.httpPost(apiList['columnList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表基本信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function reportDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['reportDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表表头预览信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function headInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['headInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表文件列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getExternalList(params = {}) {
    const data = await httpObj.httpGet(apiList['getExternalList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取报表任务列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getReportList(params = {}) {
    const data = await httpObj.httpGet(apiList['getReportList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取浏览左侧树
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getMetadataTree(params = {}) {
    const data = await httpObj.httpPost(apiList['getMetadataTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据资产目录
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAssetsTree(params = {}) {
    const data = await httpObj.httpPost(apiList['getAssetsTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据源列表数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSourceList(params = {}) {
    const data = await httpObj.httpGet(apiList['sourceList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源列表任务数量获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSourceTaskCountList(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceTaskCountList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源列表任务详情获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSourceTaskList(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceTaskList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 保存采集任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function saveDataCollection(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDataCollectionJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTaskJobList(params = {}) {
    const data = await httpObj.httpPost(apiList['taskJobList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 取消调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postDeleteTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 批量取消调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postDeleteBatchTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteBatchTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 执行调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postRunTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['runTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 批量执行调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postRunBatchTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['runBatchTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 改变调度任务状态
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postChangeTaskJobStatus(params = {}) {
    const data = await httpObj.httpPost(apiList['changeTaskJobStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 批量改变调度任务状态
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postChangeBatchTaskJobStatus(params = {}) {
    const data = await httpObj.httpPost(apiList['changeBatchTaskJobStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 更新调度任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postUpdateTaskJob(params = {}) {
    const data = await httpObj.httpPost(apiList['updateTaskJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取采集日志
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTaskList(params = {}) {
    const data = await httpObj.httpPost(apiList['taskList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取采集日志详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTaskLogList(params = {}) {
    const data = await httpObj.httpPost(apiList['taskLogList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除采集日志
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postDeleteTask(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteTaskList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除数据源相关任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postDeleteJobByBusiness(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteJobByBusiness'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取采集任务禁用类型
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function datasourceSupport(params = {}) {
    const data = await httpObj.httpGet(apiList['datasourceSupport'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 链接数据库api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function connectDataSource(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceConnect'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 链接数据库api Sim
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function connectDataSourceSim(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceConnectSim'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 链接数据库api之后 获取数据库
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDataSourcedDatabase(params = {}) {
    const data = await httpObj.httpPost(apiList['getDataSourcedDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 测试SQL是否有效
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function datasourceSqltest(params = {}) {
    const data = await httpObj.httpPost(apiList['datasourceSqltest'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源添加修改api(新的)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addSourceNew(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据源添加修改api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addSource(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源数据库及表信息接口（源头数据）
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSourceData(params = {}) {
    const data = await httpObj.httpPost(apiList['getsourcedata'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源名称唯一性检测接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function dataSourceCheck(params = {}) {
    const data = await httpObj.httpPost(apiList['datasourcecheck'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据源删除api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delSource(params = {}) {
    const data = await httpObj.httpPost(apiList['sourceDel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据源表信息本地保存接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function localsave(params = {}) {
    const data = await httpObj.httpPost(apiList['localSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * DM管理页面关系图数据接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function relationList(params = {}) {
    const data = await httpObj.httpPost(apiList['relationList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 关系编辑保存接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function relationSave(params = {}) {
    const data = await httpObj.httpPost(apiList['relationSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 关系删除接口：
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function relationDel(params = {}) {
    const data = await httpObj.httpPost(apiList['relationDel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 术语生成接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function createTerm(params = {}) {
    const data = await httpObj.httpPost(apiList['createTerm'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 加载数据表回显表接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function loadSheet(params = {}) {
    const data = await httpObj.httpPost(apiList['loadSheet'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/* #########################数据表管理START################################# */
// /**
//  * 数据表搜索api
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function getTableList(params = {}) {
//     const data = await httpObj.httpPost(apiList['tableSearch'], params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }

/**
 * 数据表删除api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function tableDel(params = {}) {
    const data = await httpObj.httpPost(apiList['tableDel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// /**
//  * 数据表修改api
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function tableEdit(params = {}) {
//     const data = await httpObj.httpPost(apiList['tableEdit'], params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }

/**
 * 数据表审核api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function tableCheck(params = {}) {
    const data = await httpObj.httpPost(apiList['tableCheck'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表外键数据api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function foreignkeys(params = {}) {
    const data = await httpObj.httpPost(apiList['foreignkeys'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// /**
//  * 更新字段接口api
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function updateField(params = {}) {
//     const data = await httpObj.httpPost(apiList['updateField'], params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }

// /**
//  * 更新字段接口api
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function insertField(params = {}) {
//     const data = await httpObj.httpPost(apiList['insertField'], params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }
/* #########################数据表管理END################################# */

/* #########################字段管理START################################# */
// /**
//  * 字段搜索接口
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function fieldSearch(params = {}) {
//     const data = await httpObj.httpPost(apiList['fieldSearch'], params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }
/**
 * 字段修改接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function fieldEdit(params = {}) {
    const data = await httpObj.httpPost(apiList['fieldEdit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/* #########################字段管理END################################# */

/* #########################逻辑主体管理START################################# */
/**
 * 新增主体接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function entityCreate(params = {}) {
    const data = await httpObj.httpPost(apiList['entityCreate'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 修改主体接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function entityModify(params = {}) {
    const data = await httpObj.httpPost(apiList['entityModify'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 搜索主体接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function entitySearch(params = {}) {
    const data = await httpObj.httpPost(apiList['entitySearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除主体接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function entityDel(params = {}) {
    const data = await httpObj.httpPost(apiList['entityDel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/* #########################逻辑主体管理END################################# */

/* #########################新的元数据START################################# */

/**
 * 获取元数据树形列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function metadataTree(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadataTree', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取任务信息列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/job', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 添加任务接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/job', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 更新任务接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function updateJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/job/updateJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 切换状态接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function exchangeState(params = {}) {
    const data = await sendPost('/quantchiAPI/api/job/exchangeState', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除任务接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/deleteJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 立即执行任务接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function execJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/execJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据表搜索api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableList(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/table/searchTable', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 字段搜索接口
 * @param  {Object} [params={}] [description]
 */
export async function fieldSearch(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/field/searchField', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表修改api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function tableEdit(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/table/editTable', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 插入对比Job
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function insertDiffJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff/insertDiffJob', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取所有的版本
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAllVersion(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff/getAllVersion', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取所有的版本
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDiffVersion(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff/diffVersion', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 发布版本
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function updateVerInfo(params = {}) {
    const data = await sendPost('/quantchiAPI/api/updateVerInfo', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 同一个数据源比对详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function schemaDiff(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 不同数据源比对详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function schemaDiffByJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiffByJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 不同数据源比对详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function subSchemaDiffByJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/subSchemaDiffByJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除元数据比对任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function schemaDeleteJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff/deleteJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取查询元数据比对任务
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAllJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/schemaDiff/getAllJob', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据版本更新
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function updateMetaVerInfo(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metaVerInfo', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取元数据版本历史表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getMetaVerInfo(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metaVerInfo', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取查询元数据抽取任务列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function extractorJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/extractorJob', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除元数据抽取任务历史
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delExtractorJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/extractorJob/del', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取元数据抽取任务日志
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function extractLog(params = {}) {
    const data = await sendPost('/quantchiAPI/api/extractLog', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取元数据抽取任务日志(仿真)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function extractLogSim(params = {}) {
    const data = await sendPost('/quantchiAPI/api/simExtractLog', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘分析 通过fieldName和datasourceId
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function upstream(params = {}) {
    const data = await sendPost('/quantchiAPI/api/physicalLineage/upstream', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 血缘分析 通过字段id
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function upstreamByFieldId(params = {}) {
    const data = await sendPost('/quantchiAPI/api/physicalLineage/upstreamByFieldId', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 影响分析 通过fieldName和datasourceId
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function downstream(params = {}) {
    const data = await sendPost('/quantchiAPI/api/physicalLineage/downstream', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 影响分析 通过字段id
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function downstreamByFieldId(params = {}) {
    const data = await sendPost('/quantchiAPI/api/physicalLineage/downstreamByFieldId', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取任务信息列表（手动采集列表）
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getManualJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/getManualJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 添加任务接口（添加手动采集）
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addManualJob(params = {}) {
    let formData = new FormData()

    if (params.uploadfile != undefined) {
        formData.append('file', params.uploadfile)
        delete params.uploadfile
    }

    _.map(params, (v, k) => {
        formData.append(k, v)
    })

    const data = await sendPost('/quantchiAPI/api/manualJob', 'post', formData, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除手动任务接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteManualJob(params = {}) {
    const data = await sendPost('/quantchiAPI/api/deleteManualJob', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 新增字段接口api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function insertField(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/field/insertField', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 修改字段接口api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function updateField(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/field/updateField', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除字段接口api
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteField(params = {}) {
    const data = await sendPost('/quantchiAPI/api/metadata/field/deleteField', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取物理层关系图
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getRelationData(params = {}) {
    const data = await httpObj.httpGet(apiList['model'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取展开数据 -model
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getExpandData(params = {}) {
    const data = await httpObj.httpPost(apiList['field'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取展开数据 -field
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getExpandDataField(params = {}) {
    const data = await httpObj.httpPost(apiList['fieldLineageField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据地图
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDataMapData(params = {}) {
    const data = await httpObj.httpGet(apiList['dataMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据地图展开数据接口 -field
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getExpandDataMapField(params = {}) {
    const data = await httpObj.httpPost(apiList['expandDataMapField'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取物理层血缘
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function fieldLineage(params = {}) {
    const data = await httpObj.httpGet(apiList['fieldLineage'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取检核结果
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getJobResult(params = {}) {
    const data = await httpObj.httpGet(`${apiList['jobResult']}${params.id}`)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取任务检核列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getJobHistory(params = {}) {
    const data = await httpObj.httpPost(apiList['jobHistory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取血缘抽取任务列表或者按条件检索列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getLineageExtractjob(params = {}) {
    const data = await httpObj.httpGet(apiList['getLineageExtractjob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取单个血缘抽取任务详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSingleExtractjob(id, params = {}) {
    const data = await httpObj.httpGet(`${apiList['getSingleExtractjob']}${id}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增或者修改血缘抽取任务信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function postLineageExtractjob(params = {}) {
    let formData = new FormData()

    if (params.uploadfile != undefined) {
        _.map(params.uploadfile, (item, key) => {
            formData.append('file', item)
        })
        delete params.uploadfile
    }

    _.map(params, (v, k) => {
        formData.append(k, v)
    })
    const data = await httpObj.httpPost(apiList['postLineageExtractjob'], formData)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 下载上传的文件
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function fileDownload(params = {}) {
    // window.open(`${apiList['fileDownload']}${params.id}/download`, '_self')

    httpObj.httpGetDownload(`${apiList['fileDownload']}${params.id}/download`, params)
    return
}
/**
 * 执行任务分析(多个文件，与getSingleExtractjob公用一个url)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function executeAll(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getSingleExtractjob']}${params.id}/execute`)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 执行文件分析(单个文件，与fileDownload公用一个url)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function executeSingle(params = {}) {
    const data = await httpObj.httpPost(`${apiList['fileDownload']}execute`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 表关联度高频接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function tableFrequency(params = {}) {
    const data = await httpObj.httpGet(apiList['tableFrequency'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 字段关联度高频接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function fieldFrequency(params = {}) {
    const data = await httpObj.httpGet(apiList['fieldFrequency'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据浏览-血缘分析-g6 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function lineageUpStream(params = {}) {
    const data = await httpObj.httpPost(apiList['lineageUpStream'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据浏览-血缘分析-g6 接口     数据源
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function lineageDatasource(params = {}) {
    const data = await httpObj.httpPost(`${apiList['lineageDatasource']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function lineageDatabase(params = {}) {
    const data = await httpObj.httpPost(`${apiList['lineageDatabase']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function lineageTable(params = {}) {
    const data = await httpObj.httpGet(`${apiList['lineageTable']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postLineageTable(params = {}) {
    const data = await httpObj.httpPost(`${apiList['lineageTable']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function lineageColumn(params = {}) {
    const data = await httpObj.httpPost(`${apiList['lineageColumn']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function lineageList(params = {}) {
    const data = await httpObj.httpGet(`${apiList['lineageList']}${params.direction}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据浏览-影响分析-g6 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function lineageDownStream(params = {}) {
    const data = await httpObj.httpGet(apiList['lineageDownStream'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据浏览-join分析-g6 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function joinRelation(params = {}) {
    const data = await httpObj.httpGet(apiList['joinRelation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 元数据高级-变更管理-最近变更 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getLatestDiff(params = {}) {
    const data = await httpObj.httpGet(apiList['getLatestDiff'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 元数据高级-变更管理-添加订阅 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addSubscription(params = {}) {
    const data = await httpObj.httpPost(apiList['addSubscription'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 元数据高级-变更管理-更新订阅 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function updateSubscription(params = {}) {
    const data = await httpObj.httpPost(apiList['updateSubscription'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 元数据高级-变更管理-订阅信息列表 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getAllSubscription(params = {}) {
    const data = await httpObj.httpPost(apiList['getAllSubscription'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 元数据高级-变更管理-订阅详情 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSubscriptionDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['getSubscriptionDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 元数据高级-变更管理-删除订阅 接口     字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteSubscription(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteSubscription'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 字段升级标准
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function upgradeField(params = {}) {
    const data = await httpObj.httpPost(apiList['upgradeField'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 字段升级到标准 申请中的列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function standardApplying(params = {}) {
    const data = await httpObj.httpGet(apiList['standardApplying'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据库列表(数据源详情查看数据库列表时用)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDatabaseList(params = {}) {
    const data = await httpObj.httpGet(apiList['getDatabaseInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据库单个信息(数据库详情)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDatabaseInfo(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getDatabaseInfo']}/${params.id}`)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取数据库树形列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function metadataDBTree(params = {}) {
    const data = await httpObj.httpGet(`${apiList['metadataDBTree']}`)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取元数据树形列表(带分页)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function metadataTreeWithPaging(params = {}) {
    const data = await httpObj.httpGet(`${apiList['metadataTreeWithPaging']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function modelTreeWithPaging(params = {}) {
    const data = await httpObj.httpGet(`${apiList['metadataTreeWithPaging']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 删除元数据分类树节点
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteMetadataTree(params = {}) {
    const data = await httpObj.httpPost(`${apiList['deleteMetadataTree']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 编辑元数据分类树节点
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function editMetadataTree(params = {}) {
    const data = await httpObj.httpPost(`${apiList['editMetadataTree']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取码表系统列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getCodeSystemConf(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getCodeSystemConf']}`, params)
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
export async function getMetadataCodeValue(params = {}) {
    const data = await httpObj.httpGet(apiList['metadataCodeValue'], params)
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
export async function postMetadataCodeValue(params = {}) {
    const data = await httpObj.httpPost(apiList['metadataCodeValue'], params)
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
export async function deleteMetadataCodeValue(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteMetadataCodeValue'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取单条元数据代码项
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getMetadataCodeItem(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getMetadataCodeItem']}${params.id}`)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增或修改元数据代码项
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function postMetadataCodeItem(params = {}) {
    const data = await httpObj.httpPost(apiList['getMetadataCodeItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取元数据代码值到标准代码值映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function metadataCodeValueMap(params = {}) {
    const data = await httpObj.httpGet(apiList['metadataCodeValueMap'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取元数据代码项 树
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function metadataCodeValueTree(params = {}) {
    const data = await httpObj.httpGet(apiList['metadataCodeValueTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 批量添加代码项映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardCodeValueMapBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['standardCodeValueMapBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 批量删除代码项映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardCodeValueMapDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['standardCodeValueMapDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取代码项映射列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeValueMapList(params = {}) {
    const data = await httpObj.httpGet(apiList['codeValueMapList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取表筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getTableFilterRule(params = {}) {
    const data = await httpObj.httpGet(apiList['tableFilterRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增表筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function postTableFilterRule(params = {}) {
    const data = await httpObj.httpPost(apiList['tableFilterRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除表筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function tableFilterRuleDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['tableFilterRuleDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取字段筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getFieldFilterRule(params = {}) {
    const data = await httpObj.httpGet(apiList['columnFilterRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 新增字段筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function postFieldFilterRule(params = {}) {
    const data = await httpObj.httpPost(apiList['columnFilterRule'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 删除字段筛选规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fieldFilterRuleDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['columnFilterRuleDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源summary
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function dsGovernanceSummary(params = {}) {
    const data = await httpObj.httpGet(apiList['dsGovernanceSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 字段治理summary
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fdGovernanceSummary(params = {}) {
    const data = await httpObj.httpGet(apiList['fdGovernanceSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 表治理summary
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function tbGovernanceSummary(params = {}) {
    const data = await httpObj.httpGet(apiList['tbGovernanceSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源summary - 未治理
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function governanceDsUndo(params = {}) {
    const data = await httpObj.httpGet(apiList['governanceDsUndo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源summary - 治理中
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function governanceDsDoing(params = {}) {
    const data = await httpObj.httpGet(apiList['governanceDsDoing'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源summary - 开始治理
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function goGovernanceDsDoing(params = {}) {
    const data = await httpObj.httpPost(apiList['governanceDsDoing'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 数据源summary - 治理完成
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function governanceDsDone(params = {}) {
    const data = await httpObj.httpGet(apiList['governanceDsDone'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 字段治理list
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fdGovernanceList(params = {}) {
    let data
    if (params.status) {
        data = await httpObj.httpPost(`${apiList['fdGovernanceList']}${params.status || ''}`, params)
    } else {
        data = await httpObj.httpGet(`${apiList['fdGovernanceList']}`, params)
    }
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 字段全部过滤
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fdGovernanceListFilterAll(params = {}) {
    let data = await httpObj.httpPost(`${apiList['fdGovernanceList']}filterall`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 表治理list
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function tbGovernanceList(params = {}) {
    let data
    if (params.status) {
        data = await httpObj.httpPost(`${apiList['tbGovernanceList']}${params.status || ''}`, params)
    } else {
        data = await httpObj.httpGet(`${apiList['tbGovernanceList']}`, params)
    }

    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 表全部过滤
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function tbGovernanceListFilterAll(params = {}) {
    let data = await httpObj.httpPost(`${apiList['tbGovernanceList']}filterall`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 下载字段治理list
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function fdGovernanceListDownload(params = {}) {
    httpObj.httpPostDownload(`${apiList['fdGovernanceList']}${params.status || ''}/download/`, params)
    return
    // window.open(`${apiList['fdGovernanceList']}${params.status || ''}/download/?status=${params.status}&datasourceId=${params.datasourceId}`, '_self')
}
/**
 * 下载表治理list
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function tbGovernanceListDownload(params = {}) {
    httpObj.httpPostDownload(`${apiList['tbGovernanceList']}${params.status || ''}/download/`, params)
    return
    // window.open(`${apiList['tbGovernanceList']}${params.status || ''}/download/?status=${params.status}&datasourceId=${params.datasourceId}`, '_self')
}
/**
 * 主题列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function standardDomain(params = {}) {
    const data = await httpObj.httpGet(`${apiList['standardDomain']}${params.status || ''}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 修改状态或过滤原因
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function governance(params = {}) {
    const data = await httpObj.httpPost(`${apiList['governance']}${params.type}`, params.arr)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 修改字段的推荐信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function columnGovernanceRecommend(params = {}) {
    const data = await httpObj.httpPost(apiList['governanceColumnRecommend'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据表详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['tableDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function recommendBatch(params = {}) {
    const data = await httpObj.httpPost(apiList['recommendBatch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// /**
//  * 根据代码项id获取代码值diff
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}            [description]
//  */
// export async function codeValueDiff(params = {}) {
//     const data = await httpObj.httpGet(`${apiList['codeValueDiff']}`, params)
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }

/**
 * 代码项引用字段
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeItemRef(params = {}) {
    const data = await httpObj.httpGet(`${apiList['codeItemRef']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function cdGovernanceSummary(params = {}) {
    const data = await httpObj.httpGet(apiList['cdGovernanceSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function cdGovernanceList(params = {}) {
    const data = await httpObj.httpGet(`${apiList['cdGovernanceList']}${params.status ? params.status : ''}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export function cdGovernanceListDownload(params = {}) {
    // window.open(`${apiList['cdGovernanceList']}${params.status ? params.status : ''}/download?${qs.stringify(params)}`, '_self')

    httpObj.httpGetDownload(`${apiList['cdGovernanceList']}${params.status ? params.status : ''}/download?${qs.stringify(params)}`, params)
    return
}
/**
 * 内置规则执行(针对重复表)
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function innerRuleExec(params = {}) {
    const data = await httpObj.httpPost(apiList['innerRuleExec'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
/**
 * 获取内置规则
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getInnerRule(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getInnerRule']}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 内置规则文件上传
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function innerRuleFileUpload(params = {}) {
    const data = await httpObj.httpPost(apiList['innerRuleFileUpload'], formData(params))
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 码值管理-码值列表接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function codeItemStatistics(params = {}) {
    const data = await httpObj.httpGet(apiList['codeItemStatistics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 码值管理-码值列表导出接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function codeItemExport(params = '') {
    // window.open(`${apiList['codeItemExport']}${params}`, '_self')
    httpObj.httpGetDownload(`${apiList['codeItemExport']}${params}`, params)
    return
}
export async function governanceCodeRecommend(params = {}) {
    const data = await httpObj.httpPost(apiList['governanceCodeRecommend'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取元数据代码项
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getMetadataCodeItemList(params = {}) {
    const data = await httpObj.httpGet(apiList['getMetadataCodeItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 获取元数据代码项导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeValueExport(params = {}) {
    // window.open(`${apiList['codeValueExport']}${params}`, '_self')

    httpObj.httpGetDownload(`${apiList['codeValueExport']}${params}`, params)
    return
}
/**
 * 代码项列表数据源、数据库接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeItemDatasource(params = {}) {
    const data = await httpObj.httpGet(apiList['codeItemDatasource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 规则管理 新增规则 技术信息 中 根据数据库搜数据表（不用原来的搜表接口）
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function listTableByDatabaseId(params = {}) {
    const data = await httpObj.httpGet(apiList['listTableByDatabaseId'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 首页信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function systemHomePage(params = {}) {
    const data = await httpObj.httpGet(apiList['systemHomePage'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 首页右下部分
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function statisticsChinesize(params = {}) {
    const data = await httpObj.httpGet(apiList['statisticsChinesize'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
/**
 * 中文含义统计
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function systemStatistics(params = {}) {
    const data = await httpObj.httpPost(apiList['systemStatistics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 数据源导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function dataSourceDownload(id) {
    // window.open(`${apiList['dataSourceDownload']}?datasourceId=${id}`, '_blank')

    httpObj.httpGetDownload(apiList['dataSourceDownload'], {
        datasourceId: id,
    })
    return
}

/**
 * 删除代码项
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function codeItemDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['codeItemDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取字典据源系统下的系统
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDictSys(params = {}) {
    const data = await httpObj.httpPost(apiList['getDictSys'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取系统下的数据库
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getSysDatabase(params = {}) {
    const data = await httpObj.httpPost(apiList['getSysDatabase'], params)
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
export async function getFieldDiffDownload(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['fieldDiffDownload'] + '?' + params, '_self')
    httpObj.httpPostDownload(apiList['fieldDiffDownload'], params)
    return
}

/**
 * 变更所有字段信息导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getFieldDiffDownloadAll(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['fieldDiffDownloadAll'] + '?' + params, '_self')
    httpObj.httpPostDownload(apiList['fieldDiffDownloadAll'], params)
    return
}

/**
 * 推送记录获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getSubscribiePushListData(params = {}) {
    const data = await httpObj.httpPost(apiList['getSubscribiePushList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 推送确认
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function subscribiePushOptRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['subscribiePushOptRecord'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 重新推送
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function subscribiePushRepush(params = {}) {
    const data = await httpObj.httpPost(apiList['subscribiePushRepush'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/* #########################新的元数据END################################# */

/**
 * 血缘分析导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getUpstreamDownload(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['upstreamDownload'] + '?' + params, '_self')
    httpObj.httpGetDownload(apiList['upstreamDownload'], params)
    return
}

/**
 * 影响分析导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDownstreamDownload(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['downstreamDownload'] + '?' + params, '_self')
    httpObj.httpGetDownload(apiList['downstreamDownload'], params)
    return
}

/**
 * 血缘关系，表依赖关系
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDependencyList(params = {}) {
    const data = await httpObj.httpGet(apiList['dependencyList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘关系，表依赖关系
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getSuggestList(params = {}) {
    const data = await httpObj.httpGet(apiList['dependSuggestList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 依赖关系导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function downloadCurrent(params = '') {
    // let paramsStr = ""
    // _.map(params, (v, k) => {
    //     paramsStr +=
    // })

    // window.open(apiList['downloadCurrent'] + '?' + params, '_self')
    httpObj.httpGetDownload(apiList['downloadCurrent'], params)
    return
}

/**
 * 标准化统计数据
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getStandardSummary(params = {}) {
    const data = await httpObj.httpGet(apiList['standardSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 统计数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getDataSummary(params) {
    const data = await httpObj.httpPost(apiList['totalByTagsSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 统计数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getTaskSummary(params) {
    const data = await httpObj.httpGet(apiList['taskSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取网关list
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getCollectNetwork(params) {
    const data = await httpObj.httpGet(apiList['getCollectNetwork'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 通过业务ID更新任务调度信息
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function updateTaskJobByBusiness(params) {
    const data = await httpObj.httpPost(apiList['updateTaskJobByBusiness'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘维护，分支关系获取
 * @param {} params
 */
export async function getExtractjobLineageInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['extractjobLineageInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 字段详情\表详情字段下拉框
 * @param {*} path
 * @param {*} params
 */
export async function getSchemaDiffFieldList(path, params = {}) {
    const data = await httpObj.httpPost(`${apiList['extractSchemaDiff']}${path}`, params)
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
export async function getSchemaDiffLineagesList(params = {}) {
    const data = await httpObj.httpPost(`${apiList['schemaDiffLineages']}`, params)
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
export async function getSchemaDiffLineagesFieldList(path, params = {}) {
    const data = await httpObj.httpPost(`${apiList['schemaDiffLineagesSelects']}${path}`, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘变更所有字段信息导出
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getSchemaDiffLineagesDownload(params = '') {
    httpObj.httpPostDownload(apiList['schemaDiffLineagesDownload'], params)
    return
}

/**
 * 全链路分析下钻 LIST 接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getLineageBidirectionList(params) {
    const data = await httpObj.httpGet(apiList['getLineageBidirection'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 表全链路分析下钻 LIST 接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getTableBidirectionList(params) {
    const data = await httpObj.httpPost(apiList['getTableBidirection'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 *   字段全链路分析下钻 LIST 接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getColumnBidirectionList(params) {
    const data = await httpObj.httpPost(apiList['getColumnBidirection'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 *   字段全链路分析下钻 LIST 接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}            [description]
 */
export async function getTableRelationServiceList(params) {
    const data = await httpObj.httpGet(apiList['getTableRelationService'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 规范性检查
export async function searchDmTask(params) {
    const data = await httpObj.httpPost(apiList['searchDmTask'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function toggleDmTaskStatus(params) {
    const data = await httpObj.httpGet(apiList['toggleDmTaskStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getRegExFilterConfig(params) {
    const data = await httpObj.httpGet(apiList['getRegExFilterConfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveFilterConfig(params) {
    const data = await httpObj.httpPost(apiList['saveFilterConfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteRegExFilterConfig(params) {
    const data = await httpObj.httpPost(apiList['deleteRegExFilterConfig'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteDmTask(params) {
    const data = await httpObj.httpPost(apiList['deleteDmTask'] + '?id=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function listHistoryTaskResult(params) {
    const data = await httpObj.httpPost(apiList['listHistoryTaskResult'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getChartData(params) {
    const data = await httpObj.httpPost(apiList['getChartData'] + '?taskResultId=' + params.taskResultId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function addOrUpdateDmTask(params) {
    const data = await httpObj.httpPost(apiList['addOrUpdateDmTask'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getDmTaskById(params) {
    const data = await httpObj.httpGet(apiList['getDmTaskById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getResultDetailByTaskResultId(params) {
    const data = await httpObj.httpPost(apiList['getResultDetailByTaskResultId'] + '?taskResultId=' + params.taskResultId)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function downloadTaskResultItem(params = {}) {
    httpObj.httpPostDownload(apiList['downloadTaskResultItem'], params)
    return
}

export async function listTaskResultItem(params) {
    const data = await httpObj.httpPost(apiList['listTaskResultItem'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function filterTable(params) {
    const data = await httpObj.httpGet(apiList['filterTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dsspecification(params) {
    const data = await httpObj.httpGet(apiList['dsspecification'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dsspecificationList(params) {
    const data = await httpObj.httpPost(apiList['dsspecification'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function delDsspecification(params) {
    const data = await httpObj.httpDel(apiList['dsspecification'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dsspecificationDatasource(params) {
    const data = await httpObj.httpGet(apiList['dsspecificationDatasource'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveDsspecification(params) {
    const data = await httpObj.httpPost(apiList['saveDsspecification'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function rootList(params) {
    const data = await httpObj.httpPost(apiList['rootList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function delRoot(params) {
    const data = await httpObj.httpDel(apiList['rootList'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function saveRoot(params) {
    const data = await httpObj.httpPost(apiList['saveRoot'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function batchSaveRoot(params) {
    const data = await httpObj.httpPost(apiList['batchSaveRoot'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function nameExist(params) {
    const data = await httpObj.httpGet(apiList['nameExist'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function descExist(params) {
    const data = await httpObj.httpGet(apiList['descExist'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function templateDownload(params = {}) {
    httpObj.httpGetDownload(apiList['template'], params)
    return
}

export async function rootUpload(params) {
    const data = await httpObj.httpPost(apiList['rootUpload'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function datamodelingTable(params) {
    const data = await httpObj.httpPost(apiList['datamodelingTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function datamodelingTableDetail(params) {
    const data = await httpObj.httpGet(apiList['datamodelingTable'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function delDatamodelingTable(params) {
    const data = await httpObj.httpDel(apiList['datamodelingTable'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function tableDdl(params) {
    const data = await httpObj.httpPost(apiList['tableDdl'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function tableDgdl(params) {
    const data = await httpObj.httpPost(apiList['tableDgdl'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function saveTable(params) {
    const data = await httpObj.httpPost(apiList['saveTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function parseCname(params) {
    const data = await httpObj.httpPost(apiList['parseCname'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function suggestion(params) {
    const data = await httpObj.httpPost(apiList['suggestion'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function tableDataTypes(params) {
    const data = await httpObj.httpGet(apiList['tableDataTypes'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function configLimit(params) {
    const data = await httpObj.httpGet(apiList['configLimit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function codeItemList(params = {}) {
    let paramsStr = ''
    if (params.databaseIdList) {
        params.databaseIdList.map((item, index) => {
            paramsStr += index == 0 ? 'databaseIdList=' + item : '&databaseIdList=' + item
        })
    }
    const data = await httpObj.httpGet(apiList['getMetadataCodeItem'] + '?' + paramsStr + '&page_size=' + params.page_size + '&name=' + params.name)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function configCategory(params) {
    const data = await httpObj.httpGet(apiList['configCategory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function configJoinType(params) {
    const data = await httpObj.httpGet(apiList['configJoinType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function configOrderType(params) {
    const data = await httpObj.httpGet(apiList['configOrderType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function configSpellType(params) {
    const data = await httpObj.httpGet(apiList['configSpellType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function configType(params) {
    const data = await httpObj.httpGet(apiList['configType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchLineageFile(params) {
    const data = await httpObj.httpPost(apiList['searchLineageFile'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function deleteFile(params) {
    const data = await httpObj.httpPost(apiList['deleteFile'] + '?fileId=' + params.fileId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getLineageFileById(params) {
    const data = await httpObj.httpGet(apiList['getLineageFileById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchLineageJobLog(params) {
    const data = await httpObj.httpPost(apiList['searchLineageJobLog'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function deleteLineageByTableId(params) {
    const data = await httpObj.httpPost(apiList['deleteLineageByTableId'] + '?tableId=' + params.tableId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchLineageJob(params) {
    const data = await httpObj.httpPost(apiList['searchLineageJob'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteTask(params) {
    const data = await httpObj.httpPost(apiList['deleteTask'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getJobById(params) {
    const data = await httpObj.httpGet(apiList['getJobById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function downloadBatch(params) {
    httpObj.httpPostDownload(apiList['downloadBatch'], params)
    return
}

export async function facttableDatabase(params) {
    const data = await httpObj.httpGet(apiList['facttableDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function facttableTable(params) {
    const data = await httpObj.httpGet(apiList['facttableTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function timeFormat(params) {
    const data = await httpObj.httpGet(apiList['timeFormat'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function columnForAdd(params) {
    const data = await httpObj.httpGet(apiList['columnForAdd'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function facttableDataTypes(params) {
    const data = await httpObj.httpGet(apiList['facttableDataTypes'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['bizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function classifyFilters(params) {
    const data = await httpObj.httpPost(apiList['classifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizProcess(params) {
    const data = await httpObj.httpPost(apiList['bizProcess'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizDatabase(params) {
    const data = await httpObj.httpPost(apiList['bizDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsSearch(params) {
    const data = await httpObj.httpPost(apiList['factassetsSearch'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsDelete(params) {
    const data = await httpObj.httpDel(apiList['factassetsDelete'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsSave(params) {
    const data = await httpObj.httpPost(apiList['factassetsSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsDetail(params) {
    const data = await httpObj.httpGet(apiList['factassetsDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function facttableDetail(params) {
    const data = await httpObj.httpGet(apiList['facttableDetail'] + params.factTableId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function suggestBizClass(params) {
    const data = await httpObj.httpGet(apiList['suggestBizClass'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function suggestClassify(params) {
    const data = await httpObj.httpGet(apiList['suggestClassify'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function facttableTempSave(params) {
    const data = await httpObj.httpPost(apiList['facttableTempSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveAndGenerateAssets(params) {
    const data = await httpObj.httpPost(apiList['saveAndGenerateAssets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function normalColumns(params) {
    const data = await httpObj.httpPost(apiList['normalColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function partitionColumns(params) {
    const data = await httpObj.httpGet(apiList['partitionColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function detailForEdit(params) {
    const data = await httpObj.httpGet(apiList['detailForEdit'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function statisticalperiod(params) {
    const data = await httpObj.httpPost(apiList['statisticalperiod'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function deleteStatisticalperiod(params) {
    const data = await httpObj.httpDel(apiList['statisticalperiod'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function statisticalperiodDetail(params) {
    const data = await httpObj.httpGet(apiList['statisticalperiod'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveStatisticalperiod(params) {
    const data = await httpObj.httpPost(apiList['saveStatisticalperiod'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function periodExample(params) {
    const data = await httpObj.httpPost(apiList['periodExample'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizLimit(params) {
    const data = await httpObj.httpPost(apiList['bizLimit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function bizLimitDetail(params) {
    const data = await httpObj.httpGet(apiList['bizLimit'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function deleteBizLimit(params) {
    const data = await httpObj.httpDel(apiList['bizLimit'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function bizLimitBizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['bizLimitBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizLimitClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['bizLimitClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function bizLimitEditDetail(params) {
    const data = await httpObj.httpGet(apiList['bizLimitEditDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveBizLimit(params) {
    const data = await httpObj.httpPost(apiList['saveBizLimit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function searchBizLimit(params) {
    const data = await httpObj.httpPost(apiList['searchBizLimit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function matchBizLimit(params) {
    const data = await httpObj.httpPost(apiList['matchBizLimit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizLimitQuickTip(params) {
    const data = await httpObj.httpPost(apiList['bizLimitQuickTip'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizAssets(params) {
    const data = await httpObj.httpPost(apiList['bizAssets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizClassifyTree(params) {
    const data = await httpObj.httpGet(apiList['bizClassifyTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function simpleBizAssets(params) {
    const data = await httpObj.httpPost(apiList['simpleBizAssets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsSummary(params) {
    const data = await httpObj.httpPost(apiList['metricsSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsSummaryDetail(params) {
    const data = await httpObj.httpGet(apiList['metricsSummary'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function SummaryBizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['SummaryBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function SummaryClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['SummaryClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsProcess(params) {
    const data = await httpObj.httpGet(apiList['metricsProcess'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsProcessFilters(params) {
    const data = await httpObj.httpGet(apiList['metricsProcessFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function summaryMetrics(params) {
    const data = await httpObj.httpPost(apiList['summaryMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function summaryDetailForEdit(params) {
    const data = await httpObj.httpGet(apiList['summaryDetailForEdit'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveSummaryMetrics(params) {
    const data = await httpObj.httpPost(apiList['saveSummaryMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function summaryMetricsDetail(params) {
    const data = await httpObj.httpGet(apiList['summaryMetricsDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function assetsBizModuleAndTheme(params) {
    const data = await httpObj.httpGet(apiList['assetsBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function assetsClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['assetsClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function assetsMetricsSummary(params) {
    const data = await httpObj.httpPost(apiList['assetsMetricsSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function summaryMetricsEtlDownload(params = {}) {
    httpObj.httpGetDownload(apiList['summaryMetricsEtlDownload'], params)
    return
}

export async function releaseMetricsSummary(params) {
    const data = await httpObj.httpGet(apiList['releaseMetricsSummary'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function versionFilter(params) {
    const data = await httpObj.httpGet(apiList['versionFilter'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function summaryMetricColumns(params) {
    const data = await httpObj.httpPost(apiList['summaryMetrics'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function metricsSummaryDateColumn(params) {
    const data = await httpObj.httpPost(apiList['metricsSummaryDateColumn'] + '?summaryId=' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function unreleaseDetail(params) {
    const data = await httpObj.httpGet(apiList['unreleaseDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function releaseHistory(params) {
    const data = await httpObj.httpGet(apiList['releaseHistory'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtable(params) {
    const data = await httpObj.httpPost(apiList['dimtable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableBizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['dimtableBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['dimtableClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableTypes(params) {
    const data = await httpObj.httpPost(apiList['dimtableTypes'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableDatabase(params) {
    const data = await httpObj.httpPost(apiList['dimtableDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableDelete(params) {
    const data = await httpObj.httpDel(apiList['dimtableDelete'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function dimtableDetail(params) {
    const data = await httpObj.httpGet(apiList['dimtableDelete'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableNormalColumns(params) {
    const data = await httpObj.httpPost(apiList['dimtableNormalColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function dimtablePartitionColumns(params) {
    const data = await httpObj.httpGet(apiList['dimtablePartitionColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableSuggestBizClass(params) {
    const data = await httpObj.httpGet(apiList['dimtableSuggestBizClass'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableSuggestClassify(params) {
    const data = await httpObj.httpGet(apiList['dimtableSuggestClassify'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function dimtableDatabaseList(params) {
    const data = await httpObj.httpGet(apiList['dimtableDatabaseList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableTable(params) {
    const data = await httpObj.httpGet(apiList['dimtableTable'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableColumnForAdd(params) {
    const data = await httpObj.httpGet(apiList['dimtableColumnForAdd'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableDataTypes(params) {
    const data = await httpObj.httpGet(apiList['dimtableDataTypes'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableEnglishNamePrefix(params) {
    const data = await httpObj.httpGet(apiList['dimtableEnglishNamePrefix'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableTimeFormat(params) {
    const data = await httpObj.httpGet(apiList['dimtableTimeFormat'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableSaveAndGenerateAssets(params) {
    const data = await httpObj.httpPost(apiList['dimtableSaveAndGenerateAssets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimtableEditDetail(params) {
    const data = await httpObj.httpGet(apiList['dimtableEditDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassets(params) {
    const data = await httpObj.httpPost(apiList['dimassets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsBizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['dimassetsBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['dimassetsClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsDatabase(params) {
    const data = await httpObj.httpPost(apiList['dimassetsDatabase'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsDelete(params) {
    const data = await httpObj.httpDel(apiList['dimassets'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsDetail(params) {
    const data = await httpObj.httpGet(apiList['dimassets'] + '/' + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsNormalColumns(params) {
    const data = await httpObj.httpPost(apiList['dimassetsNormalColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsModelFilter(params) {
    const data = await httpObj.httpGet(apiList['dimassetsModelFilter'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsSourceFilter(params) {
    const data = await httpObj.httpGet(apiList['dimassetsSourceFilter'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsPartitionColumns(params) {
    const data = await httpObj.httpGet(apiList['dimassetsPartitionColumns'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsDetailForEdit(params) {
    const data = await httpObj.httpGet(apiList['dimassetsDetailForEdit'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsSave(params) {
    const data = await httpObj.httpPost(apiList['dimassetsSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsInternalColumn(params) {
    const data = await httpObj.httpGet(apiList['dimassetsInternalColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsInternalDelete(params) {
    const data = await httpObj.httpPost(apiList['dimassetsInternalDelete'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsInternalInfo(params) {
    const data = await httpObj.httpPost(apiList['dimassetsInternalInfo'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsRelateAssets(params) {
    const data = await httpObj.httpGet(apiList['dimassetsRelateAssets'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dimassetsRelationSave(params) {
    const data = await httpObj.httpPost(apiList['dimassetsRelationSave'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function belongFactsBizModuleAndTheme(params) {
    const data = await httpObj.httpPost(apiList['belongFactsBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function belongFactsClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['belongFactsClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function belongFactsBizProcess(params) {
    const data = await httpObj.httpPost(apiList['belongFactsBizProcess'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function belongFacts(params) {
    const data = await httpObj.httpPost(apiList['belongFacts'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsModelFilter(params) {
    const data = await httpObj.httpGet(apiList['factassetsModelFilter'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsSourceFilter(params) {
    const data = await httpObj.httpGet(apiList['factassetsSourceFilter'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function factassetsRelateBiz(params) {
    const data = await httpObj.httpGet(apiList['factassetsRelateBiz'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function datasourceDefine(params) {
    const data = await httpObj.httpPost(apiList['datasourceDefine'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function internalTableRelation(params) {
    const data = await httpObj.httpGet(apiList['internalTableRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function dimtableColumn(params = {}) {
    let paramsStr = '?tableId=' + params.tableId
    if (params.ignoreColumnIds) {
        params.ignoreColumnIds.map((item, index) => {
            paramsStr += '&ignoreColumnIds=' + item
        })
    }
    const data = await httpObj.httpGet(apiList['dimtableColumn'] + paramsStr)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function verticalDimColumn(params) {
    const data = await httpObj.httpPost(apiList['verticalDimColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getTaskDetail(params) {
    const data = await httpObj.httpGet(apiList['getTaskDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getExternalCount(params) {
    const data = await httpObj.httpGet(apiList['getExternalCount'] + '?categoryId=' + params.categoryId)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function categoryTree(params) {
    const data = await httpObj.httpGet(apiList['categoryTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function reportsLevel(params) {
    const data = await httpObj.httpGet(apiList['reportsLevel'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function externalEdit(params) {
    const data = await httpObj.httpPost(apiList['externalEdit'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function externalTypes(params) {
    const data = await httpObj.httpGet(apiList['externalTypes'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function releaseBusiness(params) {
    const data = await httpObj.httpPost(apiList['releaseBusiness'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessBizModuleAndTheme(params) {
    const data = await httpObj.httpGet(apiList['businessBizModuleAndTheme'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessClassifyFilters(params) {
    const data = await httpObj.httpPost(apiList['businessClassifyFilters'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessPublish(params) {
    const data = await httpObj.httpGet(apiList['businessPublish'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizAssetsDetail(params) {
    const data = await httpObj.httpGet(apiList['bizAssetsDetail'] + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessNormalColumn(params) {
    const data = await httpObj.httpPost(apiList['businessNormalColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessColumnType(params) {
    const data = await httpObj.httpGet(apiList['businessColumnType'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function businessPatitionColumn(params) {
    const data = await httpObj.httpGet(apiList['businessPatitionColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function bizAssetsPreview(params) {
    const data = await httpObj.httpGet(apiList['bizAssetsPreview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function datasourceListForQuery(params) {
    const data = await httpObj.httpGet(apiList['datasourceListForQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function systemmenuList(params) {
    const data = await httpObj.httpPost(apiList['systemmenuList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function systemmenuDivide(params) {
    const data = await httpObj.httpGet(apiList['systemmenuDivide'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dataDistributionDetail(params) {
    const data = await httpObj.httpGet(apiList['dataDistributionDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getAllRemoteFuncWithParams(params) {
    const data = await httpObj.httpGet(apiList['getAllRemoteFuncWithParams'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 数据源发现
export async function datasourceDiscover(params) {
    const data = await httpObj.httpPost(apiList['datasourceDiscover'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}


export async function getDatasourceById(params) {
    const data = await httpObj.httpGet(apiList['getDatasourceById'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function discoverLog(params) {
    const data = await httpObj.httpPost(apiList['discoverLog'] + params.desc, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function discoverConfig(params) {
    const data = await httpObj.httpGet(apiList['discoverConfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function saveDiscoverConfig(params) {
    const data = await httpObj.httpPost(apiList['saveDiscoverConfig'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function discoverConfigStatus(params) {
    const data = await httpObj.httpGet(apiList['discoverConfigStatus'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function discoverDefault(params) {
    const data = await httpObj.httpGet(apiList['discoverDefault'] + params.id, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function discoverExecute(params) {
    const data = await httpObj.httpGet(apiList['discoverExecute'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function dsMap(params) {
    const data = await httpObj.httpGet(apiList['dsMap'] + params.id, params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function querySystemOverview(params) {
    const data = await httpObj.httpGet(apiList['querySystemOverview'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}