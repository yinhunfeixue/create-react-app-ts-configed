/**
 * 搜索对象
 */
enum MetaDataType {
    /**
     * 物理表
     */
    PHYSICAL_TABLE = 'table',

    /**
     * SQL
     */
    SQL = 'lineageFile',

    /**
     * 报表
     */
    REPORT = 'externalReports',

    /**
     * 字段
     */
    FIELD = 'column',

    /**
     * 物理模型
     */
    PHYSICAL_MODEL = 'model',
}

namespace MetaDataType {
    export const ALL: MetaDataType[] = [MetaDataType.PHYSICAL_TABLE, MetaDataType.SQL, MetaDataType.REPORT, MetaDataType.FIELD, MetaDataType.PHYSICAL_MODEL]

    export function toString(value: MetaDataType) {
        const dic: { [key in MetaDataType]: string } = {
            [MetaDataType.PHYSICAL_TABLE]: '物理表',
            [MetaDataType.SQL]: 'SQL脚本',
            [MetaDataType.REPORT]: '报表',
            [MetaDataType.FIELD]: '字段',
            [MetaDataType.PHYSICAL_MODEL]: '物理模型',
        }
        return dic[value] || ''
    }

    export function icon(value: MetaDataType) {
        const dic: { [key in MetaDataType]: string } = {
            [MetaDataType.PHYSICAL_TABLE]: 'icon-wulibiao',
            [MetaDataType.SQL]: 'icon-jiaoben',
            [MetaDataType.REPORT]: 'icon-baobiao',
            [MetaDataType.FIELD]: 'icon-a-bianzu3',
            [MetaDataType.PHYSICAL_MODEL]: 'icon-moxingfill',
        }
        return dic[value] || ''
    }
}
export default MetaDataType
