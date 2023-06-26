import { Col, Form, Input, message, Radio, Row, Select } from 'antd'
import { databaseList } from 'app_api/examinationApi'
import { fieldSearch, getSourceList, getTableDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import '../index.less'

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

export default class CheckColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnInfo: {},
            sourceList: [],
            baseList: [],
            tableList: [],
            columnList: [],
            sourceLoading: false,
            baseLoading: false,
            tableLoading: false,
            columnLoading: false,
        }
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    getRuleData = (data) => {
        this.setState({
            columnInfo: data,
        })
    }
    getSourceData = async () => {
        this.setState({ sourceLoading: true })
        let res = await getSourceList({ ignoreProducts: 'MONGODB', sourceType: 1 })
        this.setState({ sourceLoading: false })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDatabaseList = async () => {
        let { columnInfo } = this.state
        let query = {
            datasourceId: columnInfo.datasourceId,
            page: 1,
            page_size: 999999,
        }
        this.setState({ baseLoading: true })
        let res = await databaseList(query)
        this.setState({ baseLoading: false })
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
            page_size: 999999,
        }
        this.setState({ tableLoading: true })
        let res = await getTableDetail(query)
        this.setState({ tableLoading: false })
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
            page_size: 999999,
        }
        this.setState({ columnLoading: true })
        let res = await fieldSearch(query)
        this.setState({ columnLoading: false })
        if (res.code == 200) {
            this.setState({
                columnList: res.data,
            })
        }
    }
    changeDatasource = async (e, node) => {
        console.log(node)
        let { columnInfo } = this.state
        columnInfo.datasourceId = e
        columnInfo.datasourceName = node.props.children
        columnInfo.databaseId = undefined
        columnInfo.tableId = undefined
        columnInfo.columnId = undefined
        await this.setState({
            columnInfo,
            baseList: [],
            tableList: [],
            columnList: [],
        })
        this.getDatabaseList()
        this.props.getNewcolumnInfo(columnInfo)
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
        const { columnInfo, sourceList, baseList, tableList, columnList, baseLoading, tableLoading, sourceLoading, columnLoading } = this.state
        const { pageType } = this.props
        return (
            <div>
                <FormItem required label='添加检核字段' {...tailFormItemLayout}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <Select
                                loading={sourceLoading}
                                showSearch
                                optionFilterProp='title'
                                placeholder='数据源'
                                disabled={pageType == 'edit'}
                                value={pageType == 'edit' ? columnInfo.datasourceName : columnInfo.datasourceId}
                                onChange={this.changeDatasource}
                            >
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
                            <Select
                                loading={baseLoading}
                                showSearch
                                optionFilterProp='title'
                                placeholder='数据库'
                                disabled={pageType == 'edit'}
                                value={pageType == 'edit' ? columnInfo.databaseName : columnInfo.databaseId}
                                onChange={this.changeDatabase}
                            >
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
                            <Select
                                loading={tableLoading}
                                showSearch
                                optionFilterProp='title'
                                placeholder='数据表'
                                disabled={pageType == 'edit'}
                                value={pageType == 'edit' ? columnInfo.tableName : columnInfo.tableId}
                                onChange={this.changeTable}
                            >
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
                            <Select
                                loading={columnLoading}
                                showSearch
                                optionFilterProp='title'
                                placeholder='检核字段'
                                disabled={pageType == 'edit'}
                                value={pageType == 'edit' ? columnInfo.columnName : columnInfo.columnId}
                                onChange={this.changeColumn}
                            >
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
