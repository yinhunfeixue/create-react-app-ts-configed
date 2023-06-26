// import {
//     getSystemView,
//     getDataSourceView,
//     getDataBaseView,
//     getTableView,
//     getSystemEnum,
//     getDatasourceEnum,
//     getDatabaseEnum,
//     getTableEnum,
//     getRedundancyView,
//     getRedundancyViewDetail
// } from 'app_api/metadata/operationReport'

import {
    getDataMapData,
    getExpandDataMapField,
    getLineageBidirectionList,
    getTableBidirectionList,
    getColumnBidirectionList
} from 'app_api/metadataApi'
import { metricsLineage, dataAssetLineage } from 'app_api/dataAssetApi'


class LinkAnalysisService {
    static async getGrapDataList(dataType, param) {
        let params = { ...param }
        let res = {}
        switch (dataType) {
            case 'table':
                params['limit'] = 50
                if (params['ids']) {
                    params['tableIds'] = params['ids']
                    delete params['ids']
                }

                res = await getTableBidirectionList(params)
                break

            case 'column':
                if (params.from == 'indexma') {
                    delete params.from
                    res = await metricsLineage(params)
                    break
                } else if (params.from == 'dataAsset') {
                    delete params.from
                    res = await dataAssetLineage(params)
                    break
                } else {
                    params['limit'] = 50
                    if (params['ids']) {
                        params['columnIds'] = params['ids']
                        delete params['ids']
                    }
                    res = await getColumnBidirectionList(params)
                    break
                }

            case 'report':
                params['limit'] = 50
                if (params['ids']) {
                    params['tableIds'] = params['ids']
                    delete params['ids']
                }

                res = await getTableBidirectionList(params)
                break

            case 'report_field':
                params['limit'] = 50
                if (params['ids']) {
                    params['columnIds'] = params['ids']
                    delete params['ids']
                }
                res = await getColumnBidirectionList(params)
                break

            case 'indexma':
                res = await metricsLineage(params)
                break

            default:
                if (params['ids'] && params['ids'][0]) {
                    params['tableId'] = params['ids'][0]
                    delete params['ids']
                }
                res = await getDataMapData(params)
                break
        }
        // if( res.code && res.code == 200 ){
        //     return res.data
        // } else {

        // }
        return res
    }

    static async getLineageBidirectionData(params) {
        let res = await getLineageBidirectionList(params)
        return res
    }
}

export default LinkAnalysisService