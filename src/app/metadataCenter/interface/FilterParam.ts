/**
 * 过滤参数
 */
export default interface IFilterParam {
    canChoose: boolean
    count: number
    defaultChoose: boolean
    id: string
    name: string
    seq: number
    type: string
    value: string
    children?: IFilterParam[]
}

export interface IFilterParamTree {
    filterName: string
    choiceType?: 0 | 1
    icon?: string
    filterNodes: IFilterParam[]
    filterPosition: 1 | 2
    position: number
    isTree?: boolean
}
