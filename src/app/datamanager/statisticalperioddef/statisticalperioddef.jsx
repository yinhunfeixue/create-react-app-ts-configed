import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Input, message, Modal, Tree } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { deleteStatisticalperiod, factassetsSearch, saveStatisticalperiod, statisticalperiod, statisticalperiodDetail } from 'app_api/metadataApi'
import { getSearchConditionBizModuleAndTheme, getSearchConditionBizProcess } from 'app_api/termApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
// import '../index.less'
import StatisticalperioddefEdit from './statisticalperioddefEdit'
import PermissionWrap from '@/component/PermissionWrap'

const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class AtomIndexma extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            total: 0,
            editType: 1,
            editInfo: {},
            showSearchResult: false,
            checkbox: false,

            processModal: false,
            bizClassifyDefList: [],
            themeDefList: [],
            bizModuleIdList: [],
            themeIdList: [],

            detailModal: false,
            detailInfo: {},
            assetList: [{ id: 1 }],
            processList: [],
            bizModuleDefList: [],
            btnLoading: false,
            userList: [],
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '统计周期名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: '18%',
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
                title: '统计周期英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: '20%',
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
                title: '英文缩写',
                dataIndex: 'englishNameAbbr',
                key: 'englishNameAbbr',
                width: '14%',
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
                title: '周期粒度',
                dataIndex: 'granularity',
                key: 'granularity',
                width: '14%',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text == 0 ? '日' : text == 1 ? '月' : text == 2 ? '周' : text == 3 ? '季度' : '年'}>
                        {text == 0 ? '日' : text == 1 ? '月' : text == 2 ? '周' : text == 3 ? '季度' : '年'}
                    </Tooltip>
                ),
            },
            {
                title: '周期类型',
                dataIndex: 'periodType',
                key: 'periodType',
                width: '16%',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text == 0 ? '自然周期' : '相对周期'}>
                        {text == 0 ? '自然周期' : '相对周期'}
                    </Tooltip>
                ),
            },
            {
                title: '计算逻辑',
                dataIndex: 'calculateDesc',
                key: 'calculateDesc',
                width: '16%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 80,
            //     render: (text, record, index) => {
            //         return (
            //             <div>
            //                 <Tooltip title='编辑'>
            //                     <img className='editImg' onClick={this.openEditModal.bind(this, record, 'edit')} src={require('app_images/edit.png')} />
            //                 </Tooltip>
            //                 <Tooltip title='删除'>
            //                     <img className='editImg' onClick={this.deleteData.bind(this, record)} src={require('app_images/delete.png')} />
            //                 </Tooltip>
            //             </div>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getAssetList()
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
        this.getProcessList()
        this.getUserData()
    }
    getAssetList = async () => {
        let res = await factassetsSearch({ configComplete: true, page: 1, pageSize: 20 })
        if (res.code == 200) {
            this.setState({
                assetList: res.data,
            })
        }
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    openDetailModal = async (data) => {
        this.setState({
            detailModal: true,
        })
        let res = await statisticalperiodDetail({ id: data.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await getSearchConditionBizModuleAndTheme()
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data.bizModuleDefList),
                themeDefList: this.deleteSubList(res.data.themeDefList),
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
        return deleteStatisticalperiod({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            }
        })
        // let that = this
        // confirm({
        //     title: '你确定要删除吗？',
        //     content: '',
        //     okText: '确定',
        //     cancelText: '取消',
        //     onOk() {
        //         deleteStatisticalperiod({ id: data.id }).then((res) => {
        //             if (res.code == 200) {
        //                 message.success('删除成功')
        //                 that.getTableList()
        //             }
        //         })
        //     },
        // })
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
        this.setState({ loading: true })
        let res = await statisticalperiod(query)
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
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        if (this.controller) {
            this.controller.reset()
        }
        // this.getTableList()
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
    openEditModal = async (data, pageType) => {
        data.pageType = pageType
        if (pageType == 'edit') {
            let res = await statisticalperiodDetail({ id: data.id })
            if (res.code == 200) {
                this.setState({
                    editModal: true,
                    editInfo: res.data,
                })
            }
        } else {
            this.props.addTab('统计周期', data)
        }
    }
    cancel = () => {
        this.setState({
            detailModal: false,
            deleteModal: false,
            loading: false,
            editModal: false,
        })
    }
    checkOther = (e) => {
        this.setState({
            checkbox: e.target.checked,
        })
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.bizModuleIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeTheme = async (value, selectedOptions) => {
        console.log(value, 'value')
        let { queryInfo } = this.state
        queryInfo.themeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getProcessList = async () => {
        let res = await getSearchConditionBizProcess()
        if (res.code == 200) {
            this.setState({
                processList: res.data,
            })
        }
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
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getFunction = (value) => {
        if (value == 'sum') {
            return '求和'
        } else if (value == 'average') {
            return '平均值'
        } else if (value == 'accumulate') {
            return '累计值'
        } else if (value == 'count') {
            return '不去重计数'
        } else if (value == 'dist_count') {
            return '去重计数'
        } else if (value == 'max') {
            return '最大值'
        } else if (value == 'min') {
            return '最小值'
        }
    }
    changeName = (name, e) => {
        const { editInfo } = this.state
        editInfo[name] = e.target.value
        this.setState({
            editInfo,
        })
    }
    postData = async () => {
        this.setState({ btnLoading: true })
        let res = await saveStatisticalperiod(this.state.editInfo)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.controller.reset()
        }
    }
    onChangeUser = (e, node) => {
        const { editInfo } = this.state
        editInfo.busiManagerId = e
        editInfo.busiManagerName = node.props.busiManagerName
        this.setState({
            editInfo,
        })
    }

    render() {
        let {
            tableData,
            loading,
            queryInfo,
            total,
            editType,
            editInfo,
            showSearchResult,
            deleteModal,
            checkbox,
            processModal,
            themeDefList,
            bizClassifyDefList,
            bizModuleIdList,
            themeIdList,
            detailModal,
            assetList,
            processList,
            detailInfo,
            editModal,
            btnLoading,
            userList,
            visibleEdit,
        } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    title='统计周期'
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/metrics/statpd/manage/add'>
                                <Button type='primary' onClick={() => this.setState({ visibleEdit: true })}>
                                    定义统计周期
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索统计周期' />
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
                        return this.deleteData(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/metrics/statpd/manage/delete',
                        }
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
                                    onClick: this.openEditModal.bind(this, record, 'edit'),
                                    funcCode: '/metrics/statpd/manage/edit',
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {visibleEdit && (
                    <StatisticalperioddefEdit
                        visible={visibleEdit}
                        onClose={() => this.setState({ visibleEdit: false })}
                        onSuccess={() => {
                            this.controller.reset()
                            this.setState({ visibleEdit: false })
                        }}
                    />
                )}

                <DrawerLayout
                    drawerProps={{
                        title: '编辑统计周期',
                        visible: editModal,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button disabled={!editInfo.chineseName || !editInfo.englishName} onClick={this.postData} key='submit' type='primary' loading={btnLoading}>
                                    确定
                                </Button>
                                <Button key='back' onClick={this.cancel}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <div className='EditMiniForm Grid1'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '统计周期名称',
                                content: (
                                    <Input
                                        maxLength={64}
                                        suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.chineseName ? editInfo.chineseName.length : 0}/64</span>}
                                        value={editInfo.chineseName}
                                        onChange={this.changeName.bind(this, 'chineseName')}
                                        placeholder='请输入中文名称'
                                    />
                                ),
                            },
                            {
                                label: '统计周期英文名',
                                content: (
                                    <Input
                                        maxLength={64}
                                        suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.englishName ? editInfo.englishName.length : 0}/64</span>}
                                        value={editInfo.englishName}
                                        onChange={this.changeName.bind(this, 'englishName')}
                                        placeholder='请输入英文名称'
                                    />
                                ),
                            },
                            {
                                label: '业务描述',
                                content: (
                                    <div style={{ position: 'relative' }}>
                                        <TextArea
                                            maxLength={128}
                                            style={{ height: 52 }}
                                            value={editInfo.description}
                                            onChange={this.changeName.bind(this, 'description')}
                                            placeholder='请输入业务描述'
                                        />
                                        <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: '8px' }}>{editInfo.description ? editInfo.description.length : 0}/128</span>
                                    </div>
                                ),
                            },
                        ])}
                    </div>
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: '统计周期详情',
                        visible: detailModal,
                        onClose: this.cancel,
                    }}
                >
                    {detailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '统计周期名称',
                                        content: detailInfo.chineseName,
                                    },
                                    {
                                        label: '统计周期英文名',
                                        content: detailInfo.englishName,
                                    },
                                    {
                                        label: '英文缩写',
                                        content: detailInfo.englishNameAbbr,
                                    },
                                    {
                                        label: '业务描述',
                                        content: detailInfo.description,
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '周期粒度',
                                        content:
                                            detailInfo.granularity == 0 ? '日' : detailInfo.granularity == 1 ? '月' : detailInfo.granularity == 2 ? '周' : detailInfo.granularity == 3 ? '季度' : '年',
                                    },
                                    {
                                        label: '周期类型',
                                        content: detailInfo.periodType == 0 ? '自然周期' : '相对周期',
                                    },
                                    {
                                        label: '计算逻辑',
                                        content: detailInfo.calculateDesc,
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '创建时间',
                                        content: detailInfo.createTime,
                                    },
                                    {
                                        label: '创建人',
                                        content: detailInfo.createUser,
                                    },
                                    {
                                        label: '更新时间',
                                        content: detailInfo.updateTime,
                                    },
                                    {
                                        label: '修改人',
                                        content: detailInfo.updateUser,
                                    },
                                ])}
                            </Form>
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
