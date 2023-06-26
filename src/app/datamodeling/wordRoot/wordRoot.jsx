import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Menu, message, Modal, Radio, Select, Switch, Tooltip, Checkbox } from 'antd'
import { configCategory, configType, delRoot, rootList, saveRoot } from 'app_api/metadataApi'
import React, { Component } from 'react'
import AddRoot from './addRoot'
import BatchAddRoot from './batchAddRoot'
import UploadRoot from './uploadRoot'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'

import './index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            classList: [
                { value: 0, name: 'MD5' },
                { value: 1, name: '内容掩盖' },
            ],
            keyword: '',
            type: undefined,
            category: undefined,
            status: undefined,
            sourceType: false,
            categoryList: [],
            typeList: [],
            tableParam: {},
            total: 0,
        }
        this.columns = [
            {
                title: '词根',
                dataIndex: 'rootName',
                key: 'rootName',
                width: '16%',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={this.renderTooltip(text)}>
                            <span>
                                {record.sourceType == 2 ? <span className='backupRoot'></span> : null}
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '描述词',
                dataIndex: 'descWord',
                key: 'descWord',
                width: '20%',
                render: (text, record) => (text.length ? <Tooltip title={this.renderDescWord(text, '#fff')}>{this.renderDescWord(text, '#333')}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '词根类别',
                dataIndex: 'rootCategoryName',
                key: 'rootCategoryName',
                width: '18%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '词根类型',
                dataIndex: 'rootTypeName',
                key: 'rootTypeName',
                width: '18%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                width: '18%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: '12%',
                render: (text, record, index) => {
                    return (
                        <Switch
                            loading={this.state.loadingStatus}
                            onChange={this.statusChange.bind(this, index)}
                            checked={text}
                            disabled={!PermissionManage.hasFuncPermission('/norm/rootword/manage/switch')}
                            unCheckedChildren='禁用'
                            checkedChildren='启用'
                        />
                    )
                },
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 100,
            //     render: (text, record) => {
            //         return (
            //             <span onClick={(e) => e.stopPropagation()}>
            //                 <Tooltip title='编辑'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.openEditModal.bind(this, record)}
            //                         src={require('app_images/edit.png')}
            //                     />
            //                 </Tooltip>
            //                 <Tooltip title='删除'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.deleteRule.bind(this, record)}
            //                         src={require('app_images/delete.png')}
            //                     />
            //                 </Tooltip>
            //             </span>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        // this.getTableList({})
        this.getConfigCategory()
    }
    getDetail = (data) => {
        this.props.addTab('EAST报表详情', data)
    }
    statusChange = async (index, e) => {
        let { tableData, tableParam, total } = this.state
        let query = {
            ...tableData[index],
            status: e ? 1 : 0,
        }
        this.setState({ loadingStatus: true })
        let res = await saveRoot(query)
        this.setState({ loadingStatus: false })
        if (res.code == 200) {
            tableData[index].status = query.status
            let data = {
                data: tableData,
                total: total,
            }
            this.setState({ tableData })
            this.lzTableDom && this.lzTableDom.setTableData(data, tableParam)
        }
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    renderDescWord = (data, color) => {
        let html = ''
        data.map((item, index) => {
            html += item + (index < data.length - 1 ? '、' : '')
        })
        return <span style={{ color: color }} dangerouslySetInnerHTML={{ __html: html }}></span>
    }
    deleteRule = (data) => {
        return delRoot({ id: data.id }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    openEditModal = (data) => {
        // this.props.addTab('新增词根', { title: '编辑词根', ...data })
        this.setState({ visibleEdit: true, editParam: { title: '编辑词根', ...data } })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            type: this.state.type,
            keyword: this.state.keyword,
            category: this.state.category,
            status: this.state.status,
            sourceType: this.state.sourceType,
        }
        this.setState({ loading: true })
        let res = await rootList(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            res.data.map((item) => {
                item.descWord = item.descWord ? item.descWord : []
            })
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                tableParam: param,
                total: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            category: undefined,
            type: undefined,
            status: undefined,
            typeList: [],
        })
        this.search()
    }
    changeClass = async (e) => {
        await this.setState({
            type: e,
        })
        this.search()
    }
    changeStatus = async (e) => {
        await this.setState({
            status: e,
        })
        this.search()
    }
    changeCategory = async (e) => {
        await this.setState({
            category: e,
            type: undefined,
        })
        this.getConfigType()
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    changeSourceType = async (e) => {
        await this.setState({
            sourceType: e.target.checked,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    onClickMenu = (e) => {
        if (e.key == '1') {
            this.setState({ visibleUpload: true })
        } else {
            this.setState({ visibleBatchAdd: true })
        }
    }
    getConfigCategory = async () => {
        let res = await configCategory()
        if (res.code == 200) {
            this.setState({
                categoryList: res.data,
            })
        }
    }
    getConfigType = async () => {
        let res = await configType({ category: this.state.category })
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
    }

    render() {
        const { tableData, loading, classList, keyword, category, type, status, categoryList, typeList, editParam, visibleEdit, visibleUpload, visibleBatchAdd, sourceType } = this.state
        const menu = (
            <Menu onClick={this.onClickMenu}>
                {PermissionManage.hasFuncPermission('/norm/rootword/manage/batchupload') && <Menu.Item key='1'>批量上传</Menu.Item>}
                {PermissionManage.hasFuncPermission('/norm/rootword/manage/batchadd') && <Menu.Item key='2'>批量添加</Menu.Item>}
            </Menu>
        )
        return (
            <React.Fragment>
                <RichTableLayout
                    title='词根库'
                    className='wordRoot'
                    renderHeaderExtra={() => {
                        if (PermissionManage.hasFuncPermission('/norm/rootword/manage/batchupload') || PermissionManage.hasFuncPermission('/norm/rootword/manage/batchadd')) {
                            return (
                                <Dropdown overlay={menu} placement='bottomLeft'>
                                    <Button type='primary'>
                                        新增词根
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            )
                        }
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='输入词根或描述词搜索' />
                                <Select allowClear onChange={this.changeStatus} value={status} placeholder='词根状态'>
                                    <Option value={1} key={1}>
                                        启用
                                    </Option>
                                    <Option value={0} key={0}>
                                        禁用
                                    </Option>
                                </Select>
                                <Select allowClear onChange={this.changeCategory} value={category} placeholder='词根类别'>
                                    {categoryList.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select allowClear onChange={this.changeClass} value={type} placeholder='词根类型'>
                                    {typeList.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.reset}>重置</Button>
                                <PermissionWrap funcCode='/norm/rootword/manage/select'>
                                    <Checkbox style={{ float: 'right' }} checked={sourceType} onChange={this.changeSourceType}>
                                        备选词根
                                    </Checkbox>
                                </PermissionWrap>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteRule(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/norm/rootword/manage/delete',
                        }
                    }}
                    editColumnProps={{
                        width: '14%',
                        createEditColumnElements: (_, record, defaultElements) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '编辑',
                                    onClick: this.openEditModal.bind(this, record),
                                    funcCode: '/norm/rootword/manage/edit',
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {visibleEdit && (
                    <AddRoot
                        param={editParam}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.search()
                        }}
                        visible={visibleEdit}
                        onClose={() => this.setState({ visibleEdit: false })}
                    />
                )}

                {visibleUpload && (
                    <UploadRoot
                        onSuccess={() => {
                            this.setState({ visibleUpload: false })
                            this.search()
                        }}
                        visible={visibleUpload}
                        onClose={() => this.setState({ visibleUpload: false })}
                    />
                )}

                {visibleBatchAdd && (
                    <BatchAddRoot
                        onSuccess={() => {
                            this.setState({ visibleBatchAdd: false })
                            this.search()
                        }}
                        param={{}}
                        visible={visibleBatchAdd}
                        onClose={() => this.setState({ visibleBatchAdd: false })}
                    />
                )}
            </React.Fragment>
        )
    }
}
