import EntityApi from '@/api/EntityApi'
import ITopicField from '@/app/entity/interface/ITopicField'
import IconFont from '@/component/IconFont'
import RenderUtil from '@/utils/RenderUtil'
import { Form, FormInstance, Input, Modal, Switch } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
interface ITopicFieldEditProps {
    visible: boolean
    onClose: () => void
    onSuccess: () => void

    /**
     * 编辑的目标数据，没有表示新增
     */
    target?: ITopicField

    /**
     * 父结点
     */
    parentTarget?: ITopicField

    treeId: string
}

/**
 * 主题域编辑
 */
const TopicFieldEdit: React.FC<ITopicFieldEditProps> = (props) => {
    const { visible, onClose, onSuccess, target, parentTarget, treeId } = props

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const close = () => {
        onClose()
    }

    const reset = () => {
        if (formRef.current) {
            formRef.current.resetFields()
            formRef.current.setFieldsValue({ ...target } || {})
        }
        setLoading(false)
    }

    const save = () => {
        if (formRef.current) {
            formRef.current.validateFields().then((values) => {
                setLoading(true)

                let promise: Promise<any>

                if (isEdit && target) {
                    promise = EntityApi.updateTopic({
                        id: target.id,
                        parentId: target.parentId,
                        businessTag: target.businessTag,
                        treeId: target.treeId,
                        childNodeCount: target.childNodeCount,
                        securityLevel: target.securityLevel,
                        ...values,
                    })
                } else {
                    promise = EntityApi.addTopic({
                        ...values,
                        parentId: parentTarget ? parentTarget.id : '0',
                        businessTag: 2,
                        treeId: parentTarget ? parentTarget.treeId : treeId,
                        childNodeCount: 0,
                        securityLevel: parentTarget ? parentTarget.securityLevel : undefined,
                    })
                }
                promise
                    .then((res) => {
                        if (res.code === 200) {
                            onSuccess()
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
        }
    }

    const formRef = useRef<FormInstance<ITopicField>>(null)
    const isEdit = Boolean(target)
    const disabledChildSetting = parentTarget && parentTarget.level >= 2
    console.log('edit', target)

    return (
        <Modal maskClosable={false} title={`${isEdit ? '编辑' : '添加'}主题域`} open={visible} onCancel={close} onOk={save} confirmLoading={loading} cancelButtonProps={{ disabled: loading }}>
            {parentTarget && (
                <div style={{ marginBottom: 16 }}>
                    <IconFont type='icon-fenceng' style={{ verticalAlign: 'middle' }} /> 上级节点名称：{parentTarget.name}
                </div>
            )}
            <Form ref={formRef} layout='vertical' className='Grid1 EditMiniForm'>
                {RenderUtil.renderFormItems([
                    {
                        label: '中文名',
                        name: 'name',
                        content: <Input maxLength={32} showCount />,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        label: '英文名',
                        name: 'englishName',
                        content: <Input maxLength={32} showCount />,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        label: '英文简写',
                        name: 'code',
                        content: <Input maxLength={32} showCount disabled={isEdit} />,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        label: '描述',
                        name: 'description',
                        content: <Input.TextArea maxLength={128} showCount />,
                    },
                    {
                        label: '是否有子类',
                        name: 'hasChild',
                        hide: disabledChildSetting,
                        valuePropName: 'checked',
                        content: <Switch />,
                    },
                ])}
            </Form>
        </Modal>
    )
}
export default TopicFieldEdit
