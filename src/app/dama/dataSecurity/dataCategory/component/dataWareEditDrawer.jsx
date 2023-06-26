import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Form, Input, message, Radio, Select, Modal } from 'antd'
import { addDataWarehouseTree, dataSecurityLevelList, updateDataWarehouseTree } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import { Select as LocalSelect } from 'cps'
import '../index.less'
import { readChangeDepart, readChangeUser } from '@/api/confirmation'

const { Option } = Select
const { TextArea } = Input

function getUserDataById(id, data) {
    return data.filter((v) => v.id === id)[0] || {}
}

export default class DataWareEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                childNodeCount: 0,
            },
            parentInfo: {},
            type: 'add',
            addType: 1,
            btnLoading: false,
            levelList: [],
            departmentList: [],
            userList: [],

            departChangeData: {},
            userChangeData: 0,
            changeVisible: false,
            changeType: '',
            sourceData: {},

            treeData: [],
        }
        this.changeDepart = 'pending' // pending | object
        this.changeUser = 'pending'
        this.userData = {}
        this.formRef = React.createRef()
    }

    openEditModal = async (parentInfo, data, treeData) => {
        data.businessDepartmentId = data.businessDepartmentId == '' ? undefined : data.businessDepartmentId
        data.businessManagerId = data.businessManagerId == '' ? undefined : data.businessManagerId
        data.securityLevel = data.securityLevel == '' ? undefined : data.securityLevel
        await this.setState({
            modalVisible: true,
            type: 'edit',
            addInfo: { ...data },
            parentInfo,
            userList: [],
            sourceData: { ...data },
            treeData,
        })
        // 单独处理被Form接管的回填
        this.formRef.current.setFieldsValue({
            name: data.name,
            englishName: data.englishName,
            code: data.code,
            businessDepartmentId: data.businessDepartmentId,
            businessManagerId: data.businessManagerId,
        })
        this.getAddType()
        this.init()
        this.getBizUserList()
    }
    openAddModal = async (data, treeData) => {
        let { addInfo } = this.state
        addInfo = { childNodeCount: 0 }
        await this.setState({
            modalVisible: true,
            type: 'add',
            addInfo,
            parentInfo: { ...data },
            userList: [],
            treeData,
        })
        this.getAddType()
        this.init()
    }
    getAddType = () => {
        let { parentInfo, type, addType, addInfo } = this.state
        console.log(parentInfo, 'parentInfo')
        console.log(addInfo, 'addInfo')
        if (parentInfo.businessTag == undefined) {
            this.setState({
                addType: 1,
            })
        } else {
            if (parentInfo.businessTag == 1) {
                addInfo.hasChild = type == 'edit' ? addInfo.hasChild : true
                this.setState({
                    addType: 2,
                    addInfo,
                })
            } else if (parentInfo.businessTag == 2) {
                this.setState({
                    addType: parentInfo.hasChild == true ? 2 : 3,
                })
            }
        }
    }
    init = async () => {
        this.getDataSecurityLevelList()
        this.getDepartment()
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        let { type, addInfo, parentInfo, addType } = this.state
        addInfo.businessDepartmentId = addInfo.businessDepartmentId == undefined ? '' : addInfo.businessDepartmentId
        addInfo.businessManagerId = addInfo.businessManagerId == undefined ? '' : addInfo.businessManagerId
        addInfo.securityLevel = addInfo.securityLevel == undefined ? '' : addInfo.securityLevel

        const data = await this.formRef.current
            .validateFields()
            .then((values) => {
                return true
            })
            .catch(() => false)
        console.log('data', data)
        if (!data) return

        let query = {
            parentId: parentInfo.id == undefined ? 0 : parentInfo.id,
            businessTag: addType,
            treeId: parentInfo.treeId,
            ...addInfo,
        }
        if (parentInfo.level == 2) {
            query.hasChild = false
        }
        this.setState({ btnLoading: true })
        let res = {}
        if (type == 'add') {
            res = await addDataWarehouseTree(query)
        } else {
            res = await updateDataWarehouseTree(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.reload()
        }
    }
    changeDetailSelect = async (name, e, moreInfo) => {
        const { type, addInfo, parentInfo } = this.state

        // 变更提示。可控组件，变更提示做到变更前
        if (type === 'edit') {
            if (name === 'businessDepartmentId') {
                const res = await readChangeDepart({ classId: parentInfo.treeId, deptId: e })
                const { data = {} } = res
                if (data.tableNum || data.datasourceNum) {
                    this.changeDepart = e
                    this.setState({
                        changeVisible: true,
                        departChangeData: { ...data },
                        changeType: 'depart',
                    })
                    return
                }
            }
            if (name === 'businessManagerId') {
                const res = await readChangeUser({ classId: parentInfo.treeId, managerId: e })
                if (res.data && addInfo.businessManagerId) {
                    this.changeUser = e
                    this.setState({
                        changeVisible: true,
                        userChangeData: res.data,
                        changeType: 'user',
                    })
                    return
                }
            }
        }

        addInfo[name] = e
        if (name === 'businessDepartmentId') {
            addInfo['businessManagerId'] = ''
            this.formRef.current.setFieldValue('businessManagerId', undefined)
        }

        addInfo[name] = e
        await this.setState({
            addInfo,
        })
        if (name == 'businessDepartmentId') {
            addInfo.businessManagerId = undefined
            this.setState({
                addInfo,
                userList: [],
            })
            this.getBizUserList()
        }
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
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
            departmentId: this.state.addInfo.businessDepartmentId,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
            this.setState({
                userList: res.data,
            })
        }
    }
    cancelModal = () => {
        this.setState({
            changeVisible: false,
        })
    }
    confirmModal = () => {
        const { changeType, addInfo } = this.state
        if (changeType === 'depart') {
            addInfo['businessDepartmentId'] = this.changeDepart
            addInfo['businessManagerId'] = ''
            this.formRef.current.setFieldValue('businessManagerId', undefined)
            this.setState({ addInfo })
            this.changeDepart = 'pending'
        }
        if (changeType === 'user') {
            addInfo['businessManagerId'] = this.changeUser
            this.setState({ addInfo })
            this.changeUser = 'pending'
        }
        this.setState({
            changeVisible: false,
        })
    }
    validateName = (name, fieldName = 'name') => {
        const { treeData = [], sourceData = {}, parentInfo } = this.state
        let find = false
        function loop(data) {
            data.forEach((v) => {
                if (v[fieldName] == name && (!sourceData[fieldName] || sourceData[fieldName] !== name)) {
                    find = true
                }
            })
        }
        loop(fieldName == 'code' ? treeData || [] : parentInfo.children || treeData || [])
        console.log('find', find)
        return find
    }
    render() {
        const { modalVisible, addInfo, btnLoading, levelList, type, addType, parentInfo, departmentList, userList, changeVisible, changeType } = this.state
        let businessTagDesc = addType == 1 ? '业务板块' : addType == 2 ? '数仓主题' : '业务过程'
        /* let errorMsg = '上级节点（' + (parentInfo.businessTag == 1 ? '业务板块' : (parentInfo.businessTag == 2 ? '主题域' : '业务过程')) + '）：' + parentInfo.name */
        let errorMsg = '上级节点：' + parentInfo.name
        let title = ''
        if (type == 'add') {
            title = '添加' + businessTagDesc
        } else {
            title = '编辑' + businessTagDesc
        }
        const that = this
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: title,
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button
                                /* disabled={!addInfo.name || !addInfo.englishName || !addInfo.code
                                || (
                                        ( 
                                            (addInfo.hasChild == false && parentInfo.businessTag == 1) || (parentInfo.businessTag == 2 && parentInfo.hasChild == true)
                                        ) && (!addInfo.businessDepartmentId || !addInfo.businessManagerId || !addInfo.securityLevel)
                                    )
                                } */
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
                        {parentInfo.name !== undefined ? <Alert style={{ marginBottom: 20 }} className='ErrorInfo' showIcon message={errorMsg} type='info' /> : null}
                        <Form ref={this.formRef} className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    //label: businessTagDesc + '名称',
                                    label: addType == 3 ? '业务过程中文名' : '主题中文名',
                                    required: true,
                                    name: 'name',
                                    rules: [
                                        {
                                            required: true,
                                            message: `请输入${addType == 3 ? '业务过程中文名' : '主题中文名'}`,
                                        },
                                        {
                                            validator: (_, value) => (!that.validateName(value) ? Promise.resolve() : Promise.reject(new Error('名称已存在'))),
                                        },
                                    ],
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.changeInput.bind(this, 'name')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: addType == 3 ? '业务过程英文名' : '主题英文名',
                                    required: true,
                                    name: 'englishName',
                                    rules: [
                                        {
                                            required: true,
                                            message: `请输入${addType == 3 ? '业务过程英文名' : '主题英文名'}`,
                                        },
                                        {
                                            validator: (_, value) => (!that.validateName(value, 'englishName') ? Promise.resolve() : Promise.reject(new Error('名称已存在'))),
                                        },
                                    ],
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.englishName}
                                            onChange={this.changeInput.bind(this, 'englishName')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.englishName ? addInfo.englishName.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '英文简写',
                                    required: true,
                                    name: 'code',
                                    rules: [
                                        {
                                            required: true,
                                            message: `请输入英文简写`,
                                        },
                                        {
                                            validator: (_, value) => (!that.validateName(value, 'code') ? Promise.resolve() : Promise.reject(new Error('名称已存在'))),
                                        },
                                    ],
                                    content: (
                                        <Input
                                            placeholder='请输入，保存后不可修改'
                                            value={addInfo.code}
                                            onChange={this.changeInput.bind(this, 'code')}
                                            disabled={type == 'edit'}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.code ? addInfo.code.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '分类描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={128} style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '是否有子类',
                                    hide: parentInfo.level >= 2,
                                    required: true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否有子类',
                                        },
                                    ],
                                    content: (
                                        <Radio.Group disabled={type === 'edit'} value={addInfo.hasChild} onChange={this.changeInput.bind(this, 'hasChild')}>
                                            <Radio value={true}>有</Radio>
                                            <Radio value={false}>无</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '业务归属部门',
                                    hide: addType == 3,
                                    //required: addInfo.hasChild && addType == '1' ? false : true,
                                    name: 'businessDepartmentId',
                                    //required: addInfo.hasChild && addType == '1' ? false : true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务归属部门',
                                        },
                                    ],
                                    content: (
                                        <LocalSelect.DepartTreeSelect
                                            //value={this.state.addInfo.businessDepartmentId || undefined}
                                            placeholder='请选择'
                                            onChange={this.changeDetailSelect.bind(this, 'businessDepartmentId')}
                                        />
                                    ),
                                },
                                {
                                    label: '业务负责人',
                                    hide: addType == 3,
                                    name: 'businessManagerId',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务负责人',
                                        },
                                    ],
                                    //required: addInfo.hasChild && addType == '1' ? false : true,
                                    content: (
                                        <LocalSelect.UserSelect
                                            //value={this.state.addInfo.businessManagerId}
                                            departId={this.state.addInfo.businessDepartmentId}
                                            onChange={this.changeDetailSelect.bind(this, 'businessManagerId')}
                                            placeholder='请选择'
                                            refData={this.userData}
                                        />
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
                <Modal
                    wrapClassName='classifyModal'
                    visible={changeVisible}
                    title='变更提示'
                    onCancel={this.cancelModal}
                    destroyOnClose
                    footer={[
                        <Button onClick={this.cancelModal} type='default'>
                            取消修改
                        </Button>,
                        <Button onClick={this.confirmModal} type='primary'>
                            了解并继续
                        </Button>,
                    ]}
                >
                    <div>
                        {changeType === 'depart' && (
                            <div className='depart'>
                                <p style={{ marginBottom: 34 }}>
                                    变更会导致<span> {this.state.departChangeData.datasourceNum} </span>个数据源、<span> {this.state.departChangeData.tableNum} </span>张表已确权信息失效
                                </p>
                                <p>数据源明细：{this.state.departChangeData.datasourceNameStr || ''}</p>
                            </div>
                        )}
                        {changeType === 'user' && (
                            <div className='user'>
                                <p>
                                    系统会将改该业务分类下有<span> {this.state.userChangeData} </span>张表
                                </p>
                                <p>
                                    <span>
                                        {getUserDataById(addInfo.businessManagerId, this.userData.current || []).realname}(
                                        {getUserDataById(addInfo.businessManagerId, this.userData.current || []).username})
                                    </span>
                                    所负责的表替换为{' '}
                                    <span>
                                        {getUserDataById(this.changeUser, this.userData.current || []).realname}({getUserDataById(this.changeUser, this.userData.current || []).username})
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            </DrawerLayout>
        )
    }
}
