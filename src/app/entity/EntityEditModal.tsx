import EntityApi from '@/api/EntityApi'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import IEntity from '@/app/dataArchitect/interface/IEntity'
import RenderUtil from '@/utils/RenderUtil'
import TreeControl from '@/utils/TreeControl'
import { Cascader, Form, FormInstance, Input, Modal, Radio } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
interface IEntityEditModalProps {
    visible: boolean
    onCancel: () => void
    onOk: () => void
    target?: IEntity
}
/**
 * EntityEditModal
 */
const EntityEditModal: React.FC<IEntityEditModalProps> = (props) => {
    const { visible, onCancel, onOk, target } = props
    const [loading, setLoading] = useState(false)

    const [topicTree, setTopicTree] = useState([])

    const form = useRef<FormInstance<any>>(null)
    const isEdit = Boolean(target)

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const reset = () => {
        EntityApi.requestTopicTree().then((res) => {
            const { data = {} } = res
            const topicTree = data.children
            setTopicTree(topicTree)

            if (form.current) {
                const initData: any = { ...target }
                if (target) {
                    // 如果是编辑，则获取主题的选中的值
                    const chain = new TreeControl().searchChain(topicTree, (node) => node.id === target.topicId)
                    if (chain) {
                        initData.topicId = chain.map((item) => item.id)
                    }
                }
                form.current.resetFields()
                form.current.setFieldsValue(initData)
            }
        })
    }

    const requestSave = async () => {
        if (form.current) {
            form.current.validateFields().then(async (value) => {
                setLoading(true)
                const { topicId } = value
                const requestTopicId = topicId[topicId.length - 1] || ''
                const promise = isEdit
                    ? EntityApi.editEntity({
                          ...value,
                          entityId: target ? target.entityId : '',
                          type: undefined,
                          topicId: requestTopicId,
                      })
                    : EntityApi.addEntity({ ...value, topicId: requestTopicId })
                promise
                    .then((res) => {
                        if (res.code === 200) {
                            reset()
                            onOk()
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
        }
    }

    return (
        <Modal
            open={visible}
            title={`${target ? '编辑' : '新增'}实体`}
            onCancel={() => {
                reset()
                onCancel()
            }}
            onOk={() => requestSave()}
            okButtonProps={{ loading }}
            cancelButtonProps={{ disabled: loading }}
        >
            <Form ref={form} className='EditForm' layout='vertical'>
                {RenderUtil.renderFormItems([
                    {
                        label: '实体名称',
                        name: 'entityName',
                        rules: [{ required: true, message: '请输入' }],
                        content: <Input showCount maxLength={8} />,
                    },
                    {
                        label: '实体类型',
                        rules: [{ required: !isEdit, message: '请选择' }],
                        name: 'type',
                        content: (
                            <Radio.Group
                                disabled={isEdit}
                                options={EntityType.ALL.map((item) => {
                                    return {
                                        value: item,
                                        label: EntityType.toString(item),
                                    }
                                })}
                            />
                        ),
                    },
                    {
                        label: '所属主题域',
                        rules: [{ required: true, message: '请选择' }],
                        name: 'topicId',
                        content: <Cascader options={topicTree} fieldNames={{ label: 'name', value: 'id' }} />,
                    },
                    {
                        label: '描述',
                        name: 'desc',
                        content: <Input.TextArea showCount maxLength={32} />,
                    },
                ])}
            </Form>
        </Modal>
    )
}
export default EntityEditModal
