import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { message, Modal, Select, Tabs } from 'antd'
import { postDeleteTask } from 'app_api/metadataApi'
import { Button, Tooltip } from 'lz_antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import CollectionRecordList from './collectionRecordList'
import HandCollectionRecord from './handCollectionRecord'
import store from './store'

const Option = Select.Option
const TabPane = Tabs.TabPane

const taskStatusMap = {
    1: '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    5: '执行终止',
}
const taskSubTypeMap = [
    { key: 100, value: '报表采集' },
    { key: 101, value: '库表、主键采集' },
    { key: 102, value: '外键、关联、索引采集' },
    { key: 103, value: '存储过程采集' },
    { key: 104, value: 'DDL采集' },
    { key: 105, value: '存储空间采集' },
    { key: 106, value: '数据抽样采集' },
    { key: 111, value: '代码、码值采集' },
]

@observer
export default class CollectionRecord extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        let activeKey = '1'
        if (this.props.location.state.from == 'autoCollection') {
            activeKey = '1'
        } else if (this.props.location.state.from == 'handCollection') {
            activeKey = '2'
        }
        this.state = {
            activeKey: activeKey,
        }

        this.hasSim = this.props.location.state.hasSim
        this.columns = [
            {
                dataIndex: 'businessName',
                key: 'businessName',
                title: '数据源',
                width: 200,
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '任务类型',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: '执行结果',
                className: 'lastStatusSpan',
                width: 140,
                render: (text, record, index) => {
                    switch (record.status) {
                        case 1:
                            return <StatusLabel message='等待执行' type='info' />
                        case 2:
                            return <StatusLabel message='正在执行' type='loading' />
                        case 3:
                            return <StatusLabel message='执行成功' type='success' />
                        case 4:
                            return <StatusLabel message='执行失败' type='error' />
                        case 5:
                            return <StatusLabel message='执行终止' type='warning' />
                        default:
                            return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'type',
                key: 'type',
                title: '采集方式',
                width: 140,
                render: (text, record, index) => {
                    if (record.type == '1' || record.type == '10') {
                        return '采集任务'
                    } else {
                        return '模板采集'
                    }
                },
            },
            {
                dataIndex: 'startTime',
                key: 'startTime',
                title: '起始时间',
                width: 150,
                render: (text) =>
                    text !== undefined ? (
                        <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>
                            <span className='LineClamp1'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'useTime',
                key: 'useTime',
                title: '耗时',
                width: 140,
                render: (text) => <Tooltip title={this.getUseTime(text)}>{this.getUseTime(text)}</Tooltip>,
            },
        ]

        this.filter = (
            <div className='top_filter'>
                <Button
                    authId={
                        this.props.location.state && this.props.location.state.authIds && this.props.location.state.authIds.collectionRecordDeleteId
                            ? this.props.location.state.authIds.collectionRecordDeleteId
                            : null
                    }
                    className='changeBtn'
                    onClick={this.onCancel}
                >
                    删除
                </Button>
            </div>
        )
        this.selectedRows = [] // 表格里选择的项
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                store.onSelectChange(selectedRowKeys, selectedRows)
            },
            type: 'checkbox',
        }
        this.selectRowFlag = undefined
    }

    async componentWillMount() {
        const { area } = this.props.location.state
        store.area = area
        await store.getDataSourceData()
        await this.resetCondition()
        this.setState({ inited: true })
    }

    async resetCondition() {
        await store.resetCondition()
        if (this.props.location.state.from == 'autoCollection') {
            store.datasourceIdChange(this.props.location.state.businessId, false)
            store.extractTypeChange(this.props.location.state.taskSubType, false)
            store.getTaskJobId(this.props.location.state.id)
        }
    }

    getUseTime = (value) => {
        if (value) {
            if (value < 1000) {
                return value + 'ms'
            }
            let _seconds = Math.floor(value / 1000)
            let hours, mins, seconds, milliseconds
            let result = ''
            milliseconds = value % 1000
            milliseconds = milliseconds.toString().substring(0, 3)
            console.log(milliseconds)
            seconds = parseInt(_seconds % 60)
            mins = parseInt((_seconds % 3600) / 60)
            hours = parseInt(_seconds / 3600)
            // if (mins < 10) {
            //     mins = '0' + mins
            // }
            // if (hours < 10) {
            //     hours = '0' + hours
            // }
            // if (seconds < 10) {
            //     seconds = '0' + seconds
            // }
            if (milliseconds < 100) {
                if (milliseconds < 10) {
                    milliseconds = '00' + milliseconds
                } else {
                    milliseconds = '0' + milliseconds
                }
            }

            if (hours) result = hours + '时' + mins + '分' + (seconds ? seconds + '秒' : '')
            else if (mins) result = mins + '分' + (seconds ? seconds + '秒' : '')
            else result = seconds + '秒'
            return result
        } else {
            return <EmptyLabel />
        }
    }

    // flag请求日志接口
    recordDetail = (e, index, record, flag) => {
        e.stopPropagation()
        store.resetRecordData()
        store.setLogId(record.id)
        store.showModal()
        store.showLoading()
        store.recordStatus = record.status
        store.getExtractLog(1, 10, flag)
        this.selectRowFlag = flag
    }

    onCancel = () => {
        if (store.selectedRows.slice().length == 0) {
            message.warning('请选择要删除的项！')
        } else {
            this.deleteCofirm()
        }
    }

    deleteCofirm = () => {
        Modal.confirm({
            title: '确定删除您当前选择的项吗？',
            // content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                store.delExtractorJobData()
            },
        })
    }

    searchTableData = () => {
        store.searchTableData({ page: 1 })
    }
    changeTab = (value) => {
        this.setState({
            activeKey: value,
        })
    }

    deleteRecords(keys) {
        return postDeleteTask({ ids: keys }).then((res) => {
            message.success(res.msg)
        })
    }

    render() {
        // 这里注释的 不要去掉 去掉的话子组件里的store不会生效
        const { tableLoading, tableData, searchCondition, pagination, getTableData, sourceData } = store
        const { activeKey, inited } = this.state
        if (!inited) {
            return null
        }
        const pageInfo = {
            page: pagination.pageNo,
            page_size: pagination.pageSize,
            total: pagination.total,
            paginationDisplay: pagination.paginationDisplay,
        }
        return (
            <TableLayout
                title='采集日志'
                renderDetail={() => {
                    return (
                        <React.Fragment>
                            {this.props.location.state.area !== 'metadata' ? (
                                <HandCollectionRecord param={this.props.location.state} />
                            ) : (
                                <Tabs activeKey={activeKey} onChange={this.changeTab} className='collectionRecordTab' animated={false}>
                                    {this.props.location.state.area == 'metadata' ? (
                                        <TabPane tab='采集任务' key='1'>
                                            <RichTableLayout
                                                disabledDefaultFooter
                                                smallLayout
                                                renderSearch={(controller) => {
                                                    store.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Select
                                                                allowClear
                                                                style={{ width: 280 }}
                                                                showSearch={true}
                                                                className='datasourceSelect'
                                                                value={searchCondition.businessId}
                                                                onChange={store.datasourceIdChange}
                                                                optionFilterProp='children'
                                                                filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                placeholder='数据源名称'
                                                            >
                                                                {sourceData.map((d) => (
                                                                    <Option key={d.id} value={d.id}>
                                                                        <Tooltip title={d.dsName}>{d.dsName}</Tooltip>
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                            <Select
                                                                value={searchCondition.subType || undefined}
                                                                allowClear
                                                                className='datasourceSelect'
                                                                onChange={store.extractTypeChange}
                                                                placeholder='任务类型'
                                                            >
                                                                {taskSubTypeMap.map((item, index) => {
                                                                    return (
                                                                        <Option key={index} value={item.key}>
                                                                            <Tooltip title={item.value}>{item.value}</Tooltip>
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                value={searchCondition.status || undefined}
                                                                allowClear
                                                                className='datasourceSelect'
                                                                onChange={store.statusChange}
                                                                placeholder='执行结果'
                                                            >
                                                                {_.map(taskStatusMap, (node, index) => {
                                                                    return (
                                                                        <Option key={index} value={index}>
                                                                            {node}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>

                                                            <Button
                                                                onClick={() => {
                                                                    store.resetCondition()
                                                                    // store.getTaskJobId(this.props.location.state.id)
                                                                    store.searchTableData()
                                                                }}
                                                            >
                                                                重置
                                                            </Button>
                                                        </React.Fragment>
                                                    )
                                                }}
                                                requestListFunction={(page, pageSize) => {
                                                    return store.getTableData({
                                                        page,
                                                        page_size: pageSize,
                                                    })
                                                }}
                                                tableProps={{
                                                    columns: this.columns,
                                                }}
                                                editColumnProps={{
                                                    createEditColumnElements: (index, record, defaultElements) => {
                                                        return RichTableLayout.renderEditElements([
                                                            {
                                                                label: '日志',
                                                                onClick: (e) => this.recordDetail(e, index, record),
                                                            },
                                                        ]).concat(defaultElements)
                                                    },
                                                }}
                                            />
                                        </TabPane>
                                    ) : null}
                                    <TabPane tab='模板采集' key='2'>
                                        <HandCollectionRecord param={this.props.location.state} />
                                    </TabPane>
                                </Tabs>
                            )}
                            <CollectionRecordList selectRowFlag={this.selectRowFlag} />
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
