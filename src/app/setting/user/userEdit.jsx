import { dataSecurityLevelList } from '@/api/dataSecurity'
import { requestAddUser, requestDepartmentTree, requestEditUser, requestRoleList } from '@/api/systemApi'
import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import RenderUtil from '@/utils/RenderUtil'
import { CheckCircleFilled, CopyOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, message, Modal, Radio, Select, TreeSelect } from 'antd'
import { userGroupsList } from 'app_api/manageApi'
import copy from 'copy-to-clipboard'
import React, { Component } from 'react'
const { Option } = Select
const RadioGroup = Radio.Group

const DEFAULT_PASSWORD = '666666'

class UserEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            securityList: [],
            classifierName: '',
            departments: [],
            roleList: [],
        }
    }
    componentDidMount() {
        this.init()
    }

    init = async () => {
        const { targetUser } = this.props

        if (targetUser) {
            this.form.setFieldsValue(targetUser)
        } else {
            this.form.setFieldsValue({
                securityLevel: 2,
            })
        }

        dataSecurityLevelList().then((res) => {
            this.setState({ securityList: res.data })
        })
        requestDepartmentTree().then((res) => {
            this.setState({ departments: res.data })
        })

        requestRoleList().then((res) => {
            this.setState({ roleList: res.data })
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.form.validateFields().then((values) => {
            this.saveData({ ...this.props.targetUser, ...values })
        })
    }

    saveData = async (params) => {
        const { targetUser, onSuccess } = this.props

        this.setState({ loading: true })
        let res = {}
        if (targetUser) {
            res = await requestEditUser(targetUser.id, params)
        } else {
            res = await requestAddUser(params)
        }

        this.setState({ loading: false })
        if (res.code != '200') {
            return
        }
        // 如果是编辑，弹出提示消息；否则弹框
        if (targetUser) {
            message.success('修改成功')
        } else {
            Modal.success({
                title: '用户创建成功',
                icon: <CheckCircleFilled />,
                content: (
                    <span>
                        默认密码为{DEFAULT_PASSWORD}
                        <a
                            style={{ marginLeft: 6 }}
                            onClick={() => {
                                const str = `帐号：${params.account}\r\n密码：${DEFAULT_PASSWORD}`
                                let copyStatus = copy(str)
                                if (copyStatus) {
                                    message.success('复制成功！')
                                } else {
                                    message.success('复制失败！')
                                }
                            }}
                        >
                            <CopyOutlined />
                            复制帐密
                        </a>
                    </span>
                ),
            })
        }
        onSuccess()
    }

    get isEdit() {
        return Boolean(this.props.targetUser)
    }

    onCancel = () => {
        const { onClose } = this.props
        onClose()
    }
    getGroupsData = () => {
        let param = {
            recursive: true,
        }
        return userGroupsList(param)
    }

    render() {
        const { visible } = this.props
        const edit = this.isEdit
        const { securityList, classifierName, loading, departments, roleList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: edit ? '编辑用户' : '新增用户',
                    visible,
                    width: 860,
                    onClose: this.onCancel,
                }}
                mainBodyStyle={{ padding: 0 }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} type='primary' onClick={this.handleSubmit}>
                                确定
                            </Button>
                            <Button onClick={this.onCancel} disabled={loading}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                <Form className='EditMiniForm' scrollToFirstError ref={(target) => (this.form = target)}>
                    <Module title='基本信息'>
                        <div className='Grid2'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '账号',
                                    name: 'account',
                                    rules: [
                                        {
                                            required: true,
                                            message: '账号不能为空！',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9]{6,24}$/,
                                            message: '请输入6-24位英文和数字',
                                        },
                                    ],
                                    content: <Input placeholder='用户帐号名,长度6-24之间' disabled={edit} />,
                                },
                                {
                                    label: '姓名',
                                    name: 'name',
                                    rules: [
                                        {
                                            required: true,
                                            message: '姓名不能为空！',
                                        },
                                        {
                                            min: 2,
                                            message: '姓名不能少于2个字符！',
                                        },
                                        {
                                            message: '姓名不能超过8个字符！',
                                            max: 8,
                                        },
                                    ],
                                    content: <Input placeholder='用户真实姓名,长度2-8之间' />,
                                },
                                {
                                    label: '邮箱',
                                    name: 'email',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入邮箱',
                                        },
                                        {
                                            type: 'email',
                                            message: '请输入正确的邮箱！',
                                        },
                                    ],
                                    content: <Input />,
                                },
                                {
                                    label: '手机号',
                                    name: 'phone',
                                    rules: [
                                        {
                                            min: 11,
                                            message: '用户手机号，长度11-14之间',
                                        },
                                        {
                                            message: '用户手机号，长度11-14之间',
                                            max: 14,
                                        },
                                    ],
                                    content: <Input type='number' placeholder='用户手机号，长度11-14之间' />,
                                },
                            ])}
                        </div>
                    </Module>
                    <Module title='工作信息'>
                        <div className='Grid2'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '工号',
                                    name: 'jobNumber',
                                    rules: [
                                        {
                                            required: true,
                                            message: '工号不能为空！',
                                        },
                                        {
                                            min: 3,
                                            message: '工号不能少于3个字符！',
                                        },
                                        {
                                            message: '工号不能超过32个字符！',
                                            max: 32,
                                        },
                                    ],
                                    content: <Input placeholder='工号，长度3-32之间' />,
                                },
                                {
                                    label: '数据分级权限',
                                    name: 'securityLevel',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择数据分级权限等级！',
                                        },
                                    ],
                                    content: (
                                        <Select placeholder='请选择数据分级权限等级'>
                                            {RenderUtil.renderSelectOptionList(
                                                securityList,
                                                (item) => item.name,
                                                (item) => item.id
                                            )}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '角色',
                                    name: 'roleIds',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择角色',
                                        },
                                    ],
                                    content: (
                                        <Select
                                            mode='multiple'
                                            filterOption={(input, option) => {
                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }}
                                        >
                                            {RenderUtil.renderSelectOptionList(
                                                roleList,
                                                (item) => item.roleName,
                                                (item) => item.id
                                            )}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '部门',
                                    name: 'deptIds',
                                    content: (
                                        <TreeSelect
                                            name='departName'
                                            multiple
                                            filterTreeNode={(input, treeNode) => {
                                                return treeNode.data.title.toLowerCase().indexOf(input) >= 0
                                            }}
                                        >
                                            {RenderUtil.renderTree(
                                                departments,
                                                (item) => {
                                                    return (
                                                        <span>
                                                            <IconFont style={{ color: '#227FDC', marginRight: 5 }} type='e69d' useCss />
                                                            {item.title}
                                                        </span>
                                                    )
                                                },
                                                (item) => item.id
                                            )}
                                        </TreeSelect>
                                    ),
                                },
                                {
                                    label: '',
                                    hide: edit,
                                    content: <Alert message={`您创建的账号默认密码是${DEFAULT_PASSWORD}。`} type='warning' showIcon />,
                                },
                            ])}
                        </div>
                    </Module>
                </Form>
            </DrawerLayout>
        )
    }
}

export default UserEdit
