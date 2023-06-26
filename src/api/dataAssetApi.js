import sendPost, { formData, httpObj } from './base'


import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['dataAsset']
const connectWho = 'dmpTestServer'

// 获取数据集详情
export async function getDataSetDetial(params = {}) {
    const data = await httpObj.httpGet(apiList['getDataSetDetial'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取数据集详情表格
export async function getDataSetColumn(params = {}) {
    const data = await httpObj.httpGet(apiList['getDataSetColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取数据集详情预览
export async function getDataSetPreview(params = {}) {
    const data = await httpObj.httpGet(apiList['getDataSetPreview'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDatasetSearchList(params = {}) {
    const data = await httpObj.httpGet(apiList['datasetSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    let resultList = {
        code: 200,
        data: [
            {
                title: 'Ant Design Title 1',
                showName: '111客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: true,
                favorites: true
            },
            {
                title: 'Ant Design Title 2',
                showName: '222客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 3',
                showName: '333客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 4',
                showName: '444客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 5',
                showName: '555客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 6',
                showName: '666客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 7',
                showName: '777客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 8',
                showName: '888客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 9',
                showName: '999客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            },
            {
                title: 'Ant Design Title 10',
                showName: '1010客户资产信息（customer_asset）',
                description: '数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息数据集描述信息',
                fields: ['客户编号（customer_no）', '客户姓名（customer_name）', '总资产（total_asset）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）', 'columnN（字段N）'],
                updateTime: '2019-10-10',
                useTimes: '9',
                cnameProportion: '20%',
                datasetId: '1498',
                inCart: false,
                favorites: false
            }
        ],
        total: 50
    }
    return resultList
}

export async function getHotSearchList(params = {}) {
    const data = await httpObj.httpGet(apiList['hotSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // let resultList = {
    //     code: 200,
    //     data: ['资产', '交易信息', '监管指标']
    // }
    // return resultList
}

export async function getCategoriesFirst(params = {}) {
    const data = await httpObj.httpGet(apiList['categoriesFirst'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // let categoriesFirst = {
    //     code: 200,
    //     data: [
    //         {
    //             id: '1', name: '两融业务'
    //         },
    //         {
    //             id: '2', name: '经济业务'
    //         }
    //     ]
    // }
    // return categoriesFirst
}

export async function getCategoriesAll(params = {}) {
    const data = await httpObj.httpGet(apiList['categoriesAll'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // return {
    //     code: 200,
    //     data: [
    //         {
    //             id: '1',
    //             parentId: 0,
    //             name: '两融业务',
    //             depth: '',
    //             isLeaf: false,
    //             children: [
    //                 {
    //                     id: '11',
    //                     parentId: 1,
    //                     name: '两融业务-001',
    //                     depth: '',
    //                     isLeaf: false,
    //                     children: [
    //                         {
    //                             id: '11-001',
    //                             parentId: 11,
    //                             name: '两融业务-001-001',
    //                             depth: '',
    //                             isLeaf: true,
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             id: '2',
    //             parentId: 0,
    //             name: '经济业务',
    //             depth: '',
    //             isLeaf: false,
    //             children: [
    //                 {
    //                     id: '21',
    //                     parentId: '2',
    //                     name: '经济业务-001',
    //                     depth: '',
    //                     isLeaf: true,
    //                 }
    //             ]
    //         }
    //     ]
    // }
}

export async function getCartList(params = {}) {
    const data = await httpObj.httpGet(apiList['cartList'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // return {
    //     code: 200,
    //     total: 2,
    //     data: [
    //         {
    //             datasetId: 1231,
    //             datasetShowName: '数据集名称',
    //             datasetCname: '中文名',
    //             datasetEname: '英文名',
    //             selected: true,
    //         },
    //         {
    //             datasetId: 343334,
    //             datasetShowName: '数据集名称12312',
    //             datasetCname: '中文名1323',
    //             datasetEname: '英文名13212',
    //             selected: false,
    //         }
    //     ]
    // }
}
// 获取数据集后台管理搜索结果
export async function adminSearch(params = {}) {
    const data = await httpObj.httpGet(apiList['adminSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function cartAdd(params = {}) {
    const data = await httpObj.httpPost(apiList['cartAdd'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function cartSelect(params = {}) {
    const data = await httpObj.httpPost(apiList['cartSelect'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据集后台管理发布
export async function adminPublish(params = {}) {
    const data = await httpObj.httpGet(apiList['adminPublish'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取数据集后台管理取消发布
export async function adminCancel(params = {}) {
    const data = await httpObj.httpGet(apiList['adminCancel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取数据集内表列表
export async function getDataSetTable(params = {}) {
    const data = await httpObj.httpGet(apiList['getDataSetTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据集修改
export async function editDataSet(params = {}) {
    const data = await httpObj.httpPost(apiList['editDataSet'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取雪花模型数据
export async function getSnowflakeMode(params = {}) {
    const data = await httpObj.httpPost(apiList['getSnowflakeMode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取雪花模型数据
export async function deleteTableRelaton(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteTableRelaton'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function cartUse(params = {}) {
    const data = await httpObj.httpPost(apiList['cartUse'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function cartDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['cartDelete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getFavoritesList(params = {}) {
    const data = await httpObj.httpGet(apiList['favoritesList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function favoritesAdd(params = {}) {
    const data = await httpObj.httpPost(apiList['favoritesAdd'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function favoritesDelete(params = {}) {
    const data = await httpObj.httpPost(apiList['favoritesDelete'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getRelatedSearchList(params = {}) {
    const data = await httpObj.httpGet(apiList['relatedSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDataAssetTable(params = {}) {
    const data = await httpObj.httpGet(apiList['getDataAssetTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 资产搜索
export async function dataAssetSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['dataAssetSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 数仓搜索
 * @description
 * @author sima
 * @date 2021-08-06
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function wareAssetSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['wareAssetSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 我的资产
export async function datamanager(params = {}) {
    const data = await httpObj.httpGet(apiList['datamanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 加入我的资产
export async function addToMyAssets(params = {}) {
    const data = await httpObj.httpPost(apiList['addToMyAssets'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 推荐模型
export async function recommendModel(params = {}) {
    const data = await httpObj.httpPost(apiList['recommendModel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 从我的资产移除
export async function removeFromMyAssets(params) {
    const data = await httpObj.httpPost(apiList['removeFromMyAssets'] + params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 搜索目录树
export async function assetTree(params = {}) {
    const data = await httpObj.httpPost(apiList['assetTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 数仓目录树
 * @description
 * @author sima
 * @date 2021-08-06
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function wareAssetTree(params = {}) {
    const data = await httpObj.httpPost(apiList['wareAssetTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 选中/取消选中
export async function assetSelected(params = {}) {
    const data = await httpObj.httpPost(apiList['assetSelected'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 共享对象列表
export async function sharedWith(params = {}) {
    const data = await httpObj.httpGet(apiList['sharedWith'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 共享对象
export async function shareData(params = {}) {
    const data = await httpObj.httpPost(apiList['shareData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 业务分类树
export async function classTree(params = {}) {
    const data = await httpObj.httpGet(apiList['classTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取业务线详情
export async function assetDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['assetDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 业务线数据保存
export async function saveAsset(params = {}) {
    const data = await httpObj.httpPost(apiList['saveAsset'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 业务标签列表
export async function allTags(params = {}) {
    const data = await httpObj.httpGet(apiList['allTags'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 标签过滤器
export async function tagFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['tagFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 标签过滤器
 * @description
 * @author sima
 * @date 2021-08-06
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function wareTagFilter(params = {}) {
    const data = await httpObj.httpPost(apiList['wareTagFilter'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}



// 配置完成接口
export async function configComplete(params) {
    const data = await httpObj.httpPost(apiList['configComplete'] + params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取主数据列表
export async function mainData(params = {}) {
    const data = await httpObj.httpGet(apiList['mainData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取代码项列表
export async function codeItem(params = {}) {
    const data = await httpObj.httpGet(apiList['codeItem'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 同步物理信息
export async function sync(params) {
    const data = await httpObj.httpPUT(apiList['sync'] + params)
    if (data === undefined) {
        return false
    }
    return data.data
}


// 获取业务线的关系图
export async function relationGraph(params = {}) {
    const data = await httpObj.httpGet(apiList['relationGraph'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 推荐数据集
export async function suggestDataset(params = {}) {
    const data = await httpObj.httpGet(apiList['suggestDataset'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取物化表信息
export async function materializeInfo(params = {}) {
    const data = await httpObj.httpGet(apiList['materializeInfo'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 创建物化表
export async function executeDdl(params = {}) {
    const data = await httpObj.httpPost(apiList['executeDdl'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 预览物化表建表语句
export async function previewDdl(params = {}) {
    const data = await httpObj.httpPost(apiList['previewDdl'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取物化表的调度周期
export async function schedule(params = {}) {
    const data = await httpObj.httpGet(apiList['schedule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 设置物化表调度周期
export async function addSchedule(params = {}) {
    const data = await httpObj.httpPost(apiList['schedule'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 指标血缘
export async function metricsLineage(params = {}) {
    const data = await httpObj.httpGet(apiList['metricsLineage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 字段检核表
export async function columnCheckDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['columnCheckDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据集血缘
export async function dataAssetLineage(params = {}) {
    const data = await httpObj.httpGet(apiList['dataAssetLineage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 字段检核详情
export async function reportsCheckDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['reportsCheckDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据集模板的标准树
export async function standardTree(params = {}) {
    const data = await httpObj.httpGet(apiList['standardTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据模板详情
export async function dstemplateDetail(params = {}) {
    const data = await httpObj.httpGet(apiList['dstemplateDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 标准列表 新
export async function standardByParam(params = {}) {
    const data = await httpObj.httpPost(apiList['standardByParam'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 保存数据集模板（增/改）
export async function saveDstemplate(params = {}) {
    const data = await httpObj.httpPost(apiList['saveDstemplate'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


export async function docmanager(params = {}) {
    const data = await httpObj.httpPost(apiList['docmanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function docmanagerById(params = {}) {
    const data = await httpObj.httpGet(apiList['docmanager'] + '/' + params.id)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function deleteDocmanager(params = {}) {
    const data = await httpObj.httpPost(apiList['deleteDocmanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function updateDocmanager(params = {}) {
    const data = await httpObj.httpPost(apiList['updateDocmanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function downloadDocmanager(params = {}) {
    httpObj.httpGetDownload(`${apiList['downloadDocmanager']}?id=${params.id}&version=${params.version}`)
    return
}
export async function previewDocmanager(params = {}) {
    const data = await httpObj.httpGet(apiList['downloadDocmanager'], params)
    return data
}

export async function uploadDocmanager(params = {}) {
    let formData = new FormData()
    // if (params.multipartFile != undefined) {
    //     formData.append('multipartFile', params.multipartFile)
    //
    // }
    params.multipartFile.map((item) => {
        formData.append('multipartFile', item)
    })
    delete params.multipartFile

    _.map(params, (v, k) => {
        formData.append(k, v)
    })

    const data = await httpObj.httpPost(apiList['uploadDocmanager'], formData)
    if (data == undefined) {
        return false
    }
    return data.data
}
export async function cancelUpload(params = {}) {
    httpObj.cancelRequest()
    const data = await httpObj.httpCancelPost(apiList['uploadDocmanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function attachment(params = {}) {
    const data = await httpObj.httpPost(apiList['attachment'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function recordDocmanager(params = {}) {
    const data = await httpObj.httpPost(apiList['recordDocmanager'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function docmanagerDeleteTreeNode(params = {}) {
    const data = await httpObj.httpPost(apiList['docmanagerDeleteTreeNode'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}



/**
 * 获取系统表的基础信息
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getSysBasic(params = {}) {
    const data = await httpObj.httpGet(`${apiList['sysBasic']}/${params.id}`)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getSysBasicOverview(params = {}) {
    const data = await httpObj.httpGet(`${apiList['sysBasicOverview']}/${params.id}`)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 普通字段信息
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getSysColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['getSysColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 分区字段信息
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getSysPartitionColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['getSysPartitionColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘脚本
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getBloodScript(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getBloodScript']}/${params.id}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 血缘脚本热度
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getBloodHot(params = {}) {
    const data = await httpObj.httpPost(apiList['getBloodHot'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 关联关系
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getRelation(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getRelation']}/${params.id}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}



/**
 * 获取脚本详情
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getSqlBasic(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getSqlBasic']}/${params.id}`)
    if (data === undefined) {
        return false
    }
    return data.data
}

/* 
    获取报表详情基本信息
*/
export async function getReportBasic(params = {}) {
    const data = await httpObj.httpGet(`${apiList['getReportBasic']}/${params.id}`)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getBloodTable(params) {
    const data = await httpObj.httpPost(`${apiList['getBloodTable']}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/* 
    获取物理表详情关联报表
*/

export async function getRelationTable(params) {
    const data = await httpObj.httpGet(`${apiList['getRelationTable']}/${params.id}`, params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * sql使用记录
 * @description
 * @author sima
 * @date 2021-08-07
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getRecord(params = {}) {
    const data = await httpObj.httpPost(apiList['getRecord'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 表血缘中过滤的表
 * @description
 * @author sima
 * @date 2021-08-09
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTableFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 表血缘中过滤的表
 * @description
 * @author sima
 * @date 2021-08-09
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getLineageColumnFilters(params = {}) {
    const data = await httpObj.httpGet(apiList['getLineageColumnFilters'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 表血缘
 * @description
 * @author sima
 * @date 2021-08-09
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTableLineage(params = {}) {
    const data = await httpObj.httpPost(apiList['getTableLineage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 字段血缘的可选字段
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getColumnLineageColumns(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumnLineageColumns'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 字段血缘
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getColumnLineage(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumnLineage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 获取文件血缘
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getSqlLineage(params = {}) {
    const data = await httpObj.httpPost(apiList['getSqlLineage'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 数仓库
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
 export async function getTraceabilityDatabase(params = {}) {
    const data = await httpObj.httpGet(apiList['getTraceabilityDatabase'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 数仓表
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTraceabilityTable(params = {}) {
    const data = await httpObj.httpGet(apiList['getTraceabilityTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 数仓字段
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTraceabilityColumn(params = {}) {
    const data = await httpObj.httpGet(apiList['getTraceabilityColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 表溯源-表
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getResultTableList(params = {}) {
    const data = await httpObj.httpPost(apiList['getResultTableList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 字段溯源-表
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getResultColumnList(params = {}) {
    const data = await httpObj.httpPost(apiList['getResultColumnList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 表溯源-图
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTableGraph(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableGraph'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 字段溯源-图
 * @description
 * @author sima
 * @date 2021-08-11
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getColumnGraph(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumnGraph'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 所有数仓层次信息
 * @description
 * @author sima
 * @date 2021-08-12
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getDwLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['getDwLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}


/**
 * 表溯源层级
 * @description
 * @author sima
 * @date 2021-08-12
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getTableLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['getTableLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 字段溯源层级
 * @description
 * @author sima
 * @date 2021-08-12
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getColumnLevel(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumnLevel'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 溯源表下载
 * @description
 * @author sima
 * @date 2021-08-17
 * @export
 * @param {*} [params={}]
 * @returns
 */
 export async function getTableDown(params = {}) {
    httpObj.httpPostDownload(apiList['getTableDown'], params)
    return
}

export async function dataSecurityDownload(params) {
    httpObj.httpPostDownload(apiList['dataSecurityDownload'], params)
    return
}

/**
 * 溯源字段下载
 * @description
 * @author sima
 * @date 2021-08-17
 * @export
 * @param {*} [params={}]
 * @returns
 */
export async function getColumnDown(params = {}) {
    httpObj.httpPostDownload(apiList['getColumnDown'], params)
    return
}


export async function foreignRelation(params = {}) {
    const data = await httpObj.httpGet(apiList['foreignRelation'] + params.id, params)
    if (data === undefined) {
        return false
    }
    return data.data
}