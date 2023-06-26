import { Button, message, Modal, Table } from 'antd'
import { PanelContainer } from 'app_common'
import React, { Component } from 'react'
import { Resizable } from 'react-resizable'
import _ from 'underscore'
import './style.less'

const confirm = Modal.confirm
/*
  props:

       filter:左侧按钮 {}
          {
            editBtnOption：{
              show：true/false, 是否显示
              text:"" ，按钮文字
              clickFunction ：function（）{} 点击执行方法
            },
            lookBtnOption：{
              show：true/false, 是否显示
              text:"" ，按钮文字
              clickFunction ：function（）{} 点击执行方法
            },
            cancelBtnOption：{
              show：true/false, 是否显示
              text:"" ，按钮文字
              clickFunction ：function（）{} 点击执行方法,
              title:""确认删除的标题，
              content：“”确认删除的内容
            }
          }
*/

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

        this.state = {
            tableLoading: true,
            tableData: [],
            pagination: {},
            selectedRows: [],
            selectedRowKeys: [],
            columns: [],
            editDisabled: true,
            scrollShow: this.props.scrollShow || false,
        }

        this.components = {
            header: {
                cell: ResizeableTitle,
            },
        }

        this.orderNumber = 0
        this.prevCustomSelectData = {}
        this.pageSizeOptions = this.props.paginationProps.pageSizeOptions || ['10', '20', '30', '40', '50']
        this.selectedRows = []
    }

    componentWillMount() {
        this.clearSelectedRows()
        this.resetTableInfo(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.resetTableInfo(nextProps)
        if (nextProps.columns) {
            this.setState({
                columns: nextProps.columns,
            })
        }
    }

    resetTableInfo = (nextProps) => {
        const tableData = this.filteredProjects(nextProps)
        this.setState({
            tableData,
            columns:
                nextProps.tableProps.columns.map((item) => ({
                    ...item,
                    width: item.width || 100,
                })) || [],
            tableLoading: false,
            pagination: nextProps.paginationProps.pagination,
        })
        if (!this.props.tableProps.notClearSelectedRowKeys) {
            this.setState({
                selectedRowKeys: [],
                selectedRows: [],
            })
        }
    }

    clearSelectedRows = () => {
        this.selectedRows = []
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    onEdit = () => {
        if (this.selectedRows.length == 0) {
            message.warning(`请选择要${this.props.filter.editBtnOption.text ? this.props.filter.editBtnOption.text : '修改'}的项!`)
        } else {
            if (this.selectedRows.length > 1) {
                message.warning(`只能单条${this.props.filter.editBtnOption.text ? this.props.filter.editBtnOption.text : '修改'}！`)
            } else {
                this.props.filter.editBtnOption.clickFunction(this.selectedRowKeys, this.selectedRows)
            }
        }
    }

    onLook = () => {
        if (this.selectedRows.length == 0) {
            message.warning(`请选择要${this.props.filter.lookBtnOption.text ? this.props.filter.lookBtnOption.text : '查看'}的项!`)
        } else {
            if (this.selectedRows.length > 1) {
                message.warning(`只能单条${this.props.filter.lookBtnOption.text ? this.props.filter.lookBtnOption.text : '查看'}！`)
            } else {
                this.props.filter.lookBtnOption.clickFunction(this.state.selectedRowKeys, this.selectedRows)
            }
        }
    }

    onCancel = (d) => {
        let _this = this
        if (this.selectedRows.length < 1) {
            message.warning('请至少选择一条要删除的项！')
        } else {
            if (this.props.tableProps.singleCancel) {
                if (this.selectedRows.length > 1) {
                    message.warning('只能单项删除！')
                    return
                }
            }
            confirm({
                title: _this.props.filter.cancelBtnOption.title ? _this.props.filter.cancelBtnOption.title : '是否确定删除当前选择的项',
                content: _this.props.filter.cancelBtnOption.content ? _this.props.filter.cancelBtnOption.content : null,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.props.filter.cancelBtnOption.clickFunction(_this.selectedRowKeys, _this.selectedRows)
                },
                onCancel() {
                    // console.log('Cancel')
                },
            })
        }
    }

    // 给数据加上序号
    filteredProjects = (nextProps) => {
        const { page, page_size } = nextProps.paginationProps.pagination
        let newData = []
        this.orderNumber = (page - 1) * page_size
        _.map(nextProps.tableProps.tableData, (node) => {
            // 处理后端返回 null的数据
            //  console.log(node,'nodenodenode')
            if (node) {
                node.key = ++this.orderNumber
                newData.push(node)
            }
        })
        return newData
    }

    resetOrderNumber = () => {
        this.orderNumber = 0
    }

    setTableLoading = () => {
        this.setState({
            tableLoading: true,
        })
    }

    hideTableLoading = () => {
        this.setState({
            tableLoading: false,
        })
    }

    // 展示多少页
    showTotal = () => {
        const totalPageNum = Math.ceil(this.props.paginationProps.pagination.total / this.props.paginationProps.pagination.page_size)
        return `共${totalPageNum}页，${this.props.paginationProps.pagination.total}条数据`
    }

    // 页码改变
    changePagination = (page) => {
        this.setTableLoading()
        const param = { page }
        this.props.getTableData(param)
        this.clearSelectedRows()
    }

    // 一页显示尺寸改变
    onShowSizeChange = (current, page_size) => {
        this.setTableLoading()
        const param = { page: 1, page_size }
        this.props.getTableData(param)
        this.clearSelectedRows()
    }

    selectedRowsChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows, 'selectedRows')
        this.setState({
            selectedRowKeys,
            selectedRows,
            editDisabled: !selectedRows.length < 2,
        })

        // const {rowSelection} = this.props.tableProps
        // rowSelection&&rowSelection(selectedRowKeys, selectedRows)
    }

    handleResize =
        (index) =>
        (e, { size }) => {
            // console.log(index)
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

        this.setState(
            {
                selectedRowKeys,
                editDisabled: selectedRows.length !== 1,
            },
            () => {
                const { rowSelection } = this.props.tableProps
                rowSelection && rowSelection(selectedRowKeys, selectedRows)
            }
        )
    }

    handleRowClick = (selectedRowKeys, selectedRows, rowKey) => {
        const { rowSelection } = this.props.tableProps
        const stateSelectedRowKeys = this.state.selectedRowKeys
        if (rowSelection && rowSelection.type === 'radio') {
            const rowKeys = [selectedRowKeys]
            this.selectedRows = [selectedRows]
            this.setState({
                selectedRowKeys: rowKeys,
                editDisabled: this.selectedRows.length !== 1,
            })
        } else {
            if (stateSelectedRowKeys.indexOf(selectedRowKeys) > -1) {
                const rowKeys = stateSelectedRowKeys.filter((item) => item !== selectedRowKeys)
                this.selectedRows = this.selectedRows.filter((item) => item[rowKey] !== selectedRowKeys)
                this.setState({
                    selectedRowKeys: rowKeys,
                    editDisabled: this.selectedRows.length !== 1,
                })
            } else {
                stateSelectedRowKeys.push(selectedRowKeys)
                this.selectedRows.push(selectedRows)
                this.setState({
                    selectedRowKeys: stateSelectedRowKeys,
                    editDisabled: this.selectedRows.length !== 1,
                })
            }
        }
        rowSelection && rowSelection(selectedRowKeys, this.selectedRows)
    }

    render() {
        const { rowKey, bordered, showQuickJumper, showSizeChanger, scrollY, scrollX, rowSelectionType, noSelect, rowClassName } = this.props.tableProps

        const { tableLoading, tableData, pagination, selectedRowKeys, editDisabled, scrollShow } = this.state

        const { ...restProps } = this.props.paginationProps

        const rowSelection = {
            columnWidth: '40px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
            type: rowSelectionType || 'checkbox',
        }

        const columns = this.state.columns.map((col, index) => {
            if (col.dataIndex == 'key') {
                col.width = 50
            }

            return {
                ...col,
                onHeaderCell: (column) => ({
                    width: column.width || 60,
                    onResize: this.handleResize(index),
                }),
            }
        })

        const propsFilter = this.props.filter
        const filter = (
            <div className='top_filter'>
                {propsFilter && propsFilter.addBtnOption && propsFilter.addBtnOption.show ? (
                    <Button className='addBtn' onClick={propsFilter.addBtnOption.clickFunction}>
                        {propsFilter.addBtnOption.text ? propsFilter.addBtnOption.text : '添加'}
                    </Button>
                ) : null}
                {propsFilter && propsFilter.editBtnOption && propsFilter.editBtnOption.show ? (
                    <Button className='editBtn' onClick={this.onEdit} disabled={editDisabled}>
                        {propsFilter.editBtnOption.text ? propsFilter.editBtnOption.text : '修改'}
                    </Button>
                ) : null}
                {propsFilter && propsFilter.cancelBtnOption && propsFilter.cancelBtnOption.show ? (
                    <Button className='editBtn' onClick={this.onCancel}>
                        {propsFilter.cancelBtnOption.text ? propsFilter.cancelBtnOption.text : '删除'}
                    </Button>
                ) : null}
                {propsFilter && propsFilter.lookBtnOption && propsFilter.lookBtnOption.show ? (
                    <Button className='editBtn' onClick={this.onLook} disabled={editDisabled}>
                        {propsFilter.lookBtnOption.text ? propsFilter.lookBtnOption.text : '查看详情'}
                    </Button>
                ) : null}
                {propsFilter && propsFilter.otherBtn ? propsFilter.otherBtn : null}
            </div>
        )

        return (
            <PanelContainer hasFilter={filter}>
                <div className='tableCompCss'>
                    <Table
                        onRow={(record) => {
                            return {
                                onClick: (e) => {
                                    if (e.target.tagName === 'A') {
                                        return
                                    }
                                    this.handleRowClick(record[rowKey], record, rowKey)
                                },
                            }
                        }}
                        loading={tableLoading}
                        components={this.components}
                        dataSource={tableData ? tableData.slice() : []}
                        columns={columns}
                        pagination={
                            this.props.paginationProps.pagination
                                ? this.props.hiddenPagination
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
                                          showSizeChanger: showSizeChanger || true,
                                          onShowSizeChange: this.onShowSizeChange,
                                          pageSizeOptions: this.pageSizeOptions,
                                          showTotal: this.showTotal,
                                          showQuickJumper: showQuickJumper || true,
                                      }
                                : false
                        }
                        bordered={bordered || true}
                        rowClassName={rowClassName}
                        locale={{ emptyText: '暂无数据' }}
                        rowSelection={noSelect ? false : rowSelection}
                        rowKey={rowKey || 'key'}
                        {...this.props}
                        // scroll={{ x: scrollX || '110%', y: scrollY || '100%' }}
                        // scroll={!scrollShow ? false : { x: scrollX || '100%', y: scrollY || '100%' }}
                    />
                </div>
            </PanelContainer>
        )
    }
}
