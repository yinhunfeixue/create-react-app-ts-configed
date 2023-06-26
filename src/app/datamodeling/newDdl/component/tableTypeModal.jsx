import { Input, Button, Modal, message, Divider, Spin } from 'antd'
import React, { Component } from 'react'
import '../../index.less'
import { tableGroup, addTableGroup, delTableGroup } from 'app_api/dataModeling'

export default class TableTypeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            btnLoading: false,
            tagTypeList: [],
            tagTypeListBackup: [],
            loading: false,
        }
    }

    openModal = () => {
        this.setState({
            modalVisible: true,
        })
        this.getDesensitiseTagClass()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getDesensitiseTagClass = async () => {
        this.setState({ loading: true })
        let res = await tableGroup()
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.code = item.name
            })
            this.setState({
                tagTypeList: res.data,
                tagTypeListBackup: res.data,
            })
        }
    }
    deleteData = (data) => {
        let that = this
        if (data.childCount) {
            Modal.warning({
                title: '删除分组',
                content: '该分类下有模型表，不可删除',
            })
        } else {
            Modal.confirm({
                title: '删除分组',
                content: '该分组内暂无信息，是否确认删除',
                okText: '删除',
                cancelText: '取消',
                onOk() {
                    that.confirmDelete(data.id)
                },
            })
        }
    }
    confirmDelete = async (id) => {
        this.setState({ loading: true })
        let res = await delTableGroup({ id })
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('删除成功')
            this.getDesensitiseTagClass()
            this.props.reloadTableType()
        }
    }
    addData = async () => {
        let { tagTypeList } = this.state
        let hasInput = false
        tagTypeList.map((item) => {
            if (item.isEdit) {
                hasInput = true
            }
        })
        if (hasInput) {
            message.info('请先关闭当前输入框')
            return
        }
        tagTypeList.unshift({
            name: '',
            isEdit: true,
            isNew: true,
        })
        await this.setState({
            tagTypeList,
        })
        this.input.focus()
        document.querySelector('.tagTypeContent').scrollTop = 0
    }
    saveData = async (index) => {
        let { tagTypeList } = this.state
        if (!tagTypeList[index].name) {
            return
        }
        let query = {
            id: tagTypeList[index].id,
            name: tagTypeList[index].name,
        }
        this.setState({ loading: true })
        let res = await addTableGroup(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.getDesensitiseTagClass()
            this.props.reloadTableType()
        }
    }
    editData = async (index) => {
        let { tagTypeList } = this.state
        let hasInput = false
        tagTypeList.map((item) => {
            if (item.isEdit) {
                hasInput = true
            }
        })
        if (hasInput) {
            message.info('请先关闭当前输入框')
            return
        }
        tagTypeList[index].isEdit = true
        await this.setState({
            tagTypeList,
        })
        this.input.focus()
    }
    cancelEdit = (index) => {
        let { tagTypeList, tagTypeListBackup } = this.state
        console.log(tagTypeListBackup, 'tagTypeListBackup')
        if (tagTypeList[index].isNew == true) {
            tagTypeList.splice(index, 1)
        } else {
            tagTypeList[index].isEdit = false
            tagTypeList[index].name = tagTypeListBackup[index].code
        }
        this.setState({
            tagTypeList,
        })
    }
    changeName = (index, e) => {
        let { tagTypeList } = this.state
        tagTypeList[index].name = e.target.value
        this.setState({
            tagTypeList,
        })
    }
    render() {
        const { modalVisible, tagTypeList, loading } = this.state
        return (
            <Modal width={480} className='tableTypeModal' title='类别管理' visible={modalVisible} onCancel={this.cancel} footer={null}>
                {modalVisible && (
                    <Spin spinning={loading}>
                        <div style={{ position: 'relative', paddingBottom: 32 }}>
                            <div className='tagTypeContent commonScroll'>
                                {tagTypeList.map((item, index) => {
                                    return (
                                        <div className='tagTypeValue'>
                                            {item.isEdit ? (
                                                <div className='tagTypeInput'>
                                                    <Input
                                                        maxLength={16}
                                                        ref={(refs) => (this.input = refs)}
                                                        suffix={<span style={{ color: '#b3b3b3' }}>{item.name ? item.name.length : 0}/16</span>}
                                                        onChange={this.changeName.bind(this, index)}
                                                        value={item.name}
                                                        placeholder='请输入'
                                                    />
                                                    <span className='btnArea'>
                                                        <a onClick={this.saveData.bind(this, index)}>确定</a>
                                                        <Divider style={{ margin: '0 8px' }} type='vertical' />
                                                        <a onClick={this.cancelEdit.bind(this, index)}>取消</a>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className='tagTypeName'>
                                                    <div>{item.name}</div>
                                                    <span className='btnArea'>
                                                        <span onClick={this.editData.bind(this, index)} className='iconfont icon-bianji'></span>
                                                        <span onClick={this.deleteData.bind(this, item)} className='iconfont icon-lajitong'></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <Button className='addTypeBtn' onClick={this.addData} type='primary' block>
                                创建类别
                            </Button>
                        </div>
                    </Spin>
                )}
            </Modal>
        )
    }
}
