// 数据分布
import EmptyIcon from '@/component/EmptyIcon'
import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Col, Empty, Input, Pagination, Row, Select, Spin } from 'antd'
import { auditListDs } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import './index.less'

const { Option } = Select
export default class DadaDiscovery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                page: 1,
                pageSize: 16,
                keyword: '',
            },
            isSearch: false,
            tableData: [],
            total: 0,
            loading: false,
        }
    }
    componentWillMount = () => {
        this.getTableList()
    }
    openDetailPage = async (data) => {
        this.props.addTab('数据发现表详情', { ...data })
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            ...queryInfo,
        }
        this.setState({ loading: true })
        let res = await auditListDs(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data.list,
                total: res.data.total,
            })
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            page: 1,
            pageSize: 16,
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
            queryInfo,
            isSearch: true,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    onShowSizeChange = async (current, pageSize) => {
        const { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.pageSize = pageSize
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    changePage = async (page) => {
        const { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    render() {
        const { queryInfo, tableData, total, loading, isSearch } = this.state
        return (
            <React.Fragment>
                <div className='dataDiscovery'>
                    <TableLayout
                        title='数据发现'
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    {total || isSearch ? (
                                        <div>
                                            <div className='searchGroup'>
                                                <Input.Search
                                                    allowClear
                                                    style={{ width: 280, marginRight: 8 }}
                                                    value={queryInfo.keyword}
                                                    onChange={this.changeKeyword}
                                                    onSearch={this.search}
                                                    placeholder='数据源搜索'
                                                />
                                            </div>
                                            <Spin spinning={loading}>
                                                {total ? (
                                                    <Row className='taskArea' gutter={[16, 16]}>
                                                        {tableData.map((item, index) => {
                                                            return (
                                                                <Col span={6}>
                                                                    <div className='taskItem' onClick={this.openDetailPage.bind(this, item)}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <div className='taskName'>
                                                                                <img src={require('app_images/apply.png')} />
                                                                                {item.datasourceNameCn}
                                                                            </div>
                                                                        </div>
                                                                        <div className='countInfo'>
                                                                            <span className='itemInfo'>{ProjectUtil.formNumber(item.tableCountToAudit || 0)}</span>
                                                                            <span className='itemLabel'>待确认表</span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            )
                                                        })}
                                                    </Row>
                                                ) : (
                                                    <div style={{ marginTop: 100 }}>
                                                        <EmptyIcon description='暂无搜索数据' />
                                                    </div>
                                                )}
                                            </Spin>
                                                <Pagination
                                                    style={{ marginTop: 16 }}
                                                    pageSize={queryInfo.pageSize}
                                                    current={queryInfo.page}
                                                    total={total}
                                                    showSizeChanger
                                                    showQuickJumper
                                                    showTotal={(total) => (
                                                        <span>
                                                            总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                        </span>
                                                    )}
                                                    onChange={this.changePage}
                                                    onShowSizeChange={this.onShowSizeChange}
                                                    pageSizeOptions={[16, 24, 48, 96]}
                                                />
                                        </div>
                                    ) : (
                                        <Spin spinning={loading}>
                                            <Empty
                                                style={{ padding: '80px 0 80px 0', background: '#fff' }}
                                                image={<img src={require('app_images/empty2.png')} />}
                                                description={<span style={{ color: '#9EA3A8' }}>暂无数据发现</span>}
                                                imageStyle={{
                                                    height: 87,
                                                }}
                                            ></Empty>
                                        </Spin>
                                    )}
                                </React.Fragment>
                            )
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
