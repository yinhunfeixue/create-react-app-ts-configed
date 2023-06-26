import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Table } from 'antd';
import React, { Component } from 'react'
import { Resizable } from 'react-resizable'
import _ from 'underscore'
// import Highlighter from 'react-highlight-words';
import ColumnsFilterOptions from './columnsFilterOptions'
import './style.less'

const { Search } = Input
const { Option } = Select

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

export default class LzTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchText: {},
            searchedColumn: '',
            filtered: true,
            dropdownOpen: false,
            tableData: [],
            pagination: this.props.pagination || {},
            columns: this.props.columns || {},
            current: 1,
            pageSize: this.props.pageSize || 10,
            filterSelectedList: this.props.filterSelectedList || {}, // 各字段选中条件
            filterCheckedItems: {}, // 各字段选中的 option 选项
            filterOptionsList: {}, // 各字段备选项
            selectedRowKeys: [],
            filterDropdownVisible: false,
        }
        this.components = {
            header: {
                cell: ResizeableTitle,
            },
        }

        this.filterOptions = {}
    }

    componentDidMount = () => {
        this.init()
    }

    componentWillReceiveProps = (nextProps) => {
        this.setColumns(nextProps.columns)
    }

    init = async () => {
        this.setColumns(this.props.columns)
    }

    setColumnsField = (columns) => {
        let columnsInfo = [...columns]
        _.map(columnsInfo, (n, k) => {
            if (n.operateType == 'serachSelect' || n.operateType == 'searchAndSelect') {
                columnsInfo[k] = {
                    ...n,
                    ...this.getColumnFilterMultipleProps(n.dataIndex, n.operateType),
                }
            } else if (n.operateType == 'serach') {
                columnsInfo[k] = {
                    ...n,
                    ...this.getColumnSearchProps(n.dataIndex),
                }
            }

            if (n.children) {
                columnsInfo[k]['children'] = this.setColumnsField(n.children)
            }
        })

        return columnsInfo
    }

    setColumns = (columns) => {
        let columnsData = this.setColumnsField(columns)
        this.setState({
            columns: columnsData,
        })
    }

    /**
     * 当前表格需要渲染的数据设置
     *
     * @param {*} data
     * @param {*} param
     */
    setTableData = async (data, param) => {
        console.log(data, param, '------param---setTableData---')
        await this.setState({
            current: param.page || this.state.current,
            pageSize: param.pageSize || this.state.pageSize,
        })

        if (data) {
            let tableData = data.data
            let posStart = (this.state.current - 1) * this.state.pageSize
            console.log(this.state.current, this.state.pageSize, posStart)
            // let filterOptionsList = this.state.filterOptionsList
            // let filterCheckedItems = this.state.filterCheckedItems
            // // let filterSelectedList = {}console.log()
            _.map(tableData, (n, k) => {
                console.log(posStart + k + 1)
                tableData[k]['key'] = posStart + k + 1
            })
            // if (param.filterOptionsList) {
            //     filterCheckedItems = { ...param.filterOptionsList }
            //     filterOptionsList = { ...param.filterOptionsList }
            // }

            // console.log(filterOptionsList, tableData, '------param---setTableData- filterSelectedList--')

            this.setState({
                // filterSelectedList: param.filterSelectedList,
                // filterOptionsList,
                // filterCheckedItems,
                tableData,
                pagination: {
                    ...this.state.pagination,
                    total: data.total,
                },
            })
        }
    }

    initFieldSelectFilter = (param) => {
        let filterOptionsList = this.state.filterOptionsList
        let filterCheckedItems = this.state.filterCheckedItems

        if (param.filterOptionsList) {
            filterCheckedItems = { ...param.filterOptionsList }
            filterOptionsList = { ...param.filterOptionsList }
        }

        this.setState({
            filterSelectedList: param.filterSelectedList,
            filterOptionsList,
            filterCheckedItems,
        })
    }

    /**
     *  下拉框选择后，确定筛选操作回调
     *
     * @param {*} dataIndex // 当前操作列
     */
    handleSearchFilter = (dataIndex, confirm) => {
        if (dataIndex) {
            let filterSelectedList = this.state.filterSelectedList

            this.setState(
                {
                    current: 1,
                    filterSelectedList,
                    // filterDropdownVisible: false
                },
                () => {
                    this.props.getTableList &&
                        this.props.getTableList({
                            // dataIndex,
                            // 'reqFrom': 'table',
                            filterSelectedList,
                            pagination: {
                                page: 1,
                                page_size: this.state.pageSize,
                            },
                        })
                }
            )
        }
        confirm()
    }

    /**
     * 字段重置操作：清除当前列的条件选中效果，并执行表格内容的搜索
     * @param {*} dataIndex // 当前操作列
     */
    handleSearchFilterReset = (dataIndex, clearFilters) => {
        clearFilters()
        let filterSelectedList = this.state.filterSelectedList
        let filterOptionsList = this.state.filterOptionsList
        let filterCheckedItems = this.state.filterCheckedItems

        if (filterSelectedList[dataIndex]) {
            delete filterSelectedList[dataIndex]
        }

        if (filterOptionsList[dataIndex]) {
            delete filterOptionsList[dataIndex]
        }

        if (filterCheckedItems[dataIndex]) {
            delete filterCheckedItems[dataIndex]
        }

        this.setState(
            {
                current: 1,
                filterSelectedList,
                filterOptionsList,
                filterCheckedItems,
            },
            () => {
                // this.handleSearchFilter(dataIndex)
                this.props.getTableList &&
                    this.props.getTableList({
                        // dataIndex,
                        // 'reqFrom': 'table',
                        filterSelectedList,
                        pagination: {
                            page: 1,
                            page_size: this.state.pageSize,
                        },
                    })
            }
        )
    }

    handleReset = (clearFilters, dataIndex) => {
        clearFilters()
        this.state.searchText[dataIndex] = ''
        this.setState({ searchText: this.state.searchText })

        let filterSelectedList = this.state.filterSelectedList

        if (filterSelectedList[dataIndex]) {
            delete filterSelectedList[dataIndex]
        }
        this.setState(
            {
                current: 1,
                filterSelectedList,
            },
            () => {
                // this.handleSearchFilter(dataIndex)
                this.props.getTableList &&
                    this.props.getTableList({
                        // dataIndex,
                        // 'reqFrom': 'table',
                        filterSelectedList,
                        pagination: {
                            page: 1,
                            page_size: this.state.pageSize,
                        },
                    })
            }
        )
    }

    /**
     * 下拉框筛选变动时，回调函数
     * @param {*} dataIndex
     * @param {*} checkedValues
     * @param {*} checkedItems
     */
    onFieldSelectChange = (dataIndex, checkedValues, checkedItems) => {
        console.log(dataIndex, '______dataIndex______')
        console.log('checked = ', checkedValues, dataIndex, checkedItems)
        let filterSelectedList = this.state.filterSelectedList
        filterSelectedList[dataIndex] = checkedValues
        let filterCheckedItems = this.state.filterCheckedItems
        filterCheckedItems[dataIndex] = checkedItems
        this.setState({
            filterSelectedList,
            filterCheckedItems,
        })
    }

    /**
     * 筛选下拉框搜索回调
     * @param {*} dataIndex // 操作的字段
     * @param {*} value // 搜索关键词
     */
    onFilterSearch = async (dataIndex, value = '') => {
        // let data = []
        let options = []
        let filterSelectedList = this.state.filterSelectedList
        let filterCheckedItems = this.state.filterCheckedItems
        console.log(filterSelectedList, filterCheckedItems, '------onFilterSearch-----')
        // this.filterOptions[dataIndex].setLoading(true)

        if (this.props.onFilterSearch) {
            let checkedItems = []

            if (filterCheckedItems && filterCheckedItems[dataIndex]) {
                // 保留已勾选过的选择项
                _.map(filterCheckedItems[dataIndex], (n, k) => {
                    checkedItems.push(n.id)
                })
                options = [...filterCheckedItems[dataIndex]]
            }

            let data = await this.props.onFilterSearch({
                dataIndex,
                value,
                filterSelectedList,
            })
            if (checkedItems.length > 0) {
                // 追加的选项 和 已经勾选的选项 去重
                _.map(data, (n, k) => {
                    if (!checkedItems.includes(n.id)) {
                        options.push(n)
                    }
                })
            } else {
                options = data
            }
            console.log(data, '-----------lzTable---onFilterSearch-----------')
        }

        console.log(dataIndex, options, filterSelectedList, '-----------lzTable---onFilterSearch-----------')

        this.filterOptions[dataIndex] && this.filterOptions[dataIndex].setDataOptions(options, filterSelectedList[dataIndex] || [])
        let filterOptionsList = this.state.filterOptionsList
        filterOptionsList[dataIndex] = options
        this.setState({
            filterOptionsList,
            filterSelectedList,
        })
    }

    /**
     * 字段筛选按钮点击下拉框显示时触发回调
     * @param {*} dataIndex
     */
    onShowFilterOptions = (visible, dataIndex, operateType) => {
        if (!visible) {
            return
        }
        let filterSelectedList = this.state.filterSelectedList
        let filterCheckedItems = this.state.filterCheckedItems
        let filterOptionsList = this.state.filterOptionsList
        // this.filterOptions[dataIndex].setLoading(true)

        if (
            filterCheckedItems &&
            filterSelectedList &&
            filterSelectedList[dataIndex] &&
            filterCheckedItems[dataIndex] &&
            filterSelectedList[dataIndex].length > 0 &&
            operateType == 'searchAndSelect'
        ) {
            this.filterOptions[dataIndex].setDataOptions(filterCheckedItems[dataIndex], filterSelectedList[dataIndex])
            // this.filterOptions[dataIndex].setLoading(false)
            this.setState({
                filterOptionsList: { ...filterCheckedItems },
            })
        } else {
            this.onFilterSearch(dataIndex)
        }
    }

    /**
     * 表格搜索框筛选功能
     * @param {*} dataIndex
     */
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        console.log(selectedKeys, dataIndex, '_______selectedKeys,confirm,dataIndex_____')
        let filterSelectedList = this.state.filterSelectedList
        if (this.state.searchText[dataIndex]) {
            filterSelectedList[dataIndex] = this.state.searchText[dataIndex]
        } else {
            filterSelectedList[dataIndex] = ''
        }

        this.setState(
            {
                current: 1,
                filterSelectedList,
            },
            () => {
                this.props.getTableList &&
                    this.props.getTableList({
                        // dataIndex,
                        // 'reqFrom': 'table',
                        filterSelectedList,
                        pagination: {
                            page: 1,
                            page_size: this.state.pageSize,
                        },
                    })
            }
        )
    }
    onInputChange = (dataIndex, e) => {
        console.log(dataIndex, e.target.value, 'onInputChange +++++++')
        this.state.searchText[dataIndex] = e.target.value
        this.setState({ searchText: this.state.searchText })
    }

    initFilterData = () => {
        // let searchText = this.state.searchText
        // let filterSelectedList = this.state.filterSelectedList
        // if (!_.isEmpty(filterInputList)) {
        //     filterInputList.map((item) => {
        //         searchText[item.dataIndex] = item.value
        //     })
        // } else {
        //     searchText = {}
        //     filterSelectedList = {}
        // }

        this.setState({ searchText: {}, filterSelectedList: {} })
    }

    // 字段搜索框，搜索关键词的外部调用设置
    setInputValue = (filterInputList = {}) => {
        let searchText = this.state.searchText
        // let filterSelectedList = this.state.filterSelectedList
        if (!_.isEmpty(filterInputList)) {
            filterInputList.map((item) => {
                searchText[item.dataIndex] = item.value
            })
        } else {
            searchText = {}
            // filterSelectedList = {}
        }

        this.setState({ searchText })
    }

    /**
     * 表格字段关键词筛选功能
     * @param {*} dataIndex
     */
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        this.searchInput = node
                    }}
                    placeholder='请输入内容'
                    value={this.state.searchText[dataIndex]}
                    onChange={(e) => this.onInputChange(dataIndex, e)}
                    // onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 230, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type='primary'
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    // icon="search"
                    size='small'
                    style={{ width: 78, height: 24, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters, dataIndex)} size='small' style={{ width: 78, height: 24 }}>
                    重置
                </Button>
            </div>
        ),
        // filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#1890ff' : undefined }} />,
        filterIcon: (filtered) => {
            let filterSelectedList = this.state.filterSelectedList
            if (filterSelectedList && filterSelectedList[dataIndex] && filterSelectedList[dataIndex].length > 0) {
                filtered = true
            }
            return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
        },
        // onFilter: (value, record) => {
        //     console.log(value, '--------valuevalue-----------')
        // }
        // onFilter: (value, record) =>
        //     record[dataIndex]
        //         .toString()
        //         .toLowerCase()
        //         .includes(value.toLowerCase()),
        // onFilterDropdownVisibleChange: visible => {
        //   if (visible) {
        //     setTimeout(() => this.searchInput.select())
        //   }
        // }
    })

    /**
     * 表格字段下拉框类型筛选功能
     * @param {*} dataIndex
     */
    getColumnFilterMultipleProps = (dataIndex, operateType) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <Row>
                    <Col span='24'>
                        {operateType == 'searchAndSelect' ? (
                            <Search
                                ref={(e) => {
                                    this.suggestInput = e
                                }}
                                placeholder='请输入内容'
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onSearch={(value) => this.onFilterSearch(dataIndex, value)}
                                style={{ width: '100%' }}
                            />
                        ) : (
                            ''
                        )}
                        <div style={{ maxHeight: '300px', overflow: 'auto', maxWidth: '260px', borderBottom: '1px solid #d3d3d3' }}>
                            {/* {
                             this.state.filterOptionsList[dataIndex] && this.state.filterOptionsList[dataIndex].length > 0
                             ? <ColumnsFilterOptions
                             ref={(node) => {
                             this.filterOptions = node
                             }}

                             dataList={this.state.filterOptionsList[dataIndex] || []}
                             checkedValues={this.state.filterSelectedList[dataIndex] || []}

                             onChange={(checkedValues, checkedItems) => this.onFieldSelectChange(dataIndex, checkedValues, checkedItems)}
                             /> : null
                             } */}

                            <ColumnsFilterOptions
                                ref={(node) => {
                                    this.filterOptions[dataIndex] = node
                                }}
                                //   dataList={this.state.filterOptionsList ? this.state.filterOptionsList[dataIndex] || [] : []}
                                //   checkedValues={this.state.filterSelectedList ? this.state.filterSelectedList[dataIndex] || [] : []}

                                onChange={(checkedValues, checkedItems) => this.onFieldSelectChange(dataIndex, checkedValues, checkedItems)}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span='24' style={{ padding: '4px 8px' }}>
                        <Button type='primary' onClick={() => this.handleSearchFilter(dataIndex, confirm)} size='small' style={{ marginRight: 8, width: 78, height: 24 }}>
                            搜索
                        </Button>
                        <Button onClick={() => this.handleSearchFilterReset(dataIndex, clearFilters)} size='small' style={{ width: 78, height: 24 }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </div>
        ),
        onFilterDropdownVisibleChange: (visible) => {
            this.onShowFilterOptions(visible, dataIndex, operateType)
        },
        //   filterDropdownVisible: this.state.filterDropdownVisible,
        filterIcon: (filtered) => {
            let filterSelectedList = this.state.filterSelectedList
            if (filterSelectedList && filterSelectedList[dataIndex] && filterSelectedList[dataIndex].length > 0) {
                filtered = true
            } else {
                // clearFilters()
                filtered = false
            }
            console.log(filterSelectedList, filtered, '---filteredfiltered---')
            return <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
        },
        // ,
        // onFilter: (value, record) => record[dataIndex].toString(),
        // render: (text) => (
        //     text
        // )
    })

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState(
            {
                selectedRowKeys,
            },
            () => {
                this.props.onSelectChange && this.props.onSelectChange(selectedRowKeys, selectedRows)
            }
        )
    }

    updateSelectedRowKeys = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
        })
        console.log(selectedRowKeys, 'updateSelectedRowKeys')
    }

    /**
     * 表格翻页回调
     * @param {*} page
     */
    onPageChange = (page, filters, sorter) => {
        console.log(page, '----page, pageSize---')
        // if (page.current && page.pageSize) {
        let filterSelectedList = this.state.filterSelectedList

        this.setState(
            {
                current: page.current || this.state.current,
                pageSize: page.pageSize || this.state.pageSize,
            },
            () => {
                this.props.getTableList &&
                    this.props.getTableList({
                        filterSelectedList,
                        pagination: {
                            page: page.current,
                            page_size: page.pageSize,
                        },
                        sortField: sorter.field,
                        sortOrder: sorter.order,
                        ...filters,
                    })
            }
        )
        // }
    }

    /**
     * 表格单页显示条数改变时回调
     * @param {*} page
     * @param {*} pageSize // 每页显示数量
     */
    onShowSizeChange = (page, pageSize) => {
        console.log('onShowSizeChange---')
        this.setState({
            current: 1,
            pageSize: pageSize,
        })
    }

    showTotal = (total) => {
        const totalPageNum = Math.ceil(total / this.state.pageSize)
        return `共${totalPageNum}页，${total}条数据`
    }

    initPagination = (pagination) => {
        console.log(pagination, '-----------initPagination-------------')
        this.setState({
            current: pagination.page || 1,
            pageSize: pagination.pageSize || 10,
        })
    }
    // handleTableChange = (pagination, filters, sorter) => {
    //     const pager = { ...this.state.pagination }
    //     pager.current = pagination.current
    //     this.setState({
    //         pagination: pager,
    //     });

    // }
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

    render() {
        const { tableData, pagination, selectedRowKeys, pageSize, filterCheckedItems } = this.state
        // console.log(pagination, tableData, '------pagination-----tableData---', pageSize)
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            ...this.props.rowSelection,
        }
        const showPagination = pagination.total > pageSize ? true : false
        let columns = this.state.columns.map((col, index) => {
            if (col.dataIndex == 'key') {
                col.width = 48
            }

            return {
                ...col,
                onHeaderCell: (column) => ({
                    width: column.width || 100,
                    onResize: this.handleResize(index),
                }),
            }
        })

        return (
            <Table
                columns={columns}
                dataSource={tableData}
                components={this.components}
                onChange={this.onPageChange}
                rowKey={this.props.rowKey || 'key'}
                rowClassName={() => 'editable-row'}
                loading={this.props.loading}
                pagination={
                    showPagination
                        ? {
                              showQuickJumper: true,
                              showSizeChanger: true,
                              pageSize: this.state.pageSize,
                              current: this.state.current,
                              onShowSizeChange: this.onShowSizeChange,
                              showTotal: this.showTotal,
                              pageSizeOptions: ['10', '20', '30', '40', '50'],
                              ...this.state.pagination,
                          }
                        : false
                }
                rowSelection={this.props.rowSelection ? rowSelection : null}
                scroll={this.props.scroll}
            />
        )
    }
}
