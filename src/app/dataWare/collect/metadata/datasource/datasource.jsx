import AutoTip from '@/component/AutoTip'
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { SettingOutlined } from '@ant-design/icons'
import { Button, Modal, Select, Tooltip } from 'antd'
import { datasourceDefine, dsMap } from 'app_api/metadataApi'
import UserService from 'app_page/services/user/userService'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import _ from 'underscore'

// import { GeneralTable } from 'app_component'
import store from './store'
const Option = Select.Option

const confirm = Modal.confirm

const collectMethodMap = {
    1: '采集任务',
    2: '模板采集',
}

@observer
export default class DataSourceManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            dataSourceTypeMap: [],
        }

        this.columns = [
            {
                dataIndex: 'dsName',
                key: 'dsName',
                title: '数据源中文名',
                width: 180,
                fixed: 'left',
                render: (text, record) => <AutoTip content={text} />,
            },
            {
                dataIndex: 'identifier',
                key: 'identifier',
                title: '数据源英文名',
                width: 180,
                render: (text, record) => <AutoTip content={text} />,
            },
            {
                dataIndex: 'contextPath',
                key: 'contextPath',
                title: '路径',
                width: 160,
                render: (text, record) => <AutoTip content={text} />,
            },
            {
                dataIndex: 'product',
                key: 'product',
                title: '数据源类型',
                width: 120,
                render: (text, record) => {
                    if (text) {
                        return <AutoTip content={text} />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'validState',
                key: 'validState',
                title: ' 状态',
                width: 120,
                render: (text, record) => {
                    if (text == 0) {
                        return <StatusLabel type='error' message='未生效' />
                    } else {
                        return <StatusLabel type='success' message='生效' />
                    }
                },
            },
            {
                dataIndex: 'techniqueManager',
                key: 'techniqueManager',
                title: '数据库负责人',
                width: 120,
                render: (text, record) => {
                    if (text) {
                        return <AutoTip content={text} />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'collectTime',
                key: 'collectTime',
                title: '采集任务数',
                width: 120,
                render: (text, record) => {
                    if (record.collectMethod == 1) {
                        return (
                            <span style={{ color: '#1890ff' }}>
                                {record.taskTypeCount ? <a onClick={this.addAutoCollection.bind(this, record)}>{record.taskTypeCount}</a> : <span style={{ color: '#333' }}>未设置</span>}
                                {record.validState == 0 ? null : (
                                    <Tooltip title='设置'>
                                        <PermissionWrap funcCode='/sys/collect/task/manage/edit' systemCode={record.id}>
                                            <a onClick={this.addTask.bind(this, record)} style={{ float: 'right', cursor: 'pointer' }}>
                                                <SettingOutlined />
                                            </a>
                                        </PermissionWrap>
                                    </Tooltip>
                                )}
                            </span>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'datasourceConnectionModifyUserName',
                key: 'datasourceConnectionModifyUserName',
                title: '修改人',
                width: 150,
                render: (text, record) => {
                    if (text) {
                        return <Tooltip title={text}>{text}</Tooltip>
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'datasourceConnectionModifiedDate',
                key: 'datasourceConnectionModifiedDate',
                title: '修改时间',
                width: 120,
                render: (text, record) => {
                    if (text) {
                        return <Tooltip title={text}>{text}</Tooltip>
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
        ]

        this.type = ''

        this.filter = {
            addBtnOption: {
                show: true,
                text: '新建数据源',
                authId: 'metadata:datasource:create',
                clickFunction: this.onAdd,
            },
        }
        this.selectedRows = [] // 表格里选择的项
        this.showQuickJumper = true // 是否显示跳转到多少页
        this.pageSizeOptions = ['10', '20', '30', '40', '50'] // 每页多少条数据的下拉框
    }

    componentDidMount() {
        this.initData()
    }
    getShortName = (value) => {
        if (value) {
            if (value.length > 10) {
                return value.substr(0, 10) + '…'
            } else {
                return value
            }
        } else {
            return ''
        }
    }

    getDatasourceTypeList = async () => {
        let { dataSourceTypeMap } = this.state
        let res = await datasourceDefine()
        if (res.code == 200) {
            dataSourceTypeMap = []
            let hasRepeat = false
            res.data.map((item) => {
                item.appDatasourceDefineConfigList.map((config) => {
                    hasRepeat = false
                    if (dataSourceTypeMap.length) {
                        dataSourceTypeMap.map((node) => {
                            if (node.dbName == config.dbName) {
                                hasRepeat = true
                            }
                        })
                        if (!hasRepeat) {
                            dataSourceTypeMap.push(config)
                        }
                    } else {
                        dataSourceTypeMap.push(config)
                    }
                })
            })
            this.setState({
                dataSourceTypeMap,
            })
        }
    }

    initData = () => {
        // this.currentTable.resetOrderNumber()
        // this.currentTable.setTableLoading()
        store.resetCondition()
        store.getDataSourceData()
        this.getUserList()
        this.getDatasourceTypeList()
    }
    // 打开自动采集页
    addAutoCollection = (data) => {
        this.props.addTab('autoTask', { datasourceId: data.id, from: 'dataSourceManage' })
    }

    //打开任务页
    addTask = (data) => {
        if (data.taskTypeCount) {
            this.props.addTab('编辑采集任务', { datasourceId: data.id, datasourceName: data.dsName, pageType: 'edit', from: 'dataSourceManage' })
        } else {
            this.props.addTab('编辑采集任务', { datasourceId: data.id, datasourceName: data.dsName, pageType: 'add', from: 'dataSourceManage' })
        }
    }

    getUserList = async () => {
        let userList = await UserService.getUserIdNameList()
        this.setState({
            userList,
        })
    }

    collectUserChange = async (value) => {
        store.techniqueManagerId = value
        await this.setState(
            {
                collectUser: value,
            },
            () => {
                store.search()
            }
        )
    }

    onAdd = () => {
        this.props.addTab('编辑数据源', { type: 'add' })
    }

    // wetherCheck 是否检查选择了一项 点击名称的时候不需要
    onEdit = (type, record, data) => {
        console.log('record', record)
        if (record) {
            //record.extra = JSON.stringify(record.extra);
            this.props.addTab('数据源详情', { ...record, type: 'look' }, false)
        } else {
            if (type === 'edit') {
                dsMap({id: data.id}).then(res => {
                    if (res.code == 200) {
                        data.isDsMap = res.data
                        this.props.addTab('编辑数据源', { ...data, type: 'edit' })
                    }
                })
            } else {
                this.props.addTab('数据源详情', { ...data, type: 'look' })
            }
        }
    }

    cancleDataBase = (data) => {
        return store.cancleDataBase(data.id)
    }

    rowSelection = (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows
    }

    resetCondition = () => {
        this.setState({
            collectUser: undefined,
        })
        store.resetCondition()
    }

    render() {
        const { tableData, sourceTableInputValue, sourceTableSelectValue, collectMethod, tablePagination, sourceData } = store
        const { userList, collectUser, dataSourceTypeMap } = this.state
        return (
            <RichTableLayout
                enableDrag
                title='数据源管理'
                renderHeaderExtra={() => {
                    return (
                        <PermissionWrap funcCode='/sys/manage/createDs' onClick={this.onAdd}>
                            <Button type='primary'>新建数据源</Button>
                        </PermissionWrap>
                    )
                }}
                renderSearch={(controller) => {
                    store.controller = controller
                    return (
                        <React.Fragment>
                            <Select
                                allowClear
                                showSearch={true}
                                className='datasourceSelect'
                                value={sourceTableInputValue}
                                onChange={store.conditionChange}
                                optionFilterProp='title'
                                placeholder='数据源名称'
                            >
                                {sourceData.map((d) => (
                                    <Option title={d.dsName + d.identifier} key={d.id} value={d.id}>
                                        <Tooltip placement='right' title={d.dsName}>
                                            {d.dsName}
                                        </Tooltip>
                                    </Option>
                                ))}
                            </Select>
                            <Select onChange={store.conditionSelectChange} allowClear value={sourceTableSelectValue} className='datasourceSelect' placeholder='数据源类型'>
                                {dataSourceTypeMap.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.dbViewName}>
                                            {item.dbName}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Select onChange={store.collectMethodChange} allowClear value={collectMethod} className='datasourceSelect' placeholder='采集方式'>
                                {_.map(collectMethodMap, (node, index) => {
                                    return (
                                        <Option key={index} value={index}>
                                            {node}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Select onChange={this.collectUserChange} allowClear value={collectUser} className='datasourceSelect' placeholder='数据库负责人'>
                                {userList &&
                                    userList.length > 0 &&
                                    userList.map((item, index) => {
                                        return <Option value={item.id}>{item.realname}</Option>
                                    })}
                            </Select>
                            <Button onClick={this.resetCondition}>重置</Button>
                        </React.Fragment>
                    )
                }}
                tableProps={{
                    columns: this.columns,
                    extraTableProps: {
                        scroll: {
                            x: 1400,
                        },
                    },
                }}
                requestListFunction={(page, pageSize) => {
                    return store.getDataSourceTableData({
                        page,
                        page_size: pageSize,
                    })
                }}
                deleteFunction={(_, rows) => {
                    return this.cancleDataBase(rows[0])
                }}
                editColumnProps={{
                    width: 160,
                    createEditColumnElements: (_, record, defaultElements) => {
                        const systemCode = record.id.toString()
                        return RichTableLayout.renderEditElements([
                            {
                                label: '详情',
                                funcCode: '/sys/manage/detail',
                                systemCode,
                                onClick: () => {
                                    this.onEdit('look', record)
                                },
                            },
                            {
                                label: '编辑',
                                funcCode: '/sys/manage/edit',
                                systemCode,
                                onClick: () => {
                                    this.onEdit('edit', false, record)
                                },
                            },
                        ]).concat(defaultElements)
                    },
                }}
                createDeletePermissionData={(record) => {
                    return {
                        funcCode: '/sys/manage/delete',
                        systemCode: record.id.toString(),
                    }
                }}
            />
        )
    }
}
