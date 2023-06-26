import { Checkbox, Input, Form, message, Radio, Select } from 'antd'
import { baseconfig } from 'app_api/examinationApi'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select
const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}

export default class ValidateContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleParam: {
                ...this.props.ruleParam,
                dateFormat: 'yyyyMMdd'
            },
            ruleInfo: this.props.ruleInfo,
            dateColumnsList: [],
        }
    }
    componentWillMount = () => {
        this.baseconfigList()
    }
    baseconfigList = async () => {
        let res = await baseconfig({ group: 'qaDateFormat' })
        if (res.code == 200) {
            this.setState({
                dateColumnsList: res.data,
            })
        }
    }
    getRuleData = (ruleInfo, ruleParam) => {
        this.setState({
            ruleParam,
            ruleInfo,
        })
    }
    changeSelect = (name, e) => {
        let { ruleParam } = this.state
        if (name == 'containContents') {
            if (ruleParam.isContain == 1 && e.length > 1) {
                // message.info('只含时只能选择一个类型')
                // return
                e = [e[1]]
            }
            if (e.includes(4)) {
                ruleParam.hasSp = true
            } else {
                ruleParam.hasSp = false
            }
        }
        ruleParam[name] = e
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    handleInputChange = (name, e) => {
        let { ruleParam } = this.state
        ruleParam[name] = e.target.value
        if (name == 'isContain') {
            ruleParam.containContents = []
            ruleParam.hasSp = false
        }
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    render() {
        const { ruleParam, ruleInfo, dateColumnsList } = this.state
        const { pageType, required } = this.props

        const children = []
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
        }
        return (
            <div style={{ display: !ruleParam.content || ruleParam.content == 5 || ruleParam.content == 6 ? 'none' : 'block' }}>
                {ruleParam.content == 1 ? (
                    <div>
                        <FormItem required={required == true} label='内容规范' {...tailFormItemLayout}>
                            <Radio.Group disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.isContain} onChange={this.handleInputChange.bind(this, 'isContain')}>
                                <Radio value={1}>只含</Radio>
                                <Radio value={2}>不含</Radio>
                            </Radio.Group>
                        </FormItem>
                        <div className='stringArea'>
                            <Checkbox.Group disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.containContents} onChange={this.changeSelect.bind(this, 'containContents')}>
                                <Checkbox value={1}>数字</Checkbox>
                                <Checkbox value={2}>英文</Checkbox>
                                <Checkbox value={3}>中文</Checkbox>
                                <Checkbox value={4}>特殊字符</Checkbox>
                            </Checkbox.Group>
                            {ruleParam.isContain == 1 && ruleParam.hasSp ? (
                                <div className='specialChars' style={{ marginTop: 16 }}>
                                    <Select
                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                        allowClear
                                        className='tagsSelect'
                                        dropdownClassName='hideDropdown'
                                        mode='tags'
                                        tokenSeparators={[',', '，']}
                                        placeholder='请输入特殊字符，区分全角、半角，使用逗号分割'
                                        value={ruleParam.specialChars}
                                        onChange={this.changeSelect.bind(this, 'specialChars')}
                                    ></Select>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {ruleParam.content == 2 ? (
                    <div>
                        <FormItem
                            name='regexp'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入正则表达式!',
                                },
                            ]}
                            label='正则表达式'
                            {...tailFormItemLayout}
                        >
                            <TextArea disabled={pageType == 'edit'} style={{ paddingTop: 10 }} placeholder='请输入' rows={2} onChange={this.handleInputChange.bind(this, 'regexp')} />
                        </FormItem>
                    </div>
                ) : null}
                {ruleParam.content == 3 ? (
                    <div className='horizonCheckbox'>
                        <FormItem
                            name='idCards'
                            rules={[
                                {
                                    required: true,
                                    message: '请选择内容范围!',
                                },
                            ]}
                            label='内容范围'
                            {...tailFormItemLayout}
                        >
                            <Checkbox.Group disabled={pageType == 'edit'} value={ruleParam.idCards} onChange={this.changeSelect.bind(this, 'idCards')}>
                                <Checkbox value={1}>
                                    18位身份证<span className='checkboxTip'>（固定长度为18位，前17位为数字，最后一位为数字或字母X）</span>
                                </Checkbox>
                                <Checkbox value={2}>
                                    15位身份证<span className='checkboxTip'>（固定长度为15位，7-12位为六位年月日）</span>
                                </Checkbox>
                            </Checkbox.Group>
                        </FormItem>
                    </div>
                ) : null}
                {ruleParam.content == 4 ? (
                    <div className='horizonCheckbox'>
                        <FormItem label='内容规范' {...tailFormItemLayout}>
                            <Radio.Group disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.dateFormat} onChange={this.handleInputChange.bind(this, 'dateFormat')}>
                                {dateColumnsList.map((item) => {
                                    return <Radio value={item.code}>{item.code}</Radio>
                                })}
                            </Radio.Group>
                        </FormItem>
                    </div>
                ) : null}
            </div>
        )
    }
}
