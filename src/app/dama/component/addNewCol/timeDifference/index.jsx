
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
            // 可选文本函数
            timeOption: []
        }
    }

    componentDidMount = async () => {
        this.getOption()
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            type: 3,
            formulaId: this.props.isEdit?store.editId:undefined
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
                    store.setTimeDiff({
                        columnFrom: res.data[0].id,
                        usingBusinessId1: res.data[0].businessId,
                        columnTo: res.data[1] ? res.data[1].id : res.data[0].id,
                        usingBusinessId2: res.data[1] ? res.data[1].businessId : res.data[0].businessId,
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
    onChangeTime1 = (value, item) => {
        const { timeDiff } = store
        timeDiff.columnFrom = value
        if (store.scope === 2) {
            timeDiff.usingBusinessId1 = item.props.businessId
        }
        store.setTimeDiff(timeDiff)
    }
    onChangeTime2 = (value, item) => {
        const { timeDiff } = store
        timeDiff.columnTo = value
        if (store.scope === 2) {
            timeDiff.usingBusinessId2 = item.props.businessId
        }
        store.setTimeDiff(timeDiff)
    }
    onChangeType = (value) => {
        const { timeDiff } = store
        timeDiff.precision = value
        store.setTimeDiff(timeDiff)
    }

    render() {
        const { timeOption } = this.state
        const { getFieldDecorator } = this.props.form
        const { timeDiff } = store
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <div className='timeDifference'>
                    <div className='description'>计算两个日期之间时间跨度</div>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }}>
                            {getFieldDecorator('columnFrom', {
                                initialValue: timeDiff.columnFrom ? timeDiff.columnFrom : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='时间字段名'
                                    disabled={timeOption.length === 0}
                                    onChange={this.onChangeTime1}
                                >
                                    {
                                        timeOption.map((value, index) => {
                                            return (
                                                <Option businessId={value.businessId} value={value.id} key={index}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <div
                            style={{
                                display: 'inline-block',
                                lineHeight: '32px',
                                width: '21px',
                                textAlign: 'center',
                                verticalAlign: 'middle'
                            }}
                        >
                            -
                        </div>
                        <Form.Item>
                            {getFieldDecorator('columnTo', {
                                initialValue: timeDiff.columnTo ? timeDiff.columnTo : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='时间字段名'
                                    disabled={timeOption.length === 0}
                                    onChange={this.onChangeTime2}
                                >
                                    {
                                        timeOption.map((value, index) => {
                                            return (
                                                <Option businessId={value.businessId} value={value.id} key={index}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item>
                            {getFieldDecorator('precision', {
                                initialValue: timeDiff.precision ? timeDiff.precision : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='请选择时间精度'
                                    onChange={this.onChangeType}
                                >
                                    <Option value={1}>年</Option>
                                    <Option value={2}>季度</Option>
                                    <Option value={3}>月</Option>
                                    <Option value={4}>日</Option>
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
