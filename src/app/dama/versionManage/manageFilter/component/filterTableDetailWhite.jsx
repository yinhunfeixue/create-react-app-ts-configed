import EmptyLabel from '@/component/EmptyLabel'
import { Button, Input, Form, Tag, Tooltip, message, Table, Select, Popconfirm } from 'antd'
import RichTableLayout from '@/component/layout/RichTableLayout'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import { filterTable, dsSettingDetail, filterTableDb, changeFilterStatus, whiteListTableDelete } from 'app_api/autoManage'

export default class FilterTableDetailWhite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                filterRules: [],
            },
            tableData: [{ id: 1 }],
            datasourceName: '',
            baseList: [],
            queryInfo: {
                keyword: '',
            },
            total: 0,
            loading: false,
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '表名称',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
                width: 200,
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
                title: '所属库',
                dataIndex: 'physicalDatabase',
                key: 'physicalDatabase',
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
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 110,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popconfirm title='移出过滤后，规则将不再过滤该表' onConfirm={this.deleteColumn.bind(this, index)} okText='移出' cancelText='取消'>
                                <a>移除治理</a>
                            </Popconfirm>
                        </div>
                    )
                },
            },
        ]
    }
    openModal = async (data) => {
        let { detailInfo } = this.state
        detailInfo.dsId = data.dsId
        console.log(data, 'openModal')
        await this.setState({
            modalVisible: true,
            detailInfo,
            datasourceName: data.datasourceName,
        })
        this.getDetailInfo()
        await this.reset()
        this.getDbList()
        this.getFilterTableTotal()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getDbList = async () => {
        let { detailInfo } = this.state
        let res = await filterTableDb({ datasourceId: detailInfo.dsId })
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    getDetailInfo = async () => {
        let { detailInfo } = this.state
        let res = await dsSettingDetail({ id: detailInfo.dsId })
        if (res.code == 200) {
            res.data.filterRules = res.data.filterRules ? res.data.filterRules : []
            res.data.filterRuleDesc = ''
            res.data.filterRules.map((item, index) => {
                res.data.filterRuleDesc += item.name + (index + 1 == res.data.filterRules.length ? '' : '，')
            })
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getTableList = async (params) => {
        let { detailInfo, queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            datasourceId: detailInfo.dsId,
            ...queryInfo,
        }
        query.status = 2
        let res = await filterTable(query)
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
    getFilterTableTotal = async () => {
        let { detailInfo } = this.state
        let query = {
            datasourceId: detailInfo.dsId,
            status: 2,
        }
        let res = await filterTable(query)
        if (res.code == 200) {
            this.setState({
                total: res.total,
            })
        }
    }
    deleteColumn = async (index) => {
        let { tableData } = this.state
        let query = {
            id: tableData[index].tableId,
        }
        let res = await whiteListTableDelete(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.search()
            this.getFilterTableTotal()
            this.props.search()
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
    search = async () => {
        if (this.controller) {
            this.controller.reset()
        }
    }

    render() {
        const { modalVisible, detailInfo, tableData, baseList, queryInfo, datasourceName, loading, total } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterTableDetail',
                    title: '治理表明细',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <ModuleTitle style={{ marginBottom: 15 }} title='基本信息' />
                        <Form className='MiniForm DetailPart' layout='inline' style={{ background: 'none', padding: '0px' }}>
                            {RenderUtil.renderFormItems([{ label: '数据源名称', content: datasourceName }])}
                        </Form>
                        <ModuleTitle style={{ margin: '32px 0 15px 0' }} title={<div style={{ width: '100%' }}>治理表</div>} />
                        <RichTableLayout
                            title=''
                            disabledDefaultFooter
                            smallLayout
                            editColumnProps={{
                                hidden: true,
                            }}
                            tableProps={{
                                columns: this.columns,
                                key: 'tableId',
                                dataSource: tableData,
                                extraTableProps: {
                                    scroll: {
                                        x: 'auto',
                                    },
                                },
                            }}
                            renderSearch={(controller) => {
                                this.controller = controller
                                return (
                                    <React.Fragment>
                                        <Input.Search allowClear style={{ width: 325 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名称' />
                                        <Select allowClear style={{ width: 180 }} onChange={this.changeStatus.bind(this, 'databaseId')} value={queryInfo.databaseId} placeholder='所属库'>
                                            {baseList.map((item) => {
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
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
