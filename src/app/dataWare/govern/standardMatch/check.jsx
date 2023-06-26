import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import { UploadOutlined } from '@ant-design/icons'
import { Cascader, Form, Input, message, Modal, Radio, Select, Spin } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getTableDetail } from 'app_api/metadataApi'
import { executeJob, exportJobResult, getColumnStandardMatchStatistics, levelDatabase, saveJob, searchJobResult, searchJobResultCondition, tagInLevel } from 'app_api/standardApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import DataStandardBarChart from './barChart'
import './check.less'
import GaugeChart from './GaugeChart'
import PermissionWrap from '@/component/PermissionWrap'
// import './index.less'

const confirm = Modal.confirm

export default class StandardMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            modalVisible: false,
            selectedRowKeys: [],
            jobType: 1,
            status: undefined,
            keyword: '',
            tableId: undefined,
            spinLoading: false,
            chartData: {
                dwMatchStatisticsDtoList: [],
                dwNameList: [],
                jobType: 1,
                qualifiedRate: 0,
            },
            dwLevelInfos: [],
            databaseInfos: [],
            tableInfos: [],
            dwLevelId: undefined,
            databaseId: undefined,
            dwLevelIdList: [],
            btnLoading: false,
            treeData: [],
            typeIds: [],
        }
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                width: '16%',
                fixed: 'left',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                width: '16%',
                fixed: 'left',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span style={{ maxWidth: 150 }} className='LineClamp'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据表',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                width: '14%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据层级',
                dataIndex: 'dwLevelName',
                key: 'dwLevelName',
                width: '10%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '标准编码',
                dataIndex: 'stdEntityId',
                key: 'stdEntityId',
                width: '12%',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={text}>
                            <a onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: text }} />
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '标准中文名',
                dataIndex: 'stdEntityNameCn',
                key: 'stdEntityNameCn',
                width: '12%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '标准英文名',
                dataIndex: 'stdEntityNameEn',
                key: 'stdEntityNameEn',
                width: '14%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '处理意见',
                dataIndex: 'processSuggestionText',
                key: 'processSuggestionText',
                width: '12%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'statusText',
                key: 'statusText',
                width: '12%',
                fixed: 'right',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = async () => {
        await this.getChartData()
        // this.getTableList({})
        this.getFilters()
        this.getSearchCondition()
    }
    getSearchCondition = async () => {
        let res = await searchJobResultCondition()
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
            })
        }
    }
    getFilters = async () => {
        let res = await tagInLevel()
        if (res.code == 200) {
            this.setState({
                dwLevelInfos: res.data,
            })
        }
    }
    getDatabase = async () => {
        let res = await levelDatabase([this.state.dwLevelId])
        if (res.code == 200) {
            this.setState({
                databaseInfos: res.data,
            })
        }
    }
    getTable = async () => {
        let query = {
            databaseId: this.state.databaseId,
            page: 1,
            page_size: 10000,
        }
        let res = await getTableDetail(query)
        if (res.code == 200) {
            if (res.data.length) {
                await this.setState({
                    tableInfos: res.data,
                })
            }
        }
    }
    getChartData = async () => {
        this.setState({ spinLoading: true })
        let res = await getColumnStandardMatchStatistics()
        this.setState({ spinLoading: false })
        if (res.code == 200) {
            await this.setState({
                chartData: res.data,
            })

            this.gaugeChart && this.gaugeChart.setChartData(res.data.qualifiedRate)
            this.barChart && this.barChart.setChartData(res.data.dwMatchStatisticsDtoList)
        }
    }
    onView = (param) => {
        let params = {
            entityId: param['stdEntityId'],
            id: param['stdId'],
        }
        this.props.addTab('落标检核-标准-查看详情', params, true)
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            dwLevelIdList: this.state.dwLevelId ? [this.state.dwLevelId] : [],
            databaseIdList: this.state.databaseId ? [this.state.databaseId] : [],
            tableIdList: this.state.tableId ? [this.state.tableId] : [],
            statusList: this.state.status ? [this.state.status] : [],
        }
        this.setState({ loading: true })
        let res = await searchJobResult(query)
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
    startExecuteJob = async () => {
        this.setState({ btnLoading: true })
        let res = await executeJob()
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('执行成功')
            this.getTableList({})
            this.getChartData()
        }
    }
    onCancel = () => {
        this.setState({
            modalVisible: false,
            dwLevelIdList: [],
        })
    }
    openModal = () => {
        let { chartData, dwLevelIdList } = this.state
        // chartData.dwMatchStatisticsDtoList.map((item) => {
        //     dwLevelIdList.push(item.id)
        // })
        this.setState({
            modalVisible: true,
            jobType: chartData.jobType || 1,
            // dwLevelIdList
        })
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            status: undefined,
            tableId: undefined,
            databaseId: undefined,
            dwLevelId: undefined,
            databaseInfos: [],
            tableInfos: [],
            typeIds: [],
        })
        this.search()
    }
    search = () => {
        // this.getTableList()
        if (this.controller) {
            this.controller.reset()
        }
    }
    onChangeRadio = (e) => {
        this.setState({
            jobType: e.target.value,
        })
    }
    download = async () => {
        let res = await exportJobResult()
        message.info('系统准备下载')
    }
    changeStatus = async (name, e) => {
        if (name == 'dwLevelId') {
            await this.setState({
                [name]: e,
                databaseId: undefined,
                tableId: undefined,
                databaseInfos: [],
                tableInfos: [],
            })
            this.getDatabase()
        } else if (name == 'databaseId') {
            await this.setState({
                [name]: e,
                tableId: undefined,
                tableInfos: [],
            })
            this.getTable()
        } else {
            await this.setState({
                [name]: e,
            })
        }
        this.search()
    }
    postData = async () => {
        let { dwLevelIdList, dwLevelInfos } = this.state
        let query = {
            jobType: this.state.jobType,
            dwRelDtoList: [],
        }
        dwLevelInfos.map((item) => {
            dwLevelIdList.map((item1) => {
                if (item1 == item.id) {
                    query.dwRelDtoList.push({ dwLevelId: item.id, dwLevelName: item.name })
                }
            })
        })
        this.setState({ btnLoading: true })
        let res = await saveJob(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('保存成功')
            this.onCancel()
            this.getTableList({})
            this.getChartData()
        }
    }
    changeType = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { dwLevelId, databaseId, tableId } = this.state
        dwLevelId = value.length ? value[0] : undefined
        databaseId = value.length > 1 ? value[1] : undefined
        tableId = value.length > 2 ? value[2] : undefined
        await this.setState({
            typeIds: value,
            dwLevelId,
            databaseId,
            tableId,
        })
        this.search()
    }

    render() {
        const {
            tableData,
            loading,
            modalVisible,
            selectedRowKeys,
            jobType,
            chartData,
            status,
            keyword,
            tableId,
            spinLoading,
            dwLevelInfos,
            databaseInfos,
            tableInfos,
            dwLevelId,
            databaseId,
            dwLevelIdList,
            btnLoading,
            treeData,
            typeIds,
        } = this.state
        let text = ''
        if (chartData.jobType == 2) {
            text = chartData.dwNameList.join('、')
        }
        return (
            <div className='check'>
                <TableLayout
                    className='check'
                    title='落标核验'
                    disabledDefaultFooter
                    renderHeaderExtra={() => {
                        return (
                            <React.Fragment>
                                <PermissionWrap funcCode='/dtstd/mapping/check/configure'>
                                    <Button onClick={this.openModal} ghost type='primary'>
                                        配置任务
                                    </Button>
                                </PermissionWrap>
                                <PermissionWrap funcCode='/dtstd/mapping/check/execute'>
                                    <Button loading={btnLoading} onClick={this.startExecuteJob} type='primary'>
                                        执行任务
                                    </Button>
                                </PermissionWrap>
                            </React.Fragment>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <Form layout='inline' className='MiniForm'>
                                <FormItem label='上次核验时间: '>{chartData.lastExecuteTime || <EmptyLabel />}</FormItem>
                                <FormItem label='扫描范围'>{chartData.jobType == 1 ? '全局扫描' : chartData.jobType == 2 ? text : <EmptyLabel />}</FormItem>
                            </Form>
                        )
                    }}
                />
                <div className='ChartGroup'>
                    <Module title='字段落标'>
                        <Spin spinning={spinLoading}>
                            <GaugeChart
                                ref={(dom) => {
                                    this.gaugeChart = dom
                                }}
                                value={chartData.qualifiedRate}
                            />
                        </Spin>
                    </Module>
                    <Module title='数仓各层级落标情况'>
                        <Spin spinning={spinLoading}>
                            <DataStandardBarChart
                                ref={(dom) => {
                                    this.barChart = dom
                                }}
                            />
                        </Spin>
                    </Module>
                </div>
                <Module
                    title='落标详情'
                    style={{ padding: 15 }}
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/dtstd/mapping/check/export'>
                                <Button onClick={this.download} type='primary' ghost icon={<UploadOutlined />}>
                                    导出
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                >
                    <RichTableLayout
                        disabledDefaultFooter
                        smallLayout
                        tableProps={{
                            columns: this.columns,
                            extraTableProps: {
                                scroll: {
                                    x: 1400,
                                },
                            },
                        }}
                        editColumnProps={{
                            hidden: true,
                        }}
                        requestListFunction={(page, pageSize) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear onChange={this.changeKeyword} onSearch={this.search} value={keyword} placeholder='搜索关键词' />
                                    <Cascader
                                        allowClear
                                        changeOnSelect
                                        expandTrigger='hover'
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        value={typeIds}
                                        options={treeData}
                                        style={{ width: 160 }}
                                        onChange={this.changeType}
                                        displayRender={(e) => e.join('-')}
                                        popupClassName='searchCascader'
                                        placeholder='路径'
                                    />
                                    <Select allowClear value={status} onChange={this.changeStatus.bind(this, 'status')} placeholder='状态'>
                                        <Option value={1} key={1}>
                                            已落标
                                        </Option>
                                        <Option value={2} key={2}>
                                            部分落标
                                        </Option>
                                        <Option value={4} key={4}>
                                            未落标
                                        </Option>
                                    </Select>
                                    <Button onClick={this.reset} className='searchBtn'>
                                        重置
                                    </Button>
                                </React.Fragment>
                            )
                        }}
                    />
                </Module>
                <DrawerLayout
                    drawerProps={{
                        title: '配置任务',
                        visible: modalVisible,
                        onClose: this.onCancel,
                        width: 480,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} disabled={!dwLevelIdList.length && jobType == 2} onClick={this.postData} type='primary'>
                                    确定
                                </Button>
                                <Button onClick={this.onCancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible ? (
                        <Form className='EditMiniForm'>
                            <FormItem label='扫描范围'>
                                <Radio.Group onChange={this.onChangeRadio} value={jobType} style={{ padding: '10px 0' }}>
                                    <Radio style={{ display: 'block', marginBottom: '16px' }} value={1}>
                                        全局扫描
                                    </Radio>
                                    <Radio value={2}>自定义扫描</Radio>
                                </Radio.Group>
                                <Select filterOption={false} mode='multiple' value={dwLevelIdList} onChange={this.changeStatus.bind(this, 'dwLevelIdList')} placeholder='数据层级' showArrow>
                                    {dwLevelInfos.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                        </Form>
                    ) : null}
                </DrawerLayout>
            </div>
        )
    }
}
