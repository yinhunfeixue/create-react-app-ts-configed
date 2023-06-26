import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Checkbox, Form, Input, message, Select, Radio } from 'antd'
import { editOrAddMetaModelDetail } from 'app_api/metaModelApi'
import { getUserList } from 'app_api/manageApi'
import React, { Component } from 'react'
import { typeList, inputTypeList } from './enumType'
import IconFont from '@/component/IconFont'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import './index.less'
import { add } from 'lodash'

const { Option } = Select

const whiteRule = { type: 'string', whitespace: true }
const selectRule = { type: 'number', whitespace: true }
const colunmRule = { type: 'string', whitespace: true }
const switchRule = { type: 'boolean', whitespace: true }

// Drag & Drop node
class TabNode extends React.Component {
    render() {
        const { connectDragSource, connectDropTarget, children } = this.props

        return connectDragSource(connectDropTarget(children))
    }
}

const cardTarget = {
    drop(props, monitor) {
        const dragKey = monitor.getItem().index
        const hoverKey = props.index

        if (dragKey === hoverKey) {
            return
        }

        props.moveTabNode(dragKey, hoverKey)
        monitor.getItem().index = hoverKey
    },
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    },
}

const WrapTabNode = DropTarget('DND_NODE', cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))(
    DragSource('DND_NODE', cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }))(TabNode)
)

