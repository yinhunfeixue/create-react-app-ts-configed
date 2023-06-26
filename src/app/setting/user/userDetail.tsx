import { dataSecurityLevelList } from '@/api/dataSecurity'
import IComponentProps from '@/base/interfaces/IComponentProps'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import UserStatus from '@/enums/UserStatus'
import RenderUtil from '@/utils/RenderUtil'
import { Divider, Form } from 'antd'
import React, { Component } from 'react'
import InfoCard from '../permission/infoCard/index'
import styles from './userDetail.module.less'

interface IuserDetailState {
    securityList: any[]
}
interface IuserDetailProps extends IComponentProps {
    targetUser: any
    visible: boolean
    onClose: () => void
    addTab: Function
}

/**
 * userDetail
 */
class UserDetail extends Component<IuserDetailProps, IuserDetailState> {
    constructor(props: IuserDetailProps) {
        super(props)
        this.state = { securityList: [] }
    }

    componentDidMount() {
        dataSecurityLevelList().then((res) => {
            this.setState({ securityList: res.data || [] })
        })
    }

    render() {
        const { targetUser, visible, onClose } = this.props
        const { securityList } = this.state

        if (!targetUser) {
            return null
        }

        const enable = targetUser.status === 1
        const securityItem = securityList.find((item) => item.id === targetUser.securityLevel)
        return (
            <DrawerLayout
                drawerProps={{
                    title: '用户详情',
                    visible,
                    width: 640,
                    closable: true,
                    onClose,
                    className: styles.userDetail,
                }}
            >
                <InfoCard
                    record={{
                        cnName: targetUser.name,
                        icon: <StatusLabel syncTextColor style={{ fontSize: 14 }} type={enable ? 'success' : 'disabled'} message={UserStatus.toString(targetUser.status)} />,
                        remark: (
                            <span>
                                <span style={{ marginRight: 24 }}>
                                    角色：{targetUser.roleNames}({targetUser.account})
                                </span>
                                部门：{targetUser.deptNames || <EmptyLabel />}
                            </span>
                        ),
                    }}
                />
                <Divider />
                <Module title='基本信息'>
                    <Form className='HMiniForm' colon={false}>
                        {RenderUtil.renderFormItems(
                            [
                                { label: '帐号', content: targetUser.account },
                                { label: '姓名', content: targetUser.name },
                                { label: '邮箱', content: targetUser.email },
                                { label: '手机号', content: targetUser.phone },
                            ],
                            {
                                labelCol: { span: 5 },
                            }
                        )}
                    </Form>
                </Module>
                <Module title='工作信息'>
                    <Form className='HMiniForm' colon={false}>
                        {RenderUtil.renderFormItems(
                            [
                                { label: '工号', content: targetUser.jobNumber },
                                { label: '数据分级权限', content: securityItem ? securityItem.name : targetUser.securityLevel },
                                { label: '部门', content: targetUser.deptNames },
                                { label: '角色', content: targetUser.roleNames },
                            ],
                            {
                                labelCol: { span: 5 },
                            }
                        )}
                    </Form>
                </Module>
            </DrawerLayout>
        )
    }
}

export default UserDetail
