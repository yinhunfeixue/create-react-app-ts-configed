import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, message, Radio, Select, Tooltip, Space, Modal } from 'antd'
import { addBizTree, dataSecurityLevelList, updateBizTree } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import React, { Component } from 'react'
import { readChangeDepart, readChangeUser } from '@/api/confirmation'
import '../index.less'
import { Select as LocalSelect } from 'cps'

const { Option } = Select
const { TextArea } = Input

function getUserDataById(id, data) {
    return data.filter((v) => v.id === id)[0] || {}
}

export default class CategoryEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                featureConfiguration: [],
                hasChild: true,
                childNodeCount: 0,
            },
            parentInfo: {},
            type: 'add',
            addType: '1',
            disabledType: undefined,
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
        this.formRef.current.setFieldsValue({ name: data.name, businessDepartmentId: data.businessDepartmentId, businessManagerId: data.businessManagerId })
        this.getAddType()
        this.init()
        this.getBizUserList()
    }
    openAddModal = async (data, treeData) => {
        let { addInfo } = this.state
        console.log('treeData', treeData)
        addInfo = { featureConfiguration: [], hasChild: true, childNodeCount: 0 }
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
        addType = type == 'edit' ? addInfo.businessTag : '1'
        if (parentInfo.businessTag == undefined) {
            this.setState({
                disabledType: '2',
                addType,
            })
        } else {
            if (parentInfo.businessTag == 1 && parentInfo.bizTagLevel == 1) {
                this.setState({
                    disabledType: undefined,
                    addType,
                })
            } else {
                this.setState({
                    disabledType: '1',
                    addType: '2',
                })
            }
            if (parentInfo.businessTag == 2 && parentInfo.bizTagLevel == 2) {
                addInfo.hasChild = false
                this.setState({
                    addInfo,
                })
            }
            if (parentInfo.businessTag == 1 && !parentInfo.hasChild) {
                this.setState({
                    disabledType: '1',
                    addType: '2',
                })
            }
        }
    }
    init = async () => {
        this.getDataSecurityLevelList()
        this.getDepartment()
        let { addInfo, parentInfo, type } = this.state
        if (type == 'add') {
            addInfo.businessManagerId = parentInfo.businessManagerId
            addInfo.businessDepartmentId = parentInfo.businessDepartmentId
            await this.setState({
                addInfo,
            })
            this.getBizUserList()
        }
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
        let query = {
            code: '',
            parentId: parentInfo.id == undefined ? 0 : parentInfo.id,
            treeId: parentInfo.treeId,
            ...addInfo,
            businessTag: addType,
        }

        const data = await this.formRef.current
            .validateFields()
            .then((values) => {
                console.log('values', values)
                return true
            })
            .catch(() => false)
        console.log('data', data)
        if (!data) return

        if (parentInfo.level == 2) {
            query.hasChild = false
        }

        this.setState({ btnLoading: true })
        let res = {}
        if (type == 'add') {
            res = await addBizTree(query)
        } else {
            res = await updateBizTree(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.reload()
        }
    }
    changeDetailSelect = async (name, e, moreInfo) => {
        console.log('change', name, e, moreInfo)
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
            // 部门变更时，表单人员值置空
            addInfo['businessManagerId'] = ''
            this.formRef.current.setFieldValue('businessManagerId', undefined)
        }
        await this.setState({
            addInfo,
        })

        /* if (name == 'businessDepartmentId') {
            addInfo.businessManagerId = undefined
            this.setState({
                addInfo,
                userList: []
            })
            this.getBizUserList()
        } */
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    renderLabel1 = () => {
        return (
            <span style={{ textAlign: 'left' }}>
                分类结构
                <Tooltip
                    title={
                        <div>
                            <p>1. 业务分类结构内部广义的业务内容和业务范围，可以与系统实体进行映射</p>
                            <p>2. 数据指按照数据性质、重要性程度、管理需要等将单类业务数据总和细分为不同的数据分类，可以与数据表进行映射</p>
                        </div>
                    }
                >
                    <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: 4 }} />
                </Tooltip>
            </span>
        )
    }
    renderLabel = () => {
        return (
            <div style={{ textAlign: 'left' }}>
                特征配置
                <Tooltip title={<div>特征配置是指该类别下表所具有的特征是属性，特征属性可以用表中包含的字段名称表示，例如：普通行情类数据一般包含 成交金额、成交数量、当前价格等字段信息。</div>}>
                    <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: 4 }} />
                </Tooltip>
            </div>
        )
    }
    changeAddType = (value) => {
        let { addType } = this.state
        this.setState({
            addType: value,
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
        const { treeData = [], sourceData, parentInfo } = this.state
        let find = false
        function loop(data) {
            data.forEach((v) => {
                if (v[fieldName] == name && (!sourceData[fieldName] || sourceData[fieldName] !== name)) {
                    find = true
                }
            })
        }
        loop(parentInfo.children || treeData || [])
        console.log('find', find)
        return find
    }
    render() {
        const { modalVisible, addInfo, btnLoading, levelList, type, addType, disabledType, parentInfo, departmentList, userList, changeVisible, changeType } = this.state
        const children = []
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
        }
        let errorMsg = '上级节点（' + (parentInfo.businessTag == 1 ? '业务' : '数据') + '）：' + parentInfo.name
        console.log('this.userData', this.userData)
        console.log('this.changeUser', this.changeUser)
        const that = this
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: type == 'add' ? '添加业务分类' : '编辑业务分类',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button
                                //disabled={(!(addInfo.hasChild && addType == '1') && !addInfo.businessDepartmentId) || !addInfo.name || (!(addInfo.hasChild && addType == '1') && !addInfo.businessManagerId) || (addType == '2' && !addInfo.securityLevel)}
                                htmlType='submit'
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
                                    label: this.renderLabel1(),
                                    required: true,
                                    hide: true,
                                    content: (
                                        <div className='tabBtn'>
                                            <Button
                                                onClick={this.changeAddType.bind(this, '1')}
                                                className={addType == '1' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}
                                                style={{ color: disabledType == '1' ? '#C4C8CC' : '', cursor: disabledType == '1' ? 'not-allowed' : 'pointer' }}
                                                disabled={disabledType == '1'}
                                            >
                                                {addType == '1' ? <SvgIcon name='icon_tag_top' /> : null}
                                                <span>业务</span>
                                            </Button>
                                            <Button
                                                onClick={this.changeAddType.bind(this, '2')}
                                                className={addType == '2' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}
                                                style={{ color: disabledType == '2' ? '#C4C8CC' : '', cursor: disabledType == '2' ? 'not-allowed' : 'pointer' }}
                                                disabled={disabledType == '2'}
                                            >
                                                {addType == '2' ? <SvgIcon name='icon_tag_top' /> : null}
                                                <span>数据</span>
                                            </Button>
                                        </div>
                                    ),
                                },
                                {
                                    label: '分类名称',
                                    name: 'name',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入分类名称',
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
                                    required: true,
                                    hide: parentInfo.level == 2,
                                    content: (
                                        <Radio.Group disabled={type === 'edit'} value={addInfo.hasChild} onChange={this.changeInput.bind(this, 'hasChild')}>
                                            <Radio value={true}>有</Radio>
                                            <Radio value={false}>无</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '业务归属部门',
                                    name: 'businessDepartmentId',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务归属部门',
                                        },
                                    ],
                                    //required: addInfo.hasChild && addType == '1' ? false : true,
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
                                    //required: addInfo.hasChild && addType == '1' ? false : true,
                                    name: 'businessManagerId',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务负责人',
                                        },
                                    ],
                                    content: (
                                        <LocalSelect.UserSelect
                                            //value={this.state.addInfo.businessManagerId}
                                            departId={this.state.addInfo.businessDepartmentId}
                                            onChange={this.changeDetailSelect.bind(this, 'businessManagerId')}
                                            refData={this.userData}
                                            placeholder='请选择'
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
