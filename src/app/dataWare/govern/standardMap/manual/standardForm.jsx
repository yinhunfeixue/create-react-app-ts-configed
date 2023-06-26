import { Button, Input, message } from 'antd'
import { postStandardCodeValue } from 'app_api/standardApi'
import { WrappedRegistrationForm } from 'app_component'
import React, { Component } from 'react'

const { TextArea } = Input

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 5,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 19,
        },
    },
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
}

export default class StandardForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            notice: '',
        }

        this.fromItemList = [
            {
                lable: '标准代码项',
                decorator: 'standardId',
                rules: [
                    {
                        required: true,
                        message: '请填标准代码项！',
                        whitespace: true,
                    },
                ],
                controll: <Input type='text' placeholder='请填写标准代码项' disabled />,
            },
            {
                lable: '标准代码项名称',
                decorator: 'standardName',
                rules: [
                    {
                        required: true,
                        message: '请填写标准代码项名称!',
                    },
                ],
                controll: <Input placeholder='请填写密码标准代码项名称' disabled />,
            },
            {
                lable: '标准代码值',
                decorator: 'value',
                rules: [
                    {
                        required: true,
                        message: '请填写标准代码值!',
                    },
                ],
                controll: <Input placeholder='请填写标准代码值' />,
            },
            {
                lable: '标准代码值名称',
                decorator: 'name',
                rules: [
                    {
                        required: true,
                        message: '请填写标准代码值名称!',
                    },
                ],
                controll: <Input placeholder='请填写标准代码值名称' />,
            },
            {
                lable: '标准代码值描述',
                decorator: 'comment',
                rules: [
                    {
                        required: true,
                        message: '请填写标准代码值描述!',
                    },
                ],
                controll: <TextArea autosize rows={4} placeholder='请填写标准代码值描述' />,
            },
            {
                lable: '',
                decorator: 'standard',
                controll: <Input type='hidden' />,
            },
        ]

        this.tailFormItem = (
            <div>
                <Button type='primary' htmlType='submit'>
                    保存
                </Button>
                <Button
                    style={{ marginLeft: '20px' }}
                    onClick={() => {
                        this.props.hideModal()
                    }}
                >
                    取消
                </Button>
            </div>
        )
    }

    componentDidMount() {
        console.log(this.props, 'componentDidMount ----- Form')
    }

    handleSubmit = (err, values) => {
        console.log(!err)
        console.log('填写的: ', values)

        this.setState(
            {
                notice: '',
            },
            () => {
                if (!err) {
                    let req = values
                    if (this.props.modalType === 'edit') {
                        req.id = this.props.editItemId
                    }
                    postStandardCodeValue(req).then((res) => {
                        if (res.code == '200') {
                            message.success(res.msg ? res.msg : 'success')
                            this.props.hideModal()
                            this.props.getTableData()
                        } else {
                            message.error(res.msg ? res.msg : '请求列表失败')
                        }
                    })
                }
            }
        )
    }

    setFieldsValue = (param) => {
        this.formRef.setFieldsValue(param)
    }

    //注意这里的wrappedComponentRef
    render() {
        return (
            <div>
                <WrappedRegistrationForm
                    formItemLayout={formItemLayout}
                    setFieldsValue={this.setFieldsValue}
                    tailFormItemLayout={tailFormItemLayout}
                    handleSubmit={this.handleSubmit}
                    fromItemList={this.fromItemList}
                    tailFormItem={this.tailFormItem}
                    wrappedComponentRef={(inst) => (this.formRef = inst)}
                    notice={this.state.notice}
                />
            </div>
        )
    }
}
