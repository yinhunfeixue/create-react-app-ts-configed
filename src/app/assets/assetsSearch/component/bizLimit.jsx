import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Input, Tooltip } from 'antd'
import { bizLimit } from 'app_api/metadataApi'
import DeriveDetailDrawer from 'app_page/dama/newIndexma/deriveDetailDrawer'
import React, { Component } from 'react'

export default class BizLimit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            tableLoading: false,
            loading: false,
        }
        this.columns = [
            {
                title: '业务限定名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                fixed: 'left',
                width: 280,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务限定英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 280,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '计算逻辑',
                dataIndex: 'calculateDesc',
                key: 'calculateDesc',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.getTableList()
    }
    openIndexma = (data) => {
        this.deriveDrawer.openBusinessDetail(data.id)
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...this.state.queryInfo,
            sourceAssetsId: this.props.param.id,
        }
        let res = await bizLimit(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
            }
            this.setState({
                tableData: res.data,
            })

            return {
                dataSource: res.data,
                total: res.total,
            }
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
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        this.controller.reset()
    }
    render() {
        const { queryInfo } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    smallLayout
                    disabledDefaultFooter
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索业务限定' />
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={async (page, pageSize) => {
                        return await this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    editColumnProps={{
                        width: 60,
                        createEditColumnElements: (_, record) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '详情',
                                    onClick: this.openIndexma.bind(this, record),
                                },
                            ])
                        },
                    }}
                />
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}
