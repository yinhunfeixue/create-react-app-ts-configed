import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, Input, message, Radio, Select } from 'antd'
import { Form } from '@ant-design/compatible'
import { allSensitiveLevel, dataSecurityLevelList, desensitiseTagClass, desensitiseTagDetail, desensitizerule, saveDesensitiseTag } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'
import TagTypeModal from './tagTypeModal'

export default class AddTagDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                ruleList: [],
            },
            type: 'add',
            btnLoading: false,
            ruleList: [undefined],
            ruleOptionList: [],
            tagTypeList: [],
            sensitiveLevelList: [],
            levelList: [],
        }
    }
    openModal = async (data, type) => {
        this.setState({
            modalVisible: true,
            type,
        })
        if (type == 'edit') {
            this.getDesensitiseTagDetail(data.id)
        } else {
            data.ruleList = [{ id: undefined, name: '', isDefault: true }]
            this.setState({
                addInfo: data,
            })
            this.init()
        }
    }
    getDesensitiseTagDetail = async (id) => {
        let res = await desensitiseTagDetail({ id })
        if (res.code == 200) {
            await this.setState({
                addInfo: res.data,
            })
            this.init()
        }
    }
    init = () => {
        this.getRuleList()
        this.getDesensitiseTagClass()
        this.getAllSensitiveLevel()
        this.getDataSecurityLevelList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    reload = () => {
        this.getDesensitiseTagClass()
        let { addInfo } = this.state
        addInfo.categoryId = undefined
        this.setState({
            addInfo,
        })
    }
    getAllSensitiveLevel = async () => {
        let res = await allSensitiveLevel()
        if (res.code == 200) {
            this.setState({
                sensitiveLevelList: res.data,
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
    getDesensitiseTagClass = async () => {
        let res = await desensitiseTagClass()
        if (res.code == 200) {
            this.setState({
                tagTypeList: res.data,
            })
        }
    }
    getRuleList = async () => {
        let res = await desensitizerule({ needAll: true, status: 1 })
        if (res.code == 200) {
            await this.setState({
                ruleOptionList: res.data,
            })
            this.getRuleDisable()
        }
    }
    handleInputChange = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeSelect = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e
        this.setState({
            addInfo,
        })
    }
    changeRule = async (index, e, node) => {
        let { addInfo } = this.state
        addInfo.ruleList[index].id = e
        addInfo.ruleList[index].name = node.props.title
        await this.setState({
            addInfo,
        })
        this.getRuleDisable()
    }
    getRuleDisable = () => {
        let { addInfo, ruleOptionList } = this.state
        ruleOptionList.map((item) => {
            item.disabled = false
            addInfo.ruleList.map((node) => {
                if (item.id == node.id) {
                    item.disabled = true
                }
            })
        })
        this.setState({
            ruleOptionList,
        })
    }
    changeDefault = (index) => {
        let { addInfo } = this.state
        addInfo.ruleList.map((item) => {
            item.isDefault = false
        })
        addInfo.ruleList[index].isDefault = true
        this.setState({
            addInfo,
        })
    }
    addRule = () => {
        let { addInfo } = this.state
        addInfo.ruleList.push({ id: undefined, name: '', isDefault: false })
        this.setState({
            addInfo,
        })
    }
    deleteRule = async (index) => {
        let { addInfo } = this.state
        addInfo.ruleList.splice(index, 1)
        await this.setState({
            addInfo,
        })
        this.getRuleDisable()
    }
    postData = async () => {
        let { addInfo } = this.state
        let hasEmpty = false
        addInfo.ruleList.map((item) => {
            if (item.id == undefined) {
                hasEmpty = true
            }
        })
        if (hasEmpty) {
            message.info('请选择脱敏规则')
            return
        }
        let query = {
            ...addInfo,
        }
        this.setState({ btnLoading: true })
        let res = await saveDesensitiseTag(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.reloadTable()
        }
    }
    openTypeModal = () => {
        this.tagTypeModal && this.tagTypeModal.openModal()
    }
    renderDropdown = (menu) => {
        return (
            <div style={{ position: 'relative', paddingBottom: 40 }}>
                {menu}
                <a onClick={this.openTypeModal}>
                    <SettingOutlined style={{ margin: '0px 5px 0px 12px' }} />
                    类别管理
                </a>
            </div>
        )
    }
    render() {
        const { modalVisible, addInfo, btnLoading, type, ruleOptionList, tagTypeList, sensitiveLevelList, levelList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'addTagDrawer',
                    title: type == 'edit' ? '编辑敏感标签' : '新增敏感标签',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.name || !addInfo.englishName || !addInfo.categoryId || !addInfo.sensitivityLevel} loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '标签名称',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.handleInputChange.bind(this, 'name')}
                                            maxLength={16}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/16</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '标签英文名',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            disabled={type == 'edit'}
                                            value={addInfo.englishName}
                                            onChange={this.handleInputChange.bind(this, 'englishName')}
                                            maxLength={16}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.englishName ? addInfo.englishName.length : 0}/16</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '标签类别',
                                    required: true,
                                    content: (
                                        <div>
                                            <Select
                                                placeholder='请选择'
                                                onChange={this.changeSelect.bind(this, 'categoryId')}
                                                value={addInfo.categoryId}
                                                dropdownRender={this.renderDropdown}
                                                dropdownClassName='tagTypeDropdown'
                                            >
                                                {tagTypeList.map((item) => {
                                                    return (
                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                            {item.name}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    ),
                                },
                                {
                                    label: '敏感级别',
                                    required: true,
                                    content: (
                                        <Select value={addInfo.sensitivityLevel} placeholder='请选择' onChange={this.changeSelect.bind(this, 'sensitivityLevel')}>
                                            {sensitiveLevelList.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '建议安全等级',
                                    content: (
                                        <Select value={addInfo.securityLevel} allowClear placeholder='请选择' onChange={this.changeSelect.bind(this, 'securityLevel')}>
                                            {levelList.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '脱敏规则',
                                    required: true,
                                    content: (
                                        <div>
                                            {addInfo.ruleList.map((item, index) => {
                                                return (
                                                    <div className='ruleList'>
                                                        <Select value={item.id} style={{ width: 295 }} placeholder='请选择' onChange={this.changeRule.bind(this, index)}>
                                                            {ruleOptionList.map((node) => {
                                                                return (
                                                                    <Select.Option disabled={node.disabled} title={node.name} key={node.id} value={node.id}>
                                                                        {node.name}
                                                                    </Select.Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        <Radio onClick={this.changeDefault.bind(this, index)} checked={item.isDefault}>
                                                            默认
                                                        </Radio>
                                                        {!item.isDefault ? <div onClick={this.deleteRule.bind(this, index)} className='iconfont icon-lajitong'></div> : null}
                                                    </div>
                                                )
                                            })}
                                            <div style={{ marginTop: 8 }}>
                                                <a onClick={this.addRule}>
                                                    <PlusOutlined style={{ marginRight: 8 }} />
                                                    添加规则
                                                </a>
                                            </div>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                        <TagTypeModal reload={this.reload} ref={(dom) => (this.tagTypeModal = dom)} />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
