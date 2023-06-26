// 条件参数
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Select } from 'antd'
import React, { Component } from 'react'
import { getColumnByTableId, updateTableInfo } from 'app_api/examinationApi'
import '../../index.less'
import store from '../../store'

const { TextArea } = Input

export default class TermParamsDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addInfo: {},
            modalVisible: false,
            btnLoading: false,
            columnList: [],
        }
    }
    openModal = async (data) => {
        let { addInfo } = this.state
        const { selectedTaskInfo } = store
        addInfo = {
            tableId: data.tableId,
            taskGroupId: selectedTaskInfo.taskGroupId,
            rangeColumnId: data.rangeColumnId,
            rangeColumnName: data.rangeColumnName,
            timeFormula: data.timeFormula,
        }
        await this.setState({
            modalVisible: true,
            addInfo,
        })
        this.getColumnList()
    }
    getColumnList = async () => {
        let { addInfo } = this.state
        let res = await getColumnByTableId({ tableId: addInfo.tableId })
        if (res.code == 200) {
            this.setState({
                columnList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeSelect = (e, node) => {
        let { addInfo } = this.state
        addInfo.rangeColumnId = e
        addInfo.rangeColumnName = node.props.title
        this.setState({
            addInfo,
        })
    }
    postData = async () => {
        let { addInfo } = this.state
        let res = await updateTableInfo(addInfo)
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.addParamsInfo(addInfo)
        }
    }
    render() {
        const { addInfo, modalVisible, btnLoading, columnList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '条件参数',
                    className: 'excuteTaskDrawer',
                    width: 568,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.rangeColumnId || !addInfo.timeFormula} loading={btnLoading} onClick={this.postData} type='primary'>
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
                        <Form className='EditMiniForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '时间选择',
                                    required: true,
                                    content: (
                                        <Select showSearch optionFilterProp='title' placeholder='请选择' value={addInfo.rangeColumnId} onChange={this.changeSelect}>
                                            {columnList.map((item) => {
                                                return (
                                                    <Select.Option title={item.physicalField} key={item.id} value={item.id}>
                                                        {item.physicalField}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '时间表达式',
                                    required: true,
                                    content: <TextArea style={{ height: 52 }} value={addInfo.timeFormula} onChange={this.changeInput.bind(this, 'timeFormula')} placeholder='请输入sql的时间表达式' />,
                                },
                                // {
                                //     label: '其他条件',
                                //     content: <TextArea style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />,
                                // }
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
