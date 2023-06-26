import Module from '@/component/Module';
import { Col, Radio, Row, Select } from 'antd';
import { Form } from '@ant-design/compatible';
import { bizTypeList, databaseList, getManagerListByTableId, getTablePartitionSearchCondition } from 'app_api/examinationApi';
import { fieldSearch, getSourceList, getTableDetail } from 'app_api/metadataApi';
import SvgIcon from 'app_component_main/SvgIcon/index.tsx';
import React, { Component } from 'react';
import '../../index.less';
import BizTypeDrawer from './bizTypeDrawer';


const FormItem = Form.Item

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
export default class StepOne extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: {},
            sourceList: [],
            baseList: [],
            tableList: [],
            columnList: [],
            userList: [],
            partitionColumnList: [],
            partitionDateFormatList: [],
            partitionUpdateTypeList: [],
            primaryKeyList: [],
            bizTypeList: []
        }
    }
    componentWillMount = async () => {
        await this.setState({
            addTaskInfo: this.props.addTaskInfo
        })
        this.getSourceData()
        this.getBizTypeList()
    }
    getEditData = async (data) => {
        await this.setState({
            addTaskInfo: data
        })
        this.preStep()
    }
    getSourceData = async () => {
        let res = await getSourceList({ignoreProducts: 'MONGODB', sourceType: 1})
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDatabaseList = async () => {
        let { addTaskInfo } = this.state
        let query = {
            datasourceId: addTaskInfo.businessData.datasourceIdName.id,
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
        let { addTaskInfo } = this.state
        let query = {
            datasourceId: addTaskInfo.businessData.datasourceIdName.id,
            databaseId: addTaskInfo.businessData.databaseIdName.id,
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
        let { addTaskInfo } = this.state
        let query = {
            table_id: addTaskInfo.businessData.tableIdName.id,
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
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.datasourceIdName.id = e
        addTaskInfo.businessData.datasourceIdName.name = node.props.children
        addTaskInfo.businessData.databaseIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.tableIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.managerIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.primaryKeys = []
        addTaskInfo.primaryKeys = []
        await this.setState({
            addTaskInfo,
            baseList: [],
            tableList: [],
            columnList: [],
            userList: []
        })
        this.getDatabaseList()
    }
    changeDatabase = async (e, node) => {
        console.log(node)
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.databaseIdName.id = e
        addTaskInfo.businessData.databaseIdName.name = node.props.children
        addTaskInfo.businessData.tableIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.managerIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.primaryKeys = []
        addTaskInfo.primaryKeys = []
        await this.setState({
            addTaskInfo,
            tableList: [],
            columnList: [],
            userList: []
        })
        this.getTableList()
    }
    changeTable = async (e, node) => {
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.tableIdName.id = e
        addTaskInfo.businessData.tableIdName.name = node.props.children
        addTaskInfo.businessData.managerIdName = { id: undefined, name: '' }
        addTaskInfo.businessData.primaryKeys = []
        addTaskInfo.primaryKeys = []
        await this.setState({
            addTaskInfo,
        })
        this.getColumnList()
        this.getUserList()
        this.getTablePartitionData()
    }
    getUserList = async () => {
        let { addTaskInfo } = this.state
        let res = await getManagerListByTableId({tableId: addTaskInfo.businessData.tableIdName.id})
        if (res.code == 200) {
            this.setState({
                userList: res.data
            })
        }
    }
    getTablePartitionData = async () => {
        let { addTaskInfo } = this.state
        let res = await getTablePartitionSearchCondition({tableId: addTaskInfo.businessData.tableIdName.id})
        if (res.code == 200) {
            addTaskInfo.businessData.partitionInfo.isPartition = res.data.isPartitionTable
            this.setState({
                addTaskInfo,
                partitionColumnList: res.data.partitionColumnList,
                partitionDateFormatList: res.data.partitionDateFormatList,
                partitionUpdateTypeList: res.data.partitionUpdateTypeList
            })
        }
    }
    getBizTypeList = async () => {
        let res = await bizTypeList()
        if (res.code == 200) {
            this.setState({
                bizTypeList: res.data,
            })
        }
    }
    getNewBizTypeList = async () => {
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.bizType = ''
        this.setState({
            addTaskInfo
        })
        this.getBizTypeList()
    }
    changeSelect = (name, e, node) => {
        let { addTaskInfo, columnList } = this.state
        if (name == 'managerIdName') {
            addTaskInfo.businessData.managerIdName.id = e
            addTaskInfo.businessData.managerIdName.name = node.props.children
        } else if (name == 'partitionColumnId') {
            addTaskInfo.businessData.partitionInfo.partitionColumnId = e
            addTaskInfo.businessData.partitionInfo.partitionColumnName = node.props.children
        } else if (name == 'partitionDateFormat') {
            addTaskInfo.businessData.partitionInfo.partitionDateFormat = e
        } else if (name == 'partitionMode') {
            addTaskInfo.businessData.partitionInfo.partitionMode = e
            if (e == 2) {
                addTaskInfo.businessData.rangeInfo.rangeType = 1
            }
        } else if (name == 'primaryKeys') {
            addTaskInfo[name] = e
            addTaskInfo.businessData.primaryKeys = []
            columnList.map((item) => {
                e.map((column) => {
                    if (column == item.id) {
                        addTaskInfo.businessData.primaryKeys.push({id: item.id, name: item.physical_field})
                    }
                })
            })
        } else {
            addTaskInfo[name] = e
        }
        this.setState({
            addTaskInfo
        })
    }
    changeInput = (name, e) => {
        let { addTaskInfo } = this.state
        if (name == 'isPartition') {
            addTaskInfo.businessData.partitionInfo.isPartition = e.target.value
            if (!e.target.value) {
                addTaskInfo.businessData.rangeInfo.rangeType = 1
            }
        }
        this.setState({
            addTaskInfo
        })
    }
    selectBizType = (data) => {
        let { addTaskInfo } = this.state
        addTaskInfo.businessData.bizType = data
        this.setState({
            addTaskInfo
        })
    }
    openBizTypeDrawer = () => {
        this.bizTypeDrawer&&this.bizTypeDrawer.openModal()
    }
    nextStep = () => {
        let { addTaskInfo } = this.state
        this.props.getNewTaskInfo(addTaskInfo)
    }
    preStep = () => {
        let { addTaskInfo } = this.state
        console.log(addTaskInfo,'prestep')
        this.getDatabaseList()
        this.getTableList()
        this.getColumnList()
        this.getUserList()
        this.getTablePartitionData()
    }
    render() {
        const {
            addTaskInfo,
            primaryKeyList,
            bizTypeList,
            sourceList,
            baseList,
            tableList,
            columnList,
            userList,
            partitionColumnList,
            partitionDateFormatList,
            partitionUpdateTypeList
        } = this.state
        const { pageType } = this.props
        return (
            <div>
                <Module title='基本信息' style={{ marginBottom: 15 }}></Module>
                <FormItem required label='数据表' {...tailFormItemLayout}>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Select
                                disabled={pageType == 'edit'}
                                showSearch optionFilterProp='title' placeholder='数据源'
                                value={pageType == 'edit' ? addTaskInfo.businessData.datasourceIdName.name : addTaskInfo.businessData.datasourceIdName.id} onChange={this.changeDatasource}>
                                {sourceList.map((item) => {
                                    return (
                                        <Select.Option title={item.identifier} key={item.id} value={item.id}>
                                            {item.identifier}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                disabled={pageType == 'edit'}
                                showSearch optionFilterProp='title' placeholder='数据库' value={addTaskInfo.businessData.databaseIdName.id} onChange={this.changeDatabase}>
                                {baseList.map((item) => {
                                    return (
                                        <Select.Option title={item.physicalDatabase} key={item.id} value={item.id}>
                                            {item.physicalDatabase}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                disabled={pageType == 'edit'}
                                showSearch optionFilterProp='title' placeholder='数据表' value={addTaskInfo.businessData.tableIdName.id} onChange={this.changeTable}>
                                {tableList.map((item) => {
                                    return (
                                        <Select.Option title={item.physical_table} key={item.id} value={item.id}>
                                            {item.physical_table}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <span style={{ color: '#9EA3A8', display: 'inline-block', marginTop: 8 }}>每个检核任务包含一张物理表，任务名称与表名称相同</span>
                </FormItem>
                <FormItem required label='是否分区' {...tailFormItemLayout}>
                    <Radio.Group
                        disabled={!addTaskInfo.businessData.tableIdName.id || pageType == 'edit'}
                        value={addTaskInfo.businessData.partitionInfo.isPartition} onChange={this.changeInput.bind(this, 'isPartition')}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                    {
                        addTaskInfo.businessData.partitionInfo.isPartition ?
                            <div className='rangeArea'>
                                <Row gutter={8}>
                                    <Col span={8}>
                                        <FormItem required label='分区字段' {...tailFormItemLayout}>
                                            <Select disabled={!addTaskInfo.businessData.tableIdName.id || pageType == 'edit'}
                                                    showSearch
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    value={addTaskInfo.businessData.partitionInfo.partitionColumnId}
                                                    onChange={this.changeSelect.bind(this, 'partitionColumnId')} placeholder='请选择'>
                                                {partitionColumnList.map((item) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem required label='分区格式' {...tailFormItemLayout}>
                                            <Select disabled={!addTaskInfo.businessData.tableIdName.id || pageType == 'edit'}
                                                    value={addTaskInfo.businessData.partitionInfo.partitionDateFormat}
                                                    onChange={this.changeSelect.bind(this, 'partitionDateFormat')} placeholder='请选择'>
                                                {partitionDateFormatList.map((item) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem required label='分区的更新方式' {...tailFormItemLayout}>
                                            <Select disabled={!addTaskInfo.businessData.tableIdName.id || pageType == 'edit'}
                                                    value={addTaskInfo.businessData.partitionInfo.partitionMode}
                                                    onChange={this.changeSelect.bind(this, 'partitionMode')} placeholder='请选择'>
                                                {partitionUpdateTypeList.map((item) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                            :null
                    }
                </FormItem>
                <FormItem required label='主键' {...tailFormItemLayout}>
                    <Select mode='multiple'
                            showArrow={true}
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={!addTaskInfo.businessData.tableIdName.id || pageType == 'edit'}
                            value={addTaskInfo.primaryKeys} onChange={this.changeSelect.bind(this, 'primaryKeys')} placeholder='请选择'>
                        {columnList.map((item) => {
                            return (
                                <Select.Option title={item.physical_field} key={item.id} value={item.id}>
                                    {item.physical_field}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </FormItem>
                <FormItem label='负责人' {...tailFormItemLayout}>
                    <Select
                        disabled={!addTaskInfo.businessData.tableIdName.id}
                        value={addTaskInfo.businessData.managerIdName.id} onChange={this.changeSelect.bind(this, 'managerIdName')} placeholder='请选择'>
                        {userList.map((item) => {
                            return (
                                <Option value={item.id} key={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>
                </FormItem>
                <FormItem required label={<span>业务类型<a onClick={this.openBizTypeDrawer} style={{ color: '#4D73FF', marginLeft: 16 }}>编辑<SvgIcon style={{ width: 12, height: 12, marginLeft: 8 }} name="edit_fill" /></a></span>} {...tailFormItemLayout}>
                    {
                        bizTypeList.map((item) => {
                            return (
                                <div onClick={this.selectBizType.bind(this, item.code)} className={addTaskInfo.businessData.bizType == item.code?'bizTypeItemSelected bizTypeItem':'bizTypeItem'}>
                                    {
                                        addTaskInfo.businessData.bizType == item.code?<SvgIcon name="icon_tag_top" />:null
                                    }
                                    {item.code}
                                </div>
                            )
                        })
                    }
                </FormItem>
                <BizTypeDrawer ref={(dom) => {this.bizTypeDrawer = dom}} getBizTypeList={this.getNewBizTypeList}/>
            </div>
        )
    }
}