import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Cascader, Input, Select } from 'antd'
import { categoryTree, getExternalList, reportsLevel } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select

export default class ReportFileList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            categoryTreeData: [],
            categoryId: [],
            levelList: []
        }
        this.columns = [
            {
                title: '报表名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '报表分类',
                dataIndex: 'categoryPath',
                key: 'categoryPath',
                ellipsis: true,
                width: 180,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '报表等级',
                dataIndex: 'levelName',
                key: 'levelName',
                ellipsis: true,
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '最近更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 180,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'configComplete',
                key: 'configComplete',
                width: 150,
                ellipsis: true,
                render: (text, record) =>
                    text !== undefined ? <div>
                        {text ? <StatusLabel type='success' message='信息完成' /> : null}
                        {!text ? <StatusLabel type='minus' message={'未补全 ' + record.configProportion*100 + '%'} /> : null}
                    </div>
                        : <EmptyLabel />
            },
        ]
    }
    componentWillMount = () => {
        this.getLevelList()
        this.getTree()
    }
    getTree = async () => {
        let res = await categoryTree()
        if (res.code == 200) {
            this.setState({
                categoryTreeData: this.deleteSubList(res.data.children)
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
    getLevelList = async () => {
        let res = await reportsLevel({isFilter: true})
        if (res.code == 200) {
            this.setState({
                levelList: res.data
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await getExternalList(query)
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
    changeType = async (value) => {
        console.log(value)
        let { queryInfo } = this.state
        queryInfo.categoryId = value.length ? value[value.length - 1] : ''
        await this.setState({
            queryInfo,
            categoryId: value
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
            categoryId: []
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
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openDetailPage = (data) => {
        data.pageType = 'look'
        this.props.addTab('报表编辑', {...data})
    }
    openEditPage = (data) => {
        data.pageType = 'edit'
        this.props.addTab('报表编辑', {...data})
    }
    render() {
        const {
            queryInfo,
            categoryTreeData,
            categoryId,
            levelList
        } = this.state
        return (
            <React.Fragment>
                <div className='reportCollection'>
                    <RichTableLayout
                        title='报表列表'
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a
                                        onClick={this.openDetailPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        详情
                                    </a>,
                                    <a
                                        onClick={this.openEditPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        编辑
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        style={{ width: 280 }}
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入报表名称'
                                    />
                                    <Cascader
                                        allowClear
                                        expandTrigger="hover"
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        value={categoryId}
                                        options={categoryTreeData}
                                        style={{ width: 160 }}
                                        onChange={this.changeType}
                                        displayRender={(e) => e.join('-')}
                                        popupClassName='searchCascader'
                                        placeholder='报表分类'
                                    />
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'levelCode'
                                        )}
                                        value={queryInfo.levelCode}
                                        placeholder='报表等级'
                                        style={{ width: 160 }}
                                    >
                                        {
                                            levelList.map((item) => {
                                                return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Select
                                        allowClear
                                        onChange={this.changeStatus.bind(
                                            this,
                                            'infoComplete'
                                        )}
                                        value={queryInfo.infoComplete}
                                        placeholder='状态'
                                        style={{ width: 160 }}
                                    >
                                        <Option key={0} value={false}>未补全</Option>
                                        <Option key={1} value={true}>信息完整</Option>
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
                                }
                            })
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
