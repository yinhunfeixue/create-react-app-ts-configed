/**
 * ChartType
 */
enum ChartType {
    /**
     * 折线
     */
    LINE = 1,
    /**
     * 多值折线
     */
    LINE_MUL = 2,
    /**
     * 双Y折线
     */
    LINE_DOUBLE_Y = 3,

    /**
     * 柱
     */
    BAR = 4,
    /**
     * 多值柱
     */
    BAR_MUL = 5,
    /**
     * 分组柱,todo
     */
    BAR_GROUP = 6,

    /**
     * 条
     */
    HBAR = 7,
    /**
     * 多值条
     */
    HBAR_MUL = 8,
    /**
     * 分组条, todo
     */
    HBAR_GROUP = 9,

    /**
     * 堆叠条形图
     */
    HBAR_HEAP_UP = 13,

    /**
     * 饼
     */
    PIE = 10,
    /**
     * 嵌套饼图
     */
    PIE_NEST = 11,

    /**
     * 多值饼
     */
    PIE_MUL = 12,
}

export default ChartType
