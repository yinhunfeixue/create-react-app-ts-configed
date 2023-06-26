import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'

/**
 * IMiddleTableNode
 */
export default interface IMiddleTableNode<T> extends ITreeNodeData<T> {
    current: number
    dataSource: ITreeNodeData<T>[]
}
