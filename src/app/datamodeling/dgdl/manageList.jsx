import EmptyIcon from '@/component/EmptyIcon'
import TableLayout from '@/component/layout/TableLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Form, Input, Pagination, Select, Spin, Tabs } from 'antd'
import { applicantFilter, governTable } from 'app_api/dataModeling'
import React, { Component } from 'react'
import '../index.less'
import ManagedList from './comonpent/managedList'
import PermissionWrap from '@/component/PermissionWrap'

const { TabPane } = Tabs
export default class ManageList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
            },
            loading: false,
            tabValue: '1',
            tableData: [],
            total: 0,
            userList: [],
        }
    }
    componentDidMount = () => {
        this.getTableList()
        this.getUserList()
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            ...queryInfo,
            status: 1,
        }
        this.setState({ loading: true })
        let res = await governTable(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total,
            })
        }
    }
    getUserList = async () => {
        let res = await applicantFilter({ status: 1 })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changePage = async (page) => {
        let { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    changePageSize = async (current, size) => {
        let { queryInfo } = this.state
        queryInfo.pageSize = size
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            page: 1,
            pageSize: 10,
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    openManagePage = (data) => {
        this.props.addTab('dgdl表治理', { ...data })
    }
    render() {
        const { queryInfo, tabValue, tableData, total, loading, userList } = this.state
        return (
            <div className='dgdlManage'>
                <TableLayout
                    title='表治理'
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Tabs activeKey={tabValue} tabPosition='top' onChange={this.changeTab}>
                                    <TabPane tab='待治理' key='1'>
                                        <div>
                                            <div style={{ display: 'flex' }}>
                                                <Input.Search
                                                    value={queryInfo.keyword}
                                                    onChange={this.changeKeyword}
                                                    onSearch={this.search}
                                                    placeholder='请输入表中／英文名'
                                                    style={{ width: 320, marginRight: 8 }}
                                                />
                                                <Select
                                                    allowClear
                                                    onChange={this.changeStatus.bind(this, 'applicantId')}
                                                    value={queryInfo.applicantId}
                                                    placeholder='申请人'
                                                    style={{ width: 160, marginRight: 8 }}
                                                >
                                                    {userList.map((item) => {
                                                        return (
                                                            <Option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Button onClick={this.reset}>重置</Button>
                                            </div>
                                            <Divider style={{ marginBottom: 0, marginTop: 16, borderTopColor: '#EEF0F5' }} />
                                            <Spin spinning={loading}>
                                                {total > 0 ? (
                                                    <React.Fragment>
                                                        <div className='dataContainer'>
                                                            {tableData.map((item) => {
                                                                return (
                                                                    <div className='dataItem'>
                                                                        <div className='dataIcon'>
                                                                            <span className='iconfont icon-daichuli'></span>
                                                                        </div>
                                                                        <div className='dataContent'>
                                                                            <div className='dataTitle'>
                                                                                {item.tableNameCn} {item.tableNameEn}
                                                                                <PermissionWrap funcCode='/norm/ddl_gov/manage/action'>
                                                                                    <Button onClick={this.openManagePage.bind(this, item)} type='primary' size='small'>
                                                                                        去治理
                                                                                    </Button>
                                                                                </PermissionWrap>
                                                                            </div>
                                                                            <Form className='EditMiniForm'>
                                                                                {RenderUtil.renderFormItems([
                                                                                    {
                                                                                        label: '字段数 ',
                                                                                        content: item.columnNums,
                                                                                    },
                                                                                    {
                                                                                        label: '申请时间 ',
                                                                                        content: item.applicantTime ? (
                                                                                            <span>
                                                                                                {item.applicantTime}【{item.applicantName}】
                                                                                            </span>
                                                                                        ) : (
                                                                                            ''
                                                                                        ),
                                                                                    },
                                                                                    {
                                                                                        label: '最新治理时间 ',
                                                                                        content: item.auditorTime ? (
                                                                                            <span>
                                                                                                {item.auditorTime}【{item.auditorName}】
                                                                                            </span>
                                                                                        ) : (
                                                                                            ''
                                                                                        ),
                                                                                    },
                                                                                    // {
                                                                                    //     label: '治理进度 ',
                                                                                    //     content: <span>
                                                                                    //         {item.governPercent}%
                                                                                    //     <Progress
                                                                                    //         width={16}
                                                                                    //         strokeColor='#4D73FF'
                                                                                    //         strokeWidth={20}
                                                                                    //         showInfo={false}
                                                                                    //         strokeLinecap="square" type="circle" percent={item.governPercent} />
                                                                                    // </span>,
                                                                                    // },
                                                                                ])}
                                                                            </Form>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <Pagination
                                                            style={{ width: 'auto' }}
                                                            showSizeChanger={true}
                                                            showQuickJumper={true}
                                                            onChange={this.changePage}
                                                            onShowSizeChange={this.changePageSize}
                                                            showTotal={(total) => `总数 ${total} 条`}
                                                            current={queryInfo.page}
                                                            pageSize={queryInfo.pageSize}
                                                            total={total}
                                                        />
                                                    </React.Fragment>
                                                ) : (
                                                    <EmptyIcon />
                                                )}
                                            </Spin>
                                        </div>
                                    </TabPane>
                                    <TabPane tab='已治理' key='2'>
                                        {tabValue == 2 ? <ManagedList {...this.props} /> : null}
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        )
                    }}
                />
            </div>
        )
    }
}
