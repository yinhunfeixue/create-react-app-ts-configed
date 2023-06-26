import React, { Component } from 'react'
import { message, Modal, Row, Switch, Tooltip, Select } from 'antd'
import { PlusCircleFilled, EditOutlined, CheckOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import GeneralTable from 'app_page/dama/component/generalTable'
import { modelTableColumn, postModelTableColumn } from 'app_api/modelApi'
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'

const Option = Select.Option

@observer
class FieldSettingModal extends Component {
    constructor(props) {
        super(props)
        const { store, isDetail } = this.props.param
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 40,
            },
            {
                title: '字段英文名',
                dataIndex: 'ename',
                key: 'ename',
                render: (_, record) => (
                    <Tooltip title={_}>
                        <a
                            onClick={() => {
                                this.props.addTab('字段详情', { id: record.columnId })
                                store.visible = false
                            }}
                        >
                            {_}
                        </a>
                    </Tooltip>
                ),
            },
            {
                title: '字段中文名',
                dataIndex: 'cname',
                key: 'cname',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>,
            },
            {
                title: '关联标准项编码',
                dataIndex: 'standardId',
                key: 'standardId',
                render: (_, record) => (
                    <Tooltip title={_}>
                        <a
                            onClick={() => {
                                this.props.addTab('标准详情', { id: record.standardId })
                                store.visible = false
                            }}
                        >
                            {_}
                        </a>
                    </Tooltip>
                ),
            },
            {
                title: '关联标准项名称',
                dataIndex: 'standardName',
                key: 'standardName',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>,
            },
            {
                title: '引用代码',
                dataIndex: 'codeItemName',
                key: 'codeItemName',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>,
            },
            {
                title: '时间字段格式',
                dataIndex: 'timeFormat',
                key: 'timeFormat',
                width: 280,
                render: (_, record) => (
                    <span>
                        {isDetail ? (
                            _
                        ) : (
                            <span>
                                {
                                    //! record.isTimeField ? '-----' :
                                    !record.hasTimeField && (
                                        <a
                                            onClick={() => {
                                                record.hasTimeField = true
                                                this.setState({
                                                    tableData: this.state.tableData,
                                                })
                                            }}
                                        >
                                            <Tooltip title={_}>{_}</Tooltip>
                                            <EditOutlined />
                                        </a>
                                    )
                                }
                                {record.hasTimeField && (
                                    <span>
                                        <Select
                                            style={{ width: 240 }}
                                            dropdownStyle={{ minWidth: 280 }}
                                            onSelect={(value) => {
                                                record.timeFormat = value
                                            }}
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
                                            <Option value='yyyyMMdd HH:mm:ss'>yyyyMMdd HH:mm:ss(20180108 01:08:08)</Option>
                                            <Option value='yyyy-MM-dd HH:mm:ss'>yyyy-MM-dd HH:mm:ss(2018-01-08 01:08:08)</Option>
                                            <Option value='yyyy/MM/dd HH:mm:ss'>yyyy/MM/dd HH:mm:ss(2018/01/08 01:08:08)</Option>
                                        </Select>
                                        <a
                                            onClick={() => {
                                                this.handleChange(record)
                                            }}
                                        >
                                            <Icon type='check' />
                                        </a>
                                    </span>
                                )}
                            </span>
                        )}
                    </span>
                ),
            },
            {
                title: '是否可访问',
                dataIndex: 'isIndex',
                key: 'isIndex',
                render: (_, record) => (
                    <span>
                        {!record.reason ? (
                            <Switch
                                disabled={isDetail}
                                defaultChecked={_}
                                onChange={(isChecked) => {
                                    record.isIndex = isChecked
                                    this.handleChange(record)
                                }}
                            />
                        ) : (
                            '-----'
                        )}
                    </span>
                ),
            },
            {
                title: '原因',
                dataIndex: 'reason',
                key: 'reason',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>,
                width: 200,
            },
        ]

        this.state = {
            tableData: [],
            tableLoading: false,
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none',
            },
        }
    }

    componentDidMount() {
        console.log(this.state)
        const { store } = this.props
        store.getTableData = this.getTableData
    }

    handleChange = async (record) => {
        const { store } = this.props
        const { modelId, businessId } = store
        let param = { ...record, modelId, businessId }
        let res = await postModelTableColumn(param)
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            return
        }
        NotificationWrap.success('操作成功')
        this.getTableData()
    }

    getTableData = async (params) => {
        const { store } = this.props
        const { modelId, tableId } = store
        let param = { ...this.state.pagination, ...params, modelId, tableId }
        this.setState({
            pagination: param,
            tableLoading: true,
        })
        if (store.param.detail && store.param.detail.type) {
            param.type = store.param.detail.type
            param.businessId = store.businessId
        }
        let res = await modelTableColumn(param)
        if (res.code != 200) {
            this.setState({
                tableLoading: false,
            })
            return
        }
        if (res.data.length === 0 && this.state.pagination.page !== 1) {
            this.getTableData({ page: this.state.pagination.page - 1 || 1 })
            return
        }
        this.setState({
            tableLoading: false,
            tableData: res.data,
            pagination: {
                ...this.state.pagination,
                total: res.total,
                paginationDisplay: 'block',
            },
        })
        this.selectedRows = []
    }
    onCancel = () => {
        const { store } = this.props
        store.visible = false
        this.setState({
            tableData: [],
            tableLoading: false,
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none',
            },
        })
    }
    render() {
        const { store, ...restProps } = this.props
        const { getTableData, columns } = this
        const { tableData, tableLoading, pagination } = this.state
        const { visible, tableCname, tableEname } = store
        return (
            <Modal visible={visible} width={1200} onCancel={this.onCancel} {...restProps} onOk={this.onCancel}>
                <p>
                    <span style={{ marginRight: 20 }}>
                        <b>表中文名：</b>
                        {tableCname}
                    </span>
                    <span style={{ marginRight: 20 }}>
                        <b>表英文名：</b>
                        {tableEname}
                    </span>
                    <span>
                        <b>Tips:</b>切换用户是否可以访问字段,如无法切换状态，请参考原因进行调整。
                    </span>
                </p>
                <Row>
                    <GeneralTable
                        tableProps={{
                            tableData,
                            columns,
                            rowKey: 'columnId',
                            tableLoading,
                        }}
                        paginationProps={{
                            pagination,
                            getTableData,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Row>
            </Modal>
        )
    }
}
export default FieldSettingModal
