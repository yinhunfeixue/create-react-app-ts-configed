/**
 * ICommonCondition
 */
export default interface ICommonCondition {
    id: string
    name: string
    dataSource: {
        value: string
        label: string
    }[]
}
