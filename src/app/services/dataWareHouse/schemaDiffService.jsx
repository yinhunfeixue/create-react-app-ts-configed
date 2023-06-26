import {
    getDiffDetailTable,
    getDiffDetailColumn,
    getDiffDetailItem,
    getDiffDetailLineagesList,
    getDiffDetailLineagesFieldList
} from 'app_api/dataWarehouse'

class SchemaDiffService {
    static async getTableData(dataType, params) {
        let res = {}
        switch (dataType) {
            case 'dataEffect':
                res = await getDiffDetailLineagesList(params)
                break

            case 'dataTable':
                res = await getDiffDetailTable(params)
                break

            case 'dataColumns':
                res = await getDiffDetailColumn(params)
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
                res = await getDiffDetailItem(path, params)
                break

            case 'dataTable':
                res = await getDiffDetailItem(path, params)
                break

            case 'dataEffect':
                res = await getDiffDetailLineagesFieldList(path, params)
                break

            default:
                break
        }

        return res
    }
}

export default SchemaDiffService