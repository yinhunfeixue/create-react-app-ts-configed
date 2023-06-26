import {
    requestDepartmentPermissionList,
    requestDepartmentTree,
    requestRoleList,
    requestRolePermissionList,
    requestUserList,
    requestUserPermissionList,
    resetUserPermission,
    saveDepartmentPermissionList,
    saveRolePermissionList,
    saveUserPermissionList,
} from '@/api/systemApi'
import PermissionTree from '@/app/setting/PermissionTree'
import PermisstionTable from '@/app/setting/PermisstionTable'
import SliderLayout from '@/component/layout/SliderLayout'
import { IPermission } from '@/interface/IPermission'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import TreeControl from '@/utils/TreeControl'
import { SyncOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Input, List, message, Spin, Tabs, Tree } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import Lodash from 'lodash'
import React, { Component, ReactText } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import './PermissionSetting.less'
import PermissionWrap from '@/component/PermissionWrap'

const DEPARTMENT = 'department'
const ROLE = 'role'
const USER = 'user'

const FUN_PERMISSION = '1'
const SYSTEM_PERMISSION = '2'

interface IPermissionIndexSate {
    roleList: any[]
    departmentList: any[]
    userList: any[]
    useTotal: number
    userSearchKey?: string
    loadingUserList: boolean
    loadingSave: boolean
    loadingReset: boolean

    loadingRequest: boolean

    permissionDic: { [key: number]: IPermission[] }

    funcAuths: CheckboxValueType[]
    systemAuths: CheckboxValueType[]
    /**
     * 0-功能和系统权限用户设置 1-功能权限继承系统权限设置 2-功能权限设置系统权限继承 3-功能和系统权限均继承
     */
    authFrom: number

    /**
     * 上次保存的 选中的功能权限
     */
    lastFuncAuths: CheckboxValueType[]

    /**
     * 上次保存的 选中的系统权限
     */
    lastSystemAuths: CheckboxValueType[]

    target: {
        type: typeof DEPARTMENT | typeof ROLE | typeof USER
        id: string
    }

    selectedAuthType: typeof FUN_PERMISSION | typeof SYSTEM_PERMISSION
}

/**
 * PermissionIndex
 */
class PermissionSetting extends Component<any, IPermissionIndexSate> {
    private debounceRequestUserList = Lodash.debounce(this.requestUserList, 500)
    private treeControl = new TreeControl()

    constructor(props: any) {
        super(props)

        const params = this.params
        const { type, id, name } = params
        this.state = {
            roleList: [],
            departmentList: [],
            userList: [],
            permissionDic: {},
            loadingUserList: false,
            loadingSave: false,
            loadingReset: false,
            loadingRequest: false,
            useTotal: 0,

            funcAuths: [],
            systemAuths: [],
            authFrom: -1,

            lastFuncAuths: [],
            lastSystemAuths: [],
            target: {
                type: type || DEPARTMENT,
                id: id || '',
            },
            selectedAuthType: FUN_PERMISSION,
            userSearchKey: name || '',
        }
    }

    private get params() {
        return ProjectUtil.getPageParam(this.props)
    }

    componentDidMount() {
        const { target } = this.state
        const { type, id } = target
        Promise.all([
            requestRoleList().then((res) => {
                this.setState({ roleList: res.data })
            }),
            requestDepartmentTree().then((res) => {
                this.setState({ departmentList: res.data })
            }),
            this.requestUserList(1, true),
        ]).then(() => {
            this.initTarget(type, id)
        })
    }

    private requestUserList(page: number, reset: boolean = false) {
        const { userSearchKey, userList } = this.state
        this.setState({ loadingUserList: true })
        return requestUserList({
            page,
            page_size: 30,
            accountName: userSearchKey,
        })
            .then((res) => {
                this.setState({ userList: reset ? res.data : userList.concat(res.data), useTotal: res.total })
            })
            .finally(() => {
                this.setState({ loadingUserList: false })
            })
    }

    private renderDepartmentList() {
        const { departmentList, target } = this.state
        const selectedDepartmentId = target.type === DEPARTMENT ? target.id : ''
        if (!departmentList || !departmentList.length) {
            return
        }
        return (
            <Tree
                defaultExpandAll
                selectedKeys={[selectedDepartmentId]}
                autoExpandParent
                onSelect={(keys) => {
                    if (keys && keys.length) {
                        target.id = keys[0] as string
                        this.requestTargetPermissionList()
                        this.forceUpdate()
                    }
                }}
            >
                {RenderUtil.renderTree(
                    departmentList,
                    (item) => item.title,
                    (item) => item.id
                )}
            </Tree>
        )
    }

