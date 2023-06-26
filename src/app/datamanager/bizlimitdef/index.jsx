import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Cascader, Form, Input, message, Modal, Tree } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { bizLimit, bizLimitClassifyFilters, bizLimitDetail, deleteBizLimit, factassetsSearch } from 'app_api/metadataApi'
import { saveOrUpdate } from 'app_api/termApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'

// import '../index.less'

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
                classifyNodeIds: [],
            },
            total: 0,
            editType: 1,
            editInfo: {},
            showSearchResult: false,
            checkbox: false,

            processModal: false,
            bizClassifyDefList: [],
            themeDefList: [],
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
                title: '业务限定名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: '20%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务限定英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: '20%',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: '18%',
                render: (text) =>
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
                width: '18%',
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
                title: '业务描述',
                dataIndex: 'description',
                key: 'description',
                width: '18%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.getAssetList()
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
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
        let res = await bizLimitDetail({ id: data.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await bizLimitClassifyFilters()
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
    deleteData = async (data) => {
        if (!data.canDelete) {
            message.info('使用中无法删除')
            return
        }
        return deleteBizLimit({ id: data.id }).then((res) => {
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
        //         deleteBizLimit({ id: data.id }).then((res) => {
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
        let res = await bizLimit(query)
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
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    search = () => {
        // this.setState({
        //     showSearchResult: true,
        // })
        // this.getTableList()
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
    openEditModal = async (data, pageType) => {
        data.pageType = pageType
        this.props.addTab('定义业务限定', data)
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
        let res = await saveOrUpdate(this.state.editInfo)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.getTableList()
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
    openBusinessPage = () => {
        this.props.addTab('定义事实资产', { pageType: 'add' })
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
            themeIdList,
            detailModal,
            assetList,
            processList,
            detailInfo,
            editModal,
            btnLoading,
            userList,
        } = this.state

        return (
            <React.Fragment>
                <RichTableLayout
                    title='业务限定'
                    renderDetail={() => {
                        return !assetList.length ? (
                            <Alert
                                closable
                                message='帮助提示'
                                description={
                                    <div>
                                        <div>定义业务限定前需要完成事实资产定义。</div>
                                        <PermissionWrap funcCode='/dmm/fact_logic/add'>
                                            <Button onClick={this.openBusinessPage} style={{ fontSize: '14px', paddingLeft: 0 }} type='link'>
                                                定义事实资产
                                            </Button>
                                        </PermissionWrap>
                                    </div>
                                }
                                type='info'
                                showIcon
                            />
                        ) : null
                    }}
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/metrics/bizlimit/manage/add'>
                                <Button onClick={this.openEditModal.bind(this, {}, 'add')} type='primary'>
                                    定义业务限定
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索业务限定' />
                                <Cascader
                                    allowClear
                                    fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                    options={bizClassifyDefList}
                                    value={queryInfo.classifyNodeIds}
                                    displayRender={(e) => e.join('-')}
                                    onChange={this.changeBusi}
                                    placeholder='业务分类'
                                />
                                <Button onClick={this.reset}>重置</Button>
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
                                    funcCode: '/metrics/bizlimit/manage/edit',
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteData(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/metrics/bizlimit/manage/delete',
                        }
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: '业务限定详情',
                        visible: detailModal,
                        onClose: this.cancel,
                    }}
                >
                    {detailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '业务限定名称',
                                        content: detailInfo.chineseName,
                                    },
                                    {
                                        label: '业务限定英文名',
                                        content: detailInfo.englishName,
                                    },
                                    {
                                        label: '业务板块',
                                        content: detailInfo.bizModuleName,
                                    },
                                    {
                                        label: '主题域',
                                        content: detailInfo.themeName,
                                    },
                                    {
                                        label: '业务描述',
                                        content: detailInfo.description,
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '计算逻辑',
                                        content: detailInfo.calculateDesc,
                                    },
                                    {
                                        label: '业务限定来源',
                                        content: (
                                            <React.Fragment>
                                                {detailInfo.sourceAssetsName} {detailInfo.sourceAssetsEnglishName}{' '}
                                                {!detailInfo.sourceAssetsName && !detailInfo.sourceAssetsEnglishName ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
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
