enum TimeOperatorType {
  SECTION = '区间',
  EQUAL = '等于',
  GREATER_THAN = '大于',
  GREATER_THAN_OR_EQUAL = '大于等于',
  LESS_THAN = '小于',
  LESS_THAN_OR_EQUAL = '小于等于',
}

namespace TimeOperatorType {
  export const ALL: TimeOperatorType[] = [
    TimeOperatorType.SECTION,
    TimeOperatorType.EQUAL,
    TimeOperatorType.GREATER_THAN,
    TimeOperatorType.GREATER_THAN_OR_EQUAL,
    TimeOperatorType.LESS_THAN,
    TimeOperatorType.LESS_THAN_OR_EQUAL,
  ]
  export function toString(value: TimeOperatorType) {
    switch (value) {
      case TimeOperatorType.SECTION:
        return '区间'
      default:
        return ''
    }
  }
}
export default TimeOperatorType
