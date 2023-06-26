import PermissionManage from '@/utils/PermissionManage'
import { Modal } from 'antd'
import React, { Component, ReactNode, ReactText } from 'react'

interface IBatchPermissionWrapState {}
interface IBatchPermissionWrapProps<T = any> {
    /**
     * 功能code
     */
    funcCode: string

    /**
     * 系统数据列表
     */
    systemRows: T[]

    /**
     * 系统id的属性名
     */
    rowId: string

    /**
     * 系统名称的属性名
     */
    rowLabel: string

    /**
     * 检查完权限，如果有可操作的数据，进行的回调函数
     */
    onSuccess: (rows: T[], keys: ReactText[]) => void

    children?: ReactNode
}

/**
 * 批量权限包裹器
 */
class BatchPermissionWrap<T = any> extends Component<IBatchPermissionWrapProps<T>, IBatchPermissionWrapState> {
    private getItemId(item: T) {
        const { rowId } = this.props
        return item[rowId]
    }

    private getItemLabel(item: T) {
        const { rowLabel } = this.props
        return item[rowLabel]
    }

    private duplicateRemoval(list: T[]): T[] {
        const result = []
        for (let item of list) {
            const key = this.getItemId(item)
            if (result.findIndex((item) => this.getItemId(item) === key) < 0) {
                result.push(item)
            }
        }
        return result
    }

    render() {
        const { children, funcCode, systemRows, onSuccess } = this.props

        if (!children) {
            return null
        }
        const hasFuncPermission = PermissionManage.hasFuncPermission(funcCode)
        if (!hasFuncPermission) {
            return null
        }
        return React.cloneElement(children as any, {
            onClickCapture: (event) => {
                const idList = systemRows.map((item) => this.getItemId(item))
                const result = PermissionManage.batchCheckHasPermission(funcCode, idList)
                const { hasFunc, systemList } = result
                // 如果完全无权限
                if (!hasFunc || systemList.length === 0) {
                    Modal.error({
                        title: '暂无功能权限',
                        content: '您的账号暂无权限操作，如有需要请联系管理员授权',
                    })
                    event.stopPropagation()
                    return
                }

                // 如果部分有权限
                if (systemList.length !== systemRows.length) {
                    const useRows = systemRows.filter((item) => systemList.includes(this.getItemId(item)))
                    const useIds = idList.filter((item) => systemList.includes(item))

                    const useLabel = this.duplicateRemoval(useRows)
                        .map((item) => this.getItemLabel(item))
                        .join('、')
                    const unuseLabel = this.duplicateRemoval(systemRows)
                        .filter((item) => !systemList.includes(this.getItemId(item)))
                        .map((item) => this.getItemLabel(item))
                        .join('、')
                    Modal.info({
                        title: '权限不完整',
                        content: (
                            <span>
                                您缺少：
                                <br />
                                <span style={{ color: '#cc0000' }}>{unuseLabel}</span>
                                <br />
                                的权限
                                <br />
                                <br />
                                将为您处理：
                                <br />
                                <span style={{ color: '#339933' }}>{useLabel}</span>
                            </span>
                        ),
                        onOk: () => {
                            onSuccess(useRows, useIds)
                        },
                    })
                    return
                }
                // 如果有全部权限
                onSuccess(systemRows, idList)
            },
        })
    }
}

export default BatchPermissionWrap
