enum TestEnum {
  UNKNOW
}

namespace TestEnum {
  export function toString(value: TestEnum) {
    switch (value) {
      case TestEnum.UNKNOW:
        return '通过';
      default:
        return '';
    }
  }
}
export default TestEnum;
