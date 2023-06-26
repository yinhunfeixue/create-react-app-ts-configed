import ModuleTitle from '@/component/module/ModuleTitle'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Input, Tooltip, Divider, message } from 'antd'
import React, { Component } from 'react'
import '../../index.less'
import DrawerLayout from '@/component/layout/DrawerLayout'
import DragSortingTable from '../../../../datamodeling/ddl/dragSortTable'
import moment from 'moment'
import { bizTypeList, bizTypeSaveOrEdit, bizTypeDelete, bizTypeReorder } from 'app_api/examinationApi'

export default class BizTypeDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bizTypeVisible: false,
            dragTableLoading: false,
            columnData: [],
            columnDataBackup: [],
            editInfo: {},
            canMove: true,
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                dataIndex: 'code',
                key: 'code',
                title: '类型名称',
                width: 256,
                render: (text, record, index) => {
                    if (record.isEdit) {
                        return (
                            <div>
                                <Input placeholder='请输入类型名称' value={text} onChange={this.onChangeName.bind(this, index)} maxLength={32} />
                            </div>
                        )
                    } else {
                        return (
                            <div style={{ display: 'flex' }}>
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='bizTypeName'>{text ? text : '--'}</span>
                                </Tooltip>
                                <span style={{ color: '#C4C8CC' }}>{record.qaBizTypeClassifyDesc}</span>
                            </div>
                        )
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                render: (text, record, index) => {
                    return (
                        <span onClick={(e) => e.stopPropagation()}>
                            {record.isEdit ? (
                                <a onClick={this.saveData.bind(this, index)}>保存</a>
                            ) : (
                                <a disabled={record.qaBizTypeClassifyDesc == '系统'} onClick={this.editData.bind(this, index)}>
                                    编辑
                                </a>
                            )}
                            <Divider type='vertical' />
                            {record.isEdit ? (
                                <a onClick={this.cancelEdit.bind(this, index)}>取消</a>
                            ) : (
                                <a disabled={record.qaBizTypeClassifyDesc == '系统'} onClick={this.deleteData.bind(this, index)}>
                                    删除
                                </a>
                            )}
                        </span>
                    )
                },
            },
        ]
    }
    getBizTypeList = async () => {
        this.setState({ dragTableLoading: true })
        let res = await bizTypeList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.code
            })
            await this.setState({
                columnData: [...res.data],
                columnDataBackup: [...res.data],
            })
            this.setState({ dragTableLoading: false })
            this.changeCanmove()
        }
    }
    openModal = () => {
        this.setState({
            bizTypeVisible: true,
        })
        this.getBizTypeList()
    }
    cancel = () => {
        this.setState({
            bizTypeVisible: false,
        })
        this.props.getBizTypeList()
    }
    changeCanmove = () => {
        let { canMove, columnData } = this.state
        canMove = true
        columnData.map((item) => {
            if (item.isEdit) {
                canMove = false
            }
        })
        this.setState({
            canMove,
        })
    }
    onChangeName = (index, e) => {
        let { columnData, editInfo, columnDataBackup } = this.state
        console.log(columnDataBackup, 'onChangeName')
        editInfo.oldCode = columnDataBackup[index] ? columnDataBackup[index].name : ''
        editInfo.newCode = e.target.value
        columnData[index].code = e.target.value
        this.setState({
            columnData,
            editInfo,
        })
    }
    getSortData = async (data) => {
        let query = []
        data.map((item) => {
            query.push(item.code)
        })
        let res = await bizTypeReorder(query)
        if (res.code == 200 && res.data) {
            this.setState({
                columnData: [...data],
                columnDataBackup: [...data],
            })
        }
    }
    addData = async () => {
        let { columnData, editInfo } = this.state
        let hasInput = false
        columnData.map((item) => {
            if (item.isEdit) {
                hasInput = true
            }
        })
        if (hasInput) {
            message.info('请先关闭当前输入框')
            return
        }
        this.setState({ dragTableLoading: true })
        columnData.push({
            code: '',
            isEdit: true,
            isNew: true,
            id: moment().format('X'),
        })
        editInfo.oldCode = ''
        editInfo.newCode = ''
        await this.setState({
            columnData,
            editInfo,
        })
        this.changeCanmove()
        this.setState({ dragTableLoading: false })
    }
    saveData = async (index) => {
        let { columnData, editInfo } = this.state
        if (!editInfo.newCode) {
            return
        }
        let res = await bizTypeSaveOrEdit(editInfo)
        if (res.code == 200) {
            message.success('操作成功')
            this.getBizTypeList()
        }
    }
    editData = async (index) => {
        let { columnData, editInfo, columnDataBackup } = this.state
        let hasInput = false
        columnData.map((item) => {
            if (item.isEdit) {
                hasInput = true
            }
        })
        if (hasInput) {
            message.info('请先关闭当前输入框')
            return
        }
        this.setState({ dragTableLoading: true })
        columnData[index].isEdit = true
        editInfo.oldCode = columnDataBackup[index] ? columnDataBackup[index].name : ''
        editInfo.newCode = columnData[index].code
        await this.setState({
            columnData,
            editInfo,
        })
        this.changeCanmove()
        this.setState({ dragTableLoading: false })
    }
    deleteData = async (index) => {
        let { columnData } = this.state
        let that = this
        Modal.confirm({
            title: '确定删除此条数据吗？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                let res = await bizTypeDelete({ code: columnData[index].code })
                if (res.code == 200) {
                    message.success('操作成功')
                    that.getBizTypeList()
                }
            },
        })
    }
    cancelEdit = async (index) => {
        let { columnData, columnDataBackup } = this.state
        console.log(columnDataBackup, 'columnDataBackup')
        this.setState({ dragTableLoading: true })
        if (columnData[index].isNew == true) {
            columnData.splice(index, 1)
        } else {
            columnData[index].isEdit = false
            columnData[index].code = columnDataBackup[index].name
        }
        await this.setState({
            columnData,
        })
        this.changeCanmove()
        this.setState({ dragTableLoading: false })
    }
    render() {
        const { bizTypeVisible, dragTableLoading, columnData, canMove } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '业务类型编辑',
                    className: 'bizTypeDrawer',
                    width: 480,
                    visible: bizTypeVisible,
                    onClose: this.cancel,
                }}
            >
                {bizTypeVisible && (
                    <React.Fragment>
                        <div className='bizTypeTitle'>
                            <span className='titleName'>业务类型</span>
                            <span style={{ color: '#9EA3A8' }}>长按可拖拽列表顺序</span>
                        </div>
                        {!dragTableLoading ? <DragSortingTable rowKey='id' columns={this.columns} dataSource={columnData} getSortData={this.getSortData} canMove={canMove} from='dataTable' /> : null}
                        <div className='blockAddBtn' onClick={this.addData}>
                            添加类型
                            <PlusOutlined />
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
