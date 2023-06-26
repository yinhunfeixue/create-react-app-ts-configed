import { Col, Form, Input, Radio, Row, Select } from 'antd';
import { codeItem } from 'app_api/dataWarehouse';
import { listAllDatabaseDataByDatasourceId, listAllDatasourceData } from 'app_api/examinationApi';
import { getMetadataCodeValue } from 'app_api/metadataApi';
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

export default class ValidateCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleParam: this.props.ruleParam,
            ruleInfo: this.props.ruleInfo,
            sourceList: [],
            baseList: [],
            valueList: [],
        }
    }
    componentWillMount = () => {
        this.getSourceData()
    }
    getRuleData = async (ruleInfo, ruleParam) => {
        await this.setState({
            ruleParam,
            ruleInfo,
        })
        if (ruleParam.datasource.id) {
            this.getDatabaseList()
        }
        if (ruleParam.database.id) {
            this.getValueList()
        }
    }
    getSourceData = async () => {
        let res = await listAllDatasourceData()
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
        }
        let res = await listAllDatabaseDataByDatasourceId(query)
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    getValueList = async () => {
        let { ruleParam } = this.state
        let query = {
            datasourceIdList: ruleParam.datasource.id,
            databaseIdList: ruleParam.database.id,
        }
        let res = await codeItem(query)
        if (res.code == 200) {
            this.setState({
                valueList: res.data,
            })
        }
    }
    getCodeItem = async () => {
        let { ruleParam } = this.state
        let res = await getMetadataCodeValue({ itemId: this.state.ruleParam.code.id,page: 1, page_size: 9999 })
        if (res.code == 200) {
            ruleParam.values = []
            res.data.map((item) => {
                ruleParam.values.push({ id: item.value, name: item.name })
            })
            this.setState({
                ruleParam,
            })
        }
    }
    changeDatasource = async (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.datasource.id = e
        ruleParam.datasource.name = node.props.children
        ruleParam.database = { id: undefined, name: '' }
        ruleParam.code = { id: undefined, name: '' }
        ruleParam.values = []
        await this.setState({
            ruleParam,
            baseList: [],
            valueList: [],
        })
        this.getDatabaseList()
        this.props.getNewRuleParam(ruleParam)
    }
    changeDatabase = async (e, node) => {
        console.log(node)
        let { ruleParam } = this.state
        ruleParam.database.id = e
        ruleParam.database.name = node.props.children
        ruleParam.code = { id: undefined, name: '' }
        ruleParam.values = []
        await this.setState({
            ruleParam,
            valueList: [],
        })
        this.getValueList()
        this.props.getNewRuleParam(ruleParam)
    }
    changeValue = async (e, node) => {
        let { ruleParam } = this.state
        ruleParam.code.id = e
        ruleParam.code.name = node.props.children
        await this.setState({
            ruleParam,
        })
        this.getCodeItem()
        this.props.getNewRuleParam(ruleParam)
    }
    render() {
        const { ruleParam, ruleInfo, baseList, sourceList, valueList } = this.state
        console.log(ruleParam, 'validateCode')
        const { pageType, required } = this.props
        return (
            <div>
                <FormItem required={required == true} label='代码项' {...tailFormItemLayout}>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Select
                                showSearch
                                optionFilterProp='title'
                                placeholder='数据源'
                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                value={pageType == 'edit' ? ruleParam.datasource.name : ruleParam.datasource.id}
                                onChange={this.changeDatasource}
                            >
                                {sourceList.map((item) => {
                                    return (
                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                optionFilterProp='title'
                                placeholder='数据库'
                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                value={pageType == 'edit' ? ruleParam.database.name : ruleParam.database.id}
                                onChange={this.changeDatabase}
                            >
                                {baseList.map((item) => {
                                    return (
                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={8} style={{ marginBottom: 8 }}>
                            <Select
                                showSearch
                                optionFilterProp='title'
                                placeholder='代码项'
                                disabled={ruleParam.hasParam == 2 || pageType == 'edit'}
                                value={pageType == 'edit' ? ruleParam.code.name : ruleParam.code.id}
                                onChange={this.changeValue}
                            >
                                {valueList.map((item) => {
                                    return (
                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        {ruleParam.values.length ? (
                            <span style={{ color: '#5E6266', marginLeft: 5 }}>
                                代码项内容：
                                <span style={{ color: '#2D3033' }}>
                                    {ruleParam.values.map((item, index) => {
                                        return (
                                            <span>
                                                "{item.id}:{item.name}"{ruleParam.values.length == index + 1 ? null : <span>、</span>}
                                            </span>
                                        )
                                    })}
                                </span>
                            </span>
                        ) : null}
                    </Row>
                </FormItem>
            </div>
        )
    }
}
