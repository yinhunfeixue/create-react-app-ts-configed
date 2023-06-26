import PermissionTree from '@/app/setting/PermissionTree'
import PermisstionTable from '@/app/setting/PermisstionTable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import { Empty, Tabs } from 'antd'
import React, { Component } from 'react'
import './PermissionDetail.less'

interface IPermissionDetailState {
    openKeys: { [key: string]: true }
}
interface IPermissionDetailProps extends IComponentProps {
    permissionData: { [key: string]: any[] }
    onOpenPermissionPage: () => void
}

/**
 * PermissionDetail
 */
class PermissionDetail extends Component<IPermissionDetailProps, IPermissionDetailState> {
    constructor(props: IPermissionDetailProps) {
        super(props)
        this.state = {
            openKeys: {},
        }
    }

    render() {
        const { permissionData = {}, onOpenPermissionPage } = this.props
        const { funcAuths, systemAuths } = permissionData

        return (
            <Tabs className='PermissionDetail' tabBarExtraContent={<a onClick={() => onOpenPermissionPage()}>权限配置</a>}>
                {[
                    {
                        label: '功能权限',
                        content: (
                            <React.Fragment>
                                <header className='Header HControlGroup'>
                                    <div style={{ color: '#262626' }}>权限信息</div>
                                </header>
                                <main>{funcAuths && funcAuths.length ? <PermissionTree disabledLock dataSource={funcAuths} /> : <Empty description='暂无功能权限' />}</main>
                            </React.Fragment>
                        ),
                    },
                    {
                        label: '系统权限',
                        content: <PermisstionTable dataSource={systemAuths} disabledLock />,
                    },
                ].map((item) => {
                    return (
                        <Tabs.TabPane tab={item.label} key={item.label}>
                            <div className='TabContent'>{item.content}</div>
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        )
    }
}

export default PermissionDetail
