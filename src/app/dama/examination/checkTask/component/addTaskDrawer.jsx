import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Form, Input, message, Radio, Select } from 'antd'
import { addDgdlGen } from 'app_api/autoManage'
import { requestUserList } from '@/api/systemApi'
import { createTaskGroup, updateTaskGroup } from 'app_api/examinationApi'
import React, { Component } from 'react'
import RichSelect from '@/component/lzAntd/RichSelect'
import '../index.less'

const { TextArea } = Input

export default class AddTaskDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                taskType: 1,
            },
            btnLoading: false,
            pageType: 'add',
            userList: [],
        }
    }

    openModal = async (data, type) => {
        let { addInfo } = this.state
        data.taskType = data.taskType ? data.taskType : 1
        await this.setState({
            modalVisible: true,
            addInfo: { ...data },
            pageType: type,
        })
        this.getUserData()
    }
    getUserData = async () => {
        let { addInfo } = this.state
        let res = await requestUserList({ needAll: true, status: 1 })
        if (res.code == 200) {
            let array = []
            res.data.map((item) => {
                array.push(item.id)
            })
            if (!array.includes(addInfo.managerId)) {
                addInfo.managerId = undefined
            }
            this.setState({
                userList: res.data,
                addInfo,
            })
        }
    }
    postData = async () => {
        let { addInfo, pageType } = this.state
        let query = {
            ...addInfo,
        }
        let res = {}
        this.setState({ btnLoading: true })
        if (pageType == 'add') {
            res = await createTaskGroup(query)
        } else {
            query.taskGroupId = addInfo.taskGroupId
            query.taskGroupName = addInfo.name
            res = await updateTaskGroup(query)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
            if (pageType == 'add') {
                this.props.addTab('检核任务详情', { ...res.data }, true)
            }
        }
    }
    changeDatasource = (e, node) => {
        let { addInfo } = this.state
        addInfo.managerId = e
        addInfo.managerName = node.props.name
        this.setState({
            addInfo,
        })
    }
    handleInputChange = (name, e) => {
        let { addInfo } = this.state
        if (name == 'name') {
            addInfo[name] = e.target.value
        } else {
            addInfo[name] = e.target.value
        }
        this.setState({
            addInfo,
        })
    }
    blurName = () => {
        let { addInfo } = this.state
        if (addInfo.name[0] == ' ') {
            addInfo.name = addInfo.name.slice(1, addInfo.name.length)
        }
        if (addInfo.name[addInfo.name.length - 1] == ' ') {
            addInfo.name = addInfo.name.slice(0, addInfo.name.length - 1)
        }
        console.log(addInfo.name, 'blurName')
        this.setState({
            addInfo,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        const { modalVisible, addInfo, btnLoading, userList, pageType } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: pageType == 'edit' ? '编辑任务' : '新增任务',
                    className: 'addTaskDrawer',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.managerId || !addInfo.name} loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button disabled={btnLoading} onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '任务名称',
                                    required: true,
                                    content: (
                                        <div>
                                            <Input
                                                placeholder='请输入'
                                                value={addInfo.name}
                                                onChange={this.handleInputChange.bind(this, 'name')}
                                                onBlur={this.blurName}
                                                maxLength={32}
                                                suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/32</span>}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    label: '描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea
                                                style={{ marginBottom: 0 }}
                                                maxLength={128}
                                                value={addInfo.description}
                                                onChange={this.handleInputChange.bind(this, 'description')}
                                                placeholder='请输入'
                                            />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '负责人',
                                    required: true,
                                    content: (
                                        <RichSelect
                                            dataSource={userList}
                                            dataKey='id'
                                            showSearch
                                            optionFilterProp='title'
                                            placeholder='请选择'
                                            value={addInfo.managerId}
                                            onChange={this.changeDatasource}
                                        >
                                            {userList &&
                                                userList.map((item) => {
                                                    return (
                                                        <Select.Option name={item.name} title={item.name + item.account} key={item.id} value={item.id}>
                                                            {item.name}（{item.account}）
                                                        </Select.Option>
                                                    )
                                                })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '任务类型',
                                    required: true,
                                    content: (
                                        <div>
                                            <Radio.Group disabled={pageType == 'edit'} value={addInfo.taskType} onChange={this.handleInputChange.bind(this, 'taskType')}>
                                                <Radio value={1}>常规任务</Radio>
                                                <Radio value={2}>质量提升</Radio>
                                            </Radio.Group>
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
