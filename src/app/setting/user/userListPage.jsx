import { batchUpdateStaus, requestDeleteUser, requestDepartmentTree, requestRoleList, requestUserList } from '@/api/systemApi'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import UserStatus from '@/enums/UserStatus'
import PermissionManage from '@/utils/PermissionManage'
import RenderUtil from '@/utils/RenderUtil'
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal, Select, Switch, TreeSelect } from 'antd'
import React, { Component } from 'react'
import ImportUser from './ImportUser'
import UserDetail from './userDetail'
import UserEdit from './userEdit'

const confirm = Modal.confirm

class UserList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pagination: {
                total: '',
                page: 1,
                page_size: 20,
                paginationDisplay: 'none',
            },
            tableData: [],
            roleList: [],
            treeData: [],
            defaultTreeSelectedKeys: [],
            tableLoading: true,
            selectedRowKeys: [],
            inputValue: '',

            searchParams: {
                accountName: '',
                deptId: undefined,
                roleId: undefined,
                status: undefined,
            },
        }

        // 表格项
        this.columns = [
            {
                title: '账号',
                dataIndex: 'account',
                width: 200,
            },
            {
                title: '姓名',
                dataIndex: 'name',
                width: 200,
            },
            {
                title: '部门',
                dataIndex: 'deptNames',
            },
            {
                title: '角色',
                dataIndex: 'roleNames',
                width: 200,
            },
            {
                title: '帐号状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, item) => {
                    const enable = text == UserStatus.ENABLED
                    const { loadingStatus } = this.state
                    return (
                        <Switch
                            loading={loadingStatus}
                            disabled={!PermissionManage.hasFuncPermission('/setting/user/manage/switch')}
                            checked={enable}
                            checkedChildren='启用'
                            unCheckedChildren='禁用'
                            onChange={(checked) => {
                                const status = checked ? UserStatus.ENABLED : UserStatus.DISABLED
                                this.updateUserStatus([item], status)
                            }}
                        />
                    )
                },
                width: 100,
            },
        ]
        this.selectedRows = []
        this.expandedKeysAll = []
    }

    componentDidMount() {
        this.getDepartments()
        this.getRoleList()
    }

    getDepartments = () => {
        requestDepartmentTree().then((res) => {
            if (res.code == '200') {
                this.setState({
                    treeData: res.data,
                })
            } else {
                message.error(res.msg || '请求部门信息失败')
            }
        })
    }

    getRoleList() {
        requestRoleList().then((res) => {
            if (res.code == '200') {
                this.setState({
                    roleList: res.data,
                })
            } else {
                message.error(res.msg || '请求角色列表失败')
            }
        })
    }

    getTableData = async (params) => {
        const { searchParams } = this.state
        let param = { ...params, ...searchParams }
        let res = await requestUserList(param)
        if (res.code !== 200) {
            return
        }
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    accountSearchHandler = (value) => {
        this.updateSearchParam({
            accountName: value,
        })
    }

    departmentTreeChangeHandler = (value) => {
        this.updateSearchParam({
            deptId: value,
        })
    }

    roleChangeHandler = (value) => {
        this.updateSearchParam({
            roleId: value,
        })
    }

    statusChangeHandler = (value) => {
        this.updateSearchParam({
            status: value,
        })
    }

    resetSearchParams = () => {
        this.setState({ searchParams: {} }, () => this.resetTable())
    }

    updateSearchParam(obj) {
        this.setState(
            {
                searchParams: {
                    ...this.state.searchParams,
                    ...obj,
                },
            },
            () => {
                this.resetTable()
            }
        )
    }

    handleAddUser = () => {
        this.setState({ visibleEdit: true, targetUser: undefined })
    }

    handleEditUser = (data) => {
        if (!data) {
            return
        }
        this.setState({
            visibleEdit: true,
            targetUser: data,
        })
    }

    onDetail = (data) => {
        this.setState({ targetUser: data, visibleDetail: true })
    }

    handlePwdReset = () => {
        if (this.selectedRows.length !== 1) {
            message.warning('请选择一条用户信息进行修改！')
            return
        }
        this.props.addTab('密码重置', { ...this.selectedRows[0] })
    }

    deleteUser = async (idList) => {
        let res = await requestDeleteUser(idList)
        if (res.code == 200) {
            message.success('用户删除成功！')
        } else {
            message.warning(res.msg)
        }

        return res.code === 200
    }

    resetTable = async () => {
        this.controller.reset()
    }

    updateUserStatus = (itemList, status) => {
        this.setState({ loadingStatus: true })
        const ids = itemList.map((item) => item.id)
        batchUpdateStaus(ids, status).finally(() => {
            this.setState({ loadingStatus: false })
            // 手动修改属性，不刷新
            for (let item of itemList) {
                item.status = status
            }

            this.controller.updateSelectedKeys([])
        })
    }

    render() {
        const { visibleEdit, targetUser, visibleDetail, visibleImport, searchParams, treeData, roleList, loadingUpload, loadingStatus } = this.state
        const { accountName, deptId, roleId, status } = searchParams
        return (
            <React.Fragment>
                <RichTableLayout
                    title='用户管理'
                    renderHeaderExtra={() => {
                        return (
                            <React.Fragment>
                                <PermissionWrap funcCode='/setting/role/manage/deleteuser'>
                                    <Button loading={loadingUpload} icon={<DownloadOutlined />} type='primary' ghost onClick={() => this.setState({ visibleImport: true })}>
                                        导入用户
                                    </Button>
                                </PermissionWrap>
                                <PermissionWrap funcCode='/setting/user/manage/add'>
                                    <Button type='primary' onClick={this.handleAddUser}>
                                        新增用户
                                    </Button>
                                </PermissionWrap>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                        selectedEnable: true,
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search
                                    value={accountName}
                                    placeholder='请输入姓名/账号'
                                    onSearch={this.accountSearchHandler}
                                    onChange={(event) => {
                                        this.state.searchParams.accountName = event.target.value
                                        this.forceUpdate()
                                    }}
                                />
                                <TreeSelect
                                    treeNodeFilterProp='title'
                                    placeholder='部门'
                                    dropdownMatchSelectWidth={false}
                                    onChange={this.departmentTreeChangeHandler}
                                    value={deptId}
                                    onSearch={() => {}}
                                    showSearch
                                >
                                    {RenderUtil.renderTree(
                                        treeData,
                                        (item) => item.title,
                                        (item) => item.id
                                    )}
                                </TreeSelect>
                                <Select placeholder='角色' value={roleId} onChange={this.roleChangeHandler}>
                                    {RenderUtil.renderSelectOptionList(
                                        roleList,
                                        (item) => item.roleName,
                                        (item) => item.id
                                    )}
                                </Select>
                                <Select placeholder='帐号状态' value={status} onChange={this.statusChangeHandler}>
                                    {RenderUtil.renderSelectOptionList(
                                        UserStatus.ALL,
                                        (item) => UserStatus.toString(item),
                                        (item) => item
                                    )}
                                </Select>
                                <Button onClick={this.resetSearchParams}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    editColumnProps={{
                        width: 160,
                        createEditColumnElements: (index, record, defaultElement) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '详情',
                                    onClick: () => this.onDetail(record),
                                },
                                {
                                    label: '编辑',
                                    onClick: () => this.handleEditUser(record),
                                    funcCode: '/setting/user/manage/edit',
                                },
                            ]).concat(defaultElement)
                        },
                    }}
                    requestListFunction={async (page, pageSize) => {
                        return await this.getTableData({
                            page,
                            page_size: pageSize,
                        })
                    }}
                    deleteFunction={(keys) => {
                        return this.deleteUser(keys)
                    }}
                    deleteTitle='删除用户'
                    deleteContent='删除的用户数据将无法恢复，是否确认删除。'
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/setting/user/manage/delete',
                        }
                    }}
                    renderFooter={(controller, defaultRender) => {
                        return (
                            <React.Fragment>
                                {PermissionManage.hasFuncPermission('/setting/user/manage/switch') && (
                                    <React.Fragment>
                                        <Button
                                            type='primary'
                                            ghost
                                            loading={loadingStatus}
                                            onClick={() => {
                                                this.updateUserStatus(controller.selectedRows, UserStatus.DISABLED)
                                            }}
                                        >
                                            帐号禁用
                                        </Button>
                                        <Button
                                            type='primary'
                                            ghost
                                            loading={loadingStatus}
                                            onClick={() => {
                                                this.updateUserStatus(controller.selectedRows, UserStatus.ENABLED)
                                            }}
                                        >
                                            帐号启用
                                        </Button>
                                    </React.Fragment>
                                )}

                                {defaultRender()}
                            </React.Fragment>
                        )
                    }}
                />
                {visibleEdit && (
                    <UserEdit
                        // key={targetUser ? targetUser.id : ''}
                        targetUser={targetUser}
                        visible={visibleEdit}
                        onClose={() => this.setState({ visibleEdit: false })}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.controller.reset()
                        }}
                    />
                )}
                {visibleDetail && targetUser && (
                    <UserDetail
                        addTab={this.props.addTab}
                        targetUser={targetUser}
                        visible={visibleDetail}
                        onClose={() =>
                            this.setState({
                                visibleDetail: false,
                            })
                        }
                    />
                )}
                {visibleImport && (
                    <ImportUser
                        visible={visibleImport}
                        onClose={() => this.setState({ visibleImport: false })}
                        onSuccess={() => {
                            this.setState({ visibleImport: false })
                            this.resetTable()
                        }}
                    />
                )}
            </React.Fragment>
        )
    }
}

export default UserList
