import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import './index.less'

export default class ExpandTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            total: 0,
            page: 1,
            pageSize: 10,
            tableKey: '0',
            expandedRowKeys: []
        }
        this.columns = []
    }
    componentDidMount = () => {
        this.getTableList()
    }
    setNewData = (data) => {
        this.setState({
            dataSource: [...data]
        })
    }
    getTableList = async (filters, sorter, extra) => {
        const { requestListFunction } = this.props
        const { page, pageSize } = this.state
        this.setState({ loading: true, tableKey: '0' })
        requestListFunction(page, pageSize, filters, sorter, extra)
            .then((data) => {
                if (data) {
                    this.setState({
                        dataSource: data.dataSource,
                        total: data.total,
                    })
                } else {
                    this.setState({
                        dataSource: [],
                        total: 0
                    })
                }
                this.forceUpdate()
            })
            .finally(() => {
                this.setState({ loading: false, tableKey: '1' })
                if (this.props.defaultExpandAll) {
                    let expandedRowKeys = []
                    this.state.dataSource.map((item) => {
                        expandedRowKeys.push(item.id)
                    })
                    this.setState({
                        expandedRowKeys
                    })
                }
            })
    }
    reset = async () => {
        await this.setState({
            page: 1
        })
        this.getTableList()
    }
    changePage = async (pagination, filters, sorter, extra) => {
        await this.setState({
            page: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            expandedRowKeys: []
        })
        this.getTableList(filters, sorter, extra)
    }
    expandedRowRender = (record, index) => {
        const { expandedRowRenderDetail, expandable } = this.props
        if (expandable) {
            return expandedRowRenderDetail(record, index)
        } else {
            return null
        }
    }
    customExpandIcon = (props) => {
        if (props.expanded) {
            return (
                <a style={{ color: '#5E6266' }} onClick={e => {
                    props.onExpand(props.record, e);
                }}><CaretDownOutlined style={{ fontSize: 12 }} /></a>
            );
        } else {
            return (
                <a style={{ color: '#5E6266' }} onClick={e => {
                    props.onExpand(props.record, e);
                }}><CaretRightOutlined style={{ fontSize: 12 }} /></a>
            );
        }
    }
    onExpandedRowsChange = (expandRows) => {
        this.setState({
            expandedRowKeys: expandRows
        })
    }
    toggle = (value) => {
        let { expandedRowKeys, dataSource } = this.state
        if (value == 1) {
            expandedRowKeys = []
            dataSource.map((item) => {
                expandedRowKeys.push(item.id)
            })
            this.setState({
                expandedRowKeys
            })
        } else {
            this.setState({
                expandedRowKeys: []
            })
        }
    }
    render() {
        const {
            page,
            pageSize,
            dataSource,
            total,
            loading,
            tableKey,
            expandedRowKeys
        } = this.state
        const { tableProps, expandable, renderSearch } = this.props
        return (
            <div className='expandTable'>
                {renderSearch()}
                <div style={{position: 'relative' }}>
                    {
                        expandable ? <span>
                            {
                                expandedRowKeys.length ? <span onClick={this.toggle.bind(this, '0')} className='expandIcon iconfont icon-shouqi3'></span> : <span onClick={this.toggle.bind(this, '1')} className='expandIcon iconfont icon-zhankai3'></span>
                            }
                        </span> : null
                    }
                    <Table
                        loading={loading}
                        className={!expandable ? 'hideExpandTable' : ''}
                        // expandIconAsCell={expandable}
                        expandIconColumnIndex={expandable ? 0 : -1}
                        dataSource={dataSource}
                        expandedRowRender={this.expandedRowRender}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowKeys={expandedRowKeys}
                        onExpandedRowsChange={this.onExpandedRowsChange}
                        onChange={this.changePage}
                        pagination={
                            {
                                total: total,
                                pageSize: pageSize,
                                current: page,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => (
                                    <span>
                                              总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                          </span>
                                ),
                            }
                        }
                        key={tableKey}
                        {...tableProps}
                    />
                </div>
            </div>
        )
    }
}