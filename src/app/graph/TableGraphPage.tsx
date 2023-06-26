import { requestFieldLinkPath, requestReportListForTable, reuqestReportGraphData, reuqestTableGraphData } from '@/api/graphApi'
import DiagramItem from '@/app/graph/component/DiagramItem'
import FieldDetail from '@/app/graph/component/FieldDetail'
import FieldSelectModal from '@/app/graph/component/FieldSelectModal'
import GraphControl from '@/app/graph/component/GraphControl'
import GraphPageLayout, { IGraphPageLayoutControlParams } from '@/app/graph/component/GraphPageLayout'
import ReportDetail from '@/app/graph/component/ReportDetail'
import TableDetail from '@/app/graph/component/TableDetail'
import TableGraph from '@/app/graph/component/TableGraph'
import TableSearcher from '@/app/graph/component/TableSearcher'
import GraphTargetType from '@/app/graph/enum/GraphTargetType'
import NodePosition from '@/app/graph/enum/NodePosition'
import NodeType from '@/app/graph/enum/NodeType'
import FieldGraphPage, { IFieldGraphPageProps } from '@/app/graph/FieldGraphPage'
import G6Util from '@/app/graph/G6Util'
import IReport from '@/app/graph/interface/IReport'
import ITable from '@/app/graph/interface/ITable'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import RenderUtil from '@/utils/RenderUtil'
import TreeControl from '@/utils/TreeControl'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Empty, Menu, Select, Spin } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './TableGraphPage.less'

enum GraphType {
    table = 1,
    field = 2,
}

enum AnalyseType {
    // 全链
    ALL = 'all',
    // 溯源
    PARENT = 'parent',
    // 影响
    CHILD = 'child',
}

const analyseTypeList = [
    {
        label: '全链分析',
        value: AnalyseType.ALL,
    },
    {
        label: '溯源分析',
        value: AnalyseType.PARENT,
    },
    {
        label: '影响分析',
        value: AnalyseType.CHILD,
    },
]

interface ITableGraphPageSate {
    graphData?: ITreeNodeData<ITable>
    visibleDetail: boolean
    selectedTable?: ITable
    selectedNode?: ITreeNodeData<ITable>
    loading: boolean
    graphType: GraphType
    selectedFieldIdList: string[]
    visibleFieldSelectModal: boolean
    analyseType: AnalyseType
    visibleSearchPanel: boolean
    hideMiddleNode?: boolean
    toFieldGraphParams?: IFieldGraphPageProps

    /**
     * 全链路查看的中心表ID
     */
    tableChainTargetId?: string

    visibleFieldDetail: boolean
    selectedField?: ITable
    selectedFieldNode?: ITreeNodeData

    graphId: number
}

interface ITableGraphPageProps extends IComponentProps {
    targetId: string
    defaultToFieldGraphParams?: IFieldGraphPageProps
    targetType: GraphTargetType
}

/**
 * TableGraphPage
 */
class TableGraphPage extends Component<ITableGraphPageProps, ITableGraphPageSate> {
    private tableGraph!: TableGraph
    private fieldMap!: FieldGraphPage
    private graphControl!: GraphControl

    constructor(props: ITableGraphPageProps) {
        super(props)
        this.state = {
            visibleDetail: false,
            loading: false,
            graphType: GraphType.table,
            selectedFieldIdList: [],
            visibleFieldSelectModal: false,
            analyseType: AnalyseType.ALL,
            visibleSearchPanel: false,
            visibleFieldDetail: false,
            graphId: 0,
        }
    }

    componentDidMount() {
        this.requestData()
    }

    private requestData() {
        const { targetType } = this.props
        switch (targetType) {
            case GraphTargetType.TABLE:
                return this.requestTableGraphData()
            case GraphTargetType.REPORT:
                return this.requestReportGraphData()
            default:
                return Promise.resolve()
        }
    }

    private requestReportGraphData() {
        const id = this.centerTableId
        return reuqestReportGraphData(id).then((res) => {
            const graphData = G6Util.parseStandardTreeForReport(res.data)
            this.setState({ graphData, graphId: Date.now() })
        })
    }

