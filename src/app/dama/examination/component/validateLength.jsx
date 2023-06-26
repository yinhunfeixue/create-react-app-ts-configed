import { Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from 'antd'
import moment from 'moment'
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

const operatorList = ['区间', '等于', '等于(多值)', '不等于', '大于', '大于等于', '小于', '小于等于']

class ValidateLength extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleParam: {
                ...this.props.ruleParam,
                type: 1
            },
            ruleInfo: this.props.ruleInfo,
            minValueMsg: '',
            maxValueMsg: '',
        }
    }
    componentWillMount = () => {
    }
    getRuleData = (ruleInfo, ruleParam) => {
        this.setState({
            ruleParam,
            ruleInfo,
            minValueMsg: '',
        })
    }
    handleInputChange = async (name, e) => {
        let { ruleParam } = this.state
        if (name == 'minValue' || name == 'maxValue' || name == 'value') {
            // ruleParam[name] = e.target.value ?(Number(e.target.value) || ruleParam[name]):undefined
            ruleParam[name] = e
            console.log(ruleParam[name], 'ruleParam[name]')
        } else if (name == 'type') {
            ruleParam.type = e.target.value
            if (e.target.value == 2) {
                ruleParam.operator = '包含'
                this.props.setFieldsValue({ operator: '包含' })
            } else {
                ruleParam.operator = undefined
                this.props.setFieldsValue({ operator: undefined })
            }
            ruleParam.minValue = undefined
            ruleParam.maxValue = undefined
        } else {
            ruleParam[name] = e.target.value
        }
        await this.setState({
            ruleParam,
        })
        this.lengthChange()
        this.props.getNewRuleParam(ruleParam)
    }
    changeNewTagInput = (e, node) => {
        let { ruleParam } = this.state
        ruleParam.values = e
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    changeDate = async (name, e) => {
        let { ruleParam } = this.state
        ruleParam[name] = e ? moment(e).format('YYYY-MM-DD') : undefined
        await this.setState({
            ruleParam,
        })
        this.lengthChange()
        this.props.getNewRuleParam(ruleParam)
    }
    changeSelect = (name, e) => {
        let { ruleParam } = this.state
        this.lengthChange()
        ruleParam[name] = e
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    lengthChange = () => {
        let { ruleParam, minValueMsg } = this.state
        if (ruleParam.minValue !== undefined && ruleParam.maxValue !== undefined && (ruleParam.minValue > ruleParam.maxValue || ruleParam.minValue == ruleParam.maxValue)) {
            ruleParam.minValueMsg = ruleParam.type == 3 ? '下限需要早于上限' : '下限需要小于上限'
            this.setState({
                minValueMsg: ruleParam.type == 3 ? '下限需要早于上限' : '下限需要小于上限',
            })
            this.props.getNewRuleParam(ruleParam)
        } else {
            ruleParam.minValueMsg = ''
            this.setState({
                minValueMsg: '',
            })
            this.props.getNewRuleParam(ruleParam)
        }
    }
    render() {
        const { ruleParam, ruleInfo, minValueMsg, maxValueMsg } = this.state
        const { pageType, required } = this.props

        const children = []
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
        }

        const renderOperator = () => {
            if (!ruleParam.operator) {
                return null
            }
            switch (ruleParam.operator) {
                case '区间':
                    return null
                case '等于(多值)':
                    return (
                    <Select
                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                        allowClear
                        className='tagsSelect'
                        dropdownClassName='hideDropdown'
                        mode='tags'
                        tokenSeparators={[',', '，']}
                        placeholder='请输入多个值，使用逗号分割'
                        value={ruleParam.values}
                        onChange={this.changeNewTagInput}
                        style={{ width: '100%' }}
                    ></Select>
                    )
                default:
                    return (
                        <FormItem
                            name='value'
                            rules={[
                                {
                                    required: ruleParam.hasParam == 2 ? false : true,
                                    message: '请输入数值!',
                                },
                            ]}
                            label=''
                            {...tailFormItemLayout}
                        >
                            <InputNumber
                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                style={{ width: '100%' }}
                                value={ruleParam.value}
                                placeholder='输入数值（整数）'
                                onChange={this.changeSelect.bind(this, 'value')}
                                min={0}
                                precision={0}
                            />
                        </FormItem>
                    )
            }
        }
        console.log(ruleParam, 'validateLength')
        return (
            <div>
                {ruleInfo.ruleTypeId == 'JHFL42' ? (
                    <div>
                        <FormItem label=''>
                            <Radio.Group disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.type} onChange={this.handleInputChange.bind(this, 'type')}>
                                <Radio value={1}>数值类型</Radio>
                                <Radio value={2}>字符类型</Radio>
                                <Radio value={3}>日期类型</Radio>
                            </Radio.Group>
                        </FormItem>
                        <div className='rangeArea'>
                            <div style={{ color: '#606366', marginBottom: 8 }}>{ruleParam.type == 1 ? '数值要求' : ruleParam.type == 2 ? '取值范围' : '日期要求'}</div>
                            {ruleParam.type == 1 ? (
                                <div>
                                    <Row gutter={8}>
                                        <Col span={10}>
                                            <FormItem
                                                name='operator'
                                                rules={[
                                                    {
                                                        required: ruleParam.hasParam == 2 ? false : true,
                                                        message: '请选择长度要求!',
                                                    },
                                                ]}
                                                label=''
                                                {...tailFormItemLayout}
                                            >
                                                <Select
                                                    disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                    value={ruleParam.operator}
                                                    onChange={this.changeSelect.bind(this, 'operator')}
                                                    placeholder='请选择'
                                                >
                                                    {operatorList.map((item, index) => {
                                                        return (
                                                            <Option value={item} key={index}>
                                                                {item}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={14}>{renderOperator()}</Col>
                                    </Row>
                                    {ruleParam.operator === '区间' ? (
                                        <Row gutter={8} style={{ marginTop: 12 }}>
                                            <Col span={6}>
                                                <FormItem help={minValueMsg || ' '} validateStatus={minValueMsg ? 'error' : 'success'}>
                                                    <InputNumber
                                                        style={{ width: '100%', verticalAlign: 'super' }}
                                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                        placeholder='数值'
                                                        value={ruleParam.minValue}
                                                        min={0}
                                                        onChange={this.handleInputChange.bind(this, 'minValue')}
                                                    />
                                                </FormItem>
                                            </Col>
                                            <Col span={4}>
                                                <Select disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.minOperator} onChange={this.changeSelect.bind(this, 'minOperator')}>
                                                    {['<', '<='].map((item) => {
                                                        return (
                                                            <Select.Option key={item} value={item}>
                                                                {item}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Col>
                                            <Col span={4}>
                                                <div style={{ textAlign: 'center', color: '#606366', marginTop: 4 }}>核验字段</div>
                                            </Col>
                                            <Col span={4}>
                                                <Select disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.maxOperator} onChange={this.changeSelect.bind(this, 'maxOperator')}>
                                                    {['<', '<='].map((item) => {
                                                        return (
                                                            <Select.Option key={item} value={item}>
                                                                {item}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Col>
                                            <Col span={6}>
                                                <FormItem help={maxValueMsg || ' '} validateStatus={maxValueMsg ? 'error' : 'success'}>
                                                    <InputNumber
                                                        style={{ width: '100%', verticalAlign: 'super' }}
                                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                        placeholder='数值'
                                                        value={ruleParam.maxValue}
                                                        onChange={this.handleInputChange.bind(this, 'maxValue')}
                                                        min={0}
                                                    />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </div>
                            ) : null}
                            {ruleParam.type == 2 ? (
                                <Row className='ruleRangeInput'>
                                    <Col span={6} style={{ width: 100 }}>
                                        <Select
                                            disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                            className='addonSelect'
                                            value={ruleParam.operator}
                                            onChange={this.changeSelect.bind(this, 'operator')}
                                        >
                                            <Option value={'包含'}>包含</Option>
                                            <Option value={'不包含'}>不包含</Option>
                                        </Select>
                                    </Col>
                                    <Col span={18} style={{ width: 'calc(100% - 100px)' }}>
                                        <Select
                                            disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                            allowClear
                                            className='tagsSelect'
                                            dropdownClassName='hideDropdown'
                                            mode='tags'
                                            tokenSeparators={[',', '，']}
                                            placeholder='输入取值范围，使用逗号分割'
                                            value={ruleParam.values}
                                            onChange={this.changeNewTagInput}
                                            style={{ width: '100%' }}
                                        ></Select>
                                    </Col>
                                </Row>
                            ) : null}
                            {ruleParam.type == 3 ? (
                                <div>
                                    <Row gutter={8}>
                                        <Col span={10}>
                                            <FormItem
                                                name='operator'
                                                rules={[
                                                    {
                                                        required: ruleParam.hasParam == 2 ? false : true,
                                                        message: '请选择长度要求!',
                                                    },
                                                ]}
                                                label=''
                                                {...tailFormItemLayout}
                                            >
                                                <Select
                                                    disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                    value={ruleParam.operator}
                                                    onChange={this.changeSelect.bind(this, 'operator')}
                                                    placeholder='请选择'
                                                >
                                                    {operatorList.map((item, index) => {
                                                        return (
                                                            <Option value={item} key={index}>
                                                                {item}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={14}>
                                            {ruleParam.operator !== '区间' && ruleParam.operator ? (
                                                <FormItem
                                                    name='value'
                                                    rules={[
                                                        {
                                                            required: ruleParam.hasParam == 2 ? false : true,
                                                            message: '请选择日期!',
                                                        },
                                                    ]}
                                                    label=''
                                                    {...tailFormItemLayout}
                                                >
                                                    <DatePicker
                                                        allowClear={false}
                                                        style={{ width: '100%' }}
                                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                        onChange={this.changeDate.bind(this, 'value')}
                                                        value={ruleParam.value && ruleParam.value.length > 0 ? moment(ruleParam.value, 'YYYY-MM-DD') : null}
                                                        placeholder='选择日期'
                                                    />
                                                </FormItem>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    {ruleParam.operator == '区间' ? (
                                        <Row gutter={8} style={{ marginTop: 12 }}>
                                            <Col span={6}>
                                                <FormItem help={minValueMsg || ' '} validateStatus={minValueMsg ? 'error' : 'success'}>
                                                    <DatePicker
                                                        style={{ verticalAlign: 'super' }}
                                                        allowClear={false}
                                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                        onChange={this.changeDate.bind(this, 'minValue')}
                                                        value={ruleParam.minValue && ruleParam.minValue.length > 0 ? moment(ruleParam.minValue, 'YYYY-MM-DD') : null}
                                                        placeholder='选择日期'
                                                    />
                                                </FormItem>
                                            </Col>
                                            <Col span={4}>
                                                <Select disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.minOperator} onChange={this.changeSelect.bind(this, 'minOperator')}>
                                                    {['<', '<='].map((item) => {
                                                        return (
                                                            <Select.Option key={item} value={item}>
                                                                {item}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Col>
                                            <Col span={4}>
                                                <div style={{ textAlign: 'center', color: '#606366', marginTop: 4 }}>核验字段</div>
                                            </Col>
                                            <Col span={4}>
                                                <Select disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={ruleParam.maxOperator} onChange={this.changeSelect.bind(this, 'maxOperator')}>
                                                    {['<', '<='].map((item) => {
                                                        return (
                                                            <Select.Option key={item} value={item}>
                                                                {item}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Col>
                                            <Col span={6}>
                                                <FormItem help={maxValueMsg || ' '} validateStatus={maxValueMsg ? 'error' : 'success'}>
                                                    <DatePicker
                                                        style={{ verticalAlign: 'super' }}
                                                        allowClear={false}
                                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                        onChange={this.changeDate.bind(this, 'maxValue')}
                                                        value={ruleParam.maxValue && ruleParam.maxValue.length > 0 ? moment(ruleParam.maxValue, 'YYYY-MM-DD') : null}
                                                        placeholder='选择日期'
                                                    />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFL41' ? (
                    <FormItem required={required == true} label='长度要求' {...tailFormItemLayout}>
                        <Row gutter={8}>
                            <Col span={10}>
                                <FormItem
                                    name='operator'
                                    rules={[
                                        {
                                            required: ruleParam.hasParam == 2 ? false : true,
                                            message: '请选择长度要求!',
                                        },
                                    ]}
                                    label=''
                                    {...tailFormItemLayout}
                                >
                                    <Select
                                        disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                        value={ruleParam.operator}
                                        onChange={this.changeSelect.bind(this, 'operator')}
                                        placeholder='请选择'
                                    >
                                        {operatorList.map((item, index) => {
                                            return (
                                                <Option value={item} key={index}>
                                                    {item}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={14}>
                                {renderOperator()}
                                {/* {ruleParam.operator !== '区间' && ruleParam.operator ? (
                                   
                                    <FormItem
                                        name='value'
                                        rules={[
                                            {
                                                required: ruleParam.hasParam == 2 ? false : true,
                                                message: '请输入数值!',
                                            },
                                        ]}
                                        label=''
                                        {...tailFormItemLayout}
                                    >
                                        <InputNumber
                                            disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                            style={{ width: '100%' }}
                                            value={ruleParam.value}
                                            placeholder='输入数值（整数）'
                                            onChange={this.changeSelect.bind(this, 'value')}
                                            min={0}
                                            precision={0}
                                        />
                                    </FormItem>
                                ) : null} */}
                            </Col>
                        </Row>
                        {ruleParam.operator == '区间' ? (
                            <Row gutter={8} style={{ marginTop: 12 }}>
                                <Col span={10}>
                                    <FormItem help={minValueMsg || ' '} validateStatus={minValueMsg ? 'error' : 'success'}>
                                        <Input.Group compact>
                                            <InputNumber
                                                style={{ width: '65%' }}
                                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                placeholder='输入数值'
                                                value={ruleParam.minValue}
                                                onChange={this.handleInputChange.bind(this, 'minValue')}
                                                min={0}
                                            />
                                            <Select
                                                style={{ width: '35%' }}
                                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                value={ruleParam.minOperator}
                                                onChange={this.changeSelect.bind(this, 'minOperator')}
                                            >
                                                {['<', '<='].map((item) => {
                                                    return (
                                                        <Select.Option key={item} value={item}>
                                                            {item}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        </Input.Group>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <div style={{ textAlign: 'center', color: '#606366', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>字段长度</div>
                                </Col>
                                <Col span={10}>
                                    <FormItem help={maxValueMsg || ' '} validateStatus={maxValueMsg ? 'error' : 'success'}>
                                        <Input.Group compact>
                                            <Select
                                                style={{ width: '35%' }}
                                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                value={ruleParam.maxOperator}
                                                onChange={this.changeSelect.bind(this, 'maxOperator')}
                                            >
                                                {['<', '<='].map((item) => {
                                                    return (
                                                        <Select.Option key={item} value={item}>
                                                            {item}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                            <InputNumber
                                                style={{ width: '65%' }}
                                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                                placeholder='输入数值'
                                                value={ruleParam.maxValue}
                                                onChange={this.handleInputChange.bind(this, 'maxValue')}
                                                min={0}
                                            />
                                        </Input.Group>
                                    </FormItem>
                                </Col>
                            </Row>
                        ) : null}
                    </FormItem>
                ) : null}
            </div>
        )
    }
}
export default ValidateLength
