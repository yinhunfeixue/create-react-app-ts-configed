/**
 * TimingType
 */
enum TimingType {
    DAY = 1,
    WEEK = 2,
    MONTH = 3,
}

namespace TimingType {
    export const ALL = [TimingType.DAY, TimingType.WEEK, TimingType.MONTH]
    export function toString(value: TimingType) {
        switch (value) {
            case TimingType.DAY:
                return '每天'
            case TimingType.WEEK:
                return '每周'
            case TimingType.MONTH:
                return '每月'
            default:
                return ''
        }
    }
}
export default TimingType
