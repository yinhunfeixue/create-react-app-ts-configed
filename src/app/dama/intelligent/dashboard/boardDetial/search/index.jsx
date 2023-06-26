import React, { Component } from 'react'
import store from '../store'
import { observer } from 'mobx-react'
import { Drawer, Input, Modal, Button, Form, Row, Col, Menu, Dropdown } from 'antd'
import './index.less'
import ModifyFill from 'app_images/ModifyFill.svg'
import DownArrow from 'app_images/downArrow.svg'
import Filter from 'app_images/过滤.svg'
import FilterFill from 'app_images/filterFill.svg'
import { boardUpdate, getPinboardFilter } from 'app_api/dashboardApi'
import { NotificationWrap } from 'app_common'
import LeftContent from './leftContent/lindex'
import DimensionSelect from '../columnDetial/Dimension'
import MeasureSelect from '../columnDetial/Measure'
import DateSelect from '../columnDetial/Date'
import _ from 'underscore'
const { TextArea } = Input
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
}

@observer
export default class searchContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            topicVisible: false,
            editVisible: false,
            name: '',
            description: '',
            originName: '',
            originDescription: '',
            // 度量/时间所需回显值
            firstMark: '',
            firstValue: '',
            secondMark: '',
            secondValue: '',
            maxValue: '',
            minValue: '',
            indexType: 1,
            // 维度所需回显值
            options: [],
            select: [],
            boardCreateInfo: {},
            validateMessage: {}
        }

        this.validateField = {
            'name': '数据标题',
            'description': '数据描述'
        }
    }

    componentDidMount = async () => {
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.name !== this.state.name) {
            this.setState({
                originName: nextProps.name,
                originDescription: nextProps.description,
                name: nextProps.name,
                description: nextProps.description,
                boardCreateInfo: {
                    name: nextProps.name,
                    description: nextProps.description,
                }
            })
        }
    }

    // 展开左侧
    onDraw = () => {
        this.setState({
            visible: true
        })
    }
    // 关闭左侧
    onClose = () => {
        this.setState({
            visible: false
        })
    }
    // 跳转报表创建
    createTable = () => {
        // this.props.removeTab('createTable')
        this.props.addTab('createTable', { pinboardId: store.pinboardId, ifCreate: true })
    }
    // 编辑看板名称/描述
    editName = () => {
        this.setState({
            topicVisible: true
        })
    }
    // 关闭弹窗
    handleCancel = () => {
        this.setState({
            topicVisible: false,
            name: this.state.originName,
            description: this.state.originDescription,
            boardCreateInfo: {
                name: this.state.originName,
                description: this.state.originDescription,
            }
        })
    }

    handleChange = (field, e) => {
        let { value } = e.target
        let boardCreateInfo = this.state.boardCreateInfo
        boardCreateInfo[field] = value
        this.setState({
            boardCreateInfo,
            [field]: value
        }, () => {
            let validateMessage = {}
            if (_.isEmpty(boardCreateInfo['name'])) {
                validateMessage['name'] = {
                    'validateStatus': 'error',
                    'errorMsg': '数据标题不能为空！'
                }
            } else {
                validateMessage['name'] = {
                    'validateStatus': 'success',
                    'errorMsg': null
                }
            }

            this.setState({
                validateMessage
            })
        })
    }

    handleOk = async (e) => {
        e.stopPropagation()
        let boardCreateInfo = this.state.boardCreateInfo

        let validateMessage = {}
        if (_.isEmpty(boardCreateInfo['name'])) {
            validateMessage['name'] = {
                'validateStatus': 'error',
                'errorMsg': '数据标题不能为空！'
            }
        }

        if (!_.isEmpty(validateMessage)) {
            this.setState({
                validateMessage
            })
        } else {
            let params = {
                id: store.pinboardId,
                ...boardCreateInfo
            }
            let res = await boardUpdate(params)
            if (res.code === 200) {
                this.setState({
                    originName: this.state.name,
                    originDescription: this.state.description
                })
            } else {
                NotificationWrap.warning(res.msg)
            }
            this.setState({
                topicVisible: false,
            })

            // let selectedKey = this.state.viewId
            // if (selectedKey) {
            //     if (this.props.handleEditBoardView) {
            //         let data = this.props.handleEditBoardView({
            //             id: this.state.viewId,
            //             ...boardCreateInfo,
            //             viewIndex: this.state.viewIndex
            //         })
            //     }
            // }
        }
    }

    // 更改标题和描述
    changeInf = async () => {
        let params = {
            id: store.pinboardId,
            name: this.state.name,
            description: this.state.description
        }
        let res = await boardUpdate(params)
        if (res.code === 200) {
            this.setState({
                originName: this.state.name,
                originDescription: this.state.description
            })
        } else {
            NotificationWrap.warning(res.msg)
        }
        this.setState({
            topicVisible: false,
        })
    }
    // 条件面板
    fieldsSelected = (items) => {
        let name = items.name
        let words = ''
        if (items.columnType === 2) {
            words = items.select.length > 0 ? items.select.join('、') : '请选择'
        } else if (items.columnType === 1 || items.columnType === 3) {
            let interval = items.interval
            let ifhas = false
            if (interval.firstValue && interval.firstValue.length > 0) {
                words += interval.firstMark + interval.firstValue
                ifhas = true
            }
            if (interval.secondValue && interval.secondValue.length > 0) {
                words += interval.secondMark + interval.secondValue
                ifhas = true
            }
            if (!ifhas) {
                words = '请选择'
            }
        }
        return (
            <div className='searchBlock'>
                <span className='searchName'>{name}: </span>
                <span className='searchField'>{words}</span>
                <img className='downArrow' onClick={this.selectField.bind(this, items)} src={DownArrow} />
            </div>
        )
    }
    // 选择字段
    selectField = async (items) => {
        let res = await getPinboardFilter({ pinboardId: store.pinboardId, columnId: items.columnId })
        if (res.code === 200) {
            switch (items.columnType) {
                    case 2:
                        this.setState({
                            select: items.select,
                            options: res.data.values
                        }); break
                    case 1:
                        this.setState({
                            firstMark: items.interval.firstMark,
                            firstValue: items.interval.firstValue,
                            secondMark: items.interval.secondMark,
                            secondValue: items.interval.secondValue,
                            maxValue: res.data.interval.maxValue,
                            minValue: res.data.interval.minValue
                        }); break
                    case 3:
                        this.setState({
                            firstMark: items.interval.firstMark,
                            firstValue: items.interval.firstValue,
                            secondMark: items.interval.secondMark,
                            secondValue: items.interval.secondValue,
                            maxValue: res.data.interval.maxValue,
                            minValue: res.data.interval.minValue
                        }); break
            }
        }
        this.setState({
            editVisible: true,
            indexType: items.columnType,
            indexName: items.name,
            indexId: items.columnId,
            businessId: items.businessId
        })
    }
    // 关闭弹窗
    onCloseEdit = () => {
        this.setState({
            editVisible: false
        })
    }
    // 添加新过滤组件
    updateFilter = async (params) => {
        let { selectedList } = store
        let arr = selectedList.slice()
        let param = {
            businessId: this.state.businessId,
            name: this.state.indexName,
            columnType: this.state.indexType,
            ...params
        }
        let dataIndex = ''
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].columnId === param.columnId) {
                dataIndex = i
            }
        }
        arr.splice(dataIndex, 1, param)
        store.changeSelectedList(arr)
        this.setState({
            editVisible: false
        })
    }

    render() {
        const { filters, isEmpty } = this.props
        const {
            visible, topicVisible, editVisible,
            originName, name, description,
            indexName, indexType, indexId,
            options, select,
            firstMark, firstValue, secondMark, secondValue,
            maxValue, minValue,
            validateMessage
        } = this.state
        const menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.onDraw}>
                        添加过滤条件
                    </span>
                </Menu.Item>
                {
                    store.canReportsBeGenerated && <Menu.Item>
                        <span onClick={this.createTable}>
                            创建报表
                        </span>
                    </Menu.Item>
                }
            </Menu>
        )
        return (
            <div className='detialHeader'>
                <h6 className='topic1'>数据看板</h6>
                <div className='topic2'>
                    <span className='topicName'>{originName}</span>
                    <img onClick={this.editName} className='changeName' src={ModifyFill} />
                    {
                        !isEmpty &&
                        <div className='rightBtn'>
                            <Dropdown overlay={menu}>
                                <span className='filterBtn'>
                                    {/* <img className='filterIcon' src={Filter} /> */}
                                    操作
                                </span>
                            </Dropdown>
                        </div>
                    }
                </div>
                {
                    (!isEmpty && filters.length > 0) &&
                    <div className='searchContent'>
                        <div className='filterIcon'>
                            <img src={FilterFill} />
                        </div>
                        {
                            filters.map((value, index) => {
                                return this.fieldsSelected(value)
                            })
                        }

                    </div>
                }
                <Drawer
                    title='添加过滤条件'
                    placement='left'
                    onClose={this.onClose}
                    visible={visible}
                    width={256}
                    className='boardDraw'

                >
                    <LeftContent />
                </Drawer>
                <Modal
                    title='编辑标题和描述'
                    visible={topicVisible}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                // footer={null}
                >
                    <Row>
                        <Col span={24} >
                            <Form>
                                <Form.Item
                                    {...formItemLayout}
                                    label='数据标题'
                                    validateStatus={validateMessage['name'] ? validateMessage['name']['validateStatus'] : 'success'}
                                    help={validateMessage['name'] ? validateMessage['name']['errorMsg'] : null}
                                >
                                    <Input value={name} maxLength={128} onChange={this.handleChange.bind(this, 'name')} />

                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label='数据描述'
                                    validateStatus={validateMessage['description'] ? validateMessage['description']['validateStatus'] : 'success'}
                                    help={validateMessage['description'] ? validateMessage['description']['errorMsg'] : null}
                                >
                                    <TextArea value={description} maxLength={256} rows={4} onChange={this.handleChange.bind(this, 'description')} />

                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                    {/* <h4>数据标题</h4>
                    <div style={{ marginBottom: '32px' }}>
                        <Input value={name} onChange={this.onChangeName} maxLength={50}/>
                    </div>
                    <h4>数据描述</h4>
                    <div>
                        <TextArea value={description}  maxLength={128} onChange={this.onChangeDescription} style={{ height: '140px' }} />
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '15px' }}>
                        <Button onClick={this.handleCancel} style={{ marginRight: '10px' }}>取消</Button>
                        <Button type='primary' onClick={this.changeInf}>确定</Button>
                    </div> */}
                </Modal>
                <Modal
                    title={indexName}
                    visible={editVisible}
                    style={{ width: '496px' }}
                    bodyStyle={{ padding: '24px 0' }}
                    onCancel={this.onCloseEdit}
                    footer={null}
                >
                    {
                        indexType === 2 &&
                        <DimensionSelect
                            indexName={indexName}
                            extraName={'center'}
                            indexId={indexId}
                            onCancel={this.onCloseEdit}
                            options={options}
                            select={select.slice()}
                            updateFilter={this.updateFilter}
                        />
                    }
                    {
                        indexType === 1 &&
                        <MeasureSelect
                            indexName={indexName}
                            indexId={indexId}
                            onCancel={this.onCloseEdit}
                            maxValue={maxValue}
                            minValue={minValue}
                            firstMark={firstMark}
                            firstValue={firstValue}
                            secondMark={secondMark}
                            secondValue={secondValue}
                            updateFilter={this.updateFilter}
                        />
                    }
                    {
                        indexType === 3 &&
                        <DateSelect
                            indexName={indexName}
                            indexId={indexId}
                            onCancel={this.onCloseEdit}
                            maxValue={maxValue}
                            minValue={minValue}
                            firstMark={firstMark}
                            firstValue={firstValue}
                            secondMark={secondMark}
                            secondValue={secondValue}
                            updateFilter={this.updateFilter}
                        />
                    }
                </Modal>
            </div>
        )
    }
}