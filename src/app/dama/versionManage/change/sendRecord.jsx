// 变更推送记录
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Switch, Popconfirm } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
import { pushRecord } from 'app_api/autoManage'
import SendRecordLogDrawer from './component/sendRecordLogDrawer'

const { Option } = Select

export default class ManageFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
        }
        this.columns = [
            {
                title: '数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
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
                title: '变更时间',
                dataIndex: 'alterTime',
                key: 'alterTime',
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '推送人数',
                dataIndex: 'pushCount',
                key: 'pushCount',
                render: (text, record) => <span className='LineClamp'>{text}</span>
            },
        ]
    }
    componentWillMount = () => {
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await pushRecord(query)
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
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
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
    openLogModal = (data) => {
        this.sendRecordLogDrawer&&this.sendRecordLogDrawer.openModal(data)
    }
    render() {
        const {
            queryInfo,
            tableData,
        } = this.state
        return (
            <React.Fragment>
                <div className='manageFilter'>
                    <RichTableLayout
                        title='变更推送记录'
                        editColumnProps={{
                            width: 100,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '日志',
                                        onClick: this.openLogModal.bind(this, record),
                                    },
                                ])
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        style={{ width: 380 }}
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入数据源名称'
                                    />
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                }
                            })
                        }}
                    />
                </div>
                <SendRecordLogDrawer ref={(dom) => this.sendRecordLogDrawer = dom} />
            </React.Fragment>
        )
    }
}
