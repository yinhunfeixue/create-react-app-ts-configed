import {
    schemaDiffByJob,
    subSchemaDiffByJob,
    getSchemaDiffFieldList,
    getSchemaDiffLineagesList,
    getSchemaDiffLineagesFieldList
} from 'app_api/metadataApi'

class SchemaDiffService {
    static async getTableData(dataType, params) {
        let res = {}
        switch (dataType) {
            case 'dataEffect':
                res = await getSchemaDiffLineagesList(params)
                break

            case 'dataTable':
                res = await schemaDiffByJob(params)
                break

            case 'dataColumns':
                res = await subSchemaDiffByJob(params)
                break

            default:
                break
        }

        return res
    }

    static async getFieldOptionList(dataType, path, params) {
        let res = {}
        switch (dataType) {
            case 'dataColumns':
                res = await getSchemaDiffFieldList(path, params)
                break

            case 'dataTable':
                res = await getSchemaDiffFieldList(path, params)
                break

            case 'dataEffect':
                res = await getSchemaDiffLineagesFieldList(path, params)
                break

            default:
                break
        }

        return res
    }
}

export default SchemaDiffService