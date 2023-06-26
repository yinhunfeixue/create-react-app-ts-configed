import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Cascader, Form, Input, message, Select, Switch, Tooltip } from 'antd'
import { baseconfig, bizRuleSaveOrEdit, checkRuleTree, getBizRuleById, queryBizRuleGroup } from 'app_api/examinationApi'
import moment from 'moment'
import React, { Component } from 'react'
import DependColumn from '../component/dependColumn'
import ValidateCode from '../component/validateCode'
import ValidateContent from '../component/validateContent'
import ValidateLength from '../component/validateLength'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'

import '../index.less'

const { Option } = Select
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

class AddRuleForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleInfo: {
                ruleName: '',
                ruleDesc: '',
            },
            ruleLevel: 0,
            tipText: '用于检查目标字段是否为空',
            ruleParam: {},
            typeList: [],
            bizList: [],
            ruleTypeList: [],
        }
        this.form = {}
    }
    componentWillMount = () => {
        this.init()
        this.getRuleTree()
        this.baseconfigList()
        this.getRuleTypeList()
    }
    componentDidMount = async () => {
        if (this.pageParam.pageType == 'edit') {
            await this.getRuleDetail()
        }
        let { ruleInfo } = this.state
        ruleInfo.bizRuleGroupId = this.pageParam.bizRuleGroupId
        this.setState({
            ruleInfo,
            ruleLevel: this.pageParam.ruleLevel
        })
        this.form.setFieldsValue({
            bizRuleGroupId: this.pageParam.bizRuleGroupId,
        })
    }
    getRuleTypeList = async () => {
        let res = await queryBizRuleGroup()
        if (res.code == 200) {
            this.setState({
                ruleTypeList: res.data,
            })
        }
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    init = () => {
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
            dateFormat: 'yyyyMMdd',
            tableTypeList: []
        }
        this.setState({
            ruleParam,
        })
    }
    getRuleDetail = async () => {
        let { ruleInfo, ruleParam } = this.state
        let res = await getBizRuleById({ id: this.pageParam.id })
        if (res.code == 200) {
            ruleInfo = res.data
            ruleParam = JSON.parse(res.data.ruleParam)
            if (ruleParam.type == 3) {
                ruleParam.value = moment(ruleParam.value)
            }
            await this.setState({
                ruleInfo,
                ruleParam,
            })
            this.form.setFieldsValue({
                ruleTypeId: res.data.ruleTypeId,
                ruleName: res.data.ruleName,
                useForBiz: res.data.useForBiz,
                ruleDesc: res.data.ruleDesc,
                content: ruleParam.content,
                operator: ruleParam.operator,
                regexp: ruleParam.regexp,
                value: ruleParam.value,
                idCards: ruleParam.idCards,
            })
            await this.setParam()
            console.log(ruleParam, 'ruleParam')
            ruleParam.hasParam = JSON.parse(res.data.ruleParam).hasParam
            await this.setState({
                ruleParam,
            })
            this.validateLength && this.validateLength.getRuleData(ruleInfo, ruleParam)
            this.dependColumn && this.dependColumn.getRuleData(ruleInfo, ruleParam)
            this.validateContent && this.validateContent.getRuleData(ruleInfo, ruleParam)
            this.validateCode && this.validateCode.getRuleData(ruleInfo, ruleParam)
        }
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            let data = this.deleteSubList(res.data.children)
            this.setState({
                typeList: this.getTypeList(data, 1),
                tableTypeList: this.getTypeList(data, 2),
            })
        }
    }
    getTypeList = (data, type) => {
        let newTree = data.filter(x => x.type == type)
        newTree.forEach(x => x.children&&(x.chlidren = this.getTypeList(x.children, type)))
        return newTree
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
    baseconfigList = async () => {
        let res = await baseconfig({ group: 'useForBiz' })
        if (res.code == 200) {
            this.setState({
                bizList: res.data,
            })
        }
    }
    handleInputChange = (name, e) => {
        let { ruleInfo } = this.state
        ruleInfo[name] = e.target.value
        this.setState({
            ruleInfo,
        })
    }
    changeSelect = (name, e) => {
        let { ruleInfo } = this.state
        ruleInfo[name] = e
        this.setState({
            ruleInfo,
        })
    }
    cancel = () => {
        this.props.addTab('业务规则')
    }
    postData = async () => {
        let { ruleInfo, ruleParam, ruleLevel } = this.state
        if (ruleParam.minValueMsg) {
            return
        }
        if (ruleParam.hasParam == 1) {
            if (ruleInfo.ruleTypeId == 'JHFL45') {
                if (!ruleParam.column.id) {
                    message.info('请选择依赖字段')
                    return
                }
            }
            if (ruleInfo.ruleTypeId == 'JHFL39') {
                if (!ruleParam.code.id) {
                    message.info('请选择代码项')
                    return
                }
            }
        }
        if (ruleParam.hasParam == 1 && ruleParam.content == 1 && !ruleParam.containContents.length) {
            message.info('请选择内容规范')
            return
        }
        if (ruleParam.hasParam == 1 && ruleParam.content == 1 && ruleParam.isContain == 1 && ruleParam.hasSp && !ruleParam.specialChars.length) {
            message.info('特殊字符不能为空')
            return
        }
        this.form.validateFields().then((values) => {
            let queryParam = this.queryFormat(ruleParam)
            let query = {
                ...ruleInfo,
                ruleParam: JSON.stringify(queryParam),
                ruleLevel
            }
            bizRuleSaveOrEdit(query).then((res) => {
                if (res.code == 200) {
                    message.success('操作成功')
                    this.cancel()
                }
            })
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
    getNewRuleParam = (data) => {
        this.setState({
            ruleParam: data,
        })
    }
    changeType = async (value, selectedOptions) => {
        let { ruleInfo } = this.state
        ruleInfo.ruleTypeIds = value
        ruleInfo.ruleTypeId = value.length ? value[value.length - 1] : ''
        await this.setState({
            ruleInfo,
        })
        this.form.setFieldsValue({
            ruleTypeId: value.length ? value[value.length - 1] : '',
            operator: '',
        })
        await this.init()
        this.setParam()
    }
    setParam = async () => {
        let { ruleInfo, ruleParam, tipText } = this.state
        if (
            ruleInfo.ruleTypeId == 'JHFL45' ||
            ruleInfo.ruleTypeId == 'JHFL39' ||
            ruleInfo.ruleTypeId == 'JHFL42' ||
            ruleInfo.ruleTypeId == 'JHFL41' ||
            (ruleInfo.ruleTypeId == 'JHFL40' && (ruleParam.content == 1 || ruleParam.content == 4))
            // ruleInfo.ruleTypeId == 'JHFL47' ||
            // ruleInfo.ruleTypeId == 'JHFLT21' ||
            // ruleInfo.ruleTypeId == 'JHFLT22' ||
            // ruleInfo.ruleTypeId == 'JHFLT11'
        ) {
            ruleParam.hasParam = 1
        } else {
            ruleParam.hasParam = 0
        }
        console.log('ruleInfo.ruleTypeId',ruleInfo.ruleTypeId);
        switch (ruleInfo.ruleTypeId) {
            case 'JHFL46': // 对应关系唯一
                tipText = '用于检查目标字段与关联字段间关系是否唯一'
                ruleParam.needMerge = false
                break
            case 'JHFL47': //记录完整性
                tipText = '用于检查表的记录数是否存在缺失'
                ruleParam.needMerge = false
                break
            case 'JHFL83': //业务时间对比
                tipText = '用于检验被检核字段与业务时间之间的时间差'
                ruleParam.needMerge = false
                break
            case 'JHFL81': //时间函数比较
                tipText = '单个字段和业务日期之间的及时性的对比'
                ruleParam.needMerge = false
                break
            case 'JHFL82': //时间字段比较
                tipText = '用于两个时间字段之间时间差的比较'
                ruleParam.needMerge = false
                break
            case 'JHFL43': //非空完整性
                tipText = '用于检查目标字段是否非空'
                ruleParam.needMerge = false
                break
            case 'JHFL38': // 唯一性
                tipText = '用于检查目标字段是否存在重复数据'
                ruleParam.needMerge = false
                break
            case 'JHFL42': //范围(值域)有效性
                tipText = '检查目标字段是否在某个取值范围内，目标字段可以为数值类型、字符类型和日期类型'
                ruleParam.needMerge = true
                break
            case 'JHFL44': //逻辑一致性
                tipText = '用于检查目标字段之间的逻辑关系是否满足业务要求'
                ruleParam.needMerge = false
                break
            case 'JHFL45': //依赖一致性
                tipText = '用于检查目标字段是否存在于依赖表内，只能在同源的环境下生效'
                ruleParam.needMerge = true
                break
            case 'JHFL40': //内容有效性
                tipText = '用于检查目标字段的格式是否符合规范，支持身份证、手机号码、邮箱、日期等多种类型检核'
                ruleParam.needMerge = true
                break
            case 'JHFL41': //长度有效性
                tipText = '检查目标字段字符长度是否满足要求'
                ruleParam.needMerge = true
                break
            case 'JHFL39': //代码值域有效性
                tipText = '用于检查目标字段的取值范围是满足代码项的取值要求'
                ruleParam.needMerge = true
                break
            case 'JHFLT21': //表间检核-一致性
                tipText = '用于检查两个的数据量是否存在差异'
                ruleParam.needMerge = false
                break
            case 'JHFLT22': //表间检核-及时性
                tipText = '用于检查两表数据同步时间是否满足要求'
                ruleParam.needMerge = false
                break
            case 'JHFLT11': //单表-表行数波动率
                tipText = '用于检查表行数的波动率'
                ruleParam.needMerge = false
                break
            case 'JHFLT13': //单表-表非空
                tipText = '用于检查表行数是否非空'
                ruleParam.needMerge = false
                break
            case 'JHFLT12': //单表-字段非完全相同
                tipText = '用于检查表中一列或多列数据是否仅有一值'
                ruleParam.needMerge = false
                break
            default:
                break
        }
        await this.setState({
            ruleInfo,
            ruleParam,
            tipText,
        })
        this.validateLength && this.validateLength.getRuleData(ruleInfo, ruleParam)
        this.dependColumn && this.dependColumn.getRuleData(ruleInfo, ruleParam)
        this.validateContent && this.validateContent.getRuleData(ruleInfo, ruleParam)
        this.validateCode && this.validateCode.getRuleData(ruleInfo, ruleParam)
    }
    changeParam = async (name, e) => {
        let { ruleParam, ruleInfo } = this.state
        if (name == 'hasParam') {
            ruleParam.hasParam = e ? 1 : 2
            await this.setState({
                ruleParam,
            })
            this.validateLength && this.validateLength.getRuleData(ruleInfo, ruleParam)
            this.dependColumn && this.dependColumn.getRuleData(ruleInfo, ruleParam)
            this.validateContent && this.validateContent.getRuleData(ruleInfo, ruleParam)
            this.validateCode && this.validateCode.getRuleData(ruleInfo, ruleParam)
            this.form.validateFields(['operator', 'value', 'idCards'], { force: true })
        } else {
            ruleParam[name] = e
            await this.setState({
                ruleParam,
            })
            this.setParam()
            this.form.setFieldsValue({
                [name]: e,
            })
        }
    }
    changeAddType = async (value) => {
        let { ruleInfo } = this.state
        if (this.pageParam.pageType == 'edit') {
            return
        }
        this.setState({
            ruleLevel: value,
        })
        ruleInfo.ruleTypeIds = []
        ruleInfo.ruleTypeId = ''
        await this.setState({
            ruleInfo,
        })
        this.form.resetFields(['ruleTypeId', 'operator'])
        await this.init()
        this.setParam()
    }
    render() {
        const { tableTypeList, ruleLevel, ruleInfo, ruleParam, typeList, bizList, tipText, ruleTypeList } = this.state
        const { setFieldsValue } = this.form
        console.log('ruleParam', ruleParam)
        return (
            <React.Fragment>
                <TableLayout
                    title={this.pageParam.pageType == 'edit' ? '编辑业务规则' : '新增业务规则'}
                    renderDetail={() => (
                        <div class='EditMiniForm ruleForm formWidth techRuleDrawer'>
                            <div className='tabBtn' style={{ marginBottom: 24 }}>
                                <div onClick={this.changeAddType.bind(this, 0)} className={ruleLevel == 0 ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                    {ruleLevel == 0 ? <SvgIcon name='icon_tag_top' /> : null}
                                    <span>字段级规则</span>
                                </div>
                                <div onClick={this.changeAddType.bind(this, 1)} className={ruleLevel == 1 ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                    {ruleLevel == 1 ? <SvgIcon name='icon_tag_top' /> : null}
                                    <span>表级规则</span>
                                </div>
                            </div>
                            <Form ref={(target) => (this.form = target)} style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24 }}>
                                <FormItem
                                    name='ruleName'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入名称!',
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
                                        placeholder='请输入'
                                        onChange={this.handleInputChange.bind(this, 'ruleName')}
                                        suffix={<span style={{ color: ruleInfo.ruleName.length > 64 ? 'red' : '#C4C8CC' }}>{ruleInfo.ruleName.length}/64</span>}
                                    />
                                </FormItem>
                                <FormItem
                                    name='ruleDesc'
                                    rules={[
                                        {
                                            max: 128,
                                            message: '名称不能超过128个字符!',
                                        },
                                    ]}
                                    label='规则描述'
                                    className='descFormItem'
                                    {...tailFormItemLayout}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <TextArea value={ruleInfo.ruleDesc} placeholder='请输入' rows={2} onChange={this.handleInputChange.bind(this, 'ruleDesc')} />
                                        <span style={{ position: 'absolute', lineHeight: 1, bottom: 12, right: 12, color: (ruleInfo.ruleDesc || '').length > 128 ? 'red' : '#C4C8CC' }}>
                                            {(ruleInfo.ruleDesc || '').length}/128
                                        </span>
                                    </div>
                                </FormItem>
                                <FormItem
                                    name='bizRuleGroupId'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择规则分组!',
                                        },
                                    ]}
                                    label='规则分组'
                                    {...tailFormItemLayout}
                                >
                                    <Select onChange={this.changeSelect.bind(this, 'bizRuleGroupId')} placeholder='请选择'>
                                        {ruleTypeList.map((item) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </FormItem>
                                {/*<FormItem name="useForBiz"*/}
                                {/*rules={*/}
                                {/*[*/}
                                {/*{*/}
                                {/*required: true,*/}
                                {/*message: '请选择适用业务!',*/}
                                {/*},*/}
                                {/*]*/}
                                {/*} label='适用业务' {...tailFormItemLayout}>*/}
                                {/*<Select onChange={this.changeSelect.bind(this, 'useForBiz')} placeholder='请选择'>*/}
                                {/*{bizList.map((item) => {*/}
                                {/*return (*/}
                                {/*<Option value={item.code} key={item.code}>*/}
                                {/*{item.name}*/}
                                {/*</Option>*/}
                                {/*)*/}
                                {/*})}*/}
                                {/*</Select>*/}
                                {/*</FormItem>*/}
                                <FormItem
                                    name='ruleTypeId'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择规则类型!',
                                        },
                                    ]}
                                    label='规则类型'
                                    {...tailFormItemLayout}
                                >
                                    <div>
                                        {this.pageParam.pageType == 'edit' ? (
                                            <Select disabled value={ruleInfo.ruleTypeName} placeholder='请选择'></Select>
                                        ) : (
                                            <Cascader
                                                allowClear={false}
                                                expandTrigger='hover'
                                                fieldNames={{ label: 'name', value: 'id' }}
                                                options={ruleLevel == 0 ? typeList : tableTypeList}
                                                onChange={this.changeType}
                                                displayRender={(label) => label[label.length - 1]}
                                                popupClassName='searchCascader'
                                                placeholder='请选择'
                                            />
                                        )}
                                        {ruleInfo.ruleTypeId ? <span style={{ color: '#9EA3A8', display: 'inline-block', marginTop: 8 }}>{tipText}</span> : null}
                                    </div>
                                </FormItem>
                                {ruleInfo.ruleTypeId == 'JHFL40' ? (
                                    <FormItem
                                        name='content'
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择内容格式!',
                                            },
                                        ]}
                                        label='内容格式'
                                        {...tailFormItemLayout}
                                    >
                                        <div>
                                            <Select disabled={this.pageParam.pageType == 'edit'} value={ruleParam.content} onChange={this.changeParam.bind(this, 'content')} placeholder='请选择'>
                                                <Option value={1} key={1}>
                                                    字符
                                                </Option>
                                                <Option value={8} key={8}>
                                                    数值
                                                </Option>
                                                <Option value={4} key={4}>
                                                    日期
                                                </Option>
                                                <Option value={3} key={3}>
                                                    身份证
                                                </Option>
                                                <Option value={5} key={5}>
                                                    手机号码
                                                </Option>
                                                <Option value={6} key={6}>
                                                    电子邮箱
                                                </Option>
                                                <Option value={2} key={2}>
                                                    正则表达式
                                                </Option>
                                            </Select>
                                            {ruleParam.content == 5 || ruleParam.content == 6 ? (
                                                <span style={{ color: '#9EA3A8', display: 'inline-block', marginTop: 8 }}>
                                                    {ruleParam.content == 5 ? '规范说明：1开头，固定长度11位的数字' : '格式说明：只能包含数字、英文字母和下划线，包含 @ 并且以 .com 等结尾'}
                                                </span>
                                            ) : null}
                                        </div>
                                    </FormItem>
                                ) : null}
                                {ruleParam.hasParam == 0 ? null : (
                                    <FormItem label=''>
                                        <Switch disabled={this.pageParam.pageType == 'edit'} onChange={this.changeParam.bind(this, 'hasParam')} checked={ruleParam.hasParam == 1 ? true : false} />
                                        <span style={{ color: '#5E6266', margin: '0 5px 0 12px' }}>设置参数</span>
                                        <Tooltip title=' 开启参数设置，本条业务规则只能检查目标字段是否满足设定的取值范围'>
                                            <InfoCircleOutlined
                                                style={{
                                                    color: '#5E6266',
                                                }}
                                            />
                                        </Tooltip>
                                        <div className='dashLine'></div>
                                    </FormItem>
                                )}
                                {/*值域有效性*/}
                                {ruleInfo.ruleTypeId == 'JHFL42' || ruleInfo.ruleTypeId == 'JHFL41' ? (
                                    <ValidateLength
                                        ref={(dom) => {
                                            this.validateLength = dom
                                        }}
                                        setFieldsValue={setFieldsValue}
                                        ruleInfo={ruleInfo}
                                        ruleParam={ruleParam}
                                        getNewRuleParam={this.getNewRuleParam}
                                        pageType={this.pageParam.pageType}
                                    />
                                ) : null}
                                {/*依赖一致性*/}
                                {ruleInfo.ruleTypeId == 'JHFL45' ? (
                                    <DependColumn
                                        ref={(dom) => {
                                            this.dependColumn = dom
                                        }}
                                        setFieldsValue={setFieldsValue}
                                        ruleParam={ruleParam}
                                        getNewRuleParam={this.getNewRuleParam}
                                        pageType={this.pageParam.pageType}
                                    />
                                ) : null}
                                {ruleInfo.ruleTypeId == 'JHFL40' ? (
                                    <ValidateContent
                                        ref={(dom) => {
                                            this.validateContent = dom
                                        }}
                                        setFieldsValue={setFieldsValue}
                                        ruleInfo={ruleInfo}
                                        ruleParam={ruleParam}
                                        getNewRuleParam={this.getNewRuleParam}
                                        pageType={this.pageParam.pageType}
                                    />
                                ) : null}
                                {ruleInfo.ruleTypeId == 'JHFL39' ? (
                                    <ValidateCode
                                        ref={(dom) => {
                                            this.validateCode = dom
                                        }}
                                        setFieldsValue={setFieldsValue}
                                        ruleInfo={ruleInfo}
                                        ruleParam={ruleParam}
                                        getNewRuleParam={this.getNewRuleParam}
                                        pageType={this.pageParam.pageType}
                                    />
                                ) : null}
                            </Form>
                        </div>
                    )}
                    showFooterControl
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button type='primary' onClick={this.postData}>
                                    保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                />
            </React.Fragment>
        )
    }
}
export default AddRuleForm
