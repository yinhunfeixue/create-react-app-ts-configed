import EmptyIcon from '@/component/EmptyIcon'
import { ConfigProvider, Spin, Table } from 'antd'
import React, { Component } from 'react'
import { Resizable } from 'react-resizable'
import _ from 'underscore'
import './index.less'

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props
    if (!width) {
        return <th {...restProps} />
    }
    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    )
}

export default class GeneralTable extends Component {
    constructor(props) {
        super(props)
        this.pageSizeOptions = this.props.paginationProps.pageSizeOptions || ['10', '20', '30', '40', '50']
        this.state = {
            columns:
                this.props.tableProps.columns.map((item) => ({
                    ...item,
                    width: item.width || 100,
                })) || [],
            selectedRowKeys: [],
            scrollShow: this.props.scrollShow || false,
        }
        this.components = {
            header: {
                cell: ResizeableTitle,
            },
        }
        this.selectedRows = []
    }

    componentWillMount() {
        this.filteredProjects(this.props.tableProps.tableData)
    }

    componentWillReceiveProps(nextProps) {
        this.filteredProjects(nextProps.tableProps.tableData)
        if (nextProps.tableProps.columns !== this.state.columns) {
            this.setState({
                columns: nextProps.tableProps.columns,
            })
        }
    }

    // 给数据加上序号
    filteredProjects = (data) => {
        const { page, page_size } = this.props.paginationProps.pagination
        let orderNumber = ((page || 1) - 1) * (page_size || 10)
        let newData = []
        _.map(data, (node) => {
            node.key = ++orderNumber
            newData.push(node)
        })
        return newData
    }

    // 展示多少页
    showTotal = (total) => {
        const totalPageNum = Math.ceil(total / this.props.paginationProps.pagination.page_size)
        return (
            <span>
                总数 <b>{total}</b> 条
            </span>
        )
    }
    // 清空选择框
    clearCheckbox = () => {
        this.setState({
            selectedRowKeys: [],
        })
        this.selectedRows = []
    }
    // 页码改变
    changePagination = async (page) => {
        const param = { page }
        this.props.paginationProps.getTableData(param)
        this.setState({ selectedRowKeys: [] })
    }
    // 一页显示尺寸改变
    onShowSizeChange = (current, page_size) => {
        const param = { page: current, page_size }
        this.props.paginationProps.getTableData(param)
        this.setState({ selectedRowKeys: [] })
    }
    changeSelectKey = (arr) => {
        this.setState({ selectedRowKeys: arr })
    }
    handleResize =
        (index) =>
        (e, { size }) => {
            this.setState(({ columns }) => {
                const nextColumns = [...columns]
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                }
                return { columns: nextColumns }
            })
        }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows
        const { rowSelection } = this.props.tableProps
        if (rowSelection) {
            // rowSelection need assert
            const { onChange } = rowSelection
            onChange && onChange(selectedRowKeys, selectedRows)
        }
        this.setState({ selectedRowKeys })
    }

    handleRowClick = (selectedRowKeys, selectedRows, rowKey) => {
        const { rowSelection } = this.props.tableProps
        const stateSelectedRowKeys = this.state.selectedRowKeys
        if (rowSelection && rowSelection.type === 'radio') {
            const rowKeys = [selectedRowKeys]
            this.selectedRows = [selectedRows]
            this.setState({ selectedRowKeys: rowKeys })
        } else {
            if (stateSelectedRowKeys.indexOf(selectedRowKeys) > -1) {
                const rowKeys = stateSelectedRowKeys.filter((item) => item !== selectedRowKeys)
                this.selectedRows = this.selectedRows.filter((item) => item[rowKey] !== selectedRowKeys)
                this.setState({ selectedRowKeys: rowKeys })
            } else {
                stateSelectedRowKeys.push(selectedRowKeys)
                this.setState({ selectedRowKeys: stateSelectedRowKeys })
                this.selectedRows.push(selectedRows)
            }
        }
        if (rowSelection) {
            const { onChange } = rowSelection
            onChange && onChange(selectedRowKeys, this.selectedRows)
        }
    }

    render() {
        const { tableLoading, tableData, rowKey, scrollX, scrollY } = this.props.tableProps
        const { pagination, ...restProps } = this.props.paginationProps
        const { selectedRowKeys, scrollShow, columns } = this.state
        // const columns = this.state.columns.map((col, index) => {
        //     if (col.dataIndex == 'key') {
        //         col.width = 50
        //     }
        //
        //     return ({
        //         ...col,
        //         onHeaderCell: (column) => ({
        //             width: column.width || 100,
        //             onResize: this.handleResize(index),
        //         }),
        //     })
        // })

        console.log(columns, '------col----')
        let rowSelection = this.props.tableProps.rowSelection && {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: this.props.tableProps.rowSelection.type || 'checkbox',
        }
        // rowSelection.columnWidth = '20px'

        return (
            <Spin spinning={tableLoading}>
                <ConfigProvider
                    renderEmpty={() => {
                        return <EmptyIcon />
                    }}
                >
                    <Table
                        onRow={(record) => {
                            return {
                                onClick: (e) => {
                                    console.log(e)
                                    if (e.target.tagName === 'A' || e.target.className.indexOf('ant-select-selection') >= 0 || e.target.tagName === 'I' || e.target.tagName === 'INPUT') {
                                        return
                                    }
                                    this.handleRowClick(record[rowKey], record, rowKey)
                                },
                            }
                        }}
                        // components={this.components}
                        dataSource={tableData.slice()}
                        columns={columns}
                        pagination={
                            pagination.isNull
                                ? false
                                : {
                                      ...restProps,
                                      total: pagination.total,
                                      pageSize: pagination.page_size,
                                      current: pagination.page,
                                      style: {
                                          float: 'right',
                                          marginTop: 30,
                                          display: pagination.paginationDisplay,
                                      },
                                      onChange: this.changePagination,
                                      onShowSizeChange: this.onShowSizeChange,
                                      pageSizeOptions: this.pageSizeOptions,
                                      showTotal: this.showTotal,
                                  }
                        }
                        bordered={false}
                        // locale={{ emptyText: '暂无数据' }}
                        rowKey={rowKey || 'key'}
                        {...this.props}
                        rowSelection={rowSelection}
                        // scroll={{ x: scrollX || '100%', y: scrollY || '100%' }}
                        // scroll={!scrollShow ? { x: scrollX || '50%', y: scrollY || '50%' } : { x: scrollX || '100%', y: scrollY || '100%' }}
                    />
                </ConfigProvider>
            </Spin>
        )
    }
}
