import {
    // getDataMapData,
    getExpandDataMapField,
    getLineageBidirectionList,
    getTableBidirectionList,
    getColumnBidirectionList
} from 'app_api/metadataApi'

class EffectAnalysisService {
    static async getGrapDataList(dataType, param) {
        let params = { ...param, direction: 'downstream' }
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
                params['limit'] = 50
                if (params['ids']) {
                    params['columnIds'] = params['ids']
                    delete params['ids']
                }
                res = await getColumnBidirectionList(params)
                break

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

            default:
                // if (params['ids'] && params['ids'][0]) {
                //     params['tableId'] = params['ids'][0]
                //     delete params['ids']
                // }
                // res = await getDataMapData(params)
                // 默认展示表数据
                params['limit'] = 50
                if (params['ids']) {
                    params['tableIds'] = params['ids']
                    delete params['ids']
                }

                res = await getTableBidirectionList(params)
                break
        }
        // if( res.code && res.code == 200 ){
        //     return res.data
        // } else {

        // }
        return res
    }

    static async getLineageBidirectionData(params) {

        let res = await getLineageBidirectionList({ ...params, direction: 'downstream' })
        return res
    }
}

export default EffectAnalysisService