    private renderRoleList() {
        const { roleList, target } = this.state
        const selectRoleId = target.type === ROLE ? target.id : ''
        if (!roleList) {
            return
        }

        return (
            <List
                split={false}
                dataSource={roleList}
                renderItem={(item: any) => {
                    const selected = selectRoleId === item.id
                    return (
                        <List.Item
                            onClick={() => {
                                target.id = item.id
                                this.requestTargetPermissionList()
                                this.forceUpdate()
                            }}
                        >
                            <List.Item.Meta title={<span className={selected ? 'Selected' : ''}>{item.roleName}</span>} />
                        </List.Item>
                    )
                }}
            />
        )
    }

    private handleInfiniteOnLoad = (page: number) => {
        this.requestUserList(page)
    }

    private setUserSearchKey(value: string): Promise<void> {
        return new Promise((resolve) => {
            this.setState({ userSearchKey: value }, async () => {
                await this.requestUserList(1, true)
                resolve()
            })
        })
    }

    private renderUseList() {
        const { userList, userSearchKey, loadingUserList, target, useTotal } = this.state
        const selectedUserId = target.type === USER ? target.id : ''
        if (!userList) {
            return
        }

        const hasMore = !loadingUserList && userList.length < useTotal
        return (
            <React.Fragment>
                <Input.Search
                    style={{ marginBottom: 8 }}
                    allowClear
                    placeholder='用户帐号'
                    value={userSearchKey}
                    onChange={(event) => {
                        const value = event.target.value
                        this.setState({ userSearchKey: value }, () => this.debounceRequestUserList(1, true))
                    }}
                    onSearch={(value) => {
                        this.setState({ userSearchKey: value }, () => this.debounceRequestUserList(1, true))
                    }}
                />
                <div className='UserInfiniteScroll'>
                    <InfiniteScroll key={userSearchKey} threshold={10} initialLoad={false} hasMore={hasMore} pageStart={1} loadMore={this.handleInfiniteOnLoad} useWindow={false}>
                        <List
                            split={false}
                            loading={loadingUserList}
                            dataSource={userList}
                            renderItem={(item: any) => {
                                const selected = selectedUserId === item.id
                                const name = item.name.replace(userSearchKey, `<span class='highlight'>${userSearchKey}</span>`)
                                const account = item.account.replace(userSearchKey, `<span class='highlight'>${userSearchKey}</span>`)
                                return (
                                    <List.Item
                                        onClick={() => {
                                            if (target.id !== item.id) {
                                                target.id = item.id
                                                this.requestTargetPermissionList()
                                                this.forceUpdate()
                                            }
                                        }}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <span
                                                    className={selected ? 'Selected' : ''}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `${name}(${account})`,
                                                    }}
                                                />
                                            }
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </InfiniteScroll>
                </div>
            </React.Fragment>
        )
    }

    private requestTargetPermissionList() {
        this.setState({
            funcAuths: [],
            systemAuths: [],
            lastFuncAuths: [],
            lastSystemAuths: [],
        })
        const { target, permissionDic } = this.state
        if (!target.id) {
            return
        }

        this.setState({ loadingRequest: true })
        let promise: Promise<any>
        switch (target.type) {
            case DEPARTMENT:
                promise = requestDepartmentPermissionList(target.id)
                break
            case ROLE:
                promise = requestRolePermissionList(target.id)
                break
            case USER:
                promise = requestUserPermissionList(target.id)
                break
            default:
                promise = Promise.resolve()
                break
        }

        promise
            .then((res) => {
                if (!res) {
                    return
                }
                if (res.code === 200) {
                    const { funcAuths, systemAuths, authFrom } = res.data
                    const funcSelected: ReactText[] = []
                    const systemSelected: ReactText[] = []
                    this.treeControl.forEach(funcAuths, (item: any) => {
                        if (item.selected) {
                            funcSelected.push(item.id)
                        }
                    })

                    this.treeControl.forEach(systemAuths, (item: any) => {
                        if (item.selected) {
                            systemSelected.push(item.id)
                        }
                    })

                    permissionDic[FUN_PERMISSION] = funcAuths
                    permissionDic[SYSTEM_PERMISSION] = systemAuths

                    this.setState({
                        funcAuths: funcSelected,
                        systemAuths: systemSelected,
                        lastFuncAuths: funcSelected.concat(),
                        lastSystemAuths: systemSelected.concat(),
                        authFrom,
                    })
                } else {
                    message.error(res.msg || '获取权限错误')
                }
            })
            .finally(() => {
                this.setState({ loadingRequest: false })
            })
    }

