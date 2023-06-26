enum ValidateLengthOperatorType {
  SECTION = '区间',
  EQUAL = '等于',
  GREATER_THAN = '大于',
  GREATER_THAN_OR_EQUAL = '大于等于',
  LESS_THAN = '小于',
  LESS_THAN_OR_EQUAL = '小于等于',
}

namespace ValidateLengthOperatorType {
  export const ALL: ValidateLengthOperatorType[] = [
    ValidateLengthOperatorType.SECTION,
    ValidateLengthOperatorType.EQUAL,
    ValidateLengthOperatorType.GREATER_THAN,
    ValidateLengthOperatorType.GREATER_THAN_OR_EQUAL,
    ValidateLengthOperatorType.LESS_THAN,
    ValidateLengthOperatorType.LESS_THAN_OR_EQUAL,
  ]
  export function toString(value: ValidateLengthOperatorType) {
    switch (value) {
      case ValidateLengthOperatorType.SECTION:
        return '区间'
      default:
        return ''
    }
  }
}
export default ValidateLengthOperatorType
