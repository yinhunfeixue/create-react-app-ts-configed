import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Cascader, Input, Tooltip } from 'antd'
import { metricsSummary, SummaryClassifyFilters } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './index.less'

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                classifyNodeIds: [],
                keyword: '',
            },
            bizModuleDefList: [],
            themeDefList: [],
            showSearchResult: false,
            total: 0,
        }
        this.columns = [
            {
                title: '汇总资产名称',
                dataIndex: 'name',
                key: 'name',
                width: 220,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '汇总资产英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 220,
                fixed: 'left',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '统计粒度',
                dataIndex: 'statisticalColumn',
                key: 'statisticalColumn',
                width: 140,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标数量',
                dataIndex: 'metricsNumber',
                key: 'metricsNumber',
                width: 100,
                render: (text) => text,
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 60,
            //     fixed: 'right',
            //     render: (text, record) => {
            //         return (
            //             <span onClick={(e) => e.stopPropagation()}>
            //                 {record.configComplete ? (
            //                     <Tooltip title='详情'>
            //                         <img style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }} onClick={this.openEditModal.bind(this, record, 'look')} src={require('app_images/preview.png')} />
            //                     </Tooltip>
            //                 ) : (
            //                     <Tooltip title='编辑'>
            //                         <img style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }} onClick={this.openEditModal.bind(this, record, 'edit')} src={require('app_images/edit.png')} />
            //                     </Tooltip>
            //                 )}
            //             </span>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getBizModuleAndTheme()
    }
    getBizModuleAndTheme = async () => {
        let res = await SummaryClassifyFilters()
        if (res.code == 200) {
            this.setState({
                bizModuleDefList: this.deleteSubList(res.data),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.subList.length) {
                delete item.subList
            } else {
                this.deleteSubList(item.subList)
            }
        })
        console.log(data, 'deleteSubList')
        return data
    }
    openEditModal = (data, type) => {
        data.pageType = type
        if (type == 'look') {
            this.props.addTab('汇总资产详情', data)
        } else {
            this.props.addTab('编辑汇总资产', data)
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        this.setState({ loading: true })
        let res = await metricsSummary(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                total: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            classifyNodeIds: [],
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeType = async (name, e) => {
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
        this.setState({
            showSearchResult: true,
        })
        if (this.controller) {
            this.controller.reset()
        }
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.classifyNodeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    render() {
        const { tableData, loading, showSearchResult, total, bizModuleDefList, queryInfo, themeDefList } = this.state
        return (
            <RichTableLayout
                title='汇总资产'
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索汇总资产' />
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={bizModuleDefList}
                                value={queryInfo.classifyNodeIds}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeBusi}
                                popupClassName='searchCascader'
                                placeholder='业务分类'
                            />
                            <Button onClick={this.reset} className='searchBtn'>
                                重置
                            </Button>
                        </React.Fragment>
                    )
                }}
                tableProps={{
                    columns: this.columns,
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
                    width: 80,
                    createEditColumnElements: (index, record) => {
                        return RichTableLayout.renderEditElements([
                            {
                                label: '详情',
                                onClick: this.openEditModal.bind(this, record, 'look'),
                                disabled: !record.configComplete,
                            },
                            {
                                label: '编辑',
                                onClick: this.openEditModal.bind(this, record, 'edit'),
                                disabled: record.configComplete,
                                funcCode: '/dmm/dws/manage/edit',
                            },
                        ])
                    },
                }}
            />
        )
    }
}
