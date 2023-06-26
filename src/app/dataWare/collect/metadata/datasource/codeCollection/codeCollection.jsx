import DrawerLayout from '@/component/layout/DrawerLayout'
import { InfoCircleOutlined, SyncOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Collapse, Checkbox, Form, Divider, Input, message, Radio, Select, Table, Tooltip } from 'antd'
import { getCodeSystemConf } from 'app_api/metadataApi'
import { Tools } from 'app_common'
import { Component, default as React } from 'react'
import _ from 'underscore'
import './codeCollection.less'
import Module from '@/component/Module'
import IconFont from '@/component/IconFont'



const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const fieldStyle = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
}

export default class CodeCollection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            itemDisabled: false, //是否可以选择
            wetherCodeDisabled: false, // 是否采集码表 是否禁用 要和其他 的分开控制
            codeTypeDisabled: false, // 码表类型 是否禁用 要和其他 的分开控制
            SQLInputDisabled: false, // sql语句的是否禁用 要和其他 的分开控制
            systermType: 'none', // 码表信息常用系统 默认选无 下面三个textarea默认必选
            commonSystermSelect: [], // 常用系统下拉框数据
            indieCode: false, // 是否有独立密码
            passwordRadioValue: '0', // 是否有独立密码的radio值
            saveTableSuccess: false, //保存是否成功
            passwordType: 'text', //密码输入框 当触发onchange事件的时候再变回password,

            modalVisible: false,
            modalType: 1,
            tableData: [
                { code: 'CD0001', name: '性别', database: 'database_name' },
                { code: 'CD0002', name: '客户类型', database: 'database_name' },
                { code: 'CD0003', name: '客户来源', database: 'database_name' },
            ],
            tableData1: [
                { code: 'CD0001', name: '男', value: '1' },
                { code: 'CD0001', name: '女', value: '0' },
                { code: 'CD0002', name: '个人客户', value: '1' },
                { code: 'CD0002', name: '机构客户', value: '2' },
                { code: 'CD0003', name: '手机端', value: 'mobile' },
                { code: 'CD0003', name: 'PC端', value: 'pc' },
            ],
            tableData2: [
                { code: 'CD0001', database: 'database_name', dataTable: 'table_name', dataColumn: 'gender' },
                { code: 'CD0002', database: 'database_name', dataTable: 'table_name', dataColumn: 'cust_type' },
                { code: 'CD0003', database: 'database_name', dataTable: 'table_name', dataColumn: 'cust_source' },
            ],

            codeItemSql: 'SELECT\n\t\t代码项ID as `code`,\n\t\t代码项名称  as `name`,\n\t\t数据库名称  as `database`\nFROM\t数据库.代码项表;',
            codeValueSql: 'SELECT\n\t\t代码项ID as `code`,\n\t\t代码值ID  as `value` ,\n\t\t代码值名称 as `name`\nFROM\t数据库.代码值表;',
            codeFieldSql: 'SELECT\n\t\t库名称  as database_name,\n\t\t表名称  as table_name,\n\t\t字段名称  as field_name,\n\t\t代码项ID  as `code`\nFROM\t数据库.字段代码值关系表 ;',

            codeItemSqlValue: '',
            codeValueSqlValue: '',
            codeFieldSqlValue: ''
        }

        this.codeItemSqlLabel = (
            <span>
                代码项采集SQL{' '}
                <Tooltip title='代码项采集配置sql需要select 代码项 as code, 代码项的名称 as name ，具体的数据库 as database '>
                    {' '}
                    <InfoCircleOutlined />
                </Tooltip>
            </span>
        )
        this.codeFieldSqlLabel = (
            <span>
                字段-代码项引用关系采集SQL{' '}
                <Tooltip title='引用关系的采集需要 select 字段 as fieldName, 代码项 as code'>
                    {' '}
                    <InfoCircleOutlined />
                </Tooltip>
            </span>
        )
        this.codeValueSqlLabel = (
            <span>
                代码值采集SQL{' '}
                <Tooltip title='代码值的采集需要 select 代码项 as code，代码值 as  value ，代码值名称 as name'>
                    {' '}
                    <InfoCircleOutlined />
                </Tooltip>
            </span>
        )
        this.columns = [
            {
                title: '代码项ID（code）',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '代码项名称（name）',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '代码所属库（database）',
                dataIndex: 'database',
                key: 'database',
            },
        ]
        this.columns1 = [
            {
                title: '代码项ID（code）',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '代码值ID（value）',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: '代码值名称（name）',
                dataIndex: 'name',
                key: 'name',
            },
        ]
        this.columns2 = [
            {
                title: '库',
                dataIndex: 'database',
                key: 'database',
            },
            {
                title: '表',
                dataIndex: 'dataTable',
                key: 'dataTable',
            },
            {
                title: '字段',
                dataIndex: 'dataColumn',
                key: 'dataColumn',
            },
            {
                title: '代码项ID（code）',
                dataIndex: 'code',
                key: 'code',
            },
        ]
    }
    componentDidMount = () => {
        const { param } = this.props
        if (param.type === 'look') {
            this.setState({
                itemDisabled: true,
                SQLInputDisabled: true,
                wetherCodeDisabled: true,
            })
        } else {
            this.setState({
                itemDisabled: false,
                SQLInputDisabled: false,
                wetherCodeDisabled: false,
            })
        }

        if (param && param.type !== 'add') {
            this.resetFiledData(param)
        } else {
            this.form.setFieldsValue({
                codeItemSql: this.state.codeItemSql,
                codeFieldSql: this.state.codeFieldSql,
                codeValueSql: this.state.codeValueSql,
                adapter: 'none',
            })
            this.setState({
                codeItemSqlValue: this.state.codeItemSql,
                codeFieldSqlValue: this.state.codeFieldSql,
                codeValueSqlValue: this.state.codeValueSql,
            })
            this.getCodeSystemConfData()
            this.form.setFieldsValue({
                hasCode: false,
            })
            this.codeCollectionChange({ target: { checked: false } })
        }
    }

    resetSaveConnect() {
        this.setState({
            saveTableSuccess: false, //保存是否成功
        })
    }
    getProduct = (value) => {
        if (value == 'MYSQL' || value == 'MARIADB') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t代码项ID as `code`,\n\t\t代码项名称  as `name`,\n\t\t数据库名称  as `database`\nFROM\t数据库.代码项表;',
                codeValueSql: 'SELECT\n\t\t代码项ID as `code`,\n\t\t代码值ID  as `value` ,\n\t\t代码值名称 as `name`\nFROM\t数据库.代码值表;',
                codeFieldSql: 'SELECT\n\t\t库名称  as database_name,\n\t\t表名称  as table_name,\n\t\t字段名称  as field_name,\n\t\t代码项ID  as `code`\nFROM\t数据库.字段代码值关系表 ;',
            })
        } else if (value == 'HIVE' || value == 'IMPALA') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t代码项ID as `CODE`,\n\t\t代码项名称  as `NAME`,\n\t\t数据库名称  as `DATABASE`\nFROM\t数据库.代码项表',
                codeValueSql: 'SELECT\n\t\t代码项ID as `CODE`,\n\t\t代码值ID  as `VALUE` ,\n\t\t代码值名称 as `NAME`\nFROM\t数据库.代码值表',
                codeFieldSql: 'SELECT\n\t\t库名称  as `DATABASE_NAME`,\n\t\t表名称  as `TABLE_NAME`,\n\t\t字段名称  as `FIELD_NAME`,\n\t\t代码项ID  as `CODE`\nFROM\t数据库.字段代码值关系表',
            })
        } else if (value == 'SQLSERVER') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t代码项ID as "code",\n\t\t代码项名称  as "name",\n\t\t数据库名称  as "database"\nFROM\t数据库.dbo."代码项表"',
                codeValueSql: 'SELECT\n\t\t代码项ID as "code",\n\t\t代码值ID  as "value",\n\t\t代码值名称 as "name"\nFROM\t数据库.dbo."代码值表"',
                codeFieldSql: 'SELECT\n\t\t库名称  as "database_name",\n\t\t表名称  as "table_name",\n\t\t字段名称  as "field_name",\n\t\t代码项ID  as "code"\nFROM\t数据库.dbo."字段代码值关系表"',
            })
        } else if (value == 'POSTGRESQL' || value == 'GREENPLUM') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t代码项ID as code,\n\t\t代码项名称  as name,\n\t\t数据库名称  as database\nFROM\t代码项表',
                codeValueSql: 'SELECT\n\t\t代码项ID as code,\n\t\t代码值ID  as value,\n\t\t代码值名称 as name\nFROM\t代码值表',
                codeFieldSql: 'SELECT\n\t\t库名称  as database_name,\n\t\t表名称  as table_name,\n\t\t字段名称  as field_name,\n\t\t代码项ID  as code\nFROM\t字段代码值关系表',
            })
        } else if (value == 'DB2') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t代码项ID as code,\n\t\t代码项名称  as name,\n\t\t数据库名称  as database\nFROM\t数据库.代码项表',
                codeValueSql: 'SELECT\n\t\t代码项ID as code,\n\t\t代码值ID  as value,\n\t\t代码值名称 as name\nFROM\t数据库.代码值表',
                codeFieldSql: 'SELECT\n\t\t库名称  as database_name,\n\t\t表名称  as table_name,\n\t\t字段名称  as field_name,\n\t\t代码项ID  as code\nFROM\t数据库.字段代码值关系表',
            })
        } else if (value == 'ORACLE') {
            this.setState({
                codeItemSql: 'SELECT\n\t\t"代码项ID" as "code",\n\t\t"代码项名称"  as "name",\n\t\t"数据库名称"  as "database"\nFROM\t"数据库"."代码项表"',
                codeValueSql: 'SELECT\n\t\t"代码项ID" as "code",\n\t\t"代码值ID"  as "value",\n\t\t"代码值名称" as "name"\nFROM\t"数据库"."代码值表"',
                codeFieldSql:
                    'SELECT\n\t\t"库名称"  as "database_name",\n\t\t"表名称"  as "table_name",\n\t\t"字段名称"  as "field_name",\n\t\t"代码项ID"  as "code"\nFROM\t"数据库"."字段代码值关系表"',
            })
        }
    }

    getCodeSystemConfData = (id) => {
        getCodeSystemConf().then((res) => {
            if (res.code == '200') {
                this.setState(
                    {
                        commonSystermSelect: res.data,
                    },
                    () => {
                        if (this.props.param.type !== 'add') {
                            this.form.setFieldsValue({
                                adapter: id,
                            })
                        }
                    }
                )
            } else {
                message.error(res.msg ? res.msg : '获取常用系统失败！')
            }
        })
    }

    resetFiledData(dataSource) {
        if (Object.keys(dataSource).length !== 0) {
            if (dataSource.extra && dataSource.extra.codeParams.slice().length > 0) {
                let codeParams = dataSource.extra.codeParams.slice()[0]
                this.setState({
                    codeTypeDisabled: false,
                })
                this.form.setFieldsValue({
                    hasCode: true,
                })
                this.form.setFieldsValue({
                    codeItemSql: codeParams.codeItemSql,
                    codeFieldSql: codeParams.codeFieldSql,
                    codeValueSql: codeParams.codeValueSql,
                })
                this.setState({
                    codeItemSqlValue: codeParams.codeItemSql,
                    codeFieldSqlValue: codeParams.codeValueSql,
                    codeValueSqlValue: codeParams.codeFieldSql,
                })
            } else {
                this.getCodeSystemConfData()
                this.setState({
                    SQLInputDisabled: true,
                    codeTypeDisabled: true,
                })
                this.form.setFieldsValue({
                    hasCode: false,
                })
            }

            if (dataSource.extra && dataSource.extra.codeUsername) {
                this.setState(
                    {
                        passwordRadioValue: '1',
                        indieCode: true,
                        passwordType: 'password',
                    },
                    () => {
                        this.form.setFieldsValue({
                            codeUsername: dataSource.extra.codeUsername,
                            codePassword: '......',
                        })
                    }
                )
            } else {
                this.setState(
                    {
                        passwordRadioValue: '0',
                        indieCode: false,
                        passwordType: 'text',
                    },
                    () => {
                        this.form.setFieldsValue({
                            codeUsername: '',
                            codePassword: '',
                        })
                    }
                )
            }
            if (this.props.param.type == 'look') {
                this.setState({
                    codeTypeDisabled: true,
                })
            }
        }
    }

    // 是否是保存  from false 就是连接测试 true是连接完的下一步（Hive库表结构采集或者Oracle库表结构采集） 或者  hive码表采集情况的完成   修改的时候，要传给后台id
    handleSubmit = async () => {
        console.log(this.form.getFieldValue('hasCode'),'hasCode++++')
        if (this.form.getFieldValue('hasCode')) {
            await this.props.checkSqlChange('codeItemSql', { target: { value: this.state.codeItemSqlValue } })
            await this.props.checkSqlChange('codeValueSql', { target: { value: this.state.codeValueSqlValue } })
        }
        this.form
            .validateFields()
            .then((values) => {
            console.log(values,'values')
                let value = values
                if (this.form.getFieldValue('codePassword') == '......' || !this.form.getFieldValue('codePassword')) {
                    delete value.codePassword
                } else {
                    value.codePassword = Tools.encrypt(values.codePassword)
                }

                if (this.state.systermType === 'none') {
                    value.codeItemSql = this.form.getFieldValue('codeItemSql')
                    value.codeFieldSql = this.form.getFieldValue('codeFieldSql')
                    value.codeValueSql = this.form.getFieldValue('codeValueSql')
                }
                _.map(this.state.commonSystermSelect, (item, key) => {
                    if (this.form.getFieldValue('adapter') == item.id) {
                        value.codeItemSql = item.codeItemSql
                        value.codeFieldSql = item.codeFieldSql
                        value.codeValueSql = item.codeValueSql
                    }
                })

                this.wholeinfo = value
            })
            .catch(() => {
                this.wholeinfo = undefined
            })
    }

    getFormData = async () => {
        await this.handleSubmit()
        console.log(this.wholeinfo,'this.wholeinfo')
        this.wholeinfo = {
            hasCode: this.form.getFieldValue('hasCode'),
            codeItemSql: this.state.codeItemSqlValue,
            codeFieldSql: this.state.codeFieldSqlValue,
            codeValueSql: this.state.codeValueSqlValue,
        }
        return this.wholeinfo
    }

    changeSysterm = (id) => {
        this.setState({
            systermType: id,
        })
        if (id === 'none') {
            this.form.setFieldsValue({
                codeItemSql: '',
                codeFieldSql: '',
                codeValueSql: '',
            })
            this.setState({
                codeItemSqlValue: '',
                codeFieldSqlValue: '',
                codeValueSqlValue: '',
            })
            this.setState({
                SQLInputDisabled: false,
            })
        } else {
            _.map(this.state.commonSystermSelect, (item, key) => {
                if (id) {
                    if (item.id.toString() === id.toString()) {
                        this.form.setFieldsValue({
                            codeItemSql: item.codeItemSql,
                            codeFieldSql: item.codeFieldSql,
                            codeValueSql: item.codeValueSql,
                        })
                        this.setState({
                            codeItemSqlValue: item.codeItemSql,
                            codeFieldSqlValue: item.codeFieldSql,
                            codeValueSqlValue: item.codeValueSql,
                        })
                    }
                }
            })
            this.setState({
                SQLInputDisabled: true,
            })
        }
    }

    codeCollectionChange = (e) => {
        let { checked } = e.target
        this.form.setFieldsValue({
            hasCode: checked,
        })
        console.log(this.form.getFieldValue('hasCode'),'111')
        if (checked) {
            this.setState({
                SQLInputDisabled: false,
                itemDisabled: false,
                codeTypeDisabled: false,
            })
        } else {
            this.setState({
                SQLInputDisabled: true,
                itemDisabled: true,
                codeTypeDisabled: true,
            })
            this.form.setFields([
                {
                    name: 'codeItemSql',
                    value: this.form.getFieldValue('codeItemSql'),
                },
                {
                    name: 'codeValueSql',
                    value: this.form.getFieldValue('codeValueSql'),
                },
            ])
            this.setState({
                codeItemSqlValue: this.form.getFieldValue('codeItemSql'),
                codeValueSqlValue: this.form.getFieldValue('codeValueSql'),
            })
            this.form.validateFields()
        }
    }

    passwordChange = (e) => {
        this.setState({
            passwordRadioValue: e.target.value,
        })
        if (e.target.value == '0') {
            this.setState({
                indieCode: false,
            })
            this.props.resetSaveStatus()
        } else {
            this.setState({
                indieCode: true,
            })
        }
    }

    saveTableData = () => {
        this.props.saveTableData()
    }

    passwordTypeChange = () => {
        this.setState({
            passwordType: 'password',
        })
    }

    setFieldsRerrors = (param, errorsMsg, value) => {
        console.log('setFieldsRerrors', this.form.getFieldValue(param))
        this.form.setFields([
            {
                name: param,
                value,
                errors: [errorsMsg],
            },
        ])
    }
    getFieldsError = () => {
        this.form.validateFields()
    }

    // creatAutoCollection = (flag) => {
    //     this.props.creatCollection('1', flag)
    // }

    openModal = (type, e) => {
        e.stopPropagation()
        this.setState({
            modalVisible: true,
            modalType: type,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    resetSql = (name, e) => {
        e.preventDefault()
        if (name == 'codeItemSql') {
            this.form.setFieldsValue({
                codeItemSql: this.state[name],
            })
            this.setState({
                codeItemSqlValue: this.state[name],
            })
        } else if (name == 'codeValueSql') {
            this.form.setFieldsValue({
                codeValueSql: this.state[name],
            })
            this.setState({
                codeValueSqlValue: this.state[name],
            })
        } else {
            this.form.setFieldsValue({
                codeFieldSql: this.state[name],
            })
            this.setState({
                codeFieldSqlValue: this.state[name],
            })
        }
    }
    changeSql = (name, e) => {
        this.setState({
            [name]: e.target.value
        })
    }

    render() {
        const {
            itemDisabled,
            wetherCodeDisabled,
            codeTypeDisabled,
            SQLInputDisabled,
            commonSystermSelect,
            systermType,
            indieCode,
            passwordRadioValue,
            saveTableSuccess,
            passwordType,
            modalVisible,
            modalType,
            tableData,
            tableData1,
            tableData2,
            codeItemSqlValue,
            codeValueSqlValue,
            codeFieldSqlValue
        } = this.state
        const { saveMsg, saveStatus } = this.props

        let saveInfo = null
        if (saveStatus == 0) {
            saveInfo = null
        } else if (saveStatus == 1) {
            saveInfo = <span>{saveMsg}</span>
        } else if (saveStatus == 2) {
            saveInfo = <span>{saveMsg}</span>
        } else if (saveStatus == 3) {
            saveInfo = <span>{saveMsg}</span>
        }

        if (this.form) {
            console.log('getFieldsValue', this.form.getFieldsValue())
        }
        return (
            <Module title='码表信息'>
                <Form className='EditMiniForm codeCollection' ref={(target) => (this.form = target)} scrollToFirstError>
                    <Form.Item
                        name='hasCode'
                        label=''
                        style={{ marginBottom: 0 }}
                        className='inlineWrapper'
                        rules={[
                            {
                                required: !wetherCodeDisabled,
                                message: '请选择是否采集码表!',
                            },
                        ]}
                    >
                        <Checkbox onChange={this.codeCollectionChange} disabled={wetherCodeDisabled}>采集码表</Checkbox>
                        {/*<Radio.Group onChange={this.codeCollectionChange} disabled={wetherCodeDisabled}>*/}
                            {/*<Radio value={true}>是</Radio>*/}
                            {/*<Radio value={false}>否</Radio>*/}
                        {/*</Radio.Group>*/}
                    </Form.Item>
                    <FormItem
                        name='codeItemSql'
                        rules={
                            SQLInputDisabled
                                ? undefined
                                : [
                                {
                                    required: !SQLInputDisabled,
                                    message: '请输入代码项采集SQL!',
                                },
                                {
                                    max: 65535,
                                    type: 'string',
                                    message: '代码项采集SQL最大长度为65535!',
                                },
                            ]
                        }
                    >
                    <Collapse
                        expandIcon={({ isActive }) => isActive ? <IconFont className='icon-arrow' type='icon-arrow_down'/> : <IconFont className='icon-arrow' type='icon-arrow_right'/>}
                        style={{ marginTop: '24px' }} defaultActiveKey='1'>
                        <Panel
                            header={
                                <span>
                                {!SQLInputDisabled ? <span className='spanStar'>*</span> : null}
                                    代码项设置
                            </span>
                            }
                            key='1'
                            extra={
                                <div className='HControlGroup'>
                                    <a onClick={this.openModal.bind(this, 1)}>
                                        <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginRight: 8 }}/>说明</a>
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <Divider type='vertical' style={{ margin: '0 8px' }} />
                                    )}
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <a onClick={(e) => e.stopPropagation()} onMouseDown={this.resetSql.bind(this, 'codeItemSql')}>
                                            <span className="iconfont icon-shuaxin" style={{ color: '#5E6266', marginRight: 8 }}/>重置
                                        </a>
                                    )}
                                </div>
                            }
                        >
                            <TextArea
                                style={{ paddingTop: 10 }}
                                className='auto_height_textarea'
                                placeholder='请输入代码项采集SQL(可输入最大长度为65535字符)'
                                rows={6}
                                autosize
                                value={codeItemSqlValue}
                                onChange={this.changeSql.bind(this, 'codeItemSqlValue')}
                                disabled={SQLInputDisabled ? true : systermType !== 'none' ? true : false}
                                onBlur={this.props.param.type === 'look' ? null : this.props.checkSqlChange.bind(this, 'codeItemSql')}
                            />
                        </Panel>
                    </Collapse>
                    </FormItem>
                    <FormItem
                        name='codeValueSql'
                        rules={
                            SQLInputDisabled
                                ? undefined
                                : [
                                {
                                    required: !SQLInputDisabled,
                                    message: '请输入请代码值采集SQL！',
                                },
                                {
                                    max: 65535,
                                    message: '代码值采集SQL最大长度为65535!',
                                },
                            ]
                        }
                    >
                    <Collapse
                        expandIcon={({ isActive }) => isActive ? <IconFont className='icon-arrow' type='icon-arrow_down'/> : <IconFont className='icon-arrow' type='icon-arrow_right'/>}
                        style={{ marginTop: '24px' }} defaultActiveKey='1'>
                        <Panel
                            header={
                                <span>
                                {!SQLInputDisabled ? <span className='spanStar'>*</span> : null}
                                    代码值设置
                            </span>
                            }
                            key='1'
                            extra={
                                <div className='HControlGroup'>
                                    <a onClick={this.openModal.bind(this, 2)}>
                                        <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginRight: 8 }}/>说明</a>
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <Divider type='vertical' style={{ margin: '0 8px' }} />
                                    )}
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <a onClick={(e) => e.stopPropagation()} onMouseDown={this.resetSql.bind(this, 'codeValueSql')}>
                                            <span className="iconfont icon-shuaxin" style={{ color: '#5E6266', marginRight: 8 }}/>重置
                                        </a>
                                    )}
                                </div>
                            }
                        >
                            <TextArea
                                style={{ paddingTop: 10 }}
                                className='auto_height_textarea'
                                placeholder='请输入代码值采集SQL(可输入最大长度为65535字符)'
                                rows={6}
                                value={codeValueSqlValue}
                                onChange={this.changeSql.bind(this, 'codeValueSqlValue')}
                                disabled={SQLInputDisabled ? true : systermType !== 'none' ? true : false}
                                onBlur={this.props.param.type === 'look' ? null : this.props.checkSqlChange.bind(this, 'codeValueSql')}
                            />
                        </Panel>
                    </Collapse>
                    </FormItem>
                    <FormItem
                        name='codeFieldSql'
                        rules={
                            SQLInputDisabled
                                ? undefined
                                : [
                                {
                                    max: 65535,
                                    message: '字段-代码项引用关系采集SQL最大长度为65535!',
                                },
                            ]
                        }
                    >
                    <Collapse
                        expandIcon={({ isActive }) => isActive ? <IconFont className='icon-arrow' type='icon-arrow_down'/> : <IconFont className='icon-arrow' type='icon-arrow_right'/>}
                        style={{ marginTop: '24px' }} defaultActiveKey='1'>
                        <Panel
                            header={<span>字段-代码项关系设置</span>}
                            key='1'
                            extra={
                                <div className='HControlGroup'>
                                    <a onClick={this.openModal.bind(this, 3)}>
                                        <span className="iconfont icon-jinggao warning" style={{ color: '#5E6266', marginRight: 8 }}/>说明</a>
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <Divider type='vertical' style={{ margin: '0 8px' }} />
                                    )}
                                    {SQLInputDisabled || systermType !== 'none' ? null : (
                                        <a onClick={(e) => e.stopPropagation()} onMouseDown={this.resetSql.bind(this, 'codeFieldSql')}>
                                            <span className="iconfont icon-shuaxin" style={{ color: '#5E6266', marginRight: 8 }}/>重置
                                        </a>
                                    )}
                                </div>
                            }
                        >
                            <TextArea
                                style={{ paddingTop: 10 }}
                                className='auto_height_textarea'
                                placeholder='请输入字段-代码项引用关系采集SQL(可输入最大长度为65535字符)'
                                rows={6}
                                value={codeFieldSqlValue}
                                onChange={this.changeSql.bind(this, 'codeFieldSqlValue')}
                                disabled={SQLInputDisabled ? true : systermType !== 'none' ? true : false}
                                onBlur={this.props.param.type === 'look' ? null : this.props.checkSqlChange.bind(this, 'codeFieldSql')}
                            />
                        </Panel>
                    </Collapse>
                    </FormItem>
                    <DrawerLayout
                        drawerProps={{
                            width: 800,
                            title: modalType == 1 ? '代码项说明' : modalType == 2 ? '代码值说明' : '字段-代码项关系说明',
                            visible: modalVisible,
                            onClose: this.cancel,
                        }}
                        // width={800} title={modalType == 1 ? '代码项说明' : modalType == 2 ? '代码值说明' : '字段-代码项关系说明'} visible={modalVisible} onCancel={this.cancel} footer={null}
                    >
                        {modalVisible ? (
                            <div>
                                {modalType == 1 ? (
                                    <div>
                                        <div style={{ marginBottom: 5 }}>下方表格为量之系统内部的代码项表样式。</div>
                                        <div style={{ marginBottom: 5 }}>您可以通过配置或写sql的方式将对应的数据填充入量之内部的代码项表</div>
                                        <div style={{ marginBottom: 5 }}>1.代码项ID：标识同一个数据库中唯一的代码项ID。</div>
                                        <div style={{ marginBottom: 5 }}>2.代码项名称：标识代码项的名称，了解代码项含义。</div>
                                        <div style={{ marginBottom: 16 }}>3.代码所属库：标识代码项所属的数据库。使用页面配置方式时，用户无需填写。</div>
                                        <Table bordered rowKey='id' columns={this.columns} dataSource={tableData} pagination={false} />
                                    </div>
                                ) : null}
                                {modalType == 2 ? (
                                    <div>
                                        <div style={{ marginBottom: 5 }}>下方表格为量之系统内部的代码值表的样式。</div>
                                        <div style={{ marginBottom: 5 }}>您可以通过配置或写sql的方式将对应的数据填充入量之内部的代码值表</div>
                                        <div style={{ marginBottom: 5 }}>1.代码项ID：标识同一个数据库中唯一的代码项ID。</div>
                                        <div style={{ marginBottom: 5 }}>2.代码值ID：标识同一个代码项下中唯一的代码值，即字段中存储的代码值。</div>
                                        <div style={{ marginBottom: 16 }}>3.代码值名称：标识每个代码值的含义。</div>
                                        <Table bordered rowKey='id' columns={this.columns1} dataSource={tableData1} pagination={false} />
                                    </div>
                                ) : null}
                                {modalType == 3 ? (
                                    <div>
                                        <div style={{ marginBottom: 5 }}>下方表格为量之系统内部的字段代码项关系表的样式。</div>
                                        <div style={{ marginBottom: 5 }}>您可以通过配置或写sql的方式将对应的数据填充入量之内部的字段代码项关系表</div>
                                        <div style={{ marginBottom: 5 }}>1.库、表、字段：一起标识出当前数据源下的唯一字段</div>
                                        <div style={{ marginBottom: 16 }}>2.代码值ID：标识字段引用的代码项。</div>
                                        <Table bordered rowKey='id' columns={this.columns2} dataSource={tableData2} pagination={false} />
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </DrawerLayout>
                </Form>
            </Module>
        )
    }
}
