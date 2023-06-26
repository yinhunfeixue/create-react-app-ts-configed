import {
    getReportSourceList,
    getReportRuleList,
    getReportSystemSelectList,
    getReportManagerList,
    getReportDatasourceList,
    getReportDatabaseList,
    getReportDataTableList,
    getReportSummaryList,
    getReportRuleTrendList,
    getReportSystemSummaryList,
    getReportCheckDateList
} from 'app_api/exam/report'

// import { checkRuleList } from 'app_api/examinationApi'

class ReportService {
    static async getReportSourceData(dataType, params) {
        let res = await getReportSourceList(params)

        return res
    }

    static async getReportRuleData(dataType, params) {
        let res = await getReportRuleList({ ...params })

        return res
    }

    static async getReportOptionList(dataType, params) {
        let res = {}
        switch (dataType) {
            case 'system':
                res = await getReportSystemSelectList(params)
                break

            case 'dataSource':
                res = await getReportDatasourceList(params)
                break

            case 'dataBase':
                res = await getReportDatabaseList(params)
                break

            case 'dataTable':
                res = await getReportDataTableList(params)
                break

            case 'dataManager':
                res = await getReportManagerList(params)
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

    static async getReportSummaryListData(params) {
        let res = await getReportSummaryList({ ...params })

        return res
    }

    static async getReportRuleTrendListData(params) {
        let res = await getReportRuleTrendList({ ...params })

        return res
    }

    static async getReportSystemSummaryListData(params) {
        let res = await getReportSystemSummaryList({ ...params })

        return res
    }

    static async getReportCheckDates(params) {
        let res = await getReportCheckDateList(params)

        return res
    }
}

export default ReportService