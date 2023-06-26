/**
 * 内容格式
 */
enum SpecialType {
  CONTAIN = 1,
  NO_CONTAIN = 2,
}

namespace SpecialType {
  export const ALL = [SpecialType.CONTAIN, SpecialType.NO_CONTAIN]

  export function toString(value: SpecialType) {
    switch (value) {
      case SpecialType.CONTAIN:
        return '包含以下特殊字符'
      case SpecialType.NO_CONTAIN:
        return '不含以下特殊字符'
      default:
        return ''
    }
  }
}
export default SpecialType
