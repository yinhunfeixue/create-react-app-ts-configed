import React, { Component } from 'react'
import { List, Modal, Tooltip } from 'antd'
import _ from 'underscore'
import leftAdd from 'app_images/leftAdd.svg'
import leftDel from 'app_images/leftDel.svg'
import leftSelect from 'app_images/leftSelect.svg'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'
import modifyOutline from 'app_images/modifyOutline.svg'
import './leftContent.less'
import { observer } from 'mobx-react'
import store from '../../store'

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topic: '',
            // 默认数据长度
            dataLentgh: this.props.dataLentgh || 5,
            // 原始数据
            dataList: this.props.dataList || [],
            // 默认数组长度
            initList: this.props.dataList || [],
            ifFold: true,
            formulaVisible: false,
            // 公式函数类型/内容
            formulaType: 0,
            formulaContent: {},
            cname: '',
            id: 0
        }
    }

    // 获取首页输入框上面的业务数据
    componentDidMount = async () => {
        // this.onFold()
        this.unFold()
    }
    componentWillReceiveProps = (nextState) => {
        if (nextState.initList !== this.state.initList) {
            this.unFold(nextState)
        }
    }

    unFold = (nextState) => {
        let initList = this.props.initList
        if (nextState && nextState.initList) {
            initList = nextState.initList
        }
        this.setState({
            dataList: initList
            // ifFold: false
        })
    }
    // onFold = (nextState) => {
    //     let { initList, dataLentgh } = this.props
    //     if (nextState && nextState.initList) {
    //         initList = nextState.initList
    //     }
    //     let dataList = initList.slice(0, dataLentgh)
    //     this.setState({
    //         dataList,
    //         ifFold: true,
    //         // eslint-disable-next-line react/no-unused-state
    //         dataLentgh,
    //         initList
    //     })
    // }

    addOption = async (name, id) => {
        const { leftSelectOption } = store
        let arr = [...leftSelectOption]
        let dataIndex = arr.findIndex((val) => val.id === id)
        if (dataIndex === -1) {
            arr.push({ content: name, id })
            await store.setLeftOption(arr)
            this.selectOption()
        }
    }
    // 取消选项
    delOption = async (name, id) => {
        const { leftSelectOption } = store
        let arr = [...leftSelectOption]
        let dataIndex = arr.findIndex((val) => val.id === id)
        arr.splice(dataIndex, 1)
        await store.delLeftOption(arr, id)
        this.selectOption()
    }

    // 设置选项
    selectOption = async () => {
        let param = {
            businessIds: store.usableBusinessIds,
            type: store.type,
            nodeList: store.searchItem
        }
        await store.onMatch(param)
        if (store.ambiguityList.length === 1 && store.ambiguityList[0].status === 1) {
            store.clearContent()
            return
        } else {
            param.nodeList = store.searchItem.slice()
            // await store.onSearch(param)
            // this.props.searchAction()
            this.props.searchAction && this.props.searchAction()
        }
    }
    // 关闭修改新增列
    handleCancel = () => {
        if (this.addNewCol) {
            this.addNewCol.clearParams()
        }
        this.setState({
            formulaVisible: false
        })
    }
    // 打开新增列
    onEdit = (item) => {
        this.setState({
            formulaType: item.columnType,
            formulaContent: JSON.parse(item.formulaData),
            formulaVisible: true,
            cname: item.cname,
            id: item.id,
            relatedBusinessIds: item.relatedBusinessIds
        })
    }

    saveFormula = async (data, param) => {
        await this.props.saveFormula(data)
        this.handleCancel()
        const { leftSelectOption, formulaList } = store
        let arr = [...leftSelectOption]
        let item = {}
        formulaList.map((value, index) => {
            if (value.id === param.id) {
                item = { content: param.name, id: param.id, tempBusinessId: param.tempBusinessId }
            }
        })
        arr.map((value, index) => {
            if (value.id === param.id) {
                arr.splice(index, 1, item)
                return
            }
        })
        await store.setLeftOption(arr)
        this.selectOption()
    }

    render() {
        const { leftSelectOption } = store
        const { topic, dataLentgh } = this.props
        const { dataList, relatedBusinessIds, ifFold, initList, formulaVisible, formulaType, formulaContent, cname, id } = this.state
        const { formulaList } = this.props
        return (
            <div className='leftChildBlock'>
                <List
                    dataSource={dataList}
                    renderItem={(item) => (
                        <List.Item
                            className='listItem'
                            style={{
                                border: 'none',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <Tooltip placement='top' title={!item.usable && '不可使用'} style={{ width: '100%' }}>
                                {
                                    leftSelectOption.findIndex((val) => val.id === item.id) > -1
                                        ? <div className='statusArr'>
                                            <div className='itemStatus1'><img src={leftSelect} /></div>
                                            <div className='itemStatus2' onClick={item.usable && this.delOption.bind(this, item.cname, item.id)}><img src={leftDel} /></div>
                                        </div>
                                        : <div className='statusArr'>
                                            <div className='itemStatus'>
                                                <img src={leftAdd} onClick={item.usable && this.addOption.bind(this, item.cname, item.id)} />
                                            </div>
                                        </div>
                                }
                                <div className='itemType'>
                                    {item.columnType === 1 && <img src={Measure} />}
                                    {item.columnType === 2 && <img src={Dimension} />}
                                    {item.columnType === 3 && <img src={Date} />}
                                </div>
                                <Tooltip title={item.cname}>
                                    <span
                                        className='itemText'
                                        style={{
                                            maxWidth: '105px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            verticalAlign: 'top'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: item.cname }}></span>
                                </Tooltip>
                                <div className='itemType' style={{ cursor: 'pointer', position: 'absolute', right: 0, float: 'right' }}>
                                    <img src={modifyOutline} onClick={item.usable && this.onEdit.bind(this, item)} />
                                </div>
                            </Tooltip>
                        </List.Item>
                    )}
                />
                {/* {
                    initList.length > dataLentgh ? ifFold ? <div style={{ paddingTop: '4px', fontSize: '12px' }}><a onClick={this.unFold}>+展示更多</a></div> : <div style={{ paddingTop: '10px', fontSize: '12px' }}><a onClick={this.onFold}>-收起</a></div> : null
                } */}
                {
                    formulaVisible && <Modal
                        title='添加公式列'
                        visible={formulaVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        width={1005}
                    >

                    </Modal>
                }
            </div>
        )
    }
}
