import CONSTANTS from 'app_constants'
import sendPost from '../api/base'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'

class DataManageServices {
    static getGroupList(businessType, businessKeyword) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/category',
            'get',
            { businessType, businessKeyword },
            serverList[connectWho]
        )
    }

    static addGroup(busiGroupName, busiGroupId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/category',
            'post',
            {
                busiGroupName,
                busiGroupId
            },
            serverList[connectWho]
        )
    }

    static deleteGroup(busiGroupId) {
        console.log('busiGroupId', busiGroupId)
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/category',
            'delete',
            {
                data: {
                    busiGroupId
                }
            },
            serverList[connectWho]
        )
    }

    static getDataList(busiGroupId, type, keyword, page, pageSize, needDetail) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager',
            'get',
            {
                busiGroupId,
                type,
                keyword,
                page,
                page_size: pageSize,
                needDetail: needDetail
            },
            serverList[connectWho]
        )
    }

    static deleteData(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager',
            'delete',
            {
                data: {
                    businessId
                }
            },
            serverList[connectWho]
        )
    }

    static addTableToGroup(busiGroupId, tableIds) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/systemtable',
            'post',
            {
                busiGroupId,
                tableIds
            },
            serverList[connectWho]
        )
    }

    /**
     * 获取关联关系
     * @param {*} businessId 数据集ID
     */
    static getRelationList(businessId, containerId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/relation',
            'get',
            {
                businessId,
                containerId
            },
            serverList[connectWho]
        )
    }

    /**
     * 添加关联关系
     * @param {*} modelId 数据集ID
     */
    static addRelation(
        businessIdOriginal,
        businessIdRelated,
        columnIdOriginal,
        columnIdRelated,
        join,
        connect,
        containerId
    ) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/relation',
            'post',
            {
                businessIdOriginal,
                businessIdRelated,
                columnIdOriginal,
                columnIdRelated,
                join,
                connect,
                containerId
            },
            serverList[connectWho]
        )
    }
    static editRelation(
        businessIdOriginal,
        businessIdRelated,
        columnIdOriginal,
        columnIdRelated,
        join,
        connect,
        relationId,
        containerId
    ) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/relation',
            'post',
            {
                businessIdOriginal,
                businessIdRelated,
                columnIdOriginal,
                columnIdRelated,
                join,
                connect,
                relationId,
                containerId
            },
            serverList[connectWho]
        )
    }
    /**
     * 获取表的字段
     * @param {*} businessId 数据集ID
     */
    static getFieldList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/column',
            'get',
            params,
            serverList[connectWho]
        )
    }

    /**
     * 获取可用的表列表
     */
    static getCanRelationTableList(businessId, containerId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/relation/table',
            'get',
            {
                businessId,
                containerId
            },
            serverList[connectWho]
        )
    }

    /**
     * 分析数据集，获取可用的表
     */
    static getWorksheetTableList(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/table',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    static addWorksheetColumn(columnId, columnType, businessId, ename, cname) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/column',
            'post',
            {
                columnId,
                columnType,
                businessId,
                ename,
                cname
            },
            serverList[connectWho]
        )
    }

    static deleteWorksheetColumn(columnId, businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/column',
            'delete',
            {
                data: {
                    columnId,
                    businessId
                }
            },
            serverList[connectWho]
        )
    }

    static updateWorksheetColumn(columnId, businessId, data) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/column',
            'PATCH',
            {
                ...data,
                columnId,
                businessId
            },
            serverList[connectWho]
        )
    }

    static deleteRelation(id, isForce, containerId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/relation',
            'delete',
            {
                data: {
                    id,
                    isForce,
                    containerId
                }
            },
            serverList[connectWho]
        )
    }

    static getDimValue(columnId, businessId, keyword) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/dimValue',
            'get',
            {
                columnId,
                businessId,
                keyword
            },
            serverList[connectWho]
        )
    }

    static saveWorksheet(
        busiGroupId,
        businessId,
        prevBusinessId,
        businessTypeName
    ) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet',
            'post',
            {
                busiGroupId,
                businessId,
                prevBusinessId,
                businessTypeName
            },
            serverList[connectWho]
        )
    }

    static getTableList(dataSourceID, databaseId, keyword, page, pageSize) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/systemtable',
            'get',
            {
                datasourceId: dataSourceID,
                databaseId,
                keyword,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    static getWorksheetPreviewData(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet/preview',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    static moveData(busiGroupId, prevBusiGroupId, businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/move',
            'get',
            {
                busiGroupId,
                prevBusiGroupId,
                businessId
            },
            serverList[connectWho]
        )
    }

    static getWorksheet(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/worksheet',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    /**
     * 获取物化配置信息
     * @param {*} businessId
     */
    static getMaterialized(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/view/materialized',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    static updateMaterialized(businessId, isMaterialized, data) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/view/materialized',
            'PATCH',
            {
                businessId,
                isMaterialized,
                data
            },
            serverList[connectWho]
        )
    }

    /**
     * ETL 数据集，获取可用的表
     */
    static getEtlSelectedTableList(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/selected/table',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    /**
     * ETL 数据集，表下可用的字段
     */
    static getEtlSelectedColumns(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/selected/column',
            'get',
            params,
            serverList[connectWho]
        )
    }

    /**
     * ETL 数据集，获取已经选择的字段
     */
    static getEtlDataset(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset',
            'get',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    /**
     * 删除添加的表字段
     * @param {*} businessId 数据集ID
     */
    static deleteEtlFieldList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/column',
            'delete',
            {
                data: params
            },
            serverList[connectWho]
        )
    }

    /**
     * 从筛选中添加字段
     * @param {*} businessId 数据集ID
     */
    static addEtlFieldList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/column',
            'post',
            params,
            serverList[connectWho]
        )
    }

    /**
     * 排序添加后的字段
     * @param {*} businessId 数据集ID
     */
    static sortEtlFieldList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/column/sort',
            'post',
            params,
            serverList[connectWho]
        )
    }

    /**
     * 添加后的字段数据的预览
     * @param {*} businessId 数据集ID
     */
    static previewEtlFieldList(businessId) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/etldataset/preview',
            'post',
            {
                businessId
            },
            serverList[connectWho]
        )
    }

    /**
     *
     * @param {*} businessId
     * @param {*} description
     */
    static dataPublish(businessId, description = '') {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/push',
            'post',
            {
                businessId,
                description
            },
            serverList[connectWho]
        )
    }

    /**
     * 业务口径
     * @param {*} businessId 数据集ID
     */
    static getBusinessCaliberList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/businessCaliber',
            'get',
            params,
            serverList[connectWho]
        )
    }

    /**
    * 字段口径
    * @param {*} columnId 数据集ID
    */
    static getColumnCaliberList(params) {
        return sendPost(
            '/quantchiAPI/iqAPI/api/datamanager/columnCaliber',
            'get',
            params,
            serverList[connectWho]
        )
    }
}

export default DataManageServices
