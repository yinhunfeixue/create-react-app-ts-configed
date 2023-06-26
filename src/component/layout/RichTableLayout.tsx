import IPageResponse from '@/base/interfaces/IPageResponse'
import BatchPermissionWrap from '@/component/BatchPermissionWrap'
import DraggerTable from '@/component/draggerTable/DraggerTable'
import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import { ITableLayoutHeaderProps } from '@/component/layout/TableLayoutHeader'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'
import ProjectUtil from '@/utils/ProjectUtil'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, ConfigProvider, Divider, Dropdown, Menu, Modal, Spin } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import MenuItem from 'antd/lib/menu/MenuItem'
import { ColumnProps, TableProps } from 'antd/lib/table'
import { INTERNAL_SELECTION_ITEM } from 'antd/lib/table/hooks/useSelection'
import { FilterValue, SorterResult, TableCurrentDataSource, TableRowSelection } from 'antd/lib/table/interface'
import classNames from 'classnames'
import { RenderedCell } from 'rc-table/lib/interface'
import React, { Component, CSSProperties, MouseEventHandler, ReactElement, ReactNode, ReactText } from 'react'
import './RichTableLayout.less'

interface IRichTableLayoutState<T> {
    controller: IRichTableLayoutContoler<T>
    showFooterControl: boolean
    tableData: {
        page: number
        pageSize: number
        dataSource: T[]
        total: number
    }
    loading: boolean
    loadingDelete: boolean
}
interface IRichTableLayoutProps<T> extends ITableLayoutHeaderProps {
    className?: string
    style?: CSSProperties

    /**
     * 头部下面的详情区，此区完全自定义
     * @param controller 表格控制器
     */
    renderDetail?: (controller: IRichTableLayoutContoler<T>) => ReactNode

    /**
     * 创建搜索的表单项
     */
    renderSearch?: (controller: IRichTableLayoutContoler<T>) => ReactNode

    /**
     * 表格props
     */
    tableProps: {
        key?: string
        columns: ColumnProps<T>[]
        selectedEnable?: boolean
        getCheckboxProps?: (record: T) => Object
        showQuickJumper?: boolean
        extraTableProps?: TableProps<T>
        selections?: INTERNAL_SELECTION_ITEM[] | boolean
    }

    /**
     * 分页获取列表的方法
     */
    requestListFunction?: (
        page: number,
        pageSize: number,
        filters?: Record<string, FilterValue | null>,
        sorter?: SorterResult<T> | SorterResult<T>[],
        extra?: TableCurrentDataSource<T>
    ) => Promise<IPageResponse<T> | undefined>

    /**
     * 删除数据的方法
     */
    deleteFunction?: (selectedKeys: ReactText[], selectedRows: T[]) => Promise<boolean>

    /**
     * 删除提示的标题，默认：警告
     */
    deleteTitle?: ReactNode

    /**
     * 删除提示的内容，默认：此操作不可恢复，请确认是否继续？
     */
    deleteContent?: ReactNode

    deleteLabel?: ReactNode

    /**
     * 操作列相关的属性
     */
    editColumnProps?: {
        width?: number
        hidden?: boolean
        /**
         * 创建编辑列的元素列表
         * @param index
         * @param item
         * @param defaultElement 默认元素，当设置了deleteFunction时，有删除按钮
         */
        createEditColumnElements?: (index: number, item: T, defaultElement: ReactElement[]) => ReactElement[]
    }

    /**
     * 创建页脚的元素列表
     */
    renderFooter?: (controller: IRichTableLayoutContoler<T>, defaultRender: (params?: IRenderFooterParams) => ReactNode[]) => ReactNode

    /**
     * 是否显示页脚操作区
     */
    showFooterControl?: boolean

    disabledDefaultFooter?: boolean

    /**
     * 使用小布局，小布局没有padding
     */
    smallLayout?: boolean

    createDeletePermissionData?: (record: T) => {
        funcCode?: string
        systemCode?: string
    }

    permissionIdName?: string
    permissionLabelName?: string

    enableDrag?: boolean
    enableDragSort?: boolean
    loading?: boolean
}

export interface IRichTableLayoutContoler<T> {
    /**
     * 选中的keys
     */
    selectedKeys?: ReactText[]

    /**
     * 选中的行数据
     */
    selectedRows?: T[]

    /**
     * 重置页码和数据，并请求数据
     */
    reset: () => void

