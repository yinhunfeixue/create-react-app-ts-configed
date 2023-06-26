import { getAssetsTree } from 'app_api/metadataApi'

class getTreeService {
    static async getReportTree(params) {
        let res = {}
        let param = {
            code: 'ZT005',
            ...params
        }
        res = await getAssetsTree(param)
        return res
    }
}

export default getTreeService