import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Divider, Input, message, Modal, Table, Tag } from 'antd'
import { analysisThemeTree, dataSecurityLevelList, DelAnalysisThemeTree } from 'app_api/dataSecurity'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import ThemeDetailDrawer from './component/themeDetailDrawer'
import ThemeEditDrawer from './component/themeEditDrawer'
import './index.less'
const confirm = Modal.confirm

export default class AnalysisTheme extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                keyword: '',
                page: 1,
            },
            treeId: '',
            levelList: [],
        }
        this.columns = [
            {
                title: '分析主题中文名',
                dataIndex: 'name',
                key: 'name',
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
                title: '英文名称',
                dataIndex: 'englishName',
                key: 'englishName',
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
                title: '英文缩写（词根）',
                dataIndex: 'code',
                key: 'code',
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
                title: '安全等级',
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                width: 100,
                render: (text, record) =>
                    text ? (
                        <Tag color={text == 1 ? 'blue' : (text == 2 ? 'geekblue' : (text == 3 ? 'purple' : (text == 4 ? 'orange' : 'red')))}>
                            {this.getLevelDesc(text)}
                        </Tag>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务归属部门',
                dataIndex: 'businessDepartment',
                key: 'businessDepartment',
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
                title: '业务负责人',
                dataIndex: 'businessManager',
                key: 'businessManager',
                width: 120,
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
                width: 160,
                render: (text, record) => {
                    return (
                        <span>
                            <a
                                onClick={this.openEditModal.bind(this, record, 'look')}
                                key='detail'
                            >详情</a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <a
                                onClick={this.openEditModal.bind(this, record, 'edit')}
                                key='edit'
                            >编辑</a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <a
                                title={record.directSourceCount ? '该分析主题被引用，不能删除' : ''}
                                disabled={record.directSourceCount}
                                onClick={this.deleteRule.bind(
                                    this,
                                    record
                                )}
                                key='delete'
                            >删除</a>
                        </span>
                    )
                }
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList()
        this.getDataSecurityLevelList()
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data
            })
        }
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i=0;i<levelList.length;i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
    }
    deleteRule = (data) => {
        let that = this
        confirm({
            title: '你确定要删除该分析主题吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                DelAnalysisThemeTree({id: data.id}).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.search()
                    } else {
                        message.error('删除失败')
                    }
                })
            },
        })
    }
    openEditModal = (data, type) => {
        if (type == 'look') {
            this.themeDetailDrawer&&this.themeDetailDrawer.openModal(data)
        } else if (type == 'edit') {
            this.themeEditDrawer&&this.themeEditDrawer.openEditModal(data)
        } else {
            this.themeEditDrawer&&this.themeEditDrawer.openAddModal(this.state.treeId)
        }
    }
    getTableList = async () => {
        let query = {
            ...this.state.queryInfo,
        }
        this.setState({loading: true})
        let res = await analysisThemeTree(query)
        this.setState({loading: false})
        if (res.code == 200) {
            this.setState({
                tableData: this.deleteSubList(res.data.children),
                treeId: res.data.id
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            page: 1,
        }
        await this.setState({
            queryInfo
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo
        })
        this.getTableList()
    }
    changePage = (page, pageSize) => {
        let { queryInfo } = this.state
        queryInfo.page = page
        this.setState({
            queryInfo
        })
    }
    render() {
        const {
            tableData,
            queryInfo,
            loading
        } = this.state
        return (
            <React.Fragment>
                <div className='dataMasking'>
                    <TableLayout
                        title='分析主题'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.openEditModal.bind(this, 'add')}>
                                    新增分析主题
                                </Button>
                            )
                        }}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        style={{ width: 280, marginRight: 8 }}
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入中／英文名称'
                                    />
                                    <Table
                                        columns={this.columns}
                                        loading={loading}
                                        rowKey='id'
                                        dataSource={tableData}
                                        pagination={{
                                            current: queryInfo.page,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            onChange: this.changePage,
                                            showTotal: (total) => (
                                                <span>
                                              总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                          </span>
                                            ),
                                        }}
                                    />
                                </React.Fragment>
                            )
                        }}
                    />
                </div>
                <ThemeDetailDrawer ref={(dom) => this.themeDetailDrawer = dom}/>
                <ThemeEditDrawer reload={this.search} ref={(dom) => this.themeEditDrawer = dom} />
            </React.Fragment>
        )
    }
}