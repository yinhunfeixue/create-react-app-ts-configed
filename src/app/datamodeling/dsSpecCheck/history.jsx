import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import TipLabel from '@/component/tipLabel/TipLabel'
import { Input, Modal, Radio, Select, Tooltip } from 'antd'
import { listHistoryTaskResult } from 'app_api/metadataApi'
import { LzTable } from 'app_component'
import React, { Component } from 'react'
import DmChart from './dmChart'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            classList: [
                { value: 0, name: 'MD5' },
                { value: 1, name: '内容掩盖' },
            ],
            keyword: '',
            way: undefined,
            strategy: undefined,
            idList: this.props.location.state.id ? [this.props.location.state.id] : [],
            modalVisible: false,
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
        }
        this.columns = [
            {
                title: '执行id',
                dataIndex: 'executeId',
                key: 'executeId',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '检查结果',
                dataIndex: 'result',
                key: 'result',
                width: 120,
                render: (text, record) => {
                    switch (text) {
                        case 1:
                            return <StatusLabel message='检查中' type='loading' />
                        case 2:
                            return <StatusLabel message='检查完成' type='success' />
                        case 3:
                            return <StatusLabel message='检查失败' type='error' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                title: '表规范率',
                dataIndex: 'tablePassRate',
                key: 'tablePassRate',
                align: 'right',
                render: (text) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '不规范表数',
                dataIndex: 'tableProblemNums',
                key: 'tableProblemNums',
                align: 'right',

                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '字段规范率',
                dataIndex: 'columnPassRate',
                key: 'columnPassRate',
                align: 'right',
                render: (text) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '不规范字段数',
                dataIndex: 'columnProblemNums',
                key: 'columnProblemNums',
                align: 'right',
                width: 140,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '启动人',
                dataIndex: 'startUser',
                key: 'startUser',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                align: 'left',
                width: 130,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                render: (text, record) => {
                    return (
                        <a onClick={this.getDetail.bind(this, record)}>详情</a>
                        // <Tooltip title='详情'>
                        //     <img
                        //         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}

                        //         src={require('app_images/preview.png')}
                        //     />
                        // </Tooltip>
                    )
                },
            },
        ]
    }
    componentDidMount = () => {
        this.openChartPage()
        this.getTableList({})
    }
    getDetail = (data) => {
        data.taskResultId = data.id
        this.props.addTab('结果详情', data)
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            taskId: this.props.location.state.taskId,
        }
        this.setState({ loading: true })
        let res = await listHistoryTaskResult(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    openChartPage = async () => {
        this.dmChart.showModal(true, { taskResultId: this.props.location.state.taskResultId })
    }
    render() {
        const { tableData, loading } = this.state
        return (
            <div className='VControlGroup'>
                <TableLayout
                    title='历史记录'
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <Module
                                title={
                                    <TipLabel
                                        label='规范率走势图'
                                        tip={
                                            <div>
                                                <p>说明：</p>
                                                <p>1、走势图X轴为日期，Y轴为规范率</p>
                                                <p>2、默认展示30个日期的数据，若总体检查日期不满30个日期，则展示全部有检查数据的日期</p>
                                                <p>3、若T日未检查，则T日不展示；若T日检查多次，则使用最新一次数据进行展示</p>
                                            </div>
                                        }
                                    />
                                }
                            >
                                <DmChart
                                    ref={(dom) => {
                                        this.dmChart = dom
                                    }}
                                />
                            </Module>
                        )
                    }}
                />
                <Module title='历史记录'>
                    <div>
                        <span style={{ marginRight: 20 }}>数据源：{this.props.location.state.datasourceNameEn}</span>
                        <span>数据库：{this.props.location.state.databaseNameEns}</span>
                    </div>
                    <LzTable
                        from='globalSearch'
                        columns={this.columns}
                        dataSource={tableData}
                        ref={(dom) => {
                            this.lzTableDom = dom
                        }}
                        getTableList={this.getTableList}
                        loading={loading}
                        rowKey='id'
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                    />
                </Module>
            </div>
        )
    }
}
