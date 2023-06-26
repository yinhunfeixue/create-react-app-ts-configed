import ExpandTable from '@/app/dama/component/expandTable'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Cascader, Checkbox, Form, Input, message, Radio, Select, Tag, Tooltip, InputNumber } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { auditRecord, governColumns, governPartitionColumns, governTableDetail, saveGovern } from 'app_api/dataModeling'
import { catalogDwTree, catalogNondwBizTree, dataSecurityLevelList, dwAnalysisThemeTree } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import '../index.less'
import ColumnCheckDrawer from './comonpent/columnCheckDrawer'
import RootCheckDrawer from './comonpent/rootCheckDrawer'
import RootDetailDrawer from './comonpent/rootDetailDrawer'
import RootWindow from './comonpent/rootWindow'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class DgdlDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailInfo: {
                lifeCycle: {
                    type: 0,
                    dateFrequency: 4,
                },
                needAuditRootCount: 0,
                tableNameCn: '中文名',
                tableNameEn: 'englishName',
                datasourceNameEn: '数据源名称',
                groupCodeName: '表分组名称',
                createUser: 'admin',
                createTime: '2022-04-07',
            },
            queryInfo: {
                keyword: '',
            },
            loading: false,
            saveLoading: false,
            addInfo: {
                technicalDepartPair: {},
                technicalManagerPair: {},
                businessDepartPair: {},
                businessManagerPair: {},
            },
            bizTreeData: [],
            dataTree: [],
            bizUserList: [],
            techUserList: [],
            departmentList: [],
            levelList: [],
            selectedIndex: 0,
            tableData: [],
            partionTableData: [],
            isPartion: false,
            auditRecordList: [],
        }
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                width: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                width: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: (
                    <span>
                        字段类型
                        <Tooltip
                            overlayStyle={{ maxWidth: 266 }}
                            title={
                                <div>
                                    被括起来的内容依次为长度，精度。例如：
                                    <ul style={{ paddingLeft: 12 }}>
                                        <li style={{ listStyle: 'initial' }}>DOUBLE(11,2)</li>
                                        <li style={{ listStyle: 'initial' }}>字段类型为DOUBLE，长度11，精度2</li>
                                    </ul>
                                </div>
                            }
                        >
                            <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: '5px' }} />
                        </Tooltip>
                    </span>
                ),
                dataIndex: 'dataType',
                key: 'dataType',
                width: 130,
                render: (text, record) =>
                    text ? (
                        <span className='LineClamp'>{text + (record.dataLength !== undefined ? '(' + record.dataLength + (record.dataPrecision ? ',' + record.dataPrecision : '') + ')' : '')}</span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '非空',
                dataIndex: 'nullable',
                key: 'nullable',
                width: 120,
                render: (text) => {
                    return <span>{!text ? '非空' : <EmptyLabel />}</span>
                },
            },
            {
                title: '主键',
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                width: 120,
                render: (text) => {
                    return <span>{text ? '主键' : <EmptyLabel />}</span>
                },
            },
            {
                title: '外键',
                dataIndex: 'foreignKey',
                key: 'foreignKey',
                width: 100,
                render: (text, record) => {
                    if (text) {
                        return (
                            <div>
                                <Tooltip title={'外键：' + record.foreignColumnName}>
                                    <IconFont className='foreignKey' type='icon-waijian' />
                                </Tooltip>
                            </div>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'codeItemName',
                key: 'codeItemName',
                title: '引用代码',
                width: 100,
                render: (text, record, index) => {
                    if (text) {
                        return (
                            <div>
                                <Tooltip title={'引用代码：' + text}>{text ? <IconFont className='foreignKey' type='icon-code' /> : null}</Tooltip>
                            </div>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                render: (text, record, index) => {
                    return <a onClick={this.openColumnManageModal.bind(this, record, index, false)}>治理</a>
                },
            },
        ]
        this.partionColumns = []
    }
    componentDidMount = async () => {
        this.partionColumns = [...this.columns]
        ;(this.partionColumns[this.partionColumns.length - 1] = {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            width: 80,
            render: (text, record, index) => {
                return <a onClick={this.openColumnManageModal.bind(this, record, index, true)}>治理</a>
            },
        }),
            await this.getGovernTableDetail()
        this.getDepartment()
        this.getCatalogNondwBizTree()
        this.getSecurityLevel()
        this.getAuditRecord()
        this.getPartionTableList()
    }
    getAuditRecord = async () => {
        let res = await auditRecord({ tableId: this.pageParam.id, needAll: true, audit: true })
        if (res.code == 200) {
            this.setState({
                auditRecordList: res.data,
            })
        }
    }
    getGovernTableDetail = async () => {
        let res = await governTableDetail({ id: this.pageParam.id })
        if (res.code == 200) {
            res.data.lifeCycle = res.data.lifeCycle ? res.data.lifeCycle : { type: 0, dateFrequency: 4 }
            await this.setState({
                detailInfo: res.data,
            })
            this.getBizUserList()
            this.getTechUserList()
        }
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: 999999,
            tableId: this.pageParam.id,
            ...queryInfo,
        }
        let res = await governColumns(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            dataSource: [],
            total: 0,
        }
    }
    getPartionTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: 999999,
            tableId: this.pageParam.id,
            ...queryInfo,
        }
        let res = await governPartitionColumns(query)
        if (res.code == 200) {
            this.setState({
                partionTableData: res.data,
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            dataSource: [],
            total: 0,
        }
    }
    openColumnManageModal = (data, index, value) => {
        let { detailInfo } = this.state
        this.setState({
            selectedIndex: index,
            isPartion: value,
        })
        data.datasourceId = detailInfo.datasourceId
        this.columnCheckDrawer && this.columnCheckDrawer.openModal(data, detailInfo.securityLevel)
    }
    openRootListCheckModal = () => {
        let { detailInfo } = this.state
        this.rootCheckDrawer && this.rootCheckDrawer.openModal(detailInfo)
    }
    openRootDetailModal = () => {
        let { detailInfo, auditRecordList } = this.state
        this.rootDetailDrawer && this.rootDetailDrawer.openModal(auditRecordList)
    }
    cancel = () => {
        this.props.addTab('治理列表')
    }
    saveData = async (value) => {
        let { tableData, detailInfo, partionTableData } = this.state
        let query = {
            ...detailInfo,
        }
        console.log('query', query, detailInfo)
        if (value) {
            // 完成治理
            query.status = 2
            if (detailInfo.needAuditRootCount) {
                message.info('请完成词根审批')
                return
            }
            if (!detailInfo.classId.length || !detailInfo.bizManagerId || !detailInfo.techManagerId /* || !detailInfo.securityLevel */) {
                message.info('请完善表治理信息')
                return
            }
        } else {
            // 保存
            query.status = 1
        }
        query.columnList = [...tableData]
        query.partitionColumnList = [...partionTableData]
        if (query.status == 2) {
            this.setState({ loading: true })
        } else {
            this.setState({ saveLoading: true })
        }
        let res = await saveGovern(query)
        if (query.status == 2) {
            this.setState({ loading: false })
        } else {
            this.setState({ saveLoading: false })
        }
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
        }
    }
    renderModuleTitle = (name) => {
        return (
            <div>
                {name}
                <span className='moduleTip'>（需完善）</span>
            </div>
        )
    }
    getCatalogNondwBizTree = async () => {
        let { detailInfo } = this.state
        let res = {}
        if (detailInfo.dataWarehouse) {
            if (detailInfo.dwLevel == 'app') {
                res = await dwAnalysisThemeTree() // 数仓-应用层
            } else {
                res = await catalogDwTree() // 数仓-非应用层
            }
        } else {
            res = await catalogNondwBizTree() // 非数仓
        }
        if (res.code == 200) {
            this.setState({
                bizTreeData: this.deleteSubList(res.data),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    changeClassify = async (value, selectedOptions) => {
        let { detailInfo } = this.state
        if (selectedOptions.length) {
            detailInfo.bizDepartmentId = selectedOptions[selectedOptions.length - 1].businessDepartmentId ? selectedOptions[selectedOptions.length - 1].businessDepartmentId : undefined
            detailInfo.bizManagerId = selectedOptions[selectedOptions.length - 1].businessManagerId ? selectedOptions[selectedOptions.length - 1].businessManagerId : undefined
            detailInfo.techDepartmentId = selectedOptions[selectedOptions.length - 1].technicalDepartId ? selectedOptions[selectedOptions.length - 1].technicalDepartId : undefined
            detailInfo.techManagerId = selectedOptions[selectedOptions.length - 1].technicalManagerId ? selectedOptions[selectedOptions.length - 1].technicalManagerId : undefined
        } else {
            detailInfo.bizDepartmentId = undefined
            detailInfo.bizManagerId = undefined
            detailInfo.techDepartmentId = undefined
            detailInfo.techManagerId = undefined
        }
        detailInfo.classId = value
        await this.setState({
            detailInfo,
            bizUserList: [],
            techUserList: [],
        })
        this.getBizUserList()
        this.getTechUserList()
    }
    changeDetailSelect = async (name, e, node) => {
        let { detailInfo } = this.state
        if (name == 'dateFrequency') {
            detailInfo.lifeCycle.dateFrequency = e
        } else if (name == 'type') {
            detailInfo.lifeCycle[name] = e.target.value
        } else if (name == 'frequencyNum') {
            // detailInfo.lifeCycle[name] = e.target.value?(Number(e.target.value) || detailInfo[name]):undefined
            detailInfo.lifeCycle[name] = e
        } else if (name == 'subType') {
            detailInfo.lifeCycle[name] = e.target.checked ? 0 : 1
        } else {
            detailInfo[name] = e
            if (name == 'securityLevel') {
                detailInfo.securityLevelName = node.props.children
            }
        }
        await this.setState({
            detailInfo,
        })
        if (name == 'bizDepartmentId') {
            this.getBizUserList()
        }
        if (name == 'techDepartmentId') {
            this.getTechUserList()
        }
        if (name == 'securityLevel') {
            this.setColumnSecurityLevel()
        }
    }
    setColumnSecurityLevel = () => {
        let { detailInfo, partionTableData, tableData } = this.state
        partionTableData.map((item) => {
            if (!item.securityLevel) {
                item.securityLevel = detailInfo.securityLevel
                item.securityLevelName = detailInfo.securityLevelName
            } else {
                if (item.securityLevel < detailInfo.securityLevel) {
                    item.securityLevel = detailInfo.securityLevel
                    item.securityLevelName = detailInfo.securityLevelName
                }
            }
        })
        tableData.map((item) => {
            if (!item.securityLevel) {
                item.securityLevel = detailInfo.securityLevel
                item.securityLevelName = detailInfo.securityLevelName
            } else {
                if (item.securityLevel < detailInfo.securityLevel) {
                    item.securityLevel = detailInfo.securityLevel
                    item.securityLevelName = detailInfo.securityLevelName
                }
            }
        })
        this.setState({
            tableData,
            partionTableData,
        })
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    getSecurityLevel = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    getBizUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.detailInfo.bizDepartmentId,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                bizUserList: res.data,
            })
        }
    }
    getTechUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.detailInfo.techDepartmentId,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                techUserList: res.data,
            })
        }
    }
    getColumnCheckData = (data) => {
        let { selectedIndex, tableData, partionTableData, isPartion } = this.state
        if (isPartion) {
            partionTableData[selectedIndex] = { ...data }
            this.setState({
                partionTableData: partionTableData.concat(),
            })
        } else {
            tableData[selectedIndex] = { ...data }
            this.setState({
                tableData: tableData.concat(),
            })
        }
    }
    setAuditNumber = (value) => {
        let { detailInfo } = this.state
        detailInfo.needAuditRootCount = value
        this.setState({
            detailInfo,
        })
        this.getAuditRecord()
    }
    render() {
        let { detailInfo, queryInfo, loading, saveLoading, bizTreeData, departmentList, bizUserList, techUserList, levelList, partionTableData, tableData, auditRecordList } = this.state
        return (
            <div className='dgdlDetail dgdlTableManage' style={{ paddingBottom: 40 }}>
                <TableLayout
                    disabledDefaultFooter
                    showFooterControl={true}
                    title={detailInfo.tableNameCn + '（' + detailInfo.tableNameEn + '）'}
                    renderHeaderExtra={() => {
                        if (detailInfo.needAuditRootCount) {
                            return (
                                <Alert
                                    message={
                                        <div>
                                            表或字段名中存在 {detailInfo.needAuditRootCount} 个备选词根，请先进行词根审批。
                                            <a onClick={this.openRootListCheckModal} style={{ color: '#FF9900' }}>
                                                审批<span className='iconfont icon-you'></span>
                                            </a>
                                        </div>
                                    }
                                    type='warning'
                                    showIcon
                                />
                            )
                        } else {
                            return ''
                        }
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={loading} type='primary' onClick={this.saveData.bind(this, 1)}>
                                    完成治理
                                </Button>
                                <Button loading={saveLoading} type='primary' onClick={this.saveData.bind(this, 0)}>
                                    保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <div>
                                <Module title='基本信息'>
                                    <Form className='MiniForm Grid4'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '所属数据源',
                                                content: detailInfo.datasourceName,
                                            },
                                            {
                                                label: '表分组',
                                                content: detailInfo.groupCodeName,
                                            },
                                            {
                                                label: '创建人',
                                                content: detailInfo.createUser,
                                            },
                                            {
                                                label: '创建时间',
                                                content: detailInfo.createTime,
                                            },
                                        ])}
                                    </Form>
                                </Module>
                            </div>
                        )
                    }}
                />
                <Module title={this.renderModuleTitle('表治理')} style={{ marginTop: 16 }}>
                    <Form className='EditMiniForm Grid2'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '表分类',
                                content: (
                                    <Cascader
                                        allowClear={false}
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        options={bizTreeData}
                                        value={detailInfo.classId}
                                        displayRender={(e) => e.join('-')}
                                        onChange={this.changeClassify}
                                        popupClassName='searchCascader'
                                        placeholder='请选择'
                                    />
                                ),
                            },
                            {
                                label: '业务信息',
                                content: (
                                    <div className='Grid2' style={{ columnGap: 8 }}>
                                        <Select onChange={this.changeDetailSelect.bind(this, 'bizDepartmentId')} value={detailInfo.bizDepartmentId} placeholder='归属部门'>
                                            {departmentList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.departName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <Select onChange={this.changeDetailSelect.bind(this, 'bizManagerId')} value={detailInfo.bizManagerId} placeholder='负责人 '>
                                            {bizUserList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.realname}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                ),
                            },
                            {
                                label: '技术信息',
                                content: (
                                    <div className='Grid2' style={{ columnGap: 8 }}>
                                        <Select onChange={this.changeDetailSelect.bind(this, 'techDepartmentId')} value={detailInfo.techDepartmentId} placeholder='归属部门'>
                                            {departmentList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.departName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <Select onChange={this.changeDetailSelect.bind(this, 'techManagerId')} value={detailInfo.techManagerId} placeholder='负责人'>
                                            {techUserList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.realname}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                ),
                            },
                            // {
                            //     label: '表安全级别',
                            //     content: <Select onChange={this.changeDetailSelect.bind(this, 'securityLevel')} value={detailInfo.securityLevel} placeholder='安全等级'>
                            //         {levelList.map((item) => {
                            //             return (
                            //                 <Option name={item.name} value={item.id} key={item.id}>
                            //                     {item.name}
                            //                 </Option>
                            //             )
                            //         })}
                            //     </Select>,
                            // },
                            {
                                label: '生命周期',
                                content: (
                                    <div>
                                        <Radio.Group value={detailInfo.lifeCycle.type} onChange={this.changeDetailSelect.bind(this, 'type')}>
                                            <Radio value={0}>永久保存</Radio>
                                            <Radio value={1}>周期性</Radio>
                                            <Radio value={2}>自定义</Radio>
                                        </Radio.Group>
                                        {detailInfo.lifeCycle.type == 0 ? (
                                            <div className='stringArea'>
                                                <Checkbox onChange={this.changeDetailSelect.bind(this, 'subType')} checked={detailInfo.lifeCycle.subType == 0}>
                                                    冷储存
                                                </Checkbox>
                                            </div>
                                        ) : (
                                            <div className='stringArea'>
                                                <Input.Group compact>
                                                    <InputNumber
                                                        style={{ width: '30%' }}
                                                        placeholder='数值'
                                                        max={99}
                                                        min={0}
                                                        value={detailInfo.lifeCycle.frequencyNum}
                                                        onChange={this.changeDetailSelect.bind(this, 'frequencyNum')}
                                                    />
                                                    <Select style={{ width: '30%' }} value={detailInfo.lifeCycle.dateFrequency} onChange={this.changeDetailSelect.bind(this, 'dateFrequency')}>
                                                        <Select.Option key={0} value={0}>
                                                            日
                                                        </Select.Option>
                                                        <Select.Option key={1} value={1}>
                                                            月
                                                        </Select.Option>
                                                        <Select.Option key={2} value={2}>
                                                            周
                                                        </Select.Option>
                                                        <Select.Option key={3} value={3}>
                                                            季度
                                                        </Select.Option>
                                                        <Select.Option key={4} value={4}>
                                                            年
                                                        </Select.Option>
                                                    </Select>
                                                    {detailInfo.lifeCycle.type == 2 ? <span style={{ margin: '5px 0 0 8px' }}>无使用，删除</span> : null}
                                                </Input.Group>
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                        ])}
                    </Form>
                </Module>
                <Module title={this.renderModuleTitle('字段治理')} style={{ marginTop: 16, paddingBottom: 60 }}>
                    <ExpandTable
                        ref={(dom) => (this.expandTable = dom)}
                        expandable={true}
                        defaultExpandAll={true}
                        tableProps={{
                            rowKey: 'id',
                            columns: this.columns,
                            dataSource: tableData,
                            pagination: false,
                        }}
                        renderSearch={() => {
                            return null
                        }}
                        expandedRowRenderDetail={(record, index) => {
                            return (
                                <div className='expandArea'>
                                    <span className='manageIcon'>治理信息</span>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '数据标准',
                                            content: record.standardName,
                                        },
                                        // {
                                        //     label: '安全等级',
                                        //     content: record.securityLevelName,
                                        // },
                                        // {
                                        //     label: '敏感标签',
                                        //     content: record.desensitiseTagName,
                                        // },
                                        {
                                            label: '质量规则',
                                            content: (
                                                <div>
                                                    {record.qaRuleNameList &&
                                                        record.qaRuleNameList.map((item, index1) => {
                                                            return (
                                                                <span>
                                                                    {item.ruleName}
                                                                    {index1 + 1 == record.qaRuleNameList.length ? '' : '，'}
                                                                </span>
                                                            )
                                                        })}
                                                </div>
                                            ),
                                        },
                                    ])}
                                </div>
                            )
                        }}
                        requestListFunction={(page, pageSize) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </Module>
                {partionTableData.length ? (
                    <Module title={this.renderModuleTitle('分区字段治理')} style={{ marginTop: 16, paddingBottom: 60 }}>
                        <ExpandTable
                            ref={(dom) => (this.expandTable1 = dom)}
                            expandable={true}
                            defaultExpandAll={true}
                            tableProps={{
                                rowKey: 'id',
                                columns: this.partionColumns,
                                dataSource: partionTableData,
                                pagination: false,
                            }}
                            renderSearch={() => {
                                return null
                            }}
                            expandedRowRenderDetail={(record, index) => {
                                return (
                                    <div className='expandArea'>
                                        <span className='manageIcon'>治理信息</span>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '数据标准',
                                                content: record.standardName,
                                            },
                                            // {
                                            //     label: '安全等级',
                                            //     content: record.securityLevelName,
                                            // },
                                            // {
                                            //     label: '敏感标签',
                                            //     content: record.desensitiseTagName,
                                            // },
                                            {
                                                label: '质量规则',
                                                content: (
                                                    <div>
                                                        {record.qaRuleNameList &&
                                                            record.qaRuleNameList.map((item, index1) => {
                                                                return (
                                                                    <span>
                                                                        {item.ruleName}
                                                                        {index1 + 1 == record.qaRuleNameList.length ? '' : '，'}
                                                                    </span>
                                                                )
                                                            })}
                                                    </div>
                                                ),
                                            },
                                        ])}
                                    </div>
                                )
                            }}
                            requestListFunction={(page, pageSize) => {
                                return this.getPartionTableList({
                                    pagination: {
                                        page,
                                        page_size: pageSize,
                                    },
                                })
                            }}
                        />
                    </Module>
                ) : null}
                <RootCheckDrawer setAuditNumber={this.setAuditNumber} ref={(dom) => (this.rootCheckDrawer = dom)} />
                <RootDetailDrawer ref={(dom) => (this.rootDetailDrawer = dom)} />
                <ColumnCheckDrawer getColumnCheckData={this.getColumnCheckData} ref={(dom) => (this.columnCheckDrawer = dom)} />
                <RootWindow
                    openModal={this.openRootDetailModal}
                    renderNumber={() => {
                        return <span>{auditRecordList.length}</span>
                    }}
                />
            </div>
        )
    }
}
