import { Component } from 'react'

// import _ from 'underscore'
// import Config from './config'
import ChartGeom from './component/geom'
import TableContent from './component/table'
import Views from './views'
// import ChartGeom './Chart'

export default class LzChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chartData: this.props.chartData || {},
            chartStatus: false,
            msgTitle: '',
            component: null
        }

        this.chartFactory = null
    }

    componentDidMount() {
        this.init(this.props)
    }

    chartFactoryInit = () => {
        if (!this.chartFactory) {
            this.chartFactory = Views.getFactory(this.state.chartData.chartType, this.state.chartData)
        }
    }

    init = (data) => {
        console.log(data, '-----------datadatadatadata------------')
        if (this.chartGeom) {
            this.chartGeom = null
        }
        if (!data.reRender &&
            this.chartFactory &&
            this.chartFactory.renderType === 'PivotTable' &&
            this.chartFactory.renderType === this.state.chartData.chartType) {
            return
        }

        this.chartFactory = null

        const { clientHeight } = this.contentContainerDom
        // console.log(clientHeight, '---clientHeightclientHeight---')

        this.setState({
            chartStatus: data.chartStatus,
            msgTitle: data.msgTitle,
            component: null
        }, () => {
            if (data.chartStatus) {
                if (data.chartData.chartType) {
                    this.chartFactoryInit()
                    let component = null
                    let renderType = this.chartFactory.renderType

                    switch (renderType) {
                        case 'geom':
                            component = (
                                <ChartGeom
                                    ref={(e) => { this.chartGeom = e }}
                                    {...data}
                                    chartFactory={this.chartFactory}
                                    getDrillDownData={this.props.getDrillDownData}
                                />
                            )
                            break
                        case 'PivotTable':
                            let tableHead = this.chartFactory.handleTableHeade(data.chartData.dataset.dataset_title)
                            let tableBody = this.chartFactory.handleTableBody(data.chartData.dataset.dataset_body)
                            component = (
                                <TableContent
                                    absolute={data.absolute === undefined ? true : data.absolute}
                                    sourceData={{ head: tableHead, tabulate: tableBody, tableConfig: data.tableConfig || {}, headCfg: data.headCfg || {} }}
                                    clientHeight={clientHeight}
                                />
                            )

                            break
                        default:
                            component = '视图类型不存在'
                            break
                    }

                    this.setState({
                        renderType,
                        component
                    })
                }
            }
        })
    }

    validateItemSetting = (item, itemSettings) => {
        this.chartFactoryInit()
        return this.chartFactory.validateItemSetting(item, itemSettings)
    }

    getItems = (settings) => {
        this.chartFactoryInit()
        return this.chartFactory.getItems(settings)
    }

    reRender = (data) => {
        this.setState({
            chartData: data.chartData,
            msgTitle: data.msgTitle,
            chartStatus: data.chartStatus
        }, () => {
            this.init(data)
        })
    }

    forceFit = () => {
        console.log('forceFit--forceFit--forceFit')
        if (this.chartGeom) {
            this.chartGeom.forceFit()
        }
    }

    downloadImage = (name) => {
        if (this.chartGeom) {
            this.chartGeom.downloadImage(name)
        }
    }

    render() {
        const { component, chartStatus, msgTitle } = this.state
        console.log(chartStatus, msgTitle, '------chartStatuschartStatus-------')
        return (
            <div ref={(dom) => { this.contentContainerDom = dom }} className='lzChart' style={{ height: '100%', width: '100%', minHeight: '100%' }}>
                {!chartStatus ? <div className='promptUserWrong'><span title={msgTitle}>{msgTitle}</span></div>
                    : component
                }

            </div>
        )
    }
}
