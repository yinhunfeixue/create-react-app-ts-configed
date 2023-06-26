/**
 * ILinkInfo
 */
export default interface ILinkInfo {
    [key: string]: {
        fieldIdSet: string[]
        linkTableFiledMap: { [key: string]: string[] }
        tableId: string
    }
}
