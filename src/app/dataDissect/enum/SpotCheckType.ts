/**
 * 抽样方式
 */
enum SpotCheckType {
    CONTINUOUS = 1,
    FILTER = 2,
}

namespace SpotCheckType {
    export function toString(value: SpotCheckType) {
        switch (value) {
            case SpotCheckType.CONTINUOUS:
                return '连续抽样'
            case SpotCheckType.FILTER:
                return '过滤抽样'
            default:
                return ''
        }
    }
}
export default SpotCheckType
