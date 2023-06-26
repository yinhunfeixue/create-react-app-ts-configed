enum RuleType {
  TEMPLATE = 1,
  CUSTOME = 0,
}

namespace RuleType {
  export const ALL:RuleType[] = [RuleType.TEMPLATE, RuleType.CUSTOME]

  export function toString(value?: RuleType) {
    switch (value) {
      case RuleType.TEMPLATE:
        return '规则模板'
      case RuleType.CUSTOME:
        return '自定义'
      default:
        return ''
    }
  }
}
export default RuleType
