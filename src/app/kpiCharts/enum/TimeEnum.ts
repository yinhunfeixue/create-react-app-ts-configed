/**
 * TimeEnum
 */
enum TimeEnum {
    DAY = 1,
    WEEK = 2,
    MONTH = 3,
    QUARTER = 4,
    YEAR = 5,
}

namespace TimeEnum {
    export function toString(value: TimeEnum) {
        switch (value) {
            case TimeEnum.DAY:
                return '日'
            case TimeEnum.WEEK:
                return '周'
            case TimeEnum.MONTH:
                return '月'
            case TimeEnum.QUARTER:
                return '季'
            case TimeEnum.YEAR:
                return '年'
            default:
                return ''
        }
    }
}
export default TimeEnum