    /**
     * 刷新数据，页码不变
     */
    refresh: () => void

    /**
     * 设置选中的keys
     */
    updateSelectedKeys: (keys: ReactText[]) => void

    forceUpdate: () => void
}

interface IRenderFooterParams {
    disabledDelete?: boolean
}

/**
 * 表格布局-RichTableLayout
 */
class RichTableLayout<T extends Object = any> extends Component<IRichTableLayoutProps<T>, IRichTableLayoutState<T>> {
    static renderEditElements(data: { label: string; onClick: MouseEventHandler; disabled?: boolean; loading?: boolean; funcCode?: string; systemCode?: string }[]) {
        if (!data) {
            return []
        }

        return data
            .filter((item) => {
                return !item.disabled && PermissionManage.hasFuncPermission(item.funcCode)
            })
            .map((item) => {
                return (
                    <PermissionWrap systemCode={item.systemCode} onClick={item.onClick} funcCode={item.funcCode}>
                        <a key={item.label} className='DefaultEditElement'>
                            <Spin spinning={Boolean(item.loading)} size='small'>
                                {item.label}
                            </Spin>
                        </a>
                    </PermissionWrap>
                )
            })
    }

    private editColumn: ColumnProps<T> = {
        title: '操作',
        fixed: 'right',
        render: (_, record, index) => {
            return this.renderEditColumn(index, record)
        },
    }

