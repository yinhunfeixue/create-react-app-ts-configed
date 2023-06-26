/**
 * DimType
 */
enum DimType {
    SYSTEM = 2,
    DATASOURCE = 3,
}

namespace DimType {
    export function toString(value: DimType) {
        switch (value) {
            case DimType.SYSTEM:
                return '系统'
            case DimType.DATASOURCE:
                return '数据源'
            default:
                return ''
        }
    }
}
export default DimType
