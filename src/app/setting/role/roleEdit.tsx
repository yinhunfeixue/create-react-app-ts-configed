import { requestAddRole, requestEditRole } from '@/api/systemApi'
import IComponentProps from '@/base/interfaces/IComponentProps'
import RenderUtil from '@/utils/RenderUtil'
import { Form, FormInstance, Input, Modal } from 'antd'
import React, { Component } from 'react'

interface IRoleEditState {
    loading: boolean
}
interface IRoleEditProps extends IComponentProps {
    targetData?: any
    visible: boolean
    onCancel: () => void
    onSuccess: () => void
}

/**
 * roleEdit
 */
class roleEdit extends Component<IRoleEditProps, IRoleEditState> {
    private form!: FormInstance
    constructor(props: IRoleEditProps) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    private async save() {
        const { onSuccess, targetData } = this.props
        this.form.validateFields().then(async (values) => {
            this.setState({ loading: true })
            let res
            if (targetData) {
                res = await requestEditRole(targetData.id, values)
            } else {
                res = await requestAddRole(values)
            }
            this.setState({ loading: false })
            if (res.code === 200) {
                onSuccess()
            }
        })
    }

    render(): any {
        const { targetData, visible, onCancel } = this.props
        const { loading } = this.state
        const title = targetData ? '编辑角色' : '新增角色'
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={() => onCancel()}
                onOk={() => this.save()}
                okButtonProps={{
                    loading,
                }}
                cancelButtonProps={{
                    disabled: loading,
                }}
                // renderFooter={() => {
                //     return (
                //         <React.Fragment>
                //             <Button loading={loading} type='primary' onClick={() => this.save()}>
                //                 确认
                //             </Button>
                //             <Button disabled={loading} onClick={() => onCancel()}>
                //                 取消
                //             </Button>
                //         </React.Fragment>
                //     )
                // }}
            >
                <Form
                    ref={(target) => {
                        if (target) {
                            this.form = target
                        }
                    }}
                    className='EditMiniForm Grid1'
                    initialValues={{
                        roleName: targetData ? targetData.roleName : '',
                        remark: targetData ? targetData.remark : '',
                    }}
                >
                    {RenderUtil.renderFormItems([
                        {
                            label: '角色名称',
                            name: 'roleName',
                            rules: [
                                {
                                    required: true,
                                    message: '*',
                                },
                            ],
                            content: <Input />,
                        },
                        {
                            label: '描述',
                            name: 'remark',
                            content: <Input.TextArea />,
                        },
                    ])}
                </Form>
            </Modal>
        )
    }
}

export default roleEdit