    private renderPermissionList(data: IPermission[], checkedKeys: CheckboxValueType[], onCheckChange: (value: CheckboxValueType[]) => void) {
        const { loadingRequest } = this.state
        return (
            <Spin spinning={loadingRequest}>
                <PermissionTree
                    hideBorder
                    dataSource={data}
                    enableChecked
                    checkedKeys={checkedKeys}
                    onCheckChange={onCheckChange}
                    renderTitle={(item, markStr) => {
                        const { title } = item
                        const effectTitle = markStr ? title.replaceAll(markStr, `<span class='highlight'>${markStr}</span>`) : title
                        return <span style={{ color: '#2D3033' }} dangerouslySetInnerHTML={{ __html: effectTitle }} />
                    }}
                />
            </Spin>
        )
    }

    private async save() {
        const { permissionDic, target, systemAuths, funcAuths, selectedAuthType } = this.state
        if (!target.id) {
            message.info('请在部门/角色/用户中，至少选择一项')
            return
        }

        // 构造树
        const postData = {
            funcAuths: this.createSaveTree(permissionDic[FUN_PERMISSION], funcAuths),
            systemAuths: this.createSaveTree(permissionDic[SYSTEM_PERMISSION], systemAuths),
            updateFlag: selectedAuthType,
        }

        let promise: Promise<any>
        switch (target.type) {
            case USER:
                promise = saveUserPermissionList({
                    userId: target.id,
                    ...postData,
                })
                break
            case ROLE:
                promise = saveRolePermissionList({
                    roleId: target.id,
                    ...postData,
                })
                break
            case DEPARTMENT:
                promise = saveDepartmentPermissionList({
                    deptId: target.id,
                    ...postData,
                })
                break
            default:
                promise = Promise.reject('目标类型错误')
        }
        this.setState({ loadingSave: true })
        promise
            .then((res) => {
                if (res.code === 200) {
                    message.success('保存成功')
                    this.requestTargetPermissionList()
                } 
            })
            .catch((error) => {
                message.error(error)
            })
            .finally(() => {
                this.setState({ loadingSave: false })
            })
    }

    private createSaveTree(permissionList: IPermission[], selectedValue: CheckboxValueType[]): any[] {
        const result = []
        for (let item of permissionList) {
            const node: any = {
                authType: item.authType,
                id: item.id,
                title: item.title,
            }
            // 检查自身
            node.selected = selectedValue.includes(item.id)
            // 检查子结点
            if (item.children) {
                node.children = this.createSaveTree(item.children, selectedValue)
            }

            if (node.selected || (node.children && node.children.length)) {
                node.selected = true
                result.push(node)
            }
        }
        return result
    }

    private renderAlert(resetType: 1 | 2) {
        const { target, loadingReset } = this.state
        const { id } = target
        return (
            <Alert
                style={{ marginBottom: 12 }}
                showIcon
                message={
                    <div className='ResetAlert'>
                        <span>默认继承部门/角色权限集合，可自定义个人权限</span>
                        <PermissionWrap funcCode='/setting/authorize/manage/reset'>
                            <Spin spinning={loadingReset}>
                                <a
                                    onClick={() => {
                                        this.setState({ loadingReset: true })
                                        resetUserPermission(id, resetType)
                                            .then((res) => {
                                                if (res.code === 200) {
                                                    message.success('操作成功')
                                                    this.requestTargetPermissionList()
                                                } else {
                                                    message.error(res.msg || '重置出错')
                                                }
                                            })
                                            .finally(() => {
                                                this.setState({ loadingReset: false })
                                            })
                                    }}
                                >
                                    <SyncOutlined style={{ marginRight: 5 }} />
                                    恢复继承权限
                                </a>
                            </Spin>
                        </PermissionWrap>
                    </div>
                }
                type='info'
            />
        )
    }

    private targetTabChangeHandler = async (value: string) => {
        // 如果是用户tab，先重置用户列表，再初始化目标用户
        if (value === USER) {
            const { target } = this.state
            target.type = USER
            this.forceUpdate()
            await this.setUserSearchKey('')
        }
        this.initTarget(value as any)
    }

