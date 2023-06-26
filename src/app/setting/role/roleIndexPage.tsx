import { listRoleAvailableUsers, requestAddRoleToUser, requestDeleteRole, requestDepartmentTree, requestRemoveRoleFromUsers, requestRoleList, requestUserList } from '@/api/systemApi'
import InfoCard from '@/app/setting/permission/infoCard'
import UserSelector from '@/app/setting/UserSelector'
import IconFont from '@/component/IconFont'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import PermissionWrap from '@/component/PermissionWrap'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import UserStatus from '@/enums/UserStatus'
import PermissionManage from '@/utils/PermissionManage'
import RenderUtil from '@/utils/RenderUtil'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, List, Menu, Modal, Select, Tooltip, TreeSelect } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import classNames from 'classnames'
import React, { Component, ReactText } from 'react'
import RoleEdit from './roleEdit'
import './roleIndexPage.less'

interface IRoleData {
    id: ReactText
    roleName: string
    remark: string
}

interface IRoleIndexPageSate {
    roleList: IRoleData[]
    selectedRoleId?: ReactText
    selectedRole?: IRoleData
    editRole?: any
    visibleEdit: boolean
    visibleDetail: boolean
    lookRole?: any

    visibleLinkUser?: boolean

    departmentTree: any[]
    searchParams: {
        accountName?: string
        deptId?: string
        status?: string
    }

    hoverRoleId?: ReactText
}

/**
 * 角色首页
 */
class RoleIndexPage extends Component<any, IRoleIndexPageSate> {
    private controller!: IRichTableLayoutContoler<any>
    private userColumns: ColumnProps<any>[] = [
        {
            title: '帐号',
            width: 140,
            dataIndex: 'account',
        },
        {
            title: '姓名',
            width: 140,
            dataIndex: 'name',
        },
        {
            title: '部门',
            dataIndex: 'deptNames',
        },
        {
            title: '帐号状态',
            width: 120,
            render: (_, record) => {
                const label = UserStatus.toString(record.status)
                const status = record.status === UserStatus.ENABLED ? 'success' : 'warning'
                return <StatusLabel type={status} message={label} />
            },
        },
    ]

    constructor(props: any) {
        super(props)
        this.state = {
            departmentTree: [],
            roleList: [],
            visibleEdit: false,
            searchParams: {},
            visibleDetail: false,
        }
    }

    componentDidMount() {
        this.requestRoleList()

        requestDepartmentTree().then((res) => {
            this.setState({ departmentTree: res.data })
        })
    }

