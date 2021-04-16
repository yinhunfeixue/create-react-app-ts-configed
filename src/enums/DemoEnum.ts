/**
 * DemoEnum
 */
enum DemoEnum {
  UNKNOW,
}

namespace DemoEnum {
  export function toString(value: DemoEnum) {
    switch (value) {
      case DemoEnum.UNKNOW:
        return '通过';
      default:
        return '';
    }
  }
}
export default DemoEnum;
