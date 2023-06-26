/**
 * 剖析类型
 */
enum DissectType {
    ALL = 1,
    SPOTCHECK = 2,
}

namespace DissectType {
    export const ALL_LIST = [DissectType.ALL, DissectType.SPOTCHECK]

    export function toString(value?: DissectType) {
        switch (value) {
            case DissectType.ALL:
                return '全量'
            case DissectType.SPOTCHECK:
                return '抽样'
            default:
                return ''
        }
    }

    export function toFullString(value?: DissectType) {
        const result = DissectType.toString(value)
        if (result) {
            return `${result}剖析`
        }
        return result
    }
}
export default DissectType
