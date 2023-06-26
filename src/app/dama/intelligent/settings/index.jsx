import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import GeneralTable from 'app_page/dama/component/generalTable'
import { Button, Col, Modal, Row, Tooltip } from 'antd'
import { businessDelete, getBusiness } from 'app_api/modelApi'
import './style.less'
import InputClose from 'app_common/es/inputClose/inputClose'

const confirm = Modal.confirm
class IntelligentSettings extends Component {
    constructor(props) {
        super(props)
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.getTableRow(selectedRows)
                this.setState({
                    selectLength: selectedRows.length
                })
            },
            type: 'checkbox'
        }
        this.state = {
            tableData: [],
            tableLoading: false,
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none'
            },
            selectLength: 0
        }
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: 50
        }, {
            title: '业务名称',
            dataIndex: 'businessTypeName',
            key: 'businessTypeName',
            render: (_, record) => <Tooltip title={_}><a onClick={() => this.props.addTab('业务详情', { detail: { ...record }, isDetail: true, isEdit: true, callback: this.getTableData })}>{_}</a></Tooltip>
        }, {
            title: '业务描述',
            dataIndex: 'description',
            key: 'description',
            render: (_) => <Tooltip title={_}>{_}</Tooltip>
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                if (record.type === 1) {
                    return <span>数据集</span>
                } else {
                    return <span>模型</span>
                }
            }
        }, {
            title: '模型名称',
            dataIndex: 'modelName',
            key: 'modelName',
            render: (_) => <Tooltip title={_}>{_}</Tooltip>
        }, {
            title: '取数方式',
            dataIndex: 'isUseStandard',
            key: 'isUseStandard',
            render: (_) => _ ? '标准项取数' : '非标准项取数'
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_) => <span>{_}</span>
        }, {
            title: '最近索引时间',
            dataIndex: 'latestIndexTime',
            key: 'latestIndexTime',
        }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        }]
        this.selectedRows = []
        this.keyword = ''
    }

    componentDidMount() {
        this.getTableData()
    }

    getTableData = async (params) => {
        let param = { ...this.state.pagination, ...params, keyword: this.keyword }
        this.setState({
            pagination: param,
            tableLoading: true
        })
        let res = await getBusiness(param)
        this.setState({
            pagination: {
                ...this.state.pagination,
                total: res.total,
                paginationDisplay: 'block',
            },
            tableData: res.data,
            tableLoading: false
        })
        this.table.changeSelectKey([])
        this.selectedRows = []
    }

    getTableRow = (arr) => {
        this.selectedRows = arr
    }
    handleAddClick = () => {
        this.props.addTab('添加业务')
    }
    handleEditClick = () => {
        if (this.selectedRows.length !== 1) {
            NotificationWrap.warning('请选择一条业务进行编辑!')
            return
        }
        this.props.addTab('编辑业务', { detail: this.selectedRows[0], isEdit: true, onCancel: this.getTableData })
    }
    showConfirm=() => {
        confirm({
            title: '确认删除？',
            content: '点击确认删除选中项！',
            onOk: () => {
                this.handleDelBusiness()
            },
            onCancel() {},
            okText: '确认',
            cancelText: '取消'
        })
    }
    handleDelBusiness=async () => {
        let ids = []
        this.selectedRows.forEach((item) => {
            ids.push(item.id)
        })
        let res = await businessDelete(ids)
        if (res.code != 200) {
            NotificationWrap.error(res.msg)
            return
        }
        this.getTableData()
    }
    handleSearch=() => {
        this.setState({
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none'
            },
        }, () => {
            this.getTableData()
        })
    }
    handleChange=(value) => {
        this.keyword = value
    }
    render() {
        const { getTableData, columns, rowSelection } = this
        const { tableData, tableLoading, pagination, selectLength } = this.state
        return (
            <div className='settingsMain'>
                <Row className='settingsBtn' type='flex' justify='space-between' align='middle'>
                    <Col span={8}>
                        <Button className='addBtn' onClick={this.handleAddClick}>添加业务</Button>
                        <Button className='editBtn' onClick={this.handleEditClick} disabled={selectLength > 1}>编辑业务</Button>
                        <Button className='editBtn' onClick={this.showConfirm} disabled={selectLength === 0}>删除业务</Button>
                    </Col>
                    <Col span={16}>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col span={12} offset={10}>
                                <InputClose
                                    value={this.keyword}
                                    onPressEnter={this.handleSearch}
                                    handleInputChange={this.handleChange}
                                    onClear={() => this.handleSearch()}
                                />
                            </Col>
                            <Col span={2} style={{ textAlign: 'right' }}>
                                <Button onClick={this.handleSearch}>搜索</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <GeneralTable
                    ref={(node) => this.table = node}
                    tableProps={{
                        tableData,
                        columns,
                        rowSelection,
                        rowKey: 'id',
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

export default IntelligentSettings
