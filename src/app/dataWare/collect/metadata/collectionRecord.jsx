import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { Modal, Select, Tabs, message } from 'antd'
import { PanelContainer } from 'app_common'
import CONSTANTS from 'app_constants'
import GeneralTable from 'app_page/dama/component/generalTable'
import { Button, Tooltip } from 'lz_antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Component } from 'react'
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
                dataIndex: 'key',
                key: 'key',
                title: '序号',
                width: 48,
            },
            {
                dataIndex: 'businessName',
                key: 'businessName',
                title: '数据源',
                minWidth: 120,
                render: (text) => (
                    <span>
                        <Tooltip title={text}>{text}</Tooltip>
                    </span>
                ),
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '任务类型',
                width: 100,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: '执行结果',
                className: 'lastStatusSpan',
                width: 100,
                render: (text, record, index) => {
                    if (record.status == '2') {
                        return (
                            <span>
                                <img src={require('app_images/progress.png')} /> 正在执行
                            </span>
                        )
                    } else if (record.status == '3') {
                        return (
                            <span
                                style={{
                                    color: '#6CB324',
                                }}
                            >
                                <CheckCircleFilled style={{ color: '#6CB324' }} /> 执行成功
                            </span>
                        )
                    } else if (record.status == '4') {
                        return (
                            <span
                                style={{
                                    color: '#F23F30',
                                }}
                            >
                                <CloseCircleFilled style={{ color: '#F23F30' }} /> 执行失败
                            </span>
                        )
                    } else if (record.status == '1') {
                        return (
                            <span
                                style={{
                                    color: '#B3B3B3',
                                }}
                            >
                                <InfoCircleFilled
                                    style={{
                                        color: '#B3B3B3',
                                    }}
                                />{' '}
                                等待执行
                            </span>
                        )
                    } else if (record.status == '5') {
                        return (
                            <span style={{ color: '#F27900' }}>
                                <img src={'..' + CONSTANTS.APP_BASE_URL + '/resources/images/stop.png'} /> 执行终止
                            </span>
                        )
                    }
                },
            },
            {
                dataIndex: 'type',
                key: 'type',
                title: '采集方式',
                // width: '10%',
                render: (text, record, index) => {
                    if (record.type == '1') {
                        return '自动采集'
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
                render: (text) => (text !== undefined ? <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tooltip> : '- -'),
            },
            {
                dataIndex: 'finishTime',
                key: 'finishTime',
                title: '结束时间',
                width: 150,
                render: (text) => (text !== undefined ? <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tooltip> : '- -'),
            },
            {
                dataIndex: 'useTime',
                key: 'useTime',
                title: '耗时',
                width: 120,
                render: (text) => <Tooltip title={this.getUseTime(text)}>{this.getUseTime(text)}</Tooltip>,
            },
            {
                dataIndex: 'action',
                key: 'action',
                title: '操作',
                width: 60,
                render: (text, record, index) => {
                    let btn = ''
                    btn = (
                        <Tooltip authId='log:autocollect:view' title='查看日志'>
                            <img
                                style={{
                                    width: '24px',
                                    background: '#e6f7ff',
                                    borderRadius: '50%',
                                    marginRight: '4px',
                                }}
                                onClick={(e) => this.recordDetail(e, index, record)}
                                src={require('app_images/preview.png')}
                            />
                        </Tooltip>
                    )
                    return btn
                },
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
                {/* <Button onClick={this.cancelTask}>取消任务</Button> */}
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

    async componentDidMount() {
        const { area } = this.props.location.state
        console.log(area, '--------area-----area--------')
        store.area = area

        store.resetCondition()

        await store.getDataSourceData()
        if (this.props.location.state.from == 'autoCollection') {
            store.datasourceIdChange(this.props.location.state.businessId)
            store.extractTypeChange(this.props.location.state.taskSubType)
            store.getTaskJobId(this.props.location.state.id)
        }
        store.getTableData()
    }

    getUseTime = (value) => {
        if (value) {
            let _seconds = Math.floor(value / 1000)
            let hours, mins, seconds, milliseconds
            let result = ''
            milliseconds = value % 1000
            milliseconds = milliseconds.toString().substring(0, 3)
            console.log(milliseconds)
            seconds = parseInt(_seconds % 60)
            mins = parseInt((_seconds % 3600) / 60)
            hours = parseInt(_seconds / 3600)
            if (mins < 10) {
                mins = '0' + mins
            }
            if (hours < 10) {
                hours = '0' + hours
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            if (milliseconds < 100) {
                if (milliseconds < 10) {
                    milliseconds = '00' + milliseconds
                } else {
                    milliseconds = '0' + milliseconds
                }
            }

            if (hours) result = hours + ':' + mins + ':' + seconds + ':' + milliseconds
            else result = '00:' + mins + ':' + seconds + ':' + milliseconds
            return result
        } else {
            return '- -'
        }
    }

    // flag请求日志接口
    recordDetail = (e, index, record, flag) => {
        console.log('---recordDetail-----')
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

    render() {
        // 这里注释的 不要去掉 去掉的话子组件里的store不会生效
        const { tableLoading, tableData, searchCondition, pagination, getTableData, sourceData } = store
        const { activeKey } = this.state
        const pageInfo = {
            page: pagination.pageNo,
            page_size: pagination.pageSize,
            total: pagination.total,
            paginationDisplay: pagination.paginationDisplay,
        }

        return (
            <div className='main-content-background source_container collectionRecord' style={{ marginLeft: 8, marginRight: 0, marginTop: 16 }}>
                {this.props.location.state.area !== 'metadata' ? (
                    <HandCollectionRecord param={this.props.location.state} />
                ) : (
                    <Tabs activeKey={activeKey} onChange={this.changeTab} className='collectionRecordTab'>
                        {this.props.location.state.area == 'metadata' ? (
                            <TabPane tab='自动采集' key='1' style={{ paddingTop: '24px' }}>
                                <div
                                    className='search_condition datasourceTermRight'
                                    style={{
                                        right: '0px',
                                        marginBottom: '16px',
                                    }}
                                >
                                    {/*<InputClose size='default' placeholder='请输入任务名称' className='datasourceInput' value={searchCondition.keyword} handleInputChange={store.keywordChange} />*/}

                                    <Select
                                        value={searchCondition.subType || undefined}
                                        allowClear
                                        className='datasourceSelect'
                                        onChange={store.extractTypeChange}
                                        placeholder='请选择任务类型'
                                        style={{ marginRight: '8px' }}
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
                                        placeholder='请选择执行结果'
                                        style={{ marginRight: '8px' }}
                                    >
                                        {_.map(taskStatusMap, (node, index) => {
                                            return (
                                                <Option key={index} value={index}>
                                                    {node}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select
                                        allowClear
                                        style={{ marginRight: '8px' }}
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
                                    {/*<Button style={{ marginRight: '8px' }} type='primary' className='datasourceBtn' onClick={this.searchTableData}>搜索</Button>*/}

                                    <Button onClick={store.resetAndSearch}>重置</Button>
                                </div>
                                <PanelContainer hasFilter={this.filter}>
                                    <GeneralTable
                                        tableProps={{
                                            tableData: tableData || [],
                                            columns: this.columns,
                                            rowKey: 'id',
                                            tableLoading,
                                            rowSelection: this.rowSelection,
                                        }}
                                        paginationProps={{
                                            pagination: pageInfo,
                                            getTableData,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                        }}
                                    />
                                </PanelContainer>
                            </TabPane>
                        ) : null}
                        <TabPane tab='模板采集' key='2'>
                            <HandCollectionRecord param={this.props.location.state} />
                        </TabPane>
                    </Tabs>
                )}

                <CollectionRecordList selectRowFlag={this.selectRowFlag} />
            </div>
        )
    }
}
