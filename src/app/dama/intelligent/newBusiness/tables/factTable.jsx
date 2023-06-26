import React, { Component } from 'react'
import { Col, Row, Select, Tooltip } from 'antd'
import { PlusCircleFilled, EditOutlined, CheckOutlined } from '@ant-design/icons';
import GeneralTable from 'app_page/dama/component/generalTable'
import { observer } from 'mobx-react'
import { modelTableFact, postModelTableFact } from 'app_api/modelApi'
import TableFieldsSelect from 'app_page/dama/component/tableFieldsSearchSelect'
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'
import CommonSearch from 'app_page/dama/component/commonSearch'

const Option = Select.Option

@observer
class FactTable extends Component {
    constructor(props) {
        super(props)
        const { isDetail } = this.props
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 50
            }, {
                title: '数据表英文名',
                dataIndex: 'ename',
                key: 'ename',

                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '数据表中文名',
                dataIndex: 'cname',
                key: 'cname',

                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '主键',
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                width: 200,
                render: (_, record) => (
                    <span>{isDetail ? _ : <span>
                        {
                            !record.editingFieldPrimaryKey &&
                            <a
                                onClick={
                                    () => {
                                        record.editingFieldPrimaryKey = true
                                        this.setState({
                                            tableData: this.state.tableData
                                        })
                                    }
                                }
                            >
                                <Tooltip title={_}>{_}</Tooltip>
                                <EditOutlined />
                            </a>
                        }
                        {
                            record.editingFieldPrimaryKey &&
                            <span>
                                <TableFieldsSelect
                                    style={{ width: 180 }}
                                    valueField='physical_field'
                                    tableId={record.tableId}
                                    onChange={
                                        (value) => {
                                            record.primaryKey = value.join(',')
                                            this.setState({
                                                tableData: this.state.tableData
                                            })
                                        }
                                    }
                                />
                                <a
                                    onClick={() => {
                                        this.saveModelTable(record)
                                    }}
                                >
                                    <CheckOutlined />
                                </a>
                            </span>
                        }
                    </span>}
                    </span>
                )
            }, {
                title: '时间字段',
                dataIndex: 'timeField',
                key: 'timeField',
                width: 240,
                render: (_, record) => (
                    <span>{isDetail ? _ : <span>
                        {!record.editingField &&
                        <a
                            onClick={
                                () => {
                                    record.editingField = true
                                    this.setState({
                                        tableData: this.state.tableData
                                    })
                                }
                            }
                        >
                            <Tooltip title={_}>{_}</Tooltip>
                            <EditOutlined />
                        </a>
                        }
                        {
                            record.editingField && <span>
                                <TableFieldsSelect
                                    style={{ width: 180 }}
                                    valueField='physical_field'
                                    tableId={record.tableId}
                                    onChange={
                                        (value) => {
                                            record.timeField = value
                                            this.setState({
                                                tableData: this.state.tableData
                                            })
                                        }
                                    }
                                    mode={null}
                                />
                                <a
                                    onClick={() => {
                                        this.saveModelTable(record)
                                    }}
                                >
                                    <CheckOutlined />
                                </a>
                                                   </span>
                        }
                                          </span>}
                    </span>
                )
            }, {
                title: '时间字段格式',
                dataIndex: 'timeFormat',
                key: 'timeFormat',
                width: 280,
                render: (_, record) => (
                    <span>{isDetail ? _ : <span>
                        {!record.editingFormat && <a
                            onClick={
                                () => {
                                    record.editingFormat = true
                                    this.setState({
                                        tableData: this.state.tableData
                                    })
                                }
                            }
                                                  >
                            <Tooltip title={_}>{_}</Tooltip>
                            <EditOutlined />
                                                  </a>}
                        {
                            record.editingFormat &&
                            <span>
                                <Select
                                    style={{ width: 240 }}
                                    dropdownStyle={{ minWidth: 280 }}
                                    onSelect={
                                        (value) => {
                                            record.timeFormat = value
                                        }
                                    }
                                >
                                    <Option value=''>无</Option>
                                    <Option value='yyyy'>yyyy(2018)</Option>
                                    <Option value='MM'>MM(01)</Option>
                                    <Option value='dd'>dd(01)</Option>
                                    <Option value='EEEE'>EEEE(Monday)</Option>
                                    <Option value='EEE'>EEE(Mon)</Option>
                                    <Option value='yyyyMMdd'>yyyyMMdd(20180108)</Option>
                                    <Option value='yyyy-MM-dd'>yyyy-MM-dd(2018-01-08)</Option>
                                    <Option value='yyyy/MM/dd'>yyyy/MM/dd(2018/01/08)</Option>
                                    <Option value='yyyyMMdd HH:mm:ss'>yyyyMMdd  HH:mm:ss(20180108 01:08:08)</Option>
                                    <Option value='yyyy-MM-dd HH:mm:ss'>yyyy-MM-dd HH:mm:ss(2018-01-08 01:08:08)</Option>
                                    <Option value='yyyy/MM/dd HH:mm:ss'>yyyy/MM/dd HH:mm:ss(2018/01/08 01:08:08)</Option>
                                </Select>
                                <a
                                    onClick={() => {
                                        this.saveModelTable(record)
                                    }}
                                >
                                    <CheckOutlined />
                                </a>

                            </span>
                        }

                                          </span>}
                    </span>
                )
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (_, record) => <Tooltip title={_}>{<span style={{ color: _ === '配置完成' ? 'green' : 'red' }}>{_}</span>}</Tooltip>
            }, {
                title: '操作',
                render: (_, record) => <a onClick={() => this.handleSetting(record)}>字段设置</a>
            }]
        this.state = {
            tableData: [],
            tableLoading: false,
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none'
            },
            total: '',
            finish: '',
            unfinish: ''
        }
        this.keyword = ''
    }

    componentDidMount() {
        this.getTableData()
    }

    saveModelTable =async (record) => {
        const { store } = this.props
        const { modelId, businessId } = store
        const { tableId, timeField, timeFormat, primaryKey } = record
        let param = { tableId, timeField, timeFormat, modelId, businessId, primaryKey }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        let res = await postModelTableFact(param)
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            return
        }
        NotificationWrap.success('操作成功')
        this.getTableData()
    }

    handleSetting=(record) => {
        const { store } = this.props
        store.tableCname = record.cname
        store.tableEname = record.ename
        store.tableId = record.tableId
        store.getTableData()
        store.visible = true
    }

    getTableData = async (params) => {
        const { store } = this.props
        const { modelId, businessId } = store
        let param = { ...this.state.pagination, ...params, modelId, businessId, keyword: this.keyword }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        this.setState({
            pagination: param,
            tableLoading: true
        })
        let res = await modelTableFact(param)
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            this.setState({
                tableLoading: false
            })
            return
        }
        if (res.data.length === 0 && this.state.pagination.page !== 1) {
            this.getTableData({ page: this.state.pagination.page - 1 || 1 })
            return
        }
        this.setState({
            tableLoading: false,
            tableData: res.data.tables,
            pagination: {
                ...this.state.pagination,
                total: res.data.total,
                paginationDisplay: 'block',
            },
            total: res.data.total,
            finish: res.data.finish,
            unfinish: res.data.unfinish
        })
        this.selectedRows = []
    }

    handleSearch = (value) => {
        this.keyword = value
        this.getTableData()
    }

    render() {
        const { getTableData, columns } = this
        const { tableData, tableLoading, pagination, total, finish, unfinish } = this.state
        return (
            <div>
                <Row type='flex' justify='space-between' align='center'>
                    <Col className='factTableText' span={8}>
                        <span>表总数：<b>{total}</b></span>
                        <span>配置完成：<b>{finish}</b></span>
                        <span>待配置：<b>{unfinish}</b></span>
                    </Col>
                    <Col span={8}>
                        <CommonSearch handleSearch={this.handleSearch} />
                    </Col>
                </Row>
                <Row>
                    <GeneralTable
                        tableProps={{
                            tableData,
                            columns,
                            rowKey: 'tableId',
                            tableLoading
                        }}
                        paginationProps={{
                            pagination,
                            getTableData,
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                    />
                </Row>
            </div>
        )
    }
}

export default FactTable
