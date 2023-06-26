/**
 * 是否包含英文
 */
enum ContainEnglishType {
  ONLY = 1,
  NO = 2,
}

namespace ContainEnglishType {
  export const ALL = [ContainEnglishType.ONLY, ContainEnglishType.NO]

  export function toString(value: ContainEnglishType) {
    switch (value) {
      case ContainEnglishType.ONLY:
        return '只含英文'
      case ContainEnglishType.NO:
        return '不含英文'
      default:
        return ''
    }
  }
}
export default ContainEnglishType
