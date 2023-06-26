import { Button, Cascader, Checkbox, Divider, Input, InputNumber, message, Radio, Select, Form } from 'antd'
import { baseconfig, bizRuleSearch, checkRuleTree, dateColumns, getTechRuleById, periodExample, producePeriodFunc } from 'app_api/examinationApi'
import { fieldSearch } from 'app_api/metadataApi'
import moment from 'moment'
import React, { Component } from 'react'
import ColumnFilter from '../../component/columnFilter'
import DependColumn from '../../component/dependColumn'
import ValidateCode from '../../component/validateCode'
import ValidateContent from '../../component/validateContent'
import ValidateLength from '../../component/validateLength'
import '../../index.less'

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
            addTaskInfo: this.props.addTaskInfo,
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
        }
        this.form = {}
    }
    componentWillMount = () => {
        this.init()
        this.getRuleTree()
        this.getColumnList()
        this.getJoinColumnList()
        this.getDateColumns()
        this.baseconfigList()
        this.getBizRuleList()
    }
    componentDidMount = () => {
        let that = this
        document.addEventListener(
            'click',
            function (e) {
                console.log(e.target, 'e.target.className')
                if (
                    !that.fxPopover.contains(e.target) &&
                    e.target.className !== 'fxFunction' &&
                    e.target.className !== 'fxSpan' &&
                    e.target.className !== 'ant-select-dropdown-menu-item ant-select-dropdown-menu-item-selected'
                ) {
                    that.setState({
                        popoverVisible: false,
                    })
                }
            },
            false
        )
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
            useForBizList: ruleInfo.useForBiz ? [ruleInfo.useForBiz] : [],
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
    getRuleData = async (type, data) => {
        let { techRuleInfo, ruleCondition, columnInfo, ruleParam, ruleInfo, hasParam } = this.state
        this.setState({
            ruleModalType: type,
        })
        console.log(type, data, 'getRuleData')
        if (type == 'add') {
            techRuleInfo = {
                sqlSource: 0,
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
            await this.setState({
                columnInfo,
                techRuleInfo,
                // ruleParam
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
                    sqlText: res.data.sqlText,
                    sqlTotal: res.data.sqlTotal,
                    ruleName: res.data.name,
                    ruleTypeId: res.data.ruleTypeId,
                }
                if (res.data.sqlSource) {
                    ruleInfo = res.data.bizRuleDTO
                    ruleParam = res.data.ruleParam !== undefined ? JSON.parse(res.data.ruleParam) : {}
                    hasParam = JSON.parse(res.data.bizRuleDTO.ruleParam).hasParam
                    ruleParam.hasParam = 1
                    if (res.data.ruleCondition !== undefined) {
                        ruleCondition = JSON.parse(res.data.ruleCondition)
                        ruleCondition.relatedColumns &&
                            ruleCondition.relatedColumns.map((item) => {
                                techRuleInfo.relatedColumns.push(item.id)
                            })
                    }
                    if (ruleParam.type == 3) {
                        ruleParam.value = moment(ruleParam.value)
                    }
                } else {
                    ruleInfo = {
                        ruleTypeId: res.data.ruleTypeId,
                        ruleTypeName: res.data.ruleTypeName,
                        id: res.data.bizRuleId,
                    }
                }
                techRuleInfo.columnEntityList = [columnInfo]
                techRuleInfo.id = res.data.id
                techRuleInfo.filterParam = res.data.filterParam
                techRuleInfo.passRate = res.data.passRate
                techRuleInfo.severityLevel = res.data.severityLevel
                techRuleInfo.sqlSource = res.data.sqlSource
                console.log(ruleParam, 'ruleparam')
                await this.setState({
                    techRuleInfo,
                    columnInfo,
                    ruleParam,
                    hasParam,
                    ruleCondition,
                    ruleInfo,
                })
                await this.initComponent()
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
                })
            }
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
    getJoinColumnList = async () => {
        let { addTaskInfo, columnInfo, ruleInfo, ruleCondition, techRuleInfo } = this.state
        let query = {
            table_id: addTaskInfo.businessData.tableIdName.id,
            notInIds: (ruleInfo.ruleTypeId == 'JHFL43' && ruleCondition.allNotBlank) || (ruleInfo.ruleTypeId == 'JHFL38' && ruleCondition.unionUnique) ? [columnInfo.columnId] : [],
            page: 1,
            page_size: 10000,
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
        } else if (name == 'useForBiz') {
            ruleInfo[name] = e
            ruleInfo.ruleTypeId = ''
        } else if (name == 'id') {
            ruleInfo[name] = e
            console.log(node, 'ruleInfo')
            let { def } = node.props
            ruleInfo.ruleName = def.ruleName
            ruleInfo.ruleContent = def.ruleContent
            ruleInfo.ruleTypeId = def.ruleTypeId
            ruleInfo.useForBiz = def.useForBiz
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

        if (name == 'useForBiz') {
            this.getBizRuleList()
            this.clearRuleInfo()
        }
        if (name == 'id') {
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
        let { columnInfo, ruleCondition } = this.state
        if (!columnInfo.columnId) {
            message.info('请选择检核字段')
            return
        }
        this.logicFilter && this.logicFilter.openModal(ruleCondition.expression, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName)
    }
    openFilterModal = () => {
        let { techRuleInfo, columnInfo } = this.state
        if (!columnInfo.columnId) {
            message.info('请选择检核字段')
            return
        }
        this.columnFilter && this.columnFilter.openModal(techRuleInfo.filterParam, columnInfo.tableId, columnInfo.columnId, columnInfo.tableName)
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
                        <Select dropdownClassName='dateColumnSelect' value={functionInfo.columnId} onChange={this.changeFunctionSelect.bind(this, 'columnId')} placeholder='请选择'>
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
    handleVisibleChange = () => {
        this.setState({
            popoverVisible: !this.state.popoverVisible,
        })
    }
    postData = () => {
        let { techRuleInfo, ruleInfo, ruleParam, ruleCondition, columnInfo } = this.state
        let data = {
            techRuleInfo,
            ruleInfo,
            ruleParam,
            ruleCondition,
            columnInfo,
        }
        this.form.validateFields().then((values) => {
            this.props.getPostData(data)
        })
    }
    render() {
        const { ruleModalType, primaryKeyList, techRuleInfo, typeList, ruleCondition, ruleParam, hasParam, ruleInfo, popoverVisible, columnList, joinColumnList, columnInfo, bizList, bizRuleList } =
            this.state
        const { setFieldsValue } = this.form
        return (
            <React.Fragment>
                <Form ref={(target) => (this.form = target)} style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }} className='EditMiniForm ruleForm'>
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
                                onChange={this.changeSelect.bind(this, 'columnId')}
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
                    <FormItem required label='规则类型' {...tailFormItemLayout}>
                        <Radio.Group disabled={ruleModalType == 'edit'} value={techRuleInfo.sqlSource} onChange={this.changeInput.bind(this, 'sqlSource')}>
                            <Radio value={1}>模板规则</Radio>
                            <Radio value={0}>自定义规则</Radio>
                        </Radio.Group>
                    </FormItem>
                    {techRuleInfo.sqlSource == 0 ? (
                        <FormItem
                            name='ruleName'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入规则名称!',
                                },
                                {
                                    max: 64,
                                    message: '名称不能超过64个字符!',
                                },
                            ]}
                            label='规则名称'
                            {...tailFormItemLayout}
                        >
                            <Input
                                disabled={ruleModalType == 'edit'}
                                placeholder='请输入'
                                onChange={this.changeColumnInfoInput.bind(this, 'ruleName')}
                                suffix={<span style={{ color: '#C4C8CC' }}>{columnInfo.ruleName ? columnInfo.ruleName.length : 0}/64</span>}
                            />
                        </FormItem>
                    ) : null}
                    <FormItem required={techRuleInfo.sqlSource == 0} label='规则类别' {...tailFormItemLayout}>
                        <div>
                            {ruleModalType == 'edit' ? (
                                <Select disabled value={ruleInfo.ruleTypeName} placeholder='请选择'></Select>
                            ) : (
                                <Cascader
                                    allowClear={false}
                                    expandTrigger='hover'
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    options={typeList}
                                    onChange={this.changeType}
                                    displayRender={(label) => label[label.length - 1]}
                                    popupClassName='searchCascader'
                                    placeholder='请选择'
                                />
                            )}
                        </div>
                    </FormItem>
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
                                    <div onClick={this.handleVisibleChange} className='fxFunction'>
                                        <span className='fxSpan'>fx</span>插入函数
                                    </div>
                                    {popoverVisible ? (
                                        <div ref={(dom) => (this.fxPopover = dom)} className='fxPopover'>
                                            {this.renderFxFunction()}
                                        </div>
                                    ) : null}
                                    <TextArea
                                        className='fxTextarea'
                                        value={columnInfo.sqlText}
                                        style={{ paddingTop: 10 }}
                                        placeholder='请输入'
                                        rows={4}
                                        onChange={this.changeColumnInfoInput.bind(this, 'sqlText')}
                                    />
                                </div>
                            </FormItem>
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
                                    <TextArea value={columnInfo.sqlTotal} style={{ paddingTop: 10 }} placeholder='请输入' rows={4} onChange={this.changeColumnInfoInput.bind(this, 'sqlTotal')} />
                                </div>
                            </FormItem>
                        </div>
                    ) : null}
                    {techRuleInfo.sqlSource == 1 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                            <FormItem label='业务类别' {...tailFormItemLayout}>
                                <Select value={ruleInfo.useForBiz} disabled={ruleModalType == 'edit'} onChange={this.changeSelect.bind(this, 'useForBiz')} placeholder='请选择'>
                                    {bizList.map((item) => {
                                        return (
                                            <Option value={item.code} key={item.code}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                            <FormItem required label='业务规则' {...tailFormItemLayout}>
                                <Select disabled={ruleModalType == 'edit'} value={ruleInfo.id} onChange={this.changeSelect.bind(this, 'id')} placeholder='请选择'>
                                    {bizRuleList.map((item) => {
                                        return (
                                            <Option def={item} value={item.id} key={item.id}>
                                                {item.ruleName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {hasParam !== 0 ? (
                                    <div style={{ width: 520, marginTop: 24 }}>
                                        {/*值域有效性*/}
                                        {hasParam == 2 && (ruleInfo.ruleTypeId == 'JHFL42' || ruleInfo.ruleTypeId == 'JHFL41') ? (
                                            <ValidateLength
                                                ref={(dom) => {
                                                    this.validateLength = dom
                                                }}
                                                setFieldsValue={setFieldsValue}
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
                                                setFieldsValue={setFieldsValue}
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
                                                setFieldsValue={setFieldsValue}
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
                                                setFieldsValue={setFieldsValue}
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
                                <div className='rangeArea' style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 16 }}>
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
                                    {ruleInfo.ruleTypeId == 'JHFL44' ? <div>{this.renderLogic()}</div> : null}
                                    {this.renderFilter()}
                                </div>
                            </FormItem>
                        </div>
                    ) : null}
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
                </Form>
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
