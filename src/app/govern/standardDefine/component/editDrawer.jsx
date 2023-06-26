import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, message, Radio, Select, Tooltip, Space, Modal } from 'antd'
import { addTreeNode, checkNodeName, updateTreeNode } from 'app_api/systemManage'

import { departments, getUserList } from 'app_api/manageApi'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import React, { Component } from 'react'
import { readChangeDepart, readChangeUser } from '@/api/confirmation'
import '../index.less'
import { Select as LocalSelect } from 'cps'

import moment from 'moment'

const { Option } = Select
const { TextArea } = Input

function getUserDataById(id, data) {
    return data.filter((v) => v.id === id)[0] || {}
}

export default class CategoryEditDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                featureConfiguration: [],
                hasChild: true,
                childNodeCount: 0,
            },
            parentInfo: {},
            type: 'add',
            addType: '1',
            disabledType: undefined,
            btnLoading: false,
            levelList: [],
            departmentList: [],

            departChangeData: {},
            userChangeData: 0,
            changeVisible: false,
            changeType: '',
            sourceData: {},

            treeData: [],
        }
    }

    openEditModal = async (parentInfo, data, treeData) => {
        await this.setState({
            modalVisible: true,
            type: 'edit',
            addInfo: { ...data },
            parentInfo,
            treeData,
        })
        setTimeout(() => {
            this.form.setFieldsValue(data)
        }, 0)
    }

    openAddModal = async (data, treeData) => {
        let { addInfo } = this.state
        addInfo = { featureConfiguration: [], hasChild: true, childNodeCount: 0 }
        await this.setState({
            modalVisible: true,
            type: 'add',
            addInfo,
            parentInfo: { ...data },
            userList: [],
            treeData,
        })
    }

    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        const data = await this.form
            .validateFields()
            .then((values) => {
                return true
            })
            .catch(() => false)
        if (!data) return

        let { type, addInfo, parentInfo } = this.state
        this.setState({ btnLoading: true })
        if (type === 'add') {
            // 新增
            let query = {
                parentId: parentInfo.id,
                name: addInfo.name,
                treeId: parentInfo.treeId,
                code: moment().format('x'),
            }
            let res = await checkNodeName({ name: query.name, parentId: query.parentId, treeId: query.treeId })
            if (!res.data) {
                this.postAddType(query, 'add')
            } else {
                message.error('类目名称重复！')
            }
        } else {
            let query = {
                id: addInfo.id,
                name: addInfo.name,
                parentId: addInfo.parentId,
                treeId: addInfo.treeId,
                code: addInfo.code,
                level: addInfo.level,
            }
            let res = await checkNodeName({ name: query.name, parentId: query.parentId, treeId: query.treeId, id: query.id })
            if (!res.data) {
                this.postAddType(query, 'edit')
            } else {
                message.error('类目名称重复！')
            }
        }
        this.setState({ btnLoading: false })
    }

    postAddType = async (query, type) => {
        let res
        if (type == 'add') {
            res = await addTreeNode(query)
        } else {
            res = await updateTreeNode(query)
        }
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.reload()
        }
    }

    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }

    cancelModal = () => {
        this.setState({
            modalVisible: false,
        })
    }

    validateName = (name, fieldName = 'name') => {
        const { treeData = [], sourceData, parentInfo } = this.state
        let find = false
        function loop(data) {
            data.forEach((v) => {
                if (v[fieldName] == name && (!sourceData[fieldName] || sourceData[fieldName] !== name)) {
                    find = true
                }
            })
        }
        loop(parentInfo.children || treeData || [])
        return find
    }

    render() {
        const { modalVisible, addInfo, btnLoading, type, parentInfo, changeType } = this.state
        let errorMsg = '上级节点: ' + parentInfo.name
        const that = this
        return (
            <Modal
                wrapClassName='classifyModal'
                visible={modalVisible}
                title={type == 'add' ? '添加分类' : '编辑分类'}
                onCancel={this.cancelModal}
                destroyOnClose
                footer={[
                    <Button onClick={this.cancel}>取消</Button>,
                    <Button htmlType='submit' loading={btnLoading} onClick={this.postData} type='primary'>
                        确定
                    </Button>,
                ]}
            >
                {parentInfo.name !== undefined ? <Alert style={{ marginBottom: 20 }} className='ErrorInfo' showIcon message={errorMsg} type='info' /> : null}
                <Form ref={(target) => (this.form = target)} className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                    {RenderUtil.renderFormItems([
                        {
                            label: `${parentInfo.level === 1 ? '数据域' : '条线'}名称`,
                            name: 'name',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入',
                                },
                                // {
                                //     validator: (_, value) => (!that.validateName(value) ? Promise.resolve() : Promise.reject(new Error('名称已存在'))),
                                // },
                            ],
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
                    ])}
                </Form>
            </Modal>
        )
    }
}
