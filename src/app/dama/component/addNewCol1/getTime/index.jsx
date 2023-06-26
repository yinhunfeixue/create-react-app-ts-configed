
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
class Timedifference extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeOption: []
        }
    }

    componentDidMount = async () => {
        this.getOption()
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            type: 3
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
                timeOption: res.data
            })
            // 如果是添加添加默认条件
            if (store.isAdd) {
                if (res.data.length > 0) {
                    store.setUsingBusinessIds([res.data[0].businessId])
                    store.setTimeDiff({
                        column: res.data[0].id,
                        precision: 1
                    })
                } else {
                    store.setTimeDiff({
                        precision: 1
                    })
                }
            }
        }
    }
    onChangeTime = (value, item) => {
        const { getTimeParam } = store
        getTimeParam.column = value
        store.setGetTime(getTimeParam)
        if (store.scope === 2) {
            store.setUsingBusinessIds([item.props.businessId])
        }
    }
    onChangeType = (value) => {
        const { getTimeParam } = store
        getTimeParam.precision = value
        store.setGetTime(getTimeParam)
    }

    render() {
        const { timeOption } = this.state
        const { getFieldDecorator } = this.props.form
        const { getTimeParam } = store
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <div className='getTime'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }} label='时间字段' >
                            {getFieldDecorator('column', {
                                initialValue: getTimeParam.column ? getTimeParam.column : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='时间字段名'
                                    disabled={timeOption.length === 0}
                                    onSelect={this.onChangeTime}
                                >
                                    {
                                        timeOption.map((value, index) => {
                                            return (
                                                <Option businessId={value.businessId} value={value.id}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item label='获取时间'>
                            {getFieldDecorator('precision', {
                                initialValue: getTimeParam.precision ? getTimeParam.precision : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='请选择时间精度'
                                    onChange={this.onChangeType}
                                >
                                    <Option value={1}>年</Option>
                                    <Option value={2}>季度</Option>
                                    <Option value={3}>月</Option>
                                    {/* <Option value={4}>日</Option> */}
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                </div>
            </Form>
        )
    }
}

const WrappedHorizon = Form.create()(Timedifference)
export default WrappedHorizon
