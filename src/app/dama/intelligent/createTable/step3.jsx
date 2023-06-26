import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Form, Input, Modal, Progress, Result, Select, Table } from 'antd'
import { createTable, getPreviewData } from 'app_api/dashboardApi'
import { NotificationWrap } from 'app_common'
import DelIcon from 'app_images/删除.svg'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from './store'
const { Option } = Select
@observer
class boardList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    // 删除
    onDel = () => {
        const { pbViewList } = store
        const { dataIndex, unMergeRowNumber } = this.props
        const { resetFields } = this.props.form
        // if (pbViewList.mergeColumnNames.length <= 1) {
        //     message.warning('至少选择一条合并依据')
        //     return
        // }
        pbViewList.mergeColumnNames.splice(dataIndex, 1)
        pbViewList.pbViews.map((value, index) => {
            let mergeColumns = pbViewList.pbViews[index].mergeColumns.slice()
            mergeColumns.splice(dataIndex, 1)
            pbViewList.pbViews[index].mergeColumns = mergeColumns
        })
        resetFields()
        if(unMergeRowNumber === this.props.dataIndex) {
            this.props.checkoutRow(dataIndex)
            this.props.initMergeRowNumber()
        }
        store.setPbViewList(pbViewList)
    }
    // 改变合并后的名称
    changeMergeName = (e) => {
        const { pbViewList } = store
        const { dataIndex } = this.props
        pbViewList.mergeColumnNames[dataIndex] = e.target.value
        store.setPbViewList(pbViewList)
    }
    selectFilied = async (index, value) => {
        const { dataIndex, unMergeRowNumber } = this.props
        const { pbViewList } = store
        pbViewList.pbViews[index].mergeColumns[dataIndex].reportsColumnKey = value
        if(unMergeRowNumber === this.props.dataIndex) {
            await this.props.initMergeRowNumber()
            this.checkoutRow(dataIndex)
        }
    }
    // 校验字段
    checkField = (index, rule, value, cb) => {
        const { dataIndex, unMergeRowNumber } = this.props
        const { pbViewList } = store
        let pdIndex = pbViewList.pbViews[index].mergeColumns.findIndex((val) => val.reportsColumnKey === value)
        console.log('check', dataIndex, unMergeRowNumber)
        if (dataIndex === unMergeRowNumber) {
            cb('请选择正确的字段')
            return
        }
        if (!value || value.length <= 0) {
            cb('合并字段不能为空')
            return
        }
        if (pdIndex > -1 && dataIndex !== pdIndex) {
            cb('不能重复添加')
        } else {
            cb()
        }
    }
    // 校验合并名称
    checkFieldName = (rule, value, cb) => {
        const { dataIndex, unMergeRowNumber } = this.props
        const { pbViewList } = store
        let pdIndex = pbViewList.mergeColumnNames.findIndex((val) => val === value)
        if (!value || value.length <= 0) {
            cb('字段不能为空')
            return
        }
        if (pdIndex > -1 && dataIndex !== pdIndex) {
            cb('不能重复添加')
        } else {
            cb()
        }
    }
    // 保存
    submit = () => {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }
    checkoutRow = (unMergeRowNumber) => {
        this.props.form.resetFields()
        this.props.form.validateFields()
    }
    render() {
        const { selectList, pbViewList } = store
        const { dataIndex } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form layout='inline'>
                <span className='delIcon' onClick={this.onDel}><img src={DelIcon} /></span>
                <Form.Item>
                    {getFieldDecorator(`mergeName${dataIndex}`, {
                        initialValue: pbViewList.mergeColumnNames && pbViewList.mergeColumnNames[dataIndex] ? pbViewList.mergeColumnNames[dataIndex] : undefined,
                        rules: [
                            {
                                required: true,
                                // message: '请输入合并结果 ',
                                validator: this.checkFieldName
                            },
                        ],
                    })(
                        <Input
                            onChange={this.changeMergeName}
                            placeholder='输入合并结果'
                            style={{ width: 240, marginRight: '16px' }}
                        />
                    )}
                </Form.Item>
                {
                    selectList.map((data, index) => {
                        return (
                            <Form.Item key={index}>
                                {getFieldDecorator(`${dataIndex}field${index}`, {
                                    initialValue: pbViewList.pbViews[index] && pbViewList.pbViews[index].mergeColumns && pbViewList.pbViews[index].mergeColumns[dataIndex] && pbViewList.pbViews[index].mergeColumns[dataIndex].reportsColumnKey
                                        ? pbViewList.pbViews[index].mergeColumns[dataIndex].reportsColumnKey : undefined,
                                    rules: [
                                        {
                                            required: true,
                                            // message: '请选择合并字段 ',
                                            validator: this.checkField.bind(this, index)
                                        },
                                    ],
                                })(
                                    <Select
                                        style={{ width: 240, marginRight: '16px' }}
                                        dropdownMatchSelectWidth={false}
                                        onSelect={this.selectFilied.bind(this, index)}
                                        placeholder='选择合并字段'
                                    >
                                        {
                                            data.mergeColumn.map((val, index) => {
                                                return <Option key={index} value={val.reportsColumnKey}>{val.cname}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        )
                    })
                }

            </Form>
        )
    }
}
const ChildListForm = Form.create()(boardList)

@observer
class dataManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: [
                '#FEEED7', '#EAF8FD', '#FBE9E7', '#E0F2F1',
                '#FEEED7', '#EAF8FD', '#FBE9E7', '#E0F2F1'
            ],
            errMsg: '',
            ifError: false,
            loading: false,
            tableHead: [],
            tableData: [],
            idList: [],
            // 不能合并字段所在行
            unMergeRowNumber: -1,
            // 创建完成的报表
            reportId: '',
            errorMsg: '请正确添加合并依据'
        }
    }
    componentDidMount = () => {
        this.onRefresh()
    }
    // 翻到上一页
    prePage = () => {
        this.props.prev()
    }
    // 增加合并字段
    addMergeColumn = () => {
        const { pbViewList } = store
        pbViewList.mergeColumnNames.push('')
        pbViewList.pbViews.map((val) => {
            val.mergeColumns.push({})
        })
        store.setPbViewList(pbViewList)
    }
    // 保存
    handleSubmit = async () => {
        const { pbViewList, selectList } = store
        let list = []
        pbViewList.mergeColumnNames.map((value, index) => {
            list.push(
                this[`childList${index}`].submit()
            )
        })
        let params = {}
        params.mergeColumnNames = pbViewList.mergeColumnNames
        params.name = store.name
        params.cycle = store.cycle
        params.type = store.type
        if(store.reportId){
            params.id = store.reportId
        }
        if (store.ifCreate) {
            params.pinboardId = store.pinboardId
        }
        Promise.all(list).then(async () => {
            // this.nextPage()
            params.pbViews = selectList.map((value, index) => {
                return {
                    id: value.boardId,
                    dateColumnKey: value.dateColumnKey,
                    mergeColumnKeys: pbViewList.pbViews[index].mergeColumns ? pbViewList.pbViews[index].mergeColumns.map((val, ind) => {
                        return val.reportsColumnKey
                    }) : []
                }
            })
            let progess = 0
            this.setState({
                visible: true,
                result: 'progess',
                progess: 0,
            })
            let time = setInterval(() => {
                progess = progess + 3
                this.setState({
                    progess
                })
                if (progess >= 99) {
                    clearInterval(time)
                }
            }, 100) 
            let res = await createTable(params)
            if(res.code === 200) {
            this.setState({
                result: 'success',
                errMsg: '',
                reportId: res.data
            })
            this.props.reload('dashboardList')
            clearInterval(time)
            } else {
            // NotificationWrap.error(res.msg)
               this.setState({
                   result: 'error',
                   errMsg: res.msg
               })
               if (res.data || res.data === 0) {
                await this.setState({
                    unMergeRowNumber: res.data
                })
                store.pbViewList.mergeColumnNames.map((value, index) => {
                    this[`childList${index}`].checkoutRow()
                })
               }
               clearInterval(time)
            }
        })
    }
    // 刷新方法
    onRefresh = () => {
        const { pbViewList, selectList } = store
        let list = []
        let params = {}
        params.mergeColumnNames = pbViewList.mergeColumnNames
        params.cycle = store.cycle
        params.type = store.type
        if(pbViewList.pbViews.length === 1) {
            params.pbViews = [{
                id: pbViewList.pbViews[0].pbViewId,
                dateColumnKey: selectList[0].dateColumnKey,
            }]
            this.getPreview(params)
            return
        }
        pbViewList.mergeColumnNames.map((value, index) => {
            list.push(
                this[`childList${index}`].submit()
            )
        })
        Promise.all(list).then(async () => {
            // this.nextPage()
            params.pbViews = selectList.map((value, index) => {
                return {
                    id: selectList[index].boardId,
                    dateColumnKey: selectList[index].dateColumnKey,
                    mergeColumnKeys: pbViewList.pbViews[index].mergeColumns ? pbViewList.pbViews[index].mergeColumns.map((val, ind) => {
                        return val.reportsColumnKey
                    }): []
                }
            })
            this.getPreview(params)
        })
    }
    // 获取预览报表
    getPreview = async (params) => {
        this.setState({
            loading: true
        })
        let res = await getPreviewData(params)
        if (res.code === 200) {
            if (res.data.status === 0) {
                if (!res.data.chartType || res.data.chartType.length === 0) {
                    let header = res.data.tableHead ? res.data.tableHead.map((value, index) => {
                        return ({
                            title: value.cname,
                            dataIndex: value.ename,
                            key: value.index,
                            pinboardId: value.answerId,
                        })
                    }) : []
                    this.setState({
                        tableHead: header,
                        tableData: res.data.tableData || []
                    })
                } else {
                    this.setState({
                        tableHead: this.changeHeaderColor(res.data.chartData.data.dataset_title),
                        tableData: res.data.chartData.data.dataset_body
                    })
                }
            } else {
                this.setState({
                    ifError: true,
                    errorMsg: res.data.errorMsg
                })
                if(res.data.unMergeRowNumber || res.data.unMergeRowNumber === 0){
                    await this.setState({
                        unMergeRowNumber: res.data.unMergeRowNumber,
                    })
                    store.pbViewList.mergeColumnNames.map((value, index) => {
                        this[`childList${index}`].checkoutRow()
                    })
                }
            }
        } else {
            NotificationWrap.error(res.msg)
        }
        this.setState({
            loading: false
        })
    }
    // 手动校验某一行
    checkoutRow = (index) => {
        this[`childList${index}`].submit()
    }
    //初始换错误字段行数
    initMergeRowNumber = () => {
        this.setState({
            unMergeRowNumber: -1
        })
    }
    // 改变表头颜色
    changeHeaderColor = (list) => {
        const { selectList } = store
        let dataList = list.map((value, index) => {
            if (value.children) {
                return {
                    ...value,
                    width: 100,
                    className:'widthLimit',
                    onHeaderCell: (column, rowIndex) => {
                        let key = selectList.slice().findIndex((value) => value.boardId === column.answerId)
                        let num = key % 4
                        if(key >= 0) {
                            return {
                                column,
                                className: `color${num}`
                            }
                        } else {
                            return {
                                column
                            } 
                        }

                    },
                    children: this.changeHeaderColor(value.children)
                }
            } else {
                return {
                    ...value,
                    className:'widthLimit',
                    width: 100,
                    onHeaderCell: (column, rowIndex) => {
                        let key = selectList.slice().findIndex((value) => value.boardId === column.answerId)
                        let num = key % 4
                        if(key >= 0) {
                            return {
                                column,
                                className: `color${num}`
                            }
                        } else {
                            return {
                                column
                            } 
                        }
                    },
                }
            }
        })
        return dataList
    }
    // 隐藏弹窗
    hideModal = () => {
        this.setState({
            visible: false
        })
    }
    // 查看报表
    goDataSet = async () => {
        await this.hideModal()
        let param = { id: this.state.reportId }
        // this.props.removeTab('createTable')
        this.props.addTab('reportDetail', param)
    }
    render() {
        const { 
            color, ifError, errMsg, result, visible,
            progess, tableHead, tableData, loading,
            unMergeRowNumber,errorMsg
        } = this.state
        const { selectList, pbViewList } = store
        return (
            <div className='step1'>
                <div className='createTableStep3'>
                    <div className='selectColumn'>
                        <div className='addboard'>
                            <span>合并字段</span>
                            {selectList.length > 1 && <a style={{ paddingLeft: '40px' }} onClick={this.addMergeColumn}>添加合并依据</a>}
                        </div>
                        {
                            selectList.length <= 1
                                ? <div className='mergeContent' style={{ paddingLeft: '40px' }}>报表中只包含一个视图，无需进行视图合并。</div>
                                : <div className='mergeContent'>
                                    <div className='mergeHeader'>
                                        <Input disabled value='合并依据' style={{ background: '#EEF7EE', width: 240, marginRight: '16px' }} />
                                        {
                                            selectList.map((val, index) => {
                                                return (
                                                    <Input disabled value={val.boardName} key={index} style={{ background: color[index], width: 240, marginRight: '16px' }} />
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='Content'>
                                        {
                                            pbViewList.mergeColumnNames.map((value, index) => {
                                                return (
                                                    <ChildListForm
                                                        wrappedComponentRef={(ref) => this[`childList${index}`] = ref}
                                                        dataIndex={index}
                                                        key={index}
                                                        unMergeRowNumber={unMergeRowNumber}
                                                        initMergeRowNumber={this.initMergeRowNumber}
                                                        checkoutRow={this.checkoutRow}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                    <div className='columnPreview'>
                        <div className='previewHeader'>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>合并预览</span>
                            <div className='refresh'>
                                <span style={{ marginRight: '8px' }}>刷新预览最新合并结果</span>
                                <Button type='primary' size='small' onClick={this.onRefresh}>刷新</Button>
                            </div>
                        </div>
                        <div className='previewContent'>
                            {
                                ifError ? <div className='errContent'>
                                    <Result
                                        status='error'
                                        title=''
                                        subTitle={errorMsg}
                                        style={{
                                            padding: '80px 32px'
                                        }}
                                    />
                                </div> : <div>
                                        <Table
                                            columns={tableHead}
                                            dataSource={tableData}
                                            loading={loading}
                                            bordered
                                            size='middle'
                                            scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                                        />
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='steps-action'>
                    <Button
                        style={{ marginRight: '20px' }}
                        onClick={this.prePage}
                    >
                        上一步
                    </Button>
                    <Button type='primary' onClick={this.handleSubmit}>
                        保存
                    </Button>
                </div>
                <Modal
                    title='报表创建'
                    visible={this.state.visible}
                    onCancel={this.hideModal}
                    footer={null}
                >
                    {
                        result === 'progess' && <Result
                            status='info'
                            title={<span style={{ fontSize: '16px' }}>正在创建报表...</span>}
                            subTitle={errMsg}
                            icon={
                                <Progress strokeLinecap='square' width={80} type='circle' percent={progess} />
                            }
                        />
                    }
                    {
                        result === 'error' && <Result
                            status='error'
                            title={<span style={{ fontSize: '16px' }}>报表创建失败</span>}
                            subTitle={errMsg}
                            icon={
                                <ExclamationCircleFilled style={{ color: '#FF4D4F' }} />
                            }
                            extra={
                                <Button type="primary" onClick={this.hideModal}>
                                    返回修改
                                </Button>
                            }
                        />
                    }
                    {
                        result === 'success' && <Result
                            status='success'
                            title={<span style={{ fontSize: '16px' }}>{store.reportId ? '报表修改成功' : '报表创建成功'}</span>}
                            subTitle={errMsg}
                            extra={
                                <Button type='primary' onClick={this.goDataSet}>
                                    查看报表
                                </Button>
                            }
                        />
                    }
                </Modal>
            </div>
        )
    }
}
const EditableFormTable = Form.create()(dataManage)
export default EditableFormTable

