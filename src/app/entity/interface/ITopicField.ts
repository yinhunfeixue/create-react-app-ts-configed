import { Key } from 'react'

/**
 * 主题域
 */
export default interface ITopicField {
    id: string
    name: string
    englishName: string
    hasChild: boolean
    treeId?: Key
    businessTag?: number
    level: number
    securityLevel?: number
    parentId?: Key
    childNodeCount?: number
    businessDepartmentId?: Key
    businessManagerId?: Key
}
