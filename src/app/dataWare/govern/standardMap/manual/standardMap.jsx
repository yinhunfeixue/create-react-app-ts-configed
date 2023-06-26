import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Input, message, Modal, Select, Tooltip } from 'antd'
import { addRelation, columnFilters, dwappColumnSearch, dwappDatabase, dwappDatasource, dwappStandardColumn, dwappStandardDetail, dwappTagInLevel } from 'app_api/standardApi'
import { LzTable } from 'app_component'
import CONSTANTS from 'app_constants'
import axios from 'axios'
import React, { Component } from 'react'
// import './index.less'
const serverList = CONSTANTS['API_LIST']['standard']

const confirm = Modal.confirm

export default class StandardMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            modalVisible: false,
            selectedRowKeys: [],

            dwLevelInfos: [],
            databaseInfos: [],
            datasourceInfos: [],
            databaseId: undefined,
            datasourceId: undefined,
            keyword: '',
            detailInfo: {},
            allDatabaseInfos: [],
            allDwLevelInfos: [],
            preciseSearch: true,
            columnKeyword: '',
            defaultKeyword: '',
            btnLoading: false,
            filterInfos: [],
            columnTableData: [],
            showTable: false,
        }
        this.mapColumns = [
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 120,
                render: (_, record) => (
                    <Tooltip title={this.renderTooltip.bind(this, _)}>
                        <span>
                            {record.recommend ? <span style={{ marginLeft: 0 }} className='dot'></span> : null}
                            <span style={{ color: record.inStandard ? '#b3b3b3' : '' }} dangerouslySetInnerHTML={{ __html: _ }} />
                        </span>
                    </Tooltip>
                ),
            },
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 140,
                render: (_, record) => (
                    <Tooltip title={this.renderTooltip.bind(this, _)}>
                        {_ ? <span style={{ color: record.inStandard ? '#b3b3b3' : '' }} dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '数据表',
                width: 120,
                dataIndex: 'tableEnglishName',
                key: 'tableEnglishName',
                operateType: 'serach',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ color: record.inStandard ? '#b3b3b3' : '' }}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                width: 140,
                dataIndex: 'databaseEnglishName',
                key: 'databaseEnglishName',
                operateType: 'searchAndSelect',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ color: record.inStandard ? '#b3b3b3' : '' }}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
                operateType: 'searchAndSelect',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ color: record.inStandard ? '#b3b3b3' : '' }}>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'inStandard',
                key: 'inStandard',
                width: 120,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已添加' /> : <StatusLabel type='warning' message='未添加' />
                },
            },
        ]
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '表英文名',
                dataIndex: 'tableEnglishName',
                key: 'tableEnglishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据库',
                dataIndex: 'databaseEnglishName',
                key: 'databaseEnglishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 60,
            //     render: (text, record, index) => {
            //         return (
            //             <div>
            //                 <Tooltip title='解除映射'>
            //                     <img onClick={this.deleteData.bind(this, record)} style={{ width: 24, cursor: 'pointer' }} src={require('app_images/map.png')} />
            //                 </Tooltip>
            //             </div>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getSearchCondition()
        this.getDwappStandardDetail()
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    deleteData = (data) => {
        let that = this
        confirm({
            title: '你确定要解除映射关系吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                axios({
                    url: serverList['deleteRelation'] + that.props.location.state.id,
                    method: 'delete',
                    data: [data.columnId],
                }).then((res) => {
                    console.log(res, 'axios')
                    if (res.data.code == 200) {
                        message.success('解除成功')
                        // that.getTableList({})
                        this.controller.refresh()
                        that.getSearchCondition()
                    }
                })
            },
        })
    }
    getDwappStandardDetail = async () => {
        let res = await dwappStandardDetail({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getSearchCondition = async () => {
        let res = await dwappTagInLevel({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                dwLevelInfos: res.data,
            })
        }
        let res1 = await dwappDatabase({ id: this.props.location.state.id })
        if (res1.code == 200) {
            this.setState({
                databaseInfos: res1.data,
            })
        }
        let res2 = await dwappDatasource({ id: this.props.location.state.id })
        if (res2.code == 200) {
            this.setState({
                datasourceInfos: res2.data,
            })
        }
        // let res2 = await dwappTagInLevel()
        // if (res2.code == 200) {
        //     this.setState({
        //         allDwLevelInfos: res2.data,
        //     })
        // }
        // let res3 = await dwappDatabase()
        // if (res3.code == 200) {
        //     this.setState({
        //         allDatabaseInfos: res3.data
        //     })
        // }
    }
    getTableList = async (params = {}) => {
        let { showTable } = this.state
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            keyword: this.state.keyword,
            datasourceId: this.state.datasourceId,
            databaseIdList: this.state.databaseId ? [this.state.databaseId] : [],
            standardId: this.props.location.state.id,
        }
        this.setState({ loading: true })
        let res = await dwappStandardColumn(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            if (res.total) {
                showTable = true
            }
            this.setState({
                tableData: res.data,
                showTable,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            this.setState({ loading: false })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    getColumnList = async (params = {}) => {
        console.log(params, 'params++++')
        let query = {
            filterInfos: [],
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            preciseSearch: this.state.preciseSearch,
            keyword: this.state.columnKeyword ? this.state.columnKeyword : this.state.defaultKeyword,
            standardId: this.props.location.state.id,
        }
        if (query.keyword == this.state.defaultKeyword) {
            this.setState({
                columnKeyword: this.state.defaultKeyword,
            })
        }
        for (let k in params.filterSelectedList) {
            if (k !== 'tableEnglishName') {
                query.filterInfos.push({ type: k, value: params.filterSelectedList[k].join(' ') })
            } else {
                query.filterInfos.push({ type: k, value: params.filterSelectedList[k] })
            }
        }
        this.setState({ loading: true })
        let res = await dwappColumnSearch(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                columnTableData: res.data,
                filterInfos: query.filterInfos,
            })
            this.lzTableDom1 && this.lzTableDom1.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    searchColumn = () => {
        this.setState({
            selectedRowKeys: [],
        })
        this.getColumnList()
    }
    onCancel = () => {
        this.setState({
            modalVisible: false,
            selectedRowKeys: [],
            columnKeyword: '',
            preciseSearch: true,
        })
    }
    openModal = async () => {
        await this.setState({
            modalVisible: true,
            defaultKeyword: (this.state.detailInfo.entityName ? this.state.detailInfo.entityName : '') + ' ' + (this.state.detailInfo.entityDesc ? this.state.detailInfo.entityDesc : ''),
        })
        this.getColumnList()
    }
    changeCheckbox = (e) => {
        this.setState({
            preciseSearch: e.target.checked,
        })
    }
    onIndexmaCheckboxChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
        })
    }
    changeStatus = async (name, e) => {
        await this.setState({
            [name]: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            datasourceId: undefined,
            databaseId: undefined,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    onView = () => {
        this.props.addTab('标准详情', this.state.detailInfo, true)
    }
    addColumnRelation = async () => {
        this.setState({ btnLoading: true })
        let res = await addRelation({ standardId: this.props.location.state.id, columnIds: this.state.selectedRowKeys })
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('映射关系添加成功')
            this.onCancel()
            // this.getTableList({})
            this.search()
            this.getSearchCondition()
        }
    }
    changeColumnKeyword = (e) => {
        this.setState({
            columnKeyword: e.target.value,
            defaultKeyword: '',
        })
    }
    onFilterSearch = async (params) => {
        let query = {
            preciseSearch: this.state.preciseSearch,
            filterInfos: this.state.filterInfos,
            type: params.dataIndex,
            keyword: this.state.columnKeyword ? this.state.columnKeyword : this.state.defaultKeyword,
            standardId: this.props.location.state.id,
        }
        let res = await columnFilters(query)
        if (res.code == 200) {
            let array = []
            res.data.map((item) => {
                item.id = item.value
                if (item.name.includes(params.value)) {
                    array.push(item)
                }
            })
            return array
        }
    }

    render() {
        const {
            tableData,
            loading,
            modalVisible,
            selectedRowKeys,
            dwLevelInfos,
            databaseInfos,
            datasourceInfos,
            datasourceId,
            databaseId,
            keyword,
            detailInfo,
            preciseSearch,
            columnKeyword,
            defaultKeyword,
            btnLoading,
            columnTableData,
            showTable,
        } = this.state
        const indexmaRowSelection = {
            columnWidth: 28,
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.onIndexmaCheckboxChange,
            getCheckboxProps: (record) => ({
                disabled: record.inStandard, // 未映射才能选
                name: record.inStandard,
            }),
        }

        if (!detailInfo) {
            return null
        }
        return (
            <React.Fragment>
                <div className='VControlGroup'>
                    <TableLayout
                        title={`映射管理（${detailInfo.entityId || ''}）`}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='标准信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '标准英文名',
                                                    content: detailInfo.entityName,
                                                },
                                                {
                                                    label: '标准中文名',
                                                    content: detailInfo.entityDesc,
                                                },
                                                {
                                                    label: '标准编码',
                                                    content: <a onClick={this.onView}>{detailInfo.entityId}</a>,
                                                },
                                                {
                                                    label: '归属部门',
                                                    content: detailInfo.controlDeptName,
                                                },
                                                {
                                                    label: '数据类型',
                                                    content: detailInfo.dataType,
                                                },
                                                {
                                                    label: '数据格式',
                                                    content: detailInfo.dataPattern,
                                                },
                                                {
                                                    label: '业务定义',
                                                    content: detailInfo.businessDefinition,
                                                },
                                                {
                                                    label: '制定依据',
                                                    content: detailInfo.according,
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return (
                                <ModuleTitle
                                    style={{ marginBottom: 15 }}
                                    title='映射信息'
                                    renderHeaderExtra={() => {
                                        return (
                                            <Button type='primary' onClick={this.openModal}>
                                                添加映射
                                            </Button>
                                        )
                                    }}
                                />
                            )
                        }}
                        tableProps={{
                            columns: this.columns,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入字段名称，表名称' />
                                    <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'datasourceId')} value={datasourceId} placeholder='数据源'>
                                        {datasourceInfos.map((item) => {
                                            return (
                                                <Option title={item.dsName} value={item.id} key={item.id}>
                                                    {item.dsName}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'databaseId')} value={databaseId} placeholder='数据库'>
                                        {databaseInfos.map((item) => {
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
                        }}
                        requestListFunction={(page, pageSize) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                        editColumnProps={{
                            width: 100,
                            createEditColumnElements: (index, record, defaultElements) => {
                                return RichTableLayout.renderEditElements([
                                    {
                                        label: '解除映射',
                                        onClick: this.deleteData.bind(this, record),
                                    },
                                ])
                            },
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        title: '添加映射',
                        visible: modalVisible,
                        width: 960,
                        onClose: this.onCancel,
                    }}
                    renderFooter={() => {
                        if (!modalVisible) {
                            return
                        }
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} disabled={!selectedRowKeys.length} onClick={this.addColumnRelation} type='primary'>
                                    确认添加
                                </Button>
                                <Button onClick={this.onCancel}>取消</Button>
                                <span>已选{selectedRowKeys.length}条</span>
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible ? (
                        <div style={{ position: 'relative' }}>
                            <div className='HControlGroup'>
                                <div style={{ flexGrow: 1, flexShrink: 1, position: 'relative' }}>
                                    <Input placeholder={defaultKeyword} value={columnKeyword} onChange={this.changeColumnKeyword} onPressEnter={this.searchColumn} />
                                    <Checkbox style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} checked={preciseSearch} onChange={this.changeCheckbox}>
                                        精准匹配
                                    </Checkbox>
                                </div>
                                <Button type='primary' onClick={this.searchColumn}>
                                    搜索
                                </Button>
                            </div>
                            <div style={{ marginTop: 16, position: 'relative' }}>
                                <LzTable
                                    from='globalSearch'
                                    columns={this.mapColumns}
                                    dataSource={columnTableData}
                                    ref={(dom) => {
                                        this.lzTableDom1 = dom
                                    }}
                                    getTableList={this.getColumnList}
                                    loading={loading}
                                    rowKey='id'
                                    rowSelection={indexmaRowSelection}
                                    onFilterSearch={this.onFilterSearch}
                                    pagination={{
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                    }}
                                />
                            </div>
                        </div>
                    ) : null}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
