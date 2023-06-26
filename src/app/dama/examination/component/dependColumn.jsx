// 依赖一致性
import { Col, Form, Input, Radio, Row, Select } from 'antd';
import { databaseList } from 'app_api/examinationApi';
import { fieldSearch, getSourceList, getTableDetail } from 'app_api/metadataApi';
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

export default class DependColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleParam: this.props.ruleParam,
            sourceList: [],
            baseList: [],
            tableList: [],
            columnList: [],
        }
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    getRuleData = async (ruleInfo, ruleParam) => {
        await this.setState({
            ruleParam,
        })
        if (ruleParam.datasource.id) {
            this.getDatabaseList()
        }
        if (ruleParam.database.id) {
            this.getTableList()
        }
        if (ruleParam.table.id) {
            this.getColumnList()
        }
    }
    getSourceData = async () => {
        let res = await getSourceList({ignoreProducts: 'MONGODB'})
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDatabaseList = async () => {
        let { ruleParam } = this.state
        let query = {
            datasourceId: ruleParam.datasource.id,
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
        let { ruleParam } = this.state
        let query = {
            datasourceId: ruleParam.datasource.id,
            databaseId: ruleParam.database.id,
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
        let { ruleParam } = this.state
        let query = {
            table_id: ruleParam.table.id,
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
    changeDatasource = async (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.datasource.id = e
        ruleParam.datasource.name = node.props.children
        ruleParam.database = { id: undefined, name: '' }
        ruleParam.table = { id: undefined, name: '' }
        ruleParam.column = { id: undefined, name: '' }
        await this.setState({
            ruleParam,
            baseList: [],
            tableList: [],
            columnList: [],
        })
        this.getDatabaseList()
        this.props.getNewRuleParam(ruleParam)
    }
    changeDatabase = async (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.database.id = e
        ruleParam.database.name = node.props.children
        ruleParam.table = { id: undefined, name: '' }
        ruleParam.column = { id: undefined, name: '' }
        await this.setState({
            ruleParam,
            tableList: [],
            columnList: [],
        })
        this.getTableList()
        this.props.getNewRuleParam(ruleParam)
    }
    changeTable = async (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.table.id = e
        ruleParam.table.name = node.props.children
        ruleParam.column = { id: undefined, name: '' }
        await this.setState({
            ruleParam,
            columnList: [],
        })
        this.getColumnList()
        this.props.getNewRuleParam(ruleParam)
    }
    changeColumn = (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.column.id = e
        ruleParam.column.name = node.props.children
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    render() {
        const { ruleParam, sourceList, baseList, tableList, columnList } = this.state
        const { pageType, required } = this.props
        console.log(ruleParam,'dependColumn')
        return (
            <div>
                <FormItem required={required == true} label='依赖字段' {...tailFormItemLayout}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <Select showSearch optionFilterProp='title' placeholder='数据源' disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={pageType == 'edit' ? ruleParam.datasource.name : ruleParam.datasource.id} onChange={this.changeDatasource}>
                                {sourceList.map((item) => {
                                    return (
                                        <Select.Option title={item.identifier} key={item.id} value={item.id}>
                                            {item.identifier}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select showSearch optionFilterProp='title' placeholder='数据库' disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={pageType == 'edit' ? ruleParam.database.name : ruleParam.database.id} onChange={this.changeDatabase}>
                                {baseList.map((item) => {
                                    return (
                                        <Select.Option title={item.physicalDatabase} key={item.id} value={item.id}>
                                            {item.physicalDatabase}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select showSearch optionFilterProp='title' placeholder='数据表' disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={pageType == 'edit' ? ruleParam.table.name : ruleParam.table.id} onChange={this.changeTable}>
                                {tableList.map((item) => {
                                    return (
                                        <Select.Option title={item.physical_table} key={item.id} value={item.id}>
                                            {item.physical_table}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select showSearch optionFilterProp='title' placeholder='字段' disabled={ruleParam.hasParam == 2 || pageType == 'edit'} value={pageType == 'edit' ? ruleParam.column.name : ruleParam.column.id} onChange={this.changeColumn}>
                                {columnList.map((item) => {
                                    return (
                                        <Select.Option title={item.physical_field} key={item.id} value={item.id}>
                                            {item.physical_field}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
            </div>
        )
    }
}
