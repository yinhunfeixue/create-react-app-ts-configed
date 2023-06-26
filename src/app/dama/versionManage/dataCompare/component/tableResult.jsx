import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message, Tabs } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import { diffDetail, diffDetailFilters } from 'app_api/autoManage'
import ChangeDetailDrawer from '../../change/component/changeDetailDrawer'
import ProjectUtil from '@/utils/ProjectUtil'


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
            tabValue: '1',
            statusFilters: [],
            databaseFilters: [],
            treeQueryInfo: {}
        }
        this.columns = [
            {
                title: '表名（对比系统）',
                dataIndex: 'targetTableName',
                key: 'targetTableName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp1'><span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>{text}</div>
                            <div className='LineClamp1' style={{ color: '#9EA3A8' }}><span className=' tableIcon iconfont icon-ku'></span>/{record.targetDatabaseName}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表名（参照系统）',
                dataIndex: 'sourceTableName',
                key: 'sourceTableName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp1'><span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>{text}</div>
                            <div className='LineClamp1' style={{ color: '#9EA3A8' }}><span className=' tableIcon iconfont icon-ku'></span>/{record.sourceDatabaseName}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '对比结果',
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
                title: '对比说明',
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
                title: '差异字段数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '影响',
                dataIndex: 'hasEffect',
                key: 'hasEffect',
                width: 100,
                render: (text, record) => <span>{text ? '有' : '无' }</span>
            },
        ]
        this.codeItemColumns = [
            {
                title: '代码项（对比系统）',
                dataIndex: 'targetName',
                key: 'targetName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp1'>{text}</div>
                            <div className='LineClamp1' style={{ color: '#9EA3A8' }}>/{record.targetPName}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '代码项（参照系统）',
                dataIndex: 'sourceName',
                key: 'sourceName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp1'>{text}</div>
                            <div className='LineClamp1' style={{ color: '#9EA3A8' }}>/{record.sourcePName}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '对比结果',
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
                title: '对比说明',
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
                title: '差异代码值数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => <span>{text}</span>
            },
        ]
    }
    componentWillMount = () => {
        this.getFilters()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getFilters = async () => {
        let res = await diffDetailFilters({taskId: this.pageParams.id})
        if (res.code == 200) {
            this.setState({
                statusFilters: res.data.statusFilters,
                databaseFilters: res.data.databaseFilters
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            domain: tabValue == '1' ? 'table' : 'code',
            taskId: this.pageParams.id
        }
        let res = await diffDetail(query)
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
    openColumnTab = (data) => {

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
        let drawerTitle = this.pageParams.sourceDsName + '/' + this.pageParams.targetDsName
        let filterInfo = {
            databaseFilters,
            statusFilters
        }
        this.changeDetailDrawer&&this.changeDetailDrawer.openModal(data, treeQueryInfo, drawerTitle, filterInfo)
    }
    openAlysisPage = (data) => {
        {/*<a*/}
        {/*onClick={this.openAlysisPage.bind(*/}
        {/*this,*/}
        {/*record*/}
        {/*)}*/}
        {/*key='edit'*/}
        {/*>*/}
        {/*影响分析*/}
        {/*</a>*/}
    }
    changeTab = async (e) => {
        await this.setState({
            tabValue: e
        })
        this.reset()
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
            statusFilters,
            databaseFilters
        } = this.state
        return (
            <React.Fragment>
                <div className='tableResult'>
                    <RichTableLayout
                        disabledDefaultFooter
                        // renderDetail={() => {
                        //     return (
                        //         <Tabs animated={false} onChange={this.changeTab} activeKey={tabValue}>
                        //             <TabPane tab='表' key='1'>
                        //             </TabPane>
                        //             <TabPane tab='代码项' key='2'>
                        //             </TabPane>
                        //         </Tabs>
                        //     )
                        // }}
                        editColumnProps={{
                            width: 180,
                            createEditColumnElements: (index, record, defaultElements) => {
                                if (tabValue == '1') {
                                    return [
                                        <a
                                            onClick={this.openDetailPage.bind(
                                                this,
                                                record
                                            )}
                                            key='edit'
                                        >
                                            对比详情
                                        </a>,
                                    ]
                                } else {
                                    return [
                                        <a
                                            onClick={this.openDetailPage.bind(
                                                this,
                                                record
                                            )}
                                            key='edit'
                                        >
                                            对比详情
                                        </a>
                                    ]
                                }
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
                                        placeholder='对比结果'
                                    >
                                        {
                                            statusFilters.map((item) => {
                                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                    {
                                        tabValue == '1' ?
                                            <Select
                                                allowClear
                                                onChange={this.changeStatus.bind(this, 'hasEffect')}
                                                value={queryInfo.hasEffect}
                                                placeholder='影响关系'
                                            >
                                                <Option key={0} value={false}>无</Option>
                                                <Option key={1} value={true}>有</Option>
                                            </Select>
                                            : null
                                    }
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
                    showSlider={false}
                    from="dataCompare"
                    ref={(dom) => this.changeDetailDrawer = dom} />
            </React.Fragment>
        )
    }
}
