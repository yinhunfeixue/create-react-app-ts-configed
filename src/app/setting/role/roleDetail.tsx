import { requestRolePermissionList } from '@/api/systemApi'
import PermissionDetail from '@/app/setting/PermissionDetail'
import IComponentProps from '@/base/interfaces/IComponentProps'
import DrawerLayout from '@/component/layout/DrawerLayout'
import PageUtil from '@/utils/PageUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Form, message } from 'antd'
import React, { Component } from 'react'


interface IRoleDetailState {
    permissionList: any
}
interface IRoleDetailProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    targetData: any
    addTab: Function
}

/**
 * RoleDetail
 */
class RoleDetail extends Component<IRoleDetailProps, IRoleDetailState> {
    constructor(props: IRoleDetailProps) {
        super(props)
        this.state = { permissionList: {} }
    }
    componentDidMount() {
        const { targetData } = this.props

        if (targetData) {
            requestRolePermissionList(targetData.id).then((res) => {
                if (res.code === 200) {
                    this.setState({ permissionList: res.data })
                } else {
                    message.error(res.msg || '获取权限错误')
                }
            })
        }
    }

    render() {
        const { visible, onClose, targetData } = this.props
        const { permissionList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '角色详情',
                    visible,
                    width: 640,
                    onClose,
                }}
            >
                <Form className='MiniForm DetailPart' layout='inline'>
                    <h3>基本信息</h3>
                    {RenderUtil.renderFormItems([
                        { label: '名称', content: targetData.roleName },
                        { label: '备注', content: targetData.remark },
                    ])}
                </Form>
                <PermissionDetail
                    permissionData={permissionList}
                    onOpenPermissionPage={() =>
                        PageUtil.openPermissionIndex({
                            type: 'role',
                            id: targetData.id,
                        })
                    }
                />
            </DrawerLayout>
        )
    }
}

export default RoleDetail
