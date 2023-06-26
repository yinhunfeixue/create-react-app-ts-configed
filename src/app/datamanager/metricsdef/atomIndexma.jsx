import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Cascader, Form, Input, message, Modal, Select, Spin, Tree } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { factassetsSearch } from 'app_api/metadataApi'
import { atomicMetricsSearch, deleteAtomicMetricsById, getAtomicMetricsById, getClassifyFilters, saveOrUpdate } from 'app_api/termApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import AddAtomIndexma from './addAtomIndexma'
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
                classifyNodeIds: [],
                keyword: '',
            },
            total: 0,
            editType: 1,
            editInfo: {},
            showSearchResult: false,
            checkbox: false,

            processModal: false,
            bizClassifyDefList: [],

            detailModal: false,
            detailInfo: {},
            assetList: [{ id: 1 }],
            bizModuleDefList: [],
            btnLoading: false,
            userList: [],
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp' onClick={this.openDetailModal.bind(this, record)}>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
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
                title: '计算逻辑',
                dataIndex: 'function',
                key: 'function',
                width: 120,
                render: (text, record) => {
                    return (
                        <Tooltip placement='topLeft' title={record.factColumnName + '' + this.getFunction(record.function)}>
                            <span className='LineClamp' style={{ maxWidth: 120 }}>
                                {record.factColumnName} {this.getFunction(record.function)}
                            </span>
                        </Tooltip>
                    )
                },
            },
            {
                title: '来源事实',
                dataIndex: 'factAssetsName',
                key: 'factAssetsName',
                width: '16%',
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
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                width: '16%',
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
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                width: '16%',
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
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                width: '16%',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
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
            //     fixed: 'right',
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
        this.getUserData()
    }
    getAssetList = async () => {
        let res = await factassetsSearch({
            configComplete: true,
            page: 1,
            pageSize: 20,
        })
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
        let res = await getAtomicMetricsById({ id: data.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await getClassifyFilters()
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
        if (data.beUsed) {
            message.info('使用中无法删除')
            return
        }
        return deleteAtomicMetricsById({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
                // this.getTableList()
                // that.getSearchConditionBizModuleAndTheme()
            }
        })
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
        let res = await atomicMetricsSearch(query)
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
            this.setState({ loading: false })
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
            let res = await getAtomicMetricsById({ id: data.id })
            if (res.code == 200) {
                this.setState({
                    editModal: true,
                    editInfo: res.data,
                })
            }
        } else {
            this.setState({ visibleAdd: true })
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
    openBusinessPage = () => {
        this.props.addTab('定义事实资产', { pageType: 'add' })
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
            // this.getTableList()
            this.search()
        }
    }
    onChangeUser = (e, node) => {
        const { editInfo } = this.state
        if (e) {
            editInfo.busiManagerId = e
            editInfo.busiManagerName = node.props.busiManagerName
        } else {
            editInfo.busiManagerId = undefined
            editInfo.busiManagerName = ''
        }
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
            visibleAdd,
            editInfo,
            showSearchResult,
            deleteModal,
            checkbox,
            processModal,
            bizClassifyDefList,
            detailModal,
            assetList,
            detailInfo,
            editModal,
            btnLoading,
            userList,
        } = this.state

        return (
            <React.Fragment>
                <RichTableLayout
                    title='原子指标'
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/metrics/atmc/manage/add'>
                                <Button type='primary' onClick={this.openEditModal.bind(this, {}, 'add')}>
                                    定义原子指标
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderDetail={() => {
                        return !assetList.length ? (
                            <Spin spinning={loading}>
                                <Alert
                                    closable
                                    message='帮助提示'
                                    description={
                                        <div>
                                            <div>定义原子指标前需要完成事实资产定义。</div>
                                            <PermissionWrap funcCode='/dmm/fact_logic/add'>
                                                <Button
                                                    onClick={this.openBusinessPage}
                                                    style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 0,
                                                    }}
                                                    type='link'
                                                >
                                                    定义事实资产
                                                </Button>
                                            </PermissionWrap>
                                        </div>
                                    }
                                    type='info'
                                    showIcon
                                />
                            </Spin>
                        ) : null
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索指标' />
                                <Cascader
                                    allowClear
                                    fieldNames={{
                                        label: 'name',
                                        value: 'id',
                                        children: 'subList',
                                    }}
                                    options={bizClassifyDefList}
                                    value={queryInfo.classifyNodeIds}
                                    popupClassName='searchCascader'
                                    displayRender={(e) => e.join('-')}
                                    onChange={this.changeBusi}
                                    placeholder='业务分类'
                                />
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
                    tableProps={{
                        columns: this.columns,
                        extraTableProps: {
                            scroll: {
                                x: 1300,
                            },
                        },
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteData(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/metrics/atmc/manage/delete',
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
                                    funcCode: '/metrics/drvs/manage/edit',
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {editModal && (
                    <DrawerLayout
                        drawerProps={{
                            title: '编辑原子指标',
                            visible: editModal,
                            onClose: this.cancel,
                            width: 480,
                        }}
                        renderFooter={() => {
                            return (
                                <React.Fragment>
                                    <Button disabled={!editInfo.chineseName} onClick={this.postData} type='primary' loading={btnLoading}>
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
                                    label: '原子指标名称',
                                    required: true,
                                    content: (
                                        <Input
                                            style={{
                                                paddingRight: '55px !important',
                                            }}
                                            maxLength={64}
                                            suffix={
                                                <span style={{ color: '#B3B3B3' }}>
                                                    {editInfo.chineseName ? editInfo.chineseName.length : 0}
                                                    /64
                                                </span>
                                            }
                                            value={editInfo.chineseName}
                                            onChange={this.changeName.bind(this, 'chineseName')}
                                            placeholder='请输入中文名称'
                                        />
                                    ),
                                },
                                {
                                    label: '原子指标英文名',
                                    content: editInfo.englishName,
                                },
                                {
                                    label: '业务口径',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea
                                                maxLength={128}
                                                style={{
                                                    position: 'relative',
                                                    height: 88,
                                                }}
                                                value={editInfo.description}
                                                onChange={this.changeName.bind(this, 'description')}
                                                placeholder='请输入业务口径'
                                            />
                                            <span
                                                style={{
                                                    color: '#B3B3B3',
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: '8px',
                                                }}
                                            >
                                                {editInfo.description ? editInfo.description.length : 0}
                                                /128
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '负责人',
                                    content: (
                                        <Select allowClear placeholder='请选择负责人' value={editInfo.busiManagerId} onChange={this.onChangeUser} style={{ width: '100%' }}>
                                            {userList &&
                                                userList.map((item) => {
                                                    return (
                                                        <Select.Option busiManagerName={item.realname} key={item.id} value={item.id}>
                                                            {item.realname}
                                                        </Select.Option>
                                                    )
                                                })}
                                        </Select>
                                    ),
                                },
                            ])}
                        </div>
                    </DrawerLayout>
                )}
                <DrawerLayout
                    drawerProps={{
                        title: '指标详情',
                        width: 640,
                        onClose: this.cancel,
                        visible: detailModal,
                    }}
                >
                    {detailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '指标编码',
                                        content: detailInfo.codeNo,
                                    },
                                    {
                                        label: '指标名称',
                                        content: detailInfo.chineseName,
                                    },
                                    {
                                        label: '指标英文名',
                                        content: detailInfo.englishName,
                                    },
                                    {
                                        label: '指标类型',
                                        content: detailInfo.metricsTypeText,
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
                                        label: '业务过程',
                                        content: detailInfo.bizProcessName,
                                    },
                                    {
                                        label: '业务口径',
                                        content: detailInfo.description,
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '计算逻辑',
                                        content: (
                                            <span className='atomContent'>
                                                {detailInfo.factColumnName}
                                                {this.getFunction(detailInfo.function)}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源模型',
                                        content: (
                                            <span className='atomContent'>
                                                {detailInfo.factAssetsName} {detailInfo.factAssetsNameEn} {!detailInfo.factAssetsName && !detailInfo.factAssetsNameEn ? <EmptyLabel /> : ''}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源字段',
                                        content: (
                                            <span className='atomContent'>
                                                {detailInfo.factColumnName} {detailInfo.factColumnNameEn} {!detailInfo.factColumnName && !detailInfo.factColumnNameEn ? <EmptyLabel /> : ''}
                                            </span>
                                        ),
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '技术归口部门',
                                        content: detailInfo.techDepartName,
                                    },
                                    {
                                        label: '业务归口部门',
                                        content: detailInfo.busiDepartName,
                                    },
                                    {
                                        label: '负责人',
                                        content: detailInfo.busiManagerName,
                                    },
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
                {visibleAdd && (
                    <AddAtomIndexma
                        visible={visibleAdd}
                        onClose={() => {
                            this.setState({ visibleAdd: false })
                        }}
                        onSuccess={() => {
                            this.setState({ visibleAdd: false })
                            this.search()
                        }}
                    />
                )}
            </React.Fragment>
        )
    }
}
