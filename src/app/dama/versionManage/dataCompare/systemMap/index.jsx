import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { InfoCircleFilled } from '@ant-design/icons'
import { Alert, Button, message, Modal, Select } from 'antd'
import { execute, getDatasourceMapping, postDelete } from 'app_api/systemManage'
import { datasourceMappingFilter } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import MapDetailDrawer from '../component/mapDetailDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import '../index.less'
const { Option } = Select
const taskStatusMap = {
    0: '等待更新',
    1: '更新中',
    2: '已完成',
    3: '更新失败',
}
export default class DataCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            targetDatasourceList: [],
            sourceDatasourceList: [],
        }
        this.columns = [
            {
                title: '来源数据源',
                dataIndex: 'sourceDatasourceIdentifier',
                key: 'sourceDatasourceIdentifier',
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
                title: '目标数据源',
                dataIndex: 'targetDatasourceIdentifier',
                key: 'targetDatasourceIdentifier',
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
                title: '最新修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                sorter: true,
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
                title: '修改人',
                dataIndex: 'updateUser',
                key: 'updateUser',
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
                title: '血缘更新状态',
                dataIndex: 'lineageStatus',
                key: 'lineageStatus',
                width: 120,
                render: (text, record) => {
                    switch (text) {
                        case 0:
                            return <StatusLabel message='等待更新' type='warning' />
                        case 1:
                            return <StatusLabel message='更新中' type='loading' />
                        case 2:
                            return <StatusLabel message='更新成功' type='success' />
                        case 3:
                            return <StatusLabel message='更新失败' type='error' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getFilter()
    }
    getFilter = async () => {
        let res = await datasourceMappingFilter()
        if (res.code == 200) {
            this.setState({
                sourceDatasourceList: res.data.sourceDatasourceList,
                targetDatasourceList: res.data.targetDatasourceList,
            })
        }
    }
    getTableList = async (params = {}) => {
        console.log(params)
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            page_size: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            updateTimeDesc: params.sorter.field == 'updateTime' ? (params.sorter.order == 'ascend' ? false : params.sorter.order == 'descend' ? true : undefined) : undefined,
        }
        let res = await getDatasourceMapping(query)
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    openDetailPage = (data) => {
        this.mapDetailDrawer && this.mapDetailDrawer.openModal(data, '系统映射详情')
    }
    openAddPage = (data, type) => {
        data.pageType = type
        if (type == 'add') {
            this.props.addTab('新增系统映射', { ...data })
        } else {
            this.props.addTab('编辑系统映射', { ...data })
        }
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '',
            content: '删除包括删除所有配置信息，以及因配置信息产生的血缘，不可恢复，请谨慎操作',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                postDelete({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.reset()
                        that.getFilter()
                    }
                })
            },
        })
    }
    update = (data) => {
        let that = this
        Modal.confirm({
            title: '',
            content: '更新血缘时会删除老的映射关系产生的血缘，并依据最新的映射关系生成血缘，更新后不可恢复，请谨慎操作',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                execute({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                    }
                })
            },
        })
    }
    render() {
        const { queryInfo, tableData, targetDatasourceList, sourceDatasourceList } = this.state
        return (
            <React.Fragment>
                <div className='systemMap'>
                    <RichTableLayout
                        title='系统映射关系'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/setting/md/system_mapping/add'>
                                    <Button type='primary' onClick={this.openAddPage.bind(this, {}, 'add')}>
                                        添加映射
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        renderDetail={() => {
                            return (
                                <Alert
                                    message='系统配置用于指定在不同数据源下，库和表的关系。映射关系的作用：'
                                    description={
                                        <div>
                                            1、用于生成血缘
                                            <br />
                                            2、数据源之间的对比时，指定库和表的对应关系
                                        </div>
                                    }
                                    type='info'
                                    showIcon
                                    icon={<InfoCircleFilled style={{ color: '#4D73FF' }} />}
                                />
                            )
                        }}
                        editColumnProps={{
                            width: 240,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '详情',
                                        onClick: this.openDetailPage.bind(this, record),
                                    },
                                    {
                                        label: '编辑',
                                        onClick: this.openAddPage.bind(this, record, 'edit'),
                                        funcCode: '/setting/md/system_mapping/edit',
                                    },
                                    {
                                        label: '血缘更新',
                                        disabled: record.lineageStatus == 1,
                                        onClick: this.update.bind(this, record),
                                        funcCode: '/setting/md/system_mapping/update',
                                    },
                                    {
                                        label: '删除',
                                        onClick: this.deleteData.bind(this, record),
                                        funcCode: '/setting/md/system_mapping/delete',
                                    },
                                ])
                            },
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
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='title'
                                        onChange={this.changeStatus.bind(this, 'sourceDatasourceId')}
                                        value={queryInfo.sourceDatasourceId}
                                        placeholder='来源数据源'
                                    >
                                        {sourceDatasourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='title'
                                        onChange={this.changeStatus.bind(this, 'targetDatasourceId')}
                                        value={queryInfo.targetDatasourceId}
                                        placeholder='目标数据源'
                                    >
                                        {targetDatasourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'lineageStatus')} value={queryInfo.lineageStatus} placeholder='血缘更新状态'>
                                        <Select.Option key={0} value={0}>
                                            等待更新
                                        </Select.Option>
                                        <Select.Option key={1} value={1}>
                                            更新中
                                        </Select.Option>
                                        <Select.Option key={2} value={2}>
                                            更新成功
                                        </Select.Option>
                                        <Select.Option key={3} value={3}>
                                            更新失败
                                        </Select.Option>
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
                                sorter: sorter || {},
                            })
                        }}
                    />
                </div>
                <MapDetailDrawer ref={(dom) => (this.mapDetailDrawer = dom)} />
            </React.Fragment>
        )
    }
}
