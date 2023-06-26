import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Alert, Button, Checkbox, Dropdown, Input, Menu, message, Tooltip } from 'antd'
import { desensitiseTagColumnSearch, desensitiseTagColumnSearchFilter, saveDesensitiseTagColumns } from 'app_api/dataSecurity'
import { LzTable } from 'app_component'
import React, { Component } from 'react'
import '../index.less'

export default class AddMapColumnDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            btnLoading: false,
            columnKeyword: '',
            selectedRowKeys: [],
            columnTableData: [],
            loading: false,
            ruleOptionList: [],
            filterInfos: {},
            preciseSearch: false,
            ruleInfo: {},
            showEmptyIcon: false,
            tagId: '',
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 160,
                render: (_, record) => (
                    <Tooltip title={this.renderTooltip.bind(this, _)}>
                        <span className='ellipsisLabel' dangerouslySetInnerHTML={{ __html: _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '字段中文名',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 130,
                render: (_, record) => <Tooltip title={this.renderTooltip.bind(this, _)}>{_ ? <span className='ellipsisLabel' dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                title: '数据表',
                dataIndex: 'tableEnglishName',
                key: 'tableEnglishName',
                operateType: 'serach',
                width: 170,
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
                title: '数据库',
                dataIndex: 'databaseEnglishName',
                key: 'databaseEnglishName',
                operateType: 'searchAndSelect',
                width: 120,
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
                title: '所属系统',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
                operateType: 'searchAndSelect',
                width: 120,
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
                title: '状态',
                dataIndex: 'inContainer',
                key: 'inContainer',
                width: 100,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已添加' /> : <StatusLabel type='minus' message='未添加' />
                },
            },
        ]
    }
    openModal = (data, tagId) => {
        let { ruleInfo, ruleOptionList } = this.state
        console.log(data, 'openModal')
        data.map((item) => {
            if (item.isDefault) {
                ruleInfo = { id: item.id, name: item.name }
            }
        })
        this.setState({
            modalVisible: true,
            columnKeyword: '',
            showEmptyIcon: true,
            preciseSearch: false,
            ruleOptionList: data,
            ruleInfo,
            tagId,
        })
        this.searchColumn()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    postData = async () => {
        let { ruleInfo, selectedRowKeys, tagId } = this.state
        let query = {
            ruleId: ruleInfo.id,
            tagId,
            columnId: selectedRowKeys,
        }
        let res = await saveDesensitiseTagColumns(query)
        if (res.code == 200) {
            this.cancel()
            this.props.reload()
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeColumnKeyword = (e) => {
        this.setState({
            columnKeyword: e.target.value,
        })
    }
    searchColumn = () => {
        this.setState({
            selectedRowKeys: [],
            showEmptyIcon: false,
        })
        this.getColumnList()
    }
    getColumnList = async (params = {}) => {
        console.log(params, 'params++++')
        let query = {
            filterInfos: [],
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            preciseSearch: this.state.preciseSearch,
            keyword: this.state.columnKeyword,
            containerId: this.state.tagId,
        }
        for (let k in params.filterSelectedList) {
            query.filterInfos.push({ type: k, value: params.filterSelectedList[k].join(' ') })
        }
        this.setState({ loading: true })
        let res = await desensitiseTagColumnSearch(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                columnTableData: res.data,
                filterInfos: query.filterInfos,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    onFilterSearch = async (params) => {
        let query = {
            preciseSearch: this.state.preciseSearch,
            filterInfos: this.state.filterInfos,
            type: params.dataIndex,
            containerId: this.state.tagId,
            keyword: this.state.columnKeyword,
        }
        let res = await desensitiseTagColumnSearchFilter(query)
        if (res.code == 200) {
            let array = []
            res.data.map((item) => {
                item.id = item.value
                if (item.name.includes(params.value)) {
                    array.push(item)
                }
            })
            return array
        }
    }
    changeCheckbox = (e) => {
        this.setState({
            preciseSearch: e.target.checked,
        })
    }
    onIndexmaCheckboxChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
        })
    }
    onClickMenu = (index) => {
        let { ruleInfo, ruleOptionList } = this.state
        ruleInfo.id = ruleOptionList[index].id
        ruleInfo.name = ruleOptionList[index].name
        this.setState({
            ruleInfo,
            ruleOptionList,
        })
    }
    render() {
        const { modalVisible, btnLoading, selectedRowKeys, columnKeyword, columnTableData, preciseSearch, loading, showEmptyIcon, ruleOptionList, ruleInfo } = this.state
        const indexmaRowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.onIndexmaCheckboxChange,
            getCheckboxProps: (record) => ({
                disabled: record.inContainer, // 未映射才能选
                name: record.inContainer,
            }),
        }
        const menu = (
            <Menu className='rulePopMenu' selectedKeys={[ruleInfo.id]}>
                {ruleOptionList.map((item, index) => {
                    return (
                        <Menu.Item onClick={this.onClickMenu.bind(this, index)} index={index} title={item.name} key={item.id}>
                            {item.name}
                            {item.isDefault ? '（默认）' : ''}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
        return (
            <DrawerLayout
                drawerProps={{
                    // className: 'addMapColumnDrawer',
                    title: '映射字段管理',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} disabled={!selectedRowKeys.length} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                            <span style={{ color: '#666', marginLeft: 12 }}>
                                已选 <span style={{ color: '#4D73FF' }}>{selectedRowKeys.length}</span> 条
                            </span>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible ? (
                    <div className='VControlGroup' style={{ height: '100%' }}>
                        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                            <div className='HControlGroup'>
                                <div style={{ flexGrow: 1, flexShrink: 1, position: 'relative' }}>
                                    <Input placeholder='请输入字段英文名/中文名' value={columnKeyword} onChange={this.changeColumnKeyword} onPressEnter={this.searchColumn} />
                                    <Checkbox style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} checked={preciseSearch} onChange={this.changeCheckbox}>
                                        精准匹配
                                    </Checkbox>
                                </div>
                                <Button type='primary' onClick={this.searchColumn}>
                                    搜索
                                </Button>
                            </div>
                            {showEmptyIcon ? (
                                <div className='emptyIcon'>
                                    <IconFont type='icon-kongzhuangtai2' />
                                    <div>暂无数据，请在上方输入筛选条件</div>
                                </div>
                            ) : (
                                <div style={{ marginTop: 16, position: 'relative' }}>
                                    <LzTable
                                        from='globalSearch'
                                        columns={this.columns}
                                        dataSource={columnTableData}
                                        ref={(dom) => {
                                            this.lzTableDom = dom
                                        }}
                                        getTableList={this.getColumnList}
                                        loading={loading}
                                        rowKey='id'
                                        rowSelection={indexmaRowSelection}
                                        onFilterSearch={this.onFilterSearch}
                                        pagination={{
                                            showQuickJumper: true,
                                            showSizeChanger: true,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {!showEmptyIcon ? (
                            // <div className='ruleSelectArea'>
                            //     <span>脱敏规则：{ruleInfo.name}（默认）</span>
                            //     <Dropdown overlay={menu} placement='topLeft'>
                            //         <a>更换规则</a>
                            //     </Dropdown>
                            // </div>
                            <Alert
                                message={<span>脱敏规则：{ruleInfo.name}（默认）</span>}
                                action={
                                    <Dropdown overlay={menu} placement='topLeft'>
                                        <a>更换规则</a>
                                    </Dropdown>
                                }
                            />
                        ) : null}
                    </div>
                ) : null}
            </DrawerLayout>
        )
    }
}
