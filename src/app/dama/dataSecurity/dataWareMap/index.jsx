import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import ProjectUtil from '@/utils/ProjectUtil'
import { Dropdown, Input, Menu, message, Select, Table } from 'antd'
import { defTagInLevel, mappingDatabase, mappingSystem, saveMappingDatabase } from 'app_api/dataSecurity'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'

export default class DataWareMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnLoading: false,
            tableData: [],
            modalVisible: false,
            levelList: [],
            columnData: [],
            searchColumnData: [],
            loading: false,
            systemInfo: {},
            queryInfo: {
                keyword: '',
            },
            selectedKeys: [],
            searchColumnDataKey: '',
        }
        this.columns = [
            {
                title: '数据源名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据源英文名',
                dataIndex: 'identifier',
                key: 'identifier',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseCount',
                key: 'databaseCount',
                render: (text, record) => <span>{text}</span>,
            },
        ]
        this.configColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '数据库名称',
                dataIndex: 'databaseEname',
                key: 'databaseEname',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数仓分层',
                dataIndex: 'tagValueId',
                key: 'tagValueId',
                render: (text, record, index) => (
                    <div className='hoverSelect'>
                        <Select
                            style={{ width: '100%' }}
                            onChange={this.changeSelect.bind(this, index)}
                            defaultValue={text}
                            //value={text}
                            placeholder={<EmptyLabel />}
                        >
                            {this.state.levelList.map((item) => {
                                return <Select.Option key={item.tagValueId} /* value={item.tagValueId} */>{item.tagValueName}</Select.Option>
                            })}
                        </Select>
                    </div>
                ),
            },
        ]
    }
    componentWillMount = () => {
        this.getLevelList()
    }
    componentDidMount() {
        if (this.pageParams.id) {
            this.openEditModal({ ...this.pageParams })
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTableList = async (params = {}) => {
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
        }
        let res = await mappingSystem(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getLevelList = async () => {
        let res = await defTagInLevel()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    changeSelect = async (index, e) => {
        let { columnData, searchColumnData } = this.state
        searchColumnData[index].tagValueId = e
        columnData.map((item) => {
            if (item.databaseId == searchColumnData[index].databaseId) {
                item = { ...searchColumnData[index] }
            }
        })
        await this.setState({
            searchColumnData: searchColumnData.concat(),
            columnData,
        })
        this.postData()
    }
    openEditModal = async (data) => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            modalVisible: true,
            systemInfo: data,
            queryInfo,
        })
        this.getDatabaseList()
    }
    getDatabaseList = async () => {
        let { systemInfo } = this.state
        this.setState({ loading: true })
        let res = await mappingDatabase({ systemId: systemInfo.id })
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                columnData: res.data,
                searchColumnData: res.data,
                searchColumnDataKey: Date.now(),
            })
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
            selectedKeys: [],
        })
        this.search()
    }
    postData = async () => {
        let { columnData } = this.state
        this.setState({ loading: true })
        let res = await saveMappingDatabase(columnData)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
        }
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.mapSearch()
        }
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.mapSearch()
    }
    mapSearch = () => {
        let { queryInfo, columnData } = this.state
        let array = []
        columnData.map((item) => {
            if (item.databaseEname.includes(queryInfo.keyword)) {
                array.push(item)
            }
        })
        console.log(array, 'array+++++')
        let array1 = []
        if (queryInfo.tagValueId) {
            array.map((item) => {
                if (queryInfo.tagValueId == item.tagValueId) {
                    array1.push(item)
                }
            })
        } else {
            array1 = [...array]
        }
        console.log(array1, 'array1+++++')
        this.setState({
            searchColumnData: array1,
            queryInfo,
            selectedKeys: [],
        })
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.mapSearch()
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selectedRowKeys')
        this.setState({
            selectedKeys: selectedRowKeys,
        })
    }
    onClickMenu = async (e) => {
        let { searchColumnData, columnData, selectedKeys } = this.state
        searchColumnData.map((item) => {
            selectedKeys.map((keys) => {
                if (item.databaseId == keys) {
                    item.tagValueId = e.key
                }
            })
        })
        columnData.map((item) => {
            searchColumnData.map((keys) => {
                if (item.databaseId == keys.databaseId) {
                    item = { ...keys }
                }
            })
        })
        await this.setState({
            columnData,
            searchColumnData,
        })
        await this.postData()
        this.getDatabaseList()
    }
    render() {
        const { tableData, modalVisible, btnLoading, columnData, searchColumnData, searchColumnDataKey, loading, systemInfo, queryInfo, levelList, selectedKeys } = this.state
        const rowSelection = {
            type: 'checkbox',
            columnWidth: 45,
            fixed: true,
            selectedRowKeys: selectedKeys,
            onChange: this.onSelectChange,
        }
        const menu = (
            <Menu onClick={this.onClickMenu}>
                {levelList.map((item) => {
                    return <Menu.Item key={item.tagValueId}>{item.tagValueName}</Menu.Item>
                })}
            </Menu>
        )
        return (
            <React.Fragment>
                <div className='dataWareMap'>
                    <RichTableLayout
                        title='数仓分层映射'
                        editColumnProps={{
                            width: 100,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <PermissionWrap funcCode='/setting/dw_layer/mapping/edit'>
                                        <a onClick={this.openEditModal.bind(this, record)} key='edit'>
                                            分层管理
                                        </a>
                                    </PermissionWrap>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        className: 'dataWareMapDrawer',
                        title: '分层配置（' + systemInfo.name + '）',
                        width: 640,
                        visible: modalVisible,
                        onClose: this.cancel,
                        maskClosable: false,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                {selectedKeys.length ? (
                                    <div>
                                        <Dropdown trigger='click' overlay={menu} placement='bottomLeft'>
                                            <Button type='primary'>分层选择</Button>
                                        </Dropdown>
                                        <span style={{ color: '#666666', marginLeft: 12 }}>
                                            已选 <span style={{ color: '#2D3033' }}>{selectedKeys.length}</span> 项
                                        </span>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible && (
                        <React.Fragment>
                            <div className='searchGroup'>
                                <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.mapSearch} placeholder='请输入数据库' style={{ width: 280, marginRight: 8 }} />
                                <Select allowClear onChange={this.changeStatus.bind(this, 'tagValueId')} value={queryInfo.tagValueId} placeholder='数仓分层' style={{ width: 160, marginRight: 8 }}>
                                    {levelList.map((item) => {
                                        return (
                                            <Select.Option key={item.tagValueId} value={item.tagValueId}>
                                                {item.tagValueName}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.reset}>重置</Button>
                            </div>
                            <Table
                                key={searchColumnDataKey}
                                columns={this.configColumns}
                                loading={loading}
                                dataSource={searchColumnData}
                                rowKey='databaseId'
                                pagination={false}
                                rowSelection={rowSelection}
                            />
                        </React.Fragment>
                    )}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
