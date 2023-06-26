
import { Form } from '@ant-design/compatible';
import { Input, Row, Select } from 'antd';
import { getColumn } from 'app_api/addNewColApi';
import { observer } from 'mobx-react';
import React from 'react';
import FormulaSelect from '../formulaSelect';
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
            sortColumns: [],
            key: 1,
        }
    }

    componentDidMount = async () => {
        await this.getOption()
        if (this.props.isEdit) {
            this.getEditData()
        }
    }
    getEditData = () => {
        const { cumulative } = store
        let { columnsOption, sortColumns, key} = this.state
        key ++
        cumulative.sortColumns.map((item) => {
            sortColumns.push(item.id)
        })
        columnsOption.map((item) => {
            cumulative.sortColumns.map((item1) => {
                if (item.id == item1.id) {
                    item.sortType = item1.sortType
                    item.sortTypeId = item1.sortTypeId
                    item.sortTypeName = item1.sortTypeName
                }
            })
        })
        this.setState({sortColumns,columnsOption, key})
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            tempBusinessId: this.props.tempBusinessId,
            type: 1,
            category: 5,
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
                columnOption: res.data
            })
        }
        params.type = '2,3'
        let res1 = await getColumn(params)
        if (res1.code === 200) {
            res1.data.map((item) => {
                item.sortTypeName = '升序'
                item.sortType = 1
                item.sortTypeId = '升序@1'
                item.sortList = [
                    {name: '升序', id: 1, enable: true},
                    {name: '降序', id: 2, enable: true}
                ]
            })
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
    onChangeSortColumns = (value, item) => {
        console.log(value,'item')
        this.setState({sortColumns: value})
        const { cumulative } = store
        const { columnsOption } = this.state
        cumulative.sortColumns = []
        columnsOption.map((data) => {
            value.map((data1) => {
                if (data.id == data1) {
                    cumulative.sortColumns.push(
                        {
                            id: data.id,
                            businessId: data.businessId,
                            sortType: data.sortType,
                            sortTypeId: data.sortTypeId,
                            sortTypeName: data.sortTypeName
                        }
                    )
                }
            })
        })
        store.setCumulative(cumulative)
    }
    handleClickMenu = (data) => {
        console.log(data,'data')
        const { cumulative } = store
        data.map((item) => {
            cumulative.sortColumns.map((value) => {
                if (value.id == item.id) {
                    value.sortType = item.sortType
                    value.sortTypeId = item.sortTypeId
                    value.sortTypeName = item.sortTypeName
                }
            })
        })
        store.setCumulative(cumulative)
    }

    render() {
        const { columnOption, columnsOption, sortColumns } = this.state
        const { getFieldDecorator } = this.props.form
        const { cumulative } = store

        const menuOption = [
            {
                listName: 'sortList',
                selectedKeys: 'sortTypeId',
                selectedName: 'sortTypeName',
                menu: ''
            }
        ]
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
                                    <Option value={1}>求和</Option>
                                    <Option value={2}>平均值</Option>
                                    <Option value={3}>最大值</Option>
                                    <Option value={4}>最小值</Option>
                                    <Option value={5}>去重计数</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item style={{ marginBottom: '12px' }} label='分组维度' >
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
                    <Row>
                        <Form.Item style={{ marginRight: 0 }} label='排序字段' >
                            {columnsOption.length?
                                <FormulaSelect
                                    key={this.state.key}
                                    isEdit={this.props.isEdit}
                                    value={sortColumns}
                                    width={'660px'}
                                    mode='multiple'
                                    data={columnsOption}
                                    onChange={this.onChangeSortColumns}
                                    onChangeMenu={this.handleClickMenu}
                                    menuOption={menuOption}
                                />:
                                <Select
                                    style={{ width: '660px' }}
                                    placeholder='添加排序字段'
                                ></Select>
                            }
                        </Form.Item>
                    </Row>
                </div>
            </Form>
        )
    }
}

const WrappedHorizon = Form.create()(cumulative)
export default WrappedHorizon
