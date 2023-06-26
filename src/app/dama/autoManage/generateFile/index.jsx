import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, message } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import AddFileDrawer from './addFileDrawer'
import { getGenFileDataSource, getManualJob, getDGDLFile } from 'app_api/autoManage'
import IconFont from '@/component/IconFont'
import PermissionWrap from '@/component/PermissionWrap'

const { Option } = Select

export default class UploadFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                fileName: '',
            },
            tableData: [],
            sourceList: [],
        }
        this.columns = [
            {
                title: '文件名称',
                dataIndex: 'fileName',
                key: 'fileName',
                width: 220,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>
                                <IconFont style={{ marginRight: 8 }} type='icon-txt' />
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '生成范围',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 220,
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
                title: '生成时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 180,
                // sorter: true,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                fixed: 'right',
                width: 120,
                render: (text, record) => {
                    if (record.status == 1) {
                        return <span>数据收集中</span>
                    } else if (record.status == 2) {
                        return (
                            <a onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                下载
                            </a>
                        )
                    } else if (record.status == 3) {
                        return <span style={{ color: '#F54F4A' }}>生成失败</span>
                    } else if (record.status == 8) {
                        return <span style={{ color: '#C4C8CC' }}>下载链接失效</span>
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    getSourceData = async () => {
        let res = await getGenFileDataSource()
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            keyword: 'DGDL文件生成',
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            fileName: '',
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
        queryInfo.fileName = e.target.value
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
    openDetailPage = async (data) => {
        let query = {
            fileId: data.fileId,
        }
        let res = await getDGDLFile(query)
        message.info('请求中…')
    }
    openAddPage = () => {
        this.addFileDrawer && this.addFileDrawer.openModal()
    }
    render() {
        const { queryInfo, tableData, sourceList } = this.state
        return (
            <React.Fragment>
                <div className='reportCollection'>
                    <RichTableLayout
                        title='治理文件生成'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/auto_gov/export/manage/add'>
                                    <Button type='primary' onClick={this.openAddPage}>
                                        文件生成
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        editColumnProps={{
                            hidden: true,
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={queryInfo.fileName} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入文件名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'datasource')} value={queryInfo.datasource} placeholder='生成范围'>
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
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
                                },
                            })
                        }}
                    />
                </div>
                <AddFileDrawer search={this.search} ref={(dom) => (this.addFileDrawer = dom)} />
            </React.Fragment>
        )
    }
}
