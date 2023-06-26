import { httpObj } from './base'
import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['intelligent']
const apiList2 = CONSTANTS['API_LIST']['keywordSearch']
// 智能取数(原来的)-----------------------------------------------------------------------

// 搜索结果
// export async function getSearchResult(params = {}) {
//     const data = await sendPost('/quantchiAPI/api/query', 'get', params, serverList[connectWho]);
//     if (data == undefined) {
//         return false;
//     }
//     return data.data;
    // return Promise.resolve({
    //     "code": 200,
    //     "data": [
    //         {
    //             cn_name: "上海",
    //             db_field: "mtoi.dim_compact.marketing_no",
    //             type: "value",
    //             id: "c656c9db-1d2f-4eea-a494-99178d107600",
    //             _version_: 1601783631319138300,
    //             replace_origin: 1,
    //             "init_date": "20160108",
    //             "customer_no": "71066888",
    //             "branch_no": "71",
    //             "名称": "莫XX",
    //             "account_no": "971066888",
    //             "rank_field": 142104533.175,
    //             "init_date1": "20160108",
    //             "customer_no2": "71066888",
    //             "branch_no3": "71",
    //             "名称4": "莫XX",
    //             "account_no5": "971066888",
    //             "rank_field6": 142104533.175
    //         }
    //     ],
    //     "msg": "OK",
    //     "total": 2
    // });
// };

// 搜索结果
// export async function queryFromSearchToData(params = {}) {
//     const data = await sendPost('/quantchiAPI/api/queryFromSearchToData', 'post', params, serverList[connectWho]);
//     if (data == undefined) {
//         return false;
//     }
//     return data.data;
// };
//即时查询(精灵键盘)
// export async function queryInstance(params = {}) {
//     const data = await sendPost('/quantchiAPI/api/queryInstance', 'get', params, serverList[connectWho]);
//     if (data == undefined) {
//         return false;
//     }
//     return data.data;
// }
// 智能取数（原来的）-------------end------------------------------------------------

//重构后的智能取数------------------start-------------------------------------------
/**
 * 智能取数获取业务接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function getBusiCate(params = {}) {
    const data = await httpObj.httpGet(apiList['getBusiCate'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 获取推荐问句接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function getRecommendQuery(params = {}) {
    const data = await httpObj.httpGet(apiList['getRecommendQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 获取相关问句接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function getRelatedQuery(params = {}) {
    const data = await httpObj.httpGet(apiList['getRelatedQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 智能取数下载接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function intelDownload(params = '') {
    window.open(apiList['intelDownload'] + params, '_self')
};
/**
 * 智能取数查询接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function basicQuery(params = {}) {
    const data = await httpObj.httpPost(apiList['basicQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 智能取数步骤查询接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function stepsQuery(params = {}) {
    const data = await httpObj.httpPost(apiList['stepsQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 智能取数联想语句查询接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function associateQuery(params = {}) {
    const data = await httpObj.httpPost(apiList['associateQuery'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 点赞接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function likenum(params = {}) {
    const data = await httpObj.httpPost(apiList['likenum'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

// 即时查询(精灵键盘)
export async function queryInstance(params = {}) {
    const data = await httpObj.httpGet(apiList['queryInstance'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 获取结果页 右下角已加入的报表 的列表
export async function getfavouriteList(params = {}) {
    const data = await httpObj.httpGet(apiList['favouriteList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

/**
 * 获取结果页 右下角已加入的报表 （添加）
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function addfavouriteList(params = {}) {
    const data = await httpObj.httpPost(apiList['favouriteList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 获取结果页 右下角已加入的报表 （删除）
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function deletefavouriteList(params = {}) {
    const data = await httpObj.httpPost(apiList['deletefavouriteList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 获取结果页 右下角已加入的报表 下载
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function favouriteDownload(params = '') {
    window.open(apiList['favouriteDownload'] + params, '_self')
};
// 重构后的智能取数------------------end-------------------------------------------

/**
 * 获取模型图数据
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function getBusinessModel(params = {}) {
    const data = await httpObj.httpPost(apiList['getBusinessModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 获取模型图数据
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function checkBusinessName(params = {}) {
    const data = await httpObj.httpGet(apiList['checkBusinessName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * keyword search 聚合接口
 * @param {*} params
 */
export async function getAggregationData(params = {}) {
    const data = await httpObj.httpPost(apiList['aggregation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * keyword search 图形切换接口
 * @param {*} params
 */
export async function handleSwitchData(params = {}) {
    httpObj.cancelRequest()
    const data = await httpObj.httpCancelPost(apiList['switch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 之前的左侧栏接口
// 获取业务线下所有指标
export async function getMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList2['getMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取业务线及数据集使用记录
export async function getBusiness(params = {}) {
    const data = await httpObj.httpGet(apiList2['getBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 左侧栏键盘精灵
export async function leftQuickTip(params = {}) {
    const data = await httpObj.httpGet(apiList2['leftQuickTipOld'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function searchMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList2['searchMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}