import {
    listDepartmentAvailableUsers,
    listUsedRoles,
    requestAddDepartmentToUser,
    requestDeleteDepartment,
    requestDepartmentTree,
    requestRemoveDepartmentFromUsers,
    requestUserList,
} from '@/api/systemApi'
import DepartmentDetail from '@/app/setting/department/DepartmentDetail'
import DepartmentEdit from '@/app/setting/department/DepartmentEdit'
import UserSelector from '@/app/setting/UserSelector'
import IComponentProps from '@/base/interfaces/IComponentProps'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import PermissionWrap from '@/component/PermissionWrap'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { SearchTree } from '@/components'
import { defaultTitleRender } from '@/components/trees/SearchTree'
import UserStatus from '@/enums/UserStatus'
import RenderUtil from '@/utils/RenderUtil'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React, { Component, ReactText } from 'react'
import './DepartmentIndexPage.less'

interface IDepartment {
    id: string
    title: string
    children?: IDepartment[]
}

interface IDepartmentIndexPageState {
    departmentList: IDepartment[]
    visibleEdit: boolean
    editTarget?: any
    loadingUpload: boolean

    loadingDepartment?: boolean
    visibleLinkUser: boolean

    visibleDetail?: boolean
    detailTarget?: any
    parentDepartment?: IDepartment
    roleList: any[]
    searchParams: {
        accountName?: string
        roleId?: string
        status?: string
    }

    selectedDepartmentId?: string
    hoverDepartmentId?: ReactText

    searchDepartmentKey?: string
}
interface IDepartmentIndexPageProps extends IComponentProps {
    addTab: Function
}

/**
 * DepartmentIndexPage
 */
class DepartmentIndexPage extends Component<IDepartmentIndexPageProps, IDepartmentIndexPageState> {
    private controller!: IRichTableLayoutContoler<any>
    private columns: ColumnProps<any>[] = [
        {
            title: '帐号',
            dataIndex: 'account',
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '角色',
            dataIndex: 'roleNames',
        },
        {
            title: '状态',
            width: 120,
            render: (_, record) => {
                const label = UserStatus.toString(record.status)
                const status = record.status === UserStatus.ENABLED ? 'success' : 'disabled'
                return <StatusLabel type={status} message={label} />
            },
        },
    ]

    constructor(props: IDepartmentIndexPageProps) {
        super(props)
        this.state = {
            departmentList: [],
            visibleEdit: false,
            visibleLinkUser: false,
            loadingUpload: false,
            searchParams: {},
            roleList: [],
        }
    }

    componentDidMount() {
        this.requestDepartments()

        listUsedRoles().then((res) => {
            this.setState({ roleList: res.data })
        })
    }

    private requestDepartments() {
        const { selectedDepartmentId } = this.state
        this.setState({ loadingDepartment: true })
        requestDepartmentTree()
            .then((res) => {
                this.setState({ departmentList: res.data })

                if (!selectedDepartmentId) {
                    const id = res.data && res.data.length ? res.data[0].id : ''
                    this.setState({ selectedDepartmentId: id }, () => {
                        this.resetTable()
                    })
                }
            })
            .finally(() => {
                this.setState({ loadingDepartment: false })
            })
    }

