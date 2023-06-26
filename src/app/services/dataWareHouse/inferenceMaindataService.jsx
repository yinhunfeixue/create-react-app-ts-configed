import { message } from 'antd'
import {
    inferenceMaindata,
    inferenceMaindataAddByTableIds,
    inferenceMaindataCanAddTables,
    inferenceMaindataLastInferenceTime,
    inferenceMaindataModifyColumn,
    inferenceMaindataNotConfirmNumber,
    inferenceMaindataOperation,
    searchField,
} from 'app_api/dataWarehouse'

class InferenceMaindataService {
    static async getInferenceMaindata(params) {
        let res = {}
        res = await inferenceMaindata(params)
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getInferenceMaindataLastInferenceTime(params) {
        let res = {}
        res = await inferenceMaindataLastInferenceTime(params)
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async handleInferenceMaindataAddByTableIds(params) {
        let res = {}
        res = await inferenceMaindataAddByTableIds(params)
        if (res.code == 200) {
            message.success('添加成功！')
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getInferenceMaindataCanAddTables(params) {
        let res = {}
        res = await inferenceMaindataCanAddTables(params)
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async handleInferenceMaindataModifyColumn(params) {
        let res = {}
        res = await inferenceMaindataModifyColumn(params)
        if (res.code == 200) {
            message.success('修改成功！')
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async handleInferenceMaindataOperation(params) {
        let res = {}
        res = await inferenceMaindataOperation(params)
        if (res.code == 200) {
            message.success('操作成功！')
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getSearchField(params) {
        let res = {}
        res = await searchField(params)
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getInferenceMaindataNotConfirmNumber(params) {
        let res = {}
        res = await inferenceMaindataNotConfirmNumber(params)
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }
}

export default InferenceMaindataService
