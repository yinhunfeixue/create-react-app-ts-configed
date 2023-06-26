import { Row, Col, Menu, Modal, Button, Input, Form } from 'antd'
import './index.less'
import { addBoardView } from 'app_api/dashboardApi'
import _ from 'underscore'
// import DataLoading from '../../loading'
const { TextArea } = Input
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
}

class EditView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // sourceData: this.props.sourceData,
            visible: false,
            validateMessage: {},
            boardCreateInfo: {},
            validateSubmitMessage: '',
            boardCreateInfo: {},
            viewIndex: null,
            viewId: 0,
            name: '',
            description: ''
        }

        this.validateField = {
            'name': '视图名称',
            'description': '视图描述'
        }
    }

    handleOk = async (e) => {
        console.log(e)
        e.stopPropagation()
        let boardCreateInfo = this.state.boardCreateInfo

        let validateMessage = {}

        if (_.isEmpty(boardCreateInfo['name'])) {
            validateMessage['name'] = {
                'validateStatus': 'error',
                'errorMsg': this.validateField['name'] + '不能为空！'
            }
        }

        if (!_.isEmpty(validateMessage)) {
            this.setState({
                validateMessage
            })
        } else {
            let selectedKey = this.state.viewId
            if (selectedKey) {
                if (this.props.handleEditBoardView) {
                    let data = this.props.handleEditBoardView({
                        id: this.state.viewId,
                        ...boardCreateInfo,
                        // viewIndex: this.state.viewIndex
                    })
                }
            }
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        // if (!_.isEmpty(prevState.chartType)) {
        //     this.chartCom && this.chartCom.forceFit()
        // }
    }

    handleCancel = (e) => {
        console.log(e)
        this.setState({
            visible: false,
            validateMessage: {},
            boardCreateInfo: {},
            validateSubmitMessage: '',
            name: '',
            description: ''
        })
    }

    visibleModal = (status, data) => {
        if (status) {
            this.setState({
                visible: status,
                name: data.data.name,
                viewId: data.data.id,
                viewIndex: data.index,
                description: data.data.description,
                boardCreateInfo: {
                    name: data.data.name,
                    description: data.data.description
                }
            })
        } else {
            this.setState({
                visible: false,
                validateMessage: {},
                boardCreateInfo: {},
                validateSubmitMessage: '',
                name: '',
                description: ''
            })
        }
    }

    handleChange = (field, e) => {
        // console.log(e, '------')
        let { value } = e.target
        // console.log(field, value, '------field, value-------')

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
                    'errorMsg': this.validateField['name'] + '不能为空！'
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

    render() {
        const { visible, params, validateMessage, validateSubmitMessage, name, description } = this.state
        console.log(visible, name, '-----title--修改视图标题---')
        return (
            <Modal
                title='修改视图标题描述'
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                // width='80%'
                height='400px'
                // footer={null}
            >
                <Row>
                    <Col span={24} >
                        <Form>
                            <Form.Item
                                {...formItemLayout}
                                label='视图名称'
                                validateStatus={validateMessage['name'] ? validateMessage['name']['validateStatus'] : 'success'}
                                help={validateMessage['name'] ? validateMessage['name']['errorMsg'] : null}
                            >
                                <Input value={name} onChange={this.handleChange.bind(this, 'name')} />

                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label='视图描述'
                                validateStatus={validateMessage['description'] ? validateMessage['description']['validateStatus'] : 'success'}
                                help={validateMessage['description'] ? validateMessage['description']['errorMsg'] : null}
                            >
                                <TextArea value={description} rows={4} onChange={this.handleChange.bind(this, 'description')} />

                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default EditView
