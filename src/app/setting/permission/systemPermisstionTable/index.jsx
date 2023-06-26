import React, { Component } from 'react'
import { Button, Checkbox, message, Table, Tooltip } from 'antd'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { getUserSystemAuth, getResource, setResourceAuth } from '@/api/systemApi'

import _ from 'lodash'
import './index.less'
import Item from '@/components/select/tableSelect/cps/item'
import EmptyLabel from '@/component/EmptyLabel'

export default class SystemPermisstionTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newKey: 1,
            expandedRowKeys: [],
            currentRecord: {},
            dataSource: [],
            dataSourceCopy: [],
            resourceData: {},
        }

        this.columns = [
            {
                dataIndex: 'authName',
                render: (text, record) => {
                    const icon = record.hasOwnProperty('systemId') ? <img style={{ width: 16, height: 16, marginTop: -4 }} src={record.systemIcon} /> : <IconFont type='icon-xitong' />

                    return (
                        <span>
                            <span style={{ marginRight: 8 }}>{icon}</span>

                            {text || <EmptyLabel />}
                        </span>
                    )
                },
            },
            {
                dataIndex: 'edit',
                key: 'edit',
                render: (_, record, index) => {
                    const { authRwType } = record
                    if (record.hasOwnProperty('authRwType')) {
                        return (
                            <Checkbox
                                onChange={(event) => {
                                    const { checked } = event.target
                                    if (checked) {
                                        this.selectColumn('edit', record.authID)
                                    } else {
                                        this.unSelectColumn('edit', record.authID)
                                    }
                                }}
                                checked={authRwType === 2}
                            >
                                连接采集管理
                            </Checkbox>
                        )
                    }
                },
            },
            {
                render: (_, record, index) => {
                    const { authRwType } = record
                    if (record.hasOwnProperty('authRwType')) {
                        return (
                            <Checkbox
                                onChange={(event) => {
                                    const { checked } = event.target
                                    if (checked) {
                                        this.selectColumn('view', record.authID)
                                    } else {
                                        this.unSelectColumn('view', record.authID)
                                    }
                                }}
                                checked={[1, 2].indexOf(authRwType) > -1}
                            >
                                访问
                            </Checkbox>
                        )
                    }
                },
            },
        ]
    }

    componentWillReceiveProps = (nextProps) => {
        const { currentRecord, type } = nextProps
        if (!currentRecord.id) return
        this.setState({ currentRecord: currentRecord }, () => {
            this.getUserSystemAuth()
        })
    }

    componentDidMount = async () => {
        const { currentRecord } = this.props
        if (!currentRecord.id) return
        await this.setState({ currentRecord: currentRecord }, () => {
            this.getUserSystemAuth()
        })
        const res = await getResource()
        if (res.data.resourceList) {
            this.setState({ resourceData: res.data.resourceList.find((target) => target.resourceId === 1) })
        }
    }

    getUserSystemAuth = async () => {
        const { id } = this.state.currentRecord
        const res = await getUserSystemAuth({ id })
        if (res.code !== 200) {
            return
        }

        const { data } = res
        let authID = 1
        const newData = data.map((system) => {
            system.authName = system.systemName
            system.authID = authID
            authID++
            system.children = system.dsList.map((ds) => {
                ds.authRwType = ds.authRwType === null ? 3 : ds.authRwType
                ds.authName = ds.datasourceName
                ds.authID = authID
                authID++
                return ds
            })
            return system
        })
        this.setState(
            {
                dataSource: newData,
                dataSourceCopy: newData,
            },
            () => {
                this.setState({
                    expandedRowKeys: this.getIds(this.state.dataSource, 'authID', []),
                })
            }
        )
    }

    selectColumn = (type, id) => {
        const arr = _.cloneDeep(this.state.dataSource)
        const element = this.findElement(arr, id)
        element.authRwType = type === 'view' ? 1 : 2
        this.setState({ dataSource: arr })
    }
    findElement = (arr, id) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            if (element.authID === id) {
                return element
            } else if (element.children && element.children.length > 0) {
                const target = this.findElement(element.children, id)
                if (target) {
                    return target
                }
            }
        }
    }
    unSelectColumn = (type, id) => {
        const arr = _.cloneDeep(this.state.dataSource)
        const element = this.findElement(arr, id)
        element.authRwType = type === 'view' ? 3 : 3
        this.setState({ dataSource: arr })
    }
    getIds = (arr, rowKey, ids) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            ids.push(element[rowKey])
            if (element.children && element.children.length > 0) {
                this.getIds(element.children, rowKey, ids)
            }
        }
        return ids
    }

    componentDidMount() {}

    onExpand = (expanded, record) => {
        //expanded是否展开  record每一项的值
        let { expandedRowKeys } = this.state
        if (expanded) {
            let arr = expandedRowKeys
            arr.push(record.authID)
            this.setState({
                expandedRowKeys: arr,
            })
        } else {
            let arr2 = []
            if (expandedRowKeys.length > 0 && record.authID) {
                arr2 = expandedRowKeys.filter((key) => {
                    return key !== record.authID
                })
            }
            this.setState({
                expandedRowKeys: arr2,
            })
        }
    }

    submit = async () => {
        const { dataSource, resourceData } = this.state
        const { id } = this.state.currentRecord
        const arr = []
        dataSource.forEach((source) => {
            source.children.forEach((item) => {
                const obj = { ...item, ...resourceData }
                obj.entityId = id
                obj.entityType = 1
                obj.appId = 1
                obj.resourceValue = item.datasourceId
                arr.push(obj)
            })
        })
        const res = await setResourceAuth({ entityResourceAuthList: arr })
        if (res.code === 200) {
            this.getUserSystemAuth()
            message.success('更新成功')
        }
    }

    render() {
        const { dataSource, dataSourceCopy, newKey, expandedRowKeys } = this.state

        console.log('dataSource', dataSource)
        return (
            <div className='permisstionTable'>
                <Table
                    rowKey='authID'
                    key={newKey}
                    defaultExpandAllRows={true}
                    columns={this.columns}
                    dataSource={dataSource}
                    indentSize={20}
                    expandIcon={({ expanded, onExpand, record }) => {
                        if (record.children && record.children.length != 0) {
                            if (expanded) {
                                return <IconFont className='icon-arrow' useCss type='e66c' onClick={(e) => onExpand(record, e)} />
                            } else {
                                return <IconFont className='icon-arrow' useCss type='e66e' onClick={(e) => onExpand(record, e)} />
                            }
                        }
                    }}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={this.onExpand}
                    showHeader={false}
                    pagination={false}
                />
                {!ProjectUtil.equalArrayDeep(dataSource, dataSourceCopy) && (
                    <div style={{ marginTop: 12 }}>
                        <Button type='primary' onClick={this.submit}>
                            更新权限
                        </Button>

                        <Button onClick={() => this.setState({ dataSource: dataSourceCopy })} style={{ marginTop: 12, marginLeft: 8 }}>
                            撤销修改
                        </Button>
                    </div>
                )}
            </div>
        )
    }
}
