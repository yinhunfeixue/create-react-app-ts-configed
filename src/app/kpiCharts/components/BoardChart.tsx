import { requestPreviewRankList, requestRankList } from '@/api/kpiChartApi'
import IChartSetting from '@/app/kpiCharts/chartSetting/IChartSetting'
import BarMulSetting from '@/app/kpiCharts/chartSetting/settins/BarMulSetting'
import BarSetting from '@/app/kpiCharts/chartSetting/settins/BarSetting'
import HBarHeapUpSetting from '@/app/kpiCharts/chartSetting/settins/HBarHeapUpSetting'
import HBarMulSetting from '@/app/kpiCharts/chartSetting/settins/HBarMulSetting'
import HBarSetting from '@/app/kpiCharts/chartSetting/settins/HBarSetting'
import LineDoubleYSetting from '@/app/kpiCharts/chartSetting/settins/LineDoubleYSetting'
import LineMulSetting from '@/app/kpiCharts/chartSetting/settins/LineMulSetting'
import LineSetting from '@/app/kpiCharts/chartSetting/settins/LineSetting'
import PieMulSetting from '@/app/kpiCharts/chartSetting/settins/PieMulSetting'
import PieNestSetting from '@/app/kpiCharts/chartSetting/settins/PieNestSetting'
import PieSetting from '@/app/kpiCharts/chartSetting/settins/PieSetting'
import Theme from '@/app/kpiCharts/chartSetting/Theme'
import { IBoardChart } from '@/app/kpiCharts/interface/IBoard'
import IBoardSetting from '@/app/kpiCharts/interface/IBoardSetting'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import { Chart } from '@antv/g2_4'
import { Empty, Modal, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { Component } from 'react'
import './BoardChart.less'

interface IBoardChartState {
    visibleRank: boolean
    columns: string[]
    rankList: string[][]
    chartHeight: number
}
interface IBoardChartProps extends IComponentProps {
    data: IBoardChart
    setting: IBoardSetting
}

/**
 * BoardChart
 */
class BoardChart extends Component<IBoardChartProps, IBoardChartState> {
    private containerRef = React.createRef<HTMLDivElement>()
    public settingList: IChartSetting[] = [
        new LineSetting(),
        new LineMulSetting(),
        new LineDoubleYSetting(),

        new BarSetting(),
        new BarMulSetting(),

        new HBarSetting(),
        new HBarMulSetting(),
        new HBarHeapUpSetting(),

        new PieNestSetting(),
        new PieSetting(),
        new PieMulSetting(),
    ]

    constructor(props: IBoardChartProps) {
        super(props)
        this.state = {
            visibleRank: false,
            columns: [],
            rankList: [],
            chartHeight: this.parsetHeight(),
        }
    }

    componentDidMount() {
        this.renderChart()
    }

    private async renderChart() {
        const container = this.containerRef.current
        if (!container) {
            return
        }

        if (!this.canParse()) {
            return
        }

        const { data } = this.props
        const chart = new Chart({
            container,
            autoFit: true,
        })

        new Theme().install(chart)
        this.parseType(chart, data)
        chart.render()
    }

    private parsetHeight() {
        const { data } = this.props
        const { baseGraphId } = this.props.data
        const instance = this.settingList.find((item) => item.match(baseGraphId))
        if (instance) {
            if (instance.height) {
                return instance.height(data)
            }
        }
        return 320
    }

    private parseType(chart: Chart, data: IBoardChart) {
        const { baseGraphId } = data
        const instance = this.settingList.find((item) => item.match(baseGraphId))
        if (instance) {
            instance.setting(chart, data)
        }
    }

    private canParse() {
        const { baseGraphId } = this.props.data
        const instance = this.settingList.find((item) => item.match(baseGraphId))
        return Boolean(instance)
    }

    private showRankList() {
        const { data, setting } = this.props
        let promise: Promise<any>
        if (setting.id) {
            promise = requestRankList({
                graphTypeId: data.graphTypeId,
                panelDetailId: setting.id,
            })
        } else {
            promise = requestPreviewRankList({
                graphTypeId: data.graphTypeId,
                panelTypeId: setting.panelTypeId,
                statPeriod: setting.statPeriod,
                statRange: setting.statRange,
                rangeIdList: setting.rangeIdList,
            })
        }

        promise.then((res) => {
            const data = res.data
            if (data) {
                this.setState({
                    rankList: data.slice(1),
                    columns: data[0],
                })
            }
            this.setState({ visibleRank: true })
        })
    }

    private renderRank() {
        const { visibleRank, rankList, columns } = this.state
        const { data } = this.props
        const tableColumns: ColumnsType<string[]> = columns.map((item, columnIndex) => ({
            title: item,
            render: (value, record) => {
                return record[columnIndex]
            },
        }))
        return (
            <Modal width={900} title={`${data.title}排行`} visible={visibleRank} footer={null} onCancel={() => this.setState({ visibleRank: false })}>
                <Table<string[]> columns={tableColumns} dataSource={rankList} size='small' />
            </Modal>
        )
    }

    render() {
        const { data } = this.props
        const { title } = data
        const { chartHeight } = this.state
        const canParse = this.canParse()

        return (
            <div className='BoardChart'>
                <header>
                    <span>{title}</span>
                    <span className='Extra' onClick={() => this.showRankList()}>
                        <Tooltip title='数据明细'>
                            <IconFont type='e6fd' useCss />
                        </Tooltip>
                    </span>
                </header>
                {canParse ? (
                    <>
                        <div style={{ overflow: 'hidden', height: chartHeight }} ref={this.containerRef}></div>
                        {this.renderRank()}
                    </>
                ) : (
                    <Empty description='此类型图表暂未解析' />
                )}
            </div>
        )
    }
}

export default BoardChart
