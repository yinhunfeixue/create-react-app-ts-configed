import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Tabs } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import '../index.less'
import { versionDiffDetail, versionDiffDetailFilters } from 'app_api/autoManage'
import { desensitizerule } from 'app_api/dataSecurity'
import ChangeDetailDrawer from '../../change/component/changeDetailDrawer'

const { Option } = Select
const TabPane = Tabs.TabPane

export default class TableResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            databaseFilters: [],
            statusFilters: [],
            tabValue: '1',
            treeQueryInfo: {}
        }
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
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
                title: '变更状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <span className='LineClamp'>{this.getStatusName(text)}</span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '变更说明',
                dataIndex: 'desc',
                key: 'desc',
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
                title: '字段更新数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => text
            },
        ]
        this.codeItemColumns = [
            {
                title: '代码项',
                dataIndex: 'name',
                key: 'name',
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
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
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
                title: '变更状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <span className='LineClamp'>{this.getStatusName(text)}</span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '变更说明',
                dataIndex: 'desc',
                key: 'desc',
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
                title: '代码值更新数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => text
            },
        ]
    }
    componentWillMount = () => {
        this.getFilter()
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getFilter = async () => {
        let { tabValue } = this.state
        let query = {}
        if (this.pageParam.from == 'version') {
            query = {
                domain: tabValue == '1' ? 'table' : 'code',
                sourceVersion: JSON.parse(this.pageParam.selectedRows)[1].version,
                targetVersion: JSON.parse(this.pageParam.selectedRows)[0].version,
                datasourceId: this.pageParam.datasourceId
            }
        } else {
            query = {
                domain: tabValue == '1' ? 'table' : 'code',
                // sourceVersion: this.pageParam.sourceVersion,
                targetVersion: this.pageParam.targetVersion,
                datasourceId: this.pageParam.datasourceId
            }
        }
        let res = await versionDiffDetailFilters(query)
        if (res.code == 200) {
            this.setState({
                databaseFilters: res.data.databaseFilters,
                statusFilters: res.data.statusFilters
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        let query = {}
        if (this.pageParam.from == 'version') {
            query = {
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                ...queryInfo,
                domain: tabValue == '1' ? 'table' : 'code',
                sourceVersion: JSON.parse(this.pageParam.selectedRows)[1].version,
                targetVersion: JSON.parse(this.pageParam.selectedRows)[0].version,
                datasourceId: this.pageParam.datasourceId
            }
        } else {
            query = {
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                ...queryInfo,
                domain: tabValue == '1' ? 'table' : 'code',
                // sourceVersion: this.pageParam.sourceVersion,
                targetVersion: this.pageParam.targetVersion,
                datasourceId: this.pageParam.datasourceId
            }
        }
        let res = await versionDiffDetail(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                treeQueryInfo: query
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
    openDetailPage = (data) => {
        let { treeQueryInfo, databaseFilters, statusFilters } = this.state
        let drawerTitle = '变更详情' + '（' + this.pageParam.datasourceName + '）'
        let filterInfo = {
            databaseFilters,
            statusFilters
        }
        this.changeDetailDrawer&&this.changeDetailDrawer.openModal(data, treeQueryInfo, drawerTitle, filterInfo, 'versionDiffDetail')
    }
    changeTab = async (e) => {
        await this.setState({
            tabValue: e
        })
        this.reset()
        this.getFilter()
    }
    getStatusName = (value) => {
        let { statusFilters } = this.state
        if (value) {
            for (let i=0;i<statusFilters.length;i++) {
                if (statusFilters[i].id == value) {
                    return statusFilters[i].name
                }
            }
        } else {
            return ''
        }
    }
    render() {
        const {
            queryInfo,
            tableData,
            tabValue,
            databaseFilters,
            statusFilters
        } = this.state
        return (
            <React.Fragment>
                <div className='tableResult'>
                    <RichTableLayout
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <Tabs animated={false} onChange={this.changeTab} activeKey={tabValue}>
                                    <TabPane tab='表' key='1'>
                                    </TabPane>
                                    <TabPane tab='代码项' key='2'>
                                    </TabPane>
                                </Tabs>
                            )
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return [
                                    <a
                                        onClick={this.openDetailPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        变更详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: tabValue == '1' ? this.columns : this.codeItemColumns,
                            key: 'id',
                            dataSource: tableData,
                            extraTableProps: {
                                key: tabValue
                            },
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder={tabValue == '1' ? '请输入表名' : '请输入代码项'}
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(this, 'filterDbId')}
                                        value={queryInfo.filterDbId}
                                        placeholder='数据库'
                                    >
                                        {
                                            databaseFilters.map((item) => {
                                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(this, 'status')}
                                        value={queryInfo.status}
                                        placeholder='变更状态'
                                    >
                                        {
                                            statusFilters.map((item) => {
                                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                            })
                                        }
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
                                }
                            })
                        }}
                    />
                </div>
                <ChangeDetailDrawer
                    showSlider={true}
                    from={this.props.from}
                    ref={(dom) => this.changeDetailDrawer = dom} />
            </React.Fragment>
        )
    }
}
