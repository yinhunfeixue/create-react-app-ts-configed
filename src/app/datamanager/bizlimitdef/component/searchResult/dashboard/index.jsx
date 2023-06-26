import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, Form, Input, Menu, message, Modal, Row } from 'antd';
import { createBoard, getBoardList } from 'app_api/dashboardApi';
import _ from 'lodash';
import DataLoading from '../../loading';
import './index.less';
import SvgChart from './svgChart';

const { TextArea } = Input
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // sourceData: this.props.sourceData,
            visible: false,
            visivleDashboardCard: false, // false 加入数据看板，显示列表 状态， true 新建看板状态
            params: {},
            dList: [],
            loading: false,
            operate: 'addView',
            validateMessage: {},
            boardCreateInfo: {},
            validateSubmitMessage: '',
            menuSelectedKeys: [],
            defaultOpenKeys: [],
            selectedKey: '',
            title: '',
        }
    }

    handleOk = async (e) => {
        console.log(e)
        let boardCreateInfo = this.state.boardCreateInfo
        if (this.state.operate === 'addView') {
            if (_.isEmpty(this.state.title)) {
                let validateMessage = {}
                validateMessage['title'] = {
                    validateStatus: 'error',
                    errorMsg: '名称不能为空',
                }
                this.setState({
                    validateMessage,
                })
            } else {
                let selectedKey = this.state.selectedKey
                if (selectedKey) {
                    if (this.props.handleAddBoardView) {
                        let data = await this.props.handleAddBoardView({
                            name: this.state.title,
                            pinboardId: selectedKey,
                        })
                        console.log(data, '-------data-----handleAddBoardView----------')
                        if (data.code === 200) {
                            this.setState({
                                visible: false,
                                visivleDashboardCard: false,
                                params: {},
                                dList: [],
                                loading: false,
                                operate: 'addView',
                                validateMessage: {},
                                boardCreateInfo: {},
                                validateSubmitMessage: '',
                                menuSelectedKeys: [],
                                defaultOpenKeys: [],
                                selectedKey: '',
                            })

                            message.success('添加成功！')
                        } else {
                            message.error(data.msg)
                        }
                    }
                }
            }
        } else if (this.state.operate === 'createBoard') {
            if (_.isEmpty(boardCreateInfo['name'])) {
                let validateMessage = {}
                validateMessage['name'] = {
                    validateStatus: 'error',
                    errorMsg: '看板名称不能为空',
                }
                this.setState({
                    validateMessage,
                })
            } else {
                let data = await createBoard(boardCreateInfo)
                if (data.code === 200) {
                    this.getDashboardList()
                    this.setState({
                        operate: 'addView',
                        visivleDashboardCard: false,
                        validateMessage: {},
                    })
                } else {
                    this.setState({
                        validateSubmitMessage: data.msg,
                        validateMessage: {},
                    })
                    console.log(data.msg)
                }
            }
        }
    }

    handleCancel = (e) => {
        console.log(e)
        this.setState(
            {
                visible: false,
                validateSubmitMessage: '',
                validateMessage: {},
            },
            () => {
                this.setState({
                    visivleDashboardCard: false,
                })
            }
        )
    }

    getDashboardList = async () => {
        this.setState({
            loading: true,
        })

        let dList = await getBoardList({ page: 1, page_size: 10000 })
        let boardList = dList.data
        if (dList.code === 200 && boardList.length > 0) {
            let id = boardList[0]['id'] + ''
            this.setState({
                dList: boardList,
                selectedKey: id,
                menuSelectedKeys: [id],
            })
        }

        this.setState({
            loading: false,
        })
    }

    visibleModal = (status, params) => {
        this.setState(
            {
                visible: status,
                visivleDashboardCard: false,
                params: params,
                title: params.title,
            },
            () => {
                this.getDashboardList()
            }
        )
    }

    handleIndexBarClick = (item) => {
        // this.drillIndexKeyList[item.key]
        let menuSelectedKeys = [item.key]
        this.setState(
            {
                menuSelectedKeys,
                selectedKey: item.key,
                // drillDisplay: 'none',
            },
            () => {}
        )
    }

    visibleCreateDashboard = () => {
        this.setState({
            visivleDashboardCard: true,
            boardCreateInfo: {},
            operate: 'createBoard',
        })
    }

    validatePrimeNumber = () => {}

    handleChangeTitle = (e) => {
        let title = _.trim(e.target.value)
        let validateMessage = {}
        console.log(title, '---title----')
        if (_.isEmpty(title)) {
            validateMessage['title'] = {
                validateStatus: 'error',
                errorMsg: '名称不能为空',
            }
        } else {
            validateMessage['title'] = {
                validateStatus: 'success',
                errorMsg: null,
            }
        }

        this.setState({
            title,
            validateMessage,
        })
    }

    handleChange = (field, e) => {
        console.log(e, '------')
        let { value } = e.target
        console.log(field, value, '------field, value-------')
        let boardCreateInfo = this.state.boardCreateInfo
        boardCreateInfo[field] = _.trim(value)
        this.setState(
            {
                boardCreateInfo,
            },
            () => {
                if (!_.isEmpty(boardCreateInfo['name'])) {
                    let validateMessage = {}
                    validateMessage['name'] = {
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

    render() {
        const { visible, params, title, dList, menuSelectedKeys, visivleDashboardCard, loading, validateMessage, validateSubmitMessage, selectedKey } = this.state
        console.log(menuSelectedKeys, '-----------visible-----')
        return (
            <Modal
                title={visivleDashboardCard ? '新建看板' : '加入数据看板'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                // width='80%'
                height='400px'
                // footer={null}
            >
                {visivleDashboardCard ? (
                    <div className='dashboardAdd'>
                        <Row>
                            <Col span={24}>
                                <Form>
                                    <Form.Item
                                        {...formItemLayout}
                                        label='看板名称'
                                        validateStatus={validateMessage['name'] ? validateMessage['name']['validateStatus'] : 'success'}
                                        help={validateMessage['name'] ? validateMessage['name']['errorMsg'] : null}
                                    >
                                        <Input onChange={this.handleChange.bind(this, 'name')} />
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        label='看板描述'
                                        validateStatus={validateMessage['description'] ? validateMessage['description']['validateStatus'] : 'success'}
                                        help={validateMessage['description'] ? validateMessage['description']['errorMsg'] : null}
                                    >
                                        <TextArea rows={4} onChange={this.handleChange.bind(this, 'description')} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div className='settingError'>{validateSubmitMessage}</div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className='dashboardAdd'>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Item
                                        {...formItemLayout}
                                        validateStatus={validateMessage['title'] ? validateMessage['title']['validateStatus'] : 'success'}
                                        help={validateMessage['title'] ? validateMessage['title']['errorMsg'] : null}
                                    >
                                        <TextArea rows={1} onChange={this.handleChangeTitle} value={title} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {loading ? (
                                        <DataLoading />
                                    ) : dList.length > 0 ? (
                                        <div>
                                            <Row>
                                                <Col>
                                                    <div style={{ width: '100%' }}>
                                                        <Button style={{ float: 'right', border: '0', paddingRight: '0px' }} onClick={this.visibleCreateDashboard}>
                                                            <PlusCircleFilled className='colorChangeSvg toolTipIcon' /> <span className='tooTipText'>创建新的数据看板</span>
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className='menuItemDiv'>
                                                        <Menu className='menuItemUl' mode='inline' onClick={this.handleIndexBarClick} selectedKeys={menuSelectedKeys}>
                                                            {_.map(dList, (value, key) => {
                                                                return (
                                                                    <Menu.Item className='menuItemLi' key={value.id}>
                                                                        <Row className='menuItemDetial'>
                                                                            <Col>
                                                                                <span>{value.id == selectedKey ? SvgChart['Right']['img'] : SvgChart['Add']['img']}</span> <span>{value.name}</span>
                                                                                {value.hasReports && <span className='selectTable'>报表</span>}
                                                                            </Col>
                                                                        </Row>
                                                                    </Menu.Item>
                                                                )
                                                            })}
                                                        </Menu>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : (
                                        <Row>
                                            <Col>
                                                <div style={{ width: '100%', textAlign: 'center' }}>
                                                    <Button onClick={this.visibleCreateDashboard} type='primary'>
                                                        创建看板
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </div>
                )}
            </Modal>
        );
    }
}

export default Dashboard
