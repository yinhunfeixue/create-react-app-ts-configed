import { addDataWarehouseTree } from '@/api/dataSecurity'
import EntityApi from '@/api/EntityApi'
import ITopicField from '@/app/entity/interface/ITopicField'
import IModalProps from '@/interface/IModalProps'
import RenderUtil from '@/utils/RenderUtil'
import { Form, FormInstance, Modal, Select } from 'antd'
import { Select as LocalSelect } from 'cps'
import React, { Key, useEffect, useRef, useState } from 'react'
interface ITopicFieldMappingProps extends IModalProps {
    target?: ITopicField
    parentSystem?: any
}

interface IFormData {
    relationDstTreeNodeId: Key
    businessDepartmentId: Key
    businessManagerId: Key
}

/**
 * 主题域映射
 */
const TopicFieldMapping: React.FC<ITopicFieldMappingProps> = (props) => {
    const { open, onCancel, target, onSuccess, parentSystem } = props

    const [topicTree, setTopicTree] = useState([])
    const [departmentId, setDepartmentId] = useState<Key>('')
    const [loading, setLoading] = useState(false)

    const formRef = useRef<FormInstance<IFormData>>(null)
    const isEdit = Boolean(target)

    const reset = () => {
        if (formRef.current) {
            formRef.current.resetFields()
            formRef.current.setFieldsValue(target ? { relationDstTreeNodeId: target.id, businessDepartmentId: target.businessDepartmentId, businessManagerId: target.businessManagerId } : {})
        }
        if (target && target.businessDepartmentId) {
            setDepartmentId(target.businessDepartmentId)
        }
        EntityApi.requestTopicTree().then((res) => {
            const { data = {} } = res
            setTopicTree(data.children)
        })
    }

    useEffect(() => {
        if (open) {
            reset()
        }
    }, [open])

    const save = () => {
        if (formRef.current) {
            formRef.current.validateFields().then((values) => {
                let promise: Promise<any>
                if (isEdit) {
                    promise = EntityApi.relatedBusiness({
                        ...values,
                        treeNodeId: target ? target.id : '',
                    })
                } else {
                    const data = {
                        ...values,
                        treeId: parentSystem.treeId,
                        parentId: parentSystem.id,
                    }
                    promise = addDataWarehouseTree(data)
                }

                setLoading(true)
                promise
                    .then((res) => {
                        if (res.code === 200 && onSuccess) {
                            onSuccess()
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
        }
    }

    return (
        <Modal maskClosable={false} open={open} onCancel={onCancel} title='映射主题' onOk={() => save()} confirmLoading={loading} cancelButtonProps={{ disabled: loading }}>
            <Form ref={formRef} layout='vertical' className='Grid1 EditMiniForm'>
                {RenderUtil.renderFormItems([
                    {
                        label: '主题选择',
                        name: 'relationDstTreeNodeId',
                        content: <Select options={topicTree} fieldNames={{ label: 'name', value: 'id' }} placeholder='主题域' />,
                        hide: isEdit,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        label: '主题的业务归属部门',
                        name: 'businessDepartmentId',
                        content: <LocalSelect.DepartTreeSelect placeholder='请选择' onChange={(value) => setDepartmentId(value)} />,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        label: '主题的业务负责人',
                        name: 'businessManagerId',
                        content: <LocalSelect.UserSelect departId={departmentId as string} placeholder='请选择' />,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                ])}
            </Form>
        </Modal>
    )
}
export default TopicFieldMapping
