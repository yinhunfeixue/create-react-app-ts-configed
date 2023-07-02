/**
 * ElementType
 */
enum ElementType {
  UNKNOW,
}

namespace ElementType {
  export function toString(value: ElementType) {
    switch (value) {
      case ElementType.UNKNOW:
        return '通过';
      default:
        return '';
    }
  }
}
export default ElementType;
