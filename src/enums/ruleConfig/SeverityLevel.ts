/**
 * 严重等级
 */
enum SeverityLevel {
  NORMAL = 1,
  SERIOUS = 2,
}

namespace SeverityLevel {
  export const ALL = [SeverityLevel.NORMAL, SeverityLevel.SERIOUS]

  export function toString(value?: SeverityLevel) {
    switch (value) {
      case SeverityLevel.NORMAL:
        return '普通'
      case SeverityLevel.SERIOUS:
        return '严重'
      default:
        return ''
    }
  }
}
export default SeverityLevel
