import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Switch, Popconfirm } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import ProjectUtil from '@/utils/ProjectUtil'
import React, { Component } from 'react'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import './index.less'
import { dsSetting } from 'app_api/autoManage'

import FilterSetDrawer from './component/filterSetDrawer'
import FilterTableDetail from './component/filterTableDetail'
import FilterTableDetailWhite from './component/filterTableDetailWhite'
import UploadDrawer from './component/upload/index'
const { Option } = Select

export default class ManageFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            compareSystemList: [],
        }
        this.columns = [
            {
                title: '数据源名称',
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
                title: '最新采集时间',
                dataIndex: 'lastCollectTime',
                key: 'lastCollectTime',
                width: 180,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '治理状态',
                dataIndex: 'govStatus',
                key: 'govStatus',
                width: 100,
                render: (text, record) => (text !== undefined ? <div>{!text ? <StatusLabel type='success' message='治理' /> : <StatusLabel type='uncheck' message='不治理' />}</div> : <EmptyLabel />),
            },
            {
                title: '设置方式',
                dataIndex: 'filterType',
                key: 'filterType',
                render: (text, record) => (text !== undefined && !record.govStatus ? <span className='LineClamp'>{text ? '排除' : '治理'}</span> : <EmptyLabel />),
            },
            {
                title: '表总数',
                dataIndex: 'tableCount',
                key: 'tableCount',
                render: (text, record) => <span className='LineClamp'>{ProjectUtil.formNumber(text)}</span>,
            },
            {
                title: '不治理表数',
                dataIndex: 'filterTableCount',
                key: 'filterTableCount',
                render: (text, record) =>
                    text !== undefined && !record.govStatus && record.filterType === 1 ? <a onClick={this.openTablePage.bind(this, record)}>{ProjectUtil.formNumber(text)}</a> : <EmptyLabel />,
            },
            {
                title: '治理表数',
                dataIndex: 'whiteListTableCount',
                key: 'whiteListTableCount',
                render: (text, record) =>
                    text !== undefined && !record.govStatus && record.filterType === 0 ? <a onClick={this.openTableWhitePage.bind(this, record)}>{ProjectUtil.formNumber(text)}</a> : <EmptyLabel />,
            },
        ]
    }
    componentWillMount = () => {}
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await dsSetting(query)
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
    openTablePage = (data) => {
        this.filterTableDetail && this.filterTableDetail.openModal(data)
    }

    openTableWhitePage = (data) => {
        this.filterTableDetailWhite && this.filterTableDetailWhite.openModal(data)
    }

    openSettingPage = (data) => {
        this.filterSetDrawer && this.filterSetDrawer.openModal(data)
    }
    render() {
        const { queryInfo, tableData, compareSystemList } = this.state
        return (
            <React.Fragment>
                <div className='manageFilter'>
                    <RichTableLayout
                        title='治理过滤'
                        renderHeaderExtra={() => <UploadDrawer submitChange={this.reset} />}
                        editColumnProps={{
                            width: 100,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '管理',
                                        onClick: this.openSettingPage.bind(this, record),
                                        funcCode: '/setting/gov_filter/manage/action',
                                    },
                                ])
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
                                    <Input.Search allowClear style={{ width: 380 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入数据源' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'govStatus')} value={queryInfo.govStatus} placeholder='治理状态'>
                                        <Select.Option key={0} value={0}>
                                            治理
                                        </Select.Option>
                                        <Select.Option key={1} value={1}>
                                            不治理
                                        </Select.Option>
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'filterType')} value={queryInfo.filterType} placeholder='过滤策略'>
                                        <Select.Option key={0} value={0}>
                                            不过滤
                                        </Select.Option>
                                        <Select.Option key={1} value={1}>
                                            规则过滤
                                        </Select.Option>
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
                <FilterSetDrawer search={this.search} ref={(dom) => (this.filterSetDrawer = dom)} />
                <FilterTableDetail search={this.search} ref={(dom) => (this.filterTableDetail = dom)} />
                <FilterTableDetailWhite search={this.search} ref={(dom) => (this.filterTableDetailWhite = dom)} />
            </React.Fragment>
        )
    }
}
