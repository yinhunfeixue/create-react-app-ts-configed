// 推荐审核
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import { Button, Input, Select, Tabs, Tag, message } from 'antd'
import ProjectUtil from '@/utils/ProjectUtil'
import { displayAuditRecordsByItem, displayItemCountsGroupByTable} from 'app_api/autoManage'
import { getUserList } from 'app_api/manageApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import CheckDrawer from './component/checkDrawer'
import CheckRecordDrawer from './component/checkRecordDrawer'

const { Option } = Select
const TabPane = Tabs.TabPane

export default class Check extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                partOfName: '',
            },
            checkQueryInfo: {
                keyword: ''
            },
            tabValue: '1',
            userList: [],
            tableData: [],
            selectedIndex: 0,
            loading: false,
        }
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 200,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<span>{(text ? text : '')}{text ? <br/> : '' }{record.dataBaseName}</span>}>
                            <span className='LineClamp'>
                                <span className='tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                                {text}
                                <br/>
                                <span style={{ color: '#9EA3A8' }}><span className='tableIcon iconfont icon-ku'></span>{record.dataBaseName}</span>
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '标准映射',
                dataIndex: 'stdCount',
                key: 'stdCount',
                width: 100,
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '质量规则',
                dataIndex: 'qltCount',
                key: 'qltCount',
                width: 100,
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '数据分类',
                dataIndex: 'clzCount',
                key: 'clzCount',
                width: 100,
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '代码项',
                dataIndex: 'codeCount',
                key: 'codeCount',
                width: 100,
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '安全分类分级',
                dataIndex: 'lvlCount',
                key: 'lvlCount',
                width: 120,
                render: (text, record) => <span>{text}</span>
            },
            {
                title: '扫描时间',
                dataIndex: 'scanTime',
                key: 'scanTime',
                width: 180,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={ProjectUtil.formDate(text)}>{ProjectUtil.formDate(text)}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.recordColumns = [
            {
                title: '审核对象',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 200,
                render: (text, record) =>
                    <Tooltip placement='topLeft' title={<span>{(text ? text : '')}{text ? <br/> : '' }{record.tableName}</span>}>
                        <span className='LineClamp'>{text ? <span><span style={{ marginRight: 8 }} className='iconfont icon-ziduan1'></span>{text}<br/></span> : ''}
                            <span style={{ color: record.type ? '#9EA3A8' : '#2D3033' }}><span style={{ marginRight: 8 }} className='iconfont icon-biaodanzujian-biaoge'></span>{record.tableName}</span>
                        </span>
                    </Tooltip>
            },
            {
                title: '对象类型',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                render: (text, record) => <span>{text ? '字段' : '表'}</span>
            },
            {
                title: '审核内容',
                dataIndex: 'content',
                key: 'content',
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
                title: '审核时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 180,
                sorter: true,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={ProjectUtil.formDate(text)}>{ProjectUtil.formDate(text)}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '审核人',
                dataIndex: 'userName',
                key: 'userName',
                width: 100,
                render: (text, record) => <span>{text}</span>
            },
        ]
        console.log('props', props);
    }
    componentWillMount = () => {
        // this.getUserData()
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue, checkQueryInfo } = this.state
        this.setState({ loading: true })
        let res = {}
        if (tabValue == 1) {
            let query = {
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                datasourceId: this.pageParam.datasourceId,
                ...checkQueryInfo
            }
            res = await displayItemCountsGroupByTable(query)
        } else {
            let query = {
                pageNo: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                datasourceId: this.pageParam.datasourceId,
                timeOrder: params.sorter.field == 'createTime' ? (params.sorter.order == 'ascend' ? 0 : 1) : 1,
                ...queryInfo,
            }
            res = await displayAuditRecordsByItem(query)
        }
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            partOfName: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    checkReset = async () => {
        let { checkQueryInfo } = this.state
        checkQueryInfo = {
            keyword: '',
        }
        await this.setState({
            checkQueryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.partOfName = e.target.value
        this.setState({
            queryInfo
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    openCheckModal = (data, index) => {
        this.setState({
            selectedIndex: index
        })
        data.datasourceName = this.pageParam.datasourceName
        this.checkDrawer&&this.checkDrawer.openModal(data)
    }
    openDetailModal = (data) => {
        this.checkRecordDrawer&&this.checkRecordDrawer.openModal(data)
    }
    reload = () => {
        if (this.controller) {
            this.controller.refresh()
        }
    }
    changeCheckKeyword = async (e) => {
        let { checkQueryInfo } = this.state
        checkQueryInfo.keyword = e.target.value
        await this.setState({
            checkQueryInfo
        })
        if (!e) {
            this.search()
        }
    }
    render() {
        const {
            queryInfo,
            tabValue,
            checkQueryInfo,
            loading,
            userList,
            tableData
        } = this.state
        return (
            <React.Fragment>
                <div className='autoManageCheck'>
                    <TableLayout
                        title={this.pageParam.datasourceName}
                        renderDetail={() => {
                            return (
                                <Tabs activeKey={tabValue} onChange={this.changeTab}>
                                    <TabPane className='checkList' tab='待审核' key='1'>
                                        {tabValue === '1' && (
                                            <RichTableLayout
                                                disabledDefaultFooter
                                                smallLayout
                                                renderSearch={(controller) => {
                                                    this.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Input.Search
                                                                allowClear
                                                                value={checkQueryInfo.keyword}
                                                                onChange={this.changeCheckKeyword}
                                                                onSearch={this.search}
                                                                placeholder='搜索表名称'
                                                            />
                                                            <Button onClick={this.checkReset}>重置</Button>
                                                        </React.Fragment>
                                                    )
                                                }}
                                                tableProps={{
                                                    columns: this.columns,
                                                    // dataSource: tableData,
                                                    key: 'tableId'
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
                                                    width: 120,
                                                    createEditColumnElements: (index, record) => {
                                                        return [
                                                            <a
                                                                disabled={!record.stdCount&&!record.qltCount&&!record.senCount&&!record.clzCount&&!record.codeCount&&!record.lvlCount}
                                                                onClick={this.openCheckModal.bind(
                                                                    this,
                                                                    record,
                                                                    index
                                                                )}
                                                                key='edit'
                                                            >
                                                                开始审核
                                                            </a>,
                                                        ]
                                                    },
                                                }}
                                            />
                                        )}
                                    </TabPane>
                                    <TabPane tab='审核记录' key='2'>
                                        {tabValue === '2' && (
                                            <RichTableLayout
                                                disabledDefaultFooter
                                                smallLayout
                                                renderSearch={(controller) => {
                                                    this.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Input.Search
                                                                allowClear
                                                                value={queryInfo.partOfName}
                                                                onChange={this.changeKeyword}
                                                                onSearch={this.search}
                                                                placeholder='搜索字段名称或表名称'
                                                            />
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'tableOrColumn'
                                                                )}
                                                                value={queryInfo.tableOrColumn}
                                                                placeholder='对象类型'
                                                            >
                                                                <Option key={0} value={0}>表</Option>
                                                                <Option key={1} value={1}>字段</Option>
                                                            </Select>
                                                            {/*<Select*/}
                                                                {/*allowClear*/}
                                                                {/*onChange={this.changeStatus.bind(*/}
                                                                    {/*this,*/}
                                                                    {/*'items'*/}
                                                                {/*)}*/}
                                                                {/*value={queryInfo.items}*/}
                                                                {/*placeholder='治理内容'*/}
                                                            {/*>*/}
                                                                {/*<Option key={1} value='数据标准'>数据标准</Option>*/}
                                                                {/*<Option key={2} value='质量规则'>质量规则</Option>*/}
                                                                {/*<Option key={3} value='敏感数据'>敏感数据</Option>*/}
                                                                {/*<Option key={4} value='代码项'>代码项</Option>*/}
                                                                {/*<Option key={5} value='安全等级'>安全等级</Option>*/}
                                                                {/*<Option key={6} value='表的分类'>表的分类</Option>*/}
                                                            {/*</Select>*/}
                                                            {/*<Select*/}
                                                                {/*allowClear*/}
                                                                {/*onChange={this.changeStatus.bind(*/}
                                                                    {/*this,*/}
                                                                    {/*'userId'*/}
                                                                {/*)}*/}
                                                                {/*value={queryInfo.userId}*/}
                                                                {/*placeholder='审核人'*/}
                                                            {/*>*/}
                                                                {/*{userList.map((item) => {*/}
                                                                    {/*return (*/}
                                                                        {/*<Option value={item.id} key={item.id}>*/}
                                                                            {/*{item.realname}*/}
                                                                        {/*</Option>*/}
                                                                    {/*)*/}
                                                                {/*})}*/}
                                                            {/*</Select>*/}
                                                            <Button onClick={this.reset}>重置</Button>
                                                        </React.Fragment>
                                                    )
                                                }}
                                                tableProps={{
                                                    columns: this.recordColumns,
                                                }}
                                                requestListFunction={(page, pageSize, filter, sorter) => {
                                                    return this.getTableList({
                                                        pagination: {
                                                            page,
                                                            page_size: pageSize,
                                                        },
                                                        sorter: sorter || {},
                                                    })
                                                }}
                                                editColumnProps={{
                                                    createEditColumnElements: (index, record, defaultElement) => {
                                                        return RichTableLayout.renderEditElements([
                                                            {
                                                                label: '审核详情',
                                                                onClick: this.openDetailModal.bind(this, record),
                                                            },
                                                        ]).concat(defaultElement)
                                                    },
                                                }}
                                            />
                                        )}
                                    </TabPane>
                                </Tabs>
                            )
                        }}
                    />
                    <CheckRecordDrawer ref={(dom) => this.checkRecordDrawer = dom}/>
                    <CheckDrawer addTab={this.props.addTab} reload={this.reload} ref={(dom) => this.checkDrawer = dom}/>
                </div>
            </React.Fragment>
        )
    }
}