import sendPost, { httpObj } from './base'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['addNewCol']
const connectWho = 'dmpTestServer'

// 获取数据看板列表
export async function formulaFunction(params = {}) {
    const data = await httpObj.httpGet(apiList['formulaFunction'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 获取数据看板删除
export async function formulaTable(params = {}) {
    const data = await httpObj.httpGet(apiList['formulaTable'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 添加公式/函数
export async function addFormula(params = {}) {
    const data = await httpObj.httpPost(apiList['addFormula'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取某字段的推荐分区
export async function getPartitionRecommend(params = {}) {
    const data = await httpObj.httpGet(apiList['getPartitionRecommend'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取某字段的推荐分区
export async function getColumn(params = {}) {
    const data = await httpObj.httpGet(apiList['getColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 查询新增的formula
export async function getFormula(params = {}) {
    const data = await httpObj.httpPost(apiList['getFormula'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 查询公式函数的推荐
export async function getSuggestion(params = {}) {
    // const data = await httpObj.httpCancelPost(apiList['suggestion'], params)
    const data = await httpObj.httpCancelGet(apiList['suggestion'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 删除formula

export async function delFormula(params = {}) {
    const data = await httpObj.httpPost(apiList['delFormula'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 创建Formula时左侧树信息
export async function factassetsFormulaLeftTree(params = {}) {
    const data = await httpObj.httpPost(apiList['factassetsFormulaLeftTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dimassetsFormulaLeftTree(params = {}) {
    const data = await httpObj.httpPost(apiList['dimassetsFormulaLeftTree'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 根据Formula的保存信息，生成字段信息
export async function generateFormulaColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['generateFormulaColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function DimassetsGenerateFormulaColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['DimassetsGenerateFormulaColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 字段是否被使用
export async function columnBeUsed(params = {}) {
    const data = await httpObj.httpGet(apiList['columnBeUsed'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function dimassetsColumnBeUsed(params = {}) {
    const data = await httpObj.httpGet(apiList['dimassetsColumnBeUsed'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}