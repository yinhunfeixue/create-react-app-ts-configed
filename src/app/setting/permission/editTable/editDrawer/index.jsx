import DrawerLayout from '@/component/layout/DrawerLayout'

import { Tabs } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import DeptTable from './deptTable/index'
import styles from './index.module.less'
import RoleTable from './roleTable/index'
import UserTable from './userTable/index'

export default class EditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resourceData: {},
            dataSourceList: [],
            visible: false,
            currentRecord: {},
        }
    }

    cancel = () => {
        this.setState({ visible: false })
    }

    openModal = (currentRecord) => {
        this.setState({ visible: true, currentRecord })
    }

    reFresh = () => {
        this.props.getAllAuth()
        this.cancel()
    }

    render() {
        const { visible, currentRecord } = this.state
        const { allList } = this.props
        return (
            <DrawerLayout
                drawerProps={{
                    className: classNames('editDrawer', styles.index),
                    title: `授权管理（${currentRecord.name}）`,
                    width: 640,
                    visible,
                    onClose: this.cancel,
                }}
                renderFooter={null}
            >
                {/* 加一个滚动元素，防止内容滚动时，表头上方也有内容 https://www.tapd.cn/58470660/bugtrace/bugs/view/1158470660001012264 */}
                <div className='commonScroll' style={{ height: '100%', overflow: 'auto' }}>
                    {allList !== {} && (
                        <Tabs animated={false}>
                            <Tabs.TabPane tab='按部门' key={1}>
                                <DeptTable
                                    hideEdit={this.props.hideEdit}
                                    resourceData={this.props.resourceData}
                                    reFresh={this.reFresh}
                                    currentRecord={currentRecord}
                                    dataSourceList={allList.resourceDeptAuths}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='按角色' key={2}>
                                <RoleTable
                                    hideEdit={this.props.hideEdit}
                                    resourceData={this.props.resourceData}
                                    reFresh={this.reFresh}
                                    currentRecord={currentRecord}
                                    dataSourceList={allList.resourceRoleAuths}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='按用户' key={3}>
                                <UserTable
                                    hideEdit={this.props.hideEdit}
                                    resourceData={this.props.resourceData}
                                    reFresh={this.reFresh}
                                    currentRecord={currentRecord}
                                    dataSourceList={allList.resourceUserAuths}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    )}
                </div>
            </DrawerLayout>
        )
    }
}
