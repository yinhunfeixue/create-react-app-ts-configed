class RelateType {}

/**
 * 原始表指向关联表
 */
RelateType.TO_RELATE_TABLE = 1

/**
 * 关联表指向原始表
 */
RelateType.TO_SOURCE_TABLE = 2

RelateType.ALL = [RelateType.TO_RELATE_TABLE, RelateType.TO_SOURCE_TABLE]

RelateType.toString = (value) => {
    switch (value) {
        case RelateType.TO_RELATE_TABLE:
            return '原始表指向关联表'
        case RelateType.TO_SOURCE_TABLE:
            return '关联表指向原始表'
        default:
            return ''
    }
}

export default RelateType
