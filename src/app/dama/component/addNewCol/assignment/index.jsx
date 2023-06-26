import { Form } from '@ant-design/compatible';
import { Checkbox, Input, message, Row, Select } from 'antd';
import { getColumn, getPartitionRecommend } from 'app_api/addNewColApi';
import leftDel from 'app_images/leftDel.svg';
import { observer } from 'mobx-react';
import React from 'react';
import store from '../store';
import './index.less';


const { Search } = Input
const { Option } = Select

@observer
class assignment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOption: [],
            groupList: [],
            maxValue: 0,
            minValue: 0,
            checked: true,
        }
    }

    componentDidMount = async () => {
        this.getOption()
        if (!store.isAdd) {
            this.onChangeColumn(store.assignment.column, {}, true)
            if (!store.assignment.other) {
                this.setState({
                    checked: false,
                })
            }
        }
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            type: 1,
        }
        if (keyword) {
            params.keyword = keyword
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        let res = await getColumn(params)
        if (res.code === 200) {
            this.setState({
                columnOption: res.data,
            })
        }
        // 如果是添加添加默认条件
        if (store.isAdd) {
            store.setAssignment({})
        }
    }
    onChangeColumn = async (value, item, isedit) => {
        const { assignment } = store
        assignment.column = value
        let params = {
            businessId: store.businessId,
            columnId: value,
        }
        if (store.scope === 2 && item.props && item.props.businessId) {
            store.setUsingBusinessIds([item.props.businessId])
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        let res = await getPartitionRecommend(params)
        if (res.code === 200) {
            if (isedit === true) {
                this.setState({
                    minValue: res.data.minValue,
                    maxValue: res.data.maxValue,
                })
                return
            }
            assignment.partition = res.data.partitions
            this.setState(
                {
                    minValue: res.data.minValue,
                    maxValue: res.data.maxValue,
                },
                () => {
                    this.props.form.resetFields()
                }
            )
        } else {
            message.warning(res.msg)
        }
        store.setAssignment(assignment)
    }

    // 第一组数值比较符号
    prefixFirst = (key, value) => {
        const { getFieldDecorator } = this.props.form
        return getFieldDecorator(`hasMin${key}`, {
            initialValue: value.hasMin || false,
        })(
            <Select style={{ width: '47px' }}>
                <Option value={true}>{'<='}</Option>
                {key !== 0 && <Option value={false}>{'<'}</Option>}
            </Select>
        )
    }
    // 第二组数据比较符号
    prefixSecond = (key, value) => {
        let groupList = store.assignment.partition.slice() || []
        const { getFieldDecorator } = this.props.form
        return getFieldDecorator(`hasMax${key}`, {
            initialValue: value.hasMax || false,
        })(
            <Select style={{ width: '47px' }}>
                <Option value={true}>{'<='}</Option>
                {key !== groupList.length - 1 && <Option value={false}>{'<'}</Option>}
            </Select>
        )
    }

    // 删除分组
    delGroup = (index) => {
        let groupList = store.assignment.partition.slice() || []
        let arr = [...groupList]
        if (arr.length <= 2) {
            message.error('分组不能小于2组')
            return
        }
        const { assignment } = store
        let data = this.props.form.getFieldsValue()
        let currentArr = []
        arr.map((val, index) => {
            currentArr.push({
                name: data[`name${index}`],
                min: data[`min${index}`],
                hasMin: data[`hasMin${index}`],
                hasMax: data[`hasMax${index}`],
                max: data[`max${index}`],
            })
        })
        currentArr.splice(index, 1)
        currentArr[0].hasMin = true
        currentArr[currentArr.length - 1].hasMax = true
        assignment.partition = currentArr
        assignment.other = data.other
        store.setAssignment(assignment)
        this.props.form.resetFields()
        this.props.form.setFieldsValue({ hasMin0: true, [`hasMax${currentArr.length - 1}`]: true })
    }
    // 增加分组
    addGroup = () => {
        const { assignment } = store
        let groupList = store.assignment.partition.slice() || []
        let arr = [...groupList]
        if (arr.length >= 15) {
            message.error('分组不能大于15组')
            return
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                arr.push({
                    hasMax: true,
                    max: '',
                    hasMin: true,
                    min: '',
                })
                assignment.partition = arr
                store.setAssignment(assignment)
            }
        })
    }
    // 是否有其他分组
    checkOther = (e) => {
        this.setState({
            checked: e.target.checked,
        })
    }
    // 检查名字是否为空和重复
    checkName = (dataIndex, rule, value, callback) => {
        let groupList = store.assignment.partition.slice() || []
        let nameList = []
        groupList.map((val, index) => {
            if (dataIndex !== index) {
                nameList.push(this.props.form.getFieldValue(`name${index}`))
            }
        })
        if (value.length && value.length > 0) {
            if (nameList.findIndex((val) => val === value) > -1) {
                callback('分组名称不能重复')
            } else {
                callback()
            }
        } else {
            callback('分组名称不能为空')
        }
    }
    // 检查最小值
    checkMinValue = (dataIndex, rule, value, callback) => {
        let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
        let parttern = new RegExp(reg)
        let ifError = false
        let maxValue = parseFloat(this.props.form.getFieldValue(`max${dataIndex}`))
        let hasMax = this.props.form.getFieldValue(`hasMax${dataIndex}`)
        let hasMin = this.props.form.getFieldValue(`hasMin${dataIndex}`)
        if (!value.length || value.length === 0) {
            callback('数据范围不可为空')
            return
        }
        if (!parttern.test(value)) {
            callback('数据范围应为数值')
            return
        }
        value = parseFloat(value)
        if (!hasMax) {
            if (value >= maxValue) {
                callback('数据范围不存在')
                ifError = true
                return
            }
        } else {
            if (!hasMin) {
                if (value >= maxValue) {
                    callback('数据范围不存在')
                    ifError = true
                    return
                }
            } else {
                if (value > maxValue) {
                    callback('数据范围不存在')
                    ifError = true
                    return
                }
            }
        }
        if (ifError) {
            callback('数据范围不存在')
            return
        }
        if (dataIndex > 0) {
            // 获取上一个范围的最大值作为本次的最小值
            let preMaxValue = this.props.form.getFieldValue(`max${dataIndex - 1}`)
            let preHasMax = this.props.form.getFieldValue(`hasMax${dataIndex - 1}`)
            if (!preHasMax) {
                if (value < preMaxValue) {
                    callback('数据范围重复')
                    return
                }
            } else {
                if (!hasMin) {
                    if (value < preMaxValue) {
                        callback('数据范围重复')
                        return
                    }
                } else {
                    if (value <= preMaxValue) {
                        callback('数据范围重复')
                        return
                    }
                }
            }
            callback()
        } else {
            callback()
        }
    }
    // 检查最大值
    checkMaxValue = (dataIndex, rule, value, callback) => {
        let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
        let parttern = new RegExp(reg)
        let groupList = store.assignment.partition.slice() || []
        let ifError = false
        let minValue = parseFloat(this.props.form.getFieldValue(`min${dataIndex}`))
        let hasMax = this.props.form.getFieldValue(`hasMax${dataIndex}`)
        let hasMin = this.props.form.getFieldValue(`hasMin${dataIndex}`)
        if (!value.length || value.length === 0) {
            callback('数据范围不可为空')
            return
        }
        if (!parttern.test(value)) {
            callback('数据范围应为数值')
            return
        }
        value = parseFloat(value)
        if (!hasMin) {
            if (value <= minValue) {
                callback('数据范围不存在')
                ifError = true
                return
            }
        } else {
            if (!hasMax) {
                if (value <= minValue) {
                    callback('数据范围不存在')
                    ifError = true
                    return
                }
            } else {
                if (value < minValue) {
                    callback('数据范围不存在')
                    ifError = true
                    return
                }
            }
        }
        if (ifError) {
            callback('数据范围不存在')
            return
        }
        if (dataIndex > 0) {
            // 获取上一个范围的最大值作为本次的最小值
            if (dataIndex < groupList.length - 1) {
                let nextMinValue = this.props.form.getFieldValue(`min${dataIndex + 1}`)
                let nextHasMin = this.props.form.getFieldValue(`hasMin${dataIndex + 1}`)
                if (nextMinValue.length === 0) {
                    callback()
                } else {
                    if (!nextHasMin) {
                        if (value > nextMinValue) {
                            callback('数据范围重复')
                            return
                        }
                    } else {
                        if (!hasMax) {
                            if (value > nextMinValue) {
                                callback('数据范围重复')
                                return
                            }
                        } else {
                            if (value >= nextMinValue) {
                                callback('数据范围重复')
                                return
                            }
                        }
                    }
                    callback()
                }
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    // 检查其他分组名称
    otherName = (rule, value, callback) => {
        let groupList = store.assignment.partition.slice() || []
        let nameList = []
        groupList.map((val, index) => {
            nameList.push(this.props.form.getFieldValue(`name${index}`))
        })
        if (value.length && value.length > 0) {
            if (nameList.findIndex((val) => val === value) > -1) {
                callback('分组名称不能重复')
            } else {
                callback()
            }
        } else {
            callback('分组名称不能为空')
        }
    }
    // 找出字段id对应的字段名
    findFieldName = (id) => {
        const { columnOption } = this.state
        let str = ''
        columnOption.map((value, index) => {
            if (value.id === id) {
                str = value.name
            }
        })
        return str
    }
    getGroupList = () => {
        let { assignment } = store
        const { checked } = this.state
        if (!assignment.partition || assignment.partition.length === 0) {
            message.error('请选择度量字段')
            return false
        }
        return this.props.form.validateFields((err, values) => {
            let groupList = []
            if (!err) {
                assignment.partition &&
                    assignment.partition.map((val, index) => {
                        groupList.push({
                            name: values[`name${index}`],
                            min: values[`min${index}`],
                            hasMin: values[`hasMin${index}`],
                            hasMax: values[`hasMax${index}`],
                            max: values[`max${index}`],
                        })
                    })
                assignment.partition = groupList
                if (checked) {
                    assignment.other = values.other
                } else {
                    if (assignment.other) {
                        delete assignment.other
                    }
                }
                store.setAssignment(assignment)
                return true
            } else {
                return false
            }
        })
    }
    render() {
        const { columnOption, checked, minValue, maxValue } = this.state
        const { getFieldDecorator } = this.props.form
        const { assignment } = store
        const groupList = store.assignment.partition ? store.assignment.partition.slice() : []
        return (
            <Form layout='inline'>
                <div className='assignment'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item label='度量字段' style={{ marginRight: 0 }}>
                            {getFieldDecorator('column', {
                                initialValue: assignment.column ? assignment.column : undefined,
                            })(
                                <Select style={{ width: '138px' }} placeholder='度量字段名' dropdownMatchSelectWidth={false} disabled={columnOption.length === 0} onSelect={this.onChangeColumn}>
                                    {columnOption.map((value, index) => {
                                        return (
                                            <Option businessId={value.businessId} value={value.id} key={index}>
                                                {value.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    {groupList.length > 0 && (
                        <Row>
                            <div style={{ fontWeight: '400', color: 'rgba(0,0,0,1)', padding: '0 40px 15px 0', lineHeight: '22px' }}>
                                <span>自定义分组</span>
                                <span style={{ float: 'right', color: '#1890FF', fontWeight: '400', cursor: 'pointer' }} onClick={this.addGroup}>
                                    添加分组
                                </span>
                            </div>
                            <div className='groupContent'>
                                {groupList.map((value, index) => {
                                    return (
                                        <div key={index} className='groupList'>
                                            <Form.Item>
                                                {getFieldDecorator(`name${index}`, {
                                                    rules: [
                                                        {
                                                            validator: this.checkName.bind(this, index),
                                                        },
                                                    ],
                                                    initialValue: value.name || '',
                                                })(<Input style={{ width: '214px' }} />)}
                                            </Form.Item>
                                            <Form.Item style={{ marginRight: 0 }}>
                                                {getFieldDecorator(`min${index}`, {
                                                    rules: [
                                                        {
                                                            validator: this.checkMinValue.bind(this, index),
                                                        },
                                                    ],
                                                    initialValue: value.min || '',
                                                })(<Input style={{ width: '230px' }} addonAfter={this.prefixFirst(index, value)} />)}
                                            </Form.Item>
                                            <div className='valueIcon'>~</div>
                                            <Form.Item style={{ marginRight: 0 }}>
                                                {getFieldDecorator(`max${index}`, {
                                                    rules: [
                                                        {
                                                            validator: this.checkMaxValue.bind(this, index),
                                                        },
                                                    ],
                                                    initialValue: value.max || '',
                                                })(<Input style={{ width: '230px' }} addonBefore={this.prefixSecond(index, value)} />)}
                                            </Form.Item>
                                            <div className='listDelBtn'>
                                                <img src={leftDel} onClick={this.delGroup.bind(this, index)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='groupBottom'>
                                <div className='otherGroup'>
                                    <div className='otherBtn'>
                                        <Checkbox checked={checked} onChange={this.checkOther} />
                                    </div>
                                    <Form.Item label='未分组的值分到' colon={false}>
                                        {getFieldDecorator('other', {
                                            rules: [
                                                {
                                                    validator: this.otherName.bind(this),
                                                },
                                            ],
                                            initialValue: assignment.other ? assignment.other : '其他',
                                        })(<Input style={{ width: '98px' }} />)}
                                    </Form.Item>
                                </div>
                                <div className='groupRange'>
                                    {this.findFieldName(assignment.column)}取值范围: {minValue}~{maxValue}
                                </div>
                            </div>
                        </Row>
                    )}
                </div>
            </Form>
        )
    }
}

const WrappedHorizon = Form.create()(assignment)
export default WrappedHorizon
