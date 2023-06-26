import {
    getSystemView,
    getDataSourceView,
    getDataBaseView,
    getTableView,
    getSystemEnum,
    getDatasourceEnum,
    getDatabaseEnum,
    getTableEnum,
    getRedundancyView,
    getRedundancyViewDetail,
    saveRedundancyCheckJob,
    getRedundancyCheckTaskJob
} from 'app_api/metadata/operationReport'

class OperationReportService {
    static async getSpaceList(dataType, params) {
        let res = {}
        switch (dataType) {
            case 'system':
                res = await getSystemView(params)
                break

            case 'dataSource':
                res = await getDataSourceView(params)
                break

            case 'dataBase':
                res = await getDataBaseView(params)
                break

            case 'dataTable':
                res = await getTableView(params)
                break

            default:
                break
        }
        // if( res.code && res.code == 200 ){
        //     return res.data
        // } else {

        // }
        return res
    }

    static async getSourceEnumList(dataType, params) {
        let res = {}
        switch (dataType) {
            case 'system':
                res = await getSystemEnum(params)
                break

            case 'dataSource':
                res = await getDatasourceEnum(params)
                break

            case 'dataBase':
                res = await getDatabaseEnum(params)
                break

            case 'dataTable':
                res = await getTableEnum(params)
                break

            default:
                break
        }
        // if( res.code && res.code == 200 ){
        //     return res.data
        // } else {

        // }
        return res
    }

    static async getRedundancyViewList(params) {
        let res = await getRedundancyView({ sortField: 'redundancyCounts', sortDirection: 'desc', ...params })
        if (res.code == 200) {
            return res
        } else {
            return {}
        }
    }

    static async getRedundancyViewDetailList(params) {
        let res = await getRedundancyViewDetail({ sortField: 'usedTablespace', sortDirection: 'desc', ...params })
        if (res.code == 200) {
            return res
        } else {
            return {}
        }
    }

    static async runRedundancyCheckJob(params) {
        let res = await saveRedundancyCheckJob({ ...params })
        return res
        // if (res.code == 200) {
        //     return res
        // } else {
        //     return {}
        // }
    }

    static async getRedundancyTaskJob(params) {
        let res = await getRedundancyCheckTaskJob({ ...params })
        return res
        // if (res.code == 200) {
        //     return res
        // } else {
        //     return 
        // }
    }

}

export default OperationReportService