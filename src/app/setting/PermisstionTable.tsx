import IComponentProps from '@/base/interfaces/IComponentProps'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import { IPermission } from '@/interface/IPermission'
import { Checkbox, Table, Tooltip } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { ColumnProps } from 'antd/lib/table'
import React, { Component } from 'react'
import './PermisstionTable.less'

interface IPermisstionTableState {}
interface IPermisstionTableProps extends IComponentProps {
    dataSource: IPermission[]
    enableChecked?: boolean
    checkedKeys?: CheckboxValueType[]
    onCheckChange?: (value: CheckboxValueType[]) => void
    disabledLock?: boolean
}

interface ITableItem {
    title: string
    islock: boolean
    group: IPermission[]
}

/**
 * 权限表格
 * 请注意：只会显示前两层权限且第2层的结点数量必须一样，如果权限树不确定层级，请不要显示！
 */
class PermisstionTable extends Component<IPermisstionTableProps, IPermisstionTableState> {
    private createTableDataSource(): ITableItem[] {
        const { dataSource } = this.props
        if (!dataSource || !dataSource.length) {
            return []
        }

        const result: ReturnType<typeof this.createTableDataSource> = []
        for (let i = 0; i < dataSource.length; i++) {
            const { title, children, islock } = dataSource[i]
            result.push({
                title,
                islock: islock || false,
                group: children || [],
            })
        }

        return result
    }

    private selectColumn(index: number) {
        const { dataSource, checkedKeys = [] } = this.props

        // 循环dataSource,获取每一项的第index个子结点，即为index列的所有数据源
        const itemIdList = dataSource.map((item) => (item.children ? item.children[index].id : ''))
        let newKeys = checkedKeys.concat()
        itemIdList.forEach((item) => {
            newKeys.push(item)
        })

        newKeys = Array.from(new Set(newKeys))
        this.triggerCheckChange(newKeys)
    }

    /**
     * 获取指定列顶部checkbox的选中状态
     * @param index
     */
    private geColumnCheckSelectStatus(index: number): { checked: boolean; indeterminate: boolean } {
        const { checkedKeys } = this.props
        const idList = this.getColumnItemList(index).map((item) => item.id)
        const result = {
            checked: false,
            indeterminate: false,
        }
        if (checkedKeys) {
            const selectedIds = idList.filter((item) => checkedKeys.includes(item))
            const { length } = selectedIds
            result.checked = length > 0
            result.indeterminate = length > 0 && length < idList.length
        }

        return result
    }

    private unselectColumn(index: number) {
        const { checkedKeys = [] } = this.props
        // 循环dataSource,获取每一项的第index个子结点，即为index列的所有数据源
        const itemIdList = this.getColumnItemList(index).map((item) => item.id)
        let newKeys = checkedKeys.concat()
        newKeys = newKeys.filter((item) => !itemIdList.includes(item as string))

        this.triggerCheckChange(newKeys)
    }

    private triggerCheckChange(keys: CheckboxValueType[]) {
        const { onCheckChange } = this.props
        if (onCheckChange) {
            onCheckChange(keys)
        }
    }

    private getColumnItemList(columnIndex: number): IPermission[] {
        const { dataSource } = this.props
        return dataSource.map((item) => (item.children ? item.children[columnIndex] : undefined)).filter((item) => Boolean(item)) as IPermission[]
    }

    private createTableColumns(): ColumnProps<ITableItem>[] {
        const { dataSource, enableChecked, checkedKeys = [], disabledLock } = this.props
        // 取出第一个结点的子结点，并循环，做为列名
        if (!dataSource || !dataSource.length) {
            return []
        }
        const result: ReturnType<typeof this.createTableColumns> = []
        const children = dataSource[0].children
        if (!children) {
            return []
        }

        result.push({
            title: '应用名称',
            render: (_, record) => {
                const showLock = record.islock && !disabledLock
                return (
                    <span>
                        {record.title}
                        <Tooltip
                            title={
                                <div className='LockTip'>
                                    <div>锁定该权限，不跟随部门、角色变化</div>
                                </div>
                            }
                        >
                            <span style={{ marginLeft: 16, fontSize: 12 }}>{showLock ? <IconFont type='icon-suo' /> : ''}</span>
                        </Tooltip>
                    </span>
                )
            },
        })
        for (let i = 0; i < children.length; i++) {
            const { title } = children[i]
            const columnCheckStatus = this.geColumnCheckSelectStatus(i)
            result.push({
                title: enableChecked ? (
                    <Checkbox
                        checked={columnCheckStatus.checked}
                        indeterminate={columnCheckStatus.indeterminate}
                        onChange={(event) => {
                            const { checked } = event.target
                            if (checked) {
                                this.selectColumn(i)
                            } else {
                                this.unselectColumn(i)
                            }
                        }}
                    >
                        {title}
                    </Checkbox>
                ) : (
                    title
                ),
                render: (_, record) => {
                    const targetPermission = record.group[i]
                    if (enableChecked) {
                        const checked = checkedKeys.includes(targetPermission.id)
                        const newKeys = checkedKeys.concat()
                        return (
                            <Checkbox
                                checked={checked}
                                onChange={(event) => {
                                    const checked = event.target.checked
                                    if (checked) {
                                        newKeys.push(targetPermission.id)
                                    } else {
                                        newKeys.splice(newKeys.indexOf(targetPermission.id), 1)
                                    }
                                    this.triggerCheckChange(newKeys)
                                }}
                            />
                        )
                    } else {
                        const selected = targetPermission.selected
                        return selected ? <IconFont type='icon-gou1' /> : <EmptyLabel />
                    }
                },
            })
        }

        return result
    }
    render() {
        return (
            <Table
                className='PermisstionTable'
                columns={this.createTableColumns()}
                dataSource={this.createTableDataSource()}
                pagination={false}
            />
        )
    }
}

export default PermisstionTable
