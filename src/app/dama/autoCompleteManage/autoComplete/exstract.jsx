import EmptyLabel from '@/component/EmptyLabel'
import { FileSearchOutlined, UndoOutlined } from '@ant-design/icons'
import { Col, Drawer, Input, message, Modal, Radio, Row, Select, Table } from 'antd'
import { getEtlStatisticsData, getEtlTableDetail, getNameCnEtlSearchCondition, listEtlExtractTableData, saveEtlData } from 'app_api/standardApi'
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
            classList: [
                { value: 0, name: 'MD5' },
                { value: 1, name: '内容掩盖' },
            ],
            keyword: '',
            way: undefined,
            strategy: undefined,
            idList: this.props.location.state.id ? [this.props.location.state.id] : [],
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
            type: 'edit',
            selectedRowKeys: [],
            columnDrawer: false,
            tableInfo: {},
            searchParam: {},
            standardModal: false,
            standardTableData: [],
            selectedRadio: '',
            modalVisible: false,

            databaseInfos: [],
            dwLevelInfos: [],
            dwLevelId: undefined,
            databaseId: undefined,
            statisticsData: {
                columnNums: 0,
                lineageFileNums: 0,
            },
            tableDetail: {
                columnDataVoList: [],
                lineageExtractFileNameList: [],
            },
        }
        this.drawerColumns = [
            {
                dataIndex: 'key',
                key: 'key',
                title: '序号',
                width: 48,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 80,
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '中文名称',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                render: (text, record, index) => {
                    if (record.etlNameCnDataList.length > 1) {
                        return (
                            <RadioGroup style={{ whiteSpace: 'initial' }} value={record.fileId} onChange={this.changeNameRadio.bind(this, index)}>
                                {record.etlNameCnDataList.map((item, index1) => {
                                    return (
                                        <Radio style={{ marginBottom: '5px' }} value={item.id}>
                                            <Input
                                                disabled={record.fileId !== item.id}
                                                value={item.extractColumnNameCn}
                                                onChange={this.changeEtlName.bind(this, index, index1)}
                                                style={{ height: '28px', width: '85%', marginRight: 8 }}
                                                placeHolder='请输入中文名称'
                                            />
                                            <Tooltip title='重置'>
                                                <UndoOutlined
                                                    onClick={this.undo.bind(this, index, index1, record.fileId !== item.id)}
                                                    style={{ color: record.fileId !== item.id ? '#b3b3b3' : '#666', fontSize: '16px', cursor: record.fileId !== item.id ? 'not-allowed' : 'pointer' }}
                                                />
                                            </Tooltip>
                                        </Radio>
                                    )
                                })}
                            </RadioGroup>
                        )
                    } else {
                        return (
                            <div>
                                <Input
                                    value={record.etlNameCnDataList[0].extractColumnNameCn}
                                    onChange={this.changeEtlName.bind(this, index, 0)}
                                    style={{ height: '28px', width: '85%', marginRight: 8 }}
                                    placeHolder='请输入中文名称'
                                />
                                <Tooltip title='重置'>
                                    <UndoOutlined onClick={this.undo.bind(this, index, 0, false)} style={{ color: '#666', fontSize: '16px', cursor: 'pointer' }} />
                                </Tooltip>
                            </div>
                        )
                    }
                },
            },
            {
                title: '来源脚本',
                dataIndex: 'lineageExtractFileName',
                key: 'lineageExtractFileName',
                render: (text, record) => {
                    return (
                        <div style={{ whiteSpace: 'initial' }}>
                            {record.etlNameCnDataList.map((item) => {
                                return (
                                    <span
                                        title={item.lineageExtractFileName}
                                        onClick={this.openSqlPage.bind(this, item.lineageExtractFileId)}
                                        style={{ width: '90%', display: 'inline-block', color: '#1890ff', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        {item.lineageExtractFileName}
                                    </span>
                                )
                            })}
                        </div>
                    )
                },
            },
        ]
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
                title: '待确认数量',
                dataIndex: 'toConfirmColumnNums',
                key: 'toConfirmColumnNums',
                align: 'right',
                width: 100,
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Tooltip title='查看'>
                                <FileSearchOutlined className='editIcon' onClick={this.openEditModal.bind(this, record)} />
                            </Tooltip>
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
        this.getEtlStatistics()
        this.getTableList({})
    }
    openColumnDetail = (data) => {
        this.drawer.showModal()
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openStandardDetail = (data) => {}
    openSqlPage = (id) => {
        this.onClose()
        this.props.addTab('sqlDetail', { id: id, from: 'exstract' }, true)
    }
    changeEtlName = (index, index1, e) => {
        let { tableDetail } = this.state
        tableDetail.columnDataVoList[index].etlNameCnDataList[index1].extractColumnNameCn = e.target.value
        this.setState({
            tableDetail,
        })
    }
    changeNameRadio = (index, e) => {
        let { tableDetail } = this.state
        tableDetail.columnDataVoList[index].fileId = e.target.value
        this.setState({
            tableDetail,
        })
    }
    undo = (index, index1, disabled, e) => {
        e.preventDefault()
        if (disabled) {
            return
        }
        let { tableDetail } = this.state
        tableDetail.columnDataVoList[index].etlNameCnDataList[index1].extractColumnNameCn = tableDetail.columnDataVoList[index].etlNameCnDataList[index1].extractColumnNameCnBackup
        this.setState({
            tableDetail,
        })
    }
    getSearchCondition = async () => {
        let res = await getNameCnEtlSearchCondition()
        if (res.code == 200) {
            this.setState({
                dwLevelInfos: res.data.dwLevelInfos,
                databaseInfos: res.data.databaseInfos,
            })
        }
    }
    getEtlStatistics = async () => {
        let res = await getEtlStatisticsData()
        if (res.code == 200) {
            this.setState({
                statisticsData: res.data,
            })
        }
    }
    getEtlTableDetailData = async (tableId) => {
        let res = await getEtlTableDetail({ tableId })
        if (res.code == 200) {
            res.data.lineageExtractFileNameList = res.data.lineageExtractFileNameList ? res.data.lineageExtractFileNameList : []
            res.data.lineageExtractFileNameList.map((item, index) => {
                res.data.lineageExtractFileName = ''
            })
            res.data.lineageExtractFileNameList.map((item, index) => {
                res.data.lineageExtractFileName += item + (index + 1 == res.data.lineageExtractFileNameList.length ? '' : '、')
            })
            res.data.columnDataVoList.map((item, index) => {
                item.etlNameCnDataList = item.etlNameCnDataList ? item.etlNameCnDataList : [{ extractColumnNameCn: '' }]
                if (item.etlNameCnDataList.length) {
                    item.fileId = item.etlNameCnDataList[0].id
                    item.etlNameCnDataList.map((item) => {
                        item.extractColumnNameCnBackup = item.extractColumnNameCn
                    })
                }
            })
            this.setState({
                tableDetail: res.data,
            })
        }
    }
    openEditModal = async (data) => {
        await this.setState({
            modalVisible: true,
        })
        this.getEtlTableDetailData(data.tableId)
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
        let res = await listEtlExtractTableData(query)
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
    reset = async () => {
        await this.setState({
            keyword: '',
            dwLevelId: undefined,
            databaseId: undefined,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        await this.setState({
            [name]: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        this.getTableList({})
    }
    onClose = () => {
        this.setState({ modalVisible: false })
    }
    postData = async () => {
        let { tableDetail } = this.state
        let query = {
            columnIdNameCnPairList: tableDetail.columnDataVoList,
            from: 2,
            tableId: tableDetail.tableId,
            tableNameCn: tableDetail.tableNameCn,
        }
        query.columnIdNameCnPairList &&
            query.columnIdNameCnPairList.map((item) => {
                item.etlNameCnDataList &&
                    item.etlNameCnDataList.map((item1) => {
                        if (item.fileId == item1.id) {
                            item.columnNameCn = item1.extractColumnNameCn
                        }
                    })
            })
        let res = await saveEtlData(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.onClose()
            this.getTableList({})
            this.getEtlStatistics()
        }
    }
    render() {
        const {
            tableData,
            loading,
            classList,
            keyword,
            strategy,
            modalVisible,
            way,
            ruleInfo,
            type,
            selectedRowKeys,
            standardModal,
            standardTableData,
            selectedRadio,
            dwLevelInfos,
            databaseInfos,
            dwLevelId,
            databaseId,
            statisticsData,
            tableDetail,
        } = this.state
        return (
            <div className='commonTablePage autoComplete_column'>
                <div className='title'>中文信息智能补全</div>
                <div className='searchArea'>
                    <span style={{ lineHeight: '30px' }}>
                        系统从{statisticsData.lineageFileNums}个血缘脚本中共抽取出{statisticsData.columnNums}个字段中文信息，请确认。
                    </span>
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
                        {/*<Button onClick={this.search} style={{ marginLeft: 8 }} className='searchBtn' type="primary">搜索</Button>*/}
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
                <Drawer title='' placement='right' closable={true} maskClosable={false} width={1000} onClose={this.onClose} visible={modalVisible} className='autoComplete_column'>
                    {modalVisible ? (
                        <div>
                            <Row gutter={20} style={{ fontSize: '14px', color: '#666' }}>
                                <Col style={{ marginBottom: 24 }} span={10} title={tableDetail.tableNameEn}>
                                    表英文名：<span style={{ color: '#333' }}>{tableDetail.tableNameEn}</span>
                                </Col>
                                <Col span={6} title={tableDetail.databaseNameEn}>
                                    数据库：<span style={{ color: '#333' }}>{tableDetail.databaseNameEn}</span>
                                </Col>
                                <Col span={8}>
                                    数仓层级：<span style={{ color: '#333' }}>{tableDetail.dwLevelName}</span>
                                </Col>
                                <Col style={{ whiteSpace: 'inherit' }} span={24}>
                                    说明：以下信息来自 {tableDetail.lineageExtractFileName}，请确认系统抽取的中文信息是否正确，确认后提交保存。
                                </Col>
                            </Row>
                            <div style={{ paddingBottom: '60px' }}>
                                <Table columns={this.drawerColumns} pagination={false} bordered dataSource={tableDetail.columnDataVoList} />
                            </div>
                            <div
                                style={{
                                    width: '998px',
                                    background: '#fff',
                                    height: '60px',
                                    paddingTop: '20px',
                                    paddingRight: '10px',
                                    textAlign: 'right',
                                    position: 'fixed',
                                    bottom: '0px',
                                    right: '0px',
                                    boxShadow: '0px 2px 14px 1px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Button type='primary' onClick={this.postData}>
                                    确认保存
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </Drawer>
            </div>
        )
    }
}
