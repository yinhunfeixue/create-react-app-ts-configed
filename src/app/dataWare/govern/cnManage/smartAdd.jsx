import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { UndoOutlined } from '@ant-design/icons'
import { Alert, Button, Input, message, Modal, Radio, Select, Table } from 'antd'
import { getEtlStatisticsData, getEtlTableDetail, getNameCnEtlSearchCondition, listEtlExtractTableData, saveEtlData } from 'app_api/standardApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)

        const param = this.pageParam
        this.state = {
            loading: false,
            keyword: '',
            way: undefined,
            strategy: undefined,
            idList: param.id ? [param.id] : [],
            ruleInfo: { way: 1, headPosition: 0, tailPosition: 0 },
            type: 'edit',
            selectedRowKeys: [],
            columnDrawer: false,
            standardModal: false,
            standardTableData: [],
            selectedRadio: '',
            modalVisible: false,

            databaseInfos: [],
            datasourceInfos: [],
            datasourceId: undefined,
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
                width: 80,
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
                width: 140,
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
                                                key={item.resetKey}
                                                disabled={record.fileId !== item.id}
                                                defaultValue={item.extractColumnNameCn}
                                                onChange={this.changeEtlName.bind(this, index, index1)}
                                                style={{
                                                    width: '85%',
                                                    marginRight: 8,
                                                }}
                                                placeHolder='请输入中文名称'
                                            />
                                            <Tooltip title='重置'>
                                                <UndoOutlined
                                                    onClick={(event) => {
                                                        item.resetKey = item.resetKey ? ++item.resetKey : 1
                                                        this.undo(index, index1, record.fileId !== item.id, event)
                                                    }}
                                                    style={{
                                                        color: record.fileId !== item.id ? '#b3b3b3' : '#666',
                                                        fontSize: '16px',
                                                        cursor: record.fileId !== item.id ? 'not-allowed' : 'pointer',
                                                    }}
                                                />
                                            </Tooltip>
                                        </Radio>
                                    )
                                })}
                            </RadioGroup>
                        )
                    } else {
                        const item = record.etlNameCnDataList[0]
                        return (
                            <div>
                                <Input
                                    key={item.resetKey}
                                    defaultValue={item.extractColumnNameCn}
                                    onChange={this.changeEtlName.bind(this, index, 0)}
                                    style={{
                                        width: '85%',
                                        marginRight: 8,
                                    }}
                                    placeHolder='请输入中文名称'
                                />
                                <Tooltip title='重置'>
                                    <UndoOutlined
                                        onClick={(event) => {
                                            item.resetKey = item.resetKey ? ++item.resetKey : 1
                                            this.undo(index, 0, false, event)
                                        }}
                                        style={{
                                            color: '#666',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        )
                    }
                },
            },
        ]
        this.columns = [
            {
                title: '表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                width: '40%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                width: '22%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                width: '18%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
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
                title: '待确认数量',
                dataIndex: 'toConfirmColumnNums',
                key: 'toConfirmColumnNums',
                align: 'right',
                width: '14%',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
        this.getEtlStatistics()
    }
    openColumnDetail = (data) => {
        this.drawer.showModal()
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    openStandardDetail = (data) => {}
    openSqlPage = (id) => {
        this.props.addTab('sqlDetail', { id: id, from: 'exstract' }, true)
    }
    changeEtlName = (index, index1, e) => {
        let { tableDetail } = this.state
        tableDetail.columnDataVoList[index].etlNameCnDataList[index1].extractColumnNameCn = e.target.value
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
                databaseInfos: res.data.databaseInfos,
                datasourceInfos: res.data.datasourceInfos,
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
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            datasourceId: this.state.datasourceId,
            databaseIdList: this.state.databaseId ? [this.state.databaseId] : [],
        }
        let res = await listEtlExtractTableData(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
            }
            let data = {
                data: res.data,
                total: res.total,
            }

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
    reset = async () => {
        await this.setState({
            keyword: '',
            datasourceId: undefined,
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
        if (this.controller) {
            this.controller.reset()
        }
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
        this.setState({ loadingSave: true })
        let res = await saveEtlData(query)
        this.setState({ loadingSave: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.onClose()
            this.search()
            this.getEtlStatistics()
        }
    }
    render() {
        const {
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
            databaseInfos,
            datasourceInfos,
            datasourceId,
            databaseId,
            statisticsData,
            tableDetail,
            loadingSave,
        } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    title='智能抽取'
                    editColumnProps={{
                        width: '8%',
                        createEditColumnElements: (_, record) => {
                            return [
                                <a onClick={this.openEditModal.bind(this, record)} key='look'>
                                    查看
                                </a>,
                            ]
                        },
                    }}
                    tableProps={{
                        columns: this.columns,
                        key: 'tableNameEn',
                    }}
                    renderDetail={() => {
                        return (
                            <div style={{ color: '#5E6266' }}>
                                系统从<span style={{ color: '#2D3033' }}>{statisticsData.lineageFileNums}</span>
                                个血缘脚本中共抽取出<span style={{ color: '#2D3033' }}>{statisticsData.columnNums}</span>
                                个字段中文信息，请确认。
                            </div>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='表中文名或英文名' />
                                <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'datasourceId')} value={datasourceId} placeholder='数据源'>
                                    {datasourceInfos.map((item) => {
                                        return (
                                            <Option title={item.value} value={item.key} key={item.key}>
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
                                >
                                    {databaseInfos.map((item) => {
                                        return (
                                            <Option title={item.value} value={item.key} key={item.key}>
                                                {item.value}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.reset}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: `中文确认`,
                        placement: 'right',
                        closable: true,
                        maskClosable: false,
                        width: 960,
                        onClose: this.onClose,
                        visible: modalVisible,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={loadingSave} type='primary' onClick={this.postData}>
                                    确认
                                </Button>
                                <Button disabled={loadingSave} onClick={this.onClose}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible ? (
                        <React.Fragment>
                            <Alert
                                message={
                                    <span>
                                        说明：以下信息来自
                                        {tableDetail.columnDataVoList && tableDetail.columnDataVoList.length ? (
                                            <a
                                                onClick={() => {
                                                    this.openSqlPage(tableDetail.columnDataVoList[0].etlNameCnDataList[0].lineageExtractFileId)
                                                }}
                                                // to={{
                                                //     pathname: '/dataWare/govern/cnManage/sqlDetail',
                                                //     search: '?id=' + tableDetail.columnDataVoList[0].etlNameCnDataList[0].lineageExtractFileId + '&from=' + 'exstract',
                                                // }}
                                                // target='_blank'
                                            >
                                                <a>{tableDetail.lineageExtractFileName || ''}</a>
                                            </a>
                                        ) : (
                                            <a>{tableDetail.lineageExtractFileName || ''}</a>
                                        )}
                                        ，请确认系统抽取的中文信息是否正确，确认后提交保存。
                                    </span>
                                }
                            />
                            <Table loading={loadingSave} columns={this.drawerColumns} pagination={false} dataSource={tableDetail.columnDataVoList} />
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
