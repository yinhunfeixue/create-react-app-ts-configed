import CollapseLabel from '@/component/collapseLabel/CollapseLabel'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Col, Divider, Input, InputNumber, message, Popconfirm, Row, Select, Spin, Tooltip, Form } from 'antd'
import { createTechRule, deleteRuleList, getDatabaseCondition, getDatasourceCondition, getTechRuleById, techRuleList, toSql, updateTechRule } from 'app_api/examinationApi'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import moment from 'moment'
import React, { Component } from 'react'
import BatchTransfer from '../component/batchTransfer'
import CheckColumn from '../component/checkColumn'
import ColumnFilter from '../component/columnFilter'
import DependColumn from '../component/dependColumn'
import RuleDetailDrawer from '../component/ruleDetailDrawer'
import ValidateCode from '../component/validateCode'
import ValidateContent from '../component/validateContent'
import ValidateLength from '../component/validateLength'
import '../index.less'
import ProjectUtil from '@/utils/ProjectUtil'


const FormItem = Form.Item
const { TextArea } = Input

const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}

class TechRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleInfo: {},
            ruleParam: {},
            hasParam: '',
            queryInfo: {
                keyword: '',
            },
            columnInfo: {
                datasourceId: undefined,
                databaseId: undefined,
                tableId: undefined,
                columnId: undefined,
            },
            ruleCondition: {
                expression: '',
            },
            sourceList: [],
            baseList: [],
            addRuleModal: false,
            type: 'add',
            addType: 'single',
            techRuleInfo: {
                columnEntityList: [],
                filterParam: '',
            },
            sqlLoading: false,
            btnLoading: false,
            ruleLevel: 0,
        }
        this.columns = [
            {
                title: '检核字段',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 150,
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
                title: '表',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
                width: 140,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
                width: 140,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '问题级别',
                dataIndex: 'severityLevelDesc',
                key: 'severityLevelDesc',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '阈值',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 100,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
        ]
        this.tableColumns = [
            {
                title: '检核表',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
                width: 140,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
                width: 140,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '问题级别',
                dataIndex: 'severityLevelDesc',
                key: 'severityLevelDesc',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.form = {}
    }
    componentWillMount = async () => {
        this.init()
        await this.setState({
            ruleInfo: this.props.location.state,
            hasParam: JSON.parse(this.props.location.state.ruleParam).hasParam,
            ruleLevel: this.pageParams.ruleLevel
        })
        this.getSourceData()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getSourceData = async () => {
        let res = await getDatasourceCondition({ bizRuleId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDatabaseList = async () => {
        let { queryInfo } = this.state
        let query = {
            datasourceId: queryInfo.datasourceId,
            bizRuleId: this.props.location.state.id,
        }
        let res = await getDatabaseCondition(query)
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, ruleLevel } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            bizRuleId: this.props.location.state.id,
            ...queryInfo,
            ruleLevel
        }
        let res = await techRuleList(query)
        if (res.code == 200) {
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
            baseList: [],
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        if (name == 'datasourceId') {
            queryInfo.databaseId = undefined
            this.setState({
                queryInfo,
            })
            this.getDatabaseList()
        }
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    deleteData = async (data) => {
        let res = await deleteRuleList([data.id])
        if (res.code == 200) {
            message.success('操作成功')
            this.search()
        }
    }
    renderContent = () => {
        let { ruleInfo, ruleParam, hasParam } = this.state
        return (
            <div>
                {hasParam == 0 ? <span style={{ color: '#C4C8CC' }}>无参数</span> : null}
                {hasParam == 2 ? <span style={{ color: '#C4C8CC' }}>无配置</span> : null}
                {hasParam == 1 ? <span>{ruleInfo.ruleContent}</span> : null}
            </div>
        )
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value} />
    }
    cancel = () => {
        this.setState({
            addRuleModal: false,
        })
    }
    openAddRuleModal = async (type, data) => {
        let { ruleInfo, ruleParam, hasParam, techRuleInfo, columnInfo, ruleCondition } = this.state
        await this.setState({
            addRuleModal: true,
            addType: 'single',
            type,
        })
        if (type == 'add') {
            techRuleInfo = {
                columnEntityList: [],
                filterParam: '',
            }
            ruleCondition = {
                unionUnique: false,
                expression: '',
            }
            columnInfo = {
                datasourceId: undefined,
                databaseId: undefined,
                tableId: undefined,
                columnId: undefined,
            }
            setTimeout(() => {
                this.form.setFieldsValue({
                    passRate: '',
                    severityLevel: undefined,
                })
            }, 100)
            this.checkColumn && this.checkColumn.getRuleData(columnInfo)
            ruleParam = JSON.parse(this.props.location.state.ruleParam)
            ruleParam.hasParam = 1
            await this.setState({
                columnInfo,
                techRuleInfo,
                ruleParam,
                ruleCondition,
            })
            this.initComponent()
        } else {
            let res = await getTechRuleById({ id: data.id })
            if (res.code == 200) {
                columnInfo = {
                    datasourceId: res.data.datasourceId,
                    datasourceName: res.data.datasourceName,
                    databaseId: res.data.databaseId,
                    databaseName: res.data.databaseName,
                    tableId: res.data.tableId,
                    tableName: res.data.tableName,
                    columnId: res.data.columnId,
                    columnName: res.data.columnName,
                }
                if (res.data.ruleCondition !== undefined) {
                    ruleCondition = JSON.parse(res.data.ruleCondition)
                }
                ruleParam = JSON.parse(res.data.ruleParam)
                if (ruleParam.type == 3) {
                    ruleParam.value = moment(ruleParam.value)
                }
                techRuleInfo.columnEntityList = [columnInfo]
                techRuleInfo.id = res.data.id
                techRuleInfo.filterParam = res.data.filterParam
                techRuleInfo.passRate = res.data.passRate
                techRuleInfo.severityLevel = res.data.severityLevel
                techRuleInfo.sqlText = res.data.sqlText
                console.log(ruleParam, 'ruleparam')
                await this.setState({
                    techRuleInfo,
                    columnInfo,
                    ruleParam,
                    ruleCondition,
                })
                console.log(this.form, 'this.form+++')
                await this.initComponent()
                setTimeout(() => {
                    this.form.setFieldsValue({
                        content: ruleParam.content,
                        operator: ruleParam.operator,
                        regexp: ruleParam.regexp,
                        value: ruleParam.value,
                        idCards: ruleParam.idCards,
                        passRate: res.data.passRate,
                        severityLevel: res.data.severityLevel,
                    })
                }, 100)
            }
        }
        this.checkColumn && this.checkColumn.getRuleData(columnInfo)
    }
    initComponent = () => {
        this.validateLength && this.validateLength.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.dependColumn && this.dependColumn.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.validateContent && this.validateContent.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.validateCode && this.validateCode.getRuleData(this.state.ruleInfo, this.state.ruleParam)
    }
    init = async () => {
        let { ruleParam } = this.state
        ruleParam = {
            datasource: { id: undefined, name: '' },
            database: { id: undefined, name: '' },
            table: { id: undefined, name: '' },
            column: { id: undefined, name: '' },
            code: { id: undefined, name: '' },
            containContents: [],
            specialChars: [],
            isContain: 1,
            values: [],
            value: '',
            hasParam: 0,
            needMerge: false,
            minOperator: '<=',
            maxOperator: '<=',
            type: 1,
            dateFormat: 'YYYYMMDD',
        }
        await this.setState({
            ruleParam,
        })
        this.initComponent()
    }
    getRuleDetail = async (data) => {
        let res = await getTechRuleById({ id: data.id })
        if (res.code == 200) {
            this.ruleDetailDrawer && this.ruleDetailDrawer.openModal(res.data, this.state.ruleLevel)
        }
    }
    changeAddType = async (value) => {
        let { techRuleInfo, columnInfo } = this.state
        techRuleInfo.columnEntityList = []
        techRuleInfo.sqlText = ''
        columnInfo = {
            datasourceId: undefined,
            databaseId: undefined,
            tableId: undefined,
            columnId: undefined,
        }
        await this.setState({
            addType: value,
            techRuleInfo,
            columnInfo,
        })
        if (value == 'single') {
            this.checkColumn && this.checkColumn.getRuleData(this.state.columnInfo)
        }
    }
    getNewColumnInfo = (data) => {
        let { techRuleInfo } = this.state
        techRuleInfo.columnEntityList = [data]
        techRuleInfo.filterParam = ''
        techRuleInfo.sqlText = ''
        this.setState({
            techRuleInfo,
            columnInfo: data,
        })
    }
    changeSelect = (name, e) => {
        let { techRuleInfo } = this.state
        techRuleInfo[name] = e
        this.setState({
            techRuleInfo,
        })
    }
    handleInputChange = (name, e) => {
        let { techRuleInfo } = this.state
        if (name == 'passRate') {
            techRuleInfo[name] = e.target.value ? Number(e.target.value) || techRuleInfo[name] : undefined
        } else {
            techRuleInfo[name] = e.target.value
        }
        this.setState({
            techRuleInfo,
        })
    }
    checkBeforePost = () => {
        let { ruleInfo, ruleParam, techRuleInfo, addType, columnInfo, ruleCondition } = this.state
        console.log(ruleParam, techRuleInfo, 'ruleParam')
        if (ruleParam.minValueMsg) {
            return false
        }
        if (ruleParam.hasParam == 1 && ruleParam.content == 1 && !ruleParam.containContents.length) {
            message.info('请选择内容规范')
            return false
        }
        if (ruleParam.hasParam == 1 && ruleParam.content == 1 && ruleParam.isContain == 1 && ruleParam.hasSp && !ruleParam.specialChars.length) {
            message.info('特殊字符不能为空')
            return false
        }
        if (addType == 'single' && !columnInfo.columnId) {
            message.info('请选择检核字段')
            return false
        }
        if (ruleInfo.ruleTypeId == 'JHFL44' && !ruleCondition.expression) {
            message.info('请填写逻辑表达式')
            return false
        }
        if (addType == 'batch' && !techRuleInfo.columnEntityList.length) {
            message.info('请选择检核字段')
            return false
        }
        if (!techRuleInfo.severityLevel) {
            message.info('请选择问题级别')
            return false
        }
        if (!techRuleInfo.passRate) {
            message.info('请填写阈值')
            return false
        }
        return true
    }
    getSql = async () => {
        let { ruleInfo, ruleParam, techRuleInfo, ruleCondition } = this.state
        if (!this.checkBeforePost()) {
            return
        }
        this.form.validateFields().then((values) => {
            let queryParam = this.queryFormat(ruleParam)
            let query = {
                ...techRuleInfo,
                bizRuleId: ruleInfo.id,
                ruleParam: JSON.stringify(queryParam),
                ruleCondition: JSON.stringify(ruleCondition),
            }
            this.setState({ sqlLoading: true })
            toSql(query).then((res) => {
                this.setState({ sqlLoading: false })
                if (res.code == 200) {
                    techRuleInfo.sqlText = res.data.sql
                    this.setState({
                        techRuleInfo,
                    })
                }
            })
        })
    }
    postData = () => {
        let { ruleInfo, ruleParam, techRuleInfo, type, ruleCondition } = this.state
        if (!this.checkBeforePost()) {
            return
        }
        this.form.validateFields().then((values) => {
            let queryParam = this.queryFormat(ruleParam)
            let query = {
                ...techRuleInfo,
                bizRuleId: ruleInfo.id,
                ruleParam: JSON.stringify(queryParam),
                ruleCondition: JSON.stringify(ruleCondition),
            }
            this.setState({ btnLoading: true })
            if (type == 'add') {
                createTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.search()
                        this.getSourceData()
                    }
                })
            } else {
                updateTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.search()
                    }
                })
            }
        })
    }
    renderSeverity = () => {
        return (
            <FormItem
                name='severityLevel'
                rules={[
                    {
                        required: true,
                        message: '请选择问题级别!',
                    },
                ]}
                label='问题级别'
                {...tailFormItemLayout}
            >
                <Select onChange={this.changeSelect.bind(this, 'severityLevel')} placeholder='请选择'>
                    <Option value={1} key={1}>
                        普通
                    </Option>
                    <Option value={2} key={2}>
                        严重
                    </Option>
                </Select>
            </FormItem>
        )
    }
    queryFormat = (ruleParam) => {
        let { ruleInfo } = this.state
        switch (ruleInfo.ruleTypeId) {
            case 'JHFL43':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL38':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL42':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL44':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                }
                break
            case 'JHFL45':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                    datasource: ruleParam.datasource,
                    database: ruleParam.database,
                    table: ruleParam.table,
                    column: ruleParam.column,
                }
                break
            case 'JHFL40':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL41':
                delete ruleParam.datasource
                delete ruleParam.database
                delete ruleParam.table
                delete ruleParam.column
                delete ruleParam.code
                break
            case 'JHFL39':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                    datasource: ruleParam.datasource,
                    database: ruleParam.database,
                    code: ruleParam.code,
                    values: ruleParam.values,
                }
                break
            default:
                break
        }
        return ruleParam
    }
    renderPassRate = () => {
        let { techRuleInfo } = this.state
        return (
            <FormItem
                name='passRate'
                rules={[
                    {
                        required: true,
                        message: '请输入阈值!',
                    },
                ]}
                label='阈值'
                {...tailFormItemLayout}
            >
                <div style={{ position: 'relative' }}>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={techRuleInfo.passRate}
                        placeholder='请输入数字'
                        onChange={this.changeSelect.bind(this, 'passRate')}
                        min={0.01}
                        max={100}
                        precision={2}
                        // formatter={value => `${value}%`}
                        // parser={value => value.replace('%', '')}
                    />
                    <span style={{ position: 'absolute', right: '18px', top: '8px' }}>%</span>
                </div>
            </FormItem>
        )
    }
    renderLogic = () => {
        let { ruleCondition } = this.state
        return (
            <FormItem required label='逻辑表达式' {...tailFormItemLayout}>
                <Input
                    readOnly
                    placeholder='点击设置逻辑表达式'
                    value={ruleCondition.expression}
                    onClick={this.openLogicModal}
                    suffix={
                        <span onClick={this.openLogicModal} style={{ cursor: 'pointer' }}>
                            ···
                        </span>
                    }
                />
            </FormItem>
        )
    }
    openLogicModal = () => {
        let { addType, columnInfo, ruleCondition, techRuleInfo } = this.state
        if (addType == 'single' && !columnInfo.columnId) {
            message.info('请选择检核字段')
            return false
        }
        if (addType == 'batch' && !techRuleInfo.columnEntityList.length) {
            message.info('请选择检核字段')
            return false
        }
        this.logicFilter && this.logicFilter.openModal(ruleCondition.expression, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName)
    }
    renderFilter = () => {
        let { techRuleInfo } = this.state
        return (
            <FormItem label='过滤条件' {...tailFormItemLayout}>
                <Input
                    readOnly
                    placeholder='点击设置过滤条件'
                    value={techRuleInfo.filterParam}
                    onClick={this.openFilterModal}
                    suffix={
                        <span onClick={this.openFilterModal} style={{ cursor: 'pointer' }}>
                            ···
                        </span>
                    }
                />
            </FormItem>
        )
    }
    openFilterModal = () => {
        let { addType, columnInfo, techRuleInfo } = this.state
        if (addType == 'single' && !columnInfo.columnId) {
            message.info('请选择检核字段')
            return false
        }
        if (addType == 'batch' && !techRuleInfo.columnEntityList.length) {
            message.info('请选择检核字段')
            return false
        }
        this.columnFilter && this.columnFilter.openModal(techRuleInfo.filterParam, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName)
    }
    getColumnEntityList = (data) => {
        let { techRuleInfo } = this.state
        techRuleInfo.columnEntityList = data
        this.setState({
            techRuleInfo,
        })
    }
    getNewRuleParam = (data) => {
        this.setState({
            ruleParam: data,
        })
    }
    getFilterParam = (data) => {
        let { techRuleInfo } = this.state
        techRuleInfo.filterParam = data
        this.setState({
            techRuleInfo,
        })
    }
    getLogicFilter = (data) => {
        let { ruleCondition } = this.state
        ruleCondition.expression = data
        this.setState({
            ruleCondition,
        })
    }
    render() {
        const { ruleLevel, queryInfo, techRuleInfo, ruleInfo, sourceList, baseList, type, addRuleModal, addType, sqlLoading, btnLoading, ruleParam, hasParam, columnInfo, ruleCondition } = this.state
        return (
            <React.Fragment>
                <div className='techRule'>
                    <TableLayout
                        disabledDefaultFooter
                        title={ruleInfo.ruleName}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='规则信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '规则分组',
                                                    content: ruleInfo.bizRuleGroupName,
                                                },
                                                {
                                                    label: '规则类型',
                                                    content: ruleInfo.ruleTypePath,
                                                },
                                                {
                                                    label: '规则内容',
                                                    content: this.renderContent(),
                                                },
                                                {
                                                    label: '规则描述',
                                                    content: <div style={{maxWidth: 400}}>{ruleInfo.ruleDesc ? this.renderDesc(ruleInfo.ruleDesc, 'collapseLabel') : ''}</div>,
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return (
                                <ModuleTitle
                                    style={{ marginBottom: 15 }}
                                    title='核验字段'
                                    // renderHeaderExtra={() => {
                                    //     return (
                                    //         <Button type='primary' onClick={this.openAddRuleModal.bind(this, 'add')}>
                                    //             添加核验字段
                                    //         </Button>
                                    //     )
                                    // }}
                                />
                            )
                        }}
                        editColumnProps={{
                            width: 160,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a onClick={this.getRuleDetail.bind(this, record)} key='detail'>
                                        详情
                                    </a>,
                                    // <a onClick={this.openAddRuleModal.bind(this, 'edit', record)} key='edit'>
                                    //     编辑
                                    // </a>,
                                    // <Popconfirm placement='topLeft' title='确定要删除检核字段吗？' onConfirm={this.deleteData.bind(this, record)} okText='确定' cancelText='取消'>
                                    //     <a key='delete'>删除</a>
                                    // </Popconfirm>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: ruleLevel == 0 ? this.columns : this.tableColumns,
                            key: 'tableNameEn',
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder={ruleLevel == 0 ? '请输入字段名称' : '请输入表名称'} />
                                    <Select allowClear showSearch optionFilterProp='title' placeholder='数据源' value={queryInfo.datasourceId} onChange={this.changeStatus.bind(this, 'datasourceId')}>
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear showSearch optionFilterProp='title' placeholder='数据库' value={queryInfo.databaseId} onChange={this.changeStatus.bind(this, 'databaseId')}>
                                        {baseList.map((item) => {
                                            return (
                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'severity')} value={queryInfo.severity} placeholder='问题级别' style={{ width: 160 }}>
                                        <Option value={1} key={1}>
                                            普通
                                        </Option>
                                        <Option value={2} key={2}>
                                            严重
                                        </Option>
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <RuleDetailDrawer
                    ref={(dom) => {
                        this.ruleDetailDrawer = dom
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: type == 'add' ? '添加规则' : '编辑规则',
                        className: 'techRuleDrawer',
                        width: 960,
                        visible: addRuleModal,
                        onClose: this.cancel,
                        forceRender: true,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                    保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {addRuleModal && (
                        <React.Fragment>
                            <Form style={{ display: 'block' }} className='DetailPart addRuleInfo' layout='inline'>
                                <h3>{ruleInfo.ruleName}</h3>
                                <span className='ruleInfo'>{ruleInfo.bizRuleGroupName}</span>
                                <Divider style={{ margin: '0 16px' }} type='vertical' />
                                <span className='ruleInfo'>{ruleInfo.ruleTypePath}</span>
                                <Divider style={{ margin: '0 16px' }} type='vertical' />
                                <span className='ruleInfo'>{ruleInfo.ruleContent}</span>
                            </Form>
                            <ModuleTitle title='选择字段' />
                            {type == 'add' ? (
                                <div className='tabBtn'>
                                    <div onClick={this.changeAddType.bind(this, 'single')} className={addType == 'single' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                        {addType == 'single' ? <SvgIcon name='icon_tag_top' /> : null}
                                        <span>单个</span>
                                    </div>
                                    <div onClick={this.changeAddType.bind(this, 'batch')} className={addType == 'batch' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                        {addType == 'batch' ? <SvgIcon name='icon_tag_top' /> : null}
                                        <span>批量</span>
                                    </div>
                                </div>
                            ) : null}
                            <Form ref={(target) => (this.form = target)} style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }} className='EditMiniForm ruleForm'>
                                {addType == 'single' ? (
                                    <div>
                                        <CheckColumn
                                            ref={(dom) => {
                                                this.checkColumn = dom
                                            }}
                                            columnInfo={columnInfo}
                                            getNewcolumnInfo={this.getNewColumnInfo}
                                            pageType={type}
                                        />
                                    </div>
                                ) : null}
                                {addType == 'batch' ? (
                                    <div>
                                        <BatchTransfer getColumnEntityList={this.getColumnEntityList} />
                                    </div>
                                ) : null}
                                <Divider style={{ margin: 0 }} />
                                <ModuleTitle title='配置规则' />
                                {hasParam !== 0 ? (
                                    <div style={{ width: 520 }}>
                                        {/*值域有效性*/}
                                        {hasParam == 2 && (ruleInfo.ruleTypeId == 'JHFL42' || ruleInfo.ruleTypeId == 'JHFL41') ? (
                                            <ValidateLength
                                                ref={(dom) => {
                                                    this.validateLength = dom
                                                }}
                                                setFieldsValue={this.form ? this.form.setFieldsValue : ''}
                                                ruleInfo={ruleInfo}
                                                ruleParam={ruleParam}
                                                getNewRuleParam={this.getNewRuleParam}
                                                required={true}
                                            />
                                        ) : null}
                                        {hasParam == 1 && (ruleInfo.ruleTypeId == 'JHFL42' || ruleInfo.ruleTypeId == 'JHFL41') ? (
                                            <FormItem required label={ruleInfo.ruleTypeId == 'JHFL42' ? '取值范围（已配置）' : '长度要求（已配置）'} {...tailFormItemLayout}>
                                                {ruleInfo.ruleContent}
                                            </FormItem>
                                        ) : null}
                                        {/*依赖一致性*/}
                                        {hasParam == 2 && ruleInfo.ruleTypeId == 'JHFL45' ? (
                                            <DependColumn
                                                ref={(dom) => {
                                                    this.dependColumn = dom
                                                }}
                                                setFieldsValue={this.form ? this.form.setFieldsValue : ''}
                                                ruleParam={ruleParam}
                                                getNewRuleParam={this.getNewRuleParam}
                                                required={true}
                                            />
                                        ) : null}
                                        {hasParam == 1 && ruleInfo.ruleTypeId == 'JHFL45' ? (
                                            <FormItem required label='依赖字段（已配置）' {...tailFormItemLayout}>
                                                {ruleInfo.ruleContent}
                                            </FormItem>
                                        ) : null}
                                        {hasParam == 2 && ruleInfo.ruleTypeId == 'JHFL40' ? (
                                            <ValidateContent
                                                ref={(dom) => {
                                                    this.validateContent = dom
                                                }}
                                                setFieldsValue={this.form ? this.form.setFieldsValue : ''}
                                                ruleInfo={ruleInfo}
                                                ruleParam={ruleParam}
                                                getNewRuleParam={this.getNewRuleParam}
                                                required={true}
                                            />
                                        ) : null}
                                        {hasParam == 1 && ruleInfo.ruleTypeId == 'JHFL40' ? (
                                            <FormItem required label='内容规范（已配置）' {...tailFormItemLayout}>
                                                {ruleInfo.ruleContent}
                                            </FormItem>
                                        ) : null}
                                        {hasParam == 2 && ruleInfo.ruleTypeId == 'JHFL39' ? (
                                            <ValidateCode
                                                ref={(dom) => {
                                                    this.validateCode = dom
                                                }}
                                                setFieldsValue={this.form ? this.form.setFieldsValue : ''}
                                                ruleInfo={ruleInfo}
                                                ruleParam={ruleParam}
                                                getNewRuleParam={this.getNewRuleParam}
                                                required={true}
                                            />
                                        ) : null}
                                        {hasParam == 1 && ruleInfo.ruleTypeId == 'JHFL39' ? (
                                            <FormItem required label='代码项（已配置）' {...tailFormItemLayout}>
                                                {ruleInfo.ruleContent}
                                            </FormItem>
                                        ) : null}
                                    </div>
                                ) : null}
                                {ruleInfo.ruleTypeId == 'JHFL44' ? (
                                    <Row gutter={8}>
                                        <Col span={12}>{this.renderLogic()}</Col>
                                    </Row>
                                ) : null}
                                <Row gutter={8}>
                                    {addType == 'single' ? <Col span={12}>{this.renderFilter()}</Col> : null}
                                    <Col span={6}>{this.renderSeverity()}</Col>
                                    <Col span={6}>{this.renderPassRate()}</Col>
                                </Row>
                                {addType == 'single' ? (
                                    <div>
                                        <Divider style={{ margin: 0 }} />
                                        <ModuleTitle
                                            style={{ margin: '18px 0 10px 0' }}
                                            title='SQL预览'
                                            renderHeaderExtra={() => {
                                                return (
                                                    <Button type='primary' ghost onClick={this.getSql}>
                                                        生成SQL
                                                    </Button>
                                                )
                                            }}
                                        />
                                        <Spin spinning={sqlLoading}>
                                            <TextArea placeholder='SQL预览区' disabled={true} value={techRuleInfo.sqlText} />
                                        </Spin>
                                    </div>
                                ) : null}
                            </Form>
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <ColumnFilter
                    value={techRuleInfo.filterParam}
                    getFilterParam={this.getFilterParam}
                    ref={(dom) => {
                        this.columnFilter = dom
                    }}
                />
                <ColumnFilter
                    value={ruleCondition.expression}
                    getFilterParam={this.getLogicFilter}
                    ref={(dom) => {
                        this.logicFilter = dom
                    }}
                />
            </React.Fragment>
        )
    }
}
export default TechRule
