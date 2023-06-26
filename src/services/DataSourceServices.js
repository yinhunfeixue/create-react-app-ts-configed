import CONSTANTS from 'app_constants'
import sendPost, { httpObj, formData } from '../api/base'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'

class DataSourceServices {
    static getList(keyword, searchDbType, page, pageSize, onlyCollect = false) {
        return sendPost(
            '/quantchiAPI/api/metadata/datasource/manage',
            'get',
            {
                keyword,
                product: searchDbType,
                page,
                page_size: pageSize,
                onlyCollect
            },
            serverList[connectWho]
        )
    }

    static getLogList(dataSourceID, page, pageSize) {
        return sendPost(
            '/quantchiAPI/api/extractorJob/datasource',
            'get',
            {
                datasourceId: dataSourceID,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    static getLogDetailList(logID, page, pageSize) {
        return sendPost(
            '/quantchiAPI/api/extractLog',
            'get',
            {
                logId: logID,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    static getTableList(dataSourceID, databaseId, keyword, page, pageSize) {
        return sendPost(
            '//quantchiAPI/api/metadata/table/searchTable',
            'post',
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

    static getDatabaseList(dataSourceID, page, pageSize) {
        return sendPost(
            '//quantchiAPI/api/metadata/database',
            'get',
            {
                datasourceId: dataSourceID,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    static getFieldList(tableId, page, pageSize) {
        return sendPost(
            '//quantchiAPI/api/metadata/field/searchField',
            'post',
            {
                tableId,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    static saveChineseInfo(tableID, tableChinseName, fieldChinseseList) {
        return sendPost(
            '//quantchiAPI/api/metadata/table/field',
            'post',
            {
                id: tableID,
                tableName: tableChinseName,
                fields: fieldChinseseList
            },
            serverList[connectWho]
        )
    }

    static importChineseInfo(strategy, file) {
        return httpObj.httpPost(
            '//quantchiAPI/api/manualJob',
            formData({
                jobName: '导入中文信息',
                fileTpl: 'metadata',
                area: 'metadata',
                synchronously: true,
                strategy,
                file
            })
        )
    }

    static hasFieldChineseName(tableID, fieldChineseName) {
        return sendPost(
            '//quantchiAPI/api/metadata/table/field/duplicationName',
            'get',
            {
                id: tableID,
                physicalFieldDesc: fieldChineseName
            },
            serverList[connectWho]
        )
    }

    static exportTables(dataSourceID, tableIds) {
        window.open(
            `${serverList[connectWho]
            }//quantchiAPI/api/metadata/datasource/download?datasourceId=${dataSourceID}&tableIds=${tableIds ? tableIds.join(',') : ''
            }`
        )
    }

    static execTask(dataSourceID) {
        return sendPost(
            '/quantchiAPI/api/datasourceJob/exec',
            'post',
            {
                datasourceId: dataSourceID
            },
            serverList[connectWho]
        )
    }

    /**
     * 根据数据库IP，帐号等信息获取数据源下的数据库列表
     */
    static getDataBaseByAccount(
        host,
        username,
        password,
        dataSourceID,
        page,
        pageSize
    ) {
        return sendPost(
            '/quantchiAPI/api/metadata/datasource/database',
            'post',
            {
                id: dataSourceID,
                host,
                username,
                password,
                page,
                page_size: pageSize
            },
            serverList[connectWho]
        )
    }

    /**
     * 获取码表列表
     */
    static getCodeSystemConf() {
        return sendPost(
            '/quantchiAPI/api/metadata/getCodeSystemConf',
            'get',
            {},
            serverList[connectWho]
        )
    }

    static saveDataSource(
        dsName,
        identifier,
        dsType,
        host,
        username,
        password,
        product,
        databases,
        codeItemSql,
        codeValueSql,
        codeFieldSql,
        codeUsername,
        codePassword,
        frequency,
        whichDay,
        time,
        startDate,
        endDate,
        dataSourceID,
        hasCode,
        hasCodeUser
    ) {
        return sendPost(
            '//quantchiAPI/api/metadata/datasource/andJob',
            'post',
            {
                id: dataSourceID,
                dsName,
                identifier,
                dsType,
                host,
                username,
                password,
                databases,
                codeItemSql: codeItemSql || undefined,
                codeValueSql: codeValueSql || undefined,
                codeFieldSql: codeFieldSql || undefined,
                codeUsername,
                codePassword,
                product,
                jobName: '添加数据源',
                frequency,
                whichDay,
                time,
                startDate,
                endDate,
                hasCode,
                hasCodeUser
            },
            serverList[connectWho]
        )
    }

    static saveDataSourceUpdateMethod(
        dataSourceID,
        frequency,
        whichDay,
        time,
        startDate,
        endDate
    ) {
        return sendPost(
            '//quantchiAPI/api/metadata/datasource/andJob',
            'post',
            {
                id: dataSourceID,
                jobName: '添加数据源',
                frequency,
                whichDay,
                time,
                startDate,
                endDate
            },
            serverList[connectWho]
        )
    }

    static getDataSourceJob(datasourceId) {
        return sendPost(
            '//quantchiAPI/api/job/datasource',
            'get',
            {
                datasourceId
            },
            serverList[connectWho]
        )
    }

    static testDataSourceConnect(
        dataSourceID,
        dsType,
        host,
        username,
        password
    ) {
        return sendPost(
            '/quantchiAPI/api/metadata/datasource/connect',
            'post',
            {
                id: dataSourceID,
                dsType,
                host,
                username,
                password
            },
            serverList[connectWho]
        )
    }

    /**
     * 表名是否存在
     * @param {*} identifier
     */
    static identifierIsExist(identifier) {
        return sendPost(
            '//quantchiAPI/api/metadata/datasource',
            'get',
            {
                identifier
            },
            serverList[connectWho]
        )
    }

    /**
     * 表名是否存在
     * @param {*} identifier
     */
    static sqlIsEffect(
        dsType,
        host,
        username,
        password,
        codeItemSql,
        codeValueSql,
        codeFieldSql,
        sql,
        codeUsername,
        codePassword,
        id
    ) {
        return sendPost(
            '//quantchiAPI/api/metadata/datasource/sqltest',
            'post',
            {
                dsType,
                host,
                username,
                password,
                codeItemSql,
                codeValueSql,
                codeFieldSql,
                sql,
                codeUsername,
                codePassword,
                id
            },
            serverList[connectWho]
        )
    }
}

export default DataSourceServices
