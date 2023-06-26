import { editStandard, getStandardCodeValue, queryDetailInfo } from '@/api/standardApi'
import { requestDepartmentTree } from '@/api/systemApi'
import EmptyIcon from '@/component/EmptyIcon'
import FoldAuchor from '@/component/foldAuchor/FoldAuchor'
import TableLayout from '@/component/layout/TableLayout'
import RichCascader from '@/component/lzAntd/RichCascader'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import { Form } from '@ant-design/compatible'
import { PlusOutlined } from '@ant-design/icons'
import { Anchor, Button, ConfigProvider, DatePicker, Divider, Input, InputNumber, message, Select, Table } from 'antd'
import { getTree } from 'app_api/systemManage'
import Lodash from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import AddRule from './addRule'

import './index.less'

const { Link } = Anchor
const { TextArea } = Input

class StandardEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addInfo: {},
            folded: true,
            standardThemeList: [],
            departmentList: [],
            standardDataType: [],
            standardLevel: [],
            standardSrc: [],
            treeData: [],
            btnLoading: false,
            columnData: [],
            dataList: [],
            tablePagination: {
                total: '',
                page: 1,
                page_size: 1000,
                paginationDisplay: 'none',
            },
        }
        this.columns = [
            {
                dataIndex: 'value',
                key: 'value',
                title: '代码值',
                width: 160,
                render: (text, record, index) => {
                    const { getFieldDecorator, getFieldValue } = this.props.form
                    const { columnData } = this.state
                    return (
                        <Form.Item style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator(index + 'valuevalidator', {
                                initialValue: text,
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            if (!value) {
                                                callback('请输入代码值')
                                            } else {
                                                for (let j = 0; j < columnData.length; j++) {
                                                    if (index !== j && getFieldValue(`${j}valuevalidator`) === value) {
                                                        callback('代码值已存在')
                                                    }
                                                }
                                                callback()
                                            }
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    className={'columnAutoInput' + index}
                                    placeholder='请输入代码值'
                                    onChange={this.onChangeColumnNameCn.bind(this, index, 'value')}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#C4C8CC' }}>{text ? text.length : 0}/64</span>}
                                />
                            )}
                        </Form.Item>
                    )
                },
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '代码值名称',
                width: 160,
                render: (text, record, index) => {
                    const { getFieldDecorator, getFieldValue } = this.props.form
                    const { columnData } = this.state
                    return (
                        <Form.Item style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator(index + 'namevalidator', {
                                initialValue: text,
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            if (!value) {
                                                callback('请输入代码值名称')
                                            } else {
                                                for (let j = 0; j < columnData.length; j++) {
                                                    if (index !== j && getFieldValue(`${j}namevalidator`) === value) {
                                                        callback('代码值名称已存在')
                                                    }
                                                }
                                                callback()
                                            }
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    className={'columnAutoInput' + index}
                                    placeholder='请输入代码值名称'
                                    onChange={this.onChangeColumnNameCn.bind(this, index, 'name')}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#C4C8CC' }}>{text ? text.length : 0}/64</span>}
                                />
                            )}
                        </Form.Item>
                    )
                },
            },
            {
                dataIndex: 'operation',
                key: 'operation',
                title: '操作',
                width: 90,
                render: (text, record, index) => {
                    return <a onClick={this.deleteData.bind(this, index)}>删除</a>
                },
            },
        ]
    }
    componentDidMount = () => {
        this.init()
        this.getTreeList()
    }
    init = async () => {
        const addInfo = this.pageParams
        const res = await queryDetailInfo({ standardId: addInfo.id })
        await this.setState({ addInfo })
        if (res.code === 200) {
            this.setState({ dataList: res.data })
        }
        if (addInfo.standardLevel === '代码标准') {
            this.getCodeList()
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    getCodeList = () => {
        const addInfo = this.pageParams
        getStandardCodeValue({ standard: addInfo.id, ...this.state.tablePagination }).then((res) => {
            if (res.code == '200') {
                this.setState({
                    columnData: res.data,
                })
            } else {
                message.error(res.msg ? res.msg : '请求列表失败')
            }
        })
    }

    getTreeList = async () => {
        requestDepartmentTree().then((res) => {
            if (res.code == '200') {
                this.setState({
                    departmentList: res.data,
                })
            } else {
                message.error(res.msg || '请求部门信息失败')
            }
        })
        const addInfo = this.pageParams
        let res3 = await getTree({ code: 'ZT002', firstLevelNodeId: addInfo.standardLevel === '代码标准' ? '8d90bf9c221b4ac3a18648e4e7fa2065' : 'bcb241779403499383cb341e03fb3e1f' })
        if (res3.code == 200) {
            this.setState({
                treeData: res3.data.children[0].children,
            })
        }
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    cancel = () => {
        this.props.addTab('标准维护')
    }

    postData = async () => {
        let { addInfo, columnData } = this.state
        // if(columnData.filter(item => !item.name || !item.value).length > 0){
        //     return message.error("请输入完整的代码值信息")
        // }
        this.props.form.validateFields().then((values) => {
            const addInfo = this.pageParams
            values.standardId = addInfo.id
            this.setState({ btnLoading: true })
            values.coSector = values.hasOwnProperty('coSector') ? values.coSector.join(',') : ''
            values.contextPath = values.hasOwnProperty('contextPath') ? values.contextPath.join(',') : ''
            values.controlDept = values.hasOwnProperty('controlDept') ? values.controlDept.join(',') : ''
            for (const key in values) {
                if (key.indexOf('valuevalidator') > -1 || key.indexOf('namevalidator') > -1) {
                    delete values[key]
                }
            }
            editStandard({ param: values, codeValueList: columnData, standardBizRuleList: values.ruleList }).then((res) => {
                this.setState({ btnLoading: false })
                if (res.code == 200) {
                    message.success('操作成功')
                    this.cancel()
                }
            })
        })
    }

    getSortData = (data) => {
        this.setState({
            columnData: [...data],
        })
    }

    addData = async () => {
        let { columnData } = this.state
        columnData.push({
            name: '',
            value: '',
            id: moment().format('X'),
        })
        await this.setState({
            columnData,
        })
    }

    onChangeColumnNameCn = async (index, type, e) => {
        let { columnData } = this.state
        let str = e.target.value
        // 只能连续输入一个空格
        if (str.length > 1) {
            if (str[str.length - 1] == ' ' && str[str.length - 2] == ' ') {
                str = str.slice(0, str.length - 1)
            }
        }
        columnData[index][type] = str
        await this.setState({
            columnData,
        })
    }

    deleteData = (index) => {
        let { columnData } = this.state
        columnData.splice(index, 1)
        this.props.form.resetFields()
        this.setState({ columnData })
    }

    renderDetailItem = (detail) => {
        const { departmentList, treeData } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form
        const {
            nameEn,
            nameCn,
            isRequiredField,
            value: { value, type, subTypeList },
        } = detail
        let component = React.createElement('div', null)
        if (type === 1) {
            switch (subTypeList[0]) {
                case '1':
                    component = (
                        <Input placeholder={`请输入${nameCn}`} maxLength={32} suffix={<span style={{ color: '#C4C8CC' }}>{getFieldValue(nameEn) ? getFieldValue(nameEn).length : 0}/32</span>} />
                    )
                    break
                case '2':
                    component = <InputNumber style={{ width: '100%' }} placeholder={`请输入${nameCn}`} />
                    break
                case '3':
                    component = <DatePicker style={{ width: '100%' }} placeholder={`请输入${nameCn}`} />
                    break
                case '4':
                    component = <TextArea placeholder='请输入' rows={1} maxLength={256} style={{ maxHeight: 52 }} />
                    break
                default:
                    break
            }
        } else if (type === 2) {
            component = (
                <Select placeholder='请选择'>
                    {subTypeList.map((node) => {
                        return (
                            <Select.Option key={node} value={node}>
                                {node}
                            </Select.Option>
                        )
                    })}
                </Select>
            )
        } else if (type === 4) {
            if (['controlDept', 'coSector'].indexOf(nameEn) > -1) {
                component = (
                    <RichCascader
                        allowClear
                        fieldNames={{ label: 'title', value: 'id' }}
                        options={departmentList}
                        popupClassName='searchCascader'
                        placeholder='请选择'
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                )
            } else if (nameEn === 'contextPath') {
                component = (
                    <RichCascader
                        allowClear
                        fieldNames={{ label: 'name', value: 'id' }}
                        options={treeData}
                        popupClassName='searchCascader'
                        placeholder='请选择'
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                )
            }
        }

        if (['standardLevel', 'entityStatus', 'entityId'].indexOf(nameEn) > -1) {
            component.props.disabled = true
        }

        return component
    }

    initialValue = (detail) => {
        const {
            nameEn,
            value: { value, type },
        } = detail
        let initValue = value.id
        if (['controlDept', 'coSector', 'contextPath'].indexOf(nameEn) > -1) {
            initValue = value.id ? value.id.split(',').filter((item) => item) : []
        }
        return initValue
    }

    render() {
        const { folded, addInfo, standardThemeList, btnLoading, departmentList, standardDataType, standardLevel, standardSrc, treeData, columnData, rootInfo, dataList } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <div className='standardEdit' id='pageContent'>
                <TableLayout
                    title={<div id='Basic-Info'>编辑标准</div>}
                    showFooterControl
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} type='primary' onClick={this.postData}>
                                    保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                    renderDetail={() => (
                        <div className={folded ? 'standardEditAreaFolded standardEditArea' : 'standardEditArea'}>
                            <div className='leftArea'>
                                {dataList.length > 0 && (
                                    <Form className='EditMiniForm' layout='vertical'>
                                        {dataList.map((metaModel, index) => {
                                            return (
                                                <React.Fragment>
                                                    <div key={metaModel.appBaseConfigId} id={metaModel.appBaseConfigId} className='tableInfo'>
                                                        <ModuleTitle title={metaModel.appBaseConfigName} />
                                                        <div className='Grid3'>
                                                            {metaModel.metaModelDetailList.map((detail) => {
                                                                const {
                                                                    isRequiredField,
                                                                    nameEn,
                                                                    nameCn,
                                                                    value: { value },
                                                                } = detail
                                                                return (
                                                                    <Form.Item name={nameEn} label={nameCn}>
                                                                        {getFieldDecorator(nameEn, {
                                                                            initialValue: this.initialValue(detail),
                                                                            rules: [
                                                                                {
                                                                                    required: isRequiredField,
                                                                                    message: `请填写${nameCn}`,
                                                                                },
                                                                            ],
                                                                        })(this.renderDetailItem(detail))}
                                                                    </Form.Item>
                                                                )
                                                            })}
                                                        </div>

                                                        {addInfo.standardLevel === '代码标准' && metaModel.appBaseConfigName === '技术属性' && (
                                                            <Form.Item name='代码值' style={{ marginTop: 12 }} label='代码值'>
                                                                <ConfigProvider
                                                                    renderEmpty={(name) => {
                                                                        return <EmptyIcon />
                                                                    }}
                                                                >
                                                                    <Table
                                                                        className='dataTableColumn'
                                                                        pagination={false}
                                                                        rowkey='id'
                                                                        columns={this.columns}
                                                                        scroll={{ y: 480 }}
                                                                        dataSource={Lodash.cloneDeep(columnData)}
                                                                    />
                                                                </ConfigProvider>
                                                                <Button icon={<PlusOutlined />} block onClick={this.addData} type='link'>
                                                                    添加
                                                                </Button>
                                                                <Divider style={{ margin: 0 }} />
                                                            </Form.Item>
                                                        )}
                                                    </div>
                                                    {addInfo.id && addInfo.standardLevel === '基础标准' && metaModel.appBaseConfigName === '业务属性' && (
                                                        <div id='ruleList' className='tableInfo'>
                                                            <ModuleTitle title='校验规则' />
                                                            <Form.Item>
                                                                {getFieldDecorator('ruleList', {
                                                                    initialValue: [],
                                                                    rules: [
                                                                        {
                                                                            required: false,
                                                                            message: `请填写校验规则`,
                                                                        },
                                                                    ],
                                                                })(<AddRule standardId={addInfo.id} />)}
                                                            </Form.Item>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </Form>
                                )}

                                {/* {folded ? (
                                    <span onClick={() => this.setState({ folded: false })} className='iconFold iconfont icon-zuo'></span>
                                ) : (
                                    <span onClick={() => this.setState({ folded: true })} className='iconUnFold iconFold iconfont icon-you'></span>
                                )} */}
                            </div>
                            <FoldAuchor style={{ alignSelf: 'flex-start' }} getContainer={() => document.getElementById('pageContent')}>
                                {dataList.map((metaModel, index) => (
                                    <React.Fragment>
                                        <Link href={`#${metaModel.appBaseConfigId}`} title={metaModel.appBaseConfigName} />
                                        {addInfo.id && addInfo.standardLevel === '基础标准' && metaModel.appBaseConfigName === '业务属性' && <Link href={`#ruleList`} title='校验规则' />}
                                    </React.Fragment>
                                ))}
                            </FoldAuchor>
                        </div>
                    )}
                />
            </div>
        )
    }
}

export default Form.create()(StandardEdit)
