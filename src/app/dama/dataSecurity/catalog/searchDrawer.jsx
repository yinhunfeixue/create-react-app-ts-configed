import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import EmptyIcon from '@/component/EmptyIcon';
import EmptyLabel from '@/component/EmptyLabel';
import IconFont from '@/component/IconFont';
import DrawerLayout from '@/component/layout/DrawerLayout';
import TableLayout from '@/component/layout/TableLayout';
import StatusLabel from '@/component/statusLabel/StatusLabel';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Input, Select, Spin, Table, Tooltip } from 'antd';
import { dwTableSearch, dwTableSearchSuggest, nonDwTableSearch, nonDwTableSearchSuggest } from 'app_api/dataSecurity';
import React, { Component } from 'react';
import CatalogEdit from './catalogEdit';
import './index.less';


export default class BizSearchDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {},
            tableData: [],
            total: 0,
            keyword: '',
            showEmptyIcon: true,
            columns: [],
            loading: false,
            selectedRows: [],
            selectedRowKeys: [],
            queryInfo: {
                page: 1,
                pageSize: 10,
                systemIds: [],
                domain: 'TABLE',
            },
            suggestInfo: {
                page: 1,
                pageSize: 20,
                systemIds: []
            },
            suggestList: [],
            dropSelectedId: '',
            tableLoading: false,
            tabValue: 'ods',
            columnList: ['股票代码，行业类别代码，证券简称，交易场所代码，首次发行日期，发行人标识等信息 行业类别代码，证券简称，交易场所代码，首次发行日期，发行人标识等信息']
        }
        this.columns = [
            {
                title: '表英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<span style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: text + '/' + record.databaseEnglishName }}></span>}>
                            <div className='tableLabel'>
                                <a onClick={this.openTablePage.bind(this, record)} dangerouslySetInnerHTML={{ __html: text }}></a>
                                <br/>
                                <div>/{record.databaseEnglishName}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务／数据分类',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                render: (text, record) =>
                    text || record.dataClassifyPath ? (
                        <Tooltip placement='topLeft' title={text + ' ' + record.dataClassifyPath}>
                            <div className='tableLabel'>
                                <div style={{ maxWidth: '350px' }}>{text}</div>
                                <div style={{ maxWidth: '350px' }}>{record.dataClassifyPath}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'catalog',
                key: 'catalog',
                width: 100,
                // sorter: true,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已编目' /> : <StatusLabel type='minus' message='未编目' />
                },
            }
        ]
    }
    openTablePage = (data) => {
        this.props.addTab('sysDetail', { id: data.id }, true)
    }
    openModal = async (systemId, isDataWarehouse, tabValue) => {
        let { queryInfo, suggestInfo } = this.state
        queryInfo.systemIds = [systemId]
        queryInfo.domain = 'TABLE'
        suggestInfo.systemIds = [systemId]
        suggestInfo.page = 1
        await this.setState({
            modalVisible: true,
            showEmptyIcon: true,
            queryInfo,
            suggestInfo,
            suggestList: [],
            columns: [],
            keyword: '',
            isDataWarehouse,
            tabValue
        })
        console.log(tabValue, 'tabValue++++')
        if (tabValue == 'ods') {
            this.columns[2] = {
                title: '业务／数据分类',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                render: (text, record) =>
                    text || record.dataClassifyPath ? (
                        <Tooltip placement='topLeft' title={text + ' ' + record.dataClassifyPath}>
                            <div className='tableLabel'>
                                <div style={{ maxWidth: '350px' }}>{text}</div>
                                <div style={{ maxWidth: '350px' }}>{record.dataClassifyPath}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            }
        } else if (tabValue == 'dw') {
            this.columns[2] = {
                title: '业务板块／主题域',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                render: (text, record) =>
                    text || record.dataClassifyPath ? (
                        <Tooltip placement='topLeft' title={text + ' ' + record.dataClassifyPath}>
                            <div className='tableLabel'>
                                <div style={{ maxWidth: '350px' }}>{text}</div>
                                <div style={{ maxWidth: '350px' }}>{record.dataClassifyPath}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            }
        } else if (tabValue == 'app') {
            this.columns[2] = {
                title: '分析主题',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            }
        }
        // this.getTableList()
        this.getNonDwTableSearchSuggest()
    }
    getNonDwTableSearchSuggest = async () => {
        let { suggestInfo , suggestList, isDataWarehouse, tabValue } = this.state
        let query = {
            ...suggestInfo,
            // keyword,
        }
        this.setState({tableLoading: true})
        let res = {}
        if (isDataWarehouse) {
            query.dwLevel = tabValue
            res = await dwTableSearchSuggest(query)
        } else {
            res = await nonDwTableSearchSuggest(query)
        }
        this.setState({tableLoading: false})
        if (res.code == 200) {
            res.data.map((item) => {
                item.columnListLength = item.columnList ? item.columnList.length : 0
            })
            suggestList = suggestList.concat(res.data)
            this.setState({
                suggestList
            })
        }
    }
    onScrollEvent = async () => {
        let { suggestInfo } = this.state
        if (this.scrollRef.scrollTop + this.scrollRef.clientHeight === this.scrollRef.scrollHeight) {
            console.info('到底了！');
            suggestInfo.page ++
            await this.setState({suggestInfo})
            this.getNonDwTableSearchSuggest()
        }
    }
    // handleSearch = async (value) => {
    //     console.log(value,'handleSearch')
    //     this.getNonDwTableSearchSuggest(value)
    // }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getTableList = async (params = {}) => {
        let { queryInfo, keyword, columns, isDataWarehouse, tabValue } = this.state
        let query = {
            ...queryInfo,
            keyword: queryInfo.domain == 'TABLE' ? keyword : columns.join(' ')
        }
        this.setState({loading: true})
        let res = {}
        if (isDataWarehouse) {
            query.dwLevel = tabValue
            res = await dwTableSearch(query)
        } else {
            res = await nonDwTableSearch(query)
        }
        this.setState({loading: false})
        if (res.code == 200) {
            res.data.map((item) => {
                item.tableId = item.id
                item.columnDesc = ''
                item.columnList.map((node, index) => {
                    item.columnDesc += node.name + ((index + 1) < item.columnList.length ? '，' : '')
                })
            })
            await this.setState({
                tableData: res.data,
                total: res.total
            })
            this.collapseLabel&&this.collapseLabel.getVisibleBtn()
        }
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            showEmptyIcon: false,
            queryInfo,
            tableData: []
        })
        this.clearSelect()
        this.getTableList()
    }
    clearSelect = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
    }
    reload = () => {
        this.search()
        this.props.reload()  //刷新system列表
    }
    changeSelect = async (e) => {
        let { queryInfo } = this.state
        queryInfo.domain = e
        await this.setState({
            queryInfo,
            keyword: '',
            columns: [],
            dropSelectedId: ''
        })
        this.search()
    }
    changeColumns = async (e) => {
        console.log(e,'changeColumns')
        let { dropSelectedId } = this.state
        await this.setState({
            dropSelectedId: e.length ? dropSelectedId : '',
            columns: e,
        })
        this.search()
    }
    onSelectChange = (selectedRowKeys, selectedRowItems) => {
        let { selectedRows } = this.state
        this.setState({ selectedRowKeys })
        //当前选择行和之前的合并
        selectedRows = selectedRows.concat(selectedRowItems)
        let obj = new Set(selectedRowKeys)
        //在这里去重
        var result = []
        for (var i = 0; i < selectedRows.length; i++) {
            //rowKey表格行 key 的取值（唯一,每行不同）
            if (obj.has(selectedRows[i].tableId)) {
                result.push(selectedRows[i]);
                obj.delete(selectedRows[i].tableId);
            }
        }
        //根据selectedRowseKeys去选出对应的selectedRows
        let rows = []
        result.map(v => {
            selectedRowKeys.map(m => {
                if (m && m == v.tableId) {
                    rows.push(v)
                }
            })
        })
        this.setState({
            selectedRows: rows
        })
    }
    renderDesc = (value) => {
        return <CollapseLabel ref={(dom) => (this.collapseLabel = dom)} value={value}/>
    }
    expandedRowRender = (record, index) => {
        if (this.state.queryInfo.domain == 'COLUMN') {
            return (
                <div style={{ paddingLeft: 28, maxWidth: '890px', color: '#5E6266' }}>
                    {this.renderDesc('字段信息：' + record.columnDesc)}
                </div>
            )
        } else {
            return null
        }
    }
    changePagination = async (page, pageSize) => {
        let { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({ queryInfo, tableData: [] })
        this.getTableList()
    }
    showTotal = (total) => {
        const totalPageNum = Math.ceil(total / this.state.queryInfo.pageSize)
        return `总数 ${total} 条`
    }
    openCatalogModal = () => {
        console.log(this.state.selectedRows,'selectedRows++++')
        this.catalogEdit&&this.catalogEdit.openModal(this.state.selectedRows, 'batch', this.state.queryInfo.systemIds[0], this.state.isDataWarehouse, this.state.tabValue)
    }
    renderDropdown = (menu) => {
        let { suggestList, dropSelectedId, tableLoading } = this.state
        return (
            <div>
                <div className='suggestListContainer' ref={dom => this.scrollRef = dom} onScrollCapture={this.onScrollEvent}>
                    <Spin spinning={tableLoading}>
                        <div className='dropdownTitle'>分类推荐<InfoCircleOutlined style={{ color: '#5E6266', marginLeft: '5px' }} /></div>
                        {
                            suggestList.map((item) => {
                                return (
                                    <div
                                        onClick={this.selectColumns.bind(this, item)}
                                        className="dropdownValue"
                                        // className={dropSelectedId == item.id ? 'dropdownValue dropdownValueSelected' : 'dropdownValue'}
                                    ><span className='valueTitle'>{item.chineseName || item.englishName}：</span>
                                        {
                                            item.columnList&&item.columnList.map((column, index) => {
                                                return (<span>{column.chineseName.trim() || column.englishName}{(index+1) < item.columnListLength? <span>，</span> : null}</span>)
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </Spin>
                </div>
                {
                    !suggestList.length ? <EmptyIcon description='暂无数据' /> : null
                }
            </div>
        );
    }
    selectColumns = async (data) => {
        let { columns } = this.state
        columns = []
        data.columnList.map((item) => {
            columns.push(item.englishName)
        })
        await this.setState({
            dropSelectedId: data.id,
            columns
        })
        this.search()
    }
    render() {
        const {
            modalVisible,
            addInfo,
            tableData,
            total,
            queryInfo,
            keyword,
            showEmptyIcon,
            columns,
            loading,
            selectedRowKeys,
            suggestList
        } = this.state
        const rowSelection = {
            columnWidth: '32px',
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'checkbox',
        }
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'bizSearchDrawer',
                    title: '高级搜索',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div>
                            <div style={{ position: 'relative', marginRight: 0, display: 'inline-block' }}>
                                <Input.Group compact>
                                    <Select style={{ width: 88 }} value={queryInfo.domain} onChange={this.changeSelect} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        <Option value="TABLE">表</Option>
                                        <Option value="COLUMN">字段</Option>
                                    </Select>
                                    {
                                        queryInfo.domain == 'TABLE' ? <Input style={{ width: 745 }} placeholder='请输入表名' value={keyword} onChange={this.changeKeyword} onPressEnter={this.search} /> :
                                            <div
                                                style={{ width: 745, height: 32 }}
                                                onMouseDown={(e) => {
                                                e.preventDefault()
                                                return false
                                            }}>
                                                <Select
                                                    allowClear
                                                    // filterOption={false}
                                                    // onSearch={this.handleSearch}
                                                    className='tagsSelect'
                                                    dropdownClassName='columnSearchDropdown'
                                                    mode="tags"
                                                    tokenSeparators={[',', '，']}
                                                    placeholder="支持多字段搜索，逗号分割"
                                                    value={columns}
                                                    onChange={this.changeColumns}
                                                    style={{ width: '100%' }}
                                                    dropdownRender={this.renderDropdown}
                                                >
                                                </Select>
                                            </div>
                                    }
                                </Input.Group>
                            </div>
                            <Button style={{ marginLeft: 8, verticalAlign: 'bottom' }} type='primary' onClick={this.search}>
                                搜索
                            </Button>
                        </div>
                        {
                            showEmptyIcon ?
                                <div className='emptyIcon'>
                                    <IconFont type='icon-kongzhuangtai2'/>
                                    <div>暂无数据，请在上方输入筛选条件</div>
                                </div>
                                :
                                <TableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    renderTable={() => {
                                        return (
                                                <div>
                                                    {tableData && tableData.length ? (
                                                        <Table
                                                            ref={(node) => {
                                                                this.table = node
                                                            }}
                                                            loading={loading}
                                                            className={queryInfo.domain == 'TABLE' ? 'hideExpandTable' : ''}
                                                            columns={this.columns}
                                                            rowSelection={rowSelection}
                                                            dataSource={tableData}
                                                            expandIconAsCell={false}
                                                            expandIconColumnIndex={-1}
                                                            rowKey='id'
                                                            expandedRowRender={this.expandedRowRender}
                                                            defaultExpandAllRows={true}
                                                            // scroll={{y: '70vh'}}
                                                            pagination={
                                                                {
                                                                    total: total,
                                                                    pageSize: queryInfo.pageSize,
                                                                    current: queryInfo.page,
                                                                    // showSizeChanger: true,
                                                                    showQuickJumper: true,
                                                                    onChange: this.changePagination,
                                                                    // onShowSizeChange: this.onShowSizeChange,
                                                                    showTotal: this.showTotal,
                                                                }
                                                            }
                                                        />
                                                    ) : null}
                                                    {!tableData.length ? <Table loading={loading} className='tagManageTable' columns={this.columns} rowSelection={rowSelection} dataSource={tableData} pagination={false} /> : null}
                                                </div>
                                            )
                                    }}
                                    showFooterControl={Boolean(selectedRowKeys.length)}
                                    renderFooter={() => {
                                        return (
                                            <div>
                                                <Button style={{ marginRight: 16 }} type='primary' ghost onClick={this.openCatalogModal}>
                                                    编目配置
                                                </Button>
                                                已选 <a>{selectedRowKeys.length}</a> 项
                                            </div>
                                        )
                                    }}
                                />
                        }
                        <CatalogEdit search={this.reload} ref={(dom) => this.catalogEdit = dom} />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}