import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, Select } from 'antd'
import { getDataSource, getManualJob } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'
import LogDrawer from './logDrawer'
import UploadFileDrawer from './uploadDrawer'
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
            addInfo: {
                name: '',
                updateType: 0
            },
            sourceList: [],
        }
        this.columns = [
            {
                title: '文件名称',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'><IconFont style={{ marginRight: 8 }} type='icon-txt'/>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '对应数据源',
                dataIndex: 'ds_name',
                key: 'ds_name',
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
                title: '上传策略',
                dataIndex: 'strategy',
                key: 'strategy',
                width: 120,
                render: (text, record) => {
                    return (
                        <span>{text == 2 ? '全量更新' : (text == 4 ? '替换更新' : '归并更新')}</span>
                    )
                }
            },
            {
                title: '上传时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 180,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '上传状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) =>
                    text !== undefined ? <div>
                        {text == 1 ? <StatusLabel type='loading' message='上传中' /> : null}
                        {text == 2 ? <StatusLabel type='success' message='成功' /> : null}
                        {text == 3 ? <StatusLabel type='error' message='失败' /> : null}
                    </div>
                        : <EmptyLabel />
            },
        ]
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    getSourceData = async () => {
        let res = await getDataSource()
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
            keyword: 'DGDL文件采集',
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
            queryInfo
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.fileName = e.target.value
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
    reload = () => {
        this.search()
        this.getSourceData()
    }
    openDetailPage = (data) => {
        this.logDrawer&&this.logDrawer.openModal(data)
    }
    openAddPage = () => {
        this.uploadFileDrawer&&this.uploadFileDrawer.openModal()
    }
    render() {
        const {
            queryInfo,
            tableData,
            sourceList
        } = this.state
        return (
            <React.Fragment>
                <div className='reportCollection'>
                    <RichTableLayout
                        title='治理文件上传'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/auto_gov/import/manage/upload'>
                                     <Button type='primary' onClick={this.openAddPage}>
                                        上传文件
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        editColumnProps={{
                            width: 90,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a
                                        disabled={record.status == 1}
                                        onClick={this.openDetailPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        日志
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
                                        style={{ width: 280 }}
                                        value={queryInfo.fileName}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入文件名称'
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'datasource'
                                        )}
                                        value={queryInfo.datasource}
                                        placeholder='对应数据源'
                                    >
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'status'
                                        )}
                                        value={queryInfo.status}
                                        placeholder='上传状态'
                                    >
                                        <Option key={1} value={1}>上传中</Option>
                                        <Option key={2} value={2}>成功</Option>
                                        <Option key={3} value={3}>失败</Option>
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
                <UploadFileDrawer search={this.reload} ref={(dom) => this.uploadFileDrawer = dom}/>
                <LogDrawer ref={(dom) => this.logDrawer = dom}/>
            </React.Fragment>
        )
    }
}
