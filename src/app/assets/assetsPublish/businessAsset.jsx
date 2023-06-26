import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Cascader, Input, message, Modal, Select, Tree } from 'antd'
import { businessClassifyFilters, businessPublish, releaseBusiness, summaryMetricsEtlDownload } from 'app_api/metadataApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'

const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class IndexmaAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                classifyNodeIds: [],
                keyword: '',
                status: undefined,
            },
            total: 0,
            showSearchResult: false,

            bizClassifyDefList: [],
            themeDefList: [],
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '资产名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '资产英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '资产类型',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                render: (text, record) => <span>{text == '10' ? '维度资产' : '事实资产'}</span>,
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => {
                    return text ? <StatusLabel message='已发布' type='success' /> : <StatusLabel message='未发布' type='warning' />
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
    }
    download = async (data) => {
        message.info('系统正准备下载')
        let query = {
            summaryId: data.id,
            summaryName: data.name,
            versionNum: data.versionNum,
        }
        let res = await summaryMetricsEtlDownload(query)
    }
    confirmContent = (value) => {
        return (
            <div>
                <div>版本信息：{value || '发布中'}</div>
            </div>
        )
    }
    releaseAsset = async (data) => {
        let that = this
        confirm({
            title: data.type == 10 ? '发布维度资产？' : '发布事实资产？',
            content: that.confirmContent(data.versionDesc),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.setState({ loading: true })
                businessPublish({ businessId: data.id }).then((res) => {
                    that.setState({ loading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                    }
                })
            },
        })
    }
    reload = (data) => {
        if (!data.canUpdate) {
            return
        }
        let that = this
        confirm({
            title: data.type == 10 ? '更新维度资产？' : '更新事实资产？',
            content: that.confirmContent(data.versionDesc),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.setState({ loading: true })
                businessPublish({ businessId: data.id }).then((res) => {
                    that.setState({ loading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                    }
                })
            },
        })
    }
    openDetailModal = async (data) => {
        this.props.addTab('模型资产详情', data, true)
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await businessClassifyFilters()
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data),
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
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await releaseBusiness(query)
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
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
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
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            classifyNodeIds: [],
            status: undefined,
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    render() {
        let { tableData, loading, queryInfo, total, showSearchResult, themeDefList, bizClassifyDefList } = this.state

        return (
            <RichTableLayout
                title='模型资产'
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='请输入业务资产名称' />
                            <Select allowClear onChange={this.changeType.bind(this, 'status')} value={queryInfo.status} placeholder='状态'>
                                <Option value={0} key={0}>
                                    未发布
                                </Option>
                                <Option value={1} key={1}>
                                    已发布
                                </Option>
                            </Select>
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={bizClassifyDefList}
                                value={queryInfo.classifyNodeIds}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeBusi}
                                popupClassName='searchCascader'
                                placeholder='业务分类'
                            />
                            <Button onClick={this.reset}>重置</Button>
                        </React.Fragment>
                    )
                }}
                requestListFunction={async (page, pageSize) => {
                    return await this.getTableList({
                        pagination: {
                            page,
                            page_size: pageSize,
                        },
                    })
                }}
                tableProps={{
                    columns: this.columns,
                }}
                editColumnProps={{
                    width: 120,
                    createEditColumnElements: (index, record) => {
                        return RichTableLayout.renderEditElements([
                            {
                                label: '详情',
                                onClick: this.openDetailModal.bind(this, record),
                            },
                            {
                                label: '发布',
                                onClick: this.releaseAsset.bind(this, record),
                                disabled: record.status != 0,
                                funcCode: '/dc/admin/model/manage/publish',
                            },
                            {
                                label: '更新',
                                onClick: this.reload.bind(this, record),
                                disabled: record.status != 1 || !record.canUpdate,
                                funcCode: '/dc/admin/model/manage/update',
                            },
                        ])
                    },
                }}
            />
        )
    }
}