    private requestUserList = async (page: number, pageSize: number) => {
        const { searchParams, selectedDepartmentId } = this.state
        if (!selectedDepartmentId) {
            return
        }
        const res = await requestUserList({
            page,
            page_size: pageSize,
            ...searchParams,
            deptId: selectedDepartmentId,
        })
        if (res.code !== 200) {
            return
        }
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    private resetTable() {
        this.controller.reset()
    }

    private editDepartment(data?: IDepartment, parentDepartment?: IDepartment) {
        this.setState({ visibleEdit: true, editTarget: data, parentDepartment })
    }

    private roleChangeHandler = (value: string) => {
        this.updateSearchParam({
            roleId: value,
        })
    }

    private statusChangeHandler = (value: string) => {
        this.updateSearchParam({
            status: value,
        })
    }

    private accountSearchHandler = (value: string) => {
        this.updateSearchParam({
            accountName: value,
        })
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

    private resetSearchParams = () => {
        this.setState({ searchParams: {} }, () => this.resetTable())
    }

    private removeUser(ids?: ReactText[]) {
        if (!ids || !ids.length) {
            return
        }
        const { selectedDepartmentId } = this.state
        Modal.confirm({
            title: '移除用户',
            icon: <ExclamationCircleFilled />,
            content: '是否确认将该用户移除？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                requestRemoveDepartmentFromUsers(selectedDepartmentId, ids).then(() => {
                    this.controller.refresh()
                    this.controller.updateSelectedKeys([])
                })
            },
        })
    }

    render() {
        const { visibleEdit, editTarget, visibleLinkUser, departmentList, parentDepartment, searchParams, roleList, selectedDepartmentId, visibleDetail, detailTarget } = this.state
        const { accountName, roleId, status } = searchParams
        return (
            <React.Fragment>
                <SliderLayout
                    disabledFold
                    showScroller
                    className='DepartmentIndexPage'
                    renderSliderHeader={() => {
                        return (
                            <div className='HControlGroup' style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>部门</span>
                                <div className='HControlGroup'>
                                    <PermissionWrap funcCode='/setting/department/manage/add'>
                                        <Button size='small' icon={<PlusOutlined />} type='link' onClick={() => this.editDepartment()}></Button>
                                    </PermissionWrap>
                                </div>
                            </div>
                        )
                    }}
                    sliderBodyStyle={{ padding: 0 }}
                    renderSliderBody={() => {
                        return (
                            <div className='VControlGroup'>
                                <SearchTree
                                    treeProps={{
                                        treeData: departmentList as any[],
                                        fieldNames: { key: 'id' },
                                        onSelect: (selectedKeys) => {
                                            if (!selectedKeys || !selectedKeys.length) {
                                                return
                                            }

                                            this.setState({ selectedDepartmentId: selectedKeys[0] as string }, () => this.resetTable())
                                        },
                                    }}
                                    treeTitleRender={(node, searchKey) => {
                                        return defaultTitleRender(node, (item: IDepartment) => {
                                            return {
                                                title: item.title,
                                                menuList: [
                                                    {
                                                        label: '详情',
                                                        key: 'detail',
                                                        onClick: () => {
                                                            this.setState({ visibleDetail: true, detailTarget: item })
                                                        },
                                                    },
                                                    {
                                                        label: '编辑',
                                                        key: 'edit',
                                                        onClick: () => {
                                                            this.editDepartment(item)
                                                        },
                                                    },
                                                    {
                                                        label: '增加子部门',
                                                        key: 'add',
                                                        onClick: () => {
                                                            this.editDepartment(undefined, item)
                                                        },
                                                    },
                                                    {
                                                        label: '删除',
                                                        className: 'ErrorColor',
                                                        key: 'delete',
                                                        onClick: () => {
                                                            Modal.confirm({
                                                                title: '删除组织',
                                                                icon: <ExclamationCircleFilled />,
                                                                content: '将删除该组织下所有节点及解绑关联用户，同时取消该组织所继承的权限。',
                                                                okText: '删除',
                                                                cancelText: '取消',
                                                                okButtonProps: {
                                                                    danger: true,
                                                                },
                                                                onOk: () => {
                                                                    requestDeleteDepartment([item.id]).then((res) => {
                                                                        if (res.code === 200) {
                                                                            this.setState({ selectedDepartmentId: undefined, hoverDepartmentId: undefined }, () => this.requestDepartments())
                                                                        }
                                                                    })
                                                                },
                                                            })
                                                        },
                                                    },
                                                ],
                                            }
                                        })
                                    }}
                                />
                            </div>
                        )
                    }}
                    renderContentHeader={() => {
                        return '人员列表'
                    }}
                    renderContentHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/setting/department/manage/adduser'>
                                <Button type='primary' disabled={!Boolean(selectedDepartmentId)} onClick={() => this.setState({ visibleLinkUser: true })}>
                                    添加用户
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderContentBody={() => {
                        return (
                            <RichTableLayout
                                smallLayout
                                disabledDefaultFooter
                                tableProps={{
                                    columns: this.columns,
                                    selectedEnable: true,
                                    extraTableProps: {
                                        scroll: {
                                            x: false,
                                        },
                                    },
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
                                requestListFunction={this.requestUserList}
                                editColumnProps={{
                                    width: 100,
                                    createEditColumnElements: (index, record) => {
                                        return RichTableLayout.renderEditElements([
                                            {
                                                label: '移除分组',
                                                onClick: () => this.removeUser([record.id]),
                                                funcCode: '/setting/department/manage/deleteuser',
                                            },
                                        ])
                                    },
                                }}
                                renderFooter={(controller, defaultRender) => {
                                    return (
                                        <React.Fragment>
                                            <PermissionWrap funcCode='/setting/department/manage/deleteuser'>
                                                <Button onClick={() => this.removeUser(controller.selectedKeys)}>移除分组</Button>
                                            </PermissionWrap>
                                            {defaultRender()}
                                        </React.Fragment>
                                    )
                                }}
                            />
                        )
                    }}
                />
                {visibleEdit && (
                    <DepartmentEdit
                        visible={visibleEdit}
                        parentDepartment={parentDepartment}
                        targetData={editTarget}
                        onCancel={() => this.setState({ visibleEdit: false })}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.requestDepartments()
                        }}
                    />
                )}
                {visibleLinkUser && (
                    <UserSelector
                        visible={visibleLinkUser}
                        onCancel={() => this.setState({ visibleLinkUser: false })}
                        onSuccess={async (keys) => {
                            return requestAddDepartmentToUser(selectedDepartmentId, keys).then((res) => {
                                if (res.code === 200) {
                                    this.setState({ visibleLinkUser: false })
                                    this.resetTable()
                                    return true
                                }
                                return false
                            })
                        }}
                        searchFunction={(params) => {
                            return listDepartmentAvailableUsers({
                                deptId: selectedDepartmentId,
                                page: params.page,
                                pageSize: params.pageSize,
                                accountName: params.key,
                            })
                        }}
                    />
                )}
                {visibleDetail && <DepartmentDetail onClose={() => this.setState({ visibleDetail: false })} visible={visibleDetail} targetData={detailTarget} addTab={this.props.addTab} />}
            </React.Fragment>
        )
    }
}

export default DepartmentIndexPage
