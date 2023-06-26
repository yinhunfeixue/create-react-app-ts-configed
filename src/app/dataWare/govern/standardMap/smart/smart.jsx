import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import TipLabel from '@/component/tipLabel/TipLabel'
import { EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Input, message, Modal, Popover, Radio, Select, Table, Tabs } from 'antd'
import { clusterConfirm, clusterStatistic, dwappClusterStatistic, getStandardList, standardCluster } from 'app_api/standardApi'
import { LzTable } from 'app_component'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import ColumnDrawer from './columnDrawer'
import PermissionWrap from '@/component/PermissionWrap'

import './smart.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm
const TabPane = Tabs.TabPane

const tagList = [
    { value: 0, name: '备注' },
    { value: 1, name: '备注参考' },
    { value: 2, name: '备注参考1' },
    { value: 2, name: '备注参考2' },
    { value: 2, name: '备注参考3' },
    { value: 2, name: '备注参考4' },
]

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            classList: [
                { value: 0, name: 'MD5' },
                { value: 1, name: '内容掩盖' },
            ],
            keyword: '',
            standardStatus: undefined,
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
            type: 'edit',
            selectedRowKeys: [],
            columnDrawer: false,
            tableInfo: {},
            searchParam: {},
            standardModal: false,
            standardTableData: [],
            selectedRadio: '',

            statisticInfo: {
                standardProportion: 0,
                mappedCount: 0,
                totalCount: 0,
            },
            confirmProportion: 0,
            clusterInfo: undefined,
            showSearchResult: false,
            entityName: '',
            tabValue: '0',
            modalTitle: '添加映射标准',
        }
        this.standardTableColumn = [
            {
                title: '标准编码',
                dataIndex: 'entityId',
                key: 'entityId',
                render: (text, record) => (text ? <a onClick={this.onView.bind(this, record)}>{text}</a> : <EmptyLabel />),
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                width: 100,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '标准英文名',
                dataIndex: 'entityName',
                key: 'entityName',
                width: 100,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.columns = [
            {
                title: '簇ID',
                dataIndex: 'code',
                key: 'code',
                width: 150,
                render: (text) => (
                    <Tooltip title={text}>
                        {' '}
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: <TipLabel label='簇中文名' tip='系统推荐的名字' />,
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 160,
                render: (text, record) => {
                    if (text) {
                        return (
                            <Tooltip placement='leftTop' title={text}>
                                <span className='LineClamp' style={{ color: !record.confirm ? '#b3b3b3' : '#333', marginLeft: '0px', fontFamily: 'PingFangSC-Regular, PingFang SC' }}>
                                    {!record.confirm ? <span style={{ marginLeft: '0px' }} className='dot'></span> : null}
                                    <span className='spanText'>{text}</span>
                                </span>
                            </Tooltip>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: <TipLabel label='簇英文名' tip='系统推荐的名字' />,
                dataIndex: 'englishName',
                key: 'englishName',
                width: 180,
                render: (text, record) => {
                    if (text) {
                        return (
                            <Tooltip placement='leftTop' title={text}>
                                <span className='spanTip' style={{ color: !record.confirm ? '#b3b3b3' : '#333', marginLeft: '0px', fontFamily: 'PingFangSC-Regular, PingFang SC' }}>
                                    {!record.confirm ? <span style={{ marginLeft: '0px' }} className='dot'></span> : null}
                                    <span className='spanText'>{text}</span>
                                </span>
                            </Tooltip>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '包含字段数',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: 120,
                className: 'statusContent',
                render: (text, record) => (text ? <a onClick={this.openColumnDetail.bind(this, record)}>{text}</a> : text),
            },
            {
                title: '映射标准',
                dataIndex: 'standardStatus',
                key: 'standardStatus',
                width: 250,
                className: 'tagColumn',
                ellipsis: false,
                render: (text, record, index) => {
                    if (text == 0) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className='HControlGroup'>
                                    {record.standardList &&
                                        record.standardList.map((item) => {
                                            return (
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>标准编码：</span>
                                                                <span onClick={this.onView.bind(this, item)} className='standardTooltip' style={{ color: '#1890ff', cursor: 'pointer' }}>
                                                                    {item.entityId}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span>标准中文名：</span>
                                                                <span className='standardTooltip'>{item.entityDesc || <EmptyLabel />}</span>
                                                            </div>
                                                            <div>
                                                                <span>标准英文名：</span>
                                                                <span className='standardTooltip'>{item.entityName || <EmptyLabel />}</span>
                                                            </div>
                                                            <div>
                                                                <span>业务定义：</span>
                                                                <span className='standardTooltip'>{item.businessDefinition || <EmptyLabel />}</span>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <div onClick={this.selectedTag.bind(this, index, item)} className={record.selectedTag == item.id ? 'tagItem selectedTagItem' : 'tagItem'}>
                                                        {item.entityDesc}
                                                    </div>
                                                </Popover>
                                            )
                                        })}
                                </div>
                                <PermissionWrap funcCode='/dtstd/mapping/auto/add'>
                                    <a onClick={this.openEditModal.bind(this, record)}>
                                        <EditOutlined />
                                    </a>
                                </PermissionWrap>
                            </div>
                        )
                    } else if (text == 1) {
                        return (
                            <span style={{ color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                暂无推荐，请点击更多或考虑升标
                                <PermissionWrap funcCode='/dtstd/mapping/auto/add'>
                                    <a onClick={this.openEditModal.bind(this, record)}>
                                        <EditOutlined />
                                    </a>
                                </PermissionWrap>
                            </span>
                        )
                    } else if (text == 2) {
                        return (
                            <Popover
                                placement='topLeft'
                                content={
                                    <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                        <div>
                                            <span>标准编码：</span>
                                            <span onClick={this.onView.bind(this, record.standardInfo)} className='standardTooltip' style={{ color: '#1890ff', cursor: 'pointer' }}>
                                                {record.standardInfo ? record.standardInfo.entityId : <EmptyLabel />}
                                            </span>
                                        </div>
                                        <div>
                                            <span>标准中文名：</span>
                                            <span className='standardTooltip'>{record.standardInfo ? record.standardInfo.entityDesc : <EmptyLabel />}</span>
                                        </div>
                                        <div>
                                            <span>标准英文名：</span>
                                            <span className='standardTooltip'>{record.standardInfo ? record.standardInfo.entityName : <EmptyLabel />}</span>
                                        </div>
                                        <div>
                                            <span>业务定义：</span>
                                            <span className='standardTooltip'>{record.standardInfo ? record.standardInfo.businessDefinition : <EmptyLabel />}</span>
                                        </div>
                                    </div>
                                }
                            >
                                <span>{record.standardInfo ? record.standardInfo.entityDesc : <EmptyLabel />}</span>
                            </Popover>
                        )
                    }
                },
            },
            /* {
                title: '状态',
                dataIndex: 'standardStatus',
                key: 'standardStatus',
                width: 120,
                render: (text) => {
                    switch (text) {
                        case 0:
                            return <StatusLabel type='warning' message='未映射' />
                        case 1:
                            return <StatusLabel type='info' message='无映射' />
                        case 2:
                            return <StatusLabel type='success' message='已映射' />
                        default:
                            return <EmptyLabel />
                    }
                },
            }, */
            // {
            //     title: '操作',
            //     dataIndex: 'standardStatus',
            //     key: 'standardStatus',
            //     width: 60,
            //     render: (text, record, index) => {
            //         return (
            //             <div>
            //                 {text == 2 ? (
            //                     <Tooltip title='修改'>
            //                         <Icon className='editIcon' onClick={this.openEditModal.bind(this, record)} type='edit' />
            //                     </Tooltip>
            //                 ) : null}
            //                 {text == 0 ? (
            //                     <Tooltip title='确认'>
            //                         <Icon className='editIcon' onClick={this.confirmData.bind(this, record)} type='check' />
            //                     </Tooltip>
            //                 ) : null}
            //                 {text == 1 ? <EmptyLabel /> : null}
            //             </div>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getStatistic()
    }
    openColumnDetail = async (data) => {
        await this.setState({
            clusterInfo: data,
            visibleColumnDetail: true,
        })
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    onView = (params) => {
        this.cancel()
        this.props.addTab('标准详情', params, true)
    }
    selectedTag = (index, data) => {
        let { tableInfo, searchParam } = this.state
        tableInfo.data[index].selectedTag = data.id
        this.setState({ tableInfo })
        this.lzTableDom && this.lzTableDom.setTableData(tableInfo, searchParam)
    }
    openEditModal = (data) => {
        let { tableInfo, searchParam } = this.state
        this.setState({
            standardModal: true,
            showSearchResult: false,
            selectedRadio: data.selectedTag ? [data.selectedTag] : [],
            standardTableData: data.standardList,
            clusterInfo: data,
            entityName: '',
            tabValue: data.standardStatus == 2 ? '0' : '1',
            modalTitle: data.standardStatus == 2 ? '修改映射标准' : '添加映射标准',
        })
    }
    getStatistic = async () => {
        let res = await clusterStatistic()
        if (res.code == 200) {
            this.setState({
                statisticInfo: res.data,
            })
        }
        let res1 = await dwappClusterStatistic()
        if (res1.code == 200) {
            this.setState({
                confirmProportion: res1.data.confirmProportion,
            })
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            //standardStatus: this.state.standardStatus,
            keyword: this.state.keyword,
            //entityStatus: 1
        }
        this.setState({ loading: true })
        let res = await standardCluster(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            res.data.map((item) => {
                item.standardList = item.standardList ? item.standardList : []
                if (item.standardList.length) {
                    item.selectedTag = item.standardList[0].id

                    if (item.standardStatus == 2) {
                        item.standardInfo = {}
                        item.selectedTag = item.relateStandardId
                        item.standardList.map((item1) => {
                            if (item1.id == item.relateStandardId) {
                                item.standardInfo = item1
                            }
                        })
                    }
                }
            })
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                tableInfo: data,
                searchParam: param,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    getStandardList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            entityName: this.state.entityName,
            suggest: false,
        }
        this.setState({ loading: true })
        let res = await getStandardList(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.lzTableDom1 && this.lzTableDom1.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            standardStatus: undefined,
        })
        this.search()
    }
    changeStatus = async (e) => {
        await this.setState({
            standardStatus: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        // this.setState({
        //     selectedRowKeys: [],
        // })
        // this.getTableList({})
        if (this.controller) {
            this.controller.reset()
        }
        that.selectController.updateSelectedKeys([])
    }
    confirmData = async (data) => {
        await this.setState({
            selectedRadio: data.selectedTag ? [data.selectedTag] : [],
        })
        let query = [{ standardId: this.state.selectedRadio[0], groupId: data.groupId, clusterFlag: data.clusterFlag }]
        let that = this
        confirm({
            title: '确认映射该标准吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            icon: <ExclamationCircleFilled />,
            onOk() {
                clusterConfirm(query).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.setState({
                            selectedRowKeys: [],
                        })
                        that.selectController.updateSelectedKeys([])
                        // that.getTableList()
                        that.search()
                        that.getStatistic()
                    }
                })
            },
        })
    }
    openAddModal = (rows) => {
        const { selectedRowKeys, tableData } = this.state
        let query = rows.map((item) => {
            return {
                standardId: item.selectedTag,
                groupId: item.groupId,
                clusterFlag: item.clusterFlag,
            }
        })
        // selectedRowKeys.map((item) => {
        //     tableData.map((item1) => {
        //         if (item == item1.id) {
        //             query.push({
        //                 clusterId: item,
        //                 standardId: item1.selectedTag,
        //             })
        //         }
        //     })
        // })
        let that = this
        confirm({
            title: '你确定要批量确认吗？',
            content: '此操作不可撤回',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                clusterConfirm(query).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.setState({
                            selectedRowKeys: [],
                        })
                        that.selectController.updateSelectedKeys([])
                        // that.getTableList()
                        that.search()
                        that.getStatistic()
                    }
                })
            },
        })
    }
    cancel = () => {
        this.setState({
            standardModal: false,
        })
    }
    postData = async () => {
        const { selectedRadio, clusterInfo } = this.state
        console.log('postData', selectedRadio, clusterInfo)
        let query = [{ /* clusterId: clusterInfo.id, */ standardId: selectedRadio[0], groupId: clusterInfo.groupId, flag: clusterInfo.clusterFlag }]
        let res = await clusterConfirm(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.setState({
                selectedRowKeys: [],
            })
            this.search()
            this.getStatistic()
            this.cancel()
        }
    }
    onIndexmaCheckboxChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
        })
    }
    changeRadio = (selectedRowKey) => {
        console.log(selectedRowKey, 'changeRadio')
        this.setState({
            selectedRadio: selectedRowKey,
        })
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    searchStandard = async () => {
        await this.setState({
            showSearchResult: true,
        })
        this.getStandardList()
    }
    changeEntityName = (e) => {
        this.setState({
            entityName: e.target.value,
        })
    }
    openClusterPage = () => {
        this.props.addTab('同义簇管理')
    }
    changTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }

    render() {
        const {
            tableData,
            loading,
            standardStatus,
            keyword,
            selectedRowKeys,
            standardModal,
            standardTableData,
            selectedRadio,
            statisticInfo,
            confirmProportion,
            clusterInfo,
            showSearchResult,
            entityName,
            tabValue,
            modalTitle,
            visibleColumnDetail,
        } = this.state
        const indexmaRowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.onIndexmaCheckboxChange,
            getCheckboxProps: (record) => ({
                disabled: record.standardStatus !== 0, // 未映射才能选
                name: record.standardStatus,
            }),
        }
        const referenceTableRowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRadio,
            onChange: this.changeRadio,
            columnWidth: 28,
        }
        return (
            <React.Fragment>
                <RichTableLayout
                    title='智能对标'
                    renderDetail={() => {
                        return (
                            <div style={{ marginBottom: 16 }}>
                                对标完成率：
                                <span>
                                    {this.getToFixedNum(statisticInfo.standardProportion * 100)} ({statisticInfo.mappedCount}/{statisticInfo.totalCount})
                                </span>
                            </div>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索同义簇' />
                                {/* <Select allowClear onChange={this.changeStatus} value={standardStatus} placeholder='状态'>
                                    <Option value={0} key={0}>
                                        未映射
                                    </Option>
                                    <Option value={1} key={1}>
                                        无映射
                                    </Option>
                                    <Option value={2} key={2}>
                                        已映射
                                    </Option>
                                </Select> */}
                                <Button onClick={this.reset}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        key: 'groupId',
                        selectedEnable: true,
                        columns: this.columns,
                        getCheckboxProps: (record) => ({
                            disabled: record.standardStatus !== 0, // 未映射才能选
                            name: record.standardStatus,
                        }),
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    renderFooter={(controller, defaultRender) => {
                        const { selectedRows } = controller
                        this.selectController = controller
                        return (
                            <React.Fragment>
                                <PermissionWrap funcCode='/dtstd/mapping/auto/confirm'>
                                    <Button disabled={!Boolean(selectedRows.length)} type='primary' onClick={() => this.openAddModal(selectedRows)}>
                                        批量确认
                                    </Button>
                                </PermissionWrap>
                                {defaultRender()}
                            </React.Fragment>
                        )
                    }}
                    editColumnProps={{
                        width: 120,
                        createEditColumnElements: (index, record) => {
                            const text = record.standardStatus
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '修改',
                                    funcCode: '/dtstd/mapping/auto/add',
                                    disabled: text != 2,
                                    onClick: this.openEditModal.bind(this, record),
                                },
                                {
                                    label: '确认',
                                    disabled: text != 0,
                                    funcCode: '/dtstd/mapping/auto/confirm',
                                    onClick: this.confirmData.bind(this, record),
                                },
                            ])
                        },
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: modalTitle,
                        visible: standardModal,
                        onClose: this.cancel,
                        width: 640,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button disabled={!selectedRadio.length} type='primary' onClick={this.postData}>
                                    完成映射
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <Tabs className='assetTab' activeKey={tabValue} onChange={this.changTab} style={{ marginTop: -10 }}>
                        <TabPane tab='推荐标准' key='0'>
                            <React.Fragment>
                                {standardTableData.length ? (
                                    <Table columns={this.standardTableColumn} pagination={false} rowKey='id' dataSource={standardTableData} rowSelection={referenceTableRowSelection} />
                                ) : (
                                    <EmptyIcon description='系统暂无推荐，请搜索标准' style={{ marginTop: 120 }} />
                                )}
                            </React.Fragment>
                        </TabPane>
                        <TabPane tab='去搜索' key='1'>
                            <Input.Search
                                style={{ marginBottom: 16 }}
                                onSearch={this.searchStandard}
                                allowClear
                                value={entityName}
                                onChange={this.changeEntityName}
                                placeholder='请输入标准编码、标准中文名、标准英文名'
                            />
                            <LzTable
                                from='globalSearch'
                                columns={this.standardTableColumn}
                                dataSource={[]}
                                ref={(dom) => {
                                    this.lzTableDom1 = dom
                                }}
                                getTableList={this.getStandardList}
                                loading={showSearchResult && loading}
                                rowKey='id'
                                rowSelection={referenceTableRowSelection}
                                pagination={{
                                    showQuickJumper: false,
                                    showSizeChanger: false,
                                }}
                            />
                        </TabPane>
                    </Tabs>
                </DrawerLayout>
                {visibleColumnDetail && <ColumnDrawer visible={visibleColumnDetail} data={clusterInfo} onClose={() => this.setState({ visibleColumnDetail: false })} />}
            </React.Fragment>
        )
    }
}
