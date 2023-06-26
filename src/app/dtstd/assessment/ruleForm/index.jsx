import { Form } from '@ant-design/compatible'
import { Checkbox, Input, InputNumber, Radio } from 'antd'
import React, { Component } from 'react'
import './index.less'

const InputGroup = Input.Group

/**
 * 添加关联关系
 */

class RuleForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            submited: false,
        }
    }

    postData = async () => {
        await this.setState({ submited: true })
        return new Promise((resolve, reject) => {
            this.props.form.validateFields().then((values) => {
                const standardAssessConfigVoList = []
                const list = ['chineseNameSame', 'englishNameSame', 'typeSame', 'satisfyCheckRule']
                list.forEach((key) => {
                    let obj = {
                        ...values,
                        inspectionStandardType: key,
                        isDelete: values.ruleTypeId.indexOf(key) < 0,
                    }
                    obj.id = this.setId(key)
                    if (key === 'englishNameSame') {
                        obj.subType = values.subType1
                    } else if (key === 'satisfyCheckRule') {
                        if (values.subType2 !== 2) {
                            obj.sampleNum = null
                        }
                        obj.subType = values.subType2
                    } else {
                        obj.subType = 0
                    }

                    standardAssessConfigVoList.push(obj)
                })
                resolve(standardAssessConfigVoList)
            })
        })
    }

    setId = (key) => {
        const { configData } = this.props
        if (!configData) return
        return configData.find((config) => config.inspectionStandardType === key).id
    }
    componentDidMount = () => {
        const { configData } = this.props
        if (!configData) return
        const { setFieldsValue } = this.props.form
        const initData = { ruleTypeId: [] }
        configData.forEach((config) => {
            if (!config.isDelete) {
                initData.ruleTypeId.push(config.inspectionStandardType)
            }
            if (config.inspectionStandardType === 'englishNameSame') {
                initData.subType1 = config.subType
            } else if (config.inspectionStandardType === 'satisfyCheckRule') {
                initData.subType2 = config.subType
                initData.sampleNum = config.sampleNum
            }
        })
        setFieldsValue && setFieldsValue(initData)
        setTimeout(() => {
            setFieldsValue && setFieldsValue(initData)
        }, 0)
        if (initData.subType2 === 2) {
            setTimeout(() => {
                setFieldsValue && setFieldsValue(initData)
            }, 0)
        }
    }
    render() {
        const { submited } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form
        const showError = getFieldValue('subType2') === 2 && getFieldValue('sampleNum') < 1000

        const ruleTypeIdValue = getFieldValue('ruleTypeId')

        const checkedEnglisheNameSame = ruleTypeIdValue && ruleTypeIdValue.indexOf('englishNameSame') > -1
        const checkedSatisfyCheckRule = ruleTypeIdValue && ruleTypeIdValue.indexOf('satisfyCheckRule') > -1
        return (
            <Form className='EditMiniForm valutareConfigForm' layout='vertical'>
                <Form.Item
                    label={
                        <span style={{ fontWeight: 500 }}>
                            落标检核标准<span className='require_icon'>*</span>
                        </span>
                    }
                >
                    {getFieldDecorator('ruleTypeId', {
                        initialValue: [],
                        rules: [
                            {
                                required: true,
                                message: `至少选择一项`,
                            },
                        ],
                    })(
                        <Checkbox.Group>
                            <Checkbox value='chineseNameSame'>字段中文名与标准中文名一致</Checkbox>
                            <Checkbox value='englishNameSame'>
                                字段英文名与标准英文名一致
                                <span style={{ display: checkedEnglisheNameSame ? 'block' : 'none' }}>
                                    {getFieldDecorator('subType1', {
                                        initialValue: null,
                                        rules: [
                                            {
                                                required: getFieldValue('ruleTypeId').indexOf('englishNameSame') > -1,
                                                message: `请选择校验规则`,
                                            },
                                        ],
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>大小写不敏感</Radio>
                                            <Radio value={2}>大小写敏感</Radio>
                                        </Radio.Group>
                                    )}
                                    {checkedEnglisheNameSame && !getFieldValue('subType1') && submited && (
                                        <span style={{ color: '#ff4d4f', marginTop: 2, display: 'inline-block' }}>请选择校验规则</span>
                                    )}
                                </span>
                            </Checkbox>
                            <Checkbox value='typeSame'>字段类型与标准约束的字段类型保持一致</Checkbox>
                            <Checkbox value='satisfyCheckRule'>
                                需要满足标准中所定义的质量约束
                                <span style={{ display: checkedSatisfyCheckRule ? 'block' : 'none' }}>
                                    {getFieldDecorator('subType2', {
                                        initialValue: null,
                                        rules: [
                                            {
                                                required: checkedSatisfyCheckRule,
                                                message: `请选择校验规则`,
                                            },
                                        ],
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>全量检验</Radio>
                                            <Radio value={2}>
                                                抽样检验
                                                {getFieldValue('subType2') === 2 && (
                                                    <span>
                                                        {getFieldDecorator('sampleNum', {
                                                            initialValue: 1000,
                                                            rules: [
                                                                {
                                                                    message: `请输入数值`,
                                                                    required: false,
                                                                },
                                                            ],
                                                        })(<InputNumber max={10000} style={{ width: '160px', marginLeft: 12, borderColor: showError ? '#ff4d4f' : '' }} />)}
                                                        {showError && (
                                                            <span style={{ color: '#ff4d4f', marginTop: 2, display: 'inline-block', marginLeft: '68px' }}>请输入大于等于1000小于10000的数值</span>
                                                        )}
                                                    </span>
                                                )}
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                    {checkedSatisfyCheckRule > -1 && !getFieldValue('subType2') && submited && (
                                        <span style={{ color: '#ff4d4f', marginTop: 2, display: 'inline-block' }}>请选择校验规则</span>
                                    )}
                                </span>
                            </Checkbox>
                        </Checkbox.Group>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(RuleForm)
