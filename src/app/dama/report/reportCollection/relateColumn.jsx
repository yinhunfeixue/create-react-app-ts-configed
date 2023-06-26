import { Form, Input, Radio, Select } from 'antd';
import { databaseList } from 'app_api/examinationApi';
import { fieldSearch, getTableDetail } from 'app_api/metadataApi';
import React, { Component } from 'react';
import '../index.less';


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

export default class RelateColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnInfo: {},
            baseList: [],
            tableList: [],
            columnList: [],
        }
    }
    getRuleData = async (data) => {
        await this.setState({
            columnInfo: data
        })
        this.getDatabaseList()
    }
    getDatabaseList = async () => {
        let { columnInfo } = this.state
        let query = {
            datasourceId: columnInfo.datasourceId,
            page: 1,
            page_size: 10000,
        }
        let res = await databaseList(query)
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    getTableList = async () => {
        let { columnInfo } = this.state
        let query = {
            datasourceId: columnInfo.datasourceId,
            databaseId: columnInfo.databaseId,
            page: 1,
            page_size: 10000,
        }
        let res = await getTableDetail(query)
        if (res.code == 200) {
            this.setState({
                tableList: res.data,
            })
        }
    }
    getColumnList = async () => {
        let { columnInfo } = this.state
        let query = {
            table_id: columnInfo.tableId,
            page: 1,
            page_size: 10000,
        }
        let res = await fieldSearch(query)
        if (res.code == 200) {
            this.setState({
                columnList: res.data,
            })
        }
    }
    changeDatabase = async (e, node) => {
        let { columnInfo } = this.state
        columnInfo.databaseId = e
        columnInfo.databaseName = node.props.children
        columnInfo.tableId = undefined
        columnInfo.columnId = undefined
        await this.setState({
            columnInfo,
            tableList: [],
            columnList: [],
        })
        this.getTableList()
        this.props.getNewcolumnInfo(columnInfo)
    }
    changeTable = async (e, node) => {
        let { columnInfo } = this.state
        columnInfo.tableId = e
        columnInfo.tableName = node.props.children
        columnInfo.columnId = undefined
        await this.setState({
            columnInfo,
            columnList: [],
        })
        this.getColumnList()
        this.props.getNewcolumnInfo(columnInfo)
    }
    changeColumn = (e, node) => {
        let { columnInfo } = this.state
        columnInfo.columnId = e
        columnInfo.columnName = node.props.children
        this.setState({
            columnInfo,
        })
        this.props.getNewcolumnInfo(columnInfo)
    }
    render() {
        const { columnInfo, baseList, tableList, columnList } = this.state
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                <FormItem required label='数据源' {...tailFormItemLayout}>
                    <Select disabled={true} value={columnInfo.datasourceName}>
                    </Select>
                </FormItem>
                <FormItem required label='数据库' {...tailFormItemLayout}>
                    <Select showSearch optionFilterProp='title' placeholder='请选择' value={columnInfo.databaseId} onChange={this.changeDatabase}>
                        {baseList.map((item) => {
                            return (
                                <Select.Option title={item.physicalDatabase} key={item.id} value={item.id}>
                                    {item.physicalDatabase}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </FormItem>
                <FormItem required label='数据表' {...tailFormItemLayout}>
                    <Select showSearch optionFilterProp='title' placeholder='请选择' value={columnInfo.tableId} onChange={this.changeTable}>
                        {tableList.map((item) => {
                            return (
                                <Select.Option title={item.physical_table} key={item.id} value={item.id}>
                                    {item.physical_table}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </FormItem>
                <FormItem required label='字段' {...tailFormItemLayout}>
                    <Select showSearch optionFilterProp='title' placeholder='请选择' value={columnInfo.columnId} onChange={this.changeColumn}>
                        {columnList.map((item) => {
                            return (
                                <Select.Option title={item.physical_field} key={item.id} value={item.id}>
                                    {item.physical_field}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </FormItem>
            </div>
        )
    }
}
