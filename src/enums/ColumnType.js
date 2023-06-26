class ColumnType {}

/**
 * 度量
 */
ColumnType.MEASURE = 1

/**
 * 维度
 */
ColumnType.DIMENSION = 2

/**
 * 时间
 */
ColumnType.TIME = 3

ColumnType.ALL = [ColumnType.MEASURE, ColumnType.DIMENSION, ColumnType.TIME]

ColumnType.toString = (value) => {
    switch (value) {
        case ColumnType.MEASURE:
            return '度量'
        case ColumnType.DIMENSION:
            return '维度'
        case ColumnType.TIME:
            return '时间'
        default:
            return '-'
    }
}

export default ColumnType
