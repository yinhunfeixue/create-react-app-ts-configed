import React, { Component } from 'react'
import { Button, Input, Form, Card } from 'antd'
import { CloseOutlined, MoreOutlined } from '@ant-design/icons';
import _ from 'underscore'
import { NotificationWrap } from 'app_common'
// import LzChart from '../../../components/lzChart'
import { LzChart } from 'app_component'
import TableContent from '../../../components/searchResult/table'
import DataLoading from '../../../components/loading'
import { getReportContent, eTableHead } from 'app_api/dashboardApi'
import Wrong from 'app_images/chart/Wrong.svg'
import './index.less'

const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
}
// @lazyload({
// //   height: 200,
//     once: true,
//     // offset: 100
//     offset: 300
// })
// @observer
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
            current: 1,
            viewError: false,
            cssStyle: {
                // paddingTop: '10%'
            }
            // filters: store.selectedList
        }
    }

    componentDidMount = () => {
        let params = this.props.params
        this.getData(params)
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!_.isEqual(prevProps.params, this.props.params) && !this.props.params.initAction) {
            this.getData(this.props.params)
        }
    }

    // componentWillReact = () => {
    //     // if (!_.isEqual(this.state.filters, store.selectedList)) {
    //     //     console.log(store.selectedList)
    //     //     let params = this.props.params
    //     //     this.getData(params)
    //     //     this.setState({
    //     //         filters: store.selectedList
    //     //     })
    //     // }
    // }

    handlePagination = (page) => {
        let params = this.props.params
        params['page'] = page
        console.log(page, '--------------------data------------')
        this.setState({
            current: page
        })
        this.getData(params)
    }

    handleEditTitle = async (selectedKeys, column) => {
        console.log(selectedKeys, column, '-----selectedKeys, column------')
        let params = {
            id: this.state.id,
            tableHeads: {
                titleKey: column.key,
                currentName: selectedKeys[0]
            }
        }
        let res = await eTableHead(params)
        return res
    }

    getData = async (params) => {
        this.setState({
            loading: true,
            params,
        })

        let viewData = await getReportContent({
            id: params.id,
            startTime: params.startTime,
            endTime: params.endTime,
            page: params.page || 1,
            page_size: 20
            // filters: store.selectedList
        })
        console.log(viewData, '-------------')
        if (viewData.code === 200) {
            let data = viewData.data
            let total = viewData.total || 0
            // if (data.status === 1) {
            //     this.props.changeViewMaskStatus && this.props.changeViewMaskStatus(true, data.errorMsg)
            // } else {
            //     this.props.changeViewMaskStatus && this.props.changeViewMaskStatus(false)
            // }
            if (data.chartType) {
                let chartData = data.chartData
                console.log(chartData, '-------chartDatachartDatachartDatachartData-----')
                // if( chartData.code === 200 ){}
                if (chartData.code === 200) {
                    total = chartData.data.total || 0
                    this.setState({
                        chartType: data.chartType,
                        id: params.id,
                        // chartData: chartData.data.chartData,
                        viewError: false,
                        component: <LzChart
                            ref={(dom) => { this.chartCom = dom }}
                            chartStatus
                            chartData={{
                                chartType: data.chartType,
                                dataset: chartData.data
                            }}
                            absolute={false}
                            headCfg={{
                                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }, column, cb) => {
                                    // console.log({ setSelectedKeys, selectedKeys, confirm, clearFilters }, column, '-------filterDropdownfilterDropdown-----------')
                                    console.log(selectedKeys, '---------------selectedKeysselectedKeys-------')
                                    return (
                                        <div className='editCard' >
                                            <div style={{ borderBottom: '1px solid #ebebeb', padding: '8px' }} >
                                                <span className='cardTitle'>编辑分组名称</span><span style={{ float: 'right', cursor: 'pointer' }} onClick={() => clearFilters()} ><CloseOutlined /></span>
                                            </div>
                                            <div style={{ padding: '8px' }} >
                                                <Form>
                                                    <Form.Item
                                                        {...formItemLayout}
                                                        label='显示名称'
                                                        className='fieldLabel'
                                                        validateStatus={selectedKeys[0] ? 'success' : column.title ? 'error' : 'success'}
                                                        help={selectedKeys[0] ? null : column.title ? '名称不能为空' : null}
                                                    >
                                                        <Input
                                                            ref={(node) => {
                                                                this.searchInput = node
                                                            }}
                                                            // value={props.selectedKeys[0]}
                                                            value={selectedKeys[0]}
                                                            onChange={(e) => setSelectedKeys([e.target.value])}
                                                            onPressEnter={
                                                                async () => {
                                                                    if ((selectedKeys[0] && column.title) || !column.title) {
                                                                        let res = await this.handleEditTitle(selectedKeys, column)
                                                                        if (res.code === 200) {
                                                                            column.title = selectedKeys[0]
                                                                            cb(column)
                                                                            clearFilters()
                                                                            NotificationWrap.success(res.msg)
                                                                        } else {
                                                                            NotificationWrap.error(res.msg)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            style={{ marginBottom: 8, display: 'block' }}
                                                        />

                                                    </Form.Item>
                                                </Form>
                                            </div>
                                            <div style={{ padding: '8px' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Button
                                                        size='small'
                                                        style={{ marginRight: 8 }}
                                                        onClick={() => {
                                                            // setSelectedKeys([column.title])
                                                            clearFilters()
                                                        }
                                                        }
                                                    >
                                                        取消
                                                    </Button>

                                                    <Button
                                                        type='primary'
                                                        size='small'
                                                        style={{ marginRight: 8 }}
                                                        onClick={async () => {
                                                            if ((selectedKeys[0] && column.title) || !column.title) {
                                                                let res = await this.handleEditTitle(selectedKeys, column)
                                                                if (res.code === 200) {
                                                                    column.title = selectedKeys[0]
                                                                    cb(column)
                                                                    clearFilters()
                                                                    NotificationWrap.success(res.msg)
                                                                } else {
                                                                    NotificationWrap.error(res.msg)
                                                                }
                                                            }
                                                        }
                                                        }
                                                    >
                                                        保存
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                filterIcon: (filtered) => <MoreOutlined />
                            }}
                            tableConfig={{
                                pagination: total > 20 ? {
                                    showQuickJumper: true,
                                    pageSize: 20,
                                    current: this.state.current,
                                    total,
                                    onChange: this.handlePagination,
                                } : false
                            }}
                        />
                    })
                } else {
                    this.setState({
                        chartType: data.chartType,
                        id: params.id,
                        viewError: true,
                        component: <div className='promptUserWrong'>{chartData.msg || '没有相关数据'}</div>
                    })
                }
            } else {
                if (data.tableHead) {
                    this.setState({
                        chartType: '',
                        id: params.id,
                        viewError: false,
                        component: <TableContent
                            absolute={false}
                            sourceData={{
                                head: data.tableHead,
                                tabulate: data.tableData,
                                headCfg: {
                                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }, column, cb) => {
                                        // console.log({ setSelectedKeys, selectedKeys, confirm, clearFilters }, column, '-------filterDropdownfilterDropdown-----------')
                                        console.log(selectedKeys, '---------------selectedKeysselectedKeys-------')
                                        return (
                                            <div className='editCard' >
                                                <div style={{ borderBottom: '1px solid #ebebeb', padding: '8px' }} >
                                                    <span className='cardTitle'>编辑分组名称</span><span style={{ float: 'right', cursor: 'pointer' }} onClick={() => clearFilters()} ><CloseOutlined/></span>
                                                </div>
                                                <div style={{ padding: '8px' }} >
                                                    <Form>
                                                        <Form.Item
                                                            {...formItemLayout}
                                                            label='显示名称'
                                                            className='fieldLabel'
                                                            validateStatus={selectedKeys[0] ? 'success' : column.title ? 'error' : 'success'}
                                                            help={selectedKeys[0] ? null : column.title ? '名称不能为空' : null}
                                                        >
                                                            <Input
                                                                ref={(node) => {
                                                                    this.searchInput = node
                                                                }}
                                                                // value={props.selectedKeys[0]}
                                                                value={selectedKeys[0]}
                                                                onChange={(e) => setSelectedKeys([e.target.value])}
                                                                onPressEnter={
                                                                    async () => {
                                                                        if ((selectedKeys[0] && column.title) || !column.title) {
                                                                            let res = await this.handleEditTitle(selectedKeys, column)
                                                                            if (res.code === 200) {
                                                                                column.title = selectedKeys[0]
                                                                                cb(column)
                                                                                clearFilters()
                                                                                NotificationWrap.success(res.msg)
                                                                            } else {
                                                                                NotificationWrap.error(res.msg)
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                style={{ marginBottom: 8, display: 'block' }}
                                                            />

                                                        </Form.Item>
                                                    </Form>
                                                </div>
                                                <div style={{ padding: '8px' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Button
                                                            size='small'
                                                            style={{ marginRight: 8 }}
                                                            onClick={() => {
                                                                // setSelectedKeys([column.title])
                                                                clearFilters()
                                                            }
                                                            }
                                                        >
                                                            取消
                                                        </Button>

                                                        <Button
                                                            type='primary'
                                                            size='small'
                                                            style={{ marginRight: 8 }}
                                                            onClick={async () => {
                                                                if ((selectedKeys[0] && column.title) || !column.title) {
                                                                    let res = await this.handleEditTitle(selectedKeys, column)
                                                                    if (res.code === 200) {
                                                                        column.title = selectedKeys[0]
                                                                        cb(column)
                                                                        clearFilters()
                                                                        NotificationWrap.success(res.msg)
                                                                    } else {
                                                                        NotificationWrap.error(res.msg)
                                                                    }
                                                                }
                                                            }
                                                            }
                                                        >
                                                            保存
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    filterIcon: (filtered) => <MoreOutlined />
                                },
                                tableConfig: {
                                    pagination: total > 20 ? {
                                        pageSize: 20,
                                        current: this.state.current,
                                        showQuickJumper: true,
                                        total,
                                        onChange: this.handlePagination,
                                    } : false
                                }
                            }}
                        />
                    })
                } else {
                    this.setState({
                        chartType: '',
                        id: params.id,
                        viewError: true,
                        component: <div className='promptUserWrong'><img src={Wrong} /><span>没有相关数据</span></div>
                    })
                }
            }
        } else {
            this.setState({
                id: params.id,
                viewError: true,
                component: <div className='promptUserWrong'><img src={Wrong} /><span>{viewData.msg}</span></div>
            })
        }

        this.setState({
            loading: false
        })
    }

    render() {
        const { component, loading, viewError } = this.state
        // const { selectedList } = store
        return (
            <div style={{ width: '100%', height: '100%', position: viewError || loading ? 'absolute' : '' }} >
                { loading ? <DataLoading /> : component}
            </div>
        )
    }
}