    private requestTableGraphData() {
        const id = this.centerTableId

        this.setState({ loading: true })
        return Promise.all([reuqestTableGraphData(id), requestReportListForTable(id)])
            .then(([res, reportRes]: any[]) => {
                const graphData = G6Util.parseStandardTree({
                    res: res.data,
                    centerId: id,
                    reportRes: reportRes.data,
                })
                this.setState({ graphData, graphId: Date.now() })
            })
            .finally(() => {
                this.setState({ loading: false })
                const { defaultToFieldGraphParams } = this.props
                if (defaultToFieldGraphParams) {
                    this.toFieldGraph(defaultToFieldGraphParams)
                }
            })
    }

    private get centerTableId() {
        return this.props.targetId
    }

    private renderHeader() {
        const { graphData, graphType, analyseType = AnalyseType.ALL } = this.state
        if (!graphData || !graphData.extraData) {
            return null
        }
        const { datasourceCName } = graphData.extraData
        const analyseItem = analyseTypeList.find((item) => item.value === analyseType)
        return (
            <React.Fragment>
                <Dropdown
                    overlay={
                        <Menu theme='dark' selectedKeys={[analyseType]}>
                            {analyseTypeList.map((item) => {
                                return (
                                    <Menu.Item
                                        key={item.label}
                                        onClick={() => {
                                            this.setState({ analyseType: item.value, hideMiddleNode: item.value !== AnalyseType.ALL })
                                        }}
                                    >
                                        {item.label}
                                    </Menu.Item>
                                )
                            })}
                        </Menu>
                    }
                >
                    <span>
                        {analyseItem ? analyseItem.label : ''} <DownOutlined />
                    </span>
                </Dropdown>

                <span>
                    {graphData.label}-{datasourceCName}
                </span>
                <div className='GraphTypeGroup'>
                    {[
                        {
                            label: '表血缘',
                            value: GraphType.table,
                            onClick: () => this.setGraphType(GraphType.table),
                        },
                        {
                            label: '字段血缘',
                            value: GraphType.field,
                            onClick: () => {
                                // 如果是报表模式，直接切换；否则先弹窗选择字段
                                if (this.isReport) {
                                    this.toFieldGraph({})
                                } else {
                                    if (graphType !== GraphType.field) {
                                        // 选择中心表字段
                                        this.setState({ visibleFieldSelectModal: true })
                                    }
                                }
                            },
                        },
                    ].map((item) => {
                        const selected = item.value === graphType
                        return (
                            <div key={item.label} className={classNames('GraphTypeItem', selected ? 'GraphTypeItemSelected' : '')} onClick={item.onClick}>
                                {item.label}
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }

    private get isReport() {
        const { targetType } = this.props
        return targetType === GraphTargetType.REPORT
    }

    private setGraphType(value: GraphType) {
        this.setState({ graphType: value })
        this.graphControl.setZoomValue(1)
    }

    private getLeafList() {
        const { graphData } = this.state
        const treeControl = new TreeControl<ITreeNodeData<ITable>>()
        const result: ITreeNodeData<ITable>[] = []

        if (graphData) {
            treeControl.forEach([graphData], (node) => {
                const { children, isClone } = node
                const isLeaf = !isClone && (!children || !children.length)
                if (isLeaf) {
                    result.push({
                        ...node,
                        children: [],
                    })
                }
            })
        }
        return result
    }

    private renderControls(params: IGraphPageLayoutControlParams) {
        const { graphData, visibleSearchPanel, graphType, hideMiddleNode, analyseType, tableChainTargetId } = this.state
        const { isFull, fullFunction } = params
        if (!graphData) {
            return null
        }
        const children = graphData.children
        const leftIcon: any = children ? children.find((item) => item.position === NodePosition.LEFT) : {}
        const rightIcon: any = children ? children.find((item) => item.position === NodePosition.RIGHT) : {}
        // 左树
        const parentNodeList = leftIcon ? leftIcon.children : []
        // 右树
        const childNodeList = rightIcon ? rightIcon.children : []

        const leafList = this.getLeafList()
        let rightNode = <div />

        // 如果是表模式
        if (graphType === GraphType.table) {
            // 且有溯源分析，显示表名
            if (tableChainTargetId) {
                rightNode = (
                    <div className='ChainTargetWrap'>
                        <a
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                this.setState({ tableChainTargetId: undefined })
                            }}
                        >
                            <IconFont type='e635' useCss style={{ marginRight: 8 }} />
                            返回
                        </a>
                        <Select
                            showSearch
                            value={tableChainTargetId}
                            style={{ width: 120 }}
                            bordered={false}
                            placeholder='选择表'
                            onChange={(value) => {
                                this.setState({ tableChainTargetId: value })
                            }}
                            dropdownMatchSelectWidth={false}
                            filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
                        >
                            {RenderUtil.renderSelectOptionList(
                                leafList,
                                (item) => item.label,
                                (item) => item.id
                            )}
                        </Select>
                    </div>
                )
            } else if (analyseType === AnalyseType.ALL) {
                rightNode = (
                    <TableSearcher
                        visible={visibleSearchPanel}
                        onVisibleChange={(value) => this.setState({ visibleSearchPanel: value })}
                        placeholder='数据表名称'
                        parentTree={parentNodeList}
                        childTree={childNodeList}
                        centerTable={graphData}
                        onSelected={(id) => {
                            if (graphType === GraphType.table) {
                                this.tableGraph.selectItemWidthPage(id)
                            } else {
                                this.fieldMap.graph.selectItemWidthPage(id)
                            }
                            this.setState({ visibleSearchPanel: false })
                        }}
                        disableEndTable={this.isReport}
                    />
                )
            }
        }
        return (
            <React.Fragment>
                {rightNode}
                <GraphControl
                    ref={(target) => {
                        if (target) {
                            this.graphControl = target
                        }
                    }}
                    getGraph={() => {
                        if (graphType === GraphType.table) {
                            return this.tableGraph.graph
                        }
                        return this.fieldMap.graph.graph
                    }}
                    onReload={() => {
                        return this.requestData()
                    }}
                    isFull={isFull}
                    fullFunction={fullFunction}
                >
                    <DiagramItem label='上游表' color='rgba(255, 190, 127, 1)' />
                    <DiagramItem label='下游表' color='rgba(140, 217, 255, 1)' />
                    <DiagramItem label='依赖表' color='rgba(154, 161, 168, 1)' />

                    {analyseType !== AnalyseType.ALL && (
                        <>
                            <div className='hr' />
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    this.setState({ hideMiddleNode: !hideMiddleNode })
                                }}
                            >
                                {hideMiddleNode ? '显示' : '隐藏'}中间表 <IconFont className='IconButton' type={hideMiddleNode ? 'icon-xianshi1' : 'icon-yincang1'} />
                            </div>
                        </>
                    )}
                </GraphControl>
            </React.Fragment>
        )
    }

    private renderCenterFieldModal() {
        const { visibleFieldSelectModal, graphData } = this.state
        if (!graphData) {
            return null
        }
        return (
            <FieldSelectModal
                tableId={graphData.id}
                visible={visibleFieldSelectModal}
                onClose={() => this.setState({ visibleFieldSelectModal: false })}
                onChange={(value) => {
                    this.setState({
                        visibleFieldSelectModal: false,
                    })
                    this.toFieldGraph({
                        tableId: undefined,
                        middleTableId: graphData.id,
                        analyzeFieldIdList: value as unknown as string[],
                        isSuccessors: false,
                    })
                }}
            />
        )
    }

    private toFieldGraph(toFieldGraphParams: IFieldGraphPageProps) {
        this.setState({
            toFieldGraphParams,
        })
        this.setGraphType(GraphType.field)
    }

    private renderMain() {
        const { loading, graphData, graphType, toFieldGraphParams, analyseType, hideMiddleNode, tableChainTargetId, graphId } = this.state
        let content: React.ReactNode = <div />
        if (!graphData) {
            content = <Empty description={loading ? '数据加载中' : '暂无数据'} style={{ marginTop: 60 }} />
        } else {
            if (graphType === GraphType.table) {
                content = (
                    <React.Fragment>
                        <TableGraph
                            ref={(target) => {
                                if (target) {
                                    this.tableGraph = target
                                }
                            }}
                            hideMenu={Boolean(tableChainTargetId)}
                            hideMiddleNode={Boolean(hideMiddleNode)}
                            hideLeft={analyseType === AnalyseType.CHILD}
                            hideRight={analyseType === AnalyseType.PARENT}
                            key={`${analyseType}-${graphId}`}
                            className='TableGraph'
                            dataSource={graphData}
                            chainTargetId={tableChainTargetId}
                            onSelectedNode={(_, data, node) => {
                                this.setState({ visibleDetail: true, selectedTable: data, selectedNode: node })
                            }}
                            onZoomChange={(value) => {
                                this.graphControl.setZoomValue(value)
                            }}
                            onChainChange={(id) => {
                                this.setState({ tableChainTargetId: id })
                            }}
                        />
                        {this.renderCenterFieldModal()}
                    </React.Fragment>
                )
            } else {
                content = (
                    <React.Fragment>
                        {toFieldGraphParams && (
                            <FieldGraphPage
                                key={analyseType}
                                ref={(target) => {
                                    if (target) {
                                        this.fieldMap = target
                                    }
                                }}
                                graphData={this.isReport ? graphData : undefined}
                                onZoomChange={(value) => {
                                    this.graphControl.setZoomValue(value)
                                }}
                                {...toFieldGraphParams}
                                hideMiddleNode={Boolean(hideMiddleNode)}
                                hideLeft={analyseType === AnalyseType.CHILD}
                                hideRight={analyseType === AnalyseType.PARENT}
                                onFieldSelected={(value, node) => {
                                    this.setState({
                                        visibleFieldDetail: true,
                                        selectedField: value,
                                        selectedFieldNode: node,
                                    })
                                }}
                            />
                        )}
                    </React.Fragment>
                )
            }
        }

        return (
            <Spin spinning={loading} wrapperClassName='GraphSpin'>
                {content}
            </Spin>
        )
    }

    private renderRightSliderChildren = () => {
        const { selectedTable, visibleDetail, graphData, selectedNode, selectedFieldNode, graphType, visibleFieldDetail, selectedField } = this.state
        if (!graphData) {
            return
        }

        // 如果不是报表，根据图表类型判断
        switch (graphType) {
            case GraphType.table:
                if (!selectedNode) {
                    return
                }
                // 如果选中结点是报表，显示报表详情
                switch (selectedNode.nodeType) {
                    case NodeType.report:
                        return (
                            <ReportDetail
                                visible={visibleDetail}
                                data={selectedTable as IReport}
                                onClose={() => {
                                    this.setState({ visibleDetail: false })
                                    this.tableGraph.clearSelected()
                                }}
                            />
                        )
                    default:
                        return (
                            <TableDetail
                                visible={visibleDetail}
                                data={selectedTable}
                                onClose={() => {
                                    this.setState({ visibleDetail: false })
                                    this.tableGraph.clearSelected()
                                }}
                                onFieldChange={(value) => {
                                    this.setState({
                                        selectedFieldIdList: value,
                                    })

                                    this.toFieldGraph({
                                        middleTableId: graphData.id,
                                        analyzeFieldIdList: value,
                                        tableId: selectedTable && selectedTable.tableId !== graphData.id ? selectedTable.tableId : undefined,
                                        isSuccessors: selectedNode ? (selectedNode.position === NodePosition.LEFT ? true : false) : false,
                                    })
                                }}
                            />
                        )
                }

            case GraphType.field:
                if (!selectedFieldNode) {
                    return
                }
                switch (selectedFieldNode.nodeType) {
                    case NodeType.report:
                        return (
                            <ReportDetail
                                visible={visibleFieldDetail}
                                data={selectedField as IReport}
                                onClose={() => {
                                    this.setState({ visibleFieldDetail: false })
                                    this.fieldMap.graph.clearSelected()
                                    this.fieldMap.setPathList([])
                                }}
                            />
                        )
                    default:
                        return (
                            <FieldDetail
                                visible={visibleFieldDetail}
                                data={selectedField}
                                onClose={() => {
                                    this.setState({ visibleFieldDetail: false })
                                    this.fieldMap.graph.clearSelected()
                                    this.fieldMap.setPathList([])
                                }}
                                onPathFieldChange={async (tableId, fieldId) => {
                                    // 获取字段列表
                                    // 修改字段数据
                                    if (tableId && fieldId) {
                                        return requestFieldLinkPath(tableId, fieldId).then((res) => {
                                            this.fieldMap.setPathList(res.data)
                                        })
                                    } else {
                                        this.fieldMap.setPathList([])
                                    }
                                }}
                            />
                        )
                }

            default:
                return null
        }
    }

    render(): React.ReactNode {
        const { style, className } = this.props
        return (
            <GraphPageLayout
                style={style}
                className={classNames('TableGraphPage', className)}
                headerChildren={this.renderHeader()}
                renderControlChildren={(params) => this.renderControls(params)}
                mainChildren={this.renderMain()}
                renderRightSliderChildren={this.renderRightSliderChildren}
            />
        )
    }
}

export default TableGraphPage
