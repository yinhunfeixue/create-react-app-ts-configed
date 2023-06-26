import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Button, Input, message, Modal, Radio, Select, Tooltip } from 'antd'
import { deleteDmTask, searchDmTask, toggleDmTaskStatus } from 'app_api/metadataApi'
import React, { Component } from 'react'
import Edit from './edit'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visibleEdit: false,
            tableData: [],
            classList: [
                { value: 0, name: 'MD5' },
                { value: 1, name: '内容掩盖' },
            ],
            keyword: '',
            status: undefined,
            modalVisible: false,
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
        }
        this.columns = [
            {
                title: '数据源',
                dataIndex: 'datasourceNameEn',
                key: 'datasourceNameEn',
                width: 170,
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseNameEns',
                key: 'databaseNameEns',
                width: 170,
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '检查结果',
                dataIndex: 'result',
                key: 'result',
                width: 140,
                render: (text, record) => {
                    switch (text) {
                        case 1:
                            return <StatusLabel message='检查中' type='loading' />
                        case 2:
                            return <StatusLabel message='检查完成' type='success' />
                        case 3:
                            return <StatusLabel message='检查失败' type='error' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                title: '表规范率',
                dataIndex: 'tablePassRate',
                key: 'tablePassRate',
                width: 110,
                render: (text) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '不规范表数',
                dataIndex: 'tableProblemNums',
                key: 'tableProblemNums',
                width: 110,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '字段规范率',
                dataIndex: 'columnPassRate',
                key: 'columnPassRate',
                width: 110,
                render: (text) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '不规范字段数',
                dataIndex: 'columnProblemNums',
                key: 'columnProblemNums',
                width: 120,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
    }
    getDetail = (data) => {
        this.props.addTab('EAST报表详情', data)
    }
    openHistoryPage = (data) => {
        this.props.addTab('历史记录', data)
    }
    openDetailPage = (data) => {
        this.props.addTab('结果详情', data)
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    stopTask = async (data, type) => {
        let res = await toggleDmTaskStatus({ taskId: data.taskId, type })
        if (res.code == 200) {
            // this.getTableList()
            this.controller.refresh()
            message.success('操作成功')
        }
    }
    deleteRule = (data) => {
        return deleteDmTask({ id: data.taskId }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openEditModal = (data) => {
        // this.props.addTab('新增检查', { title: '编辑检查', ...data })
        this.setState({ visibleEdit: true, editTitle: '编辑检查', editData: data })
    }
    openChartModal = async (data) => {
        this.dmChart.showModal(true, { taskResultId: data.taskResultId })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            resultList: this.state.status ? [this.state.status] : [],
        }
        this.setState({ loading: true })
        let res = await searchDmTask(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            status: undefined,
        })
        this.search()
    }
    changeStatus = async (e) => {
        await this.setState({
            status: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        // this.getTableList({})
        if (this.controller) {
            this.controller.reset()
        }
    }
    openAddModal = () => {
        let { ruleInfo } = this.state
        ruleInfo = { way: 1, headPosition: 0, tailPosition: 0 }
        this.setState({
            modalVisible: true,
            ruleInfo,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    openSettingPage = () => {
        this.props.addTab('检查过滤设置')
    }
    openAddPage = () => {
        // this.props.addTab('新增检查')
        this.setState({ visibleEdit: true, editTitle: '新增检查' })
    }

    render() {
        const { tableData, loading, classList, keyword, status, modalVisible, ruleInfo, visibleEdit, editTitle, editData } = this.state

        return (
            <React.Fragment>
                <RichTableLayout
                    title='规范性检查'
                    renderHeaderExtra={() => {
                        return (
                            <Button onClick={this.openAddPage} type='primary'>
                                新增
                            </Button>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear onSearch={this.search} value={keyword} onChange={this.changeKeyword} placeholder='输入数据源或数据库' />
                                <Select allowClear onChange={this.changeStatus} value={status} placeholder='检查结果'>
                                    <Option value={1} key={1}>
                                        检查中
                                    </Option>
                                    <Option value={2} key={2}>
                                        检查完成
                                    </Option>
                                    <Option value={3} key={3}>
                                        检查失败
                                    </Option>
                                </Select>
                                <Button onClick={this.reset}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteRule(rows[0])
                    }}
                    editColumnProps={{
                        width: 240,
                        createEditColumnElements: (index, record, defaultElements) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '停止',
                                    onClick: this.stopTask.bind(this, record, 2),
                                    disabled: record.result != 1,
                                },
                                {
                                    label: '检查',
                                    onClick: this.stopTask.bind(this, record, 1),
                                    disabled: record.result == 1,
                                },
                                {
                                    label: '详情',
                                    onClick: this.openDetailPage.bind(this, record),
                                },
                                {
                                    label: '编辑',
                                    onClick: this.openEditModal.bind(this, record),
                                },
                                {
                                    label: '历史',
                                    onClick: this.openHistoryPage.bind(this, record),
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {visibleEdit && (
                    <Edit
                        visible={visibleEdit}
                        onClose={() => {
                            this.setState({ visibleEdit: false })
                        }}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.search()
                        }}
                        param={{ title: editTitle, ...editData }}
                    />
                )}
            </React.Fragment>
        )
    }
}
