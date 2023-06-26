import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Cascader, Input, message, Modal, Radio, Select, Tabs } from 'antd'
import { dimassets, dimtable, dimtableClassifyFilters, dimassetsClassifyFilters, dimtableDatabase, dimtableDelete, dimtableTypes } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm
const TabPane = Tabs.TabPane

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                classifyNodeIds: [],
                keyword: '',
                databaseId: undefined,
            },
            typeList: [
                { id: 1, name: '普通维度' },
                { id: 2, name: '枚举维度' },
                { id: 3, name: '层级维度' },
            ],
            bizModuleDefList: [],
            assetBizModuleDefList: [],
            themeDefList: [],
            databaseList: [],

            tabValue: this.pageParams.tabValue ? this.pageParams.tabValue : '0',
        }
        this.columns = [
            {
                title: '维度名称',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp1'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '维度英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: '20%',
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp1'>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '维度类型',
                dataIndex: 'type',
                key: 'type',
                width: '12%',
                render: (text, record) => <span>{text == 1 ? '普通维度' : text == 2 ? '枚举维度' : text == 3 ? '层级维度' : <EmptyLabel />}</span>,
            },
            {
                title: '来源表',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
                width: '18%',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '数据库',
                dataIndex: 'physicalDatabaseName',
                key: 'physicalDatabaseName',
                width: '14%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
        this.assetColumns = [
            {
                title: '维度资产名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
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
                title: '维度资产英文名称',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 150,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
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
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
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
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '主表来源',
                dataIndex: 'physicalTableName',
                key: 'physicalTableName',
                width: '16%',
                render: (text, record) => (
                    <Tooltip title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '数据库',
                dataIndex: 'physicalDatabaseName',
                key: 'physicalDatabaseName',
                width: '14%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '关联维度数',
                dataIndex: 'dimensionNumber',
                key: 'dimensionNumber',
                width: '10%',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 60,
            //     fixed: 'right',
            //     render: (text, record, index) => {
            //         return (
            //             <div>
            //                 <Tooltip title='编辑'>
            //                     <img className='editImg' onClick={this.openAssetModal.bind(this, record)} src={require('app_images/edit.png')} />
            //                 </Tooltip>
            //             </div>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getBizModuleAndTheme()
        this.getDatabase()
        this.getTypes()
        // this.getTableList({})
    }

    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getBizModuleAndTheme = async () => {
        let res = await dimtableClassifyFilters()
        if (res.code == 200) {
            this.setState({
                bizModuleDefList: this.deleteSubList(res.data),
            })
        }
        let res1 = await dimassetsClassifyFilters()
        if (res1.code == 200) {
            this.setState({
                assetBizModuleDefList: this.deleteSubList(res1.data),
            })
        }
    }

    openAssetModal = (data, type) => {
        data.pageType = type
        data.tabValue = this.state.tabValue

        const params = {
            id: data.id,
            tabValue: this.state.tabValue,
        }
        if (type == 'look') {
            this.props.addTab('维度资产详情', data)
        } else {
            this.props.addTab('编辑维度资产', params)
        }
    }

    getDatabase = async () => {
        let res = await dimtableDatabase()
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    getTypes = async () => {
        let res = await dimtableTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
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
    deleteData = async (data) => {
        if (!data.canDelete) {
            message.info('使用中无法删除')
            return
        }
        return dimtableDelete({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
                // that.getTableList()
                this.search()
            }
        })
    }
    openColumnDetail = (data) => {
        this.drawer.showModal()
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openStandardDetail = (data) => {}
    openEditModal = (data, type) => {
        data.pageType = type
        if (type == 'look') {
            this.props.addTab('维度详情', data)
        } else {
            this.props.addTab('定义维度', data)
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            databaseIds: queryInfo.databaseId ? [queryInfo.databaseId] : [],
        }
        this.setState({ loading: true })
        let res = {}
        if (tabValue == 1) {
            res = await dimassets(query)
        } else {
            res = await dimtable(query)
        }
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
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
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
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
    search = () => {
        // this.getTableList({})
        if (this.controller) {
            this.controller.reset()
        }
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
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
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.classifyNodeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    openAddPage = () => {
        this.props.addTab('定义维度')
    }

    renderSearch() {
        const { tableData, loading, tabValue, bizModuleDefList, assetBizModuleDefList, queryInfo, themeDefList, databaseList, typeList } = this.state

        return (
            <React.Fragment>
                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder={tabValue == 0 ? '搜索维度或来源表' : '搜索维度资产或主表名'} />
                {tabValue == 0 ? (
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
                ) : (
                    <Cascader
                        allowClear
                        fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                        options={assetBizModuleDefList}
                        value={queryInfo.classifyNodeIds}
                        displayRender={(e) => e.join('-')}
                        onChange={this.changeBusi}
                        popupClassName='searchCascader'
                        placeholder='业务分类'
                    />
                )}
                {tabValue == 0 ? (
                    <Select allowClear onChange={this.changeType.bind(this, 'type')} value={queryInfo.type} placeholder='维度类型'>
                        {typeList.map((item) => {
                            return (
                                <Option title={item.name} value={item.id} key={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>
                ) : null}
                <Select allowClear onChange={this.changeType.bind(this, 'databaseId')} value={queryInfo.databaseId} placeholder='数据库'>
                    {databaseList.map((item) => {
                        return (
                            <Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                {item.physicalDatabase}
                            </Option>
                        )
                    })}
                </Select>
                <Button onClick={this.reset}>重置</Button>
            </React.Fragment>
        )
    }

    render() {
        const { tableData, loading, tabValue, bizModuleDefList, queryInfo, themeDefList, databaseList, typeList } = this.state

        return (
            <TableLayout
                title='维度管理'
                renderHeaderExtra={() => {
                    const enable = tabValue === '0'
                    return (
                        <PermissionWrap funcCode='/dmm/dim/manage/add'>
                            <Button onClick={this.openAddPage} type='primary' style={{ transition: 'none', visibility: enable ? '' : 'hidden' }}>
                                定义维度
                            </Button>
                        </PermissionWrap>
                    )
                }}
                renderDetail={() => {
                    return (
                        <Tabs activeKey={tabValue} onChange={this.changeTab} animated={false}>
                            <TabPane tab='维度' key='0'>
                                <RichTableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    renderSearch={(controller) => {
                                        this.controller = controller
                                        return this.renderSearch()
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        // extraTableProps: {
                                        //     scroll: {
                                        //         x: 1300,
                                        //     },
                                        // },
                                    }}
                                    requestListFunction={(page, pageSize) => {
                                        return this.getTableList({
                                            pagination: {
                                                page,
                                                page_size: pageSize,
                                            },
                                        })
                                    }}
                                    deleteFunction={(keys, rows) => {
                                        return this.deleteData(rows[0])
                                    }}
                                    createDeletePermissionData={(record) => {
                                        return {
                                            funcCode: '/dmm/dim/manage/delete',
                                        }
                                    }}
                                    editColumnProps={{
                                        width: '18%',
                                        createEditColumnElements: (index, record, defaultElement) => {
                                            return RichTableLayout.renderEditElements([
                                                {
                                                    label: '详情',
                                                    onClick: this.openEditModal.bind(this, record, 'look'),
                                                },
                                                {
                                                    label: '编辑',
                                                    onClick: this.openEditModal.bind(this, record, 'edit'),
                                                    funcCode: '/dmm/dim/manage/edit',
                                                },
                                            ]).concat(defaultElement)
                                        },
                                    }}
                                />
                            </TabPane>
                            <TabPane tab='维度资产列表' key='1'>
                                {tabValue === '1' && (
                                    <RichTableLayout
                                        disabledDefaultFooter
                                        smallLayout
                                        renderSearch={(controller) => {
                                            this.controller = controller
                                            return this.renderSearch()
                                        }}
                                        tableProps={{
                                            columns: this.assetColumns,
                                        }}
                                        requestListFunction={(page, pageSize) => {
                                            return this.getTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                },
                                            })
                                        }}
                                        deleteFunction={(keys, rows) => {
                                            return this.deleteData(rows[0])
                                        }}
                                        createDeletePermissionData={(record) => {
                                            return {
                                                funcCode: '/dmm/dim/manage/deleteasset',
                                            }
                                        }}
                                        editColumnProps={{
                                            width: '18%',
                                            createEditColumnElements: (index, record, defaultElement) => {
                                                return RichTableLayout.renderEditElements([
                                                    {
                                                        label: '详情',
                                                        onClick: this.openAssetModal.bind(this, record, 'look'),
                                                    },
                                                    {
                                                        label: '编辑',
                                                        onClick: this.openAssetModal.bind(this, record),
                                                        funcCode: '/dmm/dim/manage/editasset',
                                                    },
                                                ]).concat(defaultElement)
                                            },
                                        }}
                                    />
                                )}
                            </TabPane>
                        </Tabs>
                    )
                }}
            />
        )
    }
}
