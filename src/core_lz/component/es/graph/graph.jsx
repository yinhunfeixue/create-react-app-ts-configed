import SliceStyle from 'app_js/sliceStyle'
import * as echarts from 'echarts'
import $ from 'jquery'
import { Component } from 'react'
import _ from 'underscore'

export default class Graph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            loading: true
        }
    }

    componentDidMount() {
        this.chart = echarts.init(this.refs.chart)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ title: nextProps.title, loading: nextProps.loading })
    }

    resize() {
        this.chart.resize()
    }

    refreshGraph(params) {
        this.prepareOption(params)
        this.chart.clear()
        this.chart.setOption(this.option)
        this.eventBind()
        console.log(JSON.stringify(this.option), '---this.option')
        this.setState({ loading: false })
        // this.resize()
    }

    prepareOption(params) {
        const sizeRange = params.sizeRange || [30, 100]
        const values = _.map(params.nodeData, ({ value }) => value)
        const min = Math.min.apply(Math, values)
        let max = Math.max.apply(Math, values)
        if (max === min) {
            max += 1
        }
        this.option = {
            series: {
                type: 'graph',
                layout: 'force',
                nodes: params.nodeData,
                edges: params.edgesData
            }
        }

        if (params.visualMap != undefined && params.visualMap) {
            // 默认启用
            let visualMap = {
                visualMap: {
                    show: false,
                    inRange: {
                        color: params.visualMapColor || SliceStyle.visualMapColor
                    },
                    max: max,
                    min: min
                }
            }
            $.extend(true, this.option, visualMap)
        }

        $.extend(true, this.option, params.extraOption)
    }

    eventBind = () => {
        let _this = this
        this.chart.off('click')
        this.chart.on('click', function (params) {
            console.log(params, '---click---params--')
            if (_this.props.click) {
                _this.props.click(params)
            }
        })

        this.chart.off('dblclick')
        this.chart.on('dblclick', function (params) {
            console.log(params, '---dblclick---params--')
            if (_this.props.dblclick) {
                _this.props.dblclick(params)
            }
        })
    }

    setNodeAttr = (nodes, eventConfig) => {
        // console.log(nodes);
        let options = this.chart.getOption()
        nodes.map((item) => {
            let nData = options['series'][item.seriesIndex]['nodes'][item.dataIndex]

            options['series'][item.seriesIndex]['nodes'][item.dataIndex] = { ...nData, ...eventConfig }
        })
        // console.log(options,'----coptions');
        //
        this.chart.setOption(options)
        // console.log(e,'----dddddddddeeeeeeeee')
        // this.chart.dispatchAction({ type: 'highlight', seriesIndex: e.seriesIndex, dataIndex: e.dataIndex, color: '#000'})
    }

    render() {
        return (
            <div title={this.state.title || ''} style={{ width: this.props.width || '100%', height: this.props.height || '100%' }} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div ref='chart' style={{ width: this.props.width || '100%', height: this.props.height || '100%' }} />
            </div>
        )
    }
}
