import DissectType from '@/app/dataDissect/enum/DissectType'
import SpotCheckType from '@/app/dataDissect/enum/SpotCheckType'
import IField from '@/app/dataDissect/interface/IField'
import { Key } from 'react'

/**
 * 剖析分析的设置数据
 */
export default interface IDissectSetting {
    target: {
        databaseId?: string

        databaseName?: string

        datasourceId?: string

        datasourceName?: string

        tableId?: string

        tableName?: string

        /**
         * 数据库类型
         */
        product?: string
    }

    /**
     * 剖析方式
     */
    analysisType: DissectType

    /**
     * 抽样方式
     */
    samplingType: SpotCheckType

    /**
     * 抽样数量-连续抽样时有效
     */
    spotNumber?: number

    /**
     * 抽样SQL-过滤抽样时有效
     */
    spotSql?: string

    /**
     * 抽样字段
     */
    columnConfigList?: IField[]

    latelyAnalysisRecordId?: Key
}
