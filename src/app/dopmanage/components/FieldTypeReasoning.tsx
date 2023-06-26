import DOPService from '@/api/DOPService'
import IComponentProps from '@/base/interfaces/IComponentProps'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message } from 'antd'
import React, { Component } from 'react'

interface IFieldTypeReasoningState {
    loading: boolean
}
interface IFieldTypeReasoningProps extends IComponentProps {}

/**
 * 字段类型推理
 */
class FieldTypeReasoning extends Component<IFieldTypeReasoningProps, IFieldTypeReasoningState> {
    constructor(props: IFieldTypeReasoningProps) {
        super(props)
        this.state = {
            loading: false,
        }
    }
    componentDidMount() {
        DOPService.requestSyncTypeList()
    }
    render() {
        const { loading } = this.state
        return (
            <Form
                layout='vertical'
                onFinish={(values) => {
                    this.setState({ loading: true })
                    DOPService.fieldTypeReasoning(values.id)
                        .then((msg) => {
                            message.success(msg)
                        })
                        .finally(() => {
                            this.setState({ loading: false })
                        })
                }}
            >
                {RenderUtil.renderFormItems([
                    {
                        label: '请输入字段ID，逗号分隔',
                        content: <Input />,
                        name: 'id',
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    },
                    {
                        content: (
                            <Button type='primary' loading={loading} htmlType='submit'>
                                开始推理
                            </Button>
                        ),
                    },
                ])}
            </Form>
        )
    }
}

export default FieldTypeReasoning
