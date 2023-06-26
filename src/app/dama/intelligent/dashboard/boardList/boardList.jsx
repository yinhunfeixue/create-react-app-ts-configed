import React, { Component } from 'react'
import { getBoardList, deleteBoard } from 'app_api/dashboardApi'
import { Input, Button, Table, Modal, message, Spin, Tooltip } from 'antd'
import Warn from 'app_images/warn.png'
import { NotificationWrap } from 'app_common'
import './index.less'
const { Search } = Input
export default class dataManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pagination: {
                total: '',
                page: 1,
                page_size: 10,
                // paginationDisplay: 'none'
            },
            keyword: '',
            // eslint-disable-next-line react/no-unused-state
            type: false,
            tableData: [],
            dataname: '',
            deleteVisable: false,
            dataId: 0,
            loading: false
        }
        this.columns = [
            {
                title: '数据看板名称',
                dataIndex: 'name',
                key: 'name',
                className: 'centerRow',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    )
                }
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                className: 'centerRow'
            },
            // {
            //     title: '更新时间',
            //     dataIndex: 'updateTime',
            //     key: 'updateTime',
            //     className: 'centerRow'
            // },
            {
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator',
                className: 'centerRow'
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                className: 'centerRow',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={this.goDataSet.bind(this, record.id)}>查看看板</a>
                            <a> | </a>
                            <a onClick={this.onDel.bind(this, record.id, record.name)}>删除看板</a>
                        </div>
                    )
                }
            },
        ]
    }

    componentDidMount = () => {
        let params = {
            ...this.state.pagination,

        }
        this.getTableData(params)
    }
    onDel = async (id, name) => {
        this.setState({
            deleteVisable: true,
            dataname: name,
            dataId: id
        })
    }

    getTableData = async (params) => {
        this.setState({
            loading: true
        })
        params.hideReports = true
        let res = await getBoardList(params)
        if (res.code === 200) {
            let pagination = {
                page: params.page,
                page_size: params.page_size,
            }
            pagination.total = res.total
            let tableData = []
            res.data.map((value, index) => {
                tableData.push({ key: index, ...value })
            })
            this.setState({
                tableData,
                pagination,
                loading: false
            })
        }
    }
    // 获取关键字
    getKeyWord = (value) => {
        let pagination = {
            page: 1,
            page_size: 10,
            // paginationDisplay: 'none'
        }
        this.setState({
            keyword: value
        })
        let params = { ...pagination, keyword: value }
        this.getTableData(params)
    }
    // 改变页码
    changePage = (page) => {
        let pagination = {
            ...this.state.pagination
        }
        pagination.page = page
        let params = { ...pagination }
        let { keyword } = this.state
        if (keyword && keyword.length > 0) {
            params.keyword = keyword
        }
        this.getTableData(params)
    }
    // 改变页码
    onShowSizeChange = (current, size) => {
        let pagination = {
            ...this.state.pagination
        }
        pagination.page = 1
        pagination.page_size = size
        let params = { ...pagination }
        let { keyword } = this.state
        if (keyword && keyword.length > 0) {
            params.keyword = keyword
        }
        this.getTableData(params)
    }
    // 跳转数据配置
    goDataSet = (id) => {
        let param = { id }
        this.props.addTab('dashboardEdit', param)
    }
    handleCancel = () => {
        this.setState({
            deleteVisable: false
        })
    }
    onDelete = async () => {
        let { keyword, dataId } = this.state
        let res = await deleteBoard({ id: dataId })
        if (res.code === 200) {
            message.success('删除成功')
            let params = {
                page: 1,
                page_size: 10,
            }
            if (keyword && keyword.length > 0) {
                params.keyword = keyword
            }
            this.setState({
                deleteVisable: false
            })
            this.getTableData(params)
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    render() {
        const { pagination, tableData, dataname, deleteVisable, loading } = this.state
        return (
            <div className='boardList'>
                <div className='searchForm'>
                    <div className='searchLeft'>
                        <Search
                            placeholder='输入数据名称'
                            onSearch={this.getKeyWord}
                            style={{ width: 200 }}
                            maxLength={50}
                        />
                    </div>
                </div>
                <div className='content'>
                    <Spin spinning={loading}>
                        <Table
                            columns={this.columns}
                            dataSource={tableData}
                            rowKey='id'
                            loading={false}
                            bordered
                            pagination={
                                pagination.total >= 10 ? {
                                    current: pagination.page,
                                    pageSize: pagination.page_size,
                                    total: pagination.total,
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    onChange: this.changePage,
                                    onShowSizeChange: this.onShowSizeChange
                                } : false
                            }
                        />
                    </Spin>
                </div>
                <Modal
                    title='删除看板'
                    visible={deleteVisable}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div style={{ textAlign: 'center', height: '40px', lineHeight: '24px' }}><img src={Warn} style={{ marginRight: '10px' }} />您确认删除看板吗？</div>
                    <div style={{ textAlign: 'right' }}><Button onClick={this.handleCancel} style={{ marginRight: '20px' }}>取消</Button><Button type='primary' onClick={this.onDelete}>确定</Button></div>
                </Modal>
            </div>
        )
    }
}
