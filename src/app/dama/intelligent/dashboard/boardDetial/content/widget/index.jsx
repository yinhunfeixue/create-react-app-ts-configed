import React, { Component } from 'react'
import _ from 'underscore'
// import './index.less'
// import LzChart from '../../../../components/lzChart'
import { LzChart } from 'app_component'
import TableContent from '../../../../components/searchResult/table'
import DataLoading from '../../../../components/loading'
import { getViewInfo } from 'app_api/dashboardApi'
import Wrong from 'app_images/chart/Wrong.svg'
import './index.less'
import store from '../../store'
import { observer } from 'mobx-react'
// import { lazyload, forceCheck } from 'react-lazyload'

// @lazyload({
// //   height: 200,
//     once: true,
//     // offset: 100
//     offset: 300
// })
@observer
export default class Widget extends Component {
    // @observable selectedList = []

    constructor(props) {
        super(props)

        this.state = {
            component: null,
            id: 0,
            loading: true,
            chartType: '',
            chartData: {},
            params: {},
            filters: store.selectedList
        }
    }

    componentDidMount = () => {
        let params = this.props.params
        this.getData(params)
    }

    componentDidUpdate = (prevProps, prevState) => {
        // console.log(prevProps, prevState)
        if (!_.isEmpty(prevState.chartType)) {
            this.chartCom && this.chartCom.forceFit()
        }
    }

    componentWillReact = () => {
        if (!_.isEqual(this.state.filters, store.selectedList)) {
            console.log(store.selectedList)
            let params = this.props.params
            this.getData(params)
            this.setState({
                filters: store.selectedList
            })
        }
    }

    getData = async (params) => {
        this.setState({
            loading: true,
            params,
        })

        let viewData = await getViewInfo({
            id: params.id,
            filters: store.selectedList
        })

        if (viewData.code === 200) {
            let data = viewData.data
            if (data.status === 1) {
                this.props.changeViewMaskStatus && this.props.changeViewMaskStatus(true, data.errorMsg)
            } else {
                this.props.changeViewMaskStatus && this.props.changeViewMaskStatus(false)
            }
            if (data.chartType) {
                let chartData = data.chartData
                // if( chartData.code === 200 ){}
                if (chartData.code === 200) {
                    this.setState({
                        chartType: data.chartType,
                        id: params.id,
                        chartData: chartData.data.chartData,
                        component: <LzChart ref={(dom) => { this.chartCom = dom }} chartStatus chartData={chartData.data.chartData} />
                    })
                } else {
                    this.setState({
                        chartType: data.chartType,
                        id: params.id,
                        component: <div className='promptUserWrong'>{chartData.msg}</div>
                    })
                }
            } else {
                if (data.tableHead) {
                    this.setState({
                        chartType: '',
                        id: params.id,
                        component: <TableContent absolute={false} sourceData={{ head: data.tableHead, tabulate: data.tableData }} />
                    })
                } else {
                    this.setState({
                        chartType: '',
                        id: params.id,
                        component: <div className='promptUserWrong'><img src={Wrong} /><span>没有符合条件的数据</span></div>
                    })
                }
            }
        } else {
            this.setState({
                id: params.id,
                component: <div className='promptUserWrong'><img src={Wrong} /><span>{viewData.msg || '没有符合条件的数据'}</span></div>
            })
        }

        this.setState({
            loading: false
        })
    }

    render() {
        const { component, loading } = this.state
        const { selectedList } = store
        return (
            <div style={{ width: '100%', height: '100%' }} >
                {/* <div style={{ display: 'none', width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(0,0,0,0.65)' }} className='promptUserWrong'><span>没有符合条件的数据</span></div> */}
                { loading ? <DataLoading /> : component}
            </div>
        )
    }
}
