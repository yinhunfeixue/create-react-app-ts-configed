import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Radio, Select, Table, Tabs, Tag } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { clusterDetail, clusterSave, dwappCluster, dwappClusterColumnWithStatus, dwDatabase, dwDatasource, dwLevelTag, dwTable, fillChinese, relateWhenDelete } from 'app_api/standardApi'
import CONSTANTS from 'app_constants'
import axios from 'axios'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './clusterEdit.less'

const serverList = CONSTANTS['API_LIST']['standard']

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm
const TabPane = Tabs.TabPane

export default class ClusterEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            way: undefined,
            strategy: undefined,
            tabValue: '1',
            tableInfo: {
                total: 0,
            },
            clusterTotal: 0,
            hasChineseCount: 0,
            searchParam: this.pageParam.searchParam,
            clusterList: [],

            detailInfo: {
                suggestEnglishName: [],
                suggestChineseName: [],
            },
            btnLoading: false,
            dwLevelInfos: [],
            databaseInfos: [],
            datasourceInfos: [],
            tableInfos: [],
            datasourceId: undefined,
            databaseId: undefined,
            tableId: undefined,
            relateColumnData: [],
            allHasChineseName: false,
            showShadow: false,
            inputColor: '#333',
            inputColor1: '#333',
        }
        this.bloodColumns = [
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据表',
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
        ]
        this.columns = [
            {
                title: '字段名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段英文',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 120,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据表',
                dataIndex: 'tableEnglishName',
                key: 'tableEnglishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据库',
                dataIndex: 'databaseEnglishName',
                key: 'databaseEnglishName',
                width: 120,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentDidMount = async () => {
        this.init()
        document.addEventListener(
            'mousedown',
            function (e) {
                if (e.target.className == 'ant-btn clusterBtn ant-btn-primary') {
                    e.preventDefault()
                }
            },
            false
        )
    }
    init = async () => {
        await this.getDetail()
        // this.getFilters()
        this.getDatabase()
        this.getDatasource()
        this.getTable()
    }

    getDetail = async () => {
        let res = await clusterDetail({ id: this.pageParam.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
                inputColor: res.data.confirm ? '#333' : '#b3b3b3',
                inputColor1: res.data.confirm ? '#333' : '#b3b3b3',
            })
        }
    }
    openEditModal = async (data) => {
        await this.getRelateColumn(data)
        const { relateColumnData, detailInfo } = this.state
        let that = this
        confirm({
            className: 'withFooterLine',
            icon: <ExclamationCircleFilled style={{ color: '#CC0000' }} />,
            title: '确定要删除该字段吗？相关血缘字段将会一起被删除',
            width: 960,
            content: (
                <div>
                    <div
                        style={{
                            margin: '24px 0 16px 0px',
                            fontSize: '16px',
                            color: '#262626',
                        }}
                    >
                        相关血缘字段（{relateColumnData.length}）
                    </div>
                    <div className='commonScroll' style={{ maxHeight: '250px' }}>
                        <Table dataSource={relateColumnData} columns={this.bloodColumns} pagination={false} rowKey='columnId' />
                    </div>
                </div>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                axios({
                    url: serverList['deleteCluster'],
                    method: 'delete',
                    data: {
                        clusterId: detailInfo.id,
                        columnId: [data.columnId],
                    },
                }).then(function (res) {
                    if (res.data.code == 200) {
                        message.success('删除成功')
                        that.search()
                    }
                })
            },
        })
    }
    getRelateColumn = async (data) => {
        let query = {
            clusterId: this.state.detailInfo.id,
            columnId: [data.columnId],
        }
        let res = await relateWhenDelete(query)
        if (res.code == 200) {
            this.setState({
                relateColumnData: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        const { detailInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            clusterId: detailInfo.id,
            keyword: this.state.keyword,
            datasourceId: this.state.datasourceId,
            databaseIds: this.state.databaseId ? [this.state.databaseId] : [],
            tableIds: this.state.tableId ? [this.state.tableId] : [],
        }
        let res = await dwappClusterColumnWithStatus(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
            }
            let data = {
                data: res.data.columnList,
                total: res.data.total,
            }
            await this.setState({
                tableInfo: data,
                allHasChineseName: res.data.allHasChineseName,
                hasChineseCount: res.data.hasChineseCount,
            })
            return {
                total: res.data.total,
                dataSource: res.data.columnList,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getFilters = async () => {
        let res = await dwLevelTag({ id: this.state.detailInfo.id })
        if (res.code == 200) {
            this.setState({
                dwLevelInfos: res.data,
            })
        }
    }
    getDatabase = async () => {
        let res = await dwDatabase({ id: this.state.detailInfo.id })
        if (res.code == 200) {
            this.setState({
                databaseInfos: res.data,
            })
        }
    }
    getDatasource = async () => {
        let res = await dwDatasource({ id: this.state.detailInfo.id })
        if (res.code == 200) {
            this.setState({
                datasourceInfos: res.data,
            })
        }
    }
    getTable = async () => {
        let res = await dwTable({ id: this.state.detailInfo.id })
        if (res.code == 200) {
            this.setState({
                tableInfos: res.data,
            })
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            tableId: undefined,
            databaseId: undefined,
            datasourceId: undefined,
        })
        this.search()
    }
    changeStatus = async (e) => {
        await this.setState({
            strategy: e,
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
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    completeData = () => {
        let that = this
        confirm({
            title: '确定要一键补充中文信息吗？',
            content: this.state.allHasChineseName ? '所有字段的中文信息将被簇中文名覆盖' : '没有中文信息的字段将被簇中文名填充',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                let res = await fillChinese({
                    clusterId: that.state.detailInfo.id,
                })
                if (res.code == 200) {
                    message.success('操作成功')
                    this.search()
                }
            },
        })
    }
    postData = async () => {
        this.setState({ btnLoading: true })
        let res = await clusterSave(this.state.detailInfo)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('保存成功')
            this.getDetail()
        }
    }

    save = async (toNext = false) => {
        await this.postData()
        if (toNext) {
            await this.next()
        }
    }

    changeName = (name, e) => {
        const { detailInfo } = this.state
        detailInfo[name] = e.target.value
        this.setState({
            detailInfo,
        })
    }
    changeStatus = async (name, e) => {
        await this.setState({
            [name]: e,
        })
        this.search()
    }
    cancel = () => {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('同义簇')
        })
    }
    changeToEditPage = () => {
        let data = this.pageParam
        data.pageType = 'edit'
        data.title = '编辑簇'
        data.showNext = false
        this.props.addTab('编辑同义簇', data)
    }
    next = async () => {
        await this.getClusterList()
        let { clusterList, searchParam, clusterTotal } = this.state
        console.log(clusterList, 'clusterList+++')
        let index = 0
        clusterList.map((item, i) => {
            if (item.id == this.pageParam.id) {
                console.log(item.code, 'code++++')
                index = i
            }
        })

        let data = this.pageParam
        if (index + 1 == clusterList.length) {
            const totalPageNum = Math.ceil(clusterTotal / searchParam.pageSize)
            if (totalPageNum == searchParam.page) {
                message.info('没有下一个了')
                return
            }
            searchParam.page = searchParam.page + 1
            await this.setState({ searchParam })
            await this.getClusterList()
            let { clusterList } = this.state
            console.log(clusterList, 'page++++clusterList+++')
            data.id = clusterList[0].id
        } else {
            data.id = clusterList[index + 1].id
        }
        await this.init()
        this.search()
    }
    getClusterList = async () => {
        let { clusterList, searchParam } = this.state
        let query = {
            ...searchParam,
        }
        let res = await dwappCluster(query)
        if (res.code == 200) {
            let array = []
            res.data.map((item) => {
                if (!item.confirm) {
                    array.push(item)
                }
            })
            if (!array.length) {
                searchParam.page = searchParam.page + 1
                await this.setState({ searchParam })
                await this.getClusterList()
            } else {
                this.setState({
                    clusterList: array,
                    clusterTotal: res.total,
                })
            }
        }
    }

    get isEdit() {
        return this.pageParam.pageType === 'edit'
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    addEnglishName = (value, name) => {
        let { detailInfo } = this.state
        detailInfo[name] = detailInfo[name] + value
        this.setState({
            detailInfo,
        })
    }

    renderBaseInfo() {
        let { detailInfo, inputColor, inputColor1, btnLoading } = this.state
        return this.isEdit ? (
            <div className='clusterEditForm EditMiniForm Grid4'>
                <FormItem label='簇ID'>
                    <span>{detailInfo.code}</span>
                </FormItem>
                <FormItem
                    required
                    label='簇英文名'
                    extra={
                        detailInfo.suggestEnglishName.length ? (
                            <div>
                                <IconFont type='icon-tuijian' />
                                {detailInfo.suggestEnglishName.map((item) => {
                                    return (
                                        <Tooltip title={item}>
                                            <Tag onClick={this.addEnglishName.bind(this, item, 'englishName')} className='ExtraTag'>
                                                {item}
                                            </Tag>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        ) : null
                    }
                >
                    <Input onChange={this.changeName.bind(this, 'englishName')} value={detailInfo.englishName} />
                </FormItem>
                <FormItem
                    required
                    label='簇中文名'
                    extra={
                        detailInfo.suggestChineseName.length ? (
                            <div>
                                <IconFont type='icon-tuijian' />
                                {detailInfo.suggestChineseName.map((item) => {
                                    return (
                                        <Tooltip title={item}>
                                            <Tag onClick={this.addEnglishName.bind(this, item, 'chineseName')} className='ExtraTag'>
                                                {item}
                                            </Tag>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        ) : null
                    }
                >
                    <Input onChange={this.changeName.bind(this, 'chineseName')} value={detailInfo.chineseName} />
                </FormItem>
                <FormItem label=' 　' style={{ textAlign: 'right' }}>
                    <Button loading={btnLoading} onClick={this.postData} type='primary'>
                        确认
                    </Button>
                </FormItem>
            </div>
        ) : (
            <div className='Grid3 MiniForm'>
                <FormItem label='簇ID'>{detailInfo.code}</FormItem>
                <FormItem label='簇英文名'>{detailInfo.englishName}</FormItem>
                <FormItem label='簇中文名'>{detailInfo.chineseName}</FormItem>
            </div>
        )
    }

    render() {
        let {
            keyword,
            detailInfo,
            tabValue,
            strategy,
            btnLoading,
            dwLevelInfos,
            databaseInfos,
            datasourceInfos,
            tableInfos,
            datasourceId,
            databaseId,
            tableId,
            showShadow,
            inputColor,
            inputColor1,
            tableInfo,
            hasChineseCount,
            tableData,
        } = this.state
        if (!detailInfo || !detailInfo.id) {
            return null
        }
        return (
            <div className='VControlGroup clusterEdit'>
                <TableLayout
                    title={this.isEdit ? '编辑同义簇' : '同义簇详情'}
                    disabledDefaultFooter
                    renderHeaderExtra={() => {
                        return this.isEdit ? null : (
                            <Button type='primary' ghost onClick={this.changeToEditPage}>
                                修改
                            </Button>
                        )
                    }}
                    renderDetail={() => {
                        return <Module title='簇基本信息'>{this.renderBaseInfo()}</Module>
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button type='primary' ghost loading={btnLoading} onClick={() => this.save(true)}>
                                    完成并编辑下一个
                                </Button>
                                <Button loading={btnLoading} onClick={this.cancel}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                    showFooterControl={this.isEdit}
                />

                <Module
                    title='中文字段维护'
                    renderHeaderExtra={() => {
                        if (this.isEdit) {
                            return (
                                <Button type='primary' ghost onClick={this.completeData} disabled={!detailInfo.confirm || !tableData || !tableData.length}>
                                    一键补充
                                </Button>
                            )
                        }
                    }}
                    style={this.isEdit ? { marginBottom: 60 } : undefined}
                >
                    <Form className='MiniForm' layout='inline'>
                        <FormItem label='已完成'>
                            <a>{hasChineseCount}</a>/{tableInfo.total}
                        </FormItem>
                    </Form>
                    <RichTableLayout
                        smallLayout
                        disabledDefaultFooter
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索字段' />
                                    <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'datasourceId')} value={datasourceId} placeholder='数据源'>
                                        {datasourceInfos.map((item) => {
                                            return (
                                                <Option title={item.dsName} value={item.id} key={item.id}>
                                                    {item.dsName}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='children'
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        value={databaseId}
                                        onChange={this.changeStatus.bind(this, 'databaseId')}
                                        placeholder='数据库'
                                    >
                                        {databaseInfos.map((item) => {
                                            return (
                                                <Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                                    {item.physicalDatabase}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='children'
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        value={tableId}
                                        onChange={this.changeStatus.bind(this, 'tableId')}
                                        placeholder='数据表'
                                    >
                                        {tableInfos.map((item) => {
                                            return (
                                                <Option title={item.physicalTable} value={item.id} key={item.id}>
                                                    {item.physicalTable}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        tableProps={{
                            columns: this.columns,
                        }}
                        editColumnProps={{
                            width: 80,
                            hidden: !this.isEdit,
                            createEditColumnElements: (_, record) => {
                                return [<a onClick={this.openEditModal.bind(this, record)}>删除</a>]
                            },
                        }}
                        requestListFunction={async (page, pageSize) => {
                            const res = await this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                            this.setState({ tableData: res.dataSource })
                            return res
                        }}
                    />
                </Module>
            </div>
        )
    }
}
