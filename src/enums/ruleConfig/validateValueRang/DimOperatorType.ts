enum DimOperatorType {
  CONTAINS = '包含',
  UN_CONTAINS = '不包含',
  NOT_NULL = '非空',
}

namespace DimOperatorType {
  export const ALL: DimOperatorType[] = [
    DimOperatorType.CONTAINS,
    DimOperatorType.UN_CONTAINS,
    DimOperatorType.NOT_NULL,
  ]
}
export default DimOperatorType
