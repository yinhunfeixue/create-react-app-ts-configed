import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Col, Divider, Form, message, Modal, Radio, Row, Select } from 'antd'
import { catalogNondwBizTree, dwSaveSys, nonDwSaveSys, suggestClassifyByDept } from 'app_api/dataSecurity'
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
export default class BizDetailEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            addInfo: {
                forceModifyTable: false,
                businessDepartPair: {},
                businessManagerPair: {},
            },
            classifyIds: [],
            btnLoading: false,
            userList: [],
            departmentList: [],
            levelList: [],
            suggestClassifyList: [],
            bizTree: [],
            isDataWarehouse: false,
        }
    }

    openModal = async (data, isDataWarehouse) => {
        let { addInfo, classifyIds } = this.state
        if (!isDataWarehouse) {
            if (data.bizClassifyId) {
                addInfo.classifyId = data.bizClassifyId[data.bizClassifyId.length > 1 ? 1 : 0]
                classifyIds = data.bizClassifyId
                this.setState({
                    addInfo,
                    classifyIds,
                })
            } else {
                addInfo.classifyId = undefined
                this.setState({
                    classifyIds: [],
                })
            }
        }
        addInfo.businessDepartPair = {
            id: data.classifyBizDeptId,
            name: data.classifyBizDeptName,
        }
        addInfo.businessManagerPair = {
            id: data.classifyBizManagerId,
            name: data.classifyBizManagerName,
        }
        addInfo.id = data.id
        addInfo.forceModifyTable = false
        await this.setState({
            modalVisible: true,
            detailInfo: data,
            userList: [],
            isDataWarehouse,
        })
        this.getSuggestClassifyByDept()
        this.getCatalogNondwBizTree()
        this.getDepartment()
        this.getBizUserList()
    }
    getSuggestClassifyByDept = async () => {
        let { detailInfo } = this.state
        let query = {
            deptId: detailInfo.businessMainDepartmentId,
            treeCode: 'BZ001',
        }
        let res = await suggestClassifyByDept(query)
        if (res.code == 200) {
            this.setState({
                suggestClassifyList: res.data,
            })
        }
    }
    getCatalogNondwBizTree = async () => {
        let res = await catalogNondwBizTree({ businessTag: 1 })
        if (res.code == 200) {
            this.setState({
                bizTree: this.deleteSubList(res.data),
            })
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
        let { isDataWarehouse } = this.state
        let query = {
            ...this.state.addInfo,
        }
        this.setState({ btnLoading: true })
        let res = {}
        if (isDataWarehouse) {
            res = await dwSaveSys(query)
        } else {
            res = await nonDwSaveSys(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.reload()
        }
    }
    changeDetailSelect = async (name, e, node) => {
        let { addInfo, detailInfo } = this.state
        addInfo[name].id = e
        addInfo[name].name = node.props.children
        await this.setState({
            addInfo,
        })
        if (name == 'businessDepartPair') {
            addInfo.businessManagerPair = {}
            // if (detailInfo.businessMainDepartmentName !== node.props.children) {
            //     message.info('业务归属部门与业务权威属主不同')
            // }
            this.setState({
                addInfo,
                userList: [],
            })
            this.getBizUserList()
        }
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
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
                userList: res.data,
            })
        }
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        if (name == 'forceModifyTable' && e.target.value) {
            this.openConfirmModal()
        } else {
            addInfo[name] = e.target.value
        }
        this.setState({
            addInfo,
        })
    }
    openConfirmModal = () => {
        let { addInfo } = this.state
        let that = this
        Modal.confirm({
            title: '选择是以后',
            content: '若部分表已编目，则被统一修改',
            okText: '确定',
            cancelText: '关闭',
            onOk() {
                addInfo.forceModifyTable = true
                that.setState({ addInfo })
            },
        })
    }
    changeClassify = async (value, selectedOptions) => {
        console.log(selectedOptions, 'changeClassify')
        let { addInfo, detailInfo } = this.state
        addInfo.classifyId = value[value.length > 1 ? 1 : 0]
        addInfo.businessDepartPair = {
            id: selectedOptions[selectedOptions.length - 1].businessDepartmentId ? selectedOptions[selectedOptions.length - 1].businessDepartmentId : undefined,
        }
        // if (selectedOptions[selectedOptions.length - 1].businessDepartmentId !== undefined && detailInfo.businessMainDepartmentId !== selectedOptions[selectedOptions.length - 1].businessDepartmentId) {
        //     message.info('业务归属部门与业务权威属主不同')
        // }
        addInfo.businessManagerPair = {
            id: selectedOptions[selectedOptions.length - 1].businessManagerId ? selectedOptions[selectedOptions.length - 1].businessManagerId : undefined,
        }
        console.log(addInfo, 'addInfo++')
        await this.setState({
            addInfo,
            classifyIds: value,
        })
        this.getBizUserList()
    }
    setClassifyIds = async (data) => {
        let { addInfo, bizTree } = this.state
        addInfo.classifyId = data.nodeIds[data.nodeIds.length > 1 ? 1 : 0]
        await this.setState({
            addInfo,
            classifyIds: data.nodeIds,
        })
        await this.getClassifyInfo(data.nodeIds[data.nodeIds.length > 1 ? 1 : 0], bizTree)
        this.getBizUserList()
    }
    getClassifyInfo = (id, data) => {
        let { addInfo, detailInfo } = this.state
        data.map((item) => {
            if (item.id == id) {
                addInfo.businessDepartPair = {
                    id: item.businessDepartmentId ? item.businessDepartmentId : undefined,
                }
                addInfo.businessManagerPair = {
                    id: item.businessManagerId ? item.businessManagerId : undefined,
                }
                // if (item.businessDepartmentId !== undefined && detailInfo.businessMainDepartmentId !== item.businessDepartmentId) {
                //     message.info('业务归属部门与业务权威属主不同')
                // }
                this.setState({
                    addInfo,
                })
            } else {
                if (item.children) {
                    this.getClassifyInfo(id, item.children)
                }
            }
        })
    }
    renderLabel = () => {
        let { detailInfo } = this.state
        return (
            <div style={{ textAlign: 'left' }}>
                {detailInfo.businessMainDepartmentName}部门对应的业务分类<div className='typeRecommand'>分类推荐</div>
            </div>
        )
    }
    render() {
        const { modalVisible, addInfo, detailInfo, btnLoading, levelList, suggestClassifyList, bizTree, classifyIds, departmentList, userList, isDataWarehouse } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'bizDetailEditDrawer',
                    title: '业务信息编辑',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button
                                disabled={(!addInfo.classifyId && !isDataWarehouse) || !addInfo.businessDepartPair.id || !addInfo.businessManagerPair.id}
                                loading={btnLoading}
                                onClick={this.postData}
                                type='primary'
                            >
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Module title='基本信息' style={{ padding: 0 }}>
                            <Form className='MiniForm DetailPart FormPart' layout='inline' style={{ background: 'none', padding: 0 }}>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '系统类别',
                                        content: detailInfo.sysClassifyName,
                                    },
                                    {
                                        label: '系统名称',
                                        content: detailInfo.identifier,
                                    },
                                    {
                                        label: '业务权威属主',
                                        content: detailInfo.businessMainDepartmentName,
                                    },
                                ])}
                            </Form>
                        </Module>
                        <Divider style={{ margin: '24px 0' }} />
                        <div className='MiniForm'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: this.renderLabel(),
                                    hide: isDataWarehouse,
                                    content: (
                                        <div className='bizTypeArea'>
                                            <div className='bizTypeItemArea'>
                                                {suggestClassifyList.map((item, index) => {
                                                    return (
                                                        <div className='bizTypeItem' onClick={this.setClassifyIds.bind(this, item)}>
                                                            <span>{index + 1}</span>
                                                            <div>{item.pathName}</div>
                                                        </div>
                                                    )
                                                })}
                                                {!suggestClassifyList.length ? <span>暂无推荐</span> : null}
                                            </div>
                                        </div>
                                    ),
                                },
                            ])}
                        </div>
                        {!isDataWarehouse ? <Divider style={{ margin: '24px 0' }} /> : null}
                        <ModuleTitle title='分类信息' />
                        <div class='EditMiniForm ruleForm formWidth' style={{ marginTop: 20 }}>
                            <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                <Row gutter={8}>
                                    {!isDataWarehouse ? (
                                        <Col span={8}>
                                            <Form.Item required label='业务分类' {...tailFormItemLayout}>
                                                <Cascader
                                                    allowClear={false}
                                                    style={{ width: '100%' }}
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={bizTree}
                                                    value={classifyIds}
                                                    displayRender={(e) => e.join('/')}
                                                    onChange={this.changeClassify}
                                                    popupClassName='searchCascader'
                                                    placeholder='请选择'
                                                />
                                            </Form.Item>
                                        </Col>
                                    ) : null}
                                    <Col span={isDataWarehouse ? 12 : 8}>
                                        <Form.Item required label='业务归属部门' {...tailFormItemLayout}>
                                            <Select
                                                style={{ width: '100%' }}
                                                onChange={this.changeDetailSelect.bind(this, 'businessDepartPair')}
                                                value={addInfo.businessDepartPair.id}
                                                placeholder='请选择'
                                            >
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
                                    <Col span={isDataWarehouse ? 12 : 8}>
                                        <Form.Item required label='业务负责人' {...tailFormItemLayout}>
                                            <Select
                                                style={{ width: '100%' }}
                                                onChange={this.changeDetailSelect.bind(this, 'businessManagerPair')}
                                                value={addInfo.businessManagerPair.id}
                                                placeholder='请选择'
                                            >
                                                {userList.map((item) => {
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
                                {!isDataWarehouse ? (
                                    <Form.Item required label='本系统下所有表是否继承以上业务分类，业务归属部门，业务负责人信息？' {...tailFormItemLayout}>
                                        <Radio.Group value={addInfo.forceModifyTable} onChange={this.changeInput.bind(this, 'forceModifyTable')}>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
