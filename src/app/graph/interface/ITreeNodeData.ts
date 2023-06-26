import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import { TreeGraphData } from '@antv/g6'

export default interface ITreeNodeData<T = any> extends TreeGraphData {
    children?: ITreeNodeData<T>[]
    position: NodePosition
    nodeType?: NodeType
    extraData?: T
    isClone?: boolean
}
