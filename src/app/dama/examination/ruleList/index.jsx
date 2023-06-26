// 规则分类 + 规则列表
import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import RenderUtil from '@/utils/RenderUtil'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Cascader, Dropdown, Form, Input, List, Menu, message, Modal, Select, Space, Spin, Switch, Tabs, Tooltip } from 'antd'
import { baseconfig, bizRuleDelete, bizRuleSearch, bizRuleToggleStatus, checkRuleTree, deleteBizRuleGroup, queryBizRuleGroup, saveBizRuleGroup, updateBizRuleGroupName } from 'app_api/examinationApi'
import Cache from 'app_utils/cache'
import classNames from 'classnames'
import React, { Component } from 'react'
import BizRuleDetailDrawer from './bizRuleDetailDrawer'
import './index.less'

import Request from '@/api/request'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'
import { UploadOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
const { Dragger } = Upload
const TabPane = Tabs.TabPane

export default class BusinessRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
                ruleTypeId: [],
                useForBiz: undefined,
                status: undefined,
            },
            ruleLevel: 0,
            loading: false,
            sorted: true,
            typeList: [],
            bizList: [],
            tableData: [],
            hoverId: '',
            selectedId: '',
            selectedName: '',
            addTypeModal: false,
            addInfo: {},
            addType: 'add',
            btnLoading: false,
            ruleTypeList: [],

            importVisible: false,
            fileList: [],
            tabValue: '0',
            tableTypeList: [],
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 240,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 180,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '技术规则',
                dataIndex: 'techRuleCount',
                key: 'techRuleCount',
                width: 120,
                sorter: true,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.openTechRulePage.bind(this, record)}>{text}</a>
                    </Tooltip>
                ),
            },
            {
                title: '状态',
                dataIndex: 'statusDesc',
                key: 'statusDesc',
                width: '12%',
                render: (text, record, index) => (
                    <Switch
                        onChange={this.changeStatusSwitch.bind(this, record, index)}
                        disabled={!PermissionManage.hasFuncPermission('/dqm/bizrules/manage/switch')}
                        checkedChildren='启用'
                        unCheckedChildren='禁用'
                        checked={record.status == 1}
                    />
                ),
            },
        ]
    }
    componentWillMount = async () => {
        this.getRuleTypeList()
        this.getRuleTree()
        this.baseconfigList()
        if (Cache.get('bizRuleLevel') == 1) {
            this.onChangeTab(Cache.get('bizRuleLevel'))
        }
    }
    getRuleTypeList = async () => {
        let { addInfo } = this.state
        this.setState({ loading: true })
        let res = await queryBizRuleGroup()
        this.setState({ loading: false })
        if (res.code == 200) {
            console.log(res.data, 'getRuleTypeList')
            this.setState({
                ruleTypeList: res.data,
            })
            if (addInfo.name || addInfo.id) {
                res.data.map((item) => {
                    if (item.name == addInfo.name) {
                        this.onSelect(item.id, item.name)
                    }
                    if (item.id == addInfo.id) {
                        this.onSelect(item.id, item.name)
                    }
                })
            } else {
                if (Cache.get('bizRuleGroupId')) {
                    res.data.map((item) => {
                        if (item.id == Cache.get('bizRuleGroupId')) {
                            this.onSelect(item.id, item.name)
                        }
                    })
                } else {
                    this.onSelect(res.data.length ? res.data[0].id : '', res.data.length ? res.data[0].name : '')
                }
            }
        }
    }
    changeStatusSwitch = async (data, index) => {
        let { tableData } = this.state
        let query = {
            id: data.id,
            status: data.status == 1 ? 2 : 1,
        }
        let res = await bizRuleToggleStatus(query)
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].status = query.status
            tableData[index].statusDesc = query.status == 1 ? '启用' : '禁用'
            this.setState({
                tableData,
            })
        }
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            let data = this.deleteSubList(res.data.children)
            this.setState({
                typeList: this.getTypeList(data, 1),
                tableTypeList: this.getTypeList(data, 2),
            })
        }
    }
    getTypeList = (data, type) => {
        let newTree = data.filter((x) => x.type == type)
        newTree.forEach((x) => x.children && (x.chlidren = this.getTypeList(x.children, type)))
        return newTree
    }
    baseconfigList = async () => {
        let res = await baseconfig({ group: 'useForBiz' })
        if (res.code == 200) {
            this.setState({
                bizList: res.data,
            })
        }
    }
    openTechRulePage = (data) => {
        let { ruleLevel } = this.state
        data.bizRuleGroupName = this.state.selectedName
        data.ruleLevel = ruleLevel
        if (ruleLevel == 1) {
            this.props.addTab('实现技术规则（表）', { ...data })
        } else {
            this.props.addTab('实现技术规则', { ...data })
        }
    }
    openEditModal = async (data) => {
        let { selectedId, ruleLevel } = this.state
        data.bizRuleGroupId = selectedId
        data.pageType = 'edit'
        data.ruleLevel = ruleLevel
        this.props.addTab('编辑业务规则', { ...data })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'sorter')
        let { queryInfo, selectedId, ruleLevel } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: queryInfo.keyword,
            ruleTypeIdList: queryInfo.ruleTypeId.length ? [queryInfo.ruleTypeId[queryInfo.ruleTypeId.length - 1]] : [],
            statusList: queryInfo.status ? [queryInfo.status] : [],
            useForBizList: queryInfo.useForBiz ? [queryInfo.useForBiz] : [],
            techRuleCountOrder: params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined,
            bizRuleGroupId: selectedId,
            ruleLevel: ruleLevel,
        }
        let res = await bizRuleSearch(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                sorted: params.sorter.order,
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
            ruleTypeId: [],
        }
        await this.setState({
            queryInfo,
            sorted: true,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    deleteData = (data) => {
        let that = this
        if (data.taskUsed) {
            Modal.warning({
                title: '删除业务规则',
                icon: <ExclamationCircleFilled />,
                content: '该规则有检核任务在使用不可删除，请先取消关联',
            })
        } else {
            Modal.confirm({
                title: '删除业务规则',
                icon: <ExclamationCircleFilled />,
                content: '删除规则，同时删除该规则下所有技术规则，确定删除吗？',
                okText: '确定',
                cancelText: '取消',
                async onOk() {
                    let res = await bizRuleDelete({ id: data.id })
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                    }
                },
            })
        }
    }
    openAddPage = () => {
        let { selectedId, ruleLevel } = this.state
        this.props.addTab('新增业务规则', { bizRuleGroupId: selectedId, ruleLevel: ruleLevel })
    }
    changeType = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.ruleTypeId = value ? value : []
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    openDetailModal = (data) => {
        this.bizRuleDetailDrawer && this.bizRuleDetailDrawer.openModal(data)
    }
    editType = (data, type) => {
        let { addInfo } = this.state
        if (type == 'edit') {
            addInfo.id = data.id
            addInfo.name = data.name
        } else {
            addInfo = { name: '' }
        }
        this.setState({
            addTypeModal: true,
            addType: type,
            addInfo,
        })
    }
    onSelect = async (id, name) => {
        await this.setState({ selectedId: id, selectedName: name })
        Cache.set('bizRuleGroupId', id)
        if (id) {
            this.reset()
        }
    }
    renderTypeList() {
        const { selectedId, ruleTypeList, hoverId, loading } = this.state
        const roleMenu = [
            {
                label: '修改名称',
                onClick: (item) => {
                    this.editType(item, 'edit')
                },
            },
            {
                label: '删除',
                className: 'ErrorLabel',
                style: { color: '#CC0000' },
                onClick: (item) => {
                    if (item.ruleCount) {
                        Modal.warning({
                            title: '删除规则分类',
                            icon: <ExclamationCircleFilled />,
                            content: '请先清空规则列表，再进行删除',
                        })
                    } else {
                        Modal.confirm({
                            title: '删除规则分类',
                            icon: <ExclamationCircleFilled />,
                            content: '您确定删除规则分类吗？',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => {
                                deleteBizRuleGroup({ id: item.id }).then((res) => {
                                    if (res.code === 200) {
                                        message.success('删除成功')
                                        this.getRuleTypeList()
                                    }
                                })
                            },
                        })
                    }
                },
            },
        ]

        return (
            <Spin spinning={loading}>
                <List
                    split={false}
                    dataSource={ruleTypeList}
                    renderItem={(item) => {
                        const selected = item.id === selectedId
                        const hover = item.id === hoverId

                        return (
                            <List.Item
                                className={classNames('RoleItem', selected ? 'SelectedRoleItem' : '', hover ? 'HoveredRoleItem' : '')}
                                actions={[
                                    <Dropdown
                                        // onVisibleChange={(visible) => {
                                        //     this.setState({
                                        //         hoverId: visible ? item.id : undefined,
                                        //     })
                                        // }}
                                        trigger='click'
                                        overlay={
                                            <Menu style={{ minWidth: 130 }}>
                                                {roleMenu.map((menuItem) => {
                                                    return (
                                                        <Menu.Item key={menuItem.label} onClick={() => menuItem.onClick(item)}>
                                                            <span style={menuItem.style} className={menuItem.className}>
                                                                {menuItem.label}
                                                            </span>
                                                        </Menu.Item>
                                                    )
                                                })}
                                            </Menu>
                                        }
                                    >
                                        <IconFont className='NodeMenuIcon' type='icon-more' />
                                    </Dropdown>,
                                ]}
                            >
                                <List.Item.Meta onClick={() => this.onSelect(item.id, item.name)} title={<span>{item.name}</span>} />
                            </List.Item>
                        )
                    }}
                />
            </Spin>
        )
    }
    cancel = () => {
        this.setState({
            addTypeModal: false,
        })
    }
    changeName = (e) => {
        let { addInfo } = this.state
        addInfo.name = e.target.value
        this.setState({
            addInfo,
        })
    }
    postAddType = async () => {
        let { addInfo, addType } = this.state
        let res = {}
        this.setState({ btnLoading: true })
        if (addType == 'add') {
            res = await saveBizRuleGroup(addInfo)
        } else {
            res = await updateBizRuleGroupName(addInfo)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success(res.msg ? res.msg : '操作成功')
            this.cancel()
            this.getRuleTypeList()
        }
    }

    importFile = () => {
        console.log('importFile')
        this.setState({
            importVisible: true,
        })
    }

    exportFile = async () => {
        const res = await Request.httpPostDownload('/quantchiAPI/api/girm/port/export/qaCheckRule', {}).then((res) => {
            console.log('下载中')
        })
        message.info('系统准备下载')
    }
    download = async () => {
        const res = await Request.httpGetDownload('/quantchiAPI/api/girm/port/export/qaCheckRuleTemplate', {}).then((res) => {
            console.log('下载中')
        })
        message.info('系统准备下载')
    }
    cancelFile = () => {
        this.setState({
            importVisible: false,
        })
    }
    uploadChange = (info) => {
        const { fileList } = this.state
        const { status, originFileObj } = info.file
        console.log('info', info)

        if (status === 'done') {
            fileList.length = 0
            fileList.push(originFileObj)
        }
        if (status === 'removed') {
            fileList.length = 0
        }
        this.setState({ fileList })
    }
    uploadRequest = (params) => {
        const { file, onSuccess, onError } = params || {}
        onSuccess({ file })
    }

    confirmDownload = () => {
        const that = this
        const { fileList } = this.state
        console.log('fileList', fileList)
        if (fileList.length <= 0) {
            message.warning('请先上传文件')
            return
        }
        const Fd = new FormData()
        Fd.append('file', fileList[0])
        this.setState({ btnLoading: true })
        Request.post('/quantchiAPI/api/girm/port/import/qaCheckRule', Fd).then((res) => {
            this.setState({ btnLoading: false })
            message.info(res.msg)
            that.setState({
                importVisible: false,
            })
        })
    }
    onChangeTab = async (e) => {
        await this.setState({
            tabValue: e,
            ruleLevel: e,
        })
        Cache.set('bizRuleLevel', e)
        this.reset()
    }
    render() {
        const { tabValue, tableTypeList, queryInfo, typeList, bizList, tableData, selectedId, addInfo, addTypeModal, addType, btnLoading, importVisible } = this.state
        const menu = (
            <Menu>
                <Menu.Item key='1' onClick={this.exportFile}>
                    <PermissionWrap funcCode='/dqm/bizrules/manage/export'>
                        <span onClick={this.exportFile}>导出</span>
                    </PermissionWrap>
                </Menu.Item>
                <Menu.Item key='2' onClick={this.importFile}>
                    <PermissionWrap funcCode='/dqm/bizrules/manage/upload'>
                        <span onClick={this.importFile}>导入</span>
                    </PermissionWrap>
                </Menu.Item>
            </Menu>
        )
        return (
            <React.Fragment>
                <SliderLayout
                    className='ruleListPage'
                    disabledFold
                    renderSliderHeader={() => {
                        return (
                            <div className='HControlGroup' style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>规则分类</span>
                                <PermissionWrap funcCode='/dqm/bizrules/manage/addsort'>
                                    <Button style={{ color: '#333333' }} size='small' icon={<PlusOutlined />} type='link' onClick={() => this.editType({}, 'add')}></Button>
                                </PermissionWrap>
                            </div>
                        )
                    }}
                    renderSliderBody={() => {
                        return this.renderTypeList()
                    }}
                    renderContentHeader={() => {
                        return (
                            <Tabs style={{ height: '42px' }} animated={false} onChange={this.onChangeTab} activeKey={tabValue}>
                                <TabPane key='0' tab='字段级规则'></TabPane>
                                <TabPane key='1' tab='表级规则'></TabPane>
                            </Tabs>
                        )
                    }}
                    renderContentBody={() => {
                        return selectedId ? (
                            <div>
                                <RichTableLayout
                                    smallLayout
                                    disabledDefaultFooter
                                    editColumnProps={{
                                        width: 160,
                                        createEditColumnElements: (_, record) => {
                                            const _elements = [
                                                <a onClick={this.openDetailModal.bind(this, record)} key='edit'>
                                                    详情
                                                </a>,
                                            ]
                                            if (PermissionManage.hasFuncPermission('/dqm/bizrules/manage/edit')) {
                                                _elements.push(
                                                    <a onClick={this.openEditModal.bind(this, record)} key='edit'>
                                                        编辑
                                                    </a>
                                                )
                                            }
                                            if (PermissionManage.hasFuncPermission('/dqm/bizrules/manage/delete')) {
                                                _elements.push(
                                                    <a onClick={this.deleteData.bind(this, record)} key='delete'>
                                                        删除
                                                    </a>
                                                )
                                            }
                                            return _elements
                                        },
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'tableNameEn',
                                        dataSource: tableData,
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
                                                    placeholder='请输入规则名称'
                                                />
                                                {/*<Select allowClear onChange={this.changeStatus.bind(this, 'useForBiz')} value={queryInfo.useForBiz} placeholder='适用业务' style={{ width: 160 }}>*/}
                                                {/*{bizList.map((item) => {*/}
                                                {/*return (*/}
                                                {/*<Option value={item.code} key={item.code}>*/}
                                                {/*{item.name}*/}
                                                {/*</Option>*/}
                                                {/*)*/}
                                                {/*})}*/}
                                                {/*</Select>*/}
                                                <Cascader
                                                    allowClear
                                                    expandTrigger='hover'
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    value={queryInfo.ruleTypeId}
                                                    options={tabValue == 0 ? typeList : tableTypeList}
                                                    style={{ width: 160 }}
                                                    onChange={this.changeType}
                                                    displayRender={(label) => label[label.length - 1]}
                                                    popupClassName='searchCascader'
                                                    placeholder='规则类型'
                                                />
                                                <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='状态' style={{ width: 160 }}>
                                                    <Option value={1} key={1}>
                                                        启用
                                                    </Option>
                                                    <Option value={2} key={2}>
                                                        禁用
                                                    </Option>
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
                                            },
                                            // 默认按技术规则-倒序
                                            sorter: sorter || {},
                                        })
                                    }}
                                />
                            </div>
                        ) : (
                            <EmptyIcon description='暂无数据，请先在左侧添加规则分类' />
                        )
                    }}
                    renderContentHeaderExtra={() => {
                        return (
                            <React.Fragment>
                                <Space>
                                    <Dropdown overlay={menu}>
                                        <Button type='primary' ghost>
                                            批量
                                            <span style={{ marginLeft: '8px', lineHeight: '16px' }} className='iconfont icon-xiangxia'></span>
                                        </Button>
                                    </Dropdown>
                                    {selectedId ? (
                                        <PermissionWrap funcCode='/dqm/bizrules/manage/define'>
                                            <Button type='primary' onClick={this.openAddPage}>
                                                新增规则
                                            </Button>
                                        </PermissionWrap>
                                    ) : null}
                                </Space>
                            </React.Fragment>
                        )
                    }}
                />
                <BizRuleDetailDrawer ref={(dom) => (this.bizRuleDetailDrawer = dom)} />
                <Modal
                    title={addType == 'edit' ? '修改名称' : '新增分类'}
                    className='addFilterRuleModal'
                    visible={addTypeModal}
                    onCancel={this.cancel}
                    footer={[
                        <Button key='back' onClick={this.cancel}>
                            取消
                        </Button>,
                        <Button disabled={!addInfo.name} onClick={this.postAddType} key='submit' type='primary' loading={btnLoading}>
                            确定
                        </Button>,
                    ]}
                >
                    {addTypeModal && (
                        <React.Fragment>
                            <Form className='EditMiniForm postForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '分类名称',
                                        content: (
                                            <Input
                                                maxLength={16}
                                                suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/16</span>}
                                                value={addInfo.name}
                                                onChange={this.changeName}
                                                placeholder='请输入'
                                            />
                                        ),
                                    },
                                ])}
                            </Form>
                        </React.Fragment>
                    )}
                </Modal>
                <Modal
                    wrapClassName='importRuleModal'
                    visible={importVisible}
                    title='导入规则'
                    width={480}
                    onCancel={this.cancelFile}
                    destroyOnClose
                    footer={[
                        <Button onClick={this.cancelFile}>取消</Button>,
                        <Button htmlType='submit' loading={btnLoading} onClick={this.confirmDownload} type='primary'>
                            导入
                        </Button>,
                    ]}
                >
                    <div className='importTitle'>1. 下载导入模版，完善信息</div>
                    <a onClick={this.download}>下载模版</a>
                    <div className='importTitle'>2.导入完善好的表格</div>
                    <div style={{ height: 120 }}>
                        <Upload.Dragger onChange={this.uploadChange} customRequest={this.uploadRequest} maxCount={1} accept='.xlsx'>
                            <p className='ant-upload-drag-icon'>
                                <UploadOutlined />
                            </p>
                            <p className='ant-upload-text'>点击或拖拽文件到此处上传</p>
                        </Upload.Dragger>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}
