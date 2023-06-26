// 智能治理
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message } from 'antd'
import { displayTableCountsByPartOfDataSourceName, GovByDatasourceManually } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import PermissionWrap from '@/component/PermissionWrap'
import '../index.less'

const { Option } = Select

export default class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            addInfo: {
                name: '',
                updateType: 0,
            },
            sourceList: [],
            loading: false,
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
                title: '扫描时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width: 180,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={ProjectUtil.formDate(text)}>
                            {ProjectUtil.formDate(text)}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '推荐表总数',
                dataIndex: 'totalTableCount',
                key: 'totalTableCount',
                width: 160,
                sorter: true,
                render: (text, record) => <span>{text}</span>,
            },
            {
                title: '待审核表',
                dataIndex: 'tableCount',
                key: 'tableCount',
                width: 200,
                sorter: true,
                render: (text, record) => <span>{text}</span>,
            },
        ]
    }
    componentWillMount = () => {}
    getTableList = async (params = {}) => {
        console.log(params.sorter, 'params.sorter')
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            timeOrder: params.sorter.field == 'createTime' ? (params.sorter.order == 'ascend' ? 0 : 1) : 1,
            countOrder: params.sorter.field == 'tableCount' ? (params.sorter.order == 'ascend' ? 0 : params.sorter.order == 'descend' ? 1 : undefined) : undefined,
            totalCountOrder: params.sorter.field == 'totalTableCount' ? (params.sorter.order == 'ascend' ? 0 : params.sorter.order == 'descend' ? 1 : undefined) : undefined,
            partOfDsName: queryInfo.keyword,
        }
        let res = await displayTableCountsByPartOfDataSourceName(query)
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
    openDetailPage = (data) => {
        this.props.addTab('推荐审核', { ...data })
    }
    govByDatasource = async (data) => {
        this.setState({ loading: true })
        let res = await GovByDatasourceManually(data)
        this.setState({ loading: false })
        if (res.code == 200) {
            if (res.data) {
                message.success('操作成功')
                this.selectController.updateSelectedKeys([])
                this.search()
            }
        }
    }
    render() {
        const { queryInfo, tableData, loading } = this.state
        return (
            <React.Fragment>
                <div className='autoManage'>
                    <RichTableLayout
                        title='智能治理审核'
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '审核',
                                        onClick: this.openDetailPage.bind(this, record),
                                        funcCode: '/auto_gov/manage/examine',
                                    },
                                ])
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'datasourceId',
                            dataSource: tableData,
                            selectedEnable: true,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入数据源名称' />
                                </React.Fragment>
                            )
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
                        renderFooter={(controller, defaultRender) => {
                            const { selectedRows, selectedKeys } = controller
                            this.selectController = controller
                            return (
                                <div>
                                    <PermissionWrap funcCode='/auto_gov/manage/recommend'>
                                        <Button style={{ marginRight: 16 }} loading={loading} onClick={this.govByDatasource.bind(this, selectedKeys)} type='primary'>
                                            <span style={{ color: '#fff', marginRight: 4 }} className='iconfont icon-shuaxin'></span>
                                            重新推荐
                                        </Button>
                                    </PermissionWrap>

                                    {defaultRender()}
                                </div>
                            )
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
