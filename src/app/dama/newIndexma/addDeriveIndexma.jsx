import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Radio, Select, Steps, Table, Tooltip } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { simpleBizAssets } from 'app_api/metadataApi'
import { atomicMetricsSearch, createDerivativeMetrics, factassetsColumns, preCreateDerivativeMetrics, statisticalperiodSimple } from 'app_api/termApi'
import React, { Component } from 'react'
import './addDeriveIndexma.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

let col = 0
let spanName = 0

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indexmaInfo: {
                atomicMetricsDTO: {},
            },
            postInfo: {},
            statisticalColumnList: [{ id: [] }],
            businessLimitIdList: [{ id: undefined }],
            statisticalPeriodAndTimeIdList: [{ key: undefined, value: undefined }],
            statisticalperiodList: [],
            indexmaList: [],
            staticList: ['1'],
            step: 0,
            loading: false,
            columnData: [],
            userList: [],
            statisticalColumnData: [],
            timeFormatData: [],
            atomicMetricsList: [],
            tipDesc: '',
        }
        this.columns = [
            {
                dataIndex: 'englishNameTail',
                key: 'englishNameTail',
                title: '衍生指标英文名',
                width: 280,
                render: (text, record, index) => {
                    return <Input addonBefore={record.englishNameHead} value={text} maxLength={64} onChange={this.changeColumnCn.bind(this, index, 'englishNameTail')} placeholder='请输入英文名' />
                },
            },
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '指标名称',
                width: 280,
                render: (text, record, index) => {
                    return <Input value={text} maxLength={64} onChange={this.changeColumnCn.bind(this, index, 'chineseName')} placeholder='请输入中文名' />
                },
            },
            {
                dataIndex: 'statisticalColumnText',
                key: 'statisticalColumnText',
                title: '统计粒度',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'relateStandardCname',
                key: 'relateStandardCname',
                title: '统计周期',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.statisticalPeriodDTO.chineseName}>
                        {record.statisticalPeriodDTO.chineseName || <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'relateStandardCname',
                key: 'relateStandardCname',
                title: '业务限定',
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={record.businessLimitDTO ? record.businessLimitDTO.chineseName : ''}>
                        {record.businessLimitDTO ? record.businessLimitDTO.chineseName : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'dataType',
                key: 'dataType',
                title: '数据类型',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'description',
                key: 'description',
                title: '口径说明',
                width: 280,
                render: (text, record, index) => {
                    return <Input value={text} maxLength={128} onChange={this.changeColumnCn.bind(this, index, 'description')} placeholder='请输入业务口径' />
                },
            },
            {
                dataIndex: 'busiManagerName',
                key: 'busiManagerName',
                title: '负责人',
                width: 150,
                render: (text, record, index) => {
                    return (
                        <Select style={{ width: '100px' }} onChange={this.changeUser.bind(this, index)} value={record.busiManagerId} placeholder='请选择负责人'>
                            {this.state.userList.length &&
                                this.state.userList.map((item) => {
                                    return (
                                        <Option title={item.realname} busiManagerName={item.realname} value={item.id} key={item.id}>
                                            {item.realname}
                                        </Option>
                                    )
                                })}
                        </Select>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 60,
                fixed: 'right',
                render: (text, record, index) => {
                    return <a onClick={this.deleteData.bind(this, index)}>删除</a>
                },
            },
        ]
    }
    componentDidMount = async () => {
        this.getUserData()
        this.getAtomicMetrics()
        this.getStatisticalperiodSimple()
    }
    getStatisticalColumnData = async () => {
        let res = await factassetsColumns({ needAll: true, type: 1, factAssetsId: this.state.indexmaInfo.atomicMetricsDTO.factAssetsId })
        if (res.code == 200) {
            this.setState({
                statisticalColumnData: res.data,
            })
        }
    }
    getTimeFormatData = async () => {
        let res = await factassetsColumns({ needAll: true, type: 2, factAssetsId: this.state.indexmaInfo.atomicMetricsDTO.factAssetsId })
        if (res.code == 200) {
            this.setState({
                timeFormatData: res.data,
            })
        }
    }
    getAtomicMetrics = async () => {
        let res = await atomicMetricsSearch({ needAll: true })
        if (res.code == 200) {
            this.setState({
                atomicMetricsList: res.data,
            })
        }
    }
    getStatisticalperiodSimple = async () => {
        let res = await statisticalperiodSimple({})
        if (res.code == 200) {
            this.setState({
                statisticalperiodList: res.data,
            })
        }
    }
    deleteStatic = async (index, name) => {
        this.state[name].splice(index, 1)
        await this.setState({
            [name]: this.state[name],
        })
        this.getUsedInfo(name)
    }
    getIndexmaList = async () => {
        let res = await simpleBizAssets({ needAll: true, sourceAssetsId: this.state.indexmaInfo.atomicMetricsDTO.factAssetsId })
        if (res.code == 200) {
            this.setState({
                indexmaList: res.data,
            })
        }
    }
    getUsedInfo = (name) => {
        const { statisticalColumnList, statisticalColumnData, statisticalPeriodAndTimeIdList, statisticalperiodList, businessLimitIdList, indexmaList } = this.state
        if (name == 'statisticalColumnList') {
            // statisticalColumnData.map((item) => {
            //     item.used = false
            // })
            // this.state.statisticalColumnList.map((item) => {
            //     statisticalColumnData.map((item1) => {
            //         if (item.id == item1.id) {
            //             item1.used = true
            //         }
            //     })
            // })
            // this.setState({
            //     statisticalColumnData
            // })
        } else if (name == 'statisticalPeriodAndTimeIdList') {
            statisticalperiodList.map((item) => {
                item.used = false
            })
            this.state.statisticalPeriodAndTimeIdList.map((item) => {
                statisticalperiodList.map((item1) => {
                    if (item.key == item1.id) {
                        item1.used = true
                    }
                })
            })
            this.setState({
                statisticalperiodList,
            })
        } else if (name == 'businessLimitIdList') {
            indexmaList.map((item) => {
                item.used = false
            })
            this.state.businessLimitIdList.map((item) => {
                indexmaList.map((item1) => {
                    if (item.id == item1.id) {
                        item1.used = true
                    }
                })
            })
            this.setState({
                indexmaList,
            })
        }
    }
    deleteData = (index) => {
        let { columnData } = this.state
        columnData.splice(index, 1)
        this.setState({
            columnData,
        })
    }
    changeColumnCn = async (index, name, e) => {
        let { columnData } = this.state
        columnData[index][name] = e.target.value
        this.setState({
            columnData,
        })
    }
    changeUser = (index, e, node) => {
        let { columnData } = this.state
        columnData[index].busiManagerId = e
        columnData[index].busiManagerName = node.props.busiManagerName
        this.setState({
            columnData,
        })
    }
    showSelect = (record, index, num, name) => {
        let { columnData } = this.state
        let params = { ...record }
        if (params.editable) {
            delete params.editable
        }
        let array = this.state[name]
        let tableData = [...array]
        console.log(tableData, name, this.state[name], 'showSelect')
        tableData = tableData.map((value) => {
            if (value.editable) {
                delete value.editable
            }
            return value
        })
        switch (num) {
            case '0':
                params.editable = 1
                break
            case '1':
                params.editable = 2
                break
            case '2':
                params.editable = 3
                break
            case '3':
                params.editable = 4
                break
            case '4':
                params.editable = 5
                break
            case '5':
                params.editable = 6
                break
            default:
                break
        }
        tableData[index].editable = params.editable
        console.log(tableData, 'tableData++++')
        this.setState({ [name]: [...tableData] })
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    addStatic = (name) => {
        if (name == 'statisticalPeriodAndTimeIdList') {
            this.state[name].push({ key: undefined, value: undefined })
        } else if (name == 'statisticalColumnList') {
            this.state[name].push({ id: [] })
            // this.state[name].push([])
        } else if (name == 'businessLimitIdList') {
            this.state[name].push({ id: undefined })
        } else {
            this.state[name].push(undefined)
        }
        this.setState({
            [name]: this.state[name],
        })
    }
    changeStatistic = async (index, name, e) => {
        if (name == 'statisticalPeriodAndTimeIdList') {
            this.state[name][index].key = e
        } else if (name == 'statisticalColumnList' || name == 'businessLimitIdList') {
            this.state[name][index].id = e
            // this.state[name][index] = e
        } else {
            this.state[name][index] = e
        }
        await this.setState({
            [name]: this.state[name],
        })
        this.getUsedInfo(name)
    }
    changeTime = (index, e) => {
        const { statisticalPeriodAndTimeIdList } = this.state
        statisticalPeriodAndTimeIdList[index].value = e
        this.setState({
            statisticalPeriodAndTimeIdList,
        })
    }
    isRepeat = (arr) => {
        var hash = {}
        for (var i in arr) {
            if (hash[arr[i]]) {
                return true
            }
            hash[arr[i]] = true
        }
        return false
    }
    isContained = (a, b) => {
        var aStr = a.toString()
        console.log(aStr, 'aStr')
        for (var i = 0, len = b.length; i < len; i++) {
            console.log(b[i], 'bbbbb')
            if (aStr.indexOf(b[i]) == -1) return false
        }
        return true
    }
    isArrayRepeat = (arr) => {
        let result = false
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 1; j < arr.length; j++) {
                if (arr[i].length == arr[j].length && i !== j) {
                    console.log(i, j, 'ijjjjjjj')
                    result = this.isContained(arr[i], arr[j])
                }
            }
        }
        console.log(result, 'result++++')
        return result
    }
    nextStep = async () => {
        let { indexmaInfo, businessLimitIdList, statisticalColumnList, statisticalPeriodAndTimeIdList, tipDesc } = this.state
        let query = {
            atomicMetricsId: indexmaInfo.atomicMetricsId,
            businessLimitIdList: [],
            statisticalColumnIdsList: [],
            statisticalPeriodAndTimeIdList: [...statisticalPeriodAndTimeIdList],
        }
        businessLimitIdList.map((item) => {
            if (item.id !== undefined) {
                query.businessLimitIdList.push(item.id)
            }
        })
        statisticalColumnList.map((item) => {
            query.statisticalColumnIdsList.push(item.id)
            // query.statisticalColumnIdsList.push(item)
        })
        let periodData = []
        query.statisticalPeriodAndTimeIdList.map((item) => {
            periodData.push(item.key)
        })
        let hasEmpty = false
        let hasEmpty1 = false

        let isRepeat = this.isArrayRepeat(query.statisticalColumnIdsList)
        let isRepeat1 = this.isRepeat(periodData)
        let isRepeat2 = this.isRepeat(query.businessLimitIdList)

        query.statisticalColumnIdsList.map((item) => {
            if (!item.length) {
                hasEmpty = true
            }
        })
        query.statisticalPeriodAndTimeIdList.map((item) => {
            if (item.key == undefined || item.value == undefined) {
                hasEmpty1 = true
            }
        })
        if (!query.atomicMetricsId) {
            message.info('请选择原子指标')
            return
        }
        if (!query.statisticalColumnIdsList.length) {
            message.info('请选择至少一条统计粒度')
            return
        }
        if (hasEmpty) {
            message.info('统计粒度填写未完成')
            return
        }
        if (!query.statisticalPeriodAndTimeIdList.length) {
            message.info('请选择至少一条统计周期')
            return
        }
        if (hasEmpty1) {
            message.info('统计周期填写未完成')
            return
        }
        if (isRepeat) {
            message.info('统计粒度不能重复')
            return
        }
        if (isRepeat1) {
            message.info('统计周期不能重复')
            return
        }
        if (isRepeat2) {
            message.info('业务限定不能重复')
            return
        }
        this.setState({ loading: true })
        let res = await preCreateDerivativeMetrics(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            tipDesc = ''
            // let array = []
            // res.data.map((item) => {
            //     if (item.keyRepeat) {
            //         array.push(item)
            //     }
            // })
            res.data.map((item, index) => {
                if (item.keyRepeat) {
                    tipDesc += '#' + (index + 1) + ' '
                    // tipDesc += '#' + (index + 1) + ((index + 1) < array.length?'、':'')
                }
            })
            this.setState({
                step: 1,
                tipDesc,
                columnData: res.data,
            })
        }
    }
    prePage = () => {
        this.setState({
            step: 0,
        })
    }
    changeMetrics = async (e, node) => {
        const { indexmaInfo, statisticalColumnList, statisticalPeriodAndTimeIdList, businessLimitIdList } = this.state
        indexmaInfo.atomicMetricsId = e
        indexmaInfo.atomicMetricsDTO = node.props.atomicMetricsDTO
        statisticalColumnList.map((item) => {
            item.id = []
            // item = undefined
            console.log(item, 'changeMetrics')
        })
        statisticalPeriodAndTimeIdList.map((item) => {
            item.value = undefined
        })
        businessLimitIdList.map((item) => {
            item.id = undefined
        })
        await this.setState({
            indexmaInfo,
            statisticalColumnList,
            statisticalPeriodAndTimeIdList,
            businessLimitIdList,
        })
        this.getStatisticalColumnData()
        this.getTimeFormatData()
        this.getIndexmaList()
    }
    postData = async () => {
        const { columnData } = this.state
        let queryData = []
        columnData.map((item) => {
            if (!item.keyRepeat) {
                queryData.push(item)
            }
        })
        if (!queryData.length) {
            message.info('请至少提交一条数据')
            return
        }
        let enEmpty = false
        let cnEmpty = false
        queryData.map((item) => {
            if (!item.englishNameTail) {
                enEmpty = true
            }
            if (!item.chineseName) {
                cnEmpty = true
            }
        })
        if (enEmpty) {
            message.info('英文名不能为空')
            return
        }
        if (cnEmpty) {
            message.info('中文名不能为空')
            return
        }
        this.setState({ loading: true })
        let res = await createDerivativeMetrics(queryData)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('保存成功')
            this.back()
        }
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('衍生指标')
        })
    }

    render() {
        let {
            indexmaInfo,
            indexmaList,
            staticList,
            step,
            columnData,
            statisticalColumnData,
            timeFormatData,
            atomicMetricsList,
            statisticalColumnList,
            statisticalPeriodAndTimeIdList,
            businessLimitIdList,
            statisticalperiodList,
            loading,
            postInfo,
            tipDesc,
        } = this.state
        return (
            <TableLayout
                title='定义衍生指标'
                className='addDeriveIndexma'
                renderDetail={() => {
                    return (
                        <Steps size='small' current={step} style={{ marginBottom: 30 }}>
                            <Steps.Step title='定义维度' />
                            <Steps.Step title='字段详情' />
                            <Steps.Step title='完成' />
                        </Steps>
                    )
                }}
                renderTable={() => {
                    switch (step) {
                        case 0:
                            return (
                                <Module title='选择原子指标'>
                                    <Form className='EditMiniForm Grid1'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '原子指标',
                                                required: true,
                                                content: (
                                                    <Select
                                                        style={{ width: 468 }}
                                                        onChange={this.changeMetrics}
                                                        value={indexmaInfo.atomicMetricsId}
                                                        optionLabelProp='label'
                                                        optionFilterProp='title'
                                                        showSearch
                                                        filterOption={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                        placeholder='请选择原子指标'
                                                    >
                                                        {atomicMetricsList.map((item) => {
                                                            return (
                                                                <Option
                                                                    label={item.chineseName}
                                                                    title={item.chineseName + ' ' + item.factAssetsName}
                                                                    atomicMetricsDTO={item}
                                                                    value={item.id}
                                                                    key={item.id}
                                                                >
                                                                    {item.chineseName}
                                                                    <span style={{ marginLeft: 24, color: 'rgba(102, 102, 102, 0.8)' }}>{item.factAssetsName}</span>
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                ),
                                                extra: indexmaInfo.atomicMetricsId ? (
                                                    <div className='HControlGroup'>
                                                        <span>业务板块：{indexmaInfo.atomicMetricsDTO.moduleNameWithParent || <EmptyLabel />}</span>
                                                        <span>主题域：{indexmaInfo.atomicMetricsDTO.themeNameWithParent || <EmptyLabel />}</span>
                                                        <span>业务过程：{indexmaInfo.atomicMetricsDTO.bizProcessName || <EmptyLabel />}</span>
                                                    </div>
                                                ) : null,
                                            },
                                            {
                                                label: (
                                                    <span>
                                                        <span className='numberBlock'>1</span>统计粒度
                                                    </span>
                                                ),
                                                required: true,
                                                content: (
                                                    <div className='VControlGroup'>
                                                        {statisticalColumnList.map((item, index) => {
                                                            return (
                                                                <div className='HControlGroup'>
                                                                    <Select
                                                                        mode='multiple'
                                                                        style={{ width: 468 }}
                                                                        onChange={this.changeStatistic.bind(this, index, 'statisticalColumnList')}
                                                                        value={item.id}
                                                                        optionLabelProp='label'
                                                                        optionFilterProp='title'
                                                                        showSearch
                                                                        filterOption={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                        placeholder='请选择统计粒度'
                                                                    >
                                                                        {statisticalColumnData.map((item) => {
                                                                            return (
                                                                                <Option label={item.chineseName} title={item.chineseName + ' ' + item.englishName} value={item.id} key={item.id}>
                                                                                    {item.chineseName}
                                                                                    <span style={{ marginLeft: 24, color: 'rgba(102, 102, 102, 0.8)' }}>{item.englishName}</span>
                                                                                </Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    {index !== 0 ? (
                                                                        <img
                                                                            style={{ width: 16 }}
                                                                            onClick={this.deleteStatic.bind(this, index, 'statisticalColumnList')}
                                                                            src={require('app_images/grey-delete.png')}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ),
                                                extra:
                                                    statisticalColumnList.length < 3 ? (
                                                        <div className='HControlGroup' onClick={this.addStatic.bind(this, 'statisticalColumnList')}>
                                                            <a>
                                                                <PlusOutlined />
                                                            </a>
                                                            <a>新建统计粒度</a>
                                                            <span>{statisticalColumnList.length}/3</span>
                                                        </div>
                                                    ) : null,
                                            },
                                            {
                                                label: (
                                                    <span>
                                                        <span className='numberBlock'>2</span>确定统计周期
                                                    </span>
                                                ),
                                                required: true,
                                                content: (
                                                    <div className='VControlGroup'>
                                                        {statisticalPeriodAndTimeIdList.map((item, index) => {
                                                            return (
                                                                <div className='HControlGroup'>
                                                                    <Select
                                                                        style={{ width: 230, marginRight: 8 }}
                                                                        onChange={this.changeStatistic.bind(this, index, 'statisticalPeriodAndTimeIdList')}
                                                                        value={item.key}
                                                                        showSearch
                                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                        placeholder='请选择统计周期'
                                                                    >
                                                                        {statisticalperiodList.map((item) => {
                                                                            return (
                                                                                <Option disabled={item.used == true} title={item.chineseName} value={item.id} key={item.id}>
                                                                                    {item.chineseName}
                                                                                </Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <Select style={{ width: 230 }} onChange={this.changeTime.bind(this, index)} value={item.value} placeholder='时间字段'>
                                                                        {timeFormatData.map((item) => {
                                                                            return (
                                                                                <Option value={item.id} key={item.id}>
                                                                                    {item.chineseName}
                                                                                </Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    {index !== 0 ? (
                                                                        <img
                                                                            style={{ width: 16 }}
                                                                            onClick={this.deleteStatic.bind(this, index, 'statisticalPeriodAndTimeIdList')}
                                                                            src={require('app_images/grey-delete.png')}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ),
                                                extra:
                                                    statisticalPeriodAndTimeIdList.length < 3 ? (
                                                        <div className='HControlGroup' onClick={this.addStatic.bind(this, 'statisticalPeriodAndTimeIdList')}>
                                                            <a>
                                                                <PlusOutlined />
                                                            </a>
                                                            <a>新建统计周期</a>
                                                            <span>{statisticalPeriodAndTimeIdList.length}/3</span>
                                                        </div>
                                                    ) : null,
                                            },
                                            {
                                                label: (
                                                    <span>
                                                        <span className='numberBlock'>3</span>确定业务限定
                                                    </span>
                                                ),
                                                content: (
                                                    <div className='VControlGroup'>
                                                        {businessLimitIdList.map((item, index) => {
                                                            return (
                                                                <div className='HControlGroup'>
                                                                    <Select
                                                                        showSearch
                                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                        style={{ width: 468 }}
                                                                        onChange={this.changeStatistic.bind(this, index, 'businessLimitIdList')}
                                                                        value={item.id}
                                                                        placeholder='请选择业务限定'
                                                                    >
                                                                        {indexmaList.map((item) => {
                                                                            return (
                                                                                <Option disabled={item.used == true} value={item.id} key={item.id}>
                                                                                    {item.chineseName}
                                                                                </Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    {index !== 0 ? (
                                                                        <img
                                                                            style={{ width: 16 }}
                                                                            onClick={this.deleteStatic.bind(this, index, 'businessLimitIdList')}
                                                                            src={require('app_images/grey-delete.png')}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ),
                                                extra:
                                                    businessLimitIdList.length < 3 ? (
                                                        <div className='HControlGroup' onClick={this.addStatic.bind(this, 'businessLimitIdList')}>
                                                            <a>
                                                                <PlusOutlined />
                                                            </a>
                                                            <a>新建业务限定</a>
                                                            <span>{businessLimitIdList.length}/3</span>
                                                        </div>
                                                    ) : null,
                                            },
                                        ])}
                                    </Form>
                                </Module>
                            )
                        case 1:
                            return (
                                <Module title='定义衍生指标'>
                                    <Table
                                        rowKey='id'
                                        columns={this.columns}
                                        rowClassName={(record) => (record.keyRepeat ? 'repeatColumn editable-row' : 'editable-row')}
                                        dataSource={columnData}
                                        pagination={false}
                                        scroll={{ x: 1500 }}
                                    />
                                </Module>
                            )
                        default:
                            break
                    }
                }}
                showFooterControl
                renderFooter={() => {
                    const btnCancel = <Button onClick={() => this.back()}>取消</Button>
                    switch (step) {
                        case 0:
                            return (
                                <React.Fragment>
                                    <Button loading={loading} onClick={this.nextStep} type='primary'>
                                        下一步
                                    </Button>
                                    {btnCancel}
                                </React.Fragment>
                            )
                        case 1:
                            return (
                                <React.Fragment>
                                    <Button onClick={this.prePage}>上一步</Button>
                                    <Button loading={loading} onClick={this.postData} type='primary'>
                                        保存
                                    </Button>
                                    {btnCancel}
                                </React.Fragment>
                            )
                        default:
                            break
                    }
                }}
            />
        )
    }
}
