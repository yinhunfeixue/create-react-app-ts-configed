/**
 * 是否包含数字
 */
enum ContainNumberType {
  ONLY = 1,
  NO = 2,
}

namespace ContainNumberType {
  export const ALL = [ContainNumberType.ONLY, ContainNumberType.NO]

  export function toString(value: ContainNumberType) {
    switch (value) {
      case ContainNumberType.ONLY:
        return '只含数字'
      case ContainNumberType.NO:
        return '不含数字'
      default:
        return ''
    }
  }
}
export default ContainNumberType
