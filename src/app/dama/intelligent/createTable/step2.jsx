import React, { Component } from 'react'
import { message, Button, Table, Form, Select } from 'antd'
import store from './store'
import { observer } from 'mobx-react'
import DelIcon from 'app_images/删除.svg'
import { getPinBoardView, getMergeSuggestion } from 'app_api/dashboardApi'
import { NotificationWrap } from 'app_common'
const { Option } = Select

@observer
class ChildList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timeOption: []
        }
    }

    componentDidMount = () => {
        const { boardList, selectList, ifCreate } = store
        const { keyIndex } = this.props
        if (selectList[keyIndex].boardId) {
            let dataIndex = boardList.slice().findIndex((val) => val.id === selectList[keyIndex].boardId)
            if (dataIndex >= 0) {
                this.setState({
                    timeOption: boardList[dataIndex].dateColumn
                })
            }
        }
    }
    // // 设置字段选项
    setDateColumnsList = () => {
        const { boardList, selectList } = store
        const { keyIndex } = this.props
        if (selectList[keyIndex].boardId) {
            let dataIndex = boardList.slice().findIndex((val) => val.id === selectList[keyIndex].boardId)
            this.setState({
                timeOption: boardList[dataIndex].dateColumn
            })
        }
    }

    // 选中视图
    selectBoard = (value) => {
        const { boardList, selectList } = store
        const { keyIndex } = this.props
        const { setFieldsValue, resetFields } = this.props.form
        let list = boardList.slice()
        let dataIndex = list.findIndex((val) => val.id === value)
        let selectName = `id${keyIndex}`
        let selectTimeName = `timeId${keyIndex}`
        let list2 = selectList.slice()
        let dataIndex1 = list2.findIndex((val) => val.boardId === value)
        if (dataIndex1 > -1 && keyIndex !== dataIndex1) {
            message.warning('不能重复添加')
            setFieldsValue({ [selectName]: list2[keyIndex].boardId || undefined, [selectTimeName]: list2[keyIndex].dateColumnKey || undefined })
            return
        } else {
            if (keyIndex === dataIndex1) {
                return
            }
            setFieldsValue({ [selectTimeName]: list[dataIndex].dateColumn[0].reportsColumnKey })
            list2[keyIndex] = {
                ...list2[keyIndex],
                boardId: value,
                boardName: list[dataIndex].name,
                mergeColumn: list[dataIndex].mergeColumn,
                dateColumnKey: list[dataIndex].dateColumn[0].reportsColumnKey
            }
            this.setState({
                timeOption: list[dataIndex].dateColumn
            })
            this.props.onPrew()
            store.setSelectList(list2)
        }
    }
    // 选择
    selectTime = (value) => {
        const { selectList } = store
        const { keyIndex } = this.props
        let list = selectList.slice()
        list[keyIndex] = { ...list[keyIndex], dateColumnKey: value }
        store.setSelectList(list)
        this.props.onPrew()
    }
    // 删除
    onDel = () => {
        const { selectList } = store
        const { keyIndex } = this.props
        const { resetFields } = this.props.form
        if (selectList.length <= 1) {
            message.warning('至少选择一个看板')
            return
        }
        selectList.splice(keyIndex, 1)
        resetFields()
        store.setSelectList(selectList)
        this.props.onPrew()
    }

    submit = () => {
        const { pbViewList, selectList } = store
        let list = []
        selectList.map((value, index) => {
            list.push({ mergeColumns: [{}] })
        })
        pbViewList.pbViews = list
        pbViewList.mergeColumnNames = ['']
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    resolve()
                    store.setPbViewList(pbViewList)
                } else {
                    reject()
                }
            })
        })
    }
    render() {
        const { boardList, initValue, keyIndex } = this.props
        const { getFieldDecorator } = this.props.form
        const { timeOption } = this.state
        return (
            <Form layout='inline'>
                <div className='selectChildren'>
                    <div style={{ width: '30px', height: 40, lineHeight: '40px', display: 'inline-block' }} >{keyIndex + 1}.</div>
                    <Form.Item>
                        {getFieldDecorator(`id${keyIndex}`, {
                            initialValue: initValue.boardId || undefined,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择看板视图 ',
                                },
                            ],
                        })(
                            <Select
                                onSelect={this.selectBoard}
                                style={{ width: 240 }}
                                // dropdownMatchSelectWidth={false}
                                placeholder='视图名称'
                            >
                                {
                                    boardList.map((val, index) => {
                                        return <Option className="boradOption" key={index} value={val.id}>{val.name}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <div style={{ width: '16px', display: 'inline-block' }} />
                    <Form.Item>
                        {getFieldDecorator(`timeId${keyIndex}`, {
                            initialValue: initValue.dateColumnKey || undefined
                            // rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Select
                                onChange={this.selectTime}
                                dropdownMatchSelectWidth={false}
                                style={{ width: 240 }}
                                placeholder='时间字段'
                            >
                                {
                                    timeOption.map((val, index) => {
                                        return <Option key={index} value={val.reportsColumnKey}>{val.cname}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <a className='del' onClick={this.onDel}><img src={DelIcon} /></a>
                </div>
            </Form>
        )
    }
}
const ChildListForm = Form.create()(ChildList)

@observer
class dataManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 是否预览
            ifPrew: true
        }
    }
    componentDidMount = async () => {
        let { selectList } = store
        this.setState({
            ifPrew: store.ifCreate
        })
        let res = {}
        // 在回显数据后视为创建流程
        if (!store.ifCreate && store.isSetData) {
            let obj = await this.props.getDetial()
            res = await getPinBoardView({ pinboardId: obj.pinboardId, addToReports: true })
            store.setSelectList(obj.selectList)
            selectList = obj.selectList
        } else {
            res = await getPinBoardView({ pinboardId: store.pinboardId, addToReports: true })
        }
        if (res.code === 200) {
            store.setBoardList(res.data)
            let boardList = res.data
            let list = []
            if (selectList.slice().length === 0 || !selectList[0].boardId) {
                return
            }
            selectList.map((value, index) => {
                let dataIndex = boardList.findIndex((val) => val.id === value.boardId)
                list.push({
                    ...value,
                    mergeColumn: boardList[dataIndex].mergeColumn
                })
            })
            if(!store.ifCreate && store.isSetData){
                selectList.map((value, index) => {
                    this[`child${index}`].setDateColumnsList()
                })
                store.setNotRepeat(false)
            } 
            store.setSelectList(list)
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    addBoard = () => {
        store.addBoard()
    }
    // 翻到下一页
    nextPage = () => {
        this.props.next()
    }
    // 翻到上一页
    prePage = () => {
        this.props.prev()
    }

    handleSubmit = async () => {
        const { selectList } = store
        // const { ifPrew } = this.state
        let list = []
        let pbViewIds = ''
        let pbViewList = {
            pbViews: [],
            mergeColumnNames: []
        }
        selectList.map((value, index) => {
            list.push(
                this[`child${index}`].submit()
            )
            pbViewList.pbViews.push({
                pbViewId: value.boardId,
                mergeColumns: []
            })
            if (index === 0) {
                pbViewIds = pbViewIds + value.boardId
            } else {
                pbViewIds = pbViewIds + ',' + value.boardId
            }
        })
        Promise.all(list).then(async () => {
            if (selectList.length > 1) {
                // if (!ifPrew) {
                //     return
                // }
                let res = await getMergeSuggestion({ pbViewIds })
                if (res.code === 200) {
                    if (res.data.mergeColumnNames.length > 0) {
                        let tmpList = []
                        pbViewList.pbViews.map((value, index) => {
                            if (res.data.pbViews[index] && value.pbViewId === res.data.pbViews[index].pbViewId) {
                                tmpList.push({
                                    pbViewId: value.pbViewId,
                                    mergeColumns: res.data.pbViews[index].mergeColumns
                                })
                            } else {
                                tmpList.push({
                                    pbViewId: value.pbViewId,
                                })
                            }
                        })
                        pbViewList.pbViews = tmpList
                        pbViewList.mergeColumnNames = res.data.mergeColumnNames
                        store.setPbViewList(pbViewList)
                    } else {
                        pbViewList.mergeColumnNames = []
                        store.setPbViewList(pbViewList)
                    }
                } else {
                    NotificationWrap.error(res.msg)
                }
            } else {
                pbViewList.mergeColumnNames = []
                store.setPbViewList(pbViewList)
            }
            this.nextPage()
        })
    }

    // 可以预览
    onPrew = () => {
        this.setState({
            ifPrew: true
        })
    }
    render() {
        const { selectList, boardList } = store
        return (

            <div className='step1'>
                <div className='addboard'>
                    <span>添加看板视图</span>
                    <a className='add' onClick={this.addBoard}>添加看板视图</a>
                </div>
                <div>
                    {
                        selectList.map((value, index) => {
                            return (
                                <ChildListForm
                                    wrappedComponentRef={(ref) => this[`child${index}`] = ref}
                                    boardList={boardList}
                                    keyIndex={index}
                                    key={index}
                                    initValue={value}
                                    onPrew={this.onPrew}
                                />)
                        })
                    }
                </div>
                <div className='steps-action'>
                    <Button
                        style={{ marginRight: '20px' }}
                        onClick={this.prePage}
                        disabled={!store.ifCreate}
                    >
                        上一步
                        </Button>
                    <Button type='primary'
                        onClick={this.handleSubmit}
                    >
                        下一步
                    </Button>
                </div>
            </div>
        )
    }
}
export default dataManage
