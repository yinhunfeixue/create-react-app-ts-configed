import React, { Component } from 'react'
import { Modal, Select, message, Input, Button, Divider, InputNumber, Radio, DatePicker, Alert } from 'antd'
import { Form } from '@ant-design/compatible'
import { queryDefaultBizRule, queryCheckRuleByStandardId, queryUdcCode } from 'app_api/standardApi'
import './index.less'
import { operatorList, rangOperatorList } from './enumTypes'
import moment from 'moment'
const InputGroup = Input.Group
const dateFormat = 'YYYY-MM-DD'
import AutoTip from '@/component/AutoTip'

/**
 * 添加关联关系
 */

class AddRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            ruleTypeList: [],
            ruleList: [],
            editRule: {},
            entityId: null,
            entityDesc: null,
            udcList: [],
        }
    }

    editRule = (rule) => {
        if (rule.ruleTypeId === 'JHFL42' && rule.type === 3) {
            const { value, minValue, maxValue } = rule
            rule.value = value ? moment(value, dateFormat) : null
            rule.minValue = minValue ? moment(minValue, dateFormat) : null
            rule.maxValue = maxValue ? moment(maxValue, dateFormat) : null
        }
        this.setState({ visible: true, editRule: rule }, () => {
            this.props.form.setFieldsValue(rule)
            setTimeout(() => {
                this.props.form.setFieldsValue(rule)
                if (rule.ruleTypeId === 'JHFL42' && rule.type === 3 && rule.operator === '区间') {
                    this.props.form.setFieldsValue(rule)
                }
            }, 0)
        })
    }

    close = () => {
        this.setState({ visible: false })
    }

    componentDidMount = () => {
        this.getRuleTypeList()
        this.queryCheckRuleByStandardId()
        this.queryUdcCode()
    }

    queryUdcCode = async () => {
        const res = await queryUdcCode({ standardId: this.props.standardId })
        if (res.code == 200) {
            const { entityId, entityDesc, itemList } = res.data
            this.setState({
                entityId,
                entityDesc,
                udcList: itemList,
            })
        }
    }

    queryCheckRuleByStandardId = async () => {
        const res = await queryCheckRuleByStandardId({ standardId: this.props.standardId })
        if (res.code == 200) {
            this.setState(
                {
                    ruleList: this.responeFilter(res.data),
                },
                () => {
                    const { onChange } = this.props
                    onChange && onChange(res.data)
                }
            )
        }
    }

    postData = () => {
        this.props.form.validateFields().then((values) => {
            const { ruleList, editRule } = this.state
            values.name = this.getName(values)
            values.bizRuleId = this.getValueFromTypeList(values.ruleTypeId, 'id')

            const _index = ruleList.findIndex((rule) => rule.ruleTypeId === editRule.ruleTypeId)
            if (_index > -1) {
                message.success('修改成功')
                ruleList.splice(_index, 1, values)
            } else {
                message.success('新增成功')
                ruleList.push(values)
            }
            this.setState(
                {
                    ruleList,
                    visible: false,
                },
                () => {
                    const { onChange } = this.props
                    onChange && onChange(this.requestFilter(this.state.ruleList))
                }
            )
        })
    }

    requestFilter = (arr) => {
        const req = []
        arr.forEach((data) => {
            let obj = {
                id: data.id,
                bizRuleId: data.bizRuleId,
                ruleTypeId: data.ruleTypeId,
                name: data.name,
                ruleParam: { ...data, standardId: this.props.standardId },
            }
            if (data.ruleTypeId === 'JHFL40') {
                obj.ruleParam.content = 2
            }
            if (data.ruleTypeId === 'JHFL39') {
                debugger
                obj.ruleParam.values = this.state.udcList
            }
            if (data.ruleTypeId === 'JHFL42' && data.type === 3) {
                const { value, minValue, maxValue } = data
                obj.ruleParam.value = value ? moment(value).format(dateFormat) : null
                obj.ruleParam.minValue = minValue ? moment(minValue).format(dateFormat) : null
                obj.ruleParam.maxValue = maxValue ? moment(maxValue).format(dateFormat) : null
            }
            req.push(obj)
        })
        return req
    }

    responeFilter = (arr) => {
        const req = []
        arr.forEach((data) => {
            const param = JSON.parse(data.ruleParam)
            let obj = {
                id: data.id,
                bizRuleId: data.bizRuleId,
                ruleTypeId: data.ruleTypeId,
                name: data.name,
                ...param,
            }

            req.push(obj)
        })
        return req
    }

    deleteRule = (index) => {
        const { ruleList } = this.state
        ruleList.splice(index, 1)
        this.setState({ ruleList }, () => {
            const { onChange } = this.props
            onChange(this.requestFilter(this.state.ruleList))
        })
    }

    getRuleTypeList = async () => {
        let res = await queryDefaultBizRule()
        if (res.code == 200) {
            this.setState({
                ruleTypeList: res.data,
            })
        }
    }

    getName = (rule) => {
        const { ruleTypeId, operator, value, values, minOperator, maxOperator, minValue, maxValue, type, regexp } = rule
        const ruleName = this.state.ruleTypeList.find((item) => ruleTypeId === item.ruleTypeId).ruleName
        let desc = ''
        switch (ruleTypeId) {
            case 'JHFL41':
                if (operator === '区间') {
                    desc = `(${minValue} ${minOperator} 字段长度 ${maxOperator} ${maxValue})`
                } else {
                    desc = `(字段长度 ${operatorList.find((item) => item.value === operator).name} ${value})`
                }
                break
            case 'JHFL42':
                if (type === 1) {
                    if (operator === '区间') {
                        desc = `(${minValue} ${minOperator} 字段取值范围 ${maxOperator} ${maxValue})`
                    } else {
                        desc = `( 字段取值范围 ${operatorList.find((item) => item.value === operator).name} ${value})`
                    }
                } else if (type === 2) {
                    desc = ` (字段 ${operator} ${values.toString().replace(',', '、 ')})`
                } else if (type === 3) {
                    if (operator === '区间') {
                        desc = ` (${moment(minValue).format(dateFormat)} ${minOperator} 字段取值范围 ${maxOperator} ${moment(maxValue).format(dateFormat)})`
                    } else {
                        desc = ` ( 字段取值范围 ${operatorList.find((item) => item.value === operator).name} ${moment(value).format(dateFormat)})`
                    }
                }
                break

            case 'JHFL40':
                desc = `字段内容格式满足 ${regexp} 的要求`
                break
            case 'JHFL39':
                const { entityDesc, entityId } = this.state
                desc = `代码值域取值校验（字段取值与 ${entityDesc}（${entityId}）一致）`
                break
            default:
                break
        }
        return `${ruleName} ${desc}`
    }

    getValueFromTypeList = (ruleTypeId, key) => {
        return this.state.ruleTypeList.find((item) => ruleTypeId === item.ruleTypeId)[key]
    }

    getDescByTypeID = () => {
        const { getFieldValue } = this.props.form
        const typeValue = getFieldValue('type') === 1 ? '数值' : getFieldValue('type') === 2 ? '字符' : '日期'
        const ruleTypeDesc = {
            JHFL43: '标准映射的字段需要满足非空性要求，否则将无法通过核检和被判定为落标失败。',
            JHFL38: '标准映射的字段需要满足唯一性要求，否则将无法通过核检和被判定为落标失败。',
            JHFL41: '标准映射的字段需要满足设定的长度要求，否则将无法通过核检和被判定为落标失败。',
            JHFL42: `标准映射的字段需要满足设定的${typeValue}要求，否则将无法通过核检和被判定为落标失败。`,
            JHFL39: '标准映射的字段需要满足非空性要求，否则将无法通过核检和被判定为落标失败。标准映射的字段需要满足所引用代码的组织要求，否则将无法通过核检和被判定为落标失败。',
            JHFL40: '1. 标准映射的字段需要满足设定的格式要求，否则将无法通过核检和被判定为落标失败。<br />2. 当前仅支持使用正则表达式对格式内容进行校验',
        }

        return ruleTypeDesc[getFieldValue('ruleTypeId')]
    }

    render() {
        const { visible, ruleList, ruleTypeList, editRule, entityId } = this.state
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
        const { readOnly } = this.props
        const contentRule = getFieldValue('ruleTypeId') === 'JHFL40'
        const longRule = getFieldValue('ruleTypeId') === 'JHFL41'
        const rangRule = getFieldValue('ruleTypeId') === 'JHFL42'
        const codeRule = getFieldValue('ruleTypeId') === 'JHFL39'

        return (
            <React.Fragment>
                <div className='standardEdit_ruleList'>
                    {ruleTypeList.length > 0 &&
                        // entityId &&
                        ruleList.map((rule, index) => {
                            return (
                                <div className='ruleItem'>
                                    <span className='serial'>{index + 1}</span>
                                    <AutoTip className='desc' content={this.getName(rule)} />
                                    {!readOnly && (
                                        <span className='edit'>
                                            <a onClick={this.editRule.bind(null, rule)}>编辑</a>
                                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                                            <a onClick={this.deleteRule.bind(null, index)}>删除</a>
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    {!readOnly && (
                        <a onClick={this.editRule.bind(null, { ruleTypeId: null })} className='add_btn'>
                            + 添加校验规则
                        </a>
                    )}
                    <Modal
                        width={520}
                        visible={visible}
                        className='addRuleModal'
                        title='设置关联关系'
                        footer={[
                            <Button key='back' onClick={this.close}>
                                取消
                            </Button>,
                            <Button onClick={this.postData} disabled={codeRule && !entityId} key='submit' type='primary'>
                                确定
                            </Button>,
                        ]}
                        onCancel={() => this.close()}
                    >
                        <Form className='EditMiniForm ruleForm' layout='vertical'>
                            <Form.Item label='规则校验'>
                                {getFieldDecorator('ruleTypeId', {
                                    initialValue: null,
                                    rules: [
                                        {
                                            required: true,
                                            message: `请选择校验规则`,
                                        },
                                    ],
                                })(
                                    <Select placeholder='请选择'>
                                        {ruleTypeList
                                            .filter((obj) => {
                                                return ruleList.findIndex((rule) => obj.ruleTypeId === rule.ruleTypeId) < 0 || obj.ruleTypeId === editRule.ruleTypeId
                                            })
                                            .map((item) => {
                                                return (
                                                    <Option
                                                        disabled={ruleList.findIndex((rule) => item.ruleTypeId === rule.ruleTypeId) > -1 && item.ruleTypeId !== editRule.ruleTypeId}
                                                        value={item.ruleTypeId}
                                                        key={item.ruleTypeId}
                                                    >
                                                        {item.ruleName}
                                                    </Option>
                                                )
                                            })}
                                    </Select>
                                )}
                                <div className='ruletype_desc' dangerouslySetInnerHTML={{ __html: this.getDescByTypeID() }}></div>
                            </Form.Item>

                            {rangRule && (
                                <Form.Item label='类型'>
                                    {getFieldDecorator('type', {
                                        initialValue: 1,
                                        rules: [
                                            {
                                                required: true,
                                                message: `请选择`,
                                            },
                                        ],
                                    })(
                                        <Radio.Group onChange={(e) => setFieldsValue({ operator: e.target.value === 2 ? '包含' : null })}>
                                            <Radio value={1}>数值</Radio>
                                            <Radio value={2}>字符</Radio>
                                            <Radio value={3}>日期</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            )}
                            {getFieldValue('type') === 2 && (
                                <Form.Item label='取值范围'>
                                    <InputGroup compact>
                                        <Form.Item>
                                            {getFieldDecorator('operator', {
                                                initialValue: '包含',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: `请输入数值`,
                                                    },
                                                ],
                                            })(
                                                <Select style={{ width: '200px' }} className='addonSelect'>
                                                    <Option value={'包含'}>包含</Option>
                                                    <Option value={'不包含'}>不包含</Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            {getFieldDecorator('values', {
                                                initialValue: [],
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: `输入取值范围，使用逗号分割`,
                                                    },
                                                ],
                                            })(
                                                <Select
                                                    allowClear
                                                    className='tagsSelect'
                                                    dropdownClassName='hideDropdown'
                                                    mode='tags'
                                                    tokenSeparators={[',', '，']}
                                                    placeholder='输入取值范围，使用逗号分割'
                                                    style={{ width: '260px' }}
                                                ></Select>
                                            )}
                                        </Form.Item>
                                    </InputGroup>
                                </Form.Item>
                            )}
                            {(longRule || (rangRule && getFieldValue('type') === 1)) && (
                                <InputGroup compact>
                                    <Form.Item label={`${longRule ? '长度' : '数值'}要求`}>
                                        {getFieldDecorator('operator', {
                                            initialValue: null,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `请选择`,
                                                },
                                            ],
                                        })(
                                            <Select style={{ width: 200 }} placeholder='请选择'>
                                                {operatorList.map((item) => {
                                                    return (
                                                        <Option value={item.value} key={item.value}>
                                                            {item.value}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item style={{ width: 260, margin: '30px 0 0 8px' }}>
                                        {getFieldValue('operator') !== '区间' &&
                                            getFieldDecorator('value', {
                                                initialValue: null,
                                                rules: [
                                                    {
                                                        validator: (_, value, callback) => {
                                                            if (longRule && String(value).indexOf('.') > -1) {
                                                                callback('请输入整数')
                                                            }
                                                            if (longRule && value < 0) {
                                                                callback('请输入正整数')
                                                            }
                                                            if (!value && value !== 0) {
                                                                callback('请输入数值(整数)')
                                                            } else {
                                                                callback()
                                                            }
                                                        },
                                                    },
                                                ],
                                            })(<InputNumber style={{ width: '100%' }} placeholder='请输入数值(整数)1' />)}
                                    </Form.Item>
                                </InputGroup>
                            )}
                            {(longRule || (rangRule && getFieldValue('type') === 1)) && getFieldValue('operator') === '区间' && (
                                <InputGroup compact>
                                    <Form.Item>
                                        <InputGroup style={{ width: 200 }} compact>
                                            {getFieldDecorator('minValue', {
                                                initialValue: null,
                                                rules: [
                                                    {
                                                        validator: (_, value, callback) => {
                                                            if (longRule && String(value).indexOf('.') > -1) {
                                                                callback('请输入整数')
                                                            }
                                                            if (longRule && value < 0) {
                                                                callback('请输入正整数')
                                                            }
                                                            if (value === null) callback(new Error('请输入数值'))
                                                            if (getFieldValue('maxValue') !== null && value > getFieldValue('maxValue')) {
                                                                callback(new Error('不能大于最大值'))
                                                            } else {
                                                                callback()
                                                            }
                                                        },
                                                    },
                                                ],
                                            })(<InputNumber placeholder='请输入数值' style={{ width: 120 }} />)}
                                            {getFieldDecorator('minOperator', {
                                                initialValue: rangOperatorList[1].value,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: `请选择`,
                                                    },
                                                ],
                                            })(
                                                <Select style={{ width: 80 }} placeholder='请选择'>
                                                    {rangOperatorList.map((item) => {
                                                        return (
                                                            <Option value={item.value} key={item.value}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            )}
                                        </InputGroup>
                                    </Form.Item>
                                    <span style={{ display: 'inline-block', margin: '4px 8px', color: '#606366' }}>{rangRule && getFieldValue('type') === 1 ? '数值' : '字段'}长度</span>
                                    <Form.Item>
                                        <InputGroup style={{ width: 200 }} compact>
                                            <Form.Item>
                                                {getFieldDecorator('maxOperator', {
                                                    initialValue: rangOperatorList[0].value,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: `请选择`,
                                                        },
                                                    ],
                                                })(
                                                    <Select style={{ width: 80 }} placeholder='请选择'>
                                                        {rangOperatorList.map((item) => {
                                                            return (
                                                                <Option value={item.value} key={item.value}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('maxValue', {
                                                    initialValue: null,
                                                    rules: [
                                                        {
                                                            validator: (_, value, callback) => {
                                                                if (longRule && String(value).indexOf('.') > -1) {
                                                                    callback('请输入整数')
                                                                }
                                                                if (longRule && value < 0) {
                                                                    callback('请输入正整数')
                                                                }
                                                                if (value === null) callback(new Error('请输入数值'))
                                                                if (getFieldValue('minValue') !== null && value <= getFieldValue('minValue')) {
                                                                    callback(new Error('不能小于最小值'))
                                                                } else {
                                                                    callback()
                                                                }
                                                            },
                                                        },
                                                    ],
                                                })(<InputNumber placeholder='请输入数值' style={{ width: 120 }} />)}
                                            </Form.Item>
                                        </InputGroup>
                                    </Form.Item>
                                </InputGroup>
                            )}
                            {rangRule && getFieldValue('type') === 3 && (
                                <Form.Item label='日期要求'>
                                    <InputGroup compact>
                                        <Form.Item>
                                            {getFieldDecorator('operator', {
                                                initialValue: null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: `请选择`,
                                                    },
                                                ],
                                            })(
                                                <Select style={{ width: 200 }} placeholder='请选择'>
                                                    {operatorList.map((item) => {
                                                        return (
                                                            <Option value={item.value} key={item.value}>
                                                                {item.value}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                        <Form.Item style={{ width: 260, marginLeft: '8px' }}>
                                            {getFieldValue('operator') !== '区间' &&
                                                getFieldDecorator('value', {
                                                    initialValue: null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: `请选择`,
                                                            validator: (_, value, callback) => {
                                                                if (!value) {
                                                                    callback('请选择')
                                                                } else {
                                                                    callback()
                                                                }
                                                            },
                                                        },
                                                    ],
                                                })(<DatePicker style={{ width: '100%' }} format={dateFormat} />)}
                                        </Form.Item>
                                    </InputGroup>
                                    {getFieldValue('operator') === '区间' && (
                                        <InputGroup compact>
                                            <Form.Item>
                                                <InputGroup style={{ width: 200 }} compact>
                                                    {getFieldDecorator('minValue', {
                                                        initialValue: null,
                                                        rules: [
                                                            {
                                                                validator: (_, value, callback) => {
                                                                    if (value === null) callback(new Error('请选择日期'))
                                                                    if (getFieldValue('maxValue') !== null && moment(value).diff(getFieldValue('maxValue'), 'days') > 0) {
                                                                        callback(new Error('不能大于最大日期'))
                                                                    } else {
                                                                        callback()
                                                                    }
                                                                },
                                                            },
                                                        ],
                                                    })(<DatePicker style={{ width: 140 }} format={dateFormat} />)}
                                                    {getFieldDecorator('minOperator', {
                                                        initialValue: rangOperatorList[1].value,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: `请选择`,
                                                            },
                                                        ],
                                                    })(
                                                        <Select style={{ width: 60 }} placeholder='请选择'>
                                                            {rangOperatorList.map((item) => {
                                                                return (
                                                                    <Option value={item.value} key={item.value}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    )}
                                                </InputGroup>
                                            </Form.Item>
                                            <span style={{ display: 'inline-block', margin: '4px 8px', color: '#606366' }}>日期范围</span>
                                            <Form.Item>
                                                <InputGroup style={{ width: 200 }} compact>
                                                    <Form.Item>
                                                        {getFieldDecorator('maxOperator', {
                                                            initialValue: rangOperatorList[0].value,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: `请选择`,
                                                                },
                                                            ],
                                                        })(
                                                            <Select style={{ width: 60 }} placeholder='请选择'>
                                                                {rangOperatorList.map((item) => {
                                                                    return (
                                                                        <Option value={item.value} key={item.value}>
                                                                            {item.name}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        )}
                                                    </Form.Item>
                                                    <Form.Item>
                                                        {getFieldDecorator('maxValue', {
                                                            initialValue: null,
                                                            rules: [
                                                                {
                                                                    validator: (_, value, callback) => {
                                                                        if (value === null) callback(new Error('请选择日期'))
                                                                        if (getFieldValue('maxValue') !== null && moment(value).diff(getFieldValue('minValue'), 'days') <= 0) {
                                                                            callback(new Error('不能小于最小日期'))
                                                                        } else {
                                                                            callback()
                                                                        }
                                                                    },
                                                                },
                                                            ],
                                                        })(<DatePicker style={{ width: 140 }} format={dateFormat} />)}
                                                    </Form.Item>
                                                </InputGroup>
                                            </Form.Item>
                                        </InputGroup>
                                    )}
                                </Form.Item>
                            )}

                            {contentRule && (
                                <Form.Item label='正则表达式'>
                                    {getFieldDecorator('regexp', {
                                        initialValue: null,
                                        rules: [
                                            {
                                                required: true,
                                                message: `请输入正则表达式`,
                                            },
                                        ],
                                    })(<Input.TextArea />)}
                                </Form.Item>
                            )}
                            {codeRule && (
                                <Form.Item>
                                    {entityId ? (
                                        <React.Fragment>
                                            <div style={{ color: '#606366' }}>引用代码</div>
                                            <div style={{ color: '#2D3033' }}>标准代码名称 {entityId}</div>
                                        </React.Fragment>
                                    ) : (
                                        <Alert type='warning' message='当前标准没有引用代码，需要先添加引用代码才可使用该规则。' banner />
                                    )}
                                </Form.Item>
                            )}
                        </Form>
                    </Modal>
                </div>
            </React.Fragment>
        )
    }
}

export default Form.create()(AddRule)