    constructor(props: IRichTableLayoutProps<T>) {
        super(props)
        this.state = {
            controller: {
                selectedKeys: [],
                selectedRows: [],
                reset: this.reset,
                refresh: this.refresh,
                updateSelectedKeys: this.updateSelectedKeys,
                forceUpdate: this.forceUpdate,
            },
            showFooterControl: false,
            loading: false,
            loadingDelete: false,
            tableData: {
                dataSource: [],
                page: 1,
                pageSize: 10,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.requestData()
    }

    componentWillReceiveProps(nextProps: Readonly<IRichTableLayoutProps<T>>, nextContext: any): void {
        this.setState({ loading: this.props.loading || false })
    }

    private updateSelectedKeys = (keys: ReactText[]) => {
        const { controller } = this.state
        controller.selectedKeys = keys || []
        this.setState({
            showFooterControl: Boolean(controller.selectedKeys.length),
        })
        this.forceUpdate()
    }

    private requestData(filters?: Record<string, FilterValue | null>, sorter?: SorterResult<T> | SorterResult<T>[], extra?: TableCurrentDataSource<T>) {
        const { requestListFunction } = this.props
        const { tableData } = this.state
        const { page, pageSize } = tableData
        if (requestListFunction) {
            this.setState({ loading: true })
            requestListFunction(page, pageSize, filters, sorter, extra)
                .then((data) => {
                    if (data) {
                        tableData.total = data.total
                        tableData.dataSource = data.dataSource
                    } else {
                        tableData.total = 0
                        tableData.dataSource = []
                    }
                    this.forceUpdate()
                })
                .finally(() => {
                    this.setState({ loading: false })
                })
        }
    }

    render() {
        const { title, renderHeaderExtra, smallLayout, showFooterControl: showFooterControlProps, disabledDefaultFooter, className, style, onBack, enableBack } = this.props
        const { showFooterControl } = this.state
        return (
            <TableLayout
                className={classNames('RichTableLayout', className)}
                style={style}
                disabledDefaultFooter={disabledDefaultFooter}
                // 是否显示页脚控制区，优先使用Props的值
                showFooterControl={showFooterControlProps === undefined ? showFooterControl : showFooterControlProps}
                title={title}
                renderHeaderExtra={renderHeaderExtra}
                renderDetail={this.renderDetail}
                renderTable={this.renderTable}
                renderFooter={this.renderFooter}
                smallLayout={smallLayout}
                enableBack={enableBack}
                onBack={onBack}
            />
        )
    }

    private reset = () => {
        const { tableData } = this.state
        this.setState(
            {
                tableData: {
                    dataSource: tableData.dataSource,
                    page: 1,
                    total: 0,
                    pageSize: tableData.pageSize,
                },
            },
            () => {
                this.requestData()
            }
        )
    }

    private refresh = () => {
        this.requestData()
    }

    private renderDetail = () => {
        const { controller } = this.state
        const { renderDetail } = this.props
        if (renderDetail) {
            return renderDetail(controller)
        }
        return null
    }

    private renderTable = () => {
        const { tableData, controller, loading } = this.state
        const { dataSource, page, total, pageSize } = tableData
        const { tableProps, renderSearch, editColumnProps = {}, enableDrag, enableDragSort } = this.props
        const { columns = [], selectedEnable, key = 'id', getCheckboxProps, extraTableProps, showQuickJumper = true, selections, rowSelectionChange } = tableProps || {}

        const { hidden, width = 140 } = editColumnProps

        let rowSelection: TableRowSelection<T> | undefined
        if (selectedEnable) {
            rowSelection = {
                columnWidth: 45,
                fixed: true,
                selectedRowKeys: controller.selectedKeys as string[],
                onChange: (selectedRowKeys: ReactText[], selectedRows: T[]) => {
                    console.log('row onChange', selectedRowKeys, selectedRows)
                    rowSelectionChange && rowSelectionChange(selectedRowKeys, selectedRows)
                    controller.selectedKeys = selectedRowKeys
                    controller.selectedRows = selectedRows
                    this.setState({
                        showFooterControl: Boolean(selectedRowKeys.length),
                    })
                },
                checkStrictly: true,
                preserveSelectedRowKeys: true,
                getCheckboxProps,
                selections,
            }
        }

        const showPagination = total > 0
        // const editColumn: ColumnProps<T> = {
        //     title: '操作',
        //     fixed: 'right',
        //     width,
        //     render: (_, record, index) => {
        //         return this.renderEditColumn(index, record)
        //     },
        // }

        const editColumn = this.editColumn
        if (!editColumn.width) {
            editColumn.width = width
        }
        let useColumns: ColumnProps<T>[] = columns.concat()

        if (!hidden) {
            useColumns.push(editColumn)
        }
        useColumns = useColumns.map((item, index) => {
            const oldRender = item.render
            item.ellipsis = item.ellipsis == false ? false : true

            // 如果设置了排序，则优先倒序
            if (item.sorter === true && !item.sortDirections) {
                item.sortDirections = ['descend', 'ascend']
            }
            item.render = (text, record, index) => {
                let result: ReactNode | RenderedCell<T>
                if (oldRender) {
                    result = oldRender(text, record, index)
                } else if (text) {
                    result = text
                }

                return result || <EmptyLabel />
            }
            return item
        })
        return (
            <>
                {renderSearch && <div className='RichTableLayout_SearchGroup'>{renderSearch(controller)}</div>}
                <ConfigProvider
                    locale={zhCN}
                    renderEmpty={() => {
                        return <EmptyIcon />
                    }}
                >
                    <DraggerTable<T>
                        enableDrag={enableDrag}
                        enableDragSort={enableDragSort}
                        scroll={{
                            x: 1200,
                        }}
                        rowKey={key}
                        dataSource={dataSource}
                        {...extraTableProps}
                        columns={useColumns}
                        loading={loading}
                        onChange={(pagination, filters, sorter, extra) => {
                            console.log('tablechange', pagination, filters, sorter, extra)
                            tableData.pageSize = pagination.pageSize || 10
                            tableData.page = pagination.current || 1
                            this.requestData(filters, sorter, extra)
                        }}
                        pagination={
                            showPagination
                                ? {
                                      pageSize,
                                      total,
                                      current: page,
                                      showSizeChanger: true,
                                      showQuickJumper,
                                      showTotal: (total) => (
                                          <span>
                                              总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                          </span>
                                      ),
                                  }
                                : false
                        }
                        rowSelection={rowSelection}
                    />
                </ConfigProvider>
            </>
        )
    }

    private getRecordKey(record: T): ReactText {
        const { tableProps } = this.props
        const { key = 'id' } = tableProps || {}
        return record[key]
    }

    /**
     * 渲染编辑列
     * 规则如下
     * 1. 判断是否需要加上删除，如果需要，先加上
     * 2. 判断外部是否需要创建元素，如果需，则调用
     * 3. 检查所有元素数量是否超出4个，如果超出，只显示前3个 + 更多下拉菜单，第4个及之后的元素放到下拉菜单中
     * 4. 所有元素之间插入分割线
     * @param index
     * @param record
     * @returns
     */
    private renderEditColumn = (index: number, record: T) => {
        const { deleteFunction, editColumnProps = {}, createDeletePermissionData, deleteLabel } = this.props
        const { createEditColumnElements } = editColumnProps
        const { loadingDelete } = this.state
        // 判断是否有删除按钮
        let elementList: ReactElement[] = []

        if (deleteFunction) {
            const deletePermissionData = createDeletePermissionData ? createDeletePermissionData(record) : {}
            if (PermissionManage.hasFuncPermission(deletePermissionData.funcCode)) {
                elementList.push(
                    <PermissionWrap
                        {...deletePermissionData}
                        key='delete'
                        onClick={() => {
                            this.deleteRecordList([record])
                        }}
                    >
                        <a className='DeleteLink'>
                            <Spin spinning={loadingDelete} size='small'>
                                {deleteLabel || '删除'}
                            </Spin>
                        </a>
                    </PermissionWrap>
                )
            }
        }

        if (createEditColumnElements) {
            elementList = createEditColumnElements(index, record, elementList)
        }

        // 如果超出4项，从第4-N项隐藏在下拉中
        if (elementList.length > 4) {
            const dropdown = this.createDropDown(elementList.slice(3))
            elementList = elementList.slice(0, 3).concat(dropdown)
        }
        // 在每项之间插入分隔
        const result: ReactElement[] = []
        for (let i = 0; i < elementList.length; i++) {
            result.push(elementList[i])
            if (i < elementList.length - 1) {
                result.push(<Divider type='vertical' />)
            }
        }
        return result
    }

    private deleteRecordList(recordList?: T[]) {
        const { deleteFunction, deleteTitle = '警告', deleteContent = '此操作不可恢复，请确认是否继续？', deleteLabel } = this.props
        const { controller } = this.state
        if (!deleteFunction || !recordList) {
            return
        }
        Modal.confirm({
            title: deleteTitle,
            content: deleteContent,
            okText: deleteLabel || '删除',
            cancelText: '取消',
            okButtonProps: {
                danger: true,
            },
            icon: <ExclamationCircleFilled />,
            onOk: () => {
                this.setState({ loadingDelete: true })
                deleteFunction(
                    recordList.map((item) => this.getRecordKey(item)),
                    recordList
                )
                    .then(() => {
                        this.refresh()
                        controller.selectedKeys = []
                        controller.selectedRows = []
                        this.setState({ showFooterControl: false })
                    })
                    .finally(() => {
                        this.setState({ loadingDelete: false })
                    })
            },
        })
    }

    private createDropDown(elementList: ReactElement[], label: string = '更多') {
        return (
            <Dropdown
                openClassName='MoreOpen'
                overlay={
                    <Menu className='RichTableMoreMenu'>
                        {elementList.map((item, index) => {
                            return <MenuItem key={index}>{React.cloneElement(item)}</MenuItem>
                        })}
                    </Menu>
                }
            >
                <a className='MoreLink'>
                    <span>{label}</span>
                    <IconFont color='red' className='MoreArrow' type='icon-arrow_down' />
                </a>
            </Dropdown>
        )
    }

    private renderFooter = () => {
        const { renderFooter } = this.props
        const { controller } = this.state
        return renderFooter ? renderFooter(controller, this.defaultRenderFooter) : this.defaultRenderFooter()
    }

    private defaultRenderFooter = (params: IRenderFooterParams = {}) => {
        const { controller, loadingDelete } = this.state
        const { deleteFunction, createDeletePermissionData, permissionIdName = 'id', permissionLabelName = 'name', deleteLabel } = this.props
        const { selectedKeys, selectedRows } = controller
        const { disabledDelete } = params

        const result = []

        if (deleteFunction && !disabledDelete && selectedRows && selectedRows.length) {
            const deletePermissionData = createDeletePermissionData ? createDeletePermissionData(selectedRows[0]) : {}
            result.push(
                <BatchPermissionWrap
                    funcCode={deletePermissionData.funcCode || ''}
                    systemRows={selectedRows}
                    rowId={permissionIdName}
                    rowLabel={permissionLabelName}
                    onSuccess={(rows) => this.deleteRecordList(rows)}
                >
                    <Button loading={loadingDelete}>{deleteLabel || '删除'}</Button>
                </BatchPermissionWrap>
            )
        }

        if (selectedKeys) {
            result.push(
                <span key='footerTotal'>
                    已选
                    <span className='LightColor'>{selectedKeys.length}</span>项
                </span>,
                <span
                    className='UnselectAll'
                    onClick={() => {
                        this.updateSelectedKeys([])
                    }}
                >
                    取消选择
                </span>
            )
        }

        return result
    }
}

export default RichTableLayout
