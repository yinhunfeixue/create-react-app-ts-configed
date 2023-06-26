import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, message, Modal, Radio, Select, Tooltip } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { datamodelingTable, delDatamodelingTable, dsspecificationDatasource } from 'app_api/metadataApi'
import React, { Component } from 'react'
// import '../index.less'
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
            keyword: '',
            datasourceId: undefined,
            createUser: undefined,
            sourceList: [],
            userList: [],
        }
        this.columns = [
            {
                title: '表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                width: '16%',
                render: (text) => <Tooltip title={text.replace(/\s*/g, '')}>{text.replace(/\s*/g, '')}</Tooltip>,
            },
            {
                title: '表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                width: '18%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属数据源',
                dataIndex: 'datasourceNameEn',
                key: 'datasourceNameEn',
                width: '20%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '字段个数',
                dataIndex: 'columnNums',
                key: 'columnNums',
                width: '12%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '创建人',
                dataIndex: 'createUser',
                key: 'createUser',
                width: '12%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '20%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 120,
            //     render: (text, record) => {
            //         return (
            //             <span onClick={(e) => e.stopPropagation()}>
            //                 <Tooltip title='详情'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.openDetailModal.bind(this, record)}
            //                         src={require('app_images/preview.png')}
            //                     />
            //                 </Tooltip>
            //                 <Tooltip title='编辑'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.openEditModal.bind(this, record)}
            //                         src={require('app_images/edit.png')}
            //                     />
            //                 </Tooltip>
            //                 <Tooltip title='删除'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.deleteRule.bind(this, record)}
            //                         src={require('app_images/delete.png')}
            //                     />
            //                 </Tooltip>
            //             </span>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getSourceData()
        this.getUserData()
    }
    deleteRule = (data) => {
        return delDatamodelingTable({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    openDetailModal = (data) => {
        this.props.addTab('表详情', { title: '表详情', ...data })
    }
    openEditModal = (data) => {
        this.props.addTab('新建表', { title: '编辑表', ...data })
    }
    getSourceData = async () => {
        let res = await dsspecificationDatasource({ filterConfig: false })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            datasourceId: this.state.datasourceId,
            keyword: this.state.keyword,
            createUser: this.state.createUser,
        }
        this.setState({ loading: true })
        let res = await datamodelingTable(query)
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
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            createUser: undefined,
            datasourceId: undefined,
        })
        this.search()
    }
    changeType = async (e) => {
        await this.setState({
            datasourceId: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    changecreateUser = async (e) => {
        await this.setState({
            createUser: e,
        })
        this.search()
    }
    openAddPage = () => {
        this.props.addTab('新建表')
    }

    render() {
        const { tableData, loading, classList, keyword, createUser, datasourceId, sourceList, userList } = this.state

        return (
            <RichTableLayout
                title='DDL生成'
                renderHeaderExtra={() => {
                    return (
                        <Button type='primary' onClick={this.openAddPage}>
                            新增表
                        </Button>
                    )
                }}
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search value={keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='输入表中文名或英文名' allowClear/>
                            <Select allowClear onChange={this.changeType} value={datasourceId} placeholder='数据源'>
                                {sourceList.map((item) => {
                                    return (
                                        <Option title={item.identifier} value={item.id} key={item.id}>
                                            {item.identifier}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Select allowClear onChange={this.changecreateUser} value={createUser} placeholder='创建人'>
                                {userList.map((item) => {
                                    return (
                                        <Option value={item.username} key={item.id}>
                                            {item.username}
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
                editColumnProps={{
                    width: '18%',
                    createEditColumnElements: (index, record, defaultElements) => {
                        return RichTableLayout.renderEditElements([
                            {
                                label: '详情',
                                onClick: this.openDetailModal.bind(this, record),
                            },
                            {
                                label: '编辑',
                                onClick: this.openEditModal.bind(this, record),
                            },
                        ]).concat(defaultElements)
                    },
                }}
            />
        )
    }
}
