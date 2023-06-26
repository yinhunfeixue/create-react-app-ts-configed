import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Col, Divider, Form, message, Popover, Row, Select, Tooltip } from 'antd'
import { catalogDwTree, catalogNondwBizTree, dwAnalysisThemeTree, nonDwSaveTable, saveDwTable, saveThemeTable, systemCatalog } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import './index.less'

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
export default class CatalogEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                ids: [],
                technicalDepartPair: {},
                technicalManagerPair: {},
                businessDepartPair: {},
                businessManagerPair: {},
            },
            systemDetail: {},
            btnLoading: false,
            type: 'single',
            isEdit: false, // 是否编辑
            tableList: [],
            bizTreeData: [],
            dataTree: [], // 数据小类
            bizUserList: [],
            techUserList: [],
            dataClassifyIds: [],
            classifyIds: [],
            departmentList: [],
            tabValue: 'ods',
            isDataWarehouse: false,
            bizModuleList: [], // 业务板块list
            mainThemeList: [],
            alysisThemeList: [],
            totalUserList: [],
        }
    }

    openModal = async (data, type, systemId, isDataWarehouse, tabValue) => {
        let { addInfo, isEdit, classifyIds, dataClassifyIds } = this.state
        isEdit = false
        classifyIds = []
        addInfo.classifyId = undefined
        dataClassifyIds = []
        addInfo.dataClassifyId = undefined
        addInfo.ids = []
        data.map((item) => {
            addInfo.ids.push(item.tableId)
        })
        if (type == 'single') {
            addInfo.tableEname = data[0].tableEname
            addInfo.databaseEname = data[0].databaseEname
            addInfo.technicalDepartPair = {
                id: data[0].technicalDepartId,
                name: data[0].technicalDepartName,
            }
            addInfo.technicalManagerPair = {
                id: data[0].technicalManagerId,
                name: data[0].technicalManagerName,
            }
            addInfo.businessDepartPair = {
                id: data[0].businessDepartId,
                name: data[0].businessDepartName,
            }
            addInfo.businessManagerPair = {
                id: data[0].businessManagerId,
                name: data[0].businessManagerName,
            }
            isEdit = data[0].catalog // 是否已编目
            if (data[0].classifyId) {
                classifyIds = data[0].classifyId
                addInfo.classifyId = data[0].classifyId[data[0].classifyId.length - 1]
            }
            if (data[0].dataClassifyId) {
                dataClassifyIds = data[0].dataClassifyId
                addInfo.dataClassifyId = data[0].dataClassifyId[data[0].dataClassifyId.length - 1]
            }
            console.log(classifyIds, dataClassifyIds, addInfo, '+++++++++')
        }
        await this.setState({
            modalVisible: true,
            addInfo,
            systemId,
            tableList: data,
            type,
            isEdit,
            dataClassifyIds,
            classifyIds,
            bizUserList: [],
            bizModuleList: [],
            mainThemeList: [],
            alysisThemeList: [],
            isDataWarehouse,
            tabValue,
        })
        if (tabValue == 'app') {
            this.getDwAnalysisThemeTree()
        } else {
            this.getCatalogNondwBizTree()
        }
        this.getDepartment()
        this.getSystemCatalog()
        this.getTotalUserList()
    }
    getSystemCatalog = async () => {
        let { systemId, addInfo, isEdit, classifyIds, tabValue, isDataWarehouse, type } = this.state
        let res = await systemCatalog({ id: systemId })
        if (res.code == 200) {
            if (!isEdit) {
                if (!isDataWarehouse) {
                    if (res.data.bizClassifyId) {
                        addInfo.classifyId = res.data.bizClassifyId[res.data.bizClassifyId.length - 1]
                        classifyIds = res.data.bizClassifyId
                    }
                    addInfo.businessDepartPair = {
                        id: res.data.classifyBizDeptId,
                        name: res.data.classifyBizDeptName,
                    }
                    addInfo.businessManagerPair = {
                        id: res.data.classifyBizManagerId,
                        name: res.data.classifyBizManagerName,
                    }
                } else {
                    addInfo.businessDepartPair = {
                        id: undefined,
                    }
                    addInfo.businessManagerPair = {
                        id: undefined,
                    }
                }
                addInfo.technicalDepartPair = {
                    id: res.data.techniqueDepartmentId,
                    name: res.data.techniqueDepartmentName,
                }
                addInfo.technicalManagerPair = {
                    id: res.data.techniqueManagerId,
                    name: res.data.techniqueManagerName,
                }
            }
            if (type !== 'single') {
                addInfo.classifyId = undefined
                classifyIds = []
                addInfo.businessDepartPair = {
                    id: undefined,
                }
                addInfo.businessManagerPair = {
                    id: undefined,
                }
            }
            await this.setState({
                systemDetail: res.data,
                addInfo,
                classifyIds,
                dataTree: [],
            })
            this.getDataTree()
            this.getBizUserList()
            this.getTechUserList()
        }
    }
    getDwAnalysisThemeTree = async () => {
        let res = await dwAnalysisThemeTree()
        if (res.code == 200) {
            this.setState({
                alysisThemeList: res.data,
            })
        }
    }
    getCatalogNondwBizTree = async () => {
        let { tabValue } = this.state
        let res = {}
        if (tabValue == 'dw') {
            res = await catalogDwTree({ businessTag: 1 })
            if (res.code == 200) {
                this.setState({
                    bizModuleList: res.data,
                })
            }
        } else {
            res = await catalogNondwBizTree({ businessTag: 1 })
            if (res.code == 200) {
                this.setState({
                    bizTreeData: this.deleteSubList(res.data),
                })
            }
        }
    }
    getDataTree = async () => {
        let { addInfo, tabValue } = this.state
        if (addInfo.classifyId == undefined) {
            return
        }
        let res = {}
        if (tabValue == 'dw') {
            // 数据仓库层
            res = await catalogDwTree({ businessTag: 2, parentId: addInfo.classifyId })
            if (res.code == 200) {
                this.setState({
                    mainThemeList: this.deleteSubList(res.data),
                })
            }
        } else {
            res = await catalogNondwBizTree({ businessTag: 2, parentId: addInfo.classifyId })
            if (res.code == 200) {
                this.setState({
                    dataTree: this.deleteSubList(res.data),
                })
            }
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
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        let { tabValue, isDataWarehouse } = this.state
        let query = {
            ...this.state.addInfo,
            dwLevel: isDataWarehouse ? tabValue : undefined,
        }
        this.setState({ btnLoading: true })
        let res = {}
        if (isDataWarehouse) {
            if (tabValue == 'dw' || tabValue == 'ods') {
                res = await saveDwTable(query)
            } else if (tabValue == 'app') {
                res = await saveThemeTable(query)
            }
        } else {
            res = await nonDwSaveTable(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
        }
    }
    changeDetailSelect = async (name, e, node) => {
        let { addInfo, tabValue } = this.state
        if (name == 'classifyId') {
            addInfo[name] = e
            if (tabValue == 'dw') {
                //业务板块-主题域
                addInfo.dataClassifyId = undefined
                await this.setState({
                    addInfo,
                    dataClassifyIds: [],
                })
                this.getDataTree()
            } else {
                addInfo.businessDepartPair = {
                    id: node.props.dataRef.businessDepartmentId ? node.props.dataRef.businessDepartmentId : undefined,
                }
                addInfo.businessDepartPair.name = this.getDepartmentName(addInfo.businessDepartPair.id)
                addInfo.businessManagerPair = {
                    id: node.props.dataRef.businessManagerId ? node.props.dataRef.businessManagerId : undefined,
                }
                addInfo.businessManagerPair.name = this.getUserName(addInfo.businessManagerPair.id)
                await this.setState({
                    addInfo,
                })
                this.getBizUserList()
            }
        } else {
            addInfo[name].id = e
            addInfo[name].name = node.props.children
            this.setState({
                addInfo,
            })
        }
    }
    renderLabel = () => {
        return (
            <div style={{ textAlign: 'left' }}>
                部门对应的业务分类<div className='typeRecommand'>分类推荐</div>
            </div>
        )
    }
    getBizUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.addInfo.businessDepartPair.id,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                bizUserList: res.data,
            })
        }
    }
    getTechUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.addInfo.technicalDepartPair.id,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                techUserList: res.data,
            })
        }
    }
    changeClassify = async (name, value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { addInfo } = this.state
        if (selectedOptions.length) {
            addInfo.businessDepartPair = {
                id: selectedOptions[selectedOptions.length - 1].businessDepartmentId ? selectedOptions[selectedOptions.length - 1].businessDepartmentId : undefined,
            }
            addInfo.businessDepartPair.name = this.getDepartmentName(addInfo.businessDepartPair.id)
            addInfo.businessManagerPair = {
                id: selectedOptions[selectedOptions.length - 1].businessManagerId ? selectedOptions[selectedOptions.length - 1].businessManagerId : undefined,
            }
            addInfo.businessManagerPair.name = this.getUserName(addInfo.businessManagerPair.id)
        } else {
            addInfo.businessDepartPair = {
                id: undefined,
            }
            addInfo.businessManagerPair = {
                id: undefined,
            }
        }
        if (name == 'classifyIds') {
            addInfo.classifyId = value[value.length - 1]
            addInfo.dataClassifyId = undefined
            await this.setState({
                addInfo,
                classifyIds: value,
                dataClassifyIds: [],
                bizUserList: [],
            })
            this.getDataTree()
        } else {
            addInfo.dataClassifyId = value[value.length - 1]
            this.setState({
                addInfo,
                dataClassifyIds: value,
                bizUserList: [],
            })
        }
        this.getBizUserList()
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    getDepartmentName = (value) => {
        let { departmentList } = this.state
        for (let i = 0; i < departmentList.length; i++) {
            if (departmentList[i].id == value) {
                return departmentList[i].departName
            }
        }
    }
    getTotalUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                totalUserList: res.data,
            })
        }
    }
    getUserName = (value) => {
        let { totalUserList } = this.state
        for (let i = 0; i < totalUserList.length; i++) {
            if (totalUserList[i].id == value) {
                return totalUserList[i].realname
            }
        }
    }
    render() {
        const {
            modalVisible,
            addInfo,
            btnLoading,
            type,
            tableList,
            techUserList,
            bizUserList,
            classifyIds,
            dataClassifyIds,
            bizTreeData,
            dataTree,
            departmentList,
            bizModuleList,
            mainThemeList,
            alysisThemeList,
            tabValue,
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'bizDetailEditDrawer',
                    title: type == 'single' ? '编目配置' : '批量数据编目',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.classifyId || !addInfo.technicalManagerPair.id || !addInfo.businessManagerPair.id} loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {type == 'single' ? (
                            <Module title='表信息' style={{ padding: 0 }}>
                                <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ background: 'none', padding: 0 }}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '表英文名',
                                            content: addInfo.tableEname,
                                        },
                                        {
                                            label: '数据库',
                                            content: addInfo.databaseEname,
                                        },
                                    ])}
                                </Form>
                            </Module>
                        ) : (
                            <div className='batchInfoArea'>
                                当前共选择了
                                <Popover
                                    placement='topLeft'
                                    content={
                                        <div className='catelogPopover HideScroll'>
                                            {tableList.map((item, index) => {
                                                return (
                                                    <Tooltip title={item.tableEname || item.englishName}>
                                                        <div className='ellipsisLabel'>
                                                            {index + 1}.{item.tableEname || item.englishName}
                                                        </div>
                                                    </Tooltip>
                                                )
                                            })}
                                        </div>
                                    }
                                >
                                    <a>{tableList.length}</a>
                                </Popover>
                                张表
                            </div>
                        )}
                        {type == 'single' ? <Divider style={{ margin: '24px 0' }} /> : null}
                        <ModuleTitle title='技术信息' />
                        <div className='MiniForm Grid1' style={{ marginTop: 20, columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '技术归属部门',
                                    required: true,
                                    content: <Select disabled style={{ width: '50%' }} value={addInfo.technicalDepartPair.name} placeholder='请选择'></Select>,
                                },
                                {
                                    label: '技术负责人',
                                    required: true,
                                    content: (
                                        <Select
                                            style={{ width: '50%' }}
                                            onChange={this.changeDetailSelect.bind(this, 'technicalManagerPair')}
                                            value={addInfo.technicalManagerPair.id}
                                            placeholder='请选择'
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        >
                                            {techUserList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.realname}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                            ])}
                        </div>
                        <Divider style={{ margin: '24px 0' }} />
                        <ModuleTitle title='业务信息' />
                        <div class='EditMiniForm ruleForm formWidth' style={{ marginTop: 20 }}>
                            <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                <Row gutter={8}>
                                    {tabValue == 'ods' ? (
                                        <Col span={6}>
                                            <Form.Item required label='业务分类' {...tailFormItemLayout}>
                                                <Cascader
                                                    allowClear={false}
                                                    style={{ width: '100%' }}
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={bizTreeData}
                                                    value={classifyIds}
                                                    displayRender={(e) => e.join('-')}
                                                    onChange={this.changeClassify.bind(this, 'classifyIds')}
                                                    popupClassName='searchCascader'
                                                    placeholder='请选择'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ) : null}
                                    {tabValue == 'ods' ? (
                                        <Col span={6}>
                                            <Form.Item label='数据分类' {...tailFormItemLayout}>
                                                <Cascader
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={dataTree}
                                                    value={dataClassifyIds}
                                                    displayRender={(e) => e.join('-')}
                                                    onChange={this.changeClassify.bind(this, 'dataClassifyIds')}
                                                    popupClassName='searchCascader'
                                                    placeholder='请选择'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ) : null}
                                    {tabValue == 'dw' ? (
                                        <Col span={6}>
                                            <Form.Item required label='业务板块' {...tailFormItemLayout}>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    onChange={this.changeDetailSelect.bind(this, 'classifyId')}
                                                    value={addInfo.classifyId}
                                                    placeholder='请选择'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                >
                                                    {bizModuleList.map((item) => {
                                                        return (
                                                            <Option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    ) : null}
                                    {tabValue == 'dw' ? (
                                        <Col span={6}>
                                            <Form.Item required label='主题域' {...tailFormItemLayout}>
                                                <Cascader
                                                    allowClear={false}
                                                    style={{ width: '100%' }}
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={mainThemeList}
                                                    value={dataClassifyIds} // themeClassifyId
                                                    displayRender={(e) => e.join('-')}
                                                    onChange={this.changeClassify.bind(this, 'dataClassifyId')}
                                                    popupClassName='searchCascader'
                                                    placeholder='请选择'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ) : null}
                                    {tabValue == 'app' ? (
                                        <Col span={8}>
                                            <Form.Item required label='分析主题' {...tailFormItemLayout}>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    onChange={this.changeDetailSelect.bind(this, 'classifyId')}
                                                    value={addInfo.classifyId}
                                                    placeholder='请选择'
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                >
                                                    {alysisThemeList.map((item) => {
                                                        return (
                                                            <Option dataRef={item} key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    ) : null}

                                    <Col span={tabValue == 'app' ? 8 : 6}>
                                        <Form.Item label='业务归属部门' {...tailFormItemLayout}>
                                            <Select disabled style={{ width: '100%' }} value={addInfo.businessDepartPair.id} placeholder='请选择'>
                                                {departmentList.map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.departName}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={tabValue == 'app' ? 8 : 6}>
                                        <Form.Item required label='业务负责人' {...tailFormItemLayout}>
                                            <Select
                                                style={{ width: '100%' }}
                                                onChange={this.changeDetailSelect.bind(this, 'businessManagerPair')}
                                                value={addInfo.businessManagerPair.id}
                                                placeholder='请选择'
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            >
                                                {bizUserList.map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.realname}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
