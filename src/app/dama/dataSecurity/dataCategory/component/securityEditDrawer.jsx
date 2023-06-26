import DrawerLayout from '@/component/layout/DrawerLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Col, Form, Input, InputNumber, message, Radio, Row, Select, Switch, Tooltip } from 'antd'
import { addEigen, addSecurityTree, dataSecurityLevelList, desensitiseTag, editEigen, updateSecurityTree } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select
const { TextArea } = Input

const whiteRule = { type: 'string', whitespace: true }

export default class SecurityEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                columnCnNames: [],
                columnEnNames: [],
                hasChild: true,
                childNodeCount: 0,
                level: 1,
            },
            parentInfo: {},
            selectedItem: [],
            type: 'add',
            addType: '1',
            btnLoading: false,
            levelList: [],
            tagList: [],
            superiorSet: false,
        }
    }

    openEditModal = async (parentInfo, data, selectedItem) => {
        let addInfo = JSON.parse(JSON.stringify(data))
        console.log('data', data)
        addInfo.securityLevel = addInfo.securityLevel == '' ? undefined : addInfo.securityLevel
        addInfo.columnCnNames = addInfo.columnCnNames && addInfo.columnCnNames !== undefined ? addInfo.columnCnNames.split(',') : []
        addInfo.columnEnNames = addInfo.columnEnNames && addInfo.columnEnNames !== undefined ? addInfo.columnEnNames.split(',') : []
        addInfo.chinese = addInfo.columnCnNames.length ? true : false
        addInfo.english = addInfo.columnEnNames.length ? true : false
        let superiorSet = false
        if (addInfo.columnCnNames.length || addInfo.columnEnNames.length || addInfo.sampleVerifyType !== 0) {
            superiorSet = true
        }
        await this.setState({
            modalVisible: true,
            type: 'edit',
            addInfo,
            parentInfo,
            superiorSet,
            selectedItem,
        })
        this.form.setFieldsValue({
            name: addInfo.name,
            eigenName: addInfo.name,
            securityLevel: addInfo.securityLevel,
            name_zhengze: addInfo.regex,
            name_count: addInfo.sampleSize || 500,
            name_hit: addInfo.hitRate || 60,
        })
        this.getAddType()
        this.init()
    }
    openAddModal = async (data, selectedItem) => {
        let { addInfo } = this.state
        data.level = data.level ? data.level : 0
        data.hasChild = data.hasChild !== undefined ? data.hasChild : true
        addInfo = {
            columnCnNames: [],
            columnEnNames: [],
            hasChild: data.level == 8 ? false : true,
            polymerType: 0,
            status: true,
            sampleVerifyType: 0,
            hitRate: 60,
            sampleSize: 500,
        }
        await this.setState({
            modalVisible: true,
            type: 'add',
            addInfo,
            parentInfo: { ...data },
            superiorSet: false,
            selectedItem,
        })
        this.form.setFieldsValue({
            name_count: 500,
            name_hit: 60,
        })
        this.getAddType()
        this.init()
    }
    getAddType = () => {
        let { parentInfo, type, addType, addInfo } = this.state
        addType = type == 'edit' ? addInfo.businessTag : parentInfo.level < 9 && parentInfo.hasChild ? '1' : '2'
        if (addType == '2' && type == 'add') {
            addInfo.securityLevel = parentInfo.securityLevel
            this.form.setFieldsValue({
                securityLevel: parentInfo.securityLevel,
            })
        }
        this.setState({
            addType,
            addInfo,
        })
    }
    init = async () => {
        this.getDataSecurityLevelList()
        this.getTagList()
        let { addInfo, parentInfo, type } = this.state
        if (type == 'add') {
            addInfo.securityLevel = parentInfo.securityLevel
            await this.setState({
                addInfo,
            })
        }
    }
    getTagList = async () => {
        let res = await desensitiseTag({ needAll: true })
        if (res.code == 200) {
            let data = res.data || []
            data = data.filter((v) => v.status == 1)
            this.setState({
                tagList: [...data],
            })
        }
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        let { type, addInfo, parentInfo, addType, superiorSet, selectedItem } = this.state
        this.form.validateFields().then((values) => {
            addInfo.securityLevel = addInfo.securityLevel == undefined ? '' : addInfo.securityLevel
            console.log('values', values)
            let query = {
                code: '',
                parentId: parentInfo.id == undefined ? 0 : parentInfo.id,
                treeId: parentInfo.treeId,
                ...addInfo,
                businessTag: addType,
                classPath: '',
            }
            if (addType == '2') {
                let classPath = []
                selectedItem.map((item) => {
                    classPath.push(item.name)
                })
                query.classPath = classPath.join('/')
                if (query.polymerType == 0) {
                    query.polymerLevel = query.securityLevel
                }
                query.classId = query.parentId
                query.level = query.securityLevel
                query.columnCnNames = addInfo.columnCnNames.length ? addInfo.columnCnNames.join(',') : ''
                query.columnEnNames = addInfo.columnEnNames.length ? addInfo.columnEnNames.join(',') : ''
                if (!superiorSet) {
                    query.columnCnNames = ''
                    query.columnEnNames = ''
                    query.sampleVerifyType = 0
                } else {
                    if (addInfo.chinese && !addInfo.columnCnNames.length) {
                        message.info('请填写字段中文名识别关键词')
                        return
                    }
                    if (addInfo.english && !addInfo.columnEnNames.length) {
                        message.info('请填写字段英文名识别关键词')
                        return
                    }
                }
            }
            this.setState({ btnLoading: true })
            if (type == 'add') {
                if (addType == '2') {
                    addEigen(query).then((res) => {
                        this.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            this.cancel()
                            this.props.reload()
                        }
                    })
                } else {
                    addSecurityTree(query).then((res) => {
                        this.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            this.cancel()
                            this.props.reload()
                        }
                    })
                }
            } else {
                if (addType == '2') {
                    editEigen(query).then((res) => {
                        this.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            this.cancel()
                            this.props.reload()
                        }
                    })
                } else {
                    updateSecurityTree(query).then((res) => {
                        this.setState({ btnLoading: false })
                        if (res.code == 200) {
                            message.success('操作成功')
                            this.cancel()
                            this.props.reload()
                        }
                    })
                }
            }
        })
    }
    changeDetailSelect = async (name, e) => {
        let { addInfo, addType, parentInfo } = this.state
        if (name == 'polymerLevel') {
            if (e < addInfo.securityLevel) {
                message.info('融合等级不能小于安全等级')
            } else {
                addInfo[name] = e
            }
        } else if (name == 'securityLevel') {
            if (addType == '2') {
                if (e < parentInfo.securityLevel) {
                    message.info('特征安全等级不能小于上级分类安全等级')
                    this.form.setFieldsValue({
                        securityLevel: addInfo.securityLevel,
                    })
                } else {
                    addInfo[name] = e
                    if (addInfo.polymerType == 0) {
                        addInfo.polymerLevel = e
                    } else {
                        addInfo.polymerLevel = undefined
                    }
                }
            } else {
                addInfo[name] = e
            }
        } else {
            addInfo[name] = e
        }
        this.setState({
            addInfo,
        })
    }
    changeCheckbox = (name, e) => {
        let { addInfo } = this.state
        if (name == 'sampleVerifyType') {
            addInfo[name] = e.target.checked ? 1 : 0
        } else if (name == 'chinese') {
            if (!e.target.checked) {
                addInfo.columnCnNames = []
            }
            addInfo[name] = e.target.checked
        } else if (name == 'english') {
            if (!e.target.checked) {
                addInfo.columnEnNames = []
            }
            addInfo[name] = e.target.checked
        } else {
            addInfo[name] = e.target.checked
        }
        this.setState({
            addInfo,
        })
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        if (name == 'polymerType' && e.target.value == 0) {
            addInfo.polymerLevel = addInfo.securityLevel
        }
        this.setState({
            addInfo,
        })
    }
    renderLabel = () => {
        return (
            <div style={{ textAlign: 'left' }}>
                特征配置
                <Tooltip title={<div>特征配置是指该类别下表所具有的特征是属性，特征属性可以用表中包含的字段名称表示，例如：普通行情类数据一般包含 成交金额、成交数量、当前价格等字段信息。</div>}>
                    <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: 4 }} />
                </Tooltip>
            </div>
        )
    }
    openSet = () => {
        this.setState({
            superiorSet: !this.state.superiorSet,
        })
    }
    render() {
        const { modalVisible, addInfo, btnLoading, levelList, type, addType, parentInfo, tagList, superiorSet } = this.state
        const children = []
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
        }
        let errorMsg = '上级节点：' + parentInfo.name
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'securityEditDrawer',
                    title: type == 'add' ? (addType == 1 ? '添加分类' : '添加特征') : addType == 1 ? '编辑分类' : '编辑特征',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {parentInfo.name !== undefined ? <Alert style={{ marginBottom: 20 }} className='ErrorInfo' showIcon message={errorMsg} type='info' /> : null}
                        <Form
                            ref={(target) => (this.form = target)}
                            initialValues={{
                                status: true,
                            }}
                            className='EditMiniForm Grid1'
                            style={{ columnGap: 8 }}
                        >
                            {RenderUtil.renderFormItems([
                                {
                                    label: '分类名称',
                                    hide: addType == '2',
                                    required: true,
                                    name: 'name',
                                    rules: [{ required: true, message: '请输入名称' }, whiteRule],
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.changeInput.bind(this, 'name')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '特征中文名',
                                    hide: addType == '1',
                                    required: true,
                                    name: 'eigenName',
                                    rules: [{ required: true, message: '请输入名称' }, whiteRule],
                                    content: <Input placeholder='请输入' value={addInfo.eigenName} onChange={this.changeInput.bind(this, 'eigenName')} maxLength={16} showCount />,
                                },
                                {
                                    label: '分类描述',
                                    hide: addType == '2',
                                    rules: [whiteRule],
                                    name: '_description',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={128} style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: (
                                        <div>
                                            有无子分类<span style={{ visibility: parentInfo.level == 8 ? 'visible' : 'hidden', color: '#F54B45', marginLeft: 12 }}>分类层级已达上限（9）</span>
                                        </div>
                                    ),
                                    hide: type === 'edit' ? true : addType == '2',
                                    required: true,
                                    content: (
                                        <Radio.Group disabled={parentInfo.level == 8} value={addInfo.hasChild} onChange={this.changeInput.bind(this, 'hasChild')}>
                                            <Radio value={true}>有</Radio>
                                            <Radio value={false}>无</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '安全等级',
                                    hide: addType == '1' && addInfo.hasChild,
                                    required: true,
                                    name: 'securityLevel',
                                    rules: [{ required: true, message: '请选择安全等级' }],
                                    content: (
                                        <Select style={{ width: '100%' }} onChange={this.changeDetailSelect.bind(this, 'securityLevel')} value={addInfo.securityLevel} placeholder='请选择'>
                                            {levelList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '安全等级（融合后）',
                                    hide: addType == '1',
                                    required: true,
                                    content: (
                                        <div>
                                            <Radio.Group value={addInfo.polymerType} onChange={this.changeInput.bind(this, 'polymerType')}>
                                                <Radio value={0}>默认等级</Radio>
                                                <Radio value={1}>自定义</Radio>
                                            </Radio.Group>
                                            {addInfo.polymerType == 1 ? (
                                                <Select
                                                    style={{ width: '100%', marginTop: 16 }}
                                                    onChange={this.changeDetailSelect.bind(this, 'polymerLevel')}
                                                    value={addInfo.polymerLevel}
                                                    placeholder='请选择'
                                                >
                                                    {levelList.map((item) => {
                                                        return (
                                                            <Option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            ) : null}
                                        </div>
                                    ),
                                },
                                {
                                    label: '敏感标签',
                                    hide: addType == '1',
                                    content: (
                                        <Select style={{ width: '100%' }} onChange={this.changeDetailSelect.bind(this, 'tagId')} value={addInfo.tagId} placeholder='请选择' allowClear>
                                            {tagList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '特征词描述',
                                    hide: addType == '1',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={128} style={{ height: 52 }} value={addInfo.eigenDesc} onChange={this.changeInput.bind(this, 'eigenDesc')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.eigenDesc ? addInfo.eigenDesc.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '特征状态',
                                    hide: addType == '1',
                                    content: (
                                        <div>
                                            <Switch onChange={this.changeDetailSelect.bind(this, 'status')} checked={addInfo.status} />
                                            {!addInfo.status ? <span style={{ color: '#606366', marginLeft: 20 }}>注意：识别时，不适用这个特征进行匹配</span> : null}
                                        </div>
                                    ),
                                },
                            ])}
                            <div style={{ display: addType == 2 ? 'block' : 'none' }}>
                                <div style={{ display: superiorSet ? 'block' : 'none' }}>
                                    <ModuleTitle
                                        title='高级设置'
                                        renderHeaderExtra={() => {
                                            return (
                                                <Button onClick={this.openSet} type='link'>
                                                    取消高级设置
                                                </Button>
                                            )
                                        }}
                                    />

                                    <Alert style={{ marginTop: 16 }} className='ErrorInfo' showIcon message='识别条件：同时满足以下条件即命中规则' type='warning' />
                                    <div className='EditMiniForm Grid1'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '',
                                                content: (
                                                    <div>
                                                        <Checkbox onChange={this.changeCheckbox.bind(this, 'chinese')} checked={addInfo.chinese}>
                                                            <TipLabel label='字段中文名识别' tip='识别信息为中文名和字段注释信息' />
                                                        </Checkbox>
                                                        <br />
                                                        {addInfo.chinese ? (
                                                            <Select
                                                                allowClear
                                                                showArrow={false}
                                                                className='tagsSelect'
                                                                dropdownClassName='hideDropdown'
                                                                mode='tags'
                                                                tokenSeparators={[',', '，', '↵']}
                                                                placeholder='可添加多个关键词，使用逗号分隔'
                                                                value={addInfo.columnCnNames}
                                                                onChange={this.changeDetailSelect.bind(this, 'columnCnNames')}
                                                            ></Select>
                                                        ) : null}
                                                        <Checkbox onChange={this.changeCheckbox.bind(this, 'english')} checked={addInfo.english}>
                                                            字段英文名识别
                                                        </Checkbox>
                                                        <br />
                                                        {addInfo.english ? (
                                                            <Select
                                                                allowClear
                                                                showArrow={false}
                                                                className='tagsSelect'
                                                                dropdownClassName='hideDropdown'
                                                                mode='tags'
                                                                tokenSeparators={[',', '，', '↵']}
                                                                placeholder='可添加多个识别信息，使用逗号分隔'
                                                                value={addInfo.columnEnNames}
                                                                onChange={this.changeDetailSelect.bind(this, 'columnEnNames')}
                                                            ></Select>
                                                        ) : null}
                                                        <Checkbox
                                                            onChange={this.changeCheckbox.bind(this, 'sampleVerifyType')}
                                                            checked={addInfo.sampleVerifyType == 1 || addInfo.sampleVerifyType == 2}
                                                        >
                                                            数据内容识别
                                                        </Checkbox>
                                                    </div>
                                                ),
                                            },
                                            {
                                                label: '匹配方式',
                                                hide: !addInfo.sampleVerifyType,
                                                content: (
                                                    <Radio.Group value={addInfo.sampleVerifyType} onChange={this.changeInput.bind(this, 'sampleVerifyType')}>
                                                        <Radio value={1}>正则匹配</Radio>
                                                        {/*<Radio value={2}>算法函数</Radio>*/}
                                                    </Radio.Group>
                                                ),
                                            },
                                            {
                                                label: '正则表达式',
                                                hide: addInfo.sampleVerifyType !== 1,
                                                name: 'name_zhengze',
                                                rules: [{ required: true, message: '请输入正则表达式' }],
                                                content: <Input placeholder='请输入' value={addInfo.regex} onChange={this.changeInput.bind(this, 'regex')} />,
                                            },
                                            {
                                                label: '算法函数',
                                                hide: addInfo.sampleVerifyType !== 2,
                                                content: (
                                                    <Select style={{ width: '100%' }} onChange={this.changeDetailSelect.bind(this, 'algFuncId')} value={addInfo.algFuncId} placeholder='请选择'>
                                                        {/*{*/}
                                                        {/*tagList.map((item) => {*/}
                                                        {/*return (<Option key={item.id} value={item.id}>{item.name}</Option>)*/}
                                                        {/*})*/}
                                                        {/*}*/}
                                                    </Select>
                                                ),
                                            },
                                        ])}
                                    </div>
                                    <Row gutter={8} className='EditMiniForm' style={{ marginTop: 24 }}>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '扫描数据量',
                                                    hide: !addInfo.sampleVerifyType,
                                                    rules: [{ required: true, message: '请输入扫描数据量' }],
                                                    name: 'name_count',
                                                    content: (
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            value={addInfo.sampleSize}
                                                            placeholder='请输入'
                                                            onChange={this.changeDetailSelect.bind(this, 'sampleSize')}
                                                            min={0}
                                                            max={1000}
                                                            addonAfter='行'
                                                        />
                                                    ),
                                                },
                                            ])}
                                        </Col>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '命中率',
                                                    hide: !addInfo.sampleVerifyType,
                                                    rules: [{ required: true, message: '请输入命中率' }],
                                                    name: 'name_hit',
                                                    content: (
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            value={addInfo.hitRate}
                                                            placeholder='请输入'
                                                            onChange={this.changeDetailSelect.bind(this, 'hitRate')}
                                                            min={0}
                                                            max={100}
                                                            addonAfter='%'
                                                        />
                                                    ),
                                                },
                                            ])}
                                        </Col>
                                    </Row>
                                </div>
                                <Button style={{ width: 110, padding: 0, display: !superiorSet ? 'block' : 'none' }} type='link' onClick={this.openSet} icon={<PlusOutlined />}>
                                    添加高级设置
                                </Button>
                            </div>
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
