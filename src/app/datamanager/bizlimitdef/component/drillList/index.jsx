import { CloseOutlined } from '@ant-design/icons';
import { Row, Col, Input, Menu, Button } from 'antd';
// import GridLayout from 'react-grid-layout';
import './index.less'
import _ from 'underscore'
const { Search } = Input

class DrillList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            drillDisplay: 'none',
            drillLeft: 'auto',
            drillTop: 'auto',
            drillIndexList: [],
            loading: false,
            menuSelectedKeys: []
        }

        this.drillIndexKeyList = {}
    }

    componentDidMount = () => {
        this.init()
    }

    init = () => {
        let params = this.props.params
        let innerHeight = window.innerHeight
        let innerWidth = window.innerWidth
        let divWidth = 420
        let divHeight = 320

        if (params.layout.drillLeft + divWidth > innerWidth || params.layout.drillLeft + divWidth > 1000) {
            params.layout.drillLeft = params.layout.drillLeft - divWidth
        } else {
            params.layout.drillLeft = params.layout.drillLeft + 50
        }

        if (params.layout.drillTop + divHeight > innerHeight) {
            params.layout.drillTop = innerHeight - divHeight
        }

        //console.log(params, '---------paramsparams--------')
        this.setState({
            drillDisplay: params.layout.drillDisplay,
            drillLeft: params.layout.drillLeft,
            drillTop: params.layout.drillTop > 157 * 2 ? params.layout.drillTop - 157 : params.layout.drillTop / 2,
            drillIndexList: params.data
        }, () => {
            this.getDrillIndexKeyList(params.data)
        })
    }

    reRenderList = (data) => {
        this.setState({
            drillDisplay: 'block',
            drillIndexList: data
        }, () => {
            this.getDrillIndexKeyList(params.data)
        })
    }

    getTableData = async (params = {}) => {

        if (this.props.getDrillIndexListData) {
            this.setState({
                loading: true
            })

            let data = await this.props.getDrillIndexListData(params)

            this.setState({
                drillDisplay: 'block',
                drillIndexList: data,
                loading: false
            }, () => {
                this.getDrillIndexKeyList(data)
            })
        }
    }

    getDrillIndexKeyList = (data) => {
        let drillIndexKeyList = {}
        _.map(data, (value, key) => {
            drillIndexKeyList[value['metricsId']] = value
        })
        this.drillIndexKeyList = drillIndexKeyList
    }

    handleIndexBarClick = (item) => {
        // this.drillIndexKeyList[item.key]
        let menuSelectedKeys = [item.key]
        this.setState({
            menuSelectedKeys,
            drillDisplay: 'none',
        }, () => {
            let selectRow = this.props.params.selectRow
            let addAttribute = {
                id: this.drillIndexKeyList[item.key]['metricsId'],
                content: this.drillIndexKeyList[item.key]['cname']
            }
            this.props.handleDrillSearch && this.props.handleDrillSearch({ addAttribute, selectRow })
        })
    }

    closeDrillCard = () => {
        console.log('-----drillDisplaydrillDisplay--------')
        this.setState({
            drillDisplay: 'none'
        })
    }

    // onMouseDown = (e) => {
    //     // if (!this.state.dragging) return
    //     this.setState({
    //         drillLeft: e.pageX,
    //         drillTop: e.pageY
    //     })
    //     e.stopPropagation()
    //     e.preventDefault()
    // }

    handleSearch = (inputValue) => {
        this.getTableData({
            keyword: inputValue
        })
    }

    render() {
        const {
            drillDisplay,
            drillLeft,
            drillTop,
            drillIndexList,
            menuSelectedKeys,
            loading
        } = this.state
        console.log(drillDisplay, '------render----drillDisplay----')
        return (
            <div className='drillFiledList' style={{ display: drillDisplay, left: drillLeft, top: drillTop, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <Button style={{ float: 'right', border: '0', paddingBottom: '8px', paddingRight: '0px' }} onClick={this.closeDrillCard} ><CloseOutlined /></Button>
                <div style={{ paddingBottom: '8px', 'fontSize': '14px' }} >
                    <span>下钻指标列表</span>
                </div>
                <div style={{ paddingBottom: '8px' }} >
                    <Search
                        placeholder="请输入关键词"
                        onSearch={value => this.handleSearch(value)}
                        style={{ width: '100%' }}
                        loading={loading}
                    />
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '200px', 'fontSize': '12px' }}>
                    <Row>
                        <Col>
                            <Menu className='menuItemUl' mode="inline" onClick={this.handleIndexBarClick} selectedKeys={menuSelectedKeys} >
                                {
                                    _.map(drillIndexList, (value, key) => {
                                        return (
                                            <Menu.Item className='menuItemLi' key={value.metricsId} >
                                                <Row>
                                                    <Col span='8'>{value.cname}</Col>
                                                    <Col span='8'>{value.tableCname}</Col>
                                                </Row>
                                            </Menu.Item>
                                        )
                                    })
                                }
                                {/* <Menu.Item>菜单项11</Menu.Item> */}

                            </Menu>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default DrillList
