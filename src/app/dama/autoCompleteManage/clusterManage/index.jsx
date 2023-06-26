import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, message, Modal, Radio, Select } from 'antd'
import { dwappCluster, dwappClusterStatistic } from 'app_api/standardApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'

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
            keyword: '',
            confirmConfig: 0,
            statisticInfo: {
                confirmProportion: 0,
            },
        }
        this.columns = [
            {
                title: '簇ID',
                dataIndex: 'code',
                key: 'code',
                width: '26%',
                render: (text) => (
                    <Tooltip placement='left' title={text}>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '簇中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: '26%',
                render: (text, record) => {
                    if (text) {
                        return (
                            <Tooltip placement='leftTop' title={text}>
                                <span
                                    className='spanTip'
                                    style={{
                                        color: !record.confirm ? '#b3b3b3' : '#333',
                                        marginLeft: '0px',
                                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                                    }}
                                >
                                    {!record.confirm ? <span style={{ marginLeft: '0px' }} className='dot'></span> : null}
                                    <span className='spanText'>{text}</span>
                                </span>
                            </Tooltip>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '簇英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: '26%',
                render: (text, record) => {
                    if (text) {
                        return (
                            <Tooltip placement='left' title={text}>
                                <span
                                    className='spanTip'
                                    style={{
                                        color: !record.confirm ? '#b3b3b3' : '#333',
                                        marginLeft: '0px',
                                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                                    }}
                                >
                                    {!record.confirm ? <span style={{ marginLeft: '0px' }} className='dot'></span> : null}
                                    <span className='spanText'>{text}</span>
                                </span>
                            </Tooltip>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '包含字段数',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: '14%',
                align: 'right',
                className: 'statusContent',
                render: (text, record) => <span>{text}</span>,
            },
            {
                title: '状态',
                dataIndex: 'confirm',
                key: 'confirm',
                width: '16%',
                render: (text, record) => {
                    return record.confirm ? <StatusLabel message='已配置' type='success' /> : <StatusLabel message='未配置' type='warning' />
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getStatistic()
    }
    openEditModal = (data) => {
        data.pageType = data.confirm ? 'look' : 'edit'
        data.title = data.confirm ? '查看簇' : '编辑簇'
        data.showNext = true
        data.searchParam = this.state.searchParam
        if (data.pageType === 'look') {
            this.props.addTab('同义簇详情', data, true)
        } else {
            this.props.addTab('编辑同义簇', data)
        }
    }
    getStatistic = async () => {
        let res = await dwappClusterStatistic({})
        if (res.code == 200) {
            this.setState({
                statisticInfo: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            confirmConfig: this.state.confirmConfig == 1 ? true : this.state.confirmConfig == 0 ? false : undefined,
        }
        let res = await dwappCluster(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                keyword: this.state.keyword,
                confirmConfig: query.confirmConfig,
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            confirmConfig: 0,
        })
        this.search()
    }
    changeStatus = (value) => {
        this.setState({
            confirmConfig: value,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    render() {
        const { tableData, loading, keyword, confirmConfig, statisticInfo } = this.state
        return (
            <RichTableLayout
                title='同义簇'
                renderDetail={() => {
                    return (
                        <div>
                            中文信息完整率：
                            <span style={{ color: '#4D73FF' }}>{this.getToFixedNum(statisticInfo.confirmProportion * 100)}</span>
                            <span style={{ color: '#9EA3A8' }}>（已配置的簇占所有簇的比例）</span>
                        </div>
                    )
                }}
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索同义簇' allowClear />
                            <Select onChange={this.changeStatus} value={confirmConfig}>
                                <Select.Option value='all'>全部</Select.Option>
                                <Select.Option value={0}>未配置</Select.Option>
                                <Select.Option value={1}>已配置</Select.Option>
                            </Select>
                            <Button onClick={this.reset} className='searchBtn'>
                                重置
                            </Button>
                        </React.Fragment>
                    )
                }}
                requestListFunction={(page, pageSize) => {
                    return this.getTableList({
                        pagination: {
                            page,
                            page_size: pageSize,
                        },
                    })
                }}
                editColumnProps={{
                    width: '8%',
                    createEditColumnElements: (_, record) => {
                        return [<a onClick={this.openEditModal.bind(this, record)}>{record.confirm ? '查看' : '编辑'}</a>]
                    },
                }}
                tableProps={{
                    columns: this.columns,
                }}
            />
        )
    }
}
