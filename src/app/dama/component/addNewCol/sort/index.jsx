
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
class Sort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOption: [
                {name: '序号', id: 1},
                {name: '排名', id: 2},
                {name: '密集排名', id: 3},
            ],
            columnsOption: [],
            rankColumns: [],
            key: 1,
            groupOption: [],
        }
    }

    componentDidMount = async () => {
        await this.getOption()
        if (this.props.isEdit) {
            this.getEditData()
        }
    }
    getEditData = () => {
        const { sortInfo } = store
        let { columnsOption, rankColumns, key} = this.state
        key ++
        sortInfo.rankColumns.map((item) => {
            rankColumns.push(item.id)
        })
        columnsOption.map((item) => {
            sortInfo.rankColumns.map((item1) => {
                if (item.id == item1.id) {
                    item.sortType = item1.sortType
                    item.sortTypeId = item1.sortTypeId
                    item.sortTypeName = item1.sortTypeName
                }
            })
        })
        this.setState({rankColumns,columnsOption, key})
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            tempBusinessId: this.props.tempBusinessId,
            type: '2,3',
            category: 7,
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
                groupOption: res.data
            })
        }
        params.type = '1,2,3'
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
            store.setSortInfo({
                accType: 1
            })
        }
    }
    onChangeColumn = (value, item) => {
        const { sortInfo } = store
        sortInfo.rankType = value
        store.setSortInfo(sortInfo)
    }
    onChangeColumns = (value, item) => {
        const { sortInfo } = store
        const { groupOption } = this.state
        sortInfo.accColumns = value
        sortInfo.partitionColumns = []
        groupOption.map((item) => {
            value.map((item1) => {
                if (item.id == item1) {
                    sortInfo.partitionColumns.push({id: item.id, businessId: item.businessId})
                }
            })
        })
        if (store.scope === 2) {
            let usingBusinessId2 = item.map((val, index) => {
                return val.props.businessId
            })
            sortInfo.usingBusinessId2 = usingBusinessId2
        }
        store.setSortInfo(sortInfo)
    }
    onChangeSortColumns = (value, item) => {
        console.log(value,'item')
        this.setState({rankColumns: value})
        const { sortInfo } = store
        const { columnsOption } = this.state
        sortInfo.rankColumns = []
        columnsOption.map((data) => {
            value.map((data1) => {
                if (data.id == data1) {
                    sortInfo.rankColumns.push(
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
        store.setSortInfo(sortInfo)
    }
    handleClickMenu = (data) => {
        console.log(data,'data')
        const { sortInfo } = store
        data.map((item) => {
            sortInfo.rankColumns.map((value) => {
                if (value.id == item.id) {
                    value.sortType = item.sortType
                    value.sortTypeId = item.sortTypeId
                    value.sortTypeName = item.sortTypeName
                }
            })
        })
        store.setSortInfo(sortInfo)
    }

    render() {
        const { columnOption, columnsOption, rankColumns, groupOption } = this.state
        const { getFieldDecorator } = this.props.form
        const { sortInfo } = store
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
                <div className='sortInfo'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }} label='排序方式' >
                            {getFieldDecorator('rankType', {
                                initialValue: sortInfo.rankType ? sortInfo.rankType : undefined
                            })(
                                <Select
                                    style={{ width: '138px' }}
                                    placeholder='请选择排序方式'
                                    dropdownMatchSelectWidth={false}
                                    disabled={columnOption.length === 0}
                                    onSelect={this.onChangeColumn}
                                >
                                    {
                                        columnOption.map((value, index) => {
                                            return (
                                                <Option value={value.id}>{value.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item style={{ marginBottom: '12px' }} label='分组维度' >
                            {getFieldDecorator('accColumns', {
                                initialValue: sortInfo.accColumns ? sortInfo.accColumns.slice() : undefined
                            })(
                                <Select
                                    style={{ width: '300px' }}
                                    placeholder='请选择过滤条件'
                                    mode='multiple'
                                    onChange={this.onChangeColumns}
                                    optionFilterProp='label'
                                >
                                    {
                                        groupOption.map((value, index) => {
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
                                    value={rankColumns}
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

const WrappedHorizon = Form.create()(Sort)
export default WrappedHorizon
