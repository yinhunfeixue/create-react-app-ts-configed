import { reuqestDataSourceMap } from '@/api/graphApi'
import DataSourceDetail from '@/app/graph/component/DataSourceDetail'
import DataSourceMap, { IDataSourceMapData } from '@/app/graph/component/DataSourceMap'
import DiagramItem from '@/app/graph/component/DiagramItem'
import GraphPageLayout, { IGraphPageLayoutControlParams } from '@/app/graph/component/GraphPageLayout'
import SearchPanel from '@/app/graph/component/SearchPanel'
import IDataSource from '@/app/graph/interface/IDataSource'
import IconFont from '@/component/IconFont'
import { GraphData, NodeConfig } from '@antv/g6'
import { Empty, Spin } from 'antd'
import React, { Component } from 'react'
import GraphControl from './component/GraphControl'
import './DataMapPage.less'

interface IDataMapPageState {
    dataSource: GraphData
    loading: boolean

    searchKey: string
    searchOption: { label: string; value: any; data: any }[]
    visibleSingeNode: boolean

    visibleDetail: boolean
    selectedDataSourceId?: string
    selectedDataSource?: NodeConfig
    graphKey?: string

    visibleSearchPanel: boolean
}

/**
 * DataMapPage
 */
class DataMapPage extends Component<any, IDataMapPageState> {
    private dataSourceMap!: DataSourceMap
    private graphControl!: GraphControl
    constructor(props: any) {
        super(props)
        this.state = {
            dataSource: [],
            loading: false,
            searchKey: '',
            searchOption: [],
            visibleSingeNode: true,
            visibleDetail: false,
            visibleSearchPanel: false,
        }
    }

    componentDidMount() {
        this.requestData()
    }

    private requestData(): Promise<void> {
        this.setState({ loading: true })
        return reuqestDataSourceMap()
            .then((res) => {
                return this.parseData(res)
            })
            .finally(() => {
                this.setState({ loading: false, graphKey: Date.now().toString() })
            })
    }

    private parseData(res: any): Promise<void> {
        return new Promise((resolve) => {
            const { datasourceInfo, datasourceLink } = res.data
            if (!datasourceInfo || !datasourceLink) {
                this.setState({ dataSource: [] })
                return
            }

            const dataSource: IDataSourceMapData = {
                nodes: [],
                edges: [],
            }

            const { nodes, edges } = dataSource

            for (let key in datasourceInfo) {
                const item: IDataSource = datasourceInfo[key]
                const { datasourceId, datasourceCName, lineageTableCount } = item
                nodes.push({
                    id: datasourceId ? datasourceId.toString() : '',
                    label: datasourceCName || '',
                    count: lineageTableCount,
                })
            }
            for (let key in datasourceLink) {
                const item = datasourceLink[key]
                for (let targetId of item) {
                    edges.push({
                        source: key.toString(),
                        target: targetId.toString(),
                    })
                }
            }
            this.setState({ dataSource }, () => resolve())
        })
    }

    private renderControls(params: IGraphPageLayoutControlParams) {
        const { dataSource, searchOption, visibleSingeNode, visibleSearchPanel } = this.state
        const { nodes } = dataSource
        const { isFull, fullFunction } = params
        return (
            <React.Fragment>
                <SearchPanel
                    visible={visibleSearchPanel}
                    onVisibleChange={(value) => this.setState({ visibleSearchPanel: value })}
                    placeholder='数据源名称'
                    onSearch={(value: string) => {
                        let searchOption: any[] = []
                        if (value) {
                            // 通过关键词过滤数据源
                            searchOption = nodes
                                ? nodes
                                      .filter((item) => {
                                          const { label } = item
                                          if (label) {
                                              return (label as string).includes(value)
                                          }
                                          return false
                                      })
                                      .map((item) => {
                                          return {
                                              label: item.label,
                                              value: item.id,
                                              data: item,
                                          }
                                      })
                                : []
                        }

                        this.setState({ searchKey: value, searchOption })
                    }}
                >
                    {searchOption.map((item) => {
                        return (
                            <div
                                className='DataSourceItem'
                                onClick={() => {
                                    const { value, data } = item
                                    // 焦点移到图表的指点结点
                                    if (this.dataSourceMap) {
                                        this.dataSourceMap.selectItem(value)
                                    }
                                    this.setState({ visibleDetail: true, selectedDataSourceId: value, selectedDataSource: data, visibleSearchPanel: false })
                                }}
                                key={item.value}
                            >
                                {item.label}
                            </div>
                        )
                    })}
                </SearchPanel>
                <GraphControl
                    isFull={isFull}
                    fullFunction={fullFunction}
                    getGraph={() => {
                        return this.dataSourceMap.graph
                    }}
                    onReload={() => this.requestData()}
                    ref={(target) => {
                        if (target) {
                            this.graphControl = target
                        }
                    }}
                >
                    {[
                        {
                            color: 'rgba(42, 149, 255, 1)',
                            label: '关联系统',
                        },
                        {
                            color: 'rgba(145, 66, 255, 1)',
                            label: '游离系统',
                        },
                    ].map((item) => {
                        return <DiagramItem key={item.label} label={item.label} color={item.color} />
                    })}
                    <div className='hr' />
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            this.setState({ visibleSingeNode: !visibleSingeNode })
                            this.dataSourceMap.visibleSingeNode(!visibleSingeNode)
                        }}
                    >
                        {visibleSingeNode ? '隐藏' : '显示'}游离系统 <IconFont type={visibleSingeNode ? 'icon-xianshi1' : 'icon-yincang1'} />
                    </div>
                </GraphControl>
            </React.Fragment>
        )
    }

    private renderMain() {
        const { dataSource, visibleDetail, selectedDataSourceId, selectedDataSource } = this.state

        return (
            <React.Fragment>
                <DataSourceMap
                    ref={(target) => {
                        if (target) {
                            this.dataSourceMap = target
                        }
                    }}
                    onNodeClick={(item) => {
                        this.setState({ visibleDetail: true, selectedDataSourceId: item.id, selectedDataSource: item })
                    }}
                    dataSource={dataSource as any}
                    className='DataSourceMap'
                    onZoomChange={(value) => {
                        this.graphControl.setZoomValue(value)
                    }}
                />
                <DataSourceDetail
                    node={selectedDataSource}
                    key={selectedDataSourceId || ''}
                    id={selectedDataSourceId || ''}
                    visible={visibleDetail}
                    onClose={() => this.setState({ visibleDetail: false })}
                />
            </React.Fragment>
        )
    }

    private get hasGraphData() {
        const { dataSource } = this.state
        return dataSource && dataSource.nodes && dataSource.nodes.length
    }

    render(): React.ReactNode {
        const { loading, graphKey } = this.state
        const hasGraphData = this.hasGraphData

        if (!hasGraphData) {
            return loading ? (
                <Spin spinning style={{ marginTop: 60 }}>
                    <div />
                </Spin>
            ) : (
                <Empty description='暂无数据' style={{ marginTop: 60 }} />
            )
        }
        return (
            <Spin spinning={loading} wrapperClassName='DataMapPageSpin'>
                <GraphPageLayout key={graphKey} className='DataMapPage' renderControlChildren={(params) => this.renderControls(params)} mainChildren={this.renderMain()} />
            </Spin>
        )
    }
}

export default DataMapPage
