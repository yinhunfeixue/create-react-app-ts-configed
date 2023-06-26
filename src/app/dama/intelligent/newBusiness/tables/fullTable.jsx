import React, { Component } from 'react'
import GeneralTable from 'app_page/dama/component/generalTable'
import { Col, Row, Select, Tooltip } from 'antd'
import { PlusCircleFilled, EditOutlined, CheckOutlined } from '@ant-design/icons';
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'
import { modelTableFull, postModelTableFull } from 'app_api/modelApi'
import { observer } from 'mobx-react'
import TableFieldsSelect from 'app_page/dama/component/tableFieldsSearchSelect'
import CommonSearch from 'app_page/dama/component/commonSearch'

const Option = Select.Option

@observer
class FullTable extends Component {
    constructor(props) {
        super(props)
        const TYPE = ['', '主体', '事实', '其他']
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
                            record.editingField &&
                            <span>
                                <TableFieldsSelect
                                    style={{ width: 240 }}
                                    dropdownStyle={{ minWidth: 240 }}
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
                title: '表类型',
                dataIndex: 'tableType',
                key: 'tableType',
                render: (_, record) => {
                    if (this.props.store.param && this.props.store.param.detail.type === 1) {
                        return <span>{_}</span>
                    } else {
                        return (
                            <span>{isDetail ? TYPE[_] : <span>
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
                                    <Tooltip title={TYPE[_]}>{TYPE[_]}</Tooltip>
                                    <EditOutlined />
                                                          </a>}
                                {
                                    record.editingFormat &&
                                    <span>
                                        <Select
                                            style={{ width: 120 }}
                                            onSelect={
                                                (value) => {
                                                    record.tableType = value
                                                }
                                            }
                                        >
                                            <Option value='1'>主体</Option>
                                            <Option value='2'>事实</Option>
                                            <Option value='3'>其他</Option>
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
                    }
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (_) => <Tooltip title={_}>{<span style={{ color: _ === '配置完成' ? 'green' : 'red' }}>{_}</span>}</Tooltip>
            }, {
                title: '操作',
                render: (_, record) => (
                    <a onClick={
                        () => { this.handleSetting(record) }}
                    >字段设置
                    </a>
                )
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

    saveModelTable = async (record) => {
        const { store } = this.props
        const { modelId, businessId } = store
        const { tableId, primaryKey, tableType } = record
        let param = { tableId, primaryKey, tableType, modelId, businessId }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        let res = await postModelTableFull(param)
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
        let res = await modelTableFull(param)
        if (res.code != 200) {
            NotificationWrap.error(res.msg)
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
                    <Col span={8} >
                        <CommonSearch handleSearch={this.handleSearch} />
                    </Col>
                </Row>

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
            </div>
        )
    }
}

export default FullTable
