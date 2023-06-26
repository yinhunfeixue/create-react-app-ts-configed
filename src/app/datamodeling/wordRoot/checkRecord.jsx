import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, Select, message } from 'antd'
import { auditRecord, auditRecordFilter, auditRecordDetail } from 'app_api/dataModeling'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
import RecordDetailDrawer from './recordDetailDrawer'

const { Option } = Select

export default class CheckRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            sourceList: [],
        }
        this.columns = [
            {
                title: '词根',
                dataIndex: 'rootName',
                key: 'rootName',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={this.renderTooltip(text)}>
                            <span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '描述',
                dataIndex: 'descWord',
                key: 'descWord',
                render: (text, record) => (text && text.length ? <Tooltip title={this.renderDescWord(text, '#fff')}>{this.renderDescWord(text, '#333')}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '来源表',
                dataIndex: 'sourceTableName',
                key: 'sourceTableName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '申请人',
                dataIndex: 'applicantName',
                key: 'applicantName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '审批人',
                dataIndex: 'auditorName',
                key: 'auditorName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '审批状态',
                dataIndex: 'passed',
                key: 'passed',
                width: 100,
                render: (text, record) => (text !== undefined ? <div>{text ? <StatusLabel type='success' message='已通过' /> : <StatusLabel type='error' message='已拒绝' />}</div> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    renderDescWord = (data, color) => {
        let html = ''
        data.map((item, index) => {
            html += item + (index < data.length - 1 ? '、' : '')
        })
        return <span style={{ color: color }} dangerouslySetInnerHTML={{ __html: html }}></span>
    }
    getSourceData = async () => {
        let res = await auditRecordFilter()
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            audit: true,
            ...queryInfo,
        }
        let res = await auditRecord(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
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
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openDetailPage = async (data) => {
        let res = await auditRecordDetail({ id: data.id })
        if (res.code == 200) {
            this.recordDetailDrawer && this.recordDetailDrawer.openModal(res.data)
        }
    }
    render() {
        const { queryInfo, tableData, sourceList } = this.state
        return (
            <React.Fragment>
                <div className='rootCheckRecord'>
                    <RichTableLayout
                        title='词根审批记录'
                        editColumnProps={{
                            width: 90,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                        详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入词根／描述词' />
                                    <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'tableId')} value={queryInfo.tableId} placeholder='来源表'>
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'passed')} value={queryInfo.passed} placeholder='审批状态'>
                                        <Option key={1} value={true}>
                                            已通过
                                        </Option>
                                        <Option key={2} value={false}>
                                            已拒绝
                                        </Option>
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <RecordDetailDrawer ref={(dom) => (this.recordDetailDrawer = dom)} />
            </React.Fragment>
        )
    }
}
