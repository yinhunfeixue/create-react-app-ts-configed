import React, { Component } from 'react'
import { Modal, Select, message, Input, Button, Divider, InputNumber, Radio, Checkbox, Timeline } from 'antd'
import { Form } from '@ant-design/compatible'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RuleForm from '../ruleForm/index'
import { PlusOutlined } from '@ant-design/icons'
import SelectSystem from '../selectSystem/index'
import { saveConfig } from 'app_api/standardApi'
import './index.less'

const InputGroup = Input.Group

/**
 * 添加关联关系
 */

class AddAssessmentSystem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
    }

    close = () => {
        this.setState({ visible: false })
    }

    openModal = () => {
        this.setState({ visible: true })
    }

    postData = async () => {
        const data = await this.props.form.validateFields()
        let standardAssessConfigVoList = await this.ruleFormRef.postData()
        this.setState({ saveLoding: true })
        const res = await saveConfig({ systemId: data.systemId, standardAssessConfigVoList })
        this.setState({ saveLoding: false })
        if (res.code === 200) {
            this.close()
            this.props.refresh()
            return message.success('添加成功')
        }
    }

    render() {
        const { visible, saveLoding } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form
        return (
            <React.Fragment>
                <DrawerLayout
                    onCancel={() => this.close()}
                    drawerProps={{
                        className: 'addAssessmentSystem',
                        title: '添加评估系统',
                        width: 482,
                        visible,
                        onClose: this.close,
                        maskClosable: false,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button onClick={this.postData} disabled={saveLoding} key='submit' type='primary'>
                                    确定
                                </Button>
                                <Button key='back' onClick={this.close}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <Timeline>
                        <Timeline.Item dot={<span className='dot_icon'>1</span>}>
                            <Form.Item label={<span style={{ fontWeight: 500 }}>选择系统</span>}>
                                {getFieldDecorator('systemId', {
                                    initialValue: null,
                                    rules: [
                                        {
                                            required: true,
                                            message: `请选择系统`,
                                        },
                                    ],
                                })(<SelectSystem />)}
                            </Form.Item>
                        </Timeline.Item>
                        <Timeline.Item dot={<span className='dot_icon'>2</span>}>
                            <RuleForm wrappedComponentRef={(ref) => (this.ruleFormRef = ref)} />
                        </Timeline.Item>
                    </Timeline>
                </DrawerLayout>
            </React.Fragment>
        )
    }
}

export default Form.create()(AddAssessmentSystem)
