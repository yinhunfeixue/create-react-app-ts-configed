import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { message, Button, Popover, Divider, Spin } from 'antd'
import ModuleTitle from '@/component/module/ModuleTitle'
import { displayColumnInfoByDGDLItem, dgdlItemConfirm, displayTableInfoByDGDLItem, tableDGDLconfirm } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../../index.less'
import Cache from 'app_utils/cache'

function Content(props) {
    const { item, record } = props
    const security = item.senDGDL

    return !security ? (
        <div className='securityWrap'>
            <p>安全分类：{item.classPath || ''}</p>
            <p>
                安全等级：
                <span className={record.selectedTag == item.lvl ? 'tagItem selectedTagItem' : 'tagItem'}>{item.lvlName || ''}</span>
            </p>
        </div>
    ) : (
        <div className='securityWrap'>
            <ModuleTitle className='securityWrapItemTitle' title='分类' />
            <p>安全分类：{item.classPath || ''}</p>
            <p style={{ marginBottom: 10 }}>
                安全等级：
                <span className={record.selectedTag == item.lvl ? 'tagItem selectedTagItem' : 'tagItem'}>{item.lvlName || ''}</span>
            </p>
            <ModuleTitle className='securityWrapItemTitle' title='敏感' />
            <p>敏感标签：{security.tagName || ''}</p>
            <p>敏感级别：{security.senLvl || ''}</p>
            <p>敏感规则：{security.senRuleDes || ''}</p>
        </div>
    )
}

export default class SecurityLevelCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            selectedLevel: '1',
            loading: false,
            total: 0,
            standardList: [],
            categoryInfo: {},
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
                title: '安全分类',
                dataIndex: 'lvls',
                key: 'lvls',
                className: 'tagColumn',
                render: (text, record, index) => {
                    console.log('record', record)
                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className='HControlGroup'>
                                {record.securityList &&
                                    record.securityList.map((item) => {
                                        return (
                                            <div onClick={this.selectedTag.bind(this, index, item)} className={record.selectedTag == item.lvl ? 'tagItem selectedTagItem' : 'tagItem'}>
                                                <Popover trigger='hover' content={<Content record={record} item={item} />}>
                                                    {item.lvlName}
                                                </Popover>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )
                },
            },
        ]
    }
    componentDidMount = () => {
        this.getTableLevelList()
    }
    getTableLevelList = async (params = {}) => {
        let { selectedLevel } = this.state
        let query = {
            tableId: this.props.detailInfo.tableId,
            item: '字段安全分类分级',
        }
        let res = await displayTableInfoByDGDLItem(query)
        if (res.code == 200) {
            if ((res.data.tableClzDGDLS || []).length) {
                selectedLevel = res.data.tableClzDGDLS[0].tableLvl
            }
            await this.setState({
                categoryInfo: res.data,
                standardList: res.data.tableClzDGDLS || [],
                selectedLevel,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            tableId: this.props.detailInfo.tableId,
            item: '字段安全分类分级',
        }
        let res = await displayColumnInfoByDGDLItem(query)
        if (res.code == 200) {
            /* res.data.map((item) => {
                item.lvls = item.lvls ? item.lvls : []
                if (item.lvls.length) {
                    item.selectedTag = item.lvls[0].lvl
                }
            }) */
            await this.setState({
                tableData: res.data,
                total: res.total,
            })
            let query1 = {
                tableId: this.props.detailInfo.tableId,
                item: '字段安全分类分级',
            }
            let res1 = await displayTableInfoByDGDLItem(query1)
            if (res1.code == 200) {
                await this.setState({
                    total: res.total + (res1.data.tableClzDGDLS || []).length,
                })
                this.props.getTotal('lvlCount', this.state.total)
            }
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
    selectedTag = (index, data) => {
        let { tableData } = this.state
        tableData[index].selectedTag = data.lvl
        this.setState({ tableData })
    }
    selectLevel = (data) => {
        this.setState({
            selectedLevel: data.tableLvl,
        })
    }
    check = (data, value) => {
        this.batchCheck([data], value)
    }
    batchCheck = async (data, value) => {
        let columnDGDLItemList = [...data]
        data.map((item, index) => {
            item.securityList.map((std) => {
                if (std.lvl == item.selectedTag) {
                    columnDGDLItemList[index].securityList = [std]
                }
            })
        })
        let query = {
            checkOrNot: value,
            item: '字段安全分类分级',
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
    tableCheck = async (value) => {
        let { selectedLevel, standardList, categoryInfo } = this.state
        let tableDGDLItem = { ...categoryInfo }
        standardList.map((item, index) => {
            if (item.tableLvl == selectedLevel) {
                tableDGDLItem.tableClzDGDLS = [item]
            }
        })
        let query = {
            checkOrNot: value,
            item: '字段安全分类分级',
            userName: Cache.get('userinfo').lastname,
            tableDGDLItem,
        }
        this.setState({ loading: true })
        let res = await tableDGDLconfirm(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.getTableLevelList()
            this.search()
        }
    }
    search() {
        if (this.controller) {
            this.controller.reset()
        }
    }
    render() {
        const { tableData, selectedLevel, loading, standardList } = this.state
        return (
            <div>
                <div className='standardCheck' style={{ position: 'relative' }}>
                    {standardList.length ? (
                        <div>
                            <ModuleTitle style={{ marginBottom: 16 }} title='表安全等级' />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className='HControlGroup'>
                                    {standardList.map((item) => {
                                        return (
                                            <div onClick={this.selectLevel.bind(this, item)} className={selectedLevel == item.tableLvl ? 'tagItem selectedTagItem' : 'tagItem'}>
                                                {item.lvlName}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div>
                                    <a onClick={this.tableCheck.bind(this, true)}>通过</a>
                                    <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    <a onClick={this.tableCheck.bind(this, false)} style={{ color: '#F54F4A' }}>
                                        不通过
                                    </a>
                                </div>
                            </div>
                            <Divider dashed={true} />
                        </div>
                    ) : null}
                    <ModuleTitle style={{ marginBottom: 16 }} title='字段安全等级' />
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
                                    <a disabled={standardList.length} onClick={this.check.bind(this, record, true)} key='edit'>
                                        通过
                                    </a>,
                                    <a disabled={standardList.length} onClick={this.check.bind(this, record, false)} key='edit' className='dangerLink'>
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
                                    <Button disabled={standardList.length} loading={loading} style={{ marginRight: 8 }} type='primary' onClick={this.batchCheck.bind(this, selectedRows, true)}>
                                        通过
                                    </Button>
                                    <Button
                                        disabled={standardList.length}
                                        loading={loading}
                                        className='dangerBtn'
                                        style={{ marginRight: 16 }}
                                        ghost
                                        onClick={this.batchCheck.bind(this, selectedRows, false)}
                                    >
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
