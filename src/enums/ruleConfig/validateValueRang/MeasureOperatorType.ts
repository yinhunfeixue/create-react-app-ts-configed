enum MeasureOperatorType {
  SECTION = '区间',
  EQUAL = '等于',
  GREATER_THAN = '大于',
  GREATER_THAN_OR_EQUAL = '大于等于',
  LESS_THAN = '小于',
  LESS_THAN_OR_EQUAL = '小于等于',
}

namespace MeasureOperatorType {
  export const ALL: MeasureOperatorType[] = [
    MeasureOperatorType.SECTION,
    MeasureOperatorType.EQUAL,
    MeasureOperatorType.GREATER_THAN,
    MeasureOperatorType.GREATER_THAN_OR_EQUAL,
    MeasureOperatorType.LESS_THAN,
    MeasureOperatorType.LESS_THAN_OR_EQUAL,
  ]
  export function toString(value: MeasureOperatorType) {
    switch (value) {
      case MeasureOperatorType.SECTION:
        return '区间'
      default:
        return ''
    }
  }
}
export default MeasureOperatorType
