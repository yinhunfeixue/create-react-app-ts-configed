import IComponentProps from '@/base/interfaces/IComponentProps'
import PermissionManage from '@/utils/PermissionManage'
import React, { Component } from 'react'

interface IPermissionWrapState {
    hasFuncPermission: boolean
}
interface IPermissionWrapProps extends IComponentProps {
    /**
     * 功能权限
     */
    funcCode?: string
    /**
     * 系统权限，如果和系统无关，可不填
     */
    systemCode?: string
}

/**
 * PermissionWrap
 */
class PermissionWrap extends Component<IPermissionWrapProps, IPermissionWrapState> {
    constructor(props: IPermissionWrapProps) {
        super(props)
        this.state = {
            hasFuncPermission: true,
        }
    }
    componentDidMount() {
        const { funcCode } = this.props
        const hasFuncPermission = PermissionManage.hasFuncPermission(funcCode)
        this.setState({ hasFuncPermission })
    }
    render() {
        const { children, funcCode, systemCode, onClick } = this.props
        const { hasFuncPermission } = this.state
        if (!hasFuncPermission) {
            return null
        }
        if (children) {
            return React.cloneElement(children as any, {
                onClickCapture: (event) => {
                    if (
                        funcCode &&
                        !PermissionManage.hasPermission({
                            funcCode,
                            systemCode,
                        })
                    ) {
                        event.stopPropagation()
                        event.preventDefault()
                        return
                    }

                    if (onClick) {
                        onClick(event)
                    }
                },
            })
        }
        return null
    }
}

export default PermissionWrap