    private requestUserList = async (page: number, pageSize: number) => {
        const { selectedRoleId, searchParams } = this.state
        const res = await requestUserList({
            page,
            page_size: pageSize,
            roleId: selectedRoleId,
            ...searchParams,
        })
        if (res.code !== 200) {
            return
        }
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    private async requestRoleList() {
        const res = await requestRoleList()
        const data: IRoleData[] = res.data

        this.setState({
            roleList: data,
        })

        if (data.length) {
            this.updateSelectedRoleId(data[0].id, data[0])
        } else {
            this.updateSelectedRoleId('', undefined)
        }
    }

    private updateSelectedRoleId(id: ReactText, role?: IRoleData) {
        this.setState({ selectedRoleId: id, selectedRole: role }, () => {
            if (id) {
                this.resetTable()
            }
        })
    }

    private resetTable() {
        this.controller.reset()
    }

    private renderRoleList() {
        const { selectedRoleId, roleList, hoverRoleId } = this.state
        let roleMenu: { label: string; onClick: Function; className?: string }[] = [
            {
                label: '详情',
                onClick: (item: any) =>
                    Modal.info({
                        title: '角色详情',
                        wrapClassName: 'InfoCardModal',
                        content: <InfoCard type='role' record={{ cnName: item.roleName, remark: item.remark }} />,
                        icon: null,
                        closable: true,
                    }),
            },
        ]
        if (PermissionManage.hasFuncPermission('/setting/role/manage/edit')) {
            roleMenu.push({
                label: '编辑',
                onClick: (item: any) => {
                    this.editRole(item)
                },
            })
        }
        if (PermissionManage.hasFuncPermission('/setting/role/manage/delete')) {
            roleMenu.push({
                label: '删除',
                className: 'ErrorLabel',
                onClick: (item: IRoleData) => {
                    Modal.confirm({
                        title: '删除角色',
                        icon: <ExclamationCircleFilled />,
                        content: '删除角色，将解绑该职位下所有用户，同时取消该角色所继承的权限。',
                        okText: '删除',
                        okButtonProps: {
                            danger: true,
                        },
                        cancelText: '取消',
                        onOk: () => {
                            requestDeleteRole([item.id]).then((res) => {
                                if (res.code === 200) {
                                    this.requestRoleList()
                                }
                            })
                        },
                    })
                },
            })
        }

        return (
            <List
                split={false}
                dataSource={roleList}
                renderItem={(item) => {
                    const selected = item.id === selectedRoleId
                    const hover = item.id === hoverRoleId

                    return (
                        <List.Item
                            className={classNames('RoleItem', selected ? 'SelectedRoleItem' : '', hover ? 'HoveredRoleItem' : '')}
                            actions={[
                                <Dropdown
                                    onVisibleChange={(visible) => {
                                        this.setState({
                                            hoverRoleId: visible ? item.id : undefined,
                                        })
                                    }}
                                    overlay={
                                        <Menu style={{ minWidth: 130 }}>
                                            {roleMenu.map((menuItem) => {
                                                return (
                                                    <Menu.Item key={menuItem.label} onClick={() => menuItem.onClick(item)}>
                                                        <span className={menuItem.className}>{menuItem.label}</span>
                                                    </Menu.Item>
                                                )
                                            })}
                                        </Menu>
                                    }
                                >
                                    <IconFont className='NodeMenuIcon' type='icon-more' />
                                </Dropdown>,
                            ]}
                            onClick={() => this.updateSelectedRoleId(item.id, item)}
                        >
                            <List.Item.Meta
                                title={
                                    <Tooltip title={item.remark}>
                                        <span>{item.roleName}</span>
                                    </Tooltip>
                                }
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    private editRole(target?: any) {
        this.setState({
            editRole: target,
            visibleEdit: true,
        })
    }

    private accountSearchHandler = (value: string) => {
        this.updateSearchParam({
            accountName: value,
        })
    }

    private departmentTreeChangeHandler = (value: string) => {
        this.updateSearchParam({
            deptId: value,
        })
    }

    private statusChangeHandler = (value: string) => {
        this.updateSearchParam({
            status: value,
        })
    }

    private resetSearchParams = () => {
        this.setState({ searchParams: {} }, () => this.resetTable())
    }

    updateSearchParam(obj: any) {
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

    private removeUsers(ids?: ReactText[]) {
        const { selectedRoleId } = this.state
        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: '移除分组',
            content: '是否确认将该用户移除？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                requestRemoveRoleFromUsers(selectedRoleId, ids).then(() => {
                    this.controller.reset()
                    this.controller.updateSelectedKeys([])
                })
            },
        })
    }

    render() {
        const { selectedRoleId, visibleEdit, editRole, searchParams, departmentTree, selectedRole, visibleLinkUser } = this.state
        const { accountName, deptId, status } = searchParams
        return (
            <React.Fragment>
                <SliderLayout
                    className='roleIndexPage'
                    disabledFold
                    renderSliderHeader={() => {
                        return (
                            <div className='HControlGroup' style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>角色</span>
                                <PermissionWrap funcCode='/setting/role/manage/add'>
                                    <Button size='small' icon={<PlusOutlined />} type='link' onClick={() => this.editRole()}></Button>
                                </PermissionWrap>
                            </div>
                        )
                    }}
                    renderSliderBody={() => {
                        return this.renderRoleList()
                    }}
                    renderContentHeader={() => {
                        return `${selectedRole ? `${selectedRole.roleName}-` : ''}人员列表`
                    }}
                    renderContentBody={() => {
                        return selectedRoleId ? (
                            <RichTableLayout
                                smallLayout
                                disabledDefaultFooter
                                tableProps={{
                                    columns: this.userColumns,
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
                                                showSearch
                                                allowClear
                                                treeDefaultExpandAll
                                                placeholder='部门'
                                                onChange={this.departmentTreeChangeHandler}
                                                value={deptId}
                                                filterTreeNode={(inputValue, treeNode) => {
                                                    if (treeNode) {
                                                        return treeNode.data.title.toLowerCase().indexOf(inputValue) >= 0
                                                    }
                                                    return true
                                                }}
                                                dropdownMatchSelectWidth={false}
                                            >
                                                {RenderUtil.renderTree(
                                                    departmentTree,
                                                    (item) => item.title,
                                                    (item) => item.id
                                                )}
                                            </TreeSelect>
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
                                requestListFunction={this.requestUserList}
                                editColumnProps={{
                                    width: 100,
                                    createEditColumnElements: (index, record) => {
                                        return RichTableLayout.renderEditElements([
                                            {
                                                label: '移除分组',
                                                onClick: () => this.removeUsers([record.id]),
                                                funcCode: '/setting/role/manage/deleteuser',
                                            },
                                        ])
                                    },
                                }}
                                renderFooter={(controller, defaultRender) => {
                                    return (
                                        <React.Fragment>
                                            <PermissionWrap funcCode='/setting/role/manage/deleteuser'>
                                                <Button onClick={() => this.removeUsers(controller.selectedKeys)}>移除分组</Button>
                                            </PermissionWrap>
                                            {defaultRender()}
                                        </React.Fragment>
                                    )
                                }}
                            />
                        ) : null
                    }}
                    renderContentHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/setting/role/manage/adduser'>
                                <Button type='primary' disabled={!selectedRoleId} onClick={() => this.setState({ visibleLinkUser: true })}>
                                    添加用户
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                />
                {visibleEdit && (
                    <RoleEdit
                        visible={visibleEdit}
                        targetData={editRole}
                        onCancel={() => this.setState({ visibleEdit: false })}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.requestRoleList()
                        }}
                    />
                )}
                {visibleLinkUser && (
                    <UserSelector
                        visible={visibleLinkUser}
                        onCancel={() => this.setState({ visibleLinkUser: false })}
                        onSuccess={async (keys) => {
                            return requestAddRoleToUser(selectedRoleId, keys).then((res) => {
                                if (res.code === 200) {
                                    this.setState({ visibleLinkUser: false })
                                    this.resetTable()
                                    return true
                                }
                                return false
                            })
                        }}
                        searchFunction={(params) => {
                            return listRoleAvailableUsers({
                                roleId: selectedRoleId,
                                page: params.page,
                                pageSize: params.pageSize,
                                accountName: params.key,
                            })
                        }}
                    />
                )}
            </React.Fragment>
        )
    }
}

export default RoleIndexPage
