import { httpObj } from './base'

export async function requestTopicList() {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryTheme`)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestEditTopic(data) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/editTheme`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestSortTopic(themeIdList) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/sortTheme`, themeIdList)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestAddTopic(data) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/createTheme`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDeleteTopic(id) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/deleteThemeById`, { themeId: id })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestBoardList(topicId) {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryPanelsByTheme`, { themeId: topicId })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestSortBoards(topicId, boardList) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/updatePanelOrder`, {
        panelUpdateOrderDtos: boardList,
        // [
        //     {
        //         order,
        //         panelId: boardId,
        //     },
        // ],
        themeId: topicId,
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestRankList(data) {
    const res = await httpObj.httpGet(`service-qa/dataIndexVisual/queryRankInfo`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestPreviewRankList(data) {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryRankDataPreview`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestBoardSettingList(topicId) {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryPanelOptions`, { themeId: topicId })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestBoardTypeList(type) {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryPanelTypeList`, { type })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDimValueList(type, rangeType) {
    const res = await httpObj.httpGet(`/service-qa/dataIndexVisual/queryRangeList`, { type, rangeType })
    if (res == undefined) {
        return false
    }
    return res.data
}

/**
 *
 * @param {{name, panelTypeId, statPeriod, statRange, rangeIdList，graphSelectList}} data
 * @returns
 */
export async function requestBoardPreview(data) {
    const res = await httpObj.httpPost(`/service-qa/dataIndexVisual/panelPreview`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}