    private initTarget(type: typeof DEPARTMENT | typeof ROLE | typeof USER, id?: string) {
        // 如果是部门，选中部门第一项
        // 如果菜单，选中菜单第一项
        const { target, departmentList, roleList, userList } = this.state
        target.type = type
        switch (target.type) {
            case DEPARTMENT:
                if (departmentList && departmentList.length) {
                    target.id = id || departmentList[0].id
                }
                break
            case ROLE:
                if (roleList && roleList.length) {
                    target.id = id || roleList[0].id
                }
                break
            case USER:
                if (userList && userList.length) {
                    target.id = id || userList[0].id
                }
                break
            default:
                target.id = ''
                break
        }
        if (target.id) {
            this.requestTargetPermissionList()
        }
        this.forceUpdate()
    }

    private authIsChanged(type: typeof FUN_PERMISSION | typeof SYSTEM_PERMISSION) {
        const { funcAuths, lastFuncAuths, systemAuths, lastSystemAuths } = this.state
        if (type === FUN_PERMISSION) {
            return !ProjectUtil.equalArray(funcAuths, lastFuncAuths, true)
        } else {
            return !ProjectUtil.equalArray(systemAuths, lastSystemAuths, true)
        }
    }

    render() {
        const { permissionDic, loadingSave, target, funcAuths, systemAuths } = this.state
        const { type } = target
        return (
            <SliderLayout
                className='PermissionIndex'
                disabledFold
                renderSliderBody={() => {
                    return (
                        <Tabs className='RightTabs' activeKey={type} onChange={this.targetTabChangeHandler} animated={false}>
                            {[
                                {
                                    label: '部门',
                                    key: DEPARTMENT,
                                    content: this.renderDepartmentList(),
                                },
                                {
                                    label: '角色',
                                    key: ROLE,
                                    content: this.renderRoleList(),
                                },
                                {
                                    label: '用户',
                                    key: USER,
                                    className: 'UserTab',
                                    content: this.renderUseList(),
                                },
                            ].map((item) => {
                                return (
                                    <Tabs.TabPane tab={item.label} key={item.key} className={item.className}>
                                        {item.content}
                                    </Tabs.TabPane>
                                )
                            })}
                        </Tabs>
                    )
                }}
                renderSliderHeader={() => {
                    return null
                }}
                renderContentHeader={() => {
                    return null
                }}
                renderContentBody={() => {
                    const show = target.type && target.id
                    const { authFrom, selectedAuthType, loadingRequest } = this.state
                    return show ? (
                        <div className='PermissionBody'>
                            <Tabs
                                className='PermissionTabs'
                                animated={false}
                                activeKey={selectedAuthType}
                                onChange={(key) => {
                                    this.setState({ selectedAuthType: key as any })
                                }}
                            >
                                {[
                                    {
                                        label: '功能权限',
                                        key: FUN_PERMISSION,
                                        content: (
                                            <React.Fragment>
                                                {target.type === USER && ![1, 3].includes(authFrom) ? this.renderAlert(1) : null}
                                                {this.renderPermissionList(permissionDic[FUN_PERMISSION], funcAuths, (value) => this.setState({ funcAuths: value }))}
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '系统权限',
                                        key: SYSTEM_PERMISSION,
                                        content: (
                                            <Spin spinning={loadingRequest}>
                                                {target.type === USER && ![2, 3].includes(authFrom) ? this.renderAlert(2) : null}
                                                <PermisstionTable
                                                    enableChecked
                                                    dataSource={permissionDic[SYSTEM_PERMISSION]}
                                                    checkedKeys={systemAuths}
                                                    onCheckChange={(value) => this.setState({ systemAuths: value })}
                                                />
                                            </Spin>
                                        ),
                                    },
                                ].map((item) => {
                                    return (
                                        <Tabs.TabPane tab={item.label} key={item.key}>
                                            {item.content}
                                        </Tabs.TabPane>
                                    )
                                })}
                            </Tabs>
                            {this.authIsChanged(selectedAuthType) && (
                                <footer>
                                    <PermissionWrap funcCode='/setting/authorize/manage/change'>
                                        <Button loading={loadingSave} type='primary' onClick={() => this.save()}>
                                            更新权限
                                        </Button>
                                    </PermissionWrap>
                                </footer>
                            )}
                        </div>
                    ) : (
                        <Empty style={{ marginTop: 30 }} description='请在左侧选择一项' />
                    )
                }}
            />
        )
    }
}

export default PermissionSetting
