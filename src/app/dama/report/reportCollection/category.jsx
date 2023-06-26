import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Button, Divider, Input, message, Select, Table } from 'antd'
import { getExternalCount } from 'app_api/metadataApi'
import { addTreeNode, checkNodeCode, checkNodeName, deleteTreeNode, getTree, updateTreeNode } from 'app_api/systemManage'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select

export default class ReportCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            subTableData: {},
            addInfo: {
                name: '',
                updateType: 0,
            },
            loading: false,
            inputVisible: false,
            treeId: '',
            tableKey: '0',
            expandedRowKeys: [],
        }
        this.columns = [
            {
                title: '报表分类名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, index) => {
                    if (record.isEdit == true) {
                        return (
                            <div className='subInput'>
                                <Input
                                    placeholder='分类名称'
                                    value={text}
                                    onChange={this.onChangeName.bind(this, record, index, 'name')}
                                    onBlur={this.onNameBlur.bind(this, record)}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{text ? text.length : 0}/64</span>}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div className='subInput'>
                                {text ? (
                                    <Tooltip placement='topLeft' title={text}>
                                        <span className='ellipsisLabel'>{text}</span>
                                    </Tooltip>
                                ) : (
                                    <EmptyLabel />
                                )}
                            </div>
                        )
                    }
                },
            },
            {
                title: '报表分类英文名',
                dataIndex: 'code',
                key: 'code',
                ellipsis: true,
                render: (text, record, index) => {
                    if (record.isEdit == true) {
                        return (
                            <div>
                                <Input
                                    placeholder='分类英文名'
                                    value={text}
                                    onChange={this.onChangeName.bind(this, record, index, 'code')}
                                    onBlur={this.onCodeBlur.bind(this, record)}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{text ? text.length : 0}/64</span>}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                {text ? (
                                    <Tooltip placement='topLeft' title={text}>
                                        <span className='ellipsisLabel'>{text}</span>
                                    </Tooltip>
                                ) : (
                                    <EmptyLabel />
                                )}
                            </div>
                        )
                    }
                },
            },
            {
                title: '描述信息',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
                render: (text, record, index) => {
                    if (record.isEdit == true) {
                        return (
                            <div>
                                <Input
                                    placeholder='分类描述'
                                    value={text}
                                    onChange={this.onChangeName.bind(this, record, index, 'description')}
                                    maxLength={128}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{text ? text.length : 0}/128</span>}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                {text ? (
                                    <Tooltip placement='topLeft' title={text}>
                                        <span className='ellipsisLabel'>{text}</span>
                                    </Tooltip>
                                ) : (
                                    <EmptyLabel />
                                )}
                            </div>
                        )
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.isEdit == true ? (
                                <div>
                                    <a onClick={this.saveData.bind(this, record, index)}>保存</a>
                                    <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    <a onClick={this.cancelData.bind(this, record, index)}>取消</a>
                                </div>
                            ) : (
                                <div>
                                    {record.level == 1 ? (
                                        <span>
                                            <a onClick={this.addSubData.bind(this, record, index)}>定义子类别</a>
                                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                                        </span>
                                    ) : null}
                                    <a onClick={this.editData.bind(this, record, index)}>编辑</a>
                                    <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    <a onClick={this.deleteData.bind(this, record)}>删除</a>
                                </div>
                            )}
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList()
    }
    addData = () => {
        let { tableData, inputVisible, treeId } = this.state
        if (inputVisible) {
            message.info('请关闭当前输入框')
            return
        }
        tableData.unshift({
            name: '',
            code: '',
            description: '',
            level: 1,
            isEdit: true,
            isNew: true,
            id: moment().format('x'),
            treeId: treeId,
            parentId: 0,
            children: [],
        })
        this.setState({
            tableData,
            inputVisible: true,
        })
    }
    addSubData = (data, index) => {
        let { tableData, inputVisible, expandedRowKeys } = this.state
        if (inputVisible) {
            message.info('请关闭当前输入框')
            return
        }
        if (!expandedRowKeys.includes(data.id)) {
            expandedRowKeys.push(data.id)
        }
        tableData[index].children.unshift({
            name: '',
            code: '',
            description: '',
            level: 2,
            isEdit: true,
            isNew: true,
            treeId: data.treeId,
            parentId: data.id,
            children: [],
            id: moment().format('x'),
        })
        this.setState({
            tableData,
            inputVisible: true,
            expandedRowKeys,
        })
    }
    editData = (data, index) => {
        let { inputVisible, tableData } = this.state
        if (inputVisible) {
            message.info('请关闭当前输入框')
            return
        }
        if (data.level == 1) {
            tableData[index].isEdit = true
        } else {
            let i = data.index
            tableData[i].children[index].isEdit = true
        }
        this.setState({
            tableData,
            subTableData: { ...data },
            inputVisible: true,
        })
    }
    deleteData = (data) => {
        let { tableData } = this.state
        if (data.children.length) {
            message.error('该分类下已有节点，无法删除')
            return
        }
        getExternalCount({ categoryId: data.id }).then((resp) => {
            if (resp.code == 200) {
                if (resp.data) {
                    message.error('该节点下已有资源，无法删除')
                } else {
                    deleteTreeNode({ id: data.id }).then((response) => {
                        if (response.code == 200) {
                            message.success('操作成功')
                            this.getTableList()
                        } else {
                            message.error(response.msg)
                        }
                    })
                }
            }
        })
        this.setState({
            tableData,
        })
    }
    onNameBlur = async (data, e) => {
        let query = {
            code: data.code,
            id: data.id,
            name: data.name,
            parentId: data.parentId,
            treeId: data.treeId,
        }
        let res = await checkNodeName(query)
        if (res.code == 200) {
            if (res.data) {
                message.info('名称重复')
                this.setState({
                    repeatName: true,
                })
            } else {
                this.setState({
                    repeatName: false,
                })
            }
        }
    }
    onCodeBlur = async (data, e) => {
        let query = {
            code: data.code,
            id: data.id,
            name: data.name,
            parentId: data.parentId,
            treeId: data.treeId,
        }
        let res = await checkNodeCode(query)
        if (res.code == 200) {
            if (res.data) {
                message.info('英文名重复')
                this.setState({
                    repeatCode: true,
                })
            } else {
                this.setState({
                    repeatCode: false,
                })
            }
        }
    }
    saveData = async (data, index) => {
        let { tableData, inputVisible, repeatCode, repeatName } = this.state
        if (!data.name || !data.code) {
            message.info('名称或英文名不能为空')
            return
        }
        if (repeatCode || repeatName) {
            message.info('名称或英文名重复，请检查')
            return
        }
        let res = {}
        this.setState({ loading: true })
        if (data.isNew == true) {
            res = await addTreeNode(data)
        } else {
            res = await updateTreeNode(data)
        }
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success(res.msg ? res.msg : '操作成功')
            this.getTableList()
        }
    }
    cancelData = (data, index) => {
        let { tableData, subTableData } = this.state
        console.log(data, subTableData)
        if (data.isNew == true) {
            if (data.level == 1) {
                tableData.splice(index, 1)
            } else {
                let i = data.index
                tableData[i].children.splice(index, 1)
            }
        } else {
            if (data.level == 1) {
                tableData[index].name = subTableData.name
                tableData[index].code = subTableData.code
                tableData[index].description = subTableData.description
                tableData[index].isEdit = false
            } else {
                let i = data.index
                tableData[i].children[index].name = subTableData.name
                tableData[i].children[index].code = subTableData.code
                tableData[i].children[index].description = subTableData.description
                tableData[i].children[index].isEdit = false
            }
        }
        this.setState({
            tableData,
            inputVisible: false,
        })
    }
    onChangeName = (data, index, name, e) => {
        let { tableData } = this.state
        if (data.level == 1) {
            tableData[index][name] = e.target.value
        } else {
            let i = data.index
            tableData[i].children[index][name] = e.target.value
        }
        this.setState({
            tableData,
        })
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            keyword: queryInfo.keyword,
            code: 'ZT005',
        }
        this.setState({ loading: true, tableKey: '0' })
        let res = await getTree(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data.children,
                treeId: res.data.id,
                inputVisible: false,
                tableKey: '1',
            })
        }
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        this.getTableList()
    }
    expandedRowRender = (record, index) => {
        record.children.map((item) => {
            item.index = index
        })
    }
    customExpandIcon = (props) => {
        if (props.record.children.length > 0) {
            if (props.expanded) {
                return (
                    <a
                        style={{ color: '#5E6266' }}
                        onClick={(e) => {
                            props.onExpand(props.record, e)
                        }}
                    >
                        <CaretDownOutlined style={{ fontSize: 12 }} />
                    </a>
                )
            } else {
                return (
                    <a
                        style={{ color: '#5E6266' }}
                        onClick={(e) => {
                            props.onExpand(props.record, e)
                        }}
                    >
                        <CaretRightOutlined style={{ fontSize: 12 }} />
                    </a>
                )
            }
        } else {
            return null
        }
    }
    toggle = (value) => {
        let { expandedRowKeys, tableData } = this.state
        if (value == 1) {
            expandedRowKeys = []
            tableData.map((item) => {
                expandedRowKeys.push(item.id)
            })
            console.log(expandedRowKeys, 'expandedRowKeys')
            this.setState({
                expandedRowKeys,
            })
        } else {
            this.setState({
                expandedRowKeys: [],
            })
        }
    }
    onExpandedRowsChange = (expandRows) => {
        this.setState({
            expandedRowKeys: expandRows,
        })
    }
    render() {
        const { queryInfo, tableData, loading, tableKey, addInfo, expandedRowKeys } = this.state
        return (
            <React.Fragment>
                <div className='reportCategory'>
                    <TableLayout
                        title='报表分类'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.addData}>
                                    定义报表分类
                                </Button>
                            )
                        }}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入报表分类名称' />
                                    {expandedRowKeys.length ? (
                                        <span onClick={this.toggle.bind(this, '0')} className='iconfont icon-shouqi3'></span>
                                    ) : (
                                        <span onClick={this.toggle.bind(this, '1')} className='iconfont icon-zhankai3'></span>
                                    )}
                                    <Table
                                        className='expandTable'
                                        rowKey='id'
                                        key={tableKey}
                                        expandedRowKeys={expandedRowKeys}
                                        onExpandedRowsChange={this.onExpandedRowsChange}
                                        // defaultExpandAllRows={true}
                                        loading={loading}
                                        columns={this.columns}
                                        dataSource={tableData}
                                        expandedRowRender={this.expandedRowRender}
                                        expandIcon={(props) => this.customExpandIcon(props)}
                                        pagination={false}
                                    />
                                </React.Fragment>
                            )
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}
