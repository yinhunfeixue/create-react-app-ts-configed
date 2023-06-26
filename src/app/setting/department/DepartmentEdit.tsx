import { requestAddDepartment, requestDepartmentDetail, requestEditDepartment } from '@/api/systemApi'
import IComponentProps from '@/base/interfaces/IComponentProps'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Form, FormInstance, Input, Modal } from 'antd'
import React, { Component } from 'react'

interface IDepartmentEditState {
    loading: boolean
}
interface IDepartmentEditProps extends IComponentProps {
    visible: boolean
    onCancel: () => void
    onSuccess: () => void
    targetData: any
    parentDepartment?: any
}

/**
 * DepartmentEdit
 */
class DepartmentEdit extends Component<IDepartmentEditProps, IDepartmentEditState> {
    private form!: FormInstance
    constructor(props: IDepartmentEditProps) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    private save() {
        const { onSuccess, targetData, parentDepartment } = this.props
        const { form } = this
        const { validateFields } = form
        validateFields().then(async (value) => {
            this.setState({ loading: true })
            let res
            if (targetData) {
                res = await requestEditDepartment(targetData.id, value)
            } else {
                res = await requestAddDepartment({
                    parentId: parentDepartment ? parentDepartment.id : undefined,
                    ...value,
                })
            }
            this.setState({ loading: false })
            if (res.code === 200) {
                onSuccess()
            }
        })
    }

    componentDidMount() {
        const { targetData } = this.props
        const { form } = this
        if (targetData) {
            requestDepartmentDetail(targetData.id).then((res) => {
                form.setFieldsValue(res.data)
            })
        }
    }

    render() {
        const { targetData, onCancel, visible, parentDepartment } = this.props
        const { loading } = this.state
        const title = targetData ? '编辑部门' : '新建部门'
        const isEdit = Boolean(targetData)
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={onCancel}
                onOk={() => this.save()}
                okButtonProps={{
                    loading,
                }}
                cancelButtonProps={{
                    disabled: loading,
                }}
            >
                {parentDepartment ? <Alert style={{ marginBottom: 16 }} showIcon message={`上级部门：${parentDepartment.title}`} /> : null}
                <Form
                    className='EditMiniForm Grid1'
                    ref={(target) => {
                        if (target) {
                            this.form = target
                        }
                    }}
                >
                    {RenderUtil.renderFormItems([
                        {
                            label: '部门名称',
                            name: 'deptName',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入名称',
                                },
                                {
                                    max: 16,
                                    min: 2,
                                    message: '长度2-16',
                                },
                            ],
                            content: <Input placeholder='请输入，长度2-16' />,
                        },
                        {
                            name: 'deptId',
                            label: <TipLabel tip='可填写你组织内已有的部门ID，该部门ID作为部门的唯一标识，不填则由系统自动生成，填写后无法修改。' label='部门ID' />,
                            content: <Input disabled={isEdit} placeholder='请输入' />,
                        },
                        {
                            label: '描述',
                            name: 'remark',
                            rules: [
                                {
                                    max: 128,
                                    min: 1,
                                    message: '长度1-128',
                                },
                            ],
                            content: <Input.TextArea placeholder='请输入，长度1-128' />,
                        },
                    ])}
                </Form>
            </Modal>
        )
    }
}

export default DepartmentEdit
