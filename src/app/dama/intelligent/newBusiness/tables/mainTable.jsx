import React, { Component } from 'react'
import { Col, Input, Row, Tooltip, Modal } from 'antd'
import { PlusCircleFilled, EditOutlined, CheckOutlined } from '@ant-design/icons';
import GeneralTable from 'app_page/dama/component/generalTable'
import { modelTableDomain, postModelTableDomain, delModelTableDomain } from 'app_api/modelApi'
import { observer } from 'mobx-react'
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'
import TableFieldsSelect from 'app_page/dama/component/tableFieldsSearchSelect'
import CommonSearch from 'app_page/dama/component/commonSearch'
import AddForm from './addFrom.jsx'

@observer
class MainTable extends Component {
    constructor(props) {
        super(props)
        const { isDetail } = this.props
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
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
                    record.isColum ? ''
                        : <span>{isDetail ? _ : <span>
                            {!record.editingFieldPrimaryKey &&
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
                title: '主体名称',
                dataIndex: 'domainName',
                key: 'domainName',
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
                                <Input
                                    defaultValue={record.domainName}
                                    onChange={
                                        (e) => {
                                            record.domainName = e.target.value
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
                title: '主体名称字段',
                dataIndex: 'domainColumn',
                key: 'domainColumn',
                width: 140,
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
                                                record.domainColumn = value
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
            },
            {
                title: '条件',
                dataIndex: 'filter',
                key: 'filter',
                render: (_, record) => (<Tooltip title={_}><span>{_}</span></Tooltip>)
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (_, record) => <Tooltip title={_}><span style={{ color: _ === '配置完成' ? 'green' : 'red' }}>{_}</span></Tooltip>
            }, {
                title: '操作',
                width: 140,
                render: (_, record) => record.isOpeator ? <div> <a onClick={() => this.handleSetting(record)}>字段设置</a> <a onClick={() => this.addSetting(record)}>添加主体</a></div> : <span><a onClick={this.onDelete.bind(this, record)}>删除</a></span>
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
            unfinish: '',
            visible: false
        }
    }

    componentDidMount() {
        this.getTableData({

        })
    }
    addSetting = async (record) => {
        // this.setState({
        //     tableId: record.tableId
        // }, () => {
        //     this.setState({
        //         visible: true
        //     }, () => {
        //         this.addFrom.resetFields()
        //     })
        // })

        await this.setState({
            tableId: record.tableId
        })

        await this.setState({
            visible: true
        })

        await this.addFrom.resetFields()
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    saveModelTable = async (record) => {
        const { store } = this.props
        const { modelId, businessId } = store
        const { tableId, domainColumn, domainName } = record
        let param = { tableId, domainColumn, domainName, modelId, businessId }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        if (record.filter) {
            param.filter = record.filter
        }
        let res = await postModelTableDomain(param)
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            return
        }
        NotificationWrap.success('操作成功')
        this.handleCancel()
        this.getTableData()
    }
    onDelete = async (record) => {
        const { store } = this.props
        const { modelId, businessId } = store
        const { tableId, domainColumn, domainName } = record
        let param = { tableId, domainColumn, domainName, modelId, businessId }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        let res = await delModelTableDomain(param)
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
        this.setState({
            pagination: param,
            tableLoading: true
        })
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        let res = await modelTableDomain(param)
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
        let tableData = res.data.tables
        if (res.data.tables) {
            tableData = res.data.tables.map((value, index) => {
                if (value.children) {
                    let arr = value.children.map((value1, index) => {
                        return {
                            isOpeator: false,
                            filter: value1.filter,
                            key: value1.key,
                            domainColumn: value1.domainColumn,
                            domainName: value1.domainName,
                            modelId: value1.modelId,
                            tableId: value1.tableId,
                            tableType: value1.tableType,
                            primaryKey: value.primaryKey,
                            isColum: true
                        }
                    })
                    return {
                        ...value,
                        isOpeator: true,
                        children: arr
                    }
                } else {
                    return {
                        ...value,
                        isOpeator: true,
                    }
                }
            })
        }
        this.setState({
            tableLoading: false,
            tableData,
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
        this.keyword = ''
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
                        keyWidth={80}
                        tableProps={{
                            tableData,
                            columns,
                            rowKey: 'key',
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
                <Modal
                    title='添加主题'
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        ref={(refs) => this.addFrom = refs}
                        tableId={this.state.tableId}
                        saveModelTable={this.saveModelTable}
                        handleCancel={this.handleCancel}
                    />
                </Modal>
            </div>
        )
    }
}

export default MainTable
