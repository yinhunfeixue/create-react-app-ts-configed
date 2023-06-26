import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Cascader, Input, message, Modal, Radio, Select, Tooltip } from 'antd'
import { bizDatabase, classifyFilters, factassetsDelete, factassetsSearch } from 'app_api/metadataApi'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'
// import './index.less'
const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            databaseList: [],
            queryInfo: {
                classifyNodeIds: [],
                keyword: '',
            },
            bizModuleDefList: [],
            processList: [],
            showSearchResult: false,
            total: 0,
        }
        this.columns = [
            {
                title: '事实资产名称',
                dataIndex: 'name',
                key: 'name',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '事实资产英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 150,
                fixed: 'left',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '来源表',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'physicalDatabaseName',
                key: 'physicalDatabaseName',
                width: '14%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'complete',
                key: 'complete',
                width: '13%',
                render: (text, record) => {
                    return <StatusLabel message={text ? '已完成' : '未完成'} type={text ? 'success' : 'warning'} />
                },
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 80,
            //     fixed: 'right',
            //     render: (text, record) => {
            //         return (
            //             <span onClick={(e) => e.stopPropagation()}>
            //                 <Tooltip title='编辑'>
            //                     <img style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }} onClick={this.openEditModal.bind(this, record, 'edit')} src={require('app_images/edit.png')} />
            //                 </Tooltip>
            //                 <Tooltip title='删除'>
            //                     <img style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }} onClick={this.deleteRule.bind(this, record)} src={require('app_images/delete.png')} />
            //                 </Tooltip>
            //             </span>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getBizModuleAndTheme()
        // this.getTableList({})
        this.getDatabase()
    }
    deleteRule = (data) => {
        if (!data.canDelete) {
            message.info('使用中无法删除')
            return
        }
        return factassetsDelete({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
                // that.getTableList()
            }
        })
        // let that = this
        // confirm({
        //     title: '你确定要删除吗？',
        //     content: '',
        //     okText: '确定',
        //     cancelText: '取消',
        //     onOk() {
        //         factassetsDelete({ id: data.id }).then((res) => {
        //             if (res.code == 200) {
        //                 message.success('删除成功')
        //                 that.getTableList()
        //             }
        //         })
        //     },
        // })
    }
    getBizModuleAndTheme = async () => {
        let res = await classifyFilters()
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
    getDatabase = async () => {
        let res = await bizDatabase()
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    openEditModal = (data, type) => {
        data.pageType = type
        if (type == 'look') {
            this.props.addTab('事实资产详情', data)
        } else {
            this.props.addTab('定义事实资产', data)
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
            databaseIds: queryInfo.databaseId ? [queryInfo.databaseId] : [],
            configComplete: queryInfo.status == 1 ? true : queryInfo.status == 0 ? false : undefined,
        }
        this.setState({ loading: true })
        let res = await factassetsSearch(query)
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
        }
        this.setState({ loading: false })
        return {
            dataSource: res.data,
            total: res.total,
        }
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
        // this.getTableList({})
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
        const { tableData, loading, databaseList, showSearchResult, total, bizModuleDefList, queryInfo } = this.state

        return (
            <RichTableLayout
                title='事实资产'
                renderHeaderExtra={() => {
                    return (
                        <PermissionWrap funcCode='/dmm/fact_logic/add'>
                            <Button type='primary' onClick={this.openEditModal.bind(this, {}, 'add')}>
                                定义事实资产
                            </Button>
                        </PermissionWrap>
                    )
                }}
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索事实资产或来源表' />
                            <Select allowClear onChange={this.changeType.bind(this, 'status')} value={queryInfo.status} placeholder='状态'>
                                <Option value={0}>未完成</Option>
                                <Option value={1}>已完成</Option>
                            </Select>
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
                            <Select allowClear onChange={this.changeType.bind(this, 'databaseId')} value={queryInfo.databaseId} placeholder='数据库'>
                                {databaseList.map((item) => {
                                    return (
                                        <Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                            {item.physicalDatabase}
                                        </Option>
                                    )
                                })}
                            </Select>

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
                deleteFunction={(_, rows) => {
                    return this.deleteRule(rows[0])
                }}
                createDeletePermissionData={(record) => {
                    return {
                        funcCode: '/dmm/fact_logic/delete',
                    }
                }}
                editColumnProps={{
                    width: 160,
                    createEditColumnElements: (index, record, defaultElements) => {
                        console.log('aaaa', record)
                        return RichTableLayout.renderEditElements([
                            {
                                label: '详情',
                                onClick: this.openEditModal.bind(this, record, 'look'),
                            },
                            {
                                label: '编辑',
                                onClick: this.openEditModal.bind(this, record, 'edit'),
                                funcCode: '/dmm/fact_logic/edit',
                            },
                        ]).concat(defaultElements)
                    },
                }}
            />
        )
    }
}
