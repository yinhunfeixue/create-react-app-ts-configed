import FieldType from '@/app/dataDissect/enum/FieldType'

/**
 * IField
 */
export default interface IField {
    columnId: number
    columnName: string
    columnTransformType?: FieldType
    columnType: string
    transformTypeConfig?: string
}
