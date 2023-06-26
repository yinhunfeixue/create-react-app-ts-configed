import EmptyIcon from '@/component/EmptyIcon'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Form, Input, Pagination, Select, Spin } from 'antd'
import { applicantFilter, governTable } from 'app_api/dataModeling'
import React, { Component } from 'react'
import '../../index.less'

export default class ManagedList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
            },
            loading: false,
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
            status: 2,
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
        let res = await applicantFilter({ status: 2 })
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
        console.log(pageSize)
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
    openDetailPage = (data) => {
        this.props.addTab('治理表详情', { ...data })
    }

    renderList() {
        const { queryInfo, tableData, total, loading, userList } = this.state
        return (
            <Spin spinning={loading}>
                {total > 0 ? (
                    <React.Fragment>
                        <div className='dataContainer'>
                            {tableData.map((item) => {
                                return (
                                    <div className='dataItem'>
                                        <div style={{ background: '#28AE52', boxShadow: '0px 4px 12px 0px rgba(131, 190, 149, 0.32)' }} className='dataIcon'>
                                            <span className='iconfont icon-yichuli'></span>
                                        </div>
                                        <div className='dataContent'>
                                            <div className='dataTitle'>
                                                {item.tableNameCn} {item.tableNameEn}
                                                <Button onClick={this.openDetailPage.bind(this, item)} type='primary' ghost size='small'>
                                                    详情
                                                </Button>
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
                                                        label: '完成时间 ',
                                                        content: item.auditorTime ? (
                                                            <span>
                                                                {item.auditorTime}【{item.auditorName}】
                                                            </span>
                                                        ) : (
                                                            ''
                                                        ),
                                                    },
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
        )
    }

    render() {
        const { queryInfo, tableData, total, loading, userList } = this.state
        return (
            <div className='dgdlManagedList'>
                <div>
                    <div style={{ display: 'flex' }}>
                        <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表中／英文名' style={{ width: 320, marginRight: 8 }} />
                        <Select allowClear onChange={this.changeStatus.bind(this, 'applicantId')} value={queryInfo.applicantId} placeholder='申请人' style={{ width: 160, marginRight: 8 }}>
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
                    <Divider style={{ marginBottom: 0, marginTop: 16 }} />
                    {this.renderList()}
                </div>
            </div>
        )
    }
}
