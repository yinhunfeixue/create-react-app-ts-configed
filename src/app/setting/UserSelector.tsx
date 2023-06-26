import IComponentProps from '@/base/interfaces/IComponentProps'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import UserStatus from '@/enums/UserStatus'
import { Button, Input, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React, { Component } from 'react'

interface IUserSelectorState {
    loading: boolean
    searchKey?: string
}
interface IUserSelectorProps extends IComponentProps {
    visible: boolean
    onCancel: () => void
    onSuccess: (list: any[]) => Promise<boolean>

    searchFunction: (params: { page: number; pageSize: number; key?: string }) => Promise<any>
}

/**
 * UserSelector
 */
class UserSelector extends Component<IUserSelectorProps, IUserSelectorState> {
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
            title: '账号状态',
            render: (_, record) => {
                const label = UserStatus.toString(record.status)
                const status = record.status === UserStatus.ENABLED ? 'success' : 'warning'
                return <StatusLabel type={status} message={label} />
            },
        },
    ]
    constructor(props: IUserSelectorProps) {
        super(props)
        this.state = {
            loading: false,
            searchKey: '',
        }
    }

    private async save() {
        const { onSuccess } = this.props
        const { selectedKeys } = this.controller
        if (!selectedKeys || !selectedKeys.length) {
            message.warn('至少选择一个用户')
            return
        }
        this.setState({ loading: true })
        onSuccess(selectedKeys)
            .then(() => {})
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    private requestUserList = async (page: number, pageSize: number) => {
        const { searchKey } = this.state
        const { searchFunction } = this.props
        const res = await searchFunction({
            page,
            pageSize,
            key: searchKey,
        })
        if (res.code !== 200) {
            return
        }
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    render() {
        const { onCancel, visible } = this.props
        const { loading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '选择用户',
                    visible,
                    onClose: onCancel,
                    width: 640,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} type='primary' onClick={() => this.save()}>
                                确认
                            </Button>
                            <Button disabled={loading} onClick={() => onCancel()}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                <RichTableLayout
                    smallLayout
                    disabledDefaultFooter
                    showFooterControl={false}
                    tableProps={{
                        selectedEnable: true,
                        columns: this.columns,
                        showQuickJumper: false,
                        extraTableProps: { scroll: undefined },
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <Input.Search
                                placeholder='请输入帐号/姓名'
                                style={{ width: '100%' }}
                                onSearch={(value) => {
                                    this.setState({ searchKey: value }, () => controller.reset())
                                }}
                            />
                        )
                    }}
                    requestListFunction={async (page, pageSize) => {
                        return this.requestUserList(page, pageSize)
                    }}
                    editColumnProps={{
                        hidden: true,
                    }}
                />
            </DrawerLayout>
        )
    }
}

export default UserSelector
