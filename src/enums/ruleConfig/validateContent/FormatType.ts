/**
 * 内容格式
 */
enum FormatType {
  PHONE = 1,
  EMAIL = 2,
  IDCARD_18 = 3,
  IDCARD_15 = 4,
}

namespace FormatType {
  export const ALL = [
    FormatType.PHONE,
    FormatType.EMAIL,
    FormatType.IDCARD_18,
    FormatType.IDCARD_15,
  ]

  export function toString(value: FormatType) {
    switch (value) {
      case FormatType.PHONE:
        return '手机号'
      case FormatType.EMAIL:
        return '邮箱'
      case FormatType.IDCARD_18:
        return '18位身份证号'
      case FormatType.IDCARD_15:
        return '15位身份证号'
      default:
        return ''
    }
  }
}
export default FormatType
