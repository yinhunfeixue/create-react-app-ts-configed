/**
 * ErDisplayLevel
 */
enum ErDisplayLevel {
    TABLE = 1,
    IMPORTANT = 2,
    ALL = 3,
}

namespace ErDisplayLevel {
    export const ALL_LIST: ErDisplayLevel[] = [ErDisplayLevel.ALL, ErDisplayLevel.IMPORTANT, ErDisplayLevel.TABLE]
    export function toString(value: ErDisplayLevel) {
        switch (value) {
            case ErDisplayLevel.ALL:
                return '全部字段'
            case ErDisplayLevel.IMPORTANT:
                return '仅主、外、分区字段'
            case ErDisplayLevel.TABLE:
                return '仅显示表'
            default:
                return ''
        }
    }
}
export default ErDisplayLevel
