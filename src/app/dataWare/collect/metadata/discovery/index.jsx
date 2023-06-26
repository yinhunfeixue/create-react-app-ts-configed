import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Spin, Divider, DatePicker, Pagination, Input, Menu, Table, message, Modal, Select, Tabs } from 'antd';
import { discoverConfig, querySystemOverview, datasourceDiscover, datasourceDefine, getDatasourceById, discoverLog, getSourceList, discoverDefault, discoverExecute } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'
import ProjectUtil from '@/utils/ProjectUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import DiscoverSetDrawer from './discoverSetDrawer'
import AutoTip from '@/component/AutoTip'
import Module from '@/component/Module'
import AddDatasource from './addDiscoverDadasource'
import './index.less'

const iconDatabase = require('app_images/dataDiscover/数据库.png')
const iconTable = require('app_images/dataDiscover/表.png')
const iconDatasource = require('app_images/dataDiscover/数据源.png')
const iconColumn = require('app_images/dataDiscover/字段.png')
const iconTotal = require('app_images/dataDiscover/总量.png')

const { TabPane } = Tabs

const confirm = Modal.confirm
const { RangePicker } = DatePicker;

export default class discoveryList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnLoading: false,
            loadingOverview: false,
            datasourceInfo: {},
            recordList: [],
            recordTotal: 0,
            sqlInfo: {
                page: 1,
                pageSize: 10,
            },
            recordLoading: false,
            recordModalVisible: false,
            timeRange: [],
            dataSourceTypeMap: [],
            modalVisible: false,
            tabValue: '1',
            loading: false,
            tableData: [],
            deviationOutrangeTableCount: 0,
            missingPartitionTableCount: 0,
            partitionedTableCount: 0,
            tableId: '',
            needIgnorance: false,
            sqlContent: '',
            detailInfo: {
                edmSpecsTaskDTO: {
                    databaseIdNameList: [],
                },
                edmSpecsTaskResultDTO: {},
            },
            queryInfo: {},
            disabledFileCollect: false,
            overviewInfo: {},
            overviewList: []
        }
        this.columns = [
            {
                title: '主机名',
                dataIndex: 'pcName',
                key: 'pcName',
                align: 'left',
                width: '14%',
                render: (text) => (
                    <AutoTip content={text}>
                        <span className='LineClamp1'>{text}</span>
                    </AutoTip>
                ),
            },
            {
                title: '地址',
                dataIndex: 'ip',
                key: 'ip',
                align: 'left',
                width: '14%',
                render: (text) => (text ? <AutoTip content={text}>{text}</AutoTip> : <EmptyLabel />),
            },
            {
                title: '端口号',
                dataIndex: 'port',
                key: 'port',
                align: 'left',
                width: '12%',
                render: (text) => (text ? <AutoTip content={text}>{text}</AutoTip> : <EmptyLabel />),
            },
            {
                title: '数据类型',
                dataIndex: 'dataType',
                key: 'dataType',
                align: 'left',
                width: '12%',
                render: (text) => (text ? <AutoTip content={text}>{text}</AutoTip> : <EmptyLabel />),
            },
            {
                title: '发现时间',
                dataIndex: 'discoverTime',
                key: 'discoverTime',
                width: '20%',
                sorter: true,
                render: (text) => (text ? <span>{ProjectUtil.formDate(text)}</span> : <EmptyLabel />),
            },
            {
                title: '状态',
                dataIndex: 'discoverStatus',
                key: 'discoverStatus',
                width: '16%',
                render: (text, record) => {
                    if (text == 1) {
                        return <StatusLabel type='uncheck' message='未采集' />
                    } else if (text == 2) {
                        return <StatusLabel type='success' message='已采集' />
                    } else {
                        return <StatusLabel type='error' message='已失效' />
                    }
                },
            },
        ]
        this.recordColumns = [
            {
                title: '发现时间',
                dataIndex: 'discoverTime',
                key: 'discoverTime',
                sorter: true,
                render: (text) => (text ? <span>{text}</span> : <EmptyLabel />),
            },
            {
                title: '状态',
                dataIndex: 'executeStatus',
                key: 'executeStatus',
                render: (text, record) => {
                    if (text == 1) {
                        return <StatusLabel type='loading' message='执行中' />
                    } else if (text == 2) {
                        return <StatusLabel type='success' message='执行完成' />
                    } else {
                        return <StatusLabel type='error' message='执行失败' />
                    }
                },
            },
            {
                title: '新增',
                dataIndex: 'newCount',
                key: 'newCount',
                render: (text) => (text !== undefined ? <span style={{ color: text ? '#2D3033' : '#C4C8CC'}}>{text}</span> : <EmptyLabel />),
            },
            {
                title: '删除',
                dataIndex: 'delCount',
                key: 'delCount',
                render: (text) => (text !== undefined ? <span style={{ color: text ? '#2D3033' : '#C4C8CC'}}>{text}</span> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = () => {
        // this.getTableList({})
        this.getDatasourceTypeList()
        this.getOverview()
        this.timer = setInterval(() => {
            this.reload();
        }, 5000);
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    getOverview = async () => {
        let res = await querySystemOverview()
        if (res.code == 200) {
            let array = [
                {
                    icon: iconDatasource,
                    title: '数据源',
                    value: ProjectUtil.formatBigNumberFixed1(res.data.datasourceNum),
                },
                {
                    icon: iconDatabase,
                    title: '数据库',
                    value: ProjectUtil.formatBigNumberFixed1(res.data.databaseNum),
                },
                {
                    icon: iconTable,
                    title: '数据表',
                    value: ProjectUtil.formatBigNumberFixed1(res.data.tableNum),
                },
                {
                    icon: iconColumn,
                    title: '字段数量',
                    value: ProjectUtil.formatBigNumberFixed1(res.data.columnNum),
                },
                {
                    icon: iconTotal,
                    title: '总记录数',
                    value: ProjectUtil.formatBigNumberFixed1(res.data.rowsNum),
                },
            ]
            this.setState({
                overviewInfo: res.data,
                overviewList: array
            })
        }
    }
    openResultModal = async () => {
        let { sqlInfo } = this.state
        sqlInfo = {
            page: 1,
            pageSize: 10,
            desc: true,
        }
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
        this.setState({
            recordModalVisible: true,
        })
    }
    getRecordList = async (params = {}) => {
        let { sqlInfo } = this.state
        let query = {
            ...sqlInfo,
        }
        this.setState({ recordLoading: true })
        let res = await discoverLog(query)
        this.setState({ recordLoading: false })
        if (res.code == 200) {
            this.setState({
                recordList: res.data,
                recordTotal: res.total,
            })
        }
    }
    changeRecordTable = async (pagination, filters, sorter) => {
        let { sqlInfo } = this.state
        sqlInfo.desc = sorter.field == 'discoverTime' ? (sorter.order == 'ascend' ? false : true) : true
        await this.setState({
            sqlInfo
        })
        this.getRecordList()
    }
    getDatasourceTypeList = async () => {
        let { dataSourceTypeMap } = this.state
        let res = await datasourceDefine()
        if (res.code == 200) {
            dataSourceTypeMap = []
            let hasRepeat = false
            res.data.map((item) => {
                item.appDatasourceDefineConfigList.map((config) => {
                    hasRepeat = false
                    if (dataSourceTypeMap.length) {
                        dataSourceTypeMap.map((node) => {
                            if (node.dbName == config.dbName) {
                                hasRepeat = true
                            }
                        })
                        if (!hasRepeat) {
                            dataSourceTypeMap.push(config)
                        }
                    } else {
                        dataSourceTypeMap.push(config)
                    }
                })
            })
            this.setState({
                dataSourceTypeMap,
            })
        }
    }
    openDetailPage = (data) => {
      getSourceList({
          id: data.mapDatasourceId,
          paginationDisplay: 'block',
          brief: false,
          more: true
      }).then(res => {
            if (res.code == 200) {
              if (res.data.length) {
                this.props.addTab('数据源发现-数据源详情', { ...res.data[0], type: 'look' })
              }
            } else {
                // message.error(res.msg)
            }
        })
    }
    openEditPage = async (data) => {
        this.addDatasource&&this.addDatasource.openModal(data)
    }
    changeRecordPage = async (page, pageSize) => {
        let { sqlInfo } = this.state
        sqlInfo.page = page
        sqlInfo.pageSize = pageSize
        await this.setState({
            sqlInfo,
        })
        this.getRecordList()
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            descFlag: params.sorter.field == 'discoverTime' ? (params.sorter.order == 'ascend' ? false : params.sorter.order == 'descend' ? true : true) : true,
        }
        this.setState({ loading: true })
        let res = await datasourceDiscover(query)
        if (res.code == 200) {
            let param = {
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
        }
        this.setState({ loading: false })
        return {
            dataSource: res.data,
            total: res.total,
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reset = async () => {
        await this.setState({
            queryInfo: {},
            timeRange: []
        })
        this.search()
    }
    onChangePicker = async (dates, dateStrings) => {
        console.log(dateStrings)
        let { queryInfo } = this.state
        queryInfo.startTime = dateStrings[0]
        queryInfo.endTime = dateStrings[1]
        await this.setState({
            timeRange: dates,
            queryInfo
        })
        this.search()
    }
    changeSelect = async (name, value) => {
        let { queryInfo } = this.state
        queryInfo[name] = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    cancel = () => {
        this.setState({
            recordModalVisible: false
        })
    }
    openSetModal = () => {
        this.discoverSetDrawer&&this.discoverSetDrawer.openModal()
    }
    reload = () => {
        if (this.controller) {
            this.controller.refresh()
        }
        // this.getOverview()
    }
    execute = async () => {
        this.setState({btnLoading: true})
        let res = await discoverConfig()
        this.setState({btnLoading: false})
        if (res.code == 200) {
            if (!res.data.addConfigFlag) {
                message.warning('请先补充数据源发现配置')
                return
            }
            if (!res.data.enableFlag) {
                message.warning('未开启数据源发现，请修改配置')
                return
            }
            this.setState({btnLoading: true})
            discoverExecute().then(resp => {
                this.setState({btnLoading: false})
                if (resp.code == 200) {
                    this.reload()
                    message.success('执行成功')
                } else {
                    // message.error(resp.msg)
                }
            })
        } else {
            // message.error(res.msg)
        }
    }
    render() {
        const { btnLoading, loadingOverview, overviewList, dataSourceTypeMap, timeRange, recordModalVisible, recordTotal, sqlInfo, recordLoading, recordList, tableData, loading, modalVisible, detailInfo, sqlContent, tabValue, queryInfo, disabledFileCollect, visibleDirectory, directoryParam } = this.state
        const renderCard = (data) => {
            const { icon, title, value, unit = '个' } = data
            return (
                <div className='OverviewCard'>
                    <img src={icon} />
                    <main>
                        <h5>{title}</h5>
                        <div>
                            <em>{value}</em>
                            <span>{title == '总记录数' ? '行' : '个'}</span>
                        </div>
                    </main>
                </div>
            )
        }
        return (
            <React.Fragment>
                <TableLayout
                    title='数据源发现'
                    className='discoverList'
                    disabledDefaultFooter
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/lineage/collect/task/manage/collect'>
                                <div>
                                    <Button onClick={this.openResultModal} style={{ padding: '0px' }} type="link">执行记录</Button>
                                    <Divider style={{ margin: '0 16px' }} type='vertical' />
                                    <Button.Group>
                                        <Button loading={btnLoading} onClick={this.execute} type="primary">立即执行</Button>
                                        <Button onClick={this.openSetModal} type="primary">
                                            <span className='iconfont icon-shezhi' style={{ color: '#fff' }}></span>
                                        </Button>
                                    </Button.Group>
                                </div>
                            </PermissionWrap>
                        );
                    }}
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Module title='数据概览'>
                                    <Spin spinning={loadingOverview}>
                                        <div className='OverviewGroup'>
                                            {overviewList.map((item, index) => {
                                                return <React.Fragment key={index}>{renderCard(item)}</React.Fragment>
                                            })}
                                        </div>
                                    </Spin>
                                </Module>
                            </React.Fragment>
                        )
                    }}
                />
                <div className="discoverList">
                    <Module title='数据源列表' className="discoverItem" style={{ marginTop: 16, background: 'none', padding: 0 }}>
                        <RichTableLayout
                            smallLayout
                            renderSearch={(controller) => {
                                this.controller = controller
                                return (
                                    <React.Fragment>
                                        <Select allowClear placeholder='数据类型' value={queryInfo.dataType} onChange={this.changeSelect.bind(this, 'dataType')}>
                                            {dataSourceTypeMap.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.dbViewName}>
                                                        {item.dbName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <Select placeholder='状态' allowClear value={queryInfo.discoverStatus} onChange={this.changeSelect.bind(this, 'discoverStatus')}>
                                            <Option value={1} key={1}>
                                                未采集
                                            </Option>
                                            <Option value={2} key={2}>
                                                已采集
                                            </Option>
                                            <Option value={3} key={3}>
                                                已失效
                                            </Option>
                                        </Select>
                                        <RangePicker style={{ width: 280 }} value={timeRange} allowClear={true} separator='-' onChange={this.onChangePicker} />
                                        <Button onClick={this.reset} className='searchBtn'>
                                            重置
                                        </Button>
                                    </React.Fragment>
                                )
                            }}
                            requestListFunction={(page, pageSize, filter, sorter) => {
                                return this.getTableList({
                                    pagination: {
                                        page,
                                        page_size: pageSize,
                                    },
                                    sorter: sorter || {}
                                })
                            }}
                            tableProps={{
                                columns: this.columns,
                            }}
                            editColumnProps={{
                                width: '16%',
                                createEditColumnElements: (_, record) => {
                                    let array = []
                                    if (record.discoverStatus == 1) {
                                        array = [
                                            <a
                                                onClick={this.openEditPage.bind(
                                                    this,
                                                    record
                                                )}
                                                key='edit'
                                            >
                                                创建数据源
                                            </a>,
                                        ]
                                    } else {
                                        array = [
                                            <a
                                                onClick={this.openDetailPage.bind(
                                                    this,
                                                    record
                                                )}
                                                key='edit'
                                                disabled={record.discoverStatus == 3}
                                            >
                                                数据源详情
                                            </a>,
                                        ]
                                    }
                                    return array
                                },
                            }}
                        />
                    </Module>
                </div>
                <DrawerLayout
                    drawerProps={{
                        className: 'recordDrawer',
                        title: '数据源发现记录',
                        width: 640,
                        visible: recordModalVisible,
                        onClose: this.cancel,
                        maskClosable: true,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Pagination
                                    // showSizeChanger={true}
                                    showQuickJumper={true}
                                    onChange={this.changeRecordPage}
                                    showTotal={(total) => `总数 ${total} 条`}
                                    current={sqlInfo.page}
                                    pageSize={sqlInfo.pageSize}
                                    total={recordTotal}
                                />
                            </React.Fragment>
                        )
                    }}
                >
                    {recordModalVisible && (
                        <React.Fragment>
                            <TableLayout
                                disabledDefaultFooter
                                renderDetail={() => {
                                    return (
                                        <React.Fragment>
                                            <Table onChange={this.changeRecordTable} rowKey='id' loading={recordLoading} columns={this.recordColumns} dataSource={recordList} pagination={false} />
                                        </React.Fragment>
                                    )
                                }}
                            />
                        </React.Fragment>
                    )}
                </DrawerLayout>
                <DiscoverSetDrawer refresh={this.reload} ref={(dom) => this.discoverSetDrawer = dom} />
                <AddDatasource refresh={this.reload} ref={(dom) => this.addDatasource = dom}/>
            </React.Fragment>
        );
    }
}
