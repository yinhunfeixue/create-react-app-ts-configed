import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'

/**
 * IPageNodeData
 */
export default interface IPageNodeData<T> extends ITreeNodeData<T> {
    current: number
    parentId: string
    dataSource: ITreeNodeData<T>[]
}
