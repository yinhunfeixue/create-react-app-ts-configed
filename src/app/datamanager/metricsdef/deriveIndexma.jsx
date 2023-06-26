import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Cascader, Input, message, Modal, Select, Spin, Tree } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { deleteDerById, derivativeMetricsSearch, existsAtomicMetrics, getDerBizModuleAndTheme, getDerClassifyFilters, getDerBizProcess, getDerById, updateDerivativeMetrics } from 'app_api/termApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import DeriveDetailDrawer from './deriveDetailDrawer'
import PermissionWrap from '@/component/PermissionWrap'

const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class AtomIndexma extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
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
            themeDefList: [],
            bizModuleIdList: [],
            themeIdList: [],

            detailModal: false,
            detailInfo: {
                atomicMetricsDTO: {},
                businessLimitDTO: {},
                statisticalPeriodDTO: {},
            },
            assetList: [{ id: 1 }],
            bizModuleDefList: [],
            btnLoading: false,
            userList: [],
            existsAtomic: true,
            atomDetailModal: false,
            atomDetailInfo: {},
            periodDetailModal: false,
            periodDetailInfo: {},
            businessDetailModal: false,
            businessDetailInfo: {},
            sqlLoading: false,
            sqlContent: '',
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: '20%',
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
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: '20%',
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
            {
                title: '业务口径',
                dataIndex: 'description',
                key: 'description',
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
        ]
    }
    componentWillMount = () => {
        this.getAssetList()
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
        this.getUserData()
    }
    getAssetList = async () => {
        let res = await existsAtomicMetrics()
        if (res.code == 200) {
            this.setState({
                existsAtomic: res.data,
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
        this.deriveDrawer.openDetailModal(data)
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await getDerClassifyFilters()
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
        return deleteDerById({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
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
        let res = await derivativeMetricsSearch(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
    }
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        this.controller.reset()
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
            let res = await getDerById({ id: data.id })
            if (res.code == 200) {
                this.setState({
                    editModal: true,
                    editInfo: res.data,
                })
            }
        } else {
            this.props.addTab('定义衍生指标', data)
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
        this.props.addTab('原子指标', { pageType: 'add' })
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
    changeName = (name, e) => {
        const { editInfo } = this.state
        editInfo[name] = e.target.value
        this.setState({
            editInfo,
        })
    }
    postData = async () => {
        this.setState({ btnLoading: true })
        let res = await updateDerivativeMetrics(this.state.editInfo)
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
            loading,
            queryInfo,
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
            editModal,
            btnLoading,
            userList,
            existsAtomic,
        } = this.state
        return (
            <React.Fragment>
                <div className='VControlGroup'>
                    <RichTableLayout
                        title='衍生指标'
                        renderDetail={() => {
                            return !existsAtomic ? (
                                <Spin spinning={loading}>
                                    <Alert
                                        closable
                                        message='帮助提示'
                                        description={
                                            <div>
                                                <div>定义衍生指标前需要完成原子指标定义。</div>
                                                <PermissionWrap funcCode='/metrics/atmc/manage/add'>
                                                    <Button onClick={this.openBusinessPage}>定义原子指标</Button>
                                                </PermissionWrap>
                                            </div>
                                        }
                                        type='info'
                                        showIcon
                                    />
                                </Spin>
                            ) : null
                        }}
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/metrics/drvs/manage/add'>
                                    <Button type='primary' onClick={this.openEditModal.bind(this, {}, 'add')}>
                                        定义衍生指标
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索指标' />
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
                                funcCode: '/metrics/drvs/manage/delete',
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
                </div>
                {editModal ? (
                    <DrawerLayout
                        drawerProps={{
                            title: '编辑衍生指标',
                            visible: editModal,
                            onClose: this.cancel,
                            width: 480,
                        }}
                        renderFooter={() => {
                            return (
                                <React.Fragment>
                                    <Button disabled={!editInfo.chineseName || !editInfo.englishNameTail} onClick={this.postData} key='submit' type='primary' loading={btnLoading}>
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
                                    label: '衍生指标名称',
                                    required: true,
                                    content: (
                                        <Input
                                            style={{ paddingRight: '55px !important' }}
                                            maxLength={64}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.chineseName ? editInfo.chineseName.length : 0}/64</span>}
                                            value={editInfo.chineseName}
                                            onChange={this.changeName.bind(this, 'chineseName')}
                                            placeholder='请输入中文名称'
                                        />
                                    ),
                                },
                                {
                                    label: '衍生指标英文名',
                                    required: true,
                                    content: (
                                        <Input
                                            style={{ paddingRight: '55px !important' }}
                                            maxLength={64}
                                            addonBefore={editInfo.englishNameHead}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.englishNameTail ? editInfo.englishNameTail.length : 0}/64</span>}
                                            value={editInfo.englishNameTail}
                                            onChange={this.changeName.bind(this, 'englishNameTail')}
                                            placeholder='请输入英文名称'
                                        />
                                    ),
                                },
                                {
                                    label: '业务口径',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea
                                                maxLength={128}
                                                style={{ height: 88 }}
                                                value={editInfo.description}
                                                onChange={this.changeName.bind(this, 'description')}
                                                placeholder='请输入描述信息'
                                            />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: '8px' }}>{editInfo.description ? editInfo.description.length : 0}/128</span>
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
                ) : null}
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}
