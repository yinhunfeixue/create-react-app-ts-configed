// 添加规则
import ColumnFilter from '@/app/dama/examination/component/columnFilter'
import DependColumn from '@/app/dama/examination/component/dependColumn'
import TableRules from '@/app/dama/examination/component/tableRules'
import ValidateCode from '@/app/dama/examination/component/validateCode'
import ValidateContent from '@/app/dama/examination/component/validateContent'
import ValidateLength from '@/app/dama/examination/component/validateLength'
import DrawerLayout from '@/component/layout/DrawerLayout'
import TimingSelect from '@/component/timingSelect/TimingSelect'
import { Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, message, Popover, Radio, Select } from 'antd'
import { baseconfig, bizRuleSearch, checkRuleTree, createTechRule, dateColumns, getTechRuleById, periodExample, producePeriodFunc, queryBizRuleGroup, updateTechRule } from 'app_api/examinationApi'
import { fieldSearch, getAllRemoteFuncWithParams } from 'app_api/metadataApi'
import Cache from 'app_utils/cache'
import moment from 'moment'
import React, { Component } from 'react'
import TreeColumnFilter from '../../../component/TreeColumnFilter'
import '../../index.less'
import RuleTableModal from './ruleTableModal'

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
export default class AddRuleDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleLevel: 0,
            addRuleVisible: false,
            addTaskInfo: {
                businessData: {
                    checkRuleList: [],
                    datasourceIdName: {},
                    databaseIdName: {},
                    tableIdName: {},
                    managerIdName: {},
                    partitionInfo: {
                        isPartition: false,
                    },
                    rangeInfo: {
                        rangeType: 1,
                        fixUpdateUnit: 1,
                    },
                },
            },
            primaryKeyList: [],
            techRuleInfo: {
                filterParam: '',
                sqlSource: 0,
                relatedColumns: [],
            },
            ruleCondition: {
                unionUnique: false,
                expression: '',
            },
            ruleInfo: {},
            columnInfo: {
                sqlText: '',
            },
            ruleParam: {},
            typeList: [],
            ruleModalType: 'add',
            hasParam: 0,
            functionInfo: {
                example: '',
                granularity: 0,
                periodType: 0,
                granularityNum: 0,
            },
            popoverVisible: false,
            columnList: [],
            joinColumnList: [],
            dateColumnList: [],
            bizList: [],
            bizRuleList: [],
            funcLoading: false,
            btnLoading: false,
            ruleTypeList: [],
            remoteFuncList: [],
            selectedTable: {},
            editData: {},
        }
        this.form = {}
    }
    componentWillMount = () => {}
    getRuleTypeList = async () => {
        let res = await queryBizRuleGroup()
        if (res.code == 200) {
            this.setState({
                ruleTypeList: res.data,
            })
        }
    }
    initComponent = () => {
        this.validateLength && this.validateLength.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.dependColumn && this.dependColumn.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.validateContent && this.validateContent.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.validateCode && this.validateCode.getRuleData(this.state.ruleInfo, this.state.ruleParam)
        this.tableRules && this.tableRules.getRuleData(this.state.ruleInfo, this.state.ruleParam)
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
            relatedColumns: [],
        }
        await this.setState({
            ruleParam,
        })
        this.initComponent()
    }
    baseconfigList = async () => {
        let res = await baseconfig({ group: 'useForBiz' })
        if (res.code == 200) {
            this.setState({
                bizList: res.data,
            })
        }
    }
    getBizRuleList = async () => {
        let { ruleInfo } = this.state
        let query = {
            needAll: true,
            ruleTypeIdList: ruleInfo.ruleTypeId ? [ruleInfo.ruleTypeId] : [],
            bizRuleGroupId: ruleInfo.bizRuleGroupId,
        }
        let res = await bizRuleSearch(query)
        if (res.code == 200) {
            this.setState({
                bizRuleList: res.data,
            })
        }
    }
    clearRuleInfo = () => {
        let { ruleInfo } = this.state
        ruleInfo.id = undefined
        ruleInfo.ruleName = ''
        this.setState({
            ruleInfo,
        })
        this.getJoinColumnList()
        this.init()
    }
    getDateColumns = async () => {
        let { addTaskInfo } = this.state
        let res = await dateColumns({ tableId: addTaskInfo.businessData.tableIdName.id })
        if (res.code == 200) {
            this.setState({
                dateColumnList: res.data,
            })
        }
    }
    openModal = async (selectedTable, type, data, ruleLevel) => {
        await this.init()
        let { addTaskInfo, techRuleInfo, ruleCondition, columnInfo, ruleParam, ruleInfo, hasParam } = this.state
        addTaskInfo.businessData.datasourceIdName.id = selectedTable.datasourceId
        addTaskInfo.businessData.datasourceIdName.name = selectedTable.datasourceName
        addTaskInfo.businessData.databaseIdName.id = selectedTable.databaseId
        addTaskInfo.businessData.databaseIdName.name = selectedTable.databaseNameEn
        addTaskInfo.businessData.tableIdName.id = selectedTable.tableId
        addTaskInfo.businessData.tableIdName.name = selectedTable.name
        await this.setState({
            ruleModalType: type,
            addRuleVisible: true,
            addTaskInfo,
            ruleLevel,
            selectedTable,
            editData: data,
        })
        this.getRuleTypeList()
        this.getRuleTree()
        this.getColumnList()
        await this.getJoinColumnList()
        this.getDateColumns()
        this.baseconfigList()

        if (type == 'add') {
            techRuleInfo = {
                sqlSource: 1,
                filterParam: '',
                relatedColumns: [],
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
                sqlText: '',
                ruleName: '',
                ruleTypeId: '',
            }
            await this.getAllRemoteFuncWithParams({})
            await this.setState({
                columnInfo,
                techRuleInfo,
                ruleInfo: {},
                ruleCondition,
                // ruleParam
            })
            this.initComponent()
            this.getBizRuleList()
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
                    sqlText: res.data.sqlText,
                    sqlTotal: res.data.sqlTotal,
                    ruleName: res.data.name,
                    ruleTypeId: res.data.ruleTypeId,
                    columnExpression: res.data.columnExpression,
                }
                if (res.data.sqlSource === 1) {
                    ruleInfo = res.data.bizRuleDTO !== undefined ? res.data.bizRuleDTO : ruleInfo
                    ruleParam = res.data.ruleParam !== undefined ? JSON.parse(res.data.ruleParam) : {}
                    hasParam = JSON.parse(ruleInfo.ruleParam).hasParam
                    ruleParam.hasParam = 1
                    if (res.data.ruleCondition !== undefined) {
                        ruleCondition = JSON.parse(res.data.ruleCondition)
                        ruleCondition.relatedColumns &&
                            ruleCondition.relatedColumns.map((item) => {
                                techRuleInfo.relatedColumns.push(item.id)
                            })
                    }
                    if (ruleParam.type == 3 && ruleInfo.ruleTypeId !== 'JHFL83') {
                        ruleParam.value = moment(ruleParam.value)
                    }
                } else {
                    ruleInfo = {
                        ruleTypeId: res.data.ruleTypeId,
                        ruleTypeName: res.data.ruleTypeName,
                        ruleTypePath: res.data.ruleTypePath,
                        ruleDesc: res.data.ruleDesc,
                        id: res.data.bizRuleId,
                        bizRuleGroupId: res.data.bizRuleGroupId,
                        ruleName: res.data.name,
                    }
                }
                techRuleInfo.columnEntityList = [columnInfo]
                techRuleInfo.id = res.data.id
                techRuleInfo.filterParam = res.data.filterParam
                techRuleInfo.passRate = res.data.passRate
                techRuleInfo.severityLevel = res.data.severityLevel
                techRuleInfo.sqlSource = res.data.sqlSource
                techRuleInfo.remoteFuncId = res.data.remoteFuncId

                await this.setState({
                    techRuleInfo,
                    columnInfo,
                    ruleParam,
                    hasParam,
                    ruleCondition,
                    ruleInfo,
                })

                await this.initComponent()
                this.getBizRuleList()
                await this.getAllRemoteFuncWithParams(res.data)

                setTimeout(() => {
                    if (this.timingSelect) {
                        this.timingSelect.setValue({
                            type: ruleParam.type,
                            time: ruleParam.hour ? moment(ruleParam.hour, 'HH:mm') : undefined,
                            day: ruleParam.content,
                        })
                    }
                }, 10)
                this.form.setFieldsValue({
                    content: ruleParam.content,
                    operator: ruleParam.operator,
                    regexp: ruleParam.regexp,
                    value: ruleParam.value,
                    idCards: ruleParam.idCards,
                    passRate: res.data.passRate,
                    severityLevel: res.data.severityLevel,

                    columnId: res.data.columnId,
                    sqlText: res.data.sqlText,
                    sqlTotal: res.data.sqlTotal,
                    sqlSource: res.data.sqlSource,
                    ruleName: res.data.name,
                    remoteFuncId: res.data.remoteFuncId,
                    columnExpression: res.data.columnExpression,
                    sourceTimeColumnId: ruleParam.sourceTimeColumn ? ruleParam.sourceTimeColumn.id : '',
                    targetColumnId: ruleParam.column ? ruleParam.column.id : '',
                })
            }
        }
        Cache.set('bizRuleGroupId', '')
    }

    getColumnList = async () => {
        let { addTaskInfo } = this.state
        let query = {
            table_id: addTaskInfo.businessData.tableIdName.id,
            page: 1,
            page_size: 999999,
        }
        let res = await fieldSearch(query)
        if (res.code == 200) {
            this.setState({
                columnList: res.data,
            })
        }
    }
    getJoinColumnList = async () => {
        let { addTaskInfo, columnInfo, ruleInfo, ruleCondition, techRuleInfo } = this.state
        let query = {
            table_id: addTaskInfo.businessData.tableIdName.id,
            notInIds: (ruleInfo.ruleTypeId == 'JHFL43' && ruleCondition.allNotBlank) || (ruleInfo.ruleTypeId == 'JHFL38' && ruleCondition.unionUnique) ? [columnInfo.columnId] : [],
            page: 1,
            page_size: 999999,
        }
        let res = await fieldSearch(query)
        if (res.code == 200) {
            techRuleInfo.relatedColumns = []
            ruleCondition.relatedColumns = []
            this.setState({
                joinColumnList: res.data,
                techRuleInfo,
                ruleCondition,
            })
        }
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            this.setState({
                typeList: this.deleteSubList(res.data.children),
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
    changeSelect = async (name, e, node) => {
        let { columnInfo, addTaskInfo, techRuleInfo, ruleInfo, ruleParam, hasParam, ruleCondition, columnList } = this.state
        if (name == 'columnId') {
            columnInfo.columnId = e
            columnInfo.columnName = node.props.children
            columnInfo.datasourceId = addTaskInfo.businessData.datasourceIdName.id
            columnInfo.datasourceName = addTaskInfo.businessData.datasourceIdName.name
            columnInfo.databaseId = addTaskInfo.businessData.databaseIdName.id
            columnInfo.databaseName = addTaskInfo.businessData.databaseIdName.name
            columnInfo.tableId = addTaskInfo.businessData.tableIdName.id
            columnInfo.tableName = addTaskInfo.businessData.tableIdName.name
        } else if (name == 'sourceTimeColumnId') {
            ruleParam.sourceTimeColumn = {
                id: e,
                name: node.props.children,
            }
        } else if (name == 'bizRuleGroupId') {
            ruleInfo[name] = e
            // ruleInfo.ruleTypeId = ''
        } else if (name == 'id') {
            ruleInfo[name] = e
            console.log(node, 'ruleInfo')
            let { def } = node.props
            ruleInfo.ruleName = def.ruleName
            ruleInfo.ruleContent = def.ruleContent
            ruleInfo.ruleTypeId = def.ruleTypeId
            ruleInfo.bizRuleGroupId = def.bizRuleGroupId ? def.bizRuleGroupId : undefined
            ruleParam = JSON.parse(def.ruleParam)
            hasParam = JSON.parse(def.ruleParam).hasParam
            ruleParam.hasParam = 1
            if (ruleInfo.ruleTypeId == 'JHFL43' || ruleInfo.ruleTypeId == 'JHFL38') {
                this.getJoinColumnList()
            }
        } else if (name == 'relatedColumns') {
            ruleCondition.relatedColumns = []
            e.map((item) => {
                columnList.map((column) => {
                    if (item == column.id) {
                        ruleCondition.relatedColumns.push({ id: column.id, name: column.physical_field })
                    }
                })
            })
            techRuleInfo[name] = e
        } else {
            techRuleInfo[name] = e
        }
        await this.setState({
            columnInfo,
            techRuleInfo,
            ruleInfo,
            ruleCondition,
            hasParam,
            ruleParam,
        })
        if (name == 'bizRuleGroupId') {
            this.getBizRuleList()
            this.clearRuleInfo()
        }
        if (name == 'id' || name == 'sourceTimeColumnId') {
            this.initComponent()
        }
        if (name == 'columnId') {
            this.getJoinColumnList()
        }
    }
    changeInput = (name, e) => {
        let { techRuleInfo } = this.state
        techRuleInfo[name] = e.target.value
        this.setState({
            techRuleInfo,
        })
    }
    changeColumnInfoInput = (name, e) => {
        let { columnInfo } = this.state
        columnInfo[name] = e.target.value
        this.setState({
            columnInfo,
        })
    }
    changeType = async (value, selectedOptions) => {
        let { ruleInfo, columnInfo } = this.state
        ruleInfo.ruleTypeIds = value
        ruleInfo.ruleTypeId = value.length ? value[value.length - 1] : ''
        columnInfo.ruleTypeId = value.length ? value[value.length - 1] : ''
        await this.setState({
            ruleInfo,
            columnInfo,
        })
        this.getBizRuleList()
        this.clearRuleInfo()
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
    renderJHFLT11() {
        const { ruleParam, columnList, columnInfo, ruleInfo } = this.state
        let { relatedColumns } = ruleParam
        const usedColumnList = columnList.filter((item) => item.id !== columnInfo.columnId)
        return (
            <FormItem required label='对应字段' {...tailFormItemLayout}>
                <Select
                    options={usedColumnList}
                    fieldNames={{
                        label: 'physical_field',
                        value: 'id',
                    }}
                    showSearch={false}
                    placeholder='请选择'
                    value={(relatedColumns || []).map((item) => item.id)}
                    onChange={async (value) => {
                        const relatedColumns = usedColumnList
                            .filter((item) => {
                                if (value) {
                                    return value.includes(item.id)
                                }
                                return false
                            })
                            .map((item) => {
                                return {
                                    id: item.id,
                                    name: item.physical_field,
                                }
                            })
                        await this.setState({
                            ruleParam: {
                                ...ruleParam,
                                relatedColumns,
                            },
                        })
                        this.initComponent()
                    }}
                />
            </FormItem>
        )
    }
    renderJHFL46() {
        const { ruleParam, columnList, columnInfo, ruleInfo } = this.state
        let { relationColumns, relatedColumns } = ruleParam
        if (ruleInfo.ruleTypeId !== 'JHFL46') {
            relationColumns = relatedColumns
        }
        console.log('relationColumns', relationColumns)
        // 排除核验字段
        const usedColumnList = columnList.filter((item) => item.id !== columnInfo.columnId)
        return (
            <FormItem required label='对应字段' {...tailFormItemLayout}>
                <Select
                    options={usedColumnList}
                    mode='multiple'
                    fieldNames={{
                        label: 'physical_field',
                        value: 'id',
                    }}
                    showSearch={false}
                    placeholder='请选择（多选）'
                    value={(relationColumns || []).map((item) => item.id)}
                    onChange={async (value) => {
                        const relationColumns = usedColumnList
                            .filter((item) => {
                                if (value) {
                                    return value.includes(item.id)
                                }
                                return false
                            })
                            .map((item) => {
                                return {
                                    id: item.id,
                                    name: item.physical_field,
                                }
                            })
                        await this.setState({
                            ruleParam: {
                                ...ruleParam,
                                relationColumns,
                                relatedColumns: relationColumns,
                            },
                        })
                        this.initComponent()
                    }}
                />
            </FormItem>
        )
    }

    renderJHFL83() {
        const { ruleParam } = this.state
        console.log('ruleParam', ruleParam)
        return (
            <React.Fragment>
                <FormItem label='时间格式' {...tailFormItemLayout}>
                    <Input
                        value={ruleParam.dateFormat}
                        placeholder="示例：DATE_FORMAT(create_time,'%Y-%m-%d')=YYYY-MM-DD"
                        onChange={(event) => {
                            this.setState({
                                ruleParam: {
                                    ...ruleParam,
                                    dateFormat: event.target.value,
                                },
                            })
                        }}
                    />
                </FormItem>
                <FormItem label='业务时间' {...tailFormItemLayout}>
                    <TimingSelect
                        ref={(target) => (this.timingSelect = target)}
                        onChange={(value) => {
                            const { type, day, time } = value
                            this.setState({
                                ruleParam: {
                                    ...ruleParam,
                                    type,
                                    content: day,
                                    hour: time ? time.format('HH:mm') : '',
                                },
                            })
                        }}
                    />
                </FormItem>
                <FormItem label='缓冲时间' {...tailFormItemLayout}>
                    <InputNumber
                        addonAfter='天'
                        placeholder='整数'
                        min={0}
                        step={1}
                        value={ruleParam.value}
                        onChange={(value) => {
                            this.setState({
                                ruleParam: {
                                    ...ruleParam,
                                    value: value ? Math.floor(value) : 0,
                                },
                            })
                        }}
                    />
                </FormItem>
            </React.Fragment>
        )
    }
    renderJHFLT22() {
        const { ruleParam, columnList } = this.state
        return (
            <React.Fragment>
                <FormItem required name='sourceTimeColumnId' label='源表时间字段' {...tailFormItemLayout}>
                    <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={(value, option) => {
                            this.changeSelect('sourceTimeColumnId', value, option)
                        }}
                        placeholder='请选择'
                    >
                        {columnList.map((item) => {
                            return (
                                <Option title={item.physical_field} value={item.id} key={item.id}>
                                    {item.physical_field}
                                </Option>
                            )
                        })}
                    </Select>
                </FormItem>
                <FormItem required label='源表时间格式' {...tailFormItemLayout}>
                    <Input
                        value={ruleParam.dateFormat}
                        placeholder="示例：DATE_FORMAT(create_time,'%Y-%m-%d')=YYYY-MM-DD"
                        onChange={(event) => {
                            this.setState({
                                ruleParam: {
                                    ...ruleParam,
                                    dateFormat: event.target.value,
                                },
                            })
                        }}
                    />
                </FormItem>
            </React.Fragment>
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
        let { columnInfo, ruleCondition, ruleInfo, ruleParam, techRuleInfo } = this.state
        if (!columnInfo.columnId) {
            message.info('请选择检核字段')
            return
        }
        // 如果是逻辑一致性或者时间函数比较，打开树结构的字段选择窗口；否则，打开普通窗口
        if (ruleInfo.ruleTypeId === 'JHFL44' || ruleInfo.ruleTypeId === 'JHFL81') {
            if (this.treeColumnFilter) {
                this.treeColumnFilter.openModal(ruleParam.joinStatement, ruleParam.logicalExpression, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName, techRuleInfo.filterParam)
            }
        } else {
            this.logicFilter && this.logicFilter.openModal(ruleCondition.expression, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName)
        }
    }
    openFilterModal = () => {
        let { techRuleInfo, columnInfo, ruleInfo, ruleParam, ruleLevel, selectedTable } = this.state
        if (!columnInfo.columnId && ruleLevel == 0) {
            message.info('请选择检核字段')
            return
        }
        // 如果是逻辑一致性或者时间函数比较，打开树结构的字段选择窗口；否则，打开普通窗口
        if (ruleInfo.ruleTypeId === 'JHFL44' || ruleInfo.ruleTypeId == 'JHFL81') {
            if (this.treeColumnFilter) {
                this.treeColumnFilter.openModal(ruleParam.joinStatement, ruleParam.logicalExpression, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName, techRuleInfo.filterParam)
            }
        } else {
            this.columnFilter && this.columnFilter.openModal(techRuleInfo.filterParam, selectedTable.tableId, columnInfo.columnId, columnInfo.tableName)
        }
    }
    getFilterParam = (data) => {
        let { techRuleInfo } = this.state
        techRuleInfo.filterParam = data
        this.setState({
            techRuleInfo,
        })
    }

    getTreeFilterParam = (data) => {
        console.log(data, 'getTreeFilterParam')
        let { ruleCondition, techRuleInfo } = this.state
        ruleCondition.expression = data.joinStatement + ' ' + data.logicalExpression
        // techRuleInfo.filterParam = data.filterParam

        const { ruleParam } = this.state
        this.setState({
            ruleParam: {
                ...ruleParam,
                ...data,
            },
            ruleCondition,
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
    onChangeUnionUnique = async (name, e) => {
        let { ruleCondition } = this.state
        ruleCondition[name] = e.target.checked
        await this.setState({
            ruleCondition,
        })
        this.getJoinColumnList()
    }
    getNewRuleParam = (data) => {
        this.setState({
            ruleParam: data,
        })
    }
    changeFunctionInput = async (name, e) => {
        let { functionInfo } = this.state
        functionInfo[name] = e.target.value
        await this.setState({
            functionInfo,
        })
        this.getPeriodExample()
    }
    changeFunctionSelect = async (name, e) => {
        let { functionInfo } = this.state
        functionInfo[name] = e
        await this.setState({
            functionInfo,
        })
        this.getPeriodExample()
    }
    getPeriodExample = async () => {
        let { functionInfo } = this.state
        let res = await periodExample(functionInfo)
        if (res.code == 200) {
            functionInfo.example = res.msg
            this.setState({
                functionInfo,
            })
        }
    }
    renderFxFunction = () => {
        let { functionInfo, dateColumnList, funcLoading } = this.state
        return (
            <div>
                <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24, padding: 24 }} className='EditMiniForm ruleForm'>
                    <FormItem label='规则类型' {...tailFormItemLayout}>
                        <Radio.Group value={functionInfo.granularity} onChange={this.changeFunctionInput.bind(this, 'granularity')}>
                            <Radio value={4}>年</Radio>
                            <Radio value={3}>季度</Radio>
                            <Radio value={1}>月</Radio>
                            <Radio value={2}>周</Radio>
                            <Radio value={0}>日</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem label='周期类型' {...tailFormItemLayout}>
                        <Radio.Group value={functionInfo.periodType} onChange={this.changeFunctionInput.bind(this, 'periodType')}>
                            <Radio value={0}>自然周期</Radio>
                            <Radio value={1}>相对周期</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem label='计算逻辑' {...tailFormItemLayout}>
                        <InputNumber
                            style={{ width: '128px' }}
                            value={functionInfo.granularityNum}
                            placeholder='请输入数字'
                            onChange={this.changeFunctionSelect.bind(this, 'granularityNum')}
                            min={0}
                        />
                        <span style={{ color: '#606366', marginLeft: 8 }}>
                            {functionInfo.granularity == 0
                                ? '日'
                                : functionInfo.granularity == 1
                                ? '月'
                                : functionInfo.granularity == 2
                                ? '周'
                                : functionInfo.granularity == 3
                                ? '季度'
                                : functionInfo.granularity == 4
                                ? '年'
                                : ''}
                            前
                        </span>
                    </FormItem>
                    <FormItem label='日期字段' {...tailFormItemLayout}>
                        <Select
                            dropdownClassName='dateColumnSelect'
                            value={functionInfo.columnId}
                            onChange={this.changeFunctionSelect.bind(this, 'columnId')}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            placeholder='请选择'
                        >
                            {dateColumnList.map((item) => {
                                return (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                        {functionInfo.example ? (
                            <div className='rangeArea'>
                                <div>根据配置生成的统计周期为：</div>
                                <div>{functionInfo.example}</div>
                            </div>
                        ) : null}
                    </FormItem>
                </Form>
                <Divider style={{ margin: 0 }} />
                <div style={{ padding: '8px 16px' }}>
                    <Button loading={funcLoading} block type='primary' onClick={this.postFxfunction}>
                        确定
                    </Button>
                </div>
            </div>
        )
    }
    postFxfunction = async () => {
        let { columnInfo, functionInfo } = this.state
        if (!functionInfo.columnId) {
            message.info('请选择日期字段')
            return
        }
        let fxTextarea = document.querySelector('.fxTextarea')
        let cursurPosition = -1
        if (fxTextarea.selectionStart) {
            cursurPosition = fxTextarea.selectionStart
        }
        this.setState({ funcLoading: true })
        let res = await producePeriodFunc(functionInfo)
        this.setState({ funcLoading: false })
        if (res.code == 200) {
            if (cursurPosition !== -1) {
                columnInfo.sqlText = columnInfo.sqlText.slice(0, cursurPosition) + res.msg + columnInfo.sqlText.slice(cursurPosition)
            } else {
                columnInfo.sqlText = columnInfo.sqlText + res.msg
            }
            this.form.setFieldsValue({ sqlText: columnInfo.sqlText })
            this.setState({
                columnInfo,
                popoverVisible: false,
            })
        }
    }
    handleVisibleChange = (value) => {
        this.setState({
            popoverVisible: value,
        })
    }
    cancel = () => {
        this.setState({
            addRuleVisible: false,
        })
    }
    checkBeforePost = () => {
        let { ruleParam, techRuleInfo, ruleInfo, ruleCondition, columnInfo } = this.state
        if (techRuleInfo.sqlSource === 1) {
            if (!ruleInfo.id) {
                message.info('请选择业务规则')
                return false
            }
            if (ruleInfo.ruleTypeId == 'JHFL44' && !ruleCondition.expression) {
                message.info('请填写逻辑表达式')
                return false
            }
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
            if (ruleInfo.ruleTypeId == 'JHFL81' && !ruleParam.table.id) {
                message.info('请添加表')
                return false
            }
            ruleParam.relatedColumns = ruleParam.relatedColumns ? ruleParam.relatedColumns : []
            if (ruleInfo.ruleTypeId == 'JHFLT11') {
                if (!ruleParam.method || !ruleParam.value) {
                    message.info('请填写比较方式')
                    return false
                }
                if (!ruleParam.relatedColumns.length) {
                    message.info('请填写对应字段')
                    return false
                }
            }
            if (ruleInfo.ruleTypeId == 'JHFLT12' && !ruleParam.relatedColumns.length) {
                message.info('请填写对应字段')
                return false
            }
            if (ruleInfo.ruleTypeId == 'JHFL47') {
                if (!ruleParam.table.id) {
                    message.info('请选择参照表')
                    return false
                }
                if (!ruleParam.dateFormat) {
                    message.info('请输入时间格式')
                    return false
                }
            }
            if (ruleInfo.ruleTypeId == 'JHFLT21') {
                if (!ruleParam.table.id) {
                    message.info('请选择参照表')
                    return false
                }
                if (!ruleParam.column.id) {
                    message.info('请选择参照表时间字段')
                    return false
                }
                if (!ruleParam.targetDateFormat) {
                    message.info('请输入参照表时间格式')
                    return false
                }
            }
            if (ruleInfo.ruleTypeId == 'JHFLT22') {
                if (!ruleParam.table.id) {
                    message.info('请选择参照表')
                    return false
                }
                if (!ruleParam.column.id) {
                    message.info('请选择参照表时间字段')
                    return false
                }
                if (!ruleParam.targetDateFormat) {
                    message.info('请输入参照表时间格式')
                    return false
                }
                if (!ruleParam.sourceTimeColumn) {
                    message.info('请输入源表时间字段')
                    return false
                }
                if (!ruleParam.dateFormat) {
                    message.info('请输入源表时间格式')
                    return false
                }
                if (!ruleParam.method || !ruleParam.value || !ruleParam.type) {
                    message.info('请填写比较方式')
                    return false
                }
            }
        } else if (techRuleInfo.sqlSource === 0) {
            if (!columnInfo.ruleTypeId) {
                message.info('请选择规则类别')
                return false
            }
        } else if (techRuleInfo.sqlSource === 2) {
            return this.checkRemoteFuncList()
        }

        // 如果有周期选择器，进行验证
        if (this.timingSelect) {
            const error = this.timingSelect.getError()
            if (error) {
                message.error(`业务时间--${error}`)
                return false
            }

            if (!ruleParam.value) {
                message.error(`请填写缓冲时间`)
                return false
            }
        }

        return true
    }

    postData = async () => {
        let { ruleLevel, addTaskInfo, ruleModalType, techRuleInfo, ruleInfo, ruleParam, ruleCondition, columnInfo } = this.state
        this.form.validateFields().then((values) => {
            if (!this.checkBeforePost()) {
                return
            }
            if (ruleLevel == 1) {
                columnInfo.datasourceId = addTaskInfo.businessData.datasourceIdName.id
                columnInfo.datasourceName = addTaskInfo.businessData.datasourceIdName.name
                columnInfo.databaseId = addTaskInfo.businessData.databaseIdName.id
                columnInfo.databaseName = addTaskInfo.businessData.databaseIdName.name
                columnInfo.tableId = addTaskInfo.businessData.tableIdName.id
                columnInfo.tableName = addTaskInfo.businessData.tableIdName.name
            }
            techRuleInfo.columnEntityList = [columnInfo]
            if (ruleParam.column) {
                ruleParam.column.id = ruleParam.column.id ? ruleParam.column.id : ''
                ruleParam.column.name = ruleParam.column.name ? ruleParam.column.name : ''
            }
            let queryParam = this.queryFormat(ruleParam)
            let query = {
                ...techRuleInfo,
                bizRuleId: ruleInfo.id,
                bizRuleGroupId: ruleInfo.bizRuleGroupId,
                ruleParam: JSON.stringify(queryParam),
                ruleCondition: JSON.stringify(ruleCondition),
                ruleLevel,
            }
            if (techRuleInfo.sqlSource === 2) {
                query.ruleParam = this.getRemoteParam()
            }
            this.setState({ btnLoading: true })
            if (ruleModalType == 'add') {
                createTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.props.onSelectTable()
                    }
                })
            } else {
                updateTechRule(query).then((res) => {
                    this.setState({ btnLoading: false })
                    if (res.code == 200) {
                        message.success('操作成功')
                        this.cancel()
                        this.props.onSelectTable()
                    }
                })
            }
        })
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
                    joinStatement: ruleParam.joinStatement,
                    logicalExpression: ruleParam.logicalExpression,
                    database: ruleParam.database,
                    table: ruleParam.table,
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
            case 'JHFL81':
                ruleParam = {
                    hasParam: ruleParam.hasParam,
                    needMerge: ruleParam.needMerge,
                    database: ruleParam.database,
                    table: ruleParam.table,
                    joinStatement: ruleParam.joinStatement,
                    logicalExpression: ruleParam.logicalExpression,
                }
                break
            default:
                break
        }
        return ruleParam
    }

    getAllRemoteFuncWithParams = async (formData) => {
        const res = await getAllRemoteFuncWithParams()
        if (res.code === 200) {
            const { remoteFuncId, sqlSource, ruleParam } = formData
            if (sqlSource === 2) {
                let ids = JSON.parse(ruleParam)
                res.data
                    .find((item) => item.id === remoteFuncId)
                    .remoteFuncParamsList.map((obj) => {
                        obj.inputValue = ids.find((element) => element.id === obj.paramPosition).name
                    })
            }
            this.setState({ remoteFuncList: res.data })
        }
    }

    renderInput = (record, remotefunc) => {
        const { paramType, paramPosition, paramName, inputValue } = record
        const commonParam = {
            value: this.setRuleValue(record),
            onChange: this.ruleInputChange.bind(null, paramPosition, remotefunc),
            addonBefore: paramType,
            placeholder: paramName,
            style: { width: '100%', margin: '6px 0' },
            allowClear: true,
        }
        if (paramType === 'String') {
            return <Input {...commonParam} />
        } else if (['Long', 'Int', 'Double'].indexOf(paramType) > -1) {
            return <InputNumber precision={['Long', 'Int'].indexOf(paramType) > -1 ? 0 : 2} {...commonParam} />
        } else if (paramType === 'Date') {
            return <DatePicker {...commonParam} />
        }
    }

    setRuleValue = (record) => {
        const { paramType, inputValue } = record
        if (paramType === 'Date') {
            return inputValue ? moment(inputValue) : null
        }
        return inputValue
    }

    ruleInputChange = (id, remotefunc, e) => {
        const { remoteFuncList } = this.state
        remoteFuncList
            .find((func) => func.id === remotefunc)
            .remoteFuncParamsList.map((item) => {
                if (item.paramPosition === id) {
                    if (item.paramType === 'String') {
                        e = e.target.value
                    } else if (item.paramType === 'Date') {
                        e = e ? e.format('YYYY-MM-DD') : null
                    }
                    item.inputValue = e
                }
            })
        this.setState({ remoteFuncList })
    }

    checkRemoteFuncList = () => {
        const { techRuleInfo, remoteFuncList } = this.state
        let result = true
        remoteFuncList
            .find((func) => func.id === techRuleInfo.remoteFuncId)
            .remoteFuncParamsList.forEach((item) => {
                if ([undefined, '', null].indexOf(item.inputValue) > -1) {
                    result = false
                }
            })
        if (!result) message.error('请填写完整的存储过程列表')
        return result
    }

    getRemoteParam = () => {
        const { techRuleInfo, remoteFuncList } = this.state
        return JSON.stringify(
            remoteFuncList
                .find((func) => func.id === techRuleInfo.remoteFuncId)
                .remoteFuncParamsList.map((item) => {
                    let obj = {}
                    obj.id = item.paramPosition
                    obj.name = item.inputValue
                    return obj
                })
        )
    }
    openRuleModal = () => {
        let { ruleLevel, ruleInfo } = this.state
        this.ruleTableModal && this.ruleTableModal.openModal(ruleLevel, ruleInfo.id, ruleInfo.bizRuleGroupId)
    }
    getRuleData = async (data) => {
        let { ruleInfo, ruleParam, hasParam, columnInfo } = this.state
        if (ruleInfo.id == data.id) {
            return
        }
        ruleInfo.id = data.id
        console.log(data, 'getRuleData')
        ruleInfo.ruleName = data.ruleName
        ruleInfo.ruleContent = data.ruleContent
        ruleInfo.ruleDesc = data.ruleDesc
        ruleInfo.ruleTypeId = data.ruleTypeId
        columnInfo.ruleTypeId = data.ruleTypeId
        columnInfo.ruleName = data.ruleName
        ruleInfo.ruleTypePath = data.ruleTypePath
        ruleInfo.bizRuleGroupId = data.bizRuleGroupId ? data.bizRuleGroupId : undefined
        ruleParam = JSON.parse(data.ruleParam)
        hasParam = JSON.parse(data.ruleParam).hasParam
        ruleParam.hasParam = 1
        if (ruleInfo.ruleTypeId == 'JHFL43' || ruleInfo.ruleTypeId == 'JHFL38') {
            this.getJoinColumnList()
        }
        await this.setState({
            hasParam,
            ruleInfo,
            ruleParam,
            columnInfo,
        })
        this.initComponent()
    }
    render() {
        const {
            ruleModalType,
            primaryKeyList,
            techRuleInfo,
            typeList,
            ruleCondition,
            ruleParam,
            hasParam,
            ruleInfo,
            popoverVisible,
            columnList,
            joinColumnList,
            columnInfo,
            bizList,
            bizRuleList,
            addRuleVisible,
            btnLoading,
            ruleTypeList,
            remoteFuncList,
            ruleLevel,
            addTaskInfo,
            selectedTable,
            editData,
        } = this.state

        // const { setFieldsValue } = this.form
        const isEdit = ruleModalType === 'edit'
        console.log('ruleInfo.ruleTypeId', ruleInfo.ruleTypeId)
        let drawerTitle = ruleLevel == 0 ? '（字段）' : '（表）'
        return (
            <React.Fragment>
                <DrawerLayout
                    drawerProps={{
                        title: (ruleModalType == 'edit' ? '编辑规则' : '添加规则') + drawerTitle,
                        className: 'newAddRuleDrawer',
                        width: 568,
                        visible: addRuleVisible,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button onClick={this.postData} key='submit' type='primary' loading={btnLoading}>
                                    确定
                                </Button>
                                <Button key='back' onClick={this.cancel}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {addRuleVisible && (
                        <div>
                            <Form ref={(target) => (this.form = target)} style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }} className='EditMiniForm ruleForm'>
                                {ruleLevel == 0 ? (
                                    <div>
                                        {ruleModalType == 'edit' ? (
                                            <Select disabled value={columnInfo.columnName}></Select>
                                        ) : (
                                            <FormItem
                                                required
                                                name='columnId'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择核验字段!',
                                                    },
                                                ]}
                                                label='核验字段'
                                                {...tailFormItemLayout}
                                            >
                                                <Select
                                                    showSearch
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    onChange={(value, option) => {
                                                        // 清除 ruleParam.relationColumns
                                                        ruleParam.relationColumns = []
                                                        this.changeSelect('columnId', value, option)
                                                    }}
                                                    placeholder='请选择'
                                                >
                                                    {columnList.map((item) => {
                                                        return (
                                                            <Option title={item.physical_field} value={item.id} key={item.id}>
                                                                {item.physical_field}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </FormItem>
                                        )}
                                    </div>
                                ) : (
                                    <div className='tableName'>
                                        {selectedTable.name}[{selectedTable.tableName}]
                                    </div>
                                )}
                                <FormItem required label='业务规则' name='ruleName'>
                                    {ruleModalType == 'edit' ? (
                                        <div>{ruleInfo.ruleName}</div>
                                    ) : (
                                        <a onClick={this.openRuleModal}>
                                            {ruleInfo.ruleName ? ruleInfo.ruleName : '选择业务规则'} {ruleInfo.ruleName ? <span className='iconfont icon-bianji' /> : null}
                                        </a>
                                    )}
                                    {ruleInfo.ruleName ? (
                                        <div className='rangeArea' style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 8, color: '#5E6266' }}>
                                            <div>规则类型：{ruleInfo.ruleTypePath}</div>
                                            <div>规则描述：{ruleInfo.ruleDesc}</div>
                                        </div>
                                    ) : null}
                                </FormItem>
                                {hasParam == 1 && ruleInfo.ruleName ? (
                                    <FormItem required label='规则内容' {...tailFormItemLayout}>
                                        {ruleInfo.ruleContent}
                                    </FormItem>
                                ) : null}
                                {/*<FormItem label='核验字段表达式' name='columnExpression'>*/}
                                {/*<Input placeholder='请输入函数表达式，例如 to_int(字段名称)' onChange={this.changeColumnInfoInput.bind(this, 'columnExpression')} />*/}
                                {/*</FormItem>*/}
                                {/*<FormItem required={techRuleInfo.sqlSource == 0} label='规则类别' {...tailFormItemLayout}>*/}
                                {/*<div>*/}
                                {/*{ruleModalType == 'edit' ? (*/}
                                {/*<Select disabled value={ruleInfo.ruleTypeName} placeholder='请选择'></Select>*/}
                                {/*) : (*/}
                                {/*<Cascader*/}
                                {/*allowClear={false}*/}
                                {/*expandTrigger='hover'*/}
                                {/*fieldNames={{ label: 'name', value: 'id' }}*/}
                                {/*options={typeList}*/}
                                {/*onChange={this.changeType}*/}
                                {/*displayRender={(label) => label[label.length - 1]}*/}
                                {/*popupClassName='searchCascader'*/}
                                {/*placeholder='请选择'*/}
                                {/*/>*/}
                                {/*)}*/}
                                {/*</div>*/}
                                {/*</FormItem>*/}
                                {hasParam !== 1 && ruleInfo.ruleName ? (
                                    <FormItem required label='实现方式' {...tailFormItemLayout}>
                                        <Radio.Group disabled={ruleModalType == 'edit'} value={techRuleInfo.sqlSource} onChange={this.changeInput.bind(this, 'sqlSource')}>
                                            <Radio value={1}>规则模板</Radio>
                                            <Radio value={2}>存储过程</Radio>
                                            <Radio disabled={ruleInfo.ruleTypeId == 'JHFLT21' || ruleInfo.ruleTypeId == 'JHFLT22'} value={0}>
                                                自定义SQL
                                            </Radio>
                                        </Radio.Group>
                                    </FormItem>
                                ) : null}
                                {/*{techRuleInfo.sqlSource == 0 ? (*/}
                                {/*<FormItem*/}
                                {/*name='ruleName'*/}
                                {/*rules={[*/}
                                {/*{*/}
                                {/*required: true,*/}
                                {/*message: '请输入规则名称!',*/}
                                {/*},*/}
                                {/*{*/}
                                {/*max: 64,*/}
                                {/*message: '名称不能超过64个字符!',*/}
                                {/*},*/}
                                {/*]}*/}
                                {/*label='规则名称'*/}
                                {/*{...tailFormItemLayout}*/}
                                {/*>*/}
                                {/*<Input*/}
                                {/*disabled={ruleModalType == 'edit'}*/}
                                {/*placeholder='请输入'*/}
                                {/*onChange={this.changeColumnInfoInput.bind(this, 'ruleName')}*/}
                                {/*suffix={<span style={{ color: '#C4C8CC' }}>{columnInfo.ruleName ? columnInfo.ruleName.length : 0}/64</span>}*/}
                                {/*/>*/}
                                {/*</FormItem>*/}
                                {/*) : null}*/}

                                {techRuleInfo.sqlSource === 2 && (
                                    <FormItem
                                        name='remoteFuncId'
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择存储过程!',
                                            },
                                        ]}
                                        label='存储过程选择'
                                        {...tailFormItemLayout}
                                    >
                                        <Select onChange={this.changeSelect.bind(this, 'remoteFuncId')} placeholder='请选择'>
                                            {remoteFuncList.map((func) => (
                                                <Option value={func.id} key={func.id}>
                                                    {func.funcName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                )}
                                {techRuleInfo.sqlSource === 2 && techRuleInfo.remoteFuncId && remoteFuncList.length > 0 && (
                                    <FormItem
                                        name='severityLevel'
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择存储过程!',
                                            },
                                        ]}
                                        label='存储过程列表'
                                        {...tailFormItemLayout}
                                    >
                                        {remoteFuncList
                                            .find((func) => func.id === techRuleInfo.remoteFuncId)
                                            .remoteFuncParamsList.map((item) => {
                                                return this.renderInput(item, techRuleInfo.remoteFuncId)
                                            })}
                                    </FormItem>
                                )}

                                {techRuleInfo.sqlSource == 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                        <FormItem
                                            required
                                            name='sqlText'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入核验SQL!',
                                                },
                                            ]}
                                            label='核验SQL'
                                            {...tailFormItemLayout}
                                        >
                                            <div style={{ position: 'relative' }}>
                                                <Popover
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    overlayClassName='fxPopover'
                                                    placement='topLeft'
                                                    trigger='click'
                                                    content={this.renderFxFunction()}
                                                    onVisibleChange={this.handleVisibleChange}
                                                    visible={popoverVisible}
                                                >
                                                    <div onClick={this.handleVisibleChange.bind(this, !popoverVisible)} className='fxFunction'>
                                                        <span className='fxSpan'>fx</span>插入函数
                                                    </div>
                                                </Popover>
                                                <TextArea
                                                    className='fxTextarea'
                                                    value={columnInfo.sqlText}
                                                    style={{ paddingTop: 10 }}
                                                    placeholder='请输入'
                                                    rows={4}
                                                    onChange={this.changeColumnInfoInput.bind(this, 'sqlText')}
                                                />
                                                {ruleLevel == 1 ? (
                                                    <div style={{ color: '#606366', display: 'inline-block', marginTop: 8 }}>
                                                        SQL规范说明：SQL的结果第一列为0或1，0表示失败，1表示成功；其余结果按照【字段名:值】的方式输出
                                                    </div>
                                                ) : null}
                                            </div>
                                        </FormItem>
                                        {ruleLevel == 0 ? (
                                            <FormItem
                                                required
                                                name='sqlTotal'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请输入总数SQL!',
                                                    },
                                                ]}
                                                label='总数SQL'
                                                {...tailFormItemLayout}
                                            >
                                                <div style={{ position: 'relative' }}>
                                                    <TextArea
                                                        value={columnInfo.sqlTotal}
                                                        style={{ paddingTop: 10 }}
                                                        placeholder='请输入'
                                                        rows={4}
                                                        onChange={this.changeColumnInfoInput.bind(this, 'sqlTotal')}
                                                    />
                                                </div>
                                            </FormItem>
                                        ) : null}
                                    </div>
                                ) : null}
                                {techRuleInfo.sqlSource == 1 && ruleInfo.ruleName && hasParam !== 1 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                        {/*<FormItem label='规则分组' {...tailFormItemLayout}>*/}
                                        {/*<Select value={ruleInfo.bizRuleGroupId} disabled={ruleModalType == 'edit'} onChange={this.changeSelect.bind(this, 'bizRuleGroupId')} placeholder='请选择'>*/}
                                        {/*{ruleTypeList.map((item) => {*/}
                                        {/*return (*/}
                                        {/*<Option value={item.id} key={item.id}>*/}
                                        {/*{item.name}*/}
                                        {/*</Option>*/}
                                        {/*)*/}
                                        {/*})}*/}
                                        {/*</Select>*/}
                                        {/*</FormItem>*/}
                                        {ruleInfo.ruleTypeId == 'JHFLT22' && this.renderJHFLT22()}
                                        {ruleInfo.ruleTypeId == 'JHFL82' ||
                                        ruleInfo.ruleTypeId == 'JHFL47' ||
                                        ruleInfo.ruleTypeId == 'JHFLT21' ||
                                        ruleInfo.ruleTypeId == 'JHFLT22' ||
                                        ruleInfo.ruleTypeId == 'JHFLT11' ? (
                                            <TableRules
                                                ref={(dom) => {
                                                    this.tableRules = dom
                                                }}
                                                setFieldsValue={this.form ? this.form.setFieldsValue : ''}
                                                ruleInfo={ruleInfo}
                                                ruleParam={ruleParam}
                                                getNewRuleParam={this.getNewRuleParam}
                                                required={true}
                                            />
                                        ) : null}
                                        {hasParam == 2 ? (
                                            <div style={{ width: 520 }}>
                                                {/*值域有效性*/}
                                                {ruleInfo.ruleTypeId == 'JHFL42' || ruleInfo.ruleTypeId == 'JHFL41' ? (
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
                                                {/*依赖一致性*/}
                                                {ruleInfo.ruleTypeId == 'JHFL45' ? (
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
                                                {ruleInfo.ruleTypeId == 'JHFL40' ? (
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
                                                {ruleInfo.ruleTypeId == 'JHFL39' ? (
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
                                            </div>
                                        ) : null}
                                        {/*<div className='rangeArea' style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 16 }}>*/}
                                        {ruleInfo.ruleTypeId == 'JHFL43' || ruleInfo.ruleTypeId == 'JHFL38' ? (
                                            <FormItem label='联合为空' {...tailFormItemLayout}>
                                                {ruleInfo.ruleTypeId == 'JHFL43' ? (
                                                    <Checkbox onChange={this.onChangeUnionUnique.bind(this, 'allNotBlank')} checked={ruleCondition.allNotBlank}>
                                                        勾选表示所有字段联合后需要满足非空完整性要求
                                                    </Checkbox>
                                                ) : null}
                                                {ruleInfo.ruleTypeId == 'JHFL38' ? (
                                                    <Checkbox onChange={this.onChangeUnionUnique.bind(this, 'unionUnique')} checked={ruleCondition.unionUnique}>
                                                        勾选表示所有字段联合后需要满足唯一性要求
                                                    </Checkbox>
                                                ) : null}
                                            </FormItem>
                                        ) : null}
                                        {ruleInfo.ruleTypeId == 'JHFL43' || ruleInfo.ruleTypeId == 'JHFL38' ? (
                                            <FormItem label='联合检核字段' {...tailFormItemLayout}>
                                                <Select
                                                    mode='multiple'
                                                    showSearch
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    value={techRuleInfo.relatedColumns}
                                                    onChange={this.changeSelect.bind(this, 'relatedColumns')}
                                                    placeholder='请选择'
                                                >
                                                    {joinColumnList.map((item) => {
                                                        return (
                                                            <Option title={item.physical_field} value={item.id} key={item.id}>
                                                                {item.physical_field}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            </FormItem>
                                        ) : null}
                                        {ruleInfo.ruleTypeId == 'JHFL44' || ruleInfo.ruleTypeId == 'JHFL81' ? <div>{this.renderLogic()}</div> : null}
                                        {/* 唯一性/对应关系 */}
                                        {(ruleInfo.ruleTypeId === 'JHFL46' || ruleInfo.ruleTypeId === 'JHFLT12') && this.renderJHFL46()}
                                        {ruleInfo.ruleTypeId == 'JHFLT11' && this.renderJHFLT11()}
                                        {/* 及时性/业务时间比较 */}
                                        {ruleInfo.ruleTypeId === 'JHFL83' && this.renderJHFL83()}
                                        {/*</div>*/}
                                        {/*<FormItem required label='业务规则' {...tailFormItemLayout}>*/}
                                        {/*<Select disabled={ruleModalType == 'edit'} value={ruleInfo.id} onChange={this.changeSelect.bind(this, 'id')} placeholder='请选择'>*/}
                                        {/*{bizRuleList.map((item) => {*/}
                                        {/*return (*/}
                                        {/*<Option def={item} value={item.id} key={item.id}>*/}
                                        {/*{item.ruleName}*/}
                                        {/*</Option>*/}
                                        {/*)*/}
                                        {/*})}*/}
                                        {/*</Select>*/}
                                        {/*</FormItem>*/}
                                    </div>
                                ) : null}
                                {ruleLevel == 0 && ruleInfo.ruleTypeId !== 'JHFL81' && ruleInfo.ruleTypeId !== 'JHFL44' ? <div>{this.renderFilter()}</div> : null}
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
                                {ruleLevel == 0 ? (
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
                                        <div>
                                            <InputNumber
                                                style={{ width: '168px' }}
                                                value={techRuleInfo.passRate}
                                                placeholder='请输入数字'
                                                onChange={this.changeSelect.bind(this, 'passRate')}
                                                min={0.01}
                                                max={100}
                                                precision={2}
                                                // formatter={value => `${value}%`}
                                                // parser={value => value.replace('%', '')}
                                            />
                                            <span style={{ position: 'absolute', left: '140px', top: '8px' }}>%</span>
                                        </div>
                                    </FormItem>
                                ) : null}
                            </Form>
                            <ColumnFilter
                                value={techRuleInfo.filterParam}
                                getFilterParam={this.getFilterParam}
                                ref={(dom) => {
                                    this.columnFilter = dom
                                }}
                            />
                            <TreeColumnFilter
                                value={techRuleInfo.filterParam}
                                getFilterParam={this.getTreeFilterParam}
                                ref={(dom) => {
                                    this.treeColumnFilter = dom
                                }}
                            />
                            <ColumnFilter
                                value={ruleCondition.expression}
                                getFilterParam={this.getLogicFilter}
                                ref={(dom) => {
                                    this.logicFilter = dom
                                }}
                            />
                            <RuleTableModal
                                getRuleData={this.getRuleData}
                                ref={(dom) => {
                                    this.ruleTableModal = dom
                                }}
                            />
                        </div>
                    )}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
