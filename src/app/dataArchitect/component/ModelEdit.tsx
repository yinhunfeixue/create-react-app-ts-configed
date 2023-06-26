import DataArchitectApi from '@/api/DataArchitectApi'
import IModel from '@/app/dataArchitect/interface/IModel'
import RenderUtil from '@/utils/RenderUtil'
import { Form, FormInstance, Input, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
interface IModelEditProps {
    visible: boolean
    target: IModel
    onClose: () => void
    onSuccess: () => void
}
/**
 * ModelEdit
 */
const ModelEdit: React.FC<IModelEditProps> = (props) => {
    const { visible, target, onClose, onSuccess } = props
    const [loading, setLoading] = useState(false)

    const reset = () => {
        if (formRef.current) {
            formRef.current.resetFields()
        }
    }

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const close = () => {
        onClose()
    }

    const ok = () => {
        if (formRef.current) {
            formRef.current.validateFields().then((values) => {
                setLoading(true)
                DataArchitectApi.editModel(target.modelId, values)
                    .then((res) => {
                        if (res.code === 200) {
                            close()
                            onSuccess()
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
        }
    }

    const formRef = useRef<FormInstance<any>>(null)

    return (
        <Modal title='模型编辑' width={480} visible={visible} onCancel={() => close()} onOk={() => ok()} okButtonProps={{ loading }} cancelButtonProps={{ disabled: loading }}>
            <Form ref={formRef} layout='horizontal' className='EditMiniForm Grid1' initialValues={target}>
                {RenderUtil.renderFormItems([
                    {
                        label: '模型中文名',
                        name: 'modelChineseName',
                        rules: [
                            {
                                required: true,
                                message: '请输入',
                            },
                        ],
                        content: <Input maxLength={64} showCount />,
                    },
                    {
                        label: '模型英文名',
                        name: 'modelEnglishName',
                        rules: [
                            {
                                required: true,
                                message: '请输入',
                            },
                        ],
                        content: <Input maxLength={128} showCount />,
                    },
                ])}
            </Form>
        </Modal>
    )
}
export default ModelEdit