export default class AddModelDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                childNodeCount: 0,
            },
            type: 'add',
            btnLoading: false,
            suffixList: [undefined],
        }
    }

    openEditModal = (data) => {
        if (data.type === 1) {
            data.inputType = parseInt(data.subTypeList[0])
        } else if (data.type === 2) {
            this.setState({ suffixList: data.subTypeList })
        }

        this.setState(
            {
                modalVisible: true,
                type: 'edit',
                addInfo: { ...data },
            },
            () => {
                this.form.setFieldsValue(data)
            }
        )
    }
    openAddModal = async (param) => {
        let { addInfo } = this.state
        const { appBaseConfigId } = param
        addInfo = {
            appBaseConfigId: appBaseConfigId,
            isRequiredField: false,
        }
        await this.setState(
            {
                modalVisible: true,
                type: 'add',
                addInfo,
            },
            () => {
                this.form.setFieldsValue(addInfo)
            }
        )
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
            suffixList: [undefined],
        })
    }
    postData = () => {
        this.form.validateFields().then((values) => {
            let { suffixList, type, addInfo } = this.state
            values.metaModelId = this.props.modelId
            if (type === 'edit') {
                values.id = addInfo.id
            }
            values.subTypeList = []
            if (values.type === 1) {
                values.subTypeList = [].concat(values.inputType)
            } else if (values.type === 2) {
                const suffixListCopy = suffixList.filter((record) => record)
                if (suffixListCopy.length < suffixList.length) {
                    return message.error('枚举值不能为空')
                }
                values.subTypeList = suffixList
            }

            this.setState({ btnLoading: true })
            let res = editOrAddMetaModelDetail(values).then((res) => {
                this.setState({ btnLoading: false })
                if (res.code == 200) {
                    message.success(type === 'edit' ? '修改成功' : '添加成功')
                    this.cancel()
                    this.props.search()
                }
            })
        })
    }

    changeInput = (name, e) => {
        let { addInfo } = this.state
        if (name == 'appBaseConfigId' || name == 'type') {
            addInfo[name] = e
            if (name == 'type' && e == 1) {
                this.form.setFieldValue('inputType', this.form.getFieldValue('inputType') || 1)
            }
        } else {
            addInfo[name] = e.target.value
        }
        this.setState({
            addInfo,
        })
    }
    changeEmenInput = (index, e) => {
        const copySuffixList = Object.assign([], this.state.suffixList)
        copySuffixList[index] = e.target.value
        this.setState({ suffixList: copySuffixList })
    }

    addFix = () => {
        // if (this.state.suffixList.findIndex((record) => !record) > -1) return
        this.state.suffixList.push(undefined)
        this.setState({
            suffixList: this.state.suffixList,
        })
    }
    deleteFix = (index) => {
        if (this.state.suffixList.length == 1) {
            return
        }
        this.state.suffixList.splice(index, 1)
        this.setState({
            suffixList: this.state.suffixList,
        })
    }

    moveTabNode = (dragKey, hoverKey) => {
        const { suffixList } = this.state
        const arr = Object.assign([], suffixList)
        const dragItem = suffixList[dragKey]
        const hoverItem = suffixList[hoverKey]
        arr[dragKey] = hoverItem
        arr[hoverKey] = dragItem
        this.setState({ suffixList: arr })
    }

    render() {
        const { modalVisible, addInfo, btnLoading, type, suffixList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'metaModelDrawer',
                    title: type == 'add' ? '新增属性' : '编辑属性',
                    width: 482,
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
                        <Form
                            ref={(target) => (this.form = target)}
                            initialValues={{
                                status: true,
                            }}
                            className='MiniForm postForm Grid1'
                            style={{ columnGap: 8 }}
                        >
                            {RenderUtil.renderFormItems([
                                {
                                    label: '属性名称',
                                    required: true,
                                    name: 'nameCn',
                                    rules: [{ required: true, message: '请输入属性名称' }, whiteRule],
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.nameCn}
                                            onChange={this.changeInput.bind(this, 'nameCn')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.nameCn ? addInfo.nameCn.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '属性英文名',
                                    name: 'nameEn',
                                    rules: [{ required: true, message: '请输入属性英文名' }, whiteRule],
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            disabled={type === 'edit'}
                                            value={addInfo.nameEn}
                                            onChange={this.changeInput.bind(this, 'nameEn')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.nameEn ? addInfo.nameEn.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '是否必填',
                                    name: 'isRequiredField',
                                    rules: [{ required: true, message: '请选择必填选项' }, switchRule],
                                    required: true,
                                    content: (
                                        <Radio.Group onChange={this.changeInput.bind(this, 'isRequiredField')} value={addInfo.isRequiredField}>
                                            <Radio value={false}>非必填</Radio>
                                            <Radio value={true}>必填</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '属性分组',
                                    name: 'appBaseConfigId',
                                    rules: [{ required: true, message: '请选择属性分组' }, colunmRule],
                                    required: true,
                                    content: (
                                        <Select onChange={this.changeInput.bind(this, 'appBaseConfigId')} value={addInfo.appBaseConfigId} className='datasourceSelect' placeholder='请选择'>
                                            {this.props.metaModelList.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.appBaseConfigId}>
                                                        {item.appBaseConfigGroup}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '属性类型',
                                    required: true,
                                    rules: [{ required: true, message: '请选择属性类型' }, selectRule],
                                    name: 'type',
                                    content: (
                                        <Select disabled={type === 'edit'} onChange={this.changeInput.bind(this, 'type')} value={addInfo.type} className='datasourceSelect' placeholder='请选择'>
                                            {typeList.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '输入类型',
                                    required: true,
                                    hide: addInfo.type !== 1,
                                    name: 'inputType',
                                    rules: [{ required: true, message: '请选择输入类型' }, selectRule],
                                    content: (
                                        <Radio.Group disabled={type === 'edit'} placeholder='请选择'>
                                            {inputTypeList.map((item) => {
                                                return (
                                                    <Radio key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Radio>
                                                )
                                            })}
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '枚举值',
                                    required: true,
                                    hide: addInfo.type !== 2 || type !== 'add',
                                    name: 'suffixList',
                                    content: (
                                        <div className='prefixArea'>
                                            {suffixList.map((item, index) => {
                                                return (
                                                    <DndProvider backend={HTML5Backend}>
                                                        <WrapTabNode key={index} index={index} moveTabNode={this.moveTabNode}>
                                                            <div style={{ marginBottom: 10 }}>
                                                                <IconFont style={{ marginRight: 12, cursor: 'move' }} type='icon-tuozhuai' />
                                                                <Input
                                                                    style={{ width: 370 }}
                                                                    placeholder='请输入'
                                                                    value={suffixList[index]}
                                                                    onChange={this.changeEmenInput.bind(this, index)}
                                                                    maxLength={16}
                                                                    suffix={<span style={{ color: '#B3B3B3' }}>{suffixList[index] ? suffixList[index].length : 0}/16</span>}
                                                                />
                                                                {suffixList.length > 1 && (
                                                                    <IconFont type='e67f' style={{ marginLeft: 14, fontSize: 16, color: 'red', cursor: 'pointer' }} useCss onClick={this.deleteFix.bind(this, index)} />
                                                                )}
                                                            </div>
                                                        </WrapTabNode>
                                                    </DndProvider>
                                                )
                                            })}
                                            <div className='btnArea'>
                                                <span style={{ color: '#4D73FF', fontSize: 14, cursor: 'pointer' }} onClick={this.addFix}>
                                                    {' '}
                                                    + 添加枚举值
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: '枚举值',
                                    required: true,
                                    hide: addInfo.type !== 2 || type !== 'edit',
                                    name: 'suffixList',
                                    content: (
                                        <div className='prefixArea'>
                                            {suffixList.map((item, index) => {
                                                return (
                                                    <div style={{ marginBottom: 10 }}>
                                                        <Input
                                                            style={{ width: '100%' }}
                                                            disabled
                                                            placeholder='请输入'
                                                            value={suffixList[index]}
                                                            maxLength={16}
                                                            suffix={<span style={{ color: '#B3B3B3' }}>{suffixList[index] ? suffixList[index].length : 0}/16</span>}
                                                        />
                                                    </div>
                                                )
                                            })}
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
