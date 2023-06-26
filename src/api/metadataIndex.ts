import MetaDataType from '@/app/metadataCenter/enum/MetaDataType';
import IFilterParam from '@/app/metadataCenter/interface/FilterParam';
import { httpObj } from './base';

export async function requestMetaDataList(data: { domain: MetaDataType; preciseSearch: boolean; pageSize: number; page: number; keyword?: string; filterNodes?: IFilterParam[] }) {
    const res = await httpObj.httpPost(`/quantchiAPI/api/dwapp/search/homepage`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestFilterList(data: { domain: MetaDataType; preciseSearch: boolean; keyword?: string; filterNodes?: IFilterParam[] }) {
    const res = await httpObj.httpPost(`/quantchiAPI/api/dwapp/search/filters`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestGraphData(id: string, type: MetaDataType) {
    let url = ''
    switch (type) {
        case MetaDataType.REPORT:
            url = `/quantchiAPI/er/graph/report/${id}`
            break

        default:
            url = `/quantchiAPI/er/graph/table/${id}`
            break
    }

    const res = await httpObj.httpGet(url)
    if (res == undefined) {
        return false
    }
    return res.data
}
