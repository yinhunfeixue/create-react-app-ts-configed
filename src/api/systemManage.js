import {
    httpObj
} from './base'

import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['systemManage']
const connectWho = 'dmpTestServer'

export async function logAuditTable(params = {}) {
    const data = await httpObj.httpGet(apiList['auditLog'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function auditOperation(params = {}) {
    const data = await httpObj.httpGet(apiList['auditOperation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 删除消息
export async function deleteMessage(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteMessage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 标记已读
export async function readMessage(params = {}) {
    const data = await httpObj.httpPost(apiList['readMessage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 消息中心获取信息
export async function getMsgcenter(params = {}) {
    const data = await httpObj.httpGet(apiList['msgcenter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 消息中心获取信息
export async function getMsgDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['msgDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 消息中心获取未读
export async function getUnread(params = {}) {
    const data = await httpObj.httpGet(apiList['unread'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// export async function getUserList(params = {}) {
//     const data = await httpObj.httpGet(serverList['getUserList'], params);
//     if (data == undefined) {
//         return false;
//     }
//     return data.data;
// };

// 获取树
export async function getTree(params = {}) {
    const data = await httpObj.httpPost(apiList['getTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取树
export async function getStandardTree(params = {}) {
    const data = await httpObj.httpPost(apiList['getStandardTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getSourcePathStr(params = {}) {
    const data = await httpObj.httpGet(apiList['getSourcePathStr'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}







// 删除树节点
export async function deleteTreeNode(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加树节点
export async function addTreeNode(params = {}) {
    const data = await httpObj.httpPost(apiList['addTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 更新树节点
export async function updateTreeNode(params = {}) {
    const data = await httpObj.httpPost(apiList['updateTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 检查同级名称是否重复
export async function checkNodeName(params = {}) {
    const data = await httpObj.httpPost(apiList['checkNodeName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 检查树内编号是否重复
export async function checkNodeCode(params = {}) {
    const data = await httpObj.httpPost(apiList['checkNodeCode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 创建业务系统
export async function addSystem(params = {}) {
    const data = await httpObj.httpPost(apiList['addSystem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除业务系统
export async function deleteSystem(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteSystem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询业务系统
export async function findSystem(params = {}) {
    const data = await httpObj.httpPost(apiList['findSystem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 更新业务系统
export async function updateSystem(params = {}) {
    const data = await httpObj.httpPost(apiList['updateSystem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询单个业务系统
export async function findById(params = {}) {
    const data = await httpObj.httpPost(apiList['findById'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 创建开发主体
export async function addDeveloper(params = {}) {
    const data = await httpObj.httpPost(apiList['addDeveloper'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 删除开发主体
export async function deleteDeveloper(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteDeveloper'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 查询开发主体
export async function findDeveloper(params = {}) {
    const data = await httpObj.httpPost(apiList['findDeveloper'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 更新开发主体
export async function updateDeveloper(params = {}) {
    const data = await httpObj.httpPost(apiList['updateDeveloper'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 验证开发主体是否重复
export async function checkCodeAndName(params = {}) {
    const data = await httpObj.httpPost(apiList['checkCodeAndName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取节点资源数量
export async function getNodeSourceCountByNodeId(params = {}) {
    const data = await httpObj.httpPost(apiList['getNodeSourceCountByNodeId'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 规则配置

export async function getDiffFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['diffFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function changeDiffFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['diffFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 数据源映射
export async function getDatasourceMapping(params = {}) {
    const data = await httpObj.httpGet(apiList['datasourceMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function postDatasourceMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['datasourceMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function execute(params = {}) {
    const data = await httpObj.httpPost(apiList['execute'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function postDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['delete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function checkDatasourceMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['checkDatasourceMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
//字段类型映射
export async function columnTypeMapping(params = {}) {
    const data = await httpObj.httpGet(apiList['columnTypeMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function datasourceType(params = {}) {
    const data = await httpObj.httpGet(apiList['datasourceType'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function addColumnTypeMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['columnTypeMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function deleteColumnTypeMapping(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteColumnTypeMapping'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function columnTypeMappingFilter(params = {}) {
    const data = await httpObj.httpGet(apiList['columnTypeMappingFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 字段忽略配置
export async function ignorePattern(params = {}) {
    const data = await httpObj.httpGet(apiList['ignorePattern'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function addIgnorePattern(params = {}) {
    const data = await httpObj.httpPost(apiList['ignorePattern'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function deleteIgnorePattern(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteIgnorePattern'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function statistics(params = {}) {
    const data = await httpObj.httpGet(apiList['statistics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwappLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['dwappLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwappLevelTags(params = {}) {
    const data = await httpObj.httpGet(apiList['dwappLevelTags'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dwappLevelSave(params = {}) {
    const data = await httpObj.httpPost(apiList['dwappLevelSave'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bizClassifyDefSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['bizClassifyDefSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bizClassifyDefDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['bizClassifyDefDelete'] + '?id=' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function createOrUpdate(params = {}) {
    const data = await httpObj.httpPost(apiList['createOrUpdate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function themeDefSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['themeDefSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function themeDefDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['themeDefDelete'] + '?id=' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function themeDefCreateOrUpdate(params = {}) {
    const data = await httpObj.httpPost(apiList['themeDefCreateOrUpdate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bizProcessDefSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['bizProcessDefSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bizProcessDefDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['bizProcessDefDelete'] + '?id=' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function bizProcessDefCreateOrUpdate(params = {}) {
    const data = await httpObj.httpPost(apiList['bizProcessDefCreateOrUpdate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}