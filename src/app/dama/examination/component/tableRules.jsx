// JHFL47记录完整性、JHFL82时间字段比较、JHFLT21表间检核-一致性、JHFLT22表间检核-及时性、JHFLT11单表-表行数波动率
import { Form, Input, InputNumber, Radio, Select } from 'antd'
import { databaseList } from 'app_api/examinationApi'
import { fieldSearch, getSourceList, getTableDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import '../index.less'
import TableSelectModal from './TableSelectModal'

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

export default class TableRules extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleParam: {
                ...this.props.ruleParam,
                dateFormat: '',
                type: undefined,
            },
            ruleInfo: this.props.ruleInfo,
            sourceList: [],
            baseList: [],
            tableList: [],
            columnList: [],
            visibleTableModal: false,
            dateColumnList: [],
            targetColumnList: [],
        }
    }
    componentWillMount = () => {
        this.getSourceData()
        this.getDateColumns()
    }
    // 参照表字段
    getSourceColumnList = async (id) => {
        let { ruleParam } = this.state
        let query = {
            table_id: id,
            page: 1,
            page_size: 999999,
        }
        let res = await fieldSearch(query)
        if (res.code == 200) {
            // ruleParam.column = {}
            this.setState({
                targetColumnList: res.data,
                ruleParam,
            })
            // this.props.setFieldsValue({ targetColumnId: undefined })
        }
    }
    getRuleData = async (ruleInfo, ruleParam) => {
        await this.setState({
            ruleParam: {
                ...ruleParam,
                // dateFormat: '',
                // type: undefined
            },
        })
        // if (ruleParam.datasource.id) {
        //     this.getDatabaseList()
        // }
        // if (ruleParam.database.id) {
        //     this.getTableList()
        // }
        if (ruleParam.table.id) {
            // this.getColumnList()
            this.getSourceColumnList(ruleParam.table.id)
        }
    }
    getSourceData = async () => {
        let res = await getSourceList({ ignoreProducts: 'MONGODB' })
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
    getDateColumns = async () => {
        // let { ruleParam } = this.state
        // console.log(ruleParam,'getDateColumns')
        // let res = await dateColumns({ tableId: ruleParam.id })
        // if (res.code == 200) {
        //     this.setState({
        //         dateColumnList: res.data,
        //     })
        // }
    }
    openDatasourceModal = () => {
        this.setState({
            visibleTableModal: true,
        })
    }
    changeSelect = (name, e, node) => {
        let { ruleParam } = this.state
        if (name == 'targetColumnId') {
            ruleParam.column.id = e
            ruleParam.column.name = node.props.children
            this.props.setFieldsValue({ targetColumnId: e })
        } else {
            ruleParam[name] = e
        }
        this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    handleInputChange = async (name, e) => {
        let { ruleParam } = this.state
        if (name == 'targetDateFormat' || name == 'dateFormat' || name == 'view') {
            ruleParam[name] = e.target.value
        } else if (name == 'value') {
            ruleParam[name] = e
        }
        await this.setState({
            ruleParam,
        })
        this.props.getNewRuleParam(ruleParam)
    }
    render() {
        const { targetColumnList, ruleInfo, dateColumnList, visibleTableModal, ruleParam, sourceList, baseList, tableList, columnList } = this.state
        const { pageType, required } = this.props
        console.log(ruleParam, 'dependColumn')
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '24px' }}>
                {ruleInfo.ruleTypeId == 'JHFLT21' || ruleInfo.ruleTypeId == 'JHFLT22' || ruleInfo.ruleTypeId == 'JHFL47' ? (
                    <FormItem required label={ruleInfo.ruleTypeId == 'JHFL47' ? '记录参照表' : '参照表'} {...tailFormItemLayout}>
                        <a onClick={this.openDatasourceModal}>
                            {ruleParam.table.name ? (
                                <span>
                                    {ruleParam.datasource.name + ' / ' + ruleParam.database.name + ' / ' + ruleParam.table.name} <span className='iconfont icon-bianji' />
                                </span>
                            ) : (
                                '添加参照表'
                            )}
                        </a>
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFLT21' || ruleInfo.ruleTypeId == 'JHFLT22' ? (
                    <FormItem
                        required
                        name='targetColumnId'
                        rules={[
                            {
                                required: true,
                                message: '请选择参照表时间字段!',
                            },
                        ]}
                        label='参照表时间字段'
                        {...tailFormItemLayout}
                    >
                        <Select
                            showSearch
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={this.changeSelect.bind(this, 'targetColumnId')}
                            placeholder='请选择'
                        >
                            {targetColumnList.map((item) => {
                                return (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.physical_field}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFLT21' || ruleInfo.ruleTypeId == 'JHFLT22' ? (
                    <FormItem required label='参照表时间格式' {...tailFormItemLayout}>
                        <Input value={ruleParam.targetDateFormat} placeholder="示例：DATE_FORMAT(create_time,'%Y-%m-%d')=YYYY-MM-DD" onChange={this.handleInputChange.bind(this, 'targetDateFormat')} />
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFL47' ? (
                    <FormItem required label='时间格式' {...tailFormItemLayout}>
                        <Input value={ruleParam.dateFormat} placeholder="示例：DATE_FORMAT(create_time,'%Y-%m-%d')=YYYY-MM-DD" onChange={this.handleInputChange.bind(this, 'dateFormat')} />
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFLT22' ? (
                    <FormItem required label='比较方式' {...tailFormItemLayout}>
                        <Input.Group compact>
                            <Select
                                style={{ width: '33%' }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                onChange={this.changeSelect.bind(this, 'method')}
                                value={ruleParam.method}
                                placeholder='请选择'
                            >
                                <Select.Option value={1} key={1}>
                                    绝对值
                                </Select.Option>
                                <Select.Option value={2} key={2}>
                                    早于参照表
                                </Select.Option>
                                <Select.Option value={3} key={3}>
                                    晚于参照表
                                </Select.Option>
                            </Select>
                            <InputNumber
                                style={{ width: '34%', verticalAlign: 'super' }}
                                placeholder='输入数值（整数）'
                                value={ruleParam.value}
                                min={0}
                                onChange={this.handleInputChange.bind(this, 'value')}
                            />
                            <Select
                                style={{ width: '33%' }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                onChange={this.changeSelect.bind(this, 'type')}
                                value={ruleParam.type}
                                placeholder='单位'
                            >
                                <Select.Option value={1} key={1}>
                                    天
                                </Select.Option>
                                <Select.Option value={2} key={2}>
                                    小时
                                </Select.Option>
                                <Select.Option value={3} key={3}>
                                    分钟
                                </Select.Option>
                            </Select>
                        </Input.Group>
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFLT11' ? (
                    <FormItem required label='基准值' {...tailFormItemLayout}>
                        <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} onChange={this.changeSelect.bind(this, 'type')} value={ruleParam.type} placeholder='请选择'>
                            <Select.Option value={1} key={1}>
                                1天周期比较
                            </Select.Option>
                            <Select.Option value={2} key={2}>
                                7天周期比较
                            </Select.Option>
                            <Select.Option value={3} key={3}>
                                30天周期比较
                            </Select.Option>
                            <Select.Option value={4} key={4}>
                                7天平均值波动
                            </Select.Option>
                            <Select.Option value={5} key={5}>
                                30天平均值波动
                            </Select.Option>
                        </Select>
                    </FormItem>
                ) : null}
                {ruleInfo.ruleTypeId == 'JHFLT11' ? (
                    <FormItem required label='比较方式' {...tailFormItemLayout}>
                        <Input.Group compact>
                            <Select
                                style={{ width: '50%' }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                onChange={this.changeSelect.bind(this, 'method')}
                                value={ruleParam.method}
                                placeholder='比较方式 '
                            >
                                <Select.Option value={1} key={1}>
                                    绝对值{' '}
                                </Select.Option>
                                <Select.Option value={2} key={2}>
                                    上升
                                </Select.Option>
                                <Select.Option value={3} key={3}>
                                    下降
                                </Select.Option>
                            </Select>
                            <InputNumber
                                style={{ width: '50%', verticalAlign: 'super' }}
                                placeholder='请输入数值'
                                value={ruleParam.value}
                                min={0}
                                onChange={this.handleInputChange.bind(this, 'value')}
                            />
                        </Input.Group>
                    </FormItem>
                ) : null}
                <TableSelectModal
                    visible={visibleTableModal}
                    onCancel={() => this.setState({ visibleTableModal: false })}
                    onOk={(value) => {
                        ruleParam.datasource = value.datasource
                        ruleParam.database = value.database
                        ruleParam.table = { id: value.id, name: value.physicalTable }
                        this.setState({
                            visibleTableModal: false,
                            ruleParam,
                        })
                        this.getSourceColumnList(value.id)
                        this.props.getNewRuleParam(ruleParam)
                    }}
                />
            </div>
        )
    }
}
