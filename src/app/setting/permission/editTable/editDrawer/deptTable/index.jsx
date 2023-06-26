import { setResourceAuth } from '@/api/systemApi'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Checkbox, message, Table } from 'antd'
import _ from 'lodash'
import React, { Component } from 'react'
import './index.less'

export default class DeptTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRecord: {},
            dataSource: [],
            dataSourceCopy: [],
        }

        this.authID = 1

        this.columns = [
            {
                title: this.renderDepartColumnTitle,
                dataIndex: 'authName',
                render: (text, record) => {
                    return <span>{text || '~'}</span>
                },
            },
        ]

        if (!props.hideEdit) {
            this.columns = this.columns.concat([
                {
                    title: '连接管理',
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
                                ></Checkbox>
                            )
                        }
                    },
                },
            ])
        }
        this.columns = this.columns.concat([
            {
                title: '查看',
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
                            ></Checkbox>
                        )
                    }
                },
            },
        ])
    }

    renderDepartColumnTitle = () => {
        const { expandedRowKeys } = this.state
        const expanded = expandedRowKeys && expandedRowKeys.length
        return (
            <span className='HControlGroup'>
                <IconFont type={expanded ? 'icon-shouqi3' : 'icon-zhankai3'} onClick={() => this.switchExpandRow()} />
                <span>部门</span>
            </span>
        )
    }

    switchExpandRow() {
        const { expandedRowKeys, dataSource } = this.state
        const expanded = expandedRowKeys && expandedRowKeys.length
        const newKeys = expanded ? [] : this.getIds(dataSource, 'authID', [])
        this.setState({ expandedRowKeys: newKeys })
    }

    componentDidMount = async () => {
        const { currentRecord, dataSourceList } = this.props
        await this.setState({ currentRecord, dataSourceList }, () => {
            this.getUserTaskAuth()
        })
    }

    getUserTaskAuth = async () => {
        const { dataSourceList } = this.state
        this.filterDataList(dataSourceList)
        console.log('dataSourceList', dataSourceList)
        this.setState(
            {
                dataSource: dataSourceList,
                dataSourceCopy: dataSourceList,
            },
            () => {
                this.setState({
                    expandedRowKeys: this.getIds(this.state.dataSource, 'authID', []),
                })
            }
        )
    }

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

    selectColumn = (type, id) => {
        const arr = _.cloneDeep(this.state.dataSource)
        const element = this.findElement(arr, id)
        element.authRwType = type === 'view' ? 1 : 2
        this.setState({ dataSource: arr })
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

    filterDataList = (arr) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            element.authName = element.deptName
            element.authRwType = element.authRwType === null ? 3 : element.authRwType
            element.authID = this.authID
            element.children = element.childDeptResourceAuths
            this.authID++
            if (element.children.length === 0) {
                continue
            } else {
                this.filterDataList(element.children)
            }
        }
    }

    requestDataFilter = (arr, res) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            const obj = { ...element, ...this.props.resourceData }
            obj.entityId = element.deptId
            obj.entityType = 3
            obj.appId = 1
            obj.resourceValue = this.state.currentRecord.id.toString()
            delete obj.childDeptResourceAuths
            delete obj.children
            res.push(obj)
            if (element.children.length === 0) {
                continue
            } else {
                this.requestDataFilter(element.children, res)
            }
        }
    }

    submit = async () => {
        const { dataSource, currentRecord } = this.state
        const { id } = currentRecord
        const arr = []
        this.requestDataFilter(dataSource, arr)
        this.setState({ loading: true })
        const res = await setResourceAuth({ entityResourceAuthList: arr })
        this.setState({ loading: false })
        if (res.code === 200) {
            this.props.reFresh()
            message.success('更新成功')
        } else {
            message.error(res.msg || '获取权限错误')
        }
    }

    render() {
        const { dataSource, dataSourceCopy, expandedRowKeys, loading, defaultExpandAll } = this.state
        return (
            <div className='permisstionTable'>
                <Table
                    rowKey='authID'
                    columns={this.columns}
                    dataSource={dataSource}
                    expandIcon={({ expanded, onExpand, record }) => {
                        if (record.children && record.children.length != 0) {
                            if (expanded) {
                                return <IconFont className='icon-arrow' type='icon-arrow_down' onClick={(e) => onExpand(record, e)} />
                            } else {
                                return <IconFont className='icon-arrow' type='icon-arrow_right' onClick={(e) => onExpand(record, e)} />
                            }
                        }
                    }}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={this.onExpand}
                    pagination={false}
                />
                {!ProjectUtil.equalArrayDeep(dataSource, dataSourceCopy) && (
                    <div style={{ marginTop: 12 }}>
                        <Button type='primary' disabled={loading} onClick={this.submit}>
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
