import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { message, Button, Popover, Alert, Spin } from 'antd'
import { displayColumnInfoByDGDLItem, dgdlItemConfirm } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../../index.less'
import Cache from 'app_utils/cache'
import { SelectOutlined, CheckCircleFilled } from '@ant-design/icons'

export default class RuleCheck extends Component {
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
                title: '质量规则',
                dataIndex: 'qltys',
                key: 'qltys',
                className: 'tagColumn',
                ellipsis: false,
                render: (text, record, index) => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className='HControlGroup'>
                                {record.qltys &&
                                    record.qltys.map((item, qlIndex) => {
                                        return (
                                            <Popover
                                                placement='topLeft'
                                                content={
                                                    <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                        <div>
                                                            <span>规则编码：</span>
                                                            <span className='standardTooltip'>{item.ruleCode || <EmptyLabel />}</span>
                                                        </div>
                                                        <div>
                                                            <span>规则名称：</span>
                                                            <span className='standardTooltip'>{item.ruleName || <EmptyLabel />}</span>
                                                        </div>
                                                        <div>
                                                            <span>规则类型：</span>
                                                            <span className='standardTooltip'>{item.ruleType || <EmptyLabel />}</span>
                                                        </div>
                                                        <div>
                                                            <span>规则内容：</span>
                                                            <span className='standardTooltip'>{item.ruleDesc || <EmptyLabel />}</span>
                                                        </div>
                                                        {item.foreignColumn && (
                                                            <div>
                                                                <span>依赖字段：</span>
                                                                <span className='standardTooltip'>
                                                                    {item.foreignColumn || <EmptyLabel />}
                                                                    <Tooltip title='表详情'>
                                                                        <SelectOutlined
                                                                            onClick={this.openTableDetail.bind(this, item.foreignTableId)}
                                                                            style={{ fontSize: '14px', cursor: 'pointer', color: '#4D73FF', marginLeft: 8 }}
                                                                        />
                                                                    </Tooltip>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            >
                                                <div onClick={this.selectedTag.bind(this, qlIndex, index)} className={item.selected ? 'tagItem selectedTagItem' : 'tagItem'}>
                                                    {item.ruleName}
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
            item: '质量规则',
        }
        let res = await displayColumnInfoByDGDLItem(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.qltys = item.qltys ? item.qltys : []
                item.qltys.map((qlty) => {
                    qlty.selected = false
                })
            })
            this.setState({
                tableData: res.data,
                total: res.total,
            })
            this.props.getTotal('qltCount', res.total)
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
    selectedTag = (qlIndex, index) => {
        let { tableData } = this.state
        tableData[index].qltys[qlIndex].selected = !tableData[index].qltys[qlIndex].selected
        this.setState({ tableData })
    }
    check = (data, value) => {
        this.batchCheck([data], value)
    }
    batchCheck = async (data, value) => {
        let columnDGDLItemList = []
        data.map((item) => {
            item.qltysBackup = []
            columnDGDLItemList.push(item)
        })
        data.map((item, index) => {
            item.qltys.map((std) => {
                if (std.selected) {
                    columnDGDLItemList[index].qltysBackup.push(std)
                }
            })
        })
        let hasEmpty = false
        columnDGDLItemList.map((item) => {
            if (!item.qltysBackup.length) {
                hasEmpty = true
            }
        })
        if (hasEmpty) {
            message.info('请选择质量规则')
            return
        }
        let query = {
            checkOrNot: value,
            item: '质量规则',
            userName: Cache.get('userinfo').lastname,
            columnDGDLItemList,
        }
        query.columnDGDLItemList.map((item) => {
            item.qltys = item.qltysBackup
        })
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
    openTableDetail = (id) => {
        this.props.addTab('sysDetail', { id: id }, true)
    }
    render() {
        const { tableData, loading } = this.state
        return (
            <div style={{ position: 'relative' }}>
                <div className='standardCheck'>
                    <Alert message='一个字段可包含多个质量规则，可多选' type='info' showIcon closable style={{ marginBottom: 16 }} />
                    <RichTableLayout
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
