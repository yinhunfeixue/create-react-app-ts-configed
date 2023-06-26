import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { message, Button, Popover, Spin } from 'antd'
import { displayColumnInfoByDGDLItem, dgdlItemConfirm } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../../index.less'
import Cache from 'app_utils/cache'

export default class StandardCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            total: 0,
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'egName',
                key: 'egName',
                width: 180,
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
                title: '字段中文名',
                dataIndex: 'cnName',
                key: 'cnName',
                width: 160,
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
                title: '映射标准',
                dataIndex: 'stds',
                key: 'stds',
                className: 'tagColumn',
                ellipsis: false,
                render: (text, record, index) => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className='HControlGroup'>
                                {record.stds &&
                                    record.stds.map((item) => {
                                        return (
                                            <Popover
                                                placement='topLeft'
                                                content={
                                                    <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                        <div>
                                                            <span>标准编码：</span>
                                                            <span onClick={this.onView.bind(this, item)} className='standardTooltip' style={{ color: '#1890ff', cursor: 'pointer' }}>
                                                                {item.std}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>标准中文名：</span>
                                                            <span className='standardTooltip'>{item.cnName || <EmptyLabel />}</span>
                                                        </div>
                                                        <div>
                                                            <span>标准英文名：</span>
                                                            <span className='standardTooltip'>{item.enName || <EmptyLabel />}</span>
                                                        </div>
                                                        <div>
                                                            <span>业务定义：</span>
                                                            <span className='standardTooltip'>{item.businessDefinition || <EmptyLabel />}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div onClick={this.selectedTag.bind(this, index, item)} className={record.selectedTag == item.id ? 'tagItem selectedTagItem' : 'tagItem'}>
                                                    {item.cnName}
                                                </div>
                                            </Popover>
                                        )
                                    })}
                            </div>
                        </div>
                    )
                },
            },
        ]
    }
    getTableList = async (params = {}) => {
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            tableId: this.props.detailInfo.tableId,
            item: '数据标准',
        }
        let res = await displayColumnInfoByDGDLItem(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.stds = item.stds ? item.stds : []
                if (item.stds.length) {
                    item.selectedTag = item.stds[0].id
                }
            })
            this.setState({
                tableData: res.data,
                total: res.total,
            })
            this.props.getTotal('stdCount', res.total)
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
    onView = (params) => {
        params.entityId = params.std
        this.props.addTab('标准详情', params, true)
    }
    selectedTag = (index, data) => {
        let { tableData } = this.state
        tableData[index].selectedTag = data.id
        this.setState({ tableData })
    }
    check = (data, value) => {
        this.batchCheck([data], value)
    }
    batchCheck = async (data, value) => {
        let columnDGDLItemList = [...data]
        data.map((item, index) => {
            item.stds.map((std) => {
                if (std.id == item.selectedTag) {
                    columnDGDLItemList[index].stds = [std]
                }
            })
        })
        let query = {
            checkOrNot: value,
            item: '数据标准',
            userName: Cache.get('userinfo').lastname,
            columnDGDLItemList,
        }
        this.setState({ loading: true })
        let res = await dgdlItemConfirm(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.selectController.updateSelectedKeys([])
            this.search()
            this.props.reload()
        }
    }
    search() {
        if (this.controller) {
            this.controller.reset()
        }
    }
    render() {
        const { tableData, loading } = this.state
        return (
            <div style={{ position: 'relative' }}>
                <div className='standardCheck'>
                    <RichTableLayout
                        ref={(dom) => (this.richTableLayout = dom)}
                        disabledDefaultFooter
                        smallLayout
                        title=''
                        renderSearch={(controller) => {
                            this.controller = controller
                            return null
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.check.bind(this, record, true)} key='edit'>
                                        通过
                                    </a>,
                                    <a onClick={this.check.bind(this, record, false)} key='edit' style={{ color: '#F54F4A' }}>
                                        不通过
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'columnId',
                            dataSource: tableData,
                            selectedEnable: true,
                            extraTableProps: {
                                scroll: {
                                    x: false,
                                },
                            },
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
                            const { selectedRows } = controller
                            this.selectController = controller
                            return (
                                <div>
                                    <Button loading={loading} style={{ marginRight: 8 }} type='primary' onClick={this.batchCheck.bind(this, selectedRows, true)}>
                                        通过
                                    </Button>
                                    <Button loading={loading} className='dangerBtn' style={{ marginRight: 16 }} ghost onClick={this.batchCheck.bind(this, selectedRows, false)}>
                                        不通过
                                    </Button>
                                    {defaultRender()}
                                </div>
                            )
                        }}
                    />
                </div>
                {loading ? (
                    <div className='checkSpin'>
                        <Spin spinning={loading}></Spin>
                    </div>
                ) : null}
            </div>
        )
    }
}
