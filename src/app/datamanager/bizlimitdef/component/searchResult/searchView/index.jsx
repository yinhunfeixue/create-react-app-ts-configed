import { UserOutlined } from '@ant-design/icons';
import { Col, Form, Input, Menu, message, Modal, Radio, Row, Select } from 'antd';
import { getDatamanagerCategory } from 'app_api/wordSearchApi';
import _ from 'lodash';
import './index.less';

const { TextArea } = Input
const InputGroup = Input.Group

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}

const menu = (
    <Menu>
        <Menu.Item key='1'>
            <UserOutlined />
            1st menu item
        </Menu.Item>
        <Menu.Item key='2'>
            <UserOutlined />
            2nd menu item
        </Menu.Item>
        <Menu.Item key='3'>
            <UserOutlined />
            3rd item
        </Menu.Item>
    </Menu>
)

class SearchView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // sourceData: this.props.sourceData,
            visible: false,
            params: {},
            // operate: 'addView',
            validateMessage: {},
            boardCreateInfo: {},
            validateSubmitMessage: '',
            selectedKey: '',
            categoryList: [],
            type: '',
            viewName: '',
            busiGroupId: '',
            sourceBusiGroupId: '',
            radioOptions: this.props.radioOptions
                ? this.props.radioOptions
                : [
                      { label: '搜索视图', value: '1' },
                      { label: '中间结果表', value: '2' },
                  ],
            importFrom: this.props.importFrom ? this.props.importFrom : 'kws',
        }

        this.isOnComposition = false
        this.emittedInput = true
    }

    getDatamanagerCategory = async () => {
        let res = await getDatamanagerCategory()
    }

    handleOk = async (e) => {
        // console.log(e, '-------------------------')
        let boardCreateInfo = this.state.boardCreateInfo
        let validateMessage = {}
        // console.log(boardCreateInfo, '--------handleOkhandleOkhandleOk-----------------')

        if (boardCreateInfo['type'] === undefined) {
            validateMessage['type'] = {
                validateStatus: 'error',
                errorMsg: '类型不能为空',
            }
        }

        if (!boardCreateInfo['viewName']) {
            validateMessage['viewName'] = {
                validateStatus: 'error',
                errorMsg: '名称不能为空',
            }
        } else {
            // 中间结果表，增加该限制：名称不允许出现“全数字”或“含有特殊字符”的名称(仅允许数字、下划线、字母、汉字)
            if (boardCreateInfo['type'] == 2 && this.state.importFrom == 'kws') {
                if (!/^[\w\u4e00-\u9fa5]+$/.test(boardCreateInfo['viewName']) || /^\d+$/.test(boardCreateInfo['viewName'])) {
                    validateMessage['viewName'] = {
                        validateStatus: 'error',
                        errorMsg: '名称只允许含有数字、下划线、字母、汉字，不允许出现“全数字”或“含有其他特殊字符”！',
                    }
                    // this.setState({
                    //     validateMessage,
                    //     // viewName: value
                    // })

                    // return
                }
            }

            if (boardCreateInfo['viewName']) {
                let len = boardCreateInfo['viewName'].length
                // console.log(len, '--------len------')
                if (len > 32) {
                    validateMessage['viewName'] = {
                        validateStatus: 'error',
                        errorMsg: '视图名称不能超过32个字符',
                    }
                }
            }
        }

        if (boardCreateInfo['busiGroupId'] === undefined) {
            validateMessage['busiGroupId'] = {
                validateStatus: 'error',
                errorMsg: '分组不能为空',
            }
        }

        this.setState({
            validateMessage,
        })

        // console.log(validateMessage, '----validateMessage--------')
        if (_.isEmpty(validateMessage)) {
            if (this.props.handleAddSearchView) {
                let data = await this.props.handleAddSearchView(boardCreateInfo)
                if (data.code === 200) {
                    message.success('添加成功！')
                    this.setState({
                        visible: false,
                        validateMessage: {},
                        boardCreateInfo: {},
                        type: '',
                        viewName: '',
                        busiGroupId: this.state.sourceBusiGroupId,
                    })
                } else {
                    message.error(data.msg)
                }
            }
        }
    }

    handleCancel = (e) => {
        console.log(e)
        this.setState(
            {
                visible: false,
                validateMessage: {},
                boardCreateInfo: {},
                type: '',
                viewName: '',
                busiGroupId: this.state.sourceBusiGroupId,
            },
            () => {
                // this.setState({
                //     visivleDashboardCard: false
                // })
            }
        )
    }

    getDashboardList = async () => {
        let res = await getDatamanagerCategory()
        let categoryList = res.data
        this.setState({
            categoryList,
        })
    }

    visibleModal = (status, params) => {
        // console.log(params, '------paramsparams----visibleModal------')
        this.setState(
            {
                visible: status,
                // visivleDashboardCard: false,
                busiGroupId: params.busiGroupId || '',
                sourceBusiGroupId: params.busiGroupId || '',
                boardCreateInfo: {
                    busiGroupId: params.busiGroupId || '',
                },
                params: params,
            },
            () => {
                this.getDashboardList()
            }
        )
    }

    visibleCreateDashboard = () => {
        this.setState({
            // visivleDashboardCard: true,
            boardCreateInfo: {},
            // operate: 'createBoard'
        })
    }

    validatePrimeNumber = () => {}

    handleChange = async (field, e) => {
        if (field === 'viewName') {
            if (!this.isOnComposition) {
                this.emittedInput = true
            } else {
                this.emittedInput = false
            }
        }

        let boardCreateInfo = this.state.boardCreateInfo
        let validateMessage = this.state.validateMessage
        let cValue = ''
        if (_.isObject(e)) {
            let { value } = e.target
            cValue = _.trim(value)
        } else {
            cValue = _.trim(e)
        }

        // 切换类型的时候，初始化各种校验判断状态
        if (field === 'type' && boardCreateInfo['type'] != cValue) {
            // console.log(boardCreateInfo, field, cValue, '-------boardCreateInfo, field---------')
            validateMessage['viewName'] = {
                validateStatus: 'success',
                errorMsg: null,
            }
        }

        if (_.isObject(e)) {
            // let { value } = e.target
            let value = _.trim(cValue)
            // console.log(field, value, '------field, value-------')
            boardCreateInfo[field] = value
            if (value) {
                if (field === 'viewName' && this.emittedInput) {
                    // 中间结果表，增加该限制：名称不允许出现“全数字”或“含有特殊字符”的名称(仅允许数字、下划线、字母、汉字)
                    if (boardCreateInfo['type'] == 2 && this.state.importFrom == 'kws') {
                        console.log('mingcheng-----')
                        if (!/^[\w\u4e00-\u9fa5]+$/.test(value) || /^\d+$/.test(value)) {
                            validateMessage[field] = {
                                validateStatus: 'error',
                                errorMsg: '名称只允许含有数字、下划线、字母、汉字，不允许出现“全数字”或“含有其他特殊字符”！',
                            }
                            this.setState({
                                validateMessage,
                                viewName: value,
                            })

                            return
                        }
                    }

                    let len = value.length
                    // console.log(len, '--------len------')
                    if (len > 32) {
                        validateMessage[field] = {
                            validateStatus: 'error',
                            errorMsg: '名称不能超过32个字符',
                        }
                        this.setState({
                            validateMessage,
                            viewName: value,
                        })

                        return
                    }
                }
                // console.log(field, value, '------field, value-------')
            }
        } else {
            boardCreateInfo[field] = cValue
        }

        this.setState(
            {
                boardCreateInfo,
                [field]: boardCreateInfo[field],
            },
            () => {
                if (boardCreateInfo[field]) {
                    validateMessage[field] = {
                        validateStatus: 'success',
                        errorMsg: null,
                    }
                    this.setState({
                        validateMessage,
                    })
                }
            }
        )
    }

    handleComposition = (e) => {
        // console.log(e.type, '----e.type')
        if (e.type === 'compositionend') {
            // composition is end
            this.isOnComposition = false
            if (!this.emittedInput) {
                this.handleChange('viewName', e)
            }
        } else {
            // in composition
            this.emittedInput = false
            this.isOnComposition = true
        }
    }

    render() {
        const { visible, params, validateMessage, validateSubmitMessage, categoryList, busiGroupId, type, viewName, radioOptions } = this.state

        return (
            <Modal
                centered
                title='保存搜索结果'
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                // width='80%'
                height='400px'
                // footer={null}
            >
                <div className='searchViewAdd'>
                    <Row>
                        <Col span={24}>
                            <Form>
                                <Form.Item
                                    // {...formItemLayout}
                                    wrapperCol={{ span: 24 }}
                                    labelAlign='left'
                                    validateStatus={validateMessage['type'] ? validateMessage['type']['validateStatus'] : 'success'}
                                    help={validateMessage['type'] ? validateMessage['type']['errorMsg'] : null}
                                >
                                    <Row>
                                        <Col span='6'>保存搜索结果为</Col>
                                        <Col span='18'>
                                            <Radio.Group value={type} onChange={this.handleChange.bind(this, 'type')}>
                                                {_.map(radioOptions, (val, key) => {
                                                    return <Radio value={val.value}>{val.label}</Radio>
                                                })}
                                                {/* <Radio value='1'>搜索视图</Radio>
                                                <Radio value='2'>中间结果表</Radio> */}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ span: 24 }}
                                    validateStatus={validateMessage['viewName'] ? validateMessage['viewName']['validateStatus'] : 'success'}
                                    help={validateMessage['viewName'] ? validateMessage['viewName']['errorMsg'] : null}
                                >
                                    <InputGroup compact>
                                        <Input style={{ width: '11%' }} readOnly value='名称' />
                                        <Input
                                            style={{ width: '89%' }}
                                            value={viewName}
                                            onChange={this.handleChange.bind(this, 'viewName')}
                                            onCompositionStart={this.handleComposition}
                                            // onCompositionUpdate={this.handleComposition}
                                            onCompositionEnd={this.handleComposition}
                                        />
                                    </InputGroup>
                                </Form.Item>
                                {this.state.type == 2 && this.state.importFrom == 'kws' ? (
                                    <Form.Item
                                        wrapperCol={{ span: 24 }}
                                        validateStatus={validateMessage['busiGroupId'] ? validateMessage['busiGroupId']['validateStatus'] : 'success'}
                                        help={validateMessage['busiGroupId'] ? validateMessage['busiGroupId']['errorMsg'] : null}
                                    >
                                        <InputGroup compact>
                                            <Input style={{ width: '11%' }} readOnly value='分组' />
                                            <Select style={{ width: '89%' }} value={busiGroupId} onChange={this.handleChange.bind(this, 'busiGroupId')}>
                                                {_.map(categoryList, (val, key) => {
                                                    let keyName = `_${val.busiGroupId}`
                                                    return (
                                                        <Select.Option key={keyName} value={val.busiGroupId}>
                                                            {val.busiGroupName}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        </InputGroup>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>{/* 说明说明 */}</Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default SearchView
