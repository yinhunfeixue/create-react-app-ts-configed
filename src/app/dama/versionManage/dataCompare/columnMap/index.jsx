import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { InfoCircleFilled } from '@ant-design/icons'
import { Alert, Button, message, Modal, Select } from 'antd'
import { columnTypeMapping, columnTypeMappingFilter, datasourceType, deleteColumnTypeMapping } from 'app_api/systemManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import MapDetailDrawer from '../component/mapDetailDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import '../index.less'
const { Option } = Select

const taskStatusMap = {
    1: '更新中',
    2: '已完成',
}

export default class DataCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            sourceList: [],
            targetList: [],
        }
        this.columns = [
            {
                title: '来源类型',
                dataIndex: 'sourceDatasourceType',
                key: 'sourceDatasourceType',
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
                title: '目标类型',
                dataIndex: 'targetDatasourceType',
                key: 'targetDatasourceType',
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
        ]
    }
    componentWillMount = () => {
        this.getDataSourceData()
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            updateTimeDesc: params.sorter.field == 'updateTime' ? (params.sorter.order == 'ascend' ? false : params.sorter.order == 'descend' ? true : undefined) : undefined,
        }
        let res = await columnTypeMapping(query)
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
    getDataSourceData = async () => {
        let res = await columnTypeMappingFilter()
        if (res.code == 200) {
            this.setState({
                sourceList: res.data.sourceList,
                targetList: res.data.targetList,
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
    search = () => {
        if (this.controller) {
            this.controller.reset()
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
    openDetailPage = (data) => {
        this.mapDetailDrawer && this.mapDetailDrawer.openModal(data, '字段类型映射详情')
    }
    openAddPage = (data, type) => {
        data.pageType = type
        if (type == 'add') {
            this.props.addTab('新增字段类型映射', { ...data })
        } else {
            this.props.addTab('编辑字段类型映射', { ...data })
        }
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '确定删除该映射关系吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                deleteColumnTypeMapping({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.search()
                    }
                })
            },
        })
    }
    render() {
        const { queryInfo, tableData, sourceList, targetList } = this.state
        return (
            <React.Fragment>
                <div className='systemMap'>
                    <RichTableLayout
                        title='字段类型映射关系'
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/setting/md/datatype_mapping/add'>
                                    <Button type='primary' onClick={this.openAddPage.bind(this, {}, 'add')}>
                                        添加映射
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        renderDetail={() => {
                            return <Alert message='本配置用于指定在不同数据源类型下，不同字段类型的对应关系' type='info' showIcon icon={<InfoCircleFilled style={{ color: '#4D73FF' }} />} />
                        }}
                        editColumnProps={{
                            width: 160,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '详情',
                                        onClick: this.openDetailPage.bind(this, record),
                                    },
                                    {
                                        label: '编辑',
                                        onClick: this.openAddPage.bind(this, record, 'edit'),
                                        funcCode: '/setting/md/datatype_mapping/edit',
                                    },
                                    {
                                        label: '删除',
                                        onClick: this.deleteData.bind(this, record),
                                        funcCode: '/setting/md/datatype_mapping/delete',
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
                                        onChange={this.changeStatus.bind(this, 'sourceDatasourceType')}
                                        value={queryInfo.sourceDatasourceType}
                                        placeholder='来源类型'
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
                                        showSearch
                                        optionFilterProp='title'
                                        onChange={this.changeStatus.bind(this, 'targetDatasourceType')}
                                        value={queryInfo.targetDatasourceType}
                                        placeholder='目标类型'
                                    >
                                        {targetList.map((item) => {
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
