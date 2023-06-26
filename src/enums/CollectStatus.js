class CollectStatus {}

/**
 * 成功
 */
CollectStatus.SUCCESS = '0'

/**
 * 失败
 */
CollectStatus.FAIL = '1'

/**
 * 采集中
 */
CollectStatus.COLLECTING = '2'

CollectStatus.ALL = [
    CollectStatus.SUCCESS,
    CollectStatus.FAIL,
    CollectStatus.COLLECTING
]

CollectStatus.toString = (value) => {
    switch (value) {
        case CollectStatus.SUCCESS:
            return '成功'
        case CollectStatus.FAIL:
            return '失败'
        case CollectStatus.COLLECTING:
            return '采集中'
        default:
            return '未采集'
    }
}

export default CollectStatus
