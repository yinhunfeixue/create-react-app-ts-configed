import EmptyLabel from '@/component/EmptyLabel'
import { EditOutlined } from '@ant-design/icons';
import { Input, Modal, Radio, Select } from 'antd';
import { getDatabaseByLevelId, getNameCnManualAddSearchCondition, listManualAddTableData } from 'app_api/standardApi'
import { LzTable } from 'app_component'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            keyword: '',
            tableInfo: {},
            searchParam: {},
            databaseInfos: [],
            dwLevelInfos: [],
            dwLevelId: undefined,
            databaseId: undefined,
        }
        this.columns = [
            {
                title: '表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数仓层级',
                dataIndex: 'dwLevelName',
                key: 'dwLevelName',
                width: 80,
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '中文信息比率',
                dataIndex: 'nameCnRate',
                key: 'nameCnRate',
                width: 100,
                align: 'right',
                render: (text, record) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '字段数量',
                dataIndex: 'columnNums',
                key: 'columnNums',
                width: 80,
                align: 'right',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 60,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Tooltip title='编辑'>
                                <EditOutlined className='editIcon' onClick={this.openEditModal.bind(this, record)} />
                            </Tooltip>
                        </div>
                    );
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
        this.getTableList({})
    }
    openColumnDetail = (data) => {
        this.drawer.showModal()
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openStandardDetail = (data) => {}
    getSearchCondition = async () => {
        let res = await getNameCnManualAddSearchCondition()
        if (res.code == 200) {
            this.setState({
                dwLevelInfos: res.data.dwLevelInfos,
                databaseInfos: res.data.databaseInfos,
            })
        }
    }
    getDatabase = async () => {
        let res = await getDatabaseByLevelId({ levelId: this.state.dwLevelId })
        if (res.code == 200) {
            this.setState({
                databaseInfos: res.data.databaseInfos,
            })
        }
    }
    selectedTag = (index, data) => {
        let { tableInfo, searchParam } = this.state
        tableInfo.data[index].selectedTag = data.name
        this.setState({ tableInfo })
        this.lzTableDom && this.lzTableDom.setTableData(tableInfo, searchParam)
    }
    openEditModal = (data) => {
        this.props.addTab('编辑中文信息', { ...data })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            dwLevelIdList: this.state.dwLevelId ? [this.state.dwLevelId] : [],
            databaseIdList: this.state.databaseId ? [this.state.databaseId] : [],
        }
        this.setState({ loading: true })
        let res = await listManualAddTableData(query)
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
                tableInfo: data,
                searchParam: param,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%';
        } else {
            return '0%'
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            dwLevelId: undefined,
            databaseId: undefined,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        if (name == 'dwLevelId') {
            await this.setState({
                dwLevelId: e,
                databaseId: undefined,
            })
            this.getDatabase()
            this.search()
        } else {
            await this.setState({
                [name]: e,
            })
            this.search()
        }
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        this.getTableList({})
    }
    render() {
        const { tableData, loading, keyword, dwLevelInfos, databaseInfos, dwLevelId, databaseId } = this.state
        return (
            <div className='commonTablePage'>
                {/*<a onClick={() => this.props.addTab('维度管理')}>维度管理</a>*/}
                <div className='title'>中文信息手动添加</div>
                <div className='searchArea'>
                    <div style={{ float: 'right' }}>
                        <Select allowClear onChange={this.changeStatus.bind(this, 'dwLevelId')} value={dwLevelId} placeholder='数仓层级' style={{ width: '120px' }}>
                            {dwLevelInfos.map((item) => {
                                return (
                                    <Option value={item.key} key={item.key}>
                                        {item.value}
                                    </Option>
                                )
                            })}
                        </Select>
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={this.changeStatus.bind(this, 'databaseId')}
                            value={databaseId}
                            placeholder='数据库'
                            style={{ width: '120px', marginLeft: 8 }}
                        >
                            {databaseInfos.map((item) => {
                                return (
                                    <Option title={item.value} value={item.key} key={item.key}>
                                        {item.value}
                                    </Option>
                                )
                            })}
                        </Select>
                        <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} style={{ width: 200, marginLeft: 8 }} placeholder='表中文名或英文名' />
                        <Button onClick={this.reset} style={{ marginLeft: 8 }} className='searchBtn'>
                            重置
                        </Button>
                    </div>
                </div>
                <div>
                    <LzTable
                        from='globalSearch'
                        columns={this.columns}
                        dataSource={tableData}
                        ref={(dom) => {
                            this.lzTableDom = dom
                        }}
                        getTableList={this.getTableList}
                        loading={loading}
                        rowKey='id'
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                    />
                </div>
            </div>
        )
    }
}
