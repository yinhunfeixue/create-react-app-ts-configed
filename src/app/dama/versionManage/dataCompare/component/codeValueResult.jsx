import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import { getGenFileDataSource, getManualJob, getDGDLFile } from 'app_api/autoManage'
const { Option } = Select

export default class TableResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            baseList: [],
        }
        this.columns = [
            {
                title: '代码值',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp'>
                                    <span
                                        className='compareTag'
                                        style={{ color: record.status == 1 ? '#4081FF' : '#FF9900', background: record.status == 1 ? 'rgba(64, 129, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)' }}>
                                        {record.status == 1 ? '参照' : '对比'}
                                    </span>
                                {text}
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '代码项',
                dataIndex: 'fileName',
                key: 'fileName',
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
                dataIndex: 'fileName',
                key: 'fileName',
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
                title: '对比结果',
                dataIndex: 'fileName',
                key: 'fileName',
                width: 120,
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
                title: '对比说明',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await getManualJob(query)
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

    }
    render() {
        const {
            queryInfo,
            tableData,
            baseList
        } = this.state
        return (
            <React.Fragment>
                <div className='tableResult'>
                    <RichTableLayout
                        disabledDefaultFooter
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
                                        对比详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData
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
                                        placeholder='请输入代码值'
                                    />
                                    <Select
                                        onChange={this.changeStatus.bind(this, 'databaseId')}
                                        value={queryInfo.databaseId}
                                        placeholder='代码项'
                                    >
                                        {
                                            baseList.map((item) => {
                                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Select
                                        onChange={this.changeStatus.bind(this, 'databaseId')}
                                        value={queryInfo.databaseId}
                                        placeholder='数据库'
                                    >
                                        {
                                            baseList.map((item) => {
                                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Select
                                        onChange={this.changeStatus.bind(this, 'databaseId')}
                                        value={queryInfo.databaseId}
                                        placeholder='对比结果'
                                    >
                                        {
                                            baseList.map((item) => {
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
            </React.Fragment>
        )
    }
}
