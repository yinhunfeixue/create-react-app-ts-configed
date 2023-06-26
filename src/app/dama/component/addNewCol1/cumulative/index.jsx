
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
class cumulative extends React.Component {
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
            store.setCumulative({
                accType: 1
            })
        }
    }
    onChangeColumn = (value, item) => {
        const { cumulative } = store
        cumulative.column = value
        if (store.scope === 2) {
            cumulative.usingBusinessId1 = item.props.businessId
        }
        store.setCumulative(cumulative)
    }
    onChangeType = (value) => {
        const { cumulative } = store
        cumulative.accType = value
        store.setCumulative(cumulative)
    }
    onChangeColumns = (value, item) => {
        const { cumulative } = store
        cumulative.accColumns = value
        if (store.scope === 2) {
            let usingBusinessId2 = item.map((val, index) => {
                return val.props.businessId
            })
            cumulative.usingBusinessId2 = usingBusinessId2
        }
        store.setCumulative(cumulative)
    }

    render() {
        const { columnOption, columnsOption } = this.state
        const { getFieldDecorator } = this.props.form
        const { cumulative } = store
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <div className='cumulative'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }} label='数值字段' >
                            {getFieldDecorator('column', {
                                initialValue: cumulative.column ? cumulative.column : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='度量字段名'
                                    dropdownMatchSelectWidth={false}
                                    disabled={columnOption.length === 0}
                                    onSelect={this.onChangeColumn}
                                >
                                    {
                                        columnOption.map((value, index) => {
                                            return (
                                                // eslint-disable-next-line react/jsx-key
                                                <Option businessId={value.businessId} value={value.id}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item label='累计方式'>
                            {getFieldDecorator('accType', {
                                initialValue: cumulative.accType ? cumulative.accType : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='总计'
                                    onChange={this.onChangeType}
                                >
                                    <Option value={1}>总计</Option>
                                    <Option value={2}>平均值</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item style={{ marginRight: 0 }} label='分组维度' >
                            {getFieldDecorator('accColumns', {
                                initialValue: cumulative.accColumns ? cumulative.accColumns.slice() : undefined
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
                                                // eslint-disable-next-line react/jsx-key
                                                <Option businessId={value.businessId} value={value.id} label={value.name}>{value.name}</Option>
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

const WrappedHorizon = Form.create()(cumulative)
export default WrappedHorizon
