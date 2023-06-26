/**
 * FieldType
 */
enum FieldType {
    TEXT = 1,
    INT = 2,
    FLOAT = 3,
    DATE = 4,
    TIME = 5,
}

namespace FieldType {
    export const ALL = [FieldType.TEXT, FieldType.INT, FieldType.FLOAT, FieldType.TIME, FieldType.DATE]

    export function toString(value?: FieldType) {
        const dic: { [key in FieldType]: string } = {
            [FieldType.TEXT]: '文本',
            [FieldType.INT]: '整数',
            [FieldType.FLOAT]: '小数',
            [FieldType.TIME]: '时间',
            [FieldType.DATE]: '日期',
        }
        return dic[value as FieldType] || ''
    }

    export function toColor(value?: FieldType) {
        const dic: { [key in FieldType]: string } = {
            [FieldType.TEXT]: '#51A1FF',
            [FieldType.INT]: '#686EE2',
            [FieldType.FLOAT]: '#686EE2',
            [FieldType.TIME]: '#50E3C2',
            [FieldType.DATE]: '#50E3C2',
        }
        return dic[value as FieldType] || '#999'
    }
}

export default FieldType
