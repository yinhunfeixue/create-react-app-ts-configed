/**
 * 检核依据
 */
enum CheckGist {
  /**
   * 监管要求
   */
  REGULATORY = '1',

  /**
   * 同行经验
   */
  EXPERIENCE = '2',
}

namespace CheckGist {
  export const ALL:CheckGist[] = [CheckGist.REGULATORY, CheckGist.EXPERIENCE]
  
  export function toString(value?: CheckGist) {
    switch (value) {
      case CheckGist.REGULATORY:
        return '监管要求'
      case CheckGist.EXPERIENCE:
        return '同行经验'
      default:
        return ''
    }
  }
}
export default CheckGist
