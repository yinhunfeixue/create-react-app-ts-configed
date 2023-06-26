import { requestFieldGraphData, requestReportListForTable, reuqestTableGraphData } from '@/api/graphApi'
import FieldGraph from '@/app/graph/component/FieldGraph'
import G6Util from '@/app/graph/G6Util'
import ITable from '@/app/graph/interface/ITable'
import ITreeGraphRes, { IReportForTableGraphRes } from '@/app/graph/interface/ITreeGraphRes'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import TreeControl from '@/utils/TreeControl'
import { Empty } from 'antd'
import React, { Component } from 'react'

interface IFieldGraphPageSate {
    res?: any
    graphData?: ITreeNodeData<ITable>
    loading: boolean
    fieldIdList: string[]
}
export interface IFieldGraphPageProps {
    tableId?: string
    middleTableId: string
    analyzeFieldIdList: string[]
    isSuccessors: boolean

    onZoomChange?: (value: number) => void
    hideMiddleNode?: boolean
    hideLeft?: boolean
    hideRight?: boolean

    onFieldSelected?: (selectedField: ITable, selectedNode: ITreeNodeData) => void

    graphData?: ITreeNodeData<ITable>
}

/**
 * FieldGraphPage
 */
class FieldGraphPage extends Component<IFieldGraphPageProps, IFieldGraphPageSate> {
    public graph!: FieldGraph
    constructor(props: IFieldGraphPageProps) {
        super(props)
        this.state = {
            loading: false,
            fieldIdList: [],
        }
    }

    componentDidMount() {
        this.requestData()
    }

    private async requestData() {
        // 如果，传入了图表数据，直接使用；
        // 否则，没有tableId，使用表血缘接口；否则，使用字段血缘接口
        let { tableId, middleTableId, analyzeFieldIdList, isSuccessors, graphData } = this.props
        if (graphData) {
            this.setState({ graphData })
            return;
        }
        
        this.setState({ loading: true })
        if (!tableId) {
            // 未选择目标表，中心表自身的字段图
            await Promise.all([reuqestTableGraphData(middleTableId, analyzeFieldIdList), requestReportListForTable(middleTableId)]).then(([res, reportRes]) => {
                this.parseRes(res.data, reportRes.data)
            })
        } else {
            // 选择了目标表时，获取中心表到此表的字段图
            await Promise.all([requestFieldGraphData(tableId, middleTableId, analyzeFieldIdList, isSuccessors), requestReportListForTable(middleTableId)]).then(([res, reportRes]) => {
                this.parseRes(res.data, reportRes.data)
            })
        }
        this.setState({ loading: false })
    }

    private parseRes(res: ITreeGraphRes, reportRes: IReportForTableGraphRes) {
        const { middleTableId } = this.props
        if (res) {
            const graphData = G6Util.parseStandardTree({
                res,
                centerId: middleTableId,
                reportRes,
            })
            this.setState({ graphData })
        }
    }

    public setPathList(fieldIdList: string[]) {
        this.setState({ fieldIdList }, () => this.updatePath())
    }

    private updatePath() {
        const { fieldIdList } = this.state
        const displayTree = this.graph.state.displayTree
        if (!displayTree) {
            return
        }
        const selectedFieldList: string[] = fieldIdList || []
        const selectedFieldDic = {}
        selectedFieldList.forEach((item) => {
            selectedFieldDic[item] = true
        })
        const treeControl = new TreeControl<ITreeNodeData<ITable>>()
        treeControl.forEach([displayTree], (node) => {
            // 如果存在字段，循环所有字段，并设置标记状态
            if (node.extraData) {
                const { fields } = node.extraData
                if (fields) {
                    fields.forEach((fieldItem) => {
                        fieldItem.mark = Boolean(selectedFieldDic[fieldItem.fieldId])
                    })
                }
            }
        })
        this.graph.refresh()
    }

    render() {
        const { graphData, loading } = this.state
        const { hideMiddleNode, hideLeft, hideRight, onZoomChange, onFieldSelected } = this.props
        if (!graphData) {
            return <Empty description={loading ? '数据加载中' : '暂无数据'} style={{ marginTop: 60 }} />
        }

        return (
            <div style={{ height: '100%' }}>
                <FieldGraph
                    hideMiddleNode={Boolean(hideMiddleNode)}
                    hideLeft={hideLeft}
                    hideRight={hideRight}
                    ref={(target) => {
                        if (target) {
                            this.graph = target
                        }
                    }}
                    dataSource={graphData}
                    style={{ height: '100%' }}
                    onSelectedNode={(_, data, node) => {
                        this.setState({ fieldIdList: [] }, () => this.updatePath())
                        if (onFieldSelected) {
                            onFieldSelected(data, node)
                        }
                    }}
                    onZoomChange={onZoomChange}
                    onPageChange={() => {
                        return this.updatePath()
                    }}
                />
            </div>
        )
    }
}

export default FieldGraphPage
