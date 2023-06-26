
import { Form } from '@ant-design/compatible';
import { Button, Checkbox, Input, Menu, Row, Select, TreeSelect } from 'antd';
import { getColumn } from 'app_api/addNewColApi';
import { observer } from 'mobx-react';
import React from 'react';
import FormulaSelect from '../formulaSelect';
import store from '../store';
import './index.less';


const { Search } = Input
const { Option } = Select
const { TreeNode } = TreeSelect;
const { SubMenu } = Menu;

@observer
class aggregation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOption: [],
            columnsOption: [],
            aggColumns: [],
            showSetting: false,
            key: 1,
            isContainSet: false,
        }
    }

    componentDidMount = async () => {
        await this.getOption()
        if (this.props.isEdit) {
            this.getEditData()
        } else {
            store.setIndexmaList([])
            this.addIndexma()
        }
    }
    getEditData = () => {
        const { indexmaList, aggregation } = store
        let { columnsOption, aggColumns, key} = this.state
        key ++
        let hasTime = false
        aggregation.aggColumns.map((item) => {
            aggColumns.push(item.id)
        })
        columnsOption.map((item) => {
            aggregation.aggColumns.map((item1) => {
                if (item.id == item1.id) {
                    item.timeType = item1.timeType
                    item.interval = item1.interval
                    item.special = item1.special
                    item.timeTypeName = item1.timeTypeName
                    item.specialName = item1.specialName
                    if (item.enableTimeTypes) {
                        hasTime = true
                    }
                }
            })
            indexmaList.map((item1) => {
                if (item.enableTimeTypes) {
                    item1.value.push(item)
                }
            })
        })
        indexmaList.map((item) => {
            item.value.map((item1) => {
                if (item.selectValue.id == item1.id) {
                    item1.timeType = item.selectValue.timeType
                    item1.interval = item.selectValue.interval
                    item1.special = item.selectValue.special
                    item1.timeTypeName = item.selectValue.timeTypeName
                    item1.specialName = item.selectValue.specialName
                }
            })
        })
        store.setIndexmaList(indexmaList)
        this.setState({aggColumns,columnsOption, key, showSetting: hasTime, isContainSet: aggregation.isContainSet})
    }

    getOption = async (keyword) => {
        let params = {
            businessId: store.businessId,
            type: 1,
            category: 4,
            tempBusinessId: this.props.tempBusinessId,
            formulaId: this.props.isEdit?store.editId:undefined
        }
        console.log(store.aggregation.id,'store.aggregation.id')
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
                item.timeTypeName = '年 月 日'
                item.timeType = item.enableTimeTypes?item.enableTimeTypes[0].id:''
                item.timeTypeId = item.enableTimeTypes?item.enableTimeTypes[0].id:''
                item.interval = ''
                item.specialName = '自然日'
                item.special = item.specialColumns?item.specialColumns[0].id:''
                item.specialId = item.specialColumns?item.specialColumns[0].id:''
            })
            this.setState({
                columnsOption: res1.data
            })
        }
        // 如果是添加添加默认条件
        if (store.isAdd) {
            store.setAggregation({
                aggType: 1,
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
    onChangeColumns = (value, item, index) => {
        console.log(value,'item')
        this.setState({aggColumns: value})
        const { aggregation } = store
        const { columnsOption } = this.state
        aggregation.aggColumns = []
        let hasTime = false
        columnsOption.map((data) => {
            value.map((data1) => {
                if (data.id == data1) {
                    if (data.enableTimeTypes) {
                        hasTime = true
                    }
                    aggregation.aggColumns.push(
                        {
                            id: data.id,
                            businessId: data.businessId,
                            timeType: data.timeType,
                            interval: data.interval,
                            special: data.special,
                            timeTypeName: data.timeTypeName,
                            specialName: data.specialName
                        }
                    )
                }
            })
        })
        aggregation.isContainSet = !hasTime?false:this.state.isContainSet
        this.setState({showSetting: hasTime, isContainSet: !hasTime?false:this.state.isContainSet})
        if (store.scope === 2) {
            let usingBusinessId2 = item.map((val, index) => {
                console.log(val)
                return val.props.businessId
            })
            aggregation.usingBusinessId2 = usingBusinessId2
        }
        store.setAggregation(aggregation)
        console.log(this.state.isContainSet,'isContainSet++++')
    }
    handleClickMenu = (data) => {
        console.log(data,'data')
        const { aggregation } = store
        data.map((item) => {
            aggregation.aggColumns.map((value) => {
                if (value.id == item.id) {
                    value.timeType = item.timeType
                    value.interval = item.interval
                    value.special = item.special
                    value.timeTypeName = item.timeTypeName
                    value.specialName = item.specialName
                }
            })
        })
        store.setAggregation(aggregation)
    }
    addIndexma = () => {
        let { columnsOption } = this.state
        const { indexmaList } = store
        let obj = {
            name: '',
            value: [],
            selectValue: {}
        }
        columnsOption.map((item) => {
            if (item.enableTimeTypes) {
                obj.value.push(item)
            }
        })
        indexmaList.push(obj)
        store.setIndexmaList(indexmaList)
    }
    deleteIndexma = (index) => {
        const { indexmaList } = store
        indexmaList.splice(index,1)
        store.setIndexmaList(indexmaList)
    }
    changeIndexmaValue = (index,e) => {
        const { indexmaList } = store
        indexmaList[index].name = e.target.value
        store.setIndexmaList(indexmaList)
    }
    onChangeIndexmaColumns = (value,item,index) => {
        console.log(value,item,'onChangeIndexmaColumns')
        const { indexmaList } = store
        indexmaList[index].value.map((data) => {
            if (data.id == value) {
                indexmaList[index].selectValue = data
            }
        })
        store.setIndexmaList(indexmaList)
    }
    handleClickIndexmaMenu = (data,index) => {
        const { indexmaList } = store
        console.log(index,'index++++++++')
        console.log(indexmaList[index].selectValue,'indexmaList[index].selectValue')
        data.map((item) => {
            if (indexmaList[index].selectValue.id == item.id) {
                indexmaList[index].selectValue.timeType = item.timeType
                indexmaList[index].selectValue.interval = item.interval
                indexmaList[index].selectValue.special = item.special
                indexmaList[index].selectValue.timeTypeName = item.timeTypeName
                indexmaList[index].selectValue.specialName = item.specialName
            }
        })
        store.setIndexmaList(indexmaList)
    }
    onChangeSetting = (e) => {
        let { isContainSet } = this.state
        const { aggregation } = store
        aggregation.isContainSet = e.target.checked
        isContainSet = e.target.checked
        store.setAggregation(aggregation)
        this.setState({
            isContainSet
        })
    }

    render() {
        const { columnOption, columnsOption, showSetting, aggColumns, isContainSet } = this.state
        const { getFieldDecorator } = this.props.form
        const { aggregation, indexmaList } = store

        const menuOption = [
            {
                listName: 'enableTimeTypes',
                selectedKeys: 'timeTypeId',
                selectedName: 'timeTypeName',
                menu: ''
            },
            {
                listName: 'specialColumns',
                selectedKeys: 'specialId',
                selectedName: 'specialName',
                menu: ''
            }
        ]

        console.log(indexmaList,'indexmaList')
        return (
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <div className='aggregation'>
                    <Row style={{ marginBottom: '12px' }}>
                        <Form.Item style={{ marginRight: 0 }} label='数值字段' >
                            {getFieldDecorator('column', {
                                initialValue: aggregation.column ? aggregation.column : undefined
                            })(
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    style={{ width: '138px' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder='度量字段名'
                                    disabled={columnOption.length === 0}
                                    onChange={this.onChangeColumn}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
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
                            {columnsOption.length?
                                <FormulaSelect
                                    key={this.state.key}
                                    isEdit={this.props.isEdit}
                                    value={aggColumns}
                                    width={'660px'}
                                    mode='multiple'
                                    data={columnsOption}
                                    onChange={this.onChangeColumns}
                                    onChangeMenu={this.handleClickMenu}
                                    menuOption={menuOption}
                                />:
                                <Select
                                    style={{ width: '660px' }}
                                    placeholder='添加分组维度'
                                ></Select>
                            }
                        </Form.Item>
                    </Row>
                    {showSetting?
                        <Row>
                            <Form.Item style={{ marginRight: 0 }} label='高级设置' >

                                    <Checkbox onChange={this.onChangeSetting} checked={isContainSet}><span style={{ fontSize: '13px', fontWeight: '500' }}>生成其他时间维度的指标字段</span></Checkbox>
                                {
                                    indexmaList.slice().map((item,index) => {
                                        return <div style={{ display: isContainSet?'block':'none'}}>
                                            <Input onChange={this.changeIndexmaValue.bind(this, index)} value={item.name} style={{ width: '150px', marginRight: '8px' }} placeholder='输入指标名称'/>
                                            <FormulaSelect
                                                width={'415px'}
                                                index={index}
                                                value={item.selectValue.id}
                                                data={item.value}
                                                onChange={this.onChangeIndexmaColumns}
                                                onChangeMenu={this.handleClickIndexmaMenu}
                                                menuOption={menuOption}
                                            />
                                            <Button onClick={this.addIndexma.bind(this,index)} type='link' style={{ paddingRight: '0px' }}>添加</Button>
                                            {index == 0?null:<Button onClick={this.deleteIndexma.bind(this,index)} type='link'>删除</Button>}
                                        </div>
                                    })
                                }
                            </Form.Item>
                        </Row>
                    :null}
                </div>
            </Form>
        )
    }
}

const WrappedHorizon = Form.create()(aggregation)
export default WrappedHorizon
