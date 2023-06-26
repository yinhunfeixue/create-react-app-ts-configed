import React, { Component } from 'react'
import { Button, Tooltip } from 'antd';
import { CloseCircleOutlined, EditOutlined, CheckOutlined, ClockCircleOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import GeneralTable from 'app_page/dama/component/generalTable';
import { getBusiness, modelIndex, modelTableColumn } from 'app_api/modelApi';
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap';
import { observer } from 'mobx-react';
import InputClose from 'app_common/es/inputClose/inputClose';

@observer
class Step3 extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'ename',
                key: 'ename',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '字段中文名',
                dataIndex: 'cname',
                key: 'cname',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '关联标准项编码',
                dataIndex: 'standardId',
                key: 'standardId',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '关联标准项名称',
                dataIndex: 'standardName',
                key: 'standardName',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '表英文名',
                dataIndex: 'tableEname',
                key: 'tableEname',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '表中文名',
                dataIndex: 'tableCname',
                key: 'tableCname',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }, {
                title: '原因',
                dataIndex: 'reason',
                key: 'reason',
                render: (_) => <Tooltip title={_}>{_}</Tooltip>
            }
        ]
        this.state = {
            tableData: [],
            tableLoading: false,
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                paginationDisplay: 'none'
            },
        }
    }

    componentDidMount() {
        this.getTableData()
        this.timer = setInterval(this.loopSearch, 10000)
    }

    loopSearch = async() => {
        const { store } = this.props
        const { businessId } = store
        let param = {
            businessId,
            page: 1,
            page_size: 10
        }
        let res = await getBusiness(param)
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            return
        }
        store.status = res.data[0].status
        store.indexStatus = res.data[0].indexStatus
        store.metaIndexStatus = res.data[0].metaIndexStatus
        store.latestMetaIndexTime = res.data[0].latestMetaIndexTime
        store.latestIndexTime = res.data[0].latestIndexTime
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    getTableData = async (params) => {
        const { store } = this.props
        const { modelId, tableId } = store
        let param = { ...this.state.pagination, ...params, modelId, tableId, isIndex: false,keyword: this.keyword }
        this.setState({
            pagination: param,
            tableLoading: true
        })
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        let res = await modelTableColumn(param)
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
            tableData: res.data,
            pagination: {
                ...this.state.pagination,
                total: res.total,
                paginationDisplay: 'block',
            }
        })
    }

    onCancel=() => {
        const { isEdit } = this.props
        if (isEdit) {
            // this.props.removeTab('编辑业务')
            this.props.addTab('设置')
        } else {
            // this.props.removeTab('添加业务')
            this.props.addTab('设置')
        }
    }

    handleResetIndex = async () => {
        const { store } = this.props
        const { businessId, modelId } = store
        store.status = '创建索引中'
        store.metaIndexStatus = '1'
        store.indexStatus = '1'
        let res = await modelIndex({ businessId, modelId, reIndex: true })
        if (res.code != 200) {
            NotificationWrap.warning(res.msg)
            return
        }
        NotificationWrap.success('操作成功！')
    }

    render() {
        const { store } = this.props
        const { getTableData, rowSelection, columns } = this
        const { tableData, tableLoading, pagination } = this.state
        const { metaIndexStatus, indexStatus, latestMetaIndexTime, latestIndexTime, status } = store
        const META_MAP = {
            '0': () => <span><ClockCircleOutlined />{'元数据索引未开始'}</span>,
            '1': () => <span ><LoadingOutlined style={{ color: 'orange' }} />{'元数据索引进行中'}</span>,
            '2': () => <span ><CheckCircleOutlined style={{ color: 'green' }} />{`元数据索引构建完成${latestMetaIndexTime}`}</span>,
            '3': () => <span ><CloseCircleOutlined style={{ color: 'red' }} />{`元数据索引失败`}</span>,
        }
        const DATA_MAP = {
            '0': () => <span><ClockCircleOutlined />{'数据索引未开始'}</span>,
            '1': () => <span ><LoadingOutlined style={{ color: 'orange' }} />{'数据索引进行中'}</span>,
            '2': () => <span ><CheckCircleOutlined style={{ color: 'green' }} />{`数据索引构建完成   ${latestIndexTime}`}</span>,
            '3': () => <span ><CloseCircleOutlined style={{ color: 'red' }} />{`数据索引失败`}</span>,
        }
        return (
            <div>
                <div className='step3Icon'>
                    <span><CheckCircleOutlined /> 配置保存成功 </span>
                    <span>{META_MAP[metaIndexStatus]()}</span>
                    <span>{DATA_MAP[indexStatus]()}</span>
                </div>
                <div>
                    <div className='stepSearch'>
                        <InputClose
                            value={this.keyword}
                            onPressEnter={() => this.getTableData()}
                            onClear={() => this.getTableData()}
                            handleInputChange={(e) => this.keyword = e}
                            placeholder="请输入字段中英文名、表中英文名搜索" 
                        />
                        <Button type='primary' onClick={() => this.getTableData()}>搜索</Button>
                    </div>
                    <GeneralTable
                        title={() => <b>不可访问字段列表</b>}
                        tableProps={{
                            tableData,
                            columns,
                            rowSelection,
                            rowKey: 'columnId',
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
                <div>
                    <Button className='step2Btn' onClick={() => this.props.prev()}>上一步</Button>
                    <Button className='step2Btn' onClick={this.onCancel}>关闭页面</Button>
                    {status === '索引失败' && <Button type="primary" onClick={this.handleResetIndex}>重建索引</Button>}
                </div>
            </div>
        )
    }
}

export default Step3
