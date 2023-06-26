
import { Form } from '@ant-design/compatible';
import { Input, Row, Select } from 'antd';
import { getColumn } from 'app_api/addNewColApi';
import { observer } from 'mobx-react';
import React from 'react';
import store from '../store';
import './index.less';


const { Search } = Input
const { Option } = Select

@observer
class aggregation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOption: [],
            columnsOption: [],
        }
    }

    componentDidMount = async () => {
        this.getOption()
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            type: 1
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
                columnOption: res.data
            })
        }
        params.type = 2
        let res1 = await getColumn(params)
        if (res1.code === 200) {
            this.setState({
                columnsOption: res1.data
            })
        }
        // 如果是添加添加默认条件
        if (store.isAdd) {
            store.setAggregation({
                aggType: 1
            })
        }
    }
    onChangeColumn = (value, item) => {
        const { aggregation } = store
        aggregation.column = value
        if (store.scope === 2) {
            aggregation.usingBusinessId1 = item.props.businessId
        }
        store.setAggregation(aggregation)
    }
    onChangeType = (value) => {
        const { aggregation } = store
        aggregation.aggType = value
        store.setAggregation(aggregation)
    }
    onChangeColumns = (value, item) => {
        const { aggregation } = store
        aggregation.aggColumns = value
        if (store.scope === 2) {
            let usingBusinessId2 = item.map((val, index) => {
                console.log(val)
                return val.props.businessId
            })
            aggregation.usingBusinessId2 = usingBusinessId2
        }
        store.setAggregation(aggregation)
    }

    render() {
        const { columnOption, columnsOption } = this.state
        const { getFieldDecorator } = this.props.form
        const { aggregation } = store
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <div className='aggregation'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }} label='数值字段' >
                            {getFieldDecorator('column', {
                                initialValue: aggregation.column ? aggregation.column : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder='度量字段名'
                                    disabled={columnOption.length === 0}
                                    onChange={this.onChangeColumn}
                                >
                                    {
                                        columnOption.map((value, index) => {
                                            return (
                                                <Option businessId={value.businessId} value={value.id} key={index}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item label='聚合方式'>
                            {getFieldDecorator('aggType', {
                                initialValue: aggregation.aggType ? aggregation.aggType : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='求和'
                                    onChange={this.onChangeType}
                                >
                                    <Option value={1}>总计</Option>
                                    <Option value={2}>平均</Option>
                                    <Option value={3}>最大值</Option>
                                    <Option value={4}>最小值</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item style={{ marginRight: 0 }} label='分组维度' >
                            {getFieldDecorator('aggColumns', {
                                initialValue: aggregation.aggColumns ? aggregation.aggColumns.slice() : undefined
                            })(
                                <Select
                                    style={{ width: '300px' }}
                                    placeholder='请选择过滤条件'
                                    mode='multiple'
                                    onChange={this.onChangeColumns}
                                    optionFilterProp='label'
                                >
                                    {
                                        columnsOption.map((value, index) => {
                                            return (
                                                <Option key={index} businessId={value.businessId} value={value.id} label={value.name}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                </div>
            </Form>
        )
    }
}

const WrappedHorizon = Form.create()(aggregation)
export default WrappedHorizon
