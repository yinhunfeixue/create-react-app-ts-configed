import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Form, Input, message, Select } from 'antd'
import { addAnalysisThemeTree, dataSecurityLevelList, updateAnalysisThemeTree } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select
const { TextArea } = Input

export default class ThemeEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                childNodeCount: 0,
            },
            treeId: '',
            type: 'add',
            btnLoading: false,
            levelList: [],
            departmentList: [],
            userList: [],
        }
    }

    openEditModal = async (data) => {
        data.businessDepartmentId = data.businessDepartmentId == '' ? undefined : data.businessDepartmentId
        data.businessManagerId = data.businessManagerId == '' ? undefined : data.businessManagerId
        data.securityLevel = data.securityLevel == '' ? undefined : data.securityLevel
        await this.setState({
            modalVisible: true,
            type: 'edit',
            addInfo: { ...data },
            treeId: data.treeId,
            userList: [],
        })
        this.init()
        this.getBizUserList()
    }
    openAddModal = async (treeId) => {
        let { addInfo } = this.state
        addInfo = {}
        await this.setState({
            modalVisible: true,
            type: 'add',
            addInfo,
            treeId,
            userList: [],
        })
        this.init()
    }
    init = async () => {
        this.getDataSecurityLevelList()
        this.getDepartment()
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
        let { type, addInfo, treeId } = this.state
        addInfo.businessDepartmentId = addInfo.businessDepartmentId == undefined ? '' : addInfo.businessDepartmentId
        addInfo.businessManagerId = addInfo.businessManagerId == undefined ? '' : addInfo.businessManagerId
        addInfo.securityLevel = addInfo.securityLevel == undefined ? '' : addInfo.securityLevel
        let query = {
            parentId: 0,
            treeId: treeId,
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
            this.props.reload()
        }
    }
    changeDetailSelect = async (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e
        await this.setState({
            addInfo,
        })
        if (name == 'businessDepartmentId') {
            addInfo.businessManagerId = undefined
            this.setState({
                addInfo,
                userList: [],
            })
            this.getBizUserList()
        }
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
            this.setState({
                departmentList: res.data,
            })
        }
    }
    getBizUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.state.addInfo.businessDepartmentId,
        }
        if (query.departmentId == undefined) {
            return
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
            this.setState({
                userList: res.data,
            })
        }
    }
    render() {
        const { modalVisible, addInfo, btnLoading, levelList, type, departmentList, userList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: type == 'add' ? '添加分析主题' : '编辑分析主题',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.name || !addInfo.englishName || !addInfo.code} loading={btnLoading} onClick={this.postData} type='primary'>
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
                                    label: '',
                                    content: <Module title='基本信息' style={{ padding: 0 }}></Module>,
                                },
                                {
                                    label: '分析主题（中文名）',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.changeInput.bind(this, 'name')}
                                            maxLength={64}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/64</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '分析主题（英文名）',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.englishName}
                                            onChange={this.changeInput.bind(this, 'englishName')}
                                            maxLength={64}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.englishName ? addInfo.englishName.length : 0}/64</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '英文缩写',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='缩写当做词根放入词根库'
                                            value={addInfo.code}
                                            onChange={this.changeInput.bind(this, 'code')}
                                            disabled={type == 'edit'}
                                            maxLength={16}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.code ? addInfo.code.length : 0}/16</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={128} style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                // {
                                //     label: '安全等级',
                                //     content: <Select
                                //         allowClear
                                //         style={{ width: '100%' }}
                                //         onChange={this.changeDetailSelect.bind(this, 'securityLevel')}
                                //         value={addInfo.securityLevel}
                                //         placeholder='请选择'
                                //     >
                                //         {
                                //             levelList.map((item) => {
                                //                 return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                //             })
                                //         }
                                //     </Select>,
                                // },
                                {
                                    label: '',
                                    content: <Divider />,
                                },
                                {
                                    label: '',
                                    content: <Module title='业务信息' style={{ padding: 0 }}></Module>,
                                },
                                {
                                    label: '业务归属部门',
                                    content: (
                                        <Select
                                            allowClear
                                            style={{ width: '100%' }}
                                            onChange={this.changeDetailSelect.bind(this, 'businessDepartmentId')}
                                            value={addInfo.businessDepartmentId}
                                            placeholder='请选择'
                                        >
                                            {departmentList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.departName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '业务负责人',
                                    content: (
                                        <Select
                                            allowClear
                                            style={{ width: '100%' }}
                                            onChange={this.changeDetailSelect.bind(this, 'businessManagerId')}
                                            value={addInfo.businessManagerId}
                                            placeholder='请选择'
                                        >
                                            {userList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.realname}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
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
