import { IPermission } from '@/interface/IPermission'
import TreeControl from '@/utils/TreeControl'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'

/**
 * 权限管理
 */
class PermissionManage {
    /**
     * 用户权限
     */
    static funcAuths: IPermission[] = []

    /**
     * 系统权限
     */
    static systemAuths: IPermission[] = []

    static funcCache: Map<string, boolean> = new Map()

    /**
     * 判断是否拥有权限。
     * 目前的逻辑是 “优先通过”，即除非明确设置了不通过，否则都认为通过。目的是，防止出现用户需要用，但是因为权限配置原因出现用不了的情况。
     *
     * @description 我们的dmp是多个系统的管理者，一个形象的示例："dmp系统" 用于管理 京东、淘宝、拼多多的商品、店铺等数据
     * 因此，对于一个按钮，权限有两层<br/>
     * 1. 用户是否有dmp某个按钮权限。 例如：小王 是否有 编辑商品信息 的权限<br/>
     * 2. 用户是否有 某个系统的权限，例如：小王  是否有 管理京东的权限<br/>
     * 只有小王 有 “编辑商品信息”的权限 且有 “京东”的权限，小王点击 “京东这条数据上的编辑”才有用<br/>
     *
     * @param target  要判断的目标对象
     * {
     *  funcCode    //  功能模块code，例如 数据源管理的code=/sys/manage
     *  systemCode  //  目标系统的code，通常是id
     * }
     */
    static hasPermission(target: { funcCode: string; systemCode?: string }): boolean {
        const { funcCode, systemCode } = target

        // 检查功能权限，如果无功能权限数据，返回false
        if (!this.hasFuncPermission(funcCode)) {
            Modal.error({
                title: '暂无功能权限',
                content: '您的账号暂无权限操作，如有需要请联系管理员授权',
                icon: <ExclamationCircleFilled />,
            })
            return false
        }
        // 检查系统权限
        const funcItem = this.getFuncItem(funcCode)
        if (!this.hasSystemPermission(systemCode, funcItem)) {
            Modal.error({
                title: '暂无系统权限',
                content: '您的账号暂无权限操作，如有需要请联系管理员授权',
                icon: <ExclamationCircleFilled />,
            })
            return false
        }

        return true
    }

    /**
     * 对于一个功能，同时判断多个系统是否具有权限; 并返回有权限的系统id列表
     * @param funcCode 功能code
     * @param systemCodeList 系统code列表
     * @returns
     */
    static batchCheckHasPermission(
        funcCode: string,
        systemCodeList: string[]
    ): {
        hasFunc: boolean
        systemList: string[]
    } {
        // 默认返回有全部权限
        const result = {
            hasFunc: true,
            systemList: systemCodeList.concat(),
        }
        // 如果无功能权限，直接返回
        if (!this.hasFuncPermission(funcCode)) {
            result.hasFunc = false
            result.systemList = []
            return result
        } else {
            // 如果存在功能权限配置，进行对比检查
            const funcItem = this.getFuncItem(funcCode)
            if (funcItem) {
                const systemList: string[] = []
                for (let item of systemCodeList) {
                    if (this.hasSystemPermission(item, funcItem)) {
                        systemList.push(item)
                    }
                }
                result.systemList = systemList
            }
        }
        return result
    }

    private static getFuncItem(funcCode?: string) {
        const { funcAuths } = this
        if (!funcCode || !funcAuths) {
            return null
        }
        const treeControl = new TreeControl<IPermission>()
        return treeControl.search(funcAuths, (item: IPermission) => item.code === funcCode)
    }

    private static getSystemItem(systemCode?: string, funcItem?: IPermission | null) {
        if (!systemCode || !funcItem || !funcItem.rwType) {
            return null
        }

        const { rwType } = funcItem
        const rwTypeDic = {
            1: 'view',
            2: 'edit',
        }
        const { systemAuths } = this
        if (!rwType) {
            return null
        }
        const rwTypeToString = rwTypeDic[rwType]
        if (!rwTypeToString) {
            return null
        }

        const treeControl = new TreeControl<IPermission>()
        return treeControl.search(systemAuths, (item: IPermission) => item.code === `${systemCode}/${rwTypeToString}`)
    }

    static hasSystemPermission(systemCode?: string, funcItem?: IPermission | null) {
        const systemItem = this.getSystemItem(systemCode, funcItem)
        if (systemItem && !systemItem.selected) {
            return false
        }
        return true
    }

    static hasFuncPermission(funcCode?: string) {
        const funcItem: IPermission | null = this.getFuncItem(funcCode)
        if (funcItem) {
            return Boolean(funcItem.selected)
        }
        return true
    }
}
export default PermissionManage
