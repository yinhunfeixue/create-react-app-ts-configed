import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Form, Input, message, Select } from 'antd'
import { addAnalysisThemeTree, updateAnalysisThemeTree } from 'app_api/dataSecurity'
import { getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select
const { TextArea } = Input

export default class AddNameRuleDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                childNodeCount: 0,
            },
            type: 'add',
            btnLoading: false,
            userList: [],
            prefixList: [undefined],
            suffixList: [undefined],
        }
    }

    openEditModal = async (data) => {
        await this.setState({
            modalVisible: true,
            type: 'edit',
            addInfo: { ...data },
        })
        this.getBizUserList()
    }
    openAddModal = async () => {
        let { addInfo } = this.state
        addInfo = {
            prefix: false,
            suffix: false,
        }
        await this.setState({
            modalVisible: true,
            type: 'add',
            addInfo,
        })
        this.getBizUserList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        let { type, addInfo } = this.state
        let query = {
            parentId: 0,
            ...addInfo,
        }
        this.setState({ btnLoading: true })
        let res = {}
        if (type == 'add') {
            res = await addAnalysisThemeTree(query)
        } else {
            res = await updateAnalysisThemeTree(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
        }
    }
    changeDetailSelect = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e
        this.setState({
            addInfo,
        })
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        if (name == 'prefix' || name == 'suffix') {
            addInfo[name] = e.target.checked
        } else {
            addInfo[name] = e.target.value
        }
        this.setState({
            addInfo,
        })
    }
    getBizUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.addInfo.businessDepartmentId,
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    changeFix = (name, index, e) => {
        this.state[name][index] = e
        this.setState({
            [name]: this.state[name],
        })
    }
    addFix = (name) => {
        this.state[name].push(undefined)
        this.setState({
            [name]: this.state[name],
        })
    }
    deleteFix = (name) => {
        if (this.state[name].length == 1) {
            return
        }
        this.state[name].pop()
        this.setState({
            [name]: this.state[name],
        })
    }
    render() {
        const { modalVisible, addInfo, btnLoading, type, userList, prefixList, suffixList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'nameRuleDrawer',
                    title: type == 'add' ? '新增规则' : '编辑规则',
                    width: 482,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.name} loading={btnLoading} onClick={this.postData} type='primary'>
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
                                    label: '规则名称',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.changeInput.bind(this, 'name')}
                                            maxLength={16}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/16</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '规则描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={64} style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/64</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '拼接内容',
                                    required: true,
                                    content: (
                                        <div>
                                            <Checkbox style={{ marginRight: 40 }} checked={addInfo.prefix} onChange={this.changeInput.bind(this, 'prefix')}>
                                                前缀
                                            </Checkbox>
                                            <Checkbox checked={addInfo.suffix} onChange={this.changeInput.bind(this, 'suffix')}>
                                                后缀
                                            </Checkbox>
                                        </div>
                                    ),
                                },
                                {
                                    label: '前缀定义',
                                    hide: !addInfo.prefix,
                                    content: (
                                        <div className='prefixArea'>
                                            {prefixList.map((item, index) => {
                                                return (
                                                    <span>
                                                        <Select allowClear style={{ width: '130px' }} onChange={this.changeFix.bind(this, 'prefixList', index)} value={item} placeholder='请选择'>
                                                            {userList.map((item) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        {prefixList.length == 1 || index + 1 == prefixList.length ? null : <span className='link'>_</span>}
                                                    </span>
                                                )
                                            })}
                                            <div className='btnArea'>
                                                <span onClick={this.addFix.bind(this, 'prefixList')}>+</span>
                                                <span style={{ marginLeft: 10 }} className={prefixList.length == 1 ? 'disableBtn' : ''} onClick={this.deleteFix.bind(this, 'prefixList')}>
                                                    -
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: '后缀定义',
                                    hide: !addInfo.suffix,
                                    content: (
                                        <div className='prefixArea'>
                                            {suffixList.map((item, index) => {
                                                return (
                                                    <span>
                                                        <Select allowClear style={{ width: '130px' }} onChange={this.changeFix.bind(this, 'suffixList', index)} value={item} placeholder='请选择'>
                                                            {userList.map((item) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        {suffixList.length == 1 || index + 1 == suffixList.length ? null : <span className='link'>_</span>}
                                                    </span>
                                                )
                                            })}
                                            <div className='btnArea'>
                                                <span onClick={this.addFix.bind(this, 'suffixList')}>+</span>
                                                <span style={{ marginLeft: 10 }} className={suffixList.length == 1 ? 'disableBtn' : ''} onClick={this.deleteFix.bind(this, 'suffixList')}>
                                                    -
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
