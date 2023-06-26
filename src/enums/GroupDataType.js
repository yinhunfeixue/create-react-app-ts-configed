class GroupDataType { }

/**
 * 模型
 */
GroupDataType.MODEL = 0

/**
 * 数据集
 */
GroupDataType.DATASET = 1

/**
 * csv
 */
GroupDataType.CSV = 2

/**
 * 系统表
 */
GroupDataType.SYSTEM_TABLE = 3

/**
 * 分析数据集
 */
GroupDataType.ANALYSIS_DATASET = 4

/**
 * 中间结果集
 */
GroupDataType.MIDDLE_RESULT_TABLE = 5

/**
 * 中间结果集
 */
GroupDataType.ETL = 6
/**
 * SQL表
 */
GroupDataType.SQL = 8

GroupDataType.dataAsset = 9

GroupDataType.ALL = [
    // GroupDataType.MODEL,
    // GroupDataType.DATASET,
    GroupDataType.CSV,
    GroupDataType.SYSTEM_TABLE,
    // GroupDataType.ANALYSIS_DATASET,
    GroupDataType.MIDDLE_RESULT_TABLE,
    GroupDataType.ETL,
    GroupDataType.SQL,
    GroupDataType.dataAsset
]

GroupDataType.toString = (value) => {
    switch (value) {
        case GroupDataType.MODEL:
            return '模型'
        case GroupDataType.DATASET:
            return '数据集'
        case GroupDataType.CSV:
            return 'csv'
        case GroupDataType.SYSTEM_TABLE:
            return '系统表'
        case GroupDataType.ANALYSIS_DATASET:
            return '分析数据集'
        case GroupDataType.MIDDLE_RESULT_TABLE:
            return '中间结果表'
        case GroupDataType.ETL:
            return 'ETL数据集'
        case GroupDataType.SQL:
            return 'SQL数据集'
        case GroupDataType.dataAsset:
            return '数据集模板'
        default:
            return ''
    }
}

export default GroupDataType
