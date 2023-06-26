import React, { Component } from 'react'
import { Input, Button, Radio, Form, Row, Col, message } from 'antd'
import { checkName } from 'app_api/dashboardApi'
import WarnPng from 'app_images/warn.png'
import store from './store'
import { observer } from 'mobx-react'
import { NotificationWrap } from 'app_common'
@observer
class Step1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    // 跳转到下一页
    goToNext = async () => {
        this.props.next()
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let params = {
                    name: values.name
                }
                if (!store.ifCreate) {
                    params.id = store.reportId
                }
                let res = await checkName(params)
                if (res.code === 200) {
                    if (res.data) {
                        message.warning('报表名称重复')
                    } else {
                        store.setTableInf(values.name, values.cycle, values.type)
                        this.props.next()
                    }
                } else {
                    NotificationWrap.error(res.data)
                }
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <div className='step1'>
                    <div className='stepContent'>
                        <Form.Item label='报表名称'>
                            {getFieldDecorator('name', {
                                initialValue: store.name || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写报表名称 ',
                                    },
                                ],
                            })(<Input maxLength={128} />)}
                        </Form.Item>
                        <Form.Item label='报表类型'>
                            {getFieldDecorator('type', {
                                initialValue: store.type || 0,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择类型',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value={0}>日期明细报表</Radio>
                                    <Radio value={1}>聚合报表</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label='报告周期'>
                            {getFieldDecorator('cycle', {
                                initialValue: store.cycle || 0,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择报告周期',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value={0}>每日</Radio>
                                    <Radio value={1}>每月</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>
                        <div className='staticContent' style={{ width: 'calc(83.3% + 80px)' }}>
                            静态内容占位
                        </div>
                    </div>
                    <div className='steps-action'>
                        <Button type='primary'
                            onClick={this.handleSubmit}
                        >
                            下一步
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }
}
const CustomizedForm = Form.create()(Step1)
export default CustomizedForm